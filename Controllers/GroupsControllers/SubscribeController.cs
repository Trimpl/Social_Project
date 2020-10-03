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

namespace WebApplication1.Controllers.GroupsControllers
{
    [ApiController]
    public class SubscribeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<SubscribeController> _logger;
        public SubscribeController(ILogger<SubscribeController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        public class BodyModel
        {
            public string groupId {get;set;}
        }
        [HttpGet]
        [Route("api/subscribe")]
        [Authorize]
        public async Task<IActionResult> OnSubscribeAsync(string groupId)
        {
            try
            {
                string userId = HttpContext.User.Claims.ToArray()[5].Value;
                GroupUser user = _context.Subscribers.FirstOrDefault(x => x.userId == userId && x.groupId == groupId);
                if (user != null)
                {
                    _context.Subscribers.Remove(user);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    user = new GroupUser 
                    {
                        Id = Guid.NewGuid().ToString(),
                        userId = userId,
                        groupId = groupId,
                        isAdmin = false
                    };
                    await _context.Subscribers.AddAsync(user);
                    await _context.SaveChangesAsync();
                }
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet]
        [Route("api/isSubscribed")]
        [Authorize]
        public async Task<IActionResult> OnIsSubscribedAsync(string groupId)
        {
            try
            {
                string userId = HttpContext.User.Claims.ToArray()[5].Value;
                GroupUser user = _context.Subscribers.FirstOrDefault(x => x.userId == userId && x.groupId == groupId);
                if (user == null)
                {
                    return Ok(false);
                }
                else
                {
                    return Ok(true);
                }
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
