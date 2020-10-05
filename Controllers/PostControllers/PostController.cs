using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using WebApplication1.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using WebApplication1.PageModels;
using WebApplication1.Data;
using Newtonsoft.Json;

namespace WebApplication1.Controllers.PostControllers
{
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<PostController> _logger;
        public PostController(ILogger<PostController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        public class BodyModel
        {
            public string postText { get; set; }
            public string[] pictureLink { get; set; }
            public string groupId { get; set; }
        }

        [HttpGet]
        [Route("api/getViewPost")]
        [Authorize]
        public async Task<IActionResult> OnGetViewPostsAsync(string postId)
        {
            try
            {
                string id = HttpContext.User.Claims.ToArray()[5].Value;
                Post post = _context.Posts.FirstOrDefault(x => x.Id == postId);
                List<PostPicture> PostPictures = _context.Pictures.ToList();
                List<Picture> pictures = PostPictures.Where(x => x.postId == post.Id)
                    .Select(x => new Picture
                    {
                        Id = x.Id,
                        pictureLink = x.pictureLink
                    }).ToList();
                bool isLiked = false;
                var b = _context.Likes.Where(x => x.postId == post.Id);
                if (b != null)
                {
                    isLiked = b.Select(x => x.userId).Contains(id);
                }
                List<Comment> comments = _context.Comments.Where(x => x.postId == post.Id).OrderBy(x => x.createDate).ToList();
                List<CommentPost> postComments = new List<CommentPost>();
                foreach (Comment comment in comments)
                {
                    UserInfo userInfo = await _context.UserInfo.FindAsync(comment.userId);
                    comment.userId = $"{userInfo.FirstName} {userInfo.SecondName}";
                    postComments.Add(new CommentPost
                    {
                        Id = comment.Id,
                        postId = comment.postId,
                        text = comment.text,
                        userId = comment.userId,
                        createDate = comment.createDate,
                        avatar = userInfo.Avatar,
                        link = userInfo.Id
                    });
                }
                var user = await _userManager.FindByIdAsync(post.userId);
                string avatar;
                string name;
                string link;
                if (user == null)
                {
                    Group group = _context.Groups.Find(post.userId);
                    avatar = group.avatarLink;
                    name = group.name;
                    link = $"/Group/{group.Id}";
                }
                else
                {
                    UserInfo info = _context.UserInfo.Find(post.userId);
                    avatar = info.Avatar;
                    name = $"{info.FirstName} {info.SecondName}";
                    link = $"/Profile/{info.Id}";
                }
                Posts returnPost = new Posts
                {
                    Id = post.Id,
                    userId = name,
                    postText = post.postText,
                    createDate = post.createDate,
                    pictureLink = pictures,
                    likes = _context.Likes.Where(x => x.postId == post.Id).Count(),
                    isLiked = isLiked,
                    comments = postComments,
                    avatar = avatar,
                    link = link
                };
                return Ok(returnPost);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet]
        [Route("api/getPosts")]
        [Authorize]
        public async Task<IActionResult> OnGetAsync(string userId)
        {
            try
            {
                string id = HttpContext.User.Claims.ToArray()[5].Value;
                List<Post> posts = _context.Posts.Where(x => x.userId == userId).ToList();
                List<Posts> list = new List<Posts>();
                List<PostPicture> PostPictures = _context.Pictures.ToList();
                foreach (Post post in posts)
                {
                    List<Picture> pictures = PostPictures.Where(x => x.postId == post.Id)
                    .Select(x => new Picture
                    {
                        Id = x.Id,
                        pictureLink = x.pictureLink
                    }).ToList();
                    bool isLiked = false;
                    var b = _context.Likes.Where(x => x.postId == post.Id);
                    if (b != null)
                    {
                        isLiked = b.Select(x => x.userId).Contains(id);
                    }
                    List<Comment> comments = _context.Comments.Where(x => x.postId == post.Id).OrderBy(x => x.createDate).ToList();
                    List<CommentPost> postComments = new List<CommentPost>();
                    foreach (Comment comment in comments)
                    {
                        UserInfo userInfo = await _context.UserInfo.FindAsync(comment.userId);
                        comment.userId = $"{userInfo.FirstName} {userInfo.SecondName}";
                        postComments.Add(new CommentPost
                        {
                            Id = comment.Id,
                            postId = comment.postId,
                            text = comment.text,
                            userId = comment.userId,
                            createDate = comment.createDate,
                            avatar = userInfo.Avatar,
                            link = userInfo.Id
                        });
                    }
                    var user = await _userManager.FindByIdAsync(post.userId);
                    string avatar;
                    string name;
                    string link;
                    if (user == null)
                    {
                        Group group = _context.Groups.Find(post.userId);
                        avatar = group.avatarLink;
                        name = group.name;
                        link = $"/Group/{group.Id}";
                    }
                    else
                    {
                        UserInfo info = _context.UserInfo.Find(post.userId);
                        avatar = info.Avatar;
                        name = $"{info.FirstName} {info.SecondName}";
                        link = $"/Profile/{info.Id}";
                    }
                    list.Add(
                        new Posts
                        {
                            Id = post.Id,
                            userId = name,
                            postText = post.postText,
                            createDate = post.createDate,
                            pictureLink = pictures,
                            likes = _context.Likes.Where(x => x.postId == post.Id).Count(),
                            isLiked = isLiked,
                            comments = postComments,
                            avatar = avatar,
                            link = link
                        });
                }
                return Ok(list.OrderByDescending(x => x.createDate));
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet]
        [Route("api/getNewsPosts")]
        [Authorize]
        public async Task<IActionResult> OnGetNewsPostsAsync()
        {
            try
            {
                string id = HttpContext.User.Claims.ToArray()[5].Value;
                Friends Friends = await _context.Friends.FindAsync(id);
                List<string> listOfFriendsIds = new List<string>();
                if (JsonConvert.DeserializeObject<List<string>>(Friends.FriendsIds).Count() != 0)
                {
                    listOfFriendsIds = JsonConvert.DeserializeObject<List<string>>(Friends.FriendsIds);
                }
                List<string> groupsIds = _context.Subscribers.Where(x => x.userId == id).Select(x => x.groupId).ToList();
                List<Post> posts = _context.Posts.Where(x => listOfFriendsIds.Contains(x.userId) || groupsIds.Contains(x.userId)).ToList();
                List<Posts> list = new List<Posts>();
                List<PostPicture> PostPictures = _context.Pictures.ToList();
                foreach (Post post in posts)
                {
                    List<Picture> pictures = PostPictures.Where(x => x.postId == post.Id)
                    .Select(x => new Picture
                    {
                        Id = x.Id,
                        pictureLink = x.pictureLink
                    }).ToList();
                    bool isLiked = false;
                    var b = _context.Likes.Where(x => x.postId == post.Id);
                    if (b != null)
                    {
                        isLiked = b.Select(x => x.userId).Contains(id);
                    }
                    List<Comment> comments = _context.Comments.Where(x => x.postId == post.Id).OrderBy(x => x.createDate).ToList();
                    List<CommentPost> postComments = new List<CommentPost>();
                    foreach (Comment comment in comments)
                    {
                        UserInfo userInfo = await _context.UserInfo.FindAsync(comment.userId);
                        comment.userId = $"{userInfo.FirstName} {userInfo.SecondName}";
                        postComments.Add(new CommentPost
                        {
                            Id = comment.Id,
                            postId = comment.postId,
                            text = comment.text,
                            userId = comment.userId,
                            createDate = comment.createDate,
                            avatar = userInfo.Avatar,
                            link = userInfo.Id
                        });
                    }
                    var user = await _userManager.FindByIdAsync(post.userId);
                    string avatar;
                    string name;
                    string link;
                    if (user == null)
                    {
                        Group group = _context.Groups.Find(post.userId);
                        avatar = group.avatarLink;
                        name = group.name;
                        link = $"/Group/{group.Id}";
                    }
                    else
                    {
                        UserInfo info = _context.UserInfo.Find(post.userId);
                        avatar = info.Avatar;
                        name = $"{info.FirstName} {info.SecondName}";
                        link = $"/Profile/{info.Id}";
                    }
                    list.Add(
                        new Posts
                        {
                            Id = post.Id,
                            userId = name,
                            postText = post.postText,
                            createDate = post.createDate,
                            pictureLink = pictures,
                            likes = _context.Likes.Where(x => x.postId == post.Id).Count(),
                            isLiked = isLiked,
                            comments = postComments,
                            avatar = avatar,
                            link = link
                        });
                }
                return Ok(list.OrderByDescending(x => x.createDate));
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
