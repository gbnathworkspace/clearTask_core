using clearTask.Server.Attributes;
using clearTask.Server.Models;
using clearTask.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prometheus;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Security.Claims;
using System.Threading.Tasks;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/task")]
    public class TaskController : Controller
    {

        private readonly ApplicationDbContext _context;
        private const string DEMO_USER_ID = "demo-user";
        private static readonly ConcurrentDictionary<string, List<TaskModel>> _demoTasks = new();
        private static int _demoTaskIdCounter = 1;

        public TaskController(ApplicationDbContext context)
        {
            _context = context;
            InitializeDemoTasks();
        }

        private void InitializeDemoTasks()
        {
            // Initialize demo tasks if not already done
            if (!_demoTasks.ContainsKey(DEMO_USER_ID))
            {
                var initialTasks = new List<TaskModel>
            {
                new TaskModel
                {
                    Id = _demoTaskIdCounter++,
                    Title = "Complete Project Presentation",
                    Description = "Prepare slides for the quarterly review",
                    IsCompleted = false,
                    DueDate = DateTime.UtcNow.AddDays(7),
                    Priority = (int)Priority.High,
                    UserId = DEMO_USER_ID,
                    ListId = "demo-list-1"
                },
                new TaskModel
                {
                    Id = _demoTaskIdCounter++,
                    Title = "Buy Groceries",
                    Description = "Get milk, eggs, and bread",
                    IsCompleted = false,
                    DueDate = DateTime.UtcNow.AddDays(2),
                    Priority = (int)Priority.Low,
                    UserId = DEMO_USER_ID,
                    ListId = "demo-list-1"
                }
            };
                _demoTasks.TryAdd(DEMO_USER_ID, initialTasks);
            }
        }

        #region POST METHODS
        [Authorize]
        [HttpPost("createtask")]
        public async Task<IActionResult> CreateTask([FromBody] TaskDTO TaskDto)
        {
            try
            {
                 if (ModelState.IsValid == false || string.IsNullOrWhiteSpace(TaskDto.Title))
                {
                    return BadRequest(new { message = "Invalid data", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList() });
                }



                #region DEMO USER
                if (TaskDto.UserId == DEMO_USER_ID)
                {
                    var demoTask = new TaskModel
                    {
                        Id = Interlocked.Increment(ref _demoTaskIdCounter),
                        Title = TaskDto.Title,
                        Description = TaskDto.Description ?? string.Empty,
                        IsCompleted = TaskDto.IsCompleted ?? false,
                        Priority = (int?)(TaskDto.Priority) ?? 0,
                        DueDate = TaskDto.DueDate ?? DateTime.UtcNow,
                        UserId = DEMO_USER_ID,
                        ListId = TaskDto.ListId ?? DEMO_USER_ID
                    };

                    _demoTasks.AddOrUpdate(
                        DEMO_USER_ID,
                        new List<TaskModel> { demoTask },
                        (key, existingList) =>
                        {
                            existingList.Add(demoTask);
                            return existingList;
                        });

                    return Ok(new { message = "Task created", taskId = demoTask.Id });
                }
                #endregion


                TaskModel taskEntity = new TaskModel
                {
                    Id = TaskDto.Id,
                    Title = TaskDto.Title,
                    Description = TaskDto.Description ?? string.Empty,
                    IsCompleted = TaskDto.IsCompleted ?? false,
                    Priority = (int?)(TaskDto.Priority) ?? (int)Priority.Def,
                    DueDate = TaskDto.DueDate?.ToUniversalTime(),
                    UserId = TaskDto.UserId,
                    ListId = string.IsNullOrWhiteSpace(TaskDto.ListId) ? TaskDto.UserId : TaskDto.ListId
                };

                _context.Tasks.Add(taskEntity);
                await _context.SaveChangesAsync();

                return Ok(new { message = "task created", taskId = taskEntity.Id, name = taskEntity.Title });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("deletetask")]
        public async Task<IActionResult> DeleteTask([FromQuery] int Id)
        {
            try
            {
                #region DEMO USER
                if (_demoTasks.TryGetValue(DEMO_USER_ID, out var demoUserTasks))
                {
                    var demoTask = demoUserTasks.FirstOrDefault(t => t.Id == Id);
                    if (demoTask != null)
                    {
                        demoUserTasks.Remove(demoTask);
                        return Ok(new { Message = "Task Deleted Successfully" });
                    }
                }
                #endregion

                if (Id <= 0)
                {
                    return BadRequest(new { message = "Invalid data", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList() });
                }
                TaskModel? task = await _context.Tasks.FindAsync(Id);
                if (task == null)
                {
                    return NotFound(new { message = "Task not found", taskId = Id });
                }
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Task Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", taskid = Id, error = ex.Message });
            }
        }

        [HttpPatch("updatetaskstatus")]
        public async Task<IActionResult> UpdateTask([FromQuery] int taskID, bool isCompleted)
        {
            try
            {
                #region DEMO USER
                // Check if dealing with demo user tasks
                if (_demoTasks.TryGetValue(DEMO_USER_ID, out var demoUserTasks))
                {
                    var demoTask = demoUserTasks.FirstOrDefault(t => t.Id == taskID);
                    if (demoTask != null)
                    {
                        demoTask.IsCompleted = isCompleted;
                        return Ok(new { Message = "Task updated", status = isCompleted });
                    }
                }
                #endregion


                var task = await _context.Tasks.FindAsync(taskID);
                if (task is null)
                {
                    return NotFound(new { message = "Task not found" });
                }
                if (task == null)
                    return BadRequest(new { Message = "task not found" });
                task.IsCompleted = isCompleted;
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Task updated", status = isCompleted });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        #endregion

        #region GET METHODS
        [Authorize]
        [HttpGet("gettask")]
        public async Task<IActionResult> GetTask([FromQuery] int taskid)
        {
            try
            {
                #region DEMO USER
                // Check session user ID first
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == DEMO_USER_ID)
                {
                    // Handle demo user
                    if (_demoTasks.TryGetValue(DEMO_USER_ID, out var demoUserTasks))
                    {
                        var demoTask = demoUserTasks.FirstOrDefault(t => t.Id == taskid);
                        if (demoTask != null)
                        {
                            var taskDto = new TaskDTO
                            {
                                Id = demoTask.Id,
                                Title = demoTask.Title,
                                Description = demoTask.Description,
                                IsCompleted = demoTask.IsCompleted,
                                UserId = demoTask.UserId,
                                DueDate = demoTask.DueDate,
                                Priority = (Priority)demoTask.Priority,
                                ListId = demoTask.ListId
                            };
                            return Ok(new { task = taskDto });
                        }
                    }
                    return NotFound(new { message = "Task not found" });
                }
                #endregion
                var task = await _context.Tasks.FindAsync(taskid);
                if (task is null)
                {
                    return NotFound(new { message = "Task not found" });
                }

                return Ok(new { model = task });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("gettasks")]
        [RateLimit(seconds: 30, maxRequests: 20)]
        

        public async Task<IActionResult> GetTasks([FromBody] getTaskDto getTaskDto)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(getTaskDto.userId))
                {
                    return BadRequest("Id are required.");
                }

                #region DEMO USER
                // Return demo tasks for demo user
                if (getTaskDto.userId == DEMO_USER_ID)
                {
                    if (_demoTasks.TryGetValue(DEMO_USER_ID, out var demoUserTasks))
                    {
                        var filteredTasks = demoUserTasks
                            .Where(t => t.ListId == getTaskDto.listId)
                            .Select(t => new TaskDTO
                            {
                                Id = t.Id,
                                Title = t.Title,
                                Description = t.Description,
                                IsCompleted = t.IsCompleted,
                                UserId = t.UserId,
                                DueDate = t.DueDate,
                                Priority = (Priority)t.Priority,
                                ListId = t.ListId
                            })
                            .ToList();

                        return Ok(new { tasks = filteredTasks });
                    }
                }
                #endregion

                var tasks = await _context.Tasks
                    .Where(t => t.UserId == getTaskDto.userId && t.ListId == getTaskDto.listId)
                    .Select(t => new TaskDTO
                    {
                        Id = t.Id,
                        Title = t.Title ?? string.Empty, // Handle null by defaulting to an empty string
                        Description = t.Description ?? string.Empty, // Handle null by defaulting to an empty string
                        IsCompleted = t.IsCompleted, // Boolean cannot be null
                        UserId = t.UserId ?? string.Empty, // Handle null by defaulting to an empty string
                        DueDate = t.DueDate.HasValue ? DateTime.SpecifyKind(t.DueDate.Value, DateTimeKind.Utc) : null,
                        Priority = t.Priority >= 0 ? (Priority)t.Priority : Priority.Def, // Handle null by defaulting to Priority.Default
                        ListId = t.ListId ?? string.Empty, // Handle null by defaulting to an empty string
                    })
                    .ToListAsync();



                return Ok(new { tasks = tasks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getalltasks")]
        [RateLimit(seconds: 30, maxRequests: 20)] // Allow 20 requests per 30 seconds
        public async Task<IActionResult> GetAllTasks([FromQuery]string userId)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(userId))
                {
                    return BadRequest("Id are required.");
                }

                #region DEMO USER
                // Return demo tasks for demo user
                if (userId == DEMO_USER_ID)
                {
                    if (_demoTasks.TryGetValue(DEMO_USER_ID, out var demoUserTasks))
                    {
                        var filteredTasks = demoUserTasks
                            .Select(t => new TaskDTO
                            {
                                Id = t.Id,
                                Title = t.Title,
                                Description = t.Description,
                                IsCompleted = t.IsCompleted,
                                UserId = t.UserId,
                                DueDate = t.DueDate.HasValue ? DateTime.SpecifyKind(t.DueDate.Value, DateTimeKind.Utc) : null,
                                Priority = (Priority)t.Priority,
                                ListId = t.ListId
                            })
                            .ToList();

                        return Ok(new { tasks = filteredTasks });
                    }
                }
                #endregion

                var tasks = await _context.Tasks
                    .Where(t => t.UserId == userId)
                    .Select(t => new TaskDTO
                    {
                        Id = t.Id,
                        Title = t.Title ?? string.Empty, // Handle null by defaulting to an empty string
                        Description = t.Description ?? string.Empty, // Handle null by defaulting to an empty string
                        IsCompleted = t.IsCompleted, // Boolean cannot be null
                        UserId = t.UserId ?? string.Empty, // Handle null by defaulting to an empty string
                        DueDate = t.DueDate != null ? DateTime.SpecifyKind(t.DueDate.Value, DateTimeKind.Utc) : (DateTime?)null, // Handle null for DueDate
                        Priority = (Priority)t.Priority,  // since t.Priority is an int, not nullable
                        ListId = t.ListId ?? string.Empty, // Handle null by defaulting to an empty string
                    })
                    .ToListAsync();



                return Ok(new { tasks = tasks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
        #endregion
    }
}
