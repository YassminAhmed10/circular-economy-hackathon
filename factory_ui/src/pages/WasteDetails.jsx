import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import {
  MapPin, Eye, Users, Shield, Heart, Share2, AlertCircle,
  Star, ArrowRight, CheckCircle, TrendingUp, Zap, Award,
  RefreshCw, ExternalLink, ShoppingCart, Package, Link as LinkIcon,
  ChevronLeft, ChevronRight, Image
} from 'lucide-react';

import paperWasteImage   from '../assets/مخلفات الورق.png';
import plasticWasteImage from '../assets/مخلفات البلاستيك.png';
import woodWasteImage    from '../assets/مخلفات الخشب.png';
import metalWasteImage   from '../assets/مخلفات المعادن.png';
import glassWasteImage   from '../assets/مخلفات الزجاج.png';
import textileWasteImage from '../assets/مخلفات النسيج.png';
import chemicalsImg      from '../assets/Chemicals.png';
import electronicsImg    from '../assets/Electronics .png';

const getCategoryFallback = (cat) => ({
  plastic: plasticWasteImage, metal: metalWasteImage, paper: paperWasteImage,
  glass: glassWasteImage, wood: woodWasteImage, textile: textileWasteImage,
  chemicals: chemicalsImg, chemical: chemicalsImg,
  electronic: electronicsImg, electronics: electronicsImg,
}[cat] || plasticWasteImage);

