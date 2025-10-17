using Microsoft.EntityFrameworkCore;
using ShopBuAPI.Context;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;

namespace ShopBuAPI.Services.Implements
{
    public class ProductSvc : ICRUD<Product>, IFilter<Product>
    {
        private readonly ShopDbContext _context;
        public ProductSvc(ShopDbContext context)
        {
            _context = context;
        }

        public async Task CreateNew(Product entity)
        {
            await _context.products.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<Product> Delete(Product entity)
        {
            _context.products.Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<Product>> Read(int? limit, int? skip, string? sort)
        {
            int uLimit = limit < 0 || limit == null ? 100 : (int)limit;
            int uSkip = skip < 0 || skip == null ? 0 : (int)skip;
            string uSort = string.IsNullOrEmpty(sort) ? "asc" : sort.ToLower();
            var products = await _context.products.Skip(uSkip).Take(uLimit).ToListAsync();
            switch (uSort)
            {
                case "asc":
                    products = products.OrderBy(p => p.Sold).ToList();
                    break;
                case "desc":
                    products = products.OrderByDescending(p => p.Sold).ToList();
                    break;
                default:
                    break;
            }
            return products;
        }

        public async Task<Product> SearchWithPrimaryKey(object primaryKey)
        {
            return await _context.products.FindAsync(primaryKey);
        }

        public async Task<List<Product>> SearchWithSearchString(string searchString, int? limit, string? sort)
        {
            int uLimit = limit < 0 || limit == null ? 100 : (int)limit;
            string uSort = string.IsNullOrEmpty(sort) ? "asc" : sort.ToLower();
            var products = await _context.products
                            .Where(x => x.ProductName.ToLower().Contains(searchString.ToLower()))
                            .Take(uLimit)
                            .ToListAsync();
            var products2 = uLimit - products.Count() > 0 ? await _context.products
                                                            .Where(x => x.UserEmail.ToLower() == searchString.ToLower())
                                                            .Take(uLimit - products.Count())
                                                            .ToListAsync() : new List<Product>();
            var mainProducts = products
                                .Concat(products2)
                                .GroupBy(x => x.ProductId)
                                .Select(x => x.First())
                                .ToList();
            switch (uSort)
            {
                case "asc":
                    mainProducts = mainProducts.OrderBy(p => p.Sold).ToList();
                    break;
                case "desc":
                    mainProducts = mainProducts.OrderByDescending(p => p.Sold).ToList();
                    break;
                default:
                    break;
            }
            return mainProducts;
        }

        public async Task Update(Product entity)
        {
            var getProduct = await _context.products.FindAsync(entity.ProductId);   
            if (getProduct == null) return;
            getProduct.ProductName = entity.ProductName;
            getProduct.Image = entity.Image;
            getProduct.Quantity = entity.Quantity;
            getProduct.CurrentPrice = entity.CurrentPrice;
            getProduct.PreviousPrice = entity.PreviousPrice;
            await _context.SaveChangesAsync();
        }
    }
}
