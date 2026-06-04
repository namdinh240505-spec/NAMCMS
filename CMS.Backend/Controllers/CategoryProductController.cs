using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // DANH SÁCH DANH MỤC SẢN PHẨM (INDEX)
        // ==========================================
        public async Task<IActionResult> Index()
        {
            var data = await _context.CategoryProducts.ToListAsync();
            return View(data);
        }

        // ==========================================
        // 1. CHỨC NĂNG THÊM MỚI (CREATE)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CategoryProduct categoryProduct)
        {
            if (ModelState.IsValid)
            {
                _context.CategoryProducts.Add(categoryProduct);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }

        // ==========================================
        // 2. CHỨC NĂNG SỬA (EDIT)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var categoryProduct = await _context.CategoryProducts.FindAsync(id);
            if (categoryProduct == null) return NotFound();

            return View(categoryProduct);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CategoryProduct categoryProduct)
        {
            if (id != categoryProduct.Id) return NotFound();

            ModelState.Remove("Products");

            if (ModelState.IsValid)
            {
                _context.CategoryProducts.Update(categoryProduct);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }

        // ==========================================
        // 3. CHỨC NĂNG XÓA (DELETE)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var categoryProduct = await _context.CategoryProducts
                .FirstOrDefaultAsync(m => m.Id == id);

            if (categoryProduct == null) return NotFound();

            return View(categoryProduct);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var categoryProduct = await _context.CategoryProducts.FindAsync(id);
            if (categoryProduct != null)
            {
                _context.CategoryProducts.Remove(categoryProduct);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
