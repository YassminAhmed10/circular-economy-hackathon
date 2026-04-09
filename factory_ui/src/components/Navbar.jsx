import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Search,
    Bell,
    MessageSquare,
    User,
    LogOut,
    Home,
    ShoppingCart,
    Factory,
    BarChart3,
    Package,
    Eye,
    TrendingUp,
    Menu,
    X,
    Settings,
    ChevronDown,
    Plus,
    Globe,
    Sun,
    Moon,
    CheckCircle,
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import './Navbar.css';

function Navbar({
    user,
    onLogout,
    lang,
    onLanguageToggle,
    darkMode,
    onDarkModeToggle,
    notifications,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const isVerified = user?.status === 'Active';

    const getLogoUrl = (logoPath) => {
        if (!logoPath || logoPath.trim() === '') return null;
        if (logoPath.startsWith('data:')) return logoPath;
        if (logoPath.startsWith('/')) return `http://localhost:54465${logoPath}`;
        if (logoPath.startsWith('http')) return logoPath;
        if (logoPath.length > 100 && /^[A-Za-z0-9+/=]+$/.test(logoPath)) return `data:image/png;base64,${logoPath}`;
        if (logoPath && !logoPath.startsWith('http')) return `http://localhost:54465/${logoPath}`;
        return logoPath;
    };

    const mainLinks = [
        { id: 'home', label: 'الرئيسية', path: '/', icon: <Home className="w-4 h-4" /> },
        {
            id: 'dashboard',
            label: 'لوحة التحكم',
            path: '/dashboard',
            icon: <BarChart3 className="w-4 h-4" />,
        },
        {
            id: 'marketplace',
            label: 'سوق النفايات',
            path: '/marketplace',
            icon: <ShoppingCart className="w-4 h-4" />,
        },
        { id: 'partners', label: 'الشركاء', path: '/partners', icon: <Factory className="w-4 h-4" /> },
        {
            id: 'analytics',
            label: 'التحليل',
            path: '/analytics',
            icon: <TrendingUp className="w-4 h-4" />,
        },
    ];

    const userLinks = [
        { id: 'my-listings', label: 'إعلاناتي', path: '/my-listings', icon: <Eye className="w-4 h-4" /> },
        { id: 'list-waste', label: 'إضافة نفايات عامة', path: '/list-waste', icon: <Package className="w-4 h-4" /> },
        { id: 'add-packaging', label: 'إضافة تغليف مستدام', path: '/packaging-waste', icon: <Package className="w-4 h-4" /> },
        { id: 'profile', label: 'الملف الشخصي', path: '/profile', icon: <User className="w-4 h-4" /> },
        { id: 'settings', label: 'الإعدادات', path: '/settings', icon: <Settings className="w-4 h-4" /> },
    ];

    const categoryLinks = [
        { id: 'all-waste', label: 'جميع المخلفات', path: '/marketplace?category=all' },
        { id: 'plastic', label: 'بلاستيك', path: '/marketplace?category=plastic' },
        { id: 'metal', label: 'معادن', path: '/marketplace?category=metal' },
        { id: 'paper', label: 'ورق', path: '/marketplace?category=paper' },
        { id: 'glass', label: 'زجاج', path: '/marketplace?category=glass' },
        { id: 'wood', label: 'خشب', path: '/marketplace?category=wood' },
        { id: 'textile', label: 'نسيج', path: '/marketplace?category=textile' },
        { id: 'chemicals', label: 'كيماويات', path: '/marketplace?category=chemicals' },
        { id: 'electronics', label: 'إلكترونيات', path: '/marketplace?category=electronics' },
        { id: 'packaging', label: 'تغليف مستدام', path: '/marketplace?category=packaging' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <header className="navbar-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div className="navbar-top-bar">
                    <div className="navbar-container-inner">
                        <div className="navbar-content">
                            <Link to="/" className="navbar-logo">
                                <div className="logo-circle">
                                    <span className="logo-text">ECOV</span>
                                </div>
                                <div>
                                    <h1 className="logo-title">ECOv</h1>
                                    <p className="logo-subtitle">منصة الاقتصاد الدائري</p>
                                </div>
                            </Link>

                            <button
                                className="navbar-mobile-toggle"
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                            >
                                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>

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

                                <button className="navbar-action-button" onClick={onLanguageToggle}>
                                    <Globe className="w-5 h-5" />
                                    <span className="lang-label">{lang === 'ar' ? 'EN' : 'AR'}</span>
                                </button>

                                <button className="navbar-action-button" onClick={onDarkModeToggle}>
                                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                <div className="notification-wrapper">
                                    <button
                                        className="navbar-action-button relative"
                                        onClick={() => setShowNotifications(!showNotifications)}
                                    >
                                        <Bell className="w-5 h-5" />
                                        {notifications?.filter((n) => !n.read).length > 0 && (
                                            <span className="notification-badge">
                                                {notifications.filter((n) => !n.read).length}
                                            </span>
                                        )}
                                    </button>
                                    {showNotifications && (
                                        <NotificationPanel
                                            notifications={notifications}
                                            lang={lang}
                                            onClose={() => setShowNotifications(false)}
                                        />
                                    )}
                                </div>

                                <Link to="/messages" className="navbar-action-button">
                                    <MessageSquare className="w-5 h-5" />
                                </Link>

                                <div className="relative">
                                    <button
                                        className="navbar-profile-button"
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    >
                                        <div className="profile-avatar">
                                            {user?.logoPreview ? (
                                                <img
                                                    src={getLogoUrl(user.logoPreview)}
                                                    alt={user?.factoryName || 'User'}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <span className="text-white font-bold text-sm">
                                                    {user?.factoryName?.charAt(0) || <User className="w-4 h-4" />}
                                                </span>
                                            )}
                                        </div>
                                        <div className="profile-info">
                                            <span className="profile-name">{user?.factoryName || 'مصنع الأمل'}</span>
                                            {isVerified && <CheckCircle size={14} color="#10b981" fill="#10b981" />}
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </button>

                                    {showProfileMenu && (
                                        <div className="profile-dropdown">
                                            <div className="profile-header">
                                                <p className="profile-display-name">{user?.factoryName || 'مصنع الأمل'}</p>
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

                <div className="navbar-bottom-bar">
                    <div className="navbar-container-inner">
                        <div className="navbar-bottom-content">
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

                            <div className="navbar-quick-links">
                                {user ? (
                                    <div className="flex gap-4">
                                        <Link to="/list-waste" className="btn-secondary">
                                            <Plus className="w-4 h-4" />
                                            إضافة نفايات
                                        </Link>
                                        <Link to="/packaging-waste" className="btn-primary">
                                            <Package className="w-4 h-4" />
                                            تغليف مستدام
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

                        {location.pathname.includes('/marketplace') && (
                            <div className="navbar-categories" dir="rtl" style={{borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginTop: '8px'}}>
                                <nav style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                                    {categoryLinks.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to={cat.path}
                                            className={`category-link ${location.search.includes(cat.id) ? 'category-link-active' : ''}`}
                                            style={{
                                                fontSize: '13px',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                backgroundColor: location.search.includes(cat.id) ? '#059669' : '#f5f5f5',
                                                color: location.search.includes(cat.id) ? '#fff' : '#374151',
                                                textDecoration: 'none',
                                                transition: 'all .2s'
                                            }}
                                        >
                                            {cat.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {showMobileMenu && (
                <div className="mobile-menu-overlay">
                    <div className="mobile-menu">
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

                        {user && (
                            <>
                                <hr />
                                <div className="mobile-user-links">
                                    <div className="mobile-user-info">
                                        <p className="user-name">
                                            {user?.factoryName || 'مصنع الأمل'}
                                            {isVerified && <CheckCircle size={14} color="#10b981" fill="#10b981" style={{ marginLeft: '6px' }} />}
                                        </p>
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

            <div className="navbar-spacer"></div>
        </>
    );
}

export default Navbar;