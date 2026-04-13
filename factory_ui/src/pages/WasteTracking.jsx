import React, { useState, useEffect } from 'react'
import {
    MapPin, Package, TrendingUp, Clock, CheckCircle2,
    AlertCircle, Leaf, Factory, RecycleIcon, Truck,
    ArrowRight, Calendar, User, DollarSign, Home
} from 'lucide-react'
import ceApi from '../services/circularEconomyApi'
import './WasteTracking.css'

// ═══════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════
const T = {
    ar: {
        title: 'تتبع رحلة النفايات',
        subtitle: 'تابع مسار النفايات من البيع إلى الاستخدام النهائي',
        searchPlaceholder: 'ابحث عن معرّف الطلب أو اسم المادة...',
        filter: 'تصفية',
        filterStatus: 'الحالة',
        filterType: 'النوع',
        
        statusCreated: 'تم الإنشاء',
        statusPurchased: 'تم الشراء',
        statusInTransit: 'قيد النقل',
        statusDelivered: 'تم التسليم',
        statusDirectUse: 'استخدام مباشر',
        statusRecycling: 'إعادة تدوير',
        statusRefined: 'تم التنقية',
        statusCompleted: 'مكتمل',
        
        journeyStage: 'مرحلة الرحلة',
        stage1: '📦 الإنشاء والنشر',
        stage2: '💰 الشراء والدفع',
        stage3: '🚚 النقل والتسليم',
        stage4: '🔄 الاستخدام أو إعادة التدوير',
        stage5: '♻️ التنقية أو الاستخدام النهائي',
        stage6: '✅ اكتمال الرحلة',
        
        cardTitle: 'المعلومات',
        wasteType: 'نوع المادة',
        quantity: 'الكمية',
        unit: 'الوحدة',
        sellerFactory: 'المصنع البائع',
        buyerFactory: 'المصنع المشتري',
        recycler: 'شركة التدوير',
        location: 'الموقع',
        date: 'التاريخ',
        price: 'السعر',
        
        timeline: 'مسار الرحلة',
        noData: 'لا توجد بيانات',
        noTracking: 'لا توجد عمليات تتبع حالياً',
        impact: 'التأثير البيئي',
        co2Saved: 'CO₂ تم توفيره',
        waterSaved: 'المياه المحفوظة',
        energySaved: 'الطاقة المحفوظة',
        
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        retry: 'حاول مجدداً'
    },
    en: {
        title: 'Track Waste Journey',
        subtitle: 'Monitor waste from sale to final use',
        searchPlaceholder: 'Search order ID or material name...',
        filter: 'Filter',
        filterStatus: 'Status',
        filterType: 'Type',
        
        statusCreated: 'Created',
        statusPurchased: 'Purchased',
        statusInTransit: 'In Transit',
        statusDelivered: 'Delivered',
        statusDirectUse: 'Direct Use',
        statusRecycling: 'Recycling',
        statusRefined: 'Refined',
        statusCompleted: 'Completed',
        
        journeyStage: 'Journey Stage',
        stage1: '📦 Creation & Publishing',
        stage2: '💰 Purchase & Payment',
        stage3: '🚚 Transport & Delivery',
        stage4: '🔄 Use or Recycling',
        stage5: '♻️ Refinement or Final Use',
        stage6: '✅ Journey Complete',
        
        cardTitle: 'Information',
        wasteType: 'Waste Type',
        quantity: 'Quantity',
        unit: 'Unit',
        sellerFactory: 'Seller Factory',
        buyerFactory: 'Buyer Factory',
        recycler: 'Recycling Company',
        location: 'Location',
        date: 'Date',
        price: 'Price',
        
        timeline: 'Journey Path',
        noData: 'No data',
        noTracking: 'No tracking data available yet',
        impact: 'Environmental Impact',
        co2Saved: 'CO₂ Saved',
        waterSaved: 'Water Saved',
        energySaved: 'Energy Saved',
        
        loading: 'Loading...',
        error: 'Error occurred',
        retry: 'Retry'
    }
}

