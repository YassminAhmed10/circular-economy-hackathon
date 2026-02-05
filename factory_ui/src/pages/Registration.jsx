import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Factory, Building2, MapPin, Phone, Mail, User, FileText, Trash2, Package, Recycle, ArrowLeft, CheckCircle, ChevronRight, Upload, Calendar, Users, Globe, FileCheck, Shield, Image as ImageIcon, X, PartyPopper, Sparkles, Trophy, Star } from 'lucide-react'
import './Registration.css'
import logo from '../assets/logooo1ecov.png'
import registrationBg from '../assets/registration-background.png'

function Registration({ onRegister }) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    // معلومات المصنع الأساسية
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
    
    // معلومات إضافية
    establishmentYear: new Date().getFullYear(),
    numberOfEmployees: '',
    factorySize: '',
    website: '',
    
    // تفاصيل النفايات
    wasteTypes: [],
    wasteAmount: '',
    wasteUnit: 'ton',
    frequency: 'monthly',
    description: '',
    
    // شعار المصنع
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
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'بور سعيد',
    'السويس',
    'دمياط',
    'الدقهلية',
    'الشرقية',
    'القليوبية',
    'كفر الشيخ',
    'الغربية',
    'المنوفية',
    'البحيرة',
    'الإسماعيلية',
    'الأقصر',
    'أسوان',
    'أسيوط',
    'بني سويف',
    'الفيوم',
    'المنيا',
    'الوادي الجديد',
    'البحر الأحمر',
    'شمال سيناء',
    'جنوب سيناء',
    'مطروح'
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
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Create user data
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
    
    // Call onRegister if provided
    if (onRegister) {
      onRegister(userData)
    }
    
    console.log('تم إرسال البيانات:', formData)
    
    // Show welcome modal instead of navigating immediately
    setShowWelcomeModal(true)
  }

  const handleContinueToDashboard = () => {
    setShowWelcomeModal(false)
    // Add slight delay for better UX
    setTimeout(() => {
      navigate('/dashboard')
    }, 300)
  }

  // Welcome Modal Component
  const WelcomeModal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fadeIn" dir="rtl">
      <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-slideUp">
        {/* Confetti Effects */}
        <div className="absolute top-4 right-4 text-yellow-400 animate-bounce">
          <PartyPopper className="w-8 h-8" />
        </div>
        <div className="absolute top-4 left-4 text-emerald-400 animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        
        {/* Modal Content */}
        <div className="relative p-10 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl animate-scaleIn">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          {/* Welcome Title */}
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            أهلاً وسهلاً بك في <span className="text-emerald-600">ECOv</span>! 🎉
          </h2>
          
          {/* Factory Name */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-emerald-200">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-700">{formData.factoryName}</span>
            </div>
            <p className="text-slate-600">تم تسجيل مصنعك بنجاح في منصة الاقتصاد الدائري</p>
          </div>
          
          {/* Welcome Message */}
          <div className="space-y-4 mb-8 text-slate-700">
            <p className="text-lg">
              <span className="font-bold text-emerald-600">تهانينا!</span> أنت الآن جزء من مجتمع صانعي التغيير في الصناعة المصرية.
            </p>
            <p className="text-lg">
              مصنعك <span className="font-bold">{formData.factoryName}</span> أصبح عضوًا فعالاً في شبكة الاقتصاد الدائري.
            </p>
          </div>
          
          {/* Next Steps */}
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
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleContinueToDashboard}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              الانتقال إلى لوحة التحكم
            </button>
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="px-8 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <X className="w-5 h-5" />
              البقاء في هذه الصفحة
            </button>
          </div>
          
          {/* Help Text */}
          <p className="mt-6 text-sm text-slate-500">
            يمكنك الوصول إلى لوحة التحكم في أي وقت من خلال النقر على شعار ECOv في أعلى الصفحة
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${registrationBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Welcome Modal */}
      {showWelcomeModal && <WelcomeModal />}
      
      {/* طبقة شفافة فوق الخلفية */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900/70 via-blue-900/50 to-emerald-900/60">
        {/* Header */}
        <nav className="bg-black/80 backdrop-blur-md shadow-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex flex-row-reverse items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <img src={logo} alt="ECOv Logo" className="h-14 w-auto object-contain" />
                </div>
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
                  className="px-6 py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 font-bold rounded-xl transition-all shadow-lg transform hover:scale-105"
                >
                  تسجيل الدخول
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Progress Steps */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4 flex-1">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 1 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                  {currentStep > 1 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-white font-bold text-xl">1</span>}
                </div>
                <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                  <div className={`h-full ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500 rounded-full`} style={{width: currentStep >= 2 ? '100%' : '0%'}}></div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 flex-1">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                  {currentStep > 2 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-white font-bold text-xl">2</span>}
                </div>
                <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                  <div className={`h-full ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500 rounded-full`} style={{width: currentStep >= 3 ? '100%' : '0%'}}></div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-1">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                  {currentStep > 3 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-white font-bold text-xl">3</span>}
                </div>
                <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                  <div className={`h-full ${currentStep >= 4 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500 rounded-full`} style={{width: currentStep >= 4 ? '100%' : '0%'}}></div>
                </div>
              </div>
              
              <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentStep >= 4 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all shadow-lg`}>
                {currentStep > 4 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-white font-bold text-xl">4</span>}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Step 1: معلومات المصنع الأساسية */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-emerald-600" />
                      اسم المصنع الرسمي
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="factoryName"
                      value={formData.factoryName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="مصنع الأمل للصناعات الغذائية"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Factory className="w-6 h-6 text-emerald-600" />
                      نوع الصناعة
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="industryType"
                      value={formData.industryType}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      required
                    >
                      <option value="">اختر نوع الصناعة</option>
                      {industryTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                      المحافظة
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      required
                    >
                      <option value="">اختر المحافظة</option>
                      {locations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                      العنوان التفصيلي
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="المنطقة الصناعية، الشارع، رقم المبنى"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Phone className="w-6 h-6 text-emerald-600" />
                      رقم الهاتف الرئيسي
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="01xxxxxxxxx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Mail className="w-6 h-6 text-emerald-600" />
                      البريد الإلكتروني الرسمي
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="factory@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <User className="w-6 h-6 text-emerald-600" />
                      اسم المالك / المدير المسؤول
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="أحمد محمد عبدالله"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Phone className="w-6 h-6 text-emerald-600" />
                      هاتف المالك / المدير
                    </label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: معلومات إضافية */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-emerald-600" />
                      الرقم الضريبي
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="taxNumber"
                      value={formData.taxNumber}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="xxx-xxx-xxx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <FileCheck className="w-6 h-6 text-emerald-600" />
                      رقم السجل التجاري
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="xxxxxx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                      سنة التأسيس
                    </label>
                    <input
                      type="number"
                      name="establishmentYear"
                      value={formData.establishmentYear}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="2020"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Users className="w-6 h-6 text-emerald-600" />
                      عدد الموظفين
                    </label>
                    <input
                      type="number"
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-emerald-600" />
                      مساحة المصنع (م²)
                    </label>
                    <input
                      type="number"
                      name="factorySize"
                      value={formData.factorySize}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Globe className="w-6 h-6 text-emerald-600" />
                      الموقع الإلكتروني
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: تفاصيل النفايات */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <label className="block text-slate-700 font-bold text-lg mb-4 flex items-center gap-2">
                    <Trash2 className="w-6 h-6 text-emerald-600" />
                    أنواع النفايات المنتجة
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wasteTypeOptions.map((waste, index) => (
                      <label key={index} className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.wasteTypes.includes(waste.value)}
                          onChange={() => handleWasteTypeChange(waste.value)}
                          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-slate-700">{waste.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Package className="w-6 h-6 text-emerald-600" />
                      الكمية الشهرية المتوقعة
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="wasteAmount"
                        value={formData.wasteAmount}
                        onChange={handleChange}
                        className="flex-1 px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                        placeholder="100"
                        required
                      />
                      <select
                        name="wasteUnit"
                        value={formData.wasteUnit}
                        onChange={handleChange}
                        className="w-40 px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      >
                        <option value="kg">كيلوجرام</option>
                        <option value="ton">طن</option>
                        <option value="liter">لتر</option>
                        <option value="cubic">متر مكعب</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                      <Recycle className="w-6 h-6 text-emerald-600" />
                      تكرار الإنتاج
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg"
                      required
                    >
                      <option value="daily">يومي</option>
                      <option value="weekly">أسبوعي</option>
                      <option value="monthly">شهري</option>
                      <option value="seasonal">موسمي</option>
                      <option value="continuous">مستمر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold text-lg mb-3 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-emerald-600" />
                    وصف تفصيلي للنفايات (اختياري)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none transition-all text-lg resize-none"
                    placeholder="أضف أي تفاصيل إضافية عن النفايات المنتجة، مثل: حالة النفايات، طرق التخزين، أي معالجات مسبقة..."
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step 4: رفع الشعار والمراجعة */}
            {currentStep === 4 && (
              <div className="space-y-8">
                {/* رفع الشعار */}
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
                    <ImageIcon className="w-8 h-8" />
                    شعار المصنع
                  </h3>
                  
                  {formData.logoPreview ? (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img 
                          src={formData.logoPreview} 
                          alt="شعار المصنع" 
                          className="w-64 h-64 object-contain rounded-xl border-4 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={handleLogoRemove}
                          className="absolute -top-2 -left-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <p className="mt-4 text-emerald-700 font-medium">
                        تم رفع الشعار بنجاح
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="border-3 border-dashed border-emerald-300 rounded-2xl p-12 text-center cursor-pointer hover:bg-emerald-100 transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Upload className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                      <p className="text-lg text-slate-700 mb-2">
                        انقر لرفع شعار المصنع
                      </p>
                      <p className="text-slate-500 text-sm">
                        (JPEG, PNG - الحد الأقصى 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* مراجعة البيانات */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-6 h-6" />
                      معلومات المصنع
                    </h3>
                    <div className="space-y-3 text-slate-700">
                      <div><span className="font-semibold">الاسم:</span> {formData.factoryName}</div>
                      <div><span className="font-semibold">الصناعة:</span> {formData.industryType}</div>
                      <div><span className="font-semibold">المحافظة:</span> {formData.location}</div>
                      <div><span className="font-semibold">العنوان:</span> {formData.address}</div>
                      <div><span className="font-semibold">الهاتف:</span> {formData.phone}</div>
                      <div><span className="font-semibold">البريد:</span> {formData.email}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <Trash2 className="w-6 h-6" />
                      تفاصيل النفايات
                    </h3>
                    <div className="space-y-3 text-slate-700">
                      <div><span className="font-semibold">الأنواع:</span> {formData.wasteTypes.map(type => wasteTypeOptions.find(w => w.value === type)?.label).join(', ')}</div>
                      <div><span className="font-semibold">الكمية:</span> {formData.wasteAmount} {formData.wasteUnit}</div>
                      <div><span className="font-semibold">التكرار:</span> {formData.frequency}</div>
                    </div>
                  </div>
                </div>

                {/* شروط الاستخدام */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-amber-900 mb-2">شروط الاستخدام والخصوصية</h3>
                      <p className="text-amber-800">
                        بالضغط على تأكيد التسجيل، فإنك توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بمنصة ECOv. 
                        سيتم التحقق من بيانات مصنعك خلال 48 ساعة من قبل فريقنا.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12 pt-8 border-t-2 border-slate-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-3 shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                  السابق
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center gap-3 shadow-lg hover:shadow-xl"
                >
                  التالي
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <CheckCircle className="w-6 h-6" />
                  تأكيد التسجيل
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mt-8 text-center">
            <p className="text-slate-700 text-lg">
              لديك حساب بالفعل؟{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-all text-lg"
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registration