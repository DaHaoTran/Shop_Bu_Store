using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopBuModels
{
    public class UserModel
    {
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ShippingList { get; set; } = string.Empty;
        public string CartList { get; set; } = string.Empty;
        public string OrderList { get; set; } = string.Empty;

        public UserModel() { }
        public UserModel(string email, 
            string phoneNumber, 
            string password, 
            string shippingList, 
            string cartList, 
            string orderList)
        {
            this.Email = email;
            this.PhoneNumber = phoneNumber;
            this.Password = password;
            this.ShippingList = shippingList;
            this.CartList = cartList;
            this.OrderList = orderList;
        }
    }
}
