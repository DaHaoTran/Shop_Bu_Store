using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopBuModels
{
    public class ProductDetailModel
    {
        public string DetailId { get; set; } = string.Empty;
        public string ProductId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public ProductDetailModel() { }
        public ProductDetailModel(string detailId, string productId, string content)
        {
            this.DetailId = detailId;
            this.ProductId = productId;
            this.Description = content;
        }
    }
}
