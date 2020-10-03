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

namespace WebApplication1.Controllers.PhotoAlbumControllers
{
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<NotificationController> _logger;
        public NotificationController(ILogger<NotificationController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        [HttpGet]
        [Authorize]
        [Route("api/getNotifications")]
        public async Task<IActionResult> OnGetNotificationsAsync()
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            try
            {
                var b = _context.Notifications.Where(x => x.userId == id).OrderBy(x => x.createDate).ToList();
                return Ok(b);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
