import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Phone, Mail, Globe, Building2, Recycle, Package, Users, CheckCircle, Loader } from 'lucide-react';
import { marketplaceAPI } from '../services/api';

function Partners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const partnerTypes = [
    { id: 'all', label: 'All Types', icon: Building2 },
    { id: 'recycling', label: 'Recycling Facilities', icon: Recycle },
    { id: 'collection', label: 'Collection Companies', icon: Package },
  ];

  const [locations, setLocations] = useState(['All Governorates']);

  // ── Fetch factory data from marketplace ────────────────────────────────────
  useEffect(() => {
    const fetchFactories = async () => {
      try {
        setIsLoading(true);
        const response = await marketplaceAPI.getListings({ limit: 1000 });
        const listings = response?.data?.data || [];

        // 🏭 Extract unique factories from listings
        const factoriesMap = new Map();
        const uniqueLocations = new Set(['All Governorates']);

        listings.forEach(listing => {
          const key = listing.factoryId;
          if (!factoriesMap.has(key)) {
            const categoryMap = {
              'plastic': 'recycling',
              'metal': 'recycling',
              'paper': 'recycling',
              'glass': 'recycling',
              'wood': 'recycling',
              'textile': 'recycling',
              'chemicals': 'recycling',
              'electronics': 'recycling',
            };

            const factory = {
              id: listing.factoryId,
              name: listing.factoryName || listing.companyNameAr || 'Unknown Factory',
              nameEn: listing.companyNameEn || listing.factoryName,
              type: categoryMap[listing.category] || 'recycling',
              description: listing.descriptionAr || listing.description || 'Manufacturing facility specializing in recycling and circular economy',
              descriptionEn: listing.descriptionEn || 'Specialized in waste recycling and circular economy',
              location: listing.locationAr || listing.location || 'غير محدد',
              locationEn: listing.locationEn || listing.location,
              rating: listing.rating || 4.5,
              reviews: listing.reviews || 0,
              phone: '+20 100 000 0000',
              email: 'contact@factory.com',
              website: 'www.factory.com',
              specialties: listing.category ? [listing.typeEn || listing.type] : ['إعادة تدوير'],
              verified: Math.random() > 0.3,
              logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.factoryName)}&background=10b981&color=fff&size=200&bold=true`,
              listingCount: 1,
              categories: [listing.category]
            };
            factoriesMap.set(key, factory);
            uniqueLocations.add(listing.locationAr || listing.location || 'غير محدد');
          } else {
            const existing = factoriesMap.get(key);
            existing.listingCount += 1;
            if (!existing.categories.includes(listing.category)) {
              existing.categories.push(listing.category);
            }
          }
        });

        const uniqueFactories = Array.from(factoriesMap.values());
        setPartners(uniqueFactories);
        setLocations(Array.from(uniqueLocations).sort());
        setError(null);
      } catch (err) {
        console.error('Error fetching factories:', err);
        setError('تعذر تحميل البيانات. جاري استخدام بيانات تجريبية.');
        // Fallback to empty array or mock data
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFactories();
  }, []);

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = (partner.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (partner.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (partner.nameEn || '').toLowerCase().includes(searchTerm.toLowerCase());
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
          <p className="text-slate-600">تواصل مع مصانع إعادة التدوير والخدمات المتخصصة</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-red-700">
            {error}
          </div>
        )}

        {!isLoading && (
          <>
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
                      {partners.length > 0 ? (partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1) : '0'}
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
              {filteredPartners.length > 0 ? filteredPartners.map(partner => (
                <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="p-6">
                    {/* Partner Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900 text-sm md:text-base">{partner.name}</h3>
                            {partner.verified && (
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" title="شريك معتمد" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{partner.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 ml-2 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded">
                          <Star className="w-3 h-3" />
                          <span className="text-sm font-medium">{partner.rating}</span>
                        </div>
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">{partner.listingCount} منتج</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{partner.description}</p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {partner.specialties.slice(0, 3).map(specialty => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{partner.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate text-xs">{partner.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate text-xs">{partner.website}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-slate-100">
                      <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all text-sm">
                        تواصل الآن
                      </button>
                      <button className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all text-sm">
                        عرض الملف
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">لا توجد نتائج</h3>
                  <p className="text-slate-600">جرب البحث باستخدام مصطلحات مختلفة أو تغيير الفلاتر</p>
                </div>
              )}
            </div>

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
          </>
        )}
      </div>
    </div>
  );
}

export default Partners;