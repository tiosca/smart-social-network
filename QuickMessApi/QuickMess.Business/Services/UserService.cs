using QuickMess.Business.Config;
using QuickMess.Business.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace QuickMess.Business.Services;

public class UserService
{
    private readonly IMongoCollection<User> _userCollection;

    public UserService(
        IOptions<QuickMessDatabaseSettings> quickMessDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            quickMessDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            quickMessDatabaseSettings.Value.DatabaseName);

        _userCollection = mongoDatabase.GetCollection<User>(
            quickMessDatabaseSettings.Value.UsersCollectionName);
    }

    public async Task<List<User>> GetAllAsync() =>
        await _userCollection.Find(_ => true).ToListAsync();
    
    public async Task<List<User>> GetByMultipleIdsAsync(IEnumerable<string> ids) =>
        await _userCollection.Find(x => ids.Contains(x.Id)).ToListAsync();

    public async Task<User?> GetByIdAsync(string id) =>
        await _userCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<User?> GetUser(string username, string? password)
    {
        if (password == null)
        {
            return await _userCollection.Find(x => x.Username == username).FirstOrDefaultAsync();
        }
        return await _userCollection.Find(x => x.Username == username && x.Password == password).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(User newUser) =>
        await _userCollection.InsertOneAsync(newUser);

    public async Task UpdateUserStatus(string userId, string status)
    {
        //User 1
        var updatedUser = await GetByIdAsync(userId);
        if (updatedUser != null)
        {
            updatedUser.Status = status;
            await _userCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);
        }
    }
    
    public async Task UpdateAsync(string id, User updatedUser) =>
        await _userCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);

    public async Task RemoveAsync(string? id) =>
        await _userCollection.DeleteOneAsync(x => x.Id == id);
}