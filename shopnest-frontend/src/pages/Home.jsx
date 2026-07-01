import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import { ArrowRightIcon, TruckIcon } from '../components/common/Icons';
import './Home.css';

const REVIEWS = [
  {
    name: 'Aisha R.',
    location: 'Bengaluru',
    quote: 'Fast delivery and the quality matched the photos exactly. My go-to for electronics now.',
  },
  {
    name: 'Rohan M.',
    location: 'Pune',
    quote: 'Customer support resolved my return in minutes. Genuinely impressed with the experience.',
  },
  {
    name: 'Priya K.',
    location: 'Delhi',
    quote: 'Great prices on flash deals — I saved a ton on my home setup this month.',
  },
];

function HorizontalProductStrip({ products, loading, skeletonCount = 10 }) {
  return (
    <div className="h-strip">
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="h-strip-item">
              <ProductCardSkeleton />
            </div>
          ))
        : products.map((product) => (
            <div key={product.id} className="h-strip-item">
              <ProductCard product={product} />
            </div>
          ))}
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        const [catRes, featRes, trendRes, newRes, dealsRes, bestRes] = await Promise.all([
          categoryApi.getAll(),
          productApi.getFeatured(),
          productApi.getTrending(),
          productApi.getNewArrivals(),
          productApi.getFlashDeals(),
          productApi.getAll({ sort: 'rating,desc', size: 20 }),
        ]);
        if (!mounted) return;
        setCategories(catRes.data.data);
        setFeatured(featRes.data.data);
        setTrending(trendRes.data.data);
        setNewArrivals(newRes.data.data);
        setFlashDeals(dealsRes.data.data);
        setBestSellers(bestRes.data.data.content);
      } catch {
        // Sections render individual empty states.
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadHomeData();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-shape hero-shape-1" />
        <div className="hero-shape hero-shape-2" />
        <div className="container hero-inner">
          <div>
            <span className="hero-eyebrow">⚡ Flash Sale — Up to 30% Off</span>
            <h1>Shop smarter, <span>live better</span></h1>
            <p>
              Discover electronics, fashion, home essentials, and more — curated for quality,
              priced for value, and delivered fast.
            </p>
            <div className="hero-cta">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now <ArrowRightIcon width={18} height={18} />
              </Link>
              <Link to="/categories" className="btn btn-outline btn-lg">Browse Categories</Link>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
              alt="Featured products on display"
            />
            <div className="hero-visual-badge">
              <TruckIcon width={26} height={26} color="var(--color-indigo-600)" />
              <div>
                <strong>Free Delivery</strong>
                <span>On orders above ₹999</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="home-section container">
        <div className="section-header">
          <div className="section-header-text">
            <h2>Shop by Category</h2>
            <p>Find exactly what you&apos;re looking for</p>
          </div>
          <Link to="/categories" className="section-link">
            View all <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>
        <div className="category-grid">
          {(loading ? Array.from({ length: 6 }) : categories).map((cat, i) =>
            cat ? (
              <Link key={cat.id} to={`/products?categoryId=${cat.id}`} className="category-tile">
                <div className="category-tile-image">
                  <img src={cat.imageUrl} alt={cat.name} />
                </div>
                <span>{cat.name}</span>
              </Link>
            ) : (
              <div key={i} className="category-tile">
                <div className="skeleton category-tile-image" />
                <div className="skeleton" style={{ width: 60, height: 12 }} />
              </div>
            )
          )}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="home-section home-section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-header-text">
              <h2>Featured Products</h2>
              <p>Hand-picked favourites our customers love</p>
            </div>
            <Link to="/products" className="section-link">
              View all <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
          <HorizontalProductStrip products={featured} loading={loading} />
        </div>
      </section>

      {/* ── Flash Deals ── */}
      <section className="home-section container">
        <div className="section-header">
          <div className="section-header-text">
            <h2>⚡ Flash Deals</h2>
            <p>Limited-time discounts — grab them before they&apos;re gone</p>
          </div>
          <Link to="/products?sort=discount,desc" className="section-link">
            View all <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>
        <HorizontalProductStrip products={flashDeals} loading={loading} />
      </section>

      {/* ── Trending Now ── */}
      <section className="home-section home-section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-header-text">
              <h2>Trending Now</h2>
              <p>What everyone&apos;s adding to their cart this week</p>
            </div>
            <Link to="/products" className="section-link">
              View all <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
          <HorizontalProductStrip products={trending} loading={loading} />
        </div>
      </section>

      {/* ── Promotional Banner ── */}
      <section className="home-section container">
        <div className="promo-banner">
          <div className="promo-banner-text">
            <span className="badge">Members Only</span>
            <h2>Get early access to every sale</h2>
            <p>Create a free account to unlock exclusive deals, faster checkout, and order tracking.</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg">
            Join ShopNest <ArrowRightIcon width={18} height={18} />
          </Link>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="home-section home-section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-header-text">
              <h2>New Arrivals</h2>
              <p>Just landed — be the first to shop them</p>
            </div>
            <Link to="/products?sort=createdAt,desc" className="section-link">
              View all <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
          <HorizontalProductStrip products={newArrivals} loading={loading} />
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="home-section container">
        <div className="section-header">
          <div className="section-header-text">
            <h2>Best Sellers</h2>
            <p>Top-rated picks across every category</p>
          </div>
          <Link to="/products?sort=rating,desc" className="section-link">
            View all <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>
        <HorizontalProductStrip products={bestSellers} loading={loading} />
      </section>

      {/* ── Customer Reviews ── */}
      <section className="home-section home-section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-header-text">
              <h2>What Our Customers Say</h2>
              <p>Real feedback from real shoppers</p>
            </div>
          </div>
          <div className="reviews-grid">
            {REVIEWS.map((review) => (
              <div key={review.name} className="review-card">
                <p className="review-card-quote">&ldquo;{review.quote}&rdquo;</p>
                <div className="review-card-person">
                  <span className="review-avatar">{review.name.charAt(0)}</span>
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
