using System;

namespace WebApplication1.Models
{
    public class Comment
    {
        public string Id { get; set; }
        public string postId { get; set; }
        public string userId { get; set; }
        public string text { get; set; }
        public DateTime createDate { get; set; }
    }
}
