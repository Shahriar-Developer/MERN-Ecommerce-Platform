import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  const InstagramIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 15.892c-1.265 1.265-2.873 1.964-4.617 1.964-3.597 0-6.558-2.961-6.558-6.558 0-1.744.699-3.352 1.964-4.617m5.604-5.604c1.265 1.265 1.964 2.873 1.964 4.617 0 3.597-2.961 6.558-6.558 6.558-1.744 0-3.352-.699-4.617-1.964"/>
    </svg>
  );
  const TwitterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 002.856-10.01 10 10 0 01-2.856 2.856c-1.668-.992-3.37-1.502-5.102-1.502-3.814 0-6.914 3.1-6.914 6.914 0 .553.055 1.1.16 1.632-5.738-.323-10.8-3.04-14.202-7.203-.6 1.032-.937 2.234-.937 3.516 0 2.4 1.223 4.527 3.085 5.774-1.138-.036-2.21-.335-3.14-.885v.08c0 3.353 2.388 6.147 5.55 6.784-.58.157-1.193.244-1.822.244-.445 0-.88-.043-1.3-.128.88 2.74 3.413 4.733 6.41 4.793-2.37 1.86-5.35 2.973-8.59 2.973-.56 0-1.11-.033-1.65-.099 3.088 1.98 6.76 3.135 10.7 3.135 12.84 0 19.85-10.64 19.85-19.85 0-.302-.006-.603-.018-.9 1.362-.985 2.545-2.214 3.476-3.636z"/>
    </svg>
  );
  const YoutubeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
  const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );
  const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );
  const MapPinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">Ghorer Bazar</Link>
              <p>Your ultimate online shopping destination for organic products. Quality, freshness, and sustainability in every purchase.</p>
              <div className="social-links">
                <a href="#!" aria-label="Facebook" title="Facebook"><FacebookIcon /></a>
                <a href="#!" aria-label="Instagram" title="Instagram"><InstagramIcon /></a>
                <a href="#!" aria-label="Twitter" title="Twitter"><TwitterIcon /></a>
                <a href="#!" aria-label="YouTube" title="YouTube"><YoutubeIcon /></a>
              </div>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/products?sort=newest">New Arrivals</Link></li>
                <li><Link to="/products?featured=true">Featured Items</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Customer Service</h4>
              <ul>
                <li><Link to="/profile">My Account</Link></li>
                <li><Link to="/orders">Track Order</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><a href="#!">Return Policy</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <div className="contact-item"><MapPinIcon /> Mirsarai, Chattogram, Bangladesh</div>
              <div className="contact-item"><PhoneIcon /> 01690005685</div>
              <div className="contact-item"><MailIcon /> support@ghorerbazar.com.bd</div>
              <div className="payment-methods">
                <h5>Payment Methods</h5>
                <div className="payment-icons">
                  {['COD', 'bKash', 'Nagad', 'Bank'].map(m => <span key={m} className="payment-badge">{m}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Ghorer Bazar. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#!">Privacy Policy</a>
            <a href="#!">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
