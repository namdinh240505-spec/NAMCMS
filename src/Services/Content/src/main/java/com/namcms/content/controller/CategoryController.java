package com.namcms.content.controller;

import com.namcms.content.model.Category;
import com.namcms.content.repository.CategoryRepository;
import com.namcms.shared.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/post-categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tên danh mục bài viết không được để trống."));
        }
        if (category.getSlug() == null || category.getSlug().trim().isEmpty()) {
            category.setSlug(category.getName().toLowerCase().replace(" ", "-"));
        }
        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Danh mục không tồn tại."));
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa danh mục thành công!", null));
    }
}
