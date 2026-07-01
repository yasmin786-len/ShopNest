import { useEffect, useState } from 'react';
import { orderApi } from '../../api/orderApi';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate, getOrderStatusVariant } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import './Admin.css';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'];

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState({ content: [], pageNumber: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data } = await orderApi.getAllOrders({ page, size: 10, sort: 'createdAt,desc' });
      setOrders(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      await orderApi.updateStatus(orderId, newStatus);
      showToast('Order status updated', 'success');
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update order status', 'error');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Orders</h1>
          <p>{orders.totalElements} orders placed across all customers</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="admin-table-empty"><Spinner size={24} /></td></tr>
            ) : orders.content.length === 0 ? (
              <tr><td colSpan={7} className="admin-table-empty">No orders yet</td></tr>
            ) : orders.content.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  <div>{order.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{order.customerEmail}</div>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{order.orderItems.length}</td>
                <td>{formatCurrency(order.totalAmount)}</td>
                <td>
                  <span className={`badge badge-${order.paymentStatus === 'PAID' ? 'success' : 'warning'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select"
                    style={{ padding: '6px 10px', fontSize: '0.82rem', minWidth: 150 }}
                    value={order.orderStatus}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination pageNumber={orders.pageNumber} totalPages={orders.totalPages} onPageChange={setPage} />
    </div>
  );
}
