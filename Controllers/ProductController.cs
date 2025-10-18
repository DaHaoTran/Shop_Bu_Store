using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Elfie.Extensions;
using Newtonsoft.Json;
using ShopBuStore.Models;
using ShopBuStore.Utility;
using System.Buffers.Text;
using System.Drawing;
using System.Threading.Tasks;

namespace ShopBuStore.Controllers
{
    public class ProductController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private static string apiUrl = string.Empty;
        public ProductController(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
            if (_configuration == null) return;
            apiUrl = _configuration["apiUrl"];
        }
        
        public async Task<IActionResult> Index()
        {
            if (string.IsNullOrEmpty(Login.Email)) return RedirectToAction("Login", "Home");
            try
            {
                if(Storage.products.Count() > 0) return View(Storage.products);
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                var request = await _httpClient.GetAsync($"{apiUrl}/products/filter?str={Login.Email}&_limit={20}");
                if(!request.IsSuccessStatusCode) return View("Error", new ErrorViewModel { RequestId = request.ReasonPhrase });
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

        public async Task<IActionResult> Search(string str)
        {
            if (string.IsNullOrEmpty(ShopBuStore.Models.Login.Email)) return RedirectToAction("Login", "Home");
            try
            {
                //Filter at local
                var productFill = Storage.products.Where(x => x.ProductName.Contains(str, StringComparison.OrdinalIgnoreCase)).ToList();
                if (productFill.Count() >= 10) return View(productFill);

                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                var request = await _httpClient.GetAsync($"{apiUrl}/products/filter?str={str}&_limit={10 - productFill.Count()}&_sort=desc");
                if (!request.IsSuccessStatusCode) return View("Error");
                var response = await request.Content.ReadAsStringAsync();
                var productsFromApi = JsonConvert.DeserializeObject<List<Product>>(response)!.ToList();
                foreach (var item in productsFromApi)
                {
                    if (productFill.Any(x => x.ProductId == item.ProductId)) continue;
                    productFill.Add(item);
                }
                return View(productFill);
            }
            catch (Exception ex)
            {
                // Log the exception (ex) as needed
                return View("Error", new ErrorViewModel { RequestId = ex.Message });
            }
        }

        public IActionResult Create()
        {
            if (string.IsNullOrEmpty(Login.Email)) return RedirectToAction("Login", "Home");;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            try
            {
                if (product.UploadFile == null || product.UploadFile.Length <= 0) return View("Error", new ErrorViewModel { RequestId = "File is empty" });

                //Set props
                product.Image = await FileOperation.ConvertIFormFileToBasee64(product.UploadFile);
                product.ProductName = product.ProductName.Trim();
                product.ProductId = CustomProperties.CreateNewCode("PD");
                product.UserEmail = Login.Email;
                product.PreviousPrice = product.CurrentPrice;
                // Call API
                StringContent content = new StringContent(JsonConvert.SerializeObject(product), System.Text.Encoding.UTF8, "application/json");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                var request = await _httpClient.PostAsync($"{apiUrl}/products", content);
                if (!request.IsSuccessStatusCode) return View("Error", new ErrorViewModel { RequestId = request.ReasonPhrase });
                var response = await request.Content.ReadAsStringAsync();
                Storage.products.Insert(0, JsonConvert.DeserializeObject<Product>(response)!);

                //Create product detail object
                ProductDetail detail = new ProductDetail()
                {
                    DetailId = CustomProperties.CreateNewCode("DT"),
                    ProductId = product.ProductId,
                    Description = product.Description.Trim()
                };
                // Call API 2
                StringContent content2 = new StringContent(JsonConvert.SerializeObject(detail), System.Text.Encoding.UTF8, "application/json");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                var request2 = await _httpClient.PostAsync($"{apiUrl}/productDetails", content2);
                if (!request2.IsSuccessStatusCode) return View("Error", new ErrorViewModel { RequestId = request.ReasonPhrase });

                Storage.message = "Create new product successfully !";
                return RedirectToAction("Index");
            } catch (Exception ex)
            {
                return View("Error", new ErrorViewModel { RequestId = ex.Message });
            }
        }

        public async Task<IActionResult> Details(string id)
        {
            if (string.IsNullOrEmpty(Login.Email)) return RedirectToAction("Login", "Home");
            try
            {
                var product = Storage.products.Where(x => x.ProductId == id).FirstOrDefault();
                if (product == null) return View(new Product());
                if (product.Description == null)
                {
                    //Call API to get product description
                    _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                    var request = await _httpClient.GetAsync($"{apiUrl}/productDetails/products/{id}/productDetails");
                    if (!request.IsSuccessStatusCode) return View(product);
                    var response = await request.Content.ReadAsStringAsync();
                    product.Description = JsonConvert.DeserializeObject<List<ProductDetail>>(response)![0].Description;
                }
                return View(product);
            }
            catch (Exception ex)
            {
                return View("Error", new ErrorViewModel { RequestId = ex.Message});
            }
        }

        public IActionResult Edit(string id)
        {
            if (string.IsNullOrEmpty(Login.Email)) return RedirectToAction("Login", "Home"); 
            var product = Storage.products.Where(x => x.ProductId == id).FirstOrDefault();
            if (product == default) return View();
            product.PreviousPrice = product.CurrentPrice;
            return View(product);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Product product)
        {
            try
            {
                //Get product to edit
                var index = Storage.products.FindIndex(x => x.ProductId == product.ProductId);
                if (index < 0) return View("Error", new ErrorViewModel { RequestId = "Not found product in local list" });
                //Set props
                product.ProductName = product.ProductName.Trim();
                product.Image = Storage.products[index].Image;
                product.PreviousPrice = Storage.products[index].CurrentPrice;
                product.Comments = Storage.products[index].Comments;
                product.UserEmail = Storage.products[index].UserEmail;
                //Call API
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                StringContent content = new StringContent(JsonConvert.SerializeObject(product), System.Text.Encoding.UTF8, "application/json");
                var request = await _httpClient.PutAsync($"{apiUrl}/products/{product.ProductId}", content);
                if (!request.IsSuccessStatusCode) return View("Error", new ErrorViewModel { RequestId = request.ReasonPhrase });
                var response = await request.Content.ReadAsStringAsync();
                //Update local list
                Storage.products[index] = JsonConvert.DeserializeObject<Product>(response)!;
                Storage.message = "Edit product successfully !";
                return RedirectToAction("Index");
            } catch (Exception ex)
            {
                return View("Error", new ErrorViewModel { RequestId = ex.Message }); 
            }
        }

        public IActionResult ImageChanging(string id)
        {
            if (string.IsNullOrEmpty(Login.Email)) return RedirectToAction("Login", "Home"); ;
            var product = Storage.products.Where(x => x.ProductId == id).FirstOrDefault();
            if (product == default) return View();
            product.PreviousPrice = product.CurrentPrice;
            return View(product);
        }

        [HttpPost]
        public async Task<IActionResult> ImageChanging(Product product)
        {
            try
            {
                if (product.UploadFile == null || product.UploadFile.Length <= 0) return View("Error", new ErrorViewModel { RequestId = "File is empty" });
                //Get product to edit
                var index = Storage.products.FindIndex(x => x.ProductId == product.ProductId);
                if (index < 0) return View("Error", new ErrorViewModel { RequestId = "Not found product in local list" });
                //Edit property
                product.Image = await FileOperation.ConvertIFormFileToBasee64(product.UploadFile);
                //Call API
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                StringContent content = new StringContent(JsonConvert.SerializeObject(product), System.Text.Encoding.UTF8, "application/json");
                var request = await _httpClient.PutAsync($"{apiUrl}/products/{product.ProductId}", content);
                if (!request.IsSuccessStatusCode) return View("Error", new ErrorViewModel { RequestId = request.ReasonPhrase });
                var response = await request.Content.ReadAsStringAsync();
                //Update local list
                Storage.products[index] = JsonConvert.DeserializeObject<Product>(response)!;
                Storage.message = "Edit product successfully !";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                return View("Error", new ErrorViewModel { RequestId = ex.Message });
            }
        }

        public IActionResult Delete(string id)
        {
            if (string.IsNullOrEmpty(Login.Email)) return RedirectToAction("Login", "Home");;
            return View(Storage.products.Where(x => x.ProductId == id).FirstOrDefault());
        }

        [HttpPost]
        public async Task<IActionResult> delete(string id)
        {
            try
            {
                //Call API
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ShopBuStore.Models.Login.Token);
                var request = await _httpClient.DeleteAsync($"{apiUrl}/products/{id}");
                if (!request.IsSuccessStatusCode) return View("Error", new ErrorViewModel { RequestId = request.ReasonPhrase });
                var response = await request.Content.ReadAsStringAsync();
                //Update local list
                Storage.products.RemoveAll(x => x.ProductId == id);
                Storage.message = $"Delete product {id} successfully !";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                return View("Error", new ErrorViewModel { RequestId = ex.Message });
            }
        }
    }
}
