import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Recycle, Leaf, Droplets, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logooo1ecov'
import backgroundImg from '../assets/ecovlogin.png'
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
        <div className="min-h-screen bg-[#2B4B3C] relative overflow-hidden" dir="rtl">
            {/* خلفية الصورة الطبيعية */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${backgroundImg})`,
                    filter: 'brightness(0.85) contrast(1.1)',
                }}
            >
                {/* Overlay طبيعي بألوان الأرض */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#2B4B3C]/70 via-[#3A5E4A]/60 to-[#1A2E25]/80"></div>
            </div>

            {/* عناصر طبيعية متحركة - أوراق الشجر */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 text-[#8FBC8F]/20 transform rotate-12">
                    <Leaf className="w-32 h-32" />
                </div>
                <div className="absolute bottom-40 right-10 text-[#98FB98]/10 transform -rotate-12">
                    <Leaf className="w-40 h-40" />
                </div>
                <div className="absolute top-1/2 left-1/4 text-[#6B8E23]/10">
                    <Recycle className="w-24 h-24" />
                </div>
            </div>

            {/* Header بشفافية كاملة */}
            <nav className="relative bg-transparent py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        {/* اللوجو بدون خلفية */}
                        <div className="flex items-center">
                            <img
                                src={logo}
                                alt="ECOv"
                                className="h-16 w-auto object-contain drop-shadow-lg"
                                style={{ filter: 'brightness(1.1) contrast(1.2)' }}
                            />
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-6 py-3 bg-white/90 hover:bg-white text-[#2B4B3C] rounded-full transition-all shadow-lg hover:shadow-xl border border-[#8FBC8F] backdrop-blur-sm font-bold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>الرئيسية</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* المحتوى الرئيسي */}
            <div className="relative py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* القسم الأيسر - معلومات بيئية */}
                        <div className="hidden lg:block text-white space-y-8">
                            <div className="backdrop-blur-sm bg-white/5 p-8 rounded-3xl border border-white/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-[#98FB98]/20 rounded-full flex items-center justify-center">
                                        <Sun className="w-6 h-6 text-[#F0E68C]" />
                                    </div>
                                    <h2 className="text-4xl font-bold text-[#F0E68C]">ECOv</h2>
                                </div>

                                <p className="text-2xl mb-8 text-[#E5E5E5] leading-relaxed">
                                    معاً نحو مستقبل أخضر
                                    <span className="block text-lg text-[#98FB98] mt-2">منصة الاقتصاد الدائري للمصانع المصرية</span>
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-[#2B4B3C]/40 backdrop-blur-sm p-5 rounded-2xl border border-[#98FB98]/30">
                                        <div className="w-12 h-12 bg-[#98FB98]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Recycle className="w-6 h-6 text-[#98FB98]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#F0E68C] mb-1">إعادة تدوير ذكية</h3>
                                            <p className="text-[#E5E5E5] text-sm">حوِّل نفايات مصنعك إلى موارد قيمة</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-[#2B4B3C]/40 backdrop-blur-sm p-5 rounded-2xl border border-[#98FB98]/30">
                                        <div className="w-12 h-12 bg-[#98FB98]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Leaf className="w-6 h-6 text-[#98FB98]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#F0E68C] mb-1">بصمة كربونية صفرية</h3>
                                            <p className="text-[#E5E5E5] text-sm">ساهم في حماية البيئة وتقليل الانبعاثات</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-[#2B4B3C]/40 backdrop-blur-sm p-5 rounded-2xl border border-[#98FB98]/30">
                                        <div className="w-12 h-12 bg-[#98FB98]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Droplets className="w-6 h-6 text-[#98FB98]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#F0E68C] mb-1">استدامة الموارد</h3>
                                            <p className="text-[#E5E5E5] text-sm">حافظ على الموارد الطبيعية للأجيال القادمة</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* القسم الأيمن - نموذج تسجيل الدخول */}
                        <div className="w-full">
                            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-[#98FB98]/30">
                                {/* العنوان بخلفية طبيعية */}
                                <div className="bg-gradient-to-r from-[#2B4B3C] to-[#3A5E4A] p-8 text-white text-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#98FB98] rounded-full"></div>
                                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#F0E68C] rounded-full"></div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-20 h-20 bg-[#98FB98]/20 rounded-2xl flex items-center justify-center border-2 border-[#F0E68C]/50 backdrop-blur-sm">
                                                <Recycle className="w-10 h-10 text-[#F0E68C]" />
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-bold mb-2 text-[#F0E68C]">
                                            تسجيل الدخول
                                        </h2>
                                        <p className="text-[#E5E5E5]">أهلاً بعودتك إلى منصة الاستدامة</p>
                                    </div>
                                </div>

                                {/* النموذج */}
                                <form onSubmit={handleSubmit} className="p-8">
                                    <div className="space-y-6">
                                        {/* البريد الإلكتروني */}
                                        <div>
                                            <label className="block text-[#2B4B3C] font-bold mb-3 text-lg">
                                                البريد الإلكتروني
                                            </label>
                                            <div className="relative">
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                                                    <Mail className="w-5 h-5 text-[#3A5E4A]" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full pr-12 pl-4 py-4 border-2 border-[#8FBC8F] rounded-xl focus:border-[#2B4B3C] focus:ring-4 focus:ring-[#98FB98]/30 outline-none transition-all text-lg bg-white/90"
                                                    placeholder="example@company.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* كلمة المرور */}
                                        <div>
                                            <label className="block text-[#2B4B3C] font-bold mb-3 text-lg">
                                                كلمة المرور
                                            </label>
                                            <div className="relative">
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                                                    <Lock className="w-5 h-5 text-[#3A5E4A]" />
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full pr-12 pl-12 py-4 border-2 border-[#8FBC8F] rounded-xl focus:border-[#2B4B3C] focus:ring-4 focus:ring-[#98FB98]/30 outline-none transition-all text-lg bg-white/90"
                                                    placeholder="أدخل كلمة المرور"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3A5E4A] hover:text-[#2B4B3C] transition-colors z-10"
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
                                                    className="w-5 h-5 text-[#2B4B3C] rounded border-2 border-[#8FBC8F] focus:ring-[#98FB98] cursor-pointer"
                                                />
                                                <span className="text-[#2B4B3C] font-medium group-hover:text-[#3A5E4A] transition-colors">تذكرني</span>
                                            </label>
                                            <a href="#" className="text-[#2B4B3C] hover:text-[#3A5E4A] font-semibold hover:underline transition-all">
                                                نسيت كلمة المرور؟
                                            </a>
                                        </div>

                                        {/* زر تسجيل الدخول */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 bg-gradient-to-r from-[#2B4B3C] to-[#3A5E4A] hover:from-[#1A2E25] hover:to-[#2B4B3C] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] border border-[#98FB98]/30"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>جاري تسجيل الدخول...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>تسجيل الدخول</span>
                                                    <Leaf className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* رابط التسجيل الجديد */}
                                <div className="px-8 pb-8">
                                    <div className="border-t-2 border-[#8FBC8F] pt-6 text-center">
                                        <p className="text-[#2B4B3C] mb-4 text-lg font-medium">
                                            انضم إلى مجتمع الاستدامة
                                        </p>
                                        <button
                                            onClick={() => navigate('/registration')}
                                            className="w-full py-4 border-2 border-[#2B4B3C] text-[#2B4B3C] hover:bg-[#98FB98]/20 font-bold rounded-xl transition-all hover:shadow-md text-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            تسجيل مصنع جديد
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* معلومات إضافية */}
                            <div className="mt-6 text-center">
                                <p className="text-white/90">
                                    لديك استفسار؟{' '}
                                    <a href="#" className="text-[#F0E68C] hover:text-[#98FB98] font-semibold hover:underline transition-colors">
                                        تواصل مع فريق الاستدامة
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative text-center py-6 text-white/80 text-sm">
                <p>© 2026 ECOv - معاً نحو بيئة أفضل</p>
            </div>
        </div>
    )
}

export default Login