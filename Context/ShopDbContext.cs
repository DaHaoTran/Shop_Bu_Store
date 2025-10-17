using Microsoft.EntityFrameworkCore;
using ShopBuAPI.Models;
using System.Text.Json.Nodes;

namespace ShopBuAPI.Context
{
    public class ShopDbContext : DbContext
    {
        public DbSet<Shop> shops { get; set; }
        public DbSet<Product> products { get; set; }
        public DbSet<ProductDetail> productDetails { get; set; }
        public DbSet<User> users { get; set; }

        public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Shop Table
            modelBuilder.Entity<Shop>()
                .HasKey(x => x.UserEmail);

            //Product Table
            modelBuilder.Entity<Product>()
                .HasKey(x => x.ProductId);

            //ProductDetail Table
            modelBuilder.Entity<ProductDetail>()
                .HasKey(x => x.DetailId);

            //User Table
            modelBuilder.Entity<User>()
                .HasKey(x => x.Email);
        }
    }
}
