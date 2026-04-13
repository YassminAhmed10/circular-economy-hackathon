import { useMemo } from 'react';
import { TrendingUp, Users, Factory, Zap, Award, Activity, ArrowUp, ArrowDown } from 'lucide-react';

function DashboardHome({ user, lang = 'ar', dark = false }) {
  const isAr = lang !== 'en';

  const t = useMemo(() => ({
    analytics: isAr ? 'لوحة التحليلات' : 'Analytics Dashboard',
    systemOverview: isAr ? 'نظرة عامة على النظام' : 'System Overview',
    totalOrders: isAr ? 'إجمالي الطلبات' : 'Total Orders',
    activeFactories: isAr ? 'المصانع النشطة' : 'Active Factories',
    recyclers: isAr ? 'المعالجات' : 'Recyclers',
    wasteTreated: isAr ? 'النفايات المعالجة' : 'Waste Treated (tons)',
    reportsTitle: isAr ? 'تقارير الأداء' : 'Performance Reports',
    lastMonth: isAr ? 'آخر شهر' : 'Last Month',
    thisMonth: isAr ? 'هذا الشهر' : 'This Month',
    topFactories: isAr ? 'أفضل المصانع' : 'Top Factories',
    recentActivity: isAr ? 'النشاط الأخير' : 'Recent Activity',
    efficiency: isAr ? 'الكفاءة' : 'Efficiency',
    growth: isAr ? 'النمو' : 'Growth',
  }), [isAr]);

  // Mock data for dashboard
  const stats = [
    {
      label: t.totalOrders,
      value: '2,847',
      change: '+23.5%',
      icon: Activity,
      color: '#3b82f6',
      bgColor: '#3b82f610',
      positive: true,
    },
    {
      label: t.activeFactories,
      value: '156',
      change: '+12.3%',
      icon: Factory,
      color: '#10b981',
      bgColor: '#10b98110',
      positive: true,
    },
    {
      label: t.recyclers,
      value: '324',
      change: '+8.2%',
      icon: Users,
      color: '#8b5cf6',
      bgColor: '#8b5cf610',
      positive: true,
    },
    {
      label: t.wasteTreated,
      value: '1,523',
      change: '-5.1%',
      icon: Zap,
      color: '#f59e0b',
      bgColor: '#f59e0b10',
      positive: false,
    },
  ];

  const topFactories = [
    {
      name: isAr ? 'مصنع الأمل' : 'Hope Factory',
      ordersCount: 234,
      efficiency: '92%',
      avatar: '🏭',
    },
    {
      name: isAr ? 'مصنع المستقبل' : 'Future Factory',
      ordersCount: 198,
      efficiency: '88%',
      avatar: '🏭',
    },
    {
      name: isAr ? 'مصنع الخضراء' : 'Green Factory',
      ordersCount: 156,
      efficiency: '85%',
      avatar: '🏭',
    },
  ];

  const recentActivities = [
    {
      type: isAr ? 'طلب جديد' : 'New Order',
      description: isAr ? 'تم استقبال طلب من مصنع الأمل' : 'Order received from Hope Factory',
      time: isAr ? 'قبل 5 دقائق' : '5 min ago',
      icon: '📦',
      color: '#3b82f6',
    },
    {
      type: isAr ? 'تحقق مكتمل' : 'Verification Complete',
      description: isAr ? 'تم التحقق من شهادة المصنع' : 'Factory certification verified',
      time: isAr ? 'قبل ساعة' : '1 hour ago',
      icon: '✅',
      color: '#10b981',
    },
    {
      type: isAr ? 'نفايات معالجة' : 'Waste Processed',
      description: isAr ? '250 طن من النفايات تمت معالجتها' : '250 tons waste processed',
      time: isAr ? 'قبل ساعتين' : '2 hours ago',
      icon: '♻️',
      color: '#8b5cf6',
    },
  ];

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        background: dark
          ? 'linear-gradient(135deg, #0a0f0b 0%, #1a2e1f 100%)'
          : 'linear-gradient(135deg, #f0f7f4 0%, #e0f7f0 100%)',
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: dark ? '#e0fff0' : '#059669',
          }}
        >
          {t.analytics}
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(16, 185, 129, 0.7)',
            margin: 0,
          }}
        >
          {t.systemOverview}
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                background: dark
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                border: `2px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
                boxShadow: dark
                  ? '0 8px 24px rgba(0,0,0,0.2)'
                  : '0 8px 24px rgba(16, 185, 129, 0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = dark
                  ? '0 12px 32px rgba(0,0,0,0.3)'
                  : '0 12px 32px rgba(16, 185, 129, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = dark
                  ? '0 8px 24px rgba(0,0,0,0.2)'
                  : '0 8px 24px rgba(16, 185, 129, 0.08)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    background: stat.bgColor,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  <Icon size={26} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: stat.positive ? '#10b981' : '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                  }}
                >
                  {stat.positive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span>{stat.change}</span>
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: dark
                    ? 'rgba(255,255,255,0.6)'
                    : 'rgba(16, 185, 129, 0.6)',
                  margin: '0 0 8px 0',
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: 0,
                  color: stat.color,
                }}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts and Reports Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* Top Factories */}
        <div
          style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            border: `2px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            boxShadow: dark
              ? '0 8px 24px rgba(0,0,0,0.2)'
              : '0 8px 24px rgba(16, 185, 129, 0.08)',
          }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              color: dark ? '#e0fff0' : '#059669',
            }}
          >
            {t.topFactories}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topFactories.map((factory, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingBottom: idx !== topFactories.length - 1 ? '16px' : '0',
                  borderBottom:
                    idx !== topFactories.length - 1
                      ? `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)'}`
                      : 'none',
                }}
              >
                <div
                  style={{
                    width: '45px',
                    height: '45px',
                    background: dark
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  {factory.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: dark ? '#e0e0e0' : '#1f2937',
                    }}
                  >
                    {factory.name}
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '0.8rem',
                      color: dark
                        ? 'rgba(255,255,255,0.5)'
                        : 'rgba(31, 41, 55, 0.6)',
                    }}
                  >
                    {isAr ? `${factory.ordersCount} طلب` : `${factory.ordersCount} Orders`}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#10b981',
                  }}
                >
                  {factory.efficiency}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            border: `2px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            boxShadow: dark
              ? '0 8px 24px rgba(0,0,0,0.2)'
              : '0 8px 24px rgba(16, 185, 129, 0.08)',
          }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              color: dark ? '#e0fff0' : '#059669',
            }}
          >
            {t.recentActivity}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentActivities.map((activity, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  paddingBottom: idx !== recentActivities.length - 1 ? '16px' : '0',
                  borderBottom:
                    idx !== recentActivities.length - 1
                      ? `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)'}`
                      : 'none',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                >
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: dark ? '#e0e0e0' : '#1f2937',
                    }}
                  >
                    {activity.type}
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '0.8rem',
                      color: dark
                        ? 'rgba(255,255,255,0.5)'
                        : 'rgba(31, 41, 55, 0.6)',
                    }}
                  >
                    {activity.description}
                  </p>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: dark
                      ? 'rgba(255,255,255,0.4)'
                      : 'rgba(31, 41, 55, 0.5)',
                    flexShrink: 0,
                    textAlign: isAr ? 'left' : 'right',
                  }}
                >
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        <div
          style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            border: `2px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            boxShadow: dark
              ? '0 8px 24px rgba(0,0,0,0.2)'
              : '0 8px 24px rgba(16, 185, 129, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <Award size={20} style={{ color: '#f59e0b' }} />
            <p
              style={{
                margin: 0,
                fontSize: '0.9rem',
                color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(31, 41, 55, 0.6)',
              }}
            >
              {t.efficiency}
            </p>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: '78%',
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                borderRadius: '3px',
              }}
            />
          </div>
          <p
            style={{
              margin: '12px 0 0 0',
              fontSize: '0.85rem',
              color: '#f59e0b',
              fontWeight: '600',
            }}
          >
            78% {isAr ? 'معدل الكفاءة' : 'Efficiency Rate'}
          </p>
        </div>

        <div
          style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            border: `2px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            boxShadow: dark
              ? '0 8px 24px rgba(0,0,0,0.2)'
              : '0 8px 24px rgba(16, 185, 129, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <TrendingUp size={20} style={{ color: '#10b981' }} />
            <p
              style={{
                margin: 0,
                fontSize: '0.9rem',
                color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(31, 41, 55, 0.6)',
              }}
            >
              {t.growth}
            </p>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: '92%',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                borderRadius: '3px',
              }}
            />
          </div>
          <p
            style={{
              margin: '12px 0 0 0',
              fontSize: '0.85rem',
              color: '#10b981',
              fontWeight: '600',
            }}
          >
            +92% {isAr ? 'معدل النمو' : 'Growth Rate'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
