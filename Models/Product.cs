using ShopBuModels;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBuStore.Models
{
    public class Product: ProductModel
    {
        [Required]
        public IFormFile UploadFile { get; set; }

        [NotMapped]
        [Required]
        public string Description { get; set; }
    }
}
