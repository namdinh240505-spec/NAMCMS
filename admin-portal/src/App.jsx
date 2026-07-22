// Nguyễn Đình Nam - 2123110170
// Premium TechGear Admin Dashboard React SPA

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiBox, FiShoppingCart, FiUsers, FiTag, FiBarChart2, FiSettings, 
  FiSearch, FiBell, FiMail, FiChevronDown, FiPlus, FiTrash2, FiEdit2, FiCheck, FiSend, FiLogOut, FiFileText 
} from 'react-icons/fi';
import { api } from './api';

// Helper for resolving image URLs
const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  return `http://localhost:5000${url}`;
};

// ==========================================
// LOGIN PAGE COMPONENT
// ==========================================
function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.login(username, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Sai thông tin đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)', padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '24px', padding: '2.5rem', width: '420px',
        boxShadow: '0 20px 25px -5px rgba(234, 88, 12, 0.1), 0 10px 10px -5px rgba(234, 88, 12, 0.04)',
        border: '1px solid rgba(254, 215, 170, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', width: '56px', height: '56px', borderRadius: '16px',
            backgroundColor: '#EA580C', color: 'white', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', boxShadow: '0 8px 16px rgba(234, 88, 12, 0.25)'
          }}>TG</div>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#1E293B', fontSize: '1.6rem', marginBottom: '0.25rem' }}>TechGear Admin</h2>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Đăng nhập hệ thống quản trị</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '8px',
            fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid #FCA5A5', fontWeight: '500'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <input 
              type="text" className="form-control" value={username} 
              onChange={e => setUsername(e.target.value)} required 
              style={{ borderRadius: '10px' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Mật khẩu</label>
            <input 
              type="password" className="form-control" value={password} 
              onChange={e => setPassword(e.target.value)} required 
              style={{ borderRadius: '10px' }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{
            width: '100%', padding: '0.9rem', borderRadius: '12px', fontSize: '0.95rem',
            backgroundColor: '#EA580C', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)'
          }}>
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#94A3B8' }}>
          Nguyễn Đình Nam - 2123110170
        </div>
      </div>
    </div>
  );
}

