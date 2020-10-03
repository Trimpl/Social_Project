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
    public class GroupAdminsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<GroupAdminsController> _logger;
        public GroupAdminsController(ILogger<GroupAdminsController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        public class BodyModel
        {
            public string groupId { get; set; }
            public string userId { get; set; }
        }
        [HttpPost]
        [Authorize]
        [Route("api/ChangeGroupAdmin")]
        public async Task<IActionResult> OnAddAdminPostAsync([FromBody] BodyModel model)
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            if (id != _context.Groups.Find(model.groupId).userId)
            {
                return BadRequest("401");
            }
            try
            {
                GroupUser user = _context.Subscribers.First(x => x.groupId == model.groupId && x.userId == model.userId);
                if (user.isAdmin) 
                {
                    user.isAdmin = false;
                }
                else 
                {
                    user.isAdmin = true;
                }
                _context.Subscribers.Update(user);
                await _context.SaveChangesAsync();
                return Ok(user.isAdmin);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
