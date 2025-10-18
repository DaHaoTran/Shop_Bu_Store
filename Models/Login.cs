using System.ComponentModel.DataAnnotations;

namespace ShopBuStore.Models
{
    public static class Login
    {
        public static string Email { get; set; } = string.Empty;
        public static string? Token { get; set; } = string.Empty;    
    }
}
