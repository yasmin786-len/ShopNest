import { formatCurrency } from '../../utils/formatters';
import './OrderSummary.css';

export default function OrderSummary({ totalItems, totalAmount, shippingFee = 0, children }) {
  const grandTotal = Number(totalAmount) + shippingFee;

  return (
    <div className="order-summary card">
      <h3>Order Summary</h3>
      <div className="order-summary-row">
        <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
      <div className="order-summary-row">
        <span>Shipping</span>
        <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
      </div>
      <div className="order-summary-divider" />
      <div className="order-summary-row order-summary-total">
        <span>Total</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>
      {children}
    </div>
  );
}
