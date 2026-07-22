-- =============================================
-- NamCMS - Auth Service Database
-- Database: namcms_auth_db
-- Tables: Users, Customers, CustomerAddresses, PasswordResetTokens
-- =============================================

CREATE DATABASE IF NOT EXISTS namcms_auth_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_auth_db;

-- 1. Users (Admin accounts)
CREATE TABLE IF NOT EXISTS Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(200) NOT NULL,
    Role VARCHAR(50) NOT NULL COMMENT 'Admin hoặc Editor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Customers
CREATE TABLE IF NOT EXISTS Customers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(200) NOT NULL,
    Email VARCHAR(200) NOT NULL,
    Phone VARCHAR(20) NULL,
    Address VARCHAR(500) NULL,
    Password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. CustomerAddresses
CREATE TABLE IF NOT EXISTS CustomerAddresses (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CustomerId INT NOT NULL,
    ReceiverName VARCHAR(200) NOT NULL,
    ReceiverPhone VARCHAR(20) NOT NULL,
    AddressLine VARCHAR(500) NOT NULL,
    IsDefault TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. PasswordResetTokens
CREATE TABLE IF NOT EXISTS PasswordResetTokens (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(200) NOT NULL,
    Code VARCHAR(10) NOT NULL COMMENT 'Mã OTP 6 số',
    ExpiresAt DATETIME NOT NULL,
    IsUsed TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED DATA
INSERT INTO Users (Username, PasswordHash, FullName, Role) VALUES
('admin', 'admin123', 'Quản trị viên', 'Admin');
