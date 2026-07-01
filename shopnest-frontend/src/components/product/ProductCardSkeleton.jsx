import './ProductCardSkeleton.css';

export default function ProductCardSkeleton() {
  return (
    <div className="card product-skeleton">
      <div className="skeleton product-skeleton-image" />
      <div className="product-skeleton-body">
        <div className="skeleton product-skeleton-line" style={{ width: '40%' }} />
        <div className="skeleton product-skeleton-line" style={{ width: '90%' }} />
        <div className="skeleton product-skeleton-line" style={{ width: '60%' }} />
        <div className="skeleton product-skeleton-line" style={{ width: '50%', height: 24 }} />
      </div>
    </div>
  );
}
