import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Factory, Building2, MapPin, Phone, Mail, User, Package, Recycle, ArrowLeft, CheckCircle, ChevronRight, Upload, X, PartyPopper, Sparkles, Trophy, Star } from 'lucide-react'
import './Registration.css'
import logo from '../assets/logooo1ecov.png'
import registrationBg from '../assets/registration-background.png'

function Registration({ onRegister }) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const fileInputRef = useRef(null)
  
  useEffect(() => {
    console.log('🔍 State updated: currentStep =', currentStep, 'showWelcomeModal =', showWelcomeModal)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log('🎯 handleSubmit: محاولة الإرسال من الخطوة', currentStep)
    
    if (currentStep !== 4) {
      console.error('❌ خطأ: لا يمكن الإرسال إلا من الخطوة 4، الخطوة الحالية:', currentStep)
      alert('يجب أن تكون في الخطوة الرابعة لتأكيد التسجيل')
      return
    }
    
    console.log('✅ تم التحقق: في الخطوة 4، يمكن المتابعة')
    
    const userData = {
      id: Date.now(),
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
      verified: false
    }
    
    console.log('📦 بيانات المستخدم المحفوظة:', userData)
    
    if (onRegister) {
      onRegister(userData)
    }
    
    console.log('🎊 عرض الـ Welcome Modal بعد التسجيل الناجح')
    
    setTimeout(() => {
      setShowWelcomeModal(true)
      console.log('✅ تم تعيين showWelcomeModal = true')
    }, 100)
  }

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
                  <div className={`h-full ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500`} style={{width: currentStep >= 2 ? '100%' : '0%'}}></div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 flex-1">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                  {currentStep > 2 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-white font-bold text-xl">2</span>}
                </div>
                <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                  <div className={`h-full ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500`} style={{width: currentStep >= 3 ? '100%' : '0%'}}></div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-1">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                  {currentStep > 3 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-white font-bold text-xl">3</span>}
                </div>
                <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                  <div className={`h-full ${currentStep >= 4 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500`} style={{width: currentStep >= 4 ? '100%' : '0%'}}></div>
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
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">
                      هاتف المالك
                    </label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
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
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">
                      مساحة المصنع (م²)
                    </label>
                    <input
                      type="number"
                      name="factorySize"
                      value={formData.factorySize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
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
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-4">
                    أنواع النفايات <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wasteTypeOptions.map((waste, i) => (
                      <label key={i} className="flex items-center gap-2 p-3 border-2 border-slate-300 rounded-xl hover:border-emerald-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.wasteTypes.includes(waste.value)}
                          onChange={() => handleWasteTypeChange(waste.value)}
                          className="w-5 h-5"
                        />
                        <span>{waste.label}</span>
                      </label>
                    ))}
                  </div>
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
                        className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                        required
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
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-2">
                    وصف تفصيلي
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                  ></textarea>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">شعار المصنع</h3>
                  {formData.logoPreview ? (
                    <div className="text-center">
                      <div className="relative inline-block">
                        <img src={formData.logoPreview} alt="Logo" className="w-48 h-48 object-contain rounded-xl border-4 border-white" />
                        <button
                          type="button"
                          onClick={handleLogoRemove}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center cursor-pointer hover:bg-emerald-100"
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
                      <p>انقر لرفع الشعار</p>
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                    <h4 className="font-bold mb-3">معلومات المصنع</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>الاسم:</strong> {formData.factoryName}</div>
                      <div><strong>الصناعة:</strong> {formData.industryType}</div>
                      <div><strong>المحافظة:</strong> {formData.location}</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold mb-3">تفاصيل النفايات</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>الأنواع:</strong> {formData.wasteTypes.length} نوع</div>
                      <div><strong>الكمية:</strong> {formData.wasteAmount} {formData.wasteUnit}</div>
                      <div><strong>التكرار:</strong> {formData.frequency}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  السابق
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2"
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
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl flex items-center gap-2"
                >
                  <CheckCircle className="w-6 h-6" />
                  ✅ تأكيد التسجيل
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registration