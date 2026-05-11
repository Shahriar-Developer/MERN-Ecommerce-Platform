import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch } from 'react-icons/fi';
import ProductCard from '../../components/product/ProductCard';
import { Product, Category, ProductFilters } from '../../types';
import API from '../../utils/api';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: '', maxPrice: '',
    sort: searchParams.get('sort') || 'newest',
    page: 1,
    featured: searchParams.get('featured') || '',
    trending: searchParams.get('trending') || '',
    isPreOrder: searchParams.get('isPreOrder') || '',
    // ─── GHORER BAZAR CUSTOM FILTERS ───
    origin: '',
    isOrganicCertified: '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
      params.set('limit', '12');
      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
    API.get('/products/brands').then(({ data }) => setBrands(data.brands)).catch(() => {});
  }, []);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      keyword: searchParams.get('keyword') || '',
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      sort: searchParams.get('sort') || 'newest',
      featured: searchParams.get('featured') || '',
      trending: searchParams.get('trending') || '',
      isPreOrder: searchParams.get('isPreOrder') || '',
      page: 1,
    }));
  }, [searchParams]);

  const updateFilter = (key: keyof ProductFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => setFilters({ keyword: '', category: '', brand: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1, featured: '', trending: '', isPreOrder: '', origin: '', isOrganicCertified: '' });

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <div>
            <h1 className="page-title">{filters.keyword ? `Search: "${filters.keyword}"` : 'All Products'}</h1>
            <p className="text-muted">{total} products found</p>
          </div>
          <button className="filter-toggle-btn" onClick={() => setFilterOpen(!filterOpen)}>
            <FiFilter /> More Filters
          </button>
        </div>

        {/* PRE-ORDER TABS */}
        <div style={{display:'flex',gap:12,marginBottom:24,borderBottom:'2px solid var(--gray-100)',paddingBottom:12}}>
          <button 
            onClick={() => updateFilter('isPreOrder', '')}
            style={{padding:'8px 16px',borderBottom:!filters.isPreOrder?'3px solid var(--primary)':'none',background:'transparent',border:'none',cursor:'pointer',fontWeight:!filters.isPreOrder?'700':'500',color:!filters.isPreOrder?'var(--primary)':'var(--gray-600)',fontSize:14,transition:'all 0.3s'}}
          >
            All Products
          </button>
          <button 
            onClick={() => updateFilter('isPreOrder', 'true')}
            style={{padding:'8px 16px',borderBottom:filters.isPreOrder==='true'?'3px solid var(--primary)':'none',background:'transparent',border:'none',cursor:'pointer',fontWeight:filters.isPreOrder==='true'?'700':'500',color:filters.isPreOrder==='true'?'var(--primary)':'var(--gray-600)',fontSize:14,transition:'all 0.3s'}}
          >
            📅 Pre-Orders
          </button>
        </div>

        {/* Top Horizontal Filter Bar */}
        <div className="filters-top-bar">
          <div className="filters-row">
            {/* Categories */}
            <div className="filter-group">
              <div className="filter-label">Category</div>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${!filters.category ? 'active' : ''}`}
                  onClick={() => updateFilter('category', '')}
                >
                  All
                </button>
                {categories.slice(0, 5).map(cat => (
                  <button
                    key={cat._id}
                    className={`filter-btn ${filters.category === cat._id ? 'active' : ''}`}
                    onClick={() => updateFilter('category', cat._id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <div className="filter-label">Price</div>
              <div className="filter-price-inline">
                <input 
                  className="price-input-inline" 
                  type="number" 
                  placeholder="Min" 
                  value={filters.minPrice} 
                  onChange={e => updateFilter('minPrice', e.target.value)} 
                />
                <span>—</span>
                <input 
                  className="price-input-inline" 
                  type="number" 
                  placeholder="Max" 
                  value={filters.maxPrice} 
                  onChange={e => updateFilter('maxPrice', e.target.value)} 
                />
              </div>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <select className="sort-select-top" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.isOrganicCertified || filters.isPreOrder) && (
              <button className="clear-filters-inline" onClick={clearFilters}>✕ Clear</button>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {filterOpen && (
          <div className="filter-drawer-overlay" onClick={() => setFilterOpen(false)}>
            <div className="filter-drawer" onClick={e => e.stopPropagation()}>
              <div className="drawer-header">
                <h3>Filters</h3>
                <button onClick={() => setFilterOpen(false)}>✕</button>
              </div>

              <div className="filter-section">
                <h4>Search</h4>
                <input 
                  className="form-control" 
                  placeholder="Search..." 
                  value={filters.keyword} 
                  onChange={e => updateFilter('keyword', e.target.value)} 
                  style={{ padding: '8px 12px', fontSize: 14 }}
                />
              </div>

              {brands.length > 0 && (
                <div className="filter-section">
                  <h4>Brand</h4>
                  <div className="filter-options">
                    <label className={`filter-option${!filters.brand ? ' active' : ''}`}>
                      <input type="radio" checked={!filters.brand} onChange={() => updateFilter('brand', '')} /> All Brands
                    </label>
                    {brands.map(b => (
                      <label key={b} className={`filter-option${filters.brand === b ? ' active' : ''}`}>
                        <input type="radio" checked={filters.brand === b} onChange={() => updateFilter('brand', b)} /> {b}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="filter-section">
                <h4>Organic & Natural</h4>
                <div className="filter-options">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={filters.isOrganicCertified === 'true'} 
                      onChange={e => updateFilter('isOrganicCertified', e.target.checked ? 'true' : '')}
                      style={{ width: 18, height: 18, accentColor: '#2D5A27' }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Certified Organic Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="products-layout-new">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 64 }}></div>
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
              <button className="btn btn-primary mt-2" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  <button disabled={filters.page! <= 1} onClick={() => updateFilter('page', filters.page! - 1)}>‹</button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={filters.page === p ? 'active' : ''} onClick={() => updateFilter('page', p)}>{p}</button>
                  ))}
                  <button disabled={filters.page! >= pages} onClick={() => updateFilter('page', filters.page! + 1)}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
