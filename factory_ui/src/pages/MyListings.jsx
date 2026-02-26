// MyListings.jsx — ECOv Premium Redesign 2026
// Matching Dashboard aesthetic: IBM Plex Sans Arabic + Syne + Natural Green

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Trash2, Calendar, DollarSign, MapPin,
  CheckCircle, Clock, AlertCircle, Edit, Eye,
  Search, ChevronDown, Plus, Leaf, TrendingUp,
  BarChart2, Star, Layers
} from 'lucide-react';
import './MyListings.css';

// ─── Category colors & icons map ─────────────────
const CAT_CONFIG = {
  'بلاستيك': { color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  'ورق':     { color: '#be185d', bg: 'rgba(190,24,93,0.1)' },
  'معادن':   { color: '#c77b1a', bg: 'rgba(199,123,26,0.1)' },
  'زجاج':    { color: '#5a2d8a', bg: 'rgba(90,45,138,0.1)' },
  'خشب':     { color: '#1a7a3c', bg: 'rgba(26,122,60,0.1)' },
}

function MyListings() {
  const [listings, setListings] = useState([
    { id:1, title:'نفايات بلاستيك صديقة للبيئة', type:'بلاستيك', amount:'2.5', unit:'طن',  frequency:'شهري',   price:'1500', currency:'جنيه', location:'القاهرة',    status:'نشط',   date:'2024-01-15', views:45, offers:3 },
    { id:2, title:'مخلفات ورق مكتبي',             type:'ورق',     amount:'800', unit:'كجم', frequency:'أسبوعي', price:'800',  currency:'جنيه', location:'الجيزة',     status:'معلق',  date:'2024-01-10', views:32, offers:1 },
    { id:3, title:'معادن مستهلكة للصناعات',        type:'معادن',   amount:'5',   unit:'طن',  frequency:'شهري',   price:'3500', currency:'جنيه', location:'الإسكندرية', status:'منتهي', date:'2023-12-20', views:78, offers:5 },
    { id:4, title:'زجاج صناعي نظيف',              type:'زجاج',    amount:'1.2', unit:'طن',  frequency:'شهري',   price:'1200', currency:'جنيه', location:'بور سعيد',   status:'نشط',   date:'2024-01-05', views:28, offers:2 },
  ]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredListings = listings.filter(l => {
    const matchesFilter = filter === 'all' || l.status === filter;
    const matchesSearch = search === '' || l.title.includes(search) || l.type.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getStatusClass = (status) => {
    if (status === 'نشط')  return 'active';
    if (status === 'معلق') return 'pending';
    return 'expired';
  };

  const StatusIcon = ({ status }) => {
    if (status === 'نشط')  return <CheckCircle size={13} />;
    if (status === 'معلق') return <Clock size={13} />;
    return <AlertCircle size={13} />;
  };

  const totalViews  = listings.reduce((s,l) => s + l.views, 0);
  const totalOffers = listings.reduce((s,l) => s + l.offers, 0);
  const activeCount = listings.filter(l => l.status === 'نشط').length;
  const avgViews    = Math.round(totalViews / listings.length);
  const avgOffers   = (totalOffers / listings.length).toFixed(1);

  return (
    <div className="listings-container">

      {/* ─── Header ─────────────────────────────── */}
      <div className="listings-header">
        <div className="listings-header-inner">
          <div className="listings-header-icon">
            <Leaf />
          </div>
          <h1>إعلانات النفايات الخاصة بي</h1>
        </div>
        <p>إدارة وتتبع إعلانات النفايات الصناعية الخاصة بمصنعك</p>
      </div>

      {/* ─── Stats Grid ─────────────────────────── */}
      <div className="stats-grid">
        {[
          { label:'إجمالي الإعلانات', value:listings.length, cls:'',       Icon:Package,     icCls:'' },
          { label:'إعلانات نشطة',     value:activeCount,      cls:'emerald', Icon:CheckCircle,  icCls:'' },
          { label:'إجمالي العروض',    value:totalOffers,      cls:'blue',   Icon:DollarSign,  icCls:'blue' },
          { label:'إجمالي المشاهدات', value:totalViews,       cls:'purple', Icon:Eye,         icCls:'purple' },
        ].map(({ label, value, cls, Icon, icCls }, i) => (
          <div className="stat-card" key={i} style={{ animationDelay:`${i * 0.08}s` }}>
            <div className="stat-card-content">
              <div className="stat-info">
                <p>{label}</p>
                <div className={`stat-number ${cls}`}>{value}</div>
              </div>
              <div className={`stat-icon ${icCls}`}>
                <Icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Controls ───────────────────────────── */}
      <div className="controls-card">
        <div className="controls-wrapper">
          <div className="filter-group">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="ابحث في إعلاناتك..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="select-wrapper">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="select-input"
              >
                <option value="all">جميع الحالات</option>
                <option value="نشط">نشط</option>
                <option value="معلق">معلق</option>
                <option value="منتهي">منتهي</option>
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>
          <Link to="/list-waste" className="add-button">
            <Plus size={17} />
            إضافة إعلان جديد
          </Link>
        </div>
      </div>

      {/* ─── Table ──────────────────────────────── */}
      <div className="table-wrapper">
        <table className="listings-table">
          <thead>
            <tr>
              <th>الإعلان</th>
              <th>النوع</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>المكان</th>
              <th>المشاهدات / العروض</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((listing) => {
              const cat = CAT_CONFIG[listing.type] || CAT_CONFIG['خشب'];
              return (
                <tr key={listing.id}>
                  {/* Listing title */}
                  <td>
                    <div className="product-cell">
                      <div className="product-icon" style={{ background: cat.bg, borderColor: `${cat.color}20` }}>
                        <Leaf style={{ color: cat.color }} />
                      </div>
                      <div>
                        <div className="title-details">{listing.title}</div>
                        <div className="date-details">
                          <Calendar />
                          <span>{listing.date}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td>
                    <span className="type-badge" style={{ background: cat.bg, borderColor:`${cat.color}25`, color: cat.color }}>
                      <Trash2 style={{ color: cat.color }} />
                      {listing.type}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td>
                    <div className="amount-main">{listing.amount} {listing.unit}</div>
                    <div className="frequency-tag">
                      <Clock size={11} />
                      {listing.frequency}
                    </div>
                  </td>

                  {/* Price */}
                  <td>
                    <div className="price-cell">
                      <DollarSign />
                      {parseInt(listing.price).toLocaleString()} {listing.currency}
                    </div>
                  </td>

                  {/* Location */}
                  <td>
                    <div className="location-cell">
                      <MapPin />
                      {listing.location}
                    </div>
                  </td>

                  {/* Views / Offers */}
                  <td>
                    <div className="mini-stats">
                      <div className="mini-stat">
                        <Eye />
                        <strong>{listing.views}</strong>
                        <span>مشاهدة</span>
                      </div>
                      <div className="mini-stat">
                        <Star />
                        <strong>{listing.offers}</strong>
                        <span>عرض</span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`status-badge ${getStatusClass(listing.status)}`}>
                      <StatusIcon status={listing.status} />
                      {listing.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="action-buttons">
                      <Link to={`/waste-details/${listing.id}`} className="action-btn view" title="عرض التفاصيل">
                        <Eye />
                      </Link>
                      <button className="action-btn edit" title="تعديل">
                        <Edit />
                      </button>
                      <button
                        className="action-btn delete"
                        title="حذف"
                        onClick={() => setListings(prev => prev.filter(l => l.id !== listing.id))}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredListings.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-icon-wrap">
                <Package />
              </div>
              <h3>لا توجد إعلانات مطابقة</h3>
              <p>جرّب تغيير فلتر البحث أو أضف إعلاناً جديداً</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── Performance Card ───────────────────── */}
      <div className="performance-card">
        <div className="performance-card-header">
          <h3>إحصائيات الأداء</h3>
          <span className="performance-tag">هذا الشهر</span>
        </div>
        <div className="performance-grid">
          {[
            {
              label: 'متوسط المشاهدات لكل إعلان',
              value: avgViews,
              cls: 'purple',
              Icon: Eye,
              iconBg: 'rgba(90,45,138,0.1)',
              iconColor: '#5a2d8a',
            },
            {
              label: 'متوسط العروض لكل إعلان',
              value: avgOffers,
              cls: 'blue',
              Icon: BarChart2,
              iconBg: 'rgba(26,74,138,0.1)',
              iconColor: '#1a4a8a',
            },
            {
              label: 'معدل التفاعل',
              value: '78%',
              cls: 'emerald',
              Icon: TrendingUp,
              iconBg: 'rgba(26,122,60,0.1)',
              iconColor: '#1a7a3c',
            },
          ].map(({ label, value, cls, Icon, iconBg, iconColor }, i) => (
            <div className="performance-item" key={i}>
              <div className="performance-icon" style={{ background: iconBg }}>
                <Icon style={{ color: iconColor }} />
              </div>
              <p>{label}</p>
              <div className={`performance-number ${cls}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default MyListings;