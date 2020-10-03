using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using WebApplication1.Models;

namespace WebApplication1.Controllers.AuthControllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class ConfirmEmailController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ConfirmEmailController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [TempData]
        public string StatusMessage { get; set; }

        public async Task<IActionResult> OnGetAsync(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return Redirect("~/");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Redirect("~/BadConfirmEmail");
            }

            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
            var result = await _userManager.ConfirmEmailAsync(user, code);
            StatusMessage = result.Succeeded ? "Thank you for confirming your email. Now you can edit info about you." : "Error confirming your email.";
            return Redirect("~/ConfirmEmailSuccess");
        }
    }
}
