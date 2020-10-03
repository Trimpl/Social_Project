using System;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Data
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Messages> Messages { get; set; }
        public DbSet<Friends> Friends { get; set; }
        public DbSet<UserInfo> UserInfo { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostPicture> Pictures { get; set; }
        public DbSet<Dialogs> Dialogs { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupUser> Subscribers { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=aspnet-WebApplication1-53bc9b9d-9d6a-45d4-8429-2a2761773502;Trusted_Connection=True;MultipleActiveResultSets=true");
        }
    }
}
