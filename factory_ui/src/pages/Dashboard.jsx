import { useState } from 'react'
import { Factory, Bell, User, ChevronDown, Eye, Trash2, ShoppingCart, TrendingUp, Cloud, Droplet, Search, Package, MapPin, Phone, Mail, ArrowLeft, Home, Filter, CheckCircle, Clock, XCircle, Map } from 'lucide-react'
import './Dashboard.css'
import logo from '../assets/logooo1ecov.png'

function Dashboard({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('marketplace')
  const [userRole, setUserRole] = useState('seller') // 'seller' or 'buyer'
  const [selectedFilters, setSelectedFilters] = useState({
    wasteType: [],
    minQuantity: 100,
    maxQuantity: 10000,
    location: ''
  })

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
      phone: '01234567890',
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
      phone: '01098765432',
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
      phone: '01156789012',
      description: 'كراتين مستعملة بحالة جيدة',
      category: 'paper',
      image: 'https://images.unsplash.com/photo-1594563703937-fdc149c3a215?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      type: 'معادن مختلطة',
      amount: 750,
      unit: 'كجم',
      price: 15000,
      factory: 'ورشة الحداد',
      location: 'القليوبية',
      phone: '01223456789',
      description: 'خردة حديد ونحاس',
      category: 'metal',
      image: 'https://images.unsplash.com/photo-1610701026203-6dc3f14e32bb?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      type: 'نفايات عضوية',
      amount: 300,
      unit: 'كجم',
      price: 1500,
      factory: 'مصنع الأغذية',
      location: 'بور سعيد',
      phone: '01187654321',
      description: 'بقايا طعام للأسمدة',
      category: 'organic',
      image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      type: 'زجاج شفاف',
      amount: 400,
      unit: 'كجم',
      price: 1200,
      factory: 'مصنع المشروبات',
      location: 'السويس',
      phone: '01098123456',
      description: 'زجاجات شفافة محطمة',
      category: 'glass',
      image: 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=400&h=300&fit=crop'
    }
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* <h2 className="text-3xl font-bold text-slate-900">لوحة التحكم</h2> */}
        <div className="flex gap-2">
          <button
            onClick={() => setUserRole('seller')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              userRole === 'seller'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border-2 border-slate-300'
            }`}
          >
            بائع
          </button>
          <button
            onClick={() => setUserRole('buyer')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              userRole === 'buyer'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border-2 border-slate-300'
            }`}
          >
            مشتري
          </button>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userRole === 'seller' ? (
          <>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <Factory className="w-8 h-8 mb-3" />
              <h3 className="text-3xl font-bold mb-1">145</h3>
              <p className="text-blue-100">إجمالي النفايات</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <Eye className="w-8 h-8 mb-3" />
              <h3 className="text-3xl font-bold mb-1">2,300</h3>
              <p className="text-purple-100">المشاهدات</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <ShoppingCart className="w-8 h-8 mb-3" />
              <h3 className="text-3xl font-bold mb-1">18</h3>
              <p className="text-emerald-100">الطلبات النشطة</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
              <TrendingUp className="w-8 h-8 mb-3" />
              <h3 className="text-3xl font-bold mb-1">24,500 ج</h3>
              <p className="text-amber-100">إجمالي الإيرادات</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <Package className="w-8 h-8 mb-3" />
              <h3 className="text-3xl font-bold mb-1">68</h3>
              <p className="text-blue-100">المشتريات</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <TrendingUp className="w-8 h-8 mb-3" />
              <h3 className="text-3xl font-bold mb-1">450,000 ج</h3>
              <p className="text-green-100">التوفير المالي</p>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
              <Cloud className="w-8 h-8 mb-3" />
              <h3 className="text-3xl font-bold mb-1">320 طن</h3>
              <p className="text-teal-100">الكربون الموفر</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
              <Droplet className="w-8 h-8 mb-3" />
              <h3 className="text-3xl font-bold mb-1">1.5M لتر</h3>
              <p className="text-cyan-100">المياه الموفرة</p>
            </div>
          </>
        )}
      </div>

      {/* جدول آخر العمليات */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">آخر العمليات</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-right py-3 px-4 text-slate-700">المنتج</th>
                <th className="text-right py-3 px-4 text-slate-700">الكمية</th>
                <th className="text-right py-3 px-4 text-slate-700">السعر</th>
                <th className="text-right py-3 px-4 text-slate-700">التاريخ</th>
                <th className="text-right py-3 px-4 text-slate-700">الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium">بلاستيك PET</td>
                <td className="py-3 px-4">500 كجم</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">3,500 ج</td>
                <td className="py-3 px-4 text-slate-600">2026/02/01</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                    <CheckCircle className="w-4 h-4" />
                    مكتملة
                  </span>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium">زيوت طعام</td>
                <td className="py-3 px-4">200 لتر</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">4,000 ج</td>
                <td className="py-3 px-4 text-slate-600">2026/01/28</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                    <Clock className="w-4 h-4" />
                    قيد المراجعة
                  </span>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium">ورق وكرتون</td>
                <td className="py-3 px-4">1000 كجم</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">2,000 ج</td>
                <td className="py-3 px-4 text-slate-600">2026/01/25</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                    <CheckCircle className="w-4 h-4" />
                    مكتملة
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderMarketplace = () => (
    <div className="flex gap-6">
      {/* Advanced Filters Sidebar */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
          <h3 className="text-xl font-bold text-slate-900 mb-6">الفلاتر المتقدمة</h3>
          
          {/* Waste Type Filter */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center justify-between cursor-pointer">
              نوع المخلفات
              <ChevronDown className="w-5 h-5" />
            </h4>
            <div className="space-y-2">
              {['بلاستيك', 'معادن', 'ورق', 'زجاج', 'عضوي'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                  <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" />
                  <span className="text-slate-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity Range */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center justify-between cursor-pointer">
              الكمية
              <ChevronDown className="w-5 h-5" />
            </h4>
            <div className="space-y-3">
              <div className="text-sm text-slate-600 mb-2">النطاق</div>
              <input type="range" min="100" max="10000" className="w-full" />
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" defaultValue="100" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                <span className="text-slate-500">-</span>
                <input type="number" placeholder="Max" defaultValue="10000" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div className="text-xs text-slate-500">100 kg - 10000 kg</div>
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center justify-between cursor-pointer">
              الموقع
              <ChevronDown className="w-5 h-5" />
            </h4>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-700">
                <option>المحافظة</option>
                <option>القاهرة، الجيزة، الإسكندرية</option>
              </select>
              <div className="text-sm text-slate-600 mb-2">المنطقة</div>
              <input type="text" placeholder="Search..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
          </div>

          {/* Apply Filters Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all">
            تطبيق الفلاتر
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Header with Sort and Map View */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">سوق المخلفات الصناعية</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">ترتيب حسب:</span>
              <select className="px-4 py-2 border-2 border-slate-300 rounded-lg font-semibold">
                <option>الأحدث</option>
                <option>السعر: من الأقل للأعلى</option>
                <option>السعر: من الأعلى للأقل</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <Map className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-700">عرض الخريطة</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {wasteItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-slate-200">
              <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200">
                <img 
                  src={item.image} 
                  alt={item.type}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.type}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">الكمية:</span>
                    <span className="font-bold text-slate-900">{item.amount} {item.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">الموقع:</span>
                    <span className="font-semibold text-slate-900">{item.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">السعر:</span>
                    <span className="font-bold text-emerald-600 text-lg">{item.price.toLocaleString()} جنيه/طن</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="text-slate-600">المصنع:</span>
                    <span className="font-semibold text-slate-900">{item.factory}</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all">
                      <button
                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 mb-4"
                      >
                        <Package className="w-5 h-5" />
                        إضافة منتج
                      </button>
                  طلب عرض سعر
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50" dir="rtl">
      {/* Navigation */}
      <nav className="bg-black shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <div>
                  <img src={logo} alt="ECOv Logo" className="h-14 w-auto object-contain" />
                </div>
                <div>
                </div>
              </div>

              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`font-semibold px-4 py-2.5 rounded-xl transition-all ${
                    activeSection === 'dashboard'
                      ? 'bg-white/20 text-white border-2 border-white/30 backdrop-blur-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  اللوحة الرئيسية
                </button>
                <button
                  onClick={() => setActiveSection('marketplace')}
                  className={`font-semibold px-4 py-2.5 rounded-xl transition-all ${
                    activeSection === 'marketplace'
                      ? 'bg-white/20 text-white border-2 border-white/30 backdrop-blur-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  السوق
                </button>
                <button className="font-semibold px-4 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all">
                  التقارير
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate?.('home')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border-2 border-white/30 backdrop-blur-sm flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                <span className="hidden md:inline">الرئيسية</span>
              </button>
              <button className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-xl cursor-pointer transition-all backdrop-blur-sm">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-sm font-semibold text-white">مدير المصنع</div>
                  <div className="text-xs text-emerald-100">السويدي إلكتريك</div>
                </div>
                <ChevronDown className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'marketplace' && renderMarketplace()}
      </div>
    </div>
  )
}

export default Dashboard
