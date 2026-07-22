package com.namcms.content.controller;

import com.namcms.content.model.Category;
import com.namcms.content.model.Post;
import com.namcms.content.repository.CategoryRepository;
import com.namcms.content.repository.PostRepository;
import com.namcms.shared.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Post>> getAll() {
        List<Post> posts = postRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        for (Post p : posts) {
            if (p.getCategoryId() != null) {
                categories.stream()
                        .filter(c -> c.getId().equals(p.getCategoryId()))
                        .findFirst()
                        .ifPresent(c -> p.setCategoryName(c.getName()));
            }
        }
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Post post) {
        if (post.getTitle() == null || post.getTitle().trim().isEmpty() ||
            post.getContent() == null || post.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tiêu đề và nội dung không được để trống."));
        }
        
        if (post.getSlug() == null || post.getSlug().trim().isEmpty()) {
            post.setSlug(post.getTitle().toLowerCase().replace(" ", "-"));
        }

        Post saved = postRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Post p = postRepository.findById(id).orElse(null);
        if (p == null) {
            return ResponseEntity.notFound().build();
        }
        if (p.getCategoryId() != null) {
            categoryRepository.findById(p.getCategoryId())
                    .ifPresent(c -> p.setCategoryName(c.getName()));
        }
        return ResponseEntity.ok(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Post post) {
        Post existing = postRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Bài viết không tồn tại."));
        }
        
        if (post.getTitle() == null || post.getTitle().trim().isEmpty() ||
            post.getContent() == null || post.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tiêu đề và nội dung không được để trống."));
        }

        existing.setTitle(post.getTitle());
        existing.setContent(post.getContent());
        existing.setImageUrl(post.getImageUrl());
        existing.setCategoryId(post.getCategoryId());
        
        if (post.getSlug() != null && !post.getSlug().trim().isEmpty()) {
            existing.setSlug(post.getSlug());
        } else {
            existing.setSlug(post.getTitle().toLowerCase().replace(" ", "-"));
        }

        Post saved = postRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Bài viết không tồn tại."));
        }
        postRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa bài viết thành công!", null));
    }
}
