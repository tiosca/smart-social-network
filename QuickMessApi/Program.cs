using QuickMess.Business.Config;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<QuickMessDatabaseSettings>(
    builder.Configuration.GetSection("QuickMessDatabase"));
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();