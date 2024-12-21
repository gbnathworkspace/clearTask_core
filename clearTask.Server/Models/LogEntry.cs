// LogEntry.cs
using clearTask.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace clearTask.Server.Models
{
    public enum LogLevel_
    {
        Debug,
        Info,
        Warning,
        Error,
        Critical
    }

    public class LogEntry
    {
        [Key]
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public LogLevel_ Level { get; set; }
        public string Message { get; set; }
        public string Function { get; set; }
        public string Data { get; set; }
        public string Exception { get; set; }
        public string StackTrace { get; set; }
        public string UserId { get; set; } // Optional: to track which user's action caused the log
    }
}



