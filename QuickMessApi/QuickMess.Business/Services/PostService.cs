using QuickMess.Business.Config;
using QuickMess.Business.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace QuickMess.Business.Services;

public class PostService
{
    private readonly IMongoCollection<User> _userCollection;
    private readonly UserService _userService;

    public PostService(
        IOptions<QuickMessDatabaseSettings> quickMessDatabaseSettings, UserService userService)
    {
        _userService = userService;
        var mongoClient = new MongoClient(
            quickMessDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            quickMessDatabaseSettings.Value.DatabaseName);

        _userCollection = mongoDatabase.GetCollection<User>(
            quickMessDatabaseSettings.Value.UsersCollectionName);
    }

    public async Task InsertPostMessage(Post post)
    {
        if (post.Owner == null) return;
        var updatedUser = await _userService.GetByIdAsync(post.Owner);
        if (updatedUser != null)
        {
            updatedUser.Posts = updatedUser.Posts.Append(post);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
    }
    
    public async Task RemovePostMessage(string userId, string postId)
    {
        var updatedUser = await _userService.GetByIdAsync(userId);
        if (updatedUser != null)
        {
            updatedUser.Posts = updatedUser.Posts.Where(post => post.Id != postId);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
    }
    
    public async Task UpdateAsync(string id, User updatedUser) =>
        await _userCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);

    public async Task RemoveAsync(string id) =>
        await _userCollection.DeleteOneAsync(x => x.Id == id);

    public async Task<IEnumerable<Post>> GetByUserId(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        return user == null ? new List<Post>() : user.Posts;
    }
}