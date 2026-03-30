// Sales.jsx — ECOv · صفحة المبيعات (Premium Redesign)
import React, { useState, useMemo } from 'react';
import {
    CheckCircle2, DollarSign, Package, Calendar,
    Search, TrendingUp, Truck, ChevronLeft, ChevronRight,
    ArrowUpRight, Sparkles, Filter, X
} from 'lucide-react';
import './Sales.css';

const SALES = [
    // ✅ يوم 15 يناير — بلاستيك + معادن من مشترين مختلفين
    { id: 'ORD-001', wasteType: 'بلاستيك', amount: '2.5 طن', price: 1500, buyer: 'مصنع إعادة التدوير المتقدم', date: '2024-01-15', status: 'مكتمل', deliveryDate: '2024-01-20' },
    { id: 'ORD-011', wasteType: 'معادن', amount: '1.8 طن', price: 1260, buyer: 'شركة الحديد والصلب', date: '2024-01-15', status: 'مكتمل', deliveryDate: '2024-01-19' },

    // ✅ يوم 10 يناير — ورق + زجاج من مشترين مختلفين
    { id: 'ORD-002', wasteType: 'ورق', amount: '800 كجم', price: 800, buyer: 'شركة الأوراق الخضراء', date: '2024-01-10', status: 'قيد التوصيل', deliveryDate: '2024-01-25' },
    { id: 'ORD-012', wasteType: 'زجاج', amount: '1.5 طن', price: 1200, buyer: 'مصنع الزجاج العربي', date: '2024-01-10', status: 'مكتمل', deliveryDate: '2024-01-14' },

    // ✅ يوم 18 يناير — خشب + بلاستيك + ورق (3 أنواع!)
    { id: 'ORD-005', wasteType: 'خشب', amount: '3 طن', price: 2100, buyer: 'شركة الأخشاب المتحدة', date: '2024-01-18', status: 'مكتمل', deliveryDate: '2024-01-22' },
    { id: 'ORD-013', wasteType: 'بلاستيك', amount: '2 طن', price: 1200, buyer: 'مصنع البلاستيك النيل', date: '2024-01-18', status: 'مكتمل', deliveryDate: '2024-01-21' },
    { id: 'ORD-014', wasteType: 'ورق', amount: '600 كجم', price: 480, buyer: 'مطبعة القاهرة', date: '2024-01-18', status: 'قيد التوصيل', deliveryDate: '2024-01-23' },

    // باقي الطلبات
    { id: 'ORD-006', wasteType: 'معادن', amount: '4 طن', price: 2800, buyer: 'شركة الصلب المصرية', date: '2024-01-08', status: 'مكتمل', deliveryDate: '2024-01-12' },
    { id: 'ORD-007', wasteType: 'بلاستيك', amount: '1.5 طن', price: 900, buyer: 'مصنع البلاستيك الوطني', date: '2024-01-03', status: 'مكتمل', deliveryDate: '2024-01-07' },
    { id: 'ORD-008', wasteType: 'زجاج', amount: '2 طن', price: 1600, buyer: 'مصنع الزجاج الحديث', date: '2024-01-22', status: 'قيد التوصيل', deliveryDate: '2024-01-28' },
    { id: 'ORD-009', wasteType: 'ورق', amount: '1.2 طن', price: 600, buyer: 'مصنع الورق المتحد', date: '2023-12-28', status: 'مكتمل', deliveryDate: '2024-01-02' },
    { id: 'ORD-010', wasteType: 'خشب', amount: '5 طن', price: 3500, buyer: 'شركة النجارة المتحدة', date: '2024-01-25', status: 'مكتمل', deliveryDate: '2024-01-30' },
];

const TYPE_CFG = {
    'بلاستيك': { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', glow: 'rgba(59,130,246,0.35)', emoji: '♻️' },
    'ورق': { color: '#ec4899', bg: 'rgba(236,72,153,0.12)', glow: 'rgba(236,72,153,0.35)', emoji: '📄' },
    'معادن': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', glow: 'rgba(245,158,11,0.35)', emoji: '⚙️' },
    'زجاج': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', glow: 'rgba(139,92,246,0.35)', emoji: '🔮' },
    'خشب': { color: '#10b981', bg: 'rgba(16,185,129,0.12)', glow: 'rgba(16,185,129,0.35)', emoji: '🌿' },
};

const STATUS_CFG = {
    'مكتمل': { cls: 'completed', Icon: CheckCircle2 },
    'قيد التوصيل': { cls: 'delivered', Icon: Truck },
};

const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const ARABIC_DAYS_SHORT = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];

