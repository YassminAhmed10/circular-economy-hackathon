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
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

import paperWasteImage from '../assets/┘à╪«┘ä┘ü╪º╪¬ ╪º┘ä┘ê╪▒┘é.png';
import plasticWasteImage from '../assets/┘à╪«┘ä┘ü╪º╪¬ ╪º┘ä╪¿┘ä╪º╪│╪¬┘è┘â.png';
import woodWasteImage from '../assets/┘à╪«┘ä┘ü╪º╪¬ ╪º┘ä╪«╪┤╪¿.png';
import metalWasteImage from '../assets/┘à╪«┘ä┘ü╪º╪¬ ╪º┘ä┘à╪╣╪º╪»┘å.png';
import glassWasteImage from '../assets/┘à╪«┘ä┘ü╪º╪¬ ╪º┘ä╪▓╪¼╪º╪¼.png';
import textileWasteImage from '../assets/┘à╪«┘ä┘ü╪º╪¬ ╪º┘ä┘å╪│┘è╪¼.png';
import chemicalsImg from '../assets/Chemicals.png';
import electronicsImg from '../assets/Electronics .png';

// ΓöÇΓöÇΓöÇ TRANSLATIONS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const T = {
    ar: {
        dir: 'rtl',
        heroBadge: '╪º┘é╪¬╪╡╪º╪» ╪»┘ê╪▒┘è ΓÇó ┘à╪│╪¬╪»╪º┘à',
        heroTitle: '╪│┘ê┘é ╪º┘ä┘à╪«┘ä┘ü╪º╪¬ ╪º┘ä╪╡┘å╪º╪╣┘è╪⌐',
        heroSub: '╪¡┘ê┘æ┘ä ╪º┘ä┘à╪«┘ä┘ü╪º╪¬ ╪Ñ┘ä┘ë ┘ü╪▒╪╡ ╪¬╪¼╪º╪▒┘è╪⌐ ┘ê╪º╪│╪¬┘ü╪» ┘à┘å ╪º┘ä╪º┘é╪¬╪╡╪º╪» ╪º┘ä╪»╪º╪ª╪▒┘è',
        searchPH: '╪º╪¿╪¡╪½ ╪╣┘å ┘å┘ê╪╣ ╪º┘ä┘à╪«┘ä┘ü╪º╪¬ ╪ú┘ê ╪º╪│┘à ╪º┘ä╪┤╪▒┘â╪⌐...',
        searchBtn: '╪¿╪¡╪½',
        s1: '╪Ñ╪╣┘ä╪º┘å ┘å╪┤╪╖', s2: '┘à╪╡┘å╪╣ ┘à╪│╪¼┘ä', s3: '┘à╪¡╪º┘ü╪╕╪⌐', s4: '╪▒╪╢╪º ╪º┘ä╪╣┘à┘ä╪º╪í',
        productsTitle: '╪º┘ä┘à┘å╪¬╪¼╪º╪¬ ╪º┘ä┘à╪¬╪º╪¡╪⌐',
        productUnit: '┘à┘å╪¬╪¼',
        allCats: '╪¼┘à┘è╪╣ ╪º┘ä┘ü╪ª╪º╪¬',
        sortLabel: '╪¬╪▒╪¬┘è╪¿ ╪¡╪│╪¿:',
        sorts: { newest: '╪º┘ä╪ú╪¡╪»╪½', priceLow: '╪º┘ä╪ú┘é┘ä ╪│╪╣╪▒╪º┘ï', priceHigh: '╪º┘ä╪ú╪╣┘ä┘ë ╪│╪╣╪▒╪º┘ï', nearest: '╪º┘ä╪ú┘é╪▒╪¿', rating: '╪º┘ä╪ú╪╣┘ä┘ë ╪¬┘é┘è┘è┘à╪º┘ï' },
        noResults: '┘ä╪º ╪¬┘ê╪¼╪» ┘å╪¬╪º╪ª╪¼', noResultsHint: '╪¼╪▒╪¿ ╪¬╪║┘è┘è╪▒ ┘à╪╣╪º┘è┘è╪▒ ╪º┘ä╪¿╪¡╪½',
        showAll: '╪╣╪▒╪╢ ╪¼┘à┘è╪╣ ╪º┘ä┘à┘å╪¬╪¼╪º╪¬',
        mapTitle: '╪º┘ä╪¿╪¡╪½ ╪¿╪º┘ä┘à┘ê┘é╪╣ ╪º┘ä╪¼╪║╪▒╪º┘ü┘è',
        locPH: '╪ú╪»╪«┘ä ╪º╪│┘à ╪º┘ä┘à┘å╪╖┘é╪⌐ ╪ú┘ê ╪º┘ä┘à╪»┘è┘å╪⌐...',
        locBtn: '╪¿╪¡╪½',
        detectBtn: '≡ƒôì ╪º╪│╪¬╪«╪»┘à ┘à┘ê┘é╪╣┘è ╪º┘ä╪¡╪º┘ä┘è',
        nearbyTitle: '┘à╪╡╪º┘å╪╣ ┘é╪▒┘è╪¿╪⌐ ┘à┘å┘â',
        nearbyEmpty: '╪¡╪»╪» ┘à┘ê┘é╪╣┘â ┘ä╪╣╪▒╪╢ ╪º┘ä┘à╪╡╪º┘å╪╣ ╪º┘ä┘é╪▒┘è╪¿╪⌐',
        mapLoading: '╪¼╪º╪▒┘è ╪¬╪¡┘à┘è┘ä ╪º┘ä╪«╪▒┘è╪╖╪⌐...',
        mapKeyMissing: '┘à┘ü╪¬╪º╪¡ Google Maps ╪║┘è╪▒ ┘à╪╢╪¿┘ê╪╖. ╪ú╪╢┘ü VITE_GOOGLE_MAPS_API_KEY ┘ä╪╣╪▒╪╢ ╪º┘ä╪«╪▒┘è╪╖╪⌐.',
        mapLoadError: '╪¬╪╣╪░╪▒ ╪¬╪¡┘à┘è┘ä Google Maps. ╪¬╪¡┘é┘é ┘à┘å ╪¬┘ü╪╣┘è┘ä Maps JavaScript API ┘ê╪▒╪¿╪╖ ╪º┘ä┘à┘ü╪¬╪º╪¡ ╪¿╪º┘ä┘à╪┤╪▒┘ê╪╣.',
        contact: '╪¬┘ê╪º╪╡┘ä',
        viewDetails: '╪╣╪▒╪╢ ╪º┘ä╪¬┘ü╪º╪╡┘è┘ä',
        egp: '╪¼┘å┘è┘ç',
        reviews: '╪¬┘é┘è┘è┘à',
        km: '┘â┘à',
        listings: '╪Ñ╪╣┘ä╪º┘å ┘à╪¬╪º╪¡',
        langBtn: 'English',
        badges: { new: '╪¼╪»┘è╪»', featured: '┘à┘à┘è╪▓', offer: '╪╣╪▒╪╢' },
        cats: { all: '╪º┘ä┘â┘ä', plastic: '╪¿┘ä╪º╪│╪¬┘è┘â', metal: '┘à╪╣╪º╪»┘å', paper: '┘ê╪▒┘é', glass: '╪▓╪¼╪º╪¼', wood: '╪«╪┤╪¿', textile: '┘å╪│┘è╪¼', chemicals: '┘â┘è┘à╪º┘ê┘è╪º╪¬', electronics: '╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è╪º╪¬' },
        loading: '╪¼╪º╪▒┘è ╪º┘ä╪¬╪¡┘à┘è┘ä...',
        error: '╪¡╪»╪½ ╪«╪╖╪ú ┘ü┘è ╪¬╪¡┘à┘è┘ä ╪º┘ä╪¿┘è╪º┘å╪º╪¬'
    },
    en: {
        dir: 'ltr',
        heroBadge: 'Circular Economy ΓÇó Sustainable',
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
        detectBtn: '≡ƒôì Use My Location',
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
        langBtn: '╪╣╪▒╪¿┘è',
        badges: { new: 'New', featured: 'Featured', offer: 'Offer' },
        cats: { all: 'All', plastic: 'Plastic', metal: 'Metal', paper: 'Paper', glass: 'Glass', wood: 'Wood', textile: 'Textile', chemicals: 'Chemicals', electronics: 'Electronics' },
        loading: 'Loading...',
        error: 'Error loading data'
    },
};

