import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import EmptyState from '../common/EmptyState';
import { BoxIcon } from '../common/Icons';
import './ProductGrid.css';

export default function ProductGrid({ products, loading, skeletonCount = 8, onWishlistChange }) {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<BoxIcon width={48} height={48} />}
        title="No products found"
        message="Try adjusting your filters or search for something else."
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onWishlistChange={onWishlistChange} />
      ))}
    </div>
  );
}
