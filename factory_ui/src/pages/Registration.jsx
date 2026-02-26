import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Factory, Building2, MapPin, Phone, Mail, User, Package, Recycle, 
  ArrowLeft, CheckCircle, ChevronRight, Upload, X, PartyPopper, 
  Sparkles, Trophy, Star, ShoppingCart, TrendingUp, Leaf, Droplets,
  Sun, Shield, Award, BarChart3, Globe, Zap, Heart, Users,
  Settings, HelpCircle, Bell, Menu, ChevronDown, Home, LogIn
} from 'lucide-react'
import './Registration.css'
import logo from '../assets/ecovnew.png'
import registrationBg from '../assets/ecovlogin.png'

function Registration({ onRegister, language: propLanguage, onLanguageChange }) {
  const navigate = useNavigate()
  
  // إدارة اللغة داخلياً
  const [currentLanguage, setCurrentLanguage] = useState(propLanguage || 'en')
  
  useEffect(() => {
    if (propLanguage) {
      setCurrentLanguage(propLanguage)
    }
  }, [propLanguage])

  const handleLanguageToggle = () => {
    const newLang = currentLanguage === 'ar' ? 'en' : 'ar'
    setCurrentLanguage(newLang)
    if (onLanguageChange) {
      onLanguageChange(newLang)
    }
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }

  const [currentStep, setCurrentStep] = useState(1)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const fileInputRef = useRef(null)

  // Translations
  const translations = {
    ar: {
      home: 'الرئيسية',
      login: 'تسجيل الدخول',
      haveAccount: 'لديك حساب بالفعل؟',
      joinTitle: 'انضم إلى',
      joinHighlight: 'ثورة الاقتصاد الدائري',
      joinSubtitle: 'سجل مصنعك الآن وكن جزءاً من شبكة إعادة التدوير الأكبر في مصر',
      step: 'الخطوة',
      step1: 'معلومات المصنع',
      step2: 'الإنتاج والقانون',
      step3: 'المخلفات',
      step4: 'المراجعة',
      step1Title: 'معلومات المصنع الأساسية',
      step1Subtitle: 'أدخل المعلومات الأساسية لمصنعك للبدء',
      step2Title: 'معلومات إضافية والإنتاج',
      step2Subtitle: 'أضف التفاصيل القانونية ومعلومات الإنتاج',
      step3Title: 'إدارة المخلفات',
      step3Subtitle: 'حدد هدفك من التسجيل وتفاصيل المخلفات',
      step4Title: 'المراجعة النهائية',
      step4Subtitle: 'راجع بياناتك وارفع شعار المصنع',
      factoryName: 'اسم المصنع',
      industryType: 'نوع الصناعة',
      location: 'المحافظة',
      address: 'العنوان التفصيلي',
      phone: 'هاتف المصنع',
      email: 'البريد الإلكتروني',
      ownerName: 'اسم المالك/المدير',
      ownerPhone: 'هاتف المالك/المدير',
      factoryNamePlaceholder: 'مثال: مصنع النيل للصناعات',
      industryTypePlaceholder: 'اختر نوع الصناعة',
      locationPlaceholder: 'اختر المحافظة',
      addressPlaceholder: 'المنطقة الصناعية - شارع الصناعة',
      phonePlaceholder: '0123456789',
      emailPlaceholder: 'info@factory.com',
      ownerNamePlaceholder: 'أحمد محمد علي',
      ownerPhonePlaceholder: '0101234567',
      legalInfo: 'المعلومات القانونية',
      taxNumber: 'الرقم الضريبي',
      registrationNumber: 'رقم السجل التجاري',
      establishmentYear: 'سنة التأسيس',
      productionInfo: 'معلومات الإنتاج',
      mainProducts: 'المنتجات الرئيسية',
      mainProductsPlaceholder: 'اذكر أهم المنتجات التي ينتجها مصنعك...',
      monthlyCapacity: 'الطاقة الإنتاجية الشهرية',
      registrationPurpose: 'ما هو هدفك من التسجيل؟',
      sellWaste: 'بيع المخلفات',
      sellWasteDesc: 'أريد بيع المخلفات الصناعية',
      buyWaste: 'شراء المخلفات',
      buyWasteDesc: 'أريد شراء مخلفات كمواد خام',
      wasteTypes: 'أنواع المخلفات',
      availableQuantity: 'الكمية المتاحة شهرياً',
      requiredQuantity: 'الكمية المطلوبة شهرياً',
      frequency: 'التكرار',
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      description: 'وصف تفصيلي',
      descriptionPlaceholder: 'وصف حالة ونوعية المخلفات...',
      purpose: 'الغرض من الشراء',
      purposePlaceholder: 'كيف ستستخدم المخلفات في الإنتاج؟',
      uploadLogo: 'شعار المصنع',
      uploadClick: 'انقر لرفع الشعار',
      uploadHint: 'PNG, JPG, WEBP - حد أقصى 5MB',
      reviewFactory: 'معلومات المصنع',
      reviewLegal: 'معلومات قانونية',
      reviewWaste: 'ملخص المخلفات',
      forSale: 'للبيع',
      forPurchase: 'للشراء',
      types: 'الأنواع',
      quantity: 'الكمية',
      previous: 'السابق',
      next: 'التالي',
      confirm: 'تأكيد التسجيل',
      loading: 'جاري...',
      welcomeTitle: 'أهلاً وسهلاً بك في ECOv!',
      welcomeSubtitle: 'تم تسجيل مصنعك بنجاح في المنصة',
      seller: 'بائع مخلفات',
      buyer: 'مشتري مخلفات',
      addWaste: 'إضافة مخلفات للبيع',
      exploreMarket: 'استكشاف السوق',
      connectPartners: 'التواصل مع الشركاء',
      analyzeData: 'تحليل البيانات',
      improveRating: 'تحسين التقييم',
      network: 'شبكة الاقتصاد الدائري',
      goToDashboard: 'الانتقال إلى لوحة التحكم',
      stayHere: 'البقاء هنا',
      selectPurpose: 'يرجى تحديد هدف التسجيل',
      selectWasteTypes: 'يرجى تحديد أنواع المخلفات',
      enterQuantity: 'يرجى إدخال الكمية',
      step4Required: 'يجب أن تكون في الخطوة الرابعة لتأكيد التسجيل',
    },
    en: {
      home: 'HOME',
      login: 'LOGIN',
      haveAccount: 'Already have an account?',
      joinTitle: 'JOIN THE',
      joinHighlight: 'CIRCULAR ECONOMY REVOLUTION',
      joinSubtitle: 'Register your factory now and be part of the largest recycling network in Egypt',
      step: 'STEP',
      step1: 'FACTORY INFO',
      step2: 'PRODUCTION & LEGAL',
      step3: 'WASTE',
      step4: 'REVIEW',
      step1Title: 'BASIC FACTORY INFORMATION',
      step1Subtitle: 'Enter your factory basic information to get started',
      step2Title: 'ADDITIONAL INFORMATION & PRODUCTION',
      step2Subtitle: 'Add legal details and production information',
      step3Title: 'WASTE MANAGEMENT',
      step3Subtitle: 'Define your registration purpose and waste details',
      step4Title: 'FINAL REVIEW',
      step4Subtitle: 'Review your data and upload factory logo',
      factoryName: 'FACTORY NAME',
      industryType: 'INDUSTRY TYPE',
      location: 'GOVERNORATE',
      address: 'DETAILED ADDRESS',
      phone: 'FACTORY PHONE',
      email: 'EMAIL ADDRESS',
      ownerName: 'OWNER/MANAGER NAME',
      ownerPhone: 'OWNER/MANAGER PHONE',
      factoryNamePlaceholder: 'e.g., Nile Industries Factory',
      industryTypePlaceholder: 'Select industry type',
      locationPlaceholder: 'Select governorate',
      addressPlaceholder: 'Industrial Zone - Industry Street',
      phonePlaceholder: '0123456789',
      emailPlaceholder: 'info@factory.com',
      ownerNamePlaceholder: 'Ahmed Mohamed Ali',
      ownerPhonePlaceholder: '0101234567',
      legalInfo: 'LEGAL INFORMATION',
      taxNumber: 'TAX NUMBER',
      registrationNumber: 'COMMERCIAL REGISTRATION',
      establishmentYear: 'ESTABLISHMENT YEAR',
      productionInfo: 'PRODUCTION INFORMATION',
      mainProducts: 'MAIN PRODUCTS',
      mainProductsPlaceholder: 'Mention the main products of your factory...',
      monthlyCapacity: 'MONTHLY PRODUCTION CAPACITY',
      registrationPurpose: 'WHAT IS YOUR REGISTRATION PURPOSE?',
      sellWaste: 'SELL WASTE',
      sellWasteDesc: 'I want to sell industrial waste',
      buyWaste: 'BUY WASTE',
      buyWasteDesc: 'I want to buy waste as raw materials',
      wasteTypes: 'WASTE TYPES',
      availableQuantity: 'AVAILABLE QUANTITY PER MONTH',
      requiredQuantity: 'REQUIRED QUANTITY PER MONTH',
      frequency: 'FREQUENCY',
      daily: 'DAILY',
      weekly: 'WEEKLY',
      monthly: 'MONTHLY',
      quarterly: 'QUARTERLY',
      description: 'DETAILED DESCRIPTION',
      descriptionPlaceholder: 'Describe the condition and quality of waste...',
      purpose: 'PURCHASE PURPOSE',
      purposePlaceholder: 'How will you use the waste in production?',
      uploadLogo: 'FACTORY LOGO',
      uploadClick: 'Click to upload logo',
      uploadHint: 'PNG, JPG, WEBP - Max 5MB',
      reviewFactory: 'FACTORY INFORMATION',
      reviewLegal: 'LEGAL INFORMATION',
      reviewWaste: 'WASTE SUMMARY',
      forSale: 'FOR SALE',
      forPurchase: 'FOR PURCHASE',
      types: 'Types',
      quantity: 'Quantity',
      previous: 'PREVIOUS',
      next: 'NEXT',
      confirm: 'CONFIRM REGISTRATION',
      loading: 'LOADING...',
      welcomeTitle: 'WELCOME TO ECOV!',
      welcomeSubtitle: 'Your factory has been successfully registered',
      seller: 'WASTE SELLER',
      buyer: 'WASTE BUYER',
      addWaste: 'ADD WASTE FOR SALE',
      exploreMarket: 'EXPLORE MARKET',
      connectPartners: 'CONNECT WITH PARTNERS',
      analyzeData: 'ANALYZE DATA',
      improveRating: 'IMPROVE RATING',
      network: 'CIRCULAR ECONOMY NETWORK',
      goToDashboard: 'GO TO DASHBOARD',
      stayHere: 'STAY HERE',
      selectPurpose: 'Please select registration purpose',
      selectWasteTypes: 'Please select waste types',
      enterQuantity: 'Please enter quantity',
      step4Required: 'You must be on step 4 to confirm registration',
    }
  }

  const t = translations[currentLanguage]

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
    wasteTypesToSell: [],
    wasteAmountToSell: '',
    wasteUnitToSell: 'ton',
    sellFrequency: 'monthly',
    wasteDescription: '',
    wasteTypesToBuy: [],
    wasteAmountToBuy: '',
    wasteUnitToBuy: 'ton',
    buyFrequency: 'monthly',
    buyingPurpose: '',
    factoryLogo: null,
    logoPreview: null,
  })

  const industryTypes = [
    'Food Industries', 'Textile & Clothing', 'Chemicals', 'Metals & Manufacturing',
    'Plastics', 'Paper & Printing', 'Glass', 'Electronics', 'Cosmetics',
    'Pharmaceuticals', 'Building Materials', 'Leather', 'Furniture & Wood', 'Rubber', 'Other'
  ]

  const wasteTypeOptions = [
    { value: 'organic', label: { ar: 'نفايات عضوية', en: 'ORGANIC WASTE' }, icon: '🌿', color: 'green' },
    { value: 'plastic', label: { ar: 'بلاستيك', en: 'PLASTIC' }, icon: '♻️', color: 'blue' },
    { value: 'metal', label: { ar: 'معادن', en: 'METAL' }, icon: '⚙️', color: 'yellow' },
    { value: 'paper', label: { ar: 'ورق وكرتون', en: 'PAPER & CARDBOARD' }, icon: '📄', color: 'brown' },
    { value: 'glass', label: { ar: 'زجاج', en: 'GLASS' }, icon: '🥃', color: 'purple' },
    { value: 'electronic', label: { ar: 'إلكترونيات', en: 'ELECTRONIC' }, icon: '💻', color: 'indigo' },
    { value: 'chemical', label: { ar: 'نفايات كيميائية', en: 'CHEMICAL WASTE' }, icon: '⚗️', color: 'red' },
    { value: 'textile', label: { ar: 'نفايات نسيج', en: 'TEXTILE WASTE' }, icon: '👔', color: 'pink' },
    { value: 'wood', label: { ar: 'أخشاب', en: 'WOOD' }, icon: '🪵', color: 'amber' },
    { value: 'oil', label: { ar: 'زيوت مستعملة', en: 'USED OIL' }, icon: '🛢️', color: 'orange' },
    { value: 'rubber', label: { ar: 'مطاط', en: 'RUBBER' }, icon: '⚫', color: 'gray' },
    { value: 'construction', label: { ar: 'مخلفات بناء', en: 'CONSTRUCTION WASTE' }, icon: '🏗️', color: 'slate' }
  ]

  const locations = [
    'Cairo', 'Giza', 'Alexandria', 'Port Said', 'Suez', 'Damietta',
    'Dakahlia', 'Sharqia', 'Qalyubia', 'Kafr El Sheikh', 'Gharbia', 'Monufia',
    'Beheira', 'Ismailia', 'Luxor', 'Aswan', 'Asyut', 'Beni Suef',
    'Faiyum', 'Minya', 'New Valley', 'Red Sea', 'North Sinai',
    'South Sinai', 'Matrouh'
  ]

  const productionUnits = [
    { value: 'ton', label: { ar: 'طن', en: 'TON' } },
    { value: 'kg', label: { ar: 'كيلوجرام', en: 'KG' } },
    { value: 'unit', label: { ar: 'وحدة', en: 'UNIT' } },
    { value: 'liter', label: { ar: 'لتر', en: 'LITER' } },
    { value: 'm3', label: { ar: 'متر مكعب', en: 'M³' } }
  ]

  const frequencies = [
    { value: 'daily', label: { ar: 'يومي', en: 'DAILY' } },
    { value: 'weekly', label: { ar: 'أسبوعي', en: 'WEEKLY' } },
    { value: 'monthly', label: { ar: 'شهري', en: 'MONTHLY' } },
    { value: 'quarterly', label: { ar: 'ربع سنوي', en: 'QUARTERLY' } }
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePurposeChange = (purpose) => {
    setFormData(prev => ({
      ...prev,
      registrationPurpose: prev.registrationPurpose.includes(purpose)
        ? prev.registrationPurpose.filter(p => p !== purpose)
        : [...prev.registrationPurpose, purpose]
    }))
  }

  const handleWasteTypeChange = (wasteType, listType) => {
    const fieldName = listType === 'sell' ? 'wasteTypesToSell' : 'wasteTypesToBuy'
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].includes(wasteType)
        ? prev[fieldName].filter(type => type !== wasteType)
        : [...prev[fieldName], wasteType]
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
    if (currentStep === 3 && formData.registrationPurpose.length === 0) {
      alert(t.selectPurpose)
      return
    }
    if (currentStep === 3 && formData.registrationPurpose.includes('sell')) {
      if (formData.wasteTypesToSell.length === 0) {
        alert(t.selectWasteTypes)
        return
      }
      if (!formData.wasteAmountToSell) {
        alert(t.enterQuantity)
        return
      }
    }
    if (currentStep === 3 && formData.registrationPurpose.includes('buy')) {
      if (formData.wasteTypesToBuy.length === 0) {
        alert(t.selectWasteTypes)
        return
      }
      if (!formData.wasteAmountToBuy) {
        alert(t.enterQuantity)
        return
      }
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
    if (currentStep !== 4) {
      alert(t.step4Required)
      return
    }
    const userData = {
      id: Date.now(),
      factoryName: formData.factoryName,
      email: formData.email,
      ownerName: formData.ownerName,
      industryType: formData.industryType,
      location: formData.location,
      address: formData.address,
      phone: formData.phone,
      ownerPhone: formData.ownerPhone,
      logo: formData.logoPreview,
      registrationNumber: formData.registrationNumber,
      taxNumber: formData.taxNumber,
      establishmentYear: formData.establishmentYear,
      productionCapacity: formData.productionCapacity,
      productionUnit: formData.productionUnit,
      mainProducts: formData.mainProducts,
      registrationPurpose: formData.registrationPurpose,
      wasteTypesToSell: formData.wasteTypesToSell,
      wasteAmountToSell: formData.wasteAmountToSell,
      wasteUnitToSell: formData.wasteUnitToSell,
      sellFrequency: formData.sellFrequency,
      wasteDescription: formData.wasteDescription,
      wasteTypesToBuy: formData.wasteTypesToBuy,
      wasteAmountToBuy: formData.wasteAmountToBuy,
      wasteUnitToBuy: formData.wasteUnitToBuy,
      buyFrequency: formData.buyFrequency,
      buyingPurpose: formData.buyingPurpose,
      verified: false,
      registrationDate: new Date().toISOString(),
      language: currentLanguage
    }
    if (onRegister) {
      onRegister(userData)
    }
    setTimeout(() => {
      setShowWelcomeModal(true)
    }, 100)
  }

  const handleContinueToDashboard = () => {
    setShowWelcomeModal(false)
    setTimeout(() => {
      navigate('/dashboard')
    }, 300)
  }

  const WelcomeModal = () => {
    if (!showWelcomeModal) return null
    return (
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="relative bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-slideUp">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-500/10 to-teal-500/10"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="relative p-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-black text-center mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t.welcomeTitle}
              </span>
            </h2>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 mb-8 border-2 border-emerald-200/50">
              <div className="flex items-center justify-center gap-4 mb-4">
                {formData.logoPreview ? (
                  <img src={formData.logoPreview} alt={formData.factoryName} className="w-20 h-20 rounded-xl object-contain bg-white p-2 shadow-lg" />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Factory className="w-10 h-10 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black text-emerald-800">{formData.factoryName}</h3>
                  <p className="text-emerald-600 font-bold">{t.welcomeSubtitle}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {formData.registrationPurpose.includes('sell') && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-black flex items-center gap-2 uppercase tracking-wide">
                    <Package className="w-4 h-4" />
                    {t.seller}
                  </span>
                )}
                {formData.registrationPurpose.includes('buy') && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-black flex items-center gap-2 uppercase tracking-wide">
                    <ShoppingCart className="w-4 h-4" />
                    {t.buyer}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {formData.registrationPurpose.includes('sell') && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <Package className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="font-black text-sm uppercase tracking-wide">{t.addWaste}</p>
                </div>
              )}
              {formData.registrationPurpose.includes('buy') && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <ShoppingCart className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="font-black text-sm uppercase tracking-wide">{t.exploreMarket}</p>
                </div>
              )}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                <Users className="w-6 h-6 text-emerald-600 mb-2" />
                <p className="font-black text-sm uppercase tracking-wide">{t.connectPartners}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                <BarChart3 className="w-6 h-6 text-amber-600 mb-2" />
                <p className="font-black text-sm uppercase tracking-wide">{t.analyzeData}</p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-xl border border-rose-200">
                <Trophy className="w-6 h-6 text-rose-600 mb-2" />
                <p className="font-black text-sm uppercase tracking-wide">{t.improveRating}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-sky-50 p-4 rounded-xl border border-cyan-200">
                <Globe className="w-6 h-6 text-cyan-600 mb-2" />
                <p className="font-black text-sm uppercase tracking-wide">{t.network}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContinueToDashboard}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group uppercase tracking-wide"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {t.goToDashboard}
                <ArrowLeft className={`w-5 h-5 ${currentLanguage === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
              </button>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-black rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-wide"
              >
                <X className="w-5 h-5" />
                {t.stayHere}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-slate-50`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {showWelcomeModal && <WelcomeModal />}
      
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-500 border-t-transparent"></div>
            <span className="text-emerald-700 font-black uppercase tracking-wide">{t.loading}</span>
          </div>
        </div>
      )}

      {/* Simple Header with Logo and Actions */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img src={logo} alt="ECOv" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-black bg-gradient-to-l from-emerald-600 to-teal-600 bg-clip-text text-transparent uppercase tracking-tight">
                  
                </h1>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  {currentLanguage === 'ar' ? 'منصة الاقتصاد الدائري' : 'CIRCULAR ECONOMY PLATFORM'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLanguageToggle}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-lg transition-all flex items-center gap-1.5 text-sm uppercase tracking-wide"
              >
                <Globe className="w-3.5 h-3.5" />
                {currentLanguage === 'ar' ? 'EN' : 'AR'}
              </button>

              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-lg transition-all flex items-center gap-1.5 text-sm uppercase tracking-wide"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.home}</span>
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 text-sm uppercase tracking-wide"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.login}</span>
              </button>
            </div>
          </div>

          <div className="sm:hidden pb-2 text-center text-xs text-slate-600 font-semibold">
            {t.haveAccount}{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-emerald-600 font-black hover:underline uppercase"
            >
              {t.login}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with background */}
        <div 
          className="relative rounded-2xl overflow-hidden mb-6 bg-cover bg-center"
          style={{ backgroundImage: `url(${registrationBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-emerald-900/90 via-emerald-800/85 to-teal-900/90"></div>
          <div className="relative px-6 py-10 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-black mb-2 uppercase tracking-tight">
              {t.joinTitle}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 to-teal-300">
                {t.joinHighlight}
              </span>
            </h1>
            <p className="text-base text-emerald-100 max-w-2xl mx-auto font-semibold">
              {t.joinSubtitle}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="relative">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center font-black text-base
                    transition-all duration-500 transform
                    ${currentStep >= step 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-110' 
                      : 'bg-slate-200 text-slate-500'
                    }
                  `}>
                    {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`absolute top-1/2 -translate-y-1/2 ${currentLanguage === 'ar' ? 'right-full' : 'left-full'} w-full h-1 bg-slate-200 overflow-hidden`}>
                      <div 
                        className={`h-full bg-gradient-to-l from-emerald-500 to-teal-600 transition-all duration-500`}
                        style={{ width: currentStep > step ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className={`${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'} hidden md:block`}>
                  <p className="text-xs text-slate-500 font-bold uppercase">{t.step} {step}</p>
                  <p className={`font-black text-xs uppercase tracking-wide ${currentStep >= step ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {step === 1 && t.step1}
                    {step === 2 && t.step2}
                    {step === 3 && t.step3}
                    {step === 4 && t.step4}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t.step1Title}</h2>
                    <p className="text-sm text-slate-500 font-semibold">{t.step1Subtitle}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      {t.factoryName} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400`} />
                      <input
                        type="text"
                        name="factoryName"
                        value={formData.factoryName}
                        onChange={handleChange}
                        placeholder={t.factoryNamePlaceholder}
                        className={`w-full ${currentLanguage === 'ar' ? 'pr-9' : 'pl-9'} px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-all text-sm font-semibold`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      {t.industryType} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Factory className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400`} />
                      <select
                        name="industryType"
                        value={formData.industryType}
                        onChange={handleChange}
                        className={`w-full ${currentLanguage === 'ar' ? 'pr-9' : 'pl-9'} px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none appearance-none bg-white text-sm font-semibold`}
                        required
                      >
                        <option value="">{t.industryTypePlaceholder}</option>
                        {industryTypes.map((type, i) => (
                          <option key={i} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      {t.location} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400`} />
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full ${currentLanguage === 'ar' ? 'pr-9' : 'pl-9'} px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none appearance-none bg-white text-sm font-semibold`}
                        required
                      >
                        <option value="">{t.locationPlaceholder}</option>
                        {locations.map((loc, i) => (
                          <option key={i} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      {t.address} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t.addressPlaceholder}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm font-semibold"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      {t.phone} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400`} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t.phonePlaceholder}
                        className={`w-full ${currentLanguage === 'ar' ? 'pr-9' : 'pl-9'} px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm font-semibold`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      {t.email} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400`} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.emailPlaceholder}
                        className={`w-full ${currentLanguage === 'ar' ? 'pr-9' : 'pl-9'} px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm font-semibold`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      {t.ownerName} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400`} />
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder={t.ownerNamePlaceholder}
                        className={`w-full ${currentLanguage === 'ar' ? 'pr-9' : 'pl-9'} px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm font-semibold`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      {t.ownerPhone}
                    </label>
                    <div className="relative">
                      <Phone className={`absolute ${currentLanguage === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400`} />
                      <input
                        type="tel"
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleChange}
                        placeholder={t.ownerPhonePlaceholder}
                        className={`w-full ${currentLanguage === 'ar' ? 'pr-9' : 'pl-9'} px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm font-semibold`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Additional Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t.step2Title}</h2>
                    <p className="text-sm text-slate-500 font-semibold">{t.step2Subtitle}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200/50">
                  <h3 className="text-lg font-black text-blue-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <Shield className="w-5 h-5" />
                    {t.legalInfo}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                        {t.taxNumber} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="taxNumber"
                        value={formData.taxNumber}
                        onChange={handleChange}
                        placeholder="123-456-789"
                        className="w-full px-3 py-2.5 border-2 border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none text-sm font-semibold"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                        {t.registrationNumber} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="98765"
                        className="w-full px-3 py-2.5 border-2 border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none text-sm font-semibold"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                        {t.establishmentYear}
                      </label>
                      <input
                        type="number"
                        name="establishmentYear"
                        value={formData.establishmentYear}
                        onChange={handleChange}
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full px-3 py-2.5 border-2 border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200/50">
                  <h3 className="text-lg font-black text-emerald-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <BarChart3 className="w-5 h-5" />
                    {t.productionInfo}
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                        {t.mainProducts} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="mainProducts"
                        value={formData.mainProducts}
                        onChange={handleChange}
                        rows="4"
                        placeholder={t.mainProductsPlaceholder}
                        className="w-full px-3 py-2.5 border-2 border-emerald-200 rounded-lg focus:border-emerald-600 focus:outline-none resize-none text-sm font-semibold"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                          {t.monthlyCapacity}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            name="productionCapacity"
                            value={formData.productionCapacity}
                            onChange={handleChange}
                            placeholder="500"
                            className="flex-1 px-3 py-2.5 border-2 border-emerald-200 rounded-lg focus:border-emerald-600 focus:outline-none text-sm font-semibold"
                          />
                          <select
                            name="productionUnit"
                            value={formData.productionUnit}
                            onChange={handleChange}
                            className="w-28 px-3 py-2.5 border-2 border-emerald-200 rounded-lg focus:border-emerald-600 focus:outline-none bg-white text-sm font-semibold"
                          >
                            {productionUnits.map((unit, i) => (
                              <option key={i} value={unit.value}>{unit.label[currentLanguage]}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Waste Management */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <Recycle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t.step3Title}</h2>
                    <p className="text-sm text-slate-500 font-semibold">{t.step3Subtitle}</p>
                  </div>
                </div>
                
                {/* Registration Purpose */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200/50">
                  <h3 className="text-lg font-black text-purple-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <Zap className="w-5 h-5" />
                    {t.registrationPurpose} <span className="text-red-500">*</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`relative p-5 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.registrationPurpose.includes('sell')
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                      onClick={() => handlePurposeChange('sell')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl shadow-md">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-base mb-1 uppercase tracking-wide">{t.sellWaste}</h4>
                          <p className="text-xs text-slate-600 font-semibold">{t.sellWasteDesc}</p>
                        </div>
                      </div>
                      {formData.registrationPurpose.includes('sell') && (
                        <div className={`absolute top-3 ${currentLanguage === 'ar' ? 'left-3' : 'right-3'}`}>
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`relative p-5 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.registrationPurpose.includes('buy')
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                      }`}
                      onClick={() => handlePurposeChange('buy')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl shadow-md">
                          <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-base mb-1 uppercase tracking-wide">{t.buyWaste}</h4>
                          <p className="text-xs text-slate-600 font-semibold">{t.buyWasteDesc}</p>
                        </div>
                      </div>
                      {formData.registrationPurpose.includes('buy') && (
                        <div className={`absolute top-3 ${currentLanguage === 'ar' ? 'left-3' : 'right-3'}`}>
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sell Section */}
                {formData.registrationPurpose.includes('sell') && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200/50">
                    <h3 className="text-lg font-black text-blue-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <Package className="w-5 h-5" />
                      {t.sellWaste}
                    </h3>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
                          {t.wasteTypes} <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {wasteTypeOptions.map((waste, i) => (
                            <div
                              key={i}
                              className={`relative p-2 rounded-lg border-2 transition-all cursor-pointer ${
                                formData.wasteTypesToSell.includes(waste.value)
                                  ? 'border-blue-500 bg-blue-100 shadow-sm'
                                  : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                              onClick={() => handleWasteTypeChange(waste.value, 'sell')}
                            >
                              <div className="text-center">
                                <span className="text-2xl mb-1 block">{waste.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-wide">{waste.label[currentLanguage]}</span>
                              </div>
                              {formData.wasteTypesToSell.includes(waste.value) && (
                                <CheckCircle className={`absolute top-0.5 ${currentLanguage === 'ar' ? 'left-0.5' : 'right-0.5'} w-3 h-3 text-blue-600`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                            {t.availableQuantity} <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              name="wasteAmountToSell"
                              value={formData.wasteAmountToSell}
                              onChange={handleChange}
                              placeholder="50"
                              className="flex-1 px-3 py-2.5 border-2 border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none text-sm font-semibold"
                            />
                            <select
                              name="wasteUnitToSell"
                              value={formData.wasteUnitToSell}
                              onChange={handleChange}
                              className="w-28 px-3 py-2.5 border-2 border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none bg-white text-sm font-semibold"
                            >
                              <option value="kg">{currentLanguage === 'ar' ? 'كجم' : 'KG'}</option>
                              <option value="ton">{currentLanguage === 'ar' ? 'طن' : 'TON'}</option>
                              <option value="liter">{currentLanguage === 'ar' ? 'لتر' : 'LITER'}</option>
                              <option value="m3">{currentLanguage === 'ar' ? 'م³' : 'M³'}</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                            {t.frequency} <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="sellFrequency"
                            value={formData.sellFrequency}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border-2 border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none bg-white text-sm font-semibold"
                          >
                            {frequencies.map((freq, i) => (
                              <option key={i} value={freq.value}>{freq.label[currentLanguage]}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                          {t.description}
                        </label>
                        <textarea
                          name="wasteDescription"
                          value={formData.wasteDescription}
                          onChange={handleChange}
                          rows="3"
                          placeholder={t.descriptionPlaceholder}
                          className="w-full px-3 py-2.5 border-2 border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none resize-none text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Buy Section */}
                {formData.registrationPurpose.includes('buy') && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200/50">
                    <h3 className="text-lg font-black text-purple-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <ShoppingCart className="w-5 h-5" />
                      {t.buyWaste}
                    </h3>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
                          {t.wasteTypes} <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {wasteTypeOptions.map((waste, i) => (
                            <div
                              key={i}
                              className={`relative p-2 rounded-lg border-2 transition-all cursor-pointer ${
                                formData.wasteTypesToBuy.includes(waste.value)
                                  ? 'border-purple-500 bg-purple-100 shadow-sm'
                                  : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                              }`}
                              onClick={() => handleWasteTypeChange(waste.value, 'buy')}
                            >
                              <div className="text-center">
                                <span className="text-2xl mb-1 block">{waste.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-wide">{waste.label[currentLanguage]}</span>
                              </div>
                              {formData.wasteTypesToBuy.includes(waste.value) && (
                                <CheckCircle className={`absolute top-0.5 ${currentLanguage === 'ar' ? 'left-0.5' : 'right-0.5'} w-3 h-3 text-purple-600`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                            {t.requiredQuantity} <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              name="wasteAmountToBuy"
                              value={formData.wasteAmountToBuy}
                              onChange={handleChange}
                              placeholder="100"
                              className="flex-1 px-3 py-2.5 border-2 border-purple-200 rounded-lg focus:border-purple-600 focus:outline-none text-sm font-semibold"
                            />
                            <select
                              name="wasteUnitToBuy"
                              value={formData.wasteUnitToBuy}
                              onChange={handleChange}
                              className="w-28 px-3 py-2.5 border-2 border-purple-200 rounded-lg focus:border-purple-600 focus:outline-none bg-white text-sm font-semibold"
                            >
                              <option value="kg">{currentLanguage === 'ar' ? 'كجم' : 'KG'}</option>
                              <option value="ton">{currentLanguage === 'ar' ? 'طن' : 'TON'}</option>
                              <option value="liter">{currentLanguage === 'ar' ? 'لتر' : 'LITER'}</option>
                              <option value="m3">{currentLanguage === 'ar' ? 'م³' : 'M³'}</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                            {t.frequency} <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="buyFrequency"
                            value={formData.buyFrequency}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border-2 border-purple-200 rounded-lg focus:border-purple-600 focus:outline-none bg-white text-sm font-semibold"
                          >
                            {frequencies.map((freq, i) => (
                              <option key={i} value={freq.value}>{freq.label[currentLanguage]}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                          {t.purpose} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="buyingPurpose"
                          value={formData.buyingPurpose}
                          onChange={handleChange}
                          rows="3"
                          placeholder={t.purposePlaceholder}
                          className="w-full px-3 py-2.5 border-2 border-purple-200 rounded-lg focus:border-purple-600 focus:outline-none resize-none text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review & Logo */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t.step4Title}</h2>
                    <p className="text-sm text-slate-500 font-semibold">{t.step4Subtitle}</p>
                  </div>
                </div>
                
                {/* Logo Upload */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border-2 border-slate-200">
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <Upload className="w-5 h-5" />
                    {t.uploadLogo}
                  </h3>
                  
                  {formData.logoPreview ? (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img 
                          src={formData.logoPreview} 
                          alt="Logo" 
                          className="w-40 h-40 object-contain rounded-xl border-4 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={handleLogoRemove}
                          className={`absolute -top-2 ${currentLanguage === 'ar' ? '-right-2' : '-left-2'} w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="border-3 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-700 font-black mb-1 uppercase tracking-wide">{t.uploadClick}</p>
                      <p className="text-xs text-slate-500 font-semibold">{t.uploadHint}</p>
                    </div>
                  )}
                </div>
                
                {/* Review Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200/50">
                    <h4 className="font-black text-blue-900 mb-3 flex items-center gap-2 uppercase tracking-wide text-sm">
                      <Building2 className="w-4 h-4" />
                      {t.reviewFactory}
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-blue-200">
                        <span className="text-slate-600 font-bold">{t.factoryName}:</span>
                        <span className="font-black text-slate-900">{formData.factoryName || '---'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-blue-200">
                        <span className="text-slate-600 font-bold">{t.industryType}:</span>
                        <span className="font-black text-slate-900">{formData.industryType || '---'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-blue-200">
                        <span className="text-slate-600 font-bold">{t.location}:</span>
                        <span className="font-black text-slate-900">{formData.location || '---'}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-600 font-bold">{t.phone}:</span>
                        <span className="font-black text-slate-900">{formData.phone || '---'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200/50">
                    <h4 className="font-black text-purple-900 mb-3 flex items-center gap-2 uppercase tracking-wide text-sm">
                      <Award className="w-4 h-4" />
                      {t.reviewLegal}
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-purple-200">
                        <span className="text-slate-600 font-bold">{t.registrationNumber}:</span>
                        <span className="font-black text-slate-900">{formData.registrationNumber || '---'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-purple-200">
                        <span className="text-slate-600 font-bold">{t.taxNumber}:</span>
                        <span className="font-black text-slate-900">{formData.taxNumber || '---'}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-600 font-bold">{t.establishmentYear}:</span>
                        <span className="font-black text-slate-900">{formData.establishmentYear || '---'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200/50 md:col-span-2">
                    <h4 className="font-black text-emerald-900 mb-3 flex items-center gap-2 uppercase tracking-wide text-sm">
                      <Recycle className="w-4 h-4" />
                      {t.reviewWaste}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.registrationPurpose.includes('sell') && (
                        <div className="bg-white/80 p-3 rounded-lg">
                          <p className="font-black text-blue-700 mb-1 flex items-center gap-1 uppercase tracking-wide text-xs">
                            <Package className="w-3 h-3" />
                            {t.forSale}
                          </p>
                          <p className="text-xs text-slate-600 font-bold">{t.types}: {formData.wasteTypesToSell.length}</p>
                          <p className="text-xs text-slate-600 font-bold">{t.quantity}: {formData.wasteAmountToSell || '0'} {formData.wasteUnitToSell}</p>
                        </div>
                      )}
                      {formData.registrationPurpose.includes('buy') && (
                        <div className="bg-white/80 p-3 rounded-lg">
                          <p className="font-black text-purple-700 mb-1 flex items-center gap-1 uppercase tracking-wide text-xs">
                            <ShoppingCart className="w-3 h-3" />
                            {t.forPurchase}
                          </p>
                          <p className="text-xs text-slate-600 font-bold">{t.types}: {formData.wasteTypesToBuy.length}</p>
                          <p className="text-xs text-slate-600 font-bold">{t.quantity}: {formData.wasteAmountToBuy || '0'} {formData.wasteUnitToBuy}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`flex ${currentLanguage === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-between mt-6 pt-5 border-t-2 border-slate-200`}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-lg transition-all flex items-center gap-2 group text-sm uppercase tracking-wide"
                >
                  <ArrowLeft className={`w-4 h-4 ${currentLanguage === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
                  {t.previous}
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`${currentLanguage === 'ar' ? 'mr-auto' : 'ml-auto'} px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 group text-sm uppercase tracking-wide`}
                  disabled={isTransitioning}
                >
                  {isTransitioning ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      {t.loading}
                    </>
                  ) : (
                    <>
                      {t.next}
                      <ChevronRight className={`w-4 h-4 ${currentLanguage === 'ar' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'} transition-transform`} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  className={`${currentLanguage === 'ar' ? 'mr-auto' : 'ml-auto'} px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 group text-sm uppercase tracking-wide`}
                >
                  <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {t.confirm}
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