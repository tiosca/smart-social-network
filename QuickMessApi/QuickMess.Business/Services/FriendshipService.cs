using QuickMess.Business.Config;
using QuickMess.Business.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace QuickMess.Business.Services;

public class FriendshipService
{
    private readonly IMongoCollection<User> _userCollection;
    private readonly UserService _userService;

    public FriendshipService(
        IOptions<QuickMessDatabaseSettings> quickMessDatabaseSettings
        , UserService userService)
    {
        _userService = userService;
        var mongoClient = new MongoClient(
            quickMessDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            quickMessDatabaseSettings.Value.DatabaseName);

        _userCollection = mongoDatabase.GetCollection<User>(
            quickMessDatabaseSettings.Value.UsersCollectionName);
    }

    
    public async Task InsertFriendRequest(string userId, string userWhoRequestedFriendship)
    {
        //User 1
        var updatedUser = await _userService.GetByIdAsync(userId);
        if (updatedUser != null)
        {
            updatedUser.FriendRequests.Add(userWhoRequestedFriendship);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
        
        //User 2
        updatedUser = await _userService.GetByIdAsync(userWhoRequestedFriendship);
        if (updatedUser != null)
        {
            updatedUser.FriendRequestsSentByMe.Add(userId);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
    }
    
    public async Task<Dictionary<string, IEnumerable<string>>> GetFriendRequests(string userId)
    {
        var user = await _userService.GetByIdAsync(userId);
        if (user == null) return new Dictionary<string, IEnumerable<string>>();

        return new Dictionary<string, IEnumerable<string>>()
        {
            {"friendRequests", user.FriendRequests},
            {"friendRequestsSentByMe", user.FriendRequestsSentByMe},
        };
    }
    
    public async Task<IEnumerable<string>> GetFriends(string userId)
    {
        var user = await _userService.GetByIdAsync(userId);
        if (user == null) return new List<string>();
        return user.Friends;
    }
    
    public async Task ClearFriendRequest(string userId, string userWhoRequestedFriendship)
    {
        //User 1
        var updatedUser = await _userService.GetByIdAsync(userId);
        if (updatedUser != null)
        {
            updatedUser.FriendRequests.Remove(userWhoRequestedFriendship);
            updatedUser.FriendRequestsSentByMe.Remove(userWhoRequestedFriendship);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
        
        //User 2
        updatedUser = await _userService.GetByIdAsync(userWhoRequestedFriendship);
        if (updatedUser != null)
        {
            updatedUser.FriendRequests.Remove(userId);
            updatedUser.FriendRequestsSentByMe.Remove(userId);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
    }
    
    public async Task RemoveFriendship(string userId, string userWhoRequestedRemoveFriendship)
    {
        //User 1
        var updatedUser = await _userService.GetByIdAsync(userId);
        if (updatedUser != null)
        {
            updatedUser.Friends.Remove(userWhoRequestedRemoveFriendship);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
        
        //User 2
        updatedUser = await _userService.GetByIdAsync(userWhoRequestedRemoveFriendship);
        if (updatedUser != null)
        {
            updatedUser.Friends.Remove(userId);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
    }
    
    public async Task InsertFriendship(string userId, string userWhoRequestedFriendship)
    {
        //User 1
        var updatedUser = await _userService.GetByIdAsync(userId);
        if (updatedUser != null)
        {
            updatedUser.Friends.Add(userWhoRequestedFriendship);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
        
        //User 2
        updatedUser = await _userService.GetByIdAsync(userWhoRequestedFriendship);
        if (updatedUser != null)
        {
            updatedUser.Friends.Add(userId);
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
    }

}