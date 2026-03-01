// ListWaste.js - Complete file with proper image upload
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, DollarSign, Upload, X, CheckCircle, ChevronRight,
  AlertCircle, Link as LinkIcon, Settings, Shield, Loader
} from 'lucide-react';
import { T } from './translations';
import addNewWasteImg from '../assets/addnewWasteLight.png';
import addNewWasteDarkImg from '../assets/addNewWastedark.png';

// ─── API Base URL ────────────────────────────────────────────────────────────
const API_BASE_URL = 'https://localhost:54464/api';

// ─── Helper Functions ────────────────────────────────────────────────────────
const compressImage = (file, maxWidth = 800, quality = 0.6) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        
        // Get compressed image as blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── Translations ────────────────────────────────────────────────────────────
const UI = {
  ar: {
    pageTitle: 'إضافة نفايات جديدة',
    pageSubtitle: 'أضف نفاياتك الصناعية للبيع في السوق',
    steps: ['معلومات أساسية', 'السعر والموقع', 'المواصفات', 'مراجعة ونشر'],
    step1Title: 'معلومات أساسية',
    adTitle: 'عنوان الإعلان',
    adTitlePH: 'مثال: بلاستيك PET نظيف',
    wasteType: 'نوع النفايات',
    quantity: 'الكمية',
    unit: 'الوحدة',
    frequency: 'التكرار',
    units: [['ton', 'طن'], ['kg', 'كجم'], ['liter', 'لتر'], ['piece', 'قطعة']],
    frequencies: [['daily', 'يومي'], ['weekly', 'أسبوعي'], ['monthly', 'شهري'], ['quarterly', 'ربع سنوي']],
    step2Title: 'السعر والموقع',
    price: 'السعر',
    currency: 'العملة',
    currencies: [['egp', 'جنيه مصري'], ['usd', 'دولار أمريكي'], ['eur', 'يورو']],
    location: 'المحافظة',
    locationPH: 'اختر المحافظة',
    mapLink: 'رابط الموقع على الخريطة',
    mapLinkPH: 'https://maps.app.goo.gl/...',
    optional: '(اختياري)',
    description: 'الوصف',
    descPH: 'أي تفاصيل إضافية...',
    images: 'الصور',
    imagesNote: '(حتى 3 صور)',
    compressNote: '⚡ يتم ضغط الصور تلقائياً',
    uploadBtn: 'رفع صورة',
    uploading: 'جاري رفع الصورة...',
    step3Title: 'مواصفات المادة',
    step3Sub: 'اختر من الخيارات — ستظهر للمشترين في صفحة الإعلان',
    step4Title: 'مراجعة الإعلان قبل النشر',
    uploadedImgs: 'الصور المرفوعة',
    basicInfo: '📦 المعلومات الأساسية',
    techSpecs: '⚙️ المواصفات التقنية',
    publishBtn: '🚀 نشر الإعلان الآن',
    publishing: 'جاري النشر...',
    next: 'التالي',
    prev: 'السابق',
    reviewTitle: 'العنوان',
    reviewType: 'النوع',
    reviewQty: 'الكمية',
    reviewFreq: 'التكرار',
    reviewPrice: 'السعر',
    reviewLocation: 'المحافظة',
    tipsTitle: 'نصائح لنشر إعلان ناجح',
    specs: {
      color: { label: 'لون المادة', options: ['أبيض', 'أسود', 'رمادي', 'بني', 'أصفر', 'أحمر', 'أزرق', 'أخضر', 'شفاف', 'متنوع / مختلط'] },
      condition: { label: 'حالة المادة', options: ['نظيفة تماماً', 'نظيفة مع شوائب بسيطة', 'مختلطة', 'تحتاج فرز', 'ملوثة جزئياً'] },
      purity: { label: 'درجة النقاوة / الجودة', options: ['+95% نقي', '85–95%', '70–85%', 'أقل من 70%', 'غير محددة'] },
      packaging: { label: 'طريقة التغليف', options: ['بالات مضغوطة', 'براميل / طبليات', 'أكياس كبيرة (جامبو)', 'كراتين', 'سائب بدون تغليف', 'لفات / بكرات'] },
      storage: { label: 'طريقة التخزين', options: ['مخزن مغطى وجاف', 'في الهواء الطلق', 'مبرد / مجمد', 'خزان سائل', 'رف مكشوف'] },
    },
    required: 'هذا الحقل مطلوب',
    success: 'تم نشر الإعلان بنجاح!',
    error: 'حدث خطأ أثناء النشر',
    loginRequired: 'يرجى تسجيل الدخول أولاً',
    verificationRequired: 'مصنعك غير موثق. يرجى التواصل مع الإدارة للتوثيق قبل نشر الإعلانات.',
    checkVerification: 'جاري التحقق من حالة التوثيق...',
    requestVerification: 'طلب توثيق المصنع',
    imageUploadError: 'فشل في رفع الصورة',
  },
  en: {
    pageTitle: 'Add New Waste',
    pageSubtitle: 'List your industrial waste for sale in the marketplace',
    steps: ['Basic Info', 'Price & Location', 'Specifications', 'Review & Publish'],
    step1Title: 'Basic Information',
    adTitle: 'Listing Title',
    adTitlePH: 'e.g. Clean PET Plastic',
    wasteType: 'Waste Type',
    quantity: 'Quantity',
    unit: 'Unit',
    frequency: 'Frequency',
    units: [['ton', 'Ton'], ['kg', 'Kilogram'], ['liter', 'Liter'], ['piece', 'Piece']],
    frequencies: [['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly'], ['quarterly', 'Quarterly']],
    step2Title: 'Price & Location',
    price: 'Price',
    currency: 'Currency',
    currencies: [['egp', 'Egyptian Pound'], ['usd', 'US Dollar'], ['eur', 'Euro']],
    location: 'Governorate',
    locationPH: 'Select Governorate',
    mapLink: 'Map Location Link',
    mapLinkPH: 'https://maps.app.goo.gl/...',
    optional: '(optional)',
    description: 'Description',
    descPH: 'Any additional details...',
    images: 'Images',
    imagesNote: '(up to 3 images)',
    compressNote: '⚡ Images are automatically compressed',
    uploadBtn: 'Upload Image',
    uploading: 'Uploading image...',
    step3Title: 'Material Specifications',
    step3Sub: 'Select options — these will be shown to buyers on the listing page',
    step4Title: 'Review Before Publishing',
    uploadedImgs: 'Uploaded Images',
    basicInfo: '📦 Basic Information',
    techSpecs: '⚙️ Technical Specifications',
    publishBtn: '🚀 Publish Listing Now',
    publishing: 'Publishing...',
    next: 'Next',
    prev: 'Previous',
    reviewTitle: 'Title',
    reviewType: 'Type',
    reviewQty: 'Quantity',
    reviewFreq: 'Frequency',
    reviewPrice: 'Price',
    reviewLocation: 'Location',
    tipsTitle: 'Tips for a Successful Listing',
    specs: {
      color: { label: 'Material Color', options: ['White', 'Black', 'Gray', 'Brown', 'Yellow', 'Red', 'Blue', 'Green', 'Transparent', 'Mixed'] },
      condition: { label: 'Material Condition', options: ['Completely Clean', 'Clean with Minor Impurities', 'Mixed', 'Needs Sorting', 'Partially Contaminated'] },
      purity: { label: 'Purity / Quality', options: ['95%+ Pure', '85–95%', '70–85%', 'Below 70%', 'Unspecified'] },
      packaging: { label: 'Packaging Method', options: ['Compressed Bales', 'Barrels / Pallets', 'Large Bags (Jumbo)', 'Cartons', 'Loose / Unpacked', 'Rolls'] },
      storage: { label: 'Storage Method', options: ['Covered & Dry Warehouse', 'Outdoor', 'Refrigerated / Frozen', 'Liquid Tank', 'Open Shelf'] },
    },
    required: 'This field is required',
    success: 'Listing published successfully!',
    error: 'Error publishing listing',
    loginRequired: 'Please log in first',
    verificationRequired: 'Your factory is not verified. Please contact admin for verification before posting listings.',
    checkVerification: 'Checking verification status...',
    requestVerification: 'Request Factory Verification',
    imageUploadError: 'Failed to upload image',
  },
};

