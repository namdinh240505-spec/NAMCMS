-- =============================================
-- NamCMS - Order Service Database
-- Database: namcms_order_db
-- Tables: Orders, OrderDetails
-- Note: No FOREIGN KEY to Customers/Products (cross-service)
-- =============================================

CREATE DATABASE IF NOT EXISTS namcms_order_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_order_db;

-- 1. Orders (Đơn hàng)
CREATE TABLE IF NOT EXISTS Orders (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CustomerId INT NOT NULL COMMENT 'Reference to Auth DB - Customers.Id',
    Status INT NOT NULL DEFAULT 0 COMMENT '0: Chờ duyệt, 1: Đang giao, 2: Đã xong',
    Notes TEXT NULL,
    ShippingAddress VARCHAR(500) NULL,
    ShippingPhone VARCHAR(20) NULL,
    ShippingName VARCHAR(200) NULL,
    PaymentMethod VARCHAR(20) NOT NULL DEFAULT 'COD',
    TransactionId VARCHAR(100) NULL COMMENT 'Mã giao dịch VNPay'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. OrderDetails (Chi tiết đơn hàng)
CREATE TABLE IF NOT EXISTS OrderDetails (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL COMMENT 'Reference to Product DB - Products.Id',
    Quantity INT NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(18,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
