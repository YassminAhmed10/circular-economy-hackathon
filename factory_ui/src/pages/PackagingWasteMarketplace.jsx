import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, DollarSign, MapPin, Calendar, Star, Search, Filter, ChevronRight
} from 'lucide-react';
import '../styles/PackagingWasteMarketplace.css';

const API_BASE_URL = 'https://localhost:54464/api';

const UI = {
  ar: {
    pageTitle: 'سوق التغليف المستدام',
    pageSubtitle: 'اكتشف مواد تغليف مستدامة عالية الجودة',
    addListing: 'إضافة إعلان جديد',
    search: 'ابحث عن التغليف',
    filterBy: 'تصفية حسب',
    contamination: 'مستوى التلوث',
    foodContact: 'تلامس غذائي',
    priceRange: 'نطاق السعر',
    location: 'الموقع',
    noListings: 'لا توجد إعلانات متاحة',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ أثناء جلب البيانات',
    viewDetails: 'عرض التفاصيل',
    expiresAt: 'ينتهي في',
    peakPrice: 'السعر',
    unit: 'لكل'
  },
  en: {
    pageTitle: 'Sustainable Packaging Marketplace',
    pageSubtitle: 'Discover high-quality sustainable packaging materials',
    addListing: 'Add New Listing',
    search: 'Search for packaging',
    filterBy: 'Filter By',
    contamination: 'Contamination Level',
    foodContact: 'Food Contact Suitable',
    priceRange: 'Price Range',
    location: 'Location',
    noListings: 'No listings available',
    loading: 'Loading...',
    error: 'Error loading listings',
    viewDetails: 'View Details',
    expiresAt: 'Expires in',
    peakPrice: 'Price',
    unit: 'per'
  }
};

const ContaminationLevelBadge = ({ level, lang }) => {
  const colors = {
    none: { bg: '#dcfce7', text: '#166534' },
    low: { bg: '#dbeafe', text: '#1e40af' },
    medium: { bg: '#fed7aa', text: '#92400e' },
    high: { bg: '#fee2e2', text: '#991b1b' }
  };

  const labels = {
    ar: { none: 'بلا تلوث', low: 'منخفض', medium: 'متوسط', high: 'عالي' },
    en: { none: 'No Contamination', low: 'Low', medium: 'Medium', high: 'High' }
  };

  const color = colors[level] || colors.low;
  const label = labels[lang][level] || level;

  return (
    <span style={{
      background: color.bg,
      color: color.text,
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '0.85rem',
      fontWeight: '600'
    }}>
      {label}
    </span>
  );
};

export default function PackagingWasteMarketplace({ user, lang = 'ar', dark = false }) {
  const navigate = useNavigate();
  const t = UI[lang] || UI.ar;
  const isArabic = lang === 'ar';

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    contaminationLevel: '',
    foodContact: false,
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, searchTerm, filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/packaging-waste/listings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setListings(data.data || []);
      } else {
        setError(data.message || t.error);
      }
    } catch (err) {
      setError(err.message);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = listings.filter(listing => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matches =
          listing.packagingWasteSubtype?.toLowerCase().includes(term) ||
          listing.description?.toLowerCase().includes(term) ||
          listing.descriptionAr?.toLowerCase().includes(term);
        if (!matches) return false;
      }

      // Contamination level filter
      if (filters.contaminationLevel && listing.contaminationLevel !== filters.contaminationLevel) {
        return false;
      }

      // Food contact filter
      if (filters.foodContact && !listing.foodContactSuitability) {
        return false;
      }

      // Price range filter
      if (filters.minPrice && listing.price < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && listing.price > parseFloat(filters.maxPrice)) {
        return false;
      }

      // Location filter
      if (filters.location) {
        const matches =
          listing.locationNameEn?.toLowerCase().includes(filters.location.toLowerCase()) ||
          listing.locationNameAr?.toLowerCase().includes(filters.location.toLowerCase());
        if (!matches) return false;
      }

      return true;
    });

    setFilteredListings(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      contaminationLevel: '',
      foodContact: false,
      minPrice: '',
      maxPrice: '',
      location: ''
    });
  };

  return (
    <div className={`packaging-marketplace-container ${dark ? 'dark' : ''}`}>
      <div className="page-header">
        <h1>{t.pageTitle}</h1>
        <p>{t.pageSubtitle}</p>
        {user && (
          <button
            onClick={() => navigate('/packaging-waste')}
            className="btn-add-listing"
          >
            <Package size={18} />
            {t.addListing}
          </button>
        )}
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="marketplace-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <Filter size={20} />
            <h3>{t.filterBy}</h3>
          </div>

          <div className="filter-section">
            <label htmlFor="search">{t.search}</label>
            <input
              id="search"
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="filter-section">
            <label>{t.contamination}</label>
            <select
              name="contaminationLevel"
              value={filters.contaminationLevel}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">كل المستويات</option>
              <option value="none">بلا تلوث</option>
              <option value="low">منخفض</option>
              <option value="medium">متوسط</option>
              <option value="high">عالي</option>
            </select>
          </div>

          <div className="filter-section">
            <label>
              <input
                type="checkbox"
                name="foodContact"
                checked={filters.foodContact}
                onChange={handleFilterChange}
              />
              {t.foodContact}
            </label>
          </div>

          <div className="filter-section">
            <label>{t.priceRange}</label>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="input-field"
                min="0"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="input-field"
                min="0"
              />
            </div>
          </div>

          <div className="filter-section">
            <label>{t.location}</label>
            <input
              type="text"
              name="location"
              placeholder={t.location}
              value={filters.location}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>

          <button onClick={resetFilters} className="btn-reset">
            إعادة تعيين
          </button>
        </aside>

        {/* Main Content */}
        <main className="listings-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>{t.loading}</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <h3>{t.noListings}</h3>
              <p>{lang === 'ar' ? 'لا توجد إعلانات تطابق معايير البحث' : 'No listings match your search criteria'}</p>
            </div>
          ) : (
            <div className="listings-grid">
              {filteredListings.map(listing => (
                <div key={listing.id} className="listing-card">
                  {listing.imageUrl && (
                    <div className="listing-image">
                      <img src={listing.imageUrl} alt={listing.packagingWasteSubtype} />
                    </div>
                  )}

                  <div className="listing-content">
                    <h3>{listing.packagingWasteSubtype}</h3>

                    <div className="listing-meta">
                      <ContaminationLevelBadge
                        level={listing.contaminationLevel}
                        lang={lang}
                      />
                      {listing.foodContactSuitability && (
                        <span className="food-contact-badge">
                          {lang === 'ar' ? 'غذائي' : 'Food Contact'}
                        </span>
                      )}
                    </div>

                    <p className="description">
                      {isArabic ? listing.descriptionAr : listing.description}
                    </p>

                    <div className="listing-details">
                      <div className="detail-item">
                        <span className="label">{t.peakPrice}</span>
                        <span className="value">${listing.price}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">{t.unit}</span>
                        <span className="value">{listing.unit}</span>
                      </div>
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>{listing.locationNameEn}</span>
                      </div>
                    </div>

                    <div className="listing-footer">
                      <div className="amount">
                        <span>{listing.amount} {listing.unit}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/waste-details/${listing.id}`)}
                        className="btn-details"
                      >
                        {t.viewDetails}
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
