// Orders.jsx — ECOv · طلبات الشراء الواردة — Premium Redesign
import React, { useState, useMemo } from 'react';
import {
  ShoppingCart, CheckCircle2, X, MessageSquare,
  Star, Search, MapPin, Sparkles
} from 'lucide-react';
import './Orders.css';

const PURCHASE_REQUESTS = [
  {
    id: 1,
    factoryAr: 'مصنع إعادة التدوير الأخضر',
    locAr: 'القاهرة',
    productAr: 'بلاستيك PET',
    qtyAr: '2 طن',
    price: 5800,
    timeAr: 'منذ 10 دقائق',
    rating: 4.8,
    deals: 24,
    status: 'new',
    msgAr: 'نحتاج 2 طن من بلاستيك PET أسبوعياً، يمكن توقيع عقد طويل الأمد.',
    category: 'بلاستيك',
  },
  {
    id: 2,
    factoryAr: 'شركة الصلب المصرية',
    locAr: 'الإسكندرية',
    productAr: 'حديد خردة',
    qtyAr: '5 طن',
    price: 32000,
    timeAr: 'منذ ساعة',
    rating: 4.5,
    deals: 61,
    status: 'new',
    msgAr: 'مهتمون بشراء حديد الخردة بشكل دوري كل شهر.',
    category: 'معادن',
  },
  {
    id: 3,
    factoryAr: 'مصنع الورق المتحد',
    locAr: 'الجيزة',
    productAr: 'كرتون نظيف',
    qtyAr: '10 طن',
    price: 14000,
    timeAr: 'منذ 3 ساعات',
    rating: 4.2,
    deals: 38,
    status: 'accepted',
    msgAr: 'لدينا خط إنتاج جديد يحتاج كرتون بصفة منتظمة.',
    category: 'ورق',
  },
  {
    id: 4,
    factoryAr: 'مصنع الزجاج الحديث',
    locAr: 'بورسعيد',
    productAr: 'زجاج شفاف',
    qtyAr: '3 طن',
    price: 7200,
    timeAr: 'أمس',
    rating: 4.9,
    deals: 82,
    status: 'rejected',
    msgAr: 'نريد زجاجاً بمواصفات محددة، يرجى التواصل لمعرفة التفاصيل.',
    category: 'زجاج',
  },
  {
    id: 5,
    factoryAr: 'شركة الأخشاب المتحدة',
    locAr: 'المنصورة',
    productAr: 'خشب MDF',
    qtyAr: '6 طن',
    price: 9600,
    timeAr: 'منذ يومين',
    rating: 4.6,
    deals: 45,
    status: 'new',
    msgAr: 'نحتاج خشب MDF بشكل منتظم لخط الإنتاج الجديد.',
    category: 'خشب',
  },
];

const CAT_COLOR = {
  'بلاستيك': { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  glow: 'rgba(59,130,246,0.3)',  emoji: '♻️' },
  'معادن':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  glow: 'rgba(245,158,11,0.3)',  emoji: '⚙️' },
  'ورق':     { color: '#ec4899', bg: 'rgba(236,72,153,0.1)',  glow: 'rgba(236,72,153,0.3)',  emoji: '📄' },
  'زجاج':    { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  glow: 'rgba(139,92,246,0.3)',  emoji: '🔮' },
  'خشب':     { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  glow: 'rgba(16,185,129,0.3)',  emoji: '🌿' },
};

const STATUS_CFG = {
  new:      { label: 'جديد',   bg: '#dcfce7', color: '#15803d', border: 'rgba(22,163,74,0.25)' },
  accepted: { label: 'مقبول',  bg: '#dcfce7', color: '#15803d', border: 'rgba(22,163,74,0.25)' },
  rejected: { label: 'مرفوض', bg: '#fee2e2', color: '#dc2626', border: 'rgba(220,38,38,0.25)' },
};

