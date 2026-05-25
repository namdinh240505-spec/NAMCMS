using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
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
        public async Task<IActionResult> Create(Product product)
        {
            // Loại bỏ kiểm tra các trường không bắt buộc
            ModelState.Remove("Category");
            ModelState.Remove("CategoryProduct");

            if (ModelState.IsValid)
            {
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
        public async Task<IActionResult> Edit(int id, Product product)
        {
            if (id != product.Id) return NotFound();

            // Loại bỏ kiểm tra các trường không bắt buộc
            ModelState.Remove("Category");
            ModelState.Remove("CategoryProduct");

            if (ModelState.IsValid)
            {
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
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}