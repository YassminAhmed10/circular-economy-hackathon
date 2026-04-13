import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Truck, CreditCard, Package, CheckCircle, Building2, Box, DollarSign, Recycle, Star, Check } from 'lucide-react';
import api from '../services/api';
import Vodafone from '../assets/vodafonee.png';
import Visa from '../assets/R.png';
import Fawry from '../assets/فوري.png';
import BankTransfer from '../assets/2تحويل بنكي.png';
import CashOnDelivery from '../assets/الدفع عند الاستلام.png';
import InstaPay from '../assets/InstaPay.png';
import PickupFromFactory from '../assets/استلام من المصنع .png';
import DeliveryToMe from '../assets/تسليم إلى موقعي.png';
import EgyptFlag from '../assets/egypt-flag-2560px-1707px.jpg';
import { getWasteAsset } from '../services/circularEconomyApi';

// ✅ Function to create a unique ID (simple number)
const generateListingId = () => {
  // Generate a simple numeric ID: 100000 + random number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ─── Recycling Companies Logos ──────────────────────────────────────────
import AlShams from '../assets/الشمس كرتون ورق و بلاستيك.webp';
import Outgreens from '../assets/outgreens لمخلفات الزجاج والباستيك و المعادن و الورق  .png';
import Rubex from '../assets/Rubex-اعادة تدوير الخشب.png';
import AlSalam from '../assets/السلام لحلول التغليف.webp';
import TadweerFabrics from '../assets/تدوير للاقمشة.png';
import GreenLife from '../assets/Green Life اعادة تدوير المعادن و الالكترونيات .png';
import EnergyCo from '../assets/energy_co_اعادة تدوير المخلفات الالكترونية png.png';


// ─── Translations ───────────────────────────────────────────────────────
const T = {
  en: {
    title: 'Purchase Waste & Recycling Service',
    backToWaste: 'Back to Waste Details',
    wasteDetails: 'Waste Details',
    quantity: 'Quantity',
    availableQuantity: 'Available Quantity',
    requestedQuantity: 'Requested Quantity',
    pricePerUnit: 'Price per Unit',
    deliveryMethod: 'Delivery Method',
    pickupFromFactory: 'Pickup from Factory',
    deliveryToMe: 'Delivery to My Location',
    paymentMethod: 'Payment Method',
    selectRecycler: 'Select Recycling Facility',
    cyclingService: 'Recycling Service',
    enableRecycling: 'Enable Recycling Service',
    noRecycler: 'No Recycling',
    orderSummary: 'Order Summary',
    wasteType: 'Waste Type',
    factory: 'Factory',
    delivery: 'Delivery',
    payment: 'Payment',
    selectedRecycler: 'Selected Recycler',
    recyclingFee: 'Recycling Fee',
    total: 'Total',
    continueCheckout: 'Send Order',
    sendOrder: 'Send Order',
    loadingMessage: 'Loading...',
    noRecyclersFound: 'No recyclers found for this waste type',
    category: 'Category',
    available: 'Available',
    certified: 'Certified',
    selectRecyclerWarning: 'Please select a recycling facility to continue',
    confirmDeliveryData: 'Please confirm delivery information',
    confirmPaymentData: 'Please confirm payment information',
  },
};

// ─── Recyclers Data ─────────────────────────────────────────────────────
const RECYCLERS_BY_CATEGORY = {
  'بلاستيك': [
    { id: 1, name: 'شركة الشمس', rating: 4.9, logo: AlShams, imageAlt: 'شركة الشمس' },
    { id: 2, name: 'Outgreens', rating: 4.8, logo: Outgreens, imageAlt: 'Outgreens' },
  ],
  'plastic': [
    { id: 1, name: 'شركة الشمس', rating: 4.9, logo: AlShams, imageAlt: 'شركة الشمس' },
    { id: 2, name: 'Outgreens', rating: 4.8, logo: Outgreens, imageAlt: 'Outgreens' },
  ],
  'الخشب': [
    { id: 3, name: 'Rubex', rating: 4.7, logo: Rubex, imageAlt: 'Rubex' },
  ],
  'wood': [
    { id: 3, name: 'Rubex', rating: 4.7, logo: Rubex, imageAlt: 'Rubex' },
  ],
  'الورق و الكرتون': [
    { id: 1, name: 'شركة الشمس', rating: 4.9, logo: AlShams, imageAlt: 'شركة الشمس' },
    { id: 2, name: 'Outgreens', rating: 4.8, logo: Outgreens, imageAlt: 'Outgreens' },
    { id: 4, name: 'السلام لحلول التغليف', rating: 4.6, logo: AlSalam, imageAlt: 'السلام لحلول التغليف' },
  ],
  'paper': [
    { id: 1, name: 'شركة الشمس', rating: 4.9, logo: AlShams, imageAlt: 'شركة الشمس' },
    { id: 2, name: 'Outgreens', rating: 4.8, logo: Outgreens, imageAlt: 'Outgreens' },
    { id: 4, name: 'السلام لحلول التغليف', rating: 4.6, logo: AlSalam, imageAlt: 'السلام لحلول التغليف' },
  ],
  'الاقمشة': [
    { id: 4, name: 'السلام لحلول التغليف', rating: 4.6, logo: AlSalam, imageAlt: 'السلام لحلول التغليف' },
    { id: 5, name: 'تدوير للاقمشة', rating: 4.5, logo: TadweerFabrics, imageAlt: 'تدوير للاقمشة' },
  ],
  'fabric': [
    { id: 4, name: 'السلام لحلول التغليف', rating: 4.6, logo: AlSalam, imageAlt: 'السلام لحلول التغليف' },
    { id: 5, name: 'تدوير للاقمشة', rating: 4.5, logo: TadweerFabrics, imageAlt: 'تدوير للاقمشة' },
  ],
  'الزجاج': [
    { id: 2, name: 'Outgreens', rating: 4.8, logo: Outgreens, imageAlt: 'Outgreens' },
  ],
  'glass': [
    { id: 2, name: 'Outgreens', rating: 4.8, logo: Outgreens, imageAlt: 'Outgreens' },
  ],
  'المعادن': [
    { id: 6, name: 'Green Life', rating: 4.7, logo: GreenLife, imageAlt: 'Green Life' },
  ],
  'metals': [
    { id: 6, name: 'Green Life', rating: 4.7, logo: GreenLife, imageAlt: 'Green Life' },
  ],
  'الالكترونيات': [
    { id: 6, name: 'Green Life', rating: 4.7, logo: GreenLife, imageAlt: 'Green Life' },
    { id: 7, name: 'Energy Co', rating: 4.6, logo: EnergyCo, imageAlt: 'Energy Co' },
  ],
  'electronics': [
    { id: 6, name: 'Green Life', rating: 4.7, logo: GreenLife, imageAlt: 'Green Life' },
    { id: 7, name: 'Energy Co', rating: 4.6, logo: EnergyCo, imageAlt: 'Energy Co' },
  ],
  'packaging': [
    { id: 4, name: 'السلام لحلول التغليف', rating: 4.6, logo: AlSalam, imageAlt: 'السلام لحلول التغليف' },
    { id: 1, name: 'شركة الشمس', rating: 4.9, logo: AlShams, imageAlt: 'شركة الشمس' },
  ],
  'التغليف': [
    { id: 4, name: 'السلام لحلول التغليف', rating: 4.6, logo: AlSalam, imageAlt: 'السلام لحلول التغليف' },
    { id: 1, name: 'شركة الشمس', rating: 4.9, logo: AlShams, imageAlt: 'شركة الشمس' },
  ],
  'chemical': [
    { id: 1, name: 'شركة الشمس', rating: 4.9, logo: AlShams, imageAlt: 'شركة الشمس' },
  ],
  'كيميائي': [
    { id: 1, name: 'شركة الشمس', rating: 4.9, logo: AlShams, imageAlt: 'شركة الشمس' },
  ],
  'textile': [
    { id: 5, name: 'تدوير للاقمشة', rating: 4.5, logo: TadweerFabrics, imageAlt: 'تدوير للاقمشة' },
  ],
  'نسيج': [
    { id: 5, name: 'تدوير للاقمشة', rating: 4.5, logo: TadweerFabrics, imageAlt: 'تدوير للاقمشة' },
  ],
};

const RECYCLERS = [
  { id: 1, name: 'شركة الشمس', loc: 'العاشر من رمضان', phone: '201001234567', rating: 4.9, logo: '🟢' },
  { id: 2, name: 'معامل النيل', loc: 'القاهرة', phone: '201009876543', rating: 4.7, logo: '🔵' },
  { id: 3, name: 'الإسكندرية للتدوير', loc: 'الإسكندرية', phone: '201005555555', rating: 4.6, logo: '🟡' },
];

// ─── Payment Methods ───────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash on Delivery', image: CashOnDelivery },
  { value: 'bank-transfer', label: 'Bank Transfer', image: BankTransfer },
  { value: 'card', label: 'Visa Card', image: Visa },
  { value: 'vodafone', label: 'Vodafone Pay', image: Vodafone },
  { value: 'instant', label: 'Fawry', image: Fawry },
  { value: 'instapay', label: 'InstaPay', image: InstaPay },
];

