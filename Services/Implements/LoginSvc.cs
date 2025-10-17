using ShopBuAPI.Context;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;
using System.Threading.Tasks;

namespace ShopBuAPI.Services.Implements
{
    public class LoginSvc : ILogin<User>
    {
        private readonly ShopDbContext _context;
        public LoginSvc(ShopDbContext context)
        {
            _context = context;
        }

        public async Task<User> AuthenticateUser(User obj)
        {
            var getUser = await _context.users.FindAsync(obj.Email);
            if(getUser == null) return null;
            return BCrypt.Net.BCrypt.Verify(obj.Password, getUser.Password) ? getUser : null;
        }
    }
}
