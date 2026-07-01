import { Link } from 'react-router-dom';
import { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { MinusIcon, PlusIcon, TrashIcon } from '../common/Icons';
import './CartItem.css';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const [updating, setUpdating] = useState(false);
  const { product } = item;

  async function changeQuantity(delta) {
    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > product.stock) return;
    setUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQty);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="cart-item">
      <Link to={`/products/${product.id}`} className="cart-item-image">
        <img src={product.imageUrl} alt={product.name} />
      </Link>

      <div className="cart-item-details">
        <Link to={`/products/${product.id}`} className="cart-item-name">{product.name}</Link>
        {product.brand && <span className="cart-item-brand">{product.brand}</span>}
        <span className="cart-item-unit-price">{formatCurrency(product.finalPrice)} each</span>
        {product.stock < item.quantity && (
          <span className="cart-item-warning">Only {product.stock} left in stock</span>
        )}
      </div>

      <div className="cart-item-quantity">
        <button onClick={() => changeQuantity(-1)} disabled={updating || item.quantity <= 1} aria-label="Decrease quantity">
          <MinusIcon width={14} height={14} />
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => changeQuantity(1)} disabled={updating || item.quantity >= product.stock} aria-label="Increase quantity">
          <PlusIcon width={14} height={14} />
        </button>
      </div>

      <div className="cart-item-subtotal">{formatCurrency(item.subtotal)}</div>

      <button className="cart-item-remove" onClick={() => onRemove(item.id)} aria-label="Remove item">
        <TrashIcon width={17} height={17} />
      </button>
    </div>
  );
}
