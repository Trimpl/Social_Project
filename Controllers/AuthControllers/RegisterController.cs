using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using WebApplication1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using WebApplication1.Services;
using WebApplication1.Data;
using Newtonsoft.Json;

namespace WebApplication1.Controllers.AuthControllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RegisterController> _logger;
        private readonly EmailService _emailSender;

        public RegisterController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<RegisterController> logger,
            EmailService emailSender,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _emailSender = emailSender;
        }

        public string ReturnUrl { get; set; }

        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [DataType(DataType.Password)]
            public string ConfirmPassword { get; set; }
        }
        [HttpGet]
        public async Task OnGetAsync(string returnUrl = null)
        {
            ReturnUrl = returnUrl;
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
        }
        [HttpPost]
        public async Task<IActionResult> OnPostAsync([FromForm] InputModel Input, string returnUrl = null)
        {
            returnUrl = returnUrl ?? Url.Content("~/");
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = Input.Email, Email = Input.Email };
                var result = await _userManager.CreateAsync(user, Input.Password);
                if (result.Succeeded)
                {
                    UserInfo userinfo = new UserInfo
                    {
                        Id = user.Id,
                        FirstName = "Unknown",
                        SecondName = "",
                        FamilyStatus = "",
                        Country = "",
                        City = "",
                        Languages = "",
                        DateOfBirth = DateTime.Now,
                        Avatar = "https://okeygeek.ru/wp-content/uploads/2020/03/no_avatar.png"
                    };
                    await _context.UserInfo.AddAsync(userinfo);
                    List<string> list = new List<string>();
                    await _context.Friends.AddAsync(new Friends(){
                        Id = user.Id,
                        FriendsIds = JsonConvert.SerializeObject(list)
                    });
                    await  _context.SaveChangesAsync();
                    _logger.LogInformation("User created a new account with password.");
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    string callbackUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/ConfirmEmail?userId={user.Id}&code={code}";
                    _emailSender.SendEmailCustom(Input.Email, callbackUrl);

                    if (_userManager.Options.SignIn.RequireConfirmedAccount)
                    {
                        return Ok("Please, confirm you account. Mail sent to the email.");
                    }
                    else
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return LocalRedirect(returnUrl);
                    }
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }
            return BadRequest("Smth went wrong");
        }
    }
}
