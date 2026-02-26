import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, DollarSign, Upload, X, CheckCircle, ChevronRight,
  AlertCircle, Link as LinkIcon, Settings
} from 'lucide-react';
import { T } from './translations';
import addNewWasteImg     from '../assets/addnewWasteLight.png';
import addNewWasteDarkImg from '../assets/addNewWastedark.png';


// ─── Image compress ───────────────────────────────────────────────────────────
const compressImage = (file, maxWidth = 800, quality = 0.6) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

// ─── Translations for all static UI text ─────────────────────────────────────
const UI = {
  ar: {
    pageTitle:    'إضافة نفايات جديدة',
    pageSubtitle: 'أضف نفاياتك الصناعية للبيع في السوق',
    steps:        ['معلومات أساسية', 'السعر والموقع', 'المواصفات', 'مراجعة ونشر'],
    // Step 1
    step1Title:   'معلومات أساسية',
    adTitle:      'عنوان الإعلان',
    adTitlePH:    'مثال: بلاستيك PET نظيف',
    wasteType:    'نوع النفايات',
    quantity:     'الكمية',
    unit:         'الوحدة',
    frequency:    'التكرار',
    units:        [['ton','طن'],['kg','كجم'],['liter','لتر'],['piece','قطعة']],
    frequencies:  [['daily','يومي'],['weekly','أسبوعي'],['monthly','شهري'],['quarterly','ربع سنوي']],
    // Step 2
    step2Title:   'السعر والموقع',
    price:        'السعر',
    currency:     'العملة',
    currencies:   [['egp','جنيه مصري'],['usd','دولار أمريكي'],['eur','يورو']],
    location:     'المحافظة',
    locationPH:   'اختر المحافظة',
    mapLink:      'رابط الموقع على الخريطة',
    mapLinkPH:    'https://maps.app.goo.gl/...',
    optional:     '(اختياري)',
    description:  'الوصف',
    descPH:       'أي تفاصيل إضافية...',
    images:       'الصور',
    imagesNote:   '(حتى 3 صور)',
    compressNote: '⚡ يتم ضغط الصور تلقائياً لتوفير المساحة',
    uploadBtn:    'رفع صورة',
    // Step 3
    step3Title:   'مواصفات المادة',
    step3Sub:     'اختر من الخيارات — ستظهر للمشترين في صفحة الإعلان',
    // Step 4
    step4Title:   'مراجعة الإعلان قبل النشر',
    uploadedImgs: 'الصور المرفوعة',
    basicInfo:    '📦 المعلومات الأساسية',
    techSpecs:    '⚙️ المواصفات التقنية',
    publishBtn:   '🚀 نشر الإعلان الآن',
    publishing:   'جاري النشر...',
    // Nav
    next:         'التالي',
    prev:         'السابق',
    // Review fields
    reviewTitle:    'العنوان',
    reviewType:     'النوع',
    reviewQty:      'الكمية',
    reviewFreq:     'التكرار',
    reviewPrice:    'السعر',
    reviewLocation: 'المحافظة',
    // Tips
    tipsTitle:  'نصائح لنشر إعلان ناجح',
    // Spec options
    specs: {
      color:     { label: 'لون المادة',           options: ['أبيض','أسود','رمادي','بني','أصفر','أحمر','أزرق','أخضر','شفاف','متنوع / مختلط'] },
      condition: { label: 'حالة المادة',           options: ['نظيفة تماماً','نظيفة مع شوائب بسيطة','مختلطة','تحتاج فرز','ملوثة جزئياً'] },
      purity:    { label: 'درجة النقاوة / الجودة', options: ['+95% نقي','85–95%','70–85%','أقل من 70%','غير محددة'] },
      packaging: { label: 'طريقة التغليف',         options: ['بالات مضغوطة','براميل / طبليات','أكياس كبيرة (جامبو)','كراتين','سائب بدون تغليف','لفات / بكرات'] },
      storage:   { label: 'طريقة التخزين',         options: ['مخزن مغطى وجاف','في الهواء الطلق','مبرد / مجمد','خزان سائل','رف مكشوف'] },
    },
    required: 'هذا الحقل مطلوب',
  },
  en: {
    pageTitle:    'Add New Waste',
    pageSubtitle: 'List your industrial waste for sale in the marketplace',
    steps:        ['Basic Info', 'Price & Location', 'Specifications', 'Review & Publish'],
    // Step 1
    step1Title:   'Basic Information',
    adTitle:      'Listing Title',
    adTitlePH:    'e.g. Clean PET Plastic',
    wasteType:    'Waste Type',
    quantity:     'Quantity',
    unit:         'Unit',
    frequency:    'Frequency',
    units:        [['ton','Ton'],['kg','Kilogram'],['liter','Liter'],['piece','Piece']],
    frequencies:  [['daily','Daily'],['weekly','Weekly'],['monthly','Monthly'],['quarterly','Quarterly']],
    // Step 2
    step2Title:   'Price & Location',
    price:        'Price',
    currency:     'Currency',
    currencies:   [['egp','Egyptian Pound'],['usd','US Dollar'],['eur','Euro']],
    location:     'Governorate',
    locationPH:   'Select Governorate',
    mapLink:      'Map Location Link',
    mapLinkPH:    'https://maps.app.goo.gl/...',
    optional:     '(optional)',
    description:  'Description',
    descPH:       'Any additional details...',
    images:       'Images',
    imagesNote:   '(up to 3 images)',
    compressNote: '⚡ Images are automatically compressed to save storage',
    uploadBtn:    'Upload Image',
    // Step 3
    step3Title:   'Material Specifications',
    step3Sub:     'Select options — these will be shown to buyers on the listing page',
    // Step 4
    step4Title:   'Review Before Publishing',
    uploadedImgs: 'Uploaded Images',
    basicInfo:    '📦 Basic Information',
    techSpecs:    '⚙️ Technical Specifications',
    publishBtn:   '🚀 Publish Listing Now',
    publishing:   'Publishing...',
    // Nav
    next:         'Next',
    prev:         'Previous',
    // Review fields
    reviewTitle:    'Title',
    reviewType:     'Type',
    reviewQty:      'Quantity',
    reviewFreq:     'Frequency',
    reviewPrice:    'Price',
    reviewLocation: 'Location',
    // Tips
    tipsTitle:  'Tips for a Successful Listing',
    // Spec options
    specs: {
      color:     { label: 'Material Color',   options: ['White','Black','Gray','Brown','Yellow','Red','Blue','Green','Transparent','Mixed'] },
      condition: { label: 'Material Condition', options: ['Completely Clean','Clean with Minor Impurities','Mixed','Needs Sorting','Partially Contaminated'] },
      purity:    { label: 'Purity / Quality',  options: ['95%+ Pure','85–95%','70–85%','Below 70%','Unspecified'] },
      packaging: { label: 'Packaging Method',  options: ['Compressed Bales','Barrels / Pallets','Large Bags (Jumbo)','Cartons','Loose / Unpacked','Rolls'] },
      storage:   { label: 'Storage Method',    options: ['Covered & Dry Warehouse','Outdoor','Refrigerated / Frozen','Liquid Tank','Open Shelf'] },
    },
    required: 'This field is required',
  },
};

