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

namespace WebApplication1.Controllers.PostControllers
{
    [ApiController]
    public class PostLikesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<PostLikesController> _logger;
        public class LikeResponse : Like
        {
            public Boolean isLiked { get; set; }
        }
        public PostLikesController(ILogger<PostLikesController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        [HttpPost]
        [Authorize]
        [Route("api/postLike")]
        public async Task<IActionResult> OnPostLikeAsync(string postId)
        {
            try
            {
                string id = HttpContext.User.Claims.ToArray()[5].Value;
                Like like = _context.Likes.FirstOrDefault(x => x.postId == postId && x.userId == id);
                if (like != null)
                {
                    _context.Likes.Remove(like);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    like = new LikeResponse
                    {
                        Id = Guid.NewGuid().ToString(),
                        userId = id,
                        postId = postId,
                    };
                    await _context.Likes.AddAsync(like);
                    await _context.SaveChangesAsync();
                }
                return Ok(like);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
