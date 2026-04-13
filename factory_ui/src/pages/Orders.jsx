import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Clock, XCircle, Package, DollarSign, Calendar, Truck, AlertCircle, Loader, X, RefreshCw, Building2, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import { getFactoryOrders, getOrderWithPayments, updateOrderStatus } from '../services/circularEconomyApi';
import api from '../services/api';
import './Orders.css';

// ─── Translations ──────────────────────────────────────────
const T = {
  en: {
    purchaseOrders: 'Purchase Orders',
    managePurchaseOrders: 'Manage and track all your purchase orders',
    totalOrders: 'Total Orders',
    completed: 'Completed',
    pending: 'Pending',
    totalValue: 'Total Value',
    allStatuses: 'All Statuses',
    confirmed: 'Confirmed',
    inProgress: 'In Progress',
    noOrders: 'No orders found',
    orderId: 'Order ID',
    quantity: 'Quantity',
    price: 'Price',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    viewDetails: 'View Details',
    loading: 'Loading orders...',
    error: 'Error',
    noUserFound: 'No user found',
    failedLoad: 'Failed to load orders',
    orderDetails: 'Order Details',
    orderNumber: 'Order Number',
    wasteType: 'Waste Type',
    category: 'Category',
    orderedQuantity: 'Ordered Quantity',
    currentlyAvailable: 'Currently Available',
    seller: 'Seller',
    estimatedDelivery: 'Estimated Delivery',
    close: 'Close',
    currency: 'EGP',
    wasteDetails: 'Waste Details',
    paymentMethod: 'Payment Method',
    reason: 'Reason',
    orderDate: 'Order Date',
    orderTime: 'Order Time',
    lastUpdated: 'Last Updated',
    cancelOrder: 'Cancel Order',
    deliveryInfo: 'Delivery Information',
    recipient: 'Recipient',
    phone: 'Phone',
    address: 'Address',
    governorate: 'Governorate',
    deliveryMethod: 'Delivery Method',
    pickupFactory: 'Pickup from factory',
    delivery: 'Delivery',
    paymentInfo: 'Payment Information',
    paymentHistory: 'Payment History',
    orderType: 'Order Type',
    directOrder: 'Direct Waste Order',
    recyclerOrder: 'Recycler Order',
    buyer: 'Buyer',
    listingId: 'Listing ID',
    unitPrice: 'Unit Price',
    total: 'Total',
    directUsage: 'Direct Usage',
    recycling: 'Recycling',
  },
  ar: {
    purchaseOrders: 'الطلبات',
    managePurchaseOrders: 'إدارة وتتبع جميع طلبات الشراء الخاصة بمصنعك',
    totalOrders: 'إجمالي الطلبات',
    completed: 'مكتملة',
    pending: 'معلقة',
    totalValue: 'إجمالي القيمة',
    allStatuses: 'جميع الحالات',
    confirmed: 'مؤكد',
    inProgress: 'قيد المعالجة',
    noOrders: 'لا توجد طلبات',
    orderId: 'رقم الطلب',
    quantity: 'الكمية',
    price: 'السعر',
    status: 'الحالة',
    date: 'التاريخ',
    actions: 'العمليات',
    viewDetails: 'عرض التفاصيل',
    loading: 'جاري تحميل الطلبات...',
    error: 'خطأ',
    noUserFound: 'لم يتم تحديد المستخدم',
    failedLoad: 'فشل تحميل الطلبات',
    orderDetails: 'تفاصيل الطلب',
    orderNumber: 'رقم الطلب',
    wasteType: 'نوع المخلفات',
    category: 'الفئة',
    orderedQuantity: 'الكمية المطلوبة',
    currentlyAvailable: 'المتاح حاليا',
    seller: 'البائع',
    estimatedDelivery: 'التسليم المتوقع',
    close: 'إغلاق',
    currency: 'ج.م',
    wasteDetails: 'تفاصيل المخلفات',
    paymentMethod: 'طريقة الدفع',
    reason: 'السبب',
    orderDate: 'تاريخ الطلب',
    orderTime: 'وقت الطلب',
    lastUpdated: 'آخر تحديث',
    cancelOrder: 'إلغاء الطلب',
    deliveryInfo: 'معلومات التوصيل',
    recipient: 'المستقبل',
    phone: 'الهاتف',
    address: 'العنوان',
    governorate: 'المحافظة',
    deliveryMethod: 'طريقة التسليم',
    pickupFactory: 'استلام من المصنع',
    delivery: 'توصيل',
    paymentInfo: 'معلومات الدفع',
    paymentHistory: 'سجل المدفوعات',
    orderType: 'نوع الطلب',
    directOrder: 'طلب مخلفات مباشر',
    recyclerOrder: 'طلب معالج تدوير',
    buyer: 'المشتري',
    listingId: 'رقم الإعلان',
    unitPrice: 'سعر الوحدة',
    total: 'الإجمالي',
    directUsage: 'استخدام مباشر',
    recycling: 'تدوير',
  }
};

