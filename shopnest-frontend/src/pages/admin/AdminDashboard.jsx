import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/userApi';
import { formatCurrency, formatDate, getOrderStatusVariant } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';
import { UsersIcon, PackageIcon, BoxIcon, DollarSignIcon } from '../../components/common/Icons';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your store's performance</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-icon indigo"><UsersIcon width={22} height={22} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalUsers}</span>
            <span className="stat-card-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon blue"><PackageIcon width={22} height={22} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalProducts}</span>
            <span className="stat-card-label">Total Products</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon warning"><BoxIcon width={22} height={22} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalOrders}</span>
            <span className="stat-card-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon success"><DollarSignIcon width={22} height={22} /></div>
          <div className="stat-card-info">
            <span className="stat-card-value">{formatCurrency(stats.totalRevenue)}</span>
            <span className="stat-card-label">Total Revenue</span>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.pendingOrders}</span>
            <span className="stat-card-label">Pending / Processing</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.deliveredOrders}</span>
            <span className="stat-card-label">Delivered Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.inStockProducts}</span>
            <span className="stat-card-label">In Stock Products</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.outOfStockProducts}</span>
            <span className="stat-card-label">Out of Stock</span>
          </div>
        </div>
      </div>

      <div className="admin-page-header">
        <h1 style={{ fontSize: '1.15rem' }}>Recent Orders</h1>
        <Link to="/admin/orders" className="section-link">View all orders</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.length === 0 ? (
              <tr><td colSpan={5} className="admin-table-empty">No orders yet</td></tr>
            ) : stats.recentOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customerName}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td><span className={`badge badge-${getOrderStatusVariant(order.orderStatus)}`}>{order.orderStatus}</span></td>
                <td>{formatCurrency(order.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
