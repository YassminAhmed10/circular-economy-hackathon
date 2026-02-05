import { useState } from 'react'
import { Eye, ShoppingCart, TrendingUp, Package, MapPin, Factory, MessageSquare, BarChart, Recycle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({ user }) {
  const navigate = useNavigate()

  // بيانات المخلفات المتاحة في السوق
  const wasteItems = [
    {
      id: 1,
      type: 'بلاستيك PET',
      amount: 500,
      unit: 'كجم',
      price: 3500,
      factory: 'مصنع النور للمياه',
      location: 'القاهرة',
      description: 'قوارير بلاستيك نظيفة ومضغوطة',
      category: 'plastic',
      image: 'https://images.unsplash.com/photo-1607874133445-c2f17c81880f?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      type: 'زيوت طعام مستعملة',
      amount: 200,
      unit: 'لتر',
      price: 4000,
      factory: 'مطعم الأمل',
      location: 'الجيزة',
      description: 'زيوت طعام من المطبخ، مصفاة',
      category: 'oil',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      type: 'ورق وكرتون',
      amount: 1000,
      unit: 'كجم',
      price: 2000,
      factory: 'مصنع التعبئة والتغليف',
      location: 'الإسكندرية',
      description: 'كراتين مستعملة بحالة جيدة',
      category: 'paper',
      image: 'https://images.unsplash.com/photo-1594563703937-fdc149c3a215?w=400&h=300&fit=crop'
    }
  ]

  // Recent transactions
  const recentTransactions = [
    { type: 'بلاستيك PET', amount: '500 كجم', price: '3,500 ج', date: '2026/02/01', status: 'مكتملة' },
    { type: 'زيوت طعام', amount: '200 لتر', price: '4,000 ج', date: '2026/01/28', status: 'قيد المراجعة' },
    { type: 'ورق وكرتون', amount: '1000 كجم', price: '2,000 ج', date: '2026/01/25', status: 'مكتملة' },
  ]

  // My listings
  const myListings = [
    { title: 'بلاستيك PET', status: 'نشط', views: 145, offers: 5, price: '3,500 ج' },
    { title: 'زيوت طعام', status: 'معلق', views: 89, offers: 2, price: '4,000 ج' },
    { title: 'ورق مكتبي', status: 'نشط', views: 210, offers: 8, price: '2,000 ج' },
  ]

  // Partners
  const partners = [
    { name: 'مصنع إعادة التدوير المتقدم', location: 'القاهرة', specialty: 'بلاستيك وورق', rating: 4.8 },
    { name: 'الشركة الخضراء للتجميع', location: 'الجيزة', specialty: 'تجميع وفرز', rating: 4.5 },
    { name: 'مصنع المعادن الثانوية', location: 'الإسكندرية', specialty: 'معادن', rating: 4.6 },
  ]

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* محتوى لوحة التحكم */}
      <div className="pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">مرحباً بك في ECOv</h2>
              <p className="text-emerald-100 text-lg">منصة الاقتصاد الدائري للمصانع</p>
            </div>
            <div className="text-center md:text-right">
              <div className="text-2xl font-bold">{user?.name || 'مصنع الأمل للصناعات الغذائية'}</div>
              <div className="text-emerald-100">آخر تحديث: اليوم الساعة 10:30 ص</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">إجمالي النفايات</p>
                <p className="text-2xl font-bold text-slate-900">145 طن</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">المشاهدات</p>
                <p className="text-2xl font-bold text-slate-900">2,300</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">الطلبات النشطة</p>
                <p className="text-2xl font-bold text-slate-900">18</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-1">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-slate-900">24,500 ج</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">آخر العمليات</h3>
            <button 
              onClick={() => navigate('/orders')}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              عرض الكل →
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div>
                  <div className="font-medium text-slate-900">{transaction.type}</div>
                  <div className="text-sm text-slate-600">{transaction.amount} • {transaction.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{transaction.price}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'مكتملة' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Market Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">نظرة على السوق</h3>
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-slate-600 mb-4">تصفح أحدث عروض النفايات المتاحة</p>
            <button 
              onClick={() => navigate('/marketplace')}
              className="w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-all font-medium"
            >
              زيارة السوق
            </button>
          </div>

          {/* Add Waste */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">إضافة نفايات</h3>
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-slate-600 mb-4">بيع نفايات مصنعك في السوق</p>
            <button 
              onClick={() => navigate('/list-waste')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all font-medium"
            >
              إضافة نفايات جديدة
            </button>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">التحليلات</h3>
              <BarChart className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-slate-600 mb-4">تحليل أداء مصنعك وإحصاءات المبيعات</p>
            <button 
              onClick={() => navigate('/analytics')}
              className="w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-all font-medium"
            >
              عرض التحليلات
            </button>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">أحدث إعلاناتي</h3>
            <button 
              onClick={() => navigate('/my-listings')}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              عرض الكل →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myListings.map((listing, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-900">{listing.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    listing.status === 'نشط' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {listing.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">المشاهدات:</span>
                    <span className="font-medium">{listing.views}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">العروض:</span>
                    <span className="font-medium">{listing.offers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">السعر:</span>
                    <span className="font-bold text-emerald-600">{listing.price}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/waste-details/${index + 1}`)}
                  className="w-full py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all text-sm"
                >
                  عرض التفاصيل
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard