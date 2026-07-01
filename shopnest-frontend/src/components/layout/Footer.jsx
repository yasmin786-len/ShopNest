import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { MailIcon, PhoneIcon, MapPinIcon } from '../common/Icons';
import './Footer.css';

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    showToast('Thanks for subscribing! Check your inbox for a welcome offer.', 'success');
    setEmail('');
  }

  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="container footer-newsletter-inner">
          <div>
            <h3>Get 10% off your first order</h3>
            <p>Subscribe to our newsletter for deals, new arrivals, and style updates.</p>
          </div>
          <form onSubmit={handleSubscribe} className="footer-newsletter-form">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="container footer-main">
        <div className="footer-col footer-brand">
          <div className="footer-logo">
            <span className="navbar-logo-mark">S</span>
            <span className="navbar-logo-text">ShopNest</span>
          </div>
          <p>Everything you need, delivered to your door. Curated electronics, fashion, home goods, and more — all in one place.</p>
          <div className="footer-contact">
            <span><MapPinIcon width={16} height={16} /> 4th Floor, Commerce Tower, Hyderabad, India</span>
            <span><PhoneIcon width={16} height={16} /> +91 1800-123-4567</span>
            <span><MailIcon width={16} height={16} /> support@shopnest.example</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/products?sort=discount,desc">Flash Deals</Link>
          <Link to="/products?sort=createdAt,desc">New Arrivals</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/profile">My Profile</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">My Cart</Link>
        </div>

        <div className="footer-col">
          <h4>Help</h4>
          <a href="#shipping">Shipping Info</a>
          <a href="#returns">Returns &amp; Refunds</a>
          <a href="#faq">FAQs</a>
          <a href="#contact">Contact Us</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopNest. All rights reserved.</p>
        <div className="footer-payment-badges">
          <span className="badge badge-indigo">Visa</span>
          <span className="badge badge-indigo">Mastercard</span>
          <span className="badge badge-indigo">UPI</span>
          <span className="badge badge-indigo">COD</span>
        </div>
      </div>
    </footer>
  );
}
