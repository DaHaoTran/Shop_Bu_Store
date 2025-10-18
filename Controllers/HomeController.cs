using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ShopBuStore.Models;
using ShopBuStore.Utility;

namespace ShopBuStore.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private static string apiUrl = string.Empty;

        public HomeController(ILogger<HomeController> logger, IConfiguration configuration, HttpClient httpClient)
        {
            _logger = logger;
            _configuration = configuration;
            _httpClient = httpClient;
            if (_configuration == null) return;
            apiUrl = _configuration["apiUrl"];
        }

        public async Task<IActionResult> Index()
        {
            if (string.IsNullOrEmpty(ShopBuStore.Models.Login.Email)) return RedirectToAction("Login", "Home");
            try
            {
                if (Storage.products.Count() > 0) return View(Storage.products);
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                var request = await _httpClient.GetAsync($"{apiUrl}/products/filter?str={ShopBuStore.Models.Login.Email}&_limit={20}&_sort=desc");
                if (!request.IsSuccessStatusCode) return View("Error");
                var response = await request.Content.ReadAsStringAsync();
                Storage.products = JsonConvert.DeserializeObject<List<Product>>(response)!.ToList();
                return View(Storage.products);
            }
            catch (Exception ex)
            {
                // Log the exception (ex) as needed
                return View("Error", new ErrorViewModel { RequestId = ex.Message });
            }
        }

        public IActionResult Login()
        {
            if (!string.IsNullOrEmpty(ShopBuStore.Models.Login.Email)) return RedirectToAction("Index", "Home");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(User user)
        {
            try
            {
                //Set props
                user.PhoneNumber = "0000000000";
                user.Email = user.Email.Trim();
                user.Password = user.Password.Trim();
                //Call Api
                //Check exist user
                StringContent content = new StringContent(JsonConvert.SerializeObject(user), System.Text.Encoding.UTF8, "application/json");
                var request = await _httpClient.PostAsync($"{apiUrl}/tokens/generate", content);
                if (!request.IsSuccessStatusCode)
                {
                    ViewBag.Message = "Email hoặc mật khẩu không đúng. Hãy thử lại !";
                    return View();
                }
                var response = await request.Content.ReadAsStringAsync();
                // Set data
                ShopBuStore.Models.Login.Email = user.Email.Trim();
                ShopBuStore.Models.Login.Token = response;
                //Check exist shop
                var urlEncode = UrlEncoder.Default.Encode(ShopBuStore.Models.Login.Email);
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                var request1 = await _httpClient.GetAsync($"{apiUrl}/shops/{urlEncode}");
                if(request1.IsSuccessStatusCode) { return RedirectToAction("Index", "Home"); }
                // Remove data
                ShopBuStore.Models.Login.Email = string.Empty;
                ShopBuStore.Models.Login.Token = string.Empty;
                return RedirectToAction("Prevent", "Home");
            }
            catch
            {
                return RedirectToAction("Error");
            }
        }

        public IActionResult Prevent()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
