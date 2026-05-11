import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiPercent, FiMenu, FiX, FiLogOut, FiHome, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { path: '/admin/pre-orders', label: 'Pre-Orders', icon: <FiTag /> },
    { path: '/admin/products', label: 'Products', icon: <FiPackage /> },
    { path: '/admin/categories', label: 'Categories', icon: <FiTag /> },
    { path: '/admin/users', label: 'Users', icon: <FiUsers /> },
    { path: '/admin/discounts', label: 'Discounts', icon: <FiPercent /> },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {/* MODERN HYBRID ADMIN NAVIGATION */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .gb-admin-container { 
          display: flex; 
          flex-direction: column;
          min-height: 100vh; 
          background-color: #f8f9fa; 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* TOP NAVBAR */
        .gb-top-navbar {
          background: linear-gradient(135deg, #013220 0%, #024a2f 100%);
          padding: 0 30px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(1, 50, 32, 0.15);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .gb-logo-section {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .gb-logo-badge {
          background: linear-gradient(135deg, #F58634, #ff6b4a);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 24px;
          box-shadow: 0 4px 15px rgba(245, 134, 52, 0.3);
          transition: transform 0.3s ease;
        }

        .gb-logo-badge:hover {
          transform: scale(1.05);
        }

        .gb-logo-text {
          color: white;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.5px;
        }

        .gb-logo-text span {
          color: #F58634;
        }

        /* HORIZONTAL NAV MENU */
        .gb-nav-menu {
          display: flex;
          gap: 5px;
          align-items: center;
          flex: 1;
          margin: 0 40px;
          overflow-x: auto;
          min-width: 0;
        }

        .gb-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          border: 2px solid transparent;
        }

        .gb-nav-link:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .gb-nav-link.active {
          background: #F58634;
          color: white;
          border: 2px solid #ff6b4a;
          box-shadow: 0 4px 15px rgba(245, 134, 52, 0.3);
        }

        .gb-nav-icon {
          font-size: 18px;
          display: flex;
        }

        /* ADMIN PROFILE SECTION */
        .gb-admin-section {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .gb-admin-info {
          text-align: right;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 2px;
          white-space: nowrap;
        }

        .gb-admin-name {
          display: inline;
          font-weight: 700;
          font-size: 14px;
        }

        .gb-admin-role {
          font-size: 11px;
          background: rgba(245, 134, 52, 0.2);
          color: #F58634;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
          display: inline-block;
          width: fit-content;
          margin-left: auto;
        }

        .gb-admin-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F58634, #ff6b4a);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(245, 134, 52, 0.25);
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .gb-admin-avatar:hover {
          transform: scale(1.08);
        }

        .gb-mobile-menu-btn {
          display: none;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .gb-mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* MAIN CONTENT */
        .gb-main-content {
          flex: 1;
          overflow-y: auto;
        }

        .gb-page-body {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 1024px) {
          .gb-top-navbar {
            padding: 0 15px;
            height: auto;
            flex-wrap: wrap;
          }

          .gb-nav-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #013220 0%, #024a2f 100%);
            flex-direction: column;
            gap: 0;
            padding: 15px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            width: 100%;
            margin: 0;
          }

          .gb-nav-menu.mobile-open {
            display: flex;
          }

          .gb-nav-link {
            width: 100%;
            padding: 15px 20px;
            border-radius: 0;
            justify-content: flex-start;
            border: none;
          }

          .gb-nav-link.active {
            border-left: 4px solid #F58634;
            padding-left: 16px;
          }

          .gb-mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            order: -1;
          }

          .gb-logo-text {
            font-size: 16px;
          }

          .gb-admin-section {
            gap: 10px;
          }

          .gb-admin-info {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .gb-admin-info {
            display: none;
          }

          .gb-logo-text {
            display: none;
          }

          .gb-page-body {
            padding: 20px;
          }
        }

        /* OUTLET WRAPPER */
        .gb-outlet-wrapper {
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* SCROLLBAR STYLING */
        .gb-main-content::-webkit-scrollbar {
          width: 8px;
        }

        .gb-main-content::-webkit-scrollbar-track {
          background: #f0f0f0;
        }

        .gb-main-content::-webkit-scrollbar-thumb {
          background: #013220;
          border-radius: 4px;
        }

        .gb-main-content::-webkit-scrollbar-thumb:hover {
          background: #024a2f;
        }
      `}</style>

      <div className="gb-admin-container">
        
        {/* TOP NAVBAR */}
        <header className="gb-top-navbar">
          <div className="gb-logo-section">
            <div className="gb-logo-badge">G</div>
          </div>

          <nav className={`gb-nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`gb-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="gb-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="gb-admin-section">
            <Link to="/" className="gb-nav-link" title="View Store" style={{marginRight: '10px'}}>
              <FiHome style={{fontSize: '18px'}} />
            </Link>
            
            <div className="gb-admin-info">
              <span className="gb-admin-name">{user?.name || 'Admin'}</span>
              <span className="gb-admin-role">Super Admin</span>
            </div>
            <div className="gb-admin-avatar" title="Admin Profile">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>

            <button className="gb-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div className="gb-main-content">
          <div className="gb-page-body gb-outlet-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;