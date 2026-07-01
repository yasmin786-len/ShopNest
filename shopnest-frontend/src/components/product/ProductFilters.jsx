import { useEffect, useState } from 'react';
import { SlidersIcon } from '../common/Icons';
import './ProductFilters.css';

const RATING_OPTIONS = [4, 3, 2, 1];

export default function ProductFilters({ categories, filters, onChange, onClear }) {
  const [localMin, setLocalMin] = useState(filters.minPrice || '');
  const [localMax, setLocalMax] = useState(filters.maxPrice || '');

  useEffect(() => {
    setLocalMin(filters.minPrice || '');
    setLocalMax(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  function applyPriceRange(e) {
    e.preventDefault();
    onChange({ minPrice: localMin || undefined, maxPrice: localMax || undefined });
  }

  return (
    <aside className="product-filters">
      <div className="product-filters-header">
        <h3><SlidersIcon width={17} height={17} /> Filters</h3>
        <button className="product-filters-clear" onClick={onClear}>Clear all</button>
      </div>

      <div className="filter-section">
        <h4>Category</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="category"
              checked={!filters.categoryId}
              onChange={() => onChange({ categoryId: undefined })}
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="filter-option">
              <input
                type="radio"
                name="category"
                checked={String(filters.categoryId) === String(cat.id)}
                onChange={() => onChange({ categoryId: cat.id })}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <form className="filter-price-form" onSubmit={applyPriceRange}>
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
          />
          <span>&ndash;</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
          />
          <button type="submit" className="btn btn-outline btn-sm">Go</button>
        </form>
      </div>

      <div className="filter-section">
        <h4>Minimum Rating</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="rating"
              checked={!filters.minRating}
              onChange={() => onChange({ minRating: undefined })}
            />
            Any Rating
          </label>
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="filter-option">
              <input
                type="radio"
                name="rating"
                checked={String(filters.minRating) === String(r)}
                onChange={() => onChange({ minRating: r })}
              />
              {r}+ stars
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Availability</h4>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={!!filters.inStock}
            onChange={(e) => onChange({ inStock: e.target.checked ? true : undefined })}
          />
          In Stock Only
        </label>
      </div>
    </aside>
  );
}
