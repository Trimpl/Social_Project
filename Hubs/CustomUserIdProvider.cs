using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace WebApplication1.Hubs
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public virtual string GetUserId(HubConnectionContext connection)
        {
            // return connection.User?.Identity.Name;
            // или так
            //return connection.User.FindFirst(ClaimTypes.Email).Value;
            return connection.User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        }
    }
}