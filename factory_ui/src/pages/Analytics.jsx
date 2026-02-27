import React, { useState } from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, DollarSign, Package, Users, Recycle, Calendar, Filter } from 'lucide-react';

function Analytics() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedChart, setSelectedChart] = useState('sales');

  // بيانات المبيعات
  const salesData = {
    monthly: [
      { month: 'يناير', sales: 15000, waste: 8.5, orders: 12 },
      { month: 'فبراير', sales: 18000, waste: 9.2, orders: 15 },
      { month: 'مارس', sales: 22000, waste: 10.5, orders: 18 },
      { month: 'أبريل', sales: 19000, waste: 8.8, orders: 16 },
      { month: 'مايو', sales: 25000, waste: 11.3, orders: 20 },
      { month: 'يونيو', sales: 30000, waste: 12.7, orders: 24 },
    ],
    quarterly: [
      { quarter: 'Q1', sales: 55000, waste: 28.2, orders: 45 },
      { quarter: 'Q2', sales: 74000, waste: 32.8, orders: 60 },
    ],
    yearly: [
      { year: '2022', sales: 150000, waste: 85, orders: 180 },
      { year: '2023', sales: 220000, waste: 115, orders: 250 },
      { year: '2024', sales: 350000, waste: 180, orders: 380 },
    ]
  };

  // إحصائيات سريعة
  const stats = [
    { title: 'إجمالي المبيعات', value: '350,000', currency: 'جنيه', change: '+25%', trend: 'up', icon: DollarSign, color: 'emerald' },
    { title: 'النفايات المعالجة', value: '180', unit: 'طن', change: '+18%', trend: 'up', icon: Package, color: 'blue' },
    { title: 'عدد الطلبات', value: '380', change: '+32%', trend: 'up', icon: Users, color: 'purple' },
    { title: 'معدل إعادة التدوير', value: '78%', change: '+5%', trend: 'up', icon: Recycle, color: 'green' },
  ];

  // أنواع النفايات الأكثر مبيعاً
  const wasteTypes = [
    { type: 'بلاستيك', percentage: 35, color: 'blue', sales: 122500 },
    { type: 'معادن', percentage: 28, color: 'slate', sales: 98000 },
    { type: 'ورق', percentage: 22, color: 'amber', sales: 77000 },
    { type: 'زجاج', percentage: 15, color: 'emerald', sales: 52500 },
  ];

  // بيانات الأداء الشهري
  const monthlyPerformance = [
    { metric: 'معدل البيع', value: '85%', target: '90%', status: 'good' },
    { metric: 'رضا العملاء', value: '4.8/5', target: '4.5', status: 'excellent' },
    { metric: 'وقت التسليم', value: '2.3 أيام', target: '3 أيام', status: 'good' },
    { metric: 'تكلفة النقل', value: '12%', target: '15%', status: 'good' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-100 text-emerald-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      amber: 'bg-amber-100 text-amber-800',
      slate: 'bg-slate-100 text-slate-800',
    };
    return colors[color] || colors.slate;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">التحليلات والإحصائيات</h1>
              <p className="text-slate-600">تتبع أداء مصنعك وتحليل بيانات النفايات والمبيعات</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                >
                  <option value="monthly">شهري</option>
                  <option value="quarterly">ربع سنوي</option>
                  <option value="yearly">سنوي</option>
                </select>
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedChart('sales')}
                  className={`px-4 py-2 rounded-lg transition-all ${selectedChart === 'sales' ? 'bg-white shadow-sm' : ''}`}
                >
                  المبيعات
                </button>
                <button
                  onClick={() => setSelectedChart('waste')}
                  className={`px-4 py-2 rounded-lg transition-all ${selectedChart === 'waste' ? 'bg-white shadow-sm' : ''}`}
                >
                  النفايات
                </button>
                <button
                  onClick={() => setSelectedChart('orders')}
                  className={`px-4 py-2 rounded-lg transition-all ${selectedChart === 'orders' ? 'bg-white shadow-sm' : ''}`}
                >
                  الطلبات
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
                {stat.currency && <span className="text-sm font-normal text-slate-600 mr-1">{stat.currency}</span>}
                {stat.unit && <span className="text-sm font-normal text-slate-600 mr-1">{stat.unit}</span>}
              </p>
              <p className="text-slate-600">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">تطور المبيعات</h2>
                <p className="text-slate-600">مقارنة أداء المبيعات على مدار الوقت</p>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <LineChart className="w-5 h-5" />
                <span>مخطط خطي</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end gap-4">
              {salesData[timeRange].map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600"
                    style={{ 
                      height: `${(item.sales / Math.max(...salesData[timeRange].map(d => d.sales))) * 80}%`,
                      maxHeight: '160px'
                    }}
                  >
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-sm">
                      {item.sales.toLocaleString()} جنيه
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {item.month || item.quarter || item.year}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                    <span className="text-sm text-slate-600">المبيعات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-slate-600">النفايات (طن)</span>
                  </div>
                </div>
                <span className="text-sm text-slate-500">
                  آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          </div>

          {/* Waste Types Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">توزيع أنواع النفايات</h2>
                <p className="text-slate-600">النسبة المئوية لكل نوع</p>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <PieChart className="w-5 h-5" />
                <span>مخطط دائري</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {wasteTypes.map((waste, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${waste.color}-500`}></div>
                    <span className="text-slate-700">{waste.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{waste.percentage}%</span>
                    <span className="text-slate-500 text-sm">
                      {waste.sales.toLocaleString()} ج
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pie Chart Visualization */}
            <div className="mt-8 flex justify-center">
              <div className="relative w-48 h-48">
                {wasteTypes.map((waste, index, array) => {
                  const total = array.reduce((sum, w) => sum + w.percentage, 0);
                  const start = array.slice(0, index).reduce((sum, w) => sum + w.percentage, 0) / total * 360;
                  const end = (start + waste.percentage / total * 360);
                  
                  return (
                    <div
                      key={index}
                      className={`absolute top-0 left-0 w-full h-full rounded-full border-8 border-transparent`}
                      style={{
                        clipPath: `conic-gradient(from ${start}deg, var(--tw-${waste.color}-500) 0deg ${end}deg, transparent ${end}deg)`,
                      }}
                    ></div>
                  );
                })}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">مؤشرات الأداء</h2>
            <div className="space-y-4">
              {monthlyPerformance.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{metric.metric}</p>
                    <p className="text-sm text-slate-500">الهدف: {metric.target}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${
                    metric.status === 'excellent' ? 'bg-emerald-100 text-emerald-800' :
                    metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    <span className="font-bold">{metric.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">النشاط الأخير</h2>
            <div className="space-y-4">
              {[
                { action: 'طلب جديد', details: 'مصنع إعادة التدوير المتقدم', time: 'منذ ساعتين', type: 'success' },
                { action: 'بيع مكتمل', details: '5 طن بلاستيك', time: 'منذ يوم', type: 'success' },
                { action: 'تقييم جديد', details: 'تقييم 5 نجوم من عميل', time: 'منذ يومين', type: 'info' },
                { action: 'دفعة مستلمة', details: 'مبلغ 15,000 جنيه', time: 'منذ 3 أيام', type: 'success' },
                { action: 'شكوى', details: 'تأخير في الشحن', time: 'منذ 4 أيام', type: 'warning' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'warning' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-500">{activity.details}</p>
                  </div>
                  <span className="text-sm text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export & Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">تقارير مفصلة</h3>
              <p className="text-slate-600">تصدير التقارير لتحليل أعمق</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                تصدير PDF
              </button>
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                تصدير Excel
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                إنشاء تقرير مخصص
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;