import { Link } from 'react-router-dom';
import { HiOutlineBolt } from 'react-icons/hi2';
import { FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon"><HiOutlineBolt /></div>
              Nam<span>Tech</span>
            </div>
            <p>
              Cửa hàng công nghệ và gaming gear uy tín hàng đầu.
              Cam kết sản phẩm chính hãng, giá tốt nhất.
            </p>
            <div className="footer-socials">
              <a href="#facebook" className="footer-social-link" aria-label="Facebook"><FiFacebook /></a>
              <a href="#instagram" className="footer-social-link" aria-label="Instagram"><FiInstagram /></a>
              <a href="#youtube" className="footer-social-link" aria-label="Youtube"><FiYoutube /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <Link to="/blog">Tin tức</Link>
            <a href="#policy">Chính sách đổi trả</a>
            <a href="#warranty">Bảo hành</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="footer-section">
            <h4>Liên hệ</h4>
            <a href="tel:0123456789">0336 671 981</a>
            <a href="mailto:info@namtech.vn">namdinh240505@gmail.com</a>
            <a href="#address"> TP. Hồ Chí Minh</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 <span>ViinShop</span>. All rights reserved.</p>
          <p>Powered by Viin </p>
        </div>
      </div>
    </footer>
  );
}
