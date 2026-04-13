import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, ChevronDown, MapPin, Bell, MessageSquare,
  User, LogOut, Settings, BarChart2, Package, Eye,
  Menu, X, Plus, Globe, Moon, Sun,
  ShoppingBag, Users, TrendingUp, List, FileText,
  CreditCard, MapPin as WasteIcon, Clipboard, CheckCircle, Gift, XCircle
} from 'lucide-react';
import logoImage from '../assets/ecovnew.png';
import { adminVerificationAPI } from '../services/api';

export default function HomeNavbar({ user, onLogout, lang, setLang, dark, setDark }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [query, setQuery]             = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showMobile, setShowMobile]   = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [listingsCount, setListingsCount] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const navRef = useRef(null);
  const ar = lang === 'ar';
  const D  = dark;

  // روابط الصفحات (تُعرض فقط إذا كان المستخدم مسجلاً)
  const NAV_LINKS = user ? [
    { ar: 'لوحة التحكم',   en: 'Dashboard',   path: '/dashboard',   Icon: BarChart2   },
    { ar: 'السوق',         en: 'Market',      path: '/market',      Icon: ShoppingBag },
    { ar: 'إعلاناتي',      en: 'My Listings', path: '/my-listings', Icon: List        },
    { ar: 'الطلبات',       en: 'Orders',      path: '/orders',      Icon: Package     },
    { ar: 'المبيعات',      en: 'Sales',       path: '/sales',       Icon: TrendingUp  },
    { ar: 'الرسائل',       en: 'Messages',    path: '/messages',    Icon: MessageSquare },
    { ar: 'الشركاء',       en: 'Partners',    path: '/partners',    Icon: Users       },
  ] : [];

  useEffect(() => {
    const h = e => { if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // إغلاق الإشعارات عند النقر خارجها
  useEffect(() => {
    const h = e => { if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setShowNotifications(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Fetch marketplace listings count
  useEffect(() => {
    const fetchListingsCount = async () => {
      try {
        const response = await fetch('https://localhost:54464/api/marketplace/waste-listings');
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          
          // Handle the API response structure
          let count = 0;
          if (data.success && data.data && Array.isArray(data.data)) {
            count = data.data.length;
          } else if (Array.isArray(data)) {
            count = data.length;
          } else if (data.data && Array.isArray(data.data)) {
            count = data.data.length;
          }
          
          setListingsCount(count);
          console.log('Listings count:', count);
        }
      } catch (error) {
        console.log('Error fetching listings count:', error);
        // Fallback to 59 based on our seed data
        setListingsCount(59);
      }
    };
    
    fetchListingsCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchListingsCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // جلب الإشعارات (Admin-only endpoint). Non-admin users use sample notifications.
  useEffect(() => {
    if (!user) return;

    const loadSampleNotifications = () => {
      setNotifications([
        {
          id: 1,
          type: 'order_received',
          title: ar ? 'طلب شراء جديد' : 'New Purchase Order',
          message: ar ? 'المصنع الأزهر طلب شراء البلاستيك المعاد تدويره' : 'Al-Azhar Factory ordered recycled plastic',
          time: ar ? 'قبل 5 دقائق' : '5 minutes ago',
          read: false
        },
        {
          id: 2,
          type: 'admin_notification',
          title: ar ? 'إرسال ملخص الطلب' : 'Order Summary Sent',
          message: ar ? 'تم إرسال ملخص الطلب #12345 للإدارة' : 'Order summary #12345 sent to admin',
          time: ar ? 'قبل 15 دقيقة' : '15 minutes ago',
          read: false
        },
        {
          id: 3,
          type: 'payment_completed',
          title: ar ? 'تم الدفع' : 'Payment Completed',
          message: ar ? 'تم استقبال دفعة 500 ريال للطلب #12345' : 'Received 500 SAR payment for order #12345',
          time: ar ? 'قبل 30 دقيقة' : '30 minutes ago',
          read: true
        },
        {
          id: 4,
          type: 'order_confirmed',
          title: ar ? 'تأكيد الطلب' : 'Order Confirmed',
          message: ar ? 'تم تأكيد الطلب #12344 من مصنع النيل' : 'Order #12344 confirmed from Al-Nile Factory',
          time: ar ? 'قبل ساعة' : '1 hour ago',
          read: true
        },
        {
          id: 5,
          type: 'order_rejected',
          title: ar ? 'رفض الطلب' : 'Order Rejected',
          message: ar ? 'تم رفض طلبك لعدم توفر المنتج' : 'Your order was rejected - product unavailable',
          time: ar ? 'قبل ساعتين' : '2 hours ago',
          read: true
        }
      ]);
    };

    const fetchNotifications = async () => {
      try {
        const role = (user?.role || '').toLowerCase();
        if (role === 'admin') {
          const response = await adminVerificationAPI.getNotifications();
          const payload = response?.data ?? response;
          if (payload?.success && Array.isArray(payload.data)) {
            setNotifications(payload.data);
            return;
          }
        }

        // Non-admin or fallback
        loadSampleNotifications();
      } catch (error) {
        loadSampleNotifications();
      }
    };

    fetchNotifications();
    return () => {};
  }, [user, ar]);

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) navigate(`/market?search=${encodeURIComponent(query)}`);
  };

  const getNotificationIcon = (type) => {
    const iconProps = { size: 16, style: { minWidth: '20px' } };
    switch(type) {
      case 'order_received': return <Package {...iconProps} color="#059669" />;
      case 'admin_notification': return <Clipboard {...iconProps} color="#3b82f6" />;
      case 'payment_completed': return <CheckCircle {...iconProps} color="#10b981" />;
      case 'order_confirmed': return <Gift {...iconProps} color="#f59e0b" />;
      case 'order_rejected': return <XCircle {...iconProps} color="#ef4444" />;
      default: return <Package {...iconProps} />;
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const bg     = D ? '#0f1a12' : '#ffffff';
  const bgNav  = D ? '#111d14' : '#ffffff';
  const border = D ? '#1e3320' : '#e5e7eb';
  const txtMain= D ? '#f0fdf4' : '#111827';
  const txtMu  = D ? '#6ee7b7' : '#6b7280';
  const bgHov  = D ? 'rgba(5,150,105,.12)' : '#f0fdf4';
  const badgeBg= D ? '#0f1a12' : '#ffffff';

  // دالة للحصول على عنوان URL كامل للصورة - يدعم جميع الصيغ
  const getLogoUrl = (logoPath) => {
    if (!logoPath || logoPath.trim() === '') return null;
    if (logoPath.startsWith('data:')) return logoPath;
    if (logoPath.startsWith('/')) return `http://localhost:54465${logoPath}`;
    if (logoPath.startsWith('http')) return logoPath;
    if (logoPath.length > 100 && /^[A-Za-z0-9+/=]+$/.test(logoPath)) return `data:image/png;base64,${logoPath}`;
    if (logoPath && !logoPath.startsWith('http')) return `http://localhost:54465/${logoPath}`;
    return logoPath;
  };

  // دالة للحصول على الحرف الأول من اسم المستخدم (أو استخدام اللوجو)
  const getUserAvatar = () => {
    if (user?.logoPreview) {
      return <img src={getLogoUrl(user.logoPreview)} alt={user.factoryName} className="hn-av-img" />;
    }
    return <div className="hn-av">{(user?.factoryName || user?.name || 'م').charAt(0)}</div>;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
        
        @keyframes slideDown {
          from { opacity: 0 !important; transform: translateY(-20px) !important; }
          to { opacity: 1 !important; transform: translateY(0) !important; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3) !important; }
          50% { box-shadow: 0 12px 40px rgba(16, 185, 129, 0.5) !important; }
        }

        @keyframes bounceDown {
          0%, 100% { transform: translateY(0) !important; }
          50% { transform: translateY(6px) !important; }
        }

        .hn-arrow-down {
          position: relative !important;
          color: #059669 !important;
          animation: none !important;
          transition: all 0.3s ease-in-out !important;
          transform: scale(1.1) rotate(0deg) !important;
          opacity: 1 !important;
          cursor: pointer !important;
          padding: 6px !important;
          border-radius: 6px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-right: 8px !important;
        }

        .hn-arrow-down:hover {
          background: rgba(5, 150, 105, 0.08) !important;
          transform: scale(1.2) !important;
        }

        .hn-navbar.show-expanded .hn-arrow-down {
          transform: scale(1.1) rotate(180deg) !important;
        }

        /* Icons row when navbar is closed */
        .hn-navbar-icons {
          display: none !important;
        }
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4) !important; }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0) !important; }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0) !important; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) !important; }
          50% { transform: translateY(-8px) !important; }
        }
        
        .hn * { box-sizing:border-box; font-family:'Cairo',system-ui,sans-serif; }

        .hn-top { 
          background: #ffffff !important;
          border-bottom: 2px solid rgba(16, 185, 129, 0.15) !important; 
          transition:background .3s,border-color .3s; 
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
          position:sticky; 
          top:0; 
          z-index:300;
          backdrop-filter: blur(10px) !important;
          animation: slideDown 0.4s ease-out !important;
        }
        .hn-row { max-width:1440px; margin:0 auto; padding:0 32px; height:72px; display:flex; align-items:center; gap:18px; justify-content:space-between; }

        /* LOGO */
        .hn-logo { display:flex; align-items:center; text-decoration:none; flex-shrink:0; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
        .hn-logo:hover { opacity:.85; transform: scale(1.15) translateY(-4px) !important; }
        .hn-logo img { 
          height: 56px !important; 
          width: auto !important;
          object-fit: contain; 
          display: block;
          transition: all 0.4s ease !important;
        }
        .hn-logo:hover img { 
          box-shadow: none !important;
          animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) !important;
        }

        /* ACTIONS (على اليسار في RTL) */
        .hn-acts { display:flex; align-items:center; gap:6px; flex-shrink:0; }

        .hn-icon-btn { 
          padding: 0.75rem 0.85rem !important; 
          border:none !important;
          background: transparent !important;
          cursor:pointer; 
          border-radius:12px !important; 
          color: #6b7280 !important; 
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          position:relative;
        }
        .hn-icon-btn:hover { 
          background: #f0fdf4 !important;
          color: #059669 !important;
          transform: translateY(-3px) scale(1.08) !important;
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.15) !important;
        }
        
        .hn-ctrl { 
          display:flex; 
          align-items:center; 
          gap:5px; 
          padding: 0.75rem 1rem !important;
          border: none !important;
          border-radius: 12px !important;
          background: transparent !important;
          font-size:13px; 
          font-weight:600; 
          color: #374151 !important;
          cursor:pointer; 
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          white-space:nowrap; 
          height:40px;
        }
        .hn-ctrl:hover { 
          color: #059669 !important;
          background: #f0fdf4 !important;
          transform: translateY(-3px) scale(1.08) !important;
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.15) !important;
        }
        .hn-divider { width:1px; height:28px; background: transparent !important; margin:0 3px; flex-shrink:0; }
        
        .hn-login { 
          padding: 0.75rem 1.5rem !important;
          border: none !important;
          background: transparent !important;
          font-size:14px; 
          font-weight:700; 
          color: #059669 !important;
          cursor:pointer; 
          border-radius: 12px !important;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          height:40px; 
          display:flex; 
          align-items:center;
        }
        .hn-login:hover { 
          color: #047857 !important;
          background: #f0fdf4 !important;
          transform: translateY(-4px) scale(1.05) !important;
          box-shadow: 0 8px 24px rgba(5, 150, 105, 0.25) !important;
        }
        
        .hn-register { 
          display:flex; 
          align-items:center; 
          gap:7px; 
          padding: 0.8rem 1.8rem !important;
          background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
          color: #fff !important;
          border:none; 
          border-radius: 12px !important;
          font-size:14px; 
          font-weight:700; 
          cursor:pointer; 
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          white-space:nowrap; 
          height:40px; 
          box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4) !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .hn-register:hover { 
          background: linear-gradient(135deg, #047857 0%, #065f46 100%) !important;
          transform: translateY(-4px) scale(1.05) !important;
          box-shadow: 0 12px 32px rgba(5, 150, 105, 0.6) !important;
        }
        .hn-badge { position:absolute; top:1px; right:1px; width:17px; height:17px; background:#ef4444; color:#fff; border-radius:50%; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center; border:2px solid ${badgeBg}; }

        /* ADD LISTING BTN */
        .hn-add-btn { 
          display:flex; 
          align-items:center; 
          gap:6px; 
          padding: 0.75rem 1.8rem !important;
          background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
          color: #fff !important;
          border:none; 
          border-radius: 12px !important;
          font-size:13px; 
          font-weight:700; 
          cursor:pointer; 
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          white-space:nowrap; 
          height:40px; 
          box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3) !important;
          font-family:'Cairo',sans-serif;
          position: relative !important;
          overflow: hidden !important;
        }
        .hn-add-btn:hover { 
          transform: translateY(-4px) scale(1.05) !important;
          box-shadow: 0 12px 32px rgba(5, 150, 105, 0.5) !important;
          background: linear-gradient(135deg, #047857 0%, #065f46 100%) !important;
        }

        /* PROFILE */
        .hn-pwrap { position:relative; }
        .hn-pbtn { 
          display:flex; 
          align-items:center; 
          gap:8px; 
          padding: 0.65rem 1rem !important;
          border: none !important;
          border-radius: 12px !important;
          background: transparent !important;
          cursor:pointer; 
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          height:40px;
        }
        .hn-pbtn:hover { 
          background: #f0fdf4 !important;
          transform: translateY(-3px) !important;
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.15) !important;
        }
        
        .hn-av { 
          width:44px; 
          height:44px; 
          border-radius:50%; 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          display:flex; 
          align-items:center; 
          justify-content:center; 
          color:#fff; 
          flex-shrink:0; 
          font-size:14px; 
          font-weight:800;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
          animation: float 3s ease-in-out infinite !important;
        }
        
        .hn-av-img { 
          width:34px; 
          height:34px; 
          border-radius:50%; 
          object-fit:contain; 
          border: 2px solid #059669 !important;
          animation: float 3s ease-in-out infinite !important;
        }
        
        .hn-pbtn:hover .hn-av {
          transform: scale(1.12) !important;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4) !important;
        }
        
        .hn-pbtn:hover .hn-av-img {
          transform: scale(1.12) !important;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4) !important;
        }
        .hn-uname { 
          font-size:13px; 
          font-weight:600; 
          color: #111827 !important;
          max-width:88px; 
          overflow:hidden; 
          text-overflow:ellipsis; 
          white-space:nowrap; 
        }
        .hn-dd { position:absolute; top:calc(100% + 8px); left:0; background:${bg}; border:1px solid ${border}; border-radius:12px; box-shadow:0 12px 32px rgba(0,0,0,.15); min-width:200px; padding:6px; z-index:400; animation:ddIn .15s ease; }
        @keyframes ddIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:none} }
        .hn-ddi { display:flex; align-items:center; gap:9px; padding:10px 13px; border-radius:9px; color:${txtMain}; font-size:13px; font-weight:500; text-decoration:none; cursor:pointer; background:none; border:none; width:100%; text-align:right; transition:background .12s; font-family:'Cairo',sans-serif; }
        .hn-ddi:hover { background:${bgHov}; color:#059669; }
        .hn-ddi.red:hover { background:#fef2f2; color:#dc2626; }
        .hn-sep { border:none; border-top:1px solid ${border}; margin:4px 0; }

        /* NAV BAR — شريط الصفحات (يظهر فقط عند وجود user) */
        .hn-navbar { 
          background: #ffffff !important;
          border-bottom: 1px solid #e5e7eb !important;
          transition: all 0.3s ease-in-out !important; 
          overflow: visible !important;
          min-height: 48px !important;
          display: flex !important;
          align-items: center !important;
        }
        .hn-navbar-inner { max-width:1440px; margin:0 auto; padding:0 20px; display:flex; align-items:center; justify-content:space-between; overflow-x:auto; scrollbar-width:none; transition: all 0.3s ease-in-out !important; width: 100%; }
        .hn-navbar-inner::-webkit-scrollbar { display:none; }
        .hn-navlinks { display:flex; align-items:stretch; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
        .hn-nl {
          display:flex; 
          align-items:center; 
          gap:7px;
          padding: 0.6rem 1rem !important;
          font-family:'Cairo',sans-serif;
          font-size:13px;
          font-weight:600;
          color: #6b7280 !important;
          background:transparent; 
          border:none;
          border-bottom:2px solid transparent;
          cursor:pointer; 
          white-space:nowrap; 
          transition: all 0.25s ease !important;
          text-decoration:none; 
          position:relative;
        }
        .hn-nl:hover { 
          color: #059669 !important;
          background: transparent !important;
          border-bottom-color: #059669 !important;
        }
        .hn-nl::after { 
          content:''; 
          position:absolute; 
          bottom:0; 
          left:8%; 
          right:8%; 
          height:3px; 
          background: linear-gradient(90deg, #059669, #047857) !important;
          border-radius:99px; 
          transform: scaleX(0) !important;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .hn-nl:hover::after { transform: scaleX(1) !important; }
        .hn-nl-active { 
          color: #059669 !important;
          padding-bottom: 0.4rem !important;
        }
        .hn-nl-active::after { transform: scaleX(1) !important; }

        /* اليمين — زر إضافة إعلان */
        .hn-navright { display:flex; align-items:center; gap:10px; padding:8px 0; }

        /* MOBILE */
        .hn-mtog { display:none; padding:8px; border:1px solid ${border}; border-radius:8px; background:transparent; cursor:pointer; color:${txtMain}; }
        .hn-mdrawer { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:600; animation:hnFd .2s ease; }
        @keyframes hnFd { from{opacity:0} to{opacity:1} }
        .hn-mpanel { position:absolute; top:0; right:0; bottom:0; width:292px; background:${bg}; display:flex; flex-direction:column; animation:hnSl .22s ease; overflow-y:auto; }
        @keyframes hnSl { from{transform:translateX(100%)} to{transform:none} }
        .hn-mhead { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid ${border}; }
        .hn-mclose { padding:6px; border:none; background:${bgHov}; border-radius:7px; cursor:pointer; color:${txtMu}; }
        .hn-msearch { margin:14px; border:1.5px solid ${border}; border-radius:9px; overflow:hidden; display:flex; }
        .hn-msearch input { flex:1; padding:10px 13px; border:none; outline:none; font-size:14px; direction:rtl; font-family:'Cairo',sans-serif; background:${D?'#162016':'#fff'}; color:${txtMain}; }
        .hn-msearch button { padding:0 13px; background:#059669; border:none; cursor:pointer; }
        .hn-mtoggle-row { display:flex; gap:8px; padding:0 14px 12px; }
        .hn-mtoggle-btn { flex:1; padding:9px; border:1px solid ${border}; border-radius:8px; background:transparent; font-family:'Cairo',sans-serif; font-size:13px; font-weight:600; cursor:pointer; color:${txtMu}; display:flex; align-items:center; justify-content:center; gap:5px; transition:all .2s; }
        .hn-mlinks { padding:0 14px 6px; }
        .hn-mlinks-lbl { font-size:10.5px; font-weight:700; color:#9ca3af; letter-spacing:.4px; margin-bottom:4px; }
        .hn-mlink { display:flex; align-items:center; gap:9px; padding:10px 11px; border-radius:9px; color:${txtMain}; font-size:14px; font-weight:500; background:none; border:none; width:100%; cursor:pointer; text-align:right; font-family:'Cairo',sans-serif; transition:background .12s; text-decoration:none; }
        .hn-mlink:hover { background:${bgHov}; color:#059669; }
        .hn-mlink-active { background:${D?'rgba(5,150,105,.12)':'#f0fdf4'} !important; color:#059669 !important; font-weight:700 !important; }
        .hn-mbtns { padding:14px; margin-top:auto; border-top:1px solid ${border}; display:flex; flex-direction:column; gap:9px; }
        .hn-mbtns button { padding:11px; border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; border:none; font-family:'Cairo',sans-serif; }

        @media(max-width:960px){
          .hn-navlinks { display:none !important; }
          .hn-navright { display:none !important; }
          .hn-acts .hn-ctrl,.hn-acts .hn-login,.hn-acts .hn-register,.hn-acts .hn-icon-btn,.hn-acts .hn-pwrap,.hn-acts .hn-divider,.hn-acts .hn-add-btn { display:none; }
          .hn-mtog { display:flex; }
        }
      `}</style>

      <div className="hn" dir={ar ? 'rtl' : 'ltr'}>

        {/* TOP ROW */}
        <div className="hn-top">
          <div className="hn-row">
            {/* زر القائمة للجوال */}
            <button className="hn-mtog" onClick={() => setShowMobile(true)}><Menu size={20}/></button>

            {/* اللوجو */}
            <Link to="/" className="hn-logo">
              <img src={logoImage} alt="ECOv" />
            </Link>

            {/* الأزرار على الجانب الآخر (يسار في RTL) */}
            <div className="hn-acts">
              {/* زر تغيير اللغة */}
              <button className="hn-ctrl" onClick={() => setLang(ar ? 'en' : 'ar')}><Globe size={13}/> {ar ? 'EN' : 'ع'}</button>
              
              {/* زر الوضع الليلي/النهاري */}
              <button className="hn-ctrl" onClick={() => setDark(!dark)}>{dark ? <Sun size={14}/> : <Moon size={14}/>}</button>
              
              <div className="hn-divider"/>

              {user ? (
                <>
                  {/* إشعارات - تظهر دائماً */}
                  <div className="hn-pwrap" ref={notificationsRef}>
                    <button className="hn-icon-btn" onClick={() => setShowNotifications(!showNotifications)} title={ar ? "الإشعارات" : "Notifications"}>
                      <Bell size={19}/>
                      {notifications.length > 0 && <span className="hn-badge">{notifications.length}</span>}
                    </button>
                    {showNotifications && (
                      <div className="hn-dd" style={{
                        maxHeight: '450px',
                        overflowY: 'auto',
                        minWidth: '350px'
                      }}>
                        {notifications.length > 0 ? (
                          <>
                            {notifications.map(notif => (
                              <div key={notif.id} style={{
                                padding: '12px 14px',
                                borderBottom: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                backgroundColor: notif.read ? 'transparent' : '#f0fdf4',
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'flex-start'
                              }} 
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : '#f0fdf4'}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', minWidth: '24px' }}>
                                  {getNotificationIcon(notif.type)}
                                </div>
                                <div style={{ flex: 1, textAlign: 'right' }}>
                                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{notif.title}</div>
                                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', lineHeight: '1.4' }}>{notif.message}</div>
                                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{notif.time}</div>
                                </div>
                                {!notif.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669', marginTop: '4px' }} />}
                              </div>
                            ))}
                            <div style={{
                              padding: '10px',
                              textAlign: 'center',
                              borderTop: '1px solid #e5e7eb',
                              fontSize: '12px',
                              color: '#059669',
                              cursor: 'pointer',
                              fontWeight: 600
                            }} onClick={() => navigate('/notifications')}>
                              {ar ? 'عرض جميع الإشعارات' : 'View all notifications'}
                            </div>
                          </>
                        ) : (
                          <div className="hn-ddi" style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                            {ar ? 'لا توجد إشعارات' : 'No notifications'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* رسائل */}
                  <button className="hn-icon-btn" onClick={() => navigate('/messages')} title={ar ? "الرسائل" : "Messages"}><MessageSquare size={19}/></button>
                  
                  {/* الملف الشخصي مع الصورة */}
                  <div className="hn-pwrap" ref={profileRef}>
                    <button className="hn-pbtn" onClick={() => setShowProfile(!showProfile)}>
                      {getUserAvatar()}
                      <span className="hn-uname">{user?.factoryName || user?.name || (ar?'مصنعي':'My Factory')}</span>
                      <ChevronDown size={11} color="#9ca3af"/>
                    </button>
                    {showProfile && (
                      <div className="hn-dd">
                        <Link to="/dashboard"   className="hn-ddi" onClick={() => setShowProfile(false)}><BarChart2 size={14}/>{ar?'لوحة التحكم':'Dashboard'}</Link>
                        <Link to="/my-listings" className="hn-ddi" onClick={() => setShowProfile(false)}><Eye size={14}/>{ar?'إعلاناتي':'My Listings'}</Link>
                        <Link to="/list-waste"  className="hn-ddi" onClick={() => setShowProfile(false)}><Plus size={14}/>{ar?'إضافة إعلان':'Add Listing'}</Link>
                        <Link to="/orders"      className="hn-ddi" onClick={() => setShowProfile(false)}><Package size={14}/>{ar?'الطلبات':'Orders'}</Link>
                        <Link to="/sales"       className="hn-ddi" onClick={() => setShowProfile(false)}><TrendingUp size={14}/>{ar?'المبيعات':'Sales'}</Link>
                        <Link to="/profile"     className="hn-ddi" onClick={() => setShowProfile(false)}><Settings size={14}/>{ar?'الإعدادات':'Settings'}</Link>
                        <hr className="hn-sep"/>
                        <button className="hn-ddi red" onClick={() => { onLogout(); navigate('/login'); }}><LogOut size={14}/>{ar?'تسجيل الخروج':'Logout'}</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* أزرار تسجيل الدخول والتسجيل - بدون مستخدم */}
                  <button className="hn-login" onClick={() => navigate('/login')}>{ar ? 'تسجيل الدخول' : 'Login'}</button>
                  <button className="hn-register" onClick={() => navigate('/registration')}><Plus size={14}/> {ar ? 'سجّل مصنعك' : 'Register Factory'}</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NAV BAR — يظهر فقط إذا كان هناك مستخدم */}
        {user && (
          <div 
            className={`hn-navbar ${showNavbar ? 'show-expanded' : ''}`}
            ref={navRef}
            style={{
              background: '#ffffff',
              boxShadow: 'none',
              overflow: 'visible',
              transition: 'all 0.3s ease-in-out',
              minHeight: '48px'
            }}
          >
            <div className="hn-navbar-inner">
              <ChevronDown 
                size={18} 
                className="hn-arrow-down" 
                strokeWidth={3}
                onClick={() => setShowNavbar(!showNavbar)}
                style={{ cursor: 'pointer' }}
              />
              
              {/* عندما navbar مفتوح - عرض الروابط */}
              <div className="hn-navlinks" style={{ 
                display: showNavbar ? 'flex' : 'none'
              }}>
                {NAV_LINKS.map(({ ar: arL, en, path, Icon }) => {
                  const active = isActive(path);
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`hn-nl${active ? ' hn-nl-active' : ''}`}
                    >
                      <Icon size={15} color={active ? '#059669' : undefined}/>
                      {ar ? arL : en}
                    </Link>
                  );
                })}
              </div>

              {/* أيقونات صغيرة عندما navbar مغلق */}
              <div style={{
                display: showNavbar ? 'none' : 'flex',
                gap: '24px',
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1,
                paddingRight: '20px'
              }}>
                <BarChart2 size={18} title="Dashboard" style={{ cursor: 'pointer', color: '#059669', transition: 'all 0.3s', opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'} onClick={() => navigate('/dashboard')} />
                <ShoppingBag size={18} title="Market" style={{ cursor: 'pointer', color: '#059669', transition: 'all 0.3s', opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'} onClick={() => navigate('/market')} />
                <List size={18} title="My Listings" style={{ cursor: 'pointer', color: '#059669', transition: 'all 0.3s', opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'} onClick={() => navigate('/my-listings')} />
                <Package size={18} title="Orders" style={{ cursor: 'pointer', color: '#059669', transition: 'all 0.3s', opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'} onClick={() => navigate('/orders')} />
                <TrendingUp size={18} title="Sales" style={{ cursor: 'pointer', color: '#059669', transition: 'all 0.3s', opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'} onClick={() => navigate('/sales')} />
              </div>

              {/* الروابط على اليمين - عندما navbar مفتوح */}
              <div className="hn-navright" style={{
                display: showNavbar ? 'flex' : 'none'
              }}>
                <Link to="/payment" className={`hn-nl ${isActive('/payment') ? 'hn-nl-active' : ''}`} title={ar ? "الدفع والشراء" : "Payment"}>
                  <CreditCard size={14}/> {ar ? 'الدفع' : 'Payment'}
                </Link>
                <Link to="/waste-tracking" className={`hn-nl ${isActive('/waste-tracking') ? 'hn-nl-active' : ''}`} title={ar ? "تتبع رحلة النفايات" : "Track Waste"}>
                  <WasteIcon size={14}/> {ar ? 'التتبع' : 'Track'}
                </Link>
                <button className="hn-nl" onClick={() => navigate('/list-waste')} title={ar ? "إضافة إعلان جديد" : "Add New Listing"}>
                  <Plus size={14}/> {ar ? 'إضافة إعلان' : 'Add Listing'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE DRAWER */}
        {showMobile && (
          <div className="hn-mdrawer" onClick={e => { if(e.target===e.currentTarget) setShowMobile(false); }}>
            <div className="hn-mpanel">
              <div className="hn-mhead">
                <img src={logoImage} alt="ECOv" style={{ height: 38, objectFit: 'contain' }} />
                <button className="hn-mclose" onClick={() => setShowMobile(false)}><X size={17}/></button>
              </div>
              
              {/* شريط بحث للجوال (يمكن إزالته إذا أردت) */}
              <form className="hn-msearch" onSubmit={e => { handleSearch(e); setShowMobile(false); }}>
                <input placeholder={ar?'ابحث...':'Search...'} value={query} onChange={e => setQuery(e.target.value)}/>
                <button type="submit"><Search size={15} color="white"/></button>
              </form>
              
              <div className="hn-mtoggle-row">
                <button className="hn-mtoggle-btn" onClick={() => setLang(ar?'en':'ar')}><Globe size={13}/> {ar?'English':'العربية'}</button>
                <button className="hn-mtoggle-btn" onClick={() => setDark(!dark)}>{dark?<><Sun size={13}/> {ar?'فاتح':'Light'}</>:<><Moon size={13}/> {ar?'داكن':'Dark'}</>}</button>
              </div>

              {/* روابط الجوال */}
              <div className="hn-mlinks">
                <p className="hn-mlinks-lbl">{ar?'الصفحات':'PAGES'}</p>
                {user ? (
                  // إذا كان مستخدم، نعرض الروابط كاملة
                  NAV_LINKS.map(({ ar: arL, en, path, Icon }) => {
                    const active = isActive(path);
                    return (
                      <Link key={path}
                        to={path}
                        className={`hn-mlink${active ? ' hn-mlink-active' : ''}`}
                        onClick={() => setShowMobile(false)}>
                        <Icon size={16} color={active ? '#059669' : undefined}/> {ar ? arL : en}
                      </Link>
                    );
                  })
                ) : (
                  // إذا لم يكن مستخدم، نعرض فقط خيارات اللغة والوضع
                  <>
                    <button className="hn-mlink" onClick={() => { setLang(ar?'en':'ar'); setShowMobile(false); }}>
                      <Globe size={16}/> {ar?'English':'العربية'}
                    </button>
                    <button className="hn-mlink" onClick={() => { setDark(!dark); setShowMobile(false); }}>
                      {dark ? <Sun size={16}/> : <Moon size={16}/>} {ar?'الوضع الفاتح':'Light Mode'}
                    </button>
                  </>
                )}
              </div>

              {/* أزرار الجوال السفلية */}
              <div className="hn-mbtns">
                {user ? (
                  <>
                    <button style={{background:'#059669',color:'white'}} onClick={() => { navigate('/payment'); setShowMobile(false); }}>{ar?'الدفع والشراء':'Payment'}</button>
                    <button style={{background:'#0e7490',color:'white'}} onClick={() => { navigate('/waste-tracking'); setShowMobile(false); }}>{ar?'تتبع النفايات':'Track Waste'}</button>
                    <button style={{background:'#059669',color:'white'}} onClick={() => { navigate('/list-waste'); setShowMobile(false); }}>{ar?'إضافة إعلان جديد':'Add New Listing'}</button>
                    <button style={{background:D?'#162016':'#f3f4f6',color:D?'#d1fae5':'#111'}} onClick={() => { navigate('/dashboard'); setShowMobile(false); }}>{ar?'لوحة التحكم':'Dashboard'}</button>
                    <button style={{background:'#ef4444',color:'white'}} onClick={() => { onLogout(); navigate('/login'); setShowMobile(false); }}>{ar?'تسجيل الخروج':'Logout'}</button>
                  </>
                ) : (
                  <>
                    <button style={{background:D?'#162016':'#f3f4f6',color:D?'#d1fae5':'#111'}} onClick={() => { navigate('/login'); setShowMobile(false); }}>{ar?'تسجيل الدخول':'Login'}</button>
                    <button style={{background:'#059669',color:'white'}} onClick={() => { navigate('/registration'); setShowMobile(false); }}>{ar?'سجّل مصنعك مجاناً':'Register Free'}</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}