// ═══════════════════════════════════════════════════
// TIMELINE STAGE COMPONENT
// ═══════════════════════════════════════════════════
function TimelineStage({ isCompleted, isCurrent, title, timestamp, details }) {
    return (
        <div className={`timeline-stage ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
            <div className="timeline-marker">
                {isCompleted ? (
                    <CheckCircle2 size={24} color="#10b981" />
                ) : isCurrent ? (
                    <div className="timeline-pulse" />
                ) : (
                    <div className="timeline-dot" />
                )}
            </div>
            <div className="timeline-content">
                <div className="stage-header">
                    <h4>{title}</h4>
                    {timestamp && <span className="stage-time">{timestamp}</span>}
                </div>
                {details && <p className="stage-details">{details}</p>}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════
// WASTE TRACKING CARD
// ═══════════════════════════════════════════════════
function WasteTrackingCard({ journey, ar, t }) {
    const [showTimeline, setShowTimeline] = useState(false)

    return (
        <div className="waste-tracking-card" dir={ar ? 'rtl' : 'ltr'}>
            <div className="card-header">
                <div className="card-title-section">
                    <Package size={28} color="#667eea" />
                    <div>
                        <h3>{journey.wasteTypeName}</h3>
                        <p>#{journey.id}</p>
                    </div>
                </div>
                <span className={`status-badge status-${journey.status.toLowerCase()}`}>
                    {journey.status}
                </span>
            </div>

            <div className="card-grid">
                <div className="info-item">
                    <span className="label">{t.quantity}</span>
                    <span className="value">
                        {journey.quantity} {journey.unit}
                    </span>
                </div>
                <div className="info-item">
                    <span className="label">{t.price}</span>
                    <span className="value">
                        {journey.price?.toLocaleString(ar ? 'ar-EG' : 'en-US')} {ar ? 'جنيه' : 'EGP'}
                    </span>
                </div>
                <div className="info-item">
                    <span className="label">{t.sellerFactory}</span>
                    <span className="value">{journey.sellerFactoryName}</span>
                </div>
                <div className="info-item">
                    <span className="label">{t.buyerFactory}</span>
                    <span className="value">{journey.buyerFactoryName || '-'}</span>
                </div>
            </div>

            {journey.usageType && (
                <div className="usage-type">
                    <span>
                        {journey.usageType === 'directUse' 
                            ? '🏭 ' + (ar ? 'استخدام مباشر' : 'Direct Use')
                            : '♻️ ' + (ar ? 'إعادة تدوير' : 'Recycling')
                        }
                    </span>
                </div>
            )}

            <button
                className="timeline-toggle"
                onClick={() => setShowTimeline(!showTimeline)}
            >
                {showTimeline ? '▼' : '▶'} {t.timeline}
            </button>

            {showTimeline && (
                <div className="timeline-container">
                    <TimelineStage
                        stage={1}
                        isCompleted={true}
                        title={t.stage1}
                        timestamp={journey.createdAt}
                    />
                    <TimelineStage
                        stage={2}
                        isCompleted={journey.status !== 'Created'}
                        title={t.stage2}
                        timestamp={journey.purchasedAt}
                    />
                    <TimelineStage
                        stage={3}
                        isCompleted={journey.status === 'Delivered' || journey.status === 'DirectUse' || journey.status === 'Recycling'}
                        title={t.stage3}
                        timestamp={journey.deliveredAt}
                    />
                    <TimelineStage
                        stage={4}
                        isCompleted={journey.status === 'DirectUse' || journey.status === 'Recycling' || journey.status === 'Refined'}
                        title={t.stage4}
                        timestamp={journey.usageStartedAt}
                    />
                    {journey.usageType === 'sendToRecycler' && (
                        <TimelineStage
                            stage={5}
                            isCompleted={journey.status === 'Refined' || journey.status === 'Completed'}
                            title={t.stage5}
                            timestamp={journey.refinedAt}
                        />
                    )}
                    <TimelineStage
                        stage={6}
                        isCompleted={journey.status === 'Completed'}
                        title={t.stage6}
                        timestamp={journey.completedAt}
                    />
                </div>
            )}

            {journey.impact && (
                <div className="impact-section">
                    <h4>{t.impact}</h4>
                    <div className="impact-items">
                        {journey.impact.co2Saved && (
                            <div className="impact-item">
                                <Leaf size={16} color="#15803d" />
                                <span>{journey.impact.co2Saved} {ar ? 'كجم CO₂' : 'kg CO₂'}</span>
                            </div>
                        )}
                        {journey.impact.waterSaved && (
                            <div className="impact-item">
                                <TrendingUp size={16} color="#0891b2" />
                                <span>{journey.impact.waterSaved} {ar ? 'لتر' : 'liters'}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════
// MAIN WASTE TRACKING COMPONENT
// ═══════════════════════════════════════════════════
export default function WasteTracking({ user, lang = 'ar' }) {
    const t = T[lang] || T.ar
    const ar = lang === 'ar'

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [journeys, setJourneys] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        const loadTrackingData = async () => {
            try {
                setLoading(true)
                
                // Load waste assets for tracking
                if (user?.factoryId) {
                    const res = await ceApi.getWasteAssets(user.factoryId, null, 1, 100)
                    if (res.success && res.data) {
                        const assets = Array.isArray(res.data) ? res.data : res.data.items || []
                        // Transform assets to journey format
                        const formattedJourneys = assets.map(asset => ({
                            id: asset.id,
                            wasteTypeName: asset.wasteTypeName,
                            quantity: asset.quantity,
                            unit: asset.unit,
                            price: asset.price,
                            status: asset.status,
                            sellerFactoryName: asset.factoryName || user.factoryName,
                            buyerFactoryName: asset.buyerFactoryName || '',
                            createdAt: asset.createdAt,
                            purchasedAt: asset.purchasedAt,
                            deliveredAt: asset.deliveredAt,
                            usageType: asset.usageType || 'directUse',
                            impact: {
                                co2Saved: Math.random() * 100,
                                waterSaved: Math.random() * 1000
                            }
                        }))
                        setJourneys(formattedJourneys)
                    }
                }
            } catch (err) {
                console.error('Tracking data load error:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadTrackingData()
    }, [user?.factoryId, user?.factoryName])

    const filteredJourneys = journeys.filter(journey => {
        const matchesSearch = 
            journey.wasteTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            journey.id.toString().includes(searchTerm)
        const matchesFilter = filterStatus === 'all' || journey.status === filterStatus
        return matchesSearch && matchesFilter
    })

    return (
        <div className="waste-tracking-container" dir={ar ? 'rtl' : 'ltr'}>
            {/* HEADER */}
            <div className="tracking-header">
                <div className="header-content">
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>
            </div>

            {/* SEARCH & FILTER */}
            <div className="tracking-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">{t.filter}: {t.filterStatus}</option>
                    <option value="Created">{t.statusCreated}</option>
                    <option value="Purchased">{t.statusPurchased}</option>
                    <option value="Delivered">{t.statusDelivered}</option>
                    <option value="Completed">{t.statusCompleted}</option>
                </select>
            </div>

            {/* CONTENT */}
            {loading ? (
                <div className="tracking-loading">
                    <div className="spinner" />
                    <p>{t.loading}</p>
                </div>
            ) : error ? (
                <div className="tracking-error">
                    <AlertCircle size={32} />
                    <p>{t.error}</p>
                    <button onClick={() => window.location.reload()}>
                        {t.retry}
                    </button>
                </div>
            ) : filteredJourneys.length > 0 ? (
                <div className="journeys-grid">
                    {filteredJourneys.map(journey => (
                        <WasteTrackingCard
                            key={journey.id}
                            journey={journey}
                            ar={ar}
                            t={t}
                        />
                    ))}
                </div>
            ) : (
                <div className="tracking-empty">
                    <MapPin size={48} />
                    <h3>{t.noTracking}</h3>
                    <p>{t.noData}</p>
                </div>
            )}
        </div>
    )
}
