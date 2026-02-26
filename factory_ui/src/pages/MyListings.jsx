import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Trash2, Calendar, DollarSign, MapPin, 
  CheckCircle, Clock, AlertCircle, Edit, Eye, 
  Search, ChevronDown, Plus 
} from 'lucide-react';
import './MyListings.css';

function MyListings() {
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'نفايات بلاستيك صديقة للبيئة',
      type: 'بلاستيك',
      amount: '2.5',
      unit: 'طن',
      frequency: 'شهري',
      price: '1500',
      currency: 'جنيه',
      location: 'القاهرة',
      status: 'نشط',
      date: '2024-01-15',
      views: 45,
      offers: 3
    },
    {
      id: 2,
      title: 'مخلفات ورق مكتبي',
      type: 'ورق',
      amount: '800',
      unit: 'كجم',
      frequency: 'أسبوعي',
      price: '800',
      currency: 'جنيه',
      location: 'الجيزة',
      status: 'معلق',
      date: '2024-01-10',
      views: 32,
      offers: 1
    },
    {
      id: 3,
      title: 'معادن مستهلكة للصناعات',
      type: 'معادن',
      amount: '5',
      unit: 'طن',
      frequency: 'شهري',
      price: '3500',
      currency: 'جنيه',
      location: 'الإسكندرية',
      status: 'منتهي',
      date: '2023-12-20',
      views: 78,
      offers: 5
    },
    {
      id: 4,
      title: 'زجاج صناعي نظيف',
      type: 'زجاج',
      amount: '1.2',
      unit: 'طن',
      frequency: 'شهري',
      price: '1200',
      currency: 'جنيه',
      location: 'بور سعيد',
      status: 'نشط',
      date: '2024-01-05',
      views: 28,
      offers: 2
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredListings = listings.filter(listing => {
    const matchesFilter = filter === 'all' || listing.status === filter;
    const matchesSearch = search === '' || 
      listing.title.includes(search) ||
      listing.type.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'نشط': return 'active';
      case 'معلق': return 'pending';
      case 'منتهي': return 'expired';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'نشط': return <CheckCircle className="w-4 h-4" />;
      case 'معلق': return <Clock className="w-4 h-4" />;
      case 'منتهي': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="listings-container">
      <div className="listings-header">
        <h1>إعلانات النفايات الخاصة بي</h1>
        <p>إدارة وتتبع إعلانات النفايات الصناعية الخاصة بمصنعك</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>إجمالي الإعلانات</p>
              <div className="stat-number">{listings.length}</div>
            </div>
            <div className="stat-icon">
              <Package />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>إعلانات نشطة</p>
              <div className="stat-number emerald">
                {listings.filter(l => l.status === 'نشط').length}
              </div>
            </div>
            <div className="stat-icon">
              <CheckCircle />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>إجمالي العروض</p>
              <div className="stat-number blue">
                {listings.reduce((sum, l) => sum + l.offers, 0)}
              </div>
            </div>
            <div className="stat-icon blue">
              <DollarSign />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>إجمالي المشاهدات</p>
              <div className="stat-number purple">
                {listings.reduce((sum, l) => sum + l.views, 0)}
              </div>
            </div>
            <div className="stat-icon purple">
              <Eye />
            </div>
          </div>
        </div>
      </div>

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
            <Plus />
            إضافة إعلان جديد
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="listings-table">
          <thead>
            <tr>
              <th>الإعلان</th>
              <th>النوع</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>المكان</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((listing) => (
              <tr key={listing.id}>
                <td>
                  <div>
                    <div className="title-details">{listing.title}</div>
                    <div className="date-details">
                      <Calendar />
                      <span>{listing.date}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="product-cell">
                    <Trash2 />
                    <span>{listing.type}</span>
                  </div>
                </td>
                <td>
                  <div className="amount-main">
                    {listing.amount} {listing.unit}
                  </div>
                  <div className="frequency-tag">{listing.frequency}</div>
                </td>
                <td>
                  <div className="product-cell">
                    <DollarSign />
                    <span>{listing.price} {listing.currency}</span>
                  </div>
                </td>
                <td>
                  <div className="product-cell">
                    <MapPin />
                    <span>{listing.location}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(listing.status)}`}>
                    {getStatusIcon(listing.status)}
                    {listing.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/waste-details/${listing.id}`}
                      className="action-btn view"
                      title="عرض التفاصيل"
                    >
                      <Eye />
                    </Link>
                    <button
                      className="action-btn edit"
                      title="تعديل"
                    >
                      <Edit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredListings.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-content">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 8 L16 16 M16 8 L8 16" />
              </svg>
              <p>لا توجد إعلانات مطابقة لبحثك</p>
            </div>
          </div>
        )}
      </div>

      <div className="performance-card">
        <h3>إحصائيات الأداء</h3>
        <div className="performance-grid">
          <div className="performance-item">
            <p>متوسط المشاهدات لكل إعلان</p>
            <div className="performance-number">
              {Math.round(listings.reduce((sum, l) => sum + l.views, 0) / listings.length)}
            </div>
          </div>
          <div className="performance-item">
            <p>متوسط العروض لكل إعلان</p>
            <div className="performance-number">
              {(listings.reduce((sum, l) => sum + l.offers, 0) / listings.length).toFixed(1)}
            </div>
          </div>
          <div className="performance-item">
            <p>معدل التفاعل</p>
            <div className="performance-number emerald">78%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyListings;