using System.Collections.Immutable;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace QuickMess.Business.Models;
public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    [BsonElement("username")]
    public string Username { get; set; } = null!;

    [BsonElement("password")]
    public string Password { get; set; } = null!;
    
    [BsonElement("birthDay")]
    public DateTime BirthDay { get; set; }
    
    [BsonElement("firstName")]
    public string FirstName { get; set; } = null!;
    
    [BsonElement("lastName")]
    public string LastName { get; set; } = null!;
    
    [BsonElement("email")]
    public string Email { get; set; } = null!;
    
    [BsonElement("role")]
    public string Role { get; set; } = null!;
    
    [BsonElement("gender")]
    public string Gender { get; set; } = null!;
    
    [BsonElement("city")]
    public string City { get; set; } = null!;
    
    [BsonElement("country")]
    public string Country { get; set; } = null!;
    
    [BsonElement("status")]
    public string Status { get; set; } = null!;
    
    [BsonElement("profileImagePath")]
    public string ProfileImagePath { get; set; } = null!;
    
    [BsonElement("posts")]
    public IEnumerable<Post> Posts { get; set; } = new List<Post>();

    [BsonElement("friends")]
    [BsonRepresentation(BsonType.ObjectId)]
    public HashSet<string> Friends { get; set; } = new();
    
    [BsonElement("friendRequests")]
    [BsonRepresentation(BsonType.ObjectId)]
    public HashSet<string> FriendRequests { get; set; } = new();
    
    [BsonElement("friendRequestsSentByMe")]
    [BsonRepresentation(BsonType.ObjectId)]
    public HashSet<string> FriendRequestsSentByMe { get; set; } = new();
}