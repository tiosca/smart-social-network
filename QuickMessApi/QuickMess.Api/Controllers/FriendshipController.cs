using Microsoft.AspNetCore.Mvc;
using QuickMess.Api.Models;
using QuickMess.Business.Services;

namespace QuickMess.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FriendshipController: ControllerBase
{
    private readonly FriendshipService _friendshipService;

    public FriendshipController(FriendshipService friendshipService) =>
        _friendshipService = friendshipService;
    
    [HttpGet("friend-requests/{userId:length(24)}")]
    public async Task<Dictionary<string, IEnumerable<string>>> GetFriendRequests(string userId) =>
        await _friendshipService.GetFriendRequests(userId);
    
    [HttpGet("friends/{userId:length(24)}")]
    public async Task<IEnumerable<string>> GetFriends(string userId) =>
        await _friendshipService.GetFriends(userId);
    
    [HttpPost("friend-requests")]
    public async Task<IActionResult> AddFriendRequest([FromBody] TwoUserModel twoUserModel)
    {
        await _friendshipService.InsertFriendRequest(twoUserModel.UserId1, twoUserModel.UserId2);
        return CreatedAtAction(nameof(AddFriendRequest), twoUserModel);
    }
    
    [HttpDelete("friend-requests")]
    public async Task<IActionResult> DeleteFriendRequest([FromBody] TwoUserModel twoUserModel)
    {
        await _friendshipService.ClearFriendRequest(twoUserModel.UserId1, twoUserModel.UserId2);
        return Ok();
    }
    
    [HttpPost("")]
    public async Task<IActionResult> CreateFriendship([FromBody] TwoUserModel twoUserModel)
    {
        await _friendshipService.InsertFriendship(twoUserModel.UserId1, twoUserModel.UserId2);
        return CreatedAtAction(nameof(CreateFriendship), twoUserModel);
    }
    
    [HttpDelete("")]
    public async Task<IActionResult> DeleteFriendship([FromBody] TwoUserModel twoUserModel)
    {
        await _friendshipService.RemoveFriendship(twoUserModel.UserId1, twoUserModel.UserId2);
        return Ok();
    }


}