import { useEffect, useMemo, useState } from 'react';
import { Package, CheckCircle2, Clock, XCircle, RefreshCw, Eye, Download } from 'lucide-react';
import api from '../services/api';

// ✅ دالة مساعدة لتحويل مسارات الصور النسبية إلى URLs كاملة
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // إذا كانت Base64 - ارجعها كما هي
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // إذا كانت URL كاملة بالفعل - ارجعها كما هي
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // إذا كانت مسار نسبي (يبدأ بـ /) - في development يستخدم الـ proxy
  // في production، استخدم URL كامل
  if (imagePath.startsWith('/')) {
    if (import.meta.env.DEV) {
      // في development: الـ proxy في vite.config سيعيد التوجيه تلقائياً
      return imagePath;
    } else {
      // في production: استخدم URL السيرفر
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:54465';
      return apiUrl + imagePath;
    }
  }
  
  // إذا كانت محفوظة بدون prefix - تعاملها كمسار نسبي
  return '/' + imagePath;
};

// ✅ نظام الحصول على بيانات المصنع الحقيقية من localStorage + API
const getFactoryData = (factoryName) => {
  try {
    // جلب كل البيانات المتاحة
    const factoryData = JSON.parse(localStorage.getItem('factory') || '{}');
    const userData = JSON.parse(localStorage.getItem('ecov_user') || '{}');
    const allFactories = JSON.parse(localStorage.getItem('ecov_factories') || '[]');
    const allOrders = JSON.parse(localStorage.getItem('ecov_buying_orders') || '[]'); // ابحث عن بيانات البائع في طلبات سابقة
    
    console.log('🔍 Searching factory:', factoryName);
    
    // 1️⃣ أولاً: البحث عن المصنع الحالي
    if (factoryData?.factoryName?.toLowerCase() === factoryName?.toLowerCase()) {
      console.log('✅ Found in current factory data');
      
      let logoToUse = factoryData.logoPreview || factoryData.logoUrl || null;
      if (!logoToUse && userData?.logoPreview) {
        logoToUse = userData.logoPreview;
      }
      
      return {
        name: factoryData.factoryName,
        logo: logoToUse,
        industryType: factoryData.industryType || factoryData.industry || '-',
        location: factoryData.location || factoryData.governorate || '-',
        address: factoryData.address || '-',
        email: factoryData.email || userData?.email || '-',
        phone: factoryData.phone || userData?.phone || '-',
        ownerName: factoryData.ownerName || userData?.ownerName || '-',
        establishmentYear: factoryData.establishmentYear || new Date().getFullYear(),
      };
    }
    
    // 2️⃣ ثانياً: البحث في قائمة المصانع المسجلة
    if (Array.isArray(allFactories) && allFactories.length > 0) {
      const foundFactory = allFactories.find(f => 
        f?.factoryName?.toLowerCase() === factoryName?.toLowerCase() ||
        f?.factory_name?.toLowerCase() === factoryName?.toLowerCase()
      );
      
      if (foundFactory) {
        console.log('✅ Found in all factories list');
        let logoToUse = foundFactory.logoPreview || foundFactory.logoUrl || foundFactory.logo || null;
        
        return {
          name: foundFactory.factoryName || foundFactory.factory_name,
          logo: logoToUse,
          industryType: foundFactory.industryType || foundFactory.industry_type || foundFactory.industry || '-',
          location: foundFactory.location || foundFactory.governorate || foundFactory.governorate_name || '-',
          address: foundFactory.address || '-',
          email: foundFactory.email || '-',
          phone: foundFactory.phone || foundFactory.phoneNumber || '-',
          ownerName: foundFactory.ownerName || foundFactory.owner_name || '-',
          establishmentYear: foundFactory.establishmentYear || foundFactory.established_year || new Date().getFullYear(),
        };
      }
    }
    
    // 3️⃣ ثالثاً: البحث في بيانات الطلبات السابقة (قد يكون هناك بيانات البائع محفوظة هناك)
    if (Array.isArray(allOrders) && allOrders.length > 0) {
      // ابحث عن أي طلب من هذا المصنع البائع
      const sellerOrder = allOrders.find(order => 
        order?.sellerFactory?.toLowerCase() === factoryName?.toLowerCase()
      );
      
      if (sellerOrder) {
        // اجمع البيانات المتاحة من الطلب
        const result = {
          name: sellerOrder.sellerFactory || factoryName,
          logo: sellerOrder.sellerFactoryLogo || null,
          industryType: sellerOrder.industryType || '-',
          location: sellerOrder.sellerLocation || sellerOrder.location || '-',
          address: sellerOrder.sellerAddress || sellerOrder.address || '-',
          email: sellerOrder.sellerEmail || '-',
          phone: sellerOrder.sellerPhone || '-',
          ownerName: '-',
          establishmentYear: '-',
        };
        
        if (result.logo || result.industryType !== '-') {
          console.log('✅ Found partial data in previous orders');
          return result;
        }
      }
    }
    
    console.log('⚠️ Factory not found in localStorage');
    // 4️⃣ رابعاً: ارجع البيانات الفارغة مع emoji افتراضي
    return {
      name: factoryName || '-',
      logo: '🏭',
      industryType: '-',
      location: '-',
      address: '-',
      email: '-',
      phone: '-',
      ownerName: '-',
      establishmentYear: '-',
    };
  } catch (error) {
    console.error('❌ Failed to get factory data:', error);
    return {
      name: factoryName || '-',
      logo: '🏭',
      industryType: '-',
      location: '-',
      address: '-',
      email: '-',
      phone: '-',
      ownerName: '-',
      establishmentYear: '-',
    };
  }
};