// ─── نفس بيانات Marketplace ───────────────────────────────────────────────────
const STATIC_WASTE_ITEMS = [
  { id:1,  titleAr:'براميل بلاستيك مستعملة',    category:'plastic',   companyAr:'مصنع الدلتا للبتروكيماويات',  locAr:'العاشر من رمضان',   price:45,   unit:'برميل', unitAr:'للبرميل', weightAr:'5 طن متاح',  rating:4.7, reviews:38,  descAr:'براميل HDPE سعة 200 لتر نظيفة وصالحة للإعادة',             badge:'new',      image:plasticWasteImage, amount:5,  lat:30.31, lng:31.74, views:124, offers:8,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'بلاستيك HDPE', color:'أبيض',     condition:'نظيفة تماماً',         purity:'+95% نقي', packaging:'براميل / طبليات',    storage:'مخزن مغطى وجاف', address:'العاشر من رمضان' }, seller:{ name:'مصنع الدلتا',                     verified:true,  rating:4.7, totalSales:45,  joined:'2022', whatsapp:'201001234567' } },
  { id:2,  titleAr:'حديد خردة عالي الجودة',     category:'metal',     companyAr:'الشركة المصرية للصلب',        locAr:'السادس من أكتوبر',  price:3200, unit:'طن',    unitAr:'للطن',    weightAr:'20 طن',       rating:4.9, reviews:112, descAr:'خردة حديد A-grade مناسبة للصهر وإعادة التصنيع',            badge:'featured', image:metalWasteImage,   amount:20, lat:29.97, lng:30.94, views:340, offers:22, status:'نشط', frequency:'weekly',  locationLink:'', specifications:{ material:'حديد خردة', color:'رمادي',     condition:'مختلطة',               purity:'85–95%',   packaging:'سائب بدون تغليف',    storage:'في الهواء الطلق', address:'السادس من أكتوبر' }, seller:{ name:'الشركة المصرية للصلب',            verified:true,  rating:4.9, totalSales:200, joined:'2020', whatsapp:'201009876543' } },
  { id:3,  titleAr:'كرتون ورق مضغوط',           category:'paper',     companyAr:'مطابع الجيل الحديث',          locAr:'مدينة العبور',      price:800,  unit:'طن',    unitAr:'للطن',    weightAr:'8 طن',        rating:4.5, reviews:61,  descAr:'كرتون مضغوط على شكل بالات جاهز للشحن والتصدير',            badge:null,       image:paperWasteImage,   amount:8,  lat:30.24, lng:31.55, views:89,  offers:5,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'كرتون مضغوط', color:'بني',      condition:'نظيفة مع شوائب بسيطة', purity:'85–95%',   packaging:'بالات مضغوطة',       storage:'مخزن مغطى وجاف', address:'مدينة العبور' },    seller:{ name:'مطابع الجيل الحديث',              verified:false, rating:4.5, totalSales:30,  joined:'2023', whatsapp:'201005555555' } },
  { id:4,  titleAr:'قطع نسيج ومقصورات قماش',   category:'textile',   companyAr:'شركة نوردانتكس للغزل',        locAr:'المحلة الكبرى',     price:1200, unit:'طن',    unitAr:'للطن',    weightAr:'3 طن',        rating:4.3, reviews:27,  descAr:'مقصورات قطن وبوليستر متنوعة الأحجام والألوان',              badge:'offer',    image:textileWasteImage, amount:3,  lat:30.97, lng:31.17, views:55,  offers:3,  status:'نشط', frequency:'weekly',  locationLink:'', specifications:{ material:'قطن / بوليستر', color:'متنوع / مختلط', condition:'نظيفة تماماً',      purity:'غير محددة', packaging:'أكياس كبيرة (جامبو)', storage:'مخزن مغطى وجاف', address:'المحلة الكبرى' },   seller:{ name:'نوردانتكس للغزل',                 verified:true,  rating:4.3, totalSales:18,  joined:'2023', whatsapp:'201007777777' } },
  { id:5,  titleAr:'ألواح خشب وفلين',          category:'wood',      companyAr:'مصنع الخشب المتحد',           locAr:'برج العرب الجديدة', price:600,  unit:'طن',    unitAr:'للطن',    weightAr:'10 طن',       rating:4.2, reviews:19,  descAr:'فلين طبيعي وحبيبات خشب ناعمة للعزل الصوتي والحراري',       badge:null,       image:woodWasteImage,    amount:10, lat:30.81, lng:29.68, views:44,  offers:2,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'خشب / فلين',  color:'بني',      condition:'نظيفة مع شوائب بسيطة', purity:'70–85%',   packaging:'بالات مضغوطة',       storage:'مخزن مغطى وجاف', address:'برج العرب الجديدة' }, seller:{ name:'مصنع الخشب المتحد',               verified:false, rating:4.2, totalSales:12,  joined:'2023', whatsapp:'201008888888' } },
  { id:6,  titleAr:'زجاج مكسور وملون',         category:'glass',     companyAr:'زجاج مصر للصناعة',            locAr:'العامرية',          price:500,  unit:'طن',    unitAr:'للطن',    weightAr:'15 طن',       rating:4.0, reviews:33,  descAr:'شظايا زجاج شفاف وملون صالحة لإعادة الصهر والتصنيع',        badge:'new',      image:glassWasteImage,   amount:15, lat:31.19, lng:29.91, views:78,  offers:4,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'زجاج',        color:'شفاف',     condition:'مختلطة',               purity:'70–85%',   packaging:'سائب بدون تغليف',    storage:'في الهواء الطلق', address:'العامرية' },        seller:{ name:'زجاج مصر للصناعة',               verified:true,  rating:4.0, totalSales:25,  joined:'2022', whatsapp:'201006666666' } },
  { id:7,  titleAr:'مواد كيميائية غير خطرة',   category:'chemicals', companyAr:'الكيماويات الصناعية المصرية', locAr:'شبرا الخيمة',       price:2100, unit:'طن',    unitAr:'للطن',    weightAr:'2 طن',        rating:4.6, reviews:44,  descAr:'مواد كيميائية مصنفة غير خطرة جاهزة للاستخدام الصناعي',     badge:'featured', image:chemicalsImg,      amount:2,  lat:30.13, lng:31.24, views:156, offers:11, status:'نشط', frequency:'quarterly', locationLink:'', specifications:{ material:'كيماويات',    color:'متنوع / مختلط', condition:'نظيفة تماماً',      purity:'+95% نقي',  packaging:'براميل / طبليات',    storage:'مبرد / مجمد',     address:'شبرا الخيمة' },       seller:{ name:'الكيماويات الصناعية المصرية',     verified:true,  rating:4.6, totalSales:60,  joined:'2021', whatsapp:'201004444444' } },
  { id:8,  titleAr:'ألومنيوم وأسلاك معدنية',   category:'metal',     companyAr:'مصنع الألومنيوم القاهرة',     locAr:'العاشر من رمضان',   price:6500, unit:'طن',    unitAr:'للطن',    weightAr:'4 طن',        rating:4.8, reviews:77,  descAr:'ألومنيوم نقي وأسلاك نحاسية جاهزة للتصنيع الصناعي',        badge:'featured', image:metalWasteImage,   amount:4,  lat:30.32, lng:31.76, views:234, offers:18, status:'نشط', frequency:'weekly',  locationLink:'', specifications:{ material:'ألومنيوم / نحاس', color:'رمادي', condition:'نظيفة تماماً',        purity:'+95% نقي',  packaging:'لفات / بكرات',       storage:'مخزن مغطى وجاف', address:'العاشر من رمضان' },    seller:{ name:'مصنع الألومنيوم القاهرة',         verified:true,  rating:4.8, totalSales:120, joined:'2021', whatsapp:'201003333333' } },
  { id:9,  titleAr:'بقايا بلاستيك ABS وPVC',  category:'plastic',   companyAr:'مصنع بلاستيكو مصر',           locAr:'مدينة نصر',         price:1800, unit:'طن',    unitAr:'للطن',    weightAr:'6 طن',        rating:4.4, reviews:52,  descAr:'بلاستيك ABS وPVC نظيف مناسب للطحن وإعادة التصنيع',         badge:null,       image:plasticWasteImage, amount:6,  lat:30.07, lng:31.33, views:167, offers:9,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'ABS / PVC',    color:'متنوع / مختلط', condition:'نظيفة مع شوائب بسيطة', purity:'85–95%',   packaging:'أكياس كبيرة (جامبو)', storage:'مخزن مغطى وجاف', address:'مدينة نصر' },       seller:{ name:'مصنع بلاستيكو مصر',              verified:false, rating:4.4, totalSales:40,  joined:'2022', whatsapp:'201002222222' } },
  { id:10, titleAr:'أجهزة إلكترونية للتدوير',  category:'electronic',companyAr:'مصنع الأجهزة الحديثة',        locAr:'القاهرة',           price:2500, unit:'طن',    unitAr:'للطن',    weightAr:'3 طن',        rating:4.5, reviews:30,  descAr:'أجهزة إلكترونية قديمة صالحة لإعادة التدوير واستخلاص المعادن النفيسة', badge:'new', image:electronicsImg,   amount:3,  lat:30.06, lng:31.24, views:98,  offers:6,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'إلكترونيات',  color:'متنوع / مختلط', condition:'مختلطة',            purity:'غير محددة', packaging:'كراتين',              storage:'مخزن مغطى وجاف', address:'القاهرة' },           seller:{ name:'مصنع الأجهزة الحديثة',           verified:true,  rating:4.5, totalSales:22,  joined:'2023', whatsapp:'201001111111' } },
];

