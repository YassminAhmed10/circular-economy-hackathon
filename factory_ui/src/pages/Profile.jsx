import React, { useState, useEffect, useRef } from 'react';
import {
    User, Building2, Mail, Phone, MapPin, FileText, Edit2, Save, Camera,
    Shield, Calendar, CheckCircle, X, Upload, Factory, Award, Package,
    ShoppingCart, TrendingUp, Globe, Lock, Eye, EyeOff, AlertCircle,
    Map, Clock, Hash, FileSignature, CalendarDays, Scale, Truck,
    Droplet, Trees, Flame, Cigarette, FlaskConical, Wrench,
    BadgePercent, Globe2, Box, Layers, List, Activity, Users
} from 'lucide-react';
import { profileAPI } from '../services/api';

function Profile({ user: initialUser, onUpdateUser, lang = 'ar', dark = false }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        factoryName: '',
        industryType: '',
        location: '',
        address: '',
        phone: '',
        email: '',
        ownerName: '',
        ownerPhone: '',
        taxNumber: '',
        registrationNumber: '',
        establishmentYear: new Date().getFullYear(),
        productionCapacity: '',
        productionUnit: 'ton',
        mainProducts: '',
        registrationPurpose: [],
        wastesForSale: [],
        purchaseRequests: [],
        logoPreview: null,
        status: 'Pending',
        joinedDate: '',
        rating: 4.5,
        totalReviews: 0,
        activeListings: 0,
        completedOrders: 0,
    });

    // Translation object
    const t = {
        ar: {
            profile: 'الملف الشخصي',
            editProfile: 'تعديل الملف',
            saveChanges: 'حفظ التغييرات',
            cancel: 'إلغاء',
            factoryName: 'اسم المصنع',
            industryType: 'نوع الصناعة',
            location: 'المحافظة',
            address: 'العنوان',
            phone: 'الهاتف',
            email: 'البريد الإلكتروني',
            ownerName: 'المالك',
            ownerPhone: 'هاتف المالك',
            taxNumber: 'الرقم الضريبي',
            registrationNumber: 'السجل التجاري',
            establishmentYear: 'سنة التأسيس',
            productionCapacity: 'الطاقة الإنتاجية',
            mainProducts: 'المنتجات الرئيسية',
            productionUnit: 'الوحدة',
            ton: 'طن',
            kg: 'كجم',
            registrationPurpose: 'الغرض من التسجيل',
            sell: 'بيع',
            buy: 'شراء',
            sellWaste: 'بيع المخلفات',
            buyWaste: 'شراء المخلفات',
            wasteTypes: 'أنواع المخلفات',
            availableQuantity: 'الكمية المتاحة',
            requiredQuantity: 'الكمية المطلوبة',
            frequency: 'التكرار',
            wasteDescription: 'الوصف',
            buyingPurpose: 'الغرض من الشراء',
            daily: 'يومي',
            weekly: 'أسبوعي',
            monthly: 'شهري',
            quarterly: 'ربع سنوي',
            notSpecified: 'غير محدد',
            verified: 'موثق',
            pending: 'قيد المراجعة',
            joinDate: 'تاريخ الانضمام',
            listings: 'الإعلانات',
            orders: 'الطلبات',
            rating: 'التقييم',
            reviews: 'مراجعات',
            stats: 'الإحصائيات',
            basicInfo: 'المعلومات الأساسية',
            legalProduction: 'المعلومات القانونية والإنتاج',
            wasteInfo: 'معلومات المخلفات',
            security: 'الأمان',
            accountSettings: 'إعدادات الحساب',
            changePassword: 'تغيير كلمة المرور',
            currentPassword: 'كلمة المرور الحالية',
            newPassword: 'كلمة المرور الجديدة',
            confirmPassword: 'تأكيد كلمة المرور',
            updatePassword: 'تحديث كلمة المرور',
            emailNotifications: 'الإشعارات البريدية',
            appNotifications: 'إشعارات التطبيق',
            publicProfile: 'الملف العام',
            deleteAccount: 'حذف الحساب',
            loading: 'جاري التحميل...',
            error: 'حدث خطأ',
        },
        en: {
            profile: 'Profile',
            editProfile: 'Edit Profile',
            saveChanges: 'Save Changes',
            cancel: 'Cancel',
            factoryName: 'Factory Name',
            industryType: 'Industry Type',
            location: 'Governorate',
            address: 'Address',
            phone: 'Phone',
            email: 'Email',
            ownerName: 'Owner Name',
            ownerPhone: 'Owner Phone',
            taxNumber: 'Tax Number',
            registrationNumber: 'Registration Number',
            establishmentYear: 'Est. Year',
            productionCapacity: 'Production Capacity',
            mainProducts: 'Main Products',
            productionUnit: 'Unit',
            ton: 'ton',
            kg: 'kg',
            registrationPurpose: 'Registration Purpose',
            sell: 'Sell',
            buy: 'Buy',
            sellWaste: 'Sell Waste',
            buyWaste: 'Buy Waste',
            wasteTypes: 'Waste Types',
            availableQuantity: 'Available Quantity',
            requiredQuantity: 'Required Quantity',
            frequency: 'Frequency',
            wasteDescription: 'Description',
            buyingPurpose: 'Purpose',
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            quarterly: 'Quarterly',
            notSpecified: 'Not specified',
            verified: 'Verified',
            pending: 'Pending',
            joinDate: 'Joined',
            listings: 'Listings',
            orders: 'Orders',
            rating: 'Rating',
            reviews: 'Reviews',
            stats: 'Stats',
            basicInfo: 'Basic Information',
            legalProduction: 'Legal & Production',
            wasteInfo: 'Waste Information',
            security: 'Security',
            accountSettings: 'Account Settings',
            changePassword: 'Change Password',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            updatePassword: 'Update Password',
            emailNotifications: 'Email Notifications',
            appNotifications: 'App Notifications',
            publicProfile: 'Public Profile',
            deleteAccount: 'Delete Account',
            loading: 'Loading...',
            error: 'Error',
        }
    };

    const locale = lang === 'ar' ? 'ar' : 'en';
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    // جلب البيانات عند التحميل
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await profileAPI.getProfile();
            const data = response.data;
            setFormData(prev => ({
                ...prev,
                ...data,
                logoPreview: data.logoUrl, // تطابق اسم الحقل
                registrationPurpose: data.registrationPurpose || [],
                wastesForSale: data.wastesForSale || [],
                purchaseRequests: data.purchaseRequests || [],
            }));
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logoPreview: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // إعداد البيانات للإرسال (حذف logoPreview إذا كان Base64? قد تحتاج لرفع منفصل)
            const updateData = {
                ...formData,
                logoUrl: formData.logoPreview // إذا كان Base64 قد يحتاج معالجة
            };
            await profileAPI.updateProfile(updateData);
            onUpdateUser?.(updateData);
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        // TODO: تنفيذ تغيير كلمة المرور عبر API
        setShowPasswordForm(false);
    };

    // دوال مساعدة
    const getFrequencyLabel = (freq) => {
        const map = { daily: t[locale].daily, weekly: t[locale].weekly, monthly: t[locale].monthly, quarterly: t[locale].quarterly };
        return map[freq] || freq;
    };

    if (loading) return <div className="flex justify-center items-center h-screen">{t[locale].loading}</div>;
    if (error) return <div className="text-red-600 text-center p-8">{t[locale].error}: {error}</div>;

    return (
        <div style={{ background: dark ? '#0f172a' : '#f8fafc', color: dark ? '#f1f5f9' : '#0f172a', minHeight: '100vh', direction: dir }}>
            <div className="w-full px-4 py-6" style={{ maxWidth: '1600px', margin: '0 auto' }}>
                {/* رأس الصفحة */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#10b981' }}>
                            {formData.factoryName || t[locale].factoryName}
                        </h1>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full"
                                style={{
                                    background: formData.status === 'Active' ? (dark ? '#065f46' : '#d1fae5') : (dark ? '#92400e' : '#fef3c7'),
                                    color: formData.status === 'Active' ? (dark ? '#a7f3d0' : '#065f46') : (dark ? '#fbbf24' : '#92400e')
                                }}>
                                {formData.status === 'Active' ? <CheckCircle size={14} /> : <Shield size={14} />}
                                {formData.status === 'Active' ? t[locale].verified : t[locale].pending}
                            </span>
                            <span className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>
                                <Calendar size={14} className="inline ml-1" />
                                {t[locale].joinDate}: {new Date(formData.joinedDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-md"
                                style={{ background: '#10b981', color: '#fff' }}
                            >
                                <Edit2 size={18} />
                                {t[locale].editProfile}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSubmit}
                                    className="px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-md"
                                    style={{ background: '#10b981', color: '#fff' }}
                                >
                                    <Save size={18} />
                                    {t[locale].saveChanges}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 border"
                                    style={{ borderColor: dark ? '#334155' : '#e2e8f0', color: dark ? '#94a3b8' : '#475569' }}
                                >
                                    <X size={18} />
                                    {t[locale].cancel}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* شبكة 3 أعمدة */}
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* العمود الأول: الشعار والمعلومات الأساسية */}
                    <div className="lg:col-span-1 xl:col-span-1">
                        <div className="rounded-xl shadow-sm border p-6" style={{ background: dark ? '#1e293b' : '#ffffff', borderColor: dark ? '#334155' : '#e2e8f0' }}>
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    {formData.logoPreview ? (
                                        <img
                                            src={formData.logoPreview}
                                            alt="logo"
                                            className="w-32 h-32 rounded-full object-cover border-4"
                                            style={{ borderColor: '#10b981' }}
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ background: dark ? '#2d3a4f' : '#f1f5f9' }}>
                                            <Factory size={48} style={{ color: '#10b981' }} />
                                        </div>
                                    )}
                                    {isEditing && (
                                        <>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute bottom-0 right-0 p-2 rounded-full shadow-md"
                                                style={{ background: '#10b981', color: '#fff' }}
                                            >
                                                <Camera size={16} />
                                            </button>
                                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                                        </>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold mb-1" style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{formData.factoryName}</h2>
                                <p className="text-sm mb-4" style={{ color: dark ? '#94a3b8' : '#475569' }}>{formData.industryType}</p>
                            </div>

                            {/* بطاقات إحصائية سريعة */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-lg text-center" style={{ background: dark ? '#2d3a4f' : '#f1f5f9' }}>
                                    <Package size={20} className="mx-auto mb-1" style={{ color: '#10b981' }} />
                                    <div className="font-bold" style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{formData.activeListings}</div>
                                    <div className="text-xs" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].listings}</div>
                                </div>
                                <div className="p-3 rounded-lg text-center" style={{ background: dark ? '#2d3a4f' : '#f1f5f9' }}>
                                    <ShoppingCart size={20} className="mx-auto mb-1" style={{ color: '#10b981' }} />
                                    <div className="font-bold" style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{formData.completedOrders}</div>
                                    <div className="text-xs" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].orders}</div>
                                </div>
                                <div className="p-3 rounded-lg text-center" style={{ background: dark ? '#2d3a4f' : '#f1f5f9' }}>
                                    <TrendingUp size={20} className="mx-auto mb-1" style={{ color: '#10b981' }} />
                                    <div className="font-bold" style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{formData.rating}</div>
                                    <div className="text-xs" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].rating}</div>
                                </div>
                                <div className="p-3 rounded-lg text-center" style={{ background: dark ? '#2d3a4f' : '#f1f5f9' }}>
                                    <Users size={20} className="mx-auto mb-1" style={{ color: '#10b981' }} />
                                    <div className="font-bold" style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{formData.totalReviews}</div>
                                    <div className="text-xs" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].reviews}</div>
                                </div>
                            </div>

                            {/* قائمة المعلومات الأساسية */}
                            <div className="space-y-3">
                                {[
                                    { icon: User, label: t[locale].ownerName, value: formData.ownerName },
                                    { icon: Mail, label: t[locale].email, value: formData.email },
                                    { icon: Phone, label: t[locale].phone, value: formData.phone },
                                    { icon: MapPin, label: t[locale].location, value: formData.location },
                                    { icon: Map, label: t[locale].address, value: formData.address },
                                    { icon: Hash, label: t[locale].taxNumber, value: formData.taxNumber },
                                    { icon: FileSignature, label: t[locale].registrationNumber, value: formData.registrationNumber },
                                    { icon: CalendarDays, label: t[locale].establishmentYear, value: formData.establishmentYear },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <item.icon size={18} style={{ color: '#10b981', marginTop: 3 }} />
                                        <div className="flex-1">
                                            <div className="text-xs" style={{ color: dark ? '#94a3b8' : '#475569' }}>{item.label}</div>
                                            <div style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{item.value || t[locale].notSpecified}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* الأعمدة الأخرى */}
                    <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                        {/* بطاقة الإنتاج */}
                        <div className="rounded-xl shadow-sm border p-6" style={{ background: dark ? '#1e293b' : '#ffffff', borderColor: dark ? '#334155' : '#e2e8f0' }}>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Factory size={20} style={{ color: '#10b981' }} />
                                {t[locale].legalProduction}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].productionCapacity}</div>
                                    <div className="font-medium" style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>
                                        {formData.productionCapacity || '0'} {formData.productionUnit === 'ton' ? t[locale].ton : t[locale].kg}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].mainProducts}</div>
                                    <div className="whitespace-pre-line" style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>
                                        {formData.mainProducts || t[locale].notSpecified}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* بيع المخلفات */}
                        {formData.registrationPurpose.includes('sell') && formData.wastesForSale.length > 0 && (
                            <div className="rounded-xl shadow-sm border p-6" style={{ background: dark ? '#1e293b' : '#ffffff', borderColor: dark ? '#334155' : '#e2e8f0' }}>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Package size={20} style={{ color: '#10b981' }} />
                                    {t[locale].sellWaste}
                                </h3>
                                {formData.wastesForSale.map((waste, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b last:border-0" style={{ borderColor: dark ? '#334155' : '#e2e8f0' }}>
                                        <div>
                                            <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].wasteTypes}</div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <span className="px-2 py-1 text-xs rounded-full" style={{ background: dark ? '#2d3a4f' : '#f1f5f9', color: dark ? '#f1f5f9' : '#0f172a' }}>
                                                    {waste.wasteTypeName}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].availableQuantity}</div>
                                            <div style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>
                                                {waste.quantity} {waste.unit === 'ton' ? t[locale].ton : t[locale].kg}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].frequency}</div>
                                            <div style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{getFrequencyLabel(waste.frequency)}</div>
                                        </div>
                                        {waste.description && (
                                            <div className="md:col-span-2">
                                                <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].wasteDescription}</div>
                                                <div style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{waste.description}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* شراء المخلفات */}
                        {formData.registrationPurpose.includes('buy') && formData.purchaseRequests.length > 0 && (
                            <div className="rounded-xl shadow-sm border p-6" style={{ background: dark ? '#1e293b' : '#ffffff', borderColor: dark ? '#334155' : '#e2e8f0' }}>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <ShoppingCart size={20} style={{ color: '#10b981' }} />
                                    {t[locale].buyWaste}
                                </h3>
                                {formData.purchaseRequests.map((purchase, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b last:border-0" style={{ borderColor: dark ? '#334155' : '#e2e8f0' }}>
                                        <div>
                                            <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].wasteTypes}</div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <span className="px-2 py-1 text-xs rounded-full" style={{ background: dark ? '#2d3a4f' : '#f1f5f9', color: dark ? '#f1f5f9' : '#0f172a' }}>
                                                    {purchase.wasteTypeName}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].requiredQuantity}</div>
                                            <div style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>
                                                {purchase.quantity} {purchase.unit === 'ton' ? t[locale].ton : t[locale].kg}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].frequency}</div>
                                            <div style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{getFrequencyLabel(purchase.frequency)}</div>
                                        </div>
                                        {purchase.purpose && (
                                            <div className="md:col-span-2">
                                                <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].buyingPurpose}</div>
                                                <div style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{purchase.purpose}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* تغيير كلمة المرور */}
                        <div className="rounded-xl shadow-sm border p-6" style={{ background: dark ? '#1e293b' : '#ffffff', borderColor: dark ? '#334155' : '#e2e8f0' }}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Lock size={20} style={{ color: '#10b981' }} />
                                    {t[locale].security}
                                </h3>
                                <button
                                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                                    className="text-sm underline"
                                    style={{ color: '#10b981' }}
                                >
                                    {showPasswordForm ? t[locale].cancel : t[locale].changePassword}
                                </button>
                            </div>
                            {showPasswordForm && (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-1" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].currentPassword}</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            style={{ background: dark ? '#2d3a4f' : '#fff', borderColor: dark ? '#334155' : '#e2e8f0', color: dark ? '#f1f5f9' : '#0f172a' }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].newPassword}</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            style={{ background: dark ? '#2d3a4f' : '#fff', borderColor: dark ? '#334155' : '#e2e8f0', color: dark ? '#f1f5f9' : '#0f172a' }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1" style={{ color: dark ? '#94a3b8' : '#475569' }}>{t[locale].confirmPassword}</label>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            style={{ background: dark ? '#2d3a4f' : '#fff', borderColor: dark ? '#334155' : '#e2e8f0', color: dark ? '#f1f5f9' : '#0f172a' }}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-lg"
                                            style={{ background: '#10b981', color: '#fff' }}
                                        >
                                            {t[locale].updatePassword}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordForm(false)}
                                            className="px-4 py-2 rounded-lg border"
                                            style={{ borderColor: dark ? '#334155' : '#e2e8f0', color: dark ? '#94a3b8' : '#475569' }}
                                        >
                                            {t[locale].cancel}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* إعدادات الحساب */}
                        <div className="rounded-xl shadow-sm border p-6" style={{ background: dark ? '#1e293b' : '#ffffff', borderColor: dark ? '#334155' : '#e2e8f0' }}>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Shield size={20} style={{ color: '#10b981' }} />
                                {t[locale].accountSettings}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{t[locale].emailNotifications}</span>
                                    <input type="checkbox" defaultChecked className="toggle" style={{ accentColor: '#10b981' }} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{t[locale].appNotifications}</span>
                                    <input type="checkbox" defaultChecked className="toggle" style={{ accentColor: '#10b981' }} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{t[locale].publicProfile}</span>
                                    <input type="checkbox" defaultChecked className="toggle" style={{ accentColor: '#10b981' }} />
                                </div>
                            </div>
                            <div className="mt-6">
                                <button className="px-4 py-2 border rounded-lg" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                                    {t[locale].deleteAccount}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;