import { useEffect, useMemo, useState } from 'react';
import { Package, CheckCircle2, Clock, XCircle, RefreshCw, Eye, Download } from 'lucide-react';
import api from '../services/api';

// ✅ دالة مساعدة لتحويل مسارات الصور النسبية إلى URLs كاملة
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('data:')) return imagePath;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  if (imagePath.startsWith('/')) {
    if (import.meta.env.DEV) return imagePath;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:54465';
    return apiUrl + imagePath;
  }
  return '/' + imagePath;
};

export default function AdminDirectOrders({ lang = 'ar', dark = false }) {
  const isAr = lang === 'ar';
  
  // ─── Translations ────────────────────────────────────────
  const t = {
    directOrders: isAr ? 'طلبات الاستخدام المباشر' : 'Direct Usage Orders',
    allOrders: isAr ? 'جميع الطلبات' : 'All Orders',
    loading: isAr ? 'جاري التحميل...' : 'Loading...',
    noOrders: isAr ? 'لا توجد طلبات' : 'No orders found',
    orderId: isAr ? 'معرف الطلب' : 'Order ID',
    buyer: isAr ? 'المشتري' : 'Buyer',
    seller: isAr ? 'البائع' : 'Seller',
    wasteType: isAr ? 'نوع المخلفات' : 'Waste Type',
    quantity: isAr ? 'الكمية' : 'Quantity',
    price: isAr ? 'السعر' : 'Price',
    status: isAr ? 'الحالة' : 'Status',
    actions: isAr ? 'الإجراءات' : 'Actions',
    view: isAr ? 'عرض' : 'View',
    approve: isAr ? 'موافقة' : 'Approve',
    reject: isAr ? 'رفض' : 'Reject',
    pending: isAr ? 'معلق' : 'Pending',
    approved: isAr ? 'موافق عليه' : 'Approved',
    rejected: isAr ? 'مرفوض' : 'Rejected',
    completed: isAr ? 'مكتمل' : 'Completed',
    details: isAr ? 'التفاصيل' : 'Details',
    orderNumber: isAr ? 'رقم الطلب' : 'Order Number',
    orderDate: isAr ? 'تاريخ الطلب' : 'Order Date',
    deliveryMethod: isAr ? 'طريقة التسليم' : 'Delivery Method',
    paymentStatus: isAr ? 'حالة الدفع' : 'Payment Status',
    close: isAr ? 'إغلاق' : 'Close',
    refresh: isAr ? 'تحديث' : 'Refresh',
    successMessage: isAr ? 'تم بنجاح' : 'Success',
    errorMessage: isAr ? 'خطأ' : 'Error',
  };

  // ─── Status Color Helper ────────────────────────────────
  const getStatusColor = (status) => {
    const st = (status || '').toLowerCase();
    if (st.includes('معلق') || st.includes('pending')) return '#f59e0b';
    if (st.includes('مقبول') || st.includes('مكتمل') || st.includes('accepted') || st.includes('completed')) return '#10b981';
    if (st.includes('مرفوض') || st.includes('rejected')) return '#ef4444';
    return '#6b7280';
  };

  const getStatusIcon = (status) => {
    const st = (status || '').toLowerCase();
    if (st.includes('معلق') || st.includes('pending')) return <Clock size={16} />;
    if (st.includes('مقبول') || st.includes('مكتمل') || st.includes('accepted') || st.includes('completed')) return <CheckCircle2 size={16} />;
    if (st.includes('مرفوض') || st.includes('rejected')) return <XCircle size={16} />;
    return <Package size={16} />;
  };
  const [loading, setLoading] = useState(true);
  const [directOrders, setDirectOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // ─── Fetch Direct Orders ────────────────────────────────
  const loadDirectOrders = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching direct orders from /orders?type=direct');
      
      const response = await api.get('/orders?type=direct');
      
      console.log('📨 Direct Orders Response:', {
        status: response.status,
        hasSuccessFlag: response.data?.success,
        dataKeys: Object.keys(response.data || {}),
        dataStructure: response.data?.data,
        isArrayInData: Array.isArray(response.data?.data),
        isArray: Array.isArray(response.data)
      });
      
      let ordersData = [];
      
      // Handle multiple response formats
      if (response.data?.success && response.data?.data?.Items) {
        ordersData = response.data.data.Items;
        console.log('✅ Format 1: success + Items array');
      } else if (response.data?.data?.items) {
        ordersData = response.data.data.items;
        console.log('✅ Format 2: nested items array');
      } else if (Array.isArray(response.data?.data)) {
        ordersData = response.data.data;
        console.log('✅ Format 3: direct array in data');
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
        console.log('✅ Format 4: direct top-level array');
      }
      
      // Filter to only DIRECT orders (ensure orderType is 'direct')
      const directOnlyOrders = ordersData.filter(o => 
        (o.orderType === 'direct' || o.OrderType === 'direct' || !o.orderType) && // Default to direct if not specified
        !o.orderType?.includes('recycler')
      );
      
      console.log(`✅ Loaded ${ordersData.length} total orders, ${directOnlyOrders.length} are direct usage orders`);
      setDirectOrders(directOnlyOrders || []);
    } catch (error) {
      console.error('❌ Error loading direct orders:', error);
      setDirectOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Filter Orders based on Status ───────────────────────
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredOrders(directOrders);
    } else {
      // Map UI status names to backend status values
      const mapStatus = (status) => {
        const statusMap = {
          'pending': ['معلق', 'Pending'],
          'approved': ['مقبول', 'مكتمل', 'Accepted', 'Completed'],
          'rejected': ['مرفوض', 'Rejected'],
          'completed': ['مكتمل', 'Completed']
        };
        return statusMap[status] || [status];
      };
      
      const validStatuses = mapStatus(filterStatus);
      setFilteredOrders(directOrders.filter(o => 
        validStatuses.includes(o.status) || 
        validStatuses.includes(o.orderStatus) ||
        o.status?.toLowerCase().includes(filterStatus.toLowerCase()) ||
        o.orderStatus?.toLowerCase().includes(filterStatus.toLowerCase())
      ));
    }
  }, [directOrders, filterStatus]);

  // ─── Load on Mount ──────────────────────────────────────
  useEffect(() => {
    loadDirectOrders();
    const interval = setInterval(loadDirectOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  // ─── Update Order Status ────────────────────────────────
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);
      
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
      console.log('✅ Order status updated successfully:', {
        orderId,
        newStatus,
        response: response.data
      });
      
      // ✅ QUANTITY UPDATE: If rejected, quantity should be restored
      // The backend handles this, but we can log it for confirmation
      if (newStatus === 'مرفوض' || newStatus === 'Rejected') {
        console.log('📦 Order rejected - waste quantity should be restored by backend');
      }
      
      // Refresh orders list immediately
      await loadDirectOrders();
    } catch (error) {
      console.error('❌ Error updating order:', error);
      alert(`${isAr ? 'فشل' : 'Failed'}: ${error.response?.data?.message || error.message}`);
    }
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <div style={{ padding: '20px', width: '100%', overflowX: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#1e293b' }}>
          {t.directOrders}
        </h1>
        <button 
          onClick={loadDirectOrders}
          style={{
            padding: '10px 20px',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#4338ca'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#4f46e5'}
        >
          <RefreshCw size={16} />
          {t.refresh}
        </button>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '8px 16px',
              background: filterStatus === status ? '#4f46e5' : '#e2e8f0',
              color: filterStatus === status ? '#fff' : '#1e293b',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== status) e.currentTarget.style.background = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== status) e.currentTarget.style.background = '#e2e8f0';
            }}
          >
            {t[status] || status}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: dark ? '#a0aec0' : '#64748b' }}>
          {t.loading}
        </div>
      )}

      {/* No Orders State */}
      {!loading && filteredOrders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: dark ? '#a0aec0' : '#64748b' }}>
          {t.noOrders}
        </div>
      )}

      {/* Orders Table */}
      {!loading && filteredOrders.length > 0 && (
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: `1px solid ${dark ? '#333' : '#e2e8f0'}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: dark ? '#1e1e1e' : '#fff' }}>
            <thead>
              <tr style={{ 
                background: dark ? '#e2e8f0' : '#f8fafc',
                borderBottom: `1px solid ${dark ? '#cbd5e1' : '#e2e8f0'}`,
              }}>
                {[
                  'orderId', 'buyer', 'seller', 'wasteType', 
                  'quantity', 'price', 'status', 'actions'
                ].map(col => (
                  <th 
                    key={col}
                    style={{ 
                      padding: '14px 12px', 
                      textAlign: isAr ? 'right' : 'left', 
                      fontWeight: '600', 
                      color: '#1e293b', 
                      fontSize: '0.8rem',
                      verticalAlign: 'middle'
                    }}
                  >
                    {t[col] || col}
                  </th>
                ))}
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
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f8fafc'; }}
                >
                  {/* Order ID */}
                  <td style={{ padding: '14px 12px', fontSize: '0.9rem', verticalAlign: 'middle' }}>
                    <span style={{ color: '#64748b', fontWeight: '400' }}>
                      #{order.id || order.orderNumber || '-'}
                    </span>
                  </td>

                  {/* Buyer */}
                  <td style={{ padding: '14px 12px', fontSize: '0.9rem', verticalAlign: 'middle', color: dark ? '#e0e0e0' : '#374151' }}>
                    {order.buyerName || order.buyer || '-'}
                  </td>

                  {/* Seller */}
                  <td style={{ padding: '14px 12px', fontSize: '0.9rem', verticalAlign: 'middle', color: dark ? '#e0e0e0' : '#374151' }}>
                    {order.sellerName || order.seller || '-'}
                  </td>

                  {/* Waste Type */}
                  <td style={{ padding: '14px 12px', fontSize: '0.9rem', verticalAlign: 'middle', color: dark ? '#e0e0e0' : '#374151' }}>
                    {order.wasteType || order.category || '-'}
                  </td>

                  {/* Quantity */}
                  <td style={{ padding: '14px 12px', fontSize: '0.9rem', verticalAlign: 'middle', color: dark ? '#e0e0e0' : '#374151', fontWeight: '600' }}>
                    {order.quantity || order.amount} {order.unit || ''}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '14px 12px', fontSize: '0.95rem', fontWeight: '700', color: '#dc2626', verticalAlign: 'middle' }}>
                    {(order.totalPrice || order.price || 0).toLocaleString()} ج
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}>
                    <span style={{
                      padding: '6px 12px',
                      background: getStatusColor(order.status || order.orderStatus) + '25',
                      color: getStatusColor(order.status || order.orderStatus),
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'inline-block'
                    }}>
                      {t[order.status || order.orderStatus] || order.status || '-'}
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
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#c7d2fe'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#e0e7ff'; }}
                      >
                        <Eye size={14} />
                        {t.view}
                      </button>

                      {(order.status === 'pending' || order.orderStatus === 'Pending') && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'approved')}
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
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#bbf7d0'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#dcfce7'; }}
                          >
                            <CheckCircle2 size={14} />
                            {t.approve}
                          </button>

                          <button
                            onClick={() => updateOrderStatus(order.id, 'rejected')}
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
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                          >
                            <XCircle size={14} />
                            {t.reject}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
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
        }}>
          <div style={{
            background: dark ? '#1e293b' : '#fff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: dark ? '#e0e0e0' : '#1e293b' }}>
                {t.details}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: dark ? '#a0aec0' : '#64748b',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: dark ? '#a0aec0' : '#64748b' }}>
                  {t.orderNumber}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: dark ? '#e0e0e0' : '#1e293b', marginTop: '4px' }}>
                  {selectedOrder.orderNumber || selectedOrder.id || '-'}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: dark ? '#a0aec0' : '#64748b' }}>
                  {t.status}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: dark ? '#e0e0e0' : '#1e293b', marginTop: '4px' }}>
                  {t[selectedOrder.status || 'pending'] || selectedOrder.status || '-'}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: dark ? '#a0aec0' : '#64748b' }}>
                  {t.buyer}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: dark ? '#e0e0e0' : '#1e293b', marginTop: '4px' }}>
                  {selectedOrder.buyerName || '-'}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: dark ? '#a0aec0' : '#64748b' }}>
                  {t.seller}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: dark ? '#e0e0e0' : '#1e293b', marginTop: '4px' }}>
                  {selectedOrder.sellerName || '-'}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: dark ? '#a0aec0' : '#64748b' }}>
                  {t.wasteType}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: dark ? '#e0e0e0' : '#1e293b', marginTop: '4px' }}>
                  {selectedOrder.wasteType || '-'}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: dark ? '#a0aec0' : '#64748b' }}>
                  {t.quantity}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: dark ? '#e0e0e0' : '#1e293b', marginTop: '4px' }}>
                  {selectedOrder.quantity || '-'} {selectedOrder.unit || ''}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: dark ? '#a0aec0' : '#64748b' }}>
                  {t.price}
                </label>
                <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#dc2626', marginTop: '4px' }}>
                  {(selectedOrder.totalPrice || 0).toLocaleString()} ج
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: dark ? '#a0aec0' : '#64748b' }}>
                  {t.paymentStatus}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: dark ? '#e0e0e0' : '#1e293b', marginTop: '4px' }}>
                  {selectedOrder.paymentStatus || '-'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                marginTop: '24px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#4338ca'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#4f46e5'}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Helper: Get Status Color
// ──────────────────────────────────────────────────────────
function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return '#94a3b8';
    case 'approved':
      return '#64748b';
    case 'rejected':
      return '#475569';
    case 'completed':
      return '#64748b';
    default:
      return '#64748b';
  }
}
