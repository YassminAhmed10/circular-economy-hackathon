import { Factory, TrendingUp, Recycle, Handshake, Leaf, ArrowRightLeft, Target, Users, Shield, Award, ChevronRight, CheckCircle } from 'lucide-react'
import './Home.css'
import logo from '../assets/logooo1ecov.png'

function Home({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navigation */}
      <nav className="bg-black shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <img src={logo} alt="ECOv Logo" className="h-14 w-auto object-contain" />
              </div>
            </div>
            <div className="hidden lg:flex gap-2 items-center">
              <a href="#about" className="text-white/90 hover:text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all">عن المنصة</a>
              <a href="#how-it-works" className="text-white/90 hover:text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all">كيف يعمل</a>
              <a href="#benefits" className="text-white/90 hover:text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all">الفوائد</a>
              <button onClick={() => onNavigate?.('dashboard')} className="text-white/90 hover:text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all">السوق</button>
              <a href="#contact" className="text-white/90 hover:text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all">اتصل بنا</a>
              <div className="h-8 w-px bg-white/30 mx-2"></div>
              <button onClick={() => onNavigate?.('registration')} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border-2 border-white/30 backdrop-blur-sm">
                سجل الآن
              </button>
              <button onClick={() => onNavigate?.('login')} className="px-6 py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 font-bold rounded-xl transition-all shadow-lg transform hover:scale-105">
                تسجيل الدخول
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-100 via-amber-200 to-yellow-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6">
                <Leaf className="w-4 h-4 inline mr-2" />
                الاقتصاد الدائري للصناعة المصرية
              </div>
              <div className="mb-6">
                <img src={logo} alt="ECOV" className="h-20 w-auto" />
                <p className="text-2xl text-slate-700 mt-3 font-light tracking-wider">Turn Waste Into Value</p>
              </div>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                منصة ذكية لتحويل مخلفات مصنعك إلى فرص ربحية من خلال الاقتصاد الدائري. نساعد المصانع على تبادل المخلفات وتحويلها إلى مواد خام قيمة، مما يعزز الربحية ويحافظ على البيئة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => onNavigate?.('registration')} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2">
                  سجل مصنعك الآن
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
                    <Recycle className="w-12 h-12 text-emerald-600 mb-3" />
                    <div className="text-2xl font-bold text-slate-800 mb-1">تدوير</div>
                    <div className="text-sm text-slate-600">المخلفات الصناعية</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <TrendingUp className="w-12 h-12 text-blue-600 mb-3" />
                    <div className="text-2xl font-bold text-slate-800 mb-1">زيادة</div>
                    <div className="text-sm text-slate-600">الأرباح والإيرادات</div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl">
                    <Leaf className="w-12 h-12 text-teal-600 mb-3" />
                    <div className="text-2xl font-bold text-slate-800 mb-1">حماية</div>
                    <div className="text-sm text-slate-600">البيئة المستدامة</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <Handshake className="w-12 h-12 text-purple-600 mb-3" />
                    <div className="text-2xl font-bold text-slate-800 mb-1">شراكات</div>
                    <div className="text-sm text-slate-600">صناعية مثمرة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Objectives */}
      <div id="about" className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">أهداف المنصة</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نسعى لتحقيق التحول الصناعي المستدام من خلال ربط المصانع في منظومة اقتصادية دائرية متكاملة
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-200 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">تحويل النفايات لربح</h3>
              <p className="text-slate-600 leading-relaxed">
                تحويل مخلفات المصانع من عبء مالي إلى مصدر دخل إضافي وفرص استثمارية جديدة
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border-2 border-teal-200 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">المحافظة على البيئة</h3>
              <p className="text-slate-600 leading-relaxed">
                تقليل التلوث البيئي والانبعاثات الكربونية من خلال إعادة تدوير واستخدام المخلفات الصناعية
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-200 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">تطوير العلاقات الصناعية</h3>
              <p className="text-slate-600 leading-relaxed">
                بناء شبكة قوية من الشراكات بين المصانع لتبادل الموارد والخبرات والفرص التجارية
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border-2 border-purple-200 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <ArrowRightLeft className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">الاقتصاد الدائري</h3>
              <p className="text-slate-600 leading-relaxed">
                جعل نفايات مصنع مادة خام لمصنع آخر، محققين دورة إنتاجية مستدامة ومتكاملة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">كيف يعمل النظام</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              عملية بسيطة وفعّالة لربط المصانع وتحويل المخلفات إلى موارد قيّمة
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-emerald-600">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">تسجيل المصنع</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  سجل مصنعك على المنصة وحدد نوع المخلفات الصناعية المتوفرة لديك أو التي تحتاجها كمواد خام
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>تسجيل بيانات المصنع</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>تحديد أنواع المخلفات</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>توثيق الشهادات</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-600">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">البحث والمطابقة</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  نظامنا الذكي يربط المصانع تلقائياً، حيث يطابق مخلفات مصنع مع احتياجات مصنع آخر
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>مطابقة ذكية آلية</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>عرض خيارات متعددة</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>تقييمات ومراجعات</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-purple-600">
                <div className="w-14 h-14 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">التبادل والربح</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  اتفق على الشروط، أتمم الصفقة بأمان، واحصل على عائد مالي من مخلفاتك أو وفر في تكاليف المواد الخام
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>نظام دفع آمن</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>توثيق العمليات</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>دعم فني مستمر</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div id="benefits" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">الفوائد والتأثير</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              أرقام ونتائج حقيقية تثبت تأثير الاقتصاد الدائري على الصناعة المصرية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-2xl text-white shadow-xl">
              <Factory className="w-12 h-12 mb-4 opacity-80" />
              <div className="text-4xl font-bold mb-2">1.2M</div>
              <div className="text-emerald-100 font-medium">طن نفايات صناعية سنوياً</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white shadow-xl">
              <Recycle className="w-12 h-12 mb-4 opacity-80" />
              <div className="text-4xl font-bold mb-2">45%</div>
              <div className="text-blue-100 font-medium">قابلة لإعادة التدوير</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-2xl text-white shadow-xl">
              <TrendingUp className="w-12 h-12 mb-4 opacity-80" />
              <div className="text-4xl font-bold mb-2">500M</div>
              <div className="text-purple-100 font-medium">جنيه قيمة سوقية محتملة</div>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-8 rounded-2xl text-white shadow-xl">
              <Users className="w-12 h-12 mb-4 opacity-80" />
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-teal-100 font-medium">مصنع مسجل على المنصة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Story Section */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">قصص نجاح واقعية</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              شركات حققت نجاحات ملموسة من خلال التحول إلى الاقتصاد الدائري
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto border border-slate-200">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-12 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-30"></div>
                  <svg viewBox="0 0 400 300" className="w-full h-auto relative z-10">
                    <circle cx="150" cy="150" r="70" fill="#334155" opacity="0.9"/>
                    <circle cx="200" cy="150" r="70" fill="#fbbf24" opacity="0.9"/>
                    <circle cx="250" cy="150" r="70" fill="#3b82f6" opacity="0.9"/>
                  </svg>
                </div>
              </div>
              <div className="p-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6">
                  <Award className="w-4 h-4" />
                  قصة نجاح موثقة
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">مصنع زيوت الطهي</h3>
                <div className="bg-emerald-50 p-6 rounded-xl mb-6">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">13,000 جنيه</div>
                  <p className="text-emerald-700 font-medium">وفورات شهرية من بيع الزيت المستعمل</p>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                  نجح المصنع في تحويل زيت الطهي المستعمل من مخلف يكلف المصنع مالاً للتخلص منه، 
                  إلى مصدر دخل ثابت من خلال بيعه لمصانع إنتاج الوقود الحيوي.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-slate-800">-80%</div>
                    <div className="text-sm text-slate-600">تكاليف التخلص من المخلفات</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-slate-800">+25%</div>
                    <div className="text-sm text-slate-600">زيادة في هامش الربح</div>
                  </div>
                </div>
                <button className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                  اقرأ القصة الكاملة
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ابدأ رحلة التحول إلى الاقتصاد الدائري اليوم
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
            انضم إلى مئات المصانع التي تحقق الربح وتحمي البيئة في آن واحد
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate?.('registration')} className="px-10 py-5 bg-white hover:bg-slate-50 text-emerald-700 font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              <Factory className="w-6 h-6" />
              سجل مصنعك مجاناً
            </button>
            <button onClick={() => onNavigate?.('dashboard')} className="px-10 py-5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 border-2 border-white/20">
              <Target className="w-6 h-6" />
              تواصل مع فريق المبيعات
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16 border-t-4 border-emerald-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div>
              <h5 className="font-bold text-xl mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                Contact Us
              </h5>
              <div className="space-y-3">
                <p className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                  <span className="text-2xl">📞</span>
                  <span>+2 83 857 3418</span>
                </p>
                <p className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                  <span className="text-2xl">✉️</span>
                  <span>dawr@masane.com</span>
                </p>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-xl mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                Social Media
              </h5>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 shadow-lg">
                  <span className="text-white font-bold text-lg">f</span>
                </a>
                <a href="#" className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 shadow-lg">
                  <span className="text-white font-bold text-lg">𝕏</span>
                </a>
                <a href="#" className="w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 shadow-lg">
                  <span className="text-white font-bold text-lg">in</span>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-xl mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                Legal
              </h5>
              <div className="space-y-2">
                <p>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span>→</span> Privacy Policy
                  </a>
                </p>
                <p>
                  <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span>→</span> Terms of Service
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2026 Dawr Al-Masane. All rights reserved. | دور المصانع - الاقتصاد الدائري
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home