package com.namcms.product.controller;

import com.namcms.product.model.CategoryProduct;
import com.namcms.product.model.Product;
import com.namcms.product.model.ProductImage;
import com.namcms.product.repository.CategoryProductRepository;
import com.namcms.product.repository.ProductImageRepository;
import com.namcms.product.repository.ProductRepository;
import com.namcms.shared.dto.ApiResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private CategoryProductRepository categoryRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "12") Integer pageSize) {

        StringBuilder jpql = new StringBuilder("SELECT p FROM Product p WHERE 1=1");
        StringBuilder countJpql = new StringBuilder("SELECT COUNT(p) FROM Product p WHERE 1=1");
        Map<String, Object> params = new HashMap<>();

        if (search != null && !search.trim().isEmpty()) {
            String searchCond = " AND (LOWER(p.name) LIKE :search OR LOWER(p.description) LIKE :search)";
            jpql.append(searchCond);
            countJpql.append(searchCond);
            params.put("search", "%" + search.trim().toLowerCase() + "%");
        }

        if (categoryId != null) {
            String categoryCond = " AND p.categoryProductId = :categoryId";
            jpql.append(categoryCond);
            countJpql.append(categoryCond);
            params.put("categoryId", categoryId);
        }

        if (brand != null && !brand.trim().isEmpty()) {
            String brandCond = " AND p.brand = :brand";
            jpql.append(brandCond);
            countJpql.append(brandCond);
            params.put("brand", brand);
        }

        if (minPrice != null) {
            String minPriceCond = " AND p.price >= :minPrice";
            jpql.append(minPriceCond);
            countJpql.append(minPriceCond);
            params.put("minPrice", minPrice);
        }

        if (maxPrice != null) {
            String maxPriceCond = " AND p.price <= :maxPrice";
            jpql.append(maxPriceCond);
            countJpql.append(maxPriceCond);
            params.put("maxPrice", maxPrice);
        }

        if (sortBy != null) {
            switch (sortBy) {
                case "priceAsc":
                    jpql.append(" ORDER BY p.price ASC");
                    break;
                case "priceDesc":
                    jpql.append(" ORDER BY p.price DESC");
                    break;
                case "newest":
                    jpql.append(" ORDER BY p.id DESC");
                    break;
                default:
                    jpql.append(" ORDER BY p.id ASC");
                    break;
            }
        } else {
            jpql.append(" ORDER BY p.id ASC");
        }

        TypedQuery<Product> query = entityManager.createQuery(jpql.toString(), Product.class);
        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql.toString(), Long.class);

        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
            countQuery.setParameter(entry.getKey(), entry.getValue());
        }

        Long totalCount = countQuery.getSingleResult();

        int firstResult = (page - 1) * pageSize;
        query.setFirstResult(firstResult);
        query.setMaxResults(pageSize);

        List<Product> products = query.getResultList();

        List<CategoryProduct> categories = categoryRepository.findAll();
        for (Product p : products) {
            if (p.getCategoryProductId() != null) {
                categories.stream()
                        .filter(c -> c.getId().equals(p.getCategoryProductId()))
                        .findFirst()
                        .ifPresent(c -> p.setCategoryName(c.getName()));
            }
            List<ProductImage> imgs = productImageRepository.findByProductId(p.getId());
            p.setImages(imgs.stream().map(ProductImage::getImageUrl).collect(Collectors.toList()));
            if (!imgs.isEmpty()) {
                p.setImageUrl(imgs.get(0).getImageUrl());
            }
        }

        int totalPages = (int) Math.ceil((double) totalCount / pageSize);

        Map<String, Object> response = new HashMap<>();
        response.put("data", products);
        response.put("totalCount", totalCount);
        response.put("totalPages", totalPages > 0 ? totalPages : 1);
        response.put("page", page);
        response.put("pageSize", pageSize);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/brands")
    public ResponseEntity<?> getBrands() {
        List<String> brands = entityManager.createQuery(
                "SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL AND p.brand <> ''", 
                String.class).getResultList();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<?> getBestSellers(@RequestParam(value = "limit", defaultValue = "8") Integer limit) {
        TypedQuery<Product> query = entityManager.createQuery("SELECT p FROM Product p ORDER BY p.id DESC", Product.class);
        query.setMaxResults(limit);
        List<Product> products = query.getResultList();

        List<CategoryProduct> categories = categoryRepository.findAll();
        for (Product p : products) {
            if (p.getCategoryProductId() != null) {
                categories.stream()
                        .filter(c -> c.getId().equals(p.getCategoryProductId()))
                        .findFirst()
                        .ifPresent(c -> p.setCategoryName(c.getName()));
            }
            List<ProductImage> imgs = productImageRepository.findByProductId(p.getId());
            p.setImages(imgs.stream().map(ProductImage::getImageUrl).collect(Collectors.toList()));
            if (!imgs.isEmpty()) {
                p.setImageUrl(imgs.get(0).getImageUrl());
            }
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Product p = productRepository.findById(id).orElse(null);
        if (p == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (p.getCategoryProductId() != null) {
            categoryRepository.findById(p.getCategoryProductId())
                    .ifPresent(c -> p.setCategoryName(c.getName()));
        }

        List<ProductImage> imgs = productImageRepository.findByProductId(p.getId());
        p.setImages(imgs.stream().map(ProductImage::getImageUrl).collect(Collectors.toList()));
        if (!imgs.isEmpty()) {
            p.setImageUrl(imgs.get(0).getImageUrl());
        }

        List<Product> related = new ArrayList<>();
        if (p.getCategoryProductId() != null) {
            TypedQuery<Product> query = entityManager.createQuery(
                "SELECT pr FROM Product pr WHERE pr.categoryProductId = :catId AND pr.id <> :id", Product.class);
            query.setParameter("catId", p.getCategoryProductId());
            query.setParameter("id", id);
            query.setMaxResults(4);
            related = query.getResultList();
            for (Product rp : related) {
                List<ProductImage> rpImgs = productImageRepository.findByProductId(rp.getId());
                rp.setImages(rpImgs.stream().map(ProductImage::getImageUrl).collect(Collectors.toList()));
                if (!rpImgs.isEmpty()) {
                    rp.setImageUrl(rpImgs.get(0).getImageUrl());
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("product", p);
        response.put("relatedProducts", related);
        return ResponseEntity.ok(response);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @Transactional
    public ResponseEntity<?> create(
            @ModelAttribute Product product,
            @RequestParam(value = "ImageFiles", required = false) MultipartFile[] imageFiles) throws IOException {

        if (product.getName() == null || product.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tên sản phẩm không được trống."));
        }

        // Save base product
        Product savedProduct = productRepository.save(product);

        // Process images
        if (imageFiles != null && imageFiles.length > 0) {
            saveProductImages(savedProduct.getId(), imageFiles);
        }

        // Reload to map fields
        return ResponseEntity.ok(reloadProduct(savedProduct.getId()));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @Transactional
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @ModelAttribute Product product,
            @RequestParam(value = "ImageFiles", required = false) MultipartFile[] imageFiles) throws IOException {

        Product existing = productRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Sản phẩm không tồn tại."));
        }

        existing.setName(product.getName());
        existing.setPrice(product.getPrice());
        existing.setStockQuantity(product.getStockQuantity());
        existing.setBrand(product.getBrand());
        existing.setColors(product.getColors());
        existing.setCategoryProductId(product.getCategoryProductId());
        existing.setDescription(product.getDescription());
        existing.setDetails(product.getDetails());

        productRepository.save(existing);

        // Update images if new files provided
        if (imageFiles != null && imageFiles.length > 0) {
            // Delete old physical files if needed, or simply delete DB records
            productImageRepository.deleteByProductId(id);
            saveProductImages(id, imageFiles);
        }

        return ResponseEntity.ok(reloadProduct(id));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Sản phẩm không tồn tại."));
        }
        productRepository.deleteById(id);
        productImageRepository.deleteByProductId(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa sản phẩm thành công!", null));
    }

    private void saveProductImages(Integer productId, MultipartFile[] files) throws IOException {
        File directory = new File(uploadPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            if (file.isEmpty()) continue;

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueName = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(uploadPath, uniqueName);
            Files.write(filePath, file.getBytes());

            ProductImage img = new ProductImage();
            img.setProductId(productId);
            img.setImageUrl("/uploads/products/" + uniqueName);
            img.setSortOrder(i);
            productImageRepository.save(img);
        }
    }

    private Product reloadProduct(Integer id) {
        Product p = productRepository.findById(id).orElse(null);
        if (p != null) {
            if (p.getCategoryProductId() != null) {
                categoryRepository.findById(p.getCategoryProductId())
                        .ifPresent(c -> p.setCategoryName(c.getName()));
            }
            List<ProductImage> imgs = productImageRepository.findByProductId(p.getId());
            p.setImages(imgs.stream().map(ProductImage::getImageUrl).collect(Collectors.toList()));
            if (!imgs.isEmpty()) {
                p.setImageUrl(imgs.get(0).getImageUrl());
            }
        }
        return p;
    }

    // ==========================================
    // Internal API for inter-service communication
    // ==========================================

    /**
     * Get product price by ID (used by Order Service)
     */
    @GetMapping("/{id}/price")
    public ResponseEntity<?> getPrice(@PathVariable Integer id) {
        Product p = productRepository.findById(id).orElse(null);
        if (p == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(p.getPrice());
    }

    /**
     * Get product stock by ID
     */
    @GetMapping("/{id}/stock")
    public ResponseEntity<?> getStock(@PathVariable Integer id) {
        Product p = productRepository.findById(id).orElse(null);
        if (p == null) {
            return ResponseEntity.notFound().build();
        }
        
        String status;
        int qty = p.getStockQuantity();
        if (qty <= 0) {
            status = "Hết hàng";
        } else if (qty <= 5) {
            status = "Sắp hết";
        } else {
            status = "Còn nhiều";
        }

        Map<String, Object> response = new HashMap<>();
        response.put("stockQuantity", qty);
        response.put("status", status);
        response.put("lastChecked", java.time.Instant.now());

        return ResponseEntity.ok(response);
    }

    /**
     * Deduct stock quantity (used by Order Service when creating orders)
     */
    @PutMapping("/{id}/stock")
    @Transactional
    public ResponseEntity<?> deductStock(@PathVariable Integer id, @RequestParam("deduct") Integer quantity) {
        Product p = productRepository.findById(id).orElse(null);
        if (p == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Sản phẩm không tồn tại."));
        }
        if (p.getStockQuantity() < quantity) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không đủ tồn kho."));
        }
        p.setStockQuantity(p.getStockQuantity() - quantity);
        productRepository.save(p);
        return ResponseEntity.ok(ApiResponse.success("Đã trừ tồn kho.", p.getStockQuantity()));
    }
}

