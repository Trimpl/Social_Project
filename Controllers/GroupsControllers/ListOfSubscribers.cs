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
    public class ListOfSubscribers : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ListOfSubscribers> _logger;
        public ListOfSubscribers(ILogger<ListOfSubscribers> logger,
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
        }
        public class ResponseModel
        {
            public List<UserInfo> users { get; set; }
            public List<UserInfo> admins { get; set; }
        }

        [HttpGet]
        [Route("api/getListOfSubscribers")]
        public async Task<IActionResult> OnGetListOfSubscribersAsync(string groupId)
        {
            try
            {
                List<string> usersId = _context.Subscribers.Where(x => x.groupId == groupId && x.isAdmin == false)
                                    .Select(x => x.userId).ToList();
                List<string> adminsId = _context.Subscribers.Where(x => x.groupId == groupId && x.isAdmin == true)
                                    .Select(x => x.userId).ToList();
                List<UserInfo> users = _context.UserInfo.Where(x => usersId.Contains(x.Id)).ToList();
                List<UserInfo> admins = _context.UserInfo.Where(x => adminsId.Contains(x.Id)).ToList();
                ResponseModel response = new ResponseModel
                {
                    admins = admins,
                    users = users
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
