import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TEST_FACTORY_PROFILES } from '../utils/testFactoryData';
import { marketplaceAPI, profileAPI } from '../services/api';

// ✅ Fix Leaflet marker default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ✅ Global styles for Leaflet map container
const mapStyles = `
  .leaflet-container {
    background: #f0f0f0;
    font-family: inherit;
  }
  .leaflet-popup-content {
    font-family: inherit !important;
  }
  .leaflet-control-container {
    font-family: inherit;
  }
`;
import {
  MapPin, Eye, Users, Shield, Heart, Share2, AlertCircle,
  Star, ArrowRight, CheckCircle, TrendingUp, Zap, Award,
  RefreshCw, ExternalLink, ShoppingCart, Package, Link as LinkIcon,
  ChevronLeft, ChevronRight, Image, Leaf, Phone, Mail, User,
  Building, Calendar, Tag, Zap as Spark
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

// ✅ FIX: Safe category label getter
const getCategoryLabel = (categoryKey, language = 'en') => {
  const categoryMap = {
    en: {
      plastic: 'Plastic',
      metal: 'Metal',
      paper: 'Paper',
      glass: 'Glass',
      wood: 'Wood',
      textile: 'Textile',
      chemicals: 'Chemicals',
      chemical: 'Chemicals',
      electronic: 'Electronics',
      electronics: 'Electronics'
    },
    ar: {
      plastic: 'بلاستيك',
      metal: 'معادن',
      paper: 'ورق',
      glass: 'زجاج',
      wood: 'خشب',
      textile: 'نسيج',
      chemicals: 'كيماويات',
      chemical: 'كيماويات',
      electronic: 'إلكترونيات',
      electronics: 'إلكترونيات'
    }
  };
  const lang = language === 'ar' ? 'ar' : 'en';
  return categoryMap[lang][categoryKey] || categoryKey;
};

// ─── Same data as Marketplace ──────────────────────────────────────────────────
const STATIC_WASTE_ITEMS = [
  { id:1,  factoryId:1,  listingId:'123456', titleAr:'براميل بلاستيك مستعملة',    category:'plastic',   companyAr:'مصنع الدلتا للبتروكيماويات',  locAr:'العاشر من رمضان',   price:45,   unit:'برميل', unitAr:'للبرميل', weightAr:'5 طن متاح',  rating:4.7, reviews:38,  descAr:'براميل HDPE سعة 200 لتر نظيفة وصالحة للإعادة',             badge:'new',      image:plasticWasteImage, amount:5,  lat:30.31, lng:31.74, views:124, offers:8,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'بلاستيك HDPE', color:'أبيض',     condition:'نظيفة تماماً',         purity:'+95% نقي', packaging:'براميل / طبليات',    storage:'مخزن مغطى وجاف', address:'العاشر من رمضان' }, seller:{ name:'مصنع الدلتا',                     verified:true,  rating:4.7, totalSales:45,  joined:'2022', whatsapp:'201001234567', employees:'150+', specialties:['بلاستيك HDPE','إعادة تدوير'], certifications:['ISO 9001','ISO 14001'], registrationNumber:'23445', taxNumber:'777755' } },
  { id:2,  factoryId:2,  listingId:'654321', titleAr:'حديد خردة عالي الجودة',     category:'metal',     companyAr:'الشركة المصرية للصلب',        locAr:'السادس من أكتوبر',  price:3200, unit:'طن',    unitAr:'للطن',    weightAr:'20 طن',       rating:4.9, reviews:112, descAr:'خردة حديد A-grade مناسبة للصهر وإعادة التصنيع',            badge:'featured', image:metalWasteImage,   amount:20, lat:29.97, lng:30.94, views:340, offers:22, status:'نشط', frequency:'weekly',  locationLink:'', specifications:{ material:'حديد خردة', color:'رمادي',     condition:'مختلطة',               purity:'85–95%',   packaging:'سائب بدون تغليف',    storage:'في الهواء الطلق', address:'السادس من أكتوبر' }, seller:{ name:'الشركة المصرية للصلب',            verified:true,  rating:4.9, totalSales:200, joined:'2020', whatsapp:'201009876543', employees:'300+', specialties:['حديد','صلب','معادن ثقيلة'], certifications:['ISO 9001','ISO 50001'], registrationNumber:'12345', taxNumber:'654321' } },
  { id:3,  factoryId:3,  listingId:'789012', titleAr:'كرتون ورق مضغوط',           category:'paper',     companyAr:'مطابع الجيل الحديث',          locAr:'مدينة العبور',      price:800,  unit:'طن',    unitAr:'للطن',    weightAr:'8 طن',        rating:4.5, reviews:61,  descAr:'كرتون مضغوط على شكل بالات جاهز للشحن والتصدير',            badge:null,       image:paperWasteImage,   amount:8,  lat:30.24, lng:31.55, views:89,  offers:5,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'كرتون مضغوط', color:'بني',      condition:'نظيفة مع شوائب بسيطة', purity:'85–95%',   packaging:'بالات مضغوطة',       storage:'مخزن مغطى وجاف', address:'مدينة العبور' },    seller:{ name:'مطابع الجيل الحديث',              verified:false, rating:4.5, totalSales:30,  joined:'2023', whatsapp:'201005555555', employees:'80+', specialties:['ورق','كرتون','طباعة'], certifications:['ISO 9001'], registrationNumber:'34567', taxNumber:'456789' } },
  { id:4,  factoryId:4,  listingId:'345678', titleAr:'قطع نسيج ومقصورات قماش',   category:'textile',   companyAr:'شركة نوردانتكس للغزل',        locAr:'المحلة الكبرى',     price:1200, unit:'طن',    unitAr:'للطن',    weightAr:'3 طن',        rating:4.3, reviews:27,  descAr:'مقصورات قطن وبوليستر متنوعة الأحجام والألوان',              badge:'offer',    image:textileWasteImage, amount:3,  lat:30.97, lng:31.17, views:55,  offers:3,  status:'نشط', frequency:'weekly',  locationLink:'', specifications:{ material:'قطن / بوليستر', color:'متنوع / مختلط', condition:'نظيفة تماماً',      purity:'غير محددة', packaging:'أكياس كبيرة (جامبو)', storage:'مخزن مغطى وجاف', address:'المحلة الكبرى' },   seller:{ name:'نوردانتكس للغزل',                 verified:true,  rating:4.3, totalSales:18,  joined:'2023', whatsapp:'201007777777', employees:'120+', specialties:['نسيج','قطن','غزل'], certifications:['ISO 9001','GOTS'], registrationNumber:'45678', taxNumber:'567890' } },
  { id:5,  factoryId:5,  listingId:'901234', titleAr:'ألواح خشب وفلين',          category:'wood',      companyAr:'مصنع الخشب المتحد',           locAr:'برج العرب الجديدة', price:600,  unit:'طن',    unitAr:'للطن',    weightAr:'10 طن',       rating:4.2, reviews:19,  descAr:'فلين طبيعي وحبيبات خشب ناعمة للعزل الصوتي والحراري',       badge:null,       image:woodWasteImage,    amount:10, lat:30.81, lng:29.68, views:44,  offers:2,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'خشب / فلين',  color:'بني',      condition:'نظيفة مع شوائب بسيطة', purity:'70–85%',   packaging:'بالات مضغوطة',       storage:'مخزن مغطى وجاف', address:'برج العرب الجديدة' }, seller:{ name:'مصنع الخشب المتحد',               verified:false, rating:4.2, totalSales:12,  joined:'2023', whatsapp:'201008888888', employees:'60+', specialties:['خشب','فلين','عزل'], certifications:['ISO 9001'], registrationNumber:'56789', taxNumber:'678901' } },
  { id:6,  factoryId:6,  listingId:'567890', titleAr:'زجاج مكسور وملون',         category:'glass',     companyAr:'زجاج مصر للصناعة',            locAr:'العامرية',          price:500,  unit:'طن',    unitAr:'للطن',    weightAr:'15 طن',       rating:4.0, reviews:33,  descAr:'شظايا زجاج شفاف وملون صالحة لإعادة الصهر والتصنيع',        badge:'new',      image:glassWasteImage,   amount:15, lat:31.19, lng:29.91, views:78,  offers:4,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'زجاج',        color:'شفاف',     condition:'مختلطة',               purity:'70–85%',   packaging:'سائب بدون تغليف',    storage:'في الهواء الطلق', address:'العامرية' },        seller:{ name:'زجاج مصر للصناعة',               verified:true,  rating:4.0, totalSales:25,  joined:'2022', whatsapp:'201006666666', employees:'90+', specialties:['زجاج','صهر','إعادة تصنيع'], certifications:['ISO 9001','ISO 14001'], registrationNumber:'67890', taxNumber:'789012' } },
  { id:7,  factoryId:7,  listingId:'234567', titleAr:'مواد كيميائية غير خطرة',   category:'chemicals', companyAr:'الكيماويات الصناعية المصرية', locAr:'شبرا الخيمة',       price:2100, unit:'طن',    unitAr:'للطن',    weightAr:'2 طن',        rating:4.6, reviews:44,  descAr:'مواد كيميائية مصنفة غير خطرة جاهزة للاستخدام الصناعي',     badge:'featured', image:chemicalsImg,      amount:2,  lat:30.13, lng:31.24, views:156, offers:11, status:'نشط', frequency:'quarterly', locationLink:'', specifications:{ material:'كيماويات',    color:'متنوع / مختلط', condition:'نظيفة تماماً',      purity:'+95% نقي',  packaging:'براميل / طبليات',    storage:'مبرد / مجمد',     address:'شبرا الخيمة' },       seller:{ name:'الكيماويات الصناعية المصرية',     verified:true,  rating:4.6, totalSales:60,  joined:'2021', whatsapp:'201004444444', employees:'200+', specialties:['كيماويات','تصنيع','معالجة'], certifications:['ISO 9001','ISO 14001','MSDS'], registrationNumber:'78901', taxNumber:'890123' } },
  { id:8,  factoryId:8,  listingId:'812345', titleAr:'ألومنيوم وأسلاك معدنية',   category:'metal',     companyAr:'مصنع الألومنيوم القاهرة',     locAr:'العاشر من رمضان',   price:6500, unit:'طن',    unitAr:'للطن',    weightAr:'4 طن',        rating:4.8, reviews:77,  descAr:'ألومنيوم نقي وأسلاك نحاسية جاهزة للتصنيع الصناعي',        badge:'featured', image:metalWasteImage,   amount:4,  lat:30.32, lng:31.76, views:234, offers:18, status:'نشط', frequency:'weekly',  locationLink:'', specifications:{ material:'ألومنيوم / نحاس', color:'رمادي', condition:'نظيفة تماماً',        purity:'+95% نقي',  packaging:'لفات / بكرات',       storage:'مخزن مغطى وجاف', address:'العاشر من رمضان' },    seller:{ name:'مصنع الألومنيوم القاهرة',         verified:true,  rating:4.8, totalSales:120, joined:'2021', whatsapp:'201003333333', employees:'250+', specialties:['ألومنيوم','نحاس','معادن غير حديدية'], certifications:['ISO 9001','ISO 50001','ISO 14001'], registrationNumber:'89012', taxNumber:'901234' } },
  { id:9,  factoryId:9,  listingId:'456789', titleAr:'بقايا بلاستيك ABS وPVC',  category:'plastic',   companyAr:'مصنع بلاستيكو مصر',           locAr:'مدينة نصر',         price:1800, unit:'طن',    unitAr:'للطن',    weightAr:'6 طن',        rating:4.4, reviews:52,  descAr:'بلاستيك ABS وPVC نظيف مناسب للطحن وإعادة التصنيع',         badge:null,       image:plasticWasteImage, amount:6,  lat:30.07, lng:31.33, views:167, offers:9,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'ABS / PVC',    color:'متنوع / مختلط', condition:'نظيفة مع شوائب بسيطة', purity:'85–95%',   packaging:'أكياس كبيرة (جامبو)', storage:'مخزن مغطى وجاف', address:'مدينة نصر' },       seller:{ name:'مصنع بلاستيكو مصر',              verified:false, rating:4.4, totalSales:40,  joined:'2022', whatsapp:'201002222222', employees:'100+', specialties:['بلاستيك ABS','PVC','حبيبات'], certifications:['ISO 9001'], registrationNumber:'90123', taxNumber:'012345' } },
  { id:10, factoryId:10, listingId:'023456', titleAr:'أجهزة إلكترونية للتدوير',  category:'electronic',companyAr:'مصنع الأجهزة الحديثة',        locAr:'القاهرة',           price:2500, unit:'طん',    unitAr:'للطن',    weightAr:'3 طن',        rating:4.5, reviews:30,  descAr:'أجهزة إلكترونية قديمة صالحة لإعادة التدوير واستخلاص المعادن النفيسة', badge:'new', image:electronicsImg,   amount:3,  lat:30.06, lng:31.24, views:98,  offers:6,  status:'نشط', frequency:'monthly', locationLink:'', specifications:{ material:'إلكترونيات',  color:'متنوع / مختلط', condition:'مختلطة',            purity:'غير محددة', packaging:'كراتين',              storage:'مخزن مغطى وجاف', address:'القاهرة' },           seller:{ name:'مصنع الأجهزة الحديثة',           verified:true,  rating:4.5, totalSales:22,  joined:'2023', whatsapp:'201001111111', employees:'110+', specialties:['إلكترونيات','معالجة E-waste','استخلاص معادن'], certifications:['ISO 9001','R2 Certified'], registrationNumber:'01234', taxNumber:'123456' } },
];

