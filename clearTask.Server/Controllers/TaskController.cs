using clearTask.Server.Models;
using clearTask.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Threading.Tasks;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/task")]
    public class TaskController(ApplicationDbContext context) : Controller
    {

        private readonly ApplicationDbContext _context = context;

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

                TaskModel taskEntity = new TaskModel
                {
                    Id = TaskDto.Id,
                    Title = TaskDto.Title,
                    Description = TaskDto.Description ?? string.Empty,
                    IsCompleted = TaskDto.IsCompleted ?? false,
                    Priority = (int?)(TaskDto.Priority) ?? (int)Priority.Def,
                    DueDate = DateTime.SpecifyKind(TaskDto.DueDate.Value, DateTimeKind.Utc),
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
                if (Id == null)
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
                TaskModel task = await _context.Tasks.FindAsync(taskID);
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
                TaskModel task = await _context.Tasks.FindAsync(taskid);
                if (task == null)
                    return BadRequest(new { Message = "task not found" });

                return Ok(new { model = task });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("getalltasks")]
        public async Task<IActionResult> GetAllTasks([FromBody] getTaskDto getTaskDto)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(getTaskDto.userId) || string.IsNullOrWhiteSpace(getTaskDto.listId))
                {
                    return BadRequest("Id and ListId are required.");
                }


                var tasks = await _context.Tasks
                    .Where(t => t.UserId == getTaskDto.userId && t.ListId == getTaskDto.listId)
                    .Select(t => new TaskDTO
                    {
                        Id = t.Id,
                        Title = t.Title ?? string.Empty, // Handle null by defaulting to an empty string
                        Description = t.Description ?? string.Empty, // Handle null by defaulting to an empty string
                        IsCompleted = t.IsCompleted, // Boolean cannot be null
                        UserId = t.UserId ?? string.Empty, // Handle null by defaulting to an empty string
                        DueDate = t.DueDate != null ? DateTime.SpecifyKind(t.DueDate, DateTimeKind.Utc) : (DateTime?)null, // Handle null for DueDate
                        Priority = t.Priority != null ? (Priority)t.Priority : Priority.Def, // Handle null by defaulting to Priority.Default
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
