// Marketplace.js
import React, { useState, useCallback, useEffect } from 'react';
import './Marketplace.css';
import { FiSearch, FiMapPin, FiPackage, FiEye, FiStar, FiGlobe } from 'react-icons/fi';
import { MdRecycling } from 'react-icons/md';
import { GiWoodPile, GiGlassShot } from 'react-icons/gi';
import { BsFileText, BsBoxSeam } from 'react-icons/bs';
import { FaIndustry, FaWeightHanging } from 'react-icons/fa';
import { RiTShirtLine } from 'react-icons/ri';
import { useNavigate, useLocation } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

import paperWasteImage from '../assets/مخلفات الورق.png';
import plasticWasteImage from '../assets/مخلفات البلاستيك.png';
import woodWasteImage from '../assets/مخلفات الخشب.png';
import metalWasteImage from '../assets/مخلفات المعادن.png';
import glassWasteImage from '../assets/مخلفات الزجاج.png';
import textileWasteImage from '../assets/مخلفات النسيج.png';
import chemicalsImg from '../assets/Chemicals.png';
import electronicsImg from '../assets/Electronics .png';

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
    ar: {
        dir: 'rtl',
        heroBadge: 'اقتصاد دوري • مستدام',
        heroTitle: 'سوق المخلفات الصناعية',
        heroSub: 'حوّل المخلفات إلى فرص تجارية واستفد من الاقتصاد الدائري',
        searchPH: 'ابحث عن نوع المخلفات أو اسم الشركة...',
        searchBtn: 'بحث',
        s1: 'إعلان نشط', s2: 'مصنع مسجل', s3: 'محافظة', s4: 'رضا العملاء',
        productsTitle: 'المنتجات المتاحة',
        productUnit: 'منتج',
        allCats: 'جميع الفئات',
        sortLabel: 'ترتيب حسب:',
        sorts: { newest: 'الأحدث', priceLow: 'الأقل سعراً', priceHigh: 'الأعلى سعراً', nearest: 'الأقرب', rating: 'الأعلى تقييماً' },
        noResults: 'لا توجد نتائج', noResultsHint: 'جرب تغيير معايير البحث',
        showAll: 'عرض جميع المنتجات',
        mapTitle: 'البحث بالموقع الجغرافي',
        locPH: 'أدخل اسم المنطقة أو المدينة...',
        locBtn: 'بحث',
        detectBtn: '📍 استخدم موقعي الحالي',
        nearbyTitle: 'مصانع قريبة منك',
        nearbyEmpty: 'حدد موقعك لعرض المصانع القريبة',
        mapLoading: 'جاري تحميل الخريطة...',
        contact: 'تواصل',
        viewDetails: 'عرض التفاصيل',
        egp: 'جنيه',
        reviews: 'تقييم',
        km: 'كم',
        listings: 'إعلان متاح',
        langBtn: 'English',
        badges: { new: 'جديد', featured: 'مميز', offer: 'عرض' },
        cats: { all: 'الكل', plastic: 'بلاستيك', metal: 'معادن', paper: 'ورق', glass: 'زجاج', wood: 'خشب', textile: 'نسيج', chemicals: 'كيماويات', electronics: 'إلكترونيات' },
        loading: 'جاري التحميل...',
        error: 'حدث خطأ في تحميل البيانات'
    },
    en: {
        dir: 'ltr',
        heroBadge: 'Circular Economy • Sustainable',
        heroTitle: 'Industrial Waste Marketplace',
        heroSub: 'Turn waste into business opportunities and benefit from the circular economy',
        searchPH: 'Search by waste type or company name...',
        searchBtn: 'Search',
        s1: 'Active Listings', s2: 'Registered Factories', s3: 'Governorates', s4: 'Customer Satisfaction',
        productsTitle: 'Available Products',
        productUnit: 'product',
        allCats: 'All Categories',
        sortLabel: 'Sort by:',
        sorts: { newest: 'Newest', priceLow: 'Price: Low to High', priceHigh: 'Price: High to Low', nearest: 'Nearest', rating: 'Highest Rated' },
        noResults: 'No Results Found', noResultsHint: 'Try changing your search criteria',
        showAll: 'Show All Products',
        mapTitle: 'Search by Location',
        locPH: 'Enter area or city name...',
        locBtn: 'Search',
        detectBtn: '📍 Use My Location',
        nearbyTitle: 'Nearby Factories',
        nearbyEmpty: 'Set your location to see nearby factories',
        mapLoading: 'Loading map...',
        contact: 'Contact',
        viewDetails: 'View Details',
        egp: 'EGP',
        reviews: 'reviews',
        km: 'km',
        listings: 'listings available',
        langBtn: 'عربي',
        badges: { new: 'New', featured: 'Featured', offer: 'Offer' },
        cats: { all: 'All', plastic: 'Plastic', metal: 'Metal', paper: 'Paper', glass: 'Glass', wood: 'Wood', textile: 'Textile', chemicals: 'Chemicals', electronics: 'Electronics' },
        loading: 'Loading...',
        error: 'Error loading data'
    },
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
    { key: 'all', icon: BsBoxSeam, catKey: 'all' },
    { key: 'plastic', icon: MdRecycling, catKey: 'plastic' },
    { key: 'metal', icon: FaIndustry, catKey: 'metal' },
    { key: 'paper', icon: BsFileText, catKey: 'paper' },
    { key: 'glass', icon: GiGlassShot, catKey: 'glass' },
    { key: 'wood', icon: GiWoodPile, catKey: 'wood' },
    { key: 'textile', icon: RiTShirtLine, catKey: 'textile' },
    { key: 'chemicals', icon: FaIndustry, catKey: 'chemicals' },
    { key: 'electronic', icon: FaIndustry, catKey: 'electronics' },
];

