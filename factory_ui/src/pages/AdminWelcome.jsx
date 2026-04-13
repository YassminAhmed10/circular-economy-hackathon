import { useEffect, useState, useMemo } from 'react';
import { User, Calendar, Activity, TrendingUp, CheckCircle2 } from 'lucide-react';

function AdminWelcome({ user, lang = 'ar', dark = false }) {
  const isAr = lang !== 'en';
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const t = useMemo(() => ({
    welcome: isAr ? 'أهلاً وسهلاً' : 'Welcome',
    admin: isAr ? 'أيها المسؤول' : 'Admin',
    greeting: isAr ? 'رحبا بك في لوحة التحكم' : 'Welcome back to Admin Dashboard',
    today: isAr ? 'اليوم' : 'Today',
    date: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    stats: isAr ? 'الإحصائيات السريعة' : 'Quick Statistics',
    pending: isAr ? 'قيد الانتظار' : 'Pending',
    completed: isAr ? 'مكتملة' : 'Completed',
    total: isAr ? 'إجمالي' : 'Total',
  }), [isAr]);

  return (
    <div
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      {/* Main Welcome Card */}
      <div
        style={{
          background: dark
            ? 'linear-gradient(135deg, #1a2e1f 0%, #2d3d33 100%)'
            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: dark
            ? '0 10px 30px rgba(0,0,0,0.3)'
            : '0 10px 30px rgba(16, 185, 129, 0.2)',
          backdropFilter: 'blur(10px)',
          textAlign: isAr ? 'right' : 'left',
          color: '#fff',
          animation: 'slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', justifyContent: isAr ? 'flex-end' : 'flex-start' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              order: isAr ? 2 : 1,
            }}
          >
            <User size={32} />
          </div>
          <div style={{ order: isAr ? 1 : 2 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, marginBottom: '8px' }}>
              {t.welcome}, {user?.factoryName || 'مسؤول'}! 👋
            </h1>
            <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.9 }}>
              {t.greeting}
            </p>
          </div>
        </div>

        {/* Date & Time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '20px',
            fontSize: '1rem',
            opacity: 0.85,
            justifyContent: isAr ? 'flex-end' : 'flex-start',
          }}
        >
          <Calendar size={20} />
          <span>{t.today}: {t.date}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: dark ? '#e0e0e0' : '#1f2937',
        }}>
          {t.stats}
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {/* Stat Card 1 */}
          <div
            style={{
              background: dark
                ? 'linear-gradient(135deg, #2d3d33 0%, #1a2e1f 100%)'
                : 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: dark
                ? '0 4px 12px rgba(0,0,0,0.2)'
                : '0 4px 12px rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                background: dark
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <Activity size={24} />
            </div>
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7, marginBottom: '4px' }}>
                {t.pending}
              </p>
              <p style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#10b981',
              }}>
                12
              </p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div
            style={{
              background: dark
                ? 'linear-gradient(135deg, #2d3d33 0%, #1a2e1f 100%)'
                : 'linear-gradient(135deg, #fdf2f8 0%, #dbeafe 100%)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: dark
                ? '0 4px 12px rgba(0,0,0,0.2)'
                : '0 4px 12px rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                background: dark
                  ? 'rgba(34, 197, 94, 0.2)'
                  : 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
              }}
            >
              <CheckCircle2 size={24} />
            </div>
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7, marginBottom: '4px' }}>
                {t.completed}
              </p>
              <p style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#22c55e',
              }}>
                48
              </p>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div
            style={{
              background: dark
                ? 'linear-gradient(135deg, #2d3d33 0%, #1a2e1f 100%)'
                : 'linear-gradient(135deg, #f3e8ff 0%, #dbeafe 100%)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: dark
                ? '0 4px 12px rgba(0,0,0,0.2)'
                : '0 4px 12px rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                background: dark
                  ? 'rgba(168, 85, 247, 0.2)'
                  : 'rgba(168, 85, 247, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a855f7',
              }}
            >
              <TrendingUp size={24} />
            </div>
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7, marginBottom: '4px' }}>
                {t.total}
              </p>
              <p style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#a855f7',
              }}>
                60
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminWelcome;