// ─── مواصفات المعرض (نفس تسميات ListWaste) ───────────────────────────────────
const SPEC_LABELS = [
  { key: 'material',  icon: '🧱', label: 'نوع المادة'        },
  { key: 'color',     icon: '🎨', label: 'لون المادة'        },
  { key: 'condition', icon: '✅', label: 'حالة المادة'       },
  { key: 'purity',    icon: '💎', label: 'درجة النقاوة'      },
  { key: 'packaging', icon: '📦', label: 'طريقة التغليف'     },
  { key: 'storage',   icon: '🏭', label: 'طريقة التخزين'     },
  { key: 'address',   icon: '📍', label: 'العنوان'           },
];

const openWhatsApp = (phone, title) => {
  const clean = String(phone).replace(/\D/g, '');
  const msg = encodeURIComponent(`مرحباً، أنا مهتم بعرضكم على منصة ECOv\nالإعلان: ${title}`);
  window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
};

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FactoryMap = ({ lat, lng }) => {
  const { isLoaded } = useJsApiLoader({ id:'google-map-script', googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '' });
  const onLoad = useCallback(() => {}, []);
  const PIN = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="#059669" stroke="white" stroke-width="3.5"/><text x="24" y="32" text-anchor="middle" font-size="22">🏭</text></svg>');
  if (!isLoaded) return <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px', color:'#059669', fontSize:'0.88rem' }}><MapPin size={28} color="#059669" />جاري تحميل الخريطة...</div>;
  return (
    <GoogleMap mapContainerStyle={{ width:'100%', height:'100%' }} center={{ lat, lng }} zoom={14} onLoad={onLoad} options={{ zoomControl:true, streetViewControl:false, mapTypeControl:false, fullscreenControl:true }}>
      <Marker position={{ lat, lng }} icon={{ url:PIN, scaledSize:{ width:48, height:48 } }} />
    </GoogleMap>
  );
};

