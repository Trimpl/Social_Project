using WebApplication1.Data;
using System.Linq;
using WebApplication1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace WebApplication1.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {

        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public class newMessage : Messages
        {
            public string avatar { get; set; }
            public string firstId { get; set; }
            public string secondId { get; set; }
            public string withWhomId { get; set; }
        }
        public class newComment : Comment
        {
            public string avatar { get; set; }
            public string link { get; set; }
        }
        public ChatHub(ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _context = context;
            _signInManager = signInManager;
            _userManager = userManager;
        }
        public async Task MESSAGE_RECEIVED_VIEW(newMessage message)
        {
            var a = await _context.Messages.FindAsync(message.id);
            a.isViewed = true;
            _context.Messages.Update(a);
            await _context.SaveChangesAsync();
        }
        public async Task SendMessage(string user, string message, string to)
        {
            if (message == "") return;
            ApplicationUser FirstUser = await _userManager.FindByEmailAsync(user);
            ApplicationUser SecondUser = await _userManager.FindByIdAsync(to);
            UserInfo firstUserInfo = await _context.UserInfo.FindAsync(FirstUser.Id);
            UserInfo secondUserInfo = await _context.UserInfo.FindAsync(SecondUser.Id);
            newMessage model = new newMessage
            {
                message = message,
                id = Guid.NewGuid().ToString(),
                firstUserId = FirstUser.Id,
                secondUserId = SecondUser.Id,
                createDate = DateTime.Now,
                avatar = firstUserInfo.Avatar,
                firstId = FirstUser.Id,
                secondId = SecondUser.Id,
                withWhomId = SecondUser.Id
            };
            // Добавляем диалог в таблицу бд
            if (_context.Dialogs.Where(x =>
                (x.firstUserId == FirstUser.Id &&
                x.secondUserId == to) ||
                (x.secondUserId == FirstUser.Id &&
                x.firstUserId == to)).ToList().Count() == 0)
                await _context.Dialogs.AddAsync(new Dialogs
                {
                    id = Guid.NewGuid().ToString(),
                    firstUserId = FirstUser.Id,
                    secondUserId = SecondUser.Id,
                });
            // ------------
            await _context.Messages.AddAsync(model);
            await _context.SaveChangesAsync();
            // Меняем айди на имена
            model.firstUserId = firstUserInfo.FirstName;
            model.secondUserId = firstUserInfo.SecondName;
            await Clients.Caller.SendAsync("ReceiveMessage", model);
            await Clients.User(to).SendAsync("ReceiveMessage", model);
        }
        public class LikePostModel
        {
            public string postId { get; set; }
            public int countsOfLikes { get; set; }
            public Boolean isLiked { get; set; }
            public string userId { get; set; }
        }
        public async Task SendLikes(string userId, string postId)
        {
            Like like = _context.Likes.FirstOrDefault(x => x.postId == postId && x.userId == userId);
            if (like == null)
            {
                await _context.Likes.AddAsync(new Like
                {
                    Id = Guid.NewGuid().ToString(),
                    userId = userId,
                    postId = postId
                });
            }
            else
            {
                _context.Likes.Remove(like);
            };
            await _context.SaveChangesAsync();
            LikePostModel model = new LikePostModel
            {
                postId = postId,
                countsOfLikes = _context.Likes.Where(x => x.postId == postId).Count(),
                isLiked = _context.Likes.Where(x => x.postId == postId).Select(x => x.userId).Contains(userId),
                userId = userId
            };
            string userWhoToSend = _context.Posts.FirstOrDefault(x => x.Id == postId).userId;
            var userWhoLiked = await _context.UserInfo.FindAsync(userId);
            if (model.isLiked && userWhoToSend != userWhoLiked.Id) await this.CreateNotification(userWhoToSend, "like", $"You have like from {userWhoLiked.FirstName} {userWhoLiked.SecondName}", userWhoLiked.Avatar, postId);
            await Clients.All.SendAsync("NewLike", model);
        }
        public async Task SendComment(string userId, string postId, string text)
        {
            if (text != "")
            {
                UserInfo user = _context.UserInfo.Find(userId);
                newComment comment = new newComment
                {
                    Id = Guid.NewGuid().ToString(),
                    userId = userId,
                    postId = postId,
                    text = text,
                    createDate = DateTime.Now,
                    avatar = user.Avatar,
                    link = userId
                };
                string userWhoToSend = _context.Posts.FirstOrDefault(x => x.Id == postId).userId;
                if (userWhoToSend != userId) await this.CreateNotification(userWhoToSend, "comment", $"You have new comment: {comment.text}", user.Avatar, postId);
                await _context.Comments.AddAsync(comment);
                await _context.SaveChangesAsync();
                comment.userId = $"{user.FirstName} {user.SecondName}";
                await Clients.All.SendAsync("NewComment", comment);
            }
        }
        public async Task GetNumberOfUnreadDialogs(string id)
        {
            var list = _context.Messages.Where(x =>
            x.isViewed == false && (x.secondUserId == id));
            List<string> messages = new List<string>();
            foreach (var item in list)
            {
                if (!messages.Contains(item.firstUserId)) messages.Add(item.firstUserId);
            }
            await Clients.Caller.SendAsync("GetNumberOfUnreadDialogs", messages.Count);

        }
        public async Task SendPost(string postText, string[] pictureLink, string id, string groupId)
        {
            string name = "";
            string avatar = "";
            string link;
            if (groupId != null && _context.Groups.FirstOrDefault(x => x.userId == id && x.Id == groupId) != null)
            {
                id = groupId;
                Group group = await _context.Groups.FindAsync(id);
                name = group.name;
                avatar = group.avatarLink;
                link = $"/Group/{group.Id}";
            }
            else
            {
                if (_context.Subscribers.FirstOrDefault(x => x.userId == id && x.groupId == groupId && x.isAdmin == true) != null)
                {
                    id = groupId;
                    Group group = await _context.Groups.FindAsync(id);
                    name = group.name;
                    avatar = group.avatarLink;
                    link = $"/Group/{group.Id}";
                }
                else
                {
                    UserInfo user = await _context.UserInfo.FindAsync(id);
                    name = $"{user.FirstName} {user.SecondName}";
                    avatar = user.Avatar;
                    link = $"/Profile/{user.Id}";
                }
            }
            try
            {
                if (postText == "") throw new Exception();
                Post newPost = new Post
                {
                    Id = Guid.NewGuid().ToString(),
                    userId = id,
                    postText = postText,
                    createDate = DateTime.Now
                };
                await _context.Posts.AddAsync(newPost);
                List<Picture> pictures = new List<Picture>();
                if (pictureLink.Count() != 0)
                {
                    foreach (var b in pictureLink)
                    {
                        PostPicture picture = new PostPicture
                        {
                            Id = Guid.NewGuid().ToString(),
                            userId = id,
                            postId = newPost.Id,
                            pictureLink = b,
                        };
                        pictures.Add(new Picture
                        {
                            Id = picture.Id,
                            pictureLink = picture.pictureLink
                        });
                        await _context.Pictures.AddAsync(picture);
                    }
                }
                await _context.SaveChangesAsync();
                Posts post = new Posts
                {
                    Id = newPost.Id,
                    userId = name,
                    postText = postText,
                    createDate = DateTime.Now,
                    pictureLink = pictures,
                    likes = 0,
                    avatar = avatar,
                    link = link,
                };
                await Clients.All.SendAsync("NewPost", post);
            }
            catch
            {
            }
        }
        public async Task CreateNotification(string userId, string method, string text, string image, string postId)
        {
            
            string link = "пока ничего";
            // switch(method)
            // {
            //     case "comment":
            //         link = 
            // }
            Notification notification = new Notification
            {
                id = Guid.NewGuid().ToString(),
                text = text,
                userId = userId,
                link = link,
                createDate = DateTime.Now,
                isViewed = false,
                image = image,
                postId = postId
            };
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
            await Clients.User(userId).SendAsync("RecieveNotification", notification);
        }
        public async Task RemoveNotifications(string[] ids)
        {
            foreach (string id in ids)
            {
                var notif = await _context.Notifications.FindAsync(id);
                _context.Notifications.Remove(notif);
            }
            await _context.SaveChangesAsync();
        }
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            //await Clients.All.SendAsync("Notify", $"{Context.ConnectionId} покинул чат");
            await base.OnDisconnectedAsync(exception);
        }
    }
}