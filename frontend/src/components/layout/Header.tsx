import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiSettings, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Category, Product } from '../../types';
import API from '../../utils/api';
import './Header.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Real-time search
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await API.get(`/products?keyword=${encodeURIComponent(search)}&limit=8`);
        setSearchResults(data.products);
        setShowSearchResults(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300); 

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { 
    setUserMenuOpen(false); 
    setMenuOpen(false); 
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
    
      <div className="header-main">
        <div className="container">
         
          <Link to="/" className="logo">
            <span className="logo-text">GHORER <span>BAZAR</span></span>
          </Link>
          
       
          <form className="search-bar" onSubmit={handleSearch} ref={searchRef}>
            <input 
              type="text" 
              placeholder="পণ্য খুঁজুন (মধু, ঘি, তেল...)" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
            <button type="submit"><FiSearch /></button>
            
            {/* Real-time Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map(product => (
                  <Link 
                    key={product._id} 
                    to={`/products/${product.slug || product._id}`}
                    className="search-result-item"
                    onClick={() => {
                      setSearch('');
                      setShowSearchResults(false);
                    }}
                  >
                    <img src={product.images?.[0]?.url || 'https://placehold.co/40x40'} alt={product.name} />
                    <div className="result-content">
                      <div className="result-name">{product.name}</div>
                      <div className="result-price">BDT {product.price.toLocaleString()}</div>
                    </div>
                  </Link>
                ))}
                <Link 
                  to={`/products?keyword=${encodeURIComponent(search)}`}
                  className="search-view-all"
                  onClick={() => {
                    setSearch('');
                    setShowSearchResults(false);
                  }}
                >
                  View all results →
                </Link>
              </div>
            )}
          </form>

          {/* Action Icons */}
          <div className="header-actions">
            <Link to="/orders" className="action-btn track-order">
              <div className="action-icon-wrap"><FiMapPin /></div>
              <span className="action-label">Track Order</span>
            </Link>
            
            {isAuthenticated ? (
              <div className="user-menu" ref={userMenuRef}>
                <button className="action-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <div className="action-icon-wrap"><FiUser /></div>
                  <span className="action-label">{user?.name?.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <Link to="/profile"><FiUser /> Profile</Link>
                    <Link to="/orders"><FiPackage /> Orders</Link>
                    {isAdmin && <Link to="/admin"><FiSettings /> Admin Panel</Link>}
                    <hr />
                    <button onClick={handleLogout}><FiLogOut /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="action-btn">
                <div className="action-icon-wrap"><FiUser /></div>
                <span className="action-label">Sign In</span>
              </Link>
            )}

            <Link to="/cart" className="action-btn cart-btn">
              <div className="action-icon-wrap">
                <FiShoppingCart />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span className="action-label">Cart</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

     
      <nav className={`header-nav${menuOpen ? ' open' : ''}`}>
        <div className="container">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">All Products</Link>
          
          
          {categories.slice(0, 8).map(cat => (
            <Link 
              key={cat._id} 
              to={`/products?category=${cat._id}`} 
              className="nav-link"
            >
              {cat.name}
            </Link>
          ))}
          
          <Link to="/products?featured=true" className="nav-link organic-tag">Organic Certified</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;