using Microsoft.AspNetCore.Mvc;
using QuickMess.Api.Models;
using QuickMess.Business.Models;
using QuickMess.Business.Services;

namespace QuickMess.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController: ControllerBase
{
    private readonly ChatService _chatService;

    public ChatController(ChatService chatService) =>
        _chatService = chatService;
    
    [HttpPost("")]
    public async Task<IActionResult> InsertChat([FromBody] TwoUserModel twoUserModel)
    {
        await _chatService.InsertChat(twoUserModel.UserId1, twoUserModel.UserId2);
        return CreatedAtAction(nameof(InsertChat), twoUserModel);
    }
    
    [HttpPost("messages")]
    public async Task<IActionResult> InsertMessage([FromBody] Message message)
    {
        await _chatService.InsertMessage(message.Sender, message.Receiver, message);
        return CreatedAtAction(nameof(InsertMessage), message);
    }
    
    [HttpGet("by-users")]
    public async Task<IEnumerable<Message>> GetMessages([FromQuery] TwoUserModel twoUserModel)
    {
        return await _chatService.GetMessages(twoUserModel.UserId1, twoUserModel.UserId2);
    }
    
    [HttpGet("")]
    public async Task<IEnumerable<Chat>> GetChats([FromBody] TwoUserModel twoUserModel)
    {
        return await _chatService.Get();
    }
}
