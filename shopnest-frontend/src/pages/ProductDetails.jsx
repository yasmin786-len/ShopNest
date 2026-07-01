import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { wishlistApi } from '../api/wishlistApi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, getStockLabel } from '../utils/formatters';
import StarRating from '../components/common/StarRating';
import ProductGrid from '../components/product/ProductGrid';
import Spinner from '../components/common/Spinner';
import { CartIcon, HeartIcon, MinusIcon, PlusIcon, TruckIcon, CreditCardIcon, BoxIcon } from '../components/common/Icons';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wishing, setWishing] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setQuantity(1);

    productApi.getById(id).then(async ({ data }) => {
      if (!mounted) return;
      setProduct(data.data);
      try {
        const relatedRes = await productApi.getByCategory(data.data.categoryId, { size: 5 });
        if (mounted) {
          setRelated(relatedRes.data.data.content.filter((p) => p.id !== data.data.id));
        }
      } catch {
        // ignore related products failure
      }
    }).catch(() => {
      if (mounted) setProduct(null);
    }).finally(() => {
      if (mounted) setLoading(false);
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => { mounted = false; };
  }, [id]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      showToast(`${product.name} added to cart`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add item to cart', 'error');
    } finally {
      setAdding(false);
    }
  }

  async function handleBuyNow() {
    await handleAddToCart();
    navigate('/cart');
  }

  async function handleWishlist() {
    if (!isAuthenticated) {
      showToast('Please sign in to use your wishlist');
      return;
    }
    setWishing(true);
    try {
      await wishlistApi.add(product.id);
      showToast('Added to wishlist', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add to wishlist', 'error');
    } finally {
      setWishing(false);
    }
  }

  if (loading) {
    return (
      <div className="container product-details">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spinner size={32} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container product-details">
        <div className="empty-state">
          <h3>Product not found</h3>
          <p>This product may have been removed.</p>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const stockInfo = getStockLabel(product.stock);
  const hasDiscount = Number(product.discount) > 0;

  return (
    <div className="container product-details">
      <div className="product-details-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{' '}
        <Link to={`/products?categoryId=${product.categoryId}`}>{product.categoryName}</Link> / <span>{product.name}</span>
      </div>

      <div className="product-details-layout">
        <div className="product-details-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div>
          {product.brand && <div className="product-details-brand">{product.brand}</div>}
          <h1 className="product-details-title">{product.name}</h1>

          <div className="product-details-rating-row">
            <StarRating rating={product.rating} />
            <span>·</span>
            <span>{product.categoryName}</span>
          </div>

          <div className="product-details-price-block">
            <span className="product-details-price">{formatCurrency(product.finalPrice)}</span>
            {hasDiscount && <span className="product-details-mrp">{formatCurrency(product.price)}</span>}
          </div>
          {hasDiscount && (
            <p className="product-details-savings">
              You save {formatCurrency(product.price - product.finalPrice)} ({Number(product.discount)}% off)
            </p>
          )}

          <div className="product-details-stock-row">
            <span className={`badge badge-${stockInfo.variant}`}>{stockInfo.label}</span>
          </div>

          <p className="product-details-description">{product.description}</p>

          {product.stock > 0 && (
            <div className="product-details-qty-row">
              <span className="form-label">Quantity</span>
              <div className="cart-item-quantity">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>
                  <MinusIcon width={14} height={14} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>
                  <PlusIcon width={14} height={14} />
                </button>
              </div>
            </div>
          )}

          <div className="product-details-actions">
            <button className="btn btn-secondary btn-lg" onClick={handleAddToCart} disabled={adding || product.stock <= 0}>
              <CartIcon width={18} height={18} /> {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleBuyNow} disabled={adding || product.stock <= 0}>
              Buy Now
            </button>
            <button className="btn btn-outline btn-icon btn-lg" onClick={handleWishlist} disabled={wishing} aria-label="Add to wishlist">
              <HeartIcon width={20} height={20} />
            </button>
          </div>

          <div className="product-details-perks">
            <div className="product-details-perk">
              <TruckIcon width={22} height={22} />
              Free delivery on orders above ₹999
            </div>
            <div className="product-details-perk">
              <CreditCardIcon width={22} height={22} />
              Secure payments via Card, UPI, or COD
            </div>
            <div className="product-details-perk">
              <BoxIcon width={22} height={22} />
              7-day easy returns
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="product-details-related">
          <h2>You may also like</h2>
          <ProductGrid products={related} loading={false} />
        </div>
      )}
    </div>
  );
}
