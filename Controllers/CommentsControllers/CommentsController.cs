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

namespace WebApplication1.Controllers.DialogsControllers
{
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<CommentsController> _logger;
        public CommentsController(ILogger<CommentsController> logger,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }
        public class CommentList : Comment
        {
            public string link { get; set; }
        }
        [HttpGet]
        [Route("api/getComments")]
        public async Task<IActionResult> OnGetCommentsAsync(string postId)
        {
            try
            {
                List<Comment> list = _context.Comments.Where(x => x.postId == postId).OrderByDescending(x => x.createDate).ToList();
                List<CommentList> respone = new List<CommentList>();
                foreach (var comment in list)
                {
                    UserInfo user = await _context.UserInfo.FindAsync(comment.userId);
                    comment.userId = $"{user.FirstName} {user.SecondName}";
                    CommentList a = (CommentList)comment;
                    a.link = user.Id;
                    respone.Add(a);
                }
                return Ok(list);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}