import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Package, MapPin, DollarSign, Zap, Plus, ArrowRight,
    AlertCircle, Check, Loader
} from 'lucide-react'
import ceApi from '../services/circularEconomyApi'
import './SellWaste.css'

// ═══════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════
const T = {
    ar: {
        title: 'بيع المخلفات',
        subtitle: 'انشر اعلان عن المخلفات التي لديك وابدأ البيع',
        formTitle: 'تفاصيل الإعلان',
        
        fields: {
            wasteType: 'نوع المخلفات *',
            wasteTypePlaceholder: 'مثال: بلاستيك، معادن، ورق، الخ',
            description: 'وصف تفصيلي *',
            descriptionPlaceholder: 'صف حالة المادة والتفاصيل المهمة...',
            quantity: 'الكمية المتاحة *',
            unit: 'الوحدة *',
            price: 'السعر المطلوب *',
            location: 'الموقع الجغرافي *',
            locationPlaceholder: 'المحافظة/المدينة',
            specifications: 'المواصفات الإضافية',
            specPlaceholder: 'مثال: درجة النقاء، التوافر الفوري، الخ',
            imageUrl: 'رابط الصورة (اختياري)'
        },
        
        units: {
            kg: 'كيلوجرام',
            tons: 'طن',
            liters: 'لتر',
            pieces: 'قطعة',
            boxes: 'صندوق',
            bags: 'كيس'
        },

        buttons: {
            publish: 'نشر الإعلان',
            cancel: 'إلغاء',
            publishing: 'جاري النشر...'
        },

        success: {
            title: 'تم نشر الإعلان بنجاح!',
            message: 'الآن يمكن للمشترين رؤية إعلانك في السوق',
            viewMarketplace: 'عرض في السوق',
            newListing: 'نشر إعلان جديد'
        },

        errors: {
            required: 'هذا الحقل مطلوب',
            invalidPrice: 'السعر يجب أن يكون أكبر من 0',
            invalidQuantity: 'الكمية يجب أن تكون أكبر من 0',
            publishFailed: 'فشل نشر الإعلان، حاول مجدداً'
        },

        tips: {
            title: '💡 نصائح لإعلان ناجح:',
            tip1: '✓ اكتب وصف دقيق عن المادة',
            tip2: '✓ حدد السعر بعناية',
            tip3: '✓ أضف صورة واضحة إن أمكن',
            tip4: '✓ وضح موقع التسليم بدقة'
        }
    },
    en: {
        title: 'Sell Waste',
        subtitle: 'List your waste materials and start selling',
        formTitle: 'Listing Details',
        
        fields: {
            wasteType: 'Waste Type *',
            wasteTypePlaceholder: 'E.g., Plastic, Metal, Paper, etc.',
            description: 'Detailed Description *',
            descriptionPlaceholder: 'Describe the material condition and important details...',
            quantity: 'Available Quantity *',
            unit: 'Unit *',
            price: 'Asking Price *',
            location: 'Pickup Location *',
            locationPlaceholder: 'Governorate/City',
            specifications: 'Additional Specifications',
            specPlaceholder: 'E.g., Purity level, Immediate availability, etc.',
            imageUrl: 'Image URL (optional)'
        },
        
        units: {
            kg: 'Kilogram',
            tons: 'Ton',
            liters: 'Liter',
            pieces: 'Piece',
            boxes: 'Box',
            bags: 'Bag'
        },

        buttons: {
            publish: 'Publish Listing',
            cancel: 'Cancel',
            publishing: 'Publishing...'
        },

        success: {
            title: 'Listing Published Successfully!',
            message: 'Buyers can now see your listing in the marketplace',
            viewMarketplace: 'View in Marketplace',
            newListing: 'Create New Listing'
        },

        errors: {
            required: 'This field is required',
            invalidPrice: 'Price must be greater than 0',
            invalidQuantity: 'Quantity must be greater than 0',
            publishFailed: 'Failed to publish listing, try again'
        },

        tips: {
            title: '💡 Tips for a successful listing:',
            tip1: '✓ Write an accurate description',
            tip2: '✓ Set competitive pricing',
            tip3: '✓ Add a clear image if possible',
            tip4: '✓ Specify the exact pickup location'
        }
    }
}

