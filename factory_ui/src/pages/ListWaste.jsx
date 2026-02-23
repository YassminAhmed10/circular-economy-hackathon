import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Trash2, DollarSign, FileText, Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const API_BASE_URL = 'https://localhost:54464';

function ListWaste() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        type: '',
        typeEn: '',
        amount: '',
        unit: 'kg',
        price: '',
        description: '',
        category: '',
        imageUrl: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [imagePreview, setImagePreview] = useState(null);

    // Check if user is logged in
    useEffect(() => {
        checkUserAuth();
    }, []);

    const checkUserAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success && data.data) {
                setUser(data.data);
                if (!data.data.factory?.verified) {
                    setError('يجب توثيق المصنع أولاً قبل إضافة إعلانات');
                }
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error('Error checking auth:', err);
            setError('فشل في التحقق من بيانات المستخدم');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Auto-fill English name based on Arabic selection
        if (e.target.name === 'type') {
            const typeMap = {
                'بلاستيك PET': 'PET Plastic',
                'بلاستيك HDPE': 'HDPE Plastic',
                'بلاستيك PVC': 'PVC Plastic',
                'بلاستيك PP': 'PP Plastic',
                'حديد خردة': 'Scrap Iron',
                'ألومنيوم': 'Aluminum',
                'نحاس': 'Copper',
                'كرتون': 'Cardboard',
                'ورق أبيض': 'White Paper',
                'زجاج شفاف': 'Clear Glass',
                'زجاج ملون': 'Colored Glass',
                'خشب طبيعي': 'Natural Wood',
                'أخشاب MDF': 'MDF Wood',
                'زيوت مستعملة': 'Used Oil',
                'إطارات مستعملة': 'Used Tires'
            };

            if (typeMap[e.target.value]) {
                setFormData(prev => ({ ...prev, typeEn: typeMap[e.target.value] }));
            }
        }

        // Set category based on type
        if (e.target.name === 'type') {
            const categoryMap = {
                'بلاستيك PET': 'plastic',
                'بلاستيك HDPE': 'plastic',
                'بلاستيك PVC': 'plastic',
                'بلاستيك PP': 'plastic',
                'حديد خردة': 'metal',
                'ألومنيوم': 'metal',
                'نحاس': 'metal',
                'كرتون': 'paper',
                'ورق أبيض': 'paper',
                'زجاج شفاف': 'glass',
                'زجاج ملون': 'glass',
                'خشب طبيعي': 'wood',
                'أخشاب MDF': 'wood',
                'زيوت مستعملة': 'chemical',
                'إطارات مستعملة': 'rubber'
            };

            if (categoryMap[e.target.value]) {
                setFormData(prev => ({ ...prev, category: categoryMap[e.target.value] }));
            }
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.factory?.verified) {
            setError('يجب توثيق المصنع أولاً قبل إضافة إعلانات');
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');

            // Prepare data for API (matching backend expected format)
            const wasteData = {
                type: formData.type,
                typeEn: formData.typeEn,
                amount: parseFloat(formData.amount),
                unit: formData.unit,
                price: parseFloat(formData.price),
                description: formData.description,
                category: formData.category,
                imageUrl: imagePreview || null
            };

            console.log('Sending to API:', wasteData);

            const response = await fetch(`${API_BASE_URL}/api/Marketplace/waste-listings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(wasteData)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.success) {
                setSuccess('تم إنشاء الإعلان بنجاح!');
                // Reset form
                setFormData({
                    type: '',
                    typeEn: '',
                    amount: '',
                    unit: 'kg',
                    price: '',
                    description: '',
                    category: '',
                    imageUrl: ''
                });
                setImagePreview(null);
                setCurrentStep(1);

                // Redirect to my listings after 2 seconds
                setTimeout(() => {
                    navigate('/my-listings');
                }, 2000);
            } else {
                setError(data.message || 'فشل في إنشاء الإعلان');
            }
        } catch (err) {
            console.error('Error creating listing:', err);
            setError(err.message || 'فشل في الاتصال بالخادم');
        } finally {
            setSubmitting(false);
        }
    };

    const wasteTypes = [
        { value: 'بلاستيك PET', label: 'بلاستيك PET' },
        { value: 'بلاستيك HDPE', label: 'بلاستيك HDPE' },
        { value: 'بلاستيك PVC', label: 'بلاستيك PVC' },
        { value: 'بلاستيك PP', label: 'بلاستيك PP' },
        { value: 'حديد خردة', label: 'حديد خردة' },
        { value: 'ألومنيوم', label: 'ألومنيوم' },
        { value: 'نحاس', label: 'نحاس' },
        { value: 'كرتون', label: 'كرتون' },
        { value: 'ورق أبيض', label: 'ورق أبيض' },
        { value: 'زجاج شفاف', label: 'زجاج شفاف' },
        { value: 'زجاج ملون', label: 'زجاج ملون' },
        { value: 'خشب طبيعي', label: 'خشب طبيعي' },
        { value: 'أخشاب MDF', label: 'أخشاب MDF' },
        { value: 'زيوت مستعملة', label: 'زيوت مستعملة' },
        { value: 'إطارات مستعملة', label: 'إطارات مستعملة' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-slate-600">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">إضافة نفايات جديدة</h1>
                    <p className="text-slate-600">قم بإضافة نفاياتك الصناعية للبيع في السوق</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === currentStep ? 'bg-emerald-600 text-white' :
                                    step < currentStep ? 'bg-emerald-100 text-emerald-600' :
                                        'bg-slate-200 text-slate-500'
                                }`}>
                                {step < currentStep ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <span className="font-bold">{step}</span>
                                )}
                            </div>
                            {step < 3 && (
                                <div className={`h-1 w-16 ${step < currentStep ? 'bg-emerald-600' : 'bg-slate-300'
                                    }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <p className="text-emerald-700">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-red-700 font-medium">خطأ</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Factory Status Warning */}
                {user && !user.factory?.verified && (
                    <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-amber-700 font-medium">المصنع غير موثق</p>
                            <p className="text-amber-600 text-sm mt-1">
                                يجب توثيق المصنع أولاً قبل إضافة إعلانات. يرجى التواصل مع إدارة المنصة.
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <Package className="w-6 h-6 text-emerald-600" />
                                معلومات أساسية
                            </h2>

                            <div>
                                <label className="block text-slate-700 font-medium mb-3">
                                    نوع النفايات
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
                                    {wasteTypes.map((type) => (
                                        <button
                                            type="button"
                                            key={type.value}
                                            onClick={() => setFormData({ ...formData, type: type.value })}
                                            className={`p-3 rounded-lg border-2 transition-all ${formData.type === type.value
                                                    ? 'border-emerald-600 bg-emerald-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <Trash2 className="w-5 h-5 mb-1 text-slate-600" />
                                                <span className="text-sm font-medium">{type.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        الاسم بالإنجليزية
                                    </label>
                                    <input
                                        type="text"
                                        name="typeEn"
                                        value={formData.typeEn}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                                        placeholder="e.g., PET Plastic"
                                        required
                                        dir="ltr"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        الفئة
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                                        required
                                    >
                                        <option value="">اختر الفئة</option>
                                        <option value="plastic">بلاستيك</option>
                                        <option value="metal">معادن</option>
                                        <option value="paper">ورق</option>
                                        <option value="glass">زجاج</option>
                                        <option value="wood">خشب</option>
                                        <option value="textile">نسيج</option>
                                        <option value="chemical">كيماويات</option>
                                        <option value="rubber">مطاط</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        الكمية
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                                            placeholder="100"
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                        <select
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleChange}
                                            className="w-24 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                                            required
                                        >
                                            <option value="kg">كجم</option>
                                            <option value="ton">طن</option>
                                            <option value="liter">لتر</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">
                                        السعر
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                                            placeholder="1500"
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                        <span className="w-24 px-4 py-3 bg-slate-100 border-2 border-slate-300 rounded-lg text-slate-600 text-center">
                                            جنيه
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all"
                                    disabled={!formData.type || !formData.typeEn || !formData.category || !formData.amount || !formData.price}
                                >
                                    التالي
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-emerald-600" />
                                الوصف والصور
                            </h2>

                            <div>
                                <label className="block text-slate-700 font-medium mb-2">
                                    الوصف التفصيلي
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                                    placeholder="صف النفايات بالتفصيل: الحالة، النقاء، طريقة التخزين، أي شروط خاصة..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-3">
                                    صور النفايات (اختياري)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {imagePreview && (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    {!imagePreview && (
                                        <label className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition-all">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                            <span className="text-sm text-slate-600">رفع صورة</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all"
                                >
                                    السابق
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(3)}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all"
                                    disabled={!formData.description}
                                >
                                    التالي
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                                مراجعة وتأكيد
                            </h2>

                            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-6">
                                <h3 className="text-lg font-bold text-emerald-900 mb-4">تفاصيل الإعلان</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-slate-600 mb-1">نوع النفايات</p>
                                            <p className="font-medium">{formData.type || 'لم يتم تحديد'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-600 mb-1">الاسم بالإنجليزية</p>
                                            <p className="font-medium">{formData.typeEn || 'لم يتم تحديد'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-600 mb-1">الفئة</p>
                                            <p className="font-medium">{formData.category || 'لم يتم تحديد'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-600 mb-1">الكمية</p>
                                            <p className="font-medium">
                                                {formData.amount ? `${formData.amount} ${formData.unit}` : 'لم يتم تحديد'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-slate-600 mb-1">السعر</p>
                                            <p className="font-medium">
                                                {formData.price ? `${formData.price} جنيه / ${formData.unit}` : 'لم يتم تحديد'}
                                            </p>
                                        </div>
                                    </div>

                                    {formData.description && (
                                        <div>
                                            <p className="text-slate-600 mb-1">الوصف</p>
                                            <p className="font-medium">{formData.description}</p>
                                        </div>
                                    )}

                                    {imagePreview && (
                                        <div>
                                            <p className="text-slate-600 mb-2">الصورة</p>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all"
                                >
                                    السابق
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !user?.factory?.verified}
                                    className={`px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center gap-2 ${(submitting || !user?.factory?.verified) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            جاري النشر...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            نشر الإعلان
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Tips Section */}
                <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        نصائح لنشر إعلان ناجح
                    </h3>
                    <ul className="space-y-2 text-blue-800">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
                            <span>اختر نوع النفايات بدقة لضمان وصول الإعلان للمشترين المناسبين</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
                            <span>حدد الكمية والسعر بدقة، مع ذكر حالة النفايات (نظيفة، مختلطة، معالجة)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
                            <span>أضف وصفاً واضحاً يشمل مواصفات الجودة وطريقة التخزين المتاحة</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
                            <span>صور واضحة تزيد من فرص البيع وتجذب المشترين الجادين</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ListWaste;