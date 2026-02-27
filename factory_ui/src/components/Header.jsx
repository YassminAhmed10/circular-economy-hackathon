// components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, MessageSquare, User, LogOut, Home, ShoppingCart, Factory, Info, Phone, BarChart, Package, Eye } from 'lucide-react';
import './Header.css';

function Header({ user, onNavigate }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

              <button className="icon-button relative">
                <Bell className="w-5 h-5" />
                <span className="notification-badge">3</span>
              </button>

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