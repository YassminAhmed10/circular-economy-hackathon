// Marketplace.jsx (FULL FIXED VERSION)
import React, { useState, useCallback, useEffect } from 'react';
import './Marketplace.css';
import 'leaflet/dist/leaflet.css';
import { FiSearch, FiMapPin, FiPackage, FiEye, FiStar, FiGlobe, FiX } from 'react-icons/fi';
import { MdRecycling } from 'react-icons/md';
import { GiWoodPile, GiGlassShot } from 'react-icons/gi';
import { BsFileText, BsBoxSeam } from 'react-icons/bs';
import { FaIndustry, FaWeightHanging } from 'react-icons/fa';
import { RiTShirtLine } from 'react-icons/ri';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { createMarketplaceOrder, requestRecycler, getSuitableRecyclers } from '../services/circularEconomyApi';
import en from '../locales/en.json';
import arTrans from '../locales/ar.json';

import paperWasteImage from '../assets/مخلفات الورق.png';
import plasticWasteImage from '../assets/مخلفات البلاستيك.png';
import woodWasteImage from '../assets/مخلفات الخشب.png';
import metalWasteImage from '../assets/مخلفات المعادن.png';
import glassWasteImage from '../assets/مخلفات الزجاج.png';
import textileWasteImage from '../assets/مخلفات النسيج.png';
import chemicalsImg from '../assets/Chemicals.png';
import electronicsImg from '../assets/Electronics .png';

import { 
    WASTE_TYPES, 
    WASTE_SUBTYPES, 
    CONTAMINATION_LEVELS, 
    RECYCLABILITY_TYPES,
    getSubTypesForType,
    getWasteTypeName,
    getWasteSubTypeName,
    getContaminationLevelName,
    getRecyclabilityTypeName
} from '../data/wasteClassification';

// ✅ Category fallback images - used when item has no uploaded image
const getCategoryFallback = (cat) => ({
    plastic:    plasticWasteImage,
    metal:      metalWasteImage,
    paper:      paperWasteImage,
    glass:      glassWasteImage,
    wood:       woodWasteImage,
    textile:    textileWasteImage,
    chemicals:  chemicalsImg,
    chemical:   chemicalsImg,
    electronic: electronicsImg,
    electronics:electronicsImg,
}[cat?.toLowerCase()] || plasticWasteImage);

// ✅ Helper: is this item from localStorage (timestamp-based ID) or from DB?
const isLocalStorageItem = (item) => Number(item.id) > 1_000_000_000_000;

// ✅ Helper: detect corrupted/garbled listings with encoding issues (Arabic text showing as ????)
const isCorruptedListing = (item) => {
    const fieldsToCheck = [item.type, item.titleAr, item.descriptionAr, item.companyNameAr, item.locationAr];
    // If >50% of a field is question marks, it's corrupted
    return fieldsToCheck.some(field => {
        if (!field || typeof field !== 'string') return false;
        const questionCount = (field.match(/\?/g) || []).length;
        return questionCount > field.length * 0.3; // More than 30% question marks = corrupted
    });
};

