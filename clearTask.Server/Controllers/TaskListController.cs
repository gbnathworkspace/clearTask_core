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
using System.Collections.Concurrent;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/list")]
    public class TaskListController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string DEMO_USER_ID = "demo-user";
        private static readonly ConcurrentDictionary<string, List<TaskListModel>> _demoLists = new();

        public TaskListController(ApplicationDbContext context)
        {
            _context = context;

            // Initialize demo lists if not already done
            if (!_demoLists.ContainsKey(DEMO_USER_ID))
            {
                var initialLists = new List<TaskListModel>
                {
                    new TaskListModel
                    {
                        ListId = "demo-list-1",
                        Name = "Personal Tasks",
                        UserId = DEMO_USER_ID
                    },
                    new TaskListModel
                    {
                        ListId = "demo-list-2",
                        Name = "Work Tasks",
                        UserId = DEMO_USER_ID
                    }
                };
                _demoLists.TryAdd(DEMO_USER_ID, initialLists);
            }
        }

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

                #region DEMO USER
                // Return demo lists for demo user
                if (userId == DEMO_USER_ID)
                {
                    if (_demoLists.TryGetValue(DEMO_USER_ID, out var demoUserLists))
                    {
                        return Ok(new { lists = demoUserLists });
                    }
                    return Ok(new { lists = new List<TaskListModel>() });
                }
                #endregion

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

                #region DEMO USER
                // Handle demo user list creation
                if (taskListModel.UserId == DEMO_USER_ID)
                {
                    if (string.IsNullOrWhiteSpace(taskListModel.ListId))
                    {
                        taskListModel.ListId = Guid.NewGuid().ToString();
                    }

                    _demoLists.AddOrUpdate(
                        DEMO_USER_ID,
                        new List<TaskListModel> { taskListModel },
                        (key, existingList) =>
                        {
                            existingList.Add(taskListModel);
                            return existingList;
                        });

                    return Ok(new { Message = "List created successfully" });
                }
                #endregion

                if (string.IsNullOrWhiteSpace(taskListModel.ListId))
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