// ─── Function to enrich data with circular economy information ──────────────
const enrichWasteWithCircularEconomy = (waste) => ({
  ...waste,
  recyclabilityType: waste.recyclabilityType || { plastic: 'Recyclable', metal: 'Recyclable', paper: 'Recyclable', glass: 'Recyclable', wood: 'Reusable', textile: 'Reusable', chemicals: 'DirectUse', electronic: 'Recyclable' }[waste.category] || 'Recyclable',
  processingRequired: waste.processingRequired ?? { plastic: true, metal: true, paper: false, glass: false, wood: false, textile: false, chemicals: false, electronic: true }[waste.category] ?? false,
  estimatedCO2Saved: waste.estimatedCO2Saved || { plastic: 2.5, metal: 45.0, paper: 1.8, glass: 3.2, wood: 1.5, textile: 2.1, chemicals: 0.8, electronic: 18.5 }[waste.category] || 5,
  estimatedOutput: waste.estimatedOutput || { plastic: '70% becomes pellets', metal: '95% pure recovered', paper: '100% recycled', glass: '100% reusable', wood: 'Mulch/chipboard', textile: 'Fiber for insulation', chemicals: 'Direct reuse', electronic: 'Precious metals extracted' }[waste.category] || 'Direct reuse',
  availableRecyclers: waste.availableRecyclers || Math.floor(Math.random() * 8) + 2,
  circularStatus: waste.circularStatus || { plastic: 'Recycling Recommended', metal: 'Recycling Recommended', paper: 'Ready for Recycling', glass: 'Ready for Recycling', wood: 'Reusable', textile: 'Reusable', chemicals: 'Direct Use Ready', electronic: 'Processing Needed' }[waste.category] || 'Ready for Sale',
  sustainabilityScore: waste.sustainabilityScore || { plastic: 75, metal: 92, paper: 88, glass: 95, wood: 85, textile: 78, chemicals: 65, electronic: 82 }[waste.category] || 80,
});

// ─── SPEC_LABELS ──────────────────────────────────────────────────────────────
const SPEC_LABELS = [
  { key: 'material',  label: 'Material Type'        },
  { key: 'color',     label: 'Color'                },
  { key: 'condition', label: 'Condition'            },
  { key: 'purity',    label: 'Purity Level'         },
  { key: 'packaging', label: 'Packaging Method'     },
  { key: 'storage',   label: 'Storage Method'       },
  { key: 'address',   label: 'Address'              },
];

