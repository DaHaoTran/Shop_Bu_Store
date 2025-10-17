using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace ShopBuModels
{
    public class ProductModel
    {
        public string ProductId { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public int Quantity { get; set; } = 0;
        public int? Sold { get; set; } = 0;
        public double CurrentPrice { get; set; } = 0.0;
        public double PreviousPrice { get; set; } = 0.0;
        public string Comments { get; set; } = string.Empty;

        public ProductModel() { }
        public ProductModel(string productId, string userEmail, string productName, string image, int quantity, double currentPrice, double previousPrice, string comments, int sold)
        {
            this.ProductId = productId;
            this.UserEmail = userEmail;
            this.ProductName = productName;
            this.Image = image;
            this.Quantity = quantity;
            this.CurrentPrice = currentPrice;
            this.PreviousPrice = previousPrice;
            this.Comments = comments;
            this.Sold = sold;
        }
    }
}
