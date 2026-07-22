# NamCMS - Microservice Architecture

> Nguyễn Đình Nam - 2123110170

## Kiến trúc

| Service | Port | Chức năng |
|---------|------|-----------|
| API Gateway | 5000 | Ocelot routing |
| Auth Service | 5001 | Xác thực, quản lý user/customer |
| Product Service | 5002 | Sản phẩm, danh mục SP |
| Order Service | 5003 | Đơn hàng, VNPay |
| Content Service | 5004 | Bài viết, banner |
| Chat Service | 5005 | Chat realtime |
| Admin Portal | 5173 | Trang quản trị (React+Vite) |

## Tech Stack
- **Backend**: .NET 8 Web API
- **Database**: MySQL 8.0 (Laragon)
- **Gateway**: Ocelot
- **Frontend Admin**: React + Vite
- **Auth**: JWT Token

## Khởi chạy

```bash
# 1. Tạo database MySQL
mysql -u root < database/init.sql

# 2. Chạy từng service
dotnet run --project src/ApiGateway
dotnet run --project src/Services/Auth/Auth.API
dotnet run --project src/Services/Product/Product.API
dotnet run --project src/Services/Order/Order.API
dotnet run --project src/Services/Content/Content.API
dotnet run --project src/Services/Chat/Chat.API

# 3. Chạy Admin Portal
cd admin-portal && npm run dev
```