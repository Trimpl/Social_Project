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

namespace WebApplication1.Controllers.PhotoAlbumControllers
{
    [ApiController]
    public class PhotoAlbumController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<PhotoAlbumController> _logger;
        public PhotoAlbumController(ILogger<PhotoAlbumController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        public class BodyModel
        {
            public string albumId { get; set; }
            public string[] pictures { get; set; }
        }
        [HttpGet]
        [Authorize]
        [Route("api/getAlbum")]
        public async Task<IActionResult> OnGetAsync(string albumId)
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            try
            {
                var b = _context.Pictures.Where(x => x.postId == albumId).ToList();
                return Ok(b);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpPost]
        [Authorize]
        [Route("api/addPicture")]
        public async Task<IActionResult> OnPostAsync([FromBody] BodyModel model)
        {
            string id = HttpContext.User.Claims.ToArray()[5].Value;
            try
            {
                foreach (var b in model.pictures)
                {
                    PostPicture picture = new PostPicture
                    {
                        Id = Guid.NewGuid().ToString(),
                        userId = id,
                        postId = id,
                        pictureLink = b,
                    };
                    await _context.Pictures.AddAsync(picture);
                }
                await _context.SaveChangesAsync();
                var a = _context.Pictures.Where(x => x.postId == model.albumId).ToList();
                return Ok(a);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
