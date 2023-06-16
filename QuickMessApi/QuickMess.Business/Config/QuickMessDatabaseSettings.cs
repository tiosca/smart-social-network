namespace QuickMess.Business.Config;

public class QuickMessDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string UsersCollectionName { get; set; } = null!;
    public string ChatsCollectionName { get; set; } = null!;
}