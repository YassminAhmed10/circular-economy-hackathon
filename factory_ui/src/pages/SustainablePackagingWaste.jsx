import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, DollarSign, Upload, X, CheckCircle, ChevronRight,
  AlertCircle, Link as LinkIcon, Settings, Shield, Loader, MapPin, Calendar
} from 'lucide-react';
import { T } from './translations';
import '../styles/SustainablePackagingWaste.css';

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

const UI = {
  ar: {
    pageTitle: 'إضافة نفايات التغليف المستدام',
    pageSubtitle: 'أضف مواد التغليف المستدام للبيع في السوق',
    steps: ['المعلومات الأساسية', 'الخصائص', 'الموقع والسعر', 'المراجعة والنشر'],
    step1: {
      title: 'المعلومات الأساسية',
      subtitle: 'ابدأ برمز التغليف والكمية',
      packagingSubtype: 'نوع التغليف',
      amount: 'الكمية',
      unit: 'الوحدة',
      description: 'الوصف (العربية)',
      descriptionEn: 'الوصف (الإنجليزية)',
      selectSubtype: 'اختر نوع التغليف',
      enterAmount: 'أدخل الكمية',
      enterDescription: 'أدخل وصف التغليف'
    },
    step2: {
      title: 'الخصائص',
      subtitle: 'حدد خصائص التغليف',
      contaminationLevel: 'مستوى التلوث',
      foodContact: 'مناسب للتلامس الغذائي',
      recyclabilityOptions: 'خيارات إعادة التدوير',
      none: 'بلا تلوث',
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي'
    },
    step3: {
      title: 'الموقع والسعر',
      subtitle: 'أضف تفاصيل الموقع والسعر',
      price: 'السعر',
      currency: 'العملة',
      location: 'الموقع',
      locationAr: 'الموقع (عربي)',
      expiresAt: 'تاريخ انتهاء العرض',
      enterPrice: 'أدخل السعر',
      selectCurrency: 'اختر العملة'
    },
    step4: {
      title: 'المراجعة والنشر',
      subtitle: 'تحقق من البيانات قبل النشر',
      confirm: 'تأكيد النشر',
      preview: 'معاينة'
    },
    buttons: {
      next: 'التالي',
      back: 'السابق',
      upload: 'رفع صورة',
      remove: 'إزالة',
      submit: 'نشر الإعلان',
      cancel: 'إلغاء'
    },
    messages: {
      success: 'تم نشر الإعلان بنجاح',
      error: 'حدث خطأ أثناء النشر',
      required: 'هذا الحقل مطلوب',
      imageSize: 'يجب أن تكون الصورة أقل من 5 ميجابايت'
    }
  },
  en: {
    pageTitle: 'Add Sustainable Packaging Waste',
    pageSubtitle: 'Add your sustainable packaging materials to the marketplace',
    steps: ['Basic Info', 'Properties', 'Location & Price', 'Review & Publish'],
    step1: {
      title: 'Basic Information',
      subtitle: 'Start with packaging type and quantity',
      packagingSubtype: 'Packaging Type',
      amount: 'Quantity',
      unit: 'Unit',
      description: 'Description (Arabic)',
      descriptionEn: 'Description (English)',
      selectSubtype: 'Select packaging type',
      enterAmount: 'Enter quantity',
      enterDescription: 'Enter packaging description'
    },
    step2: {
      title: 'Properties',
      subtitle: 'Define packaging characteristics',
      contaminationLevel: 'Contamination Level',
      foodContact: 'Suitable for Food Contact',
      recyclabilityOptions: 'Recyclability Options',
      none: 'No Contamination',
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    },
    step3: {
      title: 'Location & Price',
      subtitle: 'Provide location and pricing details',
      price: 'Price',
      currency: 'Currency',
      location: 'Location',
      locationAr: 'Location (Arabic)',
      expiresAt: 'Offer Expires At',
      enterPrice: 'Enter price',
      selectCurrency: 'Select currency'
    },
    step4: {
      title: 'Review & Publish',
      subtitle: 'Verify all details before publishing',
      confirm: 'Confirm Publishing',
      preview: 'Preview'
    },
    buttons: {
      next: 'Next',
      back: 'Back',
      upload: 'Upload Image',
      remove: 'Remove',
      submit: 'Publish Listing',
      cancel: 'Cancel'
    },
    messages: {
      success: 'Listing published successfully',
      error: 'Error publishing listing',
      required: 'This field is required',
      imageSize: 'Image must be less than 5 MB'
    }
  }
};

