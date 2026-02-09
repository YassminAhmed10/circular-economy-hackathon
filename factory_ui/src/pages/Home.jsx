import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Recycle, Package, Users, TrendingUp, Handshake, Leaf, ChevronRight, Play, Award, MessageCircle, X, Moon, Sun, Globe } from 'lucide-react';
import videoFile from '../assets/Untitled design (1).mp4';

function Home({ user }) {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ar');

  // الترجمة
  const translations = {
    ar: {
      heroTitle: "منصة الاقتصاد الدائري",
      heroSubtitle: "حوّل نفاياتك الصناعية إلى فرص ربحية من خلال منصتنا الذكية. نوفر حلولاً متكاملة لربط المصانع مع شركات إعادة التدوير لتحقيق الاستدامة الاقتصادية والبيئية.",
      circularEconomy: "الاقتصاد الدائري للصناعة المصرية",
      startFree: "ابدأ الآن مجاناً",
      watchVideo: "شاهد الفيديو التعريفي",
      goToDashboard: "الذهاب للوحة التحكم",
      featuresTitle: "مميزات المنصة",
      featuresSubtitle: "نوفر لك حلولاً متكاملة لإدارة النفايات الصناعية وتحقيق قيمة اقتصادية منها",
      howItWorksTitle: "كيف تعمل المنصة؟",
      howItWorksSubtitle: "أربع خطوات بسيطة لتحويل نفاياتك إلى أرباح",
      statisticsTitle: "إحصائيات المنصة",
      successStoryTitle: "قصة نجاح موثقة",
      successStorySub: "Turn Waste Into Value",
      factoryName: "مصنع زيوت الطهي",
      monthlySavings: "وفورات شهرية من بيع الزيت المستعمل",
      successDescription: "نجح المصنع في تحويل زيت الطهي المستعمل من عبء مالي إلى مصدر دخل ثابت من خلال بيعه لمصانع إنتاج الوقود الحيوي.",
      watchSuccessStory: "شاهد قصة النجاح بالفيديو",
      ctaTitle: user ? "مرحباً بعودتك، 👋" : "انضم إلى شبكة الاقتصاد الدائري الآن",
      ctaSubtitle: user ? "استمر في تحقيق القيمة من نفايات مصنعك" : "سجل مصنعك اليوم وابدأ في تحقيق قيمة من نفاياتك الصناعية",
      addWaste: "إضافة نفايات جديدة",
      registerFree: "سجل مصنعك مجاناً",
      
      // Features
      features: [
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
      ],
      
      // Steps
      steps: [
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
      ],
      
      // Stats
      stats: [
        { number: '150+', label: 'مصنع مسجل', icon: <Factory className="w-8 h-8" /> },
        { number: '500+', label: 'صفقة مكتملة', icon: <Handshake className="w-8 h-8" /> },
        { number: '2,500+', label: 'طن نفايات معاد تدويرها', icon: <Recycle className="w-8 h-8" /> },
        { number: '4.8/5', label: 'تقييم المستخدمين', icon: <Award className="w-8 h-8" /> }
      ]
    },
    en: {
      heroTitle: "Circular Economy Platform",
      heroSubtitle: "Transform your industrial waste into profitable opportunities through our smart platform. We provide integrated solutions to connect factories with recycling companies to achieve economic and environmental sustainability.",
      circularEconomy: "Circular Economy for Egyptian Industry",
      startFree: "Start Now for Free",
      watchVideo: "Watch Intro Video",
      goToDashboard: "Go to Dashboard",
      featuresTitle: "Platform Features",
      featuresSubtitle: "We provide you with integrated solutions for managing industrial waste and achieving economic value from it",
      howItWorksTitle: "How Does the Platform Work?",
      howItWorksSubtitle: "Four simple steps to turn your waste into profits",
      statisticsTitle: "Platform Statistics",
      successStoryTitle: "Documented Success Story",
      successStorySub: "Turn Waste Into Value",
      factoryName: "Cooking Oil Factory",
      monthlySavings: "Monthly savings from selling used oil",
      successDescription: "The factory successfully converted used cooking oil from a financial burden into a steady source of income by selling it to biofuel production plants.",
      watchSuccessStory: "Watch Success Story Video",
      ctaTitle: user ? "Welcome back, 👋" : "Join the Circular Economy Network Now",
      ctaSubtitle: user ? "Continue creating value from your factory waste" : "Register your factory today and start creating value from your industrial waste",
      addWaste: "Add New Waste",
      registerFree: "Register Your Factory Free",
      
      // Features
      features: [
        {
          icon: <Factory className="w-8 h-8" />,
          title: 'Connect Factories',
          description: 'Connect waste-producing factories with recycling plants'
        },
        {
          icon: <Recycle className="w-8 h-8" />,
          title: 'Circular Economy',
          description: 'Transform waste into reusable resources'
        },
        {
          icon: <Package className="w-8 h-8" />,
          title: 'Waste Management',
          description: 'Integrated system for managing and tracking industrial waste'
        },
        {
          icon: <Users className="w-8 h-8" />,
          title: 'Partner Network',
          description: 'Integrated community of companies and stakeholders'
        }
      ],
      
      // Steps
      steps: [
        {
          number: '01',
          title: 'Factory Registration',
          description: 'Register your factory data and types of waste produced',
          icon: <Factory className="w-6 h-6" />
        },
        {
          number: '02',
          title: 'List Waste',
          description: 'Add available waste for sale in the platform market',
          icon: <Package className="w-6 h-6" />
        },
        {
          number: '03',
          title: 'Receive Offers',
          description: 'Receive purchase offers from recycling companies',
          icon: <MessageCircle className="w-6 h-6" />
        },
        {
          number: '04',
          title: 'Complete Deal',
          description: 'Choose the appropriate offer and complete the sale process',
          icon: <Handshake className="w-6 h-6" />
        }
      ],
      
      // Stats
      stats: [
        { number: '150+', label: 'Registered Factory', icon: <Factory className="w-8 h-8" /> },
        { number: '500+', label: 'Completed Deal', icon: <Handshake className="w-8 h-8" /> },
        { number: '2,500+', label: 'Ton Recycled Waste', icon: <Recycle className="w-8 h-8" /> },
        { number: '4.8/5', label: 'User Rating', icon: <Award className="w-8 h-8" /> }
      ]
    }
  };

  const t = translations[language];

  useEffect(() => {
    // تطبيق الوضع الداكن على document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // تطبيق اتجاه النص بناءً على اللغة
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Video Modal Component
  const VideoModal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <h3 className="text-xl font-bold">
            {language === 'ar' ? 'الفيديو التعريفي لمنصة ECOv' : 'ECOv Platform Introductory Video'}
          </h3>
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
              {language === 'ar' ? 'متصفحك لا يدعم تشغيل الفيديو. الرجاء تحديث متصفحك.' : 'Your browser does not support video playback. Please update your browser.'}
            </video>
          </div>
          
          {/* Video Description */}
          <div className="mt-6 space-y-4">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'عن هذا الفيديو' : 'About This Video'}
            </h4>
            <p className="text-slate-600 dark:text-slate-300">
              {language === 'ar' 
                ? 'شاهد هذا الفيديو التعريفي لتعرف كيف تعمل منصة ECOv لتحويل النفايات الصناعية إلى فرص ربحية. تعرف على خطوات العمل وكيف يمكن لمصنعك الاستفادة من المنصة.'
                : 'Watch this introductory video to learn how the ECOv platform works to transform industrial waste into profitable opportunities. Learn about the workflow and how your factory can benefit from the platform.'}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {language === 'ar' ? 'مدة الفيديو' : 'Video Duration'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {language === 'ar' ? '2:30 دقيقة' : '2:30 minutes'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Factory className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {language === 'ar' ? 'للمصانع' : 'For Factories'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {language === 'ar' ? 'جميع الأنواع' : 'All Types'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/registration')}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
            >
              {language === 'ar' ? 'سجل مصنعك الآن' : 'Register Your Factory Now'}
            </button>
            <button
              onClick={() => setShowVideoModal(false)}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`font-sans ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Video Modal */}
      {showVideoModal && <VideoModal />}

      {/* Header Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
          title={language === 'ar' ? 'Switch to English' : 'التغيير إلى العربية'}
        >
          <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {language === 'ar' ? 'EN' : 'ع'}
          </span>
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-950 text-white overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgzNCwgMTk3LCAxNTQsIDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${language === 'en' ? 'text-left' : 'text-right'}`}>
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 backdrop-blur-sm text-emerald-300 rounded-full text-sm font-bold mb-6 border border-emerald-500/30 ${language === 'en' ? 'flex-row-reverse' : ''}`}>
                <Leaf className="w-4 h-4" />
                {t.circularEconomy}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-emerald-400">ECOv</span>
                <br />
                {t.heroTitle}
              </h1>
              
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                {t.heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                  >
                    {t.goToDashboard}
                    <ChevronRight className={`w-5 h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/registration')}
                      className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                    >
                      {t.startFree}
                      <ChevronRight className={`w-5 h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      onClick={() => setShowVideoModal(true)}
                      className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-lg transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 hover:shadow-lg group"
                    >
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      {t.watchVideo}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm p-8 rounded-2xl border border-emerald-500/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: <Recycle className="w-10 h-10" />, title: language === 'ar' ? 'تدوير' : 'Recycling', desc: language === 'ar' ? 'المخلفات الصناعية' : 'Industrial Waste', color: 'emerald' },
                    { icon: <TrendingUp className="w-10 h-10" />, title: language === 'ar' ? 'زيادة' : 'Increase', desc: language === 'ar' ? 'الأرباح والإيرادات' : 'Profits & Revenue', color: 'blue' },
                    { icon: <Leaf className="w-10 h-10" />, title: language === 'ar' ? 'حماية' : 'Protection', desc: language === 'ar' ? 'البيئة المستدامة' : 'Sustainable Environment', color: 'teal' },
                    { icon: <Handshake className="w-10 h-10" />, title: language === 'ar' ? 'شراكات' : 'Partnerships', desc: language === 'ar' ? 'صناعية مثمرة' : 'Productive Industrial', color: 'purple' }
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
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${language === 'en' ? 'text-left' : 'text-right'}`}>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t.featuresTitle}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {t.featuresSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* كيف تعمل المنصة */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${language === 'en' ? 'text-left' : 'text-right'}`}>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t.howItWorksTitle}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {t.howItWorksSubtitle}
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {t.steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/30 transition-all duration-300 group">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      {step.number}
                    </div>
                    
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* إحصائيات */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-800 dark:via-teal-800 dark:to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 ${language === 'en' ? 'text-left' : 'text-right'}`}>
            <h2 className="text-3xl font-bold mb-2">{t.statisticsTitle}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {t.stats.map((stat, index) => (
              <div key={index} className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="opacity-80 mx-auto mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قصة نجاح */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-12 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white rounded-full"></div>
                </div>
                <div className="relative z-10 text-center">
                  <div className="text-6xl font-bold text-white opacity-20 mb-4">ECOv</div>
                  <div className="text-white text-xl font-bold">{t.successStoryTitle}</div>
                  <div className="text-emerald-100 mt-2">{t.successStorySub}</div>
                </div>
              </div>
              <div className="p-12">
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold mb-6 ${language === 'en' ? 'flex-row-reverse' : ''}`}>
                  <Award className="w-4 h-4" />
                  {t.successStoryTitle}
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t.factoryName}</h3>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-6 rounded-xl mb-6 border border-emerald-200 dark:border-emerald-700">
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">13,000 {language === 'ar' ? 'جنيه' : 'EGP'}</div>
                  <p className="text-emerald-700 dark:text-emerald-300 font-medium">{t.monthlySavings}</p>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
                  {t.successDescription}
                </p>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 w-full flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {t.watchSuccessStory}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل - مختلفة حسب حالة المستخدم */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-emerald-900 dark:from-slate-950 dark:to-emerald-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {user ? (
            <>
              <h2 className="text-4xl font-bold mb-6">
                {language === 'ar' ? `مرحباً بعودتك، ${user.name} 👋` : `Welcome back, ${user.name} 👋`}
              </h2>
              <p className="text-xl text-emerald-100 mb-10">
                {t.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105"
                >
                  {t.goToDashboard}
                </button>
                <button
                  onClick={() => navigate('/list-waste')}
                  className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:shadow-lg"
                >
                  {t.addWaste}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-6">
                {t.ctaTitle}
              </h2>
              <p className="text-xl text-emerald-100 mb-10">
                {t.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/registration')}
                  className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105"
                >
                  {t.registerFree}
                </button>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {t.watchVideo}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;