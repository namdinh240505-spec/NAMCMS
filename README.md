
# 🛒 NamCMS – Hệ thống Quản lý Nội dung & Thương mại Điện tử

NamCMS – Hệ thống Quản lý Nội dung & Thương mại Điện tử

> **NamCMS** là một hệ thống web fullstack kết hợp **Quản lý nội dung (CMS)** và **Thương mại điện tử (E-Commerce)**, được xây dựng bằng **ASP.NET Core 8** (Backend) và **React 19** (Frontend).

---

<HEAD
## 📋 Mục lục

860aa2d80f8e823d05f1dade6740dcb80ff15f35

- [Tổng quan](#-tổng-quan)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Tính năng chính](#-tính-năng-chính)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [API Endpoints](#-api-endpoints)
- [Tác giả](#-tác-giả)

---

## 🌐 Tổng quan

**NamCMS** cung cấp hai phần chính:

| Thành phần | Mô tả |
|---|---|
| 🖥️ **Trang Admin** (MVC) | Giao diện quản trị sử dụng ASP.NET MVC với Razor Views, dành cho quản lý sản phẩm, đơn hàng, bài viết, banner, danh mục, khách hàng và tài khoản. |
| 🛍️ **Trang khách hàng** (React SPA) | Giao diện mua sắm hiện đại dành cho người dùng cuối, bao gồm trang chủ, danh sách sản phẩm, giỏ hàng, thanh toán, blog và quản lý tài khoản. |
=======
| **Trang Admin** (MVC) | Giao diện quản trị sử dụng ASP.NET MVC với Razor Views, dành cho quản lý sản phẩm, đơn hàng, bài viết, banner, danh mục, khách hàng và tài khoản. |
| **Trang khách hàng** (React SPA) | Giao diện mua sắm hiện đại dành cho người dùng cuối, bao gồm trang chủ, danh sách sản phẩm, giỏ hàng, thanh toán, blog và quản lý tài khoản. |
 860aa2d80f8e823d05f1dade6740dcb80ff15f35

Hai phần giao tiếp với nhau thông qua **RESTful API**, được thiết kế tách biệt rõ ràng giữa frontend và backend.

---

## 🛠️ Công nghệ sử dụng

### Backend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| ASP.NET Core | 8.0 | Web framework chính |
| Entity Framework Core | 8.0 | ORM – truy vấn cơ sở dữ liệu |
| SQL Server | — | Hệ quản trị CSDL |
| Swagger / Swashbuckle | 10.x | Tài liệu API tự động |
| Cookie Authentication | — | Xác thực người dùng Admin |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 19.x | Thư viện xây dựng UI |
| React Router DOM | 7.x | Điều hướng SPA |
| React Icons | 5.x | Bộ icon |
| React Hot Toast | 2.x | Thông báo toast |
| Create React App | 5.x | Công cụ khởi tạo & build |

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                  │
├──────────────────────┬──────────────────────────────┤
│   React SPA (:3000)  │   Admin MVC (Razor Views)    │
│   Trang khách hàng   │   Trang quản trị             │
└──────────┬───────────┴──────────┬───────────────────┘
           │ REST API             │ MVC Controller
           ▼                     ▼
┌─────────────────────────────────────────────────────┐
│            ASP.NET Core 8 Backend (:5xxx)           │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │  API Controllers │  │  MVC Controllers + Views │  │
│  └────────┬────────┘  └────────────┬─────────────┘  │
│           └────────────┬───────────┘                │
│                        ▼                            │
│           ┌────────────────────────┐                │
│           │  Entity Framework Core │                │
│           └────────────┬───────────┘                │
└────────────────────────┼────────────────────────────┘
                         ▼
              ┌─────────────────────┐
              │  SQL Server Database │
              │     (NamCMS_DB)      │
              └─────────────────────┘
```

Dự án được tổ chức theo mô hình **3 tầng (3-layer)**:

- **CMS.Frontend** – Giao diện người dùng (React SPA)
- **CMS.Backend** – Tầng xử lý logic & API (ASP.NET Core MVC + Web API)
- **CMS.Data** – Tầng dữ liệu (Entity Framework Core, Entities, Migrations)

---


## ✨ Tính năng chính

### 🛍️ Phía khách hàng (Frontend React)
## Tính năng chính

### Phía khách hàng (Frontend React)

- **Trang chủ** – Hero banner, sản phẩm nổi bật, bài viết mới nhất
- **Danh sách sản phẩm** – Tìm kiếm, lọc theo danh mục, phân trang
- **Chi tiết sản phẩm** – Hình ảnh, mô tả, thêm vào giỏ hàng
- **Giỏ hàng** – Thêm/xóa sản phẩm, cập nhật số lượng
- **Thanh toán** – Nhập thông tin giao hàng, đặt hàng
- **Blog** – Danh sách bài viết, chi tiết bài viết
- **Đăng ký / Đăng nhập** – Tài khoản khách hàng
- **Quản lý hồ sơ** – Cập nhật thông tin cá nhân, địa chỉ
- **Lịch sử đơn hàng** – Xem danh sách đơn hàng đã đặt

### 🖥️ Phía quản trị (Backend MVC)
### Phía quản trị (Backend MVC)

- **Quản lý sản phẩm** – CRUD sản phẩm, hình ảnh sản phẩm
- **Quản lý danh mục** – Danh mục bài viết & danh mục sản phẩm
- **Quản lý đơn hàng** – Xem, cập nhật trạng thái đơn hàng
- **Quản lý bài viết** – CRUD bài viết/blog
- **Quản lý banner** – Thêm/sửa/xóa banner quảng cáo
- **Quản lý khách hàng** – Xem danh sách khách hàng
- **Quản lý tài khoản Admin** – Đăng nhập, phân quyền

---

## 🚀 Cài đặt & Chạy dự án
## Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (>= 18.x)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) (hoặc SQL Server Express)

### 1. Clone dự án

```bash
git clone https://github.com/<your-username>/NamCMS.git
cd NamCMS
```

### 2. Cấu hình Database

Mở file `CMS.Backend/appsettings.json` và cập nhật chuỗi kết nối phù hợp:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=<TÊN_SERVER>;Database=NamCMS_DB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 3. Chạy Migration & Tạo Database

```bash
cd CMS.Backend
dotnet ef database update
```

### 4. Chạy Backend

```bash
cd CMS.Backend
dotnet run
```

Backend sẽ chạy tại `https://localhost:5xxx`. Truy cập Swagger UI tại `/swagger` để xem tài liệu API.

> **Tài khoản Admin mặc định:** `admin` / `admin123` (được seed tự động khi chạy lần đầu).

### 5. Chạy Frontend

```bash
cd CMS.Frontend
npm install
npm start
```

Frontend sẽ chạy tại `http://localhost:3000`.

---

## 📁 Cấu trúc thư mục

```
NamCMS/
├── CMS.Backend/                  # ASP.NET Core Backend
│   ├── Controllers/              # MVC Controllers (Admin)
│   │   └── Api/                  # REST API Controllers (cho React)
│   ├── Models/                   # View Models
│   ├── Views/                    # Razor Views (Admin UI)
│   │   ├── Product/
│   │   ├── Order/
│   │   ├── Post/
│   │   ├── Banner/
│   │   ├── Category/
│   │   ├── Customer/
│   │   └── Shared/               # Layout & Partial Views
│   ├── wwwroot/                  # Static files (CSS, JS, Images)
│   ├── Program.cs                # Entry point & cấu hình ứng dụng
│   └── appsettings.json          # Cấu hình kết nối DB
│
├── CMS.Data/                     # Data Access Layer
│   ├── Entities/                 # Entity classes (Models)
│   │   ├── Product.cs
│   │   ├── Category.cs
│   │   ├── Order.cs
│   │   ├── Customer.cs
│   │   ├── Post.cs
│   │   ├── Banner.cs
│   │   └── ...
│   ├── Migrations/               # EF Core Migrations
│   └── ApplicationDbContext.cs   # DbContext
│
├── CMS.Frontend/                 # React Frontend (SPA)
│   ├── src/
│   │   ├── components/           # Shared components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── BlogPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── OrdersPage.jsx
│   │   ├── styles/               # CSS stylesheets
│   │   ├── api.js                # API service layer
│   │   ├── App.jsx               # Root component & Routes
│   │   └── index.jsx             # Entry point
│   └── package.json
│
├── NamCMS.slnx                   # Solution file
└── README.md
```

---

## 📡 API Endpoints

API phục vụ Frontend React, có prefix `/api/`:

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/products` | Lấy danh sách sản phẩm |
| `GET` | `/api/products/{id}` | Lấy chi tiết sản phẩm |
| `GET` | `/api/categories` | Lấy danh mục sản phẩm |
| `GET` | `/api/banners` | Lấy danh sách banner |
| `GET` | `/api/posts` | Lấy danh sách bài viết |
| `POST` | `/api/customerauth/register` | Đăng ký tài khoản |
| `POST` | `/api/customerauth/login` | Đăng nhập |
| `GET` | `/api/orders` | Lấy đơn hàng của khách |
| `POST` | `/api/orders` | Tạo đơn hàng mới |

> 📝 Truy cập **Swagger UI** tại `/swagger` khi chạy ở chế độ Development để xem đầy đủ tài liệu API.

---

## 👤 Tác giả

- **Nam Dinh** – [GitHub](https://github.com/<your-username>)

---

## 📄 License

Dự án này được phát triển cho mục đích học tập và nghiên cứu.

---