// ─── Circular Economy Status Colors ────────────────────────────────────────
const statusColors = {
  'Ready for Sale': { bg: '#ecfdf5', color: '#059669' },
  'Reusable': { bg: '#dbeafe', color: '#0284c7' },
  'Needs Processing': { bg: '#fef3c7', color: '#d97706' },
  'Recycling Recommended': { bg: '#fecaca', color: '#dc2626' },
  'Processing Needed': { bg: '#fed7aa', color: '#ea580c' },
  'Direct Use Ready': { bg: '#e0e7ff', color: '#4f46e5' },
};

const recyclabilityColors = {
  'Recyclable': { bg: '#f0fdf4', color: '#16a34a', label: 'Recyclable' },
  'Reusable': { bg: '#dbeafe', color: '#0284c7', label: 'Reusable' },
  'DirectUse': { bg: '#fef3c7', color: '#d97706', label: 'Ready for Direct Use' },
};

const openWhatsApp = (phone, title) => {
  const clean = String(phone).replace(/\D/g, '');
  const msg = encodeURIComponent(`Hello, I am interested in your offer on the ECOv platform\nListing: ${title}`);
  window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
};

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FactoryMap = ({ lat, lng }) => {
  const greenMarkerIcon = L.icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42"><path d="M16 0C9.373 0 4 5.373 4 12c0 8 12 30 12 30s12-22 12-30c0-6.627-5.373-12-12-12z" fill="%23059669" stroke="white" stroke-width="1.5"/><circle cx="16" cy="12" r="5" fill="white"/></svg>'
    ),
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          maxZoom={19}
        />
        <Marker position={[lat, lng]} icon={greenMarkerIcon}>
          <Popup>
            <div style={{ fontSize: '0.9rem', textAlign: 'center' }}>
              <strong>📍 Factory Location</strong>
              <p style={{ margin: '4px 0' }}>{lat.toFixed(4)}, {lng.toFixed(4)}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

