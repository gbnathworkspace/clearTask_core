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
        [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "userId" }, Location = ResponseCacheLocation.Client)] // Cache 
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

        [Authorize]
        [HttpDelete("deletelist")]
        public async Task<IActionResult> DeleteList(string listId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                #region DEMO USER
                // Handle demo user list deletion
                if (userId == DEMO_USER_ID)
                {
                    if (_demoLists.TryGetValue(DEMO_USER_ID, out var demoUserLists))
                    {
                        // Find the list to delete
                        var listToDelete = demoUserLists.FirstOrDefault(l => l.ListId == listId);
                        if (listToDelete == null)
                        {
                            return NotFound(new { message = "List not found" });
                        }

                        // Prevent deletion of default demo lists
                        if (listId == "demo-list-1" || listId == "demo-list-2")
                        {
                            return BadRequest(new { message = "Cannot delete default demo lists" });
                        }

                        // Remove the list
                        demoUserLists.Remove(listToDelete);

                        return Ok(new
                        {
                            message = "Demo list deleted successfully",
                            deletedTaskCount = 0 // Demo tasks are not persisted
                        });
                    }
                    return NotFound(new { message = "Demo lists not found" });
                }
                #endregion

                // Regular user list deletion
                var list = await _context.TaskListModels
                    .FirstOrDefaultAsync(l => l.ListId == listId && l.UserId == userId);

                if (list == null)
                {
                    return NotFound(new { message = "List not found or unauthorized access" });
                }

                // Prevent deletion of default list
                if (list.ListId == userId)
                {
                    return BadRequest(new { message = "Cannot delete default list" });
                }

                // Delete all tasks associated with this list first
                var tasksToDelete = await _context.Tasks
                    .Where(t => t.ListId == listId && t.UserId == userId)
                    .ToListAsync();

                if (tasksToDelete.Any())
                {
                    _context.Tasks.RemoveRange(tasksToDelete);
                }

                // Delete the list
                _context.TaskListModels.Remove(list);

                // Save changes
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "List and associated tasks deleted successfully",
                    deletedTaskCount = tasksToDelete.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while deleting the list",
                    error = ex.Message
                });
            }
        }
    }
}    
