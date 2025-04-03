using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using clearTask.Server.Models;
using clearTask.Server;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using clearTask.Server.Models.DTOs;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserProfileController(UserManager<AppUserModel> userManager, ApplicationDbContext applicationDbContext) : ControllerBase
    {
        private readonly UserManager<AppUserModel> _userManager = userManager;
        private readonly ApplicationDbContext _context = applicationDbContext;

        [HttpGet("get")]
        public IActionResult GetDBStatus()
        {
                var test = _context.Database.CanConnect();

            return Ok(("Test connection successful!") + (test ? "Database Connected!" : "Database Connection Failed!"));
        }

        [HttpPost("edit")]
        public async Task<IActionResult> UpdateProfile([FromBody] AppUserModel model)
        {
            try
            {
                #region Validation
                if (!ModelState.IsValid)
                {
                    // Collect all validation errors
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                                                  .Select(e => e.ErrorMessage)
                                                  .ToList();
                    return BadRequest(new { message = "Invalid data", errors });
                }
                #endregion

                var user = await _userManager.FindByIdAsync(model.Id);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.DateOfBirth = model.DateOfBirth;
                user.Address = model.Address;
                user.Age = model.Age;

                return Ok(new { message = "Profile updated successfully" });

            }
            catch (Exception ex)
            {
                await Logger.ErrorAsync($"{MethodBase.GetCurrentMethod()?.Name} failed", ex, data: model);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("getUserInfo/{id}")]
        [Authorize]
        public IActionResult GetUserProfile(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest(new { error = "id is required" });

            AppUserModel user = _context.AppUserModels.Find(id);
            userProfileDto userdto = new userProfileDto();
            userdto.firstName = user.FirstName;
            userdto.lastName = user.LastName;
            userdto.address = user.Address;
            userdto.phonenumber = user.PhoneNumber;
            userdto.age = Convert.ToInt32(string.IsNullOrEmpty(user.Age) == true ? 0 : user.Age);
            userdto.email = user.Email;
            userdto.userName = user.UserName;



            if (user == null)
                return NotFound(new { error = "user not found" });

            return Ok(new { userdto });
        }
    }
}


