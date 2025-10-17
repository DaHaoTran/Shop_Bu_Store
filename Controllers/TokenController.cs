using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ShopBuAPI.Controllers
{
    [Route("api/tokens")]
    [ApiController]
    public class TokensController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogin<User> _login;
        public TokensController(IConfiguration configuration, ILogin<User> login)
        {
            _configuration = configuration;
            _login = login;
        }

        /// <summary>
        /// Tạo token
        /// </summary>
        /// <param name="user">tài khoản</param>
        /// <returns>token</returns>
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateJwtToken([FromBody] User user)
        {
            if(user == null) return BadRequest();
            //Kiểm tra tồn tại thông tin user
            var existingUser = await _login.AuthenticateUser(user);
            if(existingUser == null) { return NotFound(); }

            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["Key"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            // Tạo khóa bí mật từ secret key
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Tạo các claims từ thông tin người dùng
            var claims = new List<Claim>()
            {
                new Claim("user email", existingUser.Email),
                new Claim("phone number", existingUser.PhoneNumber)
            };

            // Tạo token
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials);

            return Ok(new JwtSecurityTokenHandler().WriteToken(token));
        }

        /// <summary>
        /// Giải mã token
        /// </summary>
        /// <param name="token">token (jwt)</param>
        /// <returns>Chars</returns>
        [HttpPost("solve")]
        public IActionResult SolveToken([FromBody] string token)
        {
            // Bộ giải mã JWT
            var handler = new JwtSecurityTokenHandler();

            // Kiểm tra xem token có hợp lệ không
            if (!handler.CanReadToken(token)) { return Problem(); }
            // Giải mã token
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy payload từ token
            var claims = jwtToken.Claims;

            var code = claims.Where(x => x.Type == "user email").First();
            if (code!.Value == null) { return NotFound(); }

            return Ok(code.Value);
        }
    }
}
