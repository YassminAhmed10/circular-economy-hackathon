import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VerificationBanner({ user, lang, dark, showVerifiedSuccess = false, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const status = (user?.status || '').toLowerCase();
  const isUnderReview = status === 'pending' || status === 'verificationrequested';

  if (!user || !isVisible || (!showVerifiedSuccess && !isUnderReview)) return null;

  const ar = lang === 'ar';
  const bg = showVerifiedSuccess
    ? (dark ? '#0f2a1a' : '#dcfce7')
    : (dark ? '#1f2a1f' : '#fef9c3');
  const text = showVerifiedSuccess
    ? (dark ? '#86efac' : '#166534')
    : (dark ? '#fbbf24' : '#854d0e');
  const border = showVerifiedSuccess
    ? (dark ? '#16a34a' : '#86efac')
    : (dark ? '#b45309' : '#fde047');

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div
      style={{
        background: bg,
        color: text,
        borderBottom: `1px solid ${border}`,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        direction: ar ? 'rtl' : 'ltr',
        fontSize: '14px',
        fontWeight: 600,
        position: 'relative',
        zIndex: 50,
        boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {showVerifiedSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        <span>
          {showVerifiedSuccess
            ? (ar
              ? '\u062a\u0645\u062a \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u062d\u0633\u0627\u0628\u0643\u060c \u0648\u0623\u0635\u0628\u062d \u0645\u0635\u0646\u0639\u0643 \u0645\u0648\u062b\u0642\u064b\u0627.'
              : 'Your account has been approved and your factory is now verified.')
            : (ar
              ? '\u062d\u0633\u0627\u0628\u0643 \u0642\u064a\u062f \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629. \u0633\u064a\u062a\u0645 \u0625\u0634\u0639\u0627\u0631\u0643 \u0639\u0646\u062f \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629.'
              : 'Your account is under review. You will be notified upon approval.')}
        </span>
      </div>
      <button
        onClick={handleClose}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: text,
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
}
