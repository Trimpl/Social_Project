using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models
{
    public class Post
    {
        public string Id { get; set; }
        public string userId { get; set; }
        public string postText { get; set; }
        public DateTime createDate { get; set; }
    }
}
