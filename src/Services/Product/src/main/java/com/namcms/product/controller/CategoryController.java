package com.namcms.product.controller;

import com.namcms.product.model.CategoryProduct;
import com.namcms.product.repository.CategoryProductRepository;
import com.namcms.product.repository.ProductRepository;
import com.namcms.shared.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryProductRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<CategoryProduct>> getAll() {
        List<CategoryProduct> list = categoryRepository.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        CategoryProduct cat = categoryRepository.findById(id).orElse(null);
        if (cat == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cat);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CategoryProduct category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tên danh mục không được trống."));
        }
        CategoryProduct saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody CategoryProduct category) {
        CategoryProduct existing = categoryRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Danh mục không tồn tại."));
        }
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        existing.setImageUrl(category.getImageUrl());
        
        CategoryProduct saved = categoryRepository.save(existing);
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
