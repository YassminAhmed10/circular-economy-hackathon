using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace shadowfactory.Hubs
{
    [Authorize]
    public class NotificationsHub : Hub
    {
        // Send notification to single connection/user
        public async Task SendNotification(string userId, string title, string message)
        {
            // Assumes caller provides target user Id mapping to SignalR connection groups
            await Clients.User(userId).SendAsync("ReceiveNotification", new { Title = title, Message = message, Timestamp = DateTime.UtcNow });
        }

        // Broadcast to recycler/buyer/seller groups
        public async Task BroadcastToGroup(string group, string title, string message)
        {
            await Clients.Group(group).SendAsync("ReceiveNotification", new { Title = title, Message = message, Timestamp = DateTime.UtcNow });
        }

        public override Task OnConnectedAsync()
        {
            // Optionally map claims to groups here (e.g., role or factory)
            return base.OnConnectedAsync();
        }
    }
}