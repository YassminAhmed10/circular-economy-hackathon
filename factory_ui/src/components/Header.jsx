// components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, MessageSquare, User, LogOut, Home, ShoppingCart, Factory, Info, Phone, BarChart, Package, Eye } from 'lucide-react';
import './Header.css';

function Header({ user, onNavigate }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // تحميل الإشعارات من localStorage عند فتح القائمة
  const loadNotifications = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('ecov_user') || '{}');
      const currentFactory = JSON.parse(localStorage.getItem('factory') || '{}');
      const allNotifications = JSON.parse(localStorage.getItem('ecov_notifications') || '[]');
      
      console.log('📢 Loading notifications...', {
        currentFactory: currentFactory.factoryName,
        totalNotifications: allNotifications.length,
        allNotifications
      });
      
      // فلتر الإشعارات الخاصة بالمستخدم الحالي
      const userNotifications = allNotifications.filter(notif => 
        notif.notifyTo?.includes(currentFactory.factoryName) || 
        notif.notifyTo?.includes('admin') ||
        notif.notifyTo?.includes(currentUser.email)
      );
      
      console.log('✅ Filtered notifications:', userNotifications);
      
      setNotifications(userNotifications.reverse());
      const unreadCount = userNotifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Load notifications on mount and every 15 seconds
  useEffect(() => {
    console.log('🔄 useEffect: Loading notifications...');
    loadNotifications();
    
    // إضافة notification تجريبي عند الفتح الأول لأغراض الاختبار
    const hasTestNotif = localStorage.getItem('test_notif_added');
    if (!hasTestNotif) {
      const testNotifications = [
        {
          id: Date.now(),
          type: 'status_updated',
          seller: 'El Nour',
          buyer: 'Nile Factory',
          orderId: '12345',
          message: 'تم تحديث حالة الطلب من قيد الانتظار إلى موافق عليه',
          timestamp: new Date().toISOString(),
          read: false,
          notifyTo: ['El Nour', 'Nile Factory', 'admin']
        }
      ];
      localStorage.setItem('ecov_notifications', JSON.stringify(testNotifications));
      localStorage.setItem('test_notif_added', 'true');
      console.log('✅ Test notification added to localStorage');
      
      // Wait and reload
      setTimeout(() => {
        loadNotifications();
      }, 100);
    }
    
    const interval = setInterval(() => {
      console.log('🔄 Refreshing notifications every 15s...');
      loadNotifications();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const markNotificationAsRead = (notificationId) => {
    try {
      const allNotifications = JSON.parse(localStorage.getItem('ecov_notifications') || '[]');
      const updated = allNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem('ecov_notifications', JSON.stringify(updated));
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const mainLinks = [
    { id: 'home', label: 'الرئيسية', path: '/', icon: <Home className="w-4 h-4" /> },
    { id: 'market', label: 'سوق النفايات', path: '/market', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'partners', label: 'الشركاء', path: '/partners', icon: <Factory className="w-4 h-4" /> },
    { id: 'about', label: 'عن المنصة', path: '/about', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: 'اتصل بنا', path: '/contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const dashboardLinks = [
    { id: 'dashboard', label: 'لوحة التحكم', path: '/dashboard', icon: <BarChart className="w-4 h-4" /> },
    { id: 'add-waste', label: 'إضافة نفايات', path: '/add-waste', icon: <Package className="w-4 h-4" /> },
    { id: 'my-ads', label: 'إعلاناتي', path: '/my-ads', icon: <Eye className="w-4 h-4" /> },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header-container" dir="rtl">
      {/* الشريط العلوي */}
      <div className="top-bar">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* الشعار */}
            <Link to="/" className="flex items-center gap-3 no-underline">
              <div className="logo-circle">
                <span className="logo-text">ECOV</span>
              </div>
              <div>
                <h1 className="logo-title">ECOV</h1>
                <p className="logo-subtitle">منصة الاقتصاد الدائري</p>
              </div>
            </Link>

            {/* روابط التنقل الرئيسية */}
            <nav className="main-nav">
              {mainLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  className="nav-link"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* البحث والإشعارات */}
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="ابحث في المنصة..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* NOTIFICATION BELL - SIMPLE & WORKING */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* Button */}
                <button 
                  type="button"
                  onClick={() => {
                    console.log('🔔🔔🔔 BELL BUTTON CLICKED! 🔔🔔🔔');
                    setShowNotifications(!showNotifications);
                  }}
                  style={{
                    padding: '8px 10px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  <Bell size={20} color="#059669" />
                  {notificationCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#ef4444',
                      color: '#fff',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* DROPDOWN - SHOW WHEN BUTTON IS CLICKED */}
                {showNotifications && (
                  <div style={{
                    position: 'fixed',
                    top: '70px',
                    right: '50px',
                    width: '400px',
                    maxHeight: '450px',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    zIndex: 99999,
                    overflowY: 'auto'
                  }}>
                    {/* HEADER */}
                    <div style={{
                      background: '#10b981',
                      color: '#fff',
                      padding: '15px',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      🔔 الإشعارات ({notificationCount})
                    </div>

                    {/* LIST */}
                    {notifications.length === 0 ? (
                      <div style={{
                        padding: '30px',
                        textAlign: 'center',
                        color: '#999'
                      }}>
                        لا توجد إشعارات
                      </div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div 
                          key={idx}
                          onClick={() => markNotificationAsRead(notif.id)}
                          style={{
                            padding: '12px 15px',
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer',
                            background: !notif.read ? '#f0fdf4' : '#fff',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                          onMouseLeave={(e) => e.currentTarget.style.background = !notif.read ? '#f0fdf4' : '#fff'}
                        >
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>
                              {notif.type === 'status_updated' && '📝'}
                              {notif.type === 'listing_sent' && '📤'}
                              {notif.type === 'approved' && '✅'}
                              {notif.type === 'rejected' && '❌'}
                              {notif.type === 'completed' && '🎉'}
                            </span>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '500' }}>
                                {notif.message}
                              </p>
                              <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>
                                من: <strong>{notif.seller || notif.buyer}</strong>
                              </p>
                              <p style={{ margin: 0, fontSize: '10px', color: '#999' }}>
                                {new Date(notif.timestamp).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* MESSAGE BUTTON */}
              <button className="icon-button">
                <MessageSquare className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  className="profile-button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="profile-avatar">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="profile-name">{user?.name || 'مصنع الأمل'}</span>
                </button>

                {showProfileMenu && (
                  <div className="profile-menu">
                    <Link to="/profile" className="profile-menu-item">
                      <User className="w-4 h-4" />
                      <span>الملف الشخصي</span>
                    </Link>
                    <Link to="/settings" className="profile-menu-item">
                      <span>⚙️</span>
                      <span>الإعدادات</span>
                    </Link>
                    <hr className="my-2" />
                    <button className="profile-menu-item text-red-600">
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الشريط السفلي (روابط لوحة التحكم) */}
      <div className="quick-links-bar">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              {dashboardLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  className="quick-link"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600">
              <Link to="/factory-registration" className="hover:text-emerald-600 transition-colors">
                تسجيل مصنع
              </Link>
              <span>|</span>
              <Link to="/waste-management" className="hover:text-emerald-600 transition-colors">
                إدارة النفايات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;