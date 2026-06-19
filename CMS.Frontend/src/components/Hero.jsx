import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import { getBanners, getImageUrl } from '../api';
import '../styles/Hero.css';

export default function Hero() {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      try {
        const data = await getBanners('HomeHero');
        setBanners(data || []);
      } catch (err) {
        console.error('Error loading banners:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  if (loading) {
    return (
      <section className="hero hero-loading">
        <div className="container hero-container" style={{ justifyContent: 'center', minHeight: '400px' }}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </section>
    );
  }

  // Fallback if no active banners
  if (banners.length === 0) {
    return (
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge animate-fade-in-up">
              <FiZap /> Ưu đãi mùa hè — Giảm đến 50%
            </div>
            <h1 className="animate-fade-in-up">
              Đồ công nghệ &<br />
              <span className="highlight">Gaming Gear</span><br />
              chất lượng cao
            </h1>
            <p className="animate-fade-in-up">
              Khám phá bộ sưu tập gaming gear và phụ kiện công nghệ mới nhất.
              Sản phẩm chính hãng, giá tốt nhất thị trường.
            </p>
            <div className="hero-actions animate-fade-in-up">
              <Link to="/products" className="hero-btn-primary">
                Mua sắm ngay <FiArrowRight />
              </Link>
              <Link to="/blog" className="hero-btn-secondary">
                Xem tin tức
              </Link>
            </div>
            <div className="hero-stats animate-fade-in-up">
              <div className="hero-stat">
                <h3>500+</h3>
                <p>Sản phẩm</p>
              </div>
              <div className="hero-stat">
                <h3>10K+</h3>
                <p>Khách hàng</p>
              </div>
              <div className="hero-stat">
                <h3>99%</h3>
                <p>Hài lòng</p>
              </div>
            </div>
          </div>
          <div className="hero-image-container animate-fade-in-right">
            <img src="/images/atk.webp" alt="Gaming Gear & Tech" className="hero-image" />
            <div className="hero-image-glow"></div>
          </div>
        </div>
        <div className="hero-shapes">
          <div className="hero-grid-pattern"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero hero-slider">
      {banners.map((banner, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={banner.id}
            className={`hero-slide ${isActive ? 'active' : ''}`}
          >
            <div className="container hero-container">
              <div className="hero-content">
                {banner.description && (
                  <div className="hero-badge">
                    <FiZap /> {banner.description}
                  </div>
                )}
                <h1>
                  <span className="highlight" style={{ whiteSpace: 'pre-line' }}>{banner.title}</span>
                </h1>
                <div className="hero-actions">
                  <Link to={banner.linkUrl || "/products"} className="hero-btn-primary">
                    Khám phá ngay <FiArrowRight />
                  </Link>
                  <Link to="/products" className="hero-btn-secondary">
                    Tất cả sản phẩm
                  </Link>
                </div>
              </div>
              <div className="hero-image-container">
                <img
                  src={getImageUrl(banner.imageUrl)}
                  alt={banner.title}
                  className="hero-image"
                />
                <div className="hero-image-glow"></div>
              </div>
            </div>
          </div>
        );
      })}

      {banners.length > 1 && (
        <div className="hero-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="hero-shapes">
        <div className="hero-grid-pattern"></div>
      </div>
    </section>
  );
}
