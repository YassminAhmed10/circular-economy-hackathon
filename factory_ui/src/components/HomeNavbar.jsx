import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, ChevronDown, MapPin, Bell, MessageSquare,
  User, LogOut, Settings, BarChart2, Package, Eye,
  Menu, X, Plus, Globe, Moon, Sun,
  Home, ShoppingBag, Users, TrendingUp, List, FileText
} from 'lucide-react';
import logoImage from '../assets/ecovnew.png';

export default function HomeNavbar({ user, onLogout, lang, setLang, dark, setDark }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [query, setQuery]             = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showMobile, setShowMobile]   = useState(false);
  const profileRef = useRef(null);
  const ar = lang === 'ar';
  const D  = dark;

  // روابط الصفحات
  const NAV_LINKS = user ? [
    { ar: 'الرئيسية',      en: 'Home',        path: '/',            Icon: Home        },
    { ar: 'السوق',         en: 'Market',      path: '/market',      Icon: ShoppingBag },
    { ar: 'لوحة التحكم',   en: 'Dashboard',   path: '/dashboard',   Icon: BarChart2   },
    { ar: 'إعلاناتي',      en: 'My Listings', path: '/my-listings', Icon: List        },
    { ar: 'طلباتي',        en: 'Orders',      path: '/orders',      Icon: Package     },
    { ar: 'الرسائل',       en: 'Messages',    path: '/messages',    Icon: MessageSquare },
    { ar: 'التقارير',      en: 'Analytics',   path: '/analytics',   Icon: TrendingUp  },
    { ar: 'الشركاء',       en: 'Partners',    path: '/partners',    Icon: Users       },
  ] : [
    { ar: 'الرئيسية',  en: 'Home',    path: '/',       Icon: Home        },
    { ar: 'السوق',     en: 'Market',  path: '/market', Icon: ShoppingBag },
  ];

  useEffect(() => {
    const h = e => { if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) navigate(`/market?search=${encodeURIComponent(query)}`);
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
        .hn * { box-sizing:border-box; font-family:'Cairo',system-ui,sans-serif; }

        .hn-top { background:${bg}; border-bottom:1px solid ${border}; transition:background .3s,border-color .3s; box-shadow:${D?'none':'0 1px 8px rgba(0,0,0,.06)'}; position:sticky; top:0; z-index:300; }
        .hn-row { max-width:1440px; margin:0 auto; padding:0 32px; height:72px; display:flex; align-items:center; gap:18px; }

        /* LOGO */
        .hn-logo { display:flex; align-items:center; text-decoration:none; flex-shrink:0; transition:opacity .2s,transform .2s; }
        .hn-logo:hover { opacity:.85; transform:scale(1.02); }
        .hn-logo img { height:54px; width:auto; object-fit:contain; display:block; }

        /* SEARCH */
        .hn-sf { flex:1; max-width:720px; display:flex; align-items:center; border:2px solid ${D?'#1e3320':'#e2e8f0'}; border-radius:14px; overflow:hidden; background:${D?'#0d1a10':'#f8fafc'}; transition:border-color .2s,box-shadow .2s,background .2s; height:48px; }
        .hn-sf:focus-within { border-color:#059669; box-shadow:0 0 0 4px rgba(5,150,105,.12); background:${D?'#0f1a12':'#fff'}; }
        .hn-loc { display:flex; align-items:center; gap:6px; padding:0 16px; border:none; border-left:2px solid ${D?'#1e3320':'#e2e8f0'}; background:transparent; font-size:14px; font-weight:700; color:${txtMain}; cursor:pointer; white-space:nowrap; transition:all .15s; height:100%; flex-shrink:0; }
        .hn-loc:hover { color:#059669; }
        .hn-si { flex:1; padding:0 18px; border:none; outline:none; font-size:14.5px; color:${txtMain}; background:transparent; direction:rtl; height:100%; font-family:'Cairo',sans-serif; }
        .hn-si::placeholder { color:${D?'#4b7a5a':'#94a3b8'}; }
        .hn-sb { width:52px; height:100%; background:#059669; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s; flex-shrink:0; }
        .hn-sb:hover { background:#047857; }

        /* ACTIONS */
        .hn-acts { display:flex; align-items:center; gap:6px; margin-right:auto; flex-shrink:0; }
        .hn-icon-btn { padding:9px; border:none; background:transparent; cursor:pointer; border-radius:10px; color:${txtMu}; transition:all .2s; position:relative; }
        .hn-icon-btn:hover { background:${bgHov}; color:#059669; }
        .hn-ctrl { display:flex; align-items:center; gap:5px; padding:8px 13px; border:1.5px solid ${border}; border-radius:10px; background:transparent; font-size:13px; font-weight:600; color:${txtMu}; cursor:pointer; transition:all .2s; white-space:nowrap; height:40px; }
        .hn-ctrl:hover { border-color:#059669; color:#059669; background:${bgHov}; }
        .hn-divider { width:1px; height:28px; background:${border}; margin:0 3px; flex-shrink:0; }
        .hn-login { padding:9px 18px; border:1.5px solid ${border}; background:transparent; font-size:14px; font-weight:700; color:${txtMain}; cursor:pointer; border-radius:10px; transition:all .2s; height:42px; display:flex; align-items:center; }
        .hn-login:hover { border-color:#059669; color:#059669; background:${bgHov}; }
        .hn-register { display:flex; align-items:center; gap:7px; padding:10px 22px; background:linear-gradient(135deg,#059669,#047857); color:#fff; border:none; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer; transition:all .2s; white-space:nowrap; height:42px; box-shadow:0 2px 10px rgba(5,150,105,.3); }
        .hn-register:hover { background:linear-gradient(135deg,#047857,#065f46); transform:translateY(-1px); box-shadow:0 6px 18px rgba(5,150,105,.4); }
        .hn-badge { position:absolute; top:1px; right:1px; width:17px; height:17px; background:#ef4444; color:#fff; border-radius:50%; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center; border:2px solid ${badgeBg}; }

        /* ADD LISTING BTN */
        .hn-add-btn { display:flex; align-items:center; gap:6px; padding:9px 16px; background:linear-gradient(135deg,#059669,#047857); color:#fff; border:none; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; transition:all .2s; white-space:nowrap; height:40px; box-shadow:0 2px 8px rgba(5,150,105,.25); font-family:'Cairo',sans-serif; }
        .hn-add-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(5,150,105,.4); }

        /* PROFILE */
        .hn-pwrap { position:relative; }
        .hn-pbtn { display:flex; align-items:center; gap:8px; padding:7px 13px; border:1.5px solid ${border}; border-radius:10px; background:transparent; cursor:pointer; transition:all .2s; height:42px; }
        .hn-pbtn:hover { border-color:#059669; background:${bgHov}; }
        .hn-av { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#059669,#10b981); display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0; font-size:12px; font-weight:800; }
        .hn-uname { font-size:13px; font-weight:600; color:${txtMain}; max-width:88px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .hn-dd { position:absolute; top:calc(100% + 8px); left:0; background:${bg}; border:1px solid ${border}; border-radius:12px; box-shadow:0 12px 32px rgba(0,0,0,.15); min-width:200px; padding:6px; z-index:400; animation:ddIn .15s ease; }
        @keyframes ddIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:none} }
        .hn-ddi { display:flex; align-items:center; gap:9px; padding:10px 13px; border-radius:9px; color:${txtMain}; font-size:13px; font-weight:500; text-decoration:none; cursor:pointer; background:none; border:none; width:100%; text-align:right; transition:background .12s; font-family:'Cairo',sans-serif; }
        .hn-ddi:hover { background:${bgHov}; color:#059669; }
        .hn-ddi.red:hover { background:#fef2f2; color:#dc2626; }
        .hn-sep { border:none; border-top:1px solid ${border}; margin:4px 0; }

        /* NAV BAR — شريط الصفحات */
        .hn-navbar { background:${bgNav}; border-bottom:1px solid ${border}; transition:background .3s; }
        .hn-navbar-inner { max-width:1440px; margin:0 auto; padding:0 32px; display:flex; align-items:stretch; justify-content:space-between; overflow-x:auto; scrollbar-width:none; }
        .hn-navbar-inner::-webkit-scrollbar { display:none; }
        .hn-navlinks { display:flex; align-items:stretch; }
        .hn-nl {
          display:flex; align-items:center; gap:7px;
          padding:13px 16px;
          font-family:'Cairo',sans-serif;
          font-size:14px;
          font-weight:600;
          color:${txtMu};
          background:transparent; border:none;
          border-bottom:3px solid transparent;
          cursor:pointer; white-space:nowrap; transition:all .2s;
          text-decoration:none; position:relative;
        }
        .hn-nl:hover { color:#059669; background:${D?'rgba(5,150,105,.08)':'rgba(5,150,105,.04)'}; }
        .hn-nl::after { content:''; position:absolute; bottom:0; left:8%; right:8%; height:3px; background:#059669; border-radius:99px; transform:scaleX(0); transition:transform .2s; }
        .hn-nl:hover::after { transform:scaleX(1); }
        .hn-nl-active { color:#059669 !important; }
        .hn-nl-active::after { transform:scaleX(1) !important; }

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
          .hn-sf { display:none !important; }
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
            <button className="hn-mtog" onClick={() => setShowMobile(true)}><Menu size={20}/></button>

            <Link to="/" className="hn-logo">
              <img src={logoImage} alt="ECOv" />
            </Link>

            <form className="hn-sf" onSubmit={handleSearch}>
              <button type="button" className="hn-loc">
                <MapPin size={13} color="#059669"/>
                {ar ? 'مصر' : 'Egypt'}
                <ChevronDown size={11} color="#9ca3af"/>
              </button>
              <input className="hn-si"
                placeholder={ar ? 'ابحث عن نفايات، خامات، مصانع...' : 'Find waste, materials, factories...'}
                value={query} onChange={e => setQuery(e.target.value)}
              />
              <button className="hn-sb" type="submit"><Search size={17} color="white"/></button>
            </form>

            <div className="hn-acts">
              <button className="hn-ctrl" onClick={() => setLang(ar ? 'en' : 'ar')}><Globe size={13}/> {ar ? 'EN' : 'ع'}</button>
              <button className="hn-ctrl" onClick={() => setDark(!dark)}>{dark ? <Sun size={14}/> : <Moon size={14}/>}</button>
              <div className="hn-divider"/>
              {user ? (
                <>
                  <button className="hn-icon-btn"><Bell size={19}/><span className="hn-badge">3</span></button>
                  <button className="hn-icon-btn" onClick={() => navigate('/messages')}><MessageSquare size={19}/></button>
                  <div className="hn-pwrap" ref={profileRef}>
                    <button className="hn-pbtn" onClick={() => setShowProfile(!showProfile)}>
                      <div className="hn-av">{(user.name || 'م').charAt(0)}</div>
                      <span className="hn-uname">{user.name || (ar?'مصنعي':'My Factory')}</span>
                      <ChevronDown size={11} color="#9ca3af"/>
                    </button>
                    {showProfile && (
                      <div className="hn-dd">
                        <Link to="/dashboard"   className="hn-ddi" onClick={() => setShowProfile(false)}><BarChart2 size={14}/>{ar?'لوحة التحكم':'Dashboard'}</Link>
                        <Link to="/my-listings" className="hn-ddi" onClick={() => setShowProfile(false)}><Eye size={14}/>{ar?'إعلاناتي':'My Listings'}</Link>
                        <Link to="/list-waste"  className="hn-ddi" onClick={() => setShowProfile(false)}><Plus size={14}/>{ar?'إضافة إعلان':'Add Listing'}</Link>
                        <Link to="/orders"      className="hn-ddi" onClick={() => setShowProfile(false)}><Package size={14}/>{ar?'طلباتي':'My Orders'}</Link>
                        <Link to="/profile"     className="hn-ddi" onClick={() => setShowProfile(false)}><Settings size={14}/>{ar?'الإعدادات':'Settings'}</Link>
                        <hr className="hn-sep"/>
                        <button className="hn-ddi red" onClick={onLogout}><LogOut size={14}/>{ar?'تسجيل الخروج':'Logout'}</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button className="hn-login" onClick={() => navigate('/login')}>{ar ? 'تسجيل الدخول' : 'Login'}</button>
                  <button className="hn-register" onClick={() => navigate('/registration')}><Plus size={14}/> {ar ? 'سجّل مصنعك' : 'Register Factory'}</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NAV BAR — شريط روابط الصفحات */}
        <div className="hn-navbar">
          <div className="hn-navbar-inner">
            {/* الروابط على اليمين */}
            <div className="hn-navlinks">
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

            {/* زر إضافة إعلان على اليسار */}
            {user && (
              <div className="hn-navright">
                <button className="hn-add-btn" onClick={() => navigate('/list-waste')}>
                  <Plus size={14}/> {ar ? 'إضافة إعلان' : 'Add Listing'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {showMobile && (
          <div className="hn-mdrawer" onClick={e => { if(e.target===e.currentTarget) setShowMobile(false); }}>
            <div className="hn-mpanel">
              <div className="hn-mhead">
                <img src={logoImage} alt="ECOv" style={{ height: 38, objectFit: 'contain' }} />
                <button className="hn-mclose" onClick={() => setShowMobile(false)}><X size={17}/></button>
              </div>
              <form className="hn-msearch" onSubmit={e => { handleSearch(e); setShowMobile(false); }}>
                <input placeholder={ar?'ابحث...':'Search...'} value={query} onChange={e => setQuery(e.target.value)}/>
                <button type="submit"><Search size={15} color="white"/></button>
              </form>
              <div className="hn-mtoggle-row">
                <button className="hn-mtoggle-btn" onClick={() => setLang(ar?'en':'ar')}><Globe size={13}/> {ar?'English':'العربية'}</button>
                <button className="hn-mtoggle-btn" onClick={() => setDark(!dark)}>{dark?<><Sun size={13}/> {ar?'فاتح':'Light'}</>:<><Moon size={13}/> {ar?'داكن':'Dark'}</>}</button>
              </div>
              <div className="hn-mlinks">
                <p className="hn-mlinks-lbl">{ar?'الصفحات':'PAGES'}</p>
                {NAV_LINKS.map(({ ar: arL, en, path, Icon }) => {
                  const active = isActive(path);
                  return (
                    <Link key={path}
                      to={path}
                      className={`hn-mlink${active ? ' hn-mlink-active' : ''}`}
                      onClick={() => setShowMobile(false)}>
                      <Icon size={16} color={active ? '#059669' : undefined}/> {ar ? arL : en}
                    </Link>
                  );
                })}
              </div>
              <div className="hn-mbtns">
                {user ? (
                  <>
                    <button style={{background:'#059669',color:'white'}} onClick={() => { navigate('/list-waste'); setShowMobile(false); }}>{ar?'إضافة إعلان جديد':'Add New Listing'}</button>
                    <button style={{background:D?'#162016':'#f3f4f6',color:D?'#d1fae5':'#111'}} onClick={() => { navigate('/dashboard'); setShowMobile(false); }}>{ar?'لوحة التحكم':'Dashboard'}</button>
                    <button style={{background:'#ef4444',color:'white'}} onClick={() => { onLogout(); setShowMobile(false); }}>{ar?'تسجيل الخروج':'Logout'}</button>
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