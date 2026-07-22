-- =============================================
-- NamCMS Microservice - MySQL Database Init (Master)
-- Nguyễn Đình Nam - 2123110170
-- Database-per-Service Architecture
-- =============================================
-- This file is kept for reference.
-- Each service now has its own database:
--   - namcms_auth_db    (init-auth.sql)
--   - namcms_product_db (init-product.sql)
--   - namcms_order_db   (init-order.sql)
--   - namcms_content_db (init-content.sql)
--   - namcms_chat_db    (init-chat.sql)
-- =============================================

-- Source individual init scripts
SOURCE /docker-entrypoint-initdb.d/init-auth.sql;
SOURCE /docker-entrypoint-initdb.d/init-product.sql;
SOURCE /docker-entrypoint-initdb.d/init-order.sql;
SOURCE /docker-entrypoint-initdb.d/init-content.sql;
SOURCE /docker-entrypoint-initdb.d/init-chat.sql;
