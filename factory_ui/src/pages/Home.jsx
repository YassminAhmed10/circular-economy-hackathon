import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Play, ChevronLeft, ChevronRight,
  Recycle, Handshake, Factory, Package,
  MessageCircle, TrendingUp, Leaf, Boxes,
  Users, Trophy, CheckCircle2
} from 'lucide-react';

// ── استيراد الصور المحلية ──
import chemicalsImg  from '../assets/Chemicals.png';
import mineralsImg   from '../assets/Minerals.png';
import papersImg     from '../assets/Papers .png';       // لاحظ المسافة في الاسم
import electronicsImg from '../assets/Electronics .png'; // لاحظ المسافة في الاسم
import glassImg      from '../assets/Glass.png';

// للفئات اللي مفيهاش صورة محلية هنستخدم صور Unsplash احتياطياً
const FALLBACK_PLASTIC  = 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&q=80';
const FALLBACK_WOOD     = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80';
const FALLBACK_FABRIC   = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80';

const SLIDES = [
  { id:1, src:'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1400&q=80', arTitle:'حوّل نفاياتك إلى قيمة حقيقية', enTitle:'Turn Your Waste Into Real Value', arSub:'انضم لأكثر من 150 مصنع يستفيد من المنصة', enSub:'Join 150+ factories already benefiting' },
  { id:2, src:'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1400&q=80', arTitle:'بع نفاياتك الصناعية بسهولة',      enTitle:'Sell Industrial Waste Easily',        arSub:'سوق متخصص يربطك بشركات إعادة التدوير', enSub:'A specialized market connecting you to recyclers' },
  { id:3, src:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1400&q=80', arTitle:'اقتصاد دائري مستدام',               enTitle:'A Sustainable Circular Economy',      arSub:'نحمي البيئة ونحقق أرباحاً في نفس الوقت', enSub:'Protecting the environment while generating profit' },
];

const FEATURES = [
  { Icon:Factory,  ar:'ربط المصانع',   en:'Connect Factories', dAr:'ربط مباشر بين المصانع وشركات إعادة التدوير',      dEn:'Direct link between factories and recycling companies' },
  { Icon:Recycle,  ar:'اقتصاد دائري',  en:'Circular Economy',  dAr:'تحويل النفايات إلى موارد قابلة للاستخدام مجدداً', dEn:'Transform waste into reusable resources'               },
  { Icon:Boxes,    ar:'إدارة النفايات', en:'Waste Management',  dAr:'نظام متكامل لإدارة وتتبع النفايات الصناعية',       dEn:'Integrated system for managing industrial waste'       },
  { Icon:Users,    ar:'شبكة شركاء',    en:'Partner Network',   dAr:'مجتمع متكامل من الشركات والجهات المعنية',          dEn:'Full community of companies and stakeholders'          },
];

const STEPS = [
  { n:'01', Icon:Factory,       ar:'تسجيل المصنع',  en:'Register Factory', dAr:'سجّل بيانات مصنعك وأنواع النفايات المنتجة',    dEn:'Register your factory data and waste types'           },
  { n:'02', Icon:Package,       ar:'عرض النفايات',   en:'List Waste',        dAr:'أضف النفايات المتاحة للبيع في سوق المنصة',      dEn:'Add available waste for sale on the platform market'  },
  { n:'03', Icon:MessageCircle, ar:'استقبال العروض', en:'Receive Offers',    dAr:'تلقّ عروض شراء من شركات إعادة التدوير',         dEn:'Receive purchase offers from recycling companies'     },
  { n:'04', Icon:Handshake,     ar:'إتمام الصفقة',   en:'Close the Deal',    dAr:'اختر العرض المناسب وأتمم عملية البيع بسهولة',  dEn:'Choose the best offer and complete the sale easily'   },
];

// ── الفئات مع الصور المحلية ──
// path يجب أن يتطابق مع categoryParam في Marketplace
const POPULAR_CATS = [
  { ar:'بلاستيك',    en:'Plastic',      categoryParam:'بلاستيك',    count:'124', img: FALLBACK_PLASTIC   },
  { ar:'معادن',      en:'Minerals',     categoryParam:'معادن',      count:'87',  img: mineralsImg        },
  { ar:'ورق',        en:'Papers',       categoryParam:'ورق',         count:'63',  img: papersImg          },
  { ar:'زجاج',       en:'Glass',        categoryParam:'زجاج',        count:'45',  img: glassImg           },
  { ar:'خشب',        en:'Wood',         categoryParam:'خشب',         count:'39',  img: FALLBACK_WOOD      },
  { ar:'قماش',       en:'Fabric',       categoryParam:'نسيج',        count:'31',  img: FALLBACK_FABRIC    },
  { ar:'كيماويات',   en:'Chemicals',    categoryParam:'كيماويات',    count:'28',  img: chemicalsImg       },
  { ar:'إلكترونيات', en:'Electronics',  categoryParam:'إلكترونيات',  count:'22',  img: electronicsImg     },
];

// ════════════════════════════════════════════════════════════════════════════
export default function Home({ user, lang, dark }) {
  const navigate = useNavigate();
  const [slide, setSlide]         = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const timerRef = useRef(null);
  const ar = lang === 'ar';
  const D  = dark;

  const bg  = D ? '#0f1a12' : '#fff';
  const bgS = D ? '#111d14' : '#f9fafb';
  const txt = D ? '#f0fdf4' : '#111827';
  const mu  = D ? '#6ee7b7' : '#6b7280';
  const bdr = D ? '#1e3320' : '#e5e7eb';

  const startTimer = () => { timerRef.current = setInterval(() => setSlide(s => (s+1) % SLIDES.length), 4500); };
  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []);
  const goSlide = d => { clearInterval(timerRef.current); setSlide(s => (s+d+SLIDES.length)%SLIDES.length); startTimer(); };

  // ── الانتقال إلى Marketplace مع تحديد الفئة ──
  const goToMarket = (categoryParam) => {
    navigate(`/market?category=${encodeURIComponent(categoryParam)}`);
  };

  return (
    <div style={{ fontFamily:"'Cairo',system-ui,sans-serif", direction:ar?'rtl':'ltr', background:bg, color:txt, transition:'background .3s,color .3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;}

        /* ── CAROUSEL ── */
        .hp-car   { position:relative; overflow:hidden; height:440px; }
        .hp-track { display:flex; transition:transform .6s cubic-bezier(.4,0,.2,1); height:100%; }
        .hp-slide { min-width:100%; position:relative; height:100%; }
        .hp-slide img { width:100%; height:100%; object-fit:cover; display:block; }
        .hp-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to bottom,rgba(0,0,0,.3) 0%,rgba(0,0,0,.62) 100%);
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:32px;
        }
        .hp-title { font-size:clamp(26px,5vw,52px); font-weight:900; color:#fff; text-align:center; line-height:1.18; text-shadow:0 2px 16px rgba(0,0,0,.45); }
        .hp-sub   { font-size:clamp(14px,2vw,18px); color:rgba(255,255,255,.88); font-weight:500; text-align:center; }
        .hp-btns  { display:flex; gap:12px; margin-top:4px; }
        .hp-btn1  { padding:12px 30px; background:#059669; color:#fff; border:none; border-radius:9px; font-size:15px; font-weight:700; cursor:pointer; font-family:'Cairo',sans-serif; transition:all .2s; }
        .hp-btn1:hover { background:#047857; transform:translateY(-2px); box-shadow:0 6px 18px rgba(5,150,105,.4); }
        .hp-btn2  { padding:12px 22px; background:rgba(255,255,255,.13); color:#fff; border:1.5px solid rgba(255,255,255,.42); border-radius:9px; font-size:15px; font-weight:700; cursor:pointer; font-family:'Cairo',sans-serif; backdrop-filter:blur(4px); transition:all .2s; display:flex; align-items:center; gap:7px; }
        .hp-btn2:hover { background:rgba(255,255,255,.24); }

        .hp-arr { position:absolute; top:50%; transform:translateY(-50%); width:42px; height:42px; background:rgba(255,255,255,.9); border:none; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; box-shadow:0 2px 10px rgba(0,0,0,.2); z-index:10; }
        .hp-arr:hover { background:#fff; box-shadow:0 4px 16px rgba(0,0,0,.25); }
        .hp-al { left:16px; } .hp-ar { right:16px; }
        .hp-dots { position:absolute; bottom:14px; left:50%; transform:translateX(-50%); display:flex; gap:7px; z-index:10; }
        .hp-dot  { width:8px; height:8px; border-radius:99px; background:rgba(255,255,255,.35); border:none; padding:0; cursor:pointer; transition:all .3s; }
        .hp-dot.on { width:24px; background:#10b981; }

        /* ── SECTION ── */
        .hp-sec { max-width:1360px; margin:0 auto; padding:48px 28px; }
        .hp-h2  { font-size:24px; font-weight:800; color:${txt}; margin-bottom:6px; }
        .hp-sub2{ font-size:14px; color:${mu}; margin-bottom:32px; }

        /* ── CAT IMAGE GRID ── */
        .hp-catg { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .hp-catc {
          position:relative; overflow:hidden; border-radius:14px;
          height:200px; text-decoration:none; cursor:pointer;
          transition:transform .28s, box-shadow .28s;
          box-shadow:0 2px 10px rgba(0,0,0,.1);
          border:none; padding:0; background:transparent;
        }
        .hp-catc:hover { transform:translateY(-5px) scale(1.02); box-shadow:0 12px 32px rgba(0,0,0,.18); }
        .hp-catc img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s; }
        .hp-catc:hover img { transform:scale(1.07); }
        .hp-cat-overlay {
          position:absolute; inset:0;
          display:flex; flex-direction:column; align-items:flex-start; justify-content:flex-end;
          padding:16px 18px;
          background:linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,.15) 60%, transparent 100%);
          transition:background .3s;
        }
        .hp-catc:hover .hp-cat-overlay { background:linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.25) 60%, transparent 100%); }
        .hp-cn  { font-size:16px; font-weight:800; color:#fff; line-height:1.2; }
        .hp-cc  { font-size:12px; color:rgba(255,255,255,.78); margin-top:3px; font-weight:500; }

        /* ── FEATURES ── */
        .hp-fg { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .hp-fc { border:1.5px solid ${bdr}; border-radius:12px; padding:24px 20px; background:${bg}; transition:all .25s; }
        .hp-fc:hover { border-color:#059669; box-shadow:0 4px 16px rgba(5,150,105,.1); transform:translateY(-3px); }
        .hp-fi { width:48px; height:48px; background:${D?'rgba(5,150,105,.15)':'#f0fdf4'}; border-radius:11px; display:flex; align-items:center; justify-content:center; color:#059669; margin-bottom:14px; }
        .hp-ft { font-size:15px; font-weight:700; color:${txt}; margin-bottom:6px; }
        .hp-fd { font-size:13px; color:${mu}; line-height:1.6; }

        /* ── STEPS ── */
        .hp-stps { background:${bgS}; padding:48px 0; border-top:1px solid ${bdr}; border-bottom:1px solid ${bdr}; transition:background .3s; }
        .hp-sg   { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; position:relative; }
        .hp-sg::before { content:''; position:absolute; top:28px; left:10%; right:10%; height:2px; background:linear-gradient(to right,#059669,#10b981); }
        .hp-step { background:${bg}; border:1.5px solid ${bdr}; border-radius:12px; padding:24px 18px; text-align:center; position:relative; z-index:1; transition:all .25s; }
        .hp-step:hover { border-color:#059669; box-shadow:0 4px 16px rgba(5,150,105,.1); }
        .hp-snum { width:44px; height:44px; margin:0 auto 14px; border-radius:50%; background:linear-gradient(135deg,#059669,#10b981); color:#fff; font-weight:800; font-size:15px; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 10px rgba(5,150,105,.3); }
        .hp-sico { width:40px; height:40px; margin:0 auto 12px; background:${D?'rgba(5,150,105,.15)':'#f0fdf4'}; border-radius:9px; display:flex; align-items:center; justify-content:center; color:#059669; }
        .hp-stit { font-size:14px; font-weight:700; color:${txt}; margin-bottom:6px; }
        .hp-sdes { font-size:12px; color:${mu}; line-height:1.6; }

        /* ── SUCCESS STORY ── */
        .hp-story { display:grid; grid-template-columns:1fr 1fr; border:1.5px solid ${bdr}; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.07); }
        .hp-s-img { position:relative; min-height:360px; }
        .hp-s-img img { width:100%; height:100%; object-fit:cover; display:block; }
        .hp-s-ov  { position:absolute; inset:0; background:linear-gradient(135deg,rgba(4,120,87,.8),rgba(5,150,105,.7)); display:flex; align-items:center; justify-content:center; }
        .hp-s-cnt { text-align:center; color:#fff; padding:32px; }
        .hp-s-right { padding:40px; background:${bg}; transition:background .3s; display:flex; flex-direction:column; justify-content:center; }
        .hp-s-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; background:#fef9c3; color:#854d0e; border-radius:99px; font-size:12px; font-weight:700; margin-bottom:16px; width:fit-content; }
        .hp-s-title { font-size:22px; font-weight:800; color:${txt}; margin-bottom:12px; }
        .hp-s-box   { background:${D?'rgba(5,150,105,.12)':'#f0fdf4'}; border:1px solid ${D?'#1e3320':'#bbf7d0'}; border-radius:10px; padding:14px 18px; margin-bottom:16px; }
        .hp-s-num   { font-size:30px; font-weight:900; color:#059669; }
        .hp-s-numl  { font-size:13px; color:${mu}; }
        .hp-s-txt   { font-size:14px; color:${D?'#a7f3d0':'#374151'}; line-height:1.7; margin-bottom:20px; }
        .hp-s-btn   { display:inline-flex; align-items:center; gap:8px; padding:11px 20px; background:#059669; color:#fff; border:none; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; font-family:'Cairo',sans-serif; transition:all .2s; width:fit-content; }
        .hp-s-btn:hover { background:#047857; }

        /* ── CTA ── */
        .hp-cta { background:linear-gradient(135deg,#064e3b,#065f46,#047857); padding:64px 24px; text-align:center; }
        .hp-cta-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; background:rgba(255,255,255,.15); color:#a7f3d0; border-radius:99px; font-size:12px; font-weight:700; margin-bottom:18px; border:1px solid rgba(255,255,255,.2); }
        .hp-cta-h { font-size:clamp(24px,4vw,38px); font-weight:900; color:#fff; margin-bottom:12px; }
        .hp-cta-s { font-size:15px; color:#a7f3d0; max-width:480px; margin:0 auto 32px; }
        .hp-cta-row { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .hp-cta-p { padding:13px 28px; background:#fff; color:#059669; border:none; border-radius:9px; font-size:15px; font-weight:800; cursor:pointer; font-family:'Cairo',sans-serif; transition:all .2s; }
        .hp-cta-p:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.2); }
        .hp-cta-g { padding:13px 24px; background:rgba(255,255,255,.12); color:#fff; border:1.5px solid rgba(255,255,255,.3); border-radius:9px; font-size:15px; font-weight:700; cursor:pointer; font-family:'Cairo',sans-serif; display:flex; align-items:center; gap:8px; transition:all .2s; }
        .hp-cta-g:hover { background:rgba(255,255,255,.2); }

        /* ── MODAL ── */
        .hp-modal { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:999; display:flex; align-items:center; justify-content:center; padding:20px; animation:hpFd .2s ease; }
        @keyframes hpFd { from{opacity:0} to{opacity:1} }
        .hp-mbox { background:${bg}; border-radius:14px; overflow:hidden; width:100%; max-width:820px; box-shadow:0 24px 60px rgba(0,0,0,.35); }
        .hp-mhead { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; background:#059669; color:#fff; }
        .hp-mhead strong { font-size:15px; font-weight:700; }
        .hp-mclose { background:rgba(255,255,255,.2); border:none; color:#fff; cursor:pointer; border-radius:7px; padding:5px 9px; font-size:18px; line-height:1; }
        .hp-mclose:hover { background:rgba(255,255,255,.35); }
        .hp-mbody { padding:20px; }
        .hp-mvid  { aspect-ratio:16/9; background:#000; border-radius:9px; overflow:hidden; }
        .hp-mvid video { width:100%; height:100%; }
        .hp-mfoot { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-top:1px solid ${bdr}; background:${bgS}; }
        .hp-mf1 { padding:9px 18px; background:#059669; color:#fff; border:none; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; font-family:'Cairo',sans-serif; }
        .hp-mf2 { padding:9px 18px; background:transparent; color:${mu}; border:1px solid ${bdr}; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; font-family:'Cairo',sans-serif; }

        /* ── RESPONSIVE ── */
        @media(max-width:900px){
          .hp-catg,.hp-fg { grid-template-columns:repeat(2,1fr); }
          .hp-sg { grid-template-columns:repeat(2,1fr); }
          .hp-sg::before { display:none; }
          .hp-story { grid-template-columns:1fr; }
        }
        @media(max-width:600px){
          .hp-catg,.hp-fg,.hp-sg { grid-template-columns:1fr; }
        }
      `}</style>

      {/* ══ CAROUSEL ══ */}
      <div className="hp-car">
        <div className="hp-track" style={{ transform:`translateX(${ar ? slide : -slide}00%)` }}>
          {SLIDES.map(s => (
            <div key={s.id} className="hp-slide">
              <img src={s.src} alt={ar ? s.arTitle : s.enTitle}/>
              <div className="hp-overlay">
                <div className="hp-title">{ar ? s.arTitle : s.enTitle}</div>
                <div className="hp-sub">{ar ? s.arSub : s.enSub}</div>
                <div className="hp-btns">
                  <button className="hp-btn1" onClick={() => navigate(user ? '/dashboard' : '/registration')}>
                    {ar ? (user?'لوحة التحكم':'ابدأ مجاناً') : (user?'Dashboard':'Get Started Free')}
                  </button>
                  <button className="hp-btn2" onClick={() => setShowVideo(true)}>
                    <Play size={14}/> {ar?'شاهد الفيديو':'Watch Video'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="hp-arr hp-al" onClick={() => goSlide(-1)}><ChevronLeft size={18}/></button>
        <button className="hp-arr hp-ar" onClick={() => goSlide(1)}><ChevronRight size={18}/></button>
        <div className="hp-dots">
          {SLIDES.map((_,i) => (
            <button key={i} className={`hp-dot ${i===slide?'on':''}`}
              onClick={() => { clearInterval(timerRef.current); setSlide(i); startTimer(); }}/>
          ))}
        </div>
      </div>

      {/* ══ POPULAR CATEGORIES — كروت مع صور محلية + ربط بالـ Marketplace ══ */}
      <div style={{ borderBottom:`1px solid ${bdr}`, background:bgS, transition:'background .3s' }}>
        <div style={{ width:'100%', padding:'40px 28px 0', textAlign:'center', background:bgS, transition:'background .3s' }}>
          <div style={{ fontSize:28, fontWeight:900, color:txt, marginBottom:6, transition:'color .3s' }}>
            {ar?'الفئات الشائعة':'Popular Categories'}
          </div>
          <div style={{ fontSize:14, color:mu, marginBottom:32, transition:'color .3s' }}>
            {ar?'تصفّح النفايات حسب النوع — اضغط على أي فئة للعرض في السوق':'Browse waste by type — click any category to view in marketplace'}
          </div>
        </div>
        <div className="hp-sec" style={{ paddingTop:0 }}>
          <div className="hp-catg">
            {POPULAR_CATS.map(({ ar:arL, en, categoryParam, count, img }) => (
              // ── زر عادي بدل Link عشان نتحكم في navigate ──
              <button
                key={arL}
                className="hp-catc"
                onClick={() => goToMarket(categoryParam)}
                title={ar ? `عرض ${arL} في السوق` : `View ${en} in marketplace`}
              >
                <img
                  src={img}
                  alt={ar ? arL : en}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80'; }}
                />
                <div className="hp-cat-overlay">
                  <div className="hp-cn">{ar ? arL : en}</div>
                  <div className="hp-cc">{count} {ar?'إعلان':'listings'}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <div style={{ background:bgS, borderBottom:`1px solid ${bdr}`, transition:'background .3s' }}>
        <div className="hp-sec">
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 14px', background:D?'rgba(5,150,105,.15)':'#dcfce7', color:D?'#6ee7b7':'#166534', borderRadius:99, fontSize:12, fontWeight:700, marginBottom:10 }}>
              <Leaf size={12}/> {ar?'مميزات المنصة':'Platform Features'}
            </div>
            <div className="hp-h2">{ar?'لماذا تختار ECOv؟':'Why Choose ECOv?'}</div>
            <div className="hp-sub2" style={{ maxWidth:500, margin:'0 auto' }}>
              {ar?'منصة متكاملة تربط المصانع بشركات إعادة التدوير':'An integrated platform connecting factories with recyclers'}
            </div>
          </div>
          <div className="hp-fg">
            {FEATURES.map(({ Icon, ar:arL, en, dAr, dEn }, i) => (
              <div key={i} className="hp-fc">
                <div className="hp-fi"><Icon size={22}/></div>
                <div className="hp-ft">{ar ? arL : en}</div>
                <div className="hp-fd">{ar ? dAr : dEn}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <div className="hp-stps">
        <div style={{ maxWidth:1360, margin:'0 auto', padding:'0 28px' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 14px', background:D?'rgba(5,150,105,.15)':'#dcfce7', color:D?'#6ee7b7':'#166534', borderRadius:99, fontSize:12, fontWeight:700, marginBottom:10 }}>
              <CheckCircle2 size={12}/> {ar?'كيف تعمل المنصة؟':'How It Works'}
            </div>
            <div className="hp-h2">{ar?'4 خطوات بسيطة':'4 Simple Steps'}</div>
          </div>
          <div className="hp-sg">
            {STEPS.map(({ n, Icon, ar:arL, en, dAr, dEn }, i) => (
              <div key={i} className="hp-step">
                <div className="hp-snum">{n}</div>
                <div className="hp-sico"><Icon size={18}/></div>
                <div className="hp-stit">{ar ? arL : en}</div>
                <div className="hp-sdes">{ar ? dAr : dEn}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SUCCESS STORY ══ */}
      <div style={{ borderBottom:`1px solid ${bdr}` }}>
        <div className="hp-sec">
          <div className="hp-story">
            <div className="hp-s-img">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="cooking oil factory"/>
              <div className="hp-s-ov">
                <div className="hp-s-cnt">
                  <div style={{ width:56, height:56, background:'rgba(255,255,255,.2)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                    <Leaf size={26} color="white"/>
                  </div>
                  <div style={{ fontSize:20, fontWeight:800, marginBottom:4 }}>{ar?'قصة نجاح':'Success Story'}</div>
                  <div style={{ fontSize:12, opacity:.82, marginBottom:18 }}>Turn Waste Into Value</div>
                  <div style={{ background:'rgba(255,255,255,.18)', borderRadius:12, padding:'12px 22px', border:'1px solid rgba(255,255,255,.28)' }}>
                    <div style={{ fontSize:26, fontWeight:900 }}>13,000 جنيه</div>
                    <div style={{ fontSize:12, opacity:.85, marginTop:2 }}>{ar?'وفورات شهرية':'Monthly savings'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hp-s-right">
              <div className="hp-s-badge"><Trophy size={12}/> {ar?'قصة نجاح موثّقة':'Documented Success'}</div>
              <div className="hp-s-title">{ar?'مصنع زيوت الطهي':'Cooking Oil Factory'}</div>
              <div className="hp-s-box">
                <div className="hp-s-num">13,000 {ar?'جنيه':'EGP'}</div>
                <div className="hp-s-numl">{ar?'وفورات شهرية من بيع الزيت المستعمل':'Monthly savings from selling used oil'}</div>
              </div>
              <div className="hp-s-txt">
                {ar
                  ? 'نجح المصنع في تحويل زيت الطهي المستعمل من عبء مالي إلى مصدر دخل ثابت عبر منصة ECOv.'
                  : 'The factory turned used cooking oil from a cost into steady income via ECOv.'}
              </div>
              <button className="hp-s-btn" onClick={() => setShowVideo(true)}>
                <Play size={15}/> {ar?'شاهد القصة بالفيديو':'Watch Story Video'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CTA ══ */}
      <div className="hp-cta">
        <div className="hp-cta-badge"><TrendingUp size={13}/> {ar?'انضم الآن':'Join Now'}</div>
        <div className="hp-cta-h">{user?(ar?'مرحباً بعودتك':'Welcome Back'):(ar?'انضم إلى شبكة الاقتصاد الدائري':'Join the Circular Economy')}</div>
        <div className="hp-cta-s">{ar?'سجّل مصنعك اليوم وابدأ في تحقيق أرباح من نفاياتك الصناعية':'Register your factory today and start profiting from industrial waste'}</div>
        <div className="hp-cta-row">
          <button className="hp-cta-p" onClick={() => navigate(user?'/dashboard':'/registration')}>
            {user?(ar?'لوحة التحكم':'Dashboard'):(ar?'سجّل مصنعك مجاناً':'Register Free')}
          </button>
          <button className="hp-cta-g" onClick={() => setShowVideo(true)}>
            <Play size={15}/> {ar?'شاهد الفيديو':'Watch Video'}
          </button>
        </div>
      </div>

      {/* ══ VIDEO MODAL ══ */}
      {showVideo && (
        <div className="hp-modal" onClick={e => { if(e.target===e.currentTarget) setShowVideo(false); }}>
          <div className="hp-mbox">
            <div className="hp-mhead">
              <strong>{ar?'الفيديو التعريفي — ECOv':'ECOv Platform Video'}</strong>
              <button className="hp-mclose" onClick={() => setShowVideo(false)}>✕</button>
            </div>
            <div className="hp-mbody">
              <div className="hp-mvid">
                <video controls autoPlay>
                  <source src="/assets/intro.mp4" type="video/mp4"/>
                </video>
              </div>
            </div>
            <div className="hp-mfoot">
              <button className="hp-mf1" onClick={() => { setShowVideo(false); navigate('/registration'); }}>
                {ar?'سجّل مصنعك الآن':'Register Now'}
              </button>
              <button className="hp-mf2" onClick={() => setShowVideo(false)}>
                {ar?'إغلاق':'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}