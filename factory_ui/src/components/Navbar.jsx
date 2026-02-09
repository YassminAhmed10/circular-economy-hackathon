import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, MessageSquare, User, LogOut, Home, ShoppingCart, Factory, BarChart3, Package, Eye, TrendingUp, Menu, X, Settings, ChevronDown, Plus } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const mainLinks = [
    { id: 'home', label: 'الرئيسية', path: '/', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'لوحة التحكم', path: '/dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'marketplace', label: 'سوق النفايات', path: '/marketplace', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'partners', label: 'الشركاء', path: '/partners', icon: <Factory className="w-4 h-4" /> },
    { id: 'analytics', label: 'التحليل', path: '/analytics', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const userLinks = [
    { id: 'my-listings', label: 'إعلاناتي', path: '/my-listings', icon: <Eye className="w-4 h-4" /> },
    { id: 'list-waste', label: 'إضافة نفايات', path: '/list-waste', icon: <Package className="w-4 h-4" /> },
    { id: 'profile', label: 'الملف الشخصي', path: '/profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'الإعدادات', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="navbar-container" dir="rtl">
        {/* الشريط العلوي */}
        <div className="navbar-top-bar">
          <div className="navbar-container-inner">
            <div className="navbar-content">
              {/* الشعار */}
              <Link to="/" className="navbar-logo">
                <div className="logo-circle">
                  <span className="logo-text">ECOV</span>
                </div>
                <div>
                  <h1 className="logo-title">ECOv</h1>
                  <p className="logo-subtitle">منصة الاقتصاد الدائري</p>
                </div>
              </Link>

              {/* قائمة الهاتف المحمول */}
              <button 
                className="navbar-mobile-toggle"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* البحث والإشعارات */}
              <div className="navbar-actions">
                <form onSubmit={handleSearch} className="navbar-search">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="ابحث في المنصة..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <button className="navbar-action-button relative">
                  <Bell className="w-5 h-5" />
                  <span className="notification-badge">3</span>
                </button>

                <Link to="/messages" className="navbar-action-button">
                  <MessageSquare className="w-5 h-5" />
                </Link>

                <div className="relative">
                  <button
                    className="navbar-profile-button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <div className="profile-avatar">
                      {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <div className="profile-info">
                      <span className="profile-name">
                        {user?.name || 'مصنع الأمل'}
                      </span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="profile-dropdown">
                      <div className="profile-header">
                        <p className="profile-display-name">{user?.name || 'مصنع الأمل'}</p>
                        <p className="profile-email">{user?.email || 'factory@email.com'}</p>
                      </div>
                      {userLinks.map((link) => (
                        <Link
                          key={link.id}
                          to={link.path}
                          className="dropdown-item"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          {link.icon}
                          <span>{link.label}</span>
                        </Link>
                      ))}
                      <hr />
                      <button 
                        className="dropdown-item text-red-600"
                        onClick={() => {
                          onLogout();
                          setShowProfileMenu(false);
                        }}
                      >
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

        {/* الشريط السفلي */}
        <div className="navbar-bottom-bar">
          <div className="navbar-container-inner">
            <div className="navbar-bottom-content">
              {/* الروابط الرئيسية */}
              <nav className="navbar-main-links">
                {mainLinks.map((link) => (
                  <Link
                    key={link.id}
                    to={link.path}
                    className={`navbar-link ${isActive(link.path) ? 'navbar-link-active' : ''}`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>

              {/* روابط المستخدم السريعة */}
              <div className="navbar-quick-links">
                {user ? (
                  <div className="flex gap-4">
                    <Link 
                      to="/list-waste" 
                      className="btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة نفايات
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Link to="/login" className="btn-secondary">
                      تسجيل الدخول
                    </Link>
                    <Link to="/registration" className="btn-primary">
                      تسجيل مصنع
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* قائمة الهاتف المحمول */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            {/* بحث للجوال */}
            <form onSubmit={handleSearch} className="mobile-search">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="ابحث في المنصة..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* الروابط الرئيسية */}
            <div className="mobile-links">
              {mainLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`mobile-link ${isActive(link.path) ? 'mobile-link-active' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="mobile-link-content">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* روابط المستخدم */}
            {user && (
              <>
                <hr />
                <div className="mobile-user-links">
                  <div className="mobile-user-info">
                    <p className="user-name">{user?.name || 'مصنع الأمل'}</p>
                    <p className="user-email">{user?.email || 'factory@email.com'}</p>
                  </div>
                  {userLinks.map((link) => (
                    <Link
                      key={link.id}
                      to={link.path}
                      className="mobile-link"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <div className="mobile-link-content">
                        {link.icon}
                        <span>{link.label}</span>
                      </div>
                    </Link>
                  ))}
                  <button 
                    className="mobile-logout"
                    onClick={() => {
                      onLogout();
                      setShowMobileMenu(false);
                    }}
                  >
                    <div className="mobile-link-content">
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* روابط إضافية للمستخدمين غير المسجلين */}
            {!user && (
              <>
                <hr />
                <div className="mobile-auth-links">
                  <Link to="/login" className="btn-secondary" onClick={() => setShowMobileMenu(false)}>
                    تسجيل الدخول
                  </Link>
                  <Link to="/registration" className="btn-primary" onClick={() => setShowMobileMenu(false)}>
                    تسجيل مصنع
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* المساحة الفارغة للـ Navbar الثابت */}
      <div className="navbar-spacer"></div>
    </>
  );
}

export default Navbar;