// ─── STATIC WASTE ITEMS (FALLBACK) ───────────────────────────────────────────
const STATIC_WASTE_ITEMS = [
    { id: 1, titleAr: 'براميل بلاستيك مستعملة', titleEn: 'Used Plastic Barrels', category: 'plastic', companyAr: 'مصنع الدلتا للبتروكيماويات', companyEn: 'Delta Petrochemicals Factory', locAr: 'العاشر من رمضان', locEn: '10th of Ramadan', price: 45, unitAr: 'للبرميل', unitEn: 'per barrel', weightAr: '5 طن متاح', weightEn: '5 tons avail.', rating: 4.7, reviews: 38, descAr: 'براميل HDPE سعة 200 لتر نظيفة وصالحة للإعادة', descEn: '200L HDPE barrels, clean and reusable', badge: 'new', image: plasticWasteImage, lat: 30.31, lng: 31.74 },
    { id: 2, titleAr: 'حديد خردة عالي الجودة', titleEn: 'High Quality Scrap Iron', category: 'metal', companyAr: 'الشركة المصرية للصلب', companyEn: 'Egyptian Steel Company', locAr: 'السادس من أكتوبر', locEn: '6th of October', price: 3200, unitAr: 'للطن', unitEn: 'per ton', weightAr: '20 طن', weightEn: '20 tons', rating: 4.9, reviews: 112, descAr: 'خردة حديد A-grade مناسبة للصهر وإعادة التصنيع', descEn: 'A-grade scrap iron suitable for smelting', badge: 'featured', image: metalWasteImage, lat: 29.97, lng: 30.94 },
    { id: 3, titleAr: 'كرتون ورق مضغوط', titleEn: 'Compressed Paper Cardboard', category: 'paper', companyAr: 'مطابع الجيل الحديث', companyEn: 'Modern Generation Press', locAr: 'مدينة العبور', locEn: 'Obour City', price: 800, unitAr: 'للطن', unitEn: 'per ton', weightAr: '8 طن', weightEn: '8 tons', rating: 4.5, reviews: 61, descAr: 'كرتون مضغوط على شكل بالات جاهز للشحن', descEn: 'Compressed cardboard bales ready for shipping', badge: null, image: paperWasteImage, lat: 30.24, lng: 31.55 },
    { id: 4, titleAr: 'قطع نسيج ومقصورات قماش', titleEn: 'Fabric Pieces & Offcuts', category: 'textile', companyAr: 'شركة نوردانتكس للغزل', companyEn: 'Nordantex Spinning Co.', locAr: 'المحلة الكبرى', locEn: 'El Mahalla El Kubra', price: 1200, unitAr: 'للطن', unitEn: 'per ton', weightAr: '3 طن', weightEn: '3 tons', rating: 4.3, reviews: 27, descAr: 'مقصورات قطن وبوليستر متنوعة', descEn: 'Cotton and polyester offcuts various sizes', badge: 'offer', image: textileWasteImage, lat: 30.97, lng: 31.17 },
    { id: 5, titleAr: 'ألواح خشب وفلين', titleEn: 'Wood Panels & Cork', category: 'wood', companyAr: 'مصنع الخشب المتحد', companyEn: 'United Wood Factory', locAr: 'برج العرب الجديدة', locEn: 'New Borg El Arab', price: 600, unitAr: 'للطن', unitEn: 'per ton', weightAr: '10 طن', weightEn: '10 tons', rating: 4.2, reviews: 19, descAr: 'فلين طبيعي وحبيبات خشب ناعمة للعزل', descEn: 'Natural cork and fine wood chips for insulation', badge: null, image: woodWasteImage, lat: 30.81, lng: 29.68 },
    { id: 6, titleAr: 'زجاج مكسور وملون', titleEn: 'Broken & Colored Glass', category: 'glass', companyAr: 'زجاج مصر للصناعة', companyEn: 'Egypt Glass Industries', locAr: 'العامرية', locEn: 'El Ameria', price: 500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '15 طن', weightEn: '15 tons', rating: 4.0, reviews: 33, descAr: 'شظايا زجاج شفاف وملون صالحة لإعادة الصهر', descEn: 'Transparent and colored glass for remelting', badge: 'new', image: glassWasteImage, lat: 31.19, lng: 29.91 },
    { id: 7, titleAr: 'مواد كيميائية غير خطرة', titleEn: 'Non-Hazardous Chemicals', category: 'chemicals', companyAr: 'الكيماويات الصناعية المصرية', companyEn: 'Egyptian Industrial Chemicals', locAr: 'شبرا الخيمة', locEn: 'Shubra El Kheima', price: 2100, unitAr: 'للطن', unitEn: 'per ton', weightAr: '2 طن', weightEn: '2 tons', rating: 4.6, reviews: 44, descAr: 'مواد كيميائية مصنفة جاهزة للاستخدام الصناعي', descEn: 'Classified chemicals ready for industrial use', badge: 'featured', image: chemicalsImg, lat: 30.13, lng: 31.24 },
    { id: 8, titleAr: 'ألومنيوم وأسلاك معدنية', titleEn: 'Aluminum & Metal Wires', category: 'metal', companyAr: 'مصنع الألومنيوم القاهرة', companyEn: 'Cairo Aluminum Factory', locAr: 'العاشر من رمضان', locEn: '10th of Ramadan', price: 6500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '4 طن', weightEn: '4 tons', rating: 4.8, reviews: 77, descAr: 'ألومنيوم نقي وأسلاك نحاسية جاهزة للتصنيع', descEn: 'Pure aluminum and copper wires for manufacturing', badge: 'featured', image: metalWasteImage, lat: 30.32, lng: 31.76 },
    { id: 9, titleAr: 'بقايا بلاستيك ABS وPVC', titleEn: 'ABS & PVC Plastic Waste', category: 'plastic', companyAr: 'مصنع بلاستيكو مصر', companyEn: 'Plastico Egypt Factory', locAr: 'مدينة نصر', locEn: 'Nasr City', price: 1800, unitAr: 'للطن', unitEn: 'per ton', weightAr: '6 طن', weightEn: '6 tons', rating: 4.4, reviews: 52, descAr: 'بلاستيك ABS وPVC نظيف مناسب للطحن والتصنيع', descEn: 'Clean ABS and PVC plastic for regrinding', badge: null, image: plasticWasteImage, lat: 30.07, lng: 31.33 },
    { id: 10, titleAr: 'أجهزة إلكترونية للتدوير', titleEn: 'Electronics for Recycling', category: 'electronic', companyAr: 'مصنع الأجهزة الحديثة', companyEn: 'Modern Electronics Factory', locAr: 'القاهرة', locEn: 'Cairo', price: 2500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '3 طن', weightEn: '3 tons', rating: 4.5, reviews: 30, descAr: 'أجهزة إلكترونية قديمة صالحة لإعادة التدوير', descEn: 'Old electronics suitable for recycling', badge: 'new', image: electronicsImg, lat: 30.06, lng: 31.24 },
];

