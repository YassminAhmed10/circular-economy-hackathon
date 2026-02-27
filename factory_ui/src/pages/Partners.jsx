import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Phone, Mail, Globe, Building2, Recycle, Package, Users, CheckCircle } from 'lucide-react';

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
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || partner.type === selectedType;
    const matchesLocation = selectedLocation === 'جميع المحافظات' || partner.location === selectedLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const getPartnerTypeLabel = (typeId) => {
    return partnerTypes.find(type => type.id === typeId)?.label || typeId;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">شبكة الشركاء</h1>
          <p className="text-slate-600">تواصل مع شركات إعادة التدوير والخدمات المتخصصة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">إجمالي الشركاء</p>
                <p className="text-2xl font-bold text-slate-900">{partners.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">شركاء معتمدون</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {partners.filter(p => p.verified).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">متوسط التقييم</p>
                <p className="text-2xl font-bold text-amber-600">
                  {(partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-auto md:flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن شركاء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none w-full md:w-48 pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                >
                  {partnerTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative flex-1 md:flex-none">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none w-full md:w-48 pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Partner Type Filters */}
          <div className="flex flex-wrap gap-2">
            {partnerTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedType === type.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type.icon === '🚚' || type.icon === '💻' ? (
                  <span>{type.icon}</span>
                ) : (
                  <type.icon className="w-4 h-4" />
                )}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map(partner => (
            <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
              <div className="p-6">
                {/* Partner Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{partner.name}</h3>
                        {partner.verified && (
                          <CheckCircle className="w-4 h-4 text-emerald-600" title="شريك معتمد" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="text-sm text-slate-600">{partner.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded">
                    <Star className="w-3 h-3" />
                    <span className="text-sm font-medium">{partner.rating}</span>
                    <span className="text-xs">({partner.reviews})</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 mb-4 line-clamp-2">{partner.description}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {partner.specialties.map(specialty => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{partner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{partner.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="truncate">{partner.website}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                  <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all">
                    تواصل الآن
                  </button>
                  <button className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all">
                    عرض الملف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">لا توجد نتائج</h3>
            <p className="text-slate-600">جرب البحث باستخدام مصطلحات مختلفة أو تغيير الفلاتر</p>
          </div>
        )}

        {/* Become a Partner Section */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">كن شريكاً معنا</h3>
              <p className="text-emerald-100 mb-4">
                انضم إلى شبكتنا من الشركاء المتميزين ووسع فرص أعمالك في مجال الاقتصاد الدائري
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>وصول إلى آلاف المصانع</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>علامة تجارية معتمدة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>دعم فني ومتابعة مستمرة</span>
                </div>
              </div>
            </div>
            <button className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-all whitespace-nowrap">
              سجل كشريك
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Partners;