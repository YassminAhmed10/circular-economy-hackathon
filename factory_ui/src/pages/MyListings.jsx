import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Package, Trash2, Calendar, DollarSign, MapPin,
    CheckCircle, Clock, AlertCircle, Edit, Eye,
    Search, ChevronDown, Plus, RefreshCw, Database
} from 'lucide-react';
import { marketplaceAPI } from '../services/api'; // ✅ WasteListings - نفس جدول الماركت

// ── Status helpers ──────────────────────────────────────────────────────────
const STATUS_MAP = {
    'active':   'نشط',  'Active':   'نشط',
    'pending':  'معلق', 'Pending':  'معلق',
    'expired':  'منتهي','Expired':  'منتهي',
    'inactive': 'منتهي','Inactive': 'منتهي',
    'approved': 'نشط',  'Approved': 'نشط',
    'rejected': 'منتهي','Rejected': 'منتهي',
    'نشط': 'نشط', 'معلق': 'معلق', 'منتهي': 'منتهي',
};
const normalizeStatus = (raw) => STATUS_MAP[raw] ?? STATUS_MAP[raw?.toLowerCase?.()] ?? 'معلق';

const STATUS_STYLE = {
    'نشط':   { badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200', dot: 'bg-emerald-500' },
    'معلق':  { badge: 'bg-amber-100 text-amber-800 border border-amber-200',       dot: 'bg-amber-500'   },
    'منتهي': { badge: 'bg-slate-100 text-slate-600 border border-slate-200',       dot: 'bg-slate-400'   },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE['معلق'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
};

// ── Transform WasteListing → display row ────────────────────────────────────
const transformItem = (item) => ({
    id:        item.id ?? Math.random(),
    title:     item.titleAr || item.titleEn || item.type || item.typeEn || '—',
    type:      item.category || item.type || item.typeEn || '—',
    amount:    item.amount ?? '0',
    unit:      item.unit || 'طن',
    frequency: item.frequency || 'شهري',
    price:     item.price ?? '0',
    currency:  'جنيه',
    location:  item.locationAr || item.location || '—',
    status:    normalizeStatus(item.status),
    date:      item.createdAt?.split('T')[0] || item.date || new Date().toISOString().split('T')[0],
    views:     item.views ?? 0,
    offers:    item.offers ?? 0,
});

// ── Component ────────────────────────────────────────────────────────────────
export default function MyListings({ user }) {
    const [listings, setListings] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [filter,   setFilter]   = useState('all');
    const [search,   setSearch]   = useState('');

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            // ✅ جلب من API أولاً
            let items = [];
            try {
                const response = await marketplaceAPI.getMyListings();
                const raw = response?.data;
                if (Array.isArray(raw)) items = raw;
                else if (Array.isArray(raw?.data)) items = raw.data;
            } catch (apiErr) {
                console.warn('⚠️ API failed, falling back to localStorage:', apiErr);
            }

            // ✅ إذا كانت النتيجة فارغة، جلب من localStorage
            if (!items || items.length === 0) {
                try {
                    const stored = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
                    items = stored.filter(l => {
                        // طابق حسب factoryId أو email أو source='list-waste'
                        return (user?.factoryId && l.factoryId === user.factoryId) ||
                               (user?.email && l.email === user.email) ||
                               (l.source === 'list-waste' && (l.email === user?.email || l.factoryId === user?.factoryId));
                    });
                    console.log('📦 Loaded from localStorage:', items.length, 'items');
                } catch (localErr) {
                    console.error('❌ Failed to load from localStorage:', localErr);
                }
            }

            setListings(items.map(transformItem));
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'فشل الاتصال بقاعدة البيانات');
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [user?.factoryId]);

    const filtered = listings.filter(l => {
        const matchFilter = filter === 'all' || l.status === filter;
        const q = search.toLowerCase();
        const matchSearch = !q || l.title.toLowerCase().includes(q) || l.type.toLowerCase().includes(q);
        return matchFilter && matchSearch;
    });

    const totalViews  = listings.reduce((s, l) => s + l.views,  0);
    const totalOffers = listings.reduce((s, l) => s + l.offers, 0);
    const activeCount = listings.filter(l => l.status === 'نشط').length;

    return (
        <div className="min-h-screen bg-slate-50 py-8" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">إعلانات النفايات الخاصة بي</h1>
                        <p className="text-slate-500 text-sm mt-1">إدارة وتتبع إعلانات مصنعك</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {!loading && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
                                <Database className="w-3.5 h-3.5" /> بيانات حقيقية
                            </span>
                        )}
                        <button onClick={load} disabled={loading}
                            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-emerald-600 hover:border-emerald-300 transition-all disabled:opacity-40">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <Link to="/list-waste"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm">
                            <Plus className="w-4 h-4" /> إعلان جديد
                        </Link>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-700 font-medium text-sm">{error}</p>
                            <button onClick={load} className="text-red-600 underline text-xs mt-1">إعادة المحاولة</button>
                        </div>
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                                <div className="h-3 bg-slate-200 rounded w-2/3 mb-3" />
                                <div className="h-7 bg-slate-200 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats */}
                {!loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'إجمالي الإعلانات', value: listings.length, color: 'text-slate-900',   bg: 'bg-slate-100',   icon: <Package     className="w-5 h-5 text-slate-600"   /> },
                            { label: 'إعلانات نشطة',     value: activeCount,     color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <CheckCircle  className="w-5 h-5 text-emerald-600" /> },
                            { label: 'إجمالي العروض',    value: totalOffers,     color: 'text-blue-700',    bg: 'bg-blue-100',    icon: <DollarSign   className="w-5 h-5 text-blue-600"    /> },
                            { label: 'إجمالي المشاهدات', value: totalViews,      color: 'text-purple-700',  bg: 'bg-purple-100',  icon: <Eye          className="w-5 h-5 text-purple-600"  /> },
                        ].map(({ label, value, color, bg, icon }) => (
                            <div key={label} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>{icon}</div>
                                <div>
                                    <p className="text-slate-500 text-xs">{label}</p>
                                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters */}
                {!loading && (
                    <div className="bg-white rounded-xl px-5 py-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="text" placeholder="ابحث في إعلاناتك..." value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full sm:w-56 pr-9 pl-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-400 bg-slate-50" />
                            </div>
                            <div className="relative">
                                <select value={filter} onChange={e => setFilter(e.target.value)}
                                    className="appearance-none pr-9 pl-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-400 bg-slate-50">
                                    <option value="all">جميع الحالات</option>
                                    <option value="نشط">نشط</option>
                                    <option value="معلق">معلق</option>
                                    <option value="منتهي">منتهي</option>
                                </select>
                                <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">عرض {filtered.length} من {listings.length} إعلان</p>
                    </div>
                )}

                {/* Table */}
                {!loading && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {filtered.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-700 font-medium">
                                    {listings.length === 0 ? 'لا توجد إعلانات بعد' : 'لا توجد نتائج مطابقة'}
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    {listings.length === 0 ? 'أضف أول إعلان لمصنعك الآن' : 'جرّب تغيير كلمة البحث أو الفلتر'}
                                </p>
                                {listings.length === 0 && (
                                    <Link to="/list-waste"
                                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all">
                                        <Plus className="w-4 h-4" /> إضافة إعلان
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wide">
                                            <th className="py-3 px-5 text-right font-semibold">الإعلان</th>
                                            <th className="py-3 px-5 text-right font-semibold">النوع</th>
                                            <th className="py-3 px-5 text-right font-semibold">الكمية</th>
                                            <th className="py-3 px-5 text-right font-semibold">السعر / وحدة</th>
                                            <th className="py-3 px-5 text-right font-semibold">المكان</th>
                                            <th className="py-3 px-5 text-right font-semibold">الحالة</th>
                                            <th className="py-3 px-5 text-right font-semibold">إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.map(l => (
                                            <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-4 px-5">
                                                    <p className="font-medium text-slate-900">{l.title}</p>
                                                    <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {l.date}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1.5 text-slate-700">
                                                        <Trash2 className="w-3.5 h-3.5 text-slate-400" />{l.type}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="font-semibold text-slate-800">{l.amount}</span>
                                                    <span className="text-slate-400 mr-1">{l.unit}</span>
                                                    <p className="text-slate-400 text-xs">{l.frequency}</p>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="font-semibold text-slate-800">{l.price}</span>
                                                    <span className="text-slate-400 mr-1 text-xs">{l.currency}</span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1 text-slate-600">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />{l.location}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5"><StatusBadge status={l.status} /></td>
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-1">
                                                        <Link to={`/waste-details/${l.id}`}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="عرض">
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="تعديل">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Performance */}
                {!loading && listings.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">إحصائيات الأداء</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'متوسط المشاهدات / إعلان', value: Math.round(totalViews / listings.length) },
                                { label: 'متوسط العروض / إعلان',    value: (totalOffers / listings.length).toFixed(1) },
                                { label: 'نسبة الإعلانات النشطة',   value: `${Math.round((activeCount / listings.length) * 100)}%` },
                            ].map(({ label, value }) => (
                                <div key={label} className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-slate-500 text-xs mb-1">{label}</p>
                                    <p className="text-xl font-bold text-slate-900">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}