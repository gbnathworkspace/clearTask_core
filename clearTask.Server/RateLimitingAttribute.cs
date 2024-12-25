// RateLimitingAttribute.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace clearTask.Server.Attributes
{
    [AttributeUsage(AttributeTargets.Method)]
    public class RateLimitAttribute : ActionFilterAttribute
    {
        private readonly int _seconds;
        private readonly int _maxRequests;

        public RateLimitAttribute(int seconds = 1, int maxRequests = 1)
        {
            _seconds = seconds;
            _maxRequests = maxRequests;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var ipAddress = context.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var userId = context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var key = $"rate_limit_{ipAddress}_{userId}_{context.ActionDescriptor.DisplayName}";

            var rateLimitService = context.HttpContext.RequestServices.GetRequiredService<IRateLimitService>();
            if (!await rateLimitService.IsAllowedAsync(key, _seconds, _maxRequests))
            {
                context.Result = new ContentResult
                {
                    Content = "Too many requests. Please try again later.",
                    StatusCode = (int)HttpStatusCode.TooManyRequests
                };
                return;
            }

            await next();
        }
    }
}

// IRateLimitService.cs
public interface IRateLimitService
{
    Task<bool> IsAllowedAsync(string key, int seconds, int maxRequests);
}

// RateLimitService.cs
public class RateLimitService : IRateLimitService
{
    private static readonly Dictionary<string, Queue<DateTime>> _requestStore = new();
    private static readonly SemaphoreSlim _semaphore = new(1, 1);

    public async Task<bool> IsAllowedAsync(string key, int seconds, int maxRequests)
    {
        await _semaphore.WaitAsync();
        try
        {
            CleanupExpiredRequests(key, seconds);

            if (!_requestStore.ContainsKey(key))
            {
                _requestStore[key] = new Queue<DateTime>();
            }

            if (_requestStore[key].Count < maxRequests)
            {
                _requestStore[key].Enqueue(DateTime.UtcNow);
                return true;
            }

            return false;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    private void CleanupExpiredRequests(string key, int seconds)
    {
        if (_requestStore.ContainsKey(key))
        {
            var threshold = DateTime.UtcNow.AddSeconds(-seconds);
            while (_requestStore[key].Count > 0 && _requestStore[key].Peek() < threshold)
            {
                _requestStore[key].Dequeue();
            }

            if (_requestStore[key].Count == 0)
            {
                _requestStore.Remove(key);
            }
        }
    }
}