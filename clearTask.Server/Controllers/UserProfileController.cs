using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using clearTask.Server.Models;
using clearTask.Server;
using System.Reflection;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserProfileController(UserManager<AppUserModel> userManager) : ControllerBase
    {
        private readonly UserManager<AppUserModel> _userManager = userManager;

        [HttpGet("get")]
        public IActionResult Get()
        {
            return Ok("Test connection successful!");
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


    }
}
