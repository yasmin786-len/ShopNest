import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { CartIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon, CloseIcon, LogOutIcon, GridIcon, BoxIcon } from '../common/Icons';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setMobileOpen(false);
    }
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="navbar-mobile-toggle" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-mark">S</span>
          <span className="navbar-logo-text">ShopNest</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands, and more"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" aria-label="Search">
            <SearchIcon width={18} height={18} />
          </button>
        </form>

        <nav className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <form className="navbar-search navbar-search-mobile" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <SearchIcon width={18} height={18} />
            </button>
          </form>

          <Link to="/products" onClick={() => setMobileOpen(false)}>Shop</Link>
          <Link to="/categories" onClick={() => setMobileOpen(false)}>Categories</Link>

          {isAuthenticated && (
            <Link to="/wishlist" className="navbar-icon-link" onClick={() => setMobileOpen(false)}>
              <HeartIcon width={20} height={20} />
              <span className="navbar-mobile-label">Wishlist</span>
            </Link>
          )}

          <Link to="/cart" className="navbar-icon-link navbar-cart" onClick={() => setMobileOpen(false)}>
            <CartIcon width={20} height={20} />
            {cart.totalItems > 0 && <span className="navbar-cart-badge">{cart.totalItems}</span>}
            <span className="navbar-mobile-label">Cart</span>
          </Link>

          {isAuthenticated ? (
            <div className="navbar-user" ref={menuRef}>
              <button className="navbar-icon-link" onClick={() => setMenuOpen((v) => !v)}>
                <UserIcon width={20} height={20} />
                <span className="navbar-mobile-label">{user?.firstName}</span>
              </button>
              {menuOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <strong>{user?.firstName} {user?.lastName}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}><UserIcon width={16} height={16} /> My Profile</Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)}><BoxIcon width={16} height={16} /> My Orders</Link>
                  {isAdmin && (
                    <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}><GridIcon width={16} height={16} /> Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout}><LogOutIcon width={16} height={16} /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
