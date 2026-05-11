import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiShare2, FiPackage, FiTruck, FiShield, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/product/ProductCard';
import { Product, Review } from '../../types';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const Stars: React.FC<{ rating: number; count: number }> = ({ rating, count }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? '#ffc107' : '#ddd', fontSize: 20 }}></span>)}
    <span style={{ color: 'var(--gray-500)', fontSize: 14 }}>({count} reviews)</span>
  </div>
);

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    API.get(`/products/${id}`)
      .then(async ({ data }) => {
        if (!data.product) {
          console.error('API response:', data);
          toast.error('Invalid product data received');
          return;
        }
        setProduct(data.product);
        setSelectedImage(0); setSelectedSize(''); setSelectedColor(''); setQuantity(1);
        const [rel, rev] = await Promise.allSettled([
          API.get(`/products/${data.product._id}/related`),
          API.get(`/reviews/product/${data.product._id}`),
        ]);
        if (rel.status === 'fulfilled') setRelated(rel.value.data.products);
        if (rev.status === 'fulfilled') setReviews(rev.value.data.reviews);
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to load product details';
        console.error('Product fetch error:', {
          status: error.response?.status,
          message: errorMsg,
          data: error.response?.data,
          url: `/products/${id}`
        });
        toast.error(errorMsg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const isOutOfStock = product.stock === 0;
  const sizes = [...new Set(product.variants?.map(v => v.size).filter((s): s is string => !!s))];
  const colors = [...new Set(product.variants?.map(v => v.color).filter((c): c is string => !!c))];

  const handleAddToCart = () => { addToCart({ ...product }, quantity, selectedSize, selectedColor); };
  const handleWishlist = async () => {
    try {
      const { data } = await API.put(`/wishlist/${product._id}`);
      toast.success(data.action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch { toast.error('Please login to use wishlist'); }
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link><FiChevronRight />
          <Link to="/products">Products</Link><FiChevronRight />
          {product.category && <><Link to={`/products?category=${product.category._id}`}>{product.category.name}</Link><FiChevronRight /></>}
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          <div className="product-images">
            <div className="main-image">
              <img src={product.images?.[selectedImage]?.url || 'https://placehold.co/500?text=No+Image'} alt={product.name} />
              {isOutOfStock && <div className="out-of-stock-overlay"><FiPackage /> Pre-Order Available</div>}
            </div>
            {product.images?.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((img, i) => (
                  <img key={i} src={img.url} alt="" className={selectedImage === i ? 'active' : ''} onClick={() => setSelectedImage(i)} />
                ))}
              </div>
            )}
          </div>

          <div className="product-detail-info">
            {product.brand && <span className="detail-brand">{product.brand}</span>}
            <h1 className="detail-title">{product.name}</h1>
            <Stars rating={product.ratings} count={product.numReviews} />

            <div className="detail-price-section">
              <span className="detail-price">BDT{displayPrice.toLocaleString()}</span>
              {product.discountPrice > 0 && <>
                <span className="detail-old-price">BDT{product.price.toLocaleString()}</span>
                <span className="detail-discount">-{product.discountPercent}% OFF</span>
              </>}
            </div>

            {product.shortDescription && <p className="detail-short-desc">{product.shortDescription}</p>}
            <div className="detail-stock">
              {isOutOfStock
                ? <span style={{ color: 'var(--warning)', fontWeight: 600 }}><FiPackage /> Pre-Order — Out of Stock</span>
                : <span style={{ color: 'var(--success)', fontWeight: 600 }}>In Stock ({product.stock} available)</span>}
            </div>

            {/* ─── PRE-ORDER INFORMATION ─── */}
            {product.isPreOrder && (
              <div style={{ background: 'linear-gradient(135deg,#fff3e0 0%,#ffe8b6 100%)', border: '2px solid #ff9800', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>📅</span>
                  <strong style={{ color: '#e65100', fontSize: 16 }}>This is a Pre-Order Item</strong>
                </div>
                <p style={{ marginBottom: 8, color: '#bf360c', fontSize: 13, fontWeight: 500 }}>⏳ High demand - Limited stock available</p>
                {product.preOrderNote && <p style={{ marginBottom: 8, color: '#333', fontSize: 13 }}>{product.preOrderNote}</p>}
                <p style={{ color: '#555', fontSize: 13 }}>✓ Order now and we'll notify you as soon as stock is available</p>
                <p style={{ color: '#555', fontSize: 13 }}>✓ Estimated delivery: Within 2-3 weeks of placing order</p>
              </div>
            )}

            {/* ─── GHORER BAZAR - ORGANIC/AGRO DETAILS ─── */}
            {(product.origin || product.isOrganicCertified || product.expiryDuration || product.healthBenefits?.length) && (
              <div className="organic-details" style={{ background: '#f0f7f0', border: '1px solid #d4edda', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>●</span>
                  <strong style={{ color: '#2D5A27' }}>Ghorer Bazar - Organic Details</strong>
                </div>
                
                {product.isOrganicCertified && (
                  <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, color: '#2D5A27', fontWeight: 600 }}>
                    <span style={{ fontSize: 16 }}> 100% Certified Organic</span>
                  </div>
                )}
                
                {product.origin && (
                  <p style={{ marginBottom: 10, fontSize: 14 }}>
                    <strong>Source:</strong> {product.origin}
                  </p>
                )}
                
                {product.expiryDuration && (
                  <p style={{ marginBottom: 10, fontSize: 14 }}>
                    <strong>📅 Shelf Life:</strong> {product.expiryDuration}
                  </p>
                )}
                
                {product.healthBenefits && product.healthBenefits.length > 0 && (
                  <div>
                    <strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Health Benefits:</strong>
                    <ul style={{ marginLeft: 20, fontSize: 13, color: '#2D5A27' }}>
                      {product.healthBenefits.map((benefit, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {sizes.length > 0 && (
              <div className="detail-variant">
                <label>Size:</label>
                <div className="variant-options">
                  {sizes.map(s => <button key={s} className={`variant-btn${selectedSize === s ? ' selected' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>)}
                </div>
              </div>
            )}
            {colors.length > 0 && (
              <div className="detail-variant">
                <label>Color:</label>
                <div className="variant-options">
                  {colors.map(c => <button key={c} className={`variant-btn${selectedColor === c ? ' selected' : ''}`} onClick={() => setSelectedColor(c)}>{c}</button>)}
                </div>
              </div>
            )}

            <div className="detail-qty">
              <label>Quantity:</label>
              <div className="qty-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            <div className="detail-actions">
              <button className={`btn btn-lg${isOutOfStock ? ' btn-outline' : ' btn-primary'}`} style={{ flex: 1 }} onClick={handleAddToCart}>
                {isOutOfStock ? <><FiPackage /> Pre-Order</> : <><FiShoppingCart /> Add to Cart</>}
              </button>
              <button className="btn btn-outline btn-lg" onClick={handleWishlist}><FiHeart /></button>
              <button className="btn btn-outline btn-lg" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}><FiShare2 /></button>
            </div>

            <div className="detail-features">
              <div className="detail-feature"><FiTruck /> <span>Free delivery on orders over BDT 1000</span></div>
              <div className="detail-feature"><FiShield /> <span>7-day easy returns</span></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-nav">
            {(['description', 'reviews'] as const).map(tab => (
              <button key={tab} className={`tab-btn${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'description' ? 'Description' : `Reviews (${reviews.length})`}
              </button>
            ))}
          </div>
          <div className="tab-content card card-body">
            {activeTab === 'description' && (
              <div className="product-description">
                <p>{product.description}</p>
                {product.tags?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <strong>Tags: </strong>
                    {product.tags.map(t => <span key={t} className="badge badge-primary" style={{ marginRight: 6 }}>{t}</span>)}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                {reviews.length === 0 ? <p style={{ color: 'var(--gray-500)' }}>No reviews yet.</p> : reviews.map(r => (
                  <div key={r._id} className="review-item-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <div className="avatar" style={{ width: 36, height: 36, background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{r.user?.name?.charAt(0)}</div>
                      <div>
                        <strong>{r.user?.name}</strong>
                        {r.isVerifiedPurchase && <span className="badge badge-success" style={{ marginLeft: 8, fontSize: 11 }}>Verified</span>}
                        <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= r.rating ? '#ffc107' : '#ddd' }}></span>)}</div>
                    </div>
                    <p style={{ color: 'var(--gray-700)' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="section">
            <h2 className="section-title">Related Products</h2>
            <div className="grid grid-4">{related.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
