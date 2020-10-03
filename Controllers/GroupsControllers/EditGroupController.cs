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
    public class EditGroupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<EditGroupController> _logger;
        public EditGroupController(ILogger<EditGroupController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        public class BodyModel
        {
            public string id { get; set; }
            public string avatarLink { get; set; }
            public string name { get; set; }
            public string description { get; set; }
        }
        [HttpPost]
        [Authorize]
        [Route("api/editMainInfoGroup")]
        public async Task<IActionResult> OnEditMainInfoGroupPostAsync([FromBody] BodyModel model)
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            Group group = _context.Groups.Find(model.id);
            if (id != group.userId) return BadRequest("401");
            try
            {
                group.avatarLink = model.avatarLink;
                group.name = model.name;
                group.description = model.description;
                _context.Groups.Update(group);
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
