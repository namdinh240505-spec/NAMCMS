-- =============================================
-- NamCMS - Chat Service Database
-- Database: namcms_chat_db
-- Tables: ChatMessages
-- Note: No FOREIGN KEY to Customers (cross-service)
-- =============================================

CREATE DATABASE IF NOT EXISTS namcms_chat_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE namcms_chat_db;

-- 1. ChatMessages
CREATE TABLE IF NOT EXISTS ChatMessages (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CustomerId INT NOT NULL COMMENT 'Reference to Auth DB - Customers.Id',
    Content TEXT NOT NULL,
    SentAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IsFromAdmin TINYINT(1) NOT NULL DEFAULT 0,
    IsRead TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
