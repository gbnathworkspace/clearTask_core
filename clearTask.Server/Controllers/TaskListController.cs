using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using clearTask.Server.Models;
using clearTask.Server;
using Microsoft.AspNetCore.Authorization;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/list")]
    public class TaskListController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext _context = context;

        [Authorize]
        [HttpGet("getlists")]
        public async Task<IActionResult> GetLists(int userId)
        {
            try
            {
                TaskListModel taskModel = await _context.TaskListModels.FindAsync(userId) ?? new TaskListModel() { ListId = "", AppUser = null};

                return Ok(new { tskMdl = taskModel });

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
                await _context.TaskListModels.AddAsync(taskListModel);
                return Ok(new { Message = "Inserted List success"});
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
    }
}
