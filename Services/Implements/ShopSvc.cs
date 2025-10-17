using Microsoft.EntityFrameworkCore;
using ShopBuAPI.Context;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;

namespace ShopBuAPI.Services.Implements
{
    public class ShopSvc : ICRUD<Shop>, IFilter<Shop>
    {
        private readonly ShopDbContext _context;
        public ShopSvc(ShopDbContext context)
        {
            _context = context;
        }

        public async Task CreateNew(Shop entity)
        {
            await _context.shops.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<Shop> Delete(Shop entity)
        {
            _context.shops.Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<Shop>> Read(int? limit, int? skip, string? sort)
        {
            int uLimit = limit < 0 || limit == null ? 100 : (int)limit;
            int uSkip = skip < 0 || skip == null ? 0 : (int)skip;
            string uSort = string.IsNullOrEmpty(sort) ? "asc" : sort.ToLower();
            var shops = await _context.shops.Skip(uSkip).Take(uLimit).ToListAsync();
            switch(uSort)
            {
                case "asc":
                    shops = shops.OrderBy(s => s.ShopName).ToList();
                    break;
                case "desc":
                    shops = shops.OrderByDescending(s => s.ShopName).ToList();
                    break;
                default:
                    break;
            }
            return shops;
        }

        public async Task<Shop> SearchWithPrimaryKey(object primaryKey)
        {
            return await _context.shops.FindAsync(primaryKey);
        }

        public async Task<List<Shop>> SearchWithSearchString(string searchString, int? limit, string? sort)
        {
            int uLimit = limit < 0 || limit == null ? 100 : (int)limit;
            string uSort = string.IsNullOrEmpty(sort) ? "asc" : sort.ToLower();
            var shops = await _context.shops
                            .Where(x => x.ShopName.ToLower().Contains(searchString.ToLower()))
                            .Take(uLimit)
                            .ToListAsync();
            switch(uSort)
            {
                case "asc":
                    shops = shops.OrderBy(s => s.ShopName).ToList();
                    break;
                case "desc":
                    shops = shops.OrderByDescending(s => s.ShopName).ToList();
                    break;
                default:
                    break;
            }
            return shops;
        }

        public async Task Update(Shop entity)
        {
            var getShop = await _context.shops.FindAsync(entity.UserEmail);
            if (getShop == null) return;
            getShop.ShopName = entity.ShopName;
            getShop.Image = entity.Image;
            getShop.Status = entity.Status;
            getShop.IsBanned = entity.IsBanned;
            await _context.SaveChangesAsync();
        }
    }
}
