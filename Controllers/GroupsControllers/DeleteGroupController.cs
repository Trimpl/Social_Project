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
    public class DeleteGroupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<DeleteGroupController> _logger;
        public DeleteGroupController(ILogger<DeleteGroupController> logger,
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
        }
        [HttpPost]
        [Authorize]
        [Route("api/deleteGroup")]
        public async Task<IActionResult> OnDeleteGroupPostAsync([FromBody] BodyModel model)
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            if (id != _context.Groups.Find(model.id).userId) return BadRequest("401");
            try
            {
                Group group = await _context.Groups.FindAsync(id);
                _context.Groups.Remove(group);
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
