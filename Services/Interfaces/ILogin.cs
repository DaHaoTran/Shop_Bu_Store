using ShopBuAPI.Models;

namespace ShopBuAPI.Services.Interfaces
{
    public interface ILogin<T>
    {
        Task<T> AuthenticateUser(T obj);
    }
}
