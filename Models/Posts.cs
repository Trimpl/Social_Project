using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models
{
    public class Posts
    {
        public string Id { get; set; }
        public string userId { get; set; }
        public string postText { get; set; }
        public DateTime createDate { get; set; }
        public List<Picture> pictureLink { get; set; }
        public int likes { get; set; }
        public bool isLiked { get; set; }
        public List<CommentPost> comments { get; set; }
        public string avatar { get; set; }
        public string link { get; set; }
    }
}
