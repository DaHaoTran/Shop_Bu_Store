using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;

namespace ShopBuAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly ICRUD<Product> _cRUD;
        private readonly IFilter<Product> _filter;
        public ProductController(ICRUD<Product> cRUD, IFilter<Product> filter)
        {
            _cRUD = cRUD;
            _filter = filter;
        }

        /// <summary>
        /// Lấy danh sách sản phẩm
        /// </summary>
        /// <param name="_limit">số trường dữ liệu lấy</param>
        /// <param name="_skip">số trường dữ liệu bỏ qua</param>
        /// <param name="_sort">sắp xếp tăng (asc) hoặc giảm dần (desc) thuộc tính Sold</param>
        /// <returns>danh sách sản phẩm</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllProducts([FromQuery] int? _limit, [FromQuery] int? _skip, [FromQuery] string? _sort)
        {
            var products = await _cRUD.Read(_limit, _skip, _sort);
            return Ok(products);
        }

        /// <summary>
        /// Lấy thông tin sản phẩm theo id
        /// </summary>
        /// <param name="productId">id sản phẩm</param>
        /// <returns>sản phẩm</returns>
        [HttpGet("{productId}")]
        public async Task<IActionResult> GetProductById(string productId)
        {
            var product = await _filter.SearchWithPrimaryKey(productId);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        /// <summary>
        /// Thêm mới sản phẩm
        /// </summary>
        /// <param name="product">sản phẩm</param>
        /// <returns>sản phẩm tạo mới</returns>
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            if (product == null)
            {
                return BadRequest();
            }
            await _cRUD.CreateNew(product);

            var newProduct = await _filter.SearchWithPrimaryKey(product.ProductId);
            if (newProduct == null)
            {
                return NotFound();
            }
            return Ok(newProduct);
        }

        /// <summary>
        /// Sửa thông tin sản phẩm
        /// </summary>
        /// <param name="productId">id sản phẩm</param>
        /// <param name="product">sản phẩm</param>
        /// <returns>sản phẩm đã chỉnh sửa</returns>
        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateProduct(string productId, [FromBody] Product product)
        {
            if (product == null) return BadRequest();
            if(product.ProductId != productId) return BadRequest("Product ID mismatch");
            var existingProduct = await _filter.SearchWithPrimaryKey(productId);
            if (existingProduct == null)
            {
                return NotFound();
            }

            await _cRUD.Update(product);

            var updatedProduct = await _filter.SearchWithPrimaryKey(productId);
            if (updatedProduct == null)
            {
                return NotFound();
            }
            return Ok(updatedProduct);
        }

        /// <summary>
        /// Xóa sản phẩm
        /// </summary>
        /// <param name="productId">id sản phẩm</param>
        /// <returns>sản phẩm đã xóa</returns>
        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteProduct(string productId)
        {
            var existingProduct = await _filter.SearchWithPrimaryKey(productId);
            if (existingProduct == null) return NotFound();
            return Ok(await _cRUD.Delete(existingProduct));
        }

        /// <summary>
        /// Tìm kiếm các sản phẩm theo chuỗi tìm kiếm
        /// </summary>
        /// <param name="str">chuỗi tìm kiếm</param>
        /// <param name="_limit">số trường dữ liệu lấy</param>
        /// <param name="_sort">sắp xếp tăng (asc) hoặc giảm dần (desc) thuộc tính Sold</param>
        /// <returns>danh sách sản phẩm</returns>
        [HttpGet("filter")]
        public async Task<IActionResult> FilterProducts([FromQuery] string str, [FromQuery] int? _limit, [FromQuery] string? _sort)
        {
            return Ok(await _filter.SearchWithSearchString(str, _limit, _sort));
        }
    }
}
