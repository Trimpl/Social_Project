using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models
{
    public class PostPicture
    {
        public string Id { get; set; }
        public string userId { get; set; }
        public string postId { get; set; }
        public string pictureLink { get; set; }
    }
}
