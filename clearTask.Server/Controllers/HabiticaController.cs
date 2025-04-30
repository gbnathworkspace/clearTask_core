
using clearTask.Server.Models;
using clearTask.Server.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace clearTask.Server.Controllers
{
    [ApiController]
    [Route("api/habitica")]
    public class HabiticaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        HabiticaController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("getkeys")]
        public async Task<IActionResult> GetKeys(string userId)
        {
            try
            {
                if(string.IsNullOrWhiteSpace(userId))
                {
                    return BadRequest("userId is empty");
                }
                HabiticaApiKeysModel? habApiKeys = await _context.HabiticaApiKeys
                    .Where(row => row.UserId == userId)
                    .FirstOrDefaultAsync();
                    
                if (habApiKeys == null)
                {
                    return NotFound("No keys found for this user");
                }
                return Ok(habApiKeys);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public async Task<IActionResult> AddKeys(HabiticaApiKeysDto keys)
        {
            try
            {
                HabiticaApiKeysModel habModel = new HabiticaApiKeysModel();
                if(ModelState.IsValid == false)
                    return BadRequest("Dto is invalid");

                habModel.UserId = keys.userId;
                habModel.ApiKey = keys.Apikey;
                habModel.ApiSecret = keys.ApiSecret;
                await _context.HabiticaApiKeys.AddAsync(habModel);

                return Ok("keys added successfully");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }
    }
}