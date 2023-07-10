using QuickMess.Business.Config;
using QuickMess.Business.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<QuickMessDatabaseSettings>(
    builder.Configuration.GetSection("QuickMessDatabase"));

builder.Services
    .AddTransient<UserService>()
    .AddTransient<ChatService>()
    .AddTransient<FriendshipService>()
    .AddTransient<PostService>();

builder.Services.AddControllers();

var app = builder.Build();

app.MapGet("/", () => "Back-end is running!");
app.MapControllers();

app.Run();