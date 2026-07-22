package com.namcms.order.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * HTTP client for Order Service to communicate with Product Service.
 * Replaces direct database queries to the products table.
 * Uses Resilience4j Circuit Breaker for fault tolerance.
 */
@Component
public class ProductServiceClient {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceClient.class);

    private final RestTemplate restTemplate;

    @Value("${services.product-url}")
    private String productServiceUrl;

    public ProductServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Get the price of a product by ID.
     * Replaces: SELECT Price FROM products WHERE Id = :id
     */
    @CircuitBreaker(name = "productService", fallbackMethod = "getProductPriceFallback")
    public Double getProductPrice(Integer productId) {
        String url = productServiceUrl + "/api/products/" + productId + "/price";
        ResponseEntity<Double> response = restTemplate.getForEntity(url, Double.class);
        return response.getBody();
    }

    /**
     * Fallback khi Product Service không khả dụng - lấy giá sản phẩm.
     */
    public Double getProductPriceFallback(Integer productId, Throwable throwable) {
        log.warn("Circuit Breaker OPEN: Không thể lấy giá sản phẩm ID {}. Lỗi: {}", productId, throwable.getMessage());
        throw new RuntimeException("Product Service hiện không khả dụng. Vui lòng thử lại sau.");
    }

    /**
     * Deduct stock quantity for a product.
     * Replaces: UPDATE products SET StockQuantity = StockQuantity - :qty WHERE Id = :id
     */
    @CircuitBreaker(name = "productService", fallbackMethod = "deductStockFallback")
    public void deductStock(Integer productId, Integer quantity) {
        String url = productServiceUrl + "/api/products/" + productId + "/stock?deduct=" + quantity;
        restTemplate.put(url, null);
    }

    /**
     * Fallback khi Product Service không khả dụng - trừ tồn kho.
     */
    public void deductStockFallback(Integer productId, Integer quantity, Throwable throwable) {
        log.warn("Circuit Breaker OPEN: Không thể trừ tồn kho sản phẩm ID {}. Lỗi: {}", productId, throwable.getMessage());
        throw new RuntimeException("Product Service hiện không khả dụng. Không thể trừ tồn kho.");
    }

    /**
     * Get product details by ID.
     * Used to retrieve details (like name and imageUrl) for order history.
     */
    @CircuitBreaker(name = "productService", fallbackMethod = "getProductDetailsFallback")
    @SuppressWarnings("unchecked")
    public java.util.Map<String, Object> getProductDetails(Integer productId) {
        String url = productServiceUrl + "/api/products/" + productId;
        ResponseEntity<java.util.Map> response = restTemplate.getForEntity(url, java.util.Map.class);
        if (response.getBody() != null && response.getBody().containsKey("product")) {
            return (java.util.Map<String, Object>) response.getBody().get("product");
        }
        return null;
    }

    /**
     * Fallback khi Product Service không khả dụng - lấy thông tin sản phẩm.
     * Trả về thông tin mặc định thay vì lỗi.
     */
    public java.util.Map<String, Object> getProductDetailsFallback(Integer productId, Throwable throwable) {
        log.warn("Circuit Breaker OPEN: Không thể lấy chi tiết sản phẩm ID {}. Lỗi: {}", productId, throwable.getMessage());
        java.util.Map<String, Object> fallback = new java.util.HashMap<>();
        fallback.put("name", "Sản phẩm #" + productId + " (tạm thời không khả dụng)");
        fallback.put("imageUrl", "");
        return fallback;
    }
}
