/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Factory, Building2, MapPin, Phone, Mail, User, Package, Recycle, ArrowLeft, CheckCircle, ChevronRight, Upload, X, PartyPopper, Sparkles, Trophy, Star } from 'lucide-react'
import './Registration.css'
import logo from '../assets/logooo1ecov.png'
import registrationBg from '../assets/registration-background.png'

// 🔥 API Configuration - نفس اللي في Login
const API_CONFIG = {
    BASE_URL: "https://localhost:54464",  // تأكد من نفس الرابط في Login.jsx
    ENDPOINTS: {
        REGISTER: "/api/Register/factory",
        TEST: "/test",
        HEALTH: "/health"
    }
};

function Registration({ onRegister }) {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [showWelcomeModal, setShowWelcomeModal] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [backendStatus, setBackendStatus] = useState('checking')
    const fileInputRef = useRef(null)

    useEffect(() => {
        console.log('🔍 State updated: currentStep =', currentStep, 'showWelcomeModal =', showWelcomeModal)
        checkBackendConnection();
    }, [currentStep, showWelcomeModal])

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
        numberOfEmployees: '',
        factorySize: '',
        website: '',
        wasteTypes: [],
        wasteAmount: '',
        wasteUnit: 'ton',
        frequency: 'monthly',
        description: '',
        factoryLogo: null,
        logoPreview: null,
    })

    const industryTypes = [
        'صناعات غذائية',
        'نسيج وملابس',
        'كيماويات',
        'معادن وتصنيع',
        'بلاستيك',
        'ورق وطباعة',
        'زجاج',
        'إلكترونيات',
        'مستحضرات تجميل',
        'أدوية',
        'أخرى'
    ]

    const wasteTypeOptions = [
        { value: 'organic', label: 'نفايات عضوية' },
        { value: 'plastic', label: 'بلاستيك' },
        { value: 'metal', label: 'معادن' },
        { value: 'paper', label: 'ورق وكرتون' },
        { value: 'glass', label: 'زجاج' },
        { value: 'electronic', label: 'إلكترونيات' },
        { value: 'chemical', label: 'نفايات كيميائية' },
        { value: 'textile', label: 'نفايات نسيج' },
        { value: 'wood', label: 'أخشاب' },
        { value: 'oil', label: 'زيوت مستعملة' }
    ]

    const locations = [
        'القاهرة', 'الجيزة', 'الإسكندرية', 'بور سعيد', 'السويس', 'دمياط',
        'الدقهلية', 'الشرقية', 'القليوبية', 'كفر الشيخ', 'الغربية', 'المنوفية',
        'البحيرة', 'الإسماعيلية', 'الأقصر', 'أسوان', 'أسيوط', 'بني سويف',
        'الفيوم', 'المنيا', 'الوادي الجديد', 'البحر الأحمر', 'شمال سيناء',
        'جنوب سيناء', 'مطروح'
    ]

    // 🔥 دالة اختبار اتصال Backend
    const checkBackendConnection = async () => {
        try {
            setBackendStatus('checking');

            const endpoints = [
                `${API_CONFIG.BASE_URL}/`,
                `${API_CONFIG.BASE_URL}/health`,
                `${API_CONFIG.BASE_URL}/test`,
                `${API_CONFIG.BASE_URL}/swagger`
            ];

            let isConnected = false;

            for (const endpoint of endpoints) {
                try {
                    console.log(`🔍 اختبار اتصال: ${endpoint}`);
                    const response = await fetch(endpoint, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                        mode: 'cors',
                        credentials: 'omit'
                    });

                    if (response.ok) {
                        console.log(`✅ ${endpoint}: متصل`);
                        isConnected = true;
                        break;
                    }
                } catch (error) {
                    console.log(`❌ ${endpoint}:`, error.message);
                }
            }

            // إذا فشل HTTPS، جرب HTTP
            if (!isConnected && API_CONFIG.BASE_URL.startsWith('https://')) {
                const httpUrl = API_CONFIG.BASE_URL.replace('https://', 'http://');
                console.log(`🔄 محاولة HTTP: ${httpUrl}`);

                try {
                    const response = await fetch(httpUrl + '/health');
                    if (response.ok) {
                        console.log(`✅ ${httpUrl}: متصل عبر HTTP`);
                        isConnected = true;
                        API_CONFIG.BASE_URL = httpUrl; // تحديث للاستخدام اللاحق
                    }
                } catch (error) {
                    console.log(`❌ ${httpUrl}: فشل أيضاً`);
                }
            }

            setBackendStatus(isConnected ? 'connected' : 'disconnected');
            return isConnected;

        } catch (error) {
            console.error('❌ خطأ في اختبار الاتصال:', error);
            setBackendStatus('disconnected');
            return false;
        }
    };

    // 🔥 دالة POST موحدة
    const apiPost = async (endpoint, data) => {
        const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;

        console.log(`📤 POST Request to: ${url}`);
        console.log('📦 Data:', data);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
                mode: 'cors',
                credentials: 'omit'
            });

            console.log(`📊 Response Status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Server Error (${response.status}):`, errorText);

                let errorMessage = `HTTP ${response.status}: `;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += errorJson.message || errorText;
                    if (errorJson.errors) {
                        errorMessage += `\n${errorJson.errors.join(', ')}`;
                    }
                } catch {
                    errorMessage += errorText || 'Unknown error';
                }

                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log(`✅ POST Success:`, responseData);
            return responseData;

        } catch (error) {
            console.error(`❌ API Error for ${url}:`, error);
            throw error;
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleWasteTypeChange = (wasteType) => {
        setFormData(prev => ({
            ...prev,
            wasteTypes: prev.wasteTypes.includes(wasteType)
                ? prev.wasteTypes.filter(type => type !== wasteType)
                : [...prev.wasteTypes, wasteType]
        }))
    }

    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت')
                return
            }

            if (!file.type.startsWith('image/')) {
                alert('الرجاء اختيار صورة فقط')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    factoryLogo: file,
                    logoPreview: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleLogoRemove = () => {
        setFormData(prev => ({
            ...prev,
            factoryLogo: null,
            logoPreview: null
        }))
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleNext = () => {
        console.log('🔄 handleNext: الانتقال من الخطوة', currentStep, 'إلى', currentStep + 1)

        if (showWelcomeModal) {
            console.log('🚫 إخفاء الـ Welcome Modal قبل الانتقال')
            setShowWelcomeModal(false)
        }

        setIsTransitioning(true)

        setTimeout(() => {
            if (currentStep < 4) {
                setCurrentStep(prevStep => prevStep + 1)
            }
            setIsTransitioning(false)
        }, 50)
    }

    const handleBack = () => {
        console.log('🔙 handleBack: العودة من الخطوة', currentStep, 'إلى', currentStep - 1)

        if (showWelcomeModal) {
            console.log('🚫 إخفاء الـ Welcome Modal قبل الرجوع')
            setShowWelcomeModal(false)
        }

        setIsTransitioning(true)

        setTimeout(() => {
            if (currentStep > 1) {
                setCurrentStep(prevStep => prevStep - 1)
            }
            setIsTransitioning(false)
        }, 50)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log('🎯 handleSubmit: محاولة الإرسال من الخطوة', currentStep)

        if (currentStep !== 4) {
            console.error('❌ خطأ: لا يمكن الإرسال إلا من الخطوة 4، الخطوة الحالية:', currentStep)
            alert('يجب أن تكون في الخطوة الرابعة لتأكيد التسجيل')
            return
        }

        console.log('✅ تم التحقق: في الخطوة 4، يمكن المتابعة')

        // 🔥 اختبار الاتصال أولاً
        if (backendStatus !== 'connected') {
            const isConnected = await checkBackendConnection();
            if (!isConnected) {
                alert(`❌ لا يمكن الاتصال بالخادم.\n\nيرجى:\n1. تشغيل مشروع ASP.NET Core\n2. فتح ${API_CONFIG.BASE_URL} في المتصفح\n3. التحقق من اتصال الشبكة`);
                return;
            }
        }

        setIsSubmitting(true)
        setSubmitError('')

        try {
            // 🔥 إعداد البيانات بنفس تنسيق Login
            const factoryData = {
                FactoryName: formData.factoryName.trim(),
                FactoryNameEn: formData.factoryName.trim(),
                IndustryType: formData.industryType.trim(),
                Location: formData.location.trim(),
                Address: formData.address.trim(),
                Phone: formatPhoneNumber(formData.phone),
                Email: formData.email.trim().toLowerCase(),
                Website: formData.website?.trim() || '',
                OwnerName: formData.ownerName.trim(),
                OwnerPhone: formatPhoneNumber(formData.ownerPhone),
                OwnerEmail: formData.email.trim().toLowerCase(),
                TaxNumber: formData.taxNumber.trim(),
                RegistrationNumber: formData.registrationNumber.trim(),
                EstablishmentYear: parseInt(formData.establishmentYear) || new Date().getFullYear(),
                NumberOfEmployees: parseInt(formData.numberOfEmployees) || 1,
                FactorySize: parseFloat(formData.factorySize) || 100,
                ProductionCapacity: (parseFloat(formData.factorySize) || 100) * 10,
                WasteTypes: formData.wasteTypes.map(wasteCode => {
                    const wasteType = wasteTypeOptions.find(w => w.value === wasteCode)
                    return {
                        WasteCode: wasteCode,
                        Amount: parseFloat(formData.wasteAmount) || 0,
                        Unit: formData.wasteUnit,
                        Frequency: formData.frequency,
                        Description: formData.description || `نفايات ${wasteType?.label || wasteCode}`
                    }
                }),
                WasteAmount: parseFloat(formData.wasteAmount) || 0,
                WasteUnit: formData.wasteUnit,
                Frequency: formData.frequency,
                Description: formData.description || '',
                LogoBase64: formData.logoPreview ? formData.logoPreview.split(',')[1] : null
            }

            console.log('📦 تحضير البيانات للإرسال:', factoryData)
            console.log('🔗 Endpoint:', API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.REGISTER)

            // 🔥 إرسال البيانات باستخدام apiPost
            console.log('🚀 إرسال البيانات إلى الخادم...')
            const response = await apiPost(API_CONFIG.ENDPOINTS.REGISTER, factoryData)

            console.log('✅ استجابة الخادم:', response)

            if (response.success) {
                const userData = {
                    id: response.data?.factoryId || Date.now(),
                    factoryName: formData.factoryName,
                    email: formData.email,
                    ownerName: formData.ownerName,
                    industryType: formData.industryType,
                    location: formData.location,
                    phone: formData.phone,
                    logo: formData.logoPreview,
                    registrationNumber: formData.registrationNumber,
                    taxNumber: formData.taxNumber,
                    establishmentYear: formData.establishmentYear,
                    numberOfEmployees: formData.numberOfEmployees,
                    factorySize: formData.factorySize,
                    wasteTypes: formData.wasteTypes,
                    wasteAmount: formData.wasteAmount,
                    wasteUnit: formData.wasteUnit,
                    verified: false,
                    status: 'Pending',
                    registrationDate: new Date().toISOString(),
                    apiResponse: response.data
                }

                console.log('📦 بيانات المستخدم المحفوظة محلياً:', userData)

                localStorage.setItem('ecov_user', JSON.stringify(userData))
                localStorage.setItem('ecov_factory_id', response.data?.factoryId || userData.id)
                localStorage.setItem('ecov_factory_token', response.data?.verificationToken || '')

                if (onRegister) {
                    onRegister(userData)
                }

                console.log('🎊 عرض الـ Welcome Modal بعد التسجيل الناجح')

                setTimeout(() => {
                    setShowWelcomeModal(true)
                    console.log('✅ تم تعيين showWelcomeModal = true')
                }, 100)

            } else {
                const errorMessage = response.errors?.join(', ') || response.message || 'فشل التسجيل'
                setSubmitError(errorMessage)
                alert(`خطأ في التسجيل: ${errorMessage}`)
            }

        } catch (error) {
            console.error('❌ خطأ في التسجيل:', error)

            let errorMessage = 'فشل التسجيل. يرجى المحاولة مرة أخرى.';

            if (error.message.includes('HTTP 400')) {
                errorMessage = 'بيانات غير صالحة. يرجى مراجعة المدخلات.';
            } else if (error.message.includes('HTTP 409')) {
                errorMessage = 'المصنع مسجل مسبقاً (البريد الإلكتروني أو الرقم الضريبي أو رقم السجل موجود)';
            } else if (error.message.includes('HTTP 500')) {
                errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = `لا يمكن الاتصال بالخادم.\n\nيرجى:\n1. تشغيل Backend على ${API_CONFIG.BASE_URL}\n2. التحقق من CORS\n3. فتح ${API_CONFIG.BASE_URL} في المتصفح`;
            } else {
                errorMessage = error.message || 'حدث خطأ غير متوقع';
            }

            setSubmitError(errorMessage);
            alert(`❌ خطأ: ${errorMessage}`);

        } finally {
            setIsSubmitting(false)
        }
    }

    // 🔥 دالة مساعدة لتنسيق رقم الهاتف
    const formatPhoneNumber = (phone) => {
        const digits = phone.replace(/\D/g, '');

        if (digits.startsWith('966') && digits.length === 12) {
            return `+${digits}`;
        } else if (digits.startsWith('05') && digits.length === 10) {
            return `+966${digits.substring(1)}`;
        } else if (digits.length === 9 && digits.startsWith('5')) {
            return `+966${digits}`;
        }

        return phone;
    }

    // 🔥 دالة اختبار الاتصال المباشر
    const testDirectConnection = async () => {
        try {
            setIsSubmitting(true);
            const response = await fetch(`${API_CONFIG.BASE_URL}/test`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                const data = await response.text();
                alert(`✅ الاتصال ناجح!\n\n${data.substring(0, 200)}`);
            } else {
                alert(`❌ استجابة غير ناجحة: ${response.status}`);
            }
        } catch (error) {
            alert(`❌ خطأ في الاتصال: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinueToDashboard = () => {
        console.log('🚀 الانتقال إلى لوحة التحكم')
        setShowWelcomeModal(false)
        setTimeout(() => {
            navigate('/dashboard')
        }, 300)
    }

    const WelcomeModal = () => {
        console.log('🎭 WelcomeModal: التصيير، showWelcomeModal =', showWelcomeModal, 'currentStep =', currentStep)

        if (!showWelcomeModal) {
            console.log('🚫 WelcomeModal: لا يتم التصيير لأن showWelcomeModal = false')
            return null
        }

        return (
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn"
                dir="rtl"
                onClick={() => {
                    console.log('❌ WelcomeModal: النقر خارج الـ Modal لإغلاقه')
                    setShowWelcomeModal(false)
                }}
            >
                <div
                    className="relative bg-gradient-to-br from-white to-slate-50 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-slideUp"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute top-4 right-4 text-yellow-400 animate-bounce">
                        <PartyPopper className="w-8 h-8" />
                    </div>
                    <div className="absolute top-4 left-4 text-emerald-400 animate-pulse">
                        <Sparkles className="w-8 h-8" />
                    </div>

                    <div className="relative p-10 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl animate-scaleIn">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            أهلاً وسهلاً بك في <span className="text-emerald-600">ECOv</span>! 🎉
                        </h2>

                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-emerald-200">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <Building2 className="w-6 h-6 text-emerald-600" />
                                <span className="text-2xl font-bold text-emerald-700">{formData.factoryName}</span>
                            </div>
                            <p className="text-slate-600">تم تسجيل مصنعك بنجاح في منصة الاقتصاد الدائري</p>
                        </div>

                        <div className="space-y-4 mb-8 text-slate-700">
                            <p className="text-lg">
                                <span className="font-bold text-emerald-600">تهانينا!</span> أنت الآن جزء من مجتمع صانعي التغيير في الصناعة المصرية.
                            </p>
                            <p className="text-lg">
                                مصنعك <span className="font-bold">{formData.factoryName}</span> أصبح عضوًا فعالاً في شبكة الاقتصاد الدائري.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
                            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center justify-center gap-2">
                                <Trophy className="w-5 h-5" />
                                ماذا يمكنك أن تفعل الآن؟
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-right">
                                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-100">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium">إضافة نفايات للبيع</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-100">
                                    <Recycle className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm font-medium">استكشاف سوق النفايات</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-100">
                                    <Factory className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm font-medium">التواصل مع الشركاء</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-100">
                                    <Star className="w-5 h-5 text-amber-600" />
                                    <span className="text-sm font-medium">تحسين تقييم مصنعك</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleContinueToDashboard}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3"
                            >
                                <Sparkles className="w-5 h-5" />
                                🚀 الانتقال إلى لوحة التحكم
                            </button>
                            <button
                                onClick={() => {
                                    console.log('❌ البقاء في هذه الصفحة')
                                    setShowWelcomeModal(false)
                                }}
                                className="px-8 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <X className="w-5 h-5" />
                                البقاء في هذه الصفحة
                            </button>
                        </div>

                        <p className="mt-6 text-sm text-slate-500">
                            يمكنك الوصول إلى لوحة التحكم في أي وقت من خلال النقر على شعار ECOv
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    console.log('🎬 Component rendering: currentStep =', currentStep, 'showWelcomeModal =', showWelcomeModal, 'isTransitioning =', isTransitioning)

    return (
        <div className="min-h-screen" style={{
            backgroundImage: `url(${registrationBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}>
            {showWelcomeModal && currentStep === 4 && <WelcomeModal />}

            {isTransitioning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-slate-900/70 via-blue-900/50 to-emerald-900/60">
                <nav className="bg-black/80 backdrop-blur-md shadow-xl sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-2">
                        <div className="flex flex-row-reverse items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={logo} alt="ECOv Logo" className="h-14 w-auto object-contain" />
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border-2 border-white/30 backdrop-blur-sm flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    الرئيسية
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 font-bold rounded-xl transition-all shadow-lg"
                                >
                                    تسجيل الدخول
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 1 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                                    {currentStep > 1 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-white font-bold text-xl">1</span>}
                                </div>
                                <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                                    <div className={`h-full ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500`} style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 flex-1">
                                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                                    {currentStep > 2 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-white font-bold text-xl">2</span>}
                                </div>
                                <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                                    <div className={`h-full ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500`} style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 flex-1">
                                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                                    {currentStep > 3 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-white font-bold text-xl">3</span>}
                                </div>
                                <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                                    <div className={`h-full ${currentStep >= 4 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500`} style={{ width: currentStep >= 4 ? '100%' : '0%' }}></div>
                                </div>
                            </div>

                            <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 4 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                                <span className="text-white font-bold text-xl">4</span>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-slate-900 mb-2">
                                {currentStep === 1 && 'معلومات المصنع الأساسية'}
                                {currentStep === 2 && 'معلومات إضافية'}
                                {currentStep === 3 && 'تفاصيل النفايات'}
                                {currentStep === 4 && 'رفع الشعار والمراجعة'}
                            </h2>
                            <p className="text-slate-600 text-lg">
                                {currentStep === 1 && 'أدخل المعلومات الأساسية لمصنعك'}
                                {currentStep === 2 && 'أضف معلومات إضافية عن مصنعك'}
                                {currentStep === 3 && 'حدد أنواع وكميات النفايات المنتجة'}
                                {currentStep === 4 && 'رفع شعار المصنع ومراجعة البيانات'}
                            </p>
                        </div>
                    </div>

                    {/* 🔥 قسم اختبار الاتصال */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6 border-2 border-emerald-200">
                        <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                            🔧 اختبار وإعدادات الاتصال
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-700 mb-2">
                                    <span className="font-bold">حالة الخادم:</span>{' '}
                                    {backendStatus === 'connected' ? (
                                        <span className="text-emerald-600 font-bold">✅ متصل</span>
                                    ) : backendStatus === 'disconnected' ? (
                                        <span className="text-red-600 font-bold">❌ غير متصل</span>
                                    ) : (
                                        <span className="text-yellow-600 font-bold">🔄 جاري التحقق...</span>
                                    )}
                                </p>
                                <p className="text-sm text-slate-600">
                                    <span className="font-bold">Endpoint:</span>{' '}
                                    <code className="bg-slate-100 px-2 py-1 rounded">
                                        {API_CONFIG.BASE_URL}{API_CONFIG.ENDPOINTS.REGISTER}
                                    </code>
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={checkBackendConnection}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                    disabled={isSubmitting}
                                >
                                    🔄 اختبار الاتصال
                                </button>
                                <button
                                    onClick={testDirectConnection}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    disabled={isSubmitting}
                                >
                                    🧪 اختبار مباشر
                                </button>
                                <button
                                    onClick={() => window.open(API_CONFIG.BASE_URL, '_blank')}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                >
                                    🌐 فتح Backend
                                </button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            <Building2 className="inline w-5 h-5 mr-2" />
                                            اسم المصنع <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="factoryName"
                                            value={formData.factoryName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                            placeholder="أدخل اسم المصنع كاملاً"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            <Factory className="inline w-5 h-5 mr-2" />
                                            نوع الصناعة <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="industryType"
                                            value={formData.industryType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                        >
                                            <option value="">اختر نوع الصناعة</option>
                                            {industryTypes.map((type, i) => <option key={i} value={type}>{type}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            <MapPin className="inline w-5 h-5 mr-2" />
                                            المحافظة <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                        >
                                            <option value="">اختر المحافظة</option>
                                            {locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            العنوان <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                            placeholder="العنوان التفصيلي للمصنع"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            <Phone className="inline w-5 h-5 mr-2" />
                                            الهاتف <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                            placeholder="مثال: 01012345678"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            <Mail className="inline w-5 h-5 mr-2" />
                                            البريد الإلكتروني <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                            placeholder="example@factory.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            <User className="inline w-5 h-5 mr-2" />
                                            اسم المالك <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                            placeholder="اسم المالك أو المدير المسؤول"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            هاتف المالك <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="ownerPhone"
                                            value={formData.ownerPhone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                            placeholder="مثال: 01012345678"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            الرقم الضريبي <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="taxNumber"
                                            value={formData.taxNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                            placeholder="الرقم الضريبي للمصنع"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            رقم السجل التجاري <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="registrationNumber"
                                            value={formData.registrationNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                            placeholder="رقم السجل التجاري"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            سنة التأسيس
                                        </label>
                                        <input
                                            type="number"
                                            name="establishmentYear"
                                            value={formData.establishmentYear}
                                            onChange={handleChange}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            عدد الموظفين
                                        </label>
                                        <input
                                            type="number"
                                            name="numberOfEmployees"
                                            value={formData.numberOfEmployees}
                                            onChange={handleChange}
                                            min="1"
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            placeholder="عدد الموظفين"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            مساحة المصنع (م²) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="factorySize"
                                            value={formData.factorySize}
                                            onChange={handleChange}
                                            min="1"
                                            step="0.01"
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                            placeholder="المساحة بالمتر المربع"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            الموقع الإلكتروني
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-4">
                                        أنواع النفايات المنتجة <span className="text-red-500">*</span>
                                        <span className="block text-sm font-normal text-slate-500 mt-1">اختر جميع أنواع النفايات التي ينتجها مصنعك</span>
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {wasteTypeOptions.map((waste, i) => (
                                            <label key={i} className={`flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.wasteTypes.includes(waste.value) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.wasteTypes.includes(waste.value)}
                                                    onChange={() => handleWasteTypeChange(waste.value)}
                                                    className="w-5 h-5 text-emerald-600"
                                                />
                                                <span>{waste.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {formData.wasteTypes.length === 0 && (
                                        <p className="text-red-500 text-sm mt-2">* يجب اختيار نوع واحد على الأقل من النفايات</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            الكمية الشهرية <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                name="wasteAmount"
                                                value={formData.wasteAmount}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                                required
                                                placeholder="الكمية"
                                            />
                                            <select
                                                name="wasteUnit"
                                                value={formData.wasteUnit}
                                                onChange={handleChange}
                                                className="w-32 px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            >
                                                <option value="kg">كجم</option>
                                                <option value="ton">طن</option>
                                                <option value="liter">لتر</option>
                                                <option value="m3">م³</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2">
                                            التكرار <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="frequency"
                                            value={formData.frequency}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                            required
                                        >
                                            <option value="daily">يومي</option>
                                            <option value="weekly">أسبوعي</option>
                                            <option value="monthly">شهري</option>
                                            <option value="quarterly">ربع سنوي</option>
                                            <option value="yearly">سنوي</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-bold mb-2">
                                        وصف تفصيلي للنفايات
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                                        placeholder="وصف تفصيلي لنوعية النفايات، طريقة التخزين، الحالة، الخ..."
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        شعار المصنع (اختياري)
                                    </h3>
                                    <p className="text-slate-600 mb-4">قم برفع شعار المصنع لتمييزه في المنصة. المسموح: الصور فقط، الحد الأقصى: 5 ميجابايت</p>
                                    {formData.logoPreview ? (
                                        <div className="text-center">
                                            <div className="relative inline-block">
                                                <img
                                                    src={formData.logoPreview}
                                                    alt="Logo"
                                                    className="w-48 h-48 object-contain rounded-xl border-4 border-white shadow-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleLogoRemove}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors"
                                                    title="إزالة الشعار"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-2">يمكنك تغيير الشعار بالنقر على زر الإزالة</p>
                                        </div>
                                    ) : (
                                        <div
                                            className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center cursor-pointer hover:bg-emerald-100 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleLogoUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                                            <p className="text-emerald-700 font-medium">انقر لرفع شعار المصنع</p>
                                            <p className="text-sm text-slate-500 mt-1">PNG, JPG, GIF - الحد الأقصى 5 ميجابايت</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                                        <h4 className="font-bold mb-3 text-slate-800">ملخص معلومات المصنع</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><strong>الاسم:</strong> <span>{formData.factoryName || 'غير محدد'}</span></div>
                                            <div className="flex justify-between"><strong>الصناعة:</strong> <span>{formData.industryType || 'غير محدد'}</span></div>
                                            <div className="flex justify-between"><strong>المحافظة:</strong> <span>{formData.location || 'غير محدد'}</span></div>
                                            <div className="flex justify-between"><strong>رقم السجل:</strong> <span>{formData.registrationNumber || 'غير محدد'}</span></div>
                                            <div className="flex justify-between"><strong>الرقم الضريبي:</strong> <span>{formData.taxNumber || 'غير محدد'}</span></div>
                                            <div className="flex justify-between"><strong>الموظفين:</strong> <span>{formData.numberOfEmployees || 'غير محدد'}</span></div>
                                            <div className="flex justify-between"><strong>المساحة:</strong> <span>{formData.factorySize ? `${formData.factorySize} م²` : 'غير محدد'}</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                        <h4 className="font-bold mb-3 text-blue-800">ملخص النفايات</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><strong>عدد الأنواع:</strong> <span>{formData.wasteTypes.length} نوع</span></div>
                                            <div className="flex justify-between"><strong>الأنواع المختارة:</strong>
                                                <span className="text-right">
                                                    {formData.wasteTypes.map(w => wasteTypeOptions.find(opt => opt.value === w)?.label).join(', ') || 'لا توجد'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between"><strong>الكمية:</strong> <span>{formData.wasteAmount || '0'} {formData.wasteUnit}</span></div>
                                            <div className="flex justify-between"><strong>التكرار:</strong> <span>{formData.frequency === 'monthly' ? 'شهري' :
                                                formData.frequency === 'daily' ? 'يومي' :
                                                    formData.frequency === 'weekly' ? 'أسبوعي' :
                                                        formData.frequency === 'quarterly' ? 'ربع سنوي' : 'سنوي'}</span></div>
                                        </div>
                                    </div>
                                </div>

                                {submitError && (
                                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                        <div className="flex items-center gap-2 text-red-700 mb-2">
                                            <X className="w-5 h-5" />
                                            <span className="font-bold">خطأ في التسجيل</span>
                                        </div>
                                        <p className="text-red-600 whitespace-pre-line">{submitError}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {isSubmitting && (
                            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                                    <span className="text-blue-700 font-medium">جاري تسجيل المصنع في قاعدة البيانات، يرجى الانتظار...</span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between mt-8 pt-6 border-t-2">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold flex items-center gap-2 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    السابق
                                </button>
                            )}

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="ml-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isTransitioning}
                                >
                                    {isTransitioning ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            جاري الانتقال...
                                        </span>
                                    ) : (
                                        <>
                                            التالي
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="ml-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    disabled={isSubmitting || backendStatus === 'disconnected'}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            جاري التسجيل...
                                        </>
                                    ) : backendStatus === 'disconnected' ? (
                                        <>
                                            <X className="w-6 h-6" />
                                            ⚠️ الخادم غير متصل
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-6 h-6" />
                                            ✅ تأكيد التسجيل والانضمام للمنصة
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 ${backendStatus === 'connected' ? 'bg-emerald-100 text-emerald-800' : backendStatus === 'disconnected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'} text-sm rounded-full`}>
                            <div className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500' : backendStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <span>حالة الخادم: {
                                backendStatus === 'connected' ? '✅ متصل' :
                                    backendStatus === 'disconnected' ? '❌ غير متصل' :
                                        '🔄 جاري التحقق...'
                            }</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1">Endpoint: {API_CONFIG.BASE_URL}{API_CONFIG.ENDPOINTS.REGISTER}</p>
                        <p className="text-slate-400 text-xs mt-1">
                            إذا كان Backend لا يعمل، قم بتشغيل مشروع ASP.NET Core ثم اضغط "اختبار الاتصال"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registration