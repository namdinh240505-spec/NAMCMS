// Nguyễn Đình Nam - 2123110170
// NamTech Shop - Orange & White Client Storefront React SPA

import React, { useState, useEffect } from 'react';
import { 
  FiShoppingCart, FiSearch, FiHeart, FiX, FiPlus, FiMinus, 
  FiArrowRight, FiInfo, FiChevronRight, FiGift, FiShield, FiTruck 
} from 'react-icons/fi';

const API_BASE = 'http://localhost:5000/api';

// Fallback high-quality e-commerce seed data
const SEED_PRODUCTS = [
  { id: 1, name: 'MacBook Air M2', price: 35400000, stockQuantity: 15, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', brand: 'Apple', colors: 'Xám không gian, Bạc', categoryName: 'Laptop', description: 'MacBook Air M2 với thiết kế siêu mỏng nhẹ, chip M2 hiệu năng vượt trội, thời lượng pin lên đến 18 giờ.' },
  { id: 2, name: 'iPhone 15 Pro Max', price: 29900000, stockQuantity: 28, imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600', brand: 'Apple', colors: 'Titan tự nhiên, Đen', categoryName: 'Điện thoại', description: 'iPhone 15 Pro Max sở hữu khung titan siêu bền nhẹ, chip A17 Pro đỉnh cao và camera zoom quang học 5x.' },
  { id: 3, name: 'Sony WH-1000XM5', price: 6800000, stockQuantity: 42, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', brand: 'Sony', colors: 'Đen, Bạc', categoryName: 'Phụ kiện', description: 'Sony WH-1000XM5 mang lại chất lượng chống ồn hàng đầu thế giới, âm thanh Hi-Res tuyệt hảo.' },
  { id: 4, name: 'Samsung Galaxy S24 Ultra', price: 27900000, stockQuantity: 22, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', brand: 'Samsung', colors: 'Vàng, Đen', categoryName: 'Điện thoại', description: 'Samsung Galaxy S24 Ultra tích hợp công nghệ AI thông minh vượt trội, camera 200MP zoom siêu phân giải.' },
  { id: 5, name: 'Dell XPS 13 Plus', price: 42500000, stockQuantity: 8, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600', brand: 'Dell', colors: 'Bạc', categoryName: 'Laptop', description: 'Dell XPS 13 Plus mang ngôn ngữ thiết kế tương lai với bàn phím tràn viền và dãy phím chức năng cảm ứng.' },
  { id: 6, name: 'Bàn phím cơ Keychron K2', price: 1850000, stockQuantity: 50, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', brand: 'Keychron', colors: 'Xám', categoryName: 'Phụ kiện', description: 'Bàn phím cơ Keychron K2 kết nối không dây bluetooth đa thiết bị, gõ phím êm ái, đèn nền RGB bắt mắt.' }
];

export default function App() {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch from Ocelot Gateway or fallback to high-quality local state
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('API Gateway offline');
        const json = await res.json();
        const data = json.data || json;
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.warn('API Gateway offline, showing beautiful mock catalog.', e);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by category and search query
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'Tất cả' || p.categoryName === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['Tất cả', 'Điện thoại', 'Laptop', 'Phụ kiện', 'Gia dụng'];

  // Add item to cart
  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { 
        productId: product.id, 
        productName: product.name, 
        price: product.price, 
        imageUrl: product.imageUrl, 
        quantity: 1 
      }]);
    }
  };

  // Modify cart item quantity
  const updateQty = (productId, change) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    alert(`Cảm ơn bạn đã trải nghiệm! Đơn hàng trị giá ${cartTotal.toLocaleString()}₫ đã được ghi nhận thành công.`);
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header */}
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <div className="logo-flash">⚡</div>
          <span>NAMTECH SHOP</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '0.4rem 1rem', border: '1px solid #E2E8F0', width: '320px' }}>
          <FiSearch style={{ color: '#94A3B8', marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Tìm sản phẩm, thương hiệu..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        <ul className="nav-links">
          <li><a href="#" className="nav-link active">Trang chủ</a></li>
          <li><a href="#" className="nav-link">Sản phẩm</a></li>
          <li><a href="#" className="nav-link">Khuyến mãi</a></li>
          <li><a href="#" className="nav-link">Liên hệ</a></li>
        </ul>

        <div className="nav-actions">
          <button className="nav-icon-btn" onClick={() => setCartOpen(true)}>
            <FiShoppingCart />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Sở Hữu Công Nghệ <span>Đỉnh Cao</span> Cùng NamTech</h1>
          <p>Trải nghiệm các sản phẩm smartphone, laptop và phụ kiện chính hãng 100% với ưu đãi ngập tràn cùng bảo hành lên đến 24 tháng.</p>
          <button className="hero-cta-btn" onClick={() => {
            const el = document.getElementById('catalog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Khám phá ngay <FiArrowRight style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
          </button>
        </div>
        <div className="hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800" 
            alt="Hero Banner Tech" className="hero-img" 
          />
          <div className="hero-badge" style={{ bottom: '20px', left: '-20px' }}>
            <FiGift style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Tặng kèm Voucher</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Giảm giá tới 500K</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', padding: '3rem 5%', backgroundColor: '#FAF8F6', borderTop: '1px solid #FFF7ED' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '1.3rem', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}><FiTruck style={{ margin: 'auto' }} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Giao hàng hỏa tốc</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nội thành trong vòng 2h</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '1.3rem', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}><FiShield style={{ margin: 'auto' }} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Bảo hành chính hãng</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cam kết 100% chính hãng</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '1.3rem', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}><FiGift style={{ margin: 'auto' }} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Ưu đãi ngập tràn</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nhiều quà tặng hấp dẫn</div>
          </div>
        </div>
      </section>

      {/* Catalog & Products */}
      <section id="catalog" style={{ scrollMarginTop: '80px' }}>
        <div className="section-header">
          <h2 className="section-title">Danh Mục Sản Phẩm</h2>
          <p className="section-subtitle">Lựa chọn các thiết bị công nghệ đỉnh cao phù hợp với phong cách của bạn</p>
        </div>

        {/* Categories filters */}
        <div className="categories-container">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map(prod => (
            <div key={prod.id} className="product-card">
              <div className="product-img-box" onClick={() => setSelectedProduct(prod)} style={{ cursor: 'pointer' }}>
                <img src={prod.imageUrl} alt={prod.name} className="product-card-img" />
                <span className="product-badge">New</span>
              </div>
              <div className="product-content">
                <span className="prod-category">{prod.categoryName}</span>
                <h3 className="prod-title" onClick={() => setSelectedProduct(prod)} style={{ cursor: 'pointer' }}>{prod.name}</h3>
                <span className="prod-brand">Thương hiệu: {prod.brand || 'Khác'}</span>
                <div className="prod-footer">
                  <span className="prod-price">{prod.price.toLocaleString()}₫</span>
                  <button className="add-cart-btn" onClick={() => addToCart(prod)}>
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">⚡ NAMTECH SHOP</div>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '350px' }}>
              NamTech chuyên cung cấp các giải pháp thiết bị công nghệ chính hãng hàng đầu tại Việt Nam.
            </p>
          </div>
          <div className="footer-col">
            <h4>Danh mục nổi bật</h4>
            <ul className="footer-links">
              <li><a href="#">Điện thoại di động</a></li>
              <li><a href="#">Máy tính xách tay</a></li>
              <li><a href="#">Phụ kiện công nghệ</a></li>
              <li><a href="#">Thiết bị gia dụng</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Liên hệ trợ giúp</h4>
            <ul className="footer-links">
              <li><a href="#">Địa chỉ: Quận 9, TP.HCM</a></li>
              <li><a href="#">Điện thoại: 0901234567</a></li>
              <li><a href="#">Email: dinhnam240505@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 NamTech Shop. Phát triển bởi Nguyễn Đình Nam - 2123110170. All rights reserved.
        </div>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="cart-drawer-backdrop" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <span className="cart-title">Giỏ hàng ({cartItemCount})</span>
              <button className="close-btn" onClick={() => setCartOpen(false)}><FiX /></button>
            </div>
            
            <div className="cart-items">
              {cart.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', color: 'var(--text-muted)' }}>
                  <FiShoppingCart style={{ fontSize: '3rem', opacity: 0.5 }} />
                  <p>Giỏ hàng của bạn đang trống</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="cart-item">
                    <img src={item.imageUrl} alt={item.productName} className="cart-item-img" />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.productName}</div>
                      <div className="cart-item-price">{item.price.toLocaleString()}₫</div>
                      <div className="cart-qty-control">
                        <button className="qty-btn" onClick={() => updateQty(item.productId, -1)}><FiMinus /></button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.productId, 1)}><FiPlus /></button>
                      </div>
                    </div>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.productId)}><FiX /></button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total-row">
                  <span>Tổng tiền:</span>
                  <span style={{ color: 'var(--primary-hover)', fontSize: '1.25rem' }}>{cartTotal.toLocaleString()}₫</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Tiến Hành Đặt Hàng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="product-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}><FiX /></button>
            
            <div>
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="modal-img" />
            </div>

            <div className="modal-info-col">
              <span className="modal-brand">{selectedProduct.brand}</span>
              <h2 className="modal-title">{selectedProduct.name}</h2>
              <div className="modal-price">{selectedProduct.price.toLocaleString()}₫</div>
              <p className="modal-desc">{selectedProduct.description || 'Không có mô tả chi tiết cho sản phẩm này.'}</p>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Danh mục:</span>
                  <span style={{ color: 'var(--text-main)' }}>{selectedProduct.categoryName}</span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Màu sắc:</span>
                  <span style={{ color: 'var(--text-main)' }}>{selectedProduct.colors || 'Không có'}</span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Tình trạng:</span>
                  <span style={{ color: selectedProduct.stockQuantity > 0 ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                    {selectedProduct.stockQuantity > 0 ? `Còn hàng (${selectedProduct.stockQuantity} sản phẩm)` : 'Hết hàng'}
                  </span>
                </div>
              </div>

              <button 
                className="checkout-btn" 
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                style={{ width: '100%' }}
              >
                Thêm Vào Giỏ Hàng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
