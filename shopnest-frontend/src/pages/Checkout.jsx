import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderApi } from '../api/orderApi';
import { formatCurrency } from '../utils/formatters';
import OrderSummary from '../components/cart/OrderSummary';
import Spinner from '../components/common/Spinner';
import { CreditCardIcon, BoxIcon, TruckIcon } from '../components/common/Icons';
import './Checkout.css';

const PAYMENT_METHODS = [
  { value: 'CREDIT_CARD', label: 'Credit / Debit Card', icon: CreditCardIcon },
  { value: 'UPI', label: 'UPI', icon: BoxIcon },
  { value: 'COD', label: 'Cash on Delivery', icon: TruckIcon },
];

export default function Checkout() {
  const { user } = useAuth();
  const { cart, loading: cartLoading } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shippingName: '',
    shippingAddress: '',
    shippingPhone: '',
    paymentMethod: 'COD',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        shippingName: `${user.firstName} ${user.lastName}`,
        shippingAddress: user.address || '',
        shippingPhone: user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!cartLoading && cart.items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cartLoading, cart.items.length, navigate]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function selectPaymentMethod(method) {
    setForm((prev) => ({ ...prev, paymentMethod: method }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner('');
    setErrors({});
    setSubmitting(true);

    try {
      const { data } = await orderApi.placeOrder(form);
      showToast('Order placed successfully!', 'success');
      navigate(`/order-success/${data.data.id}`);
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.validationErrors) {
        setErrors(responseData.validationErrors);
      } else {
        setBanner(responseData?.message || 'Could not place order. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (cartLoading) {
    return (
      <div className="container checkout-page">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spinner size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <div className="products-page-header">
        <h1>Checkout</h1>
        <p>Review your order and complete your purchase</p>
      </div>

      {banner && <div className="auth-banner-error">{banner}</div>}

      <form onSubmit={handleSubmit}>
        <div className="checkout-layout">
          <div>
            <div className="checkout-section">
              <h2><span className="checkout-step-number">1</span> Shipping Details</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="shippingName">Full Name</label>
                <input
                  id="shippingName" name="shippingName" className={`form-input ${errors.shippingName ? 'has-error' : ''}`}
                  required value={form.shippingName} onChange={handleChange}
                />
                {errors.shippingName && <span className="form-error">{errors.shippingName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="shippingAddress">Delivery Address</label>
                <textarea
                  id="shippingAddress" name="shippingAddress" className={`form-textarea ${errors.shippingAddress ? 'has-error' : ''}`}
                  required value={form.shippingAddress} onChange={handleChange}
                  placeholder="House number, street, city, state, PIN code"
                />
                {errors.shippingAddress && <span className="form-error">{errors.shippingAddress}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="shippingPhone">Phone Number</label>
                <input
                  id="shippingPhone" name="shippingPhone" className={`form-input ${errors.shippingPhone ? 'has-error' : ''}`}
                  required value={form.shippingPhone} onChange={handleChange} placeholder="9876543210"
                />
                {errors.shippingPhone && <span className="form-error">{errors.shippingPhone}</span>}
              </div>
            </div>

            <div className="checkout-section">
              <h2><span className="checkout-step-number">2</span> Payment Method</h2>

              <div className="payment-options">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.value}
                      className={`payment-option ${form.paymentMethod === method.value ? 'active' : ''}`}
                      onClick={() => selectPaymentMethod(method.value)}
                      role="radio"
                      aria-checked={form.paymentMethod === method.value}
                      tabIndex={0}
                    >
                      <Icon width={22} height={22} />
                      {method.label}
                    </div>
                  );
                })}
              </div>

              {form.paymentMethod === 'CREDIT_CARD' && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cardNumber">Card Number</label>
                    <input
                      id="cardNumber" name="cardNumber" className="form-input" required
                      value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19}
                    />
                  </div>
                  <div className="auth-form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="cardExpiry">Expiry (MM/YY)</label>
                      <input
                        id="cardExpiry" name="cardExpiry" className="form-input" required
                        value={form.cardExpiry} onChange={handleChange} placeholder="08/29" maxLength={5}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cardCvv">CVV</label>
                      <input
                        id="cardCvv" name="cardCvv" type="password" className="form-input" required
                        value={form.cardCvv} onChange={handleChange} placeholder="123" maxLength={4}
                      />
                    </div>
                  </div>
                  <p className="form-error" style={{ color: 'var(--color-text-muted)' }}>
                    This is a simulated payment — no real card network is contacted.
                  </p>
                </>
              )}

              {form.paymentMethod === 'UPI' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="upiId">UPI ID</label>
                  <input
                    id="upiId" name="upiId" className="form-input" required
                    value={form.upiId} onChange={handleChange} placeholder="yourname@upi"
                  />
                  <p className="form-error" style={{ color: 'var(--color-text-muted)' }}>
                    This is a simulated payment — no real UPI collect request is sent.
                  </p>
                </div>
              )}

              {form.paymentMethod === 'COD' && (
                <p className="form-error" style={{ color: 'var(--color-text-muted)' }}>
                  Pay with cash when your order is delivered.
                </p>
              )}
            </div>
          </div>

          <OrderSummary totalItems={cart.totalItems} totalAmount={cart.totalAmount}>
            <div className="checkout-order-items" style={{ marginTop: 'var(--space-4)' }}>
              {cart.items.map((item) => (
                <div key={item.id} className="checkout-order-item">
                  <img src={item.product.imageUrl} alt={item.product.name} />
                  <div className="checkout-order-item-info">
                    <p>{item.product.name}</p>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-order-item-price">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
              {submitting ? <Spinner size={18} /> : `Place Order — ${formatCurrency(cart.totalAmount)}`}
            </button>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
}
