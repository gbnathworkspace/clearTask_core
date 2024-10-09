using System.ComponentModel.DataAnnotations;

namespace clearTask.Server.Models
{
    public class TaskModel
    {
        public required int Id { get; set; }
        public  string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public required string UserId { get; set; }
        
    }
}
