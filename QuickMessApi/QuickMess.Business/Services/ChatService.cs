using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using QuickMess.Business.Config;
using QuickMess.Business.Models;

namespace QuickMess.Business.Services;

public class ChatService
{
    private readonly IMongoCollection<Chat> _chatCollection;
    private readonly UserService _userService;

    public ChatService(
        IOptions<QuickMessDatabaseSettings> quickMessDatabaseSettings
        , UserService userService)
    {
        _userService = userService;
        var mongoClient = new MongoClient(
            quickMessDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            quickMessDatabaseSettings.Value.DatabaseName);

        _chatCollection = mongoDatabase.GetCollection<Chat>(
            quickMessDatabaseSettings.Value.ChatsCollectionName);
    }
    
        public async Task<IEnumerable<Message>> GetMessages(string user1, string user2)
        {
            var user1Id = ObjectId.Parse(user1);
            var user2Id = ObjectId.Parse(user2);

            var chat = await _chatCollection.Find(chat => chat.Users.Contains(user1Id) && chat.Users.Contains(user2Id)).FirstOrDefaultAsync();

            if (chat != null)
            {
                return chat.Messages;
            }
                return Enumerable.Empty<Message>(); // Return an empty collection if chat is null
        }

    /*
    public async Task<IEnumerable<Message>> GetMessages(string user1, string user2)
    {
        var user1Id = ObjectId.Parse(user1);
        var user2Id = ObjectId.Parse(user2);

        var chat = await _chatCollection.Find(chat => chat.Users.Contains(user1Id) && chat.Users.Contains(user2Id)).FirstOrDefaultAsync();
        return chat.Messages;
    }
    */
    public async Task<IEnumerable<Chat>> Get()
    {
        return await _chatCollection.Find(_ => true).ToListAsync();
    }

    public async Task InsertChat(string user1, string user2)
    {
        var user1Id = ObjectId.Parse(user1);
        var user2Id = ObjectId.Parse(user2);

        var chat = await _chatCollection.Find(chat => chat.Users.Contains(user1Id) && chat.Users.Contains(user2Id)).FirstOrDefaultAsync();
        if (chat == null)
        {
            await _chatCollection.InsertOneAsync(new Chat
            {
                Messages = new List<Message>(),
                Users = new []{user1Id, user2Id}
            });
        }
    }
    
    public async Task InsertMessage(string user1, string user2, Message message)
    {
        var updatedChat = await _chatCollection.Find(chat => chat.Users.Contains(ObjectId.Parse(user1)) && chat.Users.Contains(ObjectId.Parse(user2))).FirstOrDefaultAsync();
        if (updatedChat != null)
        {
            updatedChat.Messages = updatedChat.Messages.Append(message);
            await _chatCollection.ReplaceOneAsync(x => x.Id == updatedChat.Id, updatedChat);
        }
    }
}