// ─── Delivery Methods ───────────────────────────────────────────────────────
const DELIVERY_METHODS = [
  { value: 'pickup', label: 'Pickup from Factory', image: PickupFromFactory },
  { value: 'delivery', label: 'Delivery to Location', image: DeliveryToMe },
];

// ─── Main Component ───────────────────────────────────────────────────────
export default function RecyclerSelection({ lang = 'en' }) {
  const t = T[lang] || T.en;
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [waste, setWaste] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecyclerDetail, setSelectedRecyclerDetail] = useState(null);
  const [generatedOrderId] = useState(generateListingId()); // ✅ ID للطلب (ثابت للجلسة)
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('ecov_user');
    return user ? JSON.parse(user) : null;
  });
  
  // Delivery Modal States
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    governorate: '',
    factoryName: '',
    address: '',
    phone: '',
  });

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    vodafoneNumber: '',
    vodafonePin: '',
    bankAccountNumber: '',
    bankRoutingNumber: '',
  });

  // Modal Loading & Success States
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');
  const [confirmedDeliveryData, setConfirmedDeliveryData] = useState(null);
  const [confirmedPaymentData, setConfirmedPaymentData] = useState(null);

  // ✅ دالة لتوليد Listing ID إذا لم تكن موجودة
  const generateListingIdIfMissing = (item) => {
    if (!item?.listingId) {
      return String(Math.floor(100000 + ((item?.id || Math.random() * 999999) % 900000))).padStart(6, '0');
    }
    return item.listingId;
  };

  // Load waste data
  useEffect(() => {
    const loadWasteData = async () => {
      if (location.state?.waste) {
        // ✅ إضافة listingId إذا كانت مفقودة
        const waste = {
          ...location.state.waste,
          listingId: generateListingIdIfMissing(location.state.waste)
        };
        setWaste(waste);
        setSelectedQuantity(location.state.quantity || 1);
        setLoading(false);
      } else {
        try {
          const response = await getWasteAsset(id);
          if (response) {
            const waste = {
              id: response.id,
              titleAr: response.wasteTypeAr || response.titleAr || 'مخلفات',
              descAr: response.qualityNotes || response.descAr || 'تفاصيل غير متاحة',
              category: response.wasteTypeId || 'عام',
              companyAr: response.factoryName || 'مصنع',
              price: response.offeredPricePerUnit || 500,
              amount: response.availableQuantity || 100,
              image: response.imageUrl || 'https://images.unsplash.com/photo-1564760055-1f5188b6b0d4?w=300&h=300&fit=crop',
              unitAr: 'طن',
              // ✅ إضافة listingId من API إذا كانت موجودة، وإلا إنشاء واحدة
              listingId: response.listingId || generateListingIdIfMissing({ id: response.id })
            };
            setWaste(waste);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error loading waste data:', error);
          const waste = {
            id,
            titleAr: 'بلاستيك مستخدم',
            descAr: 'بلاستيك صناعي عالي الجودة جاهز لإعادة التدوير',
            category: 'بلاستيك',
            companyAr: 'مصنع',
            price: 500,
            amount: 100,
            image: 'https://images.unsplash.com/photo-1564760055-1f5188b6b0d4?w=300&h=300&fit=crop',
            unitAr: 'طن',
            // ✅ إضافة listingId عند الخطأ
            listingId: generateListingIdIfMissing({ id })
          };
          setWaste(waste);
          setLoading(false);
        }
      }
    };
    loadWasteData();
  }, [location.state, id]);

  // Calculate prices
  const totalPrice = waste ? Number(waste.price) * Number(selectedQuantity) : 0;
  const recyclingFee = selectedRecycler ? 800 * Number(selectedQuantity) : 0;
  const shippingFee = 150; // Fixed shipping cost
  const ecovFee = (totalPrice + recyclingFee + shippingFee) * 0.1;
  const finalTotal = totalPrice + recyclingFee + shippingFee + ecovFee;

  const handleContinue = async () => {
    if (!selectedRecycler) {
      alert('⚠️ Please select a recycling facility to continue');
      return;
    }
    if (!confirmedDeliveryData) {
      alert('⚠️ Please confirm delivery information');
      return;
    }
    if (!confirmedPaymentData) {
      alert('⚠️ Please confirm payment information');
      return;
    }
    if (waste && selectedQuantity > 0) {
      try {
        setModalLoading(true);
        
        // ✅ Recycler order data - sending to backend
        const recyclerOrderData = {
          wasteListingId: waste.id || parseInt(waste.listingId) || 1,
          amount: selectedQuantity,
          orderType: 'recycler', // ✅ Mark as recycler order
          recyclerId: selectedRecycler.id,
          deliveryMethod: deliveryMethod || 'pickup',
          paymentMethod: paymentMethod || 'cash',
          notes: `Recycler Order - ${waste.titleAr} | Quantity: ${selectedQuantity} | Recycler: ${selectedRecycler.name}`,
          // Delivery info
          recipientName: confirmedDeliveryData?.contactName || currentUser?.fullName,
          recipientPhone: confirmedDeliveryData?.phone || currentUser?.phone,
          deliveryAddress: confirmedDeliveryData?.address || '',
          governorate: confirmedDeliveryData?.governorate || '',
        };

        console.log('📤 Sending recycler order:', recyclerOrderData);
        
        // ✅ Send to backend /orders endpoint
        const response = await api.post('/orders', recyclerOrderData);

        if (response.status === 201 || response.data?.success || response.data?.id) {
          const orderId = response.data?.data?.id || response.data?.id;
          
          // ✅ Also save to localStorage for compatibility
          const existingOrders = JSON.parse(localStorage.getItem('ecov_buying_orders') || '[]');
          const newOrder = {
            id: orderId || Date.now().toString(),
            ...recyclerOrderData,
            createdAt: new Date().toISOString(),
            status: 'pending',
            createdBy: currentUser?.email || 'unknown',
          };
          existingOrders.push(newOrder);
          localStorage.setItem('ecov_buying_orders', JSON.stringify(existingOrders));

          // ✅ Signal marketplace to refresh listings (quantity reservation applied)
          window.dispatchEvent(new CustomEvent('orderCreated', { 
            detail: { 
              wasteListingId: waste.id,
              reservedQuantity: selectedQuantity,
              orderType: 'recycler'
            } 
          }));

          console.log('✅ Recycler order sent successfully:', orderId);
          
          setModalSuccess('✅ Order sent successfully!');
          setTimeout(() => {
            setModalSuccess('');
            navigate('/orders');
          }, 2000);
        } else {
          throw new Error(response.data?.message || 'Failed to send order');
        }
        
      } catch (error) {
        console.error('❌ Error creating recycler order:', error);
        alert('❌ Error: ' + error.message);
      } finally {
        setModalLoading(false);
      }
    }
  };

  // Get recyclers for current waste category
  const getFilteredRecyclers = () => {
    if (!waste?.category) {
      console.log('❌ No category found');
      return [];
    }
    
    const category = waste.category?.trim() || '';
    console.log('📦 Waste Category:', category);
    
    const recyclers = RECYCLERS_BY_CATEGORY[category];
    
    if (recyclers && recyclers.length > 0) {
      console.log('✅ Found recyclers:', recyclers.length);
      return recyclers;
    } else {
      console.log('⚠️ No recyclers found for category:', category);
      console.log('Available categories:', Object.keys(RECYCLERS_BY_CATEGORY));
      // Fallback - return default recyclers
      return [
        { id: 1, name: 'Al Shams Company', rating: 4.9, logo: AlShams, imageAlt: 'Al Shams Company' },
        { id: 2, name: 'Outgreens', rating: 4.8, logo: Outgreens, imageAlt: 'Outgreens' },
      ];
    }
  };

  // Handle delivery method change
  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
    if (method === 'delivery') {
      setShowDeliveryModal(true);
    }
  };

  // Handle delivery data input
  const handleDeliveryInputChange = (field, value) => {
    setDeliveryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method !== 'cash') {
      setShowPaymentModal(true);
    }
  };

  // Handle payment data input
  const handlePaymentInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Confirm delivery data
  const handleConfirmDelivery = async () => {
    if (!deliveryData.governorate || !deliveryData.factoryName || !deliveryData.address || !deliveryData.phone) {
      alert('⚠️ Please fill in all fields');
      return;
    }
    if (deliveryData.phone.length !== 10 || !/^1/.test(deliveryData.phone)) {
      alert('⚠️ Invalid phone number');
      return;
    }
    setModalLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s validation
    setConfirmedDeliveryData(deliveryData);
    setModalSuccess('✅ Delivery information confirmed');
    setTimeout(() => {
      setShowDeliveryModal(false);
      setModalLoading(false);
      setModalSuccess('');
    }, 2000);
  };

  // Confirm payment data
  const handleConfirmPayment = async () => {
    let isValid = true;
    
    if (paymentMethod === 'card') {
      isValid = paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv && paymentData.cardholderName;
    } else if (paymentMethod === 'vodafone') {
      isValid = paymentData.vodafoneNumber && paymentData.vodafoneNumber.length === 10 && /^1/.test(paymentData.vodafoneNumber) && paymentData.vodafonePin;
    } else if (paymentMethod === 'instant') {
      isValid = paymentData.vodafoneNumber && paymentData.vodafoneNumber.length === 10 && /^1/.test(paymentData.vodafoneNumber);
    } else if (paymentMethod === 'instapay') {
      isValid = paymentData.vodafoneNumber && paymentData.vodafoneNumber.length === 10 && /^1/.test(paymentData.vodafoneNumber);
    } else if (paymentMethod === 'bank-transfer') {
      isValid = paymentData.bankAccountNumber && paymentData.bankRoutingNumber;
    }

    if (!isValid) {
      alert('⚠️ Please fill in all fields correctly');
      return;
    }

    setModalLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s validation
    setConfirmedPaymentData(paymentData);
    setModalSuccess('✅ Payment information confirmed');
    setTimeout(() => {
      setShowPaymentModal(false);
      setModalLoading(false);
      setModalSuccess('');
    }, 2000);
  };

  // Governorate list for delivery
  const governorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الفيوم', 'المنيا', 'أسيوط', 
    'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'بني سويف', 'الشرقية',
    'الغربية', 'المنوفية', 'القليوبية', 'البحيرة', 'كفر الشيخ', 'دمياط',
    'الدقهلية', 'بورسعيد', 'السويس', 'شمال سيناء', 'جنوب سيناء', 'الأحمر'
  ];

  if (loading || !waste) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1rem', color: '#6b7280' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f0fdf4 0%,#ecfdf5 50%,#f0f9ff 100%)', padding: '2rem 0' }}>
      <div style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <button
            onClick={() => navigate(`/waste-details/${id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#fff', border: '1.5px solid rgba(16,185,129,0.2)', borderRadius: '10px', cursor: 'pointer', color: '#059669', fontWeight: '600', fontSize: '0.9rem', fontFamily: 'inherit' }}
          >
            <ArrowRight size={16} /> {t.backToWaste}
          </button>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#064e3b', margin: 0 }}>{t.title}</h1>
          <div style={{ width: '100px' }}></div>
        </div>

        {/* Main Layout */}
        <div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '12px' }}>
            
            {/* Left Column */}
            <div>
              
              {/* Product Card, Quantity, and Delivery/Payment - in 3 column grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px', alignItems: 'stretch' }}>
                
                {/* Product Card */}
                <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%', height: '240px', background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', display: 'flex',  alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    <img src={waste.image} alt={waste.titleAr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    {/* ✅ Listing ID Badge - محسّن الرؤية */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', letterSpacing: '0.5px' }}>
                      ID: {waste?.listingId || 'N/A'}
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#059669', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700' }}>✓ Certified</div>
                  </div>
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '900', color: '#064e3b', margin: '0 0 12px 0' }}>{waste.titleAr}</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5, flex: 1 }}>{waste.descAr}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Category</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#059669' }}>{waste.category}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Available</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#059669' }}>{waste.amount}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity and Price */}
                <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid rgba(16,185,129,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#059669', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={18} color="#059669" /> Waste Details
                    </h3>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    {/* Available Quantity */}
                    <div style={{ padding: '0', borderRadius: '0', border: 'none', textAlign: 'center', width: '100%' }}>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase' }}>{t.availableQuantity}</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#059669' }}>{waste.amount} {waste.unitAr}</div>
                    </div>
                    
                    {/* Selected Quantity */}
                    <div style={{ padding: '0', borderRadius: '0', border: 'none', textAlign: 'center', width: '100%' }}>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>{t.requestedQuantity}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                        <button onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))} style={{ width: '36px', height: '36px', border: '2px solid rgba(16,185,129,0.3)', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', color: '#059669', fontWeight: '800', fontFamily: 'inherit', transition: 'all 0.2s' }} onMouseEnter={(e) => {e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#059669'}} onMouseLeave={(e) => {e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'}}>−</button>
                        <input type="number" min="1" max={waste.amount} value={selectedQuantity} onChange={e => setSelectedQuantity(Math.min(Number(e.target.value), waste.amount))} style={{ width: '60px', padding: '8px', border: '2px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '1.1rem', textAlign: 'center', fontWeight: '800', color: '#059669', fontFamily: 'inherit', background: '#fff' }} />
                        <button onClick={() => setSelectedQuantity(q => Math.min(waste.amount, q + 1))} style={{ width: '36px', height: '36px', border: '2px solid rgba(16,185,129,0.3)', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', color: '#059669', fontWeight: '800', fontFamily: 'inherit', transition: 'all 0.2s' }} onMouseEnter={(e) => {e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#059669'}} onMouseLeave={(e) => {e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'}}>+</button>
                      </div>
                    </div>

                    {/* Price Per Unit */}
                    <div style={{ padding: '0', borderRadius: '0', border: 'none', paddingTop: '8px', borderTop: '2px solid rgba(16,185,129,0.2)', textAlign: 'center', width: '100%' }}>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase' }}>{t.pricePerUnit}</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#dc2626' }}>{waste.price.toLocaleString()} ج</div>
                    </div>
                  </div>
                </div>

                {/* Delivery and Payment Methods - Combined in one column */}
                <div style={{ background: '#fff', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#064e3b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={16} color="#059669" /> {t.deliveryMethod}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {DELIVERY_METHODS.map(method => (
                        <div key={method.value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => handleDeliveryMethodChange(method.value)} style={{ width: '70px', height: '70px', borderRadius: '50%', border: `2px solid ${deliveryMethod === method.value ? '#059669' : 'rgba(5, 150, 105, 0.25)'}`, background: deliveryMethod === method.value ? '#f0fdf4' : 'rgba(240, 253, 244, 0.5)', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxShadow: deliveryMethod === method.value ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }} title={method.label}>
                            <img src={method.image} alt={method.label} style={{ width: '65px', height: '65px', objectFit: 'cover', display: 'flex', margin: 'auto', borderRadius: '50%' }} />
                          </button>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#374151', textAlign: 'center', maxWidth: '75px', lineHeight: '1.2' }}>
                            {method.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#064e3b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={16} color="#059669" /> {t.paymentMethod}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {PAYMENT_METHODS.map(method => (
                        <div key={method.value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => handlePaymentMethodChange(method.value)} style={{ width: '70px', height: '70px', borderRadius: '50%', border: `2px solid ${paymentMethod === method.value ? '#059669' : 'rgba(5, 150, 105, 0.25)'}`, background: paymentMethod === method.value ? '#f0fdf4' : 'rgba(240, 253, 244, 0.5)', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxShadow: paymentMethod === method.value ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }} title={method.label}>
                            <img src={method.image} alt={method.label} style={{ width: (method.value === 'vodafone' || method.value === 'instant') ? '65px' : '45px', height: (method.value === 'vodafone' || method.value === 'instant') ? '65px' : '45px', objectFit: (method.value === 'vodafone' || method.value === 'instant') ? 'cover' : 'contain', display: 'flex', margin: 'auto', borderRadius: (method.value === 'vodafone' || method.value === 'instant') ? '50%' : '4px' }} />
                          </button>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#374151', textAlign: 'center', maxWidth: '75px', lineHeight: '1.2' }}>
                            {method.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recycling Service - MANDATORY */}
              <div style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', borderRadius: '20px', padding: '16px', boxShadow: '0 8px 32px rgba(6, 95, 70, 0.2)', border: 'none', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
                {/* Animated background elements */}
                <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '-30%', left: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite 2s' }} />
                
                <style>{`
                  @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(20px); }
                  }
                  @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                  }
                  .recycler-card {
                    animation: slideIn 0.5s ease-out forwards;
                    opacity: 0;
                  }
                  .recycler-card:nth-child(1) { animation-delay: 0s; }
                  .recycler-card:nth-child(2) { animation-delay: 0.1s; }
                  .recycler-card:nth-child(3) { animation-delay: 0.2s; }
                  .recycler-card:nth-child(4) { animation-delay: 0.3s; }
                  .recycler-card:nth-child(5) { animation-delay: 0.4s; }
                  .recycler-card:hover .logo-overlay {
                    opacity: 1 !important;
                  }
                `}</style>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#ecfdf5', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 8px 0' }}>
                    ♻️ Recycling Facility
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#d1fae5', marginBottom: '20px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                    Select a recycling facility specialized in processing your waste type
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center', alignItems: 'flex-start' }}>
                    {getFilteredRecyclers().map((recycler, idx) => (
                      <div
                        key={recycler.id}
                        className="recycler-card"
                        onClick={() => setSelectedRecycler(recycler)}
                        style={{
                          animationDelay: `${idx * 0.1}s`,
                          background: 'transparent',
                          border: '2px solid transparent',
                          borderRadius: '16px',
                          padding: '0',
                          cursor: 'pointer',
                          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          boxShadow: 'none',
                          position: 'relative',
                          overflow: 'visible',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedRecycler?.id !== recycler.id) {
                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        {/* Logo with overlay */}
                        <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', transition: 'all 0.3s ease' }}>
                          <img 
                            src={recycler.logo} 
                            alt={recycler.imageAlt} 
                            style={{ 
                              width: '160px', 
                              height: '160px', 
                              objectFit: 'contain', 
                              borderRadius: '16px',
                              transition: 'transform 0.3s ease, filter 0.3s ease',
                            }} 
                            onError={(e) => { e.target.style.display = 'none'; }} 
                          />
                          
                          {/* Overlay hover effect */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            borderRadius: '16px',
                          }}
                          className="logo-overlay"
                          />

                          {/* Checkmark badge */}
                          {selectedRecycler?.id === recycler.id && (
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#fff',
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem',
                              fontWeight: '800',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.5)',
                              border: '2px solid #fff',
                              animation: 'pulse 2s infinite',
                              zIndex: '10',
                            }}>
                              ✓
                            </div>
                          )}
                        </div>

                        {/* Text info - below logo */}
                        <h5 style={{ fontSize: '0.95rem', fontWeight: '800', margin: '0 0 4px 0', color: '#ecfdf5', textAlign: 'center' }}>{recycler.name}</h5>
                        <div style={{ fontSize: '0.75rem', color: '#d1fae5', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', marginBottom: '8px' }}>
                          ⭐ {recycler.rating}
                        </div>
                        
                        {/* Learn More Text Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecyclerDetail(recycler);
                          }}
                          style={{
                            fontSize: '0.8rem',
                            color: '#fbbf24',
                            background: 'none',
                            border: 'none',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontFamily: 'inherit',
                            transition: 'all 0.3s ease',
                            textDecoration: 'underline',
                            textDecorationColor: 'transparent',
                            textUnderlineOffset: '4px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#fcd34d';
                            e.currentTarget.style.textDecorationColor = '#fcd34d';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#fbbf24';
                            e.currentTarget.style.textDecorationColor = 'transparent';
                          }}
                        >
                          Learn More
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {!selectedRecycler && (
                    <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(255,255,255,0.15)', borderLeft: '4px solid #ffedd5', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)' }}>
                      <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                      <div style={{ fontSize: '0.9rem', color: '#fed7aa', fontWeight: '700' }}>A recycling facility must be selected to proceed</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius: '20px', padding: '16px', boxShadow: '0 4px 40px rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.2)', height: 'fit-content', position: 'sticky', top: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b', marginBottom: '10px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <CheckCircle size={18} color="#059669" /> {t.orderSummary}
              </h3>
              
              {/* Display Order ID - Generated when state changes */}
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
                  Order Number
                </div>
                <div style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: '900', 
                  color: '#fff',
                  fontFamily: 'monospace',
                  letterSpacing: '1px'
                }}>
                  {generatedOrderId}
                </div>
              </div>

              {/* ✅ Display Listing ID */}
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
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                {/* Factory */}
                <div style={{ background: 'rgba(255,255,255,0.92)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={14} color="#059669" /> Factory
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Seller */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '8px', borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
                      <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Seller</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669', lineHeight: '1.3' }}>{waste?.companyAr || 'Loading...'}</div>
                    </div>
                    {/* Buyer */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Buyer</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#064e3b', lineHeight: '1.3' }}>{currentUser?.factoryName || 'No Account'}</div>
                    </div>
                  </div>
                </div>

                {/* Type + Quantity */}
                <div style={{ background: 'rgba(255,255,255,0.92)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Box size={16} color="#059669" /> Type
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#064e3b', lineHeight: '1.3', marginBottom: '10px' }}>{waste.titleAr}</div>
                  <div style={{ fontSize: '0.95rem', color: '#6b7280', paddingTop: '8px', borderTop: '1px solid rgba(16,185,129,0.15)', fontWeight: '700' }}>
                    Quantity: <span style={{ fontWeight: '800', color: '#059669', fontSize: '1.05rem' }}>{selectedQuantity} {waste.unitAr}</span>
                  </div>
                </div>

                {/* Price */}
                <div style={{ background: 'rgba(255,255,255,0.92)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={14} color="#059669" /> Price
                  </div>
                  <div style={{ fontSize: '0.75rem', lineHeight: '1.5', textAlign: 'center', color: '#374151' }}>
                    <div style={{ color: '#6b7280', marginBottom: '4px', fontSize: '0.7rem' }}>Unit Price ({waste.unitAr}): <span style={{ fontWeight: '700', color: '#059669' }}>{waste.price.toLocaleString()} ج</span></div>
                    <div style={{ borderTop: '1px solid rgba(16,185,129,0.2)', paddingTop: '4px', marginTop: '4px', fontSize: '0.7rem' }}>
                      <span style={{ fontWeight: '700' }}>{selectedQuantity}</span> × <span style={{ fontWeight: '700' }}>{waste.price.toLocaleString()}</span> = <span style={{ fontWeight: '700', color: '#059669' }}>{totalPrice.toLocaleString()} ج</span>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div style={{ background: 'rgba(255,255,255,0.92)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Truck size={14} color="#059669" /> Delivery
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#064e3b', marginBottom: '6px' }}>{deliveryMethod === 'pickup' ? t.pickupFromFactory : t.deliveryToMe}</div>
                  {confirmedDeliveryData && (
                    <div style={{ fontSize: '0.75rem', color: '#374151', fontWeight: '600', paddingTop: '6px', borderTop: '1px solid rgba(16,185,129,0.15)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Governorate:</span> <span style={{ fontWeight: '700', color: '#059669' }}>{confirmedDeliveryData.governorate}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Address:</span> <span style={{ fontWeight: '700', color: '#059669', textAlign: 'left' }}>{confirmedDeliveryData.address?.substring(0, 25)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Phone:</span> <span style={{ fontWeight: '700', color: '#059669' }}>{confirmedDeliveryData.phone ? `+20${confirmedDeliveryData.phone}` : ''}</span></div>
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div style={{ background: 'rgba(255,255,255,0.92)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CreditCard size={14} color="#059669" /> Payment
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#064e3b', marginBottom: '6px' }}>{PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label}</div>
                  {confirmedPaymentData && (
                    <div style={{ fontSize: '0.75rem', color: '#374151', fontWeight: '600', paddingTop: '6px', borderTop: '1px solid rgba(16,185,129,0.15)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {paymentMethod === 'card' && <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Card Number:</span> <span style={{ fontWeight: '700', color: '#059669' }}>{confirmedPaymentData.cardNumber?.slice(-4).padStart(16, '*')}</span></div>}
                      {paymentMethod === 'vodafone' && <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Vodafone:</span> <span style={{ fontWeight: '700', color: '#059669' }}>{confirmedPaymentData.vodafoneNumber ? `+20${confirmedPaymentData.vodafoneNumber}` : ''}</span></div>}
                      {paymentMethod === 'instant' && <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Fawry:</span> <span style={{ fontWeight: '700', color: '#059669' }}>{confirmedPaymentData.vodafoneNumber ? `+20${confirmedPaymentData.vodafoneNumber}` : ''}</span></div>}
                      {paymentMethod === 'instapay' && <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>InstaPay:</span> <span style={{ fontWeight: '700', color: '#059669' }}>{confirmedPaymentData.vodafoneNumber ? `+20${confirmedPaymentData.vodafoneNumber}` : ''}</span></div>}
                      {paymentMethod === 'bank-transfer' && <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ color: '#6b7280' }}>Account:</span> <span style={{ fontWeight: '700', color: '#059669' }}>{confirmedPaymentData.bankAccountNumber?.slice(-4).padStart(8, '*')}</span></div>}
                      <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '3px', fontWeight: '700', letterSpacing: '0.2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Check size={12} color="#059669" /> Confirmed
                      </div>
                    </div>
                  )}
                </div>

                {/* Recycling Facility */}
                {selectedRecycler && (
                  <div style={{ background: 'rgba(255,255,255,0.92)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(255,193,7,0.3)', gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Recycle size={14} color="#f59e0b" /> Recycling Facility
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ fontSize: '0.75rem' }}>
                        <div style={{ fontWeight: '700', color: '#064e3b', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Building2 size={13} color="#f59e0b" /> {selectedRecycler.name}
                        </div>
                        <div style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Star size={11} color="#f59e0b" fill="#f59e0b" /> {selectedRecycler.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Financial Summary */}
              <div style={{ background: 'rgba(255,255,255,0.98)', padding: '10px', borderRadius: '10px', border: '2.5px solid rgba(16,185,129,0.4)', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280' }}>
                    <span>Waste Price:</span>
                    <span style={{ fontWeight: '700', color: '#059669' }}>{totalPrice.toLocaleString()} ج</span>
                  </div>
                  {recyclingFee > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280', paddingTop: '6px', borderTop: '1px solid rgba(16,185,129,0.2)' }}>
                      <span>{t.recyclingFee}:</span>
                      <span style={{ fontWeight: '700', color: '#f59e0b' }}>{recyclingFee.toLocaleString()} ج</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280', paddingTop: '6px', borderTop: '1px solid rgba(16,185,129,0.2)' }}>
                    <span>Shipping Fee:</span>
                    <span style={{ fontWeight: '700', color: '#dc2626' }}>{shippingFee.toLocaleString()} ج</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280', paddingTop: '6px', borderTop: '1px solid rgba(16,185,129,0.2)' }}>
                    <span>ECoV Fee (10%):</span>
                    <span style={{ fontWeight: '700', color: '#059669' }}>{ecovFee.toLocaleString()} ج</span>
                  </div>
                </div>
                <div style={{ paddingTop: '8px', borderTop: '2px solid rgba(16,185,129,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '700' }}>Total:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#dc2626', letterSpacing: '0.4px' }}>{finalTotal.toLocaleString()} ج</span>
                  </div>
                </div>
              </div>

              <button onClick={handleContinue} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(5,150,105,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                {t.continueCheckout}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recycler Details Modal */}
      {selectedRecyclerDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .modal-content {
              animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .modal-close {
              transition: all 0.3s ease;
            }
            .modal-close:hover {
              transform: rotate(90deg) scale(1.1);
            }
            .info-card {
              transition: all 0.3s ease;
            }
            .info-card:hover {
              transform: translateX(-4px);
            }
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .spinner {
              animation: rotate 2s linear infinite;
            }
          `}</style>
          <div className="modal-content" style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#065f46', margin: 0 }}>📋 Company Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedRecyclerDetail(null)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '8px 12px',
                  borderRadius: '8px',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', padding: '16px', borderRadius: '16px', border: '2px solid #dcfce7' }}>
                <img
                  src={selectedRecyclerDetail.logo}
                  alt={selectedRecyclerDetail.imageAlt}
                  style={{ width: '140px', height: '140px', objectFit: 'contain', borderRadius: '12px' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '28px', textAlign: 'center', paddingBottom: '20px', borderBottom: '2px solid #f0fdf4' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#065f46', margin: '0 0 8px 0' }}>
                {selectedRecyclerDetail.name}
              </h3>
              <div style={{ fontSize: '1rem', color: '#059669', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span>⭐</span> {selectedRecyclerDetail.rating} / 5.0
              </div>
            </div>

            <div className="info-card" style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #dcfce7',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ textAlign: 'center', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                  <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Processing Rate</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#065f46' }}>99%</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                  <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Years of Experience</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#065f46' }}>5 Years</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#065f46', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>ℹ️ Overview</h4>
              <p style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                lineHeight: 1.7,
                margin: 0,
                background: '#f9fafb',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
              }}>
                We specialize in waste recycling of all types using the latest technologies and international environmental standards. We provide integrated solutions to transform waste into valuable resources and a clean environment.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#065f46', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>🎯 Services</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  '✓ Waste Reception and Sorting',
                  '✓ Material Processing and Recovery',
                  '✓ Recycling Process Documentation',
                  '✓ 24/7 Technical Support',
                ].map((service, idx) => (
                  <div key={idx} style={{ paddingLeft: '12px', color: '#6b7280', fontSize: '0.95rem', fontWeight: '600', borderLeft: '3px solid #059669', background: '#f9fafb', padding: '10px 12px' }}>
                    {service}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedRecyclerDetail(null)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 4px 16px rgba(6, 95, 70, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(6, 95, 70, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(6, 95, 70, 0.2)';
              }}
            >
              ✓ OK, Got it
            </button>
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#064e3b', marginBottom: '20px', textAlign: 'center' }}>Delivery Information</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>Governorate</label>
                <select 
                  value={deliveryData.governorate} 
                  onChange={(e) => handleDeliveryInputChange('governorate', e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit' }}
                >
                  <option value="">Select Governorate</option>
                  {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>Factory Name</label>
                <input 
                  type="text" 
                  value={deliveryData.factoryName} 
                  onChange={(e) => handleDeliveryInputChange('factoryName', e.target.value)}
                  placeholder="Enter factory name"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>Address</label>
                <textarea 
                  value={deliveryData.address} 
                  onChange={(e) => handleDeliveryInputChange('address', e.target.value)}
                  placeholder="Enter address in detail"
                  style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>Phone Number</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={EgyptFlag} alt="Egypt Flag" style={{ width: '32px', height: '32px', borderRadius: '4px', flexShrink: 0, objectFit: 'cover' }} />
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', overflow: 'hidden', flex: 1 }}>
                    <span style={{ padding: '10px', background: '#f3f4f6', fontWeight: '700', color: '#374151', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>+20</span>
                    <input 
                      type="tel" 
                      value={deliveryData.phone.replace(/^20/, '').replace(/^0/, '')} 
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '').replace(/^20/, '').replace(/^0/, '');
                        if (val.length <= 10) handleDeliveryInputChange('phone', val);
                      }}
                      placeholder="1000000000"
                      style={{ flex: 1, padding: '10px', border: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                      inputMode="numeric"
                    />
                  </div>
                </div>
                {deliveryData.phone && (deliveryData.phone.length < 10 || !/^01/.test('0' + deliveryData.phone)) && (
                  <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '4px' }}>❌ Invalid number (must start with 01 and be 11 digits)</p>
                )}
                {deliveryData.phone && deliveryData.phone.length === 10 && /^1/.test(deliveryData.phone) && (
                  <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px' }}>✅ Valid number</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowDeliveryModal(false)}
                  disabled={modalLoading}
                  style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: modalLoading ? 'not-allowed' : 'pointer', fontWeight: '700', color: '#374151', fontSize: '0.95rem', fontFamily: 'inherit', opacity: modalLoading ? 0.5 : 1 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelivery}
                  disabled={modalLoading}
                  style={{ flex: 1, padding: '12px', background: '#059669', border: 'none', borderRadius: '8px', cursor: modalLoading ? 'not-allowed' : 'pointer', fontWeight: '700', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit', opacity: modalLoading ? 0.7 : 1 }}
                >
                  {modalLoading ? 'Verifying...' : 'Confirm'}
                </button>
              </div>

              {/* Loading Overlay */}
              {modalLoading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                  <div style={{ fontSize: '4rem', animation: 'rotate 2s linear infinite', marginBottom: '16px' }}>♻️</div>
                  <p style={{ fontSize: '1rem', color: '#374151', fontWeight: '600', textAlign: 'center' }}>جاري التحقق من البيانات...</p>
                </div>
              )}

              {/* Success Message */}
              {modalSuccess && !modalLoading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(4px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '4rem', marginBottom: '12px' }}>✅</p>
                    <p style={{ fontSize: '1.1rem', color: '#059669', fontWeight: '700' }}>{modalSuccess}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentMethod !== 'cash' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#064e3b', marginBottom: '20px', textAlign: 'center' }}>
              {paymentMethod === 'card' && 'Card Information'}
              {paymentMethod === 'vodafone' && 'Vodafone Pay Information'}
              {paymentMethod === 'instant' && 'Fawry Information'}
              {paymentMethod === 'instapay' && 'InstaPay Information'}
              {paymentMethod === 'bank-transfer' && 'Bank Transfer Information'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>Card Number</label>
                    <input 
                      type="text" 
                      value={paymentData.cardNumber} 
                      onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>Expiry Date</label>
                      <input 
                        type="text" 
                        value={paymentData.expiryDate} 
                        onChange={(e) => handlePaymentInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        maxLength="5"
                        style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>CVV</label>
                      <input 
                        type="text" 
                        value={paymentData.cvv} 
                        onChange={(e) => handlePaymentInputChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength="3"
                        style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>Cardholder Name</label>
                    <input 
                      type="text" 
                      value={paymentData.cardholderName} 
                      onChange={(e) => handlePaymentInputChange('cardholderName', e.target.value)}
                      placeholder="Enter name"
                      style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'vodafone' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>رقم الهاتف فودافون</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={EgyptFlag} alt="Egypt Flag" style={{ width: '32px', height: '32px', borderRadius: '4px', flexShrink: 0, objectFit: 'cover' }} />
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', overflow: 'hidden', flex: 1 }}>
                        <span style={{ padding: '10px', background: '#f3f4f6', fontWeight: '700', color: '#374151', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>+20</span>
                        <input 
                          type="tel" 
                          value={paymentData.vodafoneNumber.replace(/^20/, '').replace(/^0/, '')} 
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').replace(/^20/, '').replace(/^0/, '');
                            if (val.length <= 10) handlePaymentInputChange('vodafoneNumber', val);
                          }}
                          placeholder="1000000000"
                          style={{ flex: 1, padding: '10px', border: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    {paymentData.vodafoneNumber && (paymentData.vodafoneNumber.length < 10 || !/^01/.test('0' + paymentData.vodafoneNumber)) && (
                      <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '4px' }}>❌ رقم غير صحيح (يجب أن يبدأ ب 01 و يكون 11 رقم)</p>
                    )}
                    {paymentData.vodafoneNumber && paymentData.vodafoneNumber.length === 10 && /^1/.test(paymentData.vodafoneNumber) && (
                      <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px' }}>✅ رقم صحيح</p>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>الرقم السري</label>
                    <input 
                      type="password" 
                      value={paymentData.vodafonePin} 
                      onChange={(e) => handlePaymentInputChange('vodafonePin', e.target.value)}
                      placeholder="أدخل الرقم السري"
                      style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'instant' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>رقم الهاتف فوري</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={EgyptFlag} alt="Egypt Flag" style={{ width: '32px', height: '32px', borderRadius: '4px', flexShrink: 0, objectFit: 'cover' }} />
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', overflow: 'hidden', flex: 1 }}>
                        <span style={{ padding: '10px', background: '#f3f4f6', fontWeight: '700', color: '#374151', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>+20</span>
                        <input 
                          type="tel" 
                          value={paymentData.vodafoneNumber.replace(/^20/, '').replace(/^0/, '')} 
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').replace(/^20/, '').replace(/^0/, '');
                            if (val.length <= 10) handlePaymentInputChange('vodafoneNumber', val);
                          }}
                          placeholder="1000000000"
                          style={{ flex: 1, padding: '10px', border: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    {paymentData.vodafoneNumber && (paymentData.vodafoneNumber.length < 10 || !/^01/.test('0' + paymentData.vodafoneNumber)) && (
                      <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '4px' }}>❌ رقم غير صحيح (يجب أن يبدأ ب 01 و يكون 11 رقم)</p>
                    )}
                    {paymentData.vodafoneNumber && paymentData.vodafoneNumber.length === 10 && /^1/.test(paymentData.vodafoneNumber) && (
                      <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px' }}>✅ رقم صحيح</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '12px' }}>سيتم إرسال رابط التحويل إلى رقم الهاتف الخاص بك عبر فوري</p>
                  </div>
                </>
              )}

              {paymentMethod === 'instapay' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>رقم الهاتف إنستاباي</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={EgyptFlag} alt="Egypt Flag" style={{ width: '32px', height: '32px', borderRadius: '4px', flexShrink: 0, objectFit: 'cover' }} />
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', overflow: 'hidden', flex: 1 }}>
                        <span style={{ padding: '10px', background: '#f3f4f6', fontWeight: '700', color: '#374151', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>+20</span>
                        <input 
                          type="tel" 
                          value={paymentData.vodafoneNumber.replace(/^20/, '').replace(/^0/, '')} 
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').replace(/^20/, '').replace(/^0/, '');
                            if (val.length <= 10) handlePaymentInputChange('vodafoneNumber', val);
                          }}
                          placeholder="1000000000"
                          style={{ flex: 1, padding: '10px', border: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    {paymentData.vodafoneNumber && (paymentData.vodafoneNumber.length < 10 || !/^01/.test('0' + paymentData.vodafoneNumber)) && (
                      <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '4px' }}>❌ رقم غير صحيح (يجب أن يبدأ ب 01 و يكون 11 رقم)</p>
                    )}
                    {paymentData.vodafoneNumber && paymentData.vodafoneNumber.length === 10 && /^1/.test(paymentData.vodafoneNumber) && (
                      <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px' }}>✅ رقم صحيح</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '12px' }}>سيتم إرسال رابط التحويل إلى رقم الهاتف الخاص بك عبر إنستاباي</p>
                  </div>
                </>
              )}

              {paymentMethod === 'bank-transfer' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>رقم حساب البنك</label>
                    <input 
                      type="text" 
                      value={paymentData.bankAccountNumber} 
                      onChange={(e) => handlePaymentInputChange('bankAccountNumber', e.target.value)}
                      placeholder="أدخل رقم الحساب"
                      style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>رقم الفرع</label>
                    <input 
                      type="text" 
                      value={paymentData.bankRoutingNumber} 
                      onChange={(e) => handlePaymentInputChange('bankRoutingNumber', e.target.value)}
                      placeholder="أدخل رقم الفرع"
                      style={{ width: '100%', padding: '10px', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  disabled={modalLoading}
                  style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: modalLoading ? 'not-allowed' : 'pointer', fontWeight: '700', color: '#374151', fontSize: '0.95rem', fontFamily: 'inherit', opacity: modalLoading ? 0.5 : 1 }}
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={modalLoading}
                  style={{ flex: 1, padding: '12px', background: '#059669', border: 'none', borderRadius: '8px', cursor: modalLoading ? 'not-allowed' : 'pointer', fontWeight: '700', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit', opacity: modalLoading ? 0.7 : 1 }}
                >
                  {modalLoading ? 'جاري التحقق...' : 'تأكيد'}
                </button>
              </div>

              {/* Loading Overlay */}
              {modalLoading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                  <div style={{ fontSize: '4rem', animation: 'rotate 2s linear infinite', marginBottom: '16px' }}>♻️</div>
                  <p style={{ fontSize: '1rem', color: '#374151', fontWeight: '600', textAlign: 'center' }}>جاري التحقق من البيانات...</p>
                </div>
              )}

              {/* Success Message */}
              {modalSuccess && !modalLoading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(4px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '4rem', marginBottom: '12px' }}>✅</p>
                    <p style={{ fontSize: '1.1rem', color: '#059669', fontWeight: '700' }}>{modalSuccess}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