function Orders({ user, lang = 'en' }) {
    const t = T[lang] || T.en;
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [wasteListings, setWasteListings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [orderWithDetails, setOrderWithDetails] = useState(null);
    const [newOrderFromPlaceOrder, setNewOrderFromPlaceOrder] = useState(null);

    // Check if arriving from PlaceOrder with new order data
    useEffect(() => {
        if (location.state?.newOrder && location.state?.orderCreated) {
            console.log('📥 New order received from PlaceOrder. Fetching actual order data from API...');
            setNewOrderFromPlaceOrder(location.state.newOrder);
            
            // Fetch the ACTUAL order data from the API
            const fetchNewOrder = async () => {
                try {
                    // Get the order ID from the PlaceOrder data
                    const orderId = location.state.newOrder?.orderNumber;
                    
                    if (!orderId) {
                        console.warn('⚠️ No order ID found, using local data');
                        setSelectedOrder(location.state.newOrder);
                        setShowDetails(true);
                        return;
                    }
                    
                    // Try to fetch the order directly by ID from the API
                    const response = await api.get(`/orders/${orderId}`);
                    if (response.data?.data || response.data?.id) {
                        const actualOrder = response.data.data || response.data;
                        console.log('✅ Fetched actual order from API:', actualOrder);
                        setSelectedOrder(actualOrder);
                        setShowDetails(true);
                        return;
                    }
                } catch (err) {
                    console.warn('⚠️ Could not fetch order from API by ID:', err.message);
                }
                
                // Fallback: use local data
                console.log('📌 Using local PlaceOrder data as fallback');
                setSelectedOrder(location.state.newOrder);
                setShowDetails(true);
            };
            
            // Delay fetch to allow everything to initialize
            setTimeout(fetchNewOrder, 500);
        }
    }, [location.state]);

    // Load waste listings (for context)
    useEffect(() => {
        const loadWasteListings = async () => {
            try {
                const response = await api.get('/marketplace/waste-listings', { 
                    params: { limit: 100, page: 1 } 
                });
                
                console.log('📦 Waste Listings Response:', response.data);
                
                let listings = [];
                if (Array.isArray(response.data?.data)) {
                    listings = response.data.data;
                } else if (response.data?.data?.items) {
                    listings = response.data.data.items;
                } else if (Array.isArray(response.data)) {
                    listings = response.data;
                }
                
                const listingsByID = {};
                listings.forEach(listing => {
                    listingsByID[listing.id] = listing;
                });
                
                setWasteListings(listingsByID);
                console.log('✅ Loaded', listings.length, 'waste listings');
            } catch (err) {
                console.error('⚠️ Failed to load waste listings:', err);
            }
        };
        
        loadWasteListings();
    }, []);

    // Load orders
    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!user?.id && !localStorage.getItem('authToken')) {
                    setError(t.noUserFound);
                    return;
                }

                const response = await api.get('/orders?page=1&pageSize=100', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });

                console.log('📋 Raw Orders API Response:', response.data);

                let ordersData = [];
                
                if (response.data?.success && response.data?.data?.Items) {
                    ordersData = response.data.data.Items;
                } else if (response.data?.data?.items) {
                    ordersData = response.data.data.items;
                } else if (Array.isArray(response.data?.data)) {
                    ordersData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    ordersData = response.data;
                }

                // Log raw order data to debug
                if (ordersData.length > 0) {
                    console.log('📊 Sample raw order:', {
                        id: ordersData[0].id,
                        wasteType: ordersData[0].wasteType,
                        sellerName: ordersData[0].sellerName,
                        buyerName: ordersData[0].buyerName,
                        orderType: ordersData[0].orderType,
                        raw: ordersData[0]
                    });
                }

                const normalizedOrders = ordersData.map(order => normalizeOrderData(order));
                
                setOrders(normalizedOrders);
                console.log('✅ Loaded', normalizedOrders.length, 'orders');
            } catch (err) {
                console.error('❌ Failed to load orders:', err);
                setError(t.failedLoad);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
        const interval = setInterval(loadOrders, 10000);
        return () => clearInterval(interval);
    }, [user?.id, lang]);

    // ✅ Improved normalizeOrderData with better data extraction
    const normalizeOrderData = (order) => {
    // Extract order type
    const orderType = order.orderType || order.OrderType || 'direct';
    
    // Normalize status
    const status = order.status || order.Status || order.orderStatus || 'Pending';
    const normalizedStatus = normalizeStatus(status);
    
    // Calculate amounts
    const amount = Number(order.amount || order.Amount || 1);
    const totalPrice = Number(order.totalPrice || order.TotalPrice || order.price || order.Price || 0);
    const unitPrice = amount > 0 ? totalPrice / amount : 0;
    
    // ✅ IMPROVED: Waste type to English mapping
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
    
    // Category names for display
    const categoryNameMap = {
        'plastic': 'Plastic',
        'metal': 'Metal',
        'paper': 'Paper',
        'glass': 'Glass',
        'wood': 'Wood',
        'textile': 'Textile',
        'electronic': 'Electronics',
        'electronics': 'Electronics',
        'chemicals': 'Chemicals',
        'chemical': 'Chemicals',
        'packaging': 'Packaging',
        'عام': 'General'
    };
    
    // Get waste type with case-insensitive mapping
    let wasteType = order.wasteType || order.WasteType || '';
    let category = order.wasteCategory || order.WasteCategory || order.category || order.Category || '';
    
    // Clean up encoding issues
    wasteType = wasteType.replace(/\?/g, '').trim();
    category = category.replace(/\?/g, '').trim();
    
    // Apply waste type mapping with case-insensitive matching
    const wasteTypeLower = wasteType.toLowerCase();
    if (wasteTypeMap[wasteTypeLower]) {
        wasteType = wasteTypeMap[wasteTypeLower];
    } else if (category) {
        // Use category mapping as fallback
        const categoryLower = category.toLowerCase();
        wasteType = wasteTypeMap[categoryLower] || category || 'Waste Material';
    }
    
    // Apply category name mapping for display
    const categoryLower = category.toLowerCase();
    let displayCategory = categoryNameMap[categoryLower] || category || 'General';
    // Capitalize first letter if it's not already
    if (displayCategory && displayCategory.length > 0) {
        displayCategory = displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1);
    }
    
    // ✅ IMPROVED: Get seller name with fallback - check multiple API response formats
    let sellerName = order.sellerName || order.SellerName || order.factoryName || order.FactoryName || '';
    sellerName = sellerName.replace(/\?/g, '').trim();
    
    if (!sellerName || sellerName === '?????') {
        // Try to get from WasteListing if available
        if (order.wasteListing && order.wasteListing.factoryName) {
            sellerName = order.wasteListing.factoryName.replace(/\?/g, '').trim();
        } else if (order.WasteListing && order.WasteListing.FactoryName) {
            sellerName = order.WasteListing.FactoryName.replace(/\?/g, '').trim();
        } else if (order.sellerFactoryName) {
            sellerName = order.sellerFactoryName.replace(/\?/g, '').trim();
        } else if (order.SellerFactoryName) {
            sellerName = order.SellerFactoryName.replace(/\?/g, '').trim();
        } else {
            sellerName = 'Unknown Seller';
        }
    }
    
    // Get buyer name with fallback
    let buyerName = order.buyerName || order.BuyerName || order.buyerFactoryName || order.BuyerFactoryName || '';
    buyerName = buyerName.replace(/\?/g, '').trim();
    if (!buyerName) buyerName = 'Unknown Buyer';
    
    // Format date and time
    const orderDateRaw = order.orderDate || order.OrderDate || order.createdAt || new Date().toISOString();
    const orderDateObj = new Date(orderDateRaw);
    const formattedDate = orderDateObj.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
    const formattedTime = orderDateObj.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    return {
        id: order.id,
        orderNumber: order.orderNumber || order.OrderNumber || `ORD-${order.id}`,
        listingId: order.wasteListingId || order.WasteListingId || 'N/A',
        orderType: orderType.toLowerCase(),
        wasteType: wasteType,
        category: displayCategory,
        amount: amount,
        unit: order.unit || order.Unit || 'ton',
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        status: normalizedStatus,
        rawStatus: status,
        buyerName: buyerName,
        sellerName: sellerName,
        orderDate: orderDateRaw,
        orderDateFormatted: formattedDate,
        orderTimeFormatted: formattedTime,
        deliveryDate: order.deliveryDate || order.DeliveryDate,
        completedDate: order.completedDate || order.CompletedDate,
        notes: order.notes || order.Notes,
        paymentMethod: order.paymentMethod || order.PaymentMethod || 'cash',
        deliveryMethod: order.deliveryMethod || order.DeliveryMethod || 'pickup',
        deliveryAddress: order.deliveryAddress || order.DeliveryAddress,
        governorate: order.governorate || order.Governorate,
        recipientName: order.recipientName || order.RecipientName,
        recipientPhone: order.recipientPhone || order.RecipientPhone,
        recyclerName: order.recyclerName || order.RecyclerName,
        recyclerStatus: order.recyclerStatus || order.RecyclerStatus,
    };
};

    const normalizeStatus = (status) => {
        const normalized = (status || '').toLowerCase();
        if (normalized.includes('completed') || normalized.includes('مكتمل')) return 'Completed';
        if (normalized.includes('progress') || normalized.includes('معالجة') || normalized.includes('قيد التوصيل')) return 'In Progress';
        if (normalized.includes('confirmed') || normalized.includes('مؤكد') || normalized.includes('مقبول')) return 'Confirmed';
        if (normalized.includes('pending') || normalized.includes('معلق')) return 'Pending';
        if (normalized.includes('cancelled') || normalized.includes('ملغى') || normalized.includes('مرفوض')) return 'Cancelled';
        return status || 'Pending';
    };

    const getStatusColor = (status) => {
        const s = status.toLowerCase();
        if (s.includes('completed')) return 'bg-emerald-100 text-emerald-800';
        if (s.includes('progress') || s.includes('in progress')) return 'bg-blue-100 text-blue-800';
        if (s.includes('pending')) return 'bg-amber-100 text-amber-800';
        if (s.includes('cancelled')) return 'bg-red-100 text-red-800';
        if (s.includes('confirmed')) return 'bg-indigo-100 text-indigo-800';
        return 'bg-slate-100 text-slate-800';
    };

    const getStatusIcon = (status) => {
        const s = status.toLowerCase();
        if (s.includes('completed')) return <CheckCircle className="w-4 h-4" />;
        if (s.includes('progress') || s.includes('in progress')) return <Truck className="w-4 h-4" />;
        if (s.includes('pending')) return <Clock className="w-4 h-4" />;
        if (s.includes('cancelled')) return <XCircle className="w-4 h-4" />;
        return null;
    };

    const handleViewDetails = async (order) => {
        try {
            console.log('📄 Viewing order details:', order.id);
            
            // Try to fetch fresh order details from backend
            let enrichedOrder = { ...order };
            
            try {
                const response = await api.get(`/orders/${order.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });
                
                if (response.data?.success && response.data?.data) {
                    const freshOrder = response.data.data;
                    enrichedOrder = {
                        ...enrichedOrder,
                        ...normalizeOrderData(freshOrder),
                    };
                    console.log('✅ Fetched fresh order details');
                }
            } catch (err) {
                console.warn('⚠️ Using cached order data');
            }
            
            // Calculate estimated delivery
            const orderDate = new Date(order.orderDate);
            const estimatedDelivery = new Date(orderDate);
            estimatedDelivery.setDate(estimatedDelivery.getDate() + (order.deliveryMethod === 'pickup' ? 1 : 5));
            enrichedOrder.estimatedDelivery = estimatedDelivery.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
            
            setOrderWithDetails(enrichedOrder);
            setSelectedOrder(enrichedOrder);
            setShowDetails(true);
        } catch (err) {
            console.error('Failed to fetch order details:', err);
            setSelectedOrder(order);
            setShowDetails(true);
        }
    };

    const filteredOrders = orders.filter(o => {
        let matches = true;
        if (filterStatus !== 'all') {
            matches = matches && (o.status === filterStatus || o.status.toLowerCase().includes(filterStatus.toLowerCase()));
        }
        if (filterType !== 'all') {
            matches = matches && o.orderType === filterType;
        }
        return matches;
    });

    const directOrders = filteredOrders.filter(o => o.orderType === 'direct');
    const recyclerOrders = filteredOrders.filter(o => o.orderType === 'recycler');

    const stats = {
        total: orders.length,
        directCount: orders.filter(o => o.orderType === 'direct').length,
        recyclerCount: orders.filter(o => o.orderType === 'recycler').length,
        completed: orders.filter(o => o.status === 'Completed').length,
        pending: orders.filter(o => o.status === 'Pending').length,
        revenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-slate-600">{t.loading}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <AlertCircle className="w-6 h-6 text-red-600 mb-3" />
                    <p className="text-red-800 font-semibold">{t.error}</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    // Order Table Component
    const OrderTable = ({ orders, title, icon, type }) => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {icon}
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium">
                        {orders.length} orders
                    </span>
                </div>
            </div>
            
            {orders.length === 0 ? (
                <div className="p-12 text-center">
                    <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">{t.noOrders}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-4 px-6 text-left font-semibold text-slate-700">{t.orderId}</th>
                                <th className="py-4 px-6 text-left font-semibold text-slate-700">{t.wasteType}</th>
                                <th className="py-4 px-6 text-left font-semibold text-slate-700">{t.quantity}</th>
                                <th className="py-4 px-6 text-left font-semibold text-slate-700">{t.price}</th>
                                <th className="py-4 px-6 text-left font-semibold text-slate-700">{t.status}</th>
                                <th className="py-4 px-6 text-left font-semibold text-slate-700">{t.date}</th>
                                <th className="py-4 px-6 text-left font-semibold text-slate-700">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <span className="font-mono font-medium text-slate-900">{order.orderNumber}</span>
                                            <div className="text-xs text-slate-400 mt-1">#{order.id}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <span className="font-medium text-slate-800">{order.wasteType}</span>
                                            <div className="text-xs text-slate-400">{order.category}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span>{order.amount} {order.unit}</span>
                                     </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <span className="font-medium text-green-600">
                                                {Math.round(order.totalPrice).toLocaleString()} {t.currency}
                                            </span>
                                            <div className="text-xs text-slate-400">
                                                {Math.round(order.unitPrice).toLocaleString()} / {order.unit}
                                            </div>
                                        </div>
                                     </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                     </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <span className="text-sm text-slate-600">{order.orderDateFormatted}</span>
                                            <div className="text-xs text-slate-400">{order.orderTimeFormatted}</div>
                                        </div>
                                     </td>
                                    <td className="py-4 px-6">
                                        <button 
                                            onClick={() => handleViewDetails(order)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                                        >
                                            {t.viewDetails} →
                                        </button>
                                     </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {t.purchaseOrders}
                    </h1>
                    <p className="text-slate-600">
                        {t.managePurchaseOrders}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">{t.totalOrders}</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">{t.directOrder}</p>
                                <p className="text-2xl font-bold text-green-600">{stats.directCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">{t.recyclerOrder}</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.recyclerCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">{t.completed}</p>
                                <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">{t.totalValue}</p>
                                <p className="text-2xl font-bold text-amber-600">
                                    {Math.round(stats.revenue).toLocaleString()} {t.currency}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex gap-4 flex-wrap">
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">{t.allStatuses}</option>
                        <option value="Pending">{t.pending}</option>
                        <option value="Confirmed">{t.confirmed}</option>
                        <option value="In Progress">{t.inProgress}</option>
                        <option value="Completed">{t.completed}</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">All Orders</option>
                        <option value="direct">{t.directOrder}</option>
                        <option value="recycler">{t.recyclerOrder}</option>
                    </select>
                </div>

                {/* Orders Tables */}
                <OrderTable 
                    orders={directOrders} 
                    title={t.directOrder}
                    icon={<Package className="w-4 h-4 text-green-600" />}
                    type="direct"
                />
                
                <OrderTable 
                    orders={recyclerOrders} 
                    title={t.recyclerOrder}
                    icon={<RefreshCw className="w-4 h-4 text-purple-600" />}
                    type="recycler"
                />

                {/* Order Details Modal */}
                {showDetails && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {t.orderDetails}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedOrder.orderType === 'direct' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {selectedOrder.orderType === 'direct' ? t.directOrder : t.recyclerOrder}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowDetails(false)}
                                    className="text-slate-500 hover:text-slate-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="p-6">
                                {/* Order Header Info */}
                                <div className="grid md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-200">
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">{t.orderNumber}</p>
                                        <p className="font-mono font-bold text-lg">{selectedOrder.orderNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">{t.listingId}</p>
                                        <p className="font-mono font-medium">{selectedOrder.listingId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">{t.status}</p>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                            {getStatusIcon(selectedOrder.status)}
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Waste Details Section */}
                                <div className="mb-6 pb-6 border-b border-slate-200">
                                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-green-600" />
                                        {t.wasteDetails}
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-slate-600">{t.wasteType}</p>
                                            <p className="font-semibold text-slate-800">{selectedOrder.wasteType}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">{t.category}</p>
                                            <p className="font-semibold text-slate-800">{selectedOrder.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">{t.orderedQuantity}</p>
                                            <p className="font-semibold">{selectedOrder.amount} {selectedOrder.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">{t.unitPrice}</p>
                                            <p className="font-semibold">{Math.round(selectedOrder.unitPrice).toLocaleString()} {t.currency}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">{t.total}</p>
                                            <p className="font-bold text-green-600 text-lg">{Math.round(selectedOrder.totalPrice).toLocaleString()} {t.currency}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Party Information */}
                                <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-200">
                                    <div>
                                        <h3 className="font-bold mb-2 flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            {t.seller}
                                        </h3>
                                        <p className="font-medium text-slate-800">{selectedOrder.sellerName}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2 flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4" />
                                            {t.buyer}
                                        </h3>
                                        <p className="font-medium text-slate-800">{selectedOrder.buyerName}</p>
                                    </div>
                                </div>

                                {/* Order Time Information */}
                                <div className="mb-6 pb-6 border-b border-slate-200">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        Order Timeline
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-slate-600">{t.orderDate}</p>
                                            <p className="font-medium">{selectedOrder.orderDateFormatted}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">{t.orderTime}</p>
                                            <p className="font-medium">{selectedOrder.orderTimeFormatted}</p>
                                        </div>
                                        {selectedOrder.estimatedDelivery && (
                                            <div>
                                                <p className="text-sm text-slate-600">{t.estimatedDelivery}</p>
                                                <p className="font-medium">{selectedOrder.estimatedDelivery}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Delivery Information */}
                                {selectedOrder.deliveryAddress && (
                                    <div className="mb-6 pb-6 border-b border-slate-200">
                                        <h3 className="font-bold mb-3 flex items-center gap-2">
                                            <Truck className="w-5 h-5 text-blue-600" />
                                            {t.deliveryInfo}
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {selectedOrder.recipientName && (
                                                <div>
                                                    <p className="text-sm text-slate-600">{t.recipient}</p>
                                                    <p className="font-medium">{selectedOrder.recipientName}</p>
                                                </div>
                                            )}
                                            {selectedOrder.recipientPhone && (
                                                <div>
                                                    <p className="text-sm text-slate-600">{t.phone}</p>
                                                    <p className="font-medium">{selectedOrder.recipientPhone}</p>
                                                </div>
                                            )}
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-slate-600">{t.address}</p>
                                                <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                                            </div>
                                            {selectedOrder.governorate && (
                                                <div>
                                                    <p className="text-sm text-slate-600">{t.governorate}</p>
                                                    <p className="font-medium">{selectedOrder.governorate}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm text-slate-600">{t.deliveryMethod}</p>
                                                <p className="font-medium">{selectedOrder.deliveryMethod === 'pickup' ? t.pickupFactory : t.delivery}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Information */}
                                <div className="mb-6">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-amber-600" />
                                        {t.paymentInfo}
                                    </h3>
                                    <div>
                                        <p className="text-sm text-slate-600">{t.paymentMethod}</p>
                                        <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                                    </div>
                                </div>

                                {/* Recycler Info */}
                                {selectedOrder.orderType === 'recycler' && selectedOrder.recyclerName && (
                                    <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                                        <h3 className="font-bold mb-2 flex items-center gap-2 text-purple-800">
                                            <RefreshCw className="w-4 h-4" />
                                            Recycler Information
                                        </h3>
                                        <p><strong>Recycler:</strong> {selectedOrder.recyclerName}</p>
                                        <p><strong>Status:</strong> {selectedOrder.recyclerStatus || 'Pending'}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-slate-50 px-6 py-4 flex justify-end">
                                <button 
                                    onClick={() => setShowDetails(false)}
                                    className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
                                >
                                    {t.close}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;