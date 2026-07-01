import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDateTime, getOrderStatusVariant } from '../utils/formatters';
import Spinner from '../components/common/Spinner';
import './OrderDetails.css';

const STATUS_STEPS = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function OrderDetails() {
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
      <div className="container order-details-page">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spinner size={32} />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container order-details-page">
        <div className="empty-state">
          <h3>Order not found</h3>
          <Link to="/orders" className="btn btn-primary">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED' || order.orderStatus === 'RETURNED';

  return (
    <div className="container order-details-page">
      <div className="order-details-breadcrumb">
        <Link to="/orders">My Orders</Link> / <span>Order #{order.id}</span>
      </div>

      <div className="order-details-header">
        <div>
          <h1>Order #{order.id}</h1>
          <p>Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`badge badge-${getOrderStatusVariant(order.orderStatus)}`}>{order.orderStatus}</span>
      </div>

      {!isCancelled && (
        <div className="order-tracker">
          {STATUS_STEPS.map((step, idx) => (
            <div key={step} className={`order-tracker-step ${idx <= currentStepIndex ? 'done' : ''}`}>
              <span className="order-tracker-dot" />
              <span className="order-tracker-label">{step.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      )}

      <div className="order-details-layout">
        <div className="checkout-section">
          <h2>Items</h2>
          <div className="order-details-items">
            {order.orderItems.map((item) => (
              <div key={item.id} className="order-details-item">
                <img src={item.productImageUrl} alt={item.productName} />
                <div className="order-details-item-info">
                  <span>{item.productName}</span>
                  <span className="order-details-item-meta">Qty: {item.quantity} &times; {formatCurrency(item.price)}</span>
                </div>
                <strong>{formatCurrency(item.subtotal)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="checkout-section">
            <h2>Shipping Address</h2>
            <p className="order-details-address">
              {order.shippingName}<br />
              {order.shippingAddress}<br />
              {order.shippingPhone}
            </p>
          </div>

          <div className="checkout-section">
            <h2>Payment</h2>
            <div className="order-summary-row">
              <span>Method</span>
              <span>{order.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div className="order-summary-row">
              <span>Status</span>
              <span className={`badge badge-${order.paymentStatus === 'PAID' ? 'success' : 'warning'}`}>{order.paymentStatus}</span>
            </div>
            {order.transactionRef && (
              <div className="order-summary-row">
                <span>Reference</span>
                <span>{order.transactionRef}</span>
              </div>
            )}
            <div className="order-summary-divider" />
            <div className="order-summary-row order-summary-total">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
