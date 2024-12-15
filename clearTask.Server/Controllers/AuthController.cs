using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using clearTask.Server.Models;
using clearTask.Server;
using Newtonsoft.Json.Linq;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        #region Initialization
        private readonly UserManager<AppUserModel> _userManager;
        private readonly SignInManager<AppUserModel> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(UserManager<AppUserModel> userManager,
                              SignInManager<AppUserModel> signInManager,
                              IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }
        #endregion

        #region Public Methods
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            Logger.InfoLog(model);
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

                var userName = $"{model.FirstName}.{model.LastName}".ToLower();
                var existingUser = await _userManager.FindByNameAsync(userName);

                if (existingUser != null)
                {
                    return BadRequest(new { message = "Username is already taken" });
                }

                var existingEmailUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingEmailUser != null)
                {
                    return BadRequest(new { message = "Email is already taken" });
                }
                #endregion

                #region Businness Logic
                AppUserModel user = new AppUserModel
                {
                    UserName = userName,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email
                };

                IdentityResult result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    TaskListController taskController = new TaskListController(_context);
                    TaskListModel taskList = new();
                    taskList.AppUser = user;
                    taskList.UserId = user.Id; ;
                    taskList.Name = Utils.homeList;
                    taskList.ListId = user.Id;
                    await taskController.CreateList(taskList);
                }

                if (!result.Succeeded)
                {
                    var identityErrors = result.Errors.Select(e => e.Description).ToList();
                    return BadRequest(new { message = "Registration failed", errors = identityErrors });
                }
                #endregion

                return Ok(new { token = token, userid = user.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Registration unsuccessful", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {

            #region DEMO USER
            if (model.Email?.ToLower() == "demo@example.com" && model.Password == "demo123")
            {
                var demoUser = new AppUserModel
                {
                    Id = "demo-user",
                    UserName = "DemoUser",
                    Email = "demo@example.com",
                    FirstName = "Demo",
                    LastName = "User"
                };
                var dmtoken = GenerateJwtToken(demoUser);

                Logger.ErrorLog($"Demo token: {dmtoken}");


                return Ok(new { token = dmtoken, userid = demoUser.Id });
            }
            #endregion DEMO USER


            #region Validation
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }
            #endregion

            #region Businness Logic
            var token = GenerateJwtToken(user);
            return Ok(new { token = token, userid = user.Id });
            #endregion
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logged out successfully" });
        }
        #endregion

        #region Internal Methods
        private string GenerateJwtToken(AppUserModel user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured."));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName ?? throw new InvalidOperationException("UserName is null"))
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        #endregion

    }
}
