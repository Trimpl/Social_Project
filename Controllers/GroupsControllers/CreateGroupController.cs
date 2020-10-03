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
    public class CreateGroupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<CreateGroupController> _logger;
        public CreateGroupController(ILogger<CreateGroupController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        public class BodyModel
        {
            public string avatarLink { get; set; }
            public string name { get; set; }
            public string description { get; set; }
        }
        [HttpPost]
        [Authorize]
        [Route("api/createGroup")]
        public async Task<IActionResult> OnCreateGroupPostAsync([FromBody] BodyModel model)
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            try
            {
                Group group = new Group
                {
                    Id = Guid.NewGuid().ToString(),
                    userId = id,
                    avatarLink = model.avatarLink,
                    description = model.description,
                    name = model.name
                };
                GroupUser groupUser = new GroupUser
                {
                    Id = Guid.NewGuid().ToString(),
                    userId = id,
                    groupId = group.Id,
                    isAdmin = true
                };
                await _context.Groups.AddAsync(group);
                await _context.Subscribers.AddAsync(groupUser);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