function AdminBuyingOrders({ lang = 'ar', dark = false }) {
  const isAr = lang !== 'en';

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [factoriesData, setFactoriesData] = useState({});
  const [failedImages, setFailedImages] = useState({});

  // 🔄 دالة لجلب بيانات المصنع من السيرفر (API fallback)
  const fetchFactoryFromApi = async (factoryName) => {
    try {
      console.log('🔍 Fetching from API:', factoryName);
      
      // Use the search endpoint
      const response = await api.get(`/profile/factory/search?name=${encodeURIComponent(factoryName)}`);
      
      if (response?.data?.data) {
        const factoryData = response.data.data;
        console.log('✅ Found factory from API:', factoryData);
        
        const cacheEntry = {
          name: factoryData.factoryName || factoryData.name || factoryName,
          logo: factoryData.logoUrl || factoryData.logoPreview || null,
          industryType: factoryData.industryType || factoryData.industry || '-',
          location: factoryData.location || factoryData.governorate || '-',
          address: factoryData.address || '-',
          email: factoryData.email || '-',
          phone: factoryData.phone || factoryData.phoneNumber || '-',
          ownerName: factoryData.ownerName || factoryData.owner_name || '-',
          establishmentYear: factoryData.establishmentYear || '-',
        };
        
        return cacheEntry;
      }
    } catch (err) {
      console.warn(`⚠️ Failed to fetch factory from API:`, err.message);
    }
    
    console.log('❌ Factory not found:', factoryName);
    return null;
  };

  const t = useMemo(() => ({
    title: isAr ? 'طلبات الشراء بين المصانع' : 'Factory Buying Orders',
    subtitle: isAr ? 'إدارة وتتبع طلبات شراء المخلفات بين المصانع' : 'Manage and track waste buying orders between factories',
    refresh: isAr ? 'تحديث' : 'Refresh',
    noData: isAr ? 'لا توجد طلبات حالياً' : 'No orders currently',
    
    all: isAr ? 'الكل' : 'All',
    pending: isAr ? 'قيد الانتظار' : 'Pending',
    approved: isAr ? 'موافق عليه' : 'Approved',
    rejected: isAr ? 'مرفوض' : 'Rejected',
    completed: isAr ? 'مكتمل' : 'Completed',
    
    approve: isAr ? 'موافقة' : 'Approve',
    reject: isAr ? 'رفض' : 'Reject',
    complete: isAr ? 'تم المكتمل' : 'Mark Complete',
    view: isAr ? 'عرض التفاصيل' : 'View Details',
    download: isAr ? 'تحميل' : 'Download',
    
    seller: isAr ? 'المصنع البائع' : 'Seller Factory',
    buyer: isAr ? 'المصنع المشتري' : 'Buyer Factory',
    waste: isAr ? 'نوع المخلفات' : 'Waste Type',
    quantity: isAr ? 'الكمية' : 'Quantity',
    price: isAr ? 'السعر الإجمالي' : 'Total Price',
    recycler: isAr ? 'معامل التدوير' : 'Recycler',
    delivery: isAr ? 'طريقة التسليم' : 'Delivery Method',
    payment: isAr ? 'طريقة الدفع' : 'Payment Method',
    status: isAr ? 'الحالة' : 'Status',
    date: isAr ? 'التاريخ' : 'Date',
    actions: isAr ? 'الإجراءات' : 'Actions',
    listingId: isAr ? 'معرف الإعلان' : 'Listing ID',
    
    detailsTitle: isAr ? 'تفاصيل الطلب' : 'Order Details',
    listingDetailsTitle: isAr ? 'تفاصيل الإعلان' : 'Listing Details',
    factoryDetailsTitle: isAr ? 'بيانات المصنع' : 'Factory Details',
    createdBy: isAr ? 'تم الإنشاء بواسطة' : 'Created By',
    total: isAr ? 'الإجمالي' : 'Total',
    recycleFee: isAr ? 'رسوم التدوير' : 'Recycling Fee',
    shippingFee: isAr ? 'رسوم الشحن' : 'Shipping Fee',
    ecovFee: isAr ? 'رسوم إيكوف' : 'ECOv Fee',
    deliveryData: isAr ? 'بيانات التسليم' : 'Delivery Data',
    paymentData: isAr ? 'بيانات الدفع' : 'Payment Data',
    governorate: isAr ? 'المحافظة' : 'Governorate',
    address: isAr ? 'العنوان' : 'Address',
    phone: isAr ? 'الهاتف' : 'Phone',
    email: isAr ? 'البريد الإلكتروني' : 'Email',
    factoryInfo: isAr ? 'معلومات المصنع' : 'Factory Information',
    industryType: isAr ? 'نوع الصناعة' : 'Industry Type',
    establishedYear: isAr ? 'سنة التأسيس' : 'Established Year',
    employees: isAr ? 'عدد الموظفين' : 'Employees',
    close: isAr ? 'إغلاق' : 'Close',
  }), [isAr]);

  useEffect(() => {
    // تحميل الطلبات من localStorage (محاكاة API)
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        
        // محاكاة جلب البيانات من localStorage
        const storedOrders = JSON.parse(localStorage.getItem('ecov_buying_orders') || '[]');
        setOrders(storedOrders);
        
        // ✅ تحميل بيانات المصانع المتكررة في الطلبات
        const uniqueFactoryNames = new Set();
        storedOrders.forEach(order => {
          uniqueFactoryNames.add(order.sellerFactory);
          uniqueFactoryNames.add(order.buyerFactory);
        });
        
        const factories = {};
        
        // جلب بيانات جميع المصانع **بشكل متوازي** في نفس الوقت
        const factoryPromises = Array.from(uniqueFactoryNames).map(async (name) => {
          try {
            // أولاً: جرب localStorage
            const localData = getFactoryData(name);
            
            // إذا كانت البيانات ناقصة (emoji افتراضي)، جرب API
            if (localData.logo === '🏭' && localData.address === '-') {
              console.log('🔍 Fetching from API (parallel):', name);
              const apiData = await fetchFactoryFromApi(name);
              const finalData = apiData || localData;
              
              // احفظ البيانات من API للمستقبل
              if (apiData && apiData.email && apiData.email !== '-') {
                const foundFactories = JSON.parse(localStorage.getItem('ecov_factories') || '[]');
                const exists = foundFactories.some(f => 
                  f?.factoryName?.toLowerCase() === name.toLowerCase()
                );
                if (!exists) {
                  console.log('💾 Saving factory data from API:', name);
                  foundFactories.push({
                    factoryName: apiData.name,
                    industryType: apiData.industryType,
                    location: apiData.location,
                    address: apiData.address,
                    email: apiData.email,
                    phone: apiData.phone,
                    ownerName: apiData.ownerName,
                    establishmentYear: apiData.establishmentYear,
                    logoUrl: apiData.logo,
                  });
                  localStorage.setItem('ecov_factories', JSON.stringify(foundFactories));
                }
              }
              
              return { name, data: finalData };
            } else {
              // احفظ البيانات الكاملة كـ backup
              if (localData.email && localData.email !== '-') {
                const foundFactories = JSON.parse(localStorage.getItem('ecov_factories') || '[]');
                const exists = foundFactories.some(f => 
                  f?.factoryName?.toLowerCase() === name.toLowerCase()
                );
                if (!exists) {
                  console.log('💾 Saving factory data to backup:', name);
                  foundFactories.push({
                    factoryName: localData.name,
                    industryType: localData.industryType,
                    location: localData.location,
                    address: localData.address,
                    email: localData.email,
                    phone: localData.phone,
                    ownerName: localData.ownerName,
                    establishmentYear: localData.establishmentYear,
                    logoUrl: localData.logo,
                  });
                  localStorage.setItem('ecov_factories', JSON.stringify(foundFactories));
                }
              }
              
              return { name, data: localData };
            }
          } catch (error) {
            console.error('❌ Error loading factory:', name, error);
            return { name, data: getFactoryData(name) };
          }
        });
        
        // انتظر **جميع** الطلبات معاً
        console.log('⏳ Loading', uniqueFactoryNames.size, 'factories in parallel...');
        const results = await Promise.allSettled(factoryPromises);
        
        // اجمع النتائج
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            factories[result.value.name] = result.value.data;
          }
        });
        
        console.log('✅ All factories loaded in parallel:', Object.keys(factories).length);
        setFactoriesData(factories);
      } catch (error) {
        setError(isAr ? 'فشل تحميل الطلبات' : 'Failed to load orders');
        console.warn('Failed to load orders', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
    // تحديث الطلبات كل 30 ثانية
    const id = setInterval(() => loadOrders(), 30000);
    return () => clearInterval(id);
  }, [isAr]);

  const handleRefresh = async () => {
    // تحميل الطلبات من localStorage (محاكاة API)
    try {
      setLoading(true);
      setError('');
      
      // محاكاة جلب البيانات من localStorage
      const storedOrders = JSON.parse(localStorage.getItem('ecov_buying_orders') || '[]');
      setOrders(storedOrders);
      
      // ✅ تحديث بيانات المصانع
      const uniqueFactoryNames = new Set();
      storedOrders.forEach(order => {
        uniqueFactoryNames.add(order.sellerFactory);
        uniqueFactoryNames.add(order.buyerFactory);
      });
      
      const factories = {};
      
      // جلب بيانات جميع المصانع **بشكل متوازي** في نفس الوقت
      const factoryPromises = Array.from(uniqueFactoryNames).map(async (name) => {
        try {
          // أولاً: جرب localStorage
          const localData = getFactoryData(name);
          
          // إذا كانت البيانات ناقصة (emoji افتراضي)، جرب API
          if (localData.logo === '🏭' && localData.address === '-') {
            console.log('🔍 Fetching from API (parallel):', name);
            const apiData = await fetchFactoryFromApi(name);
            const finalData = apiData || localData;
            
            // احفظ البيانات من API للمستقبل
            if (apiData && apiData.email && apiData.email !== '-') {
              const foundFactories = JSON.parse(localStorage.getItem('ecov_factories') || '[]');
              const exists = foundFactories.some(f => 
                f?.factoryName?.toLowerCase() === name.toLowerCase()
              );
              if (!exists) {
                console.log('💾 Saving factory data from API:', name);
                foundFactories.push({
                  factoryName: apiData.name,
                  industryType: apiData.industryType,
                  location: apiData.location,
                  address: apiData.address,
                  email: apiData.email,
                  phone: apiData.phone,
                  ownerName: apiData.ownerName,
                  establishmentYear: apiData.establishmentYear,
                  logoUrl: apiData.logo,
                });
                localStorage.setItem('ecov_factories', JSON.stringify(foundFactories));
              }
            }
            
            return { name, data: finalData };
          } else {
            // احفظ البيانات الكاملة كـ backup
            if (localData.email && localData.email !== '-') {
              const foundFactories = JSON.parse(localStorage.getItem('ecov_factories') || '[]');
              const exists = foundFactories.some(f => 
                f?.factoryName?.toLowerCase() === name.toLowerCase()
              );
              if (!exists) {
                console.log('💾 Saving factory data to backup:', name);
                foundFactories.push({
                  factoryName: localData.name,
                  industryType: localData.industryType,
                  location: localData.location,
                  address: localData.address,
                  email: localData.email,
                  phone: localData.phone,
                  ownerName: localData.ownerName,
                  establishmentYear: localData.establishmentYear,
                  logoUrl: localData.logo,
                });
                localStorage.setItem('ecov_factories', JSON.stringify(foundFactories));
              }
            }
            
            return { name, data: localData };
          }
        } catch (error) {
          console.error('❌ Error loading factory:', name, error);
          return { name, data: getFactoryData(name) };
        }
      });
      
      // انتظر **جميع** الطلبات معاً
      console.log('⏳ Loading', uniqueFactoryNames.size, 'factories in parallel...');
      const results = await Promise.allSettled(factoryPromises);
      
      // اجمع النتائج
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          factories[result.value.name] = result.value.data;
        }
      });
      
      console.log('✅ All factories loaded in parallel:', Object.keys(factories).length);
      setFactoriesData(factories);
    } catch (error) {
      setError(isAr ? 'فشل تحميل الطلبات' : 'Failed to load orders');
      console.warn('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  // 📢 دالة مساعدة لإضافة notification
  const addNotification = (seller, buyer, action, orderId, details = {}) => {
    try {
      const notifications = JSON.parse(localStorage.getItem('ecov_notifications') || '[]');
      
      const newNotification = {
        id: Date.now(),
        type: action, // 'status_updated', 'listing_sent', 'rejected', 'approved', 'completed'
        seller,
        buyer,
        orderId,
        message: isAr ? {
          'status_updated': `تم تحديث حالة الطلب من ${details.oldStatus} إلى ${details.newStatus}`,
          'listing_sent': `تم إرسال إعلان جديد للمراجعة`,
          'rejected': `تم رفض الطلب`,
          'approved': `تم الموافقة على الطلب`,
          'completed': `تم استكمال الطلب`
        }[action] : {
          'status_updated': `Order status updated from ${details.oldStatus} to ${details.newStatus}`,
          'listing_sent': `New listing sent for review`,
          'rejected': `Order rejected`,
          'approved': `Order approved`,
          'completed': `Order completed`
        }[action],
        timestamp: new Date().toISOString(),
        read: false,
        notifyTo: [seller, buyer, 'admin'] // من يجب إعلامهم
      };
      
      notifications.push(newNotification);
      localStorage.setItem('ecov_notifications', JSON.stringify(notifications));
      
      console.log('🔔 Notification added:', newNotification.message);
      return newNotification;
    } catch (error) {
      console.error('❌ Error adding notification:', error);
    }
  };

  // 🏪 دالة لتحديث حالة الإعلان في Marketplace
  const updateListingStatus = (orderId, newStatus) => {
    try {
      const listings = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
      const updatedListings = listings.map(listing => 
        listing.id === orderId 
          ? { ...listing, status: newStatus, listingStatus: newStatus }
          : listing
      );
      localStorage.setItem('ecov_listings', JSON.stringify(updatedListings));
      console.log('✅ Listing status updated:', newStatus);
    } catch (error) {
      console.error('❌ Error updating listing status:', error);
    }
  };

  // تحديث حالة الطلب مع Notifications و Listing Status
  const updateOrderStatus = (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    const oldStatus = order?.status || 'pending';
    
    // تحديث الطلب
    const updatedOrders = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('ecov_buying_orders', JSON.stringify(updatedOrders));
    
    // 📢 إضافة Notification للبائع والشاري والإدمن
    addNotification(
      order?.sellerFactory,
      order?.buyerFactory,
      'status_updated',
      orderId,
      { oldStatus, newStatus }
    );
    
    // 🏪 تحديث حالة الإعلان في Marketplace
    if (newStatus === 'approved') {
      updateListingStatus(orderId, 'active');
    } else if (newStatus === 'rejected') {
      updateListingStatus(orderId, 'rejected');
    } else if (newStatus === 'completed') {
      updateListingStatus(orderId, 'completed');
    }
    
    setSuccess(isAr ? 'تم تحديث الحالة بنجاح' : 'Status updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#94a3b8';
      case 'approved': return '#64748b';
      case 'rejected': return '#475569';
      case 'completed': return '#64748b';
      default: return '#64748b';
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: t.pending,
      approved: t.approved,
      rejected: t.rejected,
      completed: t.completed,
    };
    return statusMap[status] || status;
  };

  const downloadOrderPDF = (order) => {
    const content = `
      ===============================
      ${t.detailsTitle}
      ===============================
      
      ${t.seller}: ${order.sellerFactory}
      ${t.buyer}: ${order.buyerFactory}
      ${t.waste}: ${order.wasteType}
      ${t.quantity}: ${order.quantity} ${order.unit}
      ${t.price}: ${order.totalPrice.toLocaleString()} ج
      ${t.recycler}: ${order.recycler}
      
      ${t.recycleFee}: ${order.recyclingFee.toLocaleString()} ج
      ${t.shippingFee}: ${order.shippingFee.toLocaleString()} ج
      ${t.ecovFee}: ${order.ecovFee.toLocaleString()} ج
      ${t.total}: ${order.finalTotal.toLocaleString()} ج
      
      ${t.delivery}: ${order.deliveryMethod}
      ${t.payment}: ${order.paymentMethod}
      ${t.status}: ${getStatusLabel(order.status)}
      ${t.date}: ${new Date(order.createdAt).toLocaleString()}
    `;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `order-${order.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: dark ? '#0f1a12' : '#fff' }}>
        <div style={{ fontSize: '1.2rem', color: '#059669', fontWeight: '700' }}>
          {isAr ? 'جاري التحميل...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: dark ? 'linear-gradient(135deg, #0a0f0b 0%, #1a2e1f 100%)' : 'linear-gradient(135deg, #f0f7f4 0%, #e0f7f0 100%)', minHeight: '100vh', direction: isAr ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Package size={32} color="#059669" />
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: dark ? '#e0fff0' : '#059669', margin: 0 }}>
              {t.title}
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(16, 185, 129, 0.7)', margin: 0 }}>{t.subtitle}</p>
        </div>

        {/* Error & Success Messages */}
        {error && (
          <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', marginBottom: '16px', fontWeight: '600' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', marginBottom: '16px', fontWeight: '600' }}>
            {success}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            onClick={handleRefresh}
            style={{ 
              padding: '10px 16px', 
              background: '#059669', 
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
            }}
          >
            <RefreshCw size={16} /> {t.refresh}
          </button>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'pending', 'approved', 'rejected', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '8px 14px',
                  background: filterStatus === status 
                    ? '#059669' 
                    : dark 
                    ? 'rgba(255,255,255,0.1)' 
                    : '#fff',
                  color: filterStatus === status 
                    ? '#fff' 
                    : dark 
                    ? '#e0e0e0' 
                    : '#374151',
                  border: filterStatus === status 
                    ? 'none'
                    : `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                }}
              >
                {status === 'all' ? t.all : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div style={{
          background: dark 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
          border: `2px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          boxShadow: dark 
            ? '0 8px 24px rgba(0,0,0,0.2)'
            : '0 8px 24px rgba(16, 185, 129, 0.08)',
          overflow: 'hidden',
        }}>
          {filteredOrders.length === 0 ? (
            <div style={{ 
              padding: '60px 20px', 
              textAlign: 'center', 
              color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280', 
              fontWeight: '600',
            }}>
              {t.noData}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    background: dark ? '#e2e8f0' : '#f8fafc',
                    borderBottom: `1px solid ${dark ? '#cbd5e1' : '#e2e8f0'}`,
                  }}>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>معرف الطلب</th>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>معرف الإعلان</th>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>البائع</th>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>المشتري</th>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>نوع المخلفات</th>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>الكمية</th>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>السعر</th>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>معامل التدوير</th>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>الحالة</th>
                    <th style={{ padding: '14px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <tr 
                      key={order.id} 
                      style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        background: idx % 2 === 0 ? '#fff' : '#f8fafc',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f8fafc';
                      }}
                    >
                      {/* Order ID */}
                      <td style={{ padding: '14px 12px', fontSize: '0.9rem', verticalAlign: 'middle' }}>
                        <span style={{ color: '#64748b', fontWeight: '400' }}>
                          #{order.id ? order.id : '-'}
                        </span>
                      </td>

                      {/* Listing ID */}
                      <td style={{ padding: '14px 12px', fontSize: '0.9rem', verticalAlign: 'middle' }}>
                        <span style={{ color: '#64748b', fontWeight: '400', cursor: 'pointer' }} onClick={() => setSelectedListing(order)}>
                          #{order.listingId ? order.listingId : '-'}
                        </span>
                      </td>

                      {/* Seller with Logo */}
                      <td style={{ padding: '14px 12px', fontSize: '0.9rem', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: isAr ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                            borderRadius: '50%',
                            background: '#3b82f620',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            border: '2px solid #3b82f6',
                          }}>
                            {(() => {
                              const logo = factoriesData[order.sellerFactory]?.logo;
                              const imageUrl = getImageUrl(logo);
                              const isEmoji = logo && typeof logo === 'string' && logo.length <= 2;
                              
                              if (imageUrl && !isEmoji) {
                                return <img src={imageUrl} alt={order.sellerFactory} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => {
                                  console.warn('❌ Seller logo failed:', imageUrl?.substring(0, 50));
                                  setFailedImages(prev => ({ ...prev, [order.sellerFactory]: true }));
                                }} />;
                              }
                              return <span>{logo || '🏭'}</span>;
                            })()}
                          </div>
                          <div 
                            onClick={() => setSelectedFactory({ ...order, type: 'seller', name: order.sellerFactory })}
                            style={{ 
                              color: dark ? '#e0e0e0' : '#064e3b', 
                              fontWeight: '600', 
                              width: isAr ? '100px' : 'auto',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              textDecoration: 'underline',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.color = dark ? '#e0e0e0' : '#064e3b'}
                          >
                            {order.sellerFactory}
                          </div>
                        </div>
                      </td>

                      {/* Buyer with Logo */}
                      <td style={{ padding: '14px 12px', fontSize: '0.9rem', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: isAr ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                            borderRadius: '50%',
                            background: '#10b98120',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            border: '2px solid #10b981',
                          }}>
                            {(() => {
                              const buyerFactoryName = order.buyerFactory;
                              console.log('🔍 Looking for buyer factory:', buyerFactoryName, 'in factoriesData:', Object.keys(factoriesData));
                              
                              const logo = factoriesData[buyerFactoryName]?.logo;
                              const imageUrl = getImageUrl(logo);
                              const isEmoji = logo && typeof logo === 'string' && logo.length <= 2;
                              
                              console.log('👤 Buyer Logo:', { buyerFactoryName, logo, imageUrl, isEmoji });
                              
                              if (imageUrl && !isEmoji && !failedImages[buyerFactoryName]) {
                                return (
                                  <img 
                                    src={imageUrl} 
                                    alt={buyerFactoryName} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    onError={() => {
                                      console.warn('❌ Buyer logo failed to load:', imageUrl?.substring(0, 50));
                                      setFailedImages(prev => ({ ...prev, [buyerFactoryName]: true }));
                                    }} 
                                  />
                                );
                              }
                              return <span>{logo || '🏢'}</span>;
                            })()}
                          </div>
                          <div 
                            onClick={() => setSelectedFactory({ ...order, type: 'buyer', name: order.buyerFactory })}
                            style={{ 
                              color: dark ? '#e0e0e0' : '#059669', 
                              fontWeight: '600', 
                              width: isAr ? '100px' : 'auto',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              textDecoration: 'underline',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.color = dark ? '#e0e0e0' : '#059669'}
                          >
                            {order.buyerFactory}
                          </div>
                        </div>
                      </td>

                      {/* Waste Type */}
                      <td style={{ padding: '14px 12px', fontSize: '0.9rem', color: dark ? '#e0e0e0' : '#374151', verticalAlign: 'middle' }}>
                        {order.wasteType}
                      </td>

                      {/* Quantity */}
                      <td style={{ padding: '14px 12px', fontSize: '0.9rem', color: dark ? '#e0e0e0' : '#374151', fontWeight: '600', verticalAlign: 'middle' }}>
                        {order.quantity} {order.unit}
                      </td>

                      {/* Price */}
                      <td style={{ padding: '14px 12px', fontSize: '0.95rem', fontWeight: '700', color: '#dc2626', verticalAlign: 'middle' }}>
                        {order.finalTotal.toLocaleString()} ج
                      </td>

                      {/* Recycler */}
                      <td style={{ padding: '14px 12px', fontSize: '0.85rem', color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280', verticalAlign: 'middle' }}>
                        {order.recycler}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}>
                        <span style={{
                          padding: '6px 12px',
                          background: getStatusColor(order.status) + '25',
                          color: getStatusColor(order.status),
                          borderRadius: '6px',
                          fontWeight: '700',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'inline-block'
                        }}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: isAr ? 'flex-end' : 'flex-start', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            title={t.view}
                            style={{
                              padding: '6px 10px',
                              background: '#e0e7ff',
                              color: '#4f46e5',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#c7d2fe'}
                            onMouseLeave={(e) => e.target.style.background = '#e0e7ff'}
                          >
                            <Eye size={12} /> {isAr ? 'عرض' : 'View'}
                          </button>

                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'approved')}
                                title={t.approve}
                                style={{
                                  padding: '6px 10px',
                                  background: '#dcfce7',
                                  color: '#16a34a',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#bbf7d0'}
                                onMouseLeave={(e) => e.target.style.background = '#dcfce7'}
                              >
                                <CheckCircle2 size={12} /> {isAr ? 'قبول' : 'Accept'}
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'rejected')}
                                title={t.reject}
                                style={{
                                  padding: '6px 10px',
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                                onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                              >
                                <XCircle size={12} /> {isAr ? 'رفض' : 'Reject'}
                              </button>
                            </>
                          )}

                          {order.status === 'approved' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              title={t.complete}
                              style={{
                                padding: '6px 10px',
                                background: '#e0e7ff',
                                color: '#4f46e5',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#c7d2fe'}
                              onMouseLeave={(e) => e.target.style.background = '#e0e7ff'}
                            >
                              <CheckCircle2 size={12} /> {isAr ? 'إكمال' : 'Complete'}
                            </button>
                          )}

                          <button
                            onClick={() => downloadOrderPDF(order)}
                            title={t.download}
                            style={{
                              padding: '6px 10px',
                              background: '#fef3c7',
                              color: '#b45309',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#fed7aa'}
                            onMouseLeave={(e) => e.target.style.background = '#fef3c7'}
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : '#fff',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '650px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: dark ? '#e0fff0' : '#064e3b', marginBottom: '20px' }}>
              {t.detailsTitle}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.seller}</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: dark ? '#e0e0e0' : '#059669' }}>{selectedOrder.sellerFactory}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.buyer}</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: dark ? '#e0e0e0' : '#059669' }}>{selectedOrder.buyerFactory}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.waste}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>{selectedOrder.wasteType}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.quantity}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>{selectedOrder.quantity} {selectedOrder.unit}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.recycler}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>{selectedOrder.recycler}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.status}</div>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  background: getStatusColor(selectedOrder.status) + '20',
                  color: getStatusColor(selectedOrder.status),
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                }}>
                  {getStatusLabel(selectedOrder.status)}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div style={{ background: dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6', padding: '18px', borderRadius: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{t.price}:</span>
                <span style={{ fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>{selectedOrder.totalPrice.toLocaleString()} ج</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{t.recycleFee}:</span>
                <span style={{ fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>{selectedOrder.recyclingFee.toLocaleString()} ج</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{t.shippingFee}:</span>
                <span style={{ fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>{selectedOrder.shippingFee.toLocaleString()} ج</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.9rem', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, paddingBottom: '14px' }}>
                <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{t.ecovFee}:</span>
                <span style={{ fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>{selectedOrder.ecovFee.toLocaleString()} ج</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '900' }}>
                <span style={{ color: dark ? '#e0fff0' : '#064e3b' }}>{t.total}:</span>
                <span style={{ color: '#dc2626' }}>{selectedOrder.finalTotal.toLocaleString()} ج</span>
              </div>
            </div>

            {/* Delivery & Payment */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: dark ? '#e0fff0' : '#059669', marginBottom: '10px' }}>{t.deliveryData}</h3>
              <div style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f9fafb', padding: '14px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', color: dark ? '#e0e0e0' : '#374151' }}>
                <div><strong>{t.delivery}:</strong> {selectedOrder.deliveryMethod}</div>
                <div><strong>{t.governorate}:</strong> {selectedOrder.deliveryData?.governorate}</div>
                <div><strong>{t.address}:</strong> {selectedOrder.deliveryData?.address}</div>
                <div><strong>{t.phone}:</strong> {selectedOrder.deliveryData?.phone}</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: dark ? '#e0fff0' : '#059669', marginBottom: '10px' }}>{t.paymentData}</h3>
              <div style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f9fafb', padding: '14px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', color: dark ? '#e0e0e0' : '#374151' }}>
                <div><strong>{t.payment}:</strong> {selectedOrder.paymentMethod}</div>
                <div><strong>{t.date}:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                <div><strong>{t.createdBy}:</strong> {selectedOrder.createdBy}</div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#059669',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = '#047857'}
              onMouseLeave={(e) => e.target.style.background = '#059669'}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Listing Details Modal */}
      {selectedListing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : '#fff',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '650px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: dark ? '#e0fff0' : '#064e3b', marginBottom: '20px' }}>
              {t.listingDetailsTitle}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ 
                gridColumn: '1 / -1',
                padding: '16px',
                background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                borderRadius: '8px',
                border: '2px solid #3b82f6',
                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: '#bfdbfe', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {lang === 'ar' ? 'رقم الإعلان' : 'LISTING #'}
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '900', 
                  color: '#fff',
                  fontFamily: 'monospace',
                  letterSpacing: '2px'
                }}>
                  {selectedListing.listingId || '-'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.waste}</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: dark ? '#e0e0e0' : '#059669' }}>{selectedListing.wasteType}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.quantity}</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: dark ? '#e0e0e0' : '#059669' }}>{selectedListing.quantity} {selectedListing.unit}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.seller}</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: dark ? '#e0e0e0' : '#059669' }}>{selectedListing.sellerFactory}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.buyer}</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: dark ? '#e0e0e0' : '#059669' }}>{selectedListing.buyerFactory}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.status}</div>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  background: getStatusColor(selectedListing.status) + '20',
                  color: getStatusColor(selectedListing.status),
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                }}>
                  {getStatusLabel(selectedListing.status)}
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div style={{ background: dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6', padding: '18px', borderRadius: '10px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: dark ? '#e0fff0' : '#059669', marginBottom: '14px' }}>{t.price}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{t.price}:</span>
                <span style={{ fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>{selectedListing.totalPrice?.toLocaleString() || selectedListing.finalTotal?.toLocaleString()} ج</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{t.recycleFee}:</span>
                <span style={{ fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>{selectedListing.recyclingFee?.toLocaleString() || '0'} ج</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '900', paddingTop: '10px', borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}` }}>
                <span style={{ color: dark ? '#e0fff0' : '#064e3b' }}>{t.total}:</span>
                <span style={{ color: '#dc2626' }}>{selectedListing.finalTotal?.toLocaleString() || selectedListing.totalPrice?.toLocaleString()} ج</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: dark ? '#e0fff0' : '#059669', marginBottom: '10px' }}>{t.deliveryData}</h3>
              <div style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f9fafb', padding: '14px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', color: dark ? '#e0e0e0' : '#374151' }}>
                <div><strong>{t.delivery}:</strong> {selectedListing.deliveryMethod || '-'}</div>
                <div><strong>{t.date}:</strong> {selectedListing.createdAt ? new Date(selectedListing.createdAt).toLocaleString() : '-'}</div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedListing(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#059669',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = '#047857'}
              onMouseLeave={(e) => e.target.style.background = '#059669'}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

          {selectedFactory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : '#fff',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '650px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
          }}>
            {/* Header with Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                background: selectedFactory.type === 'seller' ? '#3b82f620' : '#10b98120',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                overflow: 'hidden',
                border: `2px solid ${selectedFactory.type === 'seller' ? '#3b82f6' : '#10b981'}`,
                position: 'relative',
              }}>
                {(() => {
                  const factoryLogo = factoriesData[selectedFactory.name]?.logo;
                  const factoryName = selectedFactory.name;
                  const hasImageError = failedImages[factoryName];
                  const imageUrl = getImageUrl(factoryLogo);
                  const isEmoji = factoryLogo && typeof factoryLogo === 'string' && factoryLogo.length <= 2;
                  
                  console.log('📸 Rendering logo for:', factoryName, 'Logo value:', factoryLogo, 'Has error:', hasImageError);
                  console.log('🔗 Image URL:', imageUrl);
                  
                  // ✅ إذا كانت صورة ولم تفشل
                  if (imageUrl && !isEmoji && !hasImageError) {
                    console.log('🖼️ Rendering image from URL:', imageUrl);
                    return (
                      <img 
                        key={`${factoryName}-img-${imageUrl.substring(0, 20)}`}
                        src={imageUrl} 
                        alt={factoryName} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain', 
                          padding: '4px',
                          display: 'block',
                          position: 'relative',
                          zIndex: 1,
                        }} 
                        onError={() => {
                          console.warn('❌ Image failed to load for:', factoryName, 'URL:', imageUrl);
                          setFailedImages(prev => ({ ...prev, [factoryName]: true }));
                        }}
                        onLoad={() => {
                          console.log('✅ Image loaded successfully for:', factoryName);
                        }}
                      />
                    );
                  }
                  
                  // إذا كانت emoji
                  if (isEmoji) {
                    return (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                        {factoryLogo}
                      </div>
                    );
                  }
                  
                  // الحالة الافتراضية - emoji
                  return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                      <span style={{ color: '#fff', fontSize: '2.5rem' }}>🏭</span>
                    </div>
                  );
                })()}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: dark ? '#e0fff0' : '#064e3b', margin: 0, marginBottom: '6px' }}>
                  {t.factoryDetailsTitle}
                </h2>
                <p style={{ margin: 0, color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280', fontSize: '0.9rem' }}>
                  {selectedFactory.name || 'N/A'}
                </p>
              </div>
            </div>

            {/* Factory Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.seller}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>
                  {factoriesData[selectedFactory.name]?.name || selectedFactory.name || 'N/A'}
                </div>
              </div>

              {factoriesData[selectedFactory.name]?.industryType && factoriesData[selectedFactory.name]?.industryType !== '-' && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {isAr ? 'نوع الصناعة' : 'Industry Type'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>
                    {factoriesData[selectedFactory.name]?.industryType}
                  </div>
                </div>
              )}

              {factoriesData[selectedFactory.name]?.location && factoriesData[selectedFactory.name]?.location !== '-' && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.location}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>
                    {factoriesData[selectedFactory.name]?.location}
                  </div>
                </div>
              )}

              {factoriesData[selectedFactory.name]?.address && factoriesData[selectedFactory.name]?.address !== '-' && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.address}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>
                    {factoriesData[selectedFactory.name]?.address}
                  </div>
                </div>
              )}

              {factoriesData[selectedFactory.name]?.email && factoriesData[selectedFactory.name]?.email !== '-' && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.email}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#374151', wordBreak: 'break-all' }}>
                    {factoriesData[selectedFactory.name]?.email}
                  </div>
                </div>
              )}

              {factoriesData[selectedFactory.name]?.phone && factoriesData[selectedFactory.name]?.phone !== '-' && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.phone}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>
                    {factoriesData[selectedFactory.name]?.phone}
                  </div>
                </div>
              )}
            </div>

            {/* Company Information - Only show if there's actual data */}
            {(
              (factoriesData[selectedFactory.name]?.ownerName && factoriesData[selectedFactory.name]?.ownerName !== '-') ||
              (factoriesData[selectedFactory.name]?.establishmentYear && factoriesData[selectedFactory.name]?.establishmentYear !== '-') ||
              selectedFactory.wasteType
            ) && (
              <div style={{ background: dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6', padding: '18px', borderRadius: '10px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: dark ? '#e0fff0' : '#059669', marginBottom: '14px' }}>{t.factoryInfo}</h3>
                
                {factoriesData[selectedFactory.name]?.ownerName && factoriesData[selectedFactory.name]?.ownerName !== '-' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{isAr ? 'المالك/المدير' : 'Owner/Manager'}:</span>
                    <span style={{ fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>
                      {factoriesData[selectedFactory.name]?.ownerName}
                    </span>
                  </div>
                )}
                
                {factoriesData[selectedFactory.name]?.establishmentYear && factoriesData[selectedFactory.name]?.establishmentYear !== '-' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{t.establishedYear}:</span>
                    <span style={{ fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>
                      {factoriesData[selectedFactory.name]?.establishmentYear}
                    </span>
                  </div>
                )}
                
                {selectedFactory.wasteType && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{t.waste}:</span>
                    <span style={{ fontWeight: '700', color: dark ? '#e0e0e0' : '#374151' }}>
                      {selectedFactory.wasteType}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Order Statistics */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: dark ? '#e0fff0' : '#059669', marginBottom: '10px' }}>
                {isAr ? 'إحصائيات الطلبات' : 'Order Statistics'}
              </h3>
              <div style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f9fafb', padding: '14px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', color: dark ? '#e0e0e0' : '#374151' }}>
                <div><strong>{isAr ? 'الإجمالي المعالج:' : 'Total Processed:'};</strong> {filteredOrders.length} {isAr ? 'طلب' : 'orders'}</div>
                <div><strong>{t.completed}:</strong> {filteredOrders.filter(o => o.status === 'completed').length}</div>
                <div><strong>{t.approved}:</strong> {filteredOrders.filter(o => o.status === 'approved').length}</div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedFactory(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#059669',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = '#047857'}
              onMouseLeave={(e) => e.target.style.background = '#059669'}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBuyingOrders;
