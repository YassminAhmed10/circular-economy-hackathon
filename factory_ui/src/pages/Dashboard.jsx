import { useState } from 'react'
import { TrendingUp, Package, DollarSign, AlertCircle, Plus, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({ user }) {
  const navigate = useNavigate()

  // الإحصائيات الرئيسية
  const stats = [
    { 
      label: 'إجمالي المبيعات',
      value: '87,240 ج',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald'
    },
    { 
      label: 'المخلفات المتاحة',
      value: '2.4 طن',
      change: '-8%',
      trend: 'down',
      icon: Package,
      color: 'blue'
    },
    { 
      label: 'الطلبات النشطة',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: Clock,
      color: 'amber'
    }
  ]

  // العمليات الأخيرة
  const recentActivity = [
    { 
      id: 1,
      title: 'بيع بلاستيك PET',
      buyer: 'مصنع إعادة التدوير الأخضر',
      amount: '500 كجم',
      price: '3,500 ج',
      time: 'منذ ساعتين',
      status: 'completed'
    },
    { 
      id: 2,
      title: 'طلب شراء زيوت مستعملة',
      buyer: 'شركة الطاقة المتجددة',
      amount: '200 لتر',
      price: '4,000 ج',
      time: 'منذ 5 ساعات',
      status: 'pending'
    },
    { 
      id: 3,
      title: 'بيع كرتون',
      buyer: 'مصنع الورق المتحد',
      amount: '1 طن',
      price: '2,000 ج',
      time: 'أمس',
      status: 'completed'
    }
  ]

  return (
    <div className="dashboard-container" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            مرحباً، {user?.name || 'أحمد محمد'} 👋
          </h1>
          <p className="text-slate-600">إليك نظرة سريعة على نشاط مصنعك اليوم</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                    <ArrowUpRight className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-90' : ''}`} />
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">النشاط الأخير</h2>
              <button 
                onClick={() => navigate('/transactions')}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
              >
                عرض الكل
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all border border-slate-100">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.status === 'completed' ? 'bg-emerald-100' : 'bg-amber-100'
                  }`}>
                    {activity.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-slate-900">{activity.title}</h3>
                      <span className="text-lg font-bold text-slate-900 mr-2">{activity.price}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{activity.buyer}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{activity.amount}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            
            {/* Primary Action */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
              <Package className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2">أضف مخلفات جديدة</h3>
              <p className="text-emerald-100 text-sm mb-6">ابدأ في بيع المخلفات الصناعية الخاصة بك</p>
              <button
                onClick={() => navigate('/list-waste')}
                className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إضافة الآن
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">إجراءات سريعة</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full text-right p-4 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-700">تصفح السوق</span>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </button>
                
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full text-right p-4 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-700">طلباتي</span>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </button>
                
                <button
                  onClick={() => navigate('/analytics')}
                  className="w-full text-right p-4 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-700">التقارير</span>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </button>
              </div>
            </div>

            {/* Alert/Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1 text-sm">تنبيه هام</h4>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    لديك 3 طلبات تنتظر الموافقة. راجعها الآن لتسريع عملية البيع.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard