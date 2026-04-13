import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import L from 'leaflet';
import {
  ArrowRight, CheckCircle, MapPin, User, Phone, FileText, Zap,
  CreditCard, TrendingUp, AlertCircle, Truck, RefreshCw, Package, Image as ImageIcon, Banknote, Smartphone, DollarSign, Building2, Box
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './PlaceOrder.css';
import Vodafone from '../assets/vodafonee.png';
import Visa from '../assets/R.png';
import Fawry from '../assets/فوري.png';
import BankTransfer from '../assets/2تحويل بنكي.png';
import CashOnDelivery from '../assets/الدفع عند الاستلام.png';
import InstaPay from '../assets/InstaPay.png';

// ─── Translations ───────────────────────────────────────────────────────
const T = {
  en: {
    title: 'Confirm Order',
    subtitle: 'Review and confirm your order',
    backToMarket: 'Back to Waste Details',
    wasteDetails: 'Waste Details',
    quantity: 'Quantity',
    pricePerUnit: 'Price per Unit',
    totalPrice: 'Total Price',
    sellerInfo: 'Seller Information',
    sellerName: 'Seller Name',
    sellerPhone: 'Seller Phone',
    deliveryMethod: 'Delivery Method',
    pickupFromFactory: 'Pickup from Factory',
    deliveryToMe: 'Delivery to My Location',
    paymentMethod: 'Payment Method',
    confirmOrder: 'Confirm Order',
    orderConfirmed: 'Order Confirmed Successfully!',
    orderID: 'Order ID',
    trackOrder: 'Track Order',
    orderSummary: 'Order Summary',
    estimatedDelivery: 'Estimated Delivery',
    days: 'Business Days',
    directUsage: 'Direct Usage',
    recycling: 'Send to Recycling',
    recyclerName: 'Recycler Name',
    selectRecycler: 'Select a Recycler',
    noRecyclerSelected: 'No recycler selected',
    deliveryInfo: 'Delivery Information',
    recipientName: 'Recipient Name',
    recipientPhone: 'Recipient Phone',
    deliveryAddress: 'Delivery Address',
    governorate: 'Governorate',
    ecocvFees: 'ECOv Platform Fees',
    commission: '(Partnership Commission)',
    subtotal: 'Base Price',
    totalWithFees: 'Total with Fees',
    cashPayment: 'Cash on Delivery',
    cashPaymentDesc: 'Pay upon order receipt',
    bankTransfer: 'Bank Transfer',
    bankTransferDesc: 'Transfer to your bank account',
    cardPayment: 'Credit Card',
    cardPaymentDesc: 'Pay with credit card',
    vodafone: 'Vodafone',
    vodafoneDesc: 'Vodafone Digital Wallet',
    fawry: 'Fawry',
    fawryDesc: 'Instant Transfer',
    instapay: 'InstaPay',
    instapayDesc: 'InstaPay App Payment',
    accountNumberRequired: 'Account number is required',
    bankNameRequired: 'Bank name is required',
    accountNumberInvalid: 'Account number is invalid',
    cardNumberRequired: 'Card number is required',
    cvvRequired: 'CVV is required',
    expiryDateRequired: 'Expiry date is required',
    cardNumberInvalid: 'Card number is invalid',
    cvvInvalid: 'CVV is invalid',
    phoneNumberRequired: 'Phone number is required',
    phoneNumberInvalid: 'Phone number is invalid',
    processing: '⏳ Processing your order...',
    searching: '🔍 Searching for listing...',
    sending: '📤 Sending order...',
    success: '✅ Order created successfully!',
    listingIdMissing: '❌ Error: Listing ID missing',
    enterRecipientName: '❌ Please enter recipient name',
    confirmPaymentDetails: '❌ Please confirm payment details',
    noQuantityAvailable: '❌ Error: No quantity available',
    orderIdNotReceived: '❌ Error: Order ID not received from server',
    unexpectedError: '❌ Unexpected error',
  },
  ar: {
    title: 'تأكيد الطلب',
    subtitle: 'قم بمراجعة وتأكيد طلبك',
    backToMarket: 'العودة الي تفاصيل المخلفات',
    wasteDetails: 'تفاصيل المخلفات',
    quantity: 'الكمية',
    pricePerUnit: 'السعر للوحدة',
    totalPrice: 'السعر الإجمالي',
    sellerInfo: 'معلومات البائع',
    sellerName: 'اسم البائع',
    sellerPhone: 'هاتف البائع',
    deliveryMethod: 'طريقة التسليم',
    pickupFromFactory: 'استلام من المصنع',
    deliveryToMe: 'تسليم إلى موقعي',
    paymentMethod: 'طريقة الدفع',
    confirmOrder: 'تأكيد الطلب',
    orderConfirmed: 'تم تأكيد الطلبية بنجاح!',
    orderID: 'رقم الطلب',
    trackOrder: 'تتبع الطلب',
    orderSummary: 'ملخص الطلب',
    estimatedDelivery: 'التسليم المتوقع',
    days: 'أيام عمل',
    directUsage: 'استخدام مباشر',
    recycling: 'إرسال للتدوير',
    recyclerName: 'معامل التدوير',
    selectRecycler: 'اختر معامل تدوير',
    noRecyclerSelected: 'لم يتم اختيار معامل تدوير',
    deliveryInfo: 'معلومات التوصيل',
    recipientName: 'اسم المستقبل',
    recipientPhone: 'رقم هاتف المستقبل',
    deliveryAddress: 'عنوان التوصيل',
    governorate: 'المحافظة',
    ecocvFees: 'رسوم منصة ECOv',
    commission: '(عمولة الشراكة)',
    subtotal: 'السعر الأساسي',
    totalWithFees: 'الإجمالي شامل الرسوم',
    cashPayment: 'دفع عند الاستلام',
    cashPaymentDesc: 'الدفع عند استلام الطلب',
    bankTransfer: 'تحويل بنكي',
    bankTransferDesc: 'تحويل إلى حسابك البنكي',
    cardPayment: 'بطاقة ائتمانية',
    cardPaymentDesc: 'دفع بالبطاقة الائتمانية',
    vodafone: 'فودافون',
    vodafoneDesc: 'محفظة فودافون الرقمية',
    fawry: 'فوري',
    fawryDesc: 'تحويل فوري',
    instapay: 'InstaPay',
    instapayDesc: 'تطبيق InstaPay للدفع',
    accountNumberRequired: 'رقم الحساب مطلوب',
    bankNameRequired: 'اسم البنك مطلوب',
    accountNumberInvalid: 'رقم الحساب غير صحيح',
    cardNumberRequired: 'رقم البطاقة مطلوب',
    cvvRequired: 'CVV مطلوب',
    expiryDateRequired: 'تاريخ الصلاحية مطلوب',
    cardNumberInvalid: 'رقم البطاقة غير صحيح',
    cvvInvalid: 'CVV غير صحيح',
    phoneNumberRequired: 'رقم الهاتف مطلوب',
    phoneNumberInvalid: 'رقم الهاتف غير صحيح',
    processing: '⏳ جاري معالجة طلبك...',
    searching: '🔍 جاري البحث عن الإعلان...',
    sending: '📤 جاري إرسال الطلب...',
    success: '✅ تم إنشاء الطلب بنجاح!',
    listingIdMissing: '❌ خطأ: معرف الإعلان مفقود',
    enterRecipientName: '❌ يرجى إدخال اسم المستقبل',
    confirmPaymentDetails: '❌ يرجى تأكيد بيانات الدفع',
    noQuantityAvailable: '❌ خطأ: لا توجد كمية متاحة',
    orderIdNotReceived: '❌ خطأ: لم يتم الحصول على رقم الطلب',
    unexpectedError: '❌ خطأ غير متوقع',
  }
};

// ─── Static Data (Same as WasteDetails) ───────────────────────────────────
const STATIC_WASTE_ITEMS = [
  { 
    id:1, listingId:'123456', titleAr:'Used Plastic Barrels', titleEn:'Used Plastic Barrels', category:'plastic', 
    companyAr:'Delta Petrochemicals Factory', companyEn:'Delta Petrochemicals Factory',
    price:45, unit:'barrel', unitAr:'barrel', unitEn:'barrel', amount:5, lat: 30.5076, lng: 31.7461,
    seller:{ 
      name:'Delta Factory',
      nameEn: 'Delta Factory',
      verified:true, rating:4.7, 
      whatsapp:'201001234567', phone:'201001234567',
      email: 'delta@ecov.com',
      address: '10th of Ramadan City - Egypt',
      governorate: 'Sharqia',
      contactPerson: 'Ahmed Mohamed',
      lat: 30.5076,
      lng: 31.7461
    }, 
    descAr:'HDPE barrels 200L capacity, clean and reusable',
    locAr:'10th of Ramadan City', views:124, offers:8, status:'Active', 
    image:'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400',
    ecocvCommission: 5
  },
  { 
    id:2, listingId:'654321', titleAr:'High Quality Scrap Metal', titleEn:'High Quality Scrap Metal', category:'metal', 
    companyAr:'Egyptian Steel Company', companyEn:'Egyptian Steel Company',
    price:3200, unit:'ton', unitAr:'ton', unitEn:'ton', amount:20, lat: 30.0131, lng: 30.6655,
    seller:{ 
      name:'Egyptian Steel Co.',
      nameEn: 'Egyptian Steel Co.',
      verified:true, rating:4.9, 
      whatsapp:'201009876543', phone:'201009876543',
      email: 'info@egsteel.com',
      address: '6th of October City - Egypt',
      governorate: 'Giza',
      contactPerson: 'Mahmoud Ali',
      lat: 30.0131,
      lng: 30.6655
    }, 
    descAr:'A-grade scrap iron suitable for smelting and remanufacturing',
    locAr:'6th of October City', views:340, offers:22, status:'Active', 
    image:'https://images.pexels.com/photos/404974/pexels-photo-404974.jpeg?auto=compress&cs=tinysrgb&w=400',
    ecocvCommission: 3
  },
  { 
    id:3, listingId:'789012', titleAr:'Compressed Paper Cardboard', titleEn:'Compressed Paper Cardboard', category:'paper', 
    companyAr:'Modern Generation Printing', companyEn:'Modern Generation Printing',
    price:800, unit:'ton', unitAr:'ton', unitEn:'ton', amount:8, lat: 30.1781, lng: 31.1234,
    seller:{ 
      name:'Modern Printing Ltd.',
      nameEn: 'Modern Printing Ltd.',
      verified:false, rating:4.5, 
      whatsapp:'201005555555', phone:'201005555555',
      email: 'sales@modernprint.com',
      address: 'Obour City - Egypt',
      governorate: 'Qalyubia',
      contactPerson: 'Sara Hassan',
      lat: 30.1781,
      lng: 31.1234
    }, 
    descAr:'Compressed cardboard in bales ready for shipping',
    locAr:'Obour City', views:89, offers:5, status:'Active', 
    image:'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?auto=compress&cs=tinysrgb&w=400',
    ecocvCommission: 4
  },
];

const RECYCLERS = [
  { id:1, name:'RV Recycling', loc:'10th of Ramadan City', phone:'201001234567', rating:4.9, completed:500 },
  { id:2, name:'Nile Recycling', loc:'Cairo', phone:'201009876543', rating:4.7, completed:350 },
  { id:3, name:'Alexandria Recycling', loc:'Alexandria', phone:'201005555555', rating:4.6, completed:280 },
];

// ─── Delivery Location Map Component ───────────────────────────────────────
const DeliveryLocationMap = ({ lat = 30.0444, lng = 31.2357, address = 'Factory Location', sellerName = 'Factory' }) => {
  const mapId = React.useMemo(() => `map-${Math.random().toString(36).substr(2, 9)}`, []);
  const mapInstanceRef = React.useRef(null);

  React.useEffect(() => {
    const mapElement = document.getElementById(mapId);
    if (!mapElement) {
      console.warn('Map element not found:', mapId);
      return;
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    try {
      const map = L.map(mapElement).setView([lat, lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        attribution: '© OpenStreetMap',
        maxZoom: 19
      }).addTo(map);
      
      L.marker([lat, lng]).addTo(map).bindPopup(`<b>${sellerName}</b><br>${address}`);
      
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 100);

      mapInstanceRef.current = map;
      console.log('✅ Map loaded:', mapId);
    } catch (err) {
      console.error('❌ Map error:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, address, sellerName, mapId]);

  return <div id={mapId} style={{ width: '100%', height: '140px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #e5e7eb', position: 'relative' }} />;
};

// ─── Waste Type Mapping ───────────────────────────────────────────────────────
const wasteTypeMap = {
  'plastic': 'Plastic Waste',
  'metal': 'Metal Scrap',
  'paper': 'Paper Waste',
  'glass': 'Glass Waste',
  'wood': 'Wood Waste',
  'textile': 'Textile Waste',
  'electronic': 'Electronic Waste',
  'electronics': 'Electronic Waste',
  'chemicals': 'Chemical Waste',
  'chemical': 'Chemical Waste',
  'packaging': 'Packaging Waste',
  'عام': 'General Waste'
};

// Helper function to get mapped waste type
const getMappedWasteType = (wasteTitle) => {
  if (!wasteTitle) return 'Waste Material';
  const wasteTypeLower = wasteTitle.toLowerCase();
  return wasteTypeMap[wasteTypeLower] || wasteTitle;
};

// ─── Main Component ───────────────────────────────────────────────────────
export default function PlaceOrder({ lang = 'en' }) {
  const t = T[lang] || T.en;
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Get order type from location state (directUsage or recycling)
  const orderType = location.state?.orderType || 'directUsage';
  const selectedRecycler = location.state?.recycler || null;

  const [customListings, setCustomListings] = useState([]);
  const [waste, setWaste] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
  const [currentOrderId] = useState(() => `ORD-${String(Math.floor(100000 + Math.random() * 900000))}`);
  const [newOrderId, setNewOrderId] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [selectingPaymentMethod, setSelectingPaymentMethod] = useState(false);
  const [showConfirmChangePayment, setShowConfirmChangePayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderStatusMessage, setOrderStatusMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  const isQuantityDivisible = location.state?.isQuantityDivisible !== false;

  const paymentMethods = [
    { value: 'cash', label: t.cashPayment, description: t.cashPaymentDesc, image: CashOnDelivery, icon: null },
    { value: 'bank-transfer', label: t.bankTransfer, description: t.bankTransferDesc, image: BankTransfer, icon: null },
    { value: 'card', label: t.cardPayment, description: t.cardPaymentDesc, image: Visa, icon: null },
    { value: 'vodafone', label: t.vodafone, description: t.vodafoneDesc, image: Vodafone, icon: null },
    { value: 'instant', label: t.fawry, description: t.fawryDesc, image: Fawry, icon: null },
    { value: 'instapay', label: t.instapay, description: t.instapayDesc, image: InstaPay, icon: null },
  ];

  const validatePaymentInfo = async () => {
    if (paymentMethod === 'cash') {
      setShowPaymentModal(false);
      setPaymentVerified(false);
      return;
    }

    setPaymentVerifying(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let isValid = false;
      let validationErrors = [];

      if (paymentMethod === 'bank-transfer') {
        if (!paymentInfo.accountNumber) validationErrors.push(t.accountNumberRequired);
        if (!paymentInfo.bankName) validationErrors.push(t.bankNameRequired);
        if (paymentInfo.accountNumber && paymentInfo.accountNumber.length < 10) validationErrors.push(t.accountNumberInvalid);
        isValid = validationErrors.length === 0;
      } else if (paymentMethod === 'card') {
        if (!paymentInfo.cardNumber) validationErrors.push(t.cardNumberRequired);
        if (!paymentInfo.cvv) validationErrors.push(t.cvvRequired);
        if (!paymentInfo.expiryDate) validationErrors.push(t.expiryDateRequired);
        if (paymentInfo.cardNumber && paymentInfo.cardNumber.length < 16) validationErrors.push(t.cardNumberInvalid);
        if (paymentInfo.cvv && paymentInfo.cvv.length < 3) validationErrors.push(t.cvvInvalid);
        isValid = validationErrors.length === 0;
      } else if (paymentMethod === 'vodafone' || paymentMethod === 'instant' || paymentMethod === 'instapay') {
        if (!paymentInfo.phoneNumber) validationErrors.push(t.phoneNumberRequired);
        if (paymentInfo.phoneNumber && paymentInfo.phoneNumber.length < 11) validationErrors.push(t.phoneNumberInvalid);
        isValid = validationErrors.length === 0;
      }

      if (isValid) {
        setPaymentVerified(true);
      } else {
        alert(validationErrors.join('\n'));
      }
    } finally {
      setPaymentVerifying(false);
    }
  };

  const handleChangePaymentMethod = () => {
    const hasData = Object.keys(paymentInfo).some(key => paymentInfo[key]);
    
    if (hasData && !paymentVerified) {
      setShowConfirmChangePayment(true);
    } else {
      setSelectingPaymentMethod(true);
    }
  };

  const confirmPaymentMethodChange = () => {
    setShowConfirmChangePayment(false);
    setPaymentInfo({});
    setPaymentVerified(false);
    setSelectingPaymentMethod(true);
  };

  const [deliveryInfo, setDeliveryInfo] = useState({
    recipientName: '',
    recipientPhone: '',
    deliveryAddress: '',
    governorate: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({});

  const [, setCurrentUser] = useState(null);
  const [factoryName, setFactoryName] = useState(null);

  useEffect(() => {
    try {
      const listings = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
      
      const generateListingIdIfMissing = (item) => {
        if (!item.listingId) {
          return String(Math.floor(100000 + (item.id % 900000))).padStart(6, '0');
        }
        return item.listingId;
      };
      
      const normalizedListings = listings.map(item => {
        let image = item.image || item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : '');
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
      setCustomListings(normalizedListings);
    } catch (e) {
      console.error('Error loading custom listings:', e);
    }

    try {
      const ecovUser = JSON.parse(localStorage.getItem('ecov_user') || '{}');
      const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const mergedUser = { ...user, ...userProfile, ...ecovUser };
      setCurrentUser(mergedUser);
      
      const currentFactoryName = 
        ecovUser?.factoryName || 
        mergedUser?.factoryName || 
        mergedUser?.companyName || 
        userProfile?.factoryName || 
        user?.factoryName || 
        userProfile?.name || 
        user?.name || 
        null;
      
      console.log('Factory Name extracted:', currentFactoryName, 'from user:', mergedUser);
      setFactoryName(currentFactoryName);
      
      if (mergedUser.name) {
        setDeliveryInfo(prev => ({
          ...prev,
          recipientName: mergedUser.name || '',
          recipientPhone: mergedUser.phone || '',
          deliveryAddress: mergedUser.address || '',
          governorate: mergedUser.governorate || '',
        }));
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    }
  }, []);

  useEffect(() => {
    const allItems = [...customListings, ...STATIC_WASTE_ITEMS];
    const wasteItem = allItems.find(w => String(w.id) === String(id));
    
    if (wasteItem) {
      let image = wasteItem.image || wasteItem.imageUrl || (wasteItem.images && wasteItem.images.length > 0 ? wasteItem.images[0] : '');
      
      if (image && typeof image === 'object' && image.imageUrl) {
        image = image.imageUrl;
      }
      
      if (image && typeof image === 'string' && image.startsWith('/')) {
        const apiBase = 'https://localhost:54464';
        image = `${apiBase}${image}`;
        console.log('🔗 Converted image to absolute:', image.substring(0, 60) + '...');
      }
      
      let seller = wasteItem.seller || {};
      if (!seller.lat || !seller.lng) {
        seller = {
          ...seller,
          lat: seller.lat || 30.0444,
          lng: seller.lng || 31.2357,
        };
      }
      
      const normalizedWaste = {
        ...wasteItem,
        image,
        seller,
      };
      
      console.log('Waste item loaded:', normalizedWaste);
      setWaste(normalizedWaste);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id, customListings]);


  

  const handleConfirmOrder = async () => {
    try {
      setIsProcessing(true);
      setOrderStatus('processing');
      setOrderStatusMessage(t.processing);

      if (!waste?.id && !waste?.listingId) {
        setOrderStatus('error');
        setOrderStatusMessage(t.listingIdMissing);
        return;
      }

      if (deliveryMethod === 'delivery' && !deliveryInfo.recipientName) {
        setOrderStatus('error');
        setOrderStatusMessage(t.enterRecipientName);
        return;
      }

      if (paymentMethod !== 'cash' && !paymentVerified) {
        setOrderStatus('error');
        setOrderStatusMessage(t.confirmPaymentDetails);
        return;
      }

      const currentUser = localStorage.getItem('ecov_user');
      const user = currentUser ? JSON.parse(currentUser) : null;

      let wasteListingId = null;
      let availableAmount = waste.amount || 1;
      const wasteIdNum = Number(waste.id);
      const isClientGeneratedId = wasteIdNum > 1_000_000_000_000;
      
      console.log('🔍 Waste ID analysis:', {
        wasteId: waste.id,
        isClientGeneratedId,
        wantsDatabaseId: true
      });
      
      setOrderStatusMessage(t.searching);
      
      if (isClientGeneratedId) {
        console.log('⚠️ Client-generated ID detected. Searching API for matching listing...');
        try {
          const searchResponse = await api.get('/marketplace/waste-listings', {
            params: { limit: 100, page: 1 }
          });
          
          console.log('📊 API Full Response:', {
            status: searchResponse.status,
            hasSuccessFlag: searchResponse.data?.success,
            dataKeys: Object.keys(searchResponse.data || {}),
            dataStructure: searchResponse.data?.data,
            isArray: Array.isArray(searchResponse.data?.data),
            length: Array.isArray(searchResponse.data?.data) ? searchResponse.data.data.length : 'N/A'
          });
          
          let listings = [];
          if (Array.isArray(searchResponse.data?.data)) {
            listings = searchResponse.data.data;
          } else if (searchResponse.data?.data?.items) {
            listings = searchResponse.data.data.items;
          } else if (searchResponse.data?.data?.results) {
            listings = searchResponse.data.data.results;
          }
          
          console.log('✅ Extracted listings count:', listings.length);
          
          if (listings.length > 0) {
            const selectedListing = listings[0];
            wasteListingId = selectedListing.id;
            availableAmount = selectedListing.amount || selectedListing.quantity || 1;
            
            console.log('✅ Using first available listing from API:', {
              id: wasteListingId,
              title: selectedListing.titleAr || selectedListing.type,
              price: selectedListing.price,
              availableAmount: availableAmount
            });
          } else {
            console.error('❌ No listings found in API response');
          }
        } catch (searchErr) {
          console.error('❌ Error fetching API listings:', searchErr);
        }
      } else {
        wasteListingId = wasteIdNum;
      }
      
      if (!wasteListingId) {
        const staticMatch = STATIC_WASTE_ITEMS.find(item => String(item.id) === String(waste.id));
        if (staticMatch) {
          wasteListingId = staticMatch.id;
          availableAmount = staticMatch.amount || 1;
          console.log('✅ Using STATIC_WASTE_ITEM ID:', wasteListingId);
        }
      }
      
      if (!wasteListingId) {
        wasteListingId = wasteIdNum;
        console.warn('⚠️ Using waste.id directly (may fail if not in database):', wasteListingId);
      }
      
      console.log('📝 Creating order with wasteListingId:', wasteListingId);
      
      let orderQuantity = selectedQuantity;
      if (selectedQuantity > availableAmount) {
        console.warn(`⚠️ Requested quantity (${selectedQuantity}) exceeds available (${availableAmount}). Capping to available.`);
        orderQuantity = availableAmount;
      }
      
      if (orderQuantity <= 0) {
        setOrderStatus('error');
        setOrderStatusMessage(t.noQuantityAvailable);
        return;
      }
      
      setOrderStatusMessage(t.sending);
      
      const directOrderData = {
        wasteListingId: wasteListingId,
        amount: orderQuantity,
        orderType: 'direct',
        recipientName: deliveryInfo.recipientName || null,
        recipientPhone: deliveryInfo.recipientPhone || null,
        deliveryAddress: deliveryInfo.deliveryAddress || null,
        governorate: deliveryInfo.governorate || null,
        deliveryMethod: deliveryMethod,
        paymentMethod: paymentMethod,
        notes: `Direct Usage Order - ${waste.titleAr} | Buyer: ${factoryName}`,
        sellerLat: waste.seller?.lat || waste.lat || 30.0444,
        sellerLng: waste.seller?.lng || waste.lng || 31.2357,
      };

      console.log('📤 Sending order request:', directOrderData);
      
      const response = await api.post('/orders', directOrderData);

      console.log('📨 API Response:', {
        status: response.status,
        hasSuccess: response.data?.success,
        hasId: response.data?.id || response.data?.data?.id,
        dataKeys: Object.keys(response.data || {}),
        structure: response.data
      });

      let orderId = null;
      let returnedListingId = null;

      if (response.data?.success && response.data?.data?.id) {
        orderId = response.data.data.id;
        returnedListingId = response.data.data.wasteListingId || wasteListingId;
        console.log('✅ Response Format 1: success + nested data');
      }
      else if (response.data?.id) {
        orderId = response.data.id;
        returnedListingId = response.data.wasteListingId || wasteListingId;
        console.log('✅ Response Format 2: direct properties');
      }
      else if (response.status === 201 || response.status === 200) {
        orderId = response.data?.orderNumber || currentOrderId;
        returnedListingId = wasteListingId;
        console.log('✅ Response Format 3: HTTP 200/201 fallback');
      }

      if (!orderId) {
        throw new Error(t.orderIdNotReceived);
      }

      setNewOrderId(orderId);
      setOrderCreated(true);
      setOrderStatus('success');
      setOrderDetails({
        orderId: orderId,
        wasteListingId: returnedListingId,
        quantity: orderQuantity,
        wasteType: waste.titleAr,
        price: waste.price
      });
      setOrderStatusMessage(t.success);
      console.log('✅ ORDER CREATED:', { orderId, wasteListingId: returnedListingId, quantity: orderQuantity });

      window.dispatchEvent(new CustomEvent('orderCreated', { 
        detail: { 
          wasteListingId: returnedListingId,
          reservedQuantity: orderQuantity 
        } 
      }));
      
      console.log('📡 Dispatched orderCreated event');

      // Prepare order summary data to pass to next page with correct field names
      const orderSummaryData = {
        orderNumber: orderId,
        listingId: returnedListingId,
        status: 'Pending',
        orderType: orderType,
        wasteType: getMappedWasteType(waste.titleAr) || waste.titleAr || 'Waste Material',
        category: waste.category || 'General',
        amount: orderQuantity,
        unit: waste.unit || waste.unitAr || 'ton',
        unitPrice: waste.price,
        totalPrice: waste.price * orderQuantity,
        sellerName: waste.seller?.name || waste.sellerName || factoryName || 'Unknown',
        buyerName: factoryName || user?.factoryName || 'Nile Factory',
        orderDateFormatted: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }),
        orderTimeFormatted: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }),
        deliveryMethod: deliveryMethod,
        paymentMethod: paymentMethod,
        deliveryAddress: deliveryInfo?.deliveryAddress || null,
        recipientName: deliveryInfo?.recipientName || null,
        wasteListingId: returnedListingId
      };

      setTimeout(() => {
        navigate('/orders', { 
          state: { 
            newOrder: orderSummaryData,
            orderCreated: true,
            orderId: orderId
          }
        });
      }, 3000);
    } catch (error) {
      console.error('❌ Error creating direct order:', error);
      
      let errorMsg = error.message || (isAr ? 'خطأ غير متوقع' : 'Unexpected error');
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
        errorMsg = error.response.data.errors[0];
        console.error('📋 Backend Validation Errors:', error.response.data.errors);
      }
      else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
        console.error('📋 Backend Error Message:', error.response.data.message);
      }
      else if (error.code === 'ERR_NETWORK') {
        errorMsg = isAr ? 'خطأ في الاتصال بالخادم' : 'Network connection error';
        console.error('🌐 Network Error:', error);
      }
      else if (error.code === 'ECONNABORTED') {
        errorMsg = isAr ? 'انقطع الاتصال - الرجاء المحاولة مجددا' : 'Connection timeout - please retry';
        console.error('⏱️ Timeout Error:', error);
      }
      else if (error.response?.status >= 500) {
        errorMsg = isAr ? 'خطأ في الخادم - يرجى المحاولة لاحقاً' : 'Server error - please try again later';
        console.error('🖥️ Server Error:', error.response.status, error.response.data);
      }
      else if (error.response?.status === 404) {
        errorMsg = isAr ? 'الإعلان لم يعد متاحاً' : 'Listing is no longer available';
        console.error('❌ Listing Not Found');
      }
      else if (error.response?.status === 401) {
        errorMsg = isAr ? 'جلسة انتهت - الرجاء تسجيل الدخول مجددا' : 'Session expired - please login again';
        console.error('🔐 Unauthorized');
      }
      else if (error.response?.status === 403) {
        errorMsg = isAr ? 'ليس لديك صلاحية لإنشاء طلب' : 'You do not have permission to create order';
        console.error('🚫 Forbidden');
      }
      else if (error.response?.status === 400) {
        errorMsg = error.response.data?.message || (isAr ? 'بيانات الطلب غير صحيحة' : 'Invalid order data');
        console.error('⚠️ Validation Error:', error.response.data);
      }
      
      setOrderStatus('error');
      setOrderStatusMessage(`❌ ${errorMsg}`);
      setIsProcessing(false);
    }
  };

  const handleBackToMarket = () => {
    navigate(`/waste-details/${id}`);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (!waste) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Waste item not found</p>
        <button 
          onClick={handleBackToMarket}
          style={{ marginTop: '1rem', padding: '10px 20px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          {t.backToMarket}
        </button>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '24px', padding: '3rem', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#fff', fontSize: '2rem' }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#166534', marginBottom: '12px' }}>
            {t.orderConfirmed}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.95rem' }}>
            Your order has been created and you will be contacted soon
          </p>
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>
              {t.orderID}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669', fontFamily: 'monospace' }}>
              {newOrderId}
            </div>
          </div>
          <button
            onClick={() => navigate('/orders')}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {t.trackOrder}
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = Number(waste.price) * Number(selectedQuantity);
  const ecocvFees = (totalPrice * 5) / 100;
  
  const deliveryCompanies = {
    'Cairo': { cost: 120, company: 'White Logistics' },
    'Alexandria': { cost: 180, company: 'Araba Cargo' },
    'Giza': { cost: 140, company: 'White Logistics' },
    'Qalyubia': { cost: 150, company: 'Tahadi Logistics' },
    'Sharqia': { cost: 200, company: 'Araba Cargo' },
    'Dakahlia': { cost: 190, company: 'Zamzam Logistics' },
    'Kafr El Sheikh': { cost: 220, company: 'Tahadi Logistics' },
    'Menoufia': { cost: 160, company: 'White Logistics' },
    'Gharbia': { cost: 210, company: 'Zamzam Logistics' },
  };

  const deliveryFee = deliveryMethod === 'delivery' && deliveryInfo.governorate 
    ? (deliveryCompanies[deliveryInfo.governorate]?.cost || 0)
    : 0;
  
  const deliveryCompany = deliveryMethod === 'delivery' && deliveryInfo.governorate
    ? (deliveryCompanies[deliveryInfo.governorate]?.company || '')
    : '';
  
  const totalWithFees = totalPrice + ecocvFees + deliveryFee;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f0fdf4 0%,#ecfdf5 50%,#f0f9ff 100%)', padding: '2rem 0' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: '2rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <button
            onClick={handleBackToMarket}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#fff', border: '1.5px solid rgba(16,185,129,0.2)', borderRadius: '10px', cursor: 'pointer', color: '#059669', fontWeight: '600', fontSize: '0.9rem', fontFamily: 'inherit' }}
          >
            <ArrowRight size={16} /> {t.backToMarket}
          </button>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#064e3b', margin: 0 }}>{t.title}</h1>
          <div style={{ width: '100px' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', width: '100%' }}>
          {/* Left Column - Main Content */}
          <div style={{ width: '100%', paddingLeft: '2rem', paddingRight: '2rem' }}>
            
            {/* Main Layout: Content + Summary Sidebar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '12px', marginBottom: '12px' }}>
              
              {/* Left Column - Main Content */}
              <div>
                {/* Top Row: Image + Waste Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', alignItems: 'stretch' }}>
                  {/* ─── Waste Details + Image ─── */}
                  <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', flexDirection: 'column' }}>
                    {/* IMG Section */}
                    <div style={{ width: '100%', height: '240px', background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                      {waste.image || waste.imageUrl || (waste.images && waste.images.length > 0 && waste.images[0]) ? (
                        <img 
                          src={waste.image || waste.imageUrl || (waste.images && waste.images[0])} 
                          alt={waste.titleAr} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={e => { e.target.style.display = 'none'; }} 
                        />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#059669' }}>
                          <ImageIcon size={40} />
                          <span style={{ fontSize: '0.85rem' }}>No image available</span>
                        </div>
                      )}
                      {/* ✅ Listing ID Badge */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', letterSpacing: '0.5px' }}>
                        ID: {waste?.listingId || 'N/A'}
                      </div>
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#059669', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700' }}>
                        ✓ Verified
                      </div>
                    </div>
                    {/* Details Section */}
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '900', color: '#064e3b', margin: '0 0 12px 0' }}>{waste.titleAr}</h3>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5, flex: 1 }}>{waste.descAr}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: '700', marginBottom: '4px' }}>Category</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#059669' }}>{waste.category}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: '700', marginBottom: '4px' }}>Available</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#059669' }}>{waste.amount}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─── Quantity and Price Information ─── */}
                  <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={16} color="#059669" /> Waste Details
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Available Quantity</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>{waste.amount} {waste.unit}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Requested Quantity</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}
                            style={{ width: '32px', height: '32px', border: '1.5px solid rgba(16,185,129,0.3)', background: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#059669', fontWeight: '800' }}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={waste.amount}
                            value={selectedQuantity}
                            onChange={e => setSelectedQuantity(Math.min(Number(e.target.value), waste.amount))}
                            style={{ flex: 1, padding: '6px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center', fontWeight: '700', color: '#059669', fontFamily: 'inherit' }}
                          />
                          <button
                            onClick={() => setSelectedQuantity(q => Math.min(waste.amount, q + 1))}
                            style={{ width: '32px', height: '32px', border: '1.5px solid rgba(16,185,129,0.3)', background: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#059669', fontWeight: '800' }}
                          >
                            +
                          </button>
                        </div>
                        {!isQuantityDivisible && selectedQuantity !== waste.amount && (
                          <div style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '6px', padding: '6px', background: '#fee2e2', borderRadius: '4px', textAlign: 'center', fontWeight: '600' }}>
                            Warning: Must purchase full quantity ({waste.amount})
                          </div>
                        )}
                      </div>
                      <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', marginTop: 'auto' }}>
                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Price per Unit</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>{waste.price.toLocaleString()} EGP</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Location + Delivery */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', alignItems: 'stretch' }}>
                  {/* ─── Factory Location Information ─── */}
                  <div style={{ background: '#fff', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#064e3b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="#059669" /> Location
                    </h3>
                    {waste?.seller?.lat && waste?.seller?.lng ? (
                      <div style={{ marginBottom: '12px' }}>
                        <DeliveryLocationMap 
                          lat={waste.seller.lat} 
                          lng={waste.seller.lng} 
                          address={waste.seller?.address || 'Factory Location'} 
                          sellerName={waste.seller?.name || 'Factory'} 
                        />
                      </div>
                    ) : (
                      <div style={{ marginBottom: '12px', padding: '12px', background: '#fef3c7', borderRadius: '8px', fontSize: '0.8rem', color: '#92400e' }}>
                        ⚠️ Map not available
                      </div>
                    )}
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#059669', marginBottom: '8px' }}>
                      {waste?.seller?.name} located here
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>
                      <div>{waste?.seller?.address}</div>
                      <div>{waste?.seller?.governorate}</div>
                    </div>
                  </div>

                  {/* ─── Delivery and Payment Method ─── */}
                  <div style={{ background: '#fff', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#064e3b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Truck size={16} color="#059669" /> Delivery Method
                      </h3>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {[
                          { value: 'pickup', label: 'Pickup from Factory' },
                          { value: 'delivery', label: 'Delivery to My Location' },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setDeliveryMethod(opt.value);
                              setShowDeliveryModal(true);
                            }}
                            style={{
                              padding: '11px 16px',
                              border: `2px solid ${deliveryMethod === opt.value ? '#059669' : '#e5e7eb'}`,
                              background: deliveryMethod === opt.value ? '#f0fdf4' : '#fff',
                              borderRadius: '10px',
                              color: deliveryMethod === opt.value ? '#059669' : '#374151',
                              fontWeight: '700',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              transition: 'all 0.2s',
                              fontFamily: 'inherit',
                              flex: 1,
                              minWidth: '140px',
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#064e3b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={16} color="#059669" /> Payment Method
                      </h3>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {paymentMethods.map(method => (
                          <div key={method.value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => {
                                setPaymentMethod(method.value);
                                if (method.value !== 'cash') {
                                  setShowPaymentModal(true);
                                }
                              }}
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                border: `2px solid ${paymentMethod === method.value ? '#059669' : 'rgba(5, 150, 105, 0.25)'}`,
                                background: paymentMethod === method.value ? '#f0fdf4' : 'rgba(240, 253, 244, 0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontFamily: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                backdropFilter: 'blur(8px)',
                                boxShadow: paymentMethod === method.value ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                              }}
                              title={method.label}
                            >
                              {method.image ? (
                                <img src={method.image} alt={method.label} style={{ width: (method.value === 'card' || method.value === 'instapay') ? '35px' : '50px', height: (method.value === 'card' || method.value === 'instapay') ? '35px' : '50px', objectFit: (method.value === 'card' || method.value === 'instapay') ? 'contain' : 'cover', borderRadius: (method.value === 'card' || method.value === 'instapay') ? '0px' : '50%', display: 'flex', margin: 'auto' }} />
                              ) : method.icon ? (
                                React.createElement(method.icon, { size: 28, color: '#059669' })
                              ) : null}
                            </button>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#374151', textAlign: 'center', maxWidth: '70px', lineHeight: '1.2' }}>
                              {method.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Order Summary */}
              <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius: '20px', padding: '16px', boxShadow: '0 4px 40px rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.2)', height: 'fit-content', position: 'sticky', top: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b', marginBottom: '10px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <CheckCircle size={18} color="#059669" /> Order Summary
                </h3>
                
                {/* Display Order ID */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '12px',
                  border: '2px solid #3b82f6',
                  boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.65rem', color: '#bfdbfe', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Order ID
                  </div>
                  <div style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: '900', 
                    color: '#fff',
                    fontFamily: 'monospace',
                    letterSpacing: '1px'
                  }}>
                    {currentOrderId}
                  </div>
                </div>

                {/* Display Listing ID */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  borderRadius: '10px',
                  padding: '10px',
                  marginBottom: '12px',
                  border: '2px solid #10b981',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.65rem', color: '#d1fae5', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Listing ID
                  </div>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '900', 
                    color: '#fff',
                    fontFamily: 'monospace',
                    letterSpacing: '0.5px'
                  }}>
                    {waste?.listingId || 'N/A'}
                  </div>
                </div>

                {/* Factory and Waste Type in 2-column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  {/* Factory (Seller and Buyer) */}
                  <div style={{ background: 'rgba(255,255,255,0.92)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={14} color="#059669" /> Factory
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Seller */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '8px', borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Seller</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669', lineHeight: '1.3' }}>{waste?.seller?.name || waste?.companyEn || 'Loading'}</div>
                      </div>
                      {/* Buyer */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Buyer</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#064e3b', lineHeight: '1.3' }}>{factoryName || 'Guest'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Type + Quantity */}
                  <div style={{ background: 'rgba(255,255,255,0.92)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Box size={16} color="#059669" /> Type
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#064e3b', lineHeight: '1.3', marginBottom: '10px' }}>{getMappedWasteType(waste.titleAr)}</div>
                    <div style={{ fontSize: '0.95rem', color: '#6b7280', paddingTop: '8px', borderTop: '1px solid rgba(16,185,129,0.15)', fontWeight: '700' }}>
                      Quantity: <span style={{ fontWeight: '800', color: '#059669', fontSize: '1.05rem' }}>{selectedQuantity} {waste.unit || waste.unitAr || ''}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ background: 'rgba(255,255,255,0.92)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={14} color="#059669" /> Price
                    </div>
                    <div style={{ fontSize: '0.75rem', lineHeight: '1.5', textAlign: 'center', color: '#374151' }}>
                      <div style={{ color: '#6b7280', marginBottom: '4px', fontSize: '0.7rem' }}>Unit Price ({waste.unit}): <span style={{ fontWeight: '700', color: '#059669' }}>{waste.price.toLocaleString()} EGP</span></div>
                      <div style={{ borderTop: '1px solid rgba(16,185,129,0.2)', paddingTop: '4px', marginTop: '4px', fontSize: '0.7rem' }}>
                        <span style={{ fontWeight: '700' }}>{selectedQuantity}</span> × <span style={{ fontWeight: '700' }}>{waste.price.toLocaleString()}</span> = <span style={{ fontWeight: '700', color: '#059669' }}>{totalPrice.toLocaleString()} EGP</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div style={{ background: 'rgba(255,255,255,0.92)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Truck size={14} color="#059669" /> Delivery
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#064e3b', marginBottom: '6px' }}>{deliveryMethod === 'pickup' ? 'Pickup from Factory' : 'Delivery to My Location'}</div>
                    {deliveryMethod === 'delivery' && deliveryInfo.deliveryAddress && (
                      <div style={{ fontSize: '0.75rem', color: '#374151', fontWeight: '600', paddingTop: '6px', borderTop: '1px solid rgba(16,185,129,0.15)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' }}>
                        {deliveryInfo.governorate && <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Governorate:</span> <span style={{ fontWeight: '700', color: '#059669' }}>{deliveryInfo.governorate}</span></div>}
                        {deliveryInfo.deliveryAddress && <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Address:</span> <span style={{ fontWeight: '700', color: '#059669', textAlign: 'right' }}>{deliveryInfo.deliveryAddress?.substring(0, 25)}</span></div>}
                        {deliveryInfo.recipientPhone && <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Phone:</span> <span style={{ fontWeight: '700', color: '#059669' }}>+20{deliveryInfo.recipientPhone}</span></div>}
                      </div>
                    )}
                  </div>

                  {/* Payment */}
                  <div style={{ background: 'rgba(255,255,255,0.92)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CreditCard size={14} color="#059669" /> Payment
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#064e3b', marginBottom: '6px' }}>{paymentMethods.find(m => m.value === paymentMethod)?.label}</div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div style={{ background: 'rgba(255,255,255,0.98)', padding: '10px', borderRadius: '10px', border: '2.5px solid rgba(16,185,129,0.4)', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280' }}>
                      <span>Waste Price:</span>
                      <span style={{ fontWeight: '700', color: '#059669' }}>{totalPrice.toLocaleString()} EGP</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280', paddingTop: '6px', borderTop: '1px solid rgba(16,185,129,0.2)' }}>
                      <span>ECOv Fees (5%):</span>
                      <span style={{ fontWeight: '700', color: '#059669' }}>{ecocvFees.toLocaleString()} EGP</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280', paddingTop: '6px', borderTop: '1px solid rgba(16,185,129,0.2)' }}>
                        <span>Delivery Fee:</span>
                        <span style={{ fontWeight: '700', color: '#dc2626' }}>{deliveryFee.toLocaleString()} EGP</span>
                      </div>
                    )}
                  </div>
                  <div style={{ paddingTop: '8px', borderTop: '2px solid rgba(16,185,129,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '700' }}>Total:</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#dc2626', letterSpacing: '0.4px' }}>{totalWithFees.toLocaleString()} EGP</span>
                    </div>
                  </div>
                </div>

                {/* Send Order Button */}
                <button onClick={handleConfirmOrder} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(5,150,105,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {t.confirmOrder}
                </button>
              </div>
            </div>

            {/* Order Type Info */}
            {orderType === 'recycling' && selectedRecycler && (
              <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: '20px', padding: '20px', marginBottom: '20px', border: '2px solid rgba(34,197,94,0.2)', boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#166534', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={16} color="#22c55e" /> {t.recycling}
                </h3>
                <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>{t.recyclerName}</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>{selectedRecycler.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>
                    <div><strong>Location:</strong> {selectedRecycler.loc}</div>
                    <div><strong>Rating:</strong> {selectedRecycler.rating}</div>
                    <div><strong>Completed Projects:</strong> {selectedRecycler.completed}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Delivery Modal ─── */}
            {showDeliveryModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#064e3b', marginBottom: '20px', textAlign: 'left' }}>Delivery Method</h2>
                  
                  {/* Delivery Method Selection */}
                  <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { value: 'pickup', label: 'Pickup from Factory', description: 'Pick up directly from seller location' },
                      { value: 'delivery', label: 'Delivery to My Location', description: 'Will be delivered to your address' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDeliveryMethod(opt.value)}
                        style={{
                          padding: '16px',
                          border: `2px solid ${deliveryMethod === opt.value ? '#059669' : '#e5e7eb'}`,
                          background: deliveryMethod === opt.value ? '#f0fdf4' : '#fff',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: deliveryMethod === opt.value ? '#059669' : '#374151' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
                          {opt.description}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Delivery Info Fields if Delivery Selected */}
                  {deliveryMethod === 'delivery' && (
                    <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b', marginBottom: '16px', textAlign: 'left' }}>Delivery Information</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Recipient Name"
                          value={deliveryInfo.recipientName}
                          onChange={e => setDeliveryInfo({ ...deliveryInfo, recipientName: e.target.value })}
                          style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left' }}
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={deliveryInfo.recipientPhone}
                          onChange={e => setDeliveryInfo({ ...deliveryInfo, recipientPhone: e.target.value })}
                          style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left' }}
                        />
                        <input
                          type="text"
                          placeholder="Delivery Address"
                          value={deliveryInfo.deliveryAddress}
                          onChange={e => setDeliveryInfo({ ...deliveryInfo, deliveryAddress: e.target.value })}
                          style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left' }}
                        />
                        <select
                          value={deliveryInfo.governorate}
                          onChange={e => setDeliveryInfo({ ...deliveryInfo, governorate: e.target.value })}
                          style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left' }}
                        >
                          <option value="">Select Governorate</option>
                          <option value="Cairo">Cairo</option>
                          <option value="Alexandria">Alexandria</option>
                          <option value="Giza">Giza</option>
                          <option value="Qalyubia">Qalyubia</option>
                          <option value="Sharqia">Sharqia</option>
                          <option value="Dakahlia">Dakahlia</option>
                          <option value="Kafr El Sheikh">Kafr El Sheikh</option>
                          <option value="Menoufia">Menoufia</option>
                          <option value="Gharbia">Gharbia</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Modal Buttons */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowDeliveryModal(false)}
                      style={{ padding: '12px 24px', background: '#f3f4f6', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowDeliveryModal(false)}
                      style={{ padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Payment Modal ─── */}
            {showPaymentModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                  
                  {/* Header - Show Selected Method Only */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    {!selectingPaymentMethod && (
                      <button
                        onClick={handleChangePaymentMethod}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          border: '1.5px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: '#374151',
                          fontFamily: 'inherit'
                        }}
                      >
                        Change
                      </button>
                    )}
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#064e3b', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                      {paymentVerified && <CheckCircle size={20} color="#059669" />}
                      {paymentMethods.find(m => m.value === paymentMethod)?.label}
                    </h2>
                  </div>

                  {/* Large Circular Payment Method Image - Display when not selecting */}
                  {!selectingPaymentMethod && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px', paddingBottom: '28px', borderBottom: '2px solid rgba(5, 150, 105, 0.1)', gap: '12px' }}>
                      <div style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        border: '3px solid #059669',
                        background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.8), rgba(236, 253, 245, 0.8))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(5, 150, 105, 0.15), inset 0 0 20px rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(20px)',
                      }}>
                        {paymentMethods.find(m => m.value === paymentMethod)?.image ? (
                          <img 
                            src={paymentMethods.find(m => m.value === paymentMethod)?.image} 
                            alt={paymentMethods.find(m => m.value === paymentMethod)?.label}
                            style={{ width: (paymentMethod === 'card' || paymentMethod === 'instapay') ? '100px' : '160px', height: (paymentMethod === 'card' || paymentMethod === 'instapay') ? '100px' : '160px', objectFit: (paymentMethod === 'card' || paymentMethod === 'instapay') ? 'contain' : 'cover', borderRadius: (paymentMethod === 'card' || paymentMethod === 'instapay') ? '0px' : '50%', display: 'flex', margin: 'auto' }}
                          />
                        ) : paymentMethods.find(m => m.value === paymentMethod)?.icon ? (
                          React.createElement(paymentMethods.find(m => m.value === paymentMethod)?.icon, { size: 80, color: '#059669' })
                        ) : null}
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', textAlign: 'center' }}>
                        {paymentMethods.find(m => m.value === paymentMethod)?.label}
                      </span>
                    </div>
                  )}

                  {/* Selection Mode - Show all payment methods */}
                  {selectingPaymentMethod && (
                    <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px', justifyItems: 'center' }}>
                        {paymentMethods.map(method => (
                          <div key={method.value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setPaymentMethod(method.value);
                                setPaymentInfo({});
                                setPaymentVerified(false);
                                setSelectingPaymentMethod(false);
                              }}
                              style={{
                                width: '90px',
                                height: '90px',
                                borderRadius: '50%',
                                border: `2.5px solid ${paymentMethod === method.value ? '#059669' : 'rgba(5, 150, 105, 0.2)'}`,
                                background: paymentMethod === method.value ? 'rgba(240, 253, 244, 0.9)' : 'rgba(240, 253, 244, 0.4)',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontFamily: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                backdropFilter: 'blur(10px)',
                                boxShadow: paymentMethod === method.value ? '0 6px 20px rgba(5, 150, 105, 0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
                              }}
                            >
                              {method.image ? (
                                <img src={method.image} alt={method.label} style={{ width: (method.value === 'card' || method.value === 'instapay') ? '60px' : '80px', height: (method.value === 'card' || method.value === 'instapay') ? '60px' : '80px', objectFit: (method.value === 'card' || method.value === 'instapay') ? 'contain' : 'cover', borderRadius: (method.value === 'card' || method.value === 'instapay') ? '0px' : '50%', display: 'flex', margin: 'auto' }} />
                              ) : method.icon ? (
                                React.createElement(method.icon, { size: 40, color: '#059669' })
                              ) : null}
                            </button>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', textAlign: 'center', maxWidth: '100px', lineHeight: '1.3' }}>
                              {method.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setSelectingPaymentMethod(false)}
                        style={{
                          marginTop: '12px',
                          padding: '12px 24px',
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#374151',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        Confirm Selection
                      </button>
                    </div>
                  )}

                  {/* Show Selected Payment Method Info */}
                  {!selectingPaymentMethod && paymentVerified && (
                    <div style={{ marginBottom: '24px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '2px solid #059669' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <CheckCircle size={20} color="#059669" />
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#059669' }}>
                          Payment details verified successfully
                        </span>
                      </div>
                      
                      {/* Show Payment Details */}
                      {paymentMethod === 'bank-transfer' && (
                        <div style={{ fontSize: '0.9rem', color: '#374151', marginTop: '8px', textAlign: 'left' }}>
                          <p><strong>Account Number:</strong> {paymentInfo.accountNumber}</p>
                          <p><strong>Bank Name:</strong> {paymentInfo.bankName}</p>
                          {paymentInfo.transferNumber && <p><strong>Transfer Number:</strong> {paymentInfo.transferNumber}</p>}
                        </div>
                      )}
                      
                      {paymentMethod === 'card' && (
                        <div style={{ fontSize: '0.9rem', color: '#374151', marginTop: '8px', textAlign: 'left' }}>
                          <p><strong>Card Number:</strong> **** **** **** {paymentInfo.cardNumber?.slice(-4)}</p>
                          <p><strong>Expiry Date:</strong> {paymentInfo.expiryDate}</p>
                        </div>
                      )}
                      
                      {(paymentMethod === 'vodafone' || paymentMethod === 'instant' || paymentMethod === 'instapay') && (
                        <div style={{ fontSize: '0.9rem', color: '#374151', marginTop: '8px', textAlign: 'left' }}>
                          <p><strong>Phone Number:</strong> {paymentInfo.phoneNumber}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Info Fields - Only when not verified and not selecting */}
                  {!paymentVerified && !selectingPaymentMethod && (
                    <>
                      {paymentMethod === 'bank-transfer' && (
                        <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b', marginBottom: '16px', textAlign: 'left' }}>Bank Transfer Details</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input
                              type="text"
                              placeholder="Your Account Number"
                              value={paymentInfo.accountNumber || ''}
                              onChange={e => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                              style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left' }}
                            />
                            <input
                              type="text"
                              placeholder="Bank Name"
                              value={paymentInfo.bankName || ''}
                              onChange={e => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                              style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left' }}
                            />
                            <input
                              type="text"
                              placeholder="Transfer Number (Optional)"
                              value={paymentInfo.transferNumber || ''}
                              onChange={e => setPaymentInfo({ ...paymentInfo, transferNumber: e.target.value })}
                              style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left' }}
                            />
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b', marginBottom: '16px', textAlign: 'left' }}>Card Details</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input
                              type="text"
                              placeholder="Card Number"
                              value={paymentInfo.cardNumber || ''}
                              onChange={e => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                              style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left' }}
                            />
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <input
                                type="text"
                                placeholder="CVV"
                                value={paymentInfo.cvv || ''}
                                onChange={e => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                                style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left', flex: 1 }}
                              />
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={paymentInfo.expiryDate || ''}
                                onChange={e => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                                style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left', flex: 1 }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'vodafone' && (
                        <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b', marginBottom: '16px', textAlign: 'left' }}>Vodafone Cash Number</h3>
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={paymentInfo.phoneNumber || ''}
                            onChange={e => setPaymentInfo({ ...paymentInfo, phoneNumber: e.target.value })}
                            style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', width: '100%', textAlign: 'left' }}
                          />
                        </div>
                      )}

                      {paymentMethod === 'instant' && (
                        <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b', marginBottom: '16px', textAlign: 'left' }}>Fawry Number</h3>
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={paymentInfo.phoneNumber || ''}
                            onChange={e => setPaymentInfo({ ...paymentInfo, phoneNumber: e.target.value })}
                            style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', width: '100%', textAlign: 'left' }}
                          />
                        </div>
                      )}

                      {paymentMethod === 'instapay' && (
                        <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b', marginBottom: '16px', textAlign: 'left' }}>InstaPay Number</h3>
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={paymentInfo.phoneNumber || ''}
                            onChange={e => setPaymentInfo({ ...paymentInfo, phoneNumber: e.target.value })}
                            style={{ padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', width: '100%', textAlign: 'left' }}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Modal Buttons - Hidden when selecting method */}
                  {!selectingPaymentMethod && (
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setShowPaymentModal(false);
                          setPaymentVerified(false);
                        }}
                        style={{ padding: '12px 24px', background: '#f3f4f6', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Cancel
                      </button>
                      
                      {!paymentVerified ? (
                        <button
                          onClick={validatePaymentInfo}
                          disabled={paymentVerifying}
                          style={{ 
                            padding: '12px 24px', 
                            background: paymentVerifying ? '#9ca3af' : '#059669', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '10px', 
                            fontWeight: '700', 
                            cursor: paymentVerifying ? 'wait' : 'pointer', 
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          {paymentVerifying && <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />}
                          {paymentVerifying ? 'Verifying...' : 'Verify & Confirm'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowPaymentModal(false)}
                          style={{ padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <CheckCircle size={18} />
                          Verified
                        </button>
                      )}
                    </div>
                  )}

                  <style>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              </div>
            )}

            {/* ─── Confirmation Modal - Change Payment Method ─── */}
            {showConfirmChangePayment && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#064e3b', marginBottom: '12px', textAlign: 'left' }}>Confirm Change</h3>
                  <p style={{ color: '#6b7280', marginBottom: '24px', textAlign: 'left', fontSize: '0.95rem' }}>
                    Are you sure you want to change the payment method? Any entered data will be cleared.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowConfirmChangePayment(false)}
                      style={{
                        padding: '10px 20px',
                        background: '#f3f4f6',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        color: '#374151'
                      }}
                    >
                      No, Keep
                    </button>
                    <button
                      onClick={confirmPaymentMethodChange}
                      style={{
                        padding: '10px 20px',
                        background: '#dc2626',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        color: '#fff'
                      }}
                    >
                      Yes, Change
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ 📊 ORDER STATUS MODAL ═══ */}
            {isProcessing && orderStatus && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(5px)' }}>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', maxWidth: '450px', width: '90%', boxShadow: '0 25px 80px rgba(0,0,0,0.3)', textAlign: 'center' }}>
                  
                  {/* Processing State */}
                  {orderStatus === 'processing' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <div style={{ width: '60px', height: '60px', border: '4px solid #f0fdf4', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      </div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#064e3b', marginBottom: '12px' }}>
                        Processing Your Order
                      </h2>
                      <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {orderStatusMessage}
                      </p>
                    </>
                  )}

                  {/* Success State */}
                  {orderStatus === 'success' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <div style={{ background: '#dcfce7', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle size={40} color="#059669" />
                        </div>
                      </div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#064e3b', marginBottom: '20px' }}>
                        ✅ Order Created Successfully!
                      </h2>
                      
                      {orderDetails && (
                        <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
                          <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '4px' }}>
                              Order ID:
                            </p>
                            <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                              {orderDetails.orderId}
                            </p>
                          </div>
                          
                          <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '4px' }}>
                              Listing ID:
                            </p>
                            <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                              {orderDetails.wasteListingId}
                            </p>
                          </div>

                          <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '4px' }}>
                              Waste Type:
                            </p>
                            <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#374151' }}>
                              {orderDetails.wasteType}
                            </p>
                          </div>

                          <div>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '4px' }}>
                              Quantity:
                            </p>
                            <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#374151' }}>
                              {orderDetails.quantity}
                            </p>
                          </div>
                        </div>
                      )}

                      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '24px' }}>
                        You will be redirected to your orders page in a few seconds...
                      </p>
                      <button
                        onClick={() => navigate('/orders')}
                        style={{ padding: '12px 32px', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem' }}
                      >
                        View My Orders
                      </button>
                    </>
                  )}

                  {/* Error State */}
                  {orderStatus === 'error' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <div style={{ background: '#fee2e2', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <AlertCircle size={40} color="#dc2626" />
                        </div>
                      </div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#991b1b', marginBottom: '12px' }}>
                        Error Occurred
                      </h2>
                      <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px', wordBreak: 'break-word' }}>
                        {orderStatusMessage}
                      </p>
                      <button
                        onClick={() => {
                          setIsProcessing(false);
                          setOrderStatus(null);
                          setOrderStatusMessage('');
                        }}
                        style={{ padding: '12px 32px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem' }}
                      >
                        OK
                      </button>
                    </>
                  )}

                  <style>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}