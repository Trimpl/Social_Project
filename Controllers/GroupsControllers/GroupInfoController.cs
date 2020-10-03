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
    public class GroupInfoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<GroupInfoController> _logger;
        public GroupInfoController(ILogger<GroupInfoController> logger,
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
            public string userId { get; set; }
        }
        public class ResponseModel
        {
            public Group group { get; set; }
            public bool isAuthor { get; set; }
            public bool isAdmin { get; set; }
        }
        [HttpGet]
        [Route("api/groupInfo")]
        [Authorize]
        public async Task<IActionResult> OnGetGroupInfoAsync(string id)
        {
            try
            {
                Group group = await _context.Groups.FindAsync(id);
                string userId = HttpContext.User.Claims.ToArray()[5].Value;
                ResponseModel response = new ResponseModel
                {
                    group = group,
                    isAuthor = false,
                    isAdmin = false
                };
                var a = _context.Subscribers.FirstOrDefault(x => x.groupId == group.Id && x.userId == userId);
                if (a != null)
                {
                    if (a.isAdmin == true)
                    {
                        response.isAdmin = true;
                        if (userId == _context.Groups.Find(id).userId)
                        {
                            response.isAuthor = true;
                            return Ok(response);
                        }
                        return Ok(response);
                    }
                }
                return Ok(response);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
