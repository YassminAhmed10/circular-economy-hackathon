import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Trash2, Calendar, DollarSign, MapPin, CheckCircle, Clock, AlertCircle, Edit, Eye, Search, Filter, ChevronDown, Plus, Loader } from 'lucide-react';

const API_BASE_URL = 'https://localhost:54464';

function MyListings() {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        checkAuthAndFetchListings();
    }, []);

    const checkAuthAndFetchListings = async () => {
        const token = localStorage.getItem('token');

        console.log('Token from localStorage:', token ? 'Present' : 'Not found');

        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
            return;
        }

        try {
            // First, get user profile to verify token is valid
            const userResponse = await fetch(`${API_BASE_URL}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!userResponse.ok) {
                if (userResponse.status === 401) {
                    console.log('Token invalid or expired');
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error! status: ${userResponse.status}`);
            }

            const userData = await userResponse.json();
            console.log('User data:', userData);

            if (userData.success) {
                setUser(userData.data);
                await fetchMyListings(token);
            } else {
                setError('فشل في تحميل بيانات المستخدم');
            }
        } catch (err) {
            console.error('Error fetching user:', err);
            setError('فشل في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyListings = async (token) => {
        try {
            console.log('Fetching listings with token:', token ? 'Present' : 'Not found');

            const response = await fetch(`${API_BASE_URL}/api/Marketplace/my-listings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Listings response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    console.log('Unauthorized - token invalid');
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Listings data:', data);

            if (data.success) {
                const transformedListings = data.data.map(item => ({
                    id: item.id,
                    title: item.type,
                    type: getArabicCategory(item.category),
                    amount: item.amount.toString(),
                    unit: item.unit,
                    frequency: getFrequency(item.createdAt, item.expiresAt),
                    price: item.price.toString(),
                    currency: 'جنيه',
                    location: item.location,
                    status: getArabicStatus(item.status),
                    date: new Date(item.createdAt).toLocaleDateString('ar-EG'),
                    views: item.views || 0,
                    offers: item.offers || 0
                }));

                setListings(transformedListings);
                setError(null);
            } else {
                setError(data.message || 'فشل في تحميل الإعلانات');
            }
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError('فشل في الاتصال بالخادم');
        }
    };

    const getArabicCategory = (englishCategory) => {
        const categoryMap = {
            'plastic': 'بلاستيك',
            'metal': 'معادن',
            'paper': 'ورق',
            'glass': 'زجاج',
            'wood': 'خشب',
            'textile': 'نسيج',
            'chemical': 'كيماويات',
            'rubber': 'مطاط'
        };
        return categoryMap[englishCategory] || englishCategory;
    };

    const getArabicStatus = (status) => {
        const statusMap = {
            'Active': 'نشط',
            'Pending': 'معلق',
            'Deleted': 'منتهي',
            'Expired': 'منتهي'
        };
        return statusMap[status] || status;
    };

    const getFrequency = (createdAt, expiresAt) => {
        if (!expiresAt) return 'شهري';

        const created = new Date(createdAt);
        const expires = new Date(expiresAt);
        const daysDiff = Math.floor((expires - created) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 7) return 'أسبوعي';
        if (daysDiff <= 30) return 'شهري';
        return 'سنوي';
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/api/Marketplace/waste-listings/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setListings(listings.filter(listing => listing.id !== id));
            } else {
                alert(data.message || 'فشل في حذف الإعلان');
            }
        } catch (err) {
            console.error('Error deleting listing:', err);
            alert('فشل في الاتصال بالخادم');
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-waste/${id}`);
    };

    const handleViewDetails = (id) => {
        navigate(`/waste-details/${id}`);
    };

    const filteredListings = listings.filter(listing => {
        const matchesFilter = filter === 'all' || listing.status === filter;
        const matchesSearch = search === '' ||
            listing.title.toLowerCase().includes(search.toLowerCase()) ||
            listing.type.toLowerCase().includes(search.toLowerCase()) ||
            listing.location.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'نشط': return 'bg-emerald-100 text-emerald-800';
            case 'معلق': return 'bg-amber-100 text-amber-800';
            case 'منتهي': return 'bg-slate-100 text-slate-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'نشط': return <CheckCircle className="w-4 h-4" />;
            case 'معلق': return <Clock className="w-4 h-4" />;
            case 'منتهي': return <AlertCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-slate-600">جاري تحميل إعلاناتك...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">حدث خطأ</h2>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button
                        onClick={checkAuthAndFetchListings}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">إعلانات النفايات الخاصة بي</h1>
                    <p className="text-slate-600">مرحباً {user?.fullName || 'بك'}، هذه هي إعلانات مصنعك</p>
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
                                {filteredListings.length > 0 ? (
                                    filteredListings.map((listing) => (
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
                                                    <button
                                                        onClick={() => handleViewDetails(listing.id)}
                                                        className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                        title="عرض التفاصيل"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(listing.id)}
                                                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="تعديل"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(listing.id)}
                                                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="حذف"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center">
                                            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500">لا توجد إعلانات بعد</p>
                                            <Link
                                                to="/list-waste"
                                                className="inline-block mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                            >
                                                أضف أول إعلان الآن
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Stats */}
                {listings.length > 0 && (
                    <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">إحصائيات الأداء</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 border border-slate-200 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">متوسط المشاهدات لكل إعلان</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {listings.length > 0 ? Math.round(listings.reduce((sum, l) => sum + l.views, 0) / listings.length) : 0}
                                </p>
                            </div>
                            <div className="text-center p-4 border border-slate-200 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">متوسط العروض لكل إعلان</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {listings.length > 0 ? (listings.reduce((sum, l) => sum + l.offers, 0) / listings.length).toFixed(1) : 0}
                                </p>
                            </div>
                            <div className="text-center p-4 border border-slate-200 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">معدل التفاعل</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {listings.length > 0
                                        ? Math.min(100, Math.round((listings.reduce((sum, l) => sum + l.offers, 0) / listings.length) * 20))
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyListings;