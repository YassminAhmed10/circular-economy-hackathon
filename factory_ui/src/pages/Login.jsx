import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Home, Factory, Shield, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logooo1ecov.png'
import './Login.css'

function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // محاكاة تسجيل الدخول
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        factoryName: 'مصنع الأمل للصناعات الغذائية',
        email: formData.email,
        isLoggedIn: true
      }
      
      if (onLoginSuccess) {
        onLoginSuccess(userData)
      }
      
      navigate('/dashboard')
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden" dir="rtl">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="relative bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ECOv Logo" className="h-12 w-auto object-contain" />
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg">ECOv</h1>
                <p className="text-emerald-300 text-xs">منصة الاقتصاد الدائري</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold">الرئيسية</span>
            </button>
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <div className="relative py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* القسم الأيسر - معلومات */}
            <div className="hidden lg:block text-white space-y-8">
              <div>
                <h2 className="text-5xl font-bold mb-4 leading-tight">
                  مرحباً بك في
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> ECOv</span>
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  منصة الاقتصاد الدائري للمصانع المصرية
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Factory className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">إدارة مصنعك بكفاءة</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      تتبع النفايات، تحليل البيانات، والتواصل مع الشركاء في مكان واحد
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">أمان متقدم</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      حماية بيانات مصنعك بأحدث معايير الأمان والتشفير
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">شبكة شركاء موثوقين</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      تواصل مع مصانع ومعيدي تدوير معتمدين من جميع أنحاء مصر
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* القسم الأيمن - نموذج تسجيل الدخول */}
            <div className="w-full">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                {/* العنوان */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-white text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    تسجيل الدخول
                  </h2>
                  <p className="text-emerald-100 text-lg">
                    ادخل إلى لوحة تحكم مصنعك
                  </p>
                </div>

                {/* النموذج */}
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="space-y-6">
                    {/* البريد الإلكتروني */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-3 text-lg">
                        البريد الإلكتروني
                      </label>
                      <div className="relative">
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                          <Mail className="w-5 h-5 text-emerald-600" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pr-12 pl-4 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-lg bg-white"
                          placeholder="example@company.com"
                          required
                        />
                      </div>
                    </div>

                    {/* كلمة المرور */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-3 text-lg">
                        كلمة المرور
                      </label>
                      <div className="relative">
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                          <Lock className="w-5 h-5 text-emerald-600" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pr-12 pl-12 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-lg bg-white"
                          placeholder="أدخل كلمة المرور"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors z-10"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* تذكرني ونسيت كلمة المرور */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-emerald-600 rounded border-2 border-slate-300 focus:ring-emerald-500 cursor-pointer" 
                        />
                        <span className="text-slate-700 font-medium group-hover:text-emerald-600 transition-colors">تذكرني</span>
                      </label>
                      <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all">
                        نسيت كلمة المرور؟
                      </a>
                    </div>

                    {/* زر تسجيل الدخول */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>جاري تسجيل الدخول...</span>
                        </>
                      ) : (
                        <>
                          <span>تسجيل الدخول</span>
                          <ArrowLeft className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* رابط التسجيل الجديد */}
                <div className="px-8 pb-8">
                  <div className="border-t-2 border-slate-200 pt-6 text-center">
                    <p className="text-slate-600 mb-4 text-lg font-medium">
                      ليس لديك حساب؟ سجّل مصنعك الآن
                    </p>
                    <button
                      onClick={() => navigate('/registration')}
                      className="w-full py-4 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl transition-all hover:shadow-md text-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      تسجيل مصنع جديد
                    </button>
                  </div>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="mt-6 text-center">
                <p className="text-slate-300">
                  تواجه مشكلة في الدخول؟{' '}
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-colors">
                    اتصل بالدعم الفني
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative text-center pb-8 text-slate-400 text-sm">
        <p>© 2026 ECOv - جميع الحقوق محفوظة</p>
      </div>
    </div>
  )
}

export default Login