import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../api/categoryApi';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import './Categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container categories-page">
      <div className="products-page-header">
        <h1>All Categories</h1>
        <p>Browse our full range of product categories</p>
      </div>

      <div className="categories-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : categories.map((cat) => (
              <Link key={cat.id} to={`/products?categoryId=${cat.id}`} className="card card-hover category-card">
                <div className="category-card-image">
                  <img src={cat.imageUrl} alt={cat.name} />
                </div>
                <div className="category-card-body">
                  <h3>{cat.name}</h3>
                  <span>{cat.productCount} product{cat.productCount !== 1 ? 's' : ''}</span>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
