import React, { useState } from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, DollarSign, Package, Users, Recycle, Calendar, Filter } from 'lucide-react';
import './Analytics.css';

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
    { title: 'إجمالي المبيعات', value: '350,000', currency: 'جنيه', change: '+25%', trend: 'up', icon: DollarSign, color: 'green' },
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

  // دوال التعامل مع الأزرار
  const handleExportPDF = () => {
    alert('سيتم تصدير التقرير بصيغة PDF قريباً');
    // هنا يمكن إضافة مكتبة jsPDF أو react-pdf لاحقاً
  };

  const handleExportExcel = () => {
    alert('سيتم تصدير التقرير بصيغة Excel قريباً');
    // يمكن استخدام xlsx أو exceljs
  };

  const handleCreateReport = () => {
    alert('ميزة إنشاء تقرير مخصص قيد التطوير');
    // يمكن توجيه المستخدم إلى صفحة منشئ التقارير
  };

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-controls">
          <div>
            <h1>التحليلات والإحصائيات</h1>
            <p>تتبع أداء مصنعك وتحليل بيانات النفايات والمبيعات</p>
          </div>
          
          <div className="control-group">
            <div className="select-wrapper">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="select-input"
              >
                <option value="monthly">شهري</option>
                <option value="quarterly">ربع سنوي</option>
                <option value="yearly">سنوي</option>
              </select>
              <Calendar className="select-icon" />
            </div>
            
            <div className="chart-toggle">
              <button
                onClick={() => setSelectedChart('sales')}
                className={`chart-btn ${selectedChart === 'sales' ? 'active' : ''}`}
              >
                المبيعات
              </button>
              <button
                onClick={() => setSelectedChart('waste')}
                className={`chart-btn ${selectedChart === 'waste' ? 'active' : ''}`}
              >
                النفايات
              </button>
              <button
                onClick={() => setSelectedChart('orders')}
                className={`chart-btn ${selectedChart === 'orders' ? 'active' : ''}`}
              >
                الطلبات
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className={`stat-icon ${stat.color}`}>
                <stat.icon />
              </div>
              <div className={`stat-trend ${stat.trend === 'down' ? 'down' : ''}`}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="stat-value">
              {stat.value}
              {stat.currency && <span className="stat-unit">{stat.currency}</span>}
              {stat.unit && <span className="stat-unit">{stat.unit}</span>}
            </div>
            <div className="stat-label">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="content-grid">
        {/* Sales Chart */}
        <div className="analytics-card">
          <div className="card-header">
            <div>
              <h2>تطور المبيعات</h2>
              <p>مقارنة أداء المبيعات على مدار الوقت</p>
            </div>
            <div className="card-icon">
              <LineChart />
              <span>مخطط خطي</span>
            </div>
          </div>
          
          <div className="bar-chart">
            {salesData[timeRange].map((item, index) => {
              const maxSales = Math.max(...salesData[timeRange].map(d => d.sales));
              const height = (item.sales / maxSales) * 80;
              return (
                <div key={index} className="bar-item">
                  <div 
                    className="bar" 
                    style={{ height: `${Math.max(height, 10)}%`, background: 'var(--db-green)' }}
                  />
                  <span className="bar-label">
                    {item.month || item.quarter || item.year}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="chart-legend">
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color green" />
                <span>المبيعات</span>
              </div>
              <div className="legend-item">
                <span className="legend-color blue" />
                <span>النفايات (طن)</span>
              </div>
            </div>
            <span className="bar-label">
              آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
            </span>
          </div>
        </div>

        {/* Waste Types Distribution */}
        <div className="analytics-card">
          <div className="card-header">
            <div>
              <h2>توزيع أنواع النفايات</h2>
              <p>النسبة المئوية لكل نوع</p>
            </div>
            <div className="card-icon">
              <PieChart />
              <span>مخطط دائري</span>
            </div>
          </div>
          
          <div className="waste-distribution">
            {wasteTypes.map((waste, index) => (
              <div key={index} className="waste-item">
                <div className="waste-info">
                  <span className={`waste-dot ${waste.color}`} />
                  <span>{waste.type}</span>
                </div>
                <div className="waste-stats">
                  <span className="waste-percent">{waste.percentage}%</span>
                  <span className="waste-sales">{waste.sales.toLocaleString()} ج</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pie Chart Visualization (simplified) */}
          <div className="pie-container">
            <div className="pie">
              <div className="pie-inner"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics & Recent Activity */}
      <div className="metrics-grid">
        {/* Performance Metrics */}
        <div className="analytics-card">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>مؤشرات الأداء</h2>
          <div>
            {monthlyPerformance.map((metric, index) => (
              <div key={index} className="metric-item">
                <div className="metric-info">
                  <p>{metric.metric}</p>
                  <p className="metric-target">الهدف: {metric.target}</p>
                </div>
                <div className={`metric-value ${metric.status}`}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="analytics-card">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>النشاط الأخير</h2>
          <div className="activity-list">
            {[
              { action: 'طلب جديد', details: 'مصنع إعادة التدوير المتقدم', time: 'منذ ساعتين', type: 'success' },
              { action: 'بيع مكتمل', details: '5 طن بلاستيك', time: 'منذ يوم', type: 'success' },
              { action: 'تقييم جديد', details: 'تقييم 5 نجوم من عميل', time: 'منذ يومين', type: 'info' },
              { action: 'دفعة مستلمة', details: 'مبلغ 15,000 جنيه', time: 'منذ 3 أيام', type: 'success' },
              { action: 'شكوى', details: 'تأخير في الشحن', time: 'منذ 4 أيام', type: 'warning' },
            ].map((activity, index) => (
              <div key={index} className="activity-item">
                <span className={`activity-dot ${activity.type}`} />
                <div className="activity-content">
                  <p>{activity.action}</p>
                  <p>{activity.details}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export & Actions */}
      <div className="export-card">
        <div className="export-info">
          <h3>تقارير مفصلة</h3>
          <p>تصدير التقارير لتحليل أعمق</p>
        </div>
        <div className="export-buttons">
          <button onClick={handleExportPDF} className="btn-outline">تصدير PDF</button>
          <button onClick={handleExportExcel} className="btn-outline">تصدير Excel</button>
          <button onClick={handleCreateReport} className="btn-primary">إنشاء تقرير مخصص</button>
        </div>
      </div>
    </div>
  );
}

export default Analytics;