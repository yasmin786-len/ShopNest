import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { CartIcon, ArrowRightIcon } from '../components/common/Icons';
import './Cart.css';

export default function Cart() {
  const { cart, loading, updateCartItem, removeCartItem, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleUpdateQuantity(itemId, quantity) {
    try {
      await updateCartItem(itemId, quantity);
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update quantity', 'error');
    }
  }

  async function handleRemove(itemId) {
    try {
      await removeCartItem(itemId);
      showToast('Item removed from cart');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not remove item', 'error');
    }
  }

  async function handleClear() {
    try {
      await clearCart();
      showToast('Cart cleared');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not clear cart', 'error');
    }
  }

  if (loading && cart.items.length === 0) {
    return (
      <div className="container cart-page">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spinner size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <div className="products-page-header cart-page-header">
        <h1>Shopping Cart</h1>
        {cart.items.length > 0 && (
          <button className="btn btn-outline btn-sm" onClick={handleClear}>Clear Cart</button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <EmptyState
          icon={<CartIcon width={48} height={48} />}
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Start exploring our products."
          action={<Link to="/products" className="btn btn-primary">Start Shopping</Link>}
        />
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <OrderSummary totalItems={cart.totalItems} totalAmount={cart.totalAmount}>
            <button
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: 'var(--space-4)' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRightIcon width={18} height={18} />
            </button>
            <Link to="/products" className="cart-continue-link">Continue Shopping</Link>
          </OrderSummary>
        </div>
      )}
    </div>
  );
}
