import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistApi } from '../api/wishlistApi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';
import EmptyState from '../components/common/EmptyState';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import { HeartIcon, CartIcon, TrashIcon } from '../components/common/Icons';
import './Wishlist.css';

export default function Wishlist() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await wishlistApi.get();
      setItems(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  async function handleRemove(itemId) {
    try {
      await wishlistApi.remove(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      showToast('Removed from wishlist');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not remove item', 'error');
    }
  }

  async function handleAddToCart(item) {
    try {
      await addToCart(item.product.id, 1);
      showToast(`${item.product.name} added to cart`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add to cart', 'error');
    }
  }

  return (
    <div className="container wishlist-page">
      <div className="products-page-header">
        <h1>My Wishlist</h1>
        <p>{items.length} item{items.length !== 1 ? 's' : ''} saved for later</p>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<HeartIcon width={48} height={48} />}
          title="Your wishlist is empty"
          message="Save items you love by tapping the heart icon on any product."
          action={<Link to="/products" className="btn btn-primary">Browse Products</Link>}
        />
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <div key={item.id} className="card wishlist-card">
              <Link to={`/products/${item.product.id}`} className="wishlist-card-image">
                <img src={item.product.imageUrl} alt={item.product.name} />
              </Link>
              <div className="wishlist-card-body">
                <Link to={`/products/${item.product.id}`} className="wishlist-card-name">{item.product.name}</Link>
                <span className="wishlist-card-price">{formatCurrency(item.product.finalPrice)}</span>
                <div className="wishlist-card-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(item)} disabled={item.product.stock <= 0}>
                    <CartIcon width={14} height={14} /> {item.product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button className="btn btn-outline btn-icon btn-sm" onClick={() => handleRemove(item.id)} aria-label="Remove">
                    <TrashIcon width={15} height={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
