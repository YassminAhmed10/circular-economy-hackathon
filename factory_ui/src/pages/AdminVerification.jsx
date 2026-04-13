import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, XCircle, RefreshCw, Eye } from 'lucide-react';
import { adminVerificationAPI } from '../services/api';

// Detail Field Component
const DetailField = ({ label, value, dark }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontSize: '12px', fontWeight: '500', color: dark ? '#d1d5db' : '#6b7280', marginBottom: '4px' }}>
      {label}
    </span>
    <span style={{ fontSize: '14px', fontWeight: '500', color: dark ? '#f3f4f6' : '#111827', wordBreak: 'break-word' }}>
      {value || '-'}
    </span>
  </div>
);

function AdminVerification({ lang = 'ar', dark = false }) {
  const isAr = lang !== 'en';

  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [verificationRows, setVerificationRows] = useState([]);
  const [rejectReason, setRejectReason] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);

  const t = useMemo(() => ({
    refresh: isAr ? 'تحديث' : 'Refresh',
    approve: isAr ? 'موافقة' : 'Approve',
    reject: isAr ? 'رفض' : 'Reject',
    reasonPH: isAr ? 'سبب الرفض (اختياري)' : 'Rejection reason (optional)',

    verifyTitle: isAr ? 'طلبات توثيق المصانع' : 'Factory Verification Requests',
    verifySub: isAr ? 'راجع بيانات المصنع ثم وافق أو ارفض' : 'Review factory details then approve or reject',

    notifications: isAr ? 'الإشعارات' : 'Notifications',
    noNotifications: isAr ? 'لا توجد إشعارات جديدة' : 'No new notifications',

    factory: isAr ? 'المصنع' : 'Factory',
    owner: isAr ? 'المالك' : 'Owner',
    industry: isAr ? 'النشاط' : 'Industry',
    location: isAr ? 'الموقع' : 'Location',
    address: isAr ? 'العنوان' : 'Address',
    email: isAr ? 'البريد' : 'Email',
    phone: isAr ? 'الهاتف' : 'Phone',
    tax: isAr ? 'الرقم الضريبي' : 'Tax Number',
    reg: isAr ? 'السجل التجاري' : 'Registration Number',
    status: isAr ? 'الحالة' : 'Status',
    requestedAt: isAr ? 'وقت الطلب' : 'Requested At',
    
    // Modal fields
    viewDetails: isAr ? 'عرض التفاصيل' : 'View Details',
    fullDetails: isAr ? 'البيانات الكاملة للمصنع' : 'Complete Factory Details',
    ownerPhone: isAr ? 'هاتف المالك' : 'Owner Phone',
    ownerEmail: isAr ? 'بريد المالك' : 'Owner Email',
    taxNumber: isAr ? 'الرقم الضريبي' : 'Tax Number',
    registrationNum: isAr ? 'رقم السجل التجاري' : 'Registration Number',
    establishmentYear: isAr ? 'سنة التأسيس' : 'Establishment Year',
    industryType: isAr ? 'نوع الصناعة' : 'Industry Type',
    productionCapacity: isAr ? 'الطاقة الإنتاجية' : 'Production Capacity',
    factorySize: isAr ? 'حجم المصنع' : 'Factory Size',
    numberOfEmployees: isAr ? 'عدد الموظفين' : 'Number of Employees',
    mainProducts: isAr ? 'المنتجات الرئيسية' : 'Main Products',
    descriptionAr: isAr ? 'الوصف (عربي)' : 'Description (Arabic)',
    descriptionEn: isAr ? 'الوصف (إنجليزي)' : 'Description (English)',
    registrationPurpose: isAr ? 'الغرض من التسجيل' : 'Registration Purpose',
    seller: isAr ? 'بائع' : 'Seller',
    buyer: isAr ? 'مشتري' : 'Buyer',
    wasteInfo: isAr ? 'معلومات المخلفات' : 'Waste Information',
    sellInfo: isAr ? 'معلومات البيع' : 'Sell Information',
    buyInfo: isAr ? 'معلومات الشراء' : 'Buy Information',
    wasteTypes: isAr ? 'أنواع المخلفات' : 'Waste Types',
    quantity: isAr ? 'الكمية' : 'Quantity',
    frequency: isAr ? 'التكرار' : 'Frequency',
    description: isAr ? 'الوصف' : 'Description',
    fax: isAr ? 'الفاكس' : 'Fax',
    website: isAr ? 'الموقع الإلكتروني' : 'Website',
    accountInfo: isAr ? 'معلومات الحساب' : 'Account Information',
    userEmail: isAr ? 'بريد المستخدم' : 'User Email',
    userPassword: isAr ? 'كلمة المرور' : 'Password',
    rating: isAr ? 'التقييم' : 'Rating',
    totalReviews: isAr ? 'إجمالي التقييمات' : 'Total Reviews',
    createdAt: isAr ? 'تاريخ التسجيل' : 'Created At',
    noData: isAr ? 'بدون بيانات' : 'No Data',
    close: isAr ? 'إغلاق' : 'Close',
  }), [isAr]);

  const unreadCount = notifications.reduce((sum, n) => sum + (n.count || 0), 0);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');

      const [verifyRes, notifRes] = await Promise.all([
        adminVerificationAPI.getRequests(),
        adminVerificationAPI.getNotifications(),
      ]);

      setVerificationRows(verifyRes?.data?.data || []);
      setNotifications(notifRes?.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 15000);
    return () => clearInterval(id);
  }, []);

  const approveFactory = async (factoryId) => {
    const key = `vf-${factoryId}`;
    try {
      setBusyKey(key);
      setError('');
      setSuccess('');
      const res = await adminVerificationAPI.approveFactory(factoryId);
      setSuccess(res?.data?.message || 'Approved successfully');
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to approve factory');
    } finally {
      setBusyKey('');
    }
  };

  const rejectFactory = async (factoryId) => {
    const key = `vr-${factoryId}`;
    try {
      setBusyKey(key);
      setError('');
      setSuccess('');
      const reason = (rejectReason[`factory-${factoryId}`] || '').trim();
      const res = await adminVerificationAPI.rejectFactory(factoryId, reason);
      setSuccess(res?.data?.message || 'Rejected successfully');
      await loadAll();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to reject factory');
    } finally {
      setBusyKey('');
    }
  };

  const panelStyle = {
    border: '1px solid #dbe4ef',
    borderRadius: 14,
    padding: '1rem',
    background: dark ? '#0f172a' : '#ffffff',
  };

  const buttonBase = {
    borderRadius: 9,
    padding: '0.48rem 0.85rem',
    cursor: 'pointer',
    border: '1px solid transparent',
    fontWeight: 700,
  };

  // دالة للحصول على صورة اللوجو
  const getLogoUrl = (logoPath) => {
    if (!logoPath || logoPath.trim() === '') return null;
    if (logoPath.startsWith('data:')) return logoPath;
    if (logoPath.startsWith('/')) return `http://localhost:54465${logoPath}`;
    if (logoPath.startsWith('http')) return logoPath;
    return `http://localhost:54465/logos/${logoPath}`;
  };

  // دالة للحصول على الحرف الأول من اسم المصنع
  const getLogoLetter = (factoryName) => {
    return (factoryName || 'M').charAt(0).toUpperCase();
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f0f0f0' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#1f2937' }}>{isAr ? 'لوحة تحكم التحقق' : 'Verification Dashboard'}</h1>
        <button
          onClick={loadAll}
          style={{ ...buttonBase, borderColor: '#e5e7eb', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px' }}
        >
          <RefreshCw size={16} />
          {t.refresh}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 6, color: '#7f1d1d', background: '#fee2e2', border: '1px solid #f87171', fontSize: '14px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 6, color: '#15803d', background: '#dcfce7', border: '1px solid #86efac', fontSize: '14px' }}>
          {success}
        </div>
      )}

      {/* Factory Verification Table */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>{t.verifyTitle}</h2>
        <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#6b7280' }}>{t.verifySub}</p>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : verificationRows.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', background: '#f9fafb', borderRadius: 8 }}>{t.noData}</div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 14px', width: '60px', textAlign: 'center', fontWeight: 600, color: '#374151' }}></th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.factory}</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.owner}</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.email}</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.phone}</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.tax}</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.requestedAt}</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>{t.status}</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {verificationRows.map((r, idx) => (
                  <tr key={r.factoryId} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        margin: '0 auto',
                        background: 'transparent'
                      }}>
                        {getLogoUrl(r.logoUrl) ? (
                          <img src={getLogoUrl(r.logoUrl)} alt={r.factoryName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                          <span style={{ fontWeight: 700, color: '#6b7280', fontSize: '16px' }}>{getLogoLetter(r.factoryName)}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: isAr ? 'right' : 'left', color: '#111827', fontWeight: 500 }}>{r.factoryName}</td>
                    <td style={{ padding: '12px 14px', color: '#374151' }}>{r.ownerName}</td>
                    <td style={{ padding: '12px 14px', color: '#374151' }}>{r.email}</td>
                    <td style={{ padding: '12px 14px', color: '#374151' }}>{r.phone}</td>
                    <td style={{ padding: '12px 14px', color: '#374151' }}>{r.taxNumber}</td>
                    <td style={{ padding: '12px 14px', color: '#6b7280', fontSize: '12px' }}>{new Date(r.requestedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: 4, fontSize: '11px', fontWeight: 500 }}>{r.status}</span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedFactory(r)}
                        style={{ ...buttonBase, borderColor: '#4f46e5', color: '#4f46e5', background: '#eef2ff', marginLeft: '4px', width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        title={t.viewDetails}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        disabled={busyKey === `vf-${r.factoryId}`}
                        onClick={() => approveFactory(r.factoryId)}
                        style={{ ...buttonBase, borderColor: '#10b981', color: '#10b981', background: '#ecfdf5', marginLeft: '4px', width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        title={t.approve}
                      >
                        <CheckCircle2 size={14} />
                      </button>
                      <button
                        disabled={busyKey === `vr-${r.factoryId}`}
                        onClick={() => {
                          const reason = prompt(t.reasonPH);
                          if (reason !== null) {
                            setRejectReason((prev) => ({ ...prev, [`factory-${r.factoryId}`]: reason }));
                            rejectFactory(r.factoryId);
                              }
                            }}
                            style={{ ...buttonBase, borderColor: '#ef4444', color: '#ef4444', background: '#fef2f2', marginLeft: '4px', width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title={t.reject}
                          >
                            <XCircle size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        )}
      </section>

      {/* Factory Details Modal */}
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
          padding: '20px'
        }}>
          <div style={{
            background: dark ? '#1f2937' : '#fff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            direction: isAr ? 'rtl' : 'ltr'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${dark ? '#374151' : '#e5e7eb'}`
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: dark ? '#f3f4f6' : '#111827',
                margin: 0
              }}>
                البيانات الكاملة للمصنع
              </h2>
              <button
                onClick={() => setSelectedFactory(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: dark ? '#9ca3af' : '#6b7280',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Factory Logo & Basic Info */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '24px',
              padding: '16px',
              background: dark ? '#111827' : '#f9fafb',
              borderRadius: '8px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                minWidth: '80px',
                borderRadius: '8px',
                background: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '2px solid #d1d5db'
              }}>
                {selectedFactory.logoUrl ? (
                  <img src={getLogoUrl(selectedFactory.logoUrl)} alt={selectedFactory.factoryName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontWeight: '700', color: '#6b7280', fontSize: '24px' }}>{getLogoLetter(selectedFactory.factoryName)}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: dark ? '#f3f4f6' : '#111827' }}>
                  {selectedFactory.factoryName}
                </h3>
                {selectedFactory.status && (
                  <span style={{
                    display: 'inline-block',
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {selectedFactory.status}
                  </span>
                )}
                <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: dark ? '#d1d5db' : '#6b7280' }}>
                  وقت الطلب: {new Date(selectedFactory.requestedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Details Sections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Basic Information */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: dark ? '#d1d5db' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  المعلومات الأساسية
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <DetailField label="المصنع" value={selectedFactory.factoryName} dark={dark} />
                  <DetailField label="المالك" value={selectedFactory.ownerName} dark={dark} />
                  <DetailField label="النشاط" value={selectedFactory.industryType} dark={dark} />
                  <DetailField label="الموقع" value={selectedFactory.location} dark={dark} />
                  <DetailField label="العنوان" value={selectedFactory.address} dark={dark} />
                  <DetailField label="البريد" value={selectedFactory.email} dark={dark} />
                </div>
              </div>

              {/* Contact & Legal */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: dark ? '#d1d5db' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  الاتصال والقانون
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <DetailField label="الهاتف" value={selectedFactory.phone} dark={dark} />
                  <DetailField label="هاتف المالك" value={selectedFactory.ownerPhone} dark={dark} />
                  <DetailField label="الرقم الضريبي" value={selectedFactory.taxNumber} dark={dark} />
                  <DetailField label="رقم السجل التجاري" value={selectedFactory.registrationNumber} dark={dark} />
                  <DetailField label="سنة التأسيس" value={selectedFactory.establishmentYear} dark={dark} />
                </div>
              </div>

              {/* Production Info */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: dark ? '#d1d5db' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  الإنتاج
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <DetailField label="الطاقة الإنتاجية" value={selectedFactory.productionCapacity || '-'} dark={dark} />
                  <DetailField label="المنتجات الرئيسية" value={selectedFactory.mainProducts || '-'} dark={dark} />
                </div>
              </div>

              {/* Waste Types */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: dark ? '#d1d5db' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  الغرض من التسجيل
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedFactory.registrationPurpose && Array.isArray(selectedFactory.registrationPurpose) ? (
                    selectedFactory.registrationPurpose.map((purpose, idx) => (
                      <span key={idx} style={{
                        display: 'inline-block',
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {purpose === 'sell' || purpose === 'seller' ? 'بائع' : purpose === 'buy' || purpose === 'buyer' ? 'مشتري' : purpose}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: dark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>-</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sell Waste Info */}
            {selectedFactory.wastesForSale && selectedFactory.wastesForSale.length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${dark ? '#374151' : '#e5e7eb'}` }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: dark ? '#d1d5db' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  معلومات البيع
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <DetailField label="أنواع المخلفات" value={selectedFactory.wastesForSale?.map(w => w.wasteType || w)?.join(', ') || '-'} dark={dark} />
                  </div>
                </div>
              </div>
            )}

            {/* Buy Waste Info */}
            {selectedFactory.purchaseRequests && selectedFactory.purchaseRequests.length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${dark ? '#374151' : '#e5e7eb'}` }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: dark ? '#d1d5db' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  معلومات الشراء
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <DetailField label="أنواع المخلفات" value={selectedFactory.purchaseRequests?.map(w => w.wasteType || w)?.join(', ') || '-'} dark={dark} />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Contact Information */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${dark ? '#374151' : '#e5e7eb'}` }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: dark ? '#d1d5db' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                منتجات المصنع والتفاصيل
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <DetailField label="المنتجات الرئيسية" value={selectedFactory.mainProducts || '-'} dark={dark} />
                <DetailField label="الطاقة الإنتاجية" value={selectedFactory.productionCapacity ? `${selectedFactory.productionCapacity} ${selectedFactory.productionUnit || 'ton'}` : '-'} dark={dark} />
              </div>
            </div>

            {/* Account Information */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${dark ? '#374151' : '#e5e7eb'}` }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: dark ? '#d1d5db' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                معلومات الحساب
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <DetailField label="بريد المستخدم" value={selectedFactory.userEmail || '-'} dark={dark} />
                  <DetailField label="كلمة المرور" value={selectedFactory.userPassword || '-'} dark={dark} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <DetailField label="تاريخ التسجيل" value={selectedFactory.createdAt ? new Date(selectedFactory.createdAt).toLocaleString('ar-EG') : '-'} dark={dark} />
                  <DetailField label="الحالة" value={selectedFactory.status || '-'} dark={dark} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVerification;
