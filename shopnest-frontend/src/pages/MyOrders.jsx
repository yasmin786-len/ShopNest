import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { formatCurrency, formatDate, getOrderStatusVariant } from '../utils/formatters';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { BoxIcon } from '../components/common/Icons';
import './MyOrders.css';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders()
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container my-orders-page">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spinner size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="container my-orders-page">
      <div className="products-page-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<BoxIcon width={48} height={48} />}
          title="No orders yet"
          message="When you place an order, it will show up here."
          action={<Link to="/products" className="btn btn-primary">Start Shopping</Link>}
        />
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link to={`/orders/${order.id}`} key={order.id} className="card order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-card-id">Order #{order.id}</span>
                  <span className="order-card-date">Placed on {formatDate(order.createdAt)}</span>
                </div>
                <span className={`badge badge-${getOrderStatusVariant(order.orderStatus)}`}>{order.orderStatus}</span>
              </div>

              <div className="order-card-items">
                {order.orderItems.slice(0, 4).map((item) => (
                  <img key={item.id} src={item.productImageUrl} alt={item.productName} />
                ))}
                {order.orderItems.length > 4 && (
                  <span className="order-card-more">+{order.orderItems.length - 4}</span>
                )}
              </div>

              <div className="order-card-footer">
                <span>{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</span>
                <strong>{formatCurrency(order.totalAmount)}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
