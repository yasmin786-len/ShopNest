import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GridIcon, BoxIcon, PackageIcon, UsersIcon, LogOutIcon } from '../common/Icons';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo">
          <span className="navbar-logo-mark">S</span>
          <span className="navbar-logo-text">ShopNest</span>
        </Link>
        <span className="admin-badge">Admin Panel</span>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <GridIcon width={18} height={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
            <PackageIcon width={18} height={18} /> Products
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'active' : ''}>
            <BoxIcon width={18} height={18} /> Categories
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
            <BoxIcon width={18} height={18} /> Orders
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
            <UsersIcon width={18} height={18} /> Users
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-mini">
            <strong>{user?.firstName} {user?.lastName}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="admin-logout-btn" onClick={logout}>
            <LogOutIcon width={16} height={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