// ─── OptionSelector Component ────────────────────────────────────────────────
const OptionSelector = ({ label, options, value, onChange, error, isRTL, accent, border, text }) => (
  <div style={{ marginBottom: '1.25rem' }} key={label}>
    <label style={{ display: 'block', fontWeight: 300, marginBottom: '0.1rem', fontSize: '1.5rem', textAlign: isRTL ? 'right' : 'left' }}>
      {label} *
    </label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)} style={{
          padding: '0.48rem 0.85rem', borderRadius: '1999px',
          border: `2.5px solid ${value === opt ? accent : border}`,
          background: value === opt ? accent : 'transparent',
          color: value === opt ? '#fff' : text,
          fontWeight: 400, fontSize: '1rem', cursor: 'pointer',
          transition: 'all 0.15s', fontFamily: isRTL ? "'Cairo',sans-serif" : "'Inter',sans-serif",
        }}>{opt}</button>
      ))}
    </div>
    {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem', textAlign: isRTL ? 'right' : 'left' }}>{error}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ListWaste = ({ user, lang: propLang, dark }) => {
  const navigate = useNavigate();
  const lang = propLang === 'en' ? 'en' : 'ar';
  const isRTL = lang === 'ar';
  const u = UI[lang];
  const T_data = T[lang];
  const wasteTypes = T_data.wasteTypes;
  const locations = T_data.locations;
  const tips = [T_data.listWaste?.tip1, T_data.listWaste?.tip2, T_data.listWaste?.tip3, T_data.listWaste?.tip4];

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', wasteType: '', amount: '', unit: 'ton', frequency: 'monthly',
    price: '', currency: 'egp', location: '', locationLink: '', description: '',
    images: [], // Will store image URLs after upload
    imageFiles: [], // Store original files for upload
    color: '', condition: '', purity: '', packaging: '', storage: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSub] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [isVerified, setIsVerified] = useState(null);
  const [checkingVerification, setCheckingVerification] = useState(true);

  // Check factory verification status on component mount
  useEffect(() => {
    const checkVerification = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setCheckingVerification(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success && data.data?.factory) {
          setIsVerified(data.data.factory.isVerified || false);
          if (!data.data.factory.isVerified) {
            setApiError(u.verificationRequired);
          }
        } else {
          setIsVerified(false);
        }
      } catch (err) {
        console.error('Error checking verification:', err);
        setIsVerified(false);
      } finally {
        setCheckingVerification(false);
      }
    };

    checkVerification();
  }, [user]);

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Handle image selection and upload
  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + form.imageFiles.length > 3) {
      alert(isRTL ? 'الحد الأقصى 3 صور' : 'Maximum 3 images');
      return;
    }

    setUploadingImages(true);
    
    for (const file of files) {
      try {
        // Compress image
        const compressedBlob = await compressImage(file);
        
        // Create form data for upload
        const formData = new FormData();
        formData.append('file', compressedBlob, file.name);
        
        // Upload to server
        const token = localStorage.getItem('token');
        const uploadResponse = await fetch(`${API_BASE_URL}/marketplace/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const uploadData = await uploadResponse.json();

        if (uploadResponse.ok && uploadData.success) {
          // Add the image URL to form
          setForm(p => ({ 
            ...p, 
            images: [...p.images, uploadData.data],
            imageFiles: [...p.imageFiles, file]
          }));
        } else {
          throw new Error(uploadData.message || u.imageUploadError);
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert(err.message || u.imageUploadError);
      }
    }
    
    setUploadingImages(false);
  };

  const removeImg = (index) => {
    setForm(p => ({ 
      ...p, 
      images: p.images.filter((_, idx) => idx !== index),
      imageFiles: p.imageFiles.filter((_, idx) => idx !== index)
    }));
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.title) e.title = u.required;
      if (!form.wasteType) e.wasteType = u.required;
      if (!form.amount) e.amount = u.required;
    }
    if (s === 2) {
      if (!form.price) e.price = u.required;
      if (!form.location) e.location = u.required;
    }
    if (s === 3) {
      Object.keys(u.specs).forEach(k => { if (!form[k]) e[k] = u.required; });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => { if (step > 1) setStep(s => s - 1); };

  const submit = async () => {
    if (submitting) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token || !user) {
      alert(isRTL ? u.loginRequired : u.loginRequired);
      navigate('/login');
      return;
    }

    // Check if factory is verified
    if (!isVerified) {
      setApiError(u.verificationRequired);
      return;
    }

    setSub(true);
    setApiError('');
    setApiSuccess('');

    try {
      // Get current year for sellerJoined
      const currentYear = new Date().getFullYear().toString();
      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      // Use the first image URL if available
      const imageUrl = form.images.length > 0 ? form.images[0] : null;
      
      // Prepare data with ALL database fields
      const listingData = {
        // Basic Info
        type: form.wasteType,
        typeEn: form.wasteType,
        amount: parseFloat(form.amount),
        unit: form.unit,
        price: parseFloat(form.price),
        
        // Factory Info
        factoryId: user?.factoryId || 0,
        factoryName: user?.factoryName || 'مصنع غير معروف',
        location: form.location,
        
        // Description and Category
        description: form.description || '',
        category: form.wasteType,
        
        // Status
        status: 'Active',
        views: 0,
        offers: 0,
        
        // Timestamps
        createdAt: now,
        updatedAt: now,
        expiresAt: expiresAt,
        
        // Multilingual Fields
        titleAr: form.title,
        titleEn: form.title,
        descriptionAr: form.description || '',
        descriptionEn: form.description || '',
        companyNameAr: user?.factoryName || 'مصنع غير معروف',
        companyNameEn: user?.factoryName || 'Unknown Factory',
        locationAr: form.location,
        locationEn: form.location,
        weightAr: `${form.amount} ${form.unit}`,
        weightEn: `${form.amount} ${form.unit}`,
        
        // Rating and Reviews
        rating: 5.0,
        reviews: 0,
        
        // Badge and Specifications
        badge: 'new',
        specifications: JSON.stringify({
          color: form.color || 'غير محدد',
          condition: form.condition || 'غير محدد',
          purity: form.purity || 'غير محدد',
          packaging: form.packaging || 'غير محدد',
          storage: form.storage || 'غير محدد'
        }),
        
        // Seller Info
        sellerRating: 5.0,
        sellerTotalSales: 0,
        sellerJoined: currentYear,
        sellerWhatsapp: user?.phone || '01000000000',
        
        // Location
        latitude: null,
        longitude: null,
        locationLink: form.locationLink || null,
        
        // Image URL (now it's a proper URL string, not base64)
        imageUrl: imageUrl
      };

      console.log('📤 Sending listing data:', JSON.stringify(listingData, null, 2));

      const response = await fetch(`${API_BASE_URL}/marketplace/waste-listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(listingData)
      });

      const data = await response.json();
      console.log('📥 API Response:', data);

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = [];
          if (Array.isArray(data.errors)) {
            errorMessages.push(...data.errors);
          } else if (typeof data.errors === 'object') {
            Object.entries(data.errors).forEach(([key, value]) => {
              errorMessages.push(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
            });
          }
          throw new Error(errorMessages.join('\n') || data.title || u.error);
        }
        throw new Error(data.message || data.title || u.error);
      }

      if (data.success) {
        setApiSuccess(u.success);

        // Save to localStorage as backup
        try {
          const localListing = {
            id: Date.now(),
            titleAr: form.title,
            titleEn: form.title,
            category: form.wasteType,
            companyAr: user?.factoryName || 'مصنع غير معروف',
            companyEn: user?.factoryName || 'Unknown Factory',
            locAr: form.location,
            locEn: form.location,
            price: parseFloat(form.price),
            unit: form.unit,
            amount: parseFloat(form.amount),
            weightAr: `${form.amount} ${form.unit}`,
            weightEn: `${form.amount} ${form.unit}`,
            frequency: form.frequency,
            currency: form.currency,
            date: new Date().toISOString().split('T')[0],
            views: 0,
            offers: 0,
            status: 'نشط',
            rating: 5.0,
            reviews: 0,
            descAr: form.description || 'لا يوجد وصف',
            descEn: form.description || 'No description',
            badge: 'new',
            image: imageUrl,
            images: form.images,
            specifications: {
              color: form.color || 'غير محدد',
              condition: form.condition || 'غير محدد',
              purity: form.purity || 'غير محدد',
              packaging: form.packaging || 'غير محدد',
              storage: form.storage || 'غير محدد'
            }
          };

          const ex = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
          localStorage.setItem('ecov_listings', JSON.stringify([localListing, ...ex]));
        } catch (localErr) {
          console.warn('Could not save to localStorage:', localErr);
        }

        // Navigate after success
        setTimeout(() => navigate('/my-listings'), 1500);
      }

    } catch (err) {
      console.error('❌ Error submitting listing:', err);
      setApiError(err.message);
    } finally {
      setSub(false);
    }
  };

  const handleRequestVerification = () => {
    navigate('/request-verification');
  };

  // ── Theme ─────────────────────────────────────────────────────────────────
  const accent = '#00e676';
  const bg = dark ? '#0f1a12' : '#ffffff';
  const cardBg = dark ? '#0f1a12' : '#ffffff';
  const text = dark ? '#d4f7dc' : '#1a2e1a';
  const border = dark ? '#1a3320' : '#e0e7e0';
  const inputBg = dark ? '#152018' : '#f9fafb';
  const mutedTxt = dark ? '#4d7a5a' : '#94a3b8';
  const subtleBg = dark ? '#152018' : '#f8faf8';
  const fontFam = isRTL ? "'Cairo',sans-serif" : "'Inter','Segoe UI',sans-serif";

  const stepsDisplay = isRTL ? [...u.steps].reverse() : u.steps;
  const stepsNums = isRTL ? [4, 3, 2, 1] : [1, 2, 3, 4];

  const inp = (extra = {}) => ({
    width: '100%', padding: '0.7rem 0.9rem', background: inputBg,
    border: `1.5px solid ${border}`, borderRadius: '10px', color: text,
    fontSize: '0.9rem', boxSizing: 'border-box', fontFamily: fontFam,
    outline: 'none', textAlign: isRTL ? 'right' : 'left',
    direction: isRTL ? 'rtl' : 'ltr', ...extra,
  });

  const lbl = {
    display: 'block', fontWeight: 700, marginBottom: '0.4rem',
    fontSize: '0.9rem', textAlign: isRTL ? 'right' : 'left',
  };

  const rowJustify = isRTL ? 'flex-end' : 'flex-start';

  const fld = (k, v) => (
    <div key={k} style={{ marginBottom: '0.3rem', textAlign: isRTL ? 'right' : 'left' }}>
      <span style={{ fontWeight: 600, color: mutedTxt, fontSize: '0.8rem' }}>{k}: </span>
      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{v || '—'}</span>
    </div>
  );

  const showSplit = step !== 4;

  const unitLabel = (val) => (u.units.find(([v]) => v === val) || [])[1] || val;
  const freqLabel = (val) => (u.frequencies.find(([v]) => v === val) || [])[1] || val;
  const currLabel = (val) => (u.currencies.find(([v]) => v === val) || [])[1] || val;

  // Show loading state while checking verification
  if (checkingVerification) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        color: text,
        fontFamily: fontFam
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{
            width: '50px',
            height: '50px',
            border: '3px solid #e2e8f0',
            borderTopColor: accent,
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>{u.checkVerification}</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Show verification required message if not verified
  if (isVerified === false) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        color: text,
        fontFamily: fontFam,
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '500px',
          background: cardBg,
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: `1px solid ${border}`
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Shield size={40} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ef4444' }}>
            {isRTL ? 'مصنع غير موثق' : 'Unverified Factory'}
          </h2>
          <p style={{ marginBottom: '2rem', color: mutedTxt, lineHeight: '1.6' }}>
            {u.verificationRequired}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={handleRequestVerification}
              style={{
                padding: '0.75rem 1.5rem',
                background: accent,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {u.requestVerification}
            </button>
            <button
              onClick={() => navigate('/profile')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: text,
                border: `1.5px solid ${border}`,
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {isRTL ? 'العودة للملف الشخصي' : 'Back to Profile'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: fontFam, direction: isRTL ? 'rtl' : 'ltr' }}>

      {/* API Messages */}
      {apiError && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: '#fee2e2',
          color: '#ef4444',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '1px solid #fecaca',
          maxWidth: '90%',
          textAlign: 'center'
        }}>
          {apiError}
        </div>
      )}

      {apiSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: '#d1fae5',
          color: '#059669',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '1px solid #a7f3d0',
          maxWidth: '90%',
          textAlign: 'center'
        }}>
          {apiSuccess}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '1rem 2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: accent, marginBottom: '0.3rem' }}>
            {u.pageTitle}
          </h1>
          <p style={{ color: mutedTxt, fontSize: '0.92rem' }}>{u.pageSubtitle}</p>
        </div>

        {/* Stepper */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 40,
          marginBottom: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {stepsNums.map((n, i) => {
            const filled = n <= step;
            const active = n === step;
            return (
              <React.Fragment key={n}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '98px' }}>
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '50%',
                    background: filled ? accent : (dark ? '#1e3320' : '#e2e8f0'),
                    color: filled ? '#fff' : mutedTxt,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.95rem',
                    boxShadow: active ? `0 0 0 5px ${accent}28` : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {filled && n < step ? <CheckCircle size={17} /> : n}
                  </div>
                  <span style={{ fontSize: '0.67rem', fontWeight: 700, textAlign: 'center', color: filled ? accent : mutedTxt }}>
                    {stepsDisplay[i]}
                  </span>
                </div>
                {i < 3 && (
                  <div style={{
                    width: '64px', height: '4px', marginTop: '20px', borderRadius: '2px',
                    background: filled && n < step ? accent : (dark ? '#1e3320' : '#e2e8f0'),
                    transition: 'background 0.7s',
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showSplit ? '1fr 1.5fr' : '1fr',
        minHeight: 'calc(100vh - 200px)',
        gap: '1rem',
        padding: '0 2rem'
      }}>

        {/* Left Column - Sticky Illustration */}
        {showSplit && (
          <div style={{
            position: 'relative',
            background: dark ? '#0f1a12' : '#ffffff',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
            <div style={{
              position: 'sticky',
              top: '20px',
              width: '100%',
            }}>
              <img
                src={dark ? addNewWasteDarkImg : addNewWasteImg}
                alt="Add New Waste"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  height: 'auto',
                  objectFit: 'contain',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>
          </div>
        )}

        {/* Right Column - Form */}
        <div style={{
          background: cardBg,
          padding: '1rem',
        }}>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: rowJustify }}>
                {isRTL ? <>{u.step1Title} <Package color={accent} size={19} /></> : <><Package color={accent} size={19} /> {u.step1Title}</>}
              </h2>

              {/* Title */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={lbl}>{u.adTitle} *</label>
                <input type="text" value={form.title} onChange={e => upd('title', e.target.value)}
                  placeholder={u.adTitlePH}
                  style={inp({ borderColor: errors.title ? '#ef4444' : border })}
                />
                {errors.title && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem', textAlign: isRTL ? 'right' : 'left' }}>{errors.title}</p>}
              </div>

              {/* Waste Type */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={lbl}>{u.wasteType} *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: rowJustify }}>
                  {Object.entries(wasteTypes).map(([key, val]) => (
                    <button key={key} type="button" onClick={() => upd('wasteType', key)} style={{
                      padding: '0.45rem 1rem', borderRadius: '8px',
                      border: `1.5px solid ${form.wasteType === key ? accent : border}`,
                      background: form.wasteType === key ? accent : 'transparent',
                      color: form.wasteType === key ? '#fff' : text,
                      fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer',
                      transition: 'all 0.16s', fontFamily: fontFam,
                    }}>{val}</button>
                  ))}
                </div>
                {errors.wasteType && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem', textAlign: isRTL ? 'right' : 'left' }}>{errors.wasteType}</p>}
              </div>

              {/* Qty / Unit / Freq */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.9rem' }}>
                {isRTL ? (
                  <>
                    <div key="freq">
                      <label style={lbl}>{u.frequency}</label>
                      <select value={form.frequency} onChange={e => upd('frequency', e.target.value)} style={inp()}>
                        {u.frequencies.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div key="unit">
                      <label style={lbl}>{u.unit}</label>
                      <select value={form.unit} onChange={e => upd('unit', e.target.value)} style={inp()}>
                        {u.units.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div key="qty">
                      <label style={lbl}>{u.quantity} *</label>
                      <input type="number" value={form.amount} onChange={e => upd('amount', e.target.value)}
                        style={inp({ borderColor: errors.amount ? '#ef4444' : border })} />
                      {errors.amount && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem', textAlign: 'right' }}>{errors.amount}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div key="qty">
                      <label style={lbl}>{u.quantity} *</label>
                      <input type="number" value={form.amount} onChange={e => upd('amount', e.target.value)}
                        style={inp({ borderColor: errors.amount ? '#ef4444' : border })} />
                      {errors.amount && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.amount}</p>}
                    </div>
                    <div key="unit">
                      <label style={lbl}>{u.unit}</label>
                      <select value={form.unit} onChange={e => upd('unit', e.target.value)} style={inp()}>
                        {u.units.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div key="freq">
                      <label style={lbl}>{u.frequency}</label>
                      <select value={form.frequency} onChange={e => upd('frequency', e.target.value)} style={inp()}>
                        {u.frequencies.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Price & Location */}
          {step === 2 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: rowJustify }}>
                {isRTL ? <>{u.step2Title} <DollarSign color={accent} size={19} /></> : <><DollarSign color={accent} size={19} /> {u.step2Title}</>}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: isRTL ? '1fr 2fr' : '2fr 1fr', gap: '0.9rem', marginBottom: '1.2rem' }}>
                {isRTL ? (
                  <>
                    <div key="currency">
                      <label style={lbl}>{u.currency}</label>
                      <select value={form.currency} onChange={e => upd('currency', e.target.value)} style={inp()}>
                        {u.currencies.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div key="price">
                      <label style={lbl}>{u.price} *</label>
                      <input type="number" value={form.price} onChange={e => upd('price', e.target.value)}
                        style={inp({ borderColor: errors.price ? '#ef4444' : border })} />
                      {errors.price && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem', textAlign: 'right' }}>{errors.price}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div key="price">
                      <label style={lbl}>{u.price} *</label>
                      <input type="number" value={form.price} onChange={e => upd('price', e.target.value)}
                        style={inp({ borderColor: errors.price ? '#ef4444' : border })} />
                      {errors.price && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.price}</p>}
                    </div>
                    <div key="currency">
                      <label style={lbl}>{u.currency}</label>
                      <select value={form.currency} onChange={e => upd('currency', e.target.value)} style={inp()}>
                        {u.currencies.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={lbl}>{u.location} *</label>
                <select value={form.location} onChange={e => upd('location', e.target.value)}
                  style={inp({ borderColor: errors.location ? '#ef4444' : border })}>
                  <option value="">{u.locationPH}</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.location && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem', textAlign: isRTL ? 'right' : 'left' }}>{errors.location}</p>}
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={lbl}>{u.mapLink} <span style={{ fontWeight: 400, color: mutedTxt }}>{u.optional}</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="url" value={form.locationLink} onChange={e => upd('locationLink', e.target.value)}
                    placeholder={u.mapLinkPH} style={inp()} />
                  <LinkIcon size={17} color={mutedTxt} style={{ flexShrink: 0 }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={lbl}>{u.description} <span style={{ fontWeight: 400, color: mutedTxt }}>{u.optional}</span></label>
                <textarea rows={3} value={form.description} onChange={e => upd('description', e.target.value)}
                  placeholder={u.descPH} style={inp({ resize: 'vertical' })} />
              </div>

              <div>
                <label style={lbl}>{u.images} <span style={{ fontWeight: 400, color: mutedTxt }}>{u.imagesNote}</span></label>
                <p style={{ fontSize: '0.76rem', color: mutedTxt, marginBottom: '0.6rem', textAlign: isRTL ? 'right' : 'left' }}>{u.compressNote}</p>
                
                {/* Image Upload Area */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                  {form.images.map((url, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img 
                        src={url} 
                        alt={`Upload ${i + 1}`} 
                        style={{ 
                          width: '100%', 
                          height: '100px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: `2px solid ${border}`
                        }} 
                      />
                      <button
                        onClick={() => removeImg(i)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {form.images.length < 3 && (
                    <label style={{
                      border: `2px dashed ${border}`,
                      borderRadius: '8px',
                      height: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: uploadingImages ? 'wait' : 'pointer',
                      background: inputBg,
                      color: mutedTxt
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImages}
                        style={{ display: 'none' }}
                        disabled={uploadingImages}
                      />
                      {uploadingImages ? (
                        <>
                          <Loader size={20} className="animate-spin" />
                          <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{u.uploading}</span>
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{u.uploadBtn}</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Specifications */}
          {step === 3 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: rowJustify }}>
                {isRTL ? <>{u.step3Title} <Settings color={accent} size={19} /></> : <><Settings color={accent} size={19} /> {u.step3Title}</>}
              </h2>
              <p style={{ color: mutedTxt, marginBottom: '1.3rem', fontSize: '0.85rem', textAlign: isRTL ? 'right' : 'left' }}>
                {u.step3Sub}
              </p>
              {Object.entries(u.specs).map(([key, { label, options }]) => (
                <OptionSelector key={key} label={label} options={options} value={form[key]}
                  onChange={v => upd(key, v)} error={errors[key]}
                  isRTL={isRTL} accent={accent} border={border} text={text}
                />
              ))}
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: rowJustify }}>
                {isRTL ? <>{u.step4Title} <CheckCircle color={accent} size={19} /></> : <><CheckCircle color={accent} size={19} /> {u.step4Title}</>}
              </h2>

              {form.images.length > 0 && (
                <div style={{ marginBottom: '1.2rem' }}>
                  <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.88rem', textAlign: isRTL ? 'right' : 'left' }}>{u.uploadedImgs}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {form.images.map((url, i) => (
                      <img 
                        key={i} 
                        src={url} 
                        alt="" 
                        style={{ 
                          width: '72px', 
                          height: '72px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: `2px solid ${border}`
                        }} 
                      />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: subtleBg, borderRadius: '14px', padding: '1rem', border: `1px solid ${border}` }}>
                  <p style={{ fontWeight: 800, color: accent, marginBottom: '0.7rem', fontSize: '0.85rem', textAlign: isRTL ? 'right' : 'left' }}>{u.basicInfo}</p>
                  {fld(u.reviewTitle, form.title)}
                  {fld(u.reviewType, wasteTypes[form.wasteType])}
                  {fld(u.reviewQty, `${form.amount} ${unitLabel(form.unit)}`)}
                  {fld(u.reviewFreq, freqLabel(form.frequency))}
                  {fld(u.reviewPrice, `${form.price} ${currLabel(form.currency)}`)}
                  {fld(u.reviewLocation, form.location)}
                </div>
                <div style={{ background: subtleBg, borderRadius: '14px', padding: '1rem', border: `1px solid ${border}` }}>
                  <p style={{ fontWeight: 800, color: accent, marginBottom: '0.7rem', fontSize: '0.85rem', textAlign: isRTL ? 'right' : 'left' }}>{u.techSpecs}</p>
                  {Object.entries(u.specs).map(([k, { label }]) => fld(label, form[k]))}
                </div>
              </div>

              <button 
                onClick={submit} 
                disabled={submitting || uploadingImages} 
                style={{
                  width: '100%', 
                  padding: '1rem', 
                  background: (submitting || uploadingImages) ? mutedTxt : accent, 
                  color: '#fff', 
                  border: 'none',
                  borderRadius: '12px', 
                  fontWeight: 800, 
                  fontSize: '1.05rem',
                  cursor: (submitting || uploadingImages) ? 'wait' : 'pointer', 
                  opacity: (submitting || uploadingImages) ? 0.7 : 1, 
                  fontFamily: fontFam,
                }}
              >
                {submitting ? u.publishing : (uploadingImages ? u.uploading : u.publishBtn)}
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${border}` }}>
              {isRTL ? (
                <>
                  <button onClick={next} style={{
                    padding: '0.7rem 2rem', background: accent, border: 'none', borderRadius: '10px',
                    color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
                    gap: '0.4rem', fontFamily: fontFam, fontSize: '0.95rem'
                  }}>
                    <ChevronRight size={16} /> {u.next}
                  </button>
                  <button onClick={back} disabled={step === 1} style={{
                    padding: '0.7rem 1.6rem', background: 'transparent', border: `1.5px solid ${border}`,
                    borderRadius: '10px', color: step === 1 ? mutedTxt : text, fontWeight: 600,
                    cursor: step === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
                    gap: '0.4rem', fontFamily: fontFam, fontSize: '0.95rem'
                  }}>
                    {u.prev}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={back} disabled={step === 1} style={{
                    padding: '0.7rem 1.6rem', background: 'transparent', border: `1.5px solid ${border}`,
                    borderRadius: '10px', color: step === 1 ? mutedTxt : text, fontWeight: 600,
                    cursor: step === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
                    gap: '0.4rem', fontFamily: fontFam, fontSize: '0.95rem'
                  }}>
                    ← {u.prev}
                  </button>
                  <button onClick={next} style={{
                    padding: '0.7rem 2rem', background: accent, border: 'none', borderRadius: '10px',
                    color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
                    gap: '0.4rem', fontFamily: fontFam, fontSize: '0.95rem'
                  }}>
                    {u.next} → <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Tips */}
          <div style={{ marginTop: '1.5rem', background: dark ? '#152018' : subtleBg, borderRadius: '14px', padding: '1.1rem', border: `1px solid ${border}` }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.8rem', color: dark ? '#6ee7b7' : text, justifyContent: rowJustify }}>
              {isRTL ? <>{u.tipsTitle} <AlertCircle size={15} color={accent} /></> : <><AlertCircle size={15} color={accent} /> {u.tipsTitle}</>}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
              {tips.filter(Boolean).map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', justifyContent: rowJustify, textAlign: isRTL ? 'right' : 'left' }}>
                  {isRTL ? (<><span>{tip}</span><CheckCircle size={13} color={accent} style={{ marginTop: '2px', flexShrink: 0 }} /></>) : (<><CheckCircle size={13} color={accent} style={{ marginTop: '2px', flexShrink: 0 }} /><span>{tip}</span></>)}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ListWaste;