// ==========================================
// LAYOUT COMPONENT (SIDEBAR + HEADER)
// ==========================================
function Layout({ children, user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome /> },
    { path: '/products', label: 'Products', icon: <FiBox /> },
    { path: '/categories', label: 'Categories', icon: <FiTag /> },
    { path: '/orders', label: 'Orders', icon: <FiShoppingCart /> },
    { path: '/customers', label: 'Customers', icon: <FiUsers /> },
    { path: '/posts', label: 'Posts (Blogs)', icon: <FiFileText /> },
    { path: '/chat', label: 'Chat & Support', icon: <FiMail /> },
    { path: '/marketing', label: 'Marketing', icon: <FiTag /> },
    { path: '/reports', label: 'Reports', icon: <FiBarChart2 /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings /> }
  ];

  const handleLogoutClick = () => {
    api.logout();
    onLogout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">TG</div>
          <div className="logo-text">
            <span>TECHGEAR</span>
            <span className="logo-sub">Admin Portal</span>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <ul className="menu-list">
            {menuItems.map(item => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`menu-item-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem' }}>
          <button 
            onClick={handleLogoutClick} 
            className="menu-item-link" 
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
          >
            <FiLogOut />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="top-header">
          <div className="search-box">
            <input type="text" className="search-input" placeholder="Search anything here..." />
            <button className="search-btn"><FiSearch /></button>
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <FiBell />
              <span className="badge">1</span>
            </button>
            <button className="icon-btn">
              <FiMail />
            </button>
            <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }}></div>
            
            <div style={{ position: 'relative' }}>
              <div className="user-profile" onClick={() => setProfileOpen(!profileOpen)}>
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" 
                  alt="Avatar" className="avatar" 
                />
                <div className="profile-info">
                  <span className="profile-name">{user?.fullName || 'Admin Name'}</span>
                  <span className="profile-role">{user?.role || 'Administrator'}</span>
                </div>
                <FiChevronDown style={{ color: '#64748B' }} />
              </div>

              {profileOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '55px', backgroundColor: 'white',
                  borderRadius: '12px', boxShadow: 'var(--shadow-lg)', width: '160px',
                  border: '1px solid #E2E8F0', overflow: 'hidden', zIndex: 1000
                }}>
                  <Link to="/settings" style={{
                    display: 'block', padding: '0.75rem 1rem', textDecoration: 'none',
                    color: '#1E293B', fontSize: '0.85rem', borderBottom: '1px solid #F1F5F9'
                  }} onClick={() => setProfileOpen(false)}>Cấu hình</Link>
                  <button onClick={handleLogoutClick} style={{
                    display: 'block', padding: '0.75rem 1rem', width: '100%', textAlign: 'left',
                    background: 'none', border: 'none', color: '#EF4444', fontSize: '0.85rem', cursor: 'pointer'
                  }}>Đăng xuất</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
}

// ==========================================
// PAGE: DASHBOARD (EXACT COLOR & LAYOUT MATCH)
// ==========================================
function DashboardView() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const p = await api.getProducts();
      const o = await api.getOrders();
      const c = await api.getCustomers();
      setProducts(p || []);
      setOrders(o || []);
      setCustomers(c || []);
    };
    loadData();
  }, []);

  return (
    <div>
      <div className="page-title-section">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-info">
            <h4>Total Sales</h4>
            <div className="metric-value">35.4M VNĐ</div>
            <div className="metric-change">
              <span className="change-up">+12%</span> this month
            </div>
          </div>
          <div className="metric-icon"><FiShoppingCart /></div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h4>Active Orders</h4>
            <div className="metric-value">124</div>
            <div className="metric-change">
              <span style={{ color: '#F97316', fontWeight: 600 }}>98 new today</span>
            </div>
          </div>
          <div className="metric-icon" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}><FiBox /></div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h4>New Customers</h4>
            <div className="metric-value">45</div>
            <div className="metric-change">
              <span className="change-up" style={{ color: '#10B981', fontWeight: 600 }}>+5%</span> this week
            </div>
          </div>
          <div className="metric-icon" style={{ backgroundColor: '#EEF2F6', color: '#64748B' }}><FiUsers /></div>
        </div>
      </div>

      {/* Charts & Lists Area */}
      <div className="dashboard-grid-2">
        {/* Sales Overview Chart Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">SALES OVERVIEW (This Week)</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Revenue (VND)</span>
          </div>
          
          <div className="chart-container">
            {/* Y Axis Labels */}
            <div className="chart-axis-y">
              <span>2000M</span>
              <span>1500M</span>
              <span>1000M</span>
              <span>500M</span>
              <span>VND</span>
            </div>
            
            {/* Custom SVG Line Chart */}
            <div className="chart-wrapper">
              <div className="chart-grid-line" style={{ top: '0%' }}></div>
              <div className="chart-grid-line" style={{ top: '25%' }}></div>
              <div className="chart-grid-line" style={{ top: '50%' }}></div>
              <div className="chart-grid-line" style={{ top: '75%' }}></div>
              
              <svg className="chart-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Wave Area Fill */}
                <path 
                  d="M0,150 C50,110 80,120 120,75 C160,30 200,90 250,120 C300,150 350,20 400,60 C450,100 480,40 500,20 L500,200 L0,200 Z" 
                  fill="url(#chart-grad)"
                />
                {/* Wave Stroke Line */}
                <path 
                  d="M0,150 C50,110 80,120 120,75 C160,30 200,90 250,120 C300,150 350,20 400,60 C450,100 480,40 500,20" 
                  fill="none" stroke="#F97316" strokeWidth="3" strokeLinecap="round"
                />
              </svg>
            </div>

            {/* X Axis Labels */}
            <div className="chart-axis-x">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Best Selling Products Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">BEST SELLING PRODUCTS</h3>
          </div>
          <div className="best-sellers-list">
            <div className="product-item">
              <div className="product-info">
                <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100" alt="Macbook" className="product-img" />
                <div>
                  <div className="product-name">MacBook Air M2</div>
                  <div className="product-price">35.4M VNĐ</div>
                </div>
              </div>
            </div>
            <div className="product-item">
              <div className="product-info">
                <img src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=100" alt="iPhone" className="product-img" />
                <div>
                  <div className="product-name">iPhone 15 Pro</div>
                  <div className="product-price">25.1M VNĐ</div>
                </div>
              </div>
            </div>
            <div className="product-item">
              <div className="product-info">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" alt="Sony" className="product-img" />
                <div>
                  <div className="product-name">Sony WH-1000XM5</div>
                  <div className="product-price">3.0M VNĐ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Activity */}
      <div className="dashboard-grid-2">
        {/* Recent Orders Table */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">RECENT ORDERS</h3>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>#70728</td>
                  <td>Nguyễn Văn A</td>
                  <td>23/05/2026</td>
                  <td>MacBook Air M2</td>
                  <td style={{ fontWeight: 600 }}>$35.4M</td>
                  <td><span className="status-pill success">Shipped</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-action"><FiEdit2 /></button>
                      <button className="btn-action delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>#70323</td>
                  <td>Trần Thị B</td>
                  <td>23/05/2026</td>
                  <td>iPhone 15 Pro</td>
                  <td style={{ fontWeight: 600 }}>$12.4M</td>
                  <td><span className="status-pill warning">Pending</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-action"><FiEdit2 /></button>
                      <button className="btn-action delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>#70320</td>
                  <td>Lê Văn C</td>
                  <td>23/05/2026</td>
                  <td>Sony WH-1000XM5</td>
                  <td style={{ fontWeight: 600 }}>$10.4M</td>
                  <td><span className="status-pill warning">Pending</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-action"><FiEdit2 /></button>
                      <button className="btn-action delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Activity Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">LATEST ACTIVITY</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-avatar-dot">N</div>
              <div className="activity-details">
                <span className="activity-user">Nguyễn Văn A</span>
                <span className="activity-action"> đặt đơn hàng #70728</span>
                <div className="activity-time">20 minutes ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-avatar-dot" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>M</div>
              <div className="activity-details">
                <span className="activity-user">MacBook Air M2</span>
                <span className="activity-action"> được cập nhật số lượng</span>
                <div className="activity-time">1 hour ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-avatar-dot" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>S</div>
              <div className="activity-details">
                <span className="activity-user">Sony WH-1000XM5</span>
                <span className="activity-action"> đã hết hàng</span>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE: PRODUCTS MANAGEMENT
// ==========================================
function ProductsView() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stockQuantity: '', brand: '', colors: '', categoryProductId: '', description: '', details: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const loadProducts = async () => {
    setLoading(true);
    const pData = await api.getProducts();
    const cData = await api.getCategories();
    setProducts(pData || []);
    setCategories(cData || []);
    if (cData && cData.length > 0 && !newProduct.categoryProductId) {
      setNewProduct(prev => ({ ...prev, categoryProductId: cData[0].id }));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
      await api.deleteProduct(id);
      loadProducts();
    }
  };

  const handleEditClick = (p) => {
    setEditingProduct(p);
    setNewProduct({
      name: p.name,
      price: p.price,
      stockQuantity: p.stockQuantity,
      brand: p.brand || '',
      colors: p.colors || '',
      categoryProductId: p.categoryProductId || categories[0]?.id || '',
      description: p.description || '',
      details: p.details || ''
    });
    setImagePreviews(p.images || (p.imageUrl ? [p.imageUrl] : []));
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, newProduct, selectedFiles);
    } else {
      await api.addProduct(newProduct, selectedFiles);
    }
    closeModal();
    loadProducts();
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setSelectedFiles([]);
    setImagePreviews([]);
    setNewProduct({
      name: '',
      price: '',
      stockQuantity: '',
      brand: '',
      colors: '',
      categoryProductId: categories[0]?.id || '',
      description: '',
      details: ''
    });
  };

  return (
    <div>
      <div className="page-title-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Quản lý Sản phẩm</h1>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus /> Thêm Sản phẩm
        </button>
      </div>

      <div className="dashboard-card">
        {loading ? <p>Đang tải dữ liệu...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Thương hiệu</th>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                  <th>Màu sắc</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img src={getImageUrl(p.imageUrl)} alt={p.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' }} />
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>
                      <span className="status-pill" style={{ backgroundColor: '#FFEDD5', color: '#EA580C', fontWeight: 600 }}>
                        {p.categoryName || 'Chưa phân loại'}
                      </span>
                    </td>
                    <td>{p.brand}</td>
                    <td style={{ fontWeight: 700, color: '#EA580C' }}>{p.price?.toLocaleString()}₫</td>
                    <td>{p.stockQuantity}</td>
                    <td>{p.colors}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-action" onClick={() => handleEditClick(p)}><FiEdit2 /></button>
                        <button className="btn-action delete" onClick={() => handleDelete(p.id)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '600px' }}>
            <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>
              {editingProduct ? 'Cập nhật thông tin sản phẩm' : 'Thêm sản phẩm mới'}
            </h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Tên sản phẩm</label>
                <input type="text" className="form-control" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Danh mục sản phẩm</label>
                  <select 
                    className="form-control" 
                    value={newProduct.categoryProductId} 
                    onChange={e => setNewProduct({...newProduct, categoryProductId: Number(e.target.value)})}
                    style={{ background: 'white' }}
                    required
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Thương hiệu</label>
                  <input type="text" className="form-control" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} required />
                </div>
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Giá bán (VND)</label>
                  <input type="number" className="form-control" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} required />
                </div>
                <div>
                  <label className="form-label">Số lượng kho</label>
                  <input type="number" className="form-control" value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: Number(e.target.value)})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Màu sắc (phân tách bằng dấu phẩy)</label>
                <input type="text" className="form-control" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} placeholder="Vd: Titan, Gray, Black" />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả ngắn</label>
                <textarea className="form-control" rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Nhập mô tả ngắn sản phẩm..." />
              </div>
              <div className="form-group">
                <label className="form-label">Chi tiết sản phẩm / Thông số kỹ thuật</label>
                <textarea className="form-control" rows="5" value={newProduct.details} onChange={e => setNewProduct({...newProduct, details: e.target.value})} placeholder="Nhập thông số kỹ thuật hoặc chi tiết sản phẩm..." />
              </div>
              <div className="form-group">
                <label className="form-label">Hình ảnh sản phẩm (Chọn nhiều ảnh)</label>
                <input 
                  type="file" 
                  className="form-control" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={{ background: 'white' }}
                />
                {imagePreviews.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {imagePreviews.map((src, i) => (
                      <img 
                        key={i} 
                        src={getImageUrl(src)} 
                        alt="Preview" 
                        style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0' }} 
                      />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Cập nhật' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PAGE: PRODUCT CATEGORIES
// ==========================================
function CategoriesView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', imageUrl: '' });

  const loadCategories = async () => {
    setLoading(true);
    const data = await api.getCategories();
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa danh mục này? Tất cả sản phẩm thuộc danh mục có thể bị ảnh hưởng.')) {
      await api.deleteCategory(id);
      loadCategories();
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    await api.addCategory(newCategory);
    setModalOpen(false);
    setNewCategory({ name: '', description: '', imageUrl: '' });
    loadCategories();
  };

  return (
    <div>
      <div className="page-title-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Danh mục Sản phẩm</h1>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus /> Thêm Danh mục
        </button>
      </div>

      <div className="dashboard-card">
        {loading ? <p>Đang tải dữ liệu...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên danh mục</th>
                  <th>Mô tả</th>
                  <th>Số sản phẩm</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.description || 'Không có mô tả'}</td>
                    <td>
                      <span className="status-pill success" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                        {c.productCount || 0} sản phẩm
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-action"><FiEdit2 /></button>
                        <button className="btn-action delete" onClick={() => handleDelete(c.id)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Thêm danh mục mới</h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Tên danh mục</label>
                <input 
                  type="text" className="form-control" 
                  value={newCategory.name} 
                  onChange={e => setNewCategory({...newCategory, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea 
                  className="form-control" rows="3" 
                  value={newCategory.description} 
                  onChange={e => setNewCategory({...newCategory, description: e.target.value})}
                  style={{ resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu danh mục</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PAGE: ORDERS
// ==========================================
function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const data = await api.getOrders();
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleApprove = async (id) => {
    await api.updateOrderStatus(id, 1);
    loadOrders();
  };

  const handleComplete = async (id) => {
    await api.updateOrderStatus(id, 2);
    loadOrders();
  };

  return (
    <div>
      <div className="page-title-section">
        <h1 className="page-title">Quản lý Đơn hàng</h1>
      </div>

      <div className="dashboard-card">
        {loading ? <p>Đang tải dữ liệu...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Điện thoại</th>
                  <th>Phương thức</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>#{o.id}</td>
                    <td>{o.shippingName}</td>
                    <td>{o.shippingPhone}</td>
                    <td>{o.paymentMethod}</td>
                    <td style={{ fontWeight: 700, color: '#EA580C' }}>{o.total?.toLocaleString()}₫</td>
                    <td>
                      <span className={`status-pill ${
                        o.status === 0 ? 'warning' : o.status === 1 ? 'success' : 'danger'
                      }`}>{o.statusText}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {o.status === 0 && (
                          <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleApprove(o.id)}>Duyệt giao</button>
                        )}
                        {o.status === 1 && (
                          <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#10B981' }} onClick={() => handleComplete(o.id)}>Hoàn thành</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// PAGE: CUSTOMERS
// ==========================================
function CustomersView() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await api.getCustomers();
      setCustomers(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      <div className="page-title-section">
        <h1 className="page-title">Khách hàng</h1>
      </div>

      <div className="dashboard-card">
        {loading ? <p>Đang tải dữ liệu...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ mặc định</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td style={{ fontWeight: 600 }}>{c.fullName}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// PAGE: CHAT (REALTIME DISCUSSIONS)
// ==========================================
function ChatView() {
  const [conversations, setConversations] = useState([]);
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const chatHistoryRef = useRef(null);

  const loadConversations = async () => {
    const data = await api.getChatConversations();
    setConversations(data || []);
    if (data && data.length > 0 && !activeCustomerId) {
      setActiveCustomerId(data[0].customerId);
    }
  };

  const loadHistory = async (id) => {
    if (!id) return;
    const history = await api.getChatHistory(id);
    setMessages(history || []);
  };

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  // Poll conversations every 5 seconds
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll active chat history every 5 seconds
  useEffect(() => {
    if (!activeCustomerId) return;
    loadHistory(activeCustomerId);
    const interval = setInterval(() => loadHistory(activeCustomerId), 5000);
    return () => clearInterval(interval);
  }, [activeCustomerId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeCustomerId) return;
    await api.sendChatMessage(activeCustomerId, newMessage);
    setNewMessage('');
    loadHistory(activeCustomerId);
    loadConversations();
  };

  const filteredConversations = conversations.filter(c =>
    c.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find(c => c.customerId === activeCustomerId);

  return (
    <div>
      <div className="page-title-section">
        <h1 className="page-title">Hỗ trợ khách hàng</h1>
      </div>

      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-search">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tìm kiếm hội thoại..." 
              style={{ borderRadius: '8px', fontSize: '0.8rem' }} 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="chat-list">
            {filteredConversations.map(conv => (
              <div 
                key={conv.customerId} 
                className={`chat-user-item ${activeCustomerId === conv.customerId ? 'active' : ''}`}
                onClick={() => setActiveCustomerId(conv.customerId)}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FED7AA',
                  color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {conv.customerName?.charAt(0)}
                </div>
                <div className="chat-user-info">
                  <div className="chat-user-name">
                    <span>{conv.customerName}</span>
                    {conv.unreadCount > 0 && <span className="chat-unread">{conv.unreadCount}</span>}
                  </div>
                  <div className="chat-msg-preview">{conv.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {activeConv ? (
            <>
              <div className="chat-header">
                <h4 style={{ fontWeight: 700, fontFamily: 'Outfit' }}>{activeConv.customerName}</h4>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Đang trực tuyến</span>
              </div>
              <div className="chat-history" ref={chatHistoryRef}>
                {messages.map(msg => (
                  <div key={msg.id} className={`chat-bubble ${msg.isFromAdmin ? 'admin' : 'customer'}`}>
                    {msg.content}
                  </div>
                ))}
              </div>
              <form className="chat-input-area" onSubmit={handleSend}>
                <input 
                  type="text" className="form-control" placeholder="Nhập tin nhắn trả lời..." 
                  value={newMessage} onChange={e => setNewMessage(e.target.value)} 
                />
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}>
                  <FiSend /> Gửi
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
              Chọn một cuộc hội thoại để hỗ trợ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE: MARKETING & BANNERS
// ==========================================
function MarketingView() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'HomeHero',
    sortOrder: 0,
    isActive: true
  });

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await api.getBanners();
      setBanners(data || []);
    } catch (e) {
      console.error('Lỗi khi tải banners:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'HomeHero',
      sortOrder: 0,
      isActive: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      position: banner.position || 'HomeHero',
      sortOrder: banner.sortOrder || 0,
      isActive: banner.isActive
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      await api.deleteBanner(id);
      loadBanners();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và hình ảnh của banner!');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl,
      position: formData.position,
      sortOrder: Number(formData.sortOrder),
      isActive: formData.isActive
    };

    if (editingBanner) {
      await api.updateBanner(editingBanner.id, payload);
    } else {
      await api.addBanner(payload);
    }

    setModalOpen(false);
    loadBanners();
  };

  return (
    <div>
      <div className="page-title-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Quản lý Banners & Quảng cáo</h1>
        <button className="btn-primary" onClick={handleOpenCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus /> Thêm Banner
        </button>
      </div>

      <div className="dashboard-card">
        {loading ? <p>Đang tải dữ liệu banners...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Vị trí</th>
                  <th>Thứ tự</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {banners.length > 0 ? (
                  banners.map(b => (
                    <tr key={b.id}>
                      <td>
                        <img 
                          src={getImageUrl(b.imageUrl)} 
                          alt={b.title} 
                          style={{ width: '120px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E2E8F0' }} 
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{b.title}</td>
                      <td>{b.position}</td>
                      <td>{b.sortOrder}</td>
                      <td>
                        <span className={`status-pill ${b.isActive ? 'success' : 'danger'}`}>
                          {b.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-action" onClick={() => handleOpenEdit(b)}><FiEdit2 /></button>
                          <button className="btn-action delete" onClick={() => handleDelete(b.id)}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                      Chưa có banner nào. Nhấn "Thêm Banner" để tạo mới!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '550px' }}>
            <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>
              {editingBanner ? 'Cập nhật Banner' : 'Tạo Banner mới'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tiêu đề Banner</label>
                <input 
                  type="text" className="form-control" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả ngắn</label>
                <input 
                  type="text" className="form-control" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Đường dẫn hình ảnh (Image URL)</label>
                <input 
                  type="text" className="form-control" 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                  placeholder="Ví dụ: /uploads/banners/banner1.jpg hoặc link web"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Đường dẫn chuyển hướng (Link URL)</label>
                <input 
                  type="text" className="form-control" 
                  value={formData.linkUrl} 
                  onChange={e => setFormData({...formData, linkUrl: e.target.value})} 
                  placeholder="Ví dụ: /products hoặc /products/1"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Vị trí hiển thị</label>
                  <select 
                    className="form-control" 
                    value={formData.position} 
                    onChange={e => setFormData({...formData, position: e.target.value})}
                    style={{ background: 'white' }}
                  >
                    <option value="HomeHero">HomeHero (Trang chủ Slide)</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Thứ tự sắp xếp</label>
                  <input 
                    type="number" className="form-control" 
                    value={formData.sortOrder} 
                    onChange={e => setFormData({...formData, sortOrder: e.target.value})} 
                  />
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive} 
                  onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isActive" style={{ fontWeight: 600, color: '#1E293B', cursor: 'pointer' }}>Kích hoạt hoạt động</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">
                  {editingBanner ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PAGE: REPORTS
// ==========================================
function ReportsView() {
  return (
    <div>
      <div className="page-title-section">
        <h1 className="page-title">Báo cáo doanh thu</h1>
      </div>
      <div className="dashboard-card">
        <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Thống kê tổng quan</h3>
        <p style={{ color: '#64748B' }}>Chức năng đang được tích hợp thêm các biểu đồ chi tiết về lưu lượng và chuyển đổi đơn hàng...</p>
      </div>
    </div>
  );
}

// ==========================================
// PAGE: SETTINGS / ADMIN USERS
// ==========================================
function SettingsView({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', fullName: '', passwordHash: '', role: 'Editor' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    const data = await api.getUsers();
    setUsers(data || []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id, username) => {
    if (username === 'admin') {
      alert('Không thể xóa tài khoản admin mặc định!');
      return;
    }
    if (currentUser && currentUser.username === username) {
      alert('Bạn không thể tự xóa tài khoản của chính mình!');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"?`)) {
      await api.deleteUser(id);
      loadUsers();
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newUser.username.trim() || !newUser.fullName.trim() || !newUser.passwordHash.trim()) {
      setError('Vui lòng điền đầy đủ các trường thông tin.');
      return;
    }

    try {
      const res = await api.createUser(newUser);
      setSuccess('Cấp tài khoản mới thành công!');
      setModalOpen(false);
      setNewUser({ username: '', fullName: '', passwordHash: '', role: 'Editor' });
      loadUsers();
    } catch (err) {
      setError(err.message || 'Lỗi khi tạo tài khoản.');
    }
  };

  const isAdmin = currentUser && currentUser.role === 'Admin';

  return (
    <div>
      <div className="page-title-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Cấu hình hệ thống</h1>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiPlus /> Cấp tài khoản mới
          </button>
        )}
      </div>

      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Danh sách tài khoản hệ thống</h3>
        
        {success && (
          <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #A7F3D0' }}>
            {success}
          </div>
        )}

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Họ và tên</th>
                <th>Vai trò</th>
                {isAdmin && <th>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td>{u.fullName}</td>
                  <td>
                    <span className="status-pill" style={{ 
                      backgroundColor: u.role === 'Admin' ? '#FEE2E2' : '#E0F2FE', 
                      color: u.role === 'Admin' ? '#991B1B' : '#0369A1' 
                    }}>
                      {u.role}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="action-btns">
                        <button 
                          className="btn-action delete" 
                          onClick={() => handleDelete(u.id, u.username)}
                          disabled={u.username === 'admin' || (currentUser && currentUser.username === u.username)}
                          style={{ opacity: (u.username === 'admin' || (currentUser && currentUser.username === u.username)) ? 0.4 : 1 }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Cấp tài khoản mới</h3>
            {error && (
              <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #FCA5A5' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Tên đăng nhập (Username)</label>
                <input 
                  type="text" className="form-control" 
                  value={newUser.username} 
                  onChange={e => setNewUser({...newUser, username: e.target.value.trim()})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input 
                  type="text" className="form-control" 
                  value={newUser.fullName} 
                  onChange={e => setNewUser({...newUser, fullName: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input 
                  type="password" className="form-control" 
                  value={newUser.passwordHash} 
                  onChange={e => setNewUser({...newUser, passwordHash: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vai trò hệ thống</label>
                <select 
                  className="form-control" 
                  value={newUser.role} 
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  style={{ background: 'white' }}
                >
                  <option value="Editor">Editor (Biên tập viên)</option>
                  <option value="Admin">Admin (Quản trị viên)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Cấp tài khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PAGE: POSTS / BLOGS MANAGEMENT
// ==========================================
function PostsView() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '', categoryId: '' });

  const loadPostsAndCategories = async () => {
    setLoading(true);
    try {
      const p = await api.getPosts();
      const c = await api.getPostCategories();
      setPosts(p || []);
      setCategories(c || []);
    } catch (e) {
      console.error('Lỗi khi tải bài viết:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostsAndCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '', imageUrl: '', categoryId: categories[0]?.id || '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || '',
      categoryId: post.categoryId || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      await api.deletePost(id);
      loadPostsAndCategories();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết!');
      return;
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null
    };

    if (editingPost) {
      await api.updatePost(editingPost.id, payload);
    } else {
      await api.addPost(payload);
    }

    setModalOpen(false);
    loadPostsAndCategories();
  };

  return (
    <div>
      <div className="page-title-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Quản lý bài viết (Blogs)</h1>
        <button className="btn-primary" onClick={handleOpenCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus /> Viết bài mới
        </button>
      </div>

      <div className="dashboard-card">
        {loading ? <p>Đang tải danh sách bài viết...</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Ngày đăng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <img 
                          src={getImageUrl(p.imageUrl)} 
                          alt={p.title} 
                          style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} 
                        />
                      </td>
                      <td style={{ fontWeight: 600, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title}
                      </td>
                      <td>
                        <span className="status-pill info" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                          {p.categoryName || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {p.createdDate ? new Date(p.createdDate).toLocaleDateString('vi-VN') : 'Mới đăng'}
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-action" onClick={() => handleOpenEdit(p)}><FiEdit2 /></button>
                          <button className="btn-action delete" onClick={() => handleDelete(p.id)}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                      Chưa có bài viết nào. Nhấn "Viết bài mới" để tạo bài viết đầu tiên!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '600px' }}>
            <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>
              {editingPost ? 'Cập nhật bài viết' : 'Viết bài viết mới'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tiêu đề bài viết</label>
                <input 
                  type="text" className="form-control" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Danh mục tin tức</label>
                  <select 
                    className="form-control" 
                    value={formData.categoryId} 
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    style={{ background: 'white' }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Link hình ảnh đại diện</label>
                  <input 
                    type="text" className="form-control" 
                    value={formData.imageUrl} 
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nội dung bài viết</label>
                <textarea 
                  className="form-control" rows="8" 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">
                  {editingPost ? 'Lưu thay đổi' : 'Đăng bài viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN APP NAVIGATION ROOT
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  if (!user) {
    return <Login onLoginSuccess={u => setUser(u)} />;
  }

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={() => setUser(null)}>
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/products" element={<ProductsView />} />
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/orders" element={<OrdersView />} />
          <Route path="/customers" element={<CustomersView />} />
          <Route path="/chat" element={<ChatView />} />
          <Route path="/posts" element={<PostsView />} />
          <Route path="/marketing" element={<MarketingView />} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/settings" element={<SettingsView currentUser={user} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