// ─── Image gallery ──────────────────────────────────────────────────────────────────────────────
const ImageGallery = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const all = images && images.length > 0 ? images : [];
  
  if (all.length === 0) {
    return (
      <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#d1fae5,#a7f3d0)', minHeight:'320px', display:'flex', alignItems:'center', justifyContent:'center', color:'#059669', fontSize:'0.9rem' }}>
        <div style={{textAlign:'center'}}>
          <Image size={40} style={{marginBottom:'8px'}} />
          <p>No images available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#d1fae5,#a7f3d0)', minHeight:'320px' }}>
      <img src={all[current]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', minHeight:'320px' }} onError={e => { e.target.style.display = 'none'; }} />
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
  const [language] = useState('en'); // or detect from localStorage/context
  
  // ✅ All state declarations at the top
  const [customListings, setCustomListings] = useState([]);
  const [factoryProfiles, setFactoryProfiles] = useState([]);
  const [loadingItem, setLoadingItem] = useState(true);
  const [apiWaste, setApiWaste] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [showRecyclerModal, setShowRecyclerModal] = useState(false);
  const [fetchedProfileAPIData, setFetchedProfileAPIData] = useState(null);

  const normalizeLogoUrl = (url) => {
    if (!url) return null;
    const urlStr = String(url).trim();
    if (urlStr === 'undefined' || urlStr === 'null' || urlStr === '') return null;
    if (urlStr.startsWith('/')) return urlStr;
    if (urlStr.startsWith('http')) return urlStr;
    if (!urlStr.startsWith('/')) return '/' + urlStr;
    return urlStr;
  };

  const getLogoDebugInfo = (factory) => {
    return {
      factoryName: factory.factoryName,
      hasLogoPreview: !!factory.logoPreview,
      hasCompanyLogo: !!factory.companyLogo,
      hasLogo: !!factory.logo,
      previewValue: factory.logoPreview?.substring?.(0, 50),
      companyLogoValue: factory.companyLogo?.substring?.(0, 50),
      logoValue: factory.logo?.substring?.(0, 50),
    };
  };

  const generateListingIdIfMissing = (item) => {
    if (!item.listingId) {
      return String(Math.floor(100000 + (item.id % 900000))).padStart(6, '0');
    }
    return item.listingId;
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        let listings = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
        console.log('WasteDetails loaded listings:', listings);

        listings = listings.map(item => {
          let image = item.image;
          let images = item.images || [];

          if (image && typeof image === 'string' && image.startsWith('/')) {
            const apiBase = 'https://localhost:54464';
            image = `${apiBase}${image}`;
          }

          if (images && images.length > 0) {
            images = images.map(img => {
              if (img && typeof img === 'string' && img.startsWith('/')) {
                const apiBase = 'https://localhost:54464';
                return `${apiBase}${img}`;
              }
              return img;
            });
          }

          const listingId = generateListingIdIfMissing(item);
          return { ...item, image, images, listingId };
        });

        listings.forEach((item, idx) => {
          console.log(`  Item ${idx + 1}:`, {id: item.id, titleAr: item.titleAr, listingId: item.listingId, hasImage: !!item.image, hasImages: item.images?.length || 0});
        });
        setCustomListings(listings);
      } catch (e) {
        console.error('Error loading custom listings:', e);
        setCustomListings([]);
      }

      try {
        try {
          console.log('📌 Attempting to fetch factory profiles from API...');
          const response = await marketplaceAPI.getListings({ limit: 1000 });

          if (response?.data?.data) {
            const factoriesFromListings = {};
            response.data.data.forEach(listing => {
              if (listing.factoryId && listing.factoryName && !factoriesFromListings[listing.factoryId]) {
                const logoUrl = listing.logoPreview 
                  || listing.companyLogo 
                  || listing.logo 
                  || listing.logoUrl 
                  || listing.factoryLogo 
                  || null;
                
                factoriesFromListings[listing.factoryId] = {
                  id: listing.factoryId,
                  factoryId: listing.factoryId,
                  factoryName: listing.factoryName || listing.companyAr || 'Unknown Factory',
                  industryType: listing.industryType || 'Unknown',
                  location: listing.location || listing.locAr || '',
                  address: listing.address || '',
                  email: listing.email || '',
                  phone: listing.phone || '',
                  ownerName: listing.ownerName || '',
                  ownerPhone: listing.ownerPhone || '',
                  taxNumber: listing.taxNumber || '',
                  registrationNumber: listing.registrationNumber || '',
                  logoPreview: logoUrl,
                  companyLogo: logoUrl,
                  logo: logoUrl,
                  isVerified: listing.isVerified ? true : false,
                  rating: listing.rating || 0,
                  completedOrders: listing.completedOrders || 0,
                  certifications: listing.certifications || [],
                  mainProducts: listing.mainProducts || listing.industryType || '',
                  productionCapacity: listing.productionCapacity || listing.employees || '0-50',
                  establishmentYear: listing.establishmentYear || listing.joined || new Date().getFullYear(),
                };
              }
            });

            const factories = Object.values(factoriesFromListings);
            if (factories.length > 0) {
              console.log('✅ Loaded', factories.length, 'factories from API');
              setFactoryProfiles(factories);
              localStorage.setItem('ecov_factories', JSON.stringify(factories));
              return;
            }
          }
        } catch (apiErr) {
          console.warn('⚠️ API fetch failed:', apiErr.message);
        }

        let factories = JSON.parse(localStorage.getItem('ecov_factories') || '[]');

        if (factories?.length > 0) {
          console.log('✅ Loaded', factories.length, 'factories from localStorage');
          setFactoryProfiles(factories);
          return;
        }

        console.log('📌 Using TEST_FACTORY_PROFILES fallback');
        factories = TEST_FACTORY_PROFILES;
        localStorage.setItem('ecov_factories', JSON.stringify(factories));
        setFactoryProfiles(factories);
      } catch (e) {
        console.error('Error loading factory profiles:', e);
        setFactoryProfiles(TEST_FACTORY_PROFILES);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const fetchWasteById = async () => {
      try {
        setLoadingItem(true);
        console.log(`📦 Fetching waste item by ID: ${id}`);
        const response = await marketplaceAPI.getListingById(id);
        
        if (response?.data?.data) {
          const item = response.data.data;
          console.log(`✅ Fetched waste item from API:`, {
            id: item.id,
            titleAr: item.titleAr,
            titleEn: item.titleEn,
            category: item.category,
            price: item.price
          });

          const generateListingId = (id) => {
            return String(Math.floor(100000 + ((id % 900000) || 1))).padStart(6, '0');
          };

          const itemId = String(item.id).trim();
          const transformed = {
            id: itemId,
            title: item.title || item.titleEn || item.type,
            titleEn: item.title || item.titleEn || item.typeEn,
            titleAr: item.titleAr   || item.type,
            category: item.category,
            company: item.companyName || item.companyNameEn || item.factoryName,
            companyEn: item.companyName || item.companyNameEn || item.factoryName,
            companyAr: item.companyNameAr || item.factoryName,
            location: item.location || item.locationEn || item.location,
            locEn: item.location || item.locationEn || item.location,
            locAr: item.locationAr || item.location,
            price: item.price,
            amount: item.amount || 1,
            unit: item.unit || item.unitAr,
            unitAr: item.unitAr || item.unit,
            unitEn: item.unitEn || item.unit,
            rating: item.rating || 4.5,
            reviews: item.reviews || 0,
            description: item.description || item.descriptionEn || item.descriptionAr,
            descriptionEn: item.description || item.descriptionEn || item.descriptionAr,
            descriptionAr: item.descriptionAr || item.description,
            descEn: item.description || item.descriptionEn,
            descAr: item.descriptionAr || item.description,
            image: item.imageUrl || getCategoryFallback(item.category),
            images: item.images || [item.imageUrl || getCategoryFallback(item.category)],
            lat: item.latitude,
            lng: item.longitude,
            listingId: item.listingId || generateListingId(itemId),
            factoryId: item.factoryId,
            email: item.email,
            status: item.status || 'Active',
            createdAt: item.createdAt,
            seller: item.seller || {
              name: item.companyName || item.companyNameEn || item.factoryName || 'Company',
              verified: item.isVerified || false,
              rating: item.rating || 4.5,
              totalSales: item.totalSales || 0,
              joined: item.establishmentYear || new Date().getFullYear(),
              whatsapp: item.phone || '',
              email: item.email || '',
              employees: item.employees || '0',
              specialties: item.specialties || [],
              certifications: item.certifications || [],
              logo: item.logoUrl || null,
              ownerName: item.ownerName || '',
              ownerPhone: item.ownerPhone || '',
              taxNumber: item.taxNumber || '',
              registrationNumber: item.registrationNumber || '',
              location: item.location || '',
              address: item.address || '',
            }
          };

          setApiWaste(transformed);
          setLoadingItem(false);
        }
      } catch (err) {
        console.warn(`⚠️ Failed to fetch waste by ID from API:`, err.message);
        setLoadingItem(false);
      }
    };

    if (id) {
      fetchWasteById();
    }
  }, [id]);

  const allItems = [...customListings, ...STATIC_WASTE_ITEMS];
  let rawWaste = apiWaste || allItems.find(w => String(w.id) === String(id)) || STATIC_WASTE_ITEMS[0];
  
  console.log(`📊 WasteDetails - Using data from:`, {
    fromAPI: !!apiWaste,
    fromLocalStorage: !!(!apiWaste && allItems.find(w => String(w.id) === String(id))),
    fromStaticFallback: !apiWaste && !allItems.find(w => String(w.id) === String(id)),
    wasteId: rawWaste?.id,
    wasteTitle: rawWaste?.titleAr
  });
  
  if ((!rawWaste.lat || !rawWaste.lng) && rawWaste.category) {
    const fallback = STATIC_WASTE_ITEMS.find(w => w.category === rawWaste.category);
    if (fallback && fallback.lat && fallback.lng) {
      console.log(`📍 Using fallback coordinates from category match:`, {
        from: rawWaste.titleAr,
        to: fallback.titleAr,
        lat: fallback.lat,
        lng: fallback.lng
      });
      rawWaste = { ...rawWaste, lat: fallback.lat, lng: fallback.lng };
    }
  }
  
  const getFactoryProfile = () => {
    console.log(`🔧 Searching for factory - Waste item:`, {
      id: rawWaste.id,
      factoryId: rawWaste.factoryId,
      email: rawWaste.email,
      companyAr: rawWaste.companyAr,
      companyEn: rawWaste.companyEn,
      seller: rawWaste.seller?.name
    });
    console.log(`   Available factories:`, factoryProfiles.map(f => ({ 
      id: f.id, 
      factoryId: f.factoryId, 
      name: f.factoryName,
      email: f.email,
      hasLogo: !!f.logoPreview || !!f.companyLogo || !!f.logo,
      logoFields: {
        logoPreview: !!f.logoPreview,
        companyLogo: !!f.companyLogo,
        logo: !!f.logo
      }
    })));
    
    let factory = null;
    
    if (rawWaste.factoryId) {
      factory = factoryProfiles.find(f => 
        String(f.id) === String(rawWaste.factoryId) || 
        String(f.factoryId) === String(rawWaste.factoryId)
      );
      if (factory) {
        console.log(`✅ Found factory by factoryId:`, factory.factoryName);
        return factory;
      }
    }
    
    if (rawWaste.email) {
      factory = factoryProfiles.find(f => 
        f.email?.toLowerCase() === rawWaste.email.toLowerCase()
      );
      if (factory) {
        console.log(`✅ Found factory by email:`, factory.factoryName);
        return factory;
      }
    }
    
    const searchNameAr = (rawWaste.companyAr || '').toLowerCase().trim();
    const searchNameEn = (rawWaste.companyEn || '').toLowerCase().trim();
    const searchName = searchNameAr || searchNameEn;
    
    if (searchName) {
      factory = factoryProfiles.find(f => {
        const factoryNameLower = f.factoryName?.toLowerCase() || '';
        return factoryNameLower.includes(searchName) || 
               searchName.includes(factoryNameLower) ||
               (searchNameAr && factoryNameLower.includes(searchNameAr)) ||
               (searchNameEn && factoryNameLower.includes(searchNameEn));
      });
      if (factory) {
        console.log(`✅ Found factory by company name:`, factory.factoryName);
        return factory;
      }
    }

    if (rawWaste.seller?.name) {
      const sellerNameLower = rawWaste.seller.name.toLowerCase().trim();
      factory = factoryProfiles.find(f => {
        const factoryNameLower = f.factoryName?.toLowerCase() || '';
        return factoryNameLower.includes(sellerNameLower) ||
               sellerNameLower.includes(factoryNameLower);
      });
      if (factory) {
        console.log(`✅ Found factory by seller name:`, factory.factoryName);
        return factory;
      }
    }
    
    console.warn(`⚠️ Factory not found in profiles, creating interim profile from seller data for:`, {
      factoryId: rawWaste.factoryId,
      email: rawWaste.email,
      companyAr: rawWaste.companyAr,
      companyEn: rawWaste.companyEn,
      sellerName: rawWaste.seller?.name
    });
    
    const interimFactory = {
      id: rawWaste.factoryId || `interim-${rawWaste.id}`,
      factoryId: rawWaste.factoryId,
      factoryName: rawWaste.companyAr || rawWaste.companyEn || rawWaste.seller?.name || 'بائع بدون اسم',
      industryType: rawWaste.seller?.specialties?.[0] || 'غير محدد',
      location: rawWaste.locAr || rawWaste.locEn || rawWaste.seller?.location || '',
      address: rawWaste.seller?.address || '',
      email: rawWaste.email || rawWaste.seller?.email || '',
      phone: rawWaste.seller?.whatsapp || rawWaste.seller?.phone || '',
      ownerName: rawWaste.seller?.ownerName || '',
      ownerPhone: rawWaste.seller?.ownerPhone || '',
      taxNumber: rawWaste.seller?.taxNumber || '',
      registrationNumber: rawWaste.seller?.registrationNumber || '',
      logoPreview: rawWaste.seller?.logo || null,
      companyLogo: rawWaste.seller?.logo || null,
      logo: rawWaste.seller?.logo || null,
      isVerified: rawWaste.seller?.verified ?? false,
      rating: rawWaste.seller?.rating ?? 0,
      completedOrders: rawWaste.seller?.totalSales ?? 0,
      certifications: rawWaste.seller?.certifications || [],
      mainProducts: rawWaste.seller?.specialties?.join(', ') || 'متعدد المنتجات',
      productionCapacity: rawWaste.seller?.employees || '0-50 موظف',
      establishmentYear: rawWaste.seller?.joined || new Date().getFullYear(),
      isInterim: true,
    };
    
    console.log(`ℹ️ Created interim factory profile from seller data:`, interimFactory.factoryName);
    return interimFactory;
  };

  const factoryProfile = getFactoryProfile();

  useEffect(() => {
    const fetchCompleteFactoryProfile = async () => {
      const email = rawWaste?.email || rawWaste?.sellerEmail;
      
      if (!email) {
        console.log(`⏭️ Skipping Profile API fetch: No email available in rawWaste`);
        return;
      }
      
      try {
        console.log(`📌 [Profile API] Attempting to fetch for email: ${email}`);
        const profileResponse = await profileAPI.getFactoryByEmail(email);
        
        const apiData = profileResponse?.data?.data;
        console.log(`📮 [Profile API] Response received:`, {
          hasResponse: !!profileResponse,
          hasData: !!apiData,
          statusCode: profileResponse?.status,
          response: profileResponse
        });
        
        if (apiData && (apiData.factoryId || apiData.factoryName)) {
          const completeProfile = {
            id: apiData.factoryId,
            factoryId: apiData.factoryId,
            factoryName: apiData.factoryName || rawWaste.companyAr || 'Unknown Factory',
            industryType: apiData.industryType || 'Unknown',
            location: apiData.location || rawWaste.locAr || '',
            address: apiData.address || '',
            email: apiData.email || '',
            phone: apiData.phone || '',
            ownerName: apiData.ownerName || '',
            ownerPhone: apiData.ownerPhone || '',
            taxNumber: apiData.taxNumber || '',
            registrationNumber: apiData.registrationNumber || '',
            logoPreview: apiData.logoUrl || apiData.logoPreview || null,
            companyLogo: apiData.logoUrl || apiData.logoPreview || null,
            logo: apiData.logoUrl || apiData.logoPreview || null,
            isVerified: apiData.isVerified || false,
            rating: apiData.rating || 0,
            totalReviews: apiData.totalReviews || 0,
            completedOrders: apiData.completedOrders || 0,
            certifications: apiData.certifications || [],
            mainProducts: apiData.mainProducts || apiData.industryType || '',
            productionCapacity: apiData.productionCapacity || '0-50',
            establishmentYear: apiData.establishmentYear || new Date().getFullYear(),
            isFromProfileAPI: true,
          };
          
          console.log(`✅ [Profile API] Successfully enriched factory:`, completeProfile.factoryName);
          console.log(`   - Logo: ${completeProfile.logoPreview ? 'YES ✓' : 'NO ✗'}`);
          console.log(`   - Tax Number: ${completeProfile.taxNumber || 'N/A'}`);
          console.log(`   - Registration Number: ${completeProfile.registrationNumber || 'N/A'}`);
          console.log(`   - Address: ${completeProfile.address || 'N/A'}`);
          
          setFetchedProfileAPIData(completeProfile);
        } else {
          console.warn(`⚠️ [Profile API] Invalid response structure:`, {
            email: rawWaste.email,
            dataPresent: !!apiData,
            dataKeys: apiData ? Object.keys(apiData) : [],
            received: apiData
          });
          setFetchedProfileAPIData(null);
        }
      } catch (err) {
        console.error(`❌ [Profile API] Error fetching factory profile:`, {
          email: rawWaste.email,
          error: err?.message,
          statusCode: err?.response?.status,
          fullError: err
        });
        setFetchedProfileAPIData(null);
      }
    };
    
    fetchCompleteFactoryProfile();
  }, [rawWaste?.email]);
  
  console.log(`📍 Waste coordinates - rawWaste:`, {
    id: rawWaste.id,
    lat: rawWaste.lat,
    lng: rawWaste.lng,
    hasCoordinates: !!(rawWaste.lat && rawWaste.lng)
  });
  
  const ensureListingId = (item) => {
    if (!item.listingId) {
      return String(Math.floor(100000 + ((Number(item.id) % 900000) || 1))).padStart(6, '0');
    }
    return item.listingId;
  };

  const activeFactoryProfile = fetchedProfileAPIData || factoryProfile;

  const enrichedWaste = {
    ...rawWaste,
    listingId: ensureListingId(rawWaste),
    lat: rawWaste.lat,
    lng: rawWaste.lng,
    seller: activeFactoryProfile ? {
      ...rawWaste.seller,
      name: activeFactoryProfile.factoryName || rawWaste.seller?.name,
      verified: activeFactoryProfile.isVerified || rawWaste.seller?.verified,
      rating: activeFactoryProfile.rating || rawWaste.seller?.rating,
      totalSales: activeFactoryProfile.completedOrders || rawWaste.seller?.totalSales,
      joined: activeFactoryProfile.establishmentYear || rawWaste.seller?.joined,
      whatsapp: activeFactoryProfile.phone || rawWaste.seller?.whatsapp,
      email: activeFactoryProfile.email || rawWaste.seller?.email,
      employees: activeFactoryProfile.productionCapacity || rawWaste.seller?.employees,
      specialties: [activeFactoryProfile.industryType, activeFactoryProfile.mainProducts].filter(Boolean),
      certifications: activeFactoryProfile.certifications || rawWaste.seller?.certifications,
      logo: activeFactoryProfile.logoPreview 
        || activeFactoryProfile.companyLogo 
        || activeFactoryProfile.logo 
        || rawWaste.seller?.logo
        || null,
      ownerName: activeFactoryProfile.ownerName,
      ownerPhone: activeFactoryProfile.ownerPhone,
      taxNumber: activeFactoryProfile.taxNumber,
      registrationNumber: activeFactoryProfile.registrationNumber,
      location: activeFactoryProfile.location || rawWaste.seller?.location,
      address: activeFactoryProfile.address || rawWaste.seller?.address,
      isInterimProfile: activeFactoryProfile.isFromProfileAPI !== true,
    } : {
      name: rawWaste.seller?.name || 'بائع بدون اسم',
      verified: rawWaste.seller?.verified ?? false,
      rating: rawWaste.seller?.rating ?? 0,
      totalSales: rawWaste.seller?.totalSales ?? 0,
      joined: rawWaste.seller?.joined ?? new Date().getFullYear(),
      whatsapp: rawWaste.seller?.whatsapp || '',
      email: rawWaste.seller?.email || '',
      employees: rawWaste.seller?.employees || '0',
      specialties: rawWaste.seller?.specialties && Array.isArray(rawWaste.seller.specialties) ? rawWaste.seller.specialties : [],
      certifications: rawWaste.seller?.certifications && Array.isArray(rawWaste.seller.certifications) ? rawWaste.seller.certifications : [],
      logo: rawWaste.seller?.logo || null,
      ownerName: rawWaste.seller?.ownerName || rawWaste.seller?.name || '',
      ownerPhone: rawWaste.seller?.ownerPhone || rawWaste.seller?.whatsapp || '',
      taxNumber: rawWaste.seller?.taxNumber || '',
      registrationNumber: rawWaste.seller?.registrationNumber || '',
      location: rawWaste.seller?.location || rawWaste.locAr || '',
      address: rawWaste.seller?.address || '',
      isInterimProfile: false,
    }
  };
  
  const logoSource = activeFactoryProfile?.logoPreview ? 'logoPreview' 
    : activeFactoryProfile?.companyLogo ? 'companyLogo'
    : activeFactoryProfile?.logo ? 'factoryProfile.logo'
    : rawWaste.seller?.logo ? 'rawWaste.seller.logo'
    : 'NO_LOGO';
  
  console.log(`📦 Enriched waste seller data:`, {
    name: enrichedWaste.seller?.name,
    logoSource: logoSource,
    dataSource: fetchedProfileAPIData ? '🌐 FROM PROFILE API' : (factoryProfile ? '💾 FROM CACHE' : '📝 FROM LISTING'),
    logoUrl: enrichedWaste.seller?.logo?.substring?.(0, 50) + '...' || 'null',
    normalizedLogo: normalizeLogoUrl(enrichedWaste.seller?.logo)?.substring?.(0, 50),
    verified: enrichedWaste.seller?.verified,
    rating: enrichedWaste.seller?.rating,
    email: enrichedWaste.seller?.email,
    location: enrichedWaste.seller?.location,
    taxNumber: enrichedWaste.seller?.taxNumber,
    registrationNumber: enrichedWaste.seller?.registrationNumber,
    address: enrichedWaste.seller?.address,
    factoryId: activeFactoryProfile?.id,
    hasFactoryProfile: !!activeFactoryProfile,
    factoryProfileType: fetchedProfileAPIData ? 'FULL (from API)' : (activeFactoryProfile?.isInterim ? 'INTERIM (from seller data)' : 'CACHE'),
    hasLogo: !!enrichedWaste.seller?.logo,
    factoryLogoDebug: activeFactoryProfile ? getLogoDebugInfo(activeFactoryProfile) : null,
  });
  
  if (!enrichedWaste.seller?.logo) {
    console.warn('⚠️ No logo found for seller:', enrichedWaste.seller?.name, 
      `(source: ${fetchedProfileAPIData ? 'API' : 'cached'}, factoryProfile: ${activeFactoryProfile?.factoryName || 'none'}) - Using letter avatar fallback`);
  } else {
    console.log('✅ Logo found from', logoSource + ':', enrichedWaste.seller.logo.substring(0, 60), 
      `(Source: ${fetchedProfileAPIData ? '🌐 Profile API' : '💾 Cached'})`);
  }
  
  const wasteWithNormalizedImages = {
    ...enrichWasteWithCircularEconomy(enrichedWaste),
    image: enrichedWaste.image || (enrichedWaste.images && enrichedWaste.images.length > 0 ? enrichedWaste.images[0] : null),
    images: enrichedWaste.images || (enrichedWaste.image ? [enrichedWaste.image] : [])
  };
  const waste = wasteWithNormalizedImages;
  
  console.log('🖼️ WasteDetails - Final waste object:', {
    id: waste.id,
    titleAr: waste.titleAr,
    sellerName: waste.seller?.name,
    sellerVerified: waste.seller?.verified,
    sellerEmail: waste.seller?.email,
    imageUrl: waste.image?.substring?.(0, 50),
    imagesCount: waste.images?.length,
    hasLogo: !!waste.seller?.logo
  });
  
  // ✅ FIX: Get safe category label
  const categoryLabel = getCategoryLabel(waste.category, language);
  
  if (loadingItem && !apiWaste) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg,#f0fdf4 0%,#ecfdf5 50%,#f0f9ff 100%)' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>⏳</div>
          <div style={{ fontSize:'1.1rem', color:'#059669', fontWeight:600 }}>Loading...</div>
          <div style={{ fontSize:'0.9rem', color:'#6b7280', marginTop:'0.5rem' }}>Fetching listing data from database</div>
        </div>
      </div>
    );
  }
  
  if (!waste) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg,#f0fdf4 0%,#ecfdf5 50%,#f0f9ff 100%)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>❌</div>
        <div style={{ fontSize:'1.1rem', color:'#d32f2f', fontWeight:600 }}>Listing not found</div>
        <div style={{ fontSize:'0.9rem', color:'#6b7280', marginTop:'0.5rem' }}>Listing ID: {id}</div>
        <button onClick={() => navigate('/market')} style={{ marginTop:'1rem', padding:'0.75rem 1.5rem', background:'#059669', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600 }}>Back to Marketplace</button>
      </div>
    </div>
  );

  const wasteImages = waste.images?.length > 0 ? waste.images : (waste.image ? [waste.image] : []);
  const total = Number(waste.price) * Number(waste.amount);
  const similar = allItems.filter(w => w.category === waste.category && w.id !== waste.id).slice(0, 3);

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#f0fdf4 0%,#ecfdf5 50%,#f0f9ff 100%)', fontFamily:"'Segoe UI',sans-serif" }}>

      {/* Top Navigation Bar */}
      <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(16,185,129,0.15)', padding:'0 2.5rem', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 2px 24px rgba(16,185,129,0.07)' }}>
        <button onClick={() => navigate('/market')} onMouseEnter={e => e.currentTarget.style.background='#ecfdf5'} onMouseLeave={e => e.currentTarget.style.background='none'}
          style={{ display:'flex', alignItems:'center', gap:'8px', color:'#059669', fontWeight:700, fontSize:'0.92rem', background:'none', border:'none', cursor:'pointer', padding:'8px 18px', borderRadius:'999px', fontFamily:'inherit' }}>
          <ArrowRight size={16} /> Back to Marketplace
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.82rem', color:'#6b7280' }}>
          <span style={{ color:'#059669', fontWeight:700, cursor:'pointer' }} onClick={() => navigate('/market')}>Marketplace</span>
          <span>/</span><span>{categoryLabel}</span><span>/</span>
          <span style={{ color:'#374151', fontWeight:600, maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{waste.titleEn || waste.titleAr}</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ maxWidth:'1440px', margin:'0 auto', padding:'2rem 2.5rem', display:'grid', gridTemplateColumns:'1fr 400px', gap:'2rem', alignItems:'start', boxSizing:'border-box' }}>

        {/* Main Content */}
        <div>
          <div style={{ background:'#fff', borderRadius:'24px', overflow:'hidden', boxShadow:'0 4px 48px rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.1)' }}>

            {/* Hero Section */}
            <div style={{ display:'grid', gridTemplateColumns:'420px 1fr', minHeight:'320px' }}>
              <ImageGallery images={wasteImages} />
              <div style={{ padding:'2.5rem', display:'flex', flexDirection:'column', justifyContent:'center', background:'linear-gradient(135deg,#f8fffe,#f0fdf4)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
                  {/* ✅ FIX: Use safe category label */}
                  <span style={chip('#059669','#ecfdf5')}>{categoryLabel}</span>
                  {waste.frequency && <span style={chip('#0ea5e9','#f0f9ff')}><RefreshCw size={10}/> {waste.frequency}</span>}
                  <span style={chip('#059669','#dcfce7')}><CheckCircle size={10}/> {waste.status || 'Active'}</span>
                  {waste.circularStatus && <span style={chip(statusColors[waste.circularStatus]?.color || '#059669', statusColors[waste.circularStatus]?.bg || '#ecfdf5')}>{statusColors[waste.circularStatus]?.icon} {waste.circularStatus}</span>}
                </div>
                <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#064e3b', lineHeight:1.35, margin:'0 0 18px', letterSpacing:'-0.02em' }}>{waste.titleEn || waste.titleAr}</h1>
                <div style={{ display:'flex', alignItems:'center', gap:'18px', flexWrap:'wrap', marginBottom: wasteImages.length > 1 ? '14px' : 0 }}>
                  {[{ icon:<Users size={13} color="#9ca3af"/>, text:`${waste.offers||0} Offers` }, { icon:<MapPin size={13} color="#9ca3af"/>, text:waste.locEn || waste.locAr }].map((m,i) => (
                    <span key={i} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'0.81rem', color:'#6b7280' }}>{m.icon}{m.text}</span>
                  ))}
                </div>
                {/* Thumbnails */}
                {wasteImages.length > 1 && (
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    {wasteImages.slice(0,4).map((img,i) => (
                      <img key={i} src={img} alt="" style={{ width:'46px', height:'46px', objectFit:'cover', borderRadius:'8px', border:'2px solid rgba(16,185,129,0.3)' }} onError={e => { e.target.style.display = 'none'; }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', borderTop:'1.5px solid #f0fdf4', borderBottom:'1.5px solid #f0fdf4' }}>
              {[
                { label:'Available Quantity', value:waste.amount,                      sub:waste.unit,            color:'#064e3b' },
                { label:'Price per Unit',      value:Number(waste.price).toLocaleString(), sub:`EGP / ${waste.unit}`, color:'#059669' },
                { label:'Total',                     value:total.toLocaleString(),             sub:'EGP',                color:'#064e3b' },
                { label:'Views',                    value:waste.views||0,                     sub:'views',              color:'#064e3b' },
                { label:'Listing ID',               value:waste.listingId || 'N/A',           sub:'ID',                 color:'#059669', fontFamily:'monospace', fontSize:'0.9rem', fontWeight:'bold' },
              ].map((s,i) => (
                <div key={i} style={{ padding:'22px', display:'flex', flexDirection:'column', alignItems:'center', gap:'5px', borderLeft:i<4 ? '1.5px solid #f0fdf4' : 'none' }}>
                  <span style={{ fontSize:'0.7rem', color:'#9ca3af', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</span>
                  <span style={{ fontSize:s.fontSize || '1.45rem', fontWeight:800, color:s.color, fontFamily:s.fontFamily || 'inherit' }}>{s.value}</span>
                  <span style={{ fontSize:'0.72rem', color:'#6b7280' }}>{s.sub}</span>
                </div>
              ))}
            </div>

            <div style={{ padding:'2.5rem' }}>

              {/* Description */}
              <div style={{ marginBottom:'2.5rem' }}>
                <h3 style={secTitle}><Zap size={15} color="#059669"/>Detailed Description</h3>
                <p style={{ color:'#374151', lineHeight:1.85, fontSize:'0.95rem', margin:0 }}>{waste.descEn || waste.descAr}</p>
              </div>

              {/* Technical Specifications */}
              <div style={{ marginBottom:'2.5rem' }}>
                <h3 style={secTitle}><Award size={15} color="#059669"/>Technical Specifications</h3>
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

              {/* Circular Economy Requirements */}
              <div style={{ marginBottom:'2.5rem', background:'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius:'20px', padding:'24px', border:'2px solid rgba(16,185,129,0.2)' }}>
                <h3 style={{ ...secTitle, borderBottom:'2px solid rgba(16,185,129,0.3)' }}><TrendingUp size={15} color="#059669"/> Circular Economy Requirements</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'14px', marginTop:'16px' }}>
                  <div style={{ background:'#fff', borderRadius:'14px', padding:'16px', border:'1.5px solid rgba(16,185,129,0.15)' }}>
                    <div style={{ fontSize:'0.72rem', color:'#9ca3af', fontWeight:700, textTransform:'uppercase', marginBottom:'8px' }}>Recyclability Type</div>
                    <div style={{ fontSize:'1.05rem', fontWeight:700, color: recyclabilityColors[waste.recyclabilityType]?.color || '#059669' }}>{recyclabilityColors[waste.recyclabilityType]?.label || 'Not specified'}</div>
                  </div>
                  <div style={{ background:'#fff', borderRadius:'14px', padding:'16px', border:'1.5px solid rgba(16,185,129,0.15)' }}>
                    <div style={{ fontSize:'0.72rem', color:'#9ca3af', fontWeight:700, textTransform:'uppercase', marginBottom:'8px' }}>Processing Required</div>
                    <div style={{ fontSize:'1.05rem', fontWeight:700, color: waste.processingRequired ? '#dc2626' : '#16a34a' }}>{waste.processingRequired ? 'Yes - Processing Required' : 'No - Ready to Use'}</div>
                  </div>
                  <div style={{ background:'#fff', borderRadius:'14px', padding:'16px', border:'1.5px solid rgba(16,185,129,0.15)', gridColumn:'1/-1' }}>
                    <div style={{ fontSize:'0.72rem', color:'#9ca3af', fontWeight:700, textTransform:'uppercase', marginBottom:'8px' }}>Expected Output</div>
                    <div style={{ fontSize:'0.95rem', fontWeight:700, color:'#374151' }}>{waste.estimatedOutput}</div>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div style={{ marginBottom:'2.5rem', background:'linear-gradient(135deg,#dbeafe,#bfdbfe)', borderRadius:'20px', padding:'24px', border:'2px solid rgba(59,130,246,0.3)' }}>
                <h3 style={{ ...secTitle, color:'#1e40af', borderBottom:'2px solid rgba(59,130,246,0.3)', paddingBottom:'14px' }}><Leaf size={15} color="#0284c7"/> Expected Environmental Impact</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'16px', marginTop:'16px' }}>
                  <div style={{ background:'rgba(255,255,255,0.6)', borderRadius:'14px', padding:'18px', border:'1.5px solid rgba(59,130,246,0.2)' }}>
                    <div style={{ fontSize:'0.72rem', color:'#0284c7', fontWeight:700, textTransform:'uppercase', marginBottom:'8px' }}>💨 CO₂ Savings</div>
                    <div style={{ fontSize:'1.65rem', fontWeight:800, color:'#0284c7', marginBottom:'4px' }}>{waste.estimatedCO2Saved} kg</div>
                    <div style={{ fontSize:'0.78rem', color:'#1e40af' }}>Carbon Emissions Avoided</div>
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.6)', borderRadius:'14px', padding:'18px', border:'1.5px solid rgba(59,130,246,0.2)' }}>
                    <div style={{ fontSize:'0.72rem', color:'#0284c7', fontWeight:700, textTransform:'uppercase', marginBottom:'8px' }}>📈 Sustainability Score</div>
                    <div style={{ fontSize:'1.65rem', fontWeight:800, color:'#0284c7', marginBottom:'4px' }}>{waste.sustainabilityScore}%</div>
                    <div style={{ fontSize:'0.78rem', color:'#1e40af' }}>Sustainability Score</div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div style={{ marginBottom:'2.5rem', background:'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius:'20px', overflow:'hidden', border:'1.5px solid rgba(16,185,129,0.15)' }}>
                <div style={{ padding:'16px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(16,185,129,0.12)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.95rem', fontWeight:800, color:'#064e3b' }}><MapPin size={16} color="#059669"/> Factory Location on Map</div>
                  {waste.lat && waste.lng && (
                    <a href={`https://www.google.com/maps?q=${waste.lat},${waste.lng}`} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'5px', color:'#059669', fontSize:'0.8rem', fontWeight:700, textDecoration:'none' }}>
                      Open in Google Maps <ExternalLink size={12}/>
                    </a>
                  )}
                </div>
                <div style={{ height:'300px' }}>
                  {waste.lat && waste.lng
                    ? <FactoryMap lat={waste.lat} lng={waste.lng}/>
                    : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'8px', color:'#9ca3af' }}><MapPin size={32}/><span>Location Not Specified</span></div>
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

              {/* Seller Information */}
              <div style={{ borderRadius:'20px', padding:'24px' }}>
                <h3 style={{ fontSize:'1.1rem', fontWeight:800, color:'#064e3b', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px' }}><Shield size={18} color="#059669"/> About Seller</h3>
                
                {/* Logo and main name */}
                <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px' }}>
                  <div style={{ width:'120px', height:'120px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden', background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1.5px solid rgba(16,185,129,0.2)' }}>
                    {waste.seller?.logo ? (
                      <img 
                        src={waste.seller.logo} 
                        alt={waste.seller?.name || 'Seller'} 
                        style={{ width:'100%', height:'100%', objectFit:'contain', padding:'8px' }}
                        onError={(e) => {
                          console.warn('⚠️ Logo failed to load:', waste.seller.logo, 'for seller:', waste.seller?.name);
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;';
                            const bgColor = '#059669';
                            const firstLetter = waste.seller?.name?.[0] || '🏭';
                            fallback.innerHTML = `
                              <div style="width:60px;height:60px;border-radius:50%;background:${bgColor}20;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;color:${bgColor};">
                                ${firstLetter}
                              </div>
                              <span style="font-size:11px;color:#9ca3af;text-align:center;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                                ${waste.seller?.name || 'No Image'}
                              </span>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                        onLoad={() => {
                          console.log('✅ Logo loaded successfully for:', waste.seller?.name);
                        }}
                      />
                    ) : (
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'4px', width:'100%', height:'100%' }}>
                        <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'#05966920', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'bold', color:'#059669' }}>
                          {waste.seller?.name?.[0] || '🏭'}
                        </div>
                        <span style={{ fontSize:'11px', color:'#9ca3af', textAlign:'center', maxWidth:'100px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {waste.seller?.name || 'No Image'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize:'1.3rem', fontWeight:800, color:'#064e3b', marginBottom:'6px', display:'flex', alignItems:'center', gap:'8px' }}>
                      {waste.seller?.name || 'Unknown Seller'}
                      {waste.seller?.verified && <CheckCircle size={18} color="#059669" fill="#059669"/>}
                    </div>
                    <div style={{ fontSize:'0.9rem', color:'#6b7280', marginBottom:'8px' }}>⭐ {waste.seller?.rating || '0'} • {waste.seller?.totalSales || 0} transactions • Since {waste.seller?.joined || '2024'}</div>
                  </div>
                </div>

                {/* Direct text data - basic information only */}
                <div style={{ lineHeight:'2', fontSize:'0.95rem', color:'#374151' }}>
                  {waste.seller?.location && <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}><MapPin size={18} color="#059669" strokeWidth={2.5}/> <strong>Location:</strong> {waste.seller.location}</div>}
                  {waste.seller?.registrationNumber && <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}><Building size={18} color="#059669" strokeWidth={2.5}/> <strong>Registration:</strong> {waste.seller.registrationNumber}</div>}
                  {waste.seller?.taxNumber && <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}><Tag size={18} color="#059669" strokeWidth={2.5}/> <strong>Tax Number:</strong> {waste.seller.taxNumber}</div>}
                  {waste.seller?.joined && <div style={{ display:'flex', alignItems:'center', gap:'8px' }}><Calendar size={18} color="#059669" strokeWidth={2.5}/> <strong>Established:</strong> {waste.seller.joined}</div>}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:'18px', position:'sticky', top:'80px' }}>
          {/* Purchase Card */}
          <div style={{ background:'#fff', borderRadius:'24px', overflow:'hidden', boxShadow:'0 4px 40px rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.1)' }}>
            <div style={{ background:'linear-gradient(135deg,#047857,#059669,#10b981)', padding:'24px', color:'#fff' }}>
              <div style={{ fontSize:'0.74rem', opacity:0.8, marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.08em' }}>Price per Unit</div>
              <div style={{ fontSize:'2.4rem', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1 }}>{Number(waste.price).toLocaleString()}</div>
              <div style={{ fontSize:'0.88rem', opacity:0.85, marginTop:'6px' }}>EGP per {waste.unit}</div>
              <div style={{ marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.25)', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.82rem', opacity:0.9 }}>
                <span>Total ({waste.amount} {waste.unit})</span>
                <span style={{ fontSize:'1.2rem', fontWeight:800 }}>{total.toLocaleString()} EGP</span>
              </div>
            </div>
            <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
              {waste.recyclabilityType === 'DirectUse' ? (
                <button onClick={() => navigate(`/place-order/${waste.id}`, { state: { orderType: 'directUsage' } })}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(99,102,241,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 20px rgba(99,102,241,0.35)'; }}
                  style={{ width:'100%', padding:'15px', background:'linear-gradient(135deg,#4f46e5,#6366f1)', color:'#fff', border:'none', borderRadius:'14px', fontWeight:800, fontSize:'1.05rem', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 6px 20px rgba(99,102,241,0.35)', transition:'transform 0.15s, box-shadow 0.15s' }}>
                  <ShoppingCart size={20}/> Buy for Direct Use
                </button>
              ) : (
                <>
                  <button onClick={() => navigate(`/place-order/${waste.id}`, { state: { orderType: 'directUsage' } })}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(16,185,129,0.45)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 20px rgba(16,185,129,0.35)'; }}
                    style={{ width:'100%', padding:'15px', background:'linear-gradient(135deg,#059669,#10b981)', color:'#fff', border:'none', borderRadius:'14px', fontWeight:800, fontSize:'1.05rem', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 6px 20px rgba(16,185,129,0.35)', transition:'transform 0.15s, box-shadow 0.15s' }}>
                    <ShoppingCart size={20}/> Buy for Direct Use
                  </button>
                  <button onClick={() => navigate(`/recycler-selection/${waste.id}`, { state: { waste } })}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(220,38,38,0.45)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 20px rgba(220,38,38,0.35)'; }}
                    style={{ width:'100%', padding:'15px', background:'linear-gradient(135deg,#dc2626,#ef4444)', color:'#fff', border:'none', borderRadius:'14px', fontWeight:800, fontSize:'1.05rem', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 6px 20px rgba(220,38,38,0.35)', transition:'transform 0.15s, box-shadow 0.15s' }}>
                    <RefreshCw size={20}/> Buy & Send for Recycling
                  </button>
                </>
              )}

            </div>
            <div style={{ padding:'0 20px 20px', display:'flex', gap:'10px' }}>
              {[
                { label:isLiked?'Saved':'Save', icon:<Heart size={15} fill={isLiked?'#ef4444':'none'} color={isLiked?'#ef4444':'#6b7280'}/>, active:isLiked, fn:()=>setIsLiked(!isLiked) },
                { label:'Share', icon:<Share2 size={15}/>, active:false, fn:()=>{} },
              ].map((b,i) => (
                <button key={i} onClick={b.fn} style={{ flex:1, padding:'11px', background:b.active?'#fee2e2':'#f9fafb', color:b.active?'#ef4444':'#6b7280', border:`1.5px solid ${b.active?'#fca5a5':'#e5e7eb'}`, borderRadius:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', fontWeight:600, fontSize:'0.82rem', fontFamily:'inherit', transition:'all 0.2s' }}>
                  {b.icon}{b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius:'20px', padding:'20px', border:'1.5px solid rgba(59,130,246,0.2)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.9rem', fontWeight:800, color:'#1e40af', marginBottom:'14px' }}><AlertCircle size={15} color="#1e40af"/> Safety Tips</div>
            {['Do not pay outside the platform','Verify seller identity before transaction','Use secure payment methods','Ensure goods inspection before purchase'].map((tip,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'8px', fontSize:'0.81rem', color:'#1d4ed8', marginBottom:'8px', lineHeight:1.5 }}>
                <CheckCircle size={12} color="#3b82f6" style={{ flexShrink:0, marginTop:'2px' }}/>{tip}
              </div>
            ))}
          </div>

          {/* Similar Offers */}
          {similar.length > 0 && (
            <div style={{ background:'#fff', borderRadius:'20px', padding:'20px', boxShadow:'0 2px 20px rgba(0,0,0,0.05)', border:'1px solid rgba(16,185,129,0.1)' }}>
              <div style={{ fontSize:'0.93rem', fontWeight:800, color:'#064e3b', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}><TrendingUp size={15} color="#059669"/> Similar Offers</div>
              {similar.map((item,i) => {
                const thumb = (item.images?.[0]) || item.image;
                return (
                  <div key={item.id} onClick={() => navigate(`/waste-details/${item.id}`)}
                    onMouseEnter={() => setHovered(`s${i}`)} onMouseLeave={() => setHovered(null)}
                    style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'12px', cursor:'pointer', background:hovered===`s${i}`?'#f8fffe':'transparent', transition:'background 0.15s', marginBottom:'4px' }}>
                    {thumb ? (
                      <img src={thumb} alt={item.titleEn || item.titleAr} style={{ width:'44px', height:'44px', borderRadius:'10px', objectFit:'cover', border:'1px solid rgba(16,185,129,0.15)', flexShrink:0 }} onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:'#f3f4f6', flexShrink:0 }} />
                    )}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.83rem', fontWeight:700, color:'#374151', marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.titleEn || item.titleAr}</div>
                      <div style={{ fontSize:'0.73rem', color:'#9ca3af' }}>{item.weightAr} • {item.locEn || item.locAr}</div>
                    </div>
                    <div style={{ textAlign:'left', flexShrink:0 }}>
                      <div style={{ fontSize:'0.93rem', fontWeight:800, color:'#059669' }}>{Number(item.price).toLocaleString()} EGP</div>
                      <div style={{ fontSize:'0.69rem', color:'#9ca3af' }}>{item.unitEn || item.unitAr || item.unit}</div>
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