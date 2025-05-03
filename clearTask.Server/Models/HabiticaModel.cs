using System.ComponentModel.DataAnnotations;

namespace clearTask.Server.Models
{
    public class HabiticaApiKeysModel
    {
        [Key]
        public string Id { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        public string ApiSecret { get; set; } = string.Empty;
        public AppUserModel? AppUser { get; set; } = null!;
        public string UserId { get; set; } = string.Empty;
    }

    public class HabiticaModel
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Value { get; set; }
        public int Difficulty { get; set; }
        public int Frequency { get; set; }
        public int Streak { get; set; }
        public int ConsecutiveDays { get; set; }
        public DateTime LastCompleted { get; set; }
    }
}