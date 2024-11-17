using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace clearTask.Server.Models
{
    public class TaskListModel
    {
        [Key]
        public string ListId { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty ;

        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public AppUserModel? AppUser { get; set; } = null;
    }
}

