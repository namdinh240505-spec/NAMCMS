-- =============================================
-- NamCMS - Khởi tạo TẤT CẢ database cho Local MySQL
-- Nguyễn Đình Nam - 2123110170
-- Chạy file này 1 lần để tạo 5 database + bảng + seed data
-- =============================================

-- =============================================
-- 1. AUTH SERVICE DATABASE
-- =============================================
CREATE DATABASE IF NOT EXISTS namcms_auth_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_auth_db;

CREATE TABLE IF NOT EXISTS Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(200) NOT NULL,
    Role VARCHAR(50) NOT NULL COMMENT 'Admin hoặc Editor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Customers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(200) NOT NULL,
    Email VARCHAR(200) NOT NULL,
    Phone VARCHAR(20) NULL,
    Address VARCHAR(500) NULL,
    Password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS CustomerAddresses (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CustomerId INT NOT NULL,
    ReceiverName VARCHAR(200) NOT NULL,
    ReceiverPhone VARCHAR(20) NOT NULL,
    AddressLine VARCHAR(500) NOT NULL,
    IsDefault TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS PasswordResetTokens (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(200) NOT NULL,
    Code VARCHAR(10) NOT NULL COMMENT 'Mã OTP 6 số',
    ExpiresAt DATETIME NOT NULL,
    IsUsed TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO Users (Username, PasswordHash, FullName, Role)
SELECT 'admin', 'admin123', 'Quản trị viên', 'Admin'
WHERE NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin');

-- =============================================
-- 2. PRODUCT SERVICE DATABASE
-- =============================================
CREATE DATABASE IF NOT EXISTS namcms_product_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_product_db;

CREATE TABLE IF NOT EXISTS CategoryProducts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT NULL,
    ImageUrl VARCHAR(500) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

CREATE TABLE IF NOT EXISTS ProductImages (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ImageUrl VARCHAR(500) NOT NULL,
    SortOrder INT NOT NULL DEFAULT 0,
    ProductId INT NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO CategoryProducts (Name, Description)
SELECT 'Điện thoại', 'Điện thoại di động & Smartphone'
WHERE NOT EXISTS (SELECT 1 FROM CategoryProducts WHERE Name = 'Điện thoại');

INSERT INTO CategoryProducts (Name, Description)
SELECT 'Laptop', 'Máy tính xách tay'
WHERE NOT EXISTS (SELECT 1 FROM CategoryProducts WHERE Name = 'Laptop');

INSERT INTO CategoryProducts (Name, Description)
SELECT 'Phụ kiện', 'Phụ kiện công nghệ'
WHERE NOT EXISTS (SELECT 1 FROM CategoryProducts WHERE Name = 'Phụ kiện');

INSERT INTO CategoryProducts (Name, Description)
SELECT 'Gia dụng', 'Thiết bị điện gia dụng'
WHERE NOT EXISTS (SELECT 1 FROM CategoryProducts WHERE Name = 'Gia dụng');

-- =============================================
-- 3. ORDER SERVICE DATABASE
-- =============================================
CREATE DATABASE IF NOT EXISTS namcms_order_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_order_db;

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

CREATE TABLE IF NOT EXISTS OrderDetails (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL COMMENT 'Reference to Product DB - Products.Id',
    Quantity INT NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(18,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 4. CONTENT SERVICE DATABASE
-- =============================================
CREATE DATABASE IF NOT EXISTS namcms_content_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_content_db;

CREATE TABLE IF NOT EXISTS Categories (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Description TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Posts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(500) NOT NULL,
    Content LONGTEXT NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ImageUrl VARCHAR(500) NULL,
    CategoryId INT NOT NULL,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Banners (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(300) NOT NULL,
    Description TEXT NULL,
    ImageUrl VARCHAR(500) NOT NULL,
    LinkUrl VARCHAR(500) NULL,
    Position VARCHAR(50) NOT NULL DEFAULT 'HomeHero',
    SortOrder INT NOT NULL DEFAULT 0,
    IsActive TINYINT(1) NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 5. CHAT SERVICE DATABASE
-- =============================================
CREATE DATABASE IF NOT EXISTS namcms_chat_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_chat_db;

CREATE TABLE IF NOT EXISTS ChatMessages (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CustomerId INT NOT NULL COMMENT 'Reference to Auth DB - Customers.Id',
    Content TEXT NOT NULL,
    SentAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IsFromAdmin TINYINT(1) NOT NULL DEFAULT 0,
    IsRead TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- DONE! Tất cả 5 database đã được khởi tạo.
-- =============================================
