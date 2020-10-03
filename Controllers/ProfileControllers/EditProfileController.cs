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
using System.Security.Claims;

namespace WebApplication1.Controllers.ProfileControllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EditProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<EditProfileController> _logger;
        public EditProfileController(ILogger<EditProfileController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        [HttpGet]
        public async Task<IActionResult> OnGetAsync()
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            UserInfo user = await _context.UserInfo.FindAsync(id);
            ProfilePage model = new ProfilePage
            {
                FirstName = user.FirstName,
                SecondName = user.SecondName,
                FamilyStatus = user.FamilyStatus,
                DateOfBirth = user.DateOfBirth,
                Country = user.Country,
                City = user.City,
                Languages = user.Languages,
                Avatar = user.Avatar
            };
            return Ok(model);
        }
        [HttpPost]
        public async Task<IActionResult> OnPostAsync([FromForm] ProfilePage Input)
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            UserInfo model = new UserInfo
            {
                Id = id,
                Avatar = Input.Avatar,
                FirstName = Input.FirstName,
                SecondName = Input.SecondName,
                FamilyStatus = Input.FamilyStatus,
                DateOfBirth = Input.DateOfBirth,
                Country = Input.Country,
                City = Input.City,
                Languages = Input.Languages
            };
            _context.UserInfo.Update(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }
    }
}