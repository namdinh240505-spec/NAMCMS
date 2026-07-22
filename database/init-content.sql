-- =============================================
-- NamCMS - Content Service Database
-- Database: namcms_content_db
-- Tables: Categories, Posts, Banners
-- =============================================

CREATE DATABASE IF NOT EXISTS namcms_content_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_content_db;

-- 1. Categories (Danh mục bài viết)
CREATE TABLE IF NOT EXISTS Categories (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Description TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Posts (Bài viết)
CREATE TABLE IF NOT EXISTS Posts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(500) NOT NULL,
    Content LONGTEXT NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ImageUrl VARCHAR(500) NULL,
    CategoryId INT NOT NULL,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Banners
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
