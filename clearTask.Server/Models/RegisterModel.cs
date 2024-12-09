using System.ComponentModel.DataAnnotations;

public class RegisterModel
{
    [Required]
    public required string FirstName { get; set; }

    public required string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }


}
