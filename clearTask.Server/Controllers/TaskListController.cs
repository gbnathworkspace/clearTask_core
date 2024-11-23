using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using clearTask.Server.Models;
using clearTask.Server;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/list")]
    public class TaskListController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext _context = context;

        [Authorize]
        [HttpGet("getlists")]
        public async Task<IActionResult> GetLists(string userId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return BadRequest("userId is empty");
                }

                List<TaskListModel> taskLists = await _context.TaskListModels
                .Where(list => list.UserId == userId)
                .ToListAsync();  // Asynchronously converting the IQueryable to List

                if (!taskLists.Any())  // Checking if the list is empty
                {
                    return NotFound(new { message = "No lists found for this user." });
                }

                return Ok(new { lists = taskLists });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message + "|" + ex.InnerException });
            }
        }

        [Authorize]
        [HttpPost("createlist")]
        public async Task<IActionResult> CreateList(TaskListModel taskListModel)
        {
            try
            {
                if(string.IsNullOrWhiteSpace(taskListModel.ListId))
                    taskListModel.ListId = Guid.NewGuid().ToString();

                await _context.TaskListModels.AddAsync(taskListModel);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Inserted List success" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}    
