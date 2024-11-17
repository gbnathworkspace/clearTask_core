using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography.Xml;

namespace clearTask.Server.Models
{
    public class AppUserModel : IdentityUser
    {

        public AppUserModel() 
        {
            FirstName = string.Empty;
            LastName = string.Empty;
        }
        // Add additional properties if needed
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string DateOfBirth { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Age { get; set; } = string.Empty;
        public ICollection<TaskModel>? Tasks { get; set; }
    }
}
