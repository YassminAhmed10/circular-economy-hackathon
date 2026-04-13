import { useState, useMemo } from 'react';
import { Menu, X, LogOut, Settings, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminLayout({ children, user, onLogout, lang = 'ar', dark = false, currentPage = 'buying-orders' }) {
  const isAr = lang !== 'en';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const t = useMemo(() => ({
    adminPanel: isAr ? 'لوحة تحكم الإدارة' : 'Admin Dashboard',
    buyingOrders: isAr ? 'طلبات الشراء' : 'Buying Orders',
    verification: isAr ? 'التحقق من المصانع' : 'Verification',
    dashboard: isAr ? 'الرئيسية' : 'Dashboard',
    logout: isAr ? 'تسجيل الخروج' : 'Logout',
    settings: isAr ? 'الإعدادات' : 'Settings',
  }), [isAr]);

  const menuItems = [
    {
      id: 'buying-orders',
      label: t.buyingOrders,
      path: '/admin/buying-orders',
      icon: '📦'
    },
    {
      id: 'verification',
      label: t.verification,
      path: '/admin/verification',
      icon: '✓'
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div
      className="admin-layout"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: dark ? '#0f1a12' : '#f8fafc',
        color: dark ? '#e0e0e0' : '#1f2937',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '280px' : '60px',
          background: dark ? '#1a2e1f' : '#10b981',
          padding: '20px',
          transition: 'width 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {/* Sidebar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1
            style={{
              fontSize: sidebarOpen ? '1.25rem' : '0',
              fontWeight: 'bold',
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'font-size 0.3s',
            }}
          >
            ECOv
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                background: currentPage === item.id ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.95rem',
                fontWeight: currentPage === item.id ? '600' : '500',
                transition: 'all 0.2s',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.9rem',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}
          >
            <Home size={18} />
            {sidebarOpen && <span>{t.dashboard}</span>}
          </button>
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
            }}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>{t.logout}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Admin Header */}
        <header
          style={{
            background: dark ? '#1a2e1f' : '#fff',
            borderBottom: `1px solid ${dark ? '#2a3e2f' : '#e5e7eb'}`,
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            {t.adminPanel}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.9rem' }}>
              {user?.factoryName || user?.email}
            </span>
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
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
