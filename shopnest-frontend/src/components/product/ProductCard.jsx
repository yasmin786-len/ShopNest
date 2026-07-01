import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { wishlistApi } from '../../api/wishlistApi';
import { formatCurrency } from '../../utils/formatters';
import StarRating from '../common/StarRating';
import { CartIcon, HeartIcon } from '../common/Icons';
import './ProductCard.css';

export default function ProductCard({ product, onWishlistChange }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [wishing, setWishing] = useState(false);

  const hasDiscount = Number(product.discount) > 0;

  async function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your cart');
      return;
    }
    if (product.stock <= 0) return;

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      showToast(`${product.name} added to cart`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add item to cart', 'error');
    } finally {
      setAdding(false);
    }
  }

  async function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please sign in to use your wishlist');
      return;
    }
    setWishing(true);
    try {
      await wishlistApi.add(product.id);
      showToast('Added to wishlist', 'success');
      onWishlistChange?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add to wishlist', 'error');
    } finally {
      setWishing(false);
    }
  }

  return (
    <Link to={`/products/${product.id}`} className="card card-hover product-card">
      <div className="product-card-image-wrap">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
        {hasDiscount && <span className="badge badge-danger product-card-discount">{Number(product.discount)}% OFF</span>}
        <button
          className="product-card-wishlist"
          onClick={handleWishlist}
          disabled={wishing}
          aria-label="Add to wishlist"
        >
          <HeartIcon width={17} height={17} />
        </button>
        {product.stock <= 0 && <div className="product-card-overlay">Out of Stock</div>}
      </div>

      <div className="product-card-body">
        {product.brand && <span className="product-card-brand">{product.brand}</span>}
        <h3 className="product-card-name">{product.name}</h3>

        {Number(product.rating) > 0 && <StarRating rating={product.rating} size={12} />}

        <div className="product-card-price-row">
          <span className="product-card-price">{formatCurrency(product.finalPrice)}</span>
          {hasDiscount && <span className="product-card-mrp">{formatCurrency(product.price)}</span>}
        </div>

        <button
          className="btn btn-primary btn-sm btn-block product-card-add"
          onClick={handleAddToCart}
          disabled={adding || product.stock <= 0}
        >
          <CartIcon width={15} height={15} />
          {product.stock <= 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
