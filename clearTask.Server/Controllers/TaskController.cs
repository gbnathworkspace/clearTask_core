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
                    DueDate = TaskDto.DueDate ?? null,
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
        public async Task<IActionResult> DeleteTask([FromBody] TaskDTO taskDTO)
        {
            try
            {
                if (taskDTO == null)
                {
                    return BadRequest(new { message = "Invalid data", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList() });
                }
                TaskModel task = await _context.Tasks.FindAsync(taskDTO.Id);
                if (task == null)
                {
                    return NotFound(new { message = "Task not found", taskId = taskDTO });
                }
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Task Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", taskid = taskDTO, error = ex.Message });
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
        [HttpGet("getalltasks")]
        public async Task<IActionResult> GetAllTasks([FromQuery] string userId)
        {
            try
            {
                var tasks = await _context.Tasks
                    .Where(t => t.UserId == userId)
                    .Select(t => new TaskDTO
                    {
                        Id = t.Id,
                        Title = t.Title,
                        Description = t.Description,
                        IsCompleted = t.IsCompleted,
                        UserId = t.UserId
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
