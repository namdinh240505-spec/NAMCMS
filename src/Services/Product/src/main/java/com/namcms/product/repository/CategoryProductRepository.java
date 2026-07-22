package com.namcms.product.repository;

import com.namcms.product.model.CategoryProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryProductRepository extends JpaRepository<CategoryProduct, Integer> {
}
