using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace QuickMess.Business.Models;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    [BsonElement("message")]
    public string? Data { get; set; }
    
    [BsonElement("sender")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Sender { get; set; }
    
    [BsonElement("receiver")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Receiver { get; set; }
    
    [BsonElement("date")]
    public DateTime Date { get; set; }
}