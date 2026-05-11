import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-section">
      <div className="container">
        <div className="hero-slider">
          <div className="hero-slide active">
        
            <div className="hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587049352847-81a56d773c1c?q=80&w=1000&auto=format&fit=crop)' }}></div>
            
            <div className="hero-content">
              <span className="hero-badge">100% Organic</span>
              <h1 className="hero-title">
                Premium Quality <br />
                <span style={{ color: '#2e7d32' }}>Deshi Gawa Ghee</span>
              </h1>
              <p className="hero-subtitle">
                Collected directly from the farmers of Rajshahi. Rich in taste and health benefits.
              </p>
              <div className="hero-actions">
                <Link to="/products?category=dairy" className="btn btn-primary btn-lg banner-btn">
                  SHOP NOW
                </Link>
                <div className="hero-price">
                  <span>Starting at</span>
                  <strong>BDT 850</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;