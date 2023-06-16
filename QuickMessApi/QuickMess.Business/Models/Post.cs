using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace QuickMess.Business.Models;

public class Post
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("owner")]
    public string? Owner { get; set; }
    
    [BsonElement("message")]
    public string Message { get; set; } = null!;
    
    [BsonElement("date")]
    public DateTime Date { get; set; }
}