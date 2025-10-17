using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopBuModels
{
    public class ShopModel
    {
        public string UserEmail { get; set; } = string.Empty;
        public string ShopName { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsBanned { get; set; } = false;

        public ShopModel() { }
        public ShopModel(string userEmail, string shopName, string image, string status, bool isBanned)
        {
            this.UserEmail = userEmail;
            this.ShopName = shopName;
            this.Image = image;
            this.Status = status;
            this.IsBanned = isBanned;
        }
    }
}
