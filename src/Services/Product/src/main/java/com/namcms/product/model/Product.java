package com.namcms.product.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Column(name = "Price", nullable = false)
    private Double price;

    @Column(name = "StockQuantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "ImageUrl", length = 500)
    private String imageUrl;

    @Column(name = "Brand", length = 100)
    private String brand;

    @Column(name = "Colors", length = 200)
    private String colors;

    @Column(name = "CategoryProductId")
    private Integer categoryProductId;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Details", columnDefinition = "TEXT")
    private String details;

    @Transient
    private String categoryName;

    @Transient
    private List<String> images = new ArrayList<>();

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getColors() { return colors; }
    public void setColors(String colors) { this.colors = colors; }
    public Integer getCategoryProductId() { return categoryProductId; }
    public void setCategoryProductId(Integer categoryProductId) { this.categoryProductId = categoryProductId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
}
