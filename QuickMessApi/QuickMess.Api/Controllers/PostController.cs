using Microsoft.AspNetCore.Mvc;
using QuickMess.Business.Models;
using QuickMess.Business.Services;

namespace QuickMess.Api.Controllers;

[ApiController]
[Route("")]
public class PostController: ControllerBase
{
    private readonly PostService _postService;

    public PostController(PostService postService) =>
        _postService = postService;

    [HttpPost("api/[controller]")]
    public async Task<IActionResult> Insert([FromBody] Post post)
    {
        Console.WriteLine(post.Date);
        await _postService.InsertPostMessage(post);
        return CreatedAtAction(nameof(Insert), post.Id);
    }
    
    [HttpGet("api/[controller]/{id:length(24)}")]
    public async Task<IEnumerable<Post>> Get(string id)
    {
        return await _postService.GetByUserId(id);
    }
    
    [HttpDelete("/api/users/{userId:length(24)}/posts/{postId:length(24)}")]
    public async Task Remove(string userId, string postId)
    {
        await _postService.RemovePostMessage(userId, postId);
    }
}