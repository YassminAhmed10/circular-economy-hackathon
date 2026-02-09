import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './HomeNavbar.css';
import logoImage from '../assets/logooo1ecov.png'; // استيراد صورة اللوجو

function HomeNavbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // هذا الـ Navbar للصفحة الرئيسية فقط لغير المسجلين
  return (
    <>
      <header className="home-navbar-simple" dir="rtl">
        <div className="home-navbar-container">
          <div className="home-navbar-content">
            {/* الشعار - صورة اللوجو فقط */}
            <Link to="/" className="home-navbar-logo">
              <img 
                src={logoImage} 
                alt="ECOv Logo" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x40/059669/FFFFFF?text=ECOV';
                }}
              />
            </Link>

            {/* قائمة الجوال */}
            <button 
              className="home-navbar-mobile-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* الأزرار */}
            <div className="home-navbar-actions">
              <button 
                onClick={() => navigate('/login')}
                className="home-navbar-btn home-navbar-btn-secondary"
              >
                تسجيل الدخول
              </button>
              <button 
                onClick={() => navigate('/registration')}
                className="home-navbar-btn home-navbar-btn-primary"
              >
                سجل مصنعك الآن
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* قائمة الجوال */}
      {showMobileMenu && (
        <div className="home-mobile-menu-overlay">
          <div className="home-mobile-menu">
            <div className="home-mobile-auth-links">
              <button onClick={() => { navigate('/login'); setShowMobileMenu(false); }} className="home-navbar-btn home-navbar-btn-secondary">
                تسجيل الدخول
              </button>
              <button onClick={() => { navigate('/registration'); setShowMobileMenu(false); }} className="home-navbar-btn home-navbar-btn-primary">
                سجل مصنعك الآن
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="home-navbar-spacer"></div>
    </>
  );
}

export default HomeNavbar;