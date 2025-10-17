using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;

namespace ShopBuAPI.Controllers
{
    [Route("api/shops")]
    [ApiController]
    [Authorize]
    public class ShopController : ControllerBase
    {
        private readonly ICRUD<Shop> _cRUD;
        private readonly IFilter<Shop> _filter;
        public ShopController(ICRUD<Shop> cRUD, IFilter<Shop> filter)
        {
            _cRUD = cRUD;
            _filter = filter;
        }

        /// <summary>
        /// Lấy danh sách cửa hàng
        /// </summary>
        /// <param name="_limit">Số trường dữ liệu lấy</param>
        /// <param name="_skip">Số trường dữ liệu bỏ qua</param>
        /// <param name="_sort">sắp xếp tăng (asc) hoặc giảm dần (desc) thuộc tính ShopName</param>
        /// <returns>danh sách cửa hàng</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllShops([FromQuery] int? _limit, [FromQuery] int? _skip, [FromQuery] string? _sort)
        {
            var shops = await _cRUD.Read(_limit, _skip, _sort);
            return Ok(shops);
        }

        /// <summary>
        /// Lấy thông tin cửa hàng theo email người dùng
        /// </summary>
        /// <param name="userEmail">email người dùng</param>
        /// <returns>cửa hàng</returns>
        [HttpGet("{userEmail}")]
        public async Task<IActionResult> GetShopByUserEmail(string userEmail)
        {
            var shop = await _filter.SearchWithPrimaryKey(userEmail);
            if (shop == null)
            {
                return NotFound();
            }
            return Ok(shop);
        }

        /// <summary>
        /// Lấy danh sách cửa hàng theo chuỗi tìm kiếm
        /// </summary>
        /// <param name="str">chuỗi tìm kiếm</param>
        /// <param name="_limit">Số trường dữ liệu lấy</param>
        /// <param name="_sort">sắp xếp tăng (asc) hoặc giảm dần (desc) thuộc tính ShopName</param>
        /// <returns>danh sách cửa hàng</returns>
        [HttpGet("filter")]
        public async Task<IActionResult> FillterShops([FromQuery] string str, [FromQuery] int? _limit, [FromQuery] string? _sort)
        {
            return Ok(await _filter.SearchWithSearchString(str, _limit, _sort));
        }

        /// <summary>
        /// Tạo mới cửa hàng
        /// </summary>
        /// <param name="shop">cửa hàng</param>
        /// <returns>cửa hàng tạo mới</returns>
        [HttpPost]
        public async Task<IActionResult> CreateShop([FromBody] Shop shop)
        {
            if (shop == null)
            {
                return BadRequest();
            }
            await _cRUD.CreateNew(shop);
            var createdShop = await _filter.SearchWithPrimaryKey(shop.UserEmail);
            if(createdShop == null)
            {
                return NotFound();
            }
            return Ok(createdShop);
        }
        
        /// <summary>
        /// Chỉnh sửa thông tin cửa hàng
        /// </summary>
        /// <param name="userEmail">email người dùng</param>
        /// <param name="shop"></param>
        /// <returns>cửa hàng đã chỉnh sửa</returns>
        [HttpPut("{userEmail}")]
        public async Task<IActionResult> UpdateShop(string userEmail, [FromBody] Shop shop)
        {
            if (shop == null) return BadRequest();
            if(userEmail != shop.UserEmail) return BadRequest("User email mismatch");
            await _cRUD.Update(shop);
            var updatedShop = await _filter.SearchWithPrimaryKey(shop.UserEmail);
            if (updatedShop == null)
            {
                return NotFound();
            }
            return Ok(updatedShop);
        }

        /// <summary>
        /// Xóa cửa hàng
        /// </summary>
        /// <param name="userEmail">email người dùng</param>
        /// <returns>cửa hàng đã xóa</returns>
        [HttpDelete("{userEmail}")]
        public async Task<IActionResult> DeleteShop(string userEmail)
        {
            var shopToDelete = await _filter.SearchWithPrimaryKey(userEmail);
            if (shopToDelete == null)
            {
                return NotFound();
            }
            return Ok(await _cRUD.Delete(shopToDelete));
        }
    }
}
