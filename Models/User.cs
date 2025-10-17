using ShopBuModels;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBuAPI.Models
{
    public class User: UserModel
    {
        [NotMapped]
        public string? SecretKey { get; set; }
        //public virtual OrderAddress? orderAddress { get; set; }
        //public virtual ShippingAddress? shippingAddresses { get; set; }
        //public virtual CartAddress? cartAddress { get; set; }
    }
}
