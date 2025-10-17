using Microsoft.EntityFrameworkCore;
using ShopBuModels;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBuAPI.Models
{
    public class Product: ProductModel
    {
        //[ForeignKey("UserEmail")]
        //public virtual Shop? shop { get; set; }
        //public virtual ProductDetail? productDetail { get; set; }
    }
}