// ΓöÇΓöÇΓöÇ CATEGORIES ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
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

// ΓöÇΓöÇΓöÇ STATIC WASTE ITEMS (FALLBACK) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const STATIC_WASTE_ITEMS = [
    { id: 1, titleAr: '╪¿╪▒╪º┘à┘è┘ä ╪¿┘ä╪º╪│╪¬┘è┘â ┘à╪│╪¬╪╣┘à┘ä╪⌐', titleEn: 'Used Plastic Barrels', category: 'plastic', companyAr: '┘à╪╡┘å╪╣ ╪º┘ä╪»┘ä╪¬╪º ┘ä┘ä╪¿╪¬╪▒┘ê┘â┘è┘à╪º┘ê┘è╪º╪¬', companyEn: 'Delta Petrochemicals Factory', locAr: '╪º┘ä╪╣╪º╪┤╪▒ ┘à┘å ╪▒┘à╪╢╪º┘å', locEn: '10th of Ramadan', price: 45, unitAr: '┘ä┘ä╪¿╪▒┘à┘è┘ä', unitEn: 'per barrel', weightAr: '5 ╪╖┘å ┘à╪¬╪º╪¡', weightEn: '5 tons avail.', rating: 4.7, reviews: 38, descAr: '╪¿╪▒╪º┘à┘è┘ä HDPE ╪│╪╣╪⌐ 200 ┘ä╪¬╪▒ ┘å╪╕┘è┘ü╪⌐ ┘ê╪╡╪º┘ä╪¡╪⌐ ┘ä┘ä╪Ñ╪╣╪º╪»╪⌐', descEn: '200L HDPE barrels, clean and reusable', badge: 'new', image: plasticWasteImage, lat: 30.31, lng: 31.74 },
    { id: 2, titleAr: '╪¡╪»┘è╪» ╪«╪▒╪»╪⌐ ╪╣╪º┘ä┘è ╪º┘ä╪¼┘ê╪»╪⌐', titleEn: 'High Quality Scrap Iron', category: 'metal', companyAr: '╪º┘ä╪┤╪▒┘â╪⌐ ╪º┘ä┘à╪╡╪▒┘è╪⌐ ┘ä┘ä╪╡┘ä╪¿', companyEn: 'Egyptian Steel Company', locAr: '╪º┘ä╪│╪º╪»╪│ ┘à┘å ╪ú┘â╪¬┘ê╪¿╪▒', locEn: '6th of October', price: 3200, unitAr: '┘ä┘ä╪╖┘å', unitEn: 'per ton', weightAr: '20 ╪╖┘å', weightEn: '20 tons', rating: 4.9, reviews: 112, descAr: '╪«╪▒╪»╪⌐ ╪¡╪»┘è╪» A-grade ┘à┘å╪º╪│╪¿╪⌐ ┘ä┘ä╪╡┘ç╪▒ ┘ê╪Ñ╪╣╪º╪»╪⌐ ╪º┘ä╪¬╪╡┘å┘è╪╣', descEn: 'A-grade scrap iron suitable for smelting', badge: 'featured', image: metalWasteImage, lat: 29.97, lng: 30.94 },
    { id: 3, titleAr: '┘â╪▒╪¬┘ê┘å ┘ê╪▒┘é ┘à╪╢╪║┘ê╪╖', titleEn: 'Compressed Paper Cardboard', category: 'paper', companyAr: '┘à╪╖╪º╪¿╪╣ ╪º┘ä╪¼┘è┘ä ╪º┘ä╪¡╪»┘è╪½', companyEn: 'Modern Generation Press', locAr: '┘à╪»┘è┘å╪⌐ ╪º┘ä╪╣╪¿┘ê╪▒', locEn: 'Obour City', price: 800, unitAr: '┘ä┘ä╪╖┘å', unitEn: 'per ton', weightAr: '8 ╪╖┘å', weightEn: '8 tons', rating: 4.5, reviews: 61, descAr: '┘â╪▒╪¬┘ê┘å ┘à╪╢╪║┘ê╪╖ ╪╣┘ä┘ë ╪┤┘â┘ä ╪¿╪º┘ä╪º╪¬ ╪¼╪º┘ç╪▓ ┘ä┘ä╪┤╪¡┘å', descEn: 'Compressed cardboard bales ready for shipping', badge: null, image: paperWasteImage, lat: 30.24, lng: 31.55 },
    { id: 4, titleAr: '┘é╪╖╪╣ ┘å╪│┘è╪¼ ┘ê┘à┘é╪╡┘ê╪▒╪º╪¬ ┘é┘à╪º╪┤', titleEn: 'Fabric Pieces & Offcuts', category: 'textile', companyAr: '╪┤╪▒┘â╪⌐ ┘å┘ê╪▒╪»╪º┘å╪¬┘â╪│ ┘ä┘ä╪║╪▓┘ä', companyEn: 'Nordantex Spinning Co.', locAr: '╪º┘ä┘à╪¡┘ä╪⌐ ╪º┘ä┘â╪¿╪▒┘ë', locEn: 'El Mahalla El Kubra', price: 1200, unitAr: '┘ä┘ä╪╖┘å', unitEn: 'per ton', weightAr: '3 ╪╖┘å', weightEn: '3 tons', rating: 4.3, reviews: 27, descAr: '┘à┘é╪╡┘ê╪▒╪º╪¬ ┘é╪╖┘å ┘ê╪¿┘ê┘ä┘è╪│╪¬╪▒ ┘à╪¬┘å┘ê╪╣╪⌐', descEn: 'Cotton and polyester offcuts various sizes', badge: 'offer', image: textileWasteImage, lat: 30.97, lng: 31.17 },
    { id: 5, titleAr: '╪ú┘ä┘ê╪º╪¡ ╪«╪┤╪¿ ┘ê┘ü┘ä┘è┘å', titleEn: 'Wood Panels & Cork', category: 'wood', companyAr: '┘à╪╡┘å╪╣ ╪º┘ä╪«╪┤╪¿ ╪º┘ä┘à╪¬╪¡╪»', companyEn: 'United Wood Factory', locAr: '╪¿╪▒╪¼ ╪º┘ä╪╣╪▒╪¿ ╪º┘ä╪¼╪»┘è╪»╪⌐', locEn: 'New Borg El Arab', price: 600, unitAr: '┘ä┘ä╪╖┘å', unitEn: 'per ton', weightAr: '10 ╪╖┘å', weightEn: '10 tons', rating: 4.2, reviews: 19, descAr: '┘ü┘ä┘è┘å ╪╖╪¿┘è╪╣┘è ┘ê╪¡╪¿┘è╪¿╪º╪¬ ╪«╪┤╪¿ ┘å╪º╪╣┘à╪⌐ ┘ä┘ä╪╣╪▓┘ä', descEn: 'Natural cork and fine wood chips for insulation', badge: null, image: woodWasteImage, lat: 30.81, lng: 29.68 },
    { id: 6, titleAr: '╪▓╪¼╪º╪¼ ┘à┘â╪│┘ê╪▒ ┘ê┘à┘ä┘ê┘å', titleEn: 'Broken & Colored Glass', category: 'glass', companyAr: '╪▓╪¼╪º╪¼ ┘à╪╡╪▒ ┘ä┘ä╪╡┘å╪º╪╣╪⌐', companyEn: 'Egypt Glass Industries', locAr: '╪º┘ä╪╣╪º┘à╪▒┘è╪⌐', locEn: 'El Ameria', price: 500, unitAr: '┘ä┘ä╪╖┘å', unitEn: 'per ton', weightAr: '15 ╪╖┘å', weightEn: '15 tons', rating: 4.0, reviews: 33, descAr: '╪┤╪╕╪º┘è╪º ╪▓╪¼╪º╪¼ ╪┤┘ü╪º┘ü ┘ê┘à┘ä┘ê┘å ╪╡╪º┘ä╪¡╪⌐ ┘ä╪Ñ╪╣╪º╪»╪⌐ ╪º┘ä╪╡┘ç╪▒', descEn: 'Transparent and colored glass for remelting', badge: 'new', image: glassWasteImage, lat: 31.19, lng: 29.91 },
    { id: 7, titleAr: '┘à┘ê╪º╪» ┘â┘è┘à┘è╪º╪ª┘è╪⌐ ╪║┘è╪▒ ╪«╪╖╪▒╪⌐', titleEn: 'Non-Hazardous Chemicals', category: 'chemicals', companyAr: '╪º┘ä┘â┘è┘à╪º┘ê┘è╪º╪¬ ╪º┘ä╪╡┘å╪º╪╣┘è╪⌐ ╪º┘ä┘à╪╡╪▒┘è╪⌐', companyEn: 'Egyptian Industrial Chemicals', locAr: '╪┤╪¿╪▒╪º ╪º┘ä╪«┘è┘à╪⌐', locEn: 'Shubra El Kheima', price: 2100, unitAr: '┘ä┘ä╪╖┘å', unitEn: 'per ton', weightAr: '2 ╪╖┘å', weightEn: '2 tons', rating: 4.6, reviews: 44, descAr: '┘à┘ê╪º╪» ┘â┘è┘à┘è╪º╪ª┘è╪⌐ ┘à╪╡┘å┘ü╪⌐ ╪¼╪º┘ç╪▓╪⌐ ┘ä┘ä╪º╪│╪¬╪«╪»╪º┘à ╪º┘ä╪╡┘å╪º╪╣┘è', descEn: 'Classified chemicals ready for industrial use', badge: 'featured', image: chemicalsImg, lat: 30.13, lng: 31.24 },
    { id: 8, titleAr: '╪ú┘ä┘ê┘à┘å┘è┘ê┘à ┘ê╪ú╪│┘ä╪º┘â ┘à╪╣╪»┘å┘è╪⌐', titleEn: 'Aluminum & Metal Wires', category: 'metal', companyAr: '┘à╪╡┘å╪╣ ╪º┘ä╪ú┘ä┘ê┘à┘å┘è┘ê┘à ╪º┘ä┘é╪º┘ç╪▒╪⌐', companyEn: 'Cairo Aluminum Factory', locAr: '╪º┘ä╪╣╪º╪┤╪▒ ┘à┘å ╪▒┘à╪╢╪º┘å', locEn: '10th of Ramadan', price: 6500, unitAr: '┘ä┘ä╪╖┘å', unitEn: 'per ton', weightAr: '4 ╪╖┘å', weightEn: '4 tons', rating: 4.8, reviews: 77, descAr: '╪ú┘ä┘ê┘à┘å┘è┘ê┘à ┘å┘é┘è ┘ê╪ú╪│┘ä╪º┘â ┘å╪¡╪º╪│┘è╪⌐ ╪¼╪º┘ç╪▓╪⌐ ┘ä┘ä╪¬╪╡┘å┘è╪╣', descEn: 'Pure aluminum and copper wires for manufacturing', badge: 'featured', image: metalWasteImage, lat: 30.32, lng: 31.76 },
    { id: 9, titleAr: '╪¿┘é╪º┘è╪º ╪¿┘ä╪º╪│╪¬┘è┘â ABS ┘êPVC', titleEn: 'ABS & PVC Plastic Waste', category: 'plastic', companyAr: '┘à╪╡┘å╪╣ ╪¿┘ä╪º╪│╪¬┘è┘â┘ê ┘à╪╡╪▒', companyEn: 'Plastico Egypt Factory', locAr: '┘à╪»┘è┘å╪⌐ ┘å╪╡╪▒', locEn: 'Nasr City', price: 1800, unitAr: '┘ä┘ä╪╖┘å', unitEn: 'per ton', weightAr: '6 ╪╖┘å', weightEn: '6 tons', rating: 4.4, reviews: 52, descAr: '╪¿┘ä╪º╪│╪¬┘è┘â ABS ┘êPVC ┘å╪╕┘è┘ü ┘à┘å╪º╪│╪¿ ┘ä┘ä╪╖╪¡┘å ┘ê╪º┘ä╪¬╪╡┘å┘è╪╣', descEn: 'Clean ABS and PVC plastic for regrinding', badge: null, image: plasticWasteImage, lat: 30.07, lng: 31.33 },
    { id: 10, titleAr: '╪ú╪¼┘ç╪▓╪⌐ ╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è╪⌐ ┘ä┘ä╪¬╪»┘ê┘è╪▒', titleEn: 'Electronics for Recycling', category: 'electronic', companyAr: '┘à╪╡┘å╪╣ ╪º┘ä╪ú╪¼┘ç╪▓╪⌐ ╪º┘ä╪¡╪»┘è╪½╪⌐', companyEn: 'Modern Electronics Factory', locAr: '╪º┘ä┘é╪º┘ç╪▒╪⌐', locEn: 'Cairo', price: 2500, unitAr: '┘ä┘ä╪╖┘å', unitEn: 'per ton', weightAr: '3 ╪╖┘å', weightEn: '3 tons', rating: 4.5, reviews: 30, descAr: '╪ú╪¼┘ç╪▓╪⌐ ╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è╪⌐ ┘é╪»┘è┘à╪⌐ ╪╡╪º┘ä╪¡╪⌐ ┘ä╪Ñ╪╣╪º╪»╪⌐ ╪º┘ä╪¬╪»┘ê┘è╪▒', descEn: 'Old electronics suitable for recycling', badge: 'new', image: electronicsImg, lat: 30.06, lng: 31.24 },
];

