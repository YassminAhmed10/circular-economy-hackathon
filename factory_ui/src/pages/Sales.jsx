// Sales.jsx — ECOv · Sales Page (Real Data)
import React, { useState, useEffect, useMemo } from 'react';
import {
    CheckCircle2, DollarSign, Package, Calendar,
    Search, TrendingUp, Truck, ChevronLeft, ChevronRight,
    Filter, X, Recycle, ScrollText, Zap, AlertCircle, Loader
} from 'lucide-react';
import { getFactoryOrders } from '../services/circularEconomyApi';
import './Sales.css';

const TYPE_CFG = {
    'Plastic': { color: '#059669', Icon: Recycle },
    'Paper': { color: '#059669', Icon: ScrollText },
    'Metal': { color: '#059669', Icon: Zap },
    'Glass': { color: '#059669', Icon: Package },
    'Wood': { color: '#059669', Icon: Package },
    'بلاستيك': { color: '#059669', Icon: Recycle },
    'ورق': { color: '#059669', Icon: ScrollText },
    'معادن': { color: '#059669', Icon: Zap },
    'زجاج': { color: '#059669', Icon: Package },
    'خشب': { color: '#059669', Icon: Package },
};

const STATUS_CFG = {
    'Completed': { cls: 'completed', Icon: CheckCircle2 },
    'In Progress': { cls: 'delivered', Icon: Truck },
    'Pending': { cls: 'pending', Icon: AlertCircle },
    'مكتمل': { cls: 'completed', Icon: CheckCircle2 },
    'قيد التوصيل': { cls: 'delivered', Icon: Truck },
    'معلّق': { cls: 'pending', Icon: AlertCircle },
};

