namespace clearTask.Server.Models
{
    public class RegisterModel
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        // Optional: Additional fields if needed
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
