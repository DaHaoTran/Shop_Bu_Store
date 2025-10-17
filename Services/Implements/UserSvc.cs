using Microsoft.EntityFrameworkCore;
using ShopBuAPI.Context;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;

namespace ShopBuAPI.Services.Implements
{
    public class UserSvc : ICRUD<User>, IFilter<User>
    {
        private readonly ShopDbContext _context;
        public UserSvc(ShopDbContext context)
        {
            _context = context;
        }

        public async Task CreateNew(User entity)
        {
            await _context.users.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<User> Delete(User entity)
        {
            _context.users.Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<User>> Read(int? limit, int? skip, string? sort)
        {
            int uLimit = limit < 0 || limit == null ? 100 : (int)limit;
            int uSkip = skip < 0 || skip == null ? 0 : (int)skip;
            string uSort = string.IsNullOrEmpty(sort) ? "asc" : sort.ToLower();
            var users = await _context.users.Skip(uSkip).Take(uLimit).ToListAsync();
            switch(uSort)
            {
                case "asc":
                    users = users.OrderBy(x => x.PhoneNumber).ToList();
                    break;
                case "desc":
                    users = users.OrderByDescending(x => x.PhoneNumber).ToList();
                    break;
                default:
                    break;
            }
            return users;
        }

        public async Task<User> SearchWithPrimaryKey(object primaryKey)
        {
            return await _context.users.FindAsync(primaryKey);
        }

        public async Task<List<User>> SearchWithSearchString(string searchString, int? limit, string? sort)
        {
            int uLimit = limit < 0 || limit == null ? 100 : (int)limit;
            string uSort = string.IsNullOrEmpty(sort) ? "asc" : sort.ToLower(); 
            var users = await _context.users
                            .Where(x => x.PhoneNumber.ToLower().Contains(searchString.ToLower()))
                            .Take(uLimit)
                            .ToListAsync();
            switch (uSort)
            {
                case "asc":
                    users = users.OrderBy(x => x.PhoneNumber).ToList();
                    break;
                case "desc":
                    users = users.OrderByDescending(x => x.PhoneNumber).ToList();
                    break;
                default:
                    break;
            }
            return users;
        }

        public async Task Update(User entity)
        {
            var existingUser = await _context.users.FindAsync(entity.Email);
            if (existingUser == null) return;
            existingUser.PhoneNumber = entity.PhoneNumber;
            existingUser.ShippingList = entity.ShippingList;
            existingUser.CartList = entity.CartList;
            existingUser.OrderList = entity.OrderList;
            await _context.SaveChangesAsync();
        }
    }
}
