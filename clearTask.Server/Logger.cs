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
        private static Logger? _instance;
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

        private async Task WriteLogAsync(
            LogLevel_ level,
            string message,
            string? functionName = null,
            object? data = null,
            Exception? exception = null,
            string? userId = null)
        {
            if (_instance == null)
                throw new InvalidOperationException("Logger not initialized");

            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var entry = new LogEntry
            {
                Timestamp = DateTime.UtcNow,
                Level = level,
                Message = message,
                Function = functionName ?? "Unknown",
                Data = data != null ? JsonSerializer.Serialize(data) : string.Empty,
                Exception = exception?.Message ?? string.Empty,
                StackTrace = exception?.StackTrace ?? string.Empty,
                UserId = userId ?? string.Empty
            };

            try
            {
                context.Logs.Add(entry);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Fallback to file logging
                string fallbackLog = $"{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss.fff} | {level} | {message} | {ex.Message}";
                string fallbackPath = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                    "Downloads",
                    "fallback_log.txt"
                );
                await File.AppendAllTextAsync(fallbackPath, fallbackLog + Environment.NewLine);
            }
        }

        public static async Task DebugAsync(
            string message,
            [CallerMemberName] string? functionName = null,
            object? data = null,
            string? userId = null)
        {
            if (_instance == null)
                throw new InvalidOperationException("Logger not initialized");

            await _instance.WriteLogAsync(LogLevel_.Debug, message, functionName, data, null, userId);
        }

        public static async Task InfoAsync<T>(
            T model,
            [CallerMemberName] string? functionName = null,
            string? userId = null,
            params string[] functionParams)
        {
            if (_instance == null)
                throw new InvalidOperationException("Logger not initialized");

            string message = "Model processed";
            await _instance.WriteLogAsync(
                LogLevel_.Info,
                message,
                functionName,
                new { Model = model, Parameters = functionParams },
                null,
                userId);
        }

        public static async Task WarningAsync(
            string message,
            [CallerMemberName] string? functionName = null,
            object? data = null,
            string? userId = null)
        {
            if (_instance == null)
                throw new InvalidOperationException("Logger not initialized");

            await _instance.WriteLogAsync(LogLevel_.Warning, message, functionName, data, null, userId);
        }

        public static async Task ErrorAsync(
            string message,
            Exception? ex = null,
            [CallerMemberName] string? functionName = null,
            object? data = null,
            string? userId = null)
        {
            if (_instance == null)
                throw new InvalidOperationException("Logger not initialized");

            await _instance.WriteLogAsync(LogLevel_.Error, message, functionName, data, ex, userId);
        }

        public static async Task CriticalAsync(
            string message,
            Exception? ex = null,
            [CallerMemberName] string? functionName = null,
            object? data = null,
            string? userId = null)
        {
            if (_instance == null)
                throw new InvalidOperationException("Logger not initialized");

            await _instance.WriteLogAsync(LogLevel_.Critical, message, functionName, data, ex, userId);
        }
    }
}