-- =============================================
-- NamCMS - Product Service Database
-- Database: namcms_product_db
-- Tables: CategoryProducts, Products, ProductImages
-- =============================================

CREATE DATABASE IF NOT EXISTS namcms_product_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_product_db;

-- 1. CategoryProducts (Danh mục sản phẩm)
CREATE TABLE IF NOT EXISTS CategoryProducts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT NULL,
    ImageUrl VARCHAR(500) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Products
CREATE TABLE IF NOT EXISTS Products (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(300) NOT NULL,
    Description TEXT NULL,
    Price DECIMAL(18,2) NOT NULL DEFAULT 0,
    StockQuantity INT NOT NULL DEFAULT 0,
    ImageUrl VARCHAR(500) NULL,
    Brand VARCHAR(100) NULL,
    Colors VARCHAR(500) NULL,
    CategoryProductId INT NOT NULL,
    Details TEXT NULL,
    FOREIGN KEY (CategoryProductId) REFERENCES CategoryProducts(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. ProductImages
CREATE TABLE IF NOT EXISTS ProductImages (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ImageUrl VARCHAR(500) NOT NULL,
    SortOrder INT NOT NULL DEFAULT 0,
    ProductId INT NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED DATA
INSERT INTO CategoryProducts (Name, Description) VALUES
('Điện thoại', 'Điện thoại di động & Smartphone'),
('Laptop', 'Máy tính xách tay'),
('Phụ kiện', 'Phụ kiện công nghệ'),
('Gia dụng', 'Thiết bị điện gia dụng');
