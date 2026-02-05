import { useState } from 'react'
import { Factory, Building2, MapPin, Phone, Mail, User, FileText, Trash2, Package, Recycle, ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react'
import './Registration.css'
import logo from '../assets/logooo1ecov.png'

function Registration({ onNavigate, onRegister }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // معلومات المصنع
    factoryName: '',
    industryType: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    ownerName: '',
    taxNumber: '',
    
    // تفاصيل النفايات
    wasteType: '',
    wasteAmount: '',
    wasteUnit: 'ton',
    frequency: 'monthly',
    description: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // simulate registration and user creation
    if (onRegister) {
      onRegister({
        factoryName: formData.factoryName,
        email: formData.email,
        ownerName: formData.ownerName
      })
    }
    console.log('تم إرسال البيانات:', formData)
    onNavigate?.('dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <nav className="bg-black shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex flex-row-reverse items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <img src={logo} alt="ECOv Logo" className="h-14 w-auto object-contain" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate?.('home')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border-2 border-white/30 backdrop-blur-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                الرئيسية
              </button>
              <button onClick={() => onNavigate?.('dashboard')} className="px-6 py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 font-bold rounded-xl transition-all shadow-lg transform hover:scale-105">
                لوحة التحكم
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4 flex-1">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${currentStep >= 1 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all`}>
              {currentStep > 1 ? <CheckCircle className="w-6 h-6 text-white" /> : <span className="text-white font-bold">1</span>}
            </div>
            <div className="flex-1 h-1 bg-slate-300">
              <div className={`h-full ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500`} style={{width: currentStep >= 2 ? '100%' : '0%'}}></div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-1">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all`}>
              {currentStep > 2 ? <CheckCircle className="w-6 h-6 text-white" /> : <span className="text-white font-bold">2</span>}
            </div>
            <div className="flex-1 h-1 bg-slate-300">
              <div className={`h-full ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all duration-500`} style={{width: currentStep >= 3 ? '100%' : '0%'}}></div>
            </div>
          </div>
          
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-slate-300'} transition-all`}>
            {currentStep > 3 ? <CheckCircle className="w-6 h-6 text-white" /> : <span className="text-white font-bold">3</span>}
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {currentStep === 1 && 'معلومات المصنع'}
            {currentStep === 2 && 'تفاصيل النفايات'}
            {currentStep === 3 && 'مراجعة وتأكيد'}
          </h2>
          <p className="text-slate-600">
            {currentStep === 1 && 'أدخل معلومات مصنعك الأساسية'}
            {currentStep === 2 && 'حدد نوع وكمية النفايات الصناعية'}
            {currentStep === 3 && 'راجع البيانات وأكمل التسجيل'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: معلومات المصنع */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    اسم المصنع
                  </label>
                  <input
                    type="text"
                    name="factoryName"
                    value={formData.factoryName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    placeholder="مصنع الأمل للصناعات الغذائية"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Factory className="w-5 h-5 text-emerald-600" />
                    نوع الصناعة
                  </label>
                  <select
                    name="industryType"
                    value={formData.industryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    required
                  >
                    <option value="">اختر نوع الصناعة</option>
                    <option value="food">صناعات غذائية</option>
                    <option value="textile">نسيج وملابس</option>
                    <option value="chemical">كيماويات</option>
                    <option value="metal">معادن وتصنيع</option>
                    <option value="plastic">بلاستيك</option>
                    <option value="paper">ورق وطباعة</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    المحافظة
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    required
                  >
                    <option value="">اختر المحافظة</option>
                    <option value="cairo">القاهرة</option>
                    <option value="giza">الجيزة</option>
                    <option value="alexandria">الإسكندرية</option>
                    <option value="qalyubia">القليوبية</option>
                    <option value="port-said">بور سعيد</option>
                    <option value="suez">السويس</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    العنوان التفصيلي
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    placeholder="المنطقة الصناعية، الشارع"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    placeholder="01xxxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    placeholder="factory@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    اسم المالك / المدير
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    placeholder="أحمد محمد"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    الرقم الضريبي
                  </label>
                  <input
                    type="text"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    placeholder="xxx-xxx-xxx"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: تفاصيل النفايات */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-emerald-600" />
                    نوع النفايات
                  </label>
                  <select
                    name="wasteType"
                    value={formData.wasteType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    required
                  >
                    <option value="">اختر نوع النفايات</option>
                    <option value="organic">عضوية</option>
                    <option value="plastic">بلاستيك</option>
                    <option value="metal">معادن</option>
                    <option value="paper">ورق وكرتون</option>
                    <option value="glass">زجاج</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    الكمية المقدرة
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="wasteAmount"
                      value={formData.wasteAmount}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                      placeholder="100"
                      required
                    />
                    <select
                      name="wasteUnit"
                      value={formData.wasteUnit}
                      onChange={handleChange}
                      className="w-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    >
                      <option value="kg">كجم</option>
                      <option value="ton">طن</option>
                      <option value="liter">لتر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Recycle className="w-5 h-5 text-emerald-600" />
                    تكرار الإنتاج
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    required
                  >
                    <option value="daily">يومي</option>
                    <option value="weekly">أسبوعي</option>
                    <option value="monthly">شهري</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    وصف النفايات (اختياري)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none transition-all"
                    placeholder="أضف أي تفاصيل إضافية..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: مراجعة */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  معلومات المصنع
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                  <div><span className="font-semibold">اسم المصنع:</span> {formData.factoryName}</div>
                  <div><span className="font-semibold">نوع الصناعة:</span> {formData.industryType}</div>
                  <div><span className="font-semibold">المحافظة:</span> {formData.location}</div>
                  <div><span className="font-semibold">العنوان:</span> {formData.address}</div>
                  <div><span className="font-semibold">الهاتف:</span> {formData.phone}</div>
                  <div><span className="font-semibold">البريد:</span> {formData.email}</div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Trash2 className="w-6 h-6" />
                  تفاصيل النفايات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                  <div><span className="font-semibold">نوع النفايات:</span> {formData.wasteType}</div>
                  <div><span className="font-semibold">الكمية:</span> {formData.wasteAmount} {formData.wasteUnit}</div>
                  <div><span className="font-semibold">التكرار:</span> {formData.frequency}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t-2 border-slate-200">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                السابق
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center gap-2"
              >
                التالي
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                تأكيد التسجيل
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Registration
