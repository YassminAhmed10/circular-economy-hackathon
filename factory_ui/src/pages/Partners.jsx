import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Phone, Mail, Globe, Building2, Recycle, Package, Users, CheckCircle } from 'lucide-react';
import './Partners.css';

function Partners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const partnerTypes = [
    { id: 'all', label: 'جميع الأنواع', icon: Building2 },
    { id: 'recycling', label: 'مصانع إعادة التدوير', icon: Recycle },
    { id: 'collection', label: 'شركات التجميع', icon: Package },
    { id: 'logistics', label: 'خدمات النقل', icon: '🚚' },
    { id: 'technology', label: 'تكنولوجيا النفايات', icon: '💻' },
    { id: 'consulting', label: 'الاستشارات', icon: Users }
  ];

  const locations = [
    'جميع المحافظات',
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'القليوبية',
    'بور سعيد',
    'السويس',
    'الدقهلية',
    'الشرقية',
    'الغربية'
  ];

  const partners = [
    {
      id: 1,
      name: 'مصنع إعادة التدوير المتقدم',
      type: 'recycling',
      description: 'متخصصون في إعادة تدوير البلاستيك والورق بجودة عالية',
      location: 'القاهرة',
      rating: 4.8,
      reviews: 124,
      phone: '+20 123 456 7890',
      email: 'contact@advanced-recycling.com',
      website: 'www.advanced-recycling.com',
      specialties: ['بلاستيك', 'ورق', 'معادن'],
      verified: true,
      logo: 'https://ui-avatars.com/api/?name=مصنع+إعادة+التدوير&background=10b981&color=fff&size=200'
    },
    {
      id: 2,
      name: 'الشركة الخضراء للتجميع',
      type: 'collection',
      description: 'خدمات تجميع النفايات الصناعية من المصانع',
      location: 'الجيزة',
      rating: 4.5,
      reviews: 89,
      phone: '+20 987 654 3210',
      email: 'info@green-collection.com',
      website: 'www.green-collection.com',
      specialties: ['تجميع', 'فرز', 'نقل'],
      verified: true,
      logo: 'https://ui-avatars.com/api/?name=الشركة+الخضراء&background=3b82f6&color=fff&size=200'
    },
    {
      id: 3,
      name: 'نقليات إيكو',
      type: 'logistics',
      description: 'نقل وتوصيل النفايات الصناعية بأمان وكفاءة',
      location: 'الإسكندرية',
      rating: 4.7,
      reviews: 156,
      phone: '+20 555 444 3333',
      email: 'transport@eco-logistics.com',
      website: 'www.eco-logistics.com',
      specialties: ['نقل', 'تخزين', 'لوجستيات'],
      verified: true,
      logo: 'https://ui-avatars.com/api/?name=نقليات+إيكو&background=8b5cf6&color=fff&size=200'
    },
    {
      id: 4,
      name: 'تكنو-واست',
      type: 'technology',
      description: 'تقنيات متطورة لمعالجة وإدارة النفايات',
      location: 'القاهرة',
      rating: 4.9,
      reviews: 67,
      phone: '+20 111 222 3333',
      email: 'tech@techno-waste.com',
      website: 'www.techno-waste.com',
      specialties: ['تكنولوجيا', 'تحليل', 'مراقبة'],
      verified: true,
      logo: 'https://ui-avatars.com/api/?name=تكنو+واست&background=f59e0b&color=fff&size=200'
    },
    {
      id: 5,
      name: 'مصنع المعادن الثانوية',
      type: 'recycling',
      description: 'إعادة تدوير المعادن بأنواعها المختلفة',
      location: 'بور سعيد',
      rating: 4.6,
      reviews: 92,
      phone: '+20 222 333 4444',
      email: 'metals@secondary-metals.com',
      website: 'www.secondary-metals.com',
      specialties: ['معادن', 'نحاس', 'ألومنيوم'],
      verified: false,
      logo: 'https://ui-avatars.com/api/?name=مصنع+المعادن&background=64748b&color=fff&size=200'
    },
    {
      id: 6,
      name: 'استشارات البيئة المستدامة',
      type: 'consulting',
      description: 'استشارات في مجال إدارة النفايات والاقتصاد الدائري',
      location: 'القاهرة',
      rating: 4.8,
      reviews: 45,
      phone: '+20 777 888 9999',
      email: 'consulting@sustainable-env.com',
      website: 'www.sustainable-env.com',
      specialties: ['استشارات', 'تدريب', 'شهادات'],
      verified: true,
      logo: 'https://ui-avatars.com/api/?name=استشارات+البيئة&background=10b981&color=fff&size=200'
    }
  ];

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = searchTerm === '' ||
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || partner.type === selectedType;
    const matchesLocation = selectedLocation === 'جميع المحافظات' || partner.location === selectedLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="partners-container">
      {/* Header */}
      <div className="partners-header">
        <h1>شبكة الشركاء</h1>
        <p>تواصل مع شركات إعادة التدوير والخدمات المتخصصة</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>إجمالي الشركاء</p>
              <div className="stat-number">{partners.length}</div>
            </div>
            <div className="stat-icon">
              <Users />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>شركاء معتمدون</p>
              <div className="stat-number emerald">
                {partners.filter(p => p.verified).length}
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
              <p>متوسط التقييم</p>
              <div className="stat-number amber">
                {(partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1)}
              </div>
            </div>
            <div className="stat-icon amber">
              <Star />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filter-section">
        <div className="search-row">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="ابحث عن شركاء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <div className="select-wrapper">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="select-input"
              >
                {partnerTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
              <Filter className="select-icon" />
            </div>

            <div className="select-wrapper">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="select-input"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <MapPin className="select-icon" />
            </div>
          </div>
        </div>

        {/* Partner Type Buttons */}
        <div className="type-filters">
          {partnerTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`type-btn ${selectedType === type.id ? 'active' : ''}`}
            >
              {type.icon === '🚚' || type.icon === '💻' ? (
                <span>{type.icon}</span>
              ) : (
                <type.icon />
              )}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      <div className="partners-grid">
        {filteredPartners.map(partner => (
          <div key={partner.id} className="partner-card">
            <div className="partner-content">
              {/* Header */}
              <div className="partner-header">
                <div className="partner-profile">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="partner-logo"
                  />
                  <div>
                    <div className="partner-name-wrapper">
                      <span className="partner-name">{partner.name}</span>
                      {partner.verified && (
                        <CheckCircle className="verified-badge" />
                      )}
                    </div>
                    <div className="partner-location">
                      <MapPin />
                      <span>{partner.location}</span>
                    </div>
                  </div>
                </div>
                <div className="partner-rating">
                  <Star />
                  <span>{partner.rating}</span>
                  <span className="rating-count">({partner.reviews})</span>
                </div>
              </div>

              {/* Description */}
              <p className="partner-description">{partner.description}</p>

              {/* Specialties */}
              <div className="partner-specialties">
                {partner.specialties.map(specialty => (
                  <span key={specialty} className="specialty-tag">
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Contact Info */}
              <div className="contact-info">
                <div className="contact-item">
                  <Phone />
                  <span>{partner.phone}</span>
                </div>
                <div className="contact-item">
                  <Mail />
                  <span>{partner.email}</span>
                </div>
                <div className="contact-item">
                  <Globe />
                  <span>{partner.website}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="partner-actions">
                <button className="btn-primary">تواصل الآن</button>
                <button className="btn-secondary">عرض الملف</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPartners.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <Search />
          </div>
          <h3>لا توجد نتائج</h3>
          <p>جرب البحث باستخدام مصطلحات مختلفة أو تغيير الفلاتر</p>
        </div>
      )}

      {/* Become a Partner Section */}
      <div className="become-partner">
        <div className="partner-cta">
          <div className="cta-content">
            <h3>كن شريكاً معنا</h3>
            <p>
              انضم إلى شبكتنا من الشركاء المتميزين ووسع فرص أعمالك في مجال الاقتصاد الدائري
            </p>
            <div className="cta-features">
              <div className="feature-item">
                <CheckCircle />
                <span>وصول إلى آلاف المصانع</span>
              </div>
              <div className="feature-item">
                <CheckCircle />
                <span>علامة تجارية معتمدة</span>
              </div>
              <div className="feature-item">
                <CheckCircle />
                <span>دعم فني ومتابعة مستمرة</span>
              </div>
            </div>
          </div>
          <button className="cta-button">سجل كشريك</button>
        </div>
      </div>
    </div>
  );
}

export default Partners;