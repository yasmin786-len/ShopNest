import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import Spinner from '../components/common/Spinner';
import { CheckCircleIcon } from '../components/common/Icons';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getById(id)
      .then((res) => setOrder(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container order-success-page">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spinner size={32} />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container order-success-page">
        <div className="empty-state">
          <h3>Order not found</h3>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container order-success-page">
      <div className="order-success-card">
        <div className="order-success-icon">
          <CheckCircleIcon width={56} height={56} />
        </div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you, {order.shippingName}. Your order has been confirmed and is being prepared for shipment.</p>

        <div className="order-success-details">
          <div>
            <span>Order ID</span>
            <strong>#{order.id}</strong>
          </div>
          <div>
            <span>Order Date</span>
            <strong>{formatDate(order.createdAt)}</strong>
          </div>
          <div>
            <span>Payment Method</span>
            <strong>{order.paymentMethod.replace('_', ' ')}</strong>
          </div>
          <div>
            <span>Total Amount</span>
            <strong>{formatCurrency(order.totalAmount)}</strong>
          </div>
        </div>

        <div className="order-success-actions">
          <Link to={`/orders`} className="btn btn-secondary">View My Orders</Link>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
