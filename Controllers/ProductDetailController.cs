using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopBuAPI.Models;
using ShopBuAPI.Services.Interfaces;

namespace ShopBuAPI.Controllers
{
    [Route("api/productDetails")]
    [ApiController]
    [Authorize]
    public class ProductDetailController : ControllerBase
    {
        private readonly ICRUD<ProductDetail> _cRUD;
        private readonly IFilter<ProductDetail> _filter;
        public ProductDetailController(ICRUD<ProductDetail> cRUD, IFilter<ProductDetail> filter)
        {
            _cRUD = cRUD;
            _filter = filter;
        }

        /// <summary>
        /// Lấy thông tin chi tiết sản phẩm theo Id
        /// </summary>
        /// <param name="detailId">Id chi tiết</param>
        /// <returns>chi tiết sản phẩm</returns>
        [HttpGet("{detailId}")]
        public async Task<IActionResult> GetDetailById(string detailId)
        {
            var detail = await _filter.SearchWithPrimaryKey(detailId);
            if(detail == null) return NotFound();
            return Ok(detail);
        }

        /// <summary>
        /// Lấy danh sách chi tiết sản phẩm theo Id sản phẩm
        /// </summary>
        /// <param name="productId">Id sản phẩm</param>
        /// <param name="_limit">Số trường dữ liệu lấy</param>
        /// <param name="_sort">sắp xếp tăng (asc) hoặc giảm dần (desc) thuộc tính DetailId</param>
        /// <returns>danh sách chi tiết sản phẩm</returns>
        [HttpGet("products/{productId}/productDetails")]
        public async Task<IActionResult> GetDetailsByProductId(string productId, [FromQuery] int? _limit, [FromQuery] string? _sort)
        {
            return Ok(await _filter.SearchWithSearchString(productId, _limit, _sort));
        }

        /// <summary>
        /// Tạo mới chi tiết sản phẩm
        /// </summary>
        /// <param name="detail">chi tiết sản phẩm</param>
        /// <returns>chi tiết sản phẩm tạo mới</returns>
        [HttpPost]
        public async Task<IActionResult> CreateDetail(ProductDetail detail)
        {
            if (detail == null) return BadRequest();
            await _cRUD.CreateNew(detail);
            var createdDetail = await _filter.SearchWithPrimaryKey(detail.DetailId);
            if (createdDetail == null) return NotFound();
            return Ok(createdDetail);
        }

        /// <summary>
        /// Cập nhập chi tiết sản phẩm
        /// </summary>
        /// <param name="detailId">Id chi tiết sản phẩm</param>
        /// <param name="detail">chi tiết sản phẩm</param>
        /// <returns>chi tiết sản phẩm đã cập nhập</returns>
        [HttpPut("{detailId}")]
        public async Task<IActionResult> UpdateDetail(string detailId, ProductDetail detail)
        {
            if (detail == null) return BadRequest();
            if(detailId != detail.DetailId) return BadRequest("Detail ID mismatch");
            await _cRUD.Update(detail);
            var updatedDetail = await _filter.SearchWithPrimaryKey(detail.DetailId);
            if (updatedDetail == null) return NotFound();
            return Ok(updatedDetail);
        }

        /// <summary>
        /// Xóa chi tiết sản phẩm
        /// </summary>
        /// <param name="detailId">Id chi tiết sản phẩm</param>
        /// <returns>chi tiết sản phẩm đã xóa</returns>
        [HttpDelete("{detailId}")]
        public async Task<IActionResult> DeleteDetail(string detailId)
        {
            var existingProduct = await _filter.SearchWithPrimaryKey(detailId);
            if (existingProduct == null) return NotFound();
            return Ok(await _cRUD.Delete(existingProduct));
        }
    }
}