// ✅ Helper: create a content signature for duplicate detection
// Checks: title (Ar/En), company (Ar/En), category, price
const getContentSignature = (item) => {
    const normalize = (str) => (str || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
    const titleKey  = normalize(item.titleAr || item.titleEn || '');
    const companyKey = normalize(item.companyAr || item.companyEn || '');
    const category = (item.category || '').toString().toLowerCase();
    const price = Number(item.price) || 0;
    return `${titleKey}|${companyKey}|${category}|${price}`;
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
    ar: arTrans.ar,
    en: en.en
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
    { key: 'all',       icon: BsBoxSeam,   catKey: 'all'        },
    { key: 'plastic',   icon: MdRecycling, catKey: 'plastic'    },
    { key: 'metal',     icon: FaIndustry,  catKey: 'metal'      },
    { key: 'paper',     icon: BsFileText,  catKey: 'paper'      },
    { key: 'glass',     icon: GiGlassShot, catKey: 'glass'      },
    { key: 'wood',      icon: GiWoodPile,  catKey: 'wood'       },
    { key: 'textile',   icon: RiTShirtLine,catKey: 'textile'    },
    { key: 'electronic',icon: FaIndustry,  catKey: 'electronics'},
];

const FACTORIES = [
    { nameAr: 'مصنع الدلتا للبتروكيماويات', nameEn: 'Delta Petrochemicals',    typeAr: 'بتروكيماويات',   typeEn: 'Petrochemicals', items: 14, lat: 30.31, lng: 31.74 },
    { nameAr: 'الشركة المصرية للصلب',        nameEn: 'Egyptian Steel Co.',      typeAr: 'معادن وحديد',    typeEn: 'Metal & Steel',  items: 8,  lat: 29.97, lng: 30.94 },
    { nameAr: 'شركة نوردانتكس للغزل',        nameEn: 'Nordantex Spinning',      typeAr: 'نسيج وأقمشة',    typeEn: 'Textiles',       items: 22, lat: 30.97, lng: 31.17 },
    { nameAr: 'الكيماويات الصناعية',          nameEn: 'Industrial Chemicals',    typeAr: 'كيماويات',       typeEn: 'Chemicals',      items: 6,  lat: 30.13, lng: 31.24 },
    { nameAr: 'مطابع الجيل الحديث',           nameEn: 'Modern Generation Press', typeAr: 'ورق وكرتون',     typeEn: 'Paper',          items: 11, lat: 30.24, lng: 31.55 },
    { nameAr: 'مصنع الألومنيوم القاهرة',      nameEn: 'Cairo Aluminum Factory',  typeAr: 'معادن ألومنيوم', typeEn: 'Aluminum',       items: 5,  lat: 30.32, lng: 31.76 },
    { nameAr: 'مصنع بلاستيكو مصر',           nameEn: 'Plastico Egypt',          typeAr: 'بلاستيك ومطاط',  typeEn: 'Plastic',        items: 19, lat: 30.07, lng: 31.33 },
];

const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 };

const getDistKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const Marketplace = ({ user, lang: externalLang, onLangChange }) => {
    const navigate  = useNavigate();
    const location  = useLocation();

    const [lang, setLang]                     = useState(externalLang || 'en');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm]         = useState('');
    const [sortBy, setSortBy]                 = useState('newest');
    const [mapCenter, setMapCenter]           = useState(DEFAULT_CENTER);
    const [locationInput, setLocationInput]   = useState('');
    const [userLocation, setUserLocation]     = useState(null);
    const [nearbyFactories, setNearbyFactories] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapRef, setMapRef]                 = useState(null);
    const [notification, setNotification]     = useState(null);
    const [mapLoadError, setMapLoadError]     = useState(false);

    const [apiListings, setApiListings]       = useState([]);
    const [isLoading, setIsLoading]           = useState(true);
    const [error, setError]                   = useState(null);
    const [customListings, setCustomListings] = useState([]);

    const [filterWasteType, setFilterWasteType]               = useState(null);
    const [filterWasteSubType, setFilterWasteSubType]         = useState(null);
    const [filterContaminationLevel, setFilterContaminationLevel] = useState(null);
    const [availableSubTypes, setAvailableSubTypes]           = useState([]);
    const [filterRecyclability, setFilterRecyclability]       = useState(null);
    const [onlyReusable, setOnlyReusable]                     = useState(false);
    const [onlyFoodContact, setOnlyFoodContact]               = useState(false);

    const [showBidModal, setShowBidModal]     = useState(false);
    const [selectedItem, setSelectedItem]     = useState(null);
    const [bidFormData, setBidFormData]       = useState({ usageType: 'directUse', offeredPrice: 0, selectedRecycler: null, notes: '' });
    const [recyclersList, setRecyclersList]   = useState([]);
    const [submittingBid, setSubmittingBid]   = useState(false);

    // ── Fetch API listings ────────────────────────────────────────────────────
    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token  = localStorage.getItem('token');
                const params = new URLSearchParams();
                if (selectedCategory !== 'all') params.append('category', selectedCategory);
                if (searchTerm)                 params.append('search',   searchTerm);

                const url = `https://localhost:54464/api/marketplace/waste-listings${params.toString() ? '?' + params.toString() : ''}`;
                const response = await fetch(url, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                if (data.success) {
                    // Handle new API response structure with Items array
                    const listings = Array.isArray(data.data) ? data.data : (data.data?.Items || []);
                    const transformed = listings.map(item => ({
                        id:        String(item.id).trim(),
                        title:     item.title || item.titleEn || item.type,
                        titleEn:   item.title || item.titleEn || item.typeEn,
                        titleAr:   item.titleAr || item.type,
                        category:  item.category,
                        company:   item.companyName || item.companyNameEn || item.factoryName,
                        companyEn: item.companyName || item.companyNameEn || item.factoryName,
                        companyAr: item.companyNameAr || item.factoryName,
                        location:  item.location || item.locationEn || item.location,
                        locEn:     item.location || item.locationEn || item.location,
                        locAr:     item.locationAr || item.location,
                        price:     item.price,
                        unit:      item.unit || item.unitEn,
                        unitEn:    item.unit || item.unitEn,
                        unitAr:    item.unitAr || item.unit,
                        weight:    item.weight || item.weightEn || `${item.amount} ${item.unit}`,
                        weightEn:  item.weightEn || `${item.amount} ${item.unit}`,
                        weightAr:  item.weightAr || `${item.amount} ${item.unit}`,
                        reservedAmount: item.reservedAmount || 0,
                        amount:    item.amount || 0,
                        rating:    item.rating   || 4.5,
                        reviews:   item.reviews  || 0,
                        description: item.description || item.descriptionEn,
                        descEn:    item.description || item.descriptionEn,
                        descAr:    item.descriptionAr || item.description,
                        badge:     item.badge,
                        image:     item.imageUrl || getCategoryFallback(item.category),
                        lat:       item.latitude,
                        lng:       item.longitude,
                        listingId: item.listingId,
                        factoryId: item.factoryId,
                        status:    item.status || 'Active',
                        createdAt: Date.parse(item.createdAt || item.CreatedAt) || Number(item.id),
                        seller: item.seller || {
                            name: item.companyName || item.factoryName,
                            registrationNumber: item.registrationNumber,
                            taxNumber: item.taxNumber,
                            verified: item.isVerified,
                            rating: item.rating || 4.5,
                            totalSales: item.totalSales,
                            joined: item.establishmentYear,
                            whatsapp: item.phone,
                            email: item.email,
                            employees: item.employees,
                            specialties: item.specialties,
                            certifications: item.certifications,
                            location: item.location,
                        }
                    }));
                    setApiListings(transformed);
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

    // ✅ Listen for order creation and refresh listings
    useEffect(() => {
        const handleOrderCreated = (event) => {
            console.log('📦 Order created event detected, refreshing marketplace listings...');
            // Refresh API listings to update quantities
            const fetchListings = async () => {
                const token  = localStorage.getItem('token');
                const params = new URLSearchParams();
                if (selectedCategory !== 'all') params.append('category', selectedCategory);
                if (searchTerm) params.append('search', searchTerm);

                try {
                    const url = `https://localhost:54464/api/marketplace/waste-listings${params.toString() ? '?' + params.toString() : ''}`;
                    const response = await fetch(url, { 
                        headers: token ? { 'Authorization': `Bearer ${token}` } : {} 
                    });
                    const data = await response.json();
                    if (data.success) {
                        setApiListings(data.data || []);
                        console.log('✅ Marketplace listings refreshed');
                    }
                } catch (err) {
                    console.error('❌ Failed to refresh listings:', err);
                }
            };
            fetchListings();
        };

        window.addEventListener('orderCreated', handleOrderCreated);
        return () => window.removeEventListener('orderCreated', handleOrderCreated);
    }, [selectedCategory, searchTerm]);

    // ── Load localStorage listings ────────────────────────────────────────────
    useEffect(() => {
        const loadListings = () => {
            try {
                const raw  = localStorage.getItem('ecov_listings');
                const saved = JSON.parse(raw || '[]');

                const withAbsoluteUrls = saved.map(item => {
                    let image  = item.image;
                    let images = item.images || [];

                    if (image && typeof image === 'string' && image.startsWith('/')) {
                        image = `https://localhost:54464${image}`;
                    }
                    images = images.map(img =>
                        img && typeof img === 'string' && img.startsWith('/')
                            ? `https://localhost:54464${img}`
                            : img
                    );

                    // ✅ fallback to category image if no uploaded image
                    if (!image && images.length > 0) image = images[0];
                    if (!image) image = getCategoryFallback(item.category);

                    return { ...item, image, images };
                });
                    // Ensure localStorage items carry a createdAt timestamp (fallback to id)
                    // 🔧 Normalize IDs to strings for consistent deduplication
                    const withDates = withAbsoluteUrls.map(i => ({
                        ...i,
                        id: String(i.id).trim(),  // Normalize to string
                        createdAt: Date.parse(i.createdAt || i.createdAtUtc || i.CreatedAt) || Number(i.id)
                    }));

                    setCustomListings(withDates);
            } catch (e) {
                console.error('Error loading listings:', e);
                setCustomListings([]);
            }
        };
        loadListings();
        window.addEventListener('focus', loadListings);
        return () => window.removeEventListener('focus', loadListings);
    }, []);

    // ── Merge API + localStorage ──────────────────────────────────────────────
    const ALL_ITEMS = (() => {
        const combined = [
            ...apiListings,
            ...customListings.map(item => ({
                ...item,
                unitAr: item.unitAr || item.unit,
                unitEn: item.unitEn || item.unit,
            })),
        ];
        
        // 🚫 Remove duplicates by ID and content signature
        const seenIds = new Set();
        const seenSignatures = new Set();
        
        return combined.filter(item => {
            const normalizedId = String(item.id).trim();
            const contentSig = getContentSignature(item);
            
            if (seenIds.has(normalizedId)) {
                console.log(`🔄 Duplicate ID found and filtered: ${normalizedId} (${item.titleAr || item.titleEn})`);
                return false;
            }
            
            if (seenSignatures.has(contentSig)) {
                console.log(`🔄 Duplicate content found and filtered: ${item.titleAr || item.titleEn} from ${item.companyAr || item.companyEn}`);
                return false;
            }
            
            seenIds.add(normalizedId);
            seenSignatures.add(contentSig);
            return true;
        });
    })();

    console.log('📊 Final ALL_ITEMS:', ALL_ITEMS.length, 'items');
    console.log('  - API listings:', apiListings.length);
    console.log('  - Custom listings:', customListings.length);
    
    // Debug: show ID types and values
    if (ALL_ITEMS.length > 0) {
        console.log('🔍 Sample IDs from ALL_ITEMS:');
        ALL_ITEMS.slice(0, 3).forEach(item => {
            console.log(`   - ${item.titleAr || item.titleEn}: ID=${item.id} (type: ${typeof item.id})`);
        });
    }

    const t = T[lang] || T['en'];
    
    // ✅ FIX: Safely get category label with fallback
    const getCategoryLabel = (categoryKey) => {
        if (!t || !t.cats) {
            // Fallback labels if translations aren't loaded
            const fallbacks = {
                'plastic': 'Plastic',
                'metal': 'Metal', 
                'paper': 'Paper',
                'glass': 'Glass',
                'wood': 'Wood',
                'textile': 'Textile',
                'electronic': 'Electronics',
                'electronics': 'Electronics'
            };
            return fallbacks[categoryKey] || categoryKey;
        }
        return t.cats[categoryKey] || categoryKey;
    };

    // Leaflet markers
    const markerIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });

    useEffect(() => { if (externalLang) setLang(externalLang); }, [externalLang]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat    = params.get('category');
        if (cat) setSelectedCategory(cat);
    }, [location.search]);

    useEffect(() => {
        if (filterWasteType) {
            setAvailableSubTypes(getSubTypesForType(filterWasteType));
            setFilterWasteSubType(null);
        } else {
            setAvailableSubTypes([]);
            setFilterWasteSubType(null);
        }
    }, [filterWasteType]);

    const toggleLang  = () => { const next = lang === 'ar' ? 'en' : 'ar'; setLang(next); if (onLangChange) onLangChange(next); };
    const showNotif   = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

    // ── Filter & sort ─────────────────────────────────────────────────────────
    const filteredItems = ALL_ITEMS
        .filter(item => {
            // 🚫 Remove corrupted listings with garbled Arabic text
            if (isCorruptedListing(item)) {
                console.warn('🗑️ Filtering out corrupted listing:', item.id, item.titleAr);
                return false;
            }

            // Hide deleted / non-active listings
            const st = item.listingStatus || item.status || 'Active';
            if (st === 'Deleted' || st === 'deleted') return false;

            // ✅ Only hide localStorage items that have NO image at all
            // (DB items always show — they get a category fallback above)
            if (isLocalStorageItem(item) && !item.image) return false;

            const catMatch    = selectedCategory === 'all' || item.category === selectedCategory;
            const q           = searchTerm.toLowerCase();
            const searchMatch = !q ||
                (item.titleAr   || '').toLowerCase().includes(q) ||
                (item.titleEn   || '').toLowerCase().includes(q) ||
                (item.companyAr || '').toLowerCase().includes(q) ||
                (item.companyEn || '').toLowerCase().includes(q) ||
                (item.descAr    || '').toLowerCase().includes(q) ||
                (item.descEn    || '').toLowerCase().includes(q);

            const wasteTypeMatch        = !filterWasteType          || item.wasteTypeId          === filterWasteType;
            const wasteSubTypeMatch     = !filterWasteSubType        || item.wasteSubTypeId        === filterWasteSubType;
            const contaminationMatch    = !filterContaminationLevel  || item.contaminationLevelId  === filterContaminationLevel;
            const recyclabilityMatch    = !filterRecyclability       || item.recyclability         === filterRecyclability;
            const reusableMatch         = !onlyReusable  || item.recyclability === 'Reusable' || item.reusable === true;
            const foodContactMatch      = !onlyFoodContact || item.foodContact === true;

            return catMatch && searchMatch && wasteTypeMatch && wasteSubTypeMatch && contaminationMatch && recyclabilityMatch && reusableMatch && foodContactMatch;
        })
        .sort((a, b) => {
            if (sortBy === 'priceLow')  return a.price - b.price;
            if (sortBy === 'priceHigh') return b.price - a.price;
            if (sortBy === 'rating')    return (b.rating || 0) - (a.rating || 0);
            // Sort by created date when available (newest first). Fall back to id.
            const aDate = Number(a.createdAt || a.id || 0);
            const bDate = Number(b.createdAt || b.id || 0);
            return bDate - aDate;
        });

    const handleCategoryChange = (key) => {
        setSelectedCategory(key);
        key === 'all'
            ? navigate('/market', { replace: true })
            : navigate(`/market?category=${encodeURIComponent(key)}`, { replace: true });
    };

    const getCatCount = (key) => ALL_ITEMS.filter(i => {
        // 🚫 Remove corrupted listings with garbled Arabic text
        if (isCorruptedListing(i)) return false;
        
        const st = i.listingStatus || i.status || 'Active';
        if (st === 'Deleted' || st === 'deleted') return false;
        if (isLocalStorageItem(i) && !i.image) return false;
        const catMatch    = key === 'all' || i.category === key;
        const q           = searchTerm.toLowerCase();
        const searchMatch = !q ||
            (i.titleAr || '').toLowerCase().includes(q) ||
            (i.titleEn || '').toLowerCase().includes(q) ||
            (i.companyAr || '').toLowerCase().includes(q) ||
            (i.companyEn || '').toLowerCase().includes(q);
        return catMatch && searchMatch;
    }).length;

    const getCatLabel = (cat) => {
        if (!t || !t.cats) return cat.key;
        return t.cats[cat.catKey] || cat.key;
    };

    const updateNearby = (lat, lng) => {
        setNearbyFactories(
            FACTORIES.map(f => ({ ...f, dist: getDistKm(lat, lng, f.lat, f.lng) }))
                     .sort((a, b) => a.dist - b.dist)
        );
    };

    const detectMyLocation = () => {
        if (!navigator.geolocation) { showNotif(lang === 'ar' ? 'المتصفح لا يدعم تحديد الموقع' : 'Geolocation not supported'); return; }
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude: lat, longitude: lng } }) => {
                setUserLocation({ lat, lng }); setMapCenter({ lat, lng });
                if (mapRef) mapRef.panTo({ lat, lng });
                updateNearby(lat, lng);
                showNotif(lang === 'ar' ? '✅ تم تحديد موقعك!' : '✅ Location detected!');
            },
            () => { updateNearby(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng); showNotif(lang === 'ar' ? '⚠️ تم استخدام موقع افتراضي' : '⚠️ Using default location'); }
        );
    };

    const handleLocationSearch = () => {
        if (!locationInput.trim()) return;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput + ', Egypt')}&limit=1`)
            .then(r => r.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = parseFloat(data[0].lat), lng = parseFloat(data[0].lon);
                    setMapCenter({ lat, lng }); if (mapRef) mapRef.panTo({ lat, lng });
                    updateNearby(lat, lng); showNotif(`📍 ${locationInput}`);
                } else showNotif(lang === 'ar' ? '❌ الموقع غير موجود' : '❌ Location not found');
            })
            .catch(() => showNotif(lang === 'ar' ? '⚠️ خطأ في الاتصال' : '⚠️ Connection error'));
    };

    const handleContact = (item) => {
        if (!user) { showNotif(lang === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first'); navigate('/login'); return; }
        navigate(`/waste-details/${item.id}`);
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        if (!selectedItem || !user?.factoryId) { showNotif(lang === 'ar' ? 'خطأ: تحقق من البيانات' : 'Error: Check your data'); return; }
        setSubmittingBid(true);
        try {
            const orderResponse = await createMarketplaceOrder({
                buyerId: user.factoryId, wasteListingId: selectedItem.id,
                quantity: selectedItem.weightEn?.match(/\d+/)?.[0] || 1,
                offeredPrice: bidFormData.offeredPrice, notes: bidFormData.notes,
                status: 'Pending', usageType: bidFormData.usageType
            });
            if (orderResponse?.success) {
                if (bidFormData.usageType === 'sendToRecycler' && bidFormData.selectedRecycler) {
                    await requestRecycler({ orderId: orderResponse.data?.orderId, recyclerId: bidFormData.selectedRecycler, wasteType: selectedItem.category, quantity: selectedItem.weightEn?.match(/\d+/)?.[0] || 1 });
                }
                showNotif(t.bidModal?.success || (lang === 'ar' ? 'تم إرسال العرض بنجاح' : 'Bid submitted successfully')); 
                setShowBidModal(false); 
                setSelectedItem(null);
            } else showNotif(orderResponse?.error || (lang === 'ar' ? 'خطأ في إرسال العرض' : 'Error submitting bid'));
        } catch (err) {
            console.error('Bid error:', err);
            showNotif(lang === 'ar' ? 'خطأ في إرسال العرض' : 'Error submitting bid');
        } finally { setSubmittingBid(false); }
    };

    // ✅ Expose diagnostic info to browser console for deduplication testing
    useEffect(() => {
        window.marketplaceDiagnostics = {
            allItems: ALL_ITEMS,
            apiListingsCount: apiListings.length,
            customListingsCount: customListings.length,
            filteredItemsCount: filteredItems.length,
            petPlasticListings: ALL_ITEMS.filter(i => 
                (i.titleAr?.includes('بلاستيك') || i.titleEn?.toLowerCase().includes('plastic')) &&
                (i.titleAr?.includes('حيوان') || i.titleEn?.toLowerCase().includes('pet'))
            ),
            checkDuplicateIds: () => {
                const ids = ALL_ITEMS.map(i => i.id);
                const set = new Set(ids);
                return {
                    totalItems: ids.length,
                    uniqueIds: set.size,
                    duplicates: ids.length - set.size,
                    isDuplicated: ids.length !== set.size
                };
            },
            showAllItems: () => {
                console.log('📋 All Items:');
                ALL_ITEMS.forEach(i => console.log(`  [${i.id}] ${i.titleAr || i.titleEn}`));
            }
        };
        console.log('🔧 Marketplace diagnostics available: window.marketplaceDiagnostics');
    }, [ALL_ITEMS, apiListings, customListings, filteredItems]);

    if (isLoading && ALL_ITEMS.length === 0) {
        return (
            <div className="marketplace-loading">
                <div className="loading-spinner"></div>
                <p>{t.loading || (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')}</p>
            </div>
        );
    }

    return (
        <div className={`marketplace-page lang-${lang}`} dir={t.dir}>

            {notification && <div className="mp-notification">{notification}</div>}
            {error && (
                <div className="mp-error">
                    <span>{t.error || (lang === 'ar' ? 'حدث خطأ' : 'Error')}</span>
                    <button onClick={() => window.location.reload()}>⟳</button>
                </div>
            )}

            {/* ── Hero ── */}
            <section className="marketplace-hero">
                <div className="hero-bg-pattern" />
                <div className="hero-content">
                    <div className="hero-badge"><MdRecycling size={16} /><span>{t.heroBadge}</span></div>
                    <h1>{t.heroTitle}</h1>
                    <p>{t.heroSub}</p>
                    <div className="hero-search">
                        <button className="search-icon-btn"><FiSearch size={20} /></button>
                        <div className="search-input-box">
                            <input type="text" placeholder={t.searchPH} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            {searchTerm && <button className="clear-btn" onClick={() => setSearchTerm('')}><FiX size={16} /></button>}
                        </div>
                        <button className="search-button">{t.searchBtn}</button>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="stat-num">{filteredItems.length}+</span>
                            <span className="stat-lbl">{t.s1}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-num">{new Set(filteredItems.filter(i => i.factoryId).map(i => i.factoryId)).size}+</span>
                            <span className="stat-lbl">{t.s2}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-num">{new Set(filteredItems.filter(i => i.locAr || i.location).map(i => i.locAr || i.location)).size}</span>
                            <span className="stat-lbl">{t.s3}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-num">{filteredItems.length > 0 ? Math.round((filteredItems.reduce((s, i) => s + (i.rating || 4), 0) / filteredItems.length) * 20) : 98}%</span>
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
                        <button key={cat.key} className={`tab-item${selectedCategory === cat.key ? ' active' : ''}`} onClick={() => handleCategoryChange(cat.key)}>
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
                    <div className="waste-cards-grid">
                        {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
                            <div key={item.id} className="waste-card" style={{ animationDelay: `${idx * 0.055}s` }} onClick={() => navigate(`/waste-details/${item.id}`)}>
                                {item.badge && t?.badges && (
                                    <span className={`card-badge badge-${item.badge}`}>{t.badges[item.badge]}</span>
                                )}
                                <div className="card-img-wrap">
                                    <img
                                        src={item.image || getCategoryFallback(item.category)}
                                        alt={lang === 'ar' ? item.titleAr : item.titleEn}
                                        onError={e => { e.target.src = getCategoryFallback(item.category); }}
                                    />
                                </div>
                                <div className="card-body">
                                    {/* ✅ FIXED: Safely get category label with fallback */}
                                    <div className="card-cat-tag">{getCategoryLabel(item.category)}</div>
                                    <div className="card-header-row">
                                        <h3 className="card-title">{lang === 'ar' ? item.titleAr : item.titleEn}</h3>
                                        <div className="card-company"><FaIndustry size={11} />{lang === 'ar' ? item.companyAr : item.companyEn}</div>
                                    </div>
                                    <p className="card-desc">{lang === 'ar' ? item.descAr : item.descEn}</p>

                                    {/* Smart metadata badges */}
                                    <div style={{ display:'flex', gap:'4px', flexWrap:'wrap', marginBottom:'8px', marginTop:'6px' }}>
                                        <span style={{ fontSize:'10px', padding:'2px 6px', borderRadius:'3px', backgroundColor: item.status === 'Available' || item.status === 'Active' ? '#d4edda' : '#fff3cd', color:'#333', fontWeight:'500' }}>
                                            {item.status === 'Available' || item.status === 'Active' ? (lang === 'ar' ? '✓ متاح' : '✓ Available') : item.status}
                                        </span>
                                        {item.recyclability && (
                                            <span style={{ fontSize:'10px', padding:'2px 6px', borderRadius:'3px', backgroundColor: item.recyclability === 'Reusable' ? '#cfe2ff' : item.recyclability === 'Recyclable' ? '#e7d4f5' : '#fff8dc', color:'#333', fontWeight:'500' }}>
                                                {item.recyclability === 'Recyclable' && (lang === 'ar' ? '♻ قابل للتدوير'         : '♻ Recyclable')}
                                                {item.recyclability === 'Reusable'   && (lang === 'ar' ? '🔄 قابل لإعادة الاستخدام' : '🔄 Reusable')}
                                                {item.recyclability === 'DirectUse'  && (lang === 'ar' ? '⚙ استخدام مباشر'         : '⚙ Direct Use')}
                                            </span>
                                        )}
                                        {item.co2Savings && (
                                            <span style={{ fontSize:'10px', padding:'2px 6px', borderRadius:'3px', backgroundColor:'#e8f5e9', color:'#2e7d32', fontWeight:'500' }}>
                                                🌱 {item.co2Savings} {lang === 'ar' ? 'كج CO₂' : 'kg CO₂'}
                                            </span>
                                        )}
                                        {item.contaminationLevel && (
                                            <span style={{ fontSize:'10px', padding:'2px 6px', borderRadius:'3px', backgroundColor: item.contaminationLevel === 'Low' ? '#e8f5e9' : item.contaminationLevel === 'Medium' ? '#fff3e0' : '#ffebee', color:'#333', fontWeight:'500' }}>
                                                {item.contaminationLevel === 'Low'    && (lang === 'ar' ? '✓ نظيف'  : '✓ Clean')}
                                                {item.contaminationLevel === 'Medium' && (lang === 'ar' ? '⚠ معتدل' : '⚠ Medium')}
                                                {item.contaminationLevel === 'High'   && (lang === 'ar' ? '⚠ مرتفع' : '⚠ High')}
                                            </span>
                                        )}
                                    </div>

                                    <div className="card-meta">
                                        <span><FiMapPin size={11} />{lang === 'ar' ? item.locAr : item.locEn}</span>
                                        <span><FaWeightHanging size={11} />{lang === 'ar' ? item.weightAr : item.weightEn}</span>
                                        <span style={{ fontSize:'11px', color: (item.reservedAmount || 0) > 0 ? '#ff6b6b' : '#4caf50', fontWeight: '500' }}>
                                            📦 {lang === 'ar' ? 'متاح' : 'Available'}: {((item.amount || 0) - (item.reservedAmount || 0)).toFixed(1)} {item.unit}
                                            {(item.reservedAmount || 0) > 0 && ` | ${lang === 'ar' ? 'محجوز' : 'Reserved'}: ${(item.reservedAmount || 0).toFixed(1)}`}
                                        </span>
                                        <div className="card-rating">
                                            <FiStar size={12} className="star-icon" />
                                            <span>{item.rating}</span>
                                            <span className="reviews-count">({item.reviews} {t.reviews || (lang === 'ar' ? 'تقييم' : 'reviews')})</span>
                                        </div>
                                    </div>

                                    {item.listingId && (
                                        <div className="card-listing-id">
                                            <div className="listing-label">{lang === 'ar' ? 'رقم الإعلان' : 'Listing #'}</div>
                                            <div className="listing-number">{item.listingId}</div>
                                        </div>
                                    )}

                                    <div className="card-footer">
                                        <div className="card-price">
                                            {Number(item.price).toLocaleString()}
                                            <span className="price-currency"> {t.egp || (lang === 'ar' ? 'ج.م' : 'EGP')}</span>
                                            <span className="price-unit">/ {lang === 'ar' ? item.unitAr : item.unitEn}</span>
                                        </div>
                                        <button className="card-btn" onClick={e => { e.stopPropagation(); handleContact(item); }}>
                                            {t.contact || (lang === 'ar' ? 'اتصل' : 'Contact')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="no-results">
                                <div className="no-results-icon"><FiSearch size={52} /></div>
                                <h3>{t.noResults}</h3>
                                <p>{t.noResultsHint}</p>
                                <button className="reset-search-btn" onClick={() => { setSelectedCategory('all'); setSearchTerm(''); navigate('/market', { replace: true }); }}>
                                    {t.showAll}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Map Sidebar ── */}
                <aside className="maps-sidebar">
                    <div className="sidebar-panel">
                        <h3 className="sidebar-title"><FiMapPin size={17} />{t.mapTitle}</h3>
                        <div className="location-search">
                            <input type="text" placeholder={t.locPH} value={locationInput} onChange={e => setLocationInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLocationSearch()} />
                            <button onClick={handleLocationSearch}>{t.locBtn}</button>
                        </div>
                        <button className="detect-location-btn" onClick={detectMyLocation}>{t.detectBtn}</button>
                        <div className="map-container">
                            {mapLoadError ? (
                                <div className="map-loading"><MdRecycling size={30} className="map-loading-icon" /><span>{t.mapLoadError || (lang === 'ar' ? 'خطأ في تحميل الخريطة' : 'Map load error')}</span></div>
                            ) : (
                                <MapContainer center={mapCenter} zoom={10} style={{ width:'100%', height:'320px', borderRadius:'16px' }} className="leaflet-map">
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                                    {userLocation && <Marker position={userLocation} icon={userIcon}><Popup>{lang === 'ar' ? 'موقعك الحالي' : 'Your Location'}</Popup></Marker>}
                                    {FACTORIES.map((f, i) => (
                                        <Marker key={i} position={{ lat: f.lat, lng: f.lng }} icon={markerIcon} onClick={() => setSelectedMarker(f)}>
                                            <Popup>
                                                <div className="map-popup">
                                                    <strong>{lang === 'ar' ? f.nameAr : f.nameEn}</strong>
                                                    <div>{lang === 'ar' ? f.typeAr : f.typeEn}</div>
                                                    <div className="popup-count">{f.items} {lang === 'ar' ? 'إعلان' : 'listings'}</div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            )}
                        </div>
                        <div className="nearby-factories">
                            <div className="nearby-header">
                                <h4>{t.nearbyTitle}</h4>
                                {nearbyFactories.length > 0 && <span className="nearby-count">{nearbyFactories.length}</span>}
                            </div>
                            {nearbyFactories.length > 0 ? (
                                <ul className="nearby-list">
                                    {nearbyFactories.map((f, i) => (
                                        <li key={i} className="nearby-item" onClick={() => { setMapCenter({ lat: f.lat, lng: f.lng }); if (mapRef) mapRef.panTo({ lat: f.lat, lng: f.lng }); setSelectedMarker(f); }}>
                                            <div className="nearby-item-top">
                                                <span className="nearby-name">🏭 {lang === 'ar' ? f.nameAr : f.nameEn}</span>
                                                <span className="nearby-dist">{f.dist < 10 ? f.dist.toFixed(1) : Math.round(f.dist)} {t.km || 'km'}</span>
                                            </div>
                                            <div className="nearby-type">{lang === 'ar' ? f.typeAr : f.typeEn}</div>
                                            <div className="nearby-items-count">{f.items} {t.listings || (lang === 'ar' ? 'إعلان' : 'listings')}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="nearby-empty"><FiMapPin size={26} /><p>{t.nearbyEmpty}</p></div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Marketplace;