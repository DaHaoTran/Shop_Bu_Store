namespace ShopBuAPI.Services.Interfaces
{
    public interface IFilter<T>
    {
        Task<T> SearchWithPrimaryKey(object primaryKey);
        Task<List<T>> SearchWithSearchString(string searchString, int? limit, string? sort);
    }
}
