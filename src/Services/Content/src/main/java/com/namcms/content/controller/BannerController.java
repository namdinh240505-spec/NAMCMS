package com.namcms.content.controller;

import com.namcms.content.model.Banner;
import com.namcms.content.repository.BannerRepository;
import com.namcms.shared.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    @GetMapping
    public ResponseEntity<List<Banner>> getActiveBanners() {
        return ResponseEntity.ok(bannerRepository.findByIsActive(true));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Banner>> getAllBanners() {
        return ResponseEntity.ok(bannerRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Banner banner) {
        if (banner.getTitle() == null || banner.getTitle().trim().isEmpty() ||
            banner.getImageUrl() == null || banner.getImageUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tiêu đề và đường dẫn hình ảnh không được để trống."));
        }
        Banner saved = bannerRepository.save(banner);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Banner banner) {
        Banner existing = bannerRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Banner không tồn tại."));
        }
        
        if (banner.getTitle() == null || banner.getTitle().trim().isEmpty() ||
            banner.getImageUrl() == null || banner.getImageUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tiêu đề và đường dẫn hình ảnh không được để trống."));
        }

        existing.setTitle(banner.getTitle());
        existing.setDescription(banner.getDescription());
        existing.setImageUrl(banner.getImageUrl());
        existing.setLinkUrl(banner.getLinkUrl());
        existing.setPosition(banner.getPosition());
        existing.setSortOrder(banner.getSortOrder());
        existing.setActive(banner.isActive());

        Banner saved = bannerRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!bannerRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Banner không tồn tại."));
        }
        bannerRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa banner thành công!", null));
    }
}
