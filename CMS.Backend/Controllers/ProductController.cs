using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ==========================================
        // DANH SÁCH SẢN PHẨM + LỌC THEO DANH MỤC
        // ==========================================
        public async Task<IActionResult> Index(int? categoryId)
        {
            // Bắt đầu query từ bảng Products, kèm theo thông tin CategoryProduct
            var query = _context.Products.Include(p => p.Category).AsQueryable();

            // Nếu người dùng chọn lọc theo danh mục
            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryId);
            }

            var products = await query.ToListAsync();

            // Truyền danh sách danh mục sản phẩm cho dropdown lọc
            ViewBag.Categories = new SelectList(_context.CategoryProducts, "Id", "Name", categoryId);
            ViewBag.CurrentCategoryId = categoryId;

            return View(products);
        }

        // ==========================================
        // 1. CHỨC NĂNG THÊM MỚI (CREATE)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            // Nạp danh sách danh mục sản phẩm cho Dropdown
            ViewBag.CategoryProducts = new SelectList(_context.CategoryProducts, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product, IFormFile? ImageFile)
        {
            // Loại bỏ kiểm tra các trường không bắt buộc
            ModelState.Remove("Category");
            ModelState.Remove("CategoryProduct");

            if (ModelState.IsValid)
            {
                // Xử lý upload ảnh nếu người dùng chọn file
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    product.ImageUrl = await SaveImageAsync(ImageFile);
                }

                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            // Nếu có lỗi, nạp lại danh sách danh mục
            ViewBag.CategoryProducts = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // ==========================================
        // 2. CHỨC NĂNG SỬA (EDIT)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            // Nạp danh sách danh mục cho Dropdown, chọn sẵn danh mục cũ
            ViewBag.CategoryProducts = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product product, IFormFile? ImageFile)
        {
            if (id != product.Id) return NotFound();

            // Loại bỏ kiểm tra các trường không bắt buộc
            ModelState.Remove("Category");
            ModelState.Remove("CategoryProduct");

            if (ModelState.IsValid)
            {
                // Xử lý upload ảnh mới nếu người dùng chọn file mới
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    // Xóa ảnh cũ nếu có
                    if (!string.IsNullOrEmpty(product.ImageUrl))
                    {
                        DeleteImage(product.ImageUrl);
                    }

                    // Lưu ảnh mới
                    product.ImageUrl = await SaveImageAsync(ImageFile);
                }

                _context.Products.Update(product);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            ViewBag.CategoryProducts = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // ==========================================
        // 3. CHỨC NĂNG XÓA (DELETE)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (product == null) return NotFound();

            return View(product);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                // Xóa file ảnh trên server nếu có
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    DeleteImage(product.ImageUrl);
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        // ==========================================
        // HÀM HỖ TRỢ: Lưu ảnh vào thư mục wwwroot/uploads/products
        // ==========================================
        private async Task<string> SaveImageAsync(IFormFile imageFile)
        {
            // Tạo thư mục uploads/products nếu chưa tồn tại
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "products");
            Directory.CreateDirectory(uploadsFolder);

            // Tạo tên file duy nhất để tránh trùng lặp
            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Lưu file vào thư mục
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            // Trả về đường dẫn tương đối để lưu vào Database
            return "/uploads/products/" + uniqueFileName;
        }

        // HÀM HỖ TRỢ: Xóa file ảnh khỏi server
        private void DeleteImage(string imageUrl)
        {
            var filePath = Path.Combine(_env.WebRootPath, imageUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }
    }
}