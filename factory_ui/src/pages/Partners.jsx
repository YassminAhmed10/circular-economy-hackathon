import React, { useState, useEffect } from 'react';
import {
    User, Building2, Mail, Phone, MapPin, FileText, Edit2, Save,
    Camera, Shield, Calendar, CheckCircle, LogOut, AlertCircle,
    Settings, Bell, Eye, TrendingUp, Award, Package, Star
} from 'lucide-react';

// API Base URL - change this to match your backend
const API_BASE_URL = 'https://localhost:5000';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

function Profile({ onLogout }) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        factoryName: '',
        email: '',
        phone: '',
        location: '',
        address: '',
        industryType: '',
        taxNumber: '',
        ownerName: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        appNotifications: true,
        publicProfile: true
    });

    const [stats] = useState({
        activeListings: 12,
        completedOrders: 45,
        rating: 4.8,
        customerSatisfaction: 98
    });

    // Load profile data on component mount
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setLoading(true);

            const token = getToken();
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success && data.data) {
                setProfileData(data.data);

                // Update form data based on response structure
                setFormData({
                    fullName: data.data.fullName || '',
                    factoryName: data.data.factory?.factoryName || '',
                    email: data.data.email || '',
                    phone: data.data.phone || data.data.factory?.phone || '',
                    location: data.data.factory?.location || '',
                    address: data.data.factory?.address || '',
                    industryType: data.data.factory?.industryType || '',
                    taxNumber: data.data.factory?.taxNumber || '',
                    ownerName: data.data.factory?.ownerName || ''
                });
            }
            setError(null);
        } catch (err) {
            console.error('Failed to load profile:', err);
            setError('فشل في تحميل بيانات الملف الشخصي');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            const token = getToken();
            if (!token) {
                window.location.href = '/login';
                return;
            }

            // Prepare update data
            const updateData = {
                fullName: formData.fullName,
                factoryName: formData.factoryName,
                industryType: formData.industryType,
                location: formData.location,
                address: formData.address,
                ownerName: formData.ownerName,
                taxNumber: formData.taxNumber
            };

            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('تم تحديث البيانات بنجاح');
                setIsEditing(false);
                loadProfileData(); // Reload data
            } else {
                setError(data.message || 'فشل في تحديث البيانات');
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
            setError('فشل في تحديث البيانات');
        } finally {
            setSubmitting(false);
            setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 3000);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('كلمة المرور الجديدة غير متطابقة');
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            setSubmitting(true);

            const token = getToken();
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('تم تغيير كلمة المرور بنجاح');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setError(data.message || 'فشل في تغيير كلمة المرور');
            }
        } catch (err) {
            console.error('Failed to change password:', err);
            setError('فشل في تغيير كلمة المرور');
        } finally {
            setSubmitting(false);
            setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 3000);
        }
    };

    const handleNotificationChange = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
        // Save to localStorage for now
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rememberEmail');
        if (onLogout) {
            onLogout();
        } else {
            window.location.href = '/login';
        }
    };

    if (loading && !profileData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">جاري تحميل الملف الشخصي...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8" dir="rtl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">الملف الشخصي</h1>
                            <p className="text-slate-600">إدارة معلومات مصنعك وتحديث البيانات</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                تسجيل خروج
                            </button>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center gap-2 ${isEditing
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                    }`}
                                disabled={submitting}
                            >
                                {isEditing ? (
                                    <>
                                        <Save className="w-4 h-4" />
                                        حفظ
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="w-4 h-4" />
                                        تعديل
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <p className="text-emerald-700">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="relative inline-block mb-4">
                                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto text-white">
                                        <Building2 className="w-16 h-16" />
                                    </div>
                                    <button
                                        className="absolute bottom-2 right-2 bg-white text-emerald-600 p-2 rounded-full shadow-lg hover:bg-slate-50 transition-all"
                                        onClick={() => alert('سيتم إضافة رفع الصور قريباً')}
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 mb-1">
                                    {formData.factoryName || 'غير محدد'}
                                </h2>
                                <p className="text-slate-600 mb-3">{formData.industryType || 'غير محدد'}</p>

                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${profileData?.factory?.verified || profileData?.verified
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}>
                                    {profileData?.factory?.verified || profileData?.verified ? (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            حساب موثق
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-4 h-4" />
                                            قيد المراجعة
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 text-right">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <User className="w-5 h-5 text-slate-500" />
                                    <div className="flex-1">
                                        <p className="font-medium">المالك / المدير</p>
                                        <p className="text-sm text-slate-600">
                                            {formData.ownerName || formData.fullName || 'غير محدد'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-700">
                                    <Mail className="w-5 h-5 text-slate-500" />
                                    <div className="flex-1">
                                        <p className="font-medium">البريد الإلكتروني</p>
                                        <p className="text-sm text-slate-600" dir="ltr">{formData.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-700">
                                    <Phone className="w-5 h-5 text-slate-500" />
                                    <div className="flex-1">
                                        <p className="font-medium">رقم الهاتف</p>
                                        <p className="text-sm text-slate-600">{formData.phone || 'غير محدد'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-700">
                                    <MapPin className="w-5 h-5 text-slate-500" />
                                    <div className="flex-1">
                                        <p className="font-medium">الموقع</p>
                                        <p className="text-sm text-slate-600">{formData.location || 'غير محدد'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-700">
                                    <Calendar className="w-5 h-5 text-slate-500" />
                                    <div className="flex-1">
                                        <p className="font-medium">تاريخ التسجيل</p>
                                        <p className="text-sm text-slate-600">
                                            {profileData?.createdAt
                                                ? new Date(profileData.createdAt).toLocaleDateString('ar-EG')
                                                : 'غير محدد'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-700">
                                    <FileText className="w-5 h-5 text-slate-500" />
                                    <div className="flex-1">
                                        <p className="font-medium">الرقم الضريبي</p>
                                        <p className="text-sm text-slate-600">{formData.taxNumber || 'غير محدد'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-3">الإحصائيات</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                                        <Package className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                        <p className="text-2xl font-bold text-slate-900">{stats.activeListings}</p>
                                        <p className="text-sm text-slate-600">إعلانات نشطة</p>
                                    </div>
                                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                        <p className="text-2xl font-bold text-slate-900">{stats.completedOrders}</p>
                                        <p className="text-sm text-slate-600">طلبات مكتملة</p>
                                    </div>
                                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                                        <Star className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                        <p className="text-2xl font-bold text-slate-900">{stats.rating}</p>
                                        <p className="text-sm text-slate-600">تقييم</p>
                                    </div>
                                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                                        <Award className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                        <p className="text-2xl font-bold text-emerald-600">{stats.customerSatisfaction}%</p>
                                        <p className="text-sm text-slate-600">رضا العملاء</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Information Form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-emerald-600" />
                                المعلومات الأساسية
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        الاسم الكامل
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        disabled={!isEditing || submitting}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        اسم المصنع
                                    </label>
                                    <input
                                        type="text"
                                        name="factoryName"
                                        value={formData.factoryName}
                                        onChange={handleChange}
                                        disabled={!isEditing || submitting}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing || submitting}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        المحافظة
                                    </label>
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        disabled={!isEditing || submitting}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                                        required
                                    >
                                        <option value="">اختر المحافظة</option>
                                        <option value="القاهرة">القاهرة</option>
                                        <option value="الجيزة">الجيزة</option>
                                        <option value="الإسكندرية">الإسكندرية</option>
                                        <option value="القليوبية">القليوبية</option>
                                        <option value="بور سعيد">بور سعيد</option>
                                        <option value="السويس">السويس</option>
                                        <option value="المنصورة">المنصورة</option>
                                        <option value="طنطا">طنطا</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        نوع الصناعة
                                    </label>
                                    <select
                                        name="industryType"
                                        value={formData.industryType}
                                        onChange={handleChange}
                                        disabled={!isEditing || submitting}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                                        required
                                    >
                                        <option value="">اختر نوع الصناعة</option>
                                        <option value="صناعات غذائية">صناعات غذائية</option>
                                        <option value="نسيج وملابس">نسيج وملابس</option>
                                        <option value="كيماويات">كيماويات</option>
                                        <option value="معادن وتصنيع">معادن وتصنيع</option>
                                        <option value="بلاستيك">بلاستيك</option>
                                        <option value="ورق وطباعة">ورق وطباعة</option>
                                        <option value="إلكترونيات">إلكترونيات</option>
                                        <option value="أدوية">أدوية</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-slate-700 font-medium mb-2">
                                        العنوان التفصيلي
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={!isEditing || submitting}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        اسم المالك
                                    </label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        disabled={!isEditing || submitting}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        الرقم الضريبي
                                    </label>
                                    <input
                                        type="text"
                                        name="taxNumber"
                                        value={formData.taxNumber}
                                        onChange={handleChange}
                                        disabled={!isEditing || submitting}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all"
                                        disabled={submitting}
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                جاري الحفظ...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                حفظ التغييرات
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>

                        {/* Change Password Form */}
                        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-600" />
                                تغيير كلمة المرور
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        كلمة المرور الحالية
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                                        required
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        كلمة المرور الجديدة
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                                        required
                                        minLength="6"
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        تأكيد كلمة المرور الجديدة
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                                        required
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Account Settings */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-emerald-600" />
                                إعدادات الحساب
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Bell className="w-5 h-5 text-slate-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-slate-900">الإشعارات البريدية</p>
                                            <p className="text-sm text-slate-600">تلقي تحديثات عن العروض الجديدة والطلبات</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notificationSettings.emailNotifications}
                                            onChange={() => handleNotificationChange('emailNotifications')}
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Bell className="w-5 h-5 text-slate-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-slate-900">رسائل التطبيق</p>
                                            <p className="text-sm text-slate-600">إشعارات داخل التطبيق عن النشاطات</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notificationSettings.appNotifications}
                                            onChange={() => handleNotificationChange('appNotifications')}
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Eye className="w-5 h-5 text-slate-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-slate-900">العرض العام للملف</p>
                                            <p className="text-sm text-slate-600">عرض معلومات مصنعك في السوق</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notificationSettings.publicProfile}
                                            onChange={() => handleNotificationChange('publicProfile')}
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;