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

namespace WebApplication1.Controllers.ProfileControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileAuthViewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ProfileAuthViewController> _logger;
        public ProfileAuthViewController(ILogger<ProfileAuthViewController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> OnGetAsync()
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            UserInfo user = await _context.UserInfo.FindAsync(id);
            var a = new {
                FirstName = user.FirstName,
                SecondName = user.SecondName,
                Avatar = user.Avatar
            };
            return Ok(a);
        }
    }
}