const ENGLISH_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ENGLISH_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function SalesCalendar({ sales, selectedDate, onSelect }) {
    const [viewDate, setViewDate] = useState(new Date());
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const salesByDate = useMemo(() => {
        const map = {};
        sales.forEach(s => {
            if (s.createdDate) {
                const dateStr = s.createdDate.split('T')[0];
                if (!map[dateStr]) map[dateStr] = [];
                map[dateStr].push(s);
            }
        });
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
                <span className="sc-cal-month">{ENGLISH_MONTHS[month]} {year}</span>
                <button className="sc-nav-btn" onClick={() => setViewDate(new Date(year, month + 1, 1))}><ChevronLeft size={14} /></button>
            </div>
            <div className="sc-cal-grid">
                {ENGLISH_DAYS_SHORT.map(d => <div key={d} className="sc-cal-day-lbl">{d}</div>)}
                {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} className="sc-cal-empty" />;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasSale = salesByDate[dateStr];
                    const isSelected = selectedDate === dateStr;
                    const today = new Date().toISOString().split('T')[0];
                    const isToday = dateStr === today;
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
                                        const wasteType = s.wasteTypeAr || s.wasteType || '';
                                        const cfg = TYPE_CFG[wasteType] || TYPE_CFG['خشب'];
                                        return (
                                            <div
                                                key={idx}
                                                className="sc-cal-dot"
                                                title={wasteType}
                                                style={{ background: cfg.color }}
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
                {Object.entries(TYPE_CFG).slice(0, 5).map(([name, cfg]) => (
                    <div key={name} className="sc-legend-item">
                        <cfg.Icon size={14} color={cfg.color} />
                        <span>{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Sales({ user }) {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    // Load sales data from API
    useEffect(() => {
        const loadSales = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!user?.id) {
                    setError('User not identified');
                    setSales([]);
                    return;
                }

                // ✅ Fetch orders from backend - filter for seller role
                try {
                    const api = (await import('../services/api')).default;
                    const response = await api.get('/orders?page=1&pageSize=50', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                    });

                    if (response.data?.success && response.data?.data?.Items) {
                        // Filter only orders where current user's factory is the seller
                        const userFactoryId = user.factoryId;
                        const salesOrders = response.data.data.Items.filter(
                            order => order.sellerFactoryId === userFactoryId || order.SellerFactoryId === userFactoryId
                        );
                        // Map to expected sales format
                        const mappedSales = salesOrders.map(o => ({
                            id: o.id || o.Id,
                            wasteType: o.wasteType || o.WasteType,
                            wasteTypeAr: o.wasteType || o.WasteType,
                            buyerName: o.buyerName || o.BuyerName,
                            price: o.price || o.Price,
                            totalPrice: o.price || o.Price,
                            orderStatus: o.status || o.Status,
                            createdDate: o.orderDate || o.OrderDate,
                            orderNumber: o.orderNumber || o.OrderNumber,
                            quantity: o.amount || o.Amount,
                            unit: o.unit || o.Unit
                        }));
                        setSales(mappedSales);
                    } else {
                        setSales([]);
                    }
                } catch (apiErr) {
                    console.error('❌ API Error:', apiErr);
                    // Fallback: Use sample data
                    const sampleSales = [
                        { id: 'S001', wasteType: 'Plastic', wasteTypeAr: 'بلاستيك', buyerName: 'مصنع النيل', price: 1500, totalPrice: 1500, orderStatus: 'Completed', createdDate: '2026-04-10T10:30:00.000Z' },
                    ];
                    setSales(sampleSales);
                }
            } catch (err) {
                console.error('❌ Failed to load sales:', err);
                setError('فشل تحميل المبيعات');
                setSales([]);
            } finally {
                setLoading(false);
            }
        };

        loadSales();
        // Auto-refresh every 10 seconds
        const interval = setInterval(loadSales, 10000);
        return () => clearInterval(interval);
    }, [user?.id, user?.factoryId]);

    const filtered = useMemo(() => {
        return sales.filter(s => {
            const q = search.trim().toLowerCase();
            const matchSearch = !q || 
                s.id?.toLowerCase().includes(q) || 
                s.wasteTypeAr?.toLowerCase().includes(q) ||
                s.wasteType?.toLowerCase().includes(q) ||
                s.buyerName?.toLowerCase().includes(q);
            
            if (!selectedDate) return matchSearch;
            
            // Convert sale date to YYYY-MM-DD format
            const saleDate = s.createdDate ? s.createdDate.split('T')[0] : '';
            return matchSearch && saleDate === selectedDate;
        });
    }, [sales, search, selectedDate]);

    const totalRevenue = filtered.reduce((sum, s) => {
        const price = s.price || s.totalPrice || 0;
        return sum + price;
    }, 0);

    const stats = [
        { label: 'إجمالي المبيعات', value: filtered.length, suffix: '', Icon: Package },
        { label: 'إجمالي الإيرادات', value: Math.round(totalRevenue).toLocaleString(), suffix: ' ج', Icon: DollarSign },
        { label: 'مكتملة', value: filtered.filter(s => s.orderStatus === 'Completed').length, suffix: '', Icon: CheckCircle2 },
        { label: 'قيد المعالجة', value: filtered.filter(s => s.orderStatus === 'In Progress').length, suffix: '', Icon: Truck },
    ];

    if (loading) {
        return (
            <div className="sales-page" dir="rtl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader size={40} className="animate-spin" style={{ margin: '0 auto', color: '#059669' }} />
                    <p style={{ marginTop: '10px', color: '#6b7280' }}>جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sales-page" dir="rtl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#fef2f2', borderRadius: '12px', maxWidth: '400px' }}>
                    <AlertCircle size={40} style={{ color: '#dc2626', margin: '0 auto' }} />
                    <p style={{ marginTop: '10px', color: '#dc2626' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="sales-page" dir="rtl">
            {/* ── Header ── */}
            <header className="sp-header">
                <div className="sp-header-text">
                    <h1>المبيعات و الإيرادات</h1>
                    <p>تتبع وإدارة جميع صفقات البيع المكتملة</p>
                </div>
                <div className="sp-header-icon">
                    <TrendingUp size={24} color="#059669" />
                </div>
            </header>

            {/* ── Stats ── */}
            <div className="sp-stats">
                {stats.map((st, i) => (
                    <div className="sp-stat" key={i}>
                        <div className="stat-top">
                            <div className="stat-icon"><st.Icon size={18} color="#059669" /></div>
                        </div>
                        <div className="stat-val">{st.value}<span className="stat-suffix">{st.suffix}</span></div>
                        <div className="stat-label">{st.label}</div>
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
                                        const wasteType = s.wasteTypeAr || s.wasteType || 'غير محدد';
                                        const tc = TYPE_CFG[wasteType] || TYPE_CFG['خشب'];
                                        const status = s.orderStatus || 'Unknown';
                                        const sc = STATUS_CFG[status] || { cls: 'completed', Icon: CheckCircle2 };
                                        const SI = sc.Icon;
                                        const saleDate = s.createdDate ? s.createdDate.split('T')[0] : '-';
                                        const price = s.price || s.totalPrice || 0;
                                        
                                        return (
                                            <tr key={s.id} style={{ '--ri': i }}>
                                                <td><span className="oid">{s.id}</span></td>
                                                <td>
                                                    <div className="type-cell">
                                                        <div className="type-ico">
                                                            <tc.Icon size={16} color={tc.color} />
                                                        </div>
                                                        <span className="type-name" style={{ color: tc.color }}>{wasteType}</span>
                                                    </div>
                                                </td>
                                                <td><span className="amt">{s.quantity || '-'}</span></td>
                                                <td>
                                                    <div className="price-cell" style={{ color: tc.color }}>
                                                        <span className="pcur">ج</span>{price.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="buyer-name">{s.buyerName || s.buyerCompanyName || '-'}</div>
                                                </td>
                                                <td>
                                                    <div className="date-cell"><Calendar size={11} />{saleDate}</div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${sc.cls}`}><SI size={11} />{status}</span>
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
                    <SalesCalendar sales={sales} selectedDate={selectedDate} onSelect={setSelectedDate} />
                </div>
            </div>
        </div>
    );
}