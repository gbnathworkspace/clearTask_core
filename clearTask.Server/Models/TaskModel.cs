using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace clearTask.Server.Models
{
    public class TaskModel
    {
        [Key]
        public required int Id { get; set; }
        public  string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public AppUserModel? User { get; set; }
    }
}
