import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import HeroBanner from '../../components/HeroBanner'; 
import { Product, Category } from '../../types';
import API from '../../utils/api';
import './HomePage.css';

interface Feature { icon: string | React.ReactNode; title: string; desc: string; color: string; }

const features: Feature[] = [
  { icon: 'truck', title: 'Fresh Farm Delivery', desc: 'Harvested fresh, delivered safely', color: '#FFFFFF' },
  { icon: 'check', title: 'Certified Organic', desc: '100% verified organic products', color: '#FFFFFF' },
  { icon: 'check', title: 'Quality Guarantee', desc: '30-day satisfaction guarantee', color: '#FFFFFF' },
  { icon: 'phone', title: 'Farm Support 24/7', desc: 'Direct connection with farmers', color: '#FFFFFF' },
];

const HomePage: React.FC = () => {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, f, c, n] = await Promise.all([
          API.get('/products/trending'),
          API.get('/products?featured=true&limit=8'),
          API.get('/categories'),
          API.get('/products?sort=newest&limit=8'),
        ]);
        setTrendingProducts(t.data.products);
        setFeaturedProducts(f.data.products);
        setCategories(c.data.categories.slice(0, 8));
        setNewArrivals(n.data.products);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    
    <div className="home-page-wrapper">
      
      {/* Full-Width Hero Banner */}
      <HeroBanner />

      {/* Flash Sale Banner */}
      <section className="flash-sale-section">
        <div className="container">
          <div className="flash-sale-banner">
            <div className="flash-sale-content">
              <div className="flash-badge">FLASH SALE</div>
              <h2>Limited Time Offers</h2>
              <p>Get up to 50% off on selected organic products - Today Only!</p>
              <Link to="/products?featured=true" className="flash-btn">Shop Now</Link>
            </div>
            <div className="flash-timer">
              <div className="timer-item">
                <span className="timer-value">12</span>
                <span className="timer-label">Hours</span>
              </div>
              <div className="timer-item">
                <span className="timer-value">45</span>
                <span className="timer-label">Minutes</span>
              </div>
              <div className="timer-item">
                <span className="timer-value">32</span>
                <span className="timer-label">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* First Order Discount Banner */}
      <section className="first-order-section">
        <div className="container">
          <div className="first-order-card">
            <div className="discount-badge">NEW CUSTOMER</div>
            <h2>Welcome to Ghorer Bazar!</h2>
            <p className="discount-text">Get <strong>25% OFF</strong> on your first order</p>
            <div className="promo-code">
              <span className="code-label">Use Code:</span>
              <span className="code-value">WELCOME25</span>
            </div>
            <Link to="/products" className="order-btn">Start Shopping</Link>
            <p className="terms">*Applicable on orders above 500 BDT</p>
          </div>
        </div>
      </section>

      {/* Features Section (Dark Green) */}
      <section className="features-section">
        <div className="container">
          <div className="features-content">
            <div className="features-grid">
              {features.map((f, i) => (
                <div key={i} className="feature-item">
                  <div className="feature-icon">{f.icon}</div>
                  <div><h4>{f.title}</h4><p>{f.desc}</p></div>
                </div>
              ))}
            </div>
            <div className="features-image">
              <img src="https://images.unsplash.com/photo-1585518419759-e00faac22fed?w=500&h=500&fit=crop" alt="Premium ghee and dairy products" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div><h2 className="section-title">Product Categories</h2><p className="section-subtitle">Find products that you need</p></div>
            <Link to="/products" className="view-all-link">View All →</Link>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat._id} to={`/products?category=${cat._id}`} className="category-card">
                <div className="category-icon">
                  {cat.image ? <img src={cat.image} alt={cat.name} /> : <span>○</span>}
                </div>
                <h4>{cat.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="section trending-section">
        <div className="container">
          <div className="section-header">
            <div><h2 className="section-title">জনপ্রিয় পণ্য</h2><p className="section-subtitle">সবাই এই সপ্তাহে যা কিনছে</p></div>
          </div>
          <div className="grid grid-4">
            {trendingProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <div className="promo-text">
              <h2>রাসায়নিক মুক্ত দেশি পণ্য</h2>
              <p>সরাসরি গ্রাম থেকে সংগৃহীত খাঁটি মধু, ঘি ও তেল পান আমাদের কাছে।</p>
              <Link to="/products" className="promo-btn">কেনাকাটা করুন</Link>
            </div>
            <div className="promo-visual"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;