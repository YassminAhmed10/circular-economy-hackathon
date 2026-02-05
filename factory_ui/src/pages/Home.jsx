import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Factory, Recycle, Package, Users, TrendingUp, Handshake, Leaf, ArrowRightLeft, CheckCircle, ChevronRight, Play, Phone, Mail, MapPin, Award, MessageCircle, X } from 'lucide-react';
import logo from '../assets/logooo1ecov.png';
import videoFile from '../assets/Untitled design (1).mp4';

function Home() {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);

  const features = [
    {
      icon: <Factory className="w-8 h-8" />,
      title: 'ربط المصانع',
      description: 'ربط المصانع المنتجة للنفايات مع مصانع إعادة التدوير'
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: 'اقتصاد دائري',
      description: 'تحويل النفايات إلى موارد قابلة لإعادة الاستخدام'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'إدارة النفايات',
      description: 'نظام متكامل لإدارة وتتبع النفايات الصناعية'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'شبكة شركاء',
      description: 'مجتمع متكامل من الشركات والجهات المعنية'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'تسجيل المصنع',
      description: 'قم بتسجيل بيانات مصنعك وأنواع النفايات المنتجة',
      icon: <Factory className="w-6 h-6" />
    },
    {
      number: '02',
      title: 'عرض النفايات',
      description: 'أضف النفايات المتاحة للبيع في سوق المنصة',
      icon: <Package className="w-6 h-6" />
    },
    {
      number: '03',
      title: 'استقبال العروض',
      description: 'تلقي عروض الشراء من شركات إعادة التدوير',
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      number: '04',
      title: 'إتمام الصفقة',
      description: 'اختر العرض المناسب وأتمم عملية البيع',
      icon: <Handshake className="w-6 h-6" />
    }
  ];

  // Video Modal Component
  const VideoModal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4" dir="rtl">
      <div className="relative bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <h3 className="text-xl font-bold">الفيديو التعريفي لمنصة ECOv</h3>
          <button
            onClick={() => setShowVideoModal(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Video Player */}
        <div className="p-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              className="w-full h-full"
              controls
              autoPlay
              poster="/api/placeholder/800/450"
            >
              <source src={videoFile} type="video/mp4" />
              متصفحك لا يدعم تشغيل الفيديو. الرجاء تحديث متصفحك.
            </video>
          </div>
          
          {/* Video Description */}
          <div className="mt-6 space-y-4">
            <h4 className="text-lg font-bold text-slate-900">عن هذا الفيديو</h4>
            <p className="text-slate-600">
              شاهد هذا الفيديو التعريفي لتعرف كيف تعمل منصة ECOv لتحويل النفايات الصناعية إلى فرص ربحية.
              تعرف على خطوات العمل وكيف يمكن لمصنعك الاستفادة من المنصة.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <Play className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-slate-900">مدة الفيديو</p>
                  <p className="text-sm text-slate-600">2:30 دقيقة</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Factory className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">للمصانع</p>
                  <p className="text-sm text-slate-600">جميع الأنواع</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/registration')}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
            >
              سجل مصنعك الآن
            </button>
            <button
              onClick={() => setShowVideoModal(false)}
              className="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {/* Video Modal */}
      {showVideoModal && <VideoModal />}

      {/* Header الرئيسي */}
      <nav className="bg-black shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-row-reverse items-center justify-between">
            <div className="flex items-center">
              <img src={logo} alt="ECOv Logo" className="h-14 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-white hover:bg-emerald-600 hover:text-white text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-white shadow-md"
              >
                تسجيل الدخول
              </button>
              <button 
                onClick={() => navigate('/registration')} 
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30"
              >
                سجل مصنع الآن
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgzNCwgMTk3LCAxNTQsIDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 backdrop-blur-sm text-emerald-300 rounded-full text-sm font-bold mb-6 border border-emerald-500/30">
                <Leaf className="w-4 h-4" />
                الاقتصاد الدائري للصناعة المصرية
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-emerald-400">ECOv</span>
                <br />
                منصة الاقتصاد الدائري
              </h1>
              
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                حوّل نفاياتك الصناعية إلى فرص ربحية من خلال منصتنا الذكية. نوفر حلولاً متكاملة لربط المصانع مع شركات إعادة التدوير لتحقيق الاستدامة الاقتصادية والبيئية.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/registration')}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  ابدأ الآن مجاناً
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-lg transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 hover:shadow-lg group"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  شاهد الفيديو التعريفي
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm p-8 rounded-2xl border border-emerald-500/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: <Recycle className="w-10 h-10" />, title: 'تدوير', desc: 'المخلفات الصناعية', color: 'emerald' },
                    { icon: <TrendingUp className="w-10 h-10" />, title: 'زيادة', desc: 'الأرباح والإيرادات', color: 'blue' },
                    { icon: <Leaf className="w-10 h-10" />, title: 'حماية', desc: 'البيئة المستدامة', color: 'teal' },
                    { icon: <Handshake className="w-10 h-10" />, title: 'شراكات', desc: 'صناعية مثمرة', color: 'purple' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-emerald-500/20 to-teal-600/10 p-6 rounded-xl backdrop-blur-sm border border-emerald-500/20 hover:scale-105 transition-transform duration-300">
                      <div className="text-emerald-400 mb-3">
                        {item.icon}
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{item.title}</div>
                      <div className="text-sm text-emerald-200">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* مميزات المنصة */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">مميزات المنصة</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نوفر لك حلولاً متكاملة لإدارة النفايات الصناعية وتحقيق قيمة اقتصادية منها
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* كيف تعمل المنصة */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">كيف تعمل المنصة؟</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              أربع خطوات بسيطة لتحويل نفاياتك إلى أرباح
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-xl border border-slate-200 hover:border-emerald-500/30 transition-all duration-300 group">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      {step.number}
                    </div>
                    
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* إحصائيات */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '150+', label: 'مصنع مسجل', icon: <Factory className="w-8 h-8 mx-auto mb-3" /> },
              { number: '500+', label: 'صفقة مكتملة', icon: <Handshake className="w-8 h-8 mx-auto mb-3" /> },
              { number: '2,500+', label: 'طن نفايات معاد تدويرها', icon: <Recycle className="w-8 h-8 mx-auto mb-3" /> },
              { number: '4.8/5', label: 'تقييم المستخدمين', icon: <Award className="w-8 h-8 mx-auto mb-3" /> }
            ].map((stat, index) => (
              <div key={index} className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="opacity-80">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قصة نجاح */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-12 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white rounded-full"></div>
                </div>
                <div className="relative z-10 text-center">
                  <div className="text-6xl font-bold text-white opacity-20 mb-4">ECOv</div>
                  <div className="text-white text-xl font-bold">منصة الاقتصاد الدائري</div>
                  <div className="text-emerald-100 mt-2">Turn Waste Into Value</div>
                </div>
              </div>
              <div className="p-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6">
                  <Award className="w-4 h-4" />
                  قصة نجاح موثقة
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">مصنع زيوت الطهي</h3>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl mb-6 border border-emerald-200">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">13,000 جنيه</div>
                  <p className="text-emerald-700 font-medium">وفورات شهرية من بيع الزيت المستعمل</p>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                  نجح المصنع في تحويل زيت الطهي المستعمل من عبء مالي إلى مصدر دخل ثابت من خلال بيعه لمصانع إنتاج الوقود الحيوي.
                </p>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 w-full flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  شاهد قصة النجاح بالفيديو
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            انضم إلى شبكة الاقتصاد الدائري الآن
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            سجل مصنعك اليوم وابدأ في تحقيق قيمة من نفاياتك الصناعية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/registration')}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105"
            >
              سجل مصنعك مجاناً
            </button>
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              شاهد الفيديو التعريفي
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="ECOv Logo" className="h-16 w-auto" />
                <div>
                  <h3 className="text-2xl font-bold">ECOv</h3>
                  <p className="text-slate-400 text-sm">منصة الاقتصاد الدائري</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                منصة رائدة لربط المصانع مع شركات إعادة التدوير لتحقيق الاستدامة والاقتصاد الدائري.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 border-r-2 border-emerald-500 pr-3">روابط سريعة</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 hover:gap-3">→ الرئيسية</Link></li>
                <li><Link to="/registration" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 hover:gap-3">→ تسجيل مصنع</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 hover:gap-3">→ تسجيل الدخول</Link></li>
                <li><button onClick={() => setShowVideoModal(true)} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 hover:gap-3 w-full text-right">→ الفيديو التعريفي</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 border-r-2 border-emerald-500 pr-3">تواصل معنا</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>+20 123 456 7890</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>info@ecov-platform.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span>القاهرة، مصر</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-500">
              © 2024 ECOv. جميع الحقوق محفوظة. | تصميم وتطوير لصالح الاقتصاد الدائري
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;