// ═══════════════════════════════════════════════════
// SELL WASTE COMPONENT
// ═══════════════════════════════════════════════════
export default function SellWaste({ user, lang = 'ar' }) {
    const t = T[lang] || T.ar
    const ar = lang === 'ar'
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        wasteType: '',
        description: '',
        quantity: '',
        unit: 'kg',
        price: '',
        location: '',
        specifications: '',
        imageUrl: ''
    })

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        if (!formData.wasteType.trim()) {
            setError(t.errors.required)
            return false
        }
        if (!formData.description.trim()) {
            setError(t.errors.required)
            return false
        }
        if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
            setError(t.errors.invalidQuantity)
            return false
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError(t.errors.invalidPrice)
            return false
        }
        if (!formData.location.trim()) {
            setError(t.errors.required)
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) return

        try {
            setLoading(true)

            // Create waste asset
            const wasteAssetRequest = {
                wasteTypeName: formData.wasteType,
                description: formData.description,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                price: parseFloat(formData.price),
                location: formData.location,
                specifications: formData.specifications || '',
                imageUrl: formData.imageUrl || '',
                factoryId: user?.factoryId,
                status: 'Available'
            }

            const response = await ceApi.createWasteAsset(wasteAssetRequest)

            if (response.success) {
                setSuccess(true)
                setFormData({
                    wasteType: '',
                    description: '',
                    quantity: '',
                    unit: 'kg',
                    price: '',
                    location: '',
                    specifications: '',
                    imageUrl: ''
                })
            } else {
                setError(t.errors.publishFailed)
            }
        } catch (err) {
            console.error('Error publishing listing:', err)
            setError(t.errors.publishFailed)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="sell-waste-container" dir={ar ? 'rtl' : 'ltr'}>
                <div className="success-container">
                    <div className="success-icon">
                        <Check size={60} color="#10b981" />
                    </div>
                    <h2>{t.success.title}</h2>
                    <p>{t.success.message}</p>
                    <div className="success-actions">
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/circular-marketplace')}
                        >
                            <ArrowRight size={18} />
                            {t.success.viewMarketplace}
                        </button>
                        <button 
                            className="btn-secondary"
                            onClick={() => setSuccess(false)}
                        >
                            <Plus size={18} />
                            {t.success.newListing}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="sell-waste-container" dir={ar ? 'rtl' : 'ltr'}>
            {/* HEADER */}
            <div className="sell-waste-header">
                <div className="header-content">
                    <Package size={40} color="#11998e" />
                    <div>
                        <h1>{t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="sell-waste-content">
                <div className="form-section">
                    <h2>{t.formTitle}</h2>

                    {error && (
                        <div className="error-banner">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="sell-waste-form">
                        {/* Waste Type */}
                        <div className="form-group">
                            <label htmlFor="wasteType">{t.fields.wasteType}</label>
                            <input
                                id="wasteType"
                                type="text"
                                name="wasteType"
                                value={formData.wasteType}
                                onChange={handleChange}
                                placeholder={t.fields.wasteTypePlaceholder}
                                className="form-control"
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description">{t.fields.description}</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder={t.fields.descriptionPlaceholder}
                                className="form-control"
                                rows="4"
                            />
                        </div>

                        {/* Quantity & Unit */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="quantity">{t.fields.quantity}</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="unit">{t.fields.unit}</label>
                                <select
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    {Object.entries(t.units).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="form-group">
                            <label htmlFor="price">{t.fields.price}</label>
                            <div className="input-with-icon">
                                <DollarSign size={18} />
                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="form-group">
                            <label htmlFor="location">{t.fields.location}</label>
                            <div className="input-with-icon">
                                <MapPin size={18} />
                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder={t.fields.locationPlaceholder}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="form-group">
                            <label htmlFor="specifications">{t.fields.specifications}</label>
                            <textarea
                                id="specifications"
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleChange}
                                placeholder={t.fields.specPlaceholder}
                                className="form-control"
                                rows="2"
                            />
                        </div>

                        {/* Image URL */}
                        <div className="form-group">
                            <label htmlFor="imageUrl">{t.fields.imageUrl}</label>
                            <input
                                id="imageUrl"
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="form-control"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn-secondary"
                                onClick={() => navigate(-1)}
                            >
                                {t.buttons.cancel}
                            </button>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader size={18} className="spinner" />
                                        {t.buttons.publishing}
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        {t.buttons.publish}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* TIPS SIDEBAR */}
                <div className="tips-section">
                    <h3>{t.tips.title}</h3>
                    <ul className="tips-list">
                        <li>{t.tips.tip1}</li>
                        <li>{t.tips.tip2}</li>
                        <li>{t.tips.tip3}</li>
                        <li>{t.tips.tip4}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
