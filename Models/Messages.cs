using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models
{
    public class Messages
    {
        public string id { get; set; }
        public string firstUserId { get; set; }
        public string secondUserId { get; set; }
        public string message { get; set; }
        public DateTime createDate { get; set; }
        public bool isViewed { get; set; }
    }
}
