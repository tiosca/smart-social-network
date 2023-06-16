using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace QuickMess.Business.Models;

public class Chat
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("users")]
    public IEnumerable<ObjectId> Users { get; set; } = new List<ObjectId>();
    
    [BsonElement("messages")]
    public IEnumerable<Message> Messages { get; set; } = new List<Message>();
}