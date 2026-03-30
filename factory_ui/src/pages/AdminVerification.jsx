import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { adminVerificationAPI } from '../services/api';

function AdminVerification({ lang = 'ar', dark = false }) {
  const isAr = lang !== 'en';

  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [verificationRows, setVerificationRows] = useState([]);
  const [listingRows, setListingRows] = useState([]);
  const [rejectReason, setRejectReason] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const t = useMemo(() => ({
    refresh: isAr ? 'تحديث' : 'Refresh',
    noData: isAr ? 'لا توجد طلبات حالياً' : 'No requests currently',
    approve: isAr ? 'موافقة' : 'Approve',
    reject: isAr ? 'رفض' : 'Reject',
    reasonPH: isAr ? 'سبب الرفض (اختياري)' : 'Rejection reason (optional)',

    verifyTitle: isAr ? 'طلبات توثيق المصانع' : 'Factory Verification Requests',
    verifySub: isAr ? 'راجع بيانات المصنع ثم وافق أو ارفض' : 'Review factory details then approve or reject',

    listingTitle: isAr ? 'طلبات نشر الإعلانات في Marketplace' : 'Marketplace Listing Approval Requests',
    listingSub: isAr ? 'الإعلانات الجديدة لا تُنشر إلا بعد موافقة الإدارة' : 'New listings are published only after admin approval',

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

    listingType: isAr ? 'نوع المخلفات' : 'Waste Type',
    listingCategory: isAr ? 'الفئة' : 'Category',
    listingQty: isAr ? 'الكمية' : 'Quantity',
    listingPrice: isAr ? 'السعر' : 'Price',
    listingDesc: isAr ? 'الوصف' : 'Description',
  }), [isAr]);

  const unreadCount = notifications.reduce((sum, n) => sum + (n.count || 0), 0);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');

      const [verifyRes, listingRes, notifRes] = await Promise.all([
        adminVerificationAPI.getRequests(),
        adminVerificationAPI.getListingRequests(),
        adminVerificationAPI.getNotifications(),
      ]);

      setVerificationRows(verifyRes?.data?.data || []);
      setListingRows(listingRes?.data?.data || []);
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

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ padding: '1rem', maxWidth: 1250, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button
          onClick={loadAll}
          style={{ ...buttonBase, borderColor: '#cbd5e1', background: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <RefreshCw size={16} />
          {t.refresh}
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen((v) => !v)}
            style={{ ...buttonBase, borderColor: '#cbd5e1', background: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Bell size={17} />
            {t.notifications}
            <span style={{ background: '#ef4444', color: '#fff', borderRadius: 999, padding: '1px 8px', fontSize: 12 }}>
              {unreadCount}
            </span>
          </button>

          {notificationsOpen && (
            <div style={{ position: 'absolute', top: '110%', right: 0, width: 320, zIndex: 10, ...panelStyle }}>
              {notifications.length === 0 ? (
                <div>{t.noNotifications}</div>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>
                  {notifications.map((n, idx) => (
                    <div key={`${n.type}-${idx}`} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '0.55rem' }}>
                      <div style={{ fontWeight: 700 }}>{n.title}</div>
                      <div style={{ fontSize: 13, opacity: 0.85 }}>{n.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '0.75rem', padding: '0.7rem', borderRadius: 8, color: '#991b1b', background: '#fee2e2', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ marginBottom: '0.75rem', padding: '0.7rem', borderRadius: 8, color: '#065f46', background: '#d1fae5', border: '1px solid #6ee7b7' }}>
          {success}
        </div>
      )}

      <section style={{ ...panelStyle, marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0, marginBottom: 4 }}>{t.verifyTitle}</h2>
        <p style={{ marginTop: 0, opacity: 0.75 }}>{t.verifySub}</p>

        {loading ? (
          <div>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : verificationRows.length === 0 ? (
          <div>{t.noData}</div>
        ) : (
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {verificationRows.map((r) => (
              <div key={r.factoryId} style={{ border: '1px solid #dbe4ef', borderRadius: 12, padding: '0.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '0.4rem' }}>
                  <div><strong>{t.factory}:</strong> {r.factoryName}</div>
                  <div><strong>{t.owner}:</strong> {r.ownerName}</div>
                  <div><strong>{t.industry}:</strong> {r.industryType}</div>
                  <div><strong>{t.location}:</strong> {r.location}</div>
                  <div><strong>{t.address}:</strong> {r.address}</div>
                  <div><strong>{t.email}:</strong> {r.email}</div>
                  <div><strong>{t.phone}:</strong> {r.phone}</div>
                  <div><strong>{t.tax}:</strong> {r.taxNumber}</div>
                  <div><strong>{t.reg}:</strong> {r.registrationNumber}</div>
                  <div><strong>{t.status}:</strong> {r.status}</div>
                  <div><strong>{t.requestedAt}:</strong> {new Date(r.requestedAt).toLocaleString()}</div>
                </div>

                <div style={{ marginTop: '0.65rem', display: 'grid', gap: '0.45rem' }}>
                  <input
                    type="text"
                    value={rejectReason[`factory-${r.factoryId}`] || ''}
                    onChange={(e) => setRejectReason((prev) => ({ ...prev, [`factory-${r.factoryId}`]: e.target.value }))}
                    placeholder={t.reasonPH}
                    style={{ padding: '0.55rem 0.7rem', borderRadius: 8, border: '1px solid #cbd5e1' }}
                  />
                  <div style={{ display: 'flex', gap: 8, justifyContent: isAr ? 'flex-start' : 'flex-end' }}>
                    <button
                      disabled={busyKey === `vr-${r.factoryId}`}
                      onClick={() => rejectFactory(r.factoryId)}
                      style={{ ...buttonBase, borderColor: '#ef4444', color: '#ef4444', background: '#fff', display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <XCircle size={14} />
                      {t.reject}
                    </button>
                    <button
                      disabled={busyKey === `vf-${r.factoryId}`}
                      onClick={() => approveFactory(r.factoryId)}
                      style={{ ...buttonBase, borderColor: '#10b981', color: '#fff', background: '#10b981', display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <CheckCircle2 size={14} />
                      {t.approve}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 4 }}>{t.listingTitle}</h2>
        <p style={{ marginTop: 0, opacity: 0.75 }}>{t.listingSub}</p>

        {loading ? (
          <div>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : listingRows.length === 0 ? (
          <div>{t.noData}</div>
        ) : (
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {listingRows.map((r) => (
              <div key={r.listingId} style={{ border: '1px solid #dbe4ef', borderRadius: 12, padding: '0.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '0.4rem' }}>
                  <div><strong>{t.factory}:</strong> {r.factoryName}</div>
                  <div><strong>{t.listingType}:</strong> {r.type}</div>
                  <div><strong>{t.listingCategory}:</strong> {r.category}</div>
                  <div><strong>{t.listingQty}:</strong> {r.amount} {r.unit}</div>
                  <div><strong>{t.listingPrice}:</strong> {r.price}</div>
                  <div><strong>{t.location}:</strong> {r.location}</div>
                  <div><strong>{t.status}:</strong> {r.status}</div>
                  <div><strong>{t.requestedAt}:</strong> {new Date(r.requestedAt).toLocaleString()}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>{t.listingDesc}:</strong> {r.description || '-'}</div>
                </div>

                <div style={{ marginTop: '0.65rem', display: 'grid', gap: '0.45rem' }}>
                  <input
                    type="text"
                    value={rejectReason[`listing-${r.listingId}`] || ''}
                    onChange={(e) => setRejectReason((prev) => ({ ...prev, [`listing-${r.listingId}`]: e.target.value }))}
                    placeholder={t.reasonPH}
                    style={{ padding: '0.55rem 0.7rem', borderRadius: 8, border: '1px solid #cbd5e1' }}
                  />
                  <div style={{ display: 'flex', gap: 8, justifyContent: isAr ? 'flex-start' : 'flex-end' }}>
                    <button
                      disabled={busyKey === `lr-${r.listingId}`}
                      onClick={() => rejectListing(r.listingId)}
                      style={{ ...buttonBase, borderColor: '#ef4444', color: '#ef4444', background: '#fff', display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <XCircle size={14} />
                      {t.reject}
                    </button>
                    <button
                      disabled={busyKey === `lf-${r.listingId}`}
                      onClick={() => approveListing(r.listingId)}
                      style={{ ...buttonBase, borderColor: '#10b981', color: '#fff', background: '#10b981', display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <CheckCircle2 size={14} />
                      {t.approve}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminVerification;
