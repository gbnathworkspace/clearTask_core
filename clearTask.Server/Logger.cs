// Logger.cs
using System.Runtime.CompilerServices;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using clearTask.Server.Models;
using Microsoft.Extensions.DependencyInjection;


namespace clearTask.Server
{
    public class Logger
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private static Logger _instance;
        private static readonly object _lock = new object();

        public Logger(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public static void Initialize(IServiceScopeFactory scopeFactory)
        {
            lock (_lock)
            {
                _instance = new Logger(scopeFactory);
            }
        }

        private async Task WriteLogAsync(LogLevel_ level, string message, string functionName = "",
            object data = null, Exception exception = null, string userId = null)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var entry = new LogEntry
            {
                Timestamp = DateTime.UtcNow,
                Level = level,
                Message = message,
                Function = functionName,
                Data = data != null ? JsonSerializer.Serialize(data) : null,
                Exception = exception?.Message,
                StackTrace = exception?.StackTrace,
                UserId = userId
            };

            try
            {
                context.Logs.Add(entry);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Fallback to file logging if database logging fails
                string fallbackLog = $"{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss.fff} | {level} | {message} | {ex.Message}";
                string fallbackPath = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                    "Downloads",
                    "fallback_log.txt"
                );
                File.AppendAllText(fallbackPath, fallbackLog + Environment.NewLine);
            }
        }

        public static async Task DebugAsync(string message, [CallerMemberName] string functionName = "",
            object data = null, string userId = null)
        {
            await _instance.WriteLogAsync(LogLevel_.Debug, message, functionName, data, null, userId);
        }

        public static async Task InfoAsync<T>(T model, [CallerMemberName] string functionName = "",
            string userId = null, params string[] functionParams)
        {
            string message = "Model processed";
            await _instance.WriteLogAsync(LogLevel_.Info, message, functionName,
                new { Model = model, Parameters = functionParams }, null, userId);
        }

        public static async Task WarningAsync(string message, [CallerMemberName] string functionName = "",
            object data = null, string userId = null)
        {
            await _instance.WriteLogAsync(LogLevel_.Warning, message, functionName, data, null, userId);
        }

        public static async Task ErrorAsync(string message, Exception ex = null,
            [CallerMemberName] string functionName = "", object data = null, string userId = null)
        {
            await _instance.WriteLogAsync(LogLevel_.Error, message, functionName, data, ex, userId);
        }

        public static async Task CriticalAsync(string message, Exception ex = null,
            [CallerMemberName] string functionName = "", object data = null, string userId = null)
        {
            await _instance.WriteLogAsync(LogLevel_.Critical, message, functionName, data, ex, userId);
        }

        // Utility method to clean up old logs
        public static async Task CleanupOldLogsAsync(int daysToKeep = 30)
        {
            using var scope = _instance._scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            try
            {
                var cutoffDate = DateTime.UtcNow.AddDays(-daysToKeep);
                var oldLogs = await context.Logs
                    .Where(log => log.Timestamp < cutoffDate)
                    .ToListAsync();

                if (oldLogs.Any())
                {
                    context.Logs.RemoveRange(oldLogs);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                await _instance.WriteLogAsync(LogLevel_.Error, "Failed to cleanup old logs",
                    nameof(CleanupOldLogsAsync), null, ex);
            }
        }

        // Method to query logs
        public static async Task<IEnumerable<LogEntry>> QueryLogsAsync(
            DateTime? startDate = null,
            DateTime? endDate = null,
            LogLevel_? level = null,
            string userId = null,
            string functionName = null,
            int? maxResults = null)
        {
            using var scope = _instance._scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var query = context.Logs.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(l => l.Timestamp >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(l => l.Timestamp <= endDate.Value);

            if (level.HasValue)
                query = query.Where(l => l.Level == level.Value);

            if (!string.IsNullOrEmpty(userId))
                query = query.Where(l => l.UserId == userId);

            if (!string.IsNullOrEmpty(functionName))
                query = query.Where(l => l.Function == functionName);

            query = query.OrderByDescending(l => l.Timestamp);

            if (maxResults.HasValue)
                query = query.Take(maxResults.Value);

            return await query.ToListAsync();
        }
    }
}