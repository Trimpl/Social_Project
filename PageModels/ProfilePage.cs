using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.PageModels
{
    public class ProfilePage : UserInfo
    {
        public bool IsAuthor { get; set; }
    }
}
