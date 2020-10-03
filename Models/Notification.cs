using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models
{
    public class Notification
    {
        public string id { get; set; }
        public string text { get; set; }
        public string link { get; set; }
        public string userId { get; set; }
        public string image { get; set; }
        public bool isViewed { get; set; }
        public DateTime createDate { get; set; }
    }
}
