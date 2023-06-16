using Microsoft.AspNetCore.Mvc;
using QuickMess.Business.Models;
using QuickMess.Business.Services;

namespace QuickMess.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService) =>
        _userService = userService;

    [HttpGet]
    public async Task<List<User>> Get() =>
        await _userService.GetAllAsync();

    [HttpGet("multiple")]
    public async Task<List<User>> GetMultiple([FromQuery] string ids)
    {
        
        var idsEnumerable = ids.Split(",");
        return await _userService.GetByMultipleIdsAsync(idsEnumerable);
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<User>> Get(string id)
    {
        var user = await _userService.GetByIdAsync(id);

        if (user is null)
        {
            return NotFound();
        }

        return user;
    }
    
    [HttpGet("auth")]
    public async Task<ActionResult<User>> Login([FromQuery(Name = "username")] string username, [FromQuery(Name = "password")] string? password)
    {
        var user = await _userService.GetUser(username, password);

        if (user is null)
        {
            return NotFound();
        }

        return user;
    }

    [HttpPost]
    public async Task<IActionResult> Post(User newUser)
    {
        await _userService.CreateAsync(newUser);

        return CreatedAtAction(nameof(Post), new { id = newUser.Id }, newUser);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, User updatedUser)
    {
        var user = await _userService.GetByIdAsync(id);

        if (user is null)
        {
            return NotFound();
        }

        updatedUser.Id = user.Id;

        await _userService.UpdateAsync(id, updatedUser);

        return NoContent();
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, [FromBody] Dictionary<string, string> userObject)
    {
        if (userObject.ContainsKey("status"))
        {
            await _userService.UpdateUserStatus(id, userObject["status"]);
            return NoContent();
        }

        return BadRequest();
    }
    
    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userService.GetByIdAsync(id);

        if (user is null)
        {
            return NotFound();
        }

        await _userService.RemoveAsync(user.Id);

        return NoContent();
    }
}