const PACKAGING_SUBTYPES = [
  { id: 1, name: 'HDPE Bottles', nameAr: 'زجاجات HDPE' },
  { id: 2, name: 'PET Containers', nameAr: 'عبوات PET' },
  { id: 3, name: 'Glass Containers', nameAr: 'عبوات زجاجية' },
  { id: 4, name: 'Aluminum Cans', nameAr: 'علب الألمنيوم' },
  { id: 5, name: 'Paper Packaging', nameAr: 'التغليف الورقي' },
  { id: 6, name: 'Cardboard Boxes', nameAr: 'صناديق الكرتون' },
  { id: 7, name: 'Plastic Films', nameAr: 'أفلام بلاستيكية' },
  { id: 8, name: 'Molded Fiber', nameAr: 'اللب الشكلي' }
];

const RECYCLABILITY_OPTIONS = [
  { value: 'recycled_pellets', label: 'Recycled Pellets', labelAr: 'حبيبات معاد تدويرها' },
  { value: 'molded_fiber', label: 'Molded Fiber', labelAr: 'اللب الشكلي' },
  { value: 'composite_materials', label: 'Composite Materials', labelAr: 'المواد المركبة' },
  { value: 'packaging_films', label: 'Packaging Films', labelAr: 'أفلام التغليف' },
  { value: 'granules', label: 'Granules', labelAr: 'الحبيبات' }
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SustainablePackagingWaste({ user, lang = 'ar', dark = false }) {
  const navigate = useNavigate();
  const t = UI[lang] || UI.ar;
  const isArabic = lang === 'ar';

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const [formData, setFormData] = useState({
    packagingWasteSubtype: '',
    amount: '',
    unit: 'kg',
    price: '',
    currency: 'USD',
    contaminationLevel: 'low',
    foodContactSuitability: false,
    recyclabilityOptions: [],
    description: '',
    descriptionAr: '',
    imageUrl: '',
    expiresAt: '',
    locationNameEn: '',
    locationNameAr: '',
    latitude: null,
    longitude: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(null);
  };

  const handleRecycleOptionChange = (option) => {
    setFormData(prev => ({
      ...prev,
      recyclabilityOptions: prev.recyclabilityOptions.includes(option)
        ? prev.recyclabilityOptions.filter(opt => opt !== option)
        : [...prev.recyclabilityOptions, option]
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(t.messages.imageSize);
      return;
    }

    try {
      setLoading(true);
      const compressed = await compressImage(file);
      const formDataObj = new FormData();
      formDataObj.append('file', compressed, 'image.jpg');

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/marketplace/upload-image`, {
        method: 'POST',
        body: formDataObj,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setImageUrl(data.data.imageUrl);
        setFormData(prev => ({
          ...prev,
          imageUrl: data.data.imageUrl
        }));
      }
    } catch (err) {
      setError(lang === 'ar' ? 'فشل تحميل الصورة' : 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.packagingWasteSubtype || !formData.amount) {
        setError(t.messages.required);
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.price || !formData.locationNameEn || !formData.locationNameAr) {
        setError(t.messages.required);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const payload = {
        packagingWasteSubtype: formData.packagingWasteSubtype,
        amount: parseFloat(formData.amount),
        unit: formData.unit,
        price: parseFloat(formData.price),
        currency: formData.currency,
        contaminationLevel: formData.contaminationLevel,
        foodContactSuitability: formData.foodContactSuitability,
        recyclabilityOptions: formData.recyclabilityOptions,
        description: formData.description || formData.descriptionEn,
        descriptionAr: formData.descriptionAr || formData.description,
        imageUrl: formData.imageUrl,
        expiresAt: formData.expiresAt || null,
        locationNameEn: formData.locationNameEn,
        locationNameAr: formData.locationNameAr
      };

      const response = await fetch(`${API_BASE_URL}/packaging-waste/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-listings');
        }, 2000);
      } else {
        setError(data.message || t.messages.error);
      }
    } catch (err) {
      setError(err.message || t.messages.error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Render Functions ───────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="form-step">
      <h3>{t.step1.title}</h3>
      <p className="step-subtitle">{t.step1.subtitle}</p>

      <div className="form-group">
        <label>{t.step1.packagingSubtype}</label>
        <select
          name="packagingWasteSubtype"
          value={formData.packagingWasteSubtype}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="">{t.step1.selectSubtype}</option>
          {PACKAGING_SUBTYPES.map(type => (
            <option key={type.id} value={type.name}>
              {isArabic ? type.nameAr : type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>{t.step1.amount}</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder={t.step1.enterAmount}
            className="input-field"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>{t.step1.unit}</label>
          <select name="unit" value={formData.unit} onChange={handleInputChange} className="input-field">
            <option value="kg">Kg</option>
            <option value="ton">Ton</option>
            <option value="pieces">Pieces</option>
            <option value="liters">Liters</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>{t.step1.descriptionEn}</label>
        <textarea
          name="descriptionEn"
          value={formData.description}
          onChange={handleInputChange}
          placeholder={t.step1.enterDescription}
          className="input-field"
          rows="4"
        ></textarea>
      </div>

      <div className="form-group">
        <label>{t.step1.description}</label>
        <textarea
          name="descriptionAr"
          value={formData.descriptionAr}
          onChange={handleInputChange}
          placeholder={t.step1.enterDescription}
          className="input-field"
          rows="4"
        ></textarea>
      </div>

      <div className="form-group">
        <label>{lang === 'ar' ? 'الصورة' : 'Image'}</label>
        <div className="image-upload">
          <input
            type="file"
            id="image-input"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
            disabled={loading}
          />
          <label htmlFor="image-input" className="upload-label">
            <Upload size={24} />
            <span>{t.buttons.upload}</span>
          </label>
          {imageUrl && (
            <div className="image-preview">
              <img src={imageUrl} alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  setImageUrl(null);
                  setFormData(prev => ({ ...prev, imageUrl: '' }));
                }}
                className="remove-btn"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3>{t.step2.title}</h3>
      <p className="step-subtitle">{t.step2.subtitle}</p>

      <div className="form-group">
        <label>{t.step2.contaminationLevel}</label>
        <select
          name="contaminationLevel"
          value={formData.contaminationLevel}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="none">{t.step2.none}</option>
          <option value="low">{t.step2.low}</option>
          <option value="medium">{t.step2.medium}</option>
          <option value="high">{t.step2.high}</option>
        </select>
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          id="foodContact"
          name="foodContactSuitability"
          checked={formData.foodContactSuitability}
          onChange={handleInputChange}
        />
        <label htmlFor="foodContact">{t.step2.foodContact}</label>
      </div>

      <div className="form-group">
        <label>{t.step2.recyclabilityOptions}</label>
        <div className="checkbox-group">
          {RECYCLABILITY_OPTIONS.map(option => (
            <label key={option.value} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.recyclabilityOptions.includes(option.value)}
                onChange={() => handleRecycleOptionChange(option.value)}
              />
              <span>{isArabic ? option.labelAr : option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3>{t.step3.title}</h3>
      <p className="step-subtitle">{t.step3.subtitle}</p>

      <div className="form-row">
        <div className="form-group">
          <label>{t.step3.price}</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder={t.step3.enterPrice}
            className="input-field"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>{t.step3.currency}</label>
          <select name="currency" value={formData.currency} onChange={handleInputChange} className="input-field">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="SAR">SAR</option>
            <option value="AED">AED</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>{t.step3.location}</label>
        <input
          type="text"
          name="locationNameEn"
          value={formData.locationNameEn}
          onChange={handleInputChange}
          placeholder={t.step3.location}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label>{t.step3.locationAr}</label>
        <input
          type="text"
          name="locationNameAr"
          value={formData.locationNameAr}
          onChange={handleInputChange}
          placeholder={t.step3.locationAr}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label>{t.step3.expiresAt}</label>
        <input
          type="date"
          name="expiresAt"
          value={formData.expiresAt}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step review-step">
      <h3>{t.step4.title}</h3>
      <p className="step-subtitle">{t.step4.subtitle}</p>

      <div className="review-grid">
        <div className="review-item">
          <span className="label">{t.step1.packagingSubtype}</span>
          <span className="value">{formData.packagingWasteSubtype}</span>
        </div>
        <div className="review-item">
          <span className="label">{t.step1.amount}</span>
          <span className="value">{formData.amount} {formData.unit}</span>
        </div>
        <div className="review-item">
          <span className="label">{t.step3.price}</span>
          <span className="value">{formData.price} {formData.currency}</span>
        </div>
        <div className="review-item">
          <span className="label">{t.step2.contaminationLevel}</span>
          <span className="value">{formData.contaminationLevel}</span>
        </div>
        <div className="review-item">
          <span className="label">{t.step3.location}</span>
          <span className="value">{formData.locationNameEn}</span>
        </div>
        <div className="review-item">
          <span className="label">{t.step2.foodContact}</span>
          <span className="value">{formData.foodContactSuitability ? '✓' : '✗'}</span>
        </div>
      </div>

      {imageUrl && (
        <div className="review-image">
          <img src={imageUrl} alt="Preview" />
        </div>
      )}
    </div>
  );

  return (
    <div className={`packaging-waste-container ${dark ? 'dark' : ''}`}>
      <div className="page-header">
        <h1 className="page-title">{t.pageTitle}</h1>
        <p className="page-subtitle">{t.pageSubtitle}</p>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn"><X size={16} /></button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>{t.messages.success}</span>
        </div>
      )}

      <div className="form-container">
        <div className="steps-indicator">
          {t.steps.map((step, idx) => (
            <div key={idx} className={`step-dot ${currentStep > idx ? 'completed' : currentStep === idx + 1 ? 'active' : ''}`}>
              <span>{idx + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="packaging-form">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-secondary"
                disabled={loading}
              >
                {t.buttons.back}
              </button>
            )}

            {currentStep < 4 && (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
                disabled={loading}
              >
                {t.buttons.next}
                <ChevronRight size={18} />
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? <Loader className="spin" size={18} /> : <CheckCircle size={18} />}
                {t.buttons.submit}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
