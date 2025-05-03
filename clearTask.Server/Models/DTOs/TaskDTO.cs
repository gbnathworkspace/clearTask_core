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
        public required string UserId { get; set; }
        public string ListId { get; set; } = string.Empty;  // Provide default value
    }

    public class getTaskDto
    {
        public string userId { get; set; } = "";
        public string listId { get; set; } = "";

    }

    public class UserProfileDto
    {
        public string UserId {get; set;} = string.Empty;
        public string firstName { get; set; } = string.Empty;
        public string lastName { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string userName { get; set; } = string.Empty;
        public string phonenumber { get; set; } = string.Empty;
        public int noOfTasks { get; set; }
        public string address { get; set; } = string.Empty;
        public int age { get; set; }
    }
    public class HabiticaApiKeysDto
    {
        public string userId {get; set;} = string.Empty;
        public string Apikey {get; set;} = string.Empty;
        public string ApiSecret {get; set;} = string.Empty;
    }
}
