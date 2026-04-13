import React, { useState, useEffect } from 'react';
import { Bell, Trash2, Check, X, Package, Clipboard, CheckCircle, Gift, XCircle, Truck, AlertTriangle, DollarSign } from 'lucide-react';

export default function Notifications({ user, lang }) {
  const [notifications, setNotifications] = useState([]);
  const ar = lang === 'ar';

  useEffect(() => {
    // جلب الإشعارات
    const allNotifications = [
      {
        id: 1,
        type: 'order_received',
        title: ar ? 'طلب شراء جديد' : 'New Purchase Order',
        message: ar ? 'المصنع الأزهر طلب شراء البلاستيك المعاد تدويره - 500 كجم' : 'Al-Azhar Factory ordered recycled plastic - 500 kg',
        time: ar ? 'قبل 5 دقائق' : '5 minutes ago',
        read: false,
        timestamp: Date.now() - 5 * 60000
      },
      {
        id: 2,
        type: 'admin_notification',
        title: ar ? 'إرسال ملخص الطلب' : 'Order Summary Sent',
        message: ar ? 'تم إرسال ملخص الطلب #12345 للإدارة بنجاح' : 'Order summary #12345 sent to admin successfully',
        time: ar ? 'قبل 15 دقيقة' : '15 minutes ago',
        read: false,
        timestamp: Date.now() - 15 * 60000
      },
      {
        id: 3,
        type: 'payment_completed',
        title: ar ? 'تم الدفع' : 'Payment Completed',
        message: ar ? 'تم استقبال دفعة 500 ريال للطلب #12345' : 'Received 500 SAR payment for order #12345',
        time: ar ? 'قبل 30 دقيقة' : '30 minutes ago',
        read: true,
        timestamp: Date.now() - 30 * 60000
      },
      {
        id: 4,
        type: 'order_confirmed',
        title: ar ? 'تأكيد الطلب' : 'Order Confirmed',
        message: ar ? 'تم تأكيد الطلب #12344 من مصنع النيل' : 'Order #12344 confirmed from Al-Nile Factory',
        time: ar ? 'قبل ساعة' : '1 hour ago',
        read: true,
        timestamp: Date.now() - 60 * 60000
      },
      {
        id: 5,
        type: 'order_rejected',
        title: ar ? 'رفض الطلب' : 'Order Rejected',
        message: ar ? 'تم رفض طلبك للمنتج - عدم توفر المنتج حالياً' : 'Your order was rejected - product currently unavailable',
        time: ar ? 'قبل ساعتين' : '2 hours ago',
        read: true,
        timestamp: Date.now() - 120 * 60000
      },
      {
        id: 6,
        type: 'order_delivered',
        title: ar ? 'تم التسليم' : 'Order Delivered',
        message: ar ? 'تم استلام الطلب #12343 من مصنع الصفا' : 'Order #12343 received from Al-Safa Factory',
        time: ar ? 'قبل 3 ساعات' : '3 hours ago',
        read: true,
        timestamp: Date.now() - 180 * 60000
      },
      {
        id: 7,
        type: 'order_cancelled',
        title: ar ? 'إلغاء الطلب' : 'Order Cancelled',
        message: ar ? 'تم إلغاء الطلب #12342 بناءً على طلبك' : 'Order #12342 cancelled as requested',
        time: ar ? 'قبل 4 ساعات' : '4 hours ago',
        read: true,
        timestamp: Date.now() - 240 * 60000
      },
      {
        id: 8,
        type: 'price_update',
        title: ar ? 'تحديث السعر' : 'Price Update',
        message: ar ? 'تم تحديث سعر البلاستيك المعاد تدويره إلى 15 ريال/كجم' : 'Recycled plastic price updated to 15 SAR/kg',
        time: ar ? 'أمس' : 'Yesterday',
        read: true,
        timestamp: Date.now() - 24 * 60000
      }
    ];
    
    setNotifications(allNotifications);
  }, [ar]);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    const iconProps = { size: 20 };
    switch(type) {
      case 'order_received': return <Package {...iconProps} color="#059669" />;
      case 'admin_notification': return <Clipboard {...iconProps} color="#3b82f6" />;
      case 'payment_completed': return <CheckCircle {...iconProps} color="#10b981" />;
      case 'order_confirmed': return <Gift {...iconProps} color="#f59e0b" />;
      case 'order_rejected': return <XCircle {...iconProps} color="#ef4444" />;
      case 'order_delivered': return <Truck {...iconProps} color="#06b6d4" />;
      case 'order_cancelled': return <AlertTriangle {...iconProps} color="#a16207" />;
      case 'price_update': return <DollarSign {...iconProps} color="#8b5cf6" />;
      default: return <Package {...iconProps} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <Bell size={28} color="#059669" />
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
          {ar ? 'الإشعارات' : 'Notifications'}
        </h1>
        {unreadCount > 0 && (
          <span style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600
          }}>
            {unreadCount} {ar ? 'جديدة' : 'new'}
          </span>
        )}
      </div>

      {notifications.length > 0 ? (
        <div>
          {notifications.map(notif => (
            <div key={notif.id} style={{
              backgroundColor: notif.read ? '#ffffff' : '#f0fdf4',
              border: notif.read ? '1px solid #e5e7eb' : '2px solid #059669',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              transition: 'all 0.2s',
              cursor: 'pointer',
              ':hover': {
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)'
              }
            }}>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: '40px', justifyContent: 'center' }}>
                {getNotificationIcon(notif.type)}
              </div>

              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>{notif.title}</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px', lineHeight: '1.5' }}>
                  {notif.message}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>{notif.time}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {!notif.read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '6px',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={ar ? 'تحديد كمقروء' : 'Mark as read'}
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notif.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '6px',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={ar ? 'حذف' : 'Delete'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#9ca3af'
        }}>
          <Bell size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ fontSize: '16px', fontWeight: 500 }}>
            {ar ? 'لا توجد إشعارات' : 'No notifications'}
          </p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            {ar ? 'ستظهر الإشعارات هنا عند وصول طلبات جديدة' : 'New notifications will appear here'}
          </p>
        </div>
      )}
    </div>
  );
}
