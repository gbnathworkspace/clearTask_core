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
        public required string Message { get; set; }
        public required string Function { get; set; }
        public required string Data { get; set; }
        public required string Exception { get; set; }
        public required string StackTrace { get; set; }
        public required string UserId { get; set; }
    }
}



