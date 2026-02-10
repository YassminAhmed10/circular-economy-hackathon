namespace shadowfactory.Models
{
    public class TestUser
    {
        public long Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Salt { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public long? FactoryId { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}