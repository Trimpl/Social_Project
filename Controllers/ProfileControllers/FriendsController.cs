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

namespace WebApplication1.Controllers.ProfileControllers
{
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ProfileController> _logger;
        public FriendsController(ILogger<ProfileController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        [HttpGet]
        [Authorize]
        [Route("api/[controller]")]
        public async Task<IActionResult> OnGetFriendsAsync()
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            Friends Friends = await _context.Friends.FindAsync(id);
            List<string> FriendsIds = JsonConvert.DeserializeObject<List<string>>(Friends.FriendsIds);
            if (FriendsIds.Count() != 0)
            {
                List<string> list = FriendsIds;
                List<UserInfo> userList = new List<UserInfo>();
                foreach (string userId in list)
                {
                    var user = await _context.UserInfo.FindAsync(userId);
                    userList.Add(user);
                }
                return Ok(userList);
            }
            return BadRequest();
        }
        [HttpGet]
        [Route("api/getFriends")]
        public async Task<IActionResult> OnGetListOfFriendsAsync(string id)
        {
            Friends Friends = await _context.Friends.FindAsync(id);
            List<string> FriendsIds = JsonConvert.DeserializeObject<List<string>>(Friends.FriendsIds);
            if (FriendsIds.Count() != 0)
            {
                List<string> list = FriendsIds;
                List<UserInfo> userList = new List<UserInfo>();
                int a = 0;
                foreach (string userId in list)
                {
                    if (a == 8) break;
                    var user = await _context.UserInfo.FindAsync(userId);
                    userList.Add(user);
                    a++;
                }
                // Random random = new Random();
                // for (int i = 0; i < 8; i++)
                // {
                //     int j = random.Next(i + 1);
                //     if (j != i) userList[i] = userList[j];
                //     userList[j] = generate(i);
                // }
                int n = userList.Count;
                Random random = new Random();
                while (n > 1)
                {
                    n--;
                    int k = random.Next(n + 1);
                    UserInfo value = userList[k];
                    userList[k] = userList[n];
                    userList[n] = value;
                }
                return Ok(userList);
            }
            return BadRequest();
        }
        [HttpGet]
        [Authorize]
        [Route("api/[controller]/notFriends")]
        public async Task<IActionResult> OnGetNotFriendsAsync()
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            Friends Friends = await _context.Friends.FindAsync(id);
            if (JsonConvert.DeserializeObject<List<string>>(Friends.FriendsIds).Count() != 0)
            {
                List<string> list = JsonConvert.DeserializeObject<List<string>>(Friends.FriendsIds);
                List<UserInfo> userList = new List<UserInfo>();
                List<string> userIds = _context.UserInfo.Select(x => x.Id).Where(x => x != id).ToList();
                foreach (string userId in userIds)
                {
                    if (!list.Contains(userId))
                    {
                        userList.Add(_context.UserInfo.Find(userId));
                    }
                }
                return Ok(userList);
            }
            var b = _context.UserInfo.Where(x => x.Id != id).ToList();
            return Ok(b);
        }
        [HttpPost]
        [Authorize]
        [Route("api/[controller]/addDeleteFriend")]
        public async Task<IActionResult> OnAddDeleteFriendAsync(string friendId)
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            Friends Friends = await _context.Friends.FindAsync(id);
            if (Friends.FriendsIds.Contains(friendId))
            {
                List<string> list = JsonConvert.DeserializeObject<List<string>>(Friends.FriendsIds);
                list.Remove(friendId);
                Friends.FriendsIds = JsonConvert.SerializeObject(list);
                _context.Friends.Update(Friends);
            }
            else
            {
                List<string> list = JsonConvert.DeserializeObject<List<string>>(Friends.FriendsIds);
                list.Add(friendId);
                Friends.FriendsIds = JsonConvert.SerializeObject(list);
                _context.Friends.Update(Friends);
            }
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}