// Nguyễn Đình Nam - 2123110170
// API Client with fallbacks to realistic mock data

const API_BASE = 'http://localhost:5000/api';

// Realistic mock data fallback for immediate WOW factor
const MOCK_DATA = {
  products: [
    { id: 1, name: 'MacBook Air M2', price: 35400000, stockQuantity: 15, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', brand: 'Apple', colors: 'Gray, Silver', categoryProductId: 2, categoryName: 'Laptop' },
    { id: 2, name: 'iPhone 15 Pro Max', price: 29900000, stockQuantity: 28, imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500', brand: 'Apple', colors: 'Titanium, Black', categoryProductId: 1, categoryName: 'Điện thoại' },
    { id: 3, name: 'Sony WH-1000XM5', price: 6800000, stockQuantity: 42, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', brand: 'Sony', colors: 'Black, Silver', categoryProductId: 3, categoryName: 'Phụ kiện' },
    { id: 4, name: 'Samsung Galaxy S24 Ultra', price: 27900000, stockQuantity: 22, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', brand: 'Samsung', colors: 'Yellow, Black', categoryProductId: 1, categoryName: 'Điện thoại' },
    { id: 5, name: 'Dell XPS 13 Plus', price: 42500000, stockQuantity: 8, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', brand: 'Dell', colors: 'Silver', categoryProductId: 2, categoryName: 'Laptop' }
  ],
  categories: [
    { id: 1, name: 'Điện thoại', description: 'Điện thoại di động & Smartphone', productCount: 12 },
    { id: 2, name: 'Laptop', description: 'Máy tính xách tay', productCount: 8 },
    { id: 3, name: 'Phụ kiện', description: 'Phụ kiện công nghệ', productCount: 25 },
    { id: 4, name: 'Gia dụng', description: 'Thiết bị điện gia dụng', productCount: 14 }
  ],
  orders: [
    { id: 70728, customerId: 1, shippingName: 'Nguyễn Văn A', shippingPhone: '0901234567', shippingAddress: '123 Đường 3/2, Quận 10, TP.HCM', orderDate: '2026-06-29T10:15:00', status: 1, statusText: 'Đang giao', paymentMethod: 'VNPay', transactionId: 'VNP123456', total: 35400000, items: [{ productId: 1, quantity: 1, unitPrice: 35400000, productName: 'MacBook Air M2' }] },
    { id: 70323, customerId: 2, shippingName: 'Trần Thị B', shippingPhone: '0912345678', shippingAddress: '456 Lê Lợi, Hải Châu, Đà Nẵng', orderDate: '2026-06-29T09:20:00', status: 0, statusText: 'Chờ duyệt', paymentMethod: 'COD', total: 12400000, items: [{ productId: 3, quantity: 2, unitPrice: 6200000, productName: 'Sony WH-1000XM5' }] },
    { id: 70320, customerId: 3, shippingName: 'Lê Văn C', shippingPhone: '0987654321', shippingAddress: '789 Nguyễn Chí Thanh, Láng Hạ, Hà Nội', orderDate: '2026-06-28T15:30:00', status: 2, statusText: 'Đã xong', paymentMethod: 'VNPay', transactionId: 'VNP987654', total: 29900000, items: [{ productId: 2, quantity: 1, unitPrice: 29900000, productName: 'iPhone 15 Pro Max' }] }
  ],
  customers: [
    { id: 1, fullName: 'Nguyễn Văn A', email: 'vana@gmail.com', phone: '0901234567', address: 'TP.HCM' },
    { id: 2, fullName: 'Trần Thị B', email: 'thib@gmail.com', phone: '0912345678', address: 'Đà Nẵng' },
    { id: 3, fullName: 'Lê Văn C', email: 'vanc@gmail.com', phone: '0987654321', address: 'Hà Nội' }
  ],
  banners: [
    { id: 1, title: 'Siêu Sale Mùa Hè 2026', description: 'Giảm giá tới 50% các sản phẩm công nghệ hot nhất', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000', linkUrl: '/products', position: 'HomeHero', sortOrder: 0, isActive: true },
    { id: 2, title: 'Đón Tầm Cao Mới Cùng Macbook Pro M3', description: 'Hỗ trợ trả góp 0%, tặng kèm balo cao cấp', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000', linkUrl: '/products/1', position: 'HomeHero', sortOrder: 1, isActive: true }
  ],
  chatConversations: [
    { customerId: 1, lastMessage: 'Cảm ơn admin nhé, sản phẩm dùng rất tốt!', lastMessageAt: '2026-06-29T11:45:00', unreadCount: 0, customerName: 'Nguyễn Văn A' },
    { customerId: 2, lastMessage: 'Shop có ship COD ra Hà Nội không ạ?', lastMessageAt: '2026-06-29T11:00:00', unreadCount: 1, customerName: 'Trần Thị B' },
    { customerId: 3, lastMessage: 'Đơn hàng 70320 của em bao giờ giao thế ạ?', lastMessageAt: '2026-06-28T17:15:00', unreadCount: 0, customerName: 'Lê Văn C' }
  ],
  chatHistory: {
    1: [
      { id: 1, content: 'Chào shop, em muốn hỏi về MacBook Air M2 còn màu xám không?', sentAt: '2026-06-29T11:30:00', isFromAdmin: false },
      { id: 2, content: 'Chào bạn, MacBook Air M2 màu xám hiện tại shop vẫn sẵn hàng tại chi nhánh TP.HCM nha.', sentAt: '2026-06-29T11:32:00', isFromAdmin: true },
      { id: 3, content: 'Cảm ơn admin nhé, sản phẩm dùng rất tốt!', sentAt: '2026-06-29T11:45:00', isFromAdmin: false }
    ],
    2: [
      { id: 1, content: 'Shop có ship COD ra Hà Nội không ạ?', sentAt: '2026-06-29T11:00:00', isFromAdmin: false }
    ]
  },
  posts: [
    { id: 1, title: 'Xu Hướng Công Nghệ 2026', content: 'Năm 2026 hứa hẹn mang đến nhiều đột phá về trí tuệ nhân tạo và thiết bị đeo thông minh...', createdDate: '2026-06-28', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500', categoryName: 'Tin Công Nghệ' },
    { id: 2, title: 'Top 5 Laptop Cho Lập Trình Viên', content: 'Lựa chọn laptop phù hợp là yếu tố quyết định hiệu quả công việc của các nhà phát triển phần mềm...', createdDate: '2026-06-27', imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500', categoryName: 'Tư Vấn' }
  ],
  users: [
    { id: 1, username: 'admin', passwordHash: 'admin123', fullName: 'Quản trị viên', role: 'Admin' },
    { id: 2, username: 'editor', passwordHash: 'editor123', fullName: 'Biên tập viên 1', role: 'Editor' }
  ]
};

// Check if token exists in local storage
const getHeaders = () => {
  const token = localStorage.getItem('namcms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // ==========================================
  // AUTH
  // ==========================================
  async login(username, password) {
    try {
      const res = await fetch(`${API_BASE}/adminauth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Đăng nhập thất bại');
      const data = await res.json();
      localStorage.setItem('namcms_token', data.token);
      localStorage.setItem('namcms_user', JSON.stringify(data));
      return data;
    } catch (e) {
      console.warn('API Error, using mock login:', e);
      const foundMockUser = MOCK_DATA.users.find(u => u.username === username && u.passwordHash === password);
      if (foundMockUser) {
        const mockUser = { 
          token: `mock-jwt-token-2026-${foundMockUser.username}`, 
          username: foundMockUser.username, 
          fullName: foundMockUser.fullName, 
          role: foundMockUser.role 
        };
        localStorage.setItem('namcms_token', mockUser.token);
        localStorage.setItem('namcms_user', JSON.stringify(mockUser));
        return mockUser;
      }
      throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  },

  logout() {
    localStorage.removeItem('namcms_token');
    localStorage.removeItem('namcms_user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('namcms_user');
    return user ? JSON.parse(user) : null;
  },

  // ==========================================
  // PRODUCTS
  // ==========================================
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      return json.data || json;
    } catch (e) {
      console.warn('API Error, using mock products:', e);
      return MOCK_DATA.products;
    }
  },

  async addProduct(product, files) {
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('stockQuantity', product.stockQuantity);
      formData.append('brand', product.brand);
      formData.append('colors', product.colors);
      formData.append('categoryProductId', product.categoryProductId);
      formData.append('description', product.description);
      formData.append('details', product.details);
      
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('ImageFiles', files[i]);
        }
      }

      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          ...(localStorage.getItem('namcms_token') ? { 'Authorization': `Bearer ${localStorage.getItem('namcms_token')}` } : {})
        },
        body: formData
      });
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock addProduct:', e);
      let imageUrls = [];
      if (files && files.length > 0) {
        imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      } else {
        imageUrls = ['https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500'];
      }
      const cat = MOCK_DATA.categories.find(c => c.id === Number(product.categoryProductId));
      const newProduct = { 
        ...product, 
        id: Date.now(), 
        imageUrl: imageUrls[0],
        images: imageUrls,
        categoryName: cat ? cat.name : 'Chưa phân loại'
      };
      MOCK_DATA.products.push(newProduct);
      return newProduct;
    }
  },

  async updateProduct(id, product, files) {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('stockQuantity', product.stockQuantity);
      formData.append('brand', product.brand);
      formData.append('colors', product.colors);
      formData.append('categoryProductId', product.categoryProductId);
      formData.append('description', product.description);
      formData.append('details', product.details);
      
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('ImageFiles', files[i]);
        }
      }

      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          ...(localStorage.getItem('namcms_token') ? { 'Authorization': `Bearer ${localStorage.getItem('namcms_token')}` } : {})
        },
        body: formData
      });
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock updateProduct:', e);
      let imageUrls = product.images || [];
      if (files && files.length > 0) {
        imageUrls = [...imageUrls, ...Array.from(files).map(file => URL.createObjectURL(file))];
      }
      const cat = MOCK_DATA.categories.find(c => c.id === Number(product.categoryProductId));
      const idx = MOCK_DATA.products.findIndex(p => p.id === id);
      if (idx !== -1) {
        MOCK_DATA.products[idx] = { 
          ...MOCK_DATA.products[idx], 
          ...product, 
          imageUrl: imageUrls[0] || MOCK_DATA.products[idx].imageUrl,
          images: imageUrls,
          categoryName: cat ? cat.name : 'Chưa phân loại' 
        };
      }
      return MOCK_DATA.products[idx];
    }
  },

  async deleteProduct(id) {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: getHeaders() });
      return true;
    } catch (e) {
      console.warn('API Error, using mock deleteProduct:', e);
      MOCK_DATA.products = MOCK_DATA.products.filter(p => p.id !== id);
      return true;
    }
  },

  // ==========================================
  // CATEGORIES
  // ==========================================
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock categories:', e);
      return MOCK_DATA.categories;
    }
  },

  async addCategory(category) {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(category)
      });
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock addCategory:', e);
      const newCat = { ...category, id: Date.now(), productCount: 0 };
      MOCK_DATA.categories.push(newCat);
      return newCat;
    }
  },

  async deleteCategory(id) {
    try {
      await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE', headers: getHeaders() });
      return true;
    } catch (e) {
      console.warn('API Error, using mock deleteCategory:', e);
      MOCK_DATA.categories = MOCK_DATA.categories.filter(c => c.id !== id);
      return true;
    }
  },

  // ==========================================
  // ORDERS
  // ==========================================
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock orders:', e);
      return MOCK_DATA.orders;
    }
  },

  async updateOrderStatus(id, status) {
    try {
      await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(status)
      });
      return true;
    } catch (e) {
      console.warn('API Error, using mock updateOrderStatus:', e);
      const order = MOCK_DATA.orders.find(o => o.id === id);
      if (order) {
        order.status = status;
        order.statusText = status === 0 ? 'Chờ duyệt' : status === 1 ? 'Đang giao' : 'Đã xong';
      }
      return true;
    }
  },

  // ==========================================
  // CUSTOMERS
  // ==========================================
  async getCustomers() {
    try {
      const res = await fetch(`${API_BASE}/user/customers`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock customers:', e);
      return MOCK_DATA.customers;
    }
  },

  // ==========================================
  // MARKETING / BANNERS
  // ==========================================
  async getBanners() {
    try {
      const res = await fetch(`${API_BASE}/banners/all`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock banners:', e);
      return MOCK_DATA.banners;
    }
  },

  async addBanner(banner) {
    try {
      const res = await fetch(`${API_BASE}/banners`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(banner)
      });
      if (!res.ok) throw new Error('Failed to create banner');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock addBanner:', e);
      const newBanner = { ...banner, id: Date.now() };
      MOCK_DATA.banners.push(newBanner);
      return newBanner;
    }
  },

  async updateBanner(id, banner) {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(banner)
      });
      if (!res.ok) throw new Error('Failed to update banner');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock updateBanner:', e);
      const idx = MOCK_DATA.banners.findIndex(b => b.id === id);
      if (idx !== -1) {
        MOCK_DATA.banners[idx] = { ...MOCK_DATA.banners[idx], ...banner };
      }
      return MOCK_DATA.banners[idx];
    }
  },

  async deleteBanner(id) {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete banner');
      return true;
    } catch (e) {
      console.warn('API Error, using mock deleteBanner:', e);
      MOCK_DATA.banners = MOCK_DATA.banners.filter(b => b.id !== id);
      return true;
    }
  },

  // ==========================================
  // CONTENT / POSTS
  // ==========================================
  async getPosts() {
    try {
      const res = await fetch(`${API_BASE}/posts`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      return json.data || json;
    } catch (e) {
      console.warn('API Error, using mock posts:', e);
      return MOCK_DATA.posts;
    }
  },

  async addPost(post) {
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(post)
      });
      if (!res.ok) throw new Error('Failed to create post');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock addPost:', e);
      const newPost = {
        ...post,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0]
      };
      MOCK_DATA.posts.push(newPost);
      return newPost;
    }
  },

  async updatePost(id, post) {
    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(post)
      });
      if (!res.ok) throw new Error('Failed to update post');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock updatePost:', e);
      const idx = MOCK_DATA.posts.findIndex(p => p.id === id);
      if (idx !== -1) {
        MOCK_DATA.posts[idx] = {
          ...MOCK_DATA.posts[idx],
          ...post
        };
      }
      return MOCK_DATA.posts[idx];
    }
  },

  async deletePost(id) {
    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete post');
      return true;
    } catch (e) {
      console.warn('API Error, using mock deletePost:', e);
      MOCK_DATA.posts = MOCK_DATA.posts.filter(p => p.id !== id);
      return true;
    }
  },

  async getPostCategories() {
    try {
      const res = await fetch(`${API_BASE}/post-categories`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock post-categories:', e);
      return [
        { id: 1, name: 'Tin Công Nghệ', slug: 'tin-cong-nghe' },
        { id: 2, name: 'Tư Vấn', slug: 'tu-van' }
      ];
    }
  },

  async addPostCategory(category) {
    try {
      const res = await fetch(`${API_BASE}/post-categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(category)
      });
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock addPostCategory:', e);
      return { ...category, id: Date.now() };
    }
  },

  // ==========================================
  // CHAT
  // ==========================================
  async getChatConversations() {
    try {
      const res = await fetch(`${API_BASE}/chat/conversations`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock conversations:', e);
      return MOCK_DATA.chatConversations;
    }
  },

  async getChatHistory(customerId) {
    try {
      const res = await fetch(`${API_BASE}/chat/${customerId}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock chat history:', e);
      return MOCK_DATA.chatHistory[customerId] || [];
    }
  },

  async sendChatMessage(customerId, content, isFromAdmin = true) {
    try {
      const url = isFromAdmin ? `${API_BASE}/chat/admin` : `${API_BASE}/chat`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ customerId, content })
      });
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock sendChatMessage:', e);
      const newMsg = { id: Date.now(), content, sentAt: new Date().toISOString(), isFromAdmin, isRead: false };
      if (!MOCK_DATA.chatHistory[customerId]) MOCK_DATA.chatHistory[customerId] = [];
      MOCK_DATA.chatHistory[customerId].push(newMsg);
      
      const conv = MOCK_DATA.chatConversations.find(c => c.customerId === customerId);
      if (conv) {
        conv.lastMessage = content;
        conv.lastMessageAt = newMsg.sentAt;
      }
      return newMsg;
    }
  },

  // ==========================================
  // SETTINGS / ADMIN USERS
  // ==========================================
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/user`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock users:', e);
      return MOCK_DATA.users;
    }
  },

  async createUser(user) {
    try {
      const res = await fetch(`${API_BASE}/user`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(user)
      });
      if (!res.ok) throw new Error('Failed to create user');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock createUser:', e);
      const newUser = {
        id: Date.now(),
        username: user.username,
        passwordHash: user.passwordHash,
        fullName: user.fullName,
        role: user.role
      };
      MOCK_DATA.users.push(newUser);
      return { message: 'Tạo tài khoản thành công!', user: newUser };
    }
  },

  async deleteUser(id) {
    try {
      const res = await fetch(`${API_BASE}/user/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete user');
      return await res.json();
    } catch (e) {
      console.warn('API Error, using mock deleteUser:', e);
      MOCK_DATA.users = MOCK_DATA.users.filter(u => u.id !== id);
      return { message: 'Xóa tài khoản thành công!' };
    }
  }
};
