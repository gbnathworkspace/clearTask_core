namespace clearTask.Server.Models.DTOs
{

    public enum Priority
    {
        Def = 0,
        Low = 1,
        Medium = 2,
        High = 3
    }

    public class TaskDTO
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public bool? IsCompleted { get; set; }

        public DateTime? DueDate { get; set; }

        public Priority Priority { get; set; }

        public required string UserId { get; set; } // Only the UserId, not the full User object

        public string ListId { get; set; }
    }

    public class getTaskDto
    {
        public string userId { get; set; } = "";
        public string listId { get; set; } = "";

    }
}
