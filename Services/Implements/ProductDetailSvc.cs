using Microsoft.EntityFrameworkCore;
using ShopBuAPI.Context;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;

namespace ShopBuAPI.Services.Implements
{
    public class ProductDetailSvc : ICRUD<ProductDetail>, IFilter<ProductDetail>
    {
        private readonly ShopDbContext _context;
        public ProductDetailSvc(ShopDbContext context)
        {
            _context = context;
        }

        public async Task CreateNew(ProductDetail entity)
        {
            await _context.productDetails.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<ProductDetail> Delete(ProductDetail entity)
        {
            _context.productDetails.Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<ProductDetail>> Read(int? limit, int? skip, string? sort)
        {
            int uLimit = limit < 0 || limit == null ? 100 : (int)limit;
            int uSkip = skip < 0 || skip == null ? 0 : (int)skip;
            string uSort = string.IsNullOrEmpty(sort) ? "asc" : sort.ToLower();
            var details = await _context.productDetails.Skip(uSkip).Take(uLimit).ToListAsync();
            switch (uSort)
            {
                case "asc":
                    details = details.OrderBy(d => d.DetailId).ToList();
                    break;
                case "desc":
                    details = details.OrderByDescending(d => d.DetailId).ToList();
                    break;
                default:
                    break;
            }
            return details;
        }

        public async Task<ProductDetail> SearchWithPrimaryKey(object primaryKey)
        {
            return await _context.productDetails.FindAsync(primaryKey);
        }

        public async Task<List<ProductDetail>> SearchWithSearchString(string searchString, int? limit, string? sort)
        {
            int uLimit = limit < 0 || limit == null ? 100 : (int)limit;
            string uSort = string.IsNullOrEmpty(sort) ? "asc" : sort.ToLower();
            var details = await _context.productDetails
                                .Where(x => x.ProductId.ToString() == searchString.ToString())
                                .Take(uLimit)
                                .ToListAsync();
            switch (uSort)
            {
                case "asc":
                    details = details.OrderBy(d => d.DetailId).ToList();
                    break;
                case "desc":
                    details = details.OrderByDescending(d => d.DetailId).ToList();
                    break;
                default:
                    break;
            }
            return details;
        }

        public async Task Update(ProductDetail entity)
        {
            var existingDetail = await _context.productDetails.FindAsync(entity.DetailId);
            if (existingDetail == null) return;
            existingDetail.Description = entity.Description;
            await _context.SaveChangesAsync();
        }
    }
}