// ─── معرض الصور ───────────────────────────────────────────────────────────────
const ImageGallery = ({ images, fallback }) => {
  const [current, setCurrent] = useState(0);
  const all = images && images.length > 0 ? images : [fallback];
  return (
    <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#d1fae5,#a7f3d0)', minHeight:'320px' }}>
      <img src={all[current]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', minHeight:'320px' }} onError={e => { e.target.src = fallback; }} />
      {all.length > 1 && (
        <>
          <button onClick={() => setCurrent(p => (p - 1 + all.length) % all.length)}
            style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.45)', border:'none', borderRadius:'50%', width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
            <ChevronLeft size={17} />
          </button>
          <button onClick={() => setCurrent(p => (p + 1) % all.length)}
            style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.45)', border:'none', borderRadius:'50%', width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
            <ChevronRight size={17} />
          </button>
          <div style={{ position:'absolute', bottom:'10px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'5px' }}>
            {all.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{ width:'7px', height:'7px', borderRadius:'50%', border:'none', background: i === current ? '#fff' : 'rgba(255,255,255,0.45)', cursor:'pointer', padding:0 }} />
            ))}
          </div>
          <div style={{ position:'absolute', top:'10px', left:'10px', background:'rgba(0,0,0,0.55)', color:'#fff', padding:'3px 9px', borderRadius:'999px', fontSize:'0.73rem', display:'flex', alignItems:'center', gap:'4px' }}>
            <Image size={11} /> {current + 1} / {all.length}
          </div>
        </>
      )}
    </div>
  );
};

const chip = (color='#059669', bg='#ecfdf5') => ({ display:'inline-flex', alignItems:'center', gap:'5px', padding:'5px 13px', borderRadius:'999px', fontSize:'0.77rem', fontWeight:700, color, background:bg, border:`1.5px solid ${color}33` });
const secTitle = { fontSize:'1rem', fontWeight:800, color:'#064e3b', marginBottom:'18px', display:'flex', alignItems:'center', gap:'8px', paddingBottom:'12px', borderBottom:'2px solid #f0fdf4' };

