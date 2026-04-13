import { useState, useMemo } from 'react';
import { Menu, X, LogOut, Home, BarChart3, Shield, Sun, Moon, Globe, Bell, User, Package, Truck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminVerification from './AdminVerification';
import AdminBuyingOrders from './AdminBuyingOrders';
import AdminListingRequests from './AdminListingRequests';
import AdminDirectOrders from './AdminDirectOrders';
import AdminWelcome from './AdminWelcome';
import DashboardHome from './DashboardHome';
import ecoLogo from '../assets/ecovnew.png';

function AdminDashboard({ user, onLogout, lang = 'ar', setLang, dark = false, setDark }) {
  const isAr = lang !== 'en';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current page from URL path and query params
  let currentPage = 'dashboard'; // default to dashboard
  const searchParams = new URLSearchParams(location.search);
  const viewParam = searchParams.get('view');

  if (location.pathname.includes('listing-requests')) {
    currentPage = 'listing-requests';
  } else if (location.pathname.includes('direct-orders')) {
    currentPage = 'direct-orders';
  } else if (location.pathname.includes('verification')) {
    currentPage = 'verification';
  } else if (location.pathname.includes('buying-orders')) {
    currentPage = viewParam === 'orders' ? 'buying-orders' : 'dashboard';
  }

  const t = useMemo(() => ({
    adminPanel: isAr ? 'لوحة تحكم الإدارة' : 'Admin Dashboard',
    dashboard: isAr ? 'لوحة التحكم' : 'Dashboard',
    buyingOrders: isAr ? 'طلبات الشراء' : 'Buying Orders',
    verification: isAr ? 'التحقق من المصانع' : 'Verification',
    listingRequests: isAr ? 'طلبات الإعلانات' : 'Listing Requests',
    directOrders: isAr ? 'طلبات الاستخدام المباشر' : 'Direct Usage Orders',
    dashboardNav: isAr ? 'الرئيسية' : 'Home',
    logout: isAr ? 'تسجيل الخروج' : 'Logout',
    settings: isAr ? 'الإعدادات' : 'Settings',
    language: isAr ? 'اللغة' : 'Language',
    theme: isAr ? 'المظهر' : 'Theme',
  }), [isAr]);

  const menuItems = [
    {
      id: 'dashboard',
      label: t.dashboard,
      path: '/admin/buying-orders',
      icon: Home,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'buying-orders',
      label: t.buyingOrders,
      path: '/admin/buying-orders?view=orders',
      icon: BarChart3,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'listing-requests',
      label: t.listingRequests,
      path: '/admin/listing-requests',
      icon: Package,
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'direct-orders',
      label: t.directOrders,
      path: '/admin/direct-orders',
      icon: Truck,
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'verification',
      label: t.verification,
      path: '/admin/verification',
      icon: Shield,
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div
      className="admin-dashboard"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: dark ? '#0a0f0b' : '#f0f7f4',
        color: dark ? '#e0e0e0' : '#1f2937',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ──────────────────────────── SIDEBAR ──────────────────────────────── */}
      <aside
        style={{
          width: sidebarOpen ? '280px' : '80px',
          background: dark 
            ? 'linear-gradient(135deg, #1a2e1f 0%, #0f1a12 100%)' 
            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: dark 
            ? '2px 0 15px rgba(0,0,0,0.3)' 
            : '2px 0 15px rgba(16, 185, 129, 0.2)',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Sidebar Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: 'rgba(255,255,255,0.1) 1px solid'
        }}>
          {sidebarOpen && (
            <div style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: '1px',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
              ECOv
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)',
              marginStart: sidebarOpen ? 'auto' : '0',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, marginBottom: '16px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  marginBottom: '12px',
                  background: currentPage === item.id 
                    ? 'rgba(255,255,255,0.3)' 
                    : 'rgba(255,255,255,0.08)',
                  border: currentPage === item.id ? '1.5px solid rgba(255,255,255,0.3)' : 'none',
                  color: '#fff',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  fontSize: '0.95rem',
                  fontWeight: currentPage === item.id ? '600' : '500',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <Icon size={20} style={{ minWidth: '20px' }} />
                {sidebarOpen && (
                  <>
                    <span>{item.label}</span>
                    {currentPage === item.id && (
                      <div style={{
                        marginStart: 'auto',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#fff',
                      }} />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
          {/* Logout Only */}
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: 'none',
              color: '#ff6b6b',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.9rem',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>{t.logout}</span>}
          </button>
        </div>
      </aside>

      {/* ──────────────────────────── MAIN CONTENT ──────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <header
          style={{
            background: dark 
              ? 'linear-gradient(135deg, #1a2e1f 0%, #2d3d33 100%)' 
              : 'linear-gradient(135deg, #fff 0%, #f0fdf4 100%)',
            borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)'}`,
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: dark 
              ? '0 4px 12px rgba(0,0,0,0.3)' 
              : '0 4px 12px rgba(16, 185, 129, 0.12)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {ecoLogo && (
              <img 
                src={ecoLogo} 
                alt="ECOv Logo" 
                style={{
                  height: '70px',
                  width: 'auto',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            )}
            <div>
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 'bold', 
                margin: 0,
                color: dark ? '#e0fff0' : '#059669',
                letterSpacing: '0.5px',
              }}>
                {t.adminPanel}
              </h2>
              <p style={{
                fontSize: '0.9rem',
                margin: '6px 0 0 0',
                color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(16, 185, 129, 0.6)',
              }}>
                {isAr ? 'نظام إدارة متطور' : 'Advanced Management System'}
              </p>
            </div>
          </div>

          {/* Right Section - Notifications, Theme, User */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
          }}>
            {/* Notifications */}
            <button
              style={{
                position: 'relative',
                background: dark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(16, 185, 129, 0.1)',
                border: 'none',
                color: dark ? '#e0e0e0' : '#059669',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = dark
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = dark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(16, 185, 129, 0.1)';
              }}
            >
              <Bell size={20} />
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                }}
              >
                3
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(!dark)}
              style={{
                background: dark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(16, 185, 129, 0.1)',
                border: 'none',
                color: dark ? '#fbbf24' : '#f59e0b',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = dark
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(16, 185, 129, 0.2)';
                e.target.style.transform = 'rotate(20deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = dark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(16, 185, 129, 0.1)';
                e.target.style.transform = 'rotate(0)';
              }}
              title={dark ? 'Light Mode' : 'Dark Mode'}
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              style={{
                background: dark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(16, 185, 129, 0.1)',
                border: 'none',
                color: dark ? '#e0e0e0' : '#059669',
                padding: '10px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = dark
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = dark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(16, 185, 129, 0.1)';
              }}
            >
              <Globe size={18} />
              <span>{isAr ? 'EN' : 'AR'}</span>
            </button>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '30px',
              background: dark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(16, 185, 129, 0.2)',
            }} />

            {/* User Info */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
            }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: dark
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                }}
              >
                {(user?.factoryName || 'A')[0].toUpperCase()}
              </div>
              <div style={{ textAlign: isAr ? 'right' : 'left', display: { xs: 'none', sm: 'block' } }}>
                <p style={{
                  margin: '0 0 2px 0',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: dark ? '#e0e0e0' : '#1f2937',
                }}>
                  {user?.factoryName || 'مسؤول'}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(31, 41, 55, 0.6)',
                }}>
                  {isAr ? 'مسؤول النظام' : 'System Admin'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
          }}
        >
          {currentPage === 'dashboard' && (
            <DashboardHome user={user} lang={lang} dark={dark} />
          )}
          {currentPage === 'buying-orders' && (
            <AdminBuyingOrders user={user} lang={lang} dark={dark} />
          )}
          {currentPage === 'listing-requests' && (
            <AdminListingRequests user={user} lang={lang} dark={dark} />
          )}
          {currentPage === 'direct-orders' && (
            <AdminDirectOrders user={user} lang={lang} dark={dark} />
          )}
          {currentPage === 'verification' && (
            <AdminVerification user={user} lang={lang} dark={dark} />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