// ΓöÇΓöÇΓöÇ CATEGORY IMAGE FALLBACK ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
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
    { nameAr: '┘à╪╡┘å╪╣ ╪º┘ä╪»┘ä╪¬╪º ┘ä┘ä╪¿╪¬╪▒┘ê┘â┘è┘à╪º┘ê┘è╪º╪¬', nameEn: 'Delta Petrochemicals', typeAr: '╪¿╪¬╪▒┘ê┘â┘è┘à╪º┘ê┘è╪º╪¬', typeEn: 'Petrochemicals', items: 14, lat: 30.31, lng: 31.74 },
    { nameAr: '╪º┘ä╪┤╪▒┘â╪⌐ ╪º┘ä┘à╪╡╪▒┘è╪⌐ ┘ä┘ä╪╡┘ä╪¿', nameEn: 'Egyptian Steel Co.', typeAr: '┘à╪╣╪º╪»┘å ┘ê╪¡╪»┘è╪»', typeEn: 'Metal & Steel', items: 8, lat: 29.97, lng: 30.94 },
    { nameAr: '╪┤╪▒┘â╪⌐ ┘å┘ê╪▒╪»╪º┘å╪¬┘â╪│ ┘ä┘ä╪║╪▓┘ä', nameEn: 'Nordantex Spinning', typeAr: '┘å╪│┘è╪¼ ┘ê╪ú┘é┘à╪┤╪⌐', typeEn: 'Textiles', items: 22, lat: 30.97, lng: 31.17 },
    { nameAr: '╪º┘ä┘â┘è┘à╪º┘ê┘è╪º╪¬ ╪º┘ä╪╡┘å╪º╪╣┘è╪⌐', nameEn: 'Industrial Chemicals', typeAr: '┘â┘è┘à╪º┘ê┘è╪º╪¬', typeEn: 'Chemicals', items: 6, lat: 30.13, lng: 31.24 },
    { nameAr: '┘à╪╖╪º╪¿╪╣ ╪º┘ä╪¼┘è┘ä ╪º┘ä╪¡╪»┘è╪½', nameEn: 'Modern Generation Press', typeAr: '┘ê╪▒┘é ┘ê┘â╪▒╪¬┘ê┘å', typeEn: 'Paper & Cardboard', items: 11, lat: 30.24, lng: 31.55 },
    { nameAr: '┘à╪╡┘å╪╣ ╪º┘ä╪ú┘ä┘ê┘à┘å┘è┘ê┘à ╪º┘ä┘é╪º┘ç╪▒╪⌐', nameEn: 'Cairo Aluminum Factory', typeAr: '┘à╪╣╪º╪»┘å ╪ú┘ä┘ê┘à┘å┘è┘ê┘à', typeEn: 'Aluminum', items: 5, lat: 30.32, lng: 31.76 },
    { nameAr: '┘à╪╡┘å╪╣ ╪¿┘ä╪º╪│╪¬┘è┘â┘ê ┘à╪╡╪▒', nameEn: 'Plastico Egypt', typeAr: '╪¿┘ä╪º╪│╪¬┘è┘â ┘ê┘à╪╖╪º╪╖', typeEn: 'Plastic & Rubber', items: 19, lat: 30.07, lng: 31.33 },
];

