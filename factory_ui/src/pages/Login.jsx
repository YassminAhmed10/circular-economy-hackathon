import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logooo1ecov.png'

function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // محاكاة تسجيل الدخول الناجح
    const userData = {
      id: Date.now(),
      factoryName: 'مصنع الأمل للصناعات الغذائية',
      email: formData.email,
      isLoggedIn: true
    }
    
    if (onLoginSuccess) {
      onLoginSuccess(userData)
    }
    
    // التنقل إلى لوحة التحكم
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      {/* Header بسيط */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logo} alt="ECOv Logo" className="h-10 w-auto object-contain" />
            </div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">الرئيسية</span>
            </button>
          </div>
        </div>
      </nav>

      {/* نموذج تسجيل الدخول */}
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* بطاقة تسجيل الدخول */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            {/* العنوان */}
            <div className="p-8 text-center border-b border-slate-100">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <img src={logo} alt="ECOv Logo" className="h-10 w-auto" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                تسجيل الدخول
              </h2>
              <p className="text-slate-600">
                أدخل بيانات الدخول لمصنعك
              </p>
            </div>

            {/* النموذج */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                {/* البريد الإلكتروني */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pr-10 pl-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="example@company.com"
                      required
                    />
                  </div>
                </div>

                {/* كلمة المرور */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pr-10 pl-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="أدخل كلمة المرور"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* تذكرني ونسيت كلمة المرور */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300" 
                    />
                    <span className="text-sm text-slate-600">تذكرني</span>
                  </label>
                  <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline">
                    نسيت كلمة المرور؟
                  </a>
                </div>

                {/* زر تسجيل الدخول */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* رابط التسجيل الجديد */}
            <div className="px-8 pb-8 text-center">
              <div className="border-t border-slate-200 pt-6">
                <p className="text-slate-600 mb-4">
                  ليس لديك حساب؟ يجب تسجيل مصنعك أولاً
                </p>
                <button
                  onClick={() => navigate('/registration')}
                  className="w-full py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-all"
                >
                  تسجيل مصنع جديد
                </button>
              </div>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              تواجه مشكلة في الدخول؟{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                اتصل بالدعم الفني
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login