export default function WasteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customListings, setCustomListings] = useState([]);

  useEffect(() => {
    try { setCustomListings(JSON.parse(localStorage.getItem('ecov_listings') || '[]')); }
    catch (e) { console.error(e); }
  }, []);

  const allItems = [...customListings, ...STATIC_WASTE_ITEMS];
  const waste = allItems.find(w => String(w.id) === String(id)) || STATIC_WASTE_ITEMS[0];
  const [isLiked, setIsLiked] = useState(false);
  const [hovered, setHovered] = useState(null);

  if (!waste) return <div>لم يتم العثور على الإعلان</div>;

  const wasteImages = waste.images?.length > 0 ? waste.images : waste.image ? [waste.image] : [];
  const fallbackImg = getCategoryFallback(waste.category);
  const total = Number(waste.price) * Number(waste.amount);
  const similar = allItems.filter(w => w.category === waste.category && w.id !== waste.id).slice(0, 3);

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#f0fdf4 0%,#ecfdf5 50%,#f0f9ff 100%)', fontFamily:"'Cairo','Segoe UI',sans-serif", direction:'rtl' }}>

      {/* شريط علوي */}
      <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(16,185,129,0.15)', padding:'0 2.5rem', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 2px 24px rgba(16,185,129,0.07)' }}>
        <button onClick={() => navigate(-1)} onMouseEnter={e => e.currentTarget.style.background='#ecfdf5'} onMouseLeave={e => e.currentTarget.style.background='none'}
          style={{ display:'flex', alignItems:'center', gap:'8px', color:'#059669', fontWeight:700, fontSize:'0.92rem', background:'none', border:'none', cursor:'pointer', padding:'8px 18px', borderRadius:'999px', fontFamily:'inherit' }}>
          <ArrowRight size={16} /> العودة للسوق
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.82rem', color:'#6b7280' }}>
          <span style={{ color:'#059669', fontWeight:700, cursor:'pointer' }} onClick={() => navigate('/market')}>السوق</span>
          <span>/</span><span>{waste.category}</span><span>/</span>
          <span style={{ color:'#374151', fontWeight:600, maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{waste.titleAr}</span>
        </div>
      </div>

      {/* الشبكة */}
      <div style={{ maxWidth:'1440px', margin:'0 auto', padding:'2rem 2.5rem', display:'grid', gridTemplateColumns:'1fr 400px', gap:'2rem', alignItems:'start', boxSizing:'border-box' }}>

        {/* اليمين */}
        <div>
          <div style={{ background:'#fff', borderRadius:'24px', overflow:'hidden', boxShadow:'0 4px 48px rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.1)' }}>

            {/* هيرو */}
            <div style={{ display:'grid', gridTemplateColumns:'420px 1fr', minHeight:'320px' }}>
              <ImageGallery images={wasteImages} fallback={fallbackImg} />
              <div style={{ padding:'2.5rem', display:'flex', flexDirection:'column', justifyContent:'center', background:'linear-gradient(135deg,#f8fffe,#f0fdf4)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
                  <span style={chip('#059669','#ecfdf5')}>{waste.category}</span>
                  {waste.frequency && <span style={chip('#0ea5e9','#f0f9ff')}><RefreshCw size={10}/> {waste.frequency}</span>}
                  <span style={chip('#059669','#dcfce7')}><CheckCircle size={10}/> {waste.status || 'نشط'}</span>
                </div>
                <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#064e3b', lineHeight:1.35, margin:'0 0 18px', letterSpacing:'-0.02em' }}>{waste.titleAr}</h1>
                <div style={{ display:'flex', alignItems:'center', gap:'18px', flexWrap:'wrap', marginBottom: wasteImages.length > 1 ? '14px' : 0 }}>
                  {[{ icon:<Eye size={13} color="#9ca3af"/>, text:`${waste.views||0} مشاهدة` }, { icon:<Users size={13} color="#9ca3af"/>, text:`${waste.offers||0} عروض` }, { icon:<MapPin size={13} color="#9ca3af"/>, text:waste.locAr }].map((m,i) => (
                    <span key={i} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'0.81rem', color:'#6b7280' }}>{m.icon}{m.text}</span>
                  ))}
                </div>
                {/* thumbnails */}
                {wasteImages.length > 1 && (
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    {wasteImages.slice(0,4).map((img,i) => (
                      <img key={i} src={img} alt="" style={{ width:'46px', height:'46px', objectFit:'cover', borderRadius:'8px', border:'2px solid rgba(16,185,129,0.3)' }} onError={e => { e.target.src = fallbackImg; }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* إحصاء */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:'1.5px solid #f0fdf4', borderBottom:'1.5px solid #f0fdf4' }}>
              {[
                { label:'الكمية المتاحة', value:waste.amount,                      sub:waste.unit,           color:'#064e3b' },
                { label:'السعر للوحدة',   value:Number(waste.price).toLocaleString(), sub:`جنيه / ${waste.unit}`, color:'#059669' },
                { label:'الإجمالي',       value:total.toLocaleString(),             sub:'جنيه',               color:'#064e3b' },
                { label:'المشاهدات',      value:waste.views||0,                     sub:'مشاهدة',             color:'#064e3b' },
              ].map((s,i) => (
                <div key={i} style={{ padding:'22px', display:'flex', flexDirection:'column', alignItems:'center', gap:'5px', borderLeft:i<3 ? '1.5px solid #f0fdf4' : 'none' }}>
                  <span style={{ fontSize:'0.7rem', color:'#9ca3af', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</span>
                  <span style={{ fontSize:'1.45rem', fontWeight:800, color:s.color }}>{s.value}</span>
                  <span style={{ fontSize:'0.72rem', color:'#6b7280' }}>{s.sub}</span>
                </div>
              ))}
            </div>

            <div style={{ padding:'2.5rem' }}>

              {/* الوصف */}
              <div style={{ marginBottom:'2.5rem' }}>
                <h3 style={secTitle}><Zap size={15} color="#059669"/>الوصف التفصيلي</h3>
                <p style={{ color:'#374151', lineHeight:1.85, fontSize:'0.95rem', margin:0 }}>{waste.descAr}</p>
              </div>

              {/* ✅ المواصفات — نفس البيانات المدخلة في ListWaste */}
              <div style={{ marginBottom:'2.5rem' }}>
                <h3 style={secTitle}><Award size={15} color="#059669"/>المواصفات التقنية</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
                  {SPEC_LABELS.map((spec, i) => {
                    const val = waste.specifications?.[spec.key];
                    if (!val) return null;
                    return (
                      <div key={i}
                        onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                        style={{ background:'linear-gradient(135deg,#f8fffe,#f0fdf4)', border:`1.5px solid ${hovered===i ? 'rgba(16,185,129,0.45)' : 'rgba(16,185,129,0.15)'}`, borderRadius:'14px', padding:'16px', transform:hovered===i ? 'translateY(-3px)' : 'none', transition:'all 0.2s', cursor:'default' }}>
                        <div style={{ fontSize:'0.68rem', color:'#9ca3af', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'6px', display:'flex', alignItems:'center', gap:'4px' }}>
                          <span>{spec.icon}</span> {spec.label}
                        </div>
                        <div style={{ fontSize:'0.93rem', fontWeight:700, color:'#064e3b' }}>{val}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* الخريطة */}
              <div style={{ marginBottom:'2.5rem', background:'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius:'20px', overflow:'hidden', border:'1.5px solid rgba(16,185,129,0.15)' }}>
                <div style={{ padding:'16px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(16,185,129,0.12)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.95rem', fontWeight:800, color:'#064e3b' }}><MapPin size={16} color="#059669"/> موقع المصنع على الخريطة</div>
                  {waste.lat && waste.lng && (
                    <a href={`https://www.google.com/maps?q=${waste.lat},${waste.lng}`} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'5px', color:'#059669', fontSize:'0.8rem', fontWeight:700, textDecoration:'none' }}>
                      فتح في خرائط Google <ExternalLink size={12}/>
                    </a>
                  )}
                </div>
                <div style={{ height:'300px' }}>
                  {waste.lat && waste.lng
                    ? <FactoryMap lat={waste.lat} lng={waste.lng}/>
                    : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'8px', color:'#9ca3af' }}><MapPin size={32}/><span>الموقع غير محدد</span></div>
                  }
                </div>
                <div style={{ padding:'12px 22px', display:'flex', flexDirection:'column', gap:'8px', borderTop:'1px solid rgba(16,185,129,0.1)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'0.82rem', color:'#6b7280' }}>
                    <MapPin size={13} color="#9ca3af"/> {waste.specifications?.address || waste.locAr}
                  </div>
                  {waste.locationLink && (
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'0.82rem' }}>
                      <LinkIcon size={13} color="#059669"/>
                      <a href={waste.locationLink} target="_blank" rel="noopener noreferrer" style={{ color:'#059669', textDecoration:'underline' }}>{waste.locationLink}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* البائع */}
              <div style={{ background:'linear-gradient(135deg,#f8fffe,#ecfdf5)', border:'2px solid rgba(16,185,129,0.2)', borderRadius:'20px', padding:'24px' }}>
                <h3 style={{ ...secTitle, border:'none', paddingBottom:0, marginBottom:'18px' }}><Shield size={15} color="#059669"/> عن البائع</h3>
                <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
                  <div style={{ width:'64px', height:'64px', background:'linear-gradient(135deg,#059669,#10b981)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 16px rgba(16,185,129,0.3)' }}><Package size={28} color="#fff"/></div>
                  <div>
                    <div style={{ fontSize:'1.05rem', fontWeight:800, color:'#064e3b', marginBottom:'7px', display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                      {waste.seller?.name || waste.companyAr || 'غير معروف'}
                      {waste.seller?.verified && <span style={chip('#059669','#ecfdf5')}><CheckCircle size={10}/> موثق</span>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px', fontSize:'0.8rem', color:'#6b7280', flexWrap:'wrap' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:'#fef9c3', color:'#854d0e', padding:'3px 10px', borderRadius:'999px', fontWeight:700, fontSize:'0.8rem' }}><Star size={11} fill="#f59e0b" color="#f59e0b"/> {waste.seller?.rating||waste.rating}</span>
                      <span>{waste.seller?.totalSales||0} عملية بيع</span>
                      <span>منضم منذ {waste.seller?.joined||'2024'}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => openWhatsApp(waste.seller?.whatsapp||'201000000000', waste.titleAr)}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(37,211,102,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 16px rgba(37,211,102,0.35)'; }}
                  style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'11px 22px', background:'linear-gradient(135deg,#25d366,#128c7e)', color:'#fff', border:'none', borderRadius:'12px', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(37,211,102,0.35)', transition:'transform 0.15s, box-shadow 0.15s' }}>
                  <WhatsAppIcon size={17}/> تواصل عبر واتساب
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* السايدبار */}
        <div style={{ display:'flex', flexDirection:'column', gap:'18px', position:'sticky', top:'80px' }}>
          {/* بطاقة الشراء */}
          <div style={{ background:'#fff', borderRadius:'24px', overflow:'hidden', boxShadow:'0 4px 40px rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.1)' }}>
            <div style={{ background:'linear-gradient(135deg,#047857,#059669,#10b981)', padding:'24px', color:'#fff' }}>
              <div style={{ fontSize:'0.74rem', opacity:0.8, marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.08em' }}>السعر للوحدة</div>
              <div style={{ fontSize:'2.4rem', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1 }}>{Number(waste.price).toLocaleString()}</div>
              <div style={{ fontSize:'0.88rem', opacity:0.85, marginTop:'6px' }}>جنيه لل{waste.unit} الواحد</div>
              <div style={{ marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.25)', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.82rem', opacity:0.9 }}>
                <span>الإجمالي ({waste.amount} {waste.unit})</span>
                <span style={{ fontSize:'1.2rem', fontWeight:800 }}>{total.toLocaleString()} جنيه</span>
              </div>
            </div>
            <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
              <button onClick={() => navigate(`/place-order/${waste.id}`)}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(16,185,129,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 20px rgba(16,185,129,0.35)'; }}
                style={{ width:'100%', padding:'15px', background:'linear-gradient(135deg,#059669,#10b981)', color:'#fff', border:'none', borderRadius:'14px', fontWeight:800, fontSize:'1.05rem', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 6px 20px rgba(16,185,129,0.35)', transition:'transform 0.15s, box-shadow 0.15s' }}>
                <ShoppingCart size={20}/> شراء الآن
              </button>
              <button onClick={() => openWhatsApp(waste.seller?.whatsapp||'201000000000', waste.titleAr)}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 22px rgba(37,211,102,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 16px rgba(37,211,102,0.3)'; }}
                style={{ width:'100%', padding:'13px', background:'linear-gradient(135deg,#25d366,#128c7e)', color:'#fff', border:'none', borderRadius:'14px', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', boxShadow:'0 4px 16px rgba(37,211,102,0.3)', transition:'transform 0.15s, box-shadow 0.15s' }}>
                <WhatsAppIcon size={17}/> واتساب البائع
              </button>
            </div>
            <div style={{ padding:'0 20px 20px', display:'flex', gap:'10px' }}>
              {[
                { label:isLiked?'محفوظ':'حفظ', icon:<Heart size={15} fill={isLiked?'#ef4444':'none'} color={isLiked?'#ef4444':'#6b7280'}/>, active:isLiked, fn:()=>setIsLiked(!isLiked) },
                { label:'مشاركة', icon:<Share2 size={15}/>, active:false, fn:()=>{} },
              ].map((b,i) => (
                <button key={i} onClick={b.fn} style={{ flex:1, padding:'11px', background:b.active?'#fee2e2':'#f9fafb', color:b.active?'#ef4444':'#6b7280', border:`1.5px solid ${b.active?'#fca5a5':'#e5e7eb'}`, borderRadius:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', fontWeight:600, fontSize:'0.82rem', fontFamily:'inherit', transition:'all 0.2s' }}>
                  {b.icon}{b.label}
                </button>
              ))}
            </div>
          </div>

          {/* نصائح الأمان */}
          <div style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius:'20px', padding:'20px', border:'1.5px solid rgba(59,130,246,0.2)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.9rem', fontWeight:800, color:'#1e40af', marginBottom:'14px' }}><AlertCircle size={15} color="#1e40af"/> نصائح الأمان</div>
            {['لا تدفع مبالغ خارج المنصة','تحقق من هوية البائع قبل التعامل','استخدم وسائل الدفع الآمنة','تأكد من فحص البضاعة قبل الشراء'].map((tip,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'8px', fontSize:'0.81rem', color:'#1d4ed8', marginBottom:'8px', lineHeight:1.5 }}>
                <CheckCircle size={12} color="#3b82f6" style={{ flexShrink:0, marginTop:'2px' }}/>{tip}
              </div>
            ))}
          </div>

          {/* عروض مشابهة */}
          {similar.length > 0 && (
            <div style={{ background:'#fff', borderRadius:'20px', padding:'20px', boxShadow:'0 2px 20px rgba(0,0,0,0.05)', border:'1px solid rgba(16,185,129,0.1)' }}>
              <div style={{ fontSize:'0.93rem', fontWeight:800, color:'#064e3b', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}><TrendingUp size={15} color="#059669"/> عروض مشابهة</div>
              {similar.map((item,i) => {
                const thumb = (item.images?.[0]) || item.image || getCategoryFallback(item.category);
                return (
                  <div key={item.id} onClick={() => navigate(`/waste-details/${item.id}`)}
                    onMouseEnter={() => setHovered(`s${i}`)} onMouseLeave={() => setHovered(null)}
                    style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'12px', cursor:'pointer', background:hovered===`s${i}`?'#f8fffe':'transparent', transition:'background 0.15s', marginBottom:'4px' }}>
                    <img src={thumb} alt={item.titleAr} style={{ width:'44px', height:'44px', borderRadius:'10px', objectFit:'cover', border:'1px solid rgba(16,185,129,0.15)', flexShrink:0 }} onError={e => { e.target.src = getCategoryFallback(item.category); }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.83rem', fontWeight:700, color:'#374151', marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.titleAr}</div>
                      <div style={{ fontSize:'0.73rem', color:'#9ca3af' }}>{item.weightAr} • {item.locAr}</div>
                    </div>
                    <div style={{ textAlign:'left', flexShrink:0 }}>
                      <div style={{ fontSize:'0.93rem', fontWeight:800, color:'#059669' }}>{Number(item.price).toLocaleString()} ج</div>
                      <div style={{ fontSize:'0.69rem', color:'#9ca3af' }}>{item.unitAr||item.unit}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}