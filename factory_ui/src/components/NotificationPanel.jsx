import React from 'react';
import './NotificationPanel.css';

const NotificationPanel = ({ notifications, lang, onClose }) => {
  const t = {
    title: { ar: 'الإشعارات', en: 'Notifications' },
    markAll: { ar: 'تحديد الكل كمقروء', en: 'Mark all as read' },
    empty: { ar: 'لا توجد إشعارات', en: 'No notifications' },
  };

  // في التطبيق الحقيقي، يمكنك إضافة وظيفة لتحديد الكل كمقروء
  const handleMarkAll = () => {
    console.log('Mark all as read');
    // هنا يمكنك استدعاء دالة من parent لتحديث الحالة
  };

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h3>{t.title[lang]}</h3>
        <button className="mark-all-btn" onClick={handleMarkAll}>
          {t.markAll[lang]}
        </button>
      </div>
      <ul className="notification-list">
        {notifications.length === 0 ? (
          <li className="empty">{t.empty[lang]}</li>
        ) : (
          notifications.map((n) => (
            <li key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
              <div className="notif-text">{lang === 'ar' ? n.textAr : n.textEn}</div>
              <span className="notif-time">{n.time}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationPanel;