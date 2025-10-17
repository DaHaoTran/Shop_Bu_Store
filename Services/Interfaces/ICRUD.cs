namespace ShopBuAPI.Services.Interfaces
{
    public interface ICRUD<T>
    {
        Task<List<T>> Read(int? limit, int? skip, string? sort);
        Task CreateNew(T entity);
        Task Update(T entity);
        Task<T> Delete(T entity);
    }
}
