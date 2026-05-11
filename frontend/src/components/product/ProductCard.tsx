import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import './ProductCard.css';

interface StarProps { rating: number; }
const Stars: React.FC<StarProps> = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? '#ffc107' : '#ddd', fontSize: 14 }}>★</span>)}
    <span className="rating-text">({rating?.toFixed(1) ?? '0.0'})</span>
  </div>
);

interface ProductCardProps { product: Product; }

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => { e.preventDefault(); addToCart(product, 1); };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/wishlist/${product._id}`);
      toast.success(data.action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch { toast.error('Please login to use wishlist'); }
  };

  const isOnSale = product.discountPrice > 0;
  const displayPrice = isOnSale ? product.discountPrice : product.price;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <Link to={`/products/${product.slug || product._id}`}>
          <img src={product.images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'} alt={product.name} className="product-img" loading="lazy" />
        </Link>
        <div className="product-badges">
          {/* Ghorer Bazar Organic Badge */}
          {product.isOrganicCertified && (
            <span className="badge-organic">100% Organic</span>
          )}
          {isOnSale && <span className="badge-sale">-{product.discountPercent}%</span>}
          {product.isTrending && <span className="badge-trending">Trending</span>}
          {product.isPreOrder && <span className="badge-preorder" style={{background:'linear-gradient(135deg,#ff9800,#ffc107)',color:'white'}}>📅 Pre-Order</span>}
          {isOutOfStock && !product.isPreOrder && <span className="badge-preorder" style={{background:'#999'}}>Out of Stock</span>}
          {product.offerLabel && <span className="badge-offer">{product.offerLabel}</span>}
        </div>
        <div className="product-actions">
          <button className="action-icon wishlist-icon" onClick={handleWishlist} title="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <Link to={`/products/${product.slug || product._id}`} className="action-icon view-icon" title="Quick View">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </Link>
          <button className="action-icon cart-icon" onClick={handleAddToCart} title="Add to Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="product-info">
        {product.brand && <span className="product-brand">{product.brand}</span>}
        
        <Link to={`/products/${product.slug || product._id}`} className="product-name">{product.name}</Link>
        
       
        {product.origin && (
          <div className="product-origin">
            Source: {product.origin}
          </div>
        )}

     
        {product.healthBenefits && product.healthBenefits.length > 0 && (
          <div className="health-benefits-preview" title={product.healthBenefits.join(', ')}>
            <small>{product.healthBenefits.length} health benefit{product.healthBenefits.length > 1 ? 's' : ''}</small>
          </div>
        )}

        <Stars rating={product.ratings} />
        <div className="product-price-row">
          <span className="product-price">BDT {displayPrice.toLocaleString()}</span>
          {isOnSale && <span className="product-old-price">BDT {product.price.toLocaleString()}</span>}
        </div>
        <button className={`btn-add-cart${isOutOfStock ? ' preorder' : ''}`} onClick={handleAddToCart}>
          {isOutOfStock ? <>Pre-Order</> : <>Add to Cart</>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;