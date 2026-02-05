import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Trash2, Calendar, DollarSign, MapPin, CheckCircle, Clock, AlertCircle, Edit, Eye, Search, Filter, ChevronDown, Plus } from 'lucide-react';

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
      listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'نشط': return 'bg-emerald-100 text-emerald-800';
      case 'معلق': return 'bg-amber-100 text-amber-800';
      case 'منتهي': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">إعلانات النفايات الخاصة بي</h1>
          <p className="text-slate-600">إدارة وتتبع إعلانات النفايات الصناعية الخاصة بمصنعك</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">إجمالي الإعلانات</p>
                <p className="text-2xl font-bold text-slate-900">{listings.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">إعلانات نشطة</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {listings.filter(l => l.status === 'نشط').length}
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
                <p className="text-slate-600 text-sm mb-1">إجمالي العروض</p>
                <p className="text-2xl font-bold text-blue-600">
                  {listings.reduce((sum, listing) => sum + listing.offers, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-purple-600">
                  {listings.reduce((sum, listing) => sum + listing.views, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث في إعلاناتك..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-64 pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none w-40 pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="نشط">نشط</option>
                  <option value="معلق">معلق</option>
                  <option value="منتهي">منتهي</option>
                </select>
                <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <Link
              to="/list-waste"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة إعلان جديد
            </Link>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-right font-semibold text-slate-700">الإعلان</th>
                  <th className="py-4 px-6 text-right font-semibold text-slate-700">النوع</th>
                  <th className="py-4 px-6 text-right font-semibold text-slate-700">الكمية</th>
                  <th className="py-4 px-6 text-right font-semibold text-slate-700">السعر</th>
                  <th className="py-4 px-6 text-right font-semibold text-slate-700">المكان</th>
                  <th className="py-4 px-6 text-right font-semibold text-slate-700">الحالة</th>
                  <th className="py-4 px-6 text-right font-semibold text-slate-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-900">{listing.title}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          <Calendar className="w-3 h-3 inline ml-1" />
                          {listing.date}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Trash2 className="w-4 h-4 ml-2 text-slate-500" />
                        <span>{listing.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium">
                        {listing.amount} {listing.unit}
                      </span>
                      <p className="text-sm text-slate-500">{listing.frequency}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 ml-2 text-slate-500" />
                        <span className="font-medium">
                          {listing.price} {listing.currency}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 ml-2 text-slate-500" />
                        <span>{listing.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
                        {getStatusIcon(listing.status)}
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/waste-details/${listing.id}`}
                          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">لا توجد إعلانات مطابقة لبحثك</p>
            </div>
          )}
        </div>

        {/* Performance Stats */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">إحصائيات الأداء</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">متوسط المشاهدات لكل إعلان</p>
              <p className="text-2xl font-bold text-slate-900">
                {Math.round(listings.reduce((sum, l) => sum + l.views, 0) / listings.length)}
              </p>
            </div>
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">متوسط العروض لكل إعلان</p>
              <p className="text-2xl font-bold text-slate-900">
                {(listings.reduce((sum, l) => sum + l.offers, 0) / listings.length).toFixed(1)}
              </p>
            </div>
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">معدل التفاعل</p>
              <p className="text-2xl font-bold text-emerald-600">78%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyListings;