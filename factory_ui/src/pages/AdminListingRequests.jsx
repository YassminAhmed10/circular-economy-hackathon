import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, XCircle, RefreshCw, Package } from 'lucide-react';
import { adminVerificationAPI } from '../services/api';

function AdminListingRequests({ lang = 'ar', dark = false }) {
  const isAr = lang !== 'en';

  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [listingRows, setListingRows] = useState([]);
  const [rejectReason, setRejectReason] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected

  const t = useMemo(() => ({
    title: isAr ? 'طلبات نشر الإعلانات في Marketplace' : 'Marketplace Listing Approval Requests',
    subtitle: isAr ? 'الإعلانات الجديدة لا تُنشر إلا بعد موافقة الإدارة' : 'New listings are published only after admin approval',
    refresh: isAr ? 'تحديث' : 'Refresh',
    noData: isAr ? 'لا توجد طلبات إعلانات حالياً' : 'No listing requests currently',
    approve: isAr ? 'موافقة' : 'Approve',
    reject: isAr ? 'رفض' : 'Reject',
    reasonPH: isAr ? 'سبب الرفض (اختياري)' : 'Rejection reason (optional)',
    notifications: isAr ? 'الإشعارات' : 'Notifications',
    noNotifications: isAr ? 'لا توجد إشعارات جديدة' : 'No new notifications',

    factory: isAr ? 'المصنع' : 'Factory',
    owner: isAr ? 'المالك' : 'Owner',
    email: isAr ? 'البريد' : 'Email',
    phone: isAr ? 'الهاتف' : 'Phone',
    listingType: isAr ? 'نوع المخلفات' : 'Waste Type',
    listingCategory: isAr ? 'الفئة' : 'Category',
    listingQty: isAr ? 'الكمية' : 'Quantity',
    listingPrice: isAr ? 'السعر' : 'Price',
    listingDesc: isAr ? 'الوصف' : 'Description',
    requestedAt: isAr ? 'وقت الطلب' : 'Requested At',
    status: isAr ? 'الحالة' : 'Status',
    action: isAr ? 'الإجراء' : 'Action',
    pending: isAr ? 'قيد الانتظار' : 'Pending',
    approved: isAr ? 'موافق عليه' : 'Approved',
    rejected: isAr ? 'مرفوض' : 'Rejected',
    all: isAr ? 'الكل' : 'All',
    location: isAr ? 'الموقع' : 'Location',
  }), [isAr]);

  const unreadCount = notifications.reduce((sum, n) => sum + (n.count || 0), 0);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');

      const [listingRes, notifRes] = await Promise.all([
        adminVerificationAPI.getListingRequests(),
        adminVerificationAPI.getNotifications(),
      ]);

      setListingRows(listingRes?.data?.data || []);
      setNotifications(notifRes?.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load listing requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 15000);
    return () => clearInterval(id);
  }, []);

  const approveListing = async (listingId) => {
    const key = `lf-${listingId}`;
    try {
      setBusyKey(key);
      setError('');
      setSuccess('');
      const res = await adminVerificationAPI.approveListing(listingId);
      setSuccess(res?.data?.message || 'Listing approved successfully');
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to approve listing');
    } finally {
      setBusyKey('');
    }
  };

  const rejectListing = async (listingId) => {
    const key = `lr-${listingId}`;
    try {
      setBusyKey(key);
      setError('');
      setSuccess('');
      const reason = (rejectReason[`listing-${listingId}`] || '').trim();
      const res = await adminVerificationAPI.rejectListing(listingId, reason);
      setSuccess(res?.data?.message || 'Listing rejected successfully');
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to reject listing');
    } finally {
      setBusyKey('');
    }
  };

  const buttonBase = {
    borderRadius: 9,
    padding: '0.48rem 0.85rem',
    cursor: 'pointer',
    border: '1px solid transparent',
    fontWeight: 700,
  };

  // Get logo letter
  const getLogoLetter = (factoryName) => {
    return (factoryName || 'M').charAt(0).toUpperCase();
  };

  // Filter listings based on status
  const filteredListings = useMemo(() => {
    if (filterStatus === 'all') return listingRows;
    return listingRows.filter(listing => listing.status?.toLowerCase() === filterStatus.toLowerCase());
  }, [listingRows, filterStatus]);

  const getStatusColor = (status) => {
    if (!status) return '#f59e0b'; // amber for unknown
    status = status.toLowerCase();
    if (status.includes('pending') || status.includes('awaiting')) return '#f59e0b';
    if (status.includes('approved')) return '#10b981';
    if (status.includes('rejected')) return '#ef4444';
    return '#f59e0b';
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', background: dark ? 'linear-gradient(135deg, #0a0f0b 0%, #1a2e1f 100%)' : 'linear-gradient(135deg, #f0f7f4 0%, #e0f7f0 100%)' }}>
      
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

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button 
          onClick={loadAll}
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
          {['all', 'pending', 'approved', 'rejected'].map(status => (
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
              {status === 'all' ? t.all : t[status]}
            </button>
          ))}
        </div>
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

      {/* Listing Table */}
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
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280', fontWeight: '600' }}>
            {isAr ? 'جاري التحميل...' : 'Loading...'}
          </div>
        ) : filteredListings.length === 0 ? (
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
                  background: dark 
                    ? 'rgba(255,255,255,0.08)' 
                    : 'rgba(16, 185, 129, 0.15)',
                  borderBottom: `2px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.2)'}`,
                }}>
                  <th style={{ padding: '16px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '700', color: dark ? '#e0fff0' : '#059669', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.factory}</th>
                  <th style={{ padding: '16px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '700', color: dark ? '#e0fff0' : '#059669', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.owner}</th>
                  <th style={{ padding: '16px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '700', color: dark ? '#e0fff0' : '#059669', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.listingType}</th>
                  <th style={{ padding: '16px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '700', color: dark ? '#e0fff0' : '#059669', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.listingQty}</th>
                  <th style={{ padding: '16px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '700', color: dark ? '#e0fff0' : '#059669', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.listingPrice}</th>
                  <th style={{ padding: '16px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '700', color: dark ? '#e0fff0' : '#059669', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.status}</th>
                  <th style={{ padding: '16px 12px', textAlign: isAr ? 'right' : 'left', fontWeight: '700', color: dark ? '#e0fff0' : '#059669', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing, idx) => (
                  <tr 
                    key={listing.listingId} 
                    style={{ 
                      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(16, 185, 129, 0.1)'}`,
                      background: idx % 2 === 0 
                        ? 'transparent' 
                        : dark 
                        ? 'rgba(255,255,255,0.02)' 
                        : 'rgba(16, 185, 129, 0.05)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = dark 
                        ? 'rgba(255,255,255,0.08)' 
                        : 'rgba(16, 185, 129, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = idx % 2 === 0 
                        ? 'transparent' 
                        : dark 
                        ? 'rgba(255,255,255,0.02)' 
                        : 'rgba(16, 185, 129, 0.05)';
                    }}
                  >
                    <td style={{ padding: '14px 12px' }}>
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
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          border: '2px solid #10b981',
                        }}>
                          {getLogoLetter(listing.factoryName || 'M')}
                        </div>
                        <div style={{ color: dark ? '#e0e0e0' : '#1f2937', fontWeight: '600' }}>
                          {listing.factoryName}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '0.9rem', color: dark ? '#e0e0e0' : '#374151' }}>
                      {listing.ownerName || '-'}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '0.9rem', color: dark ? '#e0e0e0' : '#374151', fontWeight: '600' }}>
                      {listing.wasteType || '-'}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '0.9rem', color: dark ? '#e0e0e0' : '#374151' }}>
                      {listing.quantity} {listing.unit || 'unit'}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '0.95rem', fontWeight: '700', color: '#dc2626' }}>
                      {listing.price?.toLocaleString()} {listing.currency || 'EGP'}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        padding: '6px 12px',
                        background: getStatusColor(listing.status) + '25',
                        color: getStatusColor(listing.status),
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'inline-block'
                      }}>
                        {t[listing.status?.toLowerCase()] || listing.status || 'Unknown'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: isAr ? 'flex-end' : 'flex-start' }}>
                        {listing.status?.toLowerCase() === 'pending' && (
                          <>
                            <button
                              disabled={busyKey === `lf-${listing.listingId}`}
                              onClick={() => approveListing(listing.listingId)}
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
                              disabled={busyKey === `lr-${listing.listingId}`}
                              onClick={() => {
                                const reason = prompt(t.reasonPH);
                                if (reason !== null) {
                                  setRejectReason((prev) => ({ ...prev, [`listing-${listing.listingId}`]: reason }));
                                  rejectListing(listing.listingId);
                                }
                              }}
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
  );
}

export default AdminListingRequests;