export default function Orders() {
  const [requests, setRequests] = useState(PURCHASE_REQUESTS);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');

  const filtered = useMemo(() => requests.filter(r => {
    const q = search.trim();
    const matchSearch = !q || r.factoryAr.includes(q) || r.productAr.includes(q) || r.locAr.includes(q);
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  }), [requests, search, filter]);

  const handleStatus = (id, status) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  const counts = {
    all:      requests.length,
    new:      requests.filter(r => r.status === 'new').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const FILTERS = [
    { key: 'all',      label: 'الكل'   },
    { key: 'new',      label: 'جديد'   },
    { key: 'accepted', label: 'مقبول'  },
    { key: 'rejected', label: 'مرفوض' },
  ];

  return (
    <div className="orders-page" dir="rtl">

      {/* ── Header ── */}
      <header className="op-header">
        <div className="op-header-left">
          <div className="op-header-text">
            <div className="op-eyebrow">
              <Sparkles size={10}/> لوحة الطلبات
            </div>
            <h1>طلبات الشراء <em>الواردة</em></h1>
            <p>مصانع طلبت شراء منتجاتك — راجع وتصرف بسرعة</p>
          </div>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:16}}>
          {/* Stats bar */}
          <div className="op-stats-bar">
            <div className="op-stat-item">
              <span className="op-stat-num" style={{color:'#dc2626'}}>{counts.new}</span>
              <span className="op-stat-lbl">جديد</span>
            </div>
            <div className="op-stat-divider"/>
            <div className="op-stat-item">
              <span className="op-stat-num" style={{color:'#16a34a'}}>{counts.accepted}</span>
              <span className="op-stat-lbl">مقبول</span>
            </div>
            <div className="op-stat-divider"/>
            <div className="op-stat-item">
              <span className="op-stat-num" style={{color:'#6b7280'}}>{counts.rejected}</span>
              <span className="op-stat-lbl">مرفوض</span>
            </div>
          </div>

          {/* Orb */}
          <div className="op-header-orb">
            <div className="op-orb-glow"/>
            <div className="op-orb-core"><ShoppingCart size={24} color="white"/></div>
            <div className="op-orb-ring r1"/>
            <div className="op-orb-ring r2"/>
          </div>
        </div>
      </header>

      {/* ── Toolbar ── */}
      <div className="op-toolbar">
        <div className="op-search-wrap">
          <Search size={15} className="op-search-icon"/>
          <input
            className="op-search"
            placeholder="ابحث باسم المصنع، المنتج أو الموقع..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="op-filters">
          {FILTERS.map(f => (
            <button key={f.key} className={`op-filter-btn${filter===f.key?' active':''}`}
              onClick={() => setFilter(f.key)}>
              {f.label}
              <span className="op-filter-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="op-empty">
          <div className="op-empty-icon"><ShoppingCart size={32} opacity={.4}/></div>
          <p>لا توجد طلبات مطابقة</p>
        </div>
      ) : (
        <div className="op-grid">
          {filtered.map((req, i) => (
            <RequestCard
              key={req.id}
              req={req}
              cat={CAT_COLOR[req.category] || CAT_COLOR['خشب']}
              delay={i * 0.07}
              onAccept={() => handleStatus(req.id, 'accepted')}
              onReject={() => handleStatus(req.id, 'rejected')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RequestCard({ req, cat, delay, onAccept, onReject }) {
  const st = STATUS_CFG[req.status] || STATUS_CFG.new;

  return (
    <div className={`op-card${req.status === 'new' ? ' is-new' : ''}`}
      style={{animationDelay:`${delay}s`}}>

      {/* Top: badge يسار | اسم + meta يمين | صورة أقصى اليمين */}
      <div className="op-card-top">
        <span className="op-status-badge"
          style={{background:st.bg, color:st.color, border:`1px solid ${st.border}`}}>
          {st.label}
        </span>
        <div className="op-factory-info">
          <div>
            <div className="op-factory-name">{req.factoryAr}</div>
            <div className="op-factory-meta">
              <MapPin size={10}/>
              {req.locAr}
              <span className="op-meta-dot">·</span>
              <Star size={10} color="#d97706" fill="#d97706"/>
              <strong>{req.rating}</strong>
              <span className="op-meta-dot">·</span>
              {req.deals} صفقة
            </div>
          </div>
          <div className="op-factory-avatar">
            <img
              src={`https://picsum.photos/seed/${req.id + 30}/50/50`}
              alt={req.factoryAr}
              onError={e => { e.target.src = `https://picsum.photos/50/50?random=${req.id}`; }}
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="op-msg" style={{borderRight: `3px solid ${cat.color}`}}>
        <span className="op-msg-quote" style={{color: cat.color}}>"</span>
        <div style={{paddingRight: 4}}>{req.msgAr}</div>
      </div>

      {/* Chips */}
      <div className="op-chips">
        <div className="op-chip">
          <div className="op-chip-lbl">المنتج المطلوب</div>
          <div className="op-chip-val" style={{color: cat.color}}>
            <div className="op-chip-dot" style={{background: cat.color, boxShadow:`0 0 6px ${cat.glow}`}}/>
            {req.productAr}
          </div>
        </div>
        <div className="op-chip">
          <div className="op-chip-lbl">الكمية</div>
          <div className="op-chip-val" style={{color:'#16a34a'}}>{req.qtyAr}</div>
        </div>
        <div className="op-chip">
          <div className="op-chip-lbl">السعر المعروض</div>
          <div className="op-chip-val" style={{color:'#d97706'}}>
            <span style={{fontSize:11,opacity:.7}}>ج </span>
            {req.price.toLocaleString()}
          </div>
        </div>
        <div className="op-chip">
          <div className="op-chip-lbl">وقت الطلب</div>
          <div className="op-chip-val" style={{color:'#8b5cf6', fontSize:13}}>{req.timeAr}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="op-actions">
        {req.status === 'new' && (
          <>
            <button className="op-btn-accept" onClick={onAccept}>
              <CheckCircle2 size={14}/> قبول
            </button>
            <button className="op-btn-reject" onClick={onReject}>
              <X size={14}/> رفض
            </button>
          </>
        )}
        <button className="op-btn-contact">
          <MessageSquare size={13}/> تواصل
        </button>
      </div>
    </div>
  );
}