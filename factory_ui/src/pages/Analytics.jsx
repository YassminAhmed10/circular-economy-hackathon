// Analytics.jsx — ECOv · التحليلات — Premium Redesign
import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown,
  DollarSign, Package, Users, Recycle,
  Calendar, Sparkles, Activity, FileText
} from 'lucide-react';
import './Analytics.css';

function Analytics() {
  const [timeRange,     setTimeRange]     = useState('monthly');
  const [selectedChart, setSelectedChart] = useState('sales');

  const salesData = {
    monthly: [
      { label: 'يناير', sales: 15000, waste: 8.5,  orders: 12 },
      { label: 'فبراير', sales: 18000, waste: 9.2,  orders: 15 },
      { label: 'مارس',   sales: 22000, waste: 10.5, orders: 18 },
      { label: 'أبريل',  sales: 19000, waste: 8.8,  orders: 16 },
      { label: 'مايو',   sales: 25000, waste: 11.3, orders: 20 },
      { label: 'يونيو',  sales: 30000, waste: 12.7, orders: 24 },
    ],
    quarterly: [
      { label: 'Q1', sales: 55000, waste: 28.2, orders: 45 },
      { label: 'Q2', sales: 74000, waste: 32.8, orders: 60 },
      { label: 'Q3', sales: 68000, waste: 30.1, orders: 55 },
      { label: 'Q4', sales: 81000, waste: 36.5, orders: 70 },
    ],
    yearly: [
      { label: '2022', sales: 150000, waste: 85,  orders: 180 },
      { label: '2023', sales: 220000, waste: 115, orders: 250 },
      { label: '2024', sales: 350000, waste: 180, orders: 380 },
    ],
  };

  const stats = [
    { title: 'إجمالي المبيعات',      value: '350,000', unit: 'ج',   change: '+25%', up: true,  icon: DollarSign, color: 'green',  accent: '#16a34a' },
    { title: 'النفايات المعالجة',     value: '180',     unit: 'طن',  change: '+18%', up: true,  icon: Package,    color: 'blue',   accent: '#3b82f6' },
    { title: 'عدد الطلبات',           value: '380',     unit: '',    change: '+32%', up: true,  icon: Users,      color: 'purple', accent: '#8b5cf6' },
    { title: 'معدل إعادة التدوير',    value: '78%',     unit: '',    change: '+5%',  up: true,  icon: Recycle,    color: 'green',  accent: '#16a34a' },
  ];

  const wasteTypes = [
    { type: 'بلاستيك', pct: 35, dot: 'blue',    color: '#3b82f6', sales: 122500 },
    { type: 'معادن',   pct: 28, dot: 'slate',   color: '#64748b', sales: 98000  },
    { type: 'ورق',     pct: 22, dot: 'amber',   color: '#d97706', sales: 77000  },
    { type: 'زجاج',   pct: 15, dot: 'emerald', color: '#16a34a', sales: 52500  },
  ];

  const performance = [
    { metric: 'معدل البيع',    value: '85%',      target: '90%',     status: 'good'      },
    { metric: 'رضا العملاء',   value: '4.8/5',    target: '4.5',     status: 'excellent' },
    { metric: 'وقت التسليم',   value: '2.3 أيام', target: '3 أيام',  status: 'good'      },
    { metric: 'تكلفة النقل',   value: '12%',      target: '15%',     status: 'good'      },
  ];

  const activities = [
    { action: 'طلب جديد',      detail: 'مصنع إعادة التدوير المتقدم', time: 'منذ ساعتين', type: 'success' },
    { action: 'بيع مكتمل',     detail: '5 طن بلاستيك PET',           time: 'منذ يوم',    type: 'success' },
    { action: 'تقييم جديد',    detail: '5 نجوم من مصنع الورق',        time: 'منذ يومين',  type: 'info'    },
    { action: 'دفعة مستلمة',   detail: '15,000 جنيه',                 time: 'منذ 3 أيام', type: 'success' },
    { action: 'تأخر في الشحن', detail: 'طلب ORD-008',                 time: 'منذ 4 أيام', type: 'warning' },
  ];

  const currentData  = salesData[timeRange];
  const chartKey     = selectedChart === 'sales' ? 'sales' : selectedChart === 'waste' ? 'waste' : 'orders';
  const maxVal       = Math.max(...currentData.map(d => d[chartKey]));

  const barColor = selectedChart === 'sales'  ? '#16a34a'
                 : selectedChart === 'waste'  ? '#3b82f6'
                 : '#8b5cf6';

  return (
    <div className="analytics-container" dir="rtl">

      {/* ── Header ── */}
      <div className="analytics-header">
        <div className="an-header-inner">
          <div>
            <div className="an-eyebrow"><Sparkles size={10}/> لوحة التحليلات</div>
            <h1>التحليلات <em>والإحصائيات</em></h1>
            <p>تتبع أداء مصنعك وتحليل بيانات النفايات والمبيعات</p>
          </div>

          <div className="analytics-controls">
            <div className="select-wrapper">
              <select className="select-input" value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                <option value="monthly">شهري</option>
                <option value="quarterly">ربع سنوي</option>
                <option value="yearly">سنوي</option>
              </select>
              <Calendar className="select-icon"/>
            </div>
            <div className="chart-toggle">
              {['sales','waste','orders'].map(k => (
                <button key={k} className={`chart-btn${selectedChart===k?' active':''}`}
                  onClick={() => setSelectedChart(k)}>
                  {k==='sales'?'المبيعات':k==='waste'?'النفايات':'الطلبات'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}
            style={{'--card-accent': s.accent, animationDelay:`${i*.08}s`}}>
            <div className="stat-header">
              <div className={`stat-icon ${s.color}`}><s.icon size={20}/></div>
              <div className={`stat-trend${s.up?'':' down'}`}>
                {s.up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                {s.change}
              </div>
            </div>
            <div className="stat-value">
              {s.value}
              {s.unit && <span className="stat-unit">{s.unit}</span>}
            </div>
            <div className="stat-label">{s.title}</div>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="content-grid">

        {/* Bar Chart */}
        <div className="analytics-card">
          <div className="card-header">
            <div>
              <h2>تطور {selectedChart==='sales'?'المبيعات':selectedChart==='waste'?'النفايات':'الطلبات'}</h2>
              <p>مقارنة الأداء عبر الوقت</p>
            </div>
            <div className="card-icon"><BarChart3 size={14}/> مخطط أعمدة</div>
          </div>

          <div className="bar-chart">
            {currentData.map((item, i) => {
              const h = Math.max((item[chartKey] / maxVal) * 100, 4);
              return (
                <div className="bar-item" key={i} style={{animationDelay:`${i*.06}s`}}>
                  <div className="bar-wrap">
                    <div className="bar"
                      style={{height:`${h}%`, background: barColor, animationDelay:`${i*.07}s`}}
                      title={item[chartKey].toLocaleString()}
                    />
                  </div>
                  <span className="bar-label">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="chart-legend">
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color" style={{background: barColor, borderRadius:3}}/>
                {selectedChart==='sales'?'المبيعات (ج)':selectedChart==='waste'?'النفايات (طن)':'الطلبات'}
              </div>
            </div>
            <span className="bar-label">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        {/* Waste Distribution */}
        <div className="analytics-card">
          <div className="card-header">
            <div>
              <h2>توزيع النفايات</h2>
              <p>النسبة المئوية لكل نوع</p>
            </div>
            <div className="card-icon"><Activity size={14}/> نسب</div>
          </div>

          <div className="waste-distribution">
            {wasteTypes.map((w, i) => (
              <div className="waste-item" key={i}>
                <div className="waste-info">
                  <div className={`waste-dot ${w.dot}`}/>
                  <span className="waste-name">{w.type}</span>
                  <div className="waste-bar-track">
                    <div className="waste-bar-fill"
                      style={{width:`${w.pct}%`, background: w.color, animationDelay:`${i*.1}s`}}/>
                  </div>
                </div>
                <div className="waste-stats">
                  <span className="waste-percent">{w.pct}%</span>
                  <span className="waste-sales">{w.sales.toLocaleString()} ج</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pie-container">
            <div className="pie"><div className="pie-inner"/></div>
          </div>
        </div>
      </div>

      {/* ── Metrics + Activity ── */}
      <div className="metrics-grid">

        <div className="analytics-card">
          <div className="metric-card-title">مؤشرات الأداء</div>
          {performance.map((p, i) => (
            <div className="metric-item" key={i}>
              <div className="metric-info">
                <p>{p.metric}</p>
                <p className="metric-target">الهدف: {p.target}</p>
              </div>
              <div className={`metric-value ${p.status}`}>{p.value}</div>
            </div>
          ))}
        </div>

        <div className="analytics-card">
          <div className="metric-card-title">النشاط الأخير</div>
          <div className="activity-list">
            {activities.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-dot-wrap ${a.type}`}>
                  <div className={`activity-dot ${a.type}`}/>
                </div>
                <div className="activity-content">
                  <p>{a.action}</p>
                  <p>{a.detail}</p>
                </div>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Export ── */}
      <div className="export-card">
        <div className="export-info">
          <h3>تقارير <em style={{color:'var(--green)',fontStyle:'italic'}}>مفصّلة</em></h3>
          <p>صدّر التقارير لتحليل أعمق واتخاذ قرارات أذكى</p>
        </div>
        <div className="export-buttons">
          <button className="btn-outline" onClick={() => alert('تصدير PDF قريباً')}>
            <FileText size={13} style={{marginLeft:6}}/> تصدير PDF
          </button>
          <button className="btn-outline" onClick={() => alert('تصدير Excel قريباً')}>
            تصدير Excel
          </button>
          <button className="btn-primary" onClick={() => alert('إنشاء تقرير مخصص قيد التطوير')}>
            إنشاء تقرير مخصص
          </button>
        </div>
      </div>

    </div>
  );
}

export default Analytics;