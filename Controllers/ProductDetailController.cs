using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ShopBuStore.Models;
using ShopBuStore.Utility;
using System.Net.Http;

namespace ShopBuStore.Controllers
{
    public class ProductDetailController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private static string apiUrl = string.Empty;
        public ProductDetailController(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
            if (_configuration == null) return;
            apiUrl = _configuration["apiUrl"];
        }

        public async Task<IActionResult> Edit(string id)
        {
            if (string.IsNullOrEmpty(Login.Email)) return RedirectToAction("Login", "Home");
            try
            {
                //Call API
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                var request = await _httpClient.GetAsync($"{apiUrl}/productDetails/products/{id}/productDetails");
                if (!request.IsSuccessStatusCode) return View("Error", new ErrorViewModel { RequestId = request.ReasonPhrase });
                var response = await request.Content.ReadAsStringAsync();
                return View(JsonConvert.DeserializeObject<List<ProductDetail>>(response)![0]);
            }
            catch (Exception ex)
            {
                return View("Error", new ErrorViewModel { RequestId = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Edit(ProductDetail detail)
        {
            try
            {
                detail.Description = detail.Description.Trim();
                //Call API
                StringContent content = new StringContent(JsonConvert.SerializeObject(detail), System.Text.Encoding.UTF8, "application/json");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                var request = await _httpClient.PutAsync($"{apiUrl}/productDetails/{detail.DetailId}", content);
                if (!request.IsSuccessStatusCode) return View("Error", new ErrorViewModel { RequestId = request.ReasonPhrase });
                //Update local
                Storage.message = $"{detail.ProductId} description updated successfully.";
                var product = Storage.products.Where(p => p.ProductId == detail.ProductId).FirstOrDefault();
                if (product != null) product.Description = detail.Description;
                return RedirectToAction("Index", "Product");
            }
            catch (Exception ex)
            {
                return View("Error", new ErrorViewModel { RequestId = ex.Message });
            }
        }
    }
}
