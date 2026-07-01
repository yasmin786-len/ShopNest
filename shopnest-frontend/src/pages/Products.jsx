import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import SortDropdown from '../components/product/SortDropdown';
import Pagination from '../components/common/Pagination';
import { SlidersIcon } from '../components/common/Icons';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [result, setResult] = useState({ content: [], pageNumber: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('categoryId') || undefined;
  const minPrice = searchParams.get('minPrice') || undefined;
  const maxPrice = searchParams.get('maxPrice') || undefined;
  const minRating = searchParams.get('minRating') || undefined;
  const inStock = searchParams.get('inStock') || undefined;
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const filters = useMemo(() => ({ categoryId, minPrice, maxPrice, minRating, inStock }), [categoryId, minPrice, maxPrice, minRating, inStock]);

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 12 };
      if (sort) params.sort = sort;
      if (categoryId) params.categoryId = categoryId;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.minRating = minRating;
      if (inStock) params.inStock = inStock;

      const { data } = keyword
        ? await productApi.search(keyword, params)
        : await productApi.getAll(params);

      setResult(data.data);
    } catch {
      setResult({ content: [], pageNumber: 0, totalPages: 0, totalElements: 0 });
    } finally {
      setLoading(false);
    }
  }, [keyword, page, sort, categoryId, minPrice, maxPrice, minRating, inStock]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [fetchProducts]);

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    next.delete('page');
    setSearchParams(next);
    setMobileFiltersOpen(false);
  }

  function handlePageChange(newPage) {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage);
    setSearchParams(next);
  }

  function clearFilters() {
    const next = new URLSearchParams();
    if (keyword) next.set('keyword', keyword);
    setSearchParams(next);
  }

  return (
    <div className="container products-page">
      <div className="products-page-header">
        <h1>{keyword ? `Results for "${keyword}"` : 'All Products'}</h1>
        <p>{result.totalElements} product{result.totalElements !== 1 ? 's' : ''} available</p>
      </div>

      <div className="products-layout">
        <div className={mobileFiltersOpen ? 'mobile-filters-open' : ''}>
          <ProductFilters categories={categories} filters={filters} onChange={updateParams} onClear={clearFilters} />
        </div>

        <div>
          <div className="products-toolbar">
            <button
              className="btn btn-outline btn-sm products-mobile-filter-toggle"
              onClick={() => setMobileFiltersOpen((v) => !v)}
            >
              <SlidersIcon width={15} height={15} /> Filters
            </button>
            <span className="products-toolbar-count">
              Showing {result.content.length} of {result.totalElements} results
            </span>
            <label className="products-toolbar-sort">
              Sort by
              <SortDropdown value={sort} onChange={(value) => updateParams({ sort: value || undefined })} />
            </label>
          </div>

          <ProductGrid products={result.content} loading={loading} />

          <Pagination
            pageNumber={result.pageNumber}
            totalPages={result.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
