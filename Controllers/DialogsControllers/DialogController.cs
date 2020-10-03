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

namespace WebApplication1.Controllers.DialogsControllers
{
    [ApiController]
    public class DialogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<DialogController> _logger;
        public DialogController(ILogger<DialogController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        public class UserDialog : UserInfo
        {
            public string message { get; set; }
            public DateTime createDate { get; set; }
            public int count { get; set; }
        }
        public class Dialog : Messages
        {
            public string avatar { get; set; }
            public string withWhomId { get; set; }
        }
        [HttpGet]
        [Authorize]
        [Route("api/[controller]")]
        public async Task<IActionResult> OnGetDialogMessagesAsync(string toUserId)
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            try
            {
                List<Messages> messages = _context.Messages
                .Where(x =>
                (x.firstUserId == id &&
                x.secondUserId == toUserId) ||
                (x.secondUserId == id &&
                x.firstUserId == toUserId))
                .OrderBy(x => x.createDate)
                .ToList();
                UserInfo FirstUserInfo = await _context.UserInfo.FindAsync(id);
                UserInfo SecondUserInfo = await _context.UserInfo.FindAsync(toUserId);
                List<Dialog> dialogs = new List<Dialog>();
                foreach (Messages message in messages)
                {
                    string avatar = "";
                    string first = "";
                    string second = "";
                    if (message.firstUserId == id)
                    {
                        first = FirstUserInfo.FirstName;
                        second = SecondUserInfo.FirstName;
                        avatar = FirstUserInfo.Avatar;
                    }
                    else
                    {
                        second = FirstUserInfo.FirstName;
                        first = SecondUserInfo.FirstName;
                        avatar = SecondUserInfo.Avatar;
                    };
                    Dialog dialog = new Dialog
                    {
                        id = message.id,
                        firstUserId = first,
                        secondUserId = second,
                        createDate = message.createDate,
                        message = message.message,
                        avatar = avatar,
                        isViewed = message.isViewed,
                        withWhomId = SecondUserInfo.Id
                    };
                    dialogs.Add(dialog);
                }
                List<Messages> updateMessages = _context.Messages
                .Where(x =>
                (x.firstUserId == id &&
                x.secondUserId == toUserId) ||
                (x.secondUserId == id &&
                x.firstUserId == toUserId))
                .OrderBy(x => x.createDate)
                .ToList();
                foreach(Messages message in updateMessages)
                {
                    if (message.isViewed == false && message.secondUserId == id)
                    {
                        message.isViewed = true;
                        _context.Messages.Update(message);
                        await _context.SaveChangesAsync();
                    }
                }
                return Ok(dialogs);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet]
        [Authorize]
        [Route("api/getDialogs")]
        public async Task<IActionResult> OnGetDialogsAsync()
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            try
            {
                var a = _context.Dialogs.Where(x => x.firstUserId == id).Select(x => x.secondUserId).ToList();
                var b = _context.Dialogs.Where(x => x.secondUserId == id).Select(x => x.firstUserId).ToList();
                a.AddRange(b);
                List<Messages> messages = _context.Messages
                .Where(x =>
                (x.firstUserId == id || x.secondUserId == id))
                .OrderByDescending(x => x.createDate)
                .ToList();
                List<UserInfo> userList = _context.UserInfo.Where(x => a.Contains(x.Id)).ToList();
                List<UserDialog> dialogs = new List<UserDialog>();
                foreach (var userId in a)
                {
                    var user = await _context.UserInfo.FindAsync(userId);
                    UserDialog dialog = new UserDialog();
                    Messages message = messages.FirstOrDefault(x =>
                    (x.firstUserId == id &&
                    x.secondUserId == userId) ||
                    (x.secondUserId == id &&
                    x.firstUserId == userId));
                    dialog.Avatar = user.Avatar;
                    dialog.Id = user.Id;
                    dialog.FirstName = user.FirstName;
                    dialog.SecondName = user.SecondName;
                    dialog.message = message.message;
                    dialog.createDate = message.createDate;
                    dialog.count = messages.Where(x => x.isViewed == false && (x.firstUserId == userId)).Count();
                    dialogs.Add(dialog);
                }
                var response = dialogs.OrderByDescending(x => x.createDate);
                return Ok(response);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}