// components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, MessageSquare, User, LogOut, Home, ShoppingCart, Factory, Info, Phone, BarChart, Package, Eye, TrendingUp, Menu, X } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const mainLinks = [
    { id: 'home', label: 'الرئيسية', path: '/', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'لوحة التحكم', path: '/dashboard', icon: <BarChart className="w-4 h-4" /> },
    { id: 'marketplace', label: 'سوق النفايات', path: '/marketplace', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'partners', label: 'الشركاء', path: '/partners', icon: <Factory className="w-4 h-4" /> },
    { id: 'analytics', label: 'التحليل', path: '/analytics', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const userLinks = [
    { id: 'my-listings', label: 'إعلاناتي', path: '/my-listings', icon: <Eye className="w-4 h-4" /> },
    { id: 'list-waste', label: 'إضافة نفايات', path: '/list-waste', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'الطلبات', path: '/orders' },
    { id: 'messages', label: 'الرسائل', path: '/messages' },
    { id: 'profile', label: 'الملف الشخصي', path: '/profile', icon: <User className="w-4 h-4" /> },
  ];

  const footerLinks = [
    { id: 'about', label: 'عن المنصة', path: '/about' },
    { id: 'contact', label: 'اتصل بنا', path: '/contact' },
    { id: 'factory-registration', label: 'تسجيل مصنع', path: '/registration' },
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

              {/* قائمة الهاتف المحمول */}
              <button 
                className="md:hidden icon-button"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* البحث والإشعارات */}
              <div className="hidden md:flex items-center gap-4">
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

                <button className="icon-button relative">
                  <Bell className="w-5 h-5" />
                  <span className="notification-badge">3</span>
                </button>

                <Link to="/messages" className="icon-button">
                  <MessageSquare className="w-5 h-5" />
                </Link>

                <div className="relative">
                  <button
                    className="profile-button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <div className="profile-avatar">
                      {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <span className="profile-name hidden md:inline">
                      {user?.name || 'مصنع الأمل'}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div className="profile-menu">
                      <div className="px-4 py-2 border-b border-slate-200">
                        <p className="font-medium text-slate-900">{user?.name || 'مصنع الأمل'}</p>
                        <p className="text-sm text-slate-600">{user?.email || 'factory@email.com'}</p>
                      </div>
                      {userLinks.map((link) => (
                        <Link
                          key={link.id}
                          to={link.path}
                          className="profile-menu-item"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          {link.icon}
                          <span>{link.label}</span>
                        </Link>
                      ))}
                      <hr className="my-2" />
                      <button 
                        className="profile-menu-item text-red-600"
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
        <div className="quick-links-bar">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              {/* الروابط الرئيسية */}
              <nav className="hidden md:flex gap-6">
                {mainLinks.map((link) => (
                  <Link
                    key={link.id}
                    to={link.path}
                    className={`quick-link ${isActive(link.path) ? 'quick-link-active' : ''}`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>

              {/* روابط المستخدم السريعة */}
              <div className="flex items-center gap-4 text-sm text-slate-600">
                {user ? (
                  <div className="flex gap-4">
                    <Link 
                      to="/list-waste" 
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all text-sm"
                    >
                      + إضافة نفايات
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Link to="/login" className="hover:text-emerald-600 transition-colors">
                      تسجيل الدخول
                    </Link>
                    <span>|</span>
                    <Link to="/registration" className="hover:text-emerald-600 transition-colors">
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
        <div className="md:hidden fixed inset-0 z-50 bg-white mt-32">
          <div className="p-4 space-y-4">
            {/* بحث للجوال */}
            <form onSubmit={handleSearch} className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="ابحث في المنصة..."
                className="search-input w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* الروابط الرئيسية */}
            <div className="space-y-2">
              {mainLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg ${isActive(link.path) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* روابط المستخدم */}
            {user && (
              <>
                <hr className="my-4" />
                <div className="space-y-2">
                  <div className="px-4 py-2">
                    <p className="font-medium text-slate-900">{user?.name || 'مصنع الأمل'}</p>
                    <p className="text-sm text-slate-600">{user?.email || 'factory@email.com'}</p>
                  </div>
                  {userLinks.map((link) => (
                    <Link
                      key={link.id}
                      to={link.path}
                      className="block px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <div className="flex items-center gap-3">
                        {link.icon || <span>•</span>}
                        <span>{link.label}</span>
                      </div>
                    </Link>
                  ))}
                  <button 
                    className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                    onClick={() => {
                      onLogout();
                      setShowMobileMenu(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* روابط التذييل */}
            <hr className="my-4" />
            <div className="space-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  className="block px-4 py-2 text-slate-600 hover:text-emerald-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* المساحة الفارغة للـ Navbar الثابت */}
      <div className="navbar-spacer"></div>
    </>
  );
}

export default Navbar;