// ─── CATEGORY IMAGE FALLBACK ──────────────────────────────────────────────────
const getCategoryFallbackImage = (category) => {
    const map = {
        plastic: plasticWasteImage,
        metal: metalWasteImage,
        paper: paperWasteImage,
        glass: glassWasteImage,
        wood: woodWasteImage,
        textile: textileWasteImage,
        chemicals: chemicalsImg,
        chemical: chemicalsImg,
        electronic: electronicsImg,
        electronics: electronicsImg,
    };
    return map[category] || plasticWasteImage;
};

const FACTORIES = [
    { nameAr: 'مصنع الدلتا للبتروكيماويات', nameEn: 'Delta Petrochemicals', typeAr: 'بتروكيماويات', typeEn: 'Petrochemicals', items: 14, lat: 30.31, lng: 31.74 },
    { nameAr: 'الشركة المصرية للصلب', nameEn: 'Egyptian Steel Co.', typeAr: 'معادن وحديد', typeEn: 'Metal & Steel', items: 8, lat: 29.97, lng: 30.94 },
    { nameAr: 'شركة نوردانتكس للغزل', nameEn: 'Nordantex Spinning', typeAr: 'نسيج وأقمشة', typeEn: 'Textiles', items: 22, lat: 30.97, lng: 31.17 },
    { nameAr: 'الكيماويات الصناعية', nameEn: 'Industrial Chemicals', typeAr: 'كيماويات', typeEn: 'Chemicals', items: 6, lat: 30.13, lng: 31.24 },
    { nameAr: 'مطابع الجيل الحديث', nameEn: 'Modern Generation Press', typeAr: 'ورق وكرتون', typeEn: 'Paper & Cardboard', items: 11, lat: 30.24, lng: 31.55 },
    { nameAr: 'مصنع الألومنيوم القاهرة', nameEn: 'Cairo Aluminum Factory', typeAr: 'معادن ألومنيوم', typeEn: 'Aluminum', items: 5, lat: 30.32, lng: 31.76 },
    { nameAr: 'مصنع بلاستيكو مصر', nameEn: 'Plastico Egypt', typeAr: 'بلاستيك ومطاط', typeEn: 'Plastic & Rubber', items: 19, lat: 30.07, lng: 31.33 },
];

