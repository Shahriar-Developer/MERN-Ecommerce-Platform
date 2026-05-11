import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import HeroBanner from '../../components/HeroBanner'; 
import { Product } from '../../types';
import API from '../../utils/api';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, f, n] = await Promise.all([
          API.get('/products/trending'),
          API.get('/products?featured=true&limit=8'),
          API.get('/products?sort=newest&limit=8'),
        ]);
        setTrendingProducts(t.data.products);
        setFeaturedProducts(f.data.products);
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
          <div className="flash-sale-wrapper">
            <div className="flash-sale-spotlight">
              <div className="flash-spotlight-badge">⚡ FLASH SALE</div>
              <h1 className="flash-spotlight-title">Mega Organic Sale</h1>
              <p className="flash-spotlight-subtitle">Exclusive deals on premium organic products</p>
              
              <div className="flash-stats">
                <div className="flash-stat">
                  <div className="stat-icon-box">📦</div>
                  <div>
                    <div className="stat-label">Products on Sale</div>
                    <div className="stat-value">250+</div>
                  </div>
                </div>
                <div className="flash-stat">
                  <div className="stat-icon-box">💰</div>
                  <div>
                    <div className="stat-label">Maximum Discount</div>
                    <div className="stat-value">Up to 50%</div>
                  </div>
                </div>
                <div className="flash-stat">
                  <div className="stat-icon-box">⏳</div>
                  <div>
                    <div className="stat-label">Offer Ends in</div>
                    <div className="stat-value">Today Only</div>
                  </div>
                </div>
              </div>

              <Link to="/products?featured=true" className="flash-spotlight-btn">View All Offers</Link>
            </div>

            <div className="flash-countdown">
              <div className="countdown-label">Time Remaining</div>
              <div className="countdown-display">
                <div className="countdown-item">
                  <span className="countdown-number">12</span>
                  <span className="countdown-period">Hours</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <span className="countdown-number">45</span>
                  <span className="countdown-period">Minutes</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <span className="countdown-number">32</span>
                  <span className="countdown-period">Seconds</span>
                </div>
              </div>
              <p className="countdown-note">Hurry! Limited stock available</p>
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

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div><h2 className="section-title">Featured Products</h2><p className="section-subtitle">Premium selections from our store</p></div>
            <Link to="/products?featured=true" className="view-all-link">View All →</Link>
          </div>
          <div className="grid grid-4">
            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="section trending-section">
        <div className="container">
          <div className="section-header">
            <div><h2 className="section-title">Popular Products</h2><p className="section-subtitle">What everyone is buying this week</p></div>
          </div>
          <div className="grid grid-4">
            {trendingProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <div><h2 className="section-title">New Arrivals</h2><p className="section-subtitle">Fresh products added to our collection</p></div>
            <Link to="/products?sort=newest" className="view-all-link">View All →</Link>
          </div>
          <div className="grid grid-4">
            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;
