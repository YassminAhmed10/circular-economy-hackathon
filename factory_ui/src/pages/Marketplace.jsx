// Marketplace.js
import React, { useState, useCallback, useEffect, useRef } from 'react';
import './Marketplace.css';
import { FiSearch, FiMapPin, FiPackage, FiEye, FiStar, FiGlobe } from 'react-icons/fi';
import { MdRecycling } from 'react-icons/md';
import { GiWoodPile, GiGlassShot } from 'react-icons/gi';
import { BsFileText, BsBoxSeam } from 'react-icons/bs';
import { FaIndustry, FaWeightHanging } from 'react-icons/fa';
import { RiTShirtLine } from 'react-icons/ri';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
        mapKeyMissing: 'مفتاح Google Maps غير مضبوط. أضف VITE_GOOGLE_MAPS_API_KEY لعرض الخريطة.',
        mapLoadError: 'تعذر تحميل Google Maps. تحقق من تفعيل Maps JavaScript API وربط المفتاح بالمشروع.',
        contact: 'تواصل',
        viewDetails: 'عرض التفاصيل',
        egp: 'جنيه',
        reviews: 'تقييم',
        km: 'كم',
        listings: 'إعلان متاح',
        langBtn: 'English',
        badges: { new: 'جديد', featured: 'مميز', offer: 'عرض' },
        cats: { all: 'الكل', plastic: 'بلاستيك', metal: 'معادن', paper: 'ورق', glass: 'زجاج', wood: 'خشب', textile: 'نسيج', chemicals: 'كيماويات', electronics: 'إلكترونيات', packaging: 'تغليف مستدام' },
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
        mapKeyMissing: 'Google Maps key is missing. Add VITE_GOOGLE_MAPS_API_KEY to enable the map.',
        mapLoadError: 'Failed to load Google Maps. Check Maps JavaScript API enablement and key project binding.',
        contact: 'Contact',
        viewDetails: 'View Details',
        egp: 'EGP',
        reviews: 'reviews',
        km: 'km',
        listings: 'listings available',
        langBtn: 'عربي',
        badges: { new: 'New', featured: 'Featured', offer: 'Offer' },
        cats: { all: 'All', plastic: 'Plastic', metal: 'Metal', paper: 'Paper', glass: 'Glass', wood: 'Wood', textile: 'Textile', chemicals: 'Chemicals', electronics: 'Electronics', packaging: 'Sustainable Packaging' },
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
    { key: 'electronics', icon: FaIndustry, catKey: 'electronics' },
    { key: 'packaging', icon: BsBoxSeam, catKey: 'packaging' },
];