const MAP_STYLE = { width: '100%', height: '320px', borderRadius: '16px' };
const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 };

const getDistKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ΓöÇΓöÇΓöÇ COMPONENT ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
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

    // Γ£à custom listings ┘à┘å localStorage
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

    // Γ£à ╪»┘à╪¼ ╪º┘ä┘Ç API items ┘à╪╣ ╪º┘ä┘Ç custom listings
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

    // Γ£à ┘ü┘ä╪¬╪▒╪⌐ ┘ê╪¬╪▒╪¬┘è╪¿ ALL_ITEMS
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
            showNotif(lang === 'ar' ? '╪º┘ä┘à╪¬╪╡┘ü╪¡ ┘ä╪º ┘è╪»╪╣┘à ╪¬╪¡╪»┘è╪» ╪º┘ä┘à┘ê┘é╪╣' : 'Geolocation not supported');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude: lat, longitude: lng } }) => {
                setUserLocation({ lat, lng });
                setMapCenter({ lat, lng });
                if (mapRef) mapRef.panTo({ lat, lng });
                updateNearby(lat, lng);
                showNotif(lang === 'ar' ? 'Γ£à ╪¬┘à ╪¬╪¡╪»┘è╪» ┘à┘ê┘é╪╣┘â!' : 'Γ£à Location detected!');
            },
            () => {
                updateNearby(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
                showNotif(lang === 'ar' ? 'ΓÜá∩╕Å ╪¬┘à ╪º╪│╪¬╪«╪»╪º┘à ┘à┘ê┘é╪╣ ╪º┘ü╪¬╪▒╪º╪╢┘è' : 'ΓÜá∩╕Å Using default location');
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
                    showNotif(`≡ƒôì ${locationInput}`);
                } else {
                    showNotif(lang === 'ar' ? 'Γ¥î ╪º┘ä┘à┘ê┘é╪╣ ╪║┘è╪▒ ┘à┘ê╪¼┘ê╪»' : 'Γ¥î Location not found');
                }
            })
            .catch(() => showNotif(lang === 'ar' ? 'ΓÜá∩╕Å ╪«╪╖╪ú ┘ü┘è ╪º┘ä╪º╪¬╪╡╪º┘ä' : 'ΓÜá∩╕Å Connection error'));
    };

    const handleContact = async (item) => {
        if (!user) {
            showNotif(lang === 'ar' ? '┘è╪▒╪¼┘ë ╪¬╪│╪¼┘è┘ä ╪º┘ä╪»╪«┘ê┘ä ╪ú┘ê┘ä╪º┘ï' : 'Please login first');
            navigate('/login');
            return;
        }

        try {
            // Here you would implement contact logic
            showNotif(lang === 'ar'
                ? `≡ƒô¿ ╪¼╪º╪▒┘è ╪º┘ä╪¬┘ê╪º╪╡┘ä ┘à╪╣ ${item.companyAr}`
                : `≡ƒô¿ Contacting ${item.companyEn}`);
        } catch (err) {
            showNotif(lang === 'ar' ? '╪¡╪»╪½ ╪«╪╖╪ú ┘ü┘è ╪º┘ä╪¬┘ê╪º╪╡┘ä' : 'Error contacting seller');
        }
    };

    const FACTORY_ICON = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#10b981" stroke="white" stroke-width="3"/><text x="18" y="24" text-anchor="middle" font-size="16">≡ƒÅ¡</text></svg>'
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
                    <button onClick={() => window.location.reload()}>Γƒ│</button>
                </div>
            )}

            <div className="mp-lang-bar">
                <button className="lang-toggle-btn" onClick={toggleLang}>
                    <FiGlobe size={15} />
                    <span>{t.langBtn}</span>
                </button>
            </div>

            {/* ΓöÇΓöÇ Hero ΓöÇΓöÇ */}
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

            {/* ΓöÇΓöÇ Category Tabs ΓöÇΓöÇ */}
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

            {/* ΓöÇΓöÇ Main Grid ΓöÇΓöÇ */}
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
                            {!hasGoogleMapsKey ? (
                                <div className="map-loading">
                                    <MdRecycling size={30} className="map-loading-icon" />
                                    <span>{t.mapKeyMissing}</span>
                                </div>
                            ) : mapLoadError ? (
                                <div className="map-loading">
                                    <MdRecycling size={30} className="map-loading-icon" />
                                    <span>{t.mapLoadError}</span>
                                </div>
                            ) : (
                                <LoadScript
                                    id="google-map-script"
                                    googleMapsApiKey={googleMapsApiKey}
                                    libraries={['marker']}
                                    onError={() => setMapLoadError(true)}
                                >
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
                                                        {selectedMarker.items} {lang === 'ar' ? '╪Ñ╪╣┘ä╪º┘å' : 'listings'}
                                                    </span>
                                                </div>
                                            </InfoWindow>
                                        )}
                                    </GoogleMap>
                                </LoadScript>
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
                                                    ≡ƒÅ¡ {lang === 'ar' ? f.nameAr : f.nameEn}
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
