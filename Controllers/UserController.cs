using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;

namespace ShopBuAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ICRUD<User> _cRUD;
        private readonly IFilter<User> _filter;
        private readonly IConfiguration _configuration;
        public UserController(ICRUD<User> cRUD, IFilter<User> filter, IConfiguration configuration)
        {
            _cRUD = cRUD;
            _filter = filter;
            _configuration = configuration;
        }

        /// <summary>
        /// Lấy danh sách tất cả người dùng
        /// </summary>
        /// <param name="_limit">số trường dữ liệu lấy</param>
        /// <param name="_skip">số trường dữ liệu bỏ qua</param>
        /// <param name="_sort">sắp xếp tăng (asc) hoặc giảm dần (desc) thuộc tính ShippingAddress</param>
        /// <returns>danh sách người dùng</returns>
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers([FromQuery] int? _limit, [FromQuery] int? _skip, [FromQuery] string? _sort)
        {
            return Ok(await _cRUD.Read(_limit, _skip, _sort));
        }

        /// <summary>
        /// Lấy thông tin người dùng theo email
        /// </summary>
        /// <param name="email">email</param>
        /// <returns>thông tin người dùng</returns>
        [Authorize]
        [HttpGet("{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _filter.SearchWithPrimaryKey(email);
            if (user == null) return NotFound();
            return Ok(user);
        }

        /// <summary>
        /// Lấy danh sách người dùng theo chuỗi tìm kiếm
        /// </summary>
        /// <param name="str">chuỗi tìm kiếm</param>
        /// <param name="_limit">Số trường dữ liệu lấy</param>
        /// <param name="_sort">sắp xếp tăng (asc) hoặc giảm dần (desc) thuộc tính ShippingAddress</param>
        /// <returns>danh sách người dùng</returns>
        [Authorize]
        [HttpGet("filter")]
        public async Task<IActionResult> FilterUsers([FromQuery] string str, [FromQuery] int? _limit, [FromQuery] string? _sort)
        {
            return Ok(await _filter.SearchWithSearchString(str, _limit, _sort));
        }

        /// <summary>
        /// Tạo mới người dùng
        /// </summary>
        /// <param name="user">người dùng</param>
        /// <returns>thông tin người dùng tạo mới</returns>
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (_configuration == null) return Problem();
            if(user == null) return BadRequest();
            //Check if exist infor
            if (await _filter.SearchWithPrimaryKey(user.Email) != null) return Forbid("This email had been registed");
            var users = await _filter.SearchWithSearchString(user.PhoneNumber, 2, "asc");
            if (users.Count() > 0) return Forbid("This phone number had been registed");
            
            var sk = _configuration["SecretKey"];
            if(!BCrypt.Net.BCrypt.Verify(user.SecretKey, sk)) return Forbid("You do not have permission to perform this action");
            await _cRUD.CreateNew(user);
            var createdUser = await _filter.SearchWithPrimaryKey(user.Email);
            if(createdUser == null) return NotFound();
            return Ok(createdUser);
        }

        /// <summary>
        /// Cập nhập thông tin người dùng
        /// </summary>
        /// <param name="email">email</param>
        /// <param name="user">người dùng</param>
        /// <returns>thông tin người dùng đã chỉnh sửa</returns>
        [Authorize]
        [HttpPut("{email}")]
        public async Task<IActionResult> UpdateUser(string email, [FromBody] User user)
        {
            if(user == null) return BadRequest();
            if(email != user.Email) return BadRequest("Email in URL and body do not match");
            await _cRUD.Update(user);
            var updatedUser = await _filter.SearchWithPrimaryKey(user.Email);
            if(updatedUser == null) return NotFound();
            return Ok(updatedUser);
        }

        /// <summary>
        /// Xóa thông tin người dùng
        /// </summary>
        /// <param name="email">email</param>
        /// <returns>thông tin người dùng đã xóa</returns>
        [Authorize]
        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            var user = await _filter.SearchWithPrimaryKey(email);
            if(user == null) return NotFound();
            return Ok(await _cRUD.Delete(user));
        }
    }
}