// ─── STATIC WASTE ITEMS (FALLBACK) ───────────────────────────────────────────
const STATIC_WASTE_ITEMS = [
    // ===== PLASTIC (بلاستيك) =====
    { id: 1, titleAr: 'براميل بلاستيك مستعملة', titleEn: 'Used Plastic Barrels', category: 'plastic', companyAr: 'مصنع الدلتا للبتروكيماويات', companyEn: 'Delta Petrochemicals Factory', locAr: 'العاشر من رمضان', locEn: '10th of Ramadan', price: 45, unitAr: 'للبرميل', unitEn: 'per barrel', weightAr: '5 طن متاح', weightEn: '5 tons avail.', rating: 4.7, reviews: 38, descAr: 'براميل HDPE سعة 200 لتر نظيفة وصالحة للإعادة', descEn: '200L HDPE barrels, clean and reusable', badge: 'new', image: plasticWasteImage, lat: 30.31, lng: 31.74 },
    { id: 9, titleAr: 'بقايا بلاستيك ABS وPVC', titleEn: 'ABS & PVC Plastic Waste', category: 'plastic', companyAr: 'مصنع بلاستيكو مصر', companyEn: 'Plastico Egypt Factory', locAr: 'مدينة نصر', locEn: 'Nasr City', price: 1800, unitAr: 'للطن', unitEn: 'per ton', weightAr: '6 طن', weightEn: '6 tons', rating: 4.4, reviews: 52, descAr: 'بلاستيك ABS وPVC نظيف مناسب للطحن والتصنيع', descEn: 'Clean ABS and PVC plastic for regrinding', badge: null, image: plasticWasteImage, lat: 30.07, lng: 31.33 },
    { id: 12, titleAr: 'زجاجات بلاستيك PET مطحونة', titleEn: 'Ground PET Plastic Bottles', category: 'plastic', companyAr: 'مصنع ريسايكل جديد', companyEn: 'New Recycle Factory', locAr: 'حلوان', locEn: 'Helwan', price: 2200, unitAr: 'للطن', unitEn: 'per ton', weightAr: '8 طن', weightEn: '8 tons', rating: 4.6, reviews: 56, descAr: 'رقائق PET نقية جاهزة للتصنيع من جديد', descEn: 'Pure PET flakes ready for recycling', badge: 'featured', image: plasticWasteImage, lat: 29.85, lng: 31.35 },
    { id: 13, titleAr: 'أكياس بلاستيكية ملونة', titleEn: 'Colored Plastic Bags', category: 'plastic', companyAr: 'شركة الأكياس العملاقة', companyEn: 'Giant Bags Co.', locAr: 'القاهرة', locEn: 'Cairo', price: 950, unitAr: 'للطن', unitEn: 'per ton', weightAr: '12 طن', weightEn: '12 tons', rating: 4.3, reviews: 34, descAr: 'أكياس بلاستيكية متعددة الألوان وأحجام مختلفة', descEn: 'Multi-colored plastic bags in various sizes', badge: null, image: plasticWasteImage, lat: 30.04, lng: 31.36 },

    // ===== METAL (معادن) =====
    { id: 2, titleAr: 'حديد خردة عالي الجودة', titleEn: 'High Quality Scrap Iron', category: 'metal', companyAr: 'الشركة المصرية للصلب', companyEn: 'Egyptian Steel Company', locAr: 'السادس من أكتوبر', locEn: '6th of October', price: 3200, unitAr: 'للطن', unitEn: 'per ton', weightAr: '20 طن', weightEn: '20 tons', rating: 4.9, reviews: 112, descAr: 'خردة حديد A-grade مناسبة للصهر وإعادة التصنيع', descEn: 'A-grade scrap iron suitable for smelting', badge: 'featured', image: metalWasteImage, lat: 29.97, lng: 30.94 },
    { id: 8, titleAr: 'ألومنيوم وأسلاك معدنية', titleEn: 'Aluminum & Metal Wires', category: 'metal', companyAr: 'مصنع الألومنيوم القاهرة', companyEn: 'Cairo Aluminum Factory', locAr: 'العاشر من رمضان', locEn: '10th of Ramadan', price: 6500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '4 طن', weightEn: '4 tons', rating: 4.8, reviews: 77, descAr: 'ألومنيوم نقي وأسلاك نحاسية جاهزة للتصنيع', descEn: 'Pure aluminum and copper wires for manufacturing', badge: 'featured', image: metalWasteImage, lat: 30.32, lng: 31.76 },
    { id: 14, titleAr: 'نحاس ومعادن نفيسة', titleEn: 'Copper & Precious Metals', category: 'metal', companyAr: 'مصنع المعادن النفيسة', companyEn: 'Precious Metals Factory', locAr: 'بورسعيد', locEn: 'Port Said', price: 12500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '2 طن', weightEn: '2 tons', rating: 4.9, reviews: 89, descAr: 'نحاس عالي النقاء مع آثار معادن نفيسة أخرى', descEn: 'High purity copper with other precious metals traces', badge: 'featured', image: metalWasteImage, lat: 31.27, lng: 32.27 },
    { id: 15, titleAr: 'فولاذ مقاوم الصدأ', titleEn: 'Stainless Steel Scrap', category: 'metal', companyAr: 'شركة الفولاذ الحديثة', companyEn: 'Modern Steel Co.', locAr: 'الإسكندرية', locEn: 'Alexandria', price: 8900, unitAr: 'للطن', unitEn: 'per ton', weightAr: '5 طن', weightEn: '5 tons', rating: 4.7, reviews: 63, descAr: 'فولاذ مقاوم للصدأ نظيف وخالي من الشوائب', descEn: 'Clean stainless steel free from impurities', badge: null, image: metalWasteImage, lat: 31.20, lng: 29.92 },

    // ===== PAPER (ورق) =====
    { id: 3, titleAr: 'كرتون ورق مضغوط', titleEn: 'Compressed Paper Cardboard', category: 'paper', companyAr: 'مطابع الجيل الحديث', companyEn: 'Modern Generation Press', locAr: 'مدينة العبور', locEn: 'Obour City', price: 800, unitAr: 'للطن', unitEn: 'per ton', weightAr: '8 طن', weightEn: '8 tons', rating: 4.5, reviews: 61, descAr: 'كرتون مضغوط على شكل بالات جاهز للشحن', descEn: 'Compressed cardboard bales ready for shipping', badge: null, image: paperWasteImage, lat: 30.24, lng: 31.55 },
    { id: 16, titleAr: 'ورق الصحف والمجلات', titleEn: 'Newspaper & Magazine Paper', category: 'paper', companyAr: 'دار الطباعة الكبرى', companyEn: 'Great Printing House', locAr: 'شبرا الخيمة', locEn: 'Shubra El Kheima', price: 650, unitAr: 'للطن', unitEn: 'per ton', weightAr: '10 طن', weightEn: '10 tons', rating: 4.4, reviews: 48, descAr: 'ورق صحف ومجلات نظيف منفصل عن الحبر', descEn: 'Clean newspaper separated from ink', badge: null, image: paperWasteImage, lat: 30.13, lng: 31.24 },
    { id: 17, titleAr: 'صناديق ورق مقوى', titleEn: 'Corrugated Paper Boxes', category: 'paper', companyAr: 'مصنع الصناديق المتحدة', companyEn: 'United Boxes Factory', locAr: 'المنيا', locEn: 'El Minya', price: 1100, unitAr: 'للطن', unitEn: 'per ton', weightAr: '15 طن', weightEn: '15 tons', rating: 4.6, reviews: 71, descAr: 'صناديق ورق مقوى بحالة جيدة', descEn: 'Corrugated cardboard boxes in good condition', badge: 'featured', image: paperWasteImage, lat: 28.12, lng: 30.75 },
    { id: 18, titleAr: 'ورق مكتبي وطباعي', titleEn: 'Office & Printing Paper', category: 'paper', companyAr: 'شركة الورق الذهبي', companyEn: 'Golden Paper Co.', locAr: 'البحيرة', locEn: 'Beheira', price: 1300, unitAr: 'للطن', unitEn: 'per ton', weightAr: '7 طن', weightEn: '7 tons', rating: 4.5, reviews: 55, descAr: 'ورق مكتبي عالي الجودة مع آثار طباعة قليلة', descEn: 'High quality office paper with minimal print traces', badge: null, image: paperWasteImage, lat: 30.72, lng: 30.55 },

    // ===== TEXTILE (نسيج) =====
    { id: 4, titleAr: 'قطع نسيج ومقصورات قماش', titleEn: 'Fabric Pieces & Offcuts', category: 'textile', companyAr: 'شركة نوردانتكس للغزل', companyEn: 'Nordantex Spinning Co.', locAr: 'المحلة الكبرى', locEn: 'El Mahalla El Kubra', price: 1200, unitAr: 'للطن', unitEn: 'per ton', weightAr: '3 طن', weightEn: '3 tons', rating: 4.3, reviews: 27, descAr: 'مقصورات قطن وبوليستر متنوعة', descEn: 'Cotton and polyester offcuts various sizes', badge: 'offer', image: textileWasteImage, lat: 30.97, lng: 31.17 },
    { id: 19, titleAr: 'ملابس قديمة وخرق', titleEn: 'Old Clothes & Rags', category: 'textile', companyAr: 'شركة الملابس المستعملة', companyEn: 'Used Clothing Co.', locAr: 'الفيوم', locEn: 'Fayoum', price: 850, unitAr: 'للطن', unitEn: 'per ton', weightAr: '9 طن', weightEn: '9 tons', rating: 4.2, reviews: 41, descAr: 'ملابس قديمة منفصلة ومصنفة حسب النوع', descEn: 'Separated old clothes sorted by type', badge: null, image: textileWasteImage, lat: 29.31, lng: 30.84 },
    { id: 20, titleAr: 'خيوط وحبال نسيجية', titleEn: 'Textile Threads & Ropes', category: 'textile', companyAr: 'مصنع الخيوط المتقدم', companyEn: 'Advanced Threads Factory', locAr: 'كفر الشيخ', locEn: 'Kafr El Sheikh', price: 1500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '4 طن', weightEn: '4 tons', rating: 4.4, reviews: 35, descAr: 'خيوط نسيجية وحبال من مواد طبيعية', descEn: 'Textile threads and ropes from natural materials', badge: 'featured', image: textileWasteImage, lat: 31.12, lng: 31.12 },

    // ===== WOOD (خشب) =====
    { id: 5, titleAr: 'ألواح خشب وفلين', titleEn: 'Wood Panels & Cork', category: 'wood', companyAr: 'مصنع الخشب المتحد', companyEn: 'United Wood Factory', locAr: 'برج العرب الجديدة', locEn: 'New Borg El Arab', price: 600, unitAr: 'للطن', unitEn: 'per ton', weightAr: '10 طن', weightEn: '10 tons', rating: 4.2, reviews: 19, descAr: 'فلين طبيعي وحبيبات خشب ناعمة للعزل', descEn: 'Natural cork and fine wood chips for insulation', badge: null, image: woodWasteImage, lat: 30.81, lng: 29.68 },
    { id: 21, titleAr: 'نشارة خشب وفتات', titleEn: 'Wood Sawdust & Chips', category: 'wood', companyAr: 'مسطرة الخشب المصرية', companyEn: 'Egyptian Wood Mill', locAr: 'القليوبية', locEn: 'Qalyubia', price: 400, unitAr: 'للطن', unitEn: 'per ton', weightAr: '18 طن', weightEn: '18 tons', rating: 4.1, reviews: 29, descAr: 'نشارة خشب نظيفة من الأخشاب الصلبة', descEn: 'Clean hardwood sawdust', badge: null, image: woodWasteImage, lat: 30.31, lng: 31.18 },
    { id: 22, titleAr: 'بقايا أثاث خشبي', titleEn: 'Wooden Furniture Waste', category: 'wood', companyAr: 'مصنع الأثاث الراقي', companyEn: 'Premium Furniture Factory', locAr: 'القاهرة', locEn: 'Cairo', price: 1800, unitAr: 'للطن', unitEn: 'per ton', weightAr: '6 طن', weightEn: '6 tons', rating: 4.5, reviews: 44, descAr: 'بقايا أثاث خشبي قيمة للحفظ', descEn: 'Valuable wooden furniture waste for preservation', badge: 'featured', image: woodWasteImage, lat: 30.05, lng: 31.28 },

    // ===== GLASS (زجاج) =====
    { id: 6, titleAr: 'زجاج مكسور وملون', titleEn: 'Broken & Colored Glass', category: 'glass', companyAr: 'زجاج مصر للصناعة', companyEn: 'Egypt Glass Industries', locAr: 'العامرية', locEn: 'El Ameria', price: 500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '15 طن', weightEn: '15 tons', rating: 4.0, reviews: 33, descAr: 'شظايا زجاج شفاف وملون صالحة لإعادة الصهر', descEn: 'Transparent and colored glass for remelting', badge: 'new', image: glassWasteImage, lat: 31.19, lng: 29.91 },
    { id: 23, titleAr: 'زجاجات زجاجية شفافة', titleEn: 'Clear Glass Bottles', category: 'glass', companyAr: 'مصنع الزجاجات الشرقي', companyEn: 'Eastern Bottles Factory', locAr: 'السويس', locEn: 'Suez', price: 650, unitAr: 'للطن', unitEn: 'per ton', weightAr: '12 طن', weightEn: '12 tons', rating: 4.3, reviews: 52, descAr: 'زجاجات شفافة نظيفة وجاهزة للصهر', descEn: 'Clean transparent bottles ready for melting', badge: null, image: glassWasteImage, lat: 29.97, lng: 32.55 },
    { id: 24, titleAr: 'نوافذ زجاجية مكسورة', titleEn: 'Broken Window Glass', category: 'glass', companyAr: 'شركة الزجاج الموحدة', companyEn: 'Unified Glass Co.', locAr: 'الجيزة', locEn: 'Giza', price: 450, unitAr: 'للطن', unitEn: 'per ton', weightAr: '8 طن', weightEn: '8 tons', rating: 4.2, reviews: 38, descAr: 'زجاج نوافذ مكسور مع إطارات', descEn: 'Broken window glass with frames', badge: null, image: glassWasteImage, lat: 30.01, lng: 31.20 },

    // ===== CHEMICALS (كيماويات) =====
    { id: 7, titleAr: 'مواد كيميائية غير خطرة', titleEn: 'Non-Hazardous Chemicals', category: 'chemicals', companyAr: 'الكيماويات الصناعية المصرية', companyEn: 'Egyptian Industrial Chemicals', locAr: 'شبرا الخيمة', locEn: 'Shubra El Kheima', price: 2100, unitAr: 'للطن', unitEn: 'per ton', weightAr: '2 طن', weightEn: '2 tons', rating: 4.6, reviews: 44, descAr: 'مواد كيميائية مصنفة جاهزة للاستخدام الصناعي', descEn: 'Classified chemicals ready for industrial use', badge: 'featured', image: chemicalsImg, lat: 30.13, lng: 31.24 },
    { id: 25, titleAr: 'زيوت صناعية مستعملة', titleEn: 'Used Industrial Oils', category: 'chemicals', companyAr: 'شركة الزيوت المعاد تدويرها', companyEn: 'Recycled Oils Co.', locAr: 'أسوان', locEn: 'Aswan', price: 3500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '5 طن', weightEn: '5 tons', rating: 4.7, reviews: 56, descAr: 'زيوت صناعية نقية مع خدمات معالجة', descEn: 'Pure industrial oils with processing services', badge: 'featured', image: chemicalsImg, lat: 24.09, lng: 32.88 },
    { id: 26, titleAr: 'مذيبات كيميائية آمنة', titleEn: 'Safe Chemical Solvents', category: 'chemicals', companyAr: 'مصنع المذيبات الآمن', companyEn: 'Safe Solvents Factory', locAr: 'طنطا', locEn: 'Tanta', price: 2800, unitAr: 'للطن', unitEn: 'per ton', weightAr: '3 طن', weightEn: '3 tons', rating: 4.5, reviews: 41, descAr: 'مذيبات آمنة معتمدة دوليا', descEn: 'Safe solvents internationally certified', badge: null, image: chemicalsImg, lat: 30.79, lng: 31.00 },

    // ===== ELECTRONICS (إلكترونيات) =====
    { id: 10, titleAr: 'أجهزة إلكترونية للتدوير', titleEn: 'Electronics for Recycling', category: 'electronics', companyAr: 'مصنع الأجهزة الحديثة', companyEn: 'Modern Electronics Factory', locAr: 'القاهرة', locEn: 'Cairo', price: 2500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '3 طن', weightEn: '3 tons', rating: 4.5, reviews: 30, descAr: 'أجهزة إلكترونية قديمة صالحة لإعادة التدوير', descEn: 'Old electronics suitable for recycling', badge: 'new', image: electronicsImg, lat: 30.06, lng: 31.24 },
    { id: 27, titleAr: 'لوحات دوائر إلكترونية', titleEn: 'Electronic Circuit Boards', category: 'electronics', companyAr: 'شركة اللوحات الإلكترونية', companyEn: 'Electronic Boards Co.', locAr: 'الإسكندرية', locEn: 'Alexandria', price: 8500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '1.5 طن', weightEn: '1.5 tons', rating: 4.8, reviews: 68, descAr: 'لوحات دائرية إلكترونية عالية القيمة', descEn: 'High-value electronic circuit boards', badge: 'featured', image: electronicsImg, lat: 31.20, lng: 29.92 },
    { id: 28, titleAr: 'أجهزة حاسوب قديمة', titleEn: 'Old Computer Equipment', category: 'electronics', companyAr: 'مصنع تدوير الحواسيب', companyEn: 'Computer Recycling Factory', locAr: 'مدينة نصر', locEn: 'Nasr City', price: 3200, unitAr: 'للطن', unitEn: 'per ton', weightAr: '4 طن', weightEn: '4 tons', rating: 4.4, reviews: 45, descAr: 'حواسيب ديسك وأجهزة محيطية قديمة', descEn: 'Old desktop computers and peripherals', badge: null, image: electronicsImg, lat: 30.07, lng: 31.33 },

    // ===== SUSTAINABLE PACKAGING (تغليف مستدام) =====
    { id: 11, titleAr: 'علب تغليف مستدامة ECO', titleEn: 'Sustainable ECO Packaging Boxes', category: 'packaging', companyAr: 'مصنع التغليف الأخضر', companyEn: 'Green Packaging Factory', locAr: 'القاهرة', locEn: 'Cairo', price: 4500, unitAr: 'للطن', unitEn: 'per ton', weightAr: '3 طن', weightEn: '3 tons', rating: 4.7, reviews: 42, descAr: 'علب تغليف بيودجرادبل وصديقة للبيئة، مناسبة لجميع الصناعات', descEn: 'Biodegradable and eco-friendly packaging boxes suitable for all industries', badge: 'new', image: plasticWasteImage, lat: 30.05, lng: 31.25 },
    { id: 29, titleAr: 'أكياس ورقية بيئية', titleEn: 'Eco-Friendly Paper Bags', category: 'packaging', companyAr: 'مصنع الأكياس الخضراء', companyEn: 'Green Bags Factory', locAr: 'المنوفية', locEn: 'Monufia', price: 3200, unitAr: 'للطن', unitEn: 'per ton', weightAr: '5 طن', weightEn: '5 tons', rating: 4.6, reviews: 53, descAr: 'أكياس ورقية قابلة للتحلل مطبوعة حسب الطلب', descEn: 'Biodegradable paper bags custom printed', badge: 'featured', image: paperWasteImage, lat: 30.49, lng: 30.96 },
    { id: 30, titleAr: 'شرائط وفيلم حماية ايكو', titleEn: 'ECO Protective Films & Tapes', category: 'packaging', companyAr: 'شركة الفيلم البيئي', companyEn: 'Eco Films Co.', locAr: 'القليوبية', locEn: 'Qalyubia', price: 5800, unitAr: 'للطن', unitEn: 'per ton', weightAr: '2 طن', weightEn: '2 tons', rating: 4.8, reviews: 59, descAr: 'أفلام حماية قابلة للتحلل البيولوجي', descEn: 'Biodegradable protective films and tapes', badge: 'featured', image: plasticWasteImage, lat: 30.31, lng: 31.18 },
    { id: 31, titleAr: 'صناديق ورق مقوى بيئي', titleEn: 'ECO Corrugated Cardboard Boxes', category: 'packaging', companyAr: 'مصنع الصناديق الأخضر', companyEn: 'Green Boxes Factory', locAr: 'الدقهلية', locEn: 'Dakahlia', price: 2900, unitAr: 'للطن', unitEn: 'per ton', weightAr: '8 طن', weightEn: '8 tons', rating: 4.5, reviews: 48, descAr: 'صناديق معاد تدويرها وقابلة للتحلل نسبة عالية', descEn: 'Recycled biodegradable cardboard boxes high efficiency', badge: null, image: paperWasteImage, lat: 31.03, lng: 31.43 },
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
        packaging: plasticWasteImage,
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
    { nameAr: 'مصنع التغليف الأخضر', nameEn: 'Green Packaging Factory', typeAr: 'تغليف مستدام', typeEn: 'Sustainable Packaging', items: 7, lat: 30.05, lng: 31.25 },
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
    const mapRef = useRef(null);
    const [notification, setNotification] = useState(null);

    // API Data States
    const [apiListings, setApiListings] = useState([]);
    const [allApiListings, setAllApiListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ custom listings من localStorage
    const [customListings, setCustomListings] = useState([]);

    // Fetch FULL unfiltered API data for accurate category counts
    useEffect(() => {
        const fetchAllListings = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetch with large pageSize to get all items (pageSize=100 to cover 81 items)
                const url = 'https://localhost:54464/api/marketplace/waste-listings?page=1&pageSize=100';
                
                const response = await fetch(url, {
                    headers: token ? {
                        'Authorization': `Bearer ${token}`
                    } : {}
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ Full API data received: ${data.data?.length} items`, data);
                    
                    if (data.success && data.data && data.data.length > 0) {
                        setAllApiListings(data.data);
                        console.log(`✅ Loaded ${data.data.length} listings from database for counting`);
                    } else {
                        console.warn('No data received, falling back to static items');
                        setAllApiListings(STATIC_WASTE_ITEMS);
                    }
                } else {
                    console.log('API response not ok, using static data');
                    setAllApiListings(STATIC_WASTE_ITEMS);
                }
            } catch (err) {
                console.log('Could not fetch full listings from API, using static:', err);
                setAllApiListings(STATIC_WASTE_ITEMS);
            }
        };
        
        fetchAllListings();
    }, []); // Only fetch once on mount

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
                console.log('API Response Data:', data);

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
                // Use static data as fallback
                console.log('Using fallback static data - Total items:', STATIC_WASTE_ITEMS.length);
                setApiListings(STATIC_WASTE_ITEMS);
                setError(null);
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

    console.log('ALL_ITEMS:', {
        apiListingsCount: apiListings.length,
        customListingsCount: customListings.length,
        staticItemsCount: STATIC_WASTE_ITEMS.length,
        totalItemsCount: ALL_ITEMS.length
    });

    const t = T[lang];
    const googleMapsApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
    const hasGoogleMapsKey = googleMapsApiKey.length > 0;
    const [mapLoadError, setMapLoadError] = useState(false);

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

    const getCatCount = (key) => {
        // Count from actual API database, not static fallback
        const sourceData = allApiListings.length > 0 ? allApiListings : STATIC_WASTE_ITEMS;
        
        // Extract category property correctly
        const items = sourceData.map(item => ({
            category: item.category
        }));
        
        const count = key === 'all' 
            ? items.length 
            : items.filter(i => i.category === key).length;
            
        console.log(`Category '${key}': ${count} (from database: ${allApiListings.length > 0}, total available: ${sourceData.length})`);
        return count;
    };

    const getCatLabel = (cat) => t.cats[cat.catKey] || cat.key;

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
                if (mapRef.current) mapRef.current.setView([lat, lng], 10);
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
                    if (mapRef.current) mapRef.current.setView([lat, lng], 10);
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
                            <span className="stat-num">380+</span>
                            <span className="stat-lbl">{t.s1}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-num">24</span>
                            <span className="stat-lbl">{t.s2}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-num">98%</span>
                            <span className="stat-lbl">{t.s3}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-num">4.8/5</span>
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
                            <MapContainer center={mapCenter} zoom={10} style={{ width: '100%', height: '320px', borderRadius: '16px' }} ref={mapRef}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                />
                                {userLocation && (
                                    <Marker position={[userLocation.lat, userLocation.lng]}>
                                        <Popup>{lang === 'ar' ? 'موقعك الحالي' : 'Your Location'}</Popup>
                                    </Marker>
                                )}
                                {FACTORIES.map((f, i) => (
                                    <Marker 
                                        key={i} 
                                        position={[f.lat, f.lng]}
                                        eventHandlers={{
                                            click: () => setSelectedMarker(f),
                                        }}
                                    >
                                        <Popup>
                                            <div style={{ minWidth: '150px' }}>
                                                <strong>{lang === 'ar' ? f.nameAr : f.nameEn}</strong>
                                                <br />
                                                <small>{lang === 'ar' ? f.typeAr : f.typeEn}</small>
                                                <br />
                                                <small>{f.items} {lang === 'ar' ? 'إعلان' : 'listings'}</small>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
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
                                                if (mapRef.current) mapRef.current.setView([f.lat, f.lng], 10);
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