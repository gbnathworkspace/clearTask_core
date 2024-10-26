namespace clearTask.Server.Models.DTOs
{
    public class TaskDTO
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public bool IsCompleted { get; set; }

        public required string UserId { get; set; } // Only the UserId, not the full User object
    }

}