const MAP_STYLE = { width: '100%', height: '320px', borderRadius: '16px' };
const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 };

const getDistKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const Marketplace = ({ user, lang: externalLang, onLangChange }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [lang, setLang] = useState(externalLang || 'ar');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [locationInput, setLocationInput] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [nearbyFactories, setNearbyFactories] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [notification, setNotification] = useState(null);

    // API Data States
    const [apiListings, setApiListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ custom listings من localStorage
    const [customListings, setCustomListings] = useState([]);

    // Fetch data from API
    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const params = new URLSearchParams();

                if (selectedCategory !== 'all') {
                    params.append('category', selectedCategory);
                }
                if (searchTerm) {
                    params.append('search', searchTerm);
                }

                const url = `https://localhost:54464/api/marketplace/waste-listings${params.toString() ? '?' + params.toString() : ''}`;

                const response = await fetch(url, {
                    headers: token ? {
                        'Authorization': `Bearer ${token}`
                    } : {}
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    // Transform API data to match component format
                    const transformedListings = data.data.map(item => ({
                        id: item.id,
                        titleAr: item.titleAr || item.type,
                        titleEn: item.titleEn || item.typeEn,
                        category: item.category,
                        companyAr: item.companyNameAr || item.factoryName,
                        companyEn: item.companyNameEn || item.factoryName,
                        locAr: item.locationAr || item.location,
                        locEn: item.locationEn || item.location,
                        price: item.price,
                        unitAr: item.unitAr || item.unit,
                        unitEn: item.unitEn || item.unit,
                        weightAr: item.weightAr || `${item.amount} ${item.unit}`,
                        weightEn: item.weightEn || `${item.amount} ${item.unit}`,
                        rating: item.rating || 4.5,
                        reviews: item.reviews || 0,
                        descAr: item.descriptionAr || item.description,
                        descEn: item.descriptionEn || item.description,
                        badge: item.badge,
                        image: item.imageUrl || getCategoryFallbackImage(item.category),
                        lat: item.latitude,
                        lng: item.longitude
                    }));

                    setApiListings(transformedListings);
                }
            } catch (err) {
                console.error('Error fetching listings:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, [selectedCategory, searchTerm]);

    useEffect(() => {
        const loadListings = () => {
            try {
                const saved = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
                setCustomListings(saved);
            } catch (e) {
                console.error('Error loading listings:', e);
            }
        };
        loadListings();
        window.addEventListener('focus', loadListings);
        return () => window.removeEventListener('focus', loadListings);
    }, []);

    // ✅ دمج الـ API items مع الـ custom listings
    const ALL_ITEMS = [
        ...apiListings,
        ...customListings.map(item => ({
            ...item,
            image: item.image || getCategoryFallbackImage(item.category),
            unitAr: item.unitAr || item.unit,
            unitEn: item.unitEn || item.unit,
        })),
        ...(apiListings.length === 0 && customListings.length === 0 ? STATIC_WASTE_ITEMS : []), // Fallback only if no data
    ];

    const t = T[lang];

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    });

    useEffect(() => {
        if (externalLang) {
            setLang(externalLang);
        }
    }, [externalLang]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) {
            setSelectedCategory(cat);
        }
    }, [location.search]);

    const toggleLang = () => {
        const next = lang === 'ar' ? 'en' : 'ar';
        setLang(next);
        if (onLangChange) onLangChange(next);
    };

    const showNotif = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    // ✅ فلترة وترتيب ALL_ITEMS
    const filteredItems = ALL_ITEMS
        .filter(item => {
            const catMatch = selectedCategory === 'all' || item.category === selectedCategory;
            const q = searchTerm.toLowerCase();
            const searchMatch = !q ||
                (item.titleAr || '').toLowerCase().includes(q) ||
                (item.titleEn || '').toLowerCase().includes(q) ||
                (item.companyAr || '').toLowerCase().includes(q) ||
                (item.companyEn || '').toLowerCase().includes(q) ||
                (item.descAr || '').toLowerCase().includes(q) ||
                (item.descEn || '').toLowerCase().includes(q);
            return catMatch && searchMatch;
        })
        .sort((a, b) => {
            if (sortBy === 'priceLow') return a.price - b.price;
            if (sortBy === 'priceHigh') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return b.id - a.id;
        });

    const handleCategoryChange = (key) => {
        setSelectedCategory(key);
        key === 'all'
            ? navigate('/market', { replace: true })
            : navigate(`/market?category=${encodeURIComponent(key)}`, { replace: true });
    };

    const getCatCount = (key) =>
        key === 'all' ? ALL_ITEMS.length : ALL_ITEMS.filter(i => i.category === key).length;

    const getCatLabel = (cat) => t.cats[cat.catKey] || cat.key;

    const onMapLoad = useCallback((map) => setMapRef(map), []);

    const updateNearby = (lat, lng) => {
        const sorted = FACTORIES
            .map(f => ({ ...f, dist: getDistKm(lat, lng, f.lat, f.lng) }))
            .sort((a, b) => a.dist - b.dist);
        setNearbyFactories(sorted);
    };

    const detectMyLocation = () => {
        if (!navigator.geolocation) {
            showNotif(lang === 'ar' ? 'المتصفح لا يدعم تحديد الموقع' : 'Geolocation not supported');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude: lat, longitude: lng } }) => {
                setUserLocation({ lat, lng });
                setMapCenter({ lat, lng });
                if (mapRef) mapRef.panTo({ lat, lng });
                updateNearby(lat, lng);
                showNotif(lang === 'ar' ? '✅ تم تحديد موقعك!' : '✅ Location detected!');
            },
            () => {
                updateNearby(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
                showNotif(lang === 'ar' ? '⚠️ تم استخدام موقع افتراضي' : '⚠️ Using default location');
            }
        );
    };

    const handleLocationSearch = () => {
        if (!locationInput.trim()) return;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput + ', Egypt')}&limit=1`)
            .then(r => r.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = parseFloat(data[0].lat), lng = parseFloat(data[0].lon);
                    setMapCenter({ lat, lng });
                    if (mapRef) mapRef.panTo({ lat, lng });
                    updateNearby(lat, lng);
                    showNotif(`📍 ${locationInput}`);
                } else {
                    showNotif(lang === 'ar' ? '❌ الموقع غير موجود' : '❌ Location not found');
                }
            })
            .catch(() => showNotif(lang === 'ar' ? '⚠️ خطأ في الاتصال' : '⚠️ Connection error'));
    };

    const handleContact = async (item) => {
        if (!user) {
            showNotif(lang === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
            navigate('/login');
            return;
        }

        try {
            // Here you would implement contact logic
            showNotif(lang === 'ar'
                ? `📨 جاري التواصل مع ${item.companyAr}`
                : `📨 Contacting ${item.companyEn}`);
        } catch (err) {
            showNotif(lang === 'ar' ? 'حدث خطأ في التواصل' : 'Error contacting seller');
        }
    };

    const FACTORY_ICON = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#10b981" stroke="white" stroke-width="3"/><text x="18" y="24" text-anchor="middle" font-size="16">🏭</text></svg>'
    );
    const USER_ICON = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#3b82f6" stroke="white" stroke-width="3"/></svg>'
    );

    if (isLoading && ALL_ITEMS.length === 0) {
        return (
            <div className="marketplace-loading">
                <div className="loading-spinner"></div>
                <p>{t.loading}</p>
            </div>
        );
    }

    return (
        <div className={`marketplace-page lang-${lang}`} dir={t.dir}>

            {notification && <div className="mp-notification">{notification}</div>}

            {error && (
                <div className="mp-error">
                    <span>{t.error}</span>
                    <button onClick={() => window.location.reload()}>⟳</button>
                </div>
            )}

            <div className="mp-lang-bar">
                <button className="lang-toggle-btn" onClick={toggleLang}>
                    <FiGlobe size={15} />
                    <span>{t.langBtn}</span>
                </button>
            </div>

            {/* ── Hero ── */}
            <section className="marketplace-hero">
                <div className="hero-bg-pattern" />
                <div className="hero-content">
                    <div className="hero-badge">
                        <MdRecycling size={16} />
                        <span>{t.heroBadge}</span>
                    </div>
                    <h1>{t.heroTitle}</h1>
                    <p>{t.heroSub}</p>
                    <div className="hero-search">
                        <div className="search-input-wrapper">
                            <FiSearch className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder={t.searchPH}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="search-button">{t.searchBtn}</button>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="stat-num">{apiListings.length}+</span>
                            <span className="stat-lbl">{t.s1}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-num">380+</span>
                            <span className="stat-lbl">{t.s2}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-num">24</span>
                            <span className="stat-lbl">{t.s3}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-num">98%</span>
                            <span className="stat-lbl">{t.s4}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Category Tabs ── */}
            <div className="categories-tabs">
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.key}
                            className={`tab-item${selectedCategory === cat.key ? ' active' : ''}`}
                            onClick={() => handleCategoryChange(cat.key)}
                        >
                            <Icon size={17} />
                            <span>{getCatLabel(cat)}</span>
                            <span className="tab-count">{getCatCount(cat.key)}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Main Grid ── */}
            <div className="marketplace-main">

                <div className="marketplace-content">
                    <div className="results-header">
                        <div className="results-count">
                            <h2>{t.productsTitle}</h2>
                            <div className="stats">
                                <span className="count-badge">
                                    <FiPackage size={13} />
                                    {filteredItems.length} {t.productUnit}
                                </span>
                                <span className="category-badge">
                                    {selectedCategory === 'all'
                                        ? t.allCats
                                        : getCatLabel(CATEGORIES.find(c => c.key === selectedCategory) || CATEGORIES[0])}
                                </span>
                            </div>
                        </div>
                        <div className="results-controls">
                            <label>{t.sortLabel}</label>
                            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                {Object.entries(t.sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="waste-cards-grid">
                        {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
                            <div
                                key={item.id}
                                className="waste-card"
                                style={{ animationDelay: `${idx * 0.055}s` }}
                                onClick={() => navigate(`/waste-details/${item.id}`)}
                            >
                                {item.badge && (
                                    <span className={`card-badge badge-${item.badge}`}>
                                        {t.badges[item.badge]}
                                    </span>
                                )}
                                <div className="card-img-wrap">
                                    <img
                                        src={item.image}
                                        alt={lang === 'ar' ? item.titleAr : item.titleEn}
                                        onError={(e) => {
                                            e.target.src = getCategoryFallbackImage(item.category);
                                        }}
                                    />
                                </div>
                                <div className="card-body">
                                    <div className="card-cat-tag">
                                        {t.cats[item.category] || item.category}
                                    </div>
                                    <h3 className="card-title">
                                        {lang === 'ar' ? item.titleAr : item.titleEn}
                                    </h3>
                                    <p className="card-desc">
                                        {lang === 'ar' ? item.descAr : item.descEn}
                                    </p>
                                    <div className="card-meta">
                                        <span>
                                            <FiMapPin size={11} />
                                            {lang === 'ar' ? item.locAr : item.locEn}
                                        </span>
                                        <span>
                                            <FaWeightHanging size={11} />
                                            {lang === 'ar' ? item.weightAr : item.weightEn}
                                        </span>
                                    </div>
                                    <div className="card-company">
                                        <FaIndustry size={11} />
                                        {lang === 'ar' ? item.companyAr : item.companyEn}
                                    </div>
                                    <div className="card-rating">
                                        <FiStar size={12} className="star-icon" />
                                        <span>{item.rating}</span>
                                        <span className="reviews-count">
                                            ({item.reviews} {t.reviews})
                                        </span>
                                    </div>
                                    <div className="card-footer">
                                        <div className="card-price">
                                            {Number(item.price).toLocaleString()}
                                            <span className="price-currency"> {t.egp}</span>
                                            <span className="price-unit">
                                                / {lang === 'ar' ? item.unitAr : item.unitEn}
                                            </span>
                                        </div>
                                        <button
                                            className="card-btn"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleContact(item);
                                            }}
                                        >
                                            {t.contact}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="no-results">
                                <div className="no-results-icon"><FiSearch size={52} /></div>
                                <h3>{t.noResults}</h3>
                                <p>{t.noResultsHint}</p>
                                <button className="reset-search-btn"
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSearchTerm('');
                                        navigate('/market', { replace: true });
                                    }}>
                                    {t.showAll}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Sidebar */}
                <aside className="maps-sidebar">
                    <div className="sidebar-panel">
                        <h3 className="sidebar-title">
                            <FiMapPin size={17} />
                            {t.mapTitle}
                        </h3>
                        <div className="location-search">
                            <input
                                type="text"
                                placeholder={t.locPH}
                                value={locationInput}
                                onChange={e => setLocationInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLocationSearch()}
                            />
                            <button onClick={handleLocationSearch}>{t.locBtn}</button>
                        </div>
                        <button className="detect-location-btn" onClick={detectMyLocation}>
                            {t.detectBtn}
                        </button>
                        <div className="map-container">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={MAP_STYLE}
                                    center={mapCenter}
                                    zoom={10}
                                    onLoad={onMapLoad}
                                    options={{
                                        disableDefaultUI: false,
                                        zoomControl: true,
                                        streetViewControl: false,
                                        mapTypeControl: false,
                                        fullscreenControl: false
                                    }}
                                >
                                    {userLocation && (
                                        <Marker
                                            position={userLocation}
                                            icon={{ url: USER_ICON, scaledSize: { width: 24, height: 24 } }}
                                        />
                                    )}
                                    {FACTORIES.map((f, i) => (
                                        <Marker
                                            key={i}
                                            position={{ lat: f.lat, lng: f.lng }}
                                            icon={{ url: FACTORY_ICON, scaledSize: { width: 36, height: 36 } }}
                                            onClick={() => setSelectedMarker(f)}
                                        />
                                    ))}
                                    {selectedMarker && (
                                        <InfoWindow
                                            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                                            onCloseClick={() => setSelectedMarker(null)}
                                        >
                                            <div className="map-infowindow">
                                                <strong>
                                                    {lang === 'ar' ? selectedMarker.nameAr : selectedMarker.nameEn}
                                                </strong>
                                                <span>
                                                    {lang === 'ar' ? selectedMarker.typeAr : selectedMarker.typeEn}
                                                </span>
                                                <span className="iw-count">
                                                    {selectedMarker.items} {lang === 'ar' ? 'إعلان' : 'listings'}
                                                </span>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </GoogleMap>
                            ) : (
                                <div className="map-loading">
                                    <MdRecycling size={30} className="map-loading-icon" />
                                    <span>{t.mapLoading}</span>
                                </div>
                            )}
                        </div>
                        <div className="nearby-factories">
                            <div className="nearby-header">
                                <h4>{t.nearbyTitle}</h4>
                                {nearbyFactories.length > 0 && (
                                    <span className="nearby-count">{nearbyFactories.length}</span>
                                )}
                            </div>
                            {nearbyFactories.length > 0 ? (
                                <ul className="nearby-list">
                                    {nearbyFactories.map((f, i) => (
                                        <li key={i} className="nearby-item"
                                            onClick={() => {
                                                setMapCenter({ lat: f.lat, lng: f.lng });
                                                if (mapRef) mapRef.panTo({ lat: f.lat, lng: f.lng });
                                                setSelectedMarker(f);
                                            }}>
                                            <div className="nearby-item-top">
                                                <span className="nearby-name">
                                                    🏭 {lang === 'ar' ? f.nameAr : f.nameEn}
                                                </span>
                                                <span className="nearby-dist">
                                                    {f.dist < 10 ? f.dist.toFixed(1) : Math.round(f.dist)} {t.km}
                                                </span>
                                            </div>
                                            <div className="nearby-type">
                                                {lang === 'ar' ? f.typeAr : f.typeEn}
                                            </div>
                                            <div className="nearby-items-count">
                                                {f.items} {t.listings}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="nearby-empty">
                                    <FiMapPin size={26} />
                                    <p>{t.nearbyEmpty}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Marketplace;