function SalesCalendar({ sales, selectedDate, onSelect }) {
    const [viewDate, setViewDate] = useState(new Date(2024, 0, 1));
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const salesByDate = useMemo(() => {
        const map = {};
        sales.forEach(s => { if (!map[s.date]) map[s.date] = []; map[s.date].push(s); });
        return map;
    }, [sales]);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className="sc-cal">
            <div className="sc-cal-nav">
                <button className="sc-nav-btn" onClick={() => setViewDate(new Date(year, month - 1, 1))}><ChevronRight size={14} /></button>
                <span className="sc-cal-month">{ARABIC_MONTHS[month]} {year}</span>
                <button className="sc-nav-btn" onClick={() => setViewDate(new Date(year, month + 1, 1))}><ChevronLeft size={14} /></button>
            </div>
            <div className="sc-cal-grid">
                {ARABIC_DAYS_SHORT.map(d => <div key={d} className="sc-cal-day-lbl">{d}</div>)}
                {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} className="sc-cal-empty" />;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasSale = salesByDate[dateStr];
                    const isSelected = selectedDate === dateStr;
                    const isToday = dateStr === '2024-01-15';
                    // نقطة واحدة لكل نوع مختلف في اليوم ده
                    const uniqueTypes = hasSale
                        ? [...new Map(hasSale.map(s => [s.wasteType, s])).values()]
                        : [];
                    return (
                        <button key={day} className={`sc-cal-day${hasSale ? ' has-sale' : ''}${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}`}
                            onClick={() => onSelect(isSelected ? null : dateStr)}>
                            {day}
                            {uniqueTypes.length > 0 && (
                                <div className="sc-cal-dots">
                                    {uniqueTypes.map((s, idx) => {
                                        const cfg = TYPE_CFG[s.wasteType] || TYPE_CFG['خشب'];
                                        return (
                                            <div
                                                key={idx}
                                                className="sc-cal-dot"
                                                title={s.wasteType}
                                                style={{
                                                    background: cfg.color,
                                                    boxShadow: isSelected ? 'none' : `0 0 5px ${cfg.glow}`
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            <div className="sc-cal-legend">
                {Object.entries(TYPE_CFG).map(([name, cfg]) => (
                    <div key={name} className="sc-legend-item">
                        <div className="legend-dot" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }} />
                        <span>{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Sales() {
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    const filtered = useMemo(() => SALES.filter(s => {
        const q = search.trim();
        const matchSearch = !q || s.buyer.includes(q) || s.wasteType.includes(q) || s.id.includes(q);
        const matchDate = !selectedDate || s.date === selectedDate;
        return matchSearch && matchDate;
    }), [search, selectedDate]);

    const totalRevenue = filtered.reduce((sum, s) => s.status !== 'ملغى' ? sum + s.price : sum, 0);

    const stats = [
        { label: 'إجمالي المبيعات', value: filtered.length, suffix: '', color: '#10b981', Icon: Package, pct: 80 },
        { label: 'إجمالي الإيرادات', value: totalRevenue.toLocaleString(), suffix: ' ج', color: '#3b82f6', Icon: DollarSign, pct: 92 },
        { label: 'مكتملة', value: filtered.filter(s => s.status === 'مكتمل').length, suffix: '', color: '#10b981', Icon: CheckCircle2, pct: 75 },
        { label: 'قيد التوصيل', value: filtered.filter(s => s.status === 'قيد التوصيل').length, suffix: '', color: '#f59e0b', Icon: Truck, pct: 25 },
    ];

    return (
        <div className="sales-page" dir="rtl">
            {/* ambient background */}
            <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />

            {/* ── Header ── */}
            <header className="sp-header">
                <div className="sp-header-text">
                    <div className="sp-eyebrow">
                        <Sparkles size={11} />
                        <span>لوحة التحكم</span>
                    </div>
                    <h1>المبيعات <span>&</span> الإيرادات</h1>
                    <p>تتبع وإدارة جميع صفقات البيع المكتملة بدقة واحترافية</p>
                </div>
                <div className="sp-header-orb">
                    <div className="orb-glow" />
                    <div className="orb-core"><TrendingUp size={26} color="white" /></div>
                    <div className="orb-ring r1" /><div className="orb-ring r2" />
                </div>
            </header>

            {/* ── Stats ── */}
            <div className="sp-stats">
                {stats.map((st, i) => (
                    <div className="sp-stat" key={i} style={{ '--i': i, '--c': st.color }}>
                        <div className="stat-shine" />
                        <div className="stat-top">
                            <div className="stat-icon"><st.Icon size={18} color={st.color} /></div>
                            <div className="stat-arrow"><ArrowUpRight size={13} /></div>
                        </div>
                        <div className="stat-val">{st.value}<span className="stat-suffix">{st.suffix}</span></div>
                        <div className="stat-label">{st.label}</div>
                        <div className="stat-track"><div className="stat-fill" style={{ width: `${st.pct}%` }} /></div>
                    </div>
                ))}
            </div>

            {/* ── Search ── */}
            <div className="sp-searchbar-row">
                <div className="sp-search-wrap">
                    <Search size={15} className="si" />
                    <input className="sp-search" placeholder="ابحث برقم الطلب، النوع، أو المشتري..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                    {search && <button className="sp-clr" onClick={() => setSearch('')}><X size={12} /></button>}
                </div>
            </div>

            {/* ── Main layout ── */}
            <div className="sp-main">
                {/* Table col */}
                <div className="sp-table-col">
                    {selectedDate && (
                        <div className="sp-filter-chip">
                            <Filter size={11} />
                            <span>فلترة: <strong>{selectedDate}</strong></span>
                            <button onClick={() => setSelectedDate(null)}><X size={11} /></button>
                        </div>
                    )}
                    <div className="sp-card">
                        <div className="sp-card-head">
                            <div className="card-head-left">
                                <div className="card-head-pulse" />
                                <span className="card-head-title">قائمة المبيعات</span>
                            </div>
                            <span className="sp-count-badge">{filtered.length} سجل</span>
                        </div>
                        <div className="tbl-scroll">
                            <table className="sp-table">
                                <thead>
                                    <tr>
                                        <th>رقم الطلب</th><th>نوع النفايات</th><th>الكمية</th>
                                        <th>السعر</th><th>المشتري</th><th>التاريخ</th><th>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((s, i) => {
                                        const tc = TYPE_CFG[s.wasteType] || TYPE_CFG['خشب'];
                                        const sc = STATUS_CFG[s.status] || STATUS_CFG['مكتمل'];
                                        const SI = sc.Icon;
                                        return (
                                            <tr key={s.id} style={{ '--ri': i }}>
                                                <td><span className="oid">{s.id}</span></td>
                                                <td>
                                                    <div className="type-cell">
                                                        <div className="type-ico" style={{ background: tc.bg }}>
                                                            <span>{tc.emoji}</span>
                                                        </div>
                                                        <span className="type-name" style={{ color: tc.color }}>{s.wasteType}</span>
                                                    </div>
                                                </td>
                                                <td><span className="amt">{s.amount}</span></td>
                                                <td>
                                                    <div className="price-cell" style={{ color: tc.color }}>
                                                        <span className="pcur">ج</span>{s.price.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="buyer-name">{s.buyer}</div>
                                                    <div className="buyer-sub"><Truck size={9} /> توصيل: {s.deliveryDate}</div>
                                                </td>
                                                <td>
                                                    <div className="date-cell"><Calendar size={11} />{s.date}</div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${sc.cls}`}><SI size={11} />{s.status}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filtered.length === 0 && (
                                        <tr><td colSpan="7">
                                            <div className="sp-empty">
                                                <div className="empty-orb"><Package size={28} /></div>
                                                <p>لا توجد مبيعات للفترة المحددة</p>
                                            </div>
                                        </td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Calendar col */}
                <div className="sp-cal-col">
                    <SalesCalendar sales={SALES} selectedDate={selectedDate} onSelect={setSelectedDate} />
                    <div className="sp-mini-stats">
                        <div className="mst-title">توزيع الأنواع</div>
                        {Object.entries(TYPE_CFG).map(([name, cfg]) => {
                            const count = SALES.filter(s => s.wasteType === name).length;
                            const pct = Math.round((count / SALES.length) * 100);
                            return (
                                <div className="mst-row" key={name}>
                                    <div className="mst-left">
                                        <div className="mst-dot" style={{ background: cfg.color, boxShadow: `0 0 7px ${cfg.glow}` }} />
                                        <span className="mst-name">{name}</span>
                                    </div>
                                    <div className="mst-bar-wrap">
                                        <div className="mst-bar-fill" style={{ width: `${pct * 2.2}px`, background: cfg.color, boxShadow: `0 0 8px ${cfg.glow}` }} />
                                    </div>
                                    <span className="mst-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}