// ─── OptionSelector ───────────────────────────────────────────────────────────
const OptionSelector = ({ label, options, value, onChange, error, isRTL, accent, border, text }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label style={{ display:'block', fontWeight:300, marginBottom:'0.1rem', fontSize:'1.5rem', textAlign: isRTL ? 'right' : 'left' }}>
      {label} *
    </label>
    <div style={{ display:'flex', flexWrap:'wrap', gap:'1.9rem', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)} style={{
          padding:'0.48rem 0.85rem', borderRadius:'1999px',
          border:`2.5px solid ${value===opt ? accent : border}`,
          background: value===opt ? accent : 'transparent',
          color: value===opt ? '#fff' : text,
          fontWeight:400, fontSize:'1.1rem', cursor:'pointer',
          transition:'all 0.15s', fontFamily: isRTL ? "'Cairo',sans-serif" : "'Inter',sans-serif",
        }}>{opt}</button>
      ))}
    </div>
    {error && <p style={{ color:'#ef4444', fontSize:'0.9rem', marginTop:'-1.9rem', textAlign: isRTL ? 'right' : 'left' }}>{error}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ListWaste = ({ user, lang: propLang, dark }) => {
  const navigate  = useNavigate();
  const lang      = propLang === 'en' ? 'en' : 'ar';
  const isRTL     = lang === 'ar';
  const u         = UI[lang];                        // all UI strings
  const T_data    = T[lang];                         // wasteTypes, locations, tips
  const wasteTypes = T_data.wasteTypes;
  const locations  = T_data.locations;
  const tips       = [T_data.listWaste?.tip1, T_data.listWaste?.tip2, T_data.listWaste?.tip3, T_data.listWaste?.tip4];

  const [step, setStep]      = useState(1);
  const [form, setForm]      = useState({
    title:'', wasteType:'', amount:'', unit:'ton', frequency:'monthly',
    price:'', currency:'egp', location:'', locationLink:'', description:'',
    images:[], color:'', condition:'', purity:'', packaging:'', storage:'',
  });
  const [errors, setErrors]  = useState({});
  const [submitting, setSub] = useState(false);

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + form.images.length > 3) { alert(isRTL ? 'الحد الأقصى 3 صور' : 'Maximum 3 images'); return; }
    for (const f of files) {
      try { const c = await compressImage(f); setForm(p => ({ ...p, images:[...p.images, c] })); }
      catch { alert(isRTL ? 'خطأ في رفع الصورة' : 'Error uploading image'); }
    }
  };
  const removeImg = (i) => setForm(p => ({ ...p, images: p.images.filter((_,idx) => idx !== i) }));

  const validate = (s) => {
    const e = {};
    if (s===1) {
      if(!form.title)     e.title     = u.required;
      if(!form.wasteType) e.wasteType = u.required;
      if(!form.amount)    e.amount    = u.required;
    }
    if (s===2) {
      if(!form.price)    e.price    = u.required;
      if(!form.location) e.location = u.required;
    }
    if (s===3) {
      Object.keys(u.specs).forEach(k => { if(!form[k]) e[k] = u.required; });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const next = () => { if(validate(step)) setStep(s => s+1); };
  const back = () => { if(step > 1) setStep(s => s-1); };

  const submit = () => {
    if(submitting) return; setSub(true);
    try {
      if(!user) { alert(isRTL ? 'يجب تسجيل الدخول أولاً' : 'Please log in first'); setSub(false); return; }
      const listing = {
        id: Date.now(),
        titleAr: form.title, titleEn: form.title,
        category: form.wasteType,
        companyAr: user?.factoryName || 'مصنع غير معروف',
        companyEn: user?.factoryName || 'Unknown Factory',
        locAr: form.location, locEn: form.location,
        price: parseFloat(form.price), unit: form.unit, unitAr: form.unit, unitEn: form.unit,
        amount: parseFloat(form.amount),
        weightAr: `${form.amount} ${form.unit}`, weightEn: `${form.amount} ${form.unit}`,
        frequency: form.frequency, currency: form.currency,
        date: new Date().toISOString().split('T')[0],
        views:0, offers:0, status:'نشط', rating:5.0, reviews:0,
        descAr: form.description || 'لا يوجد وصف',
        descEn: form.description || 'No description',
        badge:'new', image: form.images[0]||null, images: form.images,
        lat:null, lng:null, locationLink: form.locationLink,
        specifications: {
          material: wasteTypes[form.wasteType] || form.wasteType,
          color: form.color, condition: form.condition, purity: form.purity,
          packaging: form.packaging, storage: form.storage, address: form.location,
        },
        seller: {
          name: user?.factoryName || 'مصنع غير معروف',
          verified: user?.verified || false, rating:5.0, totalSales:0,
          joined: new Date().getFullYear().toString(), whatsapp: user?.phone || '',
        },
      };
      try {
        const ex = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
        localStorage.setItem('ecov_listings', JSON.stringify([listing, ...ex]));
      } catch(err) {
        if(err.name==='QuotaExceededError' || err.code===22) {
          const ex = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
          const slim = [listing, ...ex].slice(0,5).map((it,i) => i===0 ? it : {...it, images:[], image:null});
          localStorage.setItem('ecov_listings', JSON.stringify(slim));
        } else throw err;
      }
      setTimeout(() => navigate('/my-listings'), 100);
    } catch(err) { console.error(err); alert('Error: ' + err.message); setSub(false); }
  };

  // ── Theme ─────────────────────────────────────────────────────────────────
  const accent   = '#00e676';
  const bg       = dark ? '#0f1a12' : '#ffffff';
  const cardBg   = dark ? '#0f1a12' : '#ffffff';
  const text      = dark ? '#d4f7dc' : '#1a2e1a';
  const border    = dark ? '#1a3320' : '#e0e7e0';
  const inputBg   = dark ? '#152018' : '#f9fafb';
  const mutedTxt  = dark ? '#4d7a5a' : '#94a3b8';
  const subtleBg  = dark ? '#152018' : '#f8faf8';
  const fontFam   = isRTL ? "'Cairo',sans-serif" : "'Inter','Segoe UI',sans-serif";

  // Stepper — RTL shows 4→3→2→1, LTR shows 1→2→3→4
  const stepsDisplay = isRTL ? [...u.steps].reverse() : u.steps;
  const stepsNums    = isRTL ? [4,3,2,1] : [1,2,3,4];

  const inp = (extra={}) => ({
    width:'100%', padding:'0.7rem 0.9rem', background:inputBg,
    border:`1.5px solid ${border}`, borderRadius:'10px', color:text,
    fontSize:'0.9rem', boxSizing:'border-box', fontFamily:fontFam,
    outline:'none', textAlign: isRTL ? 'right' : 'left',
    direction: isRTL ? 'rtl' : 'ltr', ...extra,
  });
  const lbl = {
    display:'block', fontWeight:700, marginBottom:'0.4rem',
    fontSize:'0.9rem', textAlign: isRTL ? 'right' : 'left',
  };
  const rowJustify = isRTL ? 'flex-end' : 'flex-start';

  const fld = (k, v) => (
    <div style={{ marginBottom:'0.3rem', textAlign: isRTL ? 'right' : 'left' }}>
      <span style={{ fontWeight:600, color:mutedTxt, fontSize:'0.8rem' }}>{k}: </span>
      <span style={{ fontWeight:700, fontSize:'0.88rem' }}>{v || '—'}</span>
    </div>
  );

  const showSplit = step !== 4;

  // Unit label helper
  const unitLabel = (val) => (u.units.find(([v]) => v===val)||[])[1] || val;
  const freqLabel = (val) => (u.frequencies.find(([v]) => v===val)||[])[1] || val;
  const currLabel = (val) => (u.currencies.find(([v]) => v===val)||[])[1] || val;

  return (
    <div style={{ minHeight:'100vh', background:bg, color:text, fontFamily:fontFam, direction: isRTL ? 'rtl' : 'ltr' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ padding:'1rem 2rem 1rem', maxWidth:'1400px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <h1 style={{ fontSize:'1.9rem', fontWeight:900, color:accent, marginBottom:'0.3rem' }}>
            {u.pageTitle}
          </h1>
          <p style={{ color:mutedTxt, fontSize:'0.92rem' }}>{u.pageSubtitle}</p>
        </div>

        {/* Stepper */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'center', gap:40, marginBottom:'0.5rem' }}>
          {stepsNums.map((n,i) => {
            const filled = n <= step;
            const active = n === step;
            return (
              <React.Fragment key={n}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', minWidth:'98px' }}>
                  <div style={{
                    width:'50px', height:'50px', borderRadius:'50%',
                    background: filled ? accent : (dark?'#1e3320':'#e2e8f0'),
                    color: filled ? '#fff' : mutedTxt,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:800, fontSize:'0.95rem',
                    boxShadow: active ? `0 0 0 5px ${accent}28` : 'none',
                    transition:'all 0.3s',
                  }}>
                    {filled && n < step ? <CheckCircle size={17}/> : n}
                  </div>
                  <span style={{ fontSize:'0.67rem', fontWeight:700, textAlign:'center', color: filled ? accent : mutedTxt }}>
                    {stepsDisplay[i]}
                  </span>
                </div>
                {i < 3 && (
                  <div style={{ width:'64px', height:'4px', marginTop:'20px', borderRadius:'2px',
                    background: filled && n < step ? accent : (dark?'#1e3320':'#e2e8f0'), transition:'background 0.7s',
                  }}/>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── SPLIT LAYOUT ──────────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showSplit ? '26fr 45fr' : '10fr',
        minHeight: 'calc(200vh - 410px)',
        gap: 0.1,
      }}>

        {/* ══ LEFT COLUMN — Sticky Illustration ══ */}
        {showSplit && (
          <div style={{
            position: 'relative',           /* needed for sticky child */
            borderRight: isRTL ? 'none' : `px solid ${border}`,
            background: dark ? '#0f1a12' : '#ffffff',
          }}>
            {/* sticky wrapper — تثبت الصورة وما تتأثرش بطول الفورم */}
            <div style={{
              position: 'sticky',
              top: '1px',                  /* ارتفاع النافبار — عدّله حسب مشروعك */
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.0rem 1rem 2rem',
            }}>
              <img
                src={dark ? addNewWasteDarkImg : addNewWasteImg}
                alt="Add New Waste"
                style={{
                  width: '100%',
                  maxWidth: '980px',
                  height: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'top',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  display: 'block',
                }}
              />
            </div>
          </div>
        )}

        {/* ══ RIGHT COLUMN — Form ══ */}
        <div style={{
          background: cardBg,
          display: '',
          flexDirection: 'column',
          padding: '0.1rem 1rem 1.1rem',
        }}>

          {/* ── Step 1: Basic Info ── */}
          {step === 1 && (
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:'1.15rem', fontWeight:800, marginBottom:'1.4rem', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:rowJustify }}>
                {isRTL ? <>{u.step1Title} <Package color={accent} size={39}/></> : <><Package color={accent} size={19}/> {u.step1Title}</>}
              </h2>

              {/* Title */}
              <div style={{ marginBottom:'1.2rem' }}>
                <label style={lbl}>{u.adTitle} *</label>
                <input type="text" value={form.title} onChange={e=>upd('title',e.target.value)}
                  placeholder={u.adTitlePH}
                  style={inp({ borderColor: errors.title?'#ef4444':border })}
                />
                {errors.title && <p style={{ color:'#ef4444', fontSize:'0.8rem', marginTop:'0.2rem', textAlign: isRTL?'right':'left' }}>{errors.title}</p>}
              </div>

              {/* Waste Type */}
              <div style={{ marginBottom:'1.2rem' }}>
                <label style={lbl}>{u.wasteType} *</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.45rem', justifyContent:rowJustify }}>
                  {Object.entries(wasteTypes).map(([key,val]) => (
                    <button key={key} type="button" onClick={()=>upd('wasteType',key)} style={{
                      padding:'0.45rem 1rem', borderRadius:'8px',
                      border:`1.5px solid ${form.wasteType===key ? accent : border}`,
                      background: form.wasteType===key ? accent : 'transparent',
                      color: form.wasteType===key ? '#fff' : text,
                      fontWeight:600, fontSize:'0.86rem', cursor:'pointer',
                      transition:'all 0.16s', fontFamily:fontFam,
                    }}>{val}</button>
                  ))}
                </div>
                {errors.wasteType && <p style={{ color:'#ef4444', fontSize:'0.8rem', marginTop:'0.2rem', textAlign: isRTL?'right':'left' }}>{errors.wasteType}</p>}
              </div>

              {/* Qty / Unit / Freq — RTL: التكرار | الوحدة | الكمية  |  LTR: Qty | Unit | Freq */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.9rem' }}>
                {isRTL ? (
                  <>
                    <div>
                      <label style={lbl}>{u.frequency}</label>
                      <select value={form.frequency} onChange={e=>upd('frequency',e.target.value)} style={inp()}>
                        {u.frequencies.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>{u.unit}</label>
                      <select value={form.unit} onChange={e=>upd('unit',e.target.value)} style={inp()}>
                        {u.units.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>{u.quantity} *</label>
                      <input type="number" value={form.amount} onChange={e=>upd('amount',e.target.value)}
                        style={inp({ borderColor: errors.amount?'#ef4444':border })}/>
                      {errors.amount && <p style={{ color:'#ef4444', fontSize:'0.8rem', marginTop:'0.2rem', textAlign:'right' }}>{errors.amount}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label style={lbl}>{u.quantity} *</label>
                      <input type="number" value={form.amount} onChange={e=>upd('amount',e.target.value)}
                        style={inp({ borderColor: errors.amount?'#ef4444':border })}/>
                      {errors.amount && <p style={{ color:'#ef4444', fontSize:'0.8rem', marginTop:'0.2rem' }}>{errors.amount}</p>}
                    </div>
                    <div>
                      <label style={lbl}>{u.unit}</label>
                      <select value={form.unit} onChange={e=>upd('unit',e.target.value)} style={inp()}>
                        {u.units.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>{u.frequency}</label>
                      <select value={form.frequency} onChange={e=>upd('frequency',e.target.value)} style={inp()}>
                        {u.frequencies.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: Price & Location ── */}
          {step === 2 && (
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:'1.15rem', fontWeight:800, marginBottom:'1.4rem', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:rowJustify }}>
                {isRTL ? <>{u.step2Title} <DollarSign color={accent} size={19}/></> : <><DollarSign color={accent} size={19}/> {u.step2Title}</>}
              </h2>

              <div style={{ display:'grid', gridTemplateColumns: isRTL ? '1fr 2fr' : '2fr 1fr', gap:'0.9rem', marginBottom:'1.2rem' }}>
                {isRTL ? (
                  <>
                    <div>
                      <label style={lbl}>{u.currency}</label>
                      <select value={form.currency} onChange={e=>upd('currency',e.target.value)} style={inp()}>
                        {u.currencies.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>{u.price} *</label>
                      <input type="number" value={form.price} onChange={e=>upd('price',e.target.value)}
                        style={inp({ borderColor: errors.price?'#ef4444':border })}/>
                      {errors.price && <p style={{ color:'#ef4444', fontSize:'0.8rem', marginTop:'0.2rem', textAlign:'right' }}>{errors.price}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label style={lbl}>{u.price} *</label>
                      <input type="number" value={form.price} onChange={e=>upd('price',e.target.value)}
                        style={inp({ borderColor: errors.price?'#ef4444':border })}/>
                      {errors.price && <p style={{ color:'#ef4444', fontSize:'0.8rem', marginTop:'0.2rem' }}>{errors.price}</p>}
                    </div>
                    <div>
                      <label style={lbl}>{u.currency}</label>
                      <select value={form.currency} onChange={e=>upd('currency',e.target.value)} style={inp()}>
                        {u.currencies.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginBottom:'1.2rem' }}>
                <label style={lbl}>{u.location} *</label>
                <select value={form.location} onChange={e=>upd('location',e.target.value)}
                  style={inp({ borderColor: errors.location?'#ef4444':border })}>
                  <option value="">{u.locationPH}</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.location && <p style={{ color:'#ef4444', fontSize:'0.8rem', marginTop:'0.2rem', textAlign: isRTL?'right':'left' }}>{errors.location}</p>}
              </div>

              <div style={{ marginBottom:'1.2rem' }}>
                <label style={lbl}>{u.mapLink} <span style={{ fontWeight:400, color:mutedTxt }}>{u.optional}</span></label>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexDirection: isRTL ? 'row' : 'row' }}>
                  <input type="url" value={form.locationLink} onChange={e=>upd('locationLink',e.target.value)}
                    placeholder={u.mapLinkPH} style={inp()}/>
                  <LinkIcon size={17} color={mutedTxt} style={{ flexShrink:0 }}/>
                </div>
              </div>

              <div style={{ marginBottom:'1.2rem' }}>
                <label style={lbl}>{u.description} <span style={{ fontWeight:400, color:mutedTxt }}>{u.optional}</span></label>
                <textarea rows={3} value={form.description} onChange={e=>upd('description',e.target.value)}
                  placeholder={u.descPH} style={inp({ resize:'vertical' })}/>
              </div>

              <div>
                <label style={lbl}>{u.images} <span style={{ fontWeight:400, color:mutedTxt }}>{u.imagesNote}</span></label>
                <p style={{ fontSize:'0.76rem', color:mutedTxt, marginBottom:'0.6rem', textAlign: isRTL?'right':'left' }}>{u.compressNote}</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(88px,1fr))', gap:'0.6rem' }}>
                  {form.images.map((p,i) => (
                    <div key={i} style={{ position:'relative' }}>
                      <img src={p} alt="" style={{ width:'100%', height:'88px', objectFit:'cover', borderRadius:'10px', border:`2px solid ${border}` }}/>
                      <button onClick={()=>removeImg(i)} style={{ position:'absolute', top:'-7px', [isRTL?'left':'right']:'-7px', background:'#ef4444', border:'none', borderRadius:'50%', width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
                        <X size={12}/>
                      </button>
                    </div>
                  ))}
                  {form.images.length < 3 && (
                    <label style={{ border:`2px dashed ${border}`, borderRadius:'10px', height:'88px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', color:mutedTxt, gap:'4px' }}>
                      <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display:'none' }}/>
                      <Upload size={20}/><span style={{ fontSize:'0.72rem' }}>{u.uploadBtn}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Specifications ── */}
          {step === 3 && (
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:'1.15rem', fontWeight:800, marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:rowJustify }}>
                {isRTL ? <>{u.step3Title} <Settings color={accent} size={19}/></> : <><Settings color={accent} size={19}/> {u.step3Title}</>}
              </h2>
              <p style={{ color:mutedTxt, marginBottom:'1.3rem', fontSize:'0.85rem', textAlign: isRTL?'right':'left' }}>
                {u.step3Sub}
              </p>
              {Object.entries(u.specs).map(([key,{label,options}]) => (
                <OptionSelector key={key} label={label} options={options} value={form[key]}
                  onChange={v=>upd(key,v)} error={errors[key]}
                  isRTL={isRTL} accent={accent} border={border} text={text}
                />
              ))}
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:'1.15rem', fontWeight:800, marginBottom:'1.4rem', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:rowJustify }}>
                {isRTL ? <>{u.step4Title} <CheckCircle color={accent} size={19}/></> : <><CheckCircle color={accent} size={19}/> {u.step4Title}</>}
              </h2>

              {form.images.length > 0 && (
                <div style={{ marginBottom:'1.2rem' }}>
                  <p style={{ fontWeight:700, marginBottom:'0.5rem', fontSize:'0.88rem', textAlign: isRTL?'right':'left' }}>{u.uploadedImgs}</p>
                  <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:rowJustify }}>
                    {form.images.map((img,i) => <img key={i} src={img} alt="" style={{ width:'72px', height:'72px', objectFit:'cover', borderRadius:'10px', border:`2px solid ${border}` }}/>)}
                  </div>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
                <div style={{ background:subtleBg, borderRadius:'14px', padding:'1rem', border:`1px solid ${border}` }}>
                  <p style={{ fontWeight:800, color:accent, marginBottom:'0.7rem', fontSize:'0.85rem', textAlign: isRTL?'right':'left' }}>{u.basicInfo}</p>
                  {fld(u.reviewTitle,    form.title)}
                  {fld(u.reviewType,     wasteTypes[form.wasteType])}
                  {fld(u.reviewQty,      `${form.amount} ${unitLabel(form.unit)}`)}
                  {fld(u.reviewFreq,     freqLabel(form.frequency))}
                  {fld(u.reviewPrice,    `${form.price} ${currLabel(form.currency)}`)}
                  {fld(u.reviewLocation, form.location)}
                </div>
                <div style={{ background:subtleBg, borderRadius:'14px', padding:'1rem', border:`1px solid ${border}` }}>
                  <p style={{ fontWeight:800, color:accent, marginBottom:'0.7rem', fontSize:'0.85rem', textAlign: isRTL?'right':'left' }}>{u.techSpecs}</p>
                  {Object.entries(u.specs).map(([k,{label}]) => fld(label, form[k]))}
                </div>
              </div>

              <button onClick={submit} disabled={submitting} style={{
                width:'100%', padding:'1rem', background:accent, color:'#fff', border:'none',
                borderRadius:'12px', fontWeight:800, fontSize:'1.05rem',
                cursor:submitting?'wait':'pointer', opacity:submitting?0.7:1, fontFamily:fontFam,
              }}>
                {submitting ? u.publishing : u.publishBtn}
              </button>
            </div>
          )}

          {/* ── Navigation ── */}
          {step < 4 && (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1.75rem', paddingTop:'1.25rem', borderTop:`1px solid ${border}` }}>
              {/* Next btn — left in RTL, right in LTR */}
              {isRTL ? (
                <>
                  <button onClick={next} style={{ padding:'0.7rem 2rem', background:accent, border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:fontFam, fontSize:'0.95rem' }}>
                    <ChevronRight size={16}/> {u.next} ←
                  </button>
                  <button onClick={back} disabled={step===1} style={{ padding:'0.7rem 1.6rem', background:'transparent', border:`1.5px solid ${border}`, borderRadius:'10px', color:step===1?mutedTxt:text, fontWeight:600, cursor:step===1?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:fontFam, fontSize:'0.95rem' }}>
                    → {u.prev}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={back} disabled={step===1} style={{ padding:'0.7rem 1.6rem', background:'transparent', border:`1.5px solid ${border}`, borderRadius:'10px', color:step===1?mutedTxt:text, fontWeight:600, cursor:step===1?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:fontFam, fontSize:'0.95rem' }}>
                    ← {u.prev}
                  </button>
                  <button onClick={next} style={{ padding:'0.7rem 2rem', background:accent, border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:fontFam, fontSize:'0.95rem' }}>
                    {u.next} → <ChevronRight size={16}/>
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── Tips ── */}
          <div style={{ marginTop:'1.5rem', background:dark?'#152018':subtleBg, borderRadius:'14px', padding:'1.1rem', border:`1px solid ${border}` }}>
            <h3 style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.9rem', fontWeight:800, marginBottom:'0.8rem', color:dark?'#6ee7b7':text, justifyContent:rowJustify }}>
              {isRTL ? <>{u.tipsTitle} <AlertCircle size={15} color={accent}/></> : <><AlertCircle size={15} color={accent}/> {u.tipsTitle}</>}
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.45rem' }}>
              {tips.filter(Boolean).map((tip,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.4rem', fontSize:'0.8rem', justifyContent:rowJustify, textAlign: isRTL?'right':'left', flexDirection: isRTL ? 'row' : 'row' }}>
                  {isRTL ? (<><span>{tip}</span><CheckCircle size={13} color={accent} style={{ marginTop:'2px', flexShrink:0 }}/></>) : (<><CheckCircle size={13} color={accent} style={{ marginTop:'2px', flexShrink:0 }}/><span>{tip}</span></>)}
                </div>
              ))}
            </div>
          </div>

        </div>{/* /form col */}
      </div>{/* /grid */}
    </div>
  );
};

export default ListWaste;