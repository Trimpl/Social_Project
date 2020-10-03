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
    public class GetListOfGroupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<GetListOfGroupsController> _logger;
        public GetListOfGroupsController(ILogger<GetListOfGroupsController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        public class ResponseModel
        {
            public List<Group> ListOfSubGroups { get; set; }
            public List<Group> ListOfNotSubGroups { get; set; }
        }
        [HttpGet]
        [Authorize]
        [Route("api/getListOfSubGroups")]
        public async Task<IActionResult> OnGetListOfSubGroupsAsync()
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            try
            {
                var a = _context.Subscribers.Where(x => x.userId == id).Select(x => x.groupId).ToList();
                var aa = _context.Groups.Where(x => a.Contains(x.Id)).ToList();
                var bb = _context.Groups.Where(x => !a.Contains(x.Id)).ToList();
                ResponseModel response = new ResponseModel 
                {
                    ListOfSubGroups = aa,
                    ListOfNotSubGroups = bb
                };
                return Ok(response);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
