using clearTask.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/task")]
    public class TaskController : Controller
    {

        private readonly ApplicationDbContext _context;

        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: TaskController/Create
        [HttpPost("createtask")]
        public async Task<IActionResult> CreateTask([FromBody] TaskModel taskModel)
        {
            try
            {
                if (ModelState.IsValid == false)
                {
                    return BadRequest(new { message = "Invalid data", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList() });
                }

                _context.Tasks.Add(taskModel);
                await _context.SaveChangesAsync();

                return Ok(new { message = "task created", taskId = taskModel.Id, name = taskModel.Title});
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error =  ex.Message});
            }
        }

        [HttpPost("deletetask")]
        public async Task<IActionResult> DeleteTask([FromBody] TaskModel taskId)
        {
            try
            {
                if (taskId == null)
                {
                    return BadRequest(new { message = "Invalid data", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList() });
                }
                TaskModel task = await _context.Tasks.FindAsync(taskId.Id);
                if (task == null)
                {
                    return NotFound(new { message = "Task not found", taskId = taskId });
                }
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Task Deleted Successfully" });
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", taskid = taskId, error = ex.Message });
            }
        }
    }
}
