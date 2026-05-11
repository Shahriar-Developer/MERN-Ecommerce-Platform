import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import API from '../../utils/api';

const statusColors = { pending: 'warning', confirmed: 'info', processing: 'primary', shipped: 'info', delivered: 'success', cancelled: 'danger' };

interface DashboardStats {
  stats: { totalRevenue: number; totalOrders: number; totalProducts: number; totalUsers: number };
  recentOrders: any[];
  monthlyRevenue: any[];
  lowStockProducts: any[];
  topProducts: any[];
  ordersByStatus: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
  if (!stats) return <div className="alert alert-danger">Failed to load dashboard</div>;

  const { stats: s, recentOrders, monthlyRevenue, lowStockProducts, topProducts, ordersByStatus } = stats;

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const chartData = monthlyRevenue.map(m => ({
    month: monthNames[m._id.month - 1],
    revenue: m.revenue,
    orders: m.orders
  }));

  const COLORS = ['#667eea', '#43c6ac', '#ff6584', '#ffc107', '#00d4ff', '#9f7aea'];

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <button className="btn btn-primary-outline" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          Refresh
        </button>
      </div>

      {/* Industry Features - Organic Agro Specific */}
      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        {/* Category Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Product Category Distribution</h3>
            <span className="chart-period">All Categories</span>
          </div>
          {stats && (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Honey & Syrups', value: 12 },
                    { name: 'Dairy & Ghee', value: 18 },
                    { name: 'Oils & Extracts', value: 14 },
                    { name: 'Spices', value: 20 },
                    { name: 'Grains', value: 16 },
                    { name: 'Others', value: 20 }
                  ]}
                  cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80} fill="#8884d8" dataKey="value"
                >
                  {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Organic Certification Status */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Organic Certification Status</h3>
            <span className="chart-period">Quality Assurance</span>
          </div>
          <div className="organic-status-container" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
            <div className="status-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: '#f0f7f0', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}></span>
                <div>
                  <div style={{ fontWeight: 600, color: '#2d5a27' }}>100% Certified Organic</div>
                  <small style={{ color: '#666' }}>All products verified</small>
                </div>
              </div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#2d5a27' }}>{s.totalProducts}</span>
            </div>
            <div className="status-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: '#fff3cd', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#856404' }}>Pending Certification</div>
                  <small style={{ color: '#666' }}>Awaiting verification</small>
                </div>
              </div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#856404 ' }}>0</span>
            </div>
            <div className="status-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: '#f8d7da', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#721c24' }}>Non-Certified</div>
                  <small style={{ color: '#666' }}>Needs attention</small>
                </div>
              </div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#721c24' }}>0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal & Supplier Performance */}
      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        {/* Seasonal Products */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Seasonal & Fresh Products</h3>
            <span className="chart-period">Current Availability</span>
          </div>
          <div className="seasonal-container" style={{ marginTop: 20 }}>
            <div className="seasonal-item" style={{ padding: 12, marginBottom: 12, background: '#e8f5e9', borderLeft: '4px solid #4caf50', borderRadius: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>Fresh Vegetables</strong>
                <span style={{ background: '#4caf50', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>In Season</span>
              </div>
              <div style={{ fontSize: 13, color: '#555' }}>18 products | 245 units in stock</div>
            </div>
            <div className="seasonal-item" style={{ padding: 12, marginBottom: 12, background: '#fff3e0', borderLeft: '4px solid #ff9800', borderRadius: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>Seasonal Honey</strong>
                <span style={{ background: '#ff9800', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>Limited Supply</span>
              </div>
              <div style={{ fontSize: 13, color: '#555' }}>8 products | 156 units in stock</div>
            </div>
            <div className="seasonal-item" style={{ padding: 12, background: '#f3e5f5', borderLeft: '4px solid #9c27b0', borderRadius: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>Grains & Cereals</strong>
                <span style={{ background: '#9c27b0', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>Year-Round</span>
              </div>
              <div style={{ fontSize: 13, color: '#555' }}>16 products | 312 units in stock</div>
            </div>
          </div>
        </div>

        {/* Supplier & Origin Performance */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Suppliers & Origins</h3>
            <span className="chart-period">Performance Metrics</span>
          </div>
          <div className="suppliers-list" style={{ marginTop: 20 }}>
            <div className="supplier-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, marginBottom: 12, background: '#f5f5f5', borderRadius: 6 }}>
              <div>
                <div style={{ fontWeight: 600 }}>Sundarbans Region</div>
                <small style={{ color: '#666' }}>12 products | Rating: 4.9/5</small>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#2196f3', fontWeight: 600 }}>Top Performer</div>
              </div>
            </div>
            <div className="supplier-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, marginBottom: 12, background: '#f5f5f5', borderRadius: 6 }}>
              <div>
                <div style={{ fontWeight: 600 }}>Rajshahi District</div>
                <small style={{ color: '#666' }}>8 products | Rating: 4.7/5</small>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#ff9800', fontWeight: 600 }}>Trending</div>
              </div>
            </div>
            <div className="supplier-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
              <div>
                <div style={{ fontWeight: 600 }}>Northern Regions</div>
                <small style={{ color: '#666' }}>15 products | Rating: 4.6/5</small>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#4caf50', fontWeight: 600 }}>Reliable</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue Trend</h3>
            <span className="chart-period">Last 6 Months</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#999' }} />
                <YAxis tick={{ fontSize: 12, fill: '#999' }} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(v) => `BDT${v.toLocaleString()}`} 
                />
                <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={3} dot={{ fill: '#667eea', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="no-data-text">No data yet</p>}
        </div>

        {/* Orders Status Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Orders by Status</h3>
            <span className="chart-period">Distribution</span>
          </div>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ordersByStatus.map(o => ({ name: o._id, count: o.count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#999' }} />
                <YAxis tick={{ fontSize: 12, fill: '#999' }} />
                <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#43c6ac" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="no-data-text">No data yet</p>}
        </div>
      </div>

      {/* Recent Orders + Alerts + Top Products */}
      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        {/* Recent Orders */}
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.slice(0,8).map(o => (
                  <tr key={o._id}>
                    <td><Link to={`/admin/orders/${o._id}`} className="order-link">#{o.orderNumber}</Link></td>
                    <td className="customer-cell">{o.user?.name}</td>
                    <td className="amount-cell">BDT{o.totalPrice.toLocaleString()}</td>
                    <td><span className={`badge badge-${statusColors[o.orderStatus as keyof typeof statusColors]||'primary'}`} style={{ textTransform: 'capitalize' }}>{o.orderStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts + Top Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="alert-card">
              <div className="alert-header">
                Low Stock Alert
              </div>
              <div className="alert-items">
                {lowStockProducts.slice(0, 5).map(p => (
                  <div key={p._id} className="alert-item">
                    <span className="alert-product-name">{p.name}</span>
                    <span className={`badge badge-${p.stock === 0 ? 'danger' : 'warning'}`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Products */}
          {topProducts.length > 0 && (
            <div className="top-products-card">
              <div className="top-products-header">
                Top Selling Products
              </div>
              <div className="products-list">
                {topProducts.slice(0, 5).map((p, i) => (
                  <div key={p._id} className="product-item">
                    <div className="product-rank">#{i+1}</div>
                    <div className="product-info">
                      <div className="product-name">{p.name}</div>
                      <div className="product-sold">{p.totalSold} sold</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Industry KPIs */}
      <div className="performance-card">
        <h3 className="performance-title">Industry KPIs & Health Metrics</h3>
        <div className="performance-grid">
          <div className="performance-item">
            <span className="perf-label">Avg Product Shelf Life</span>
            <span className="perf-value">12.5 months</span>
            <span className="perf-change">Optimal</span>
          </div>
          <div className="performance-item">
            <span className="perf-label">Fresh Product Inventory</span>
            <span className="perf-value">68.4%</span>
            <span className="perf-change">Healthy</span>
          </div>
          <div className="performance-item">
            <span className="perf-label">Organic Supply Chain Efficiency</span>
            <span className="perf-value">94.2%</span>
            <span className="perf-change">Excellent</span>
          </div>
          <div className="performance-item">
            <span className="perf-label">Supplier Reliability Score</span>
            <span className="perf-value">4.7/5.0</span>
            <span className="perf-change">Trusted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
