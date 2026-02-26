import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Clock, XCircle, Package, DollarSign, Calendar, Truck } from 'lucide-react';
import './Orders.css';

function Orders() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const statusFilter = searchParams.get('status');

  const statusMap = {
    completed: 'مكتمل',
    pending: 'معلق',
    cancelled: 'ملغى',
    delivered: 'قيد التوصيل'
  };

  const [orders] = useState([
    {
      id: 'ORD-001',
      wasteType: 'بلاستيك',
      amount: '2.5 طن',
      price: '1500',
      buyer: 'مصنع إعادة التدوير المتقدم',
      date: '2024-01-15',
      status: 'مكتمل',
      deliveryDate: '2024-01-20'
    },
    {
      id: 'ORD-002',
      wasteType: 'ورق',
      amount: '800 كجم',
      price: '800',
      buyer: 'شركة الأوراق الخضراء',
      date: '2024-01-10',
      status: 'قيد التوصيل',
      deliveryDate: '2024-01-25'
    },
    {
      id: 'ORD-003',
      wasteType: 'معادن',
      amount: '5 طن',
      price: '3500',
      buyer: 'مصنع المعادن الجديد',
      date: '2023-12-20',
      status: 'ملغى',
      deliveryDate: '-'
    },
    {
      id: 'ORD-004',
      wasteType: 'زجاج',
      amount: '1.2 طن',
      price: '1200',
      buyer: 'مصنع الزجاج الحديث',
      date: '2024-01-05',
      status: 'معلق',
      deliveryDate: '-'
    }
  ]);

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    const arabicStatus = statusMap[statusFilter];
    if (!arabicStatus) return orders;
    return orders.filter(order => order.status === arabicStatus);
  }, [orders, statusFilter]);

  const pageTitle = statusFilter === 'completed' ? 'الطلبات المكتملة' : 'الطلبات والمبيعات';

  const getStatusColor = (status) => {
    switch(status) {
      case 'مكتمل': return 'completed';
      case 'قيد التوصيل': return 'delivered';
      case 'معلق': return 'pending';
      case 'ملغى': return 'cancelled';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'مكتمل': return <CheckCircle className="w-4 h-4" />;
      case 'قيد التوصيل': return <Truck className="w-4 h-4" />;
      case 'معلق': return <Clock className="w-4 h-4" />;
      case 'ملغى': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const setFilter = (filter) => {
    if (filter) {
      navigate(`/orders?status=${filter}`);
    } else {
      navigate('/orders');
    }
  };

  return (
    <div className="orders-container" dir="rtl">
      <div className="orders-header">
        <h1>{pageTitle}</h1>
        <p>إدارة وتتبع جميع طلبات النفايات الصناعية</p>
      </div>

      <div className="filter-buttons">
        <button
          onClick={() => setFilter(null)}
          className={`filter-btn ${!statusFilter ? 'active' : ''}`}
        >
          الكل
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
        >
          المكتملة
        </button>
        <button
          onClick={() => setFilter('delivered')}
          className={`filter-btn ${statusFilter === 'delivered' ? 'active' : ''}`}
        >
          قيد التوصيل
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
        >
          المعلقة
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
        >
          الملغاة
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>إجمالي الطلبات</p>
              <div className="stat-number">{filteredOrders.length}</div>
            </div>
            <div className="stat-icon">
              <ShoppingBag />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>مكتملة</p>
              <div className="stat-number emerald">
                {orders.filter(o => o.status === 'مكتمل').length}
              </div>
            </div>
            <div className="stat-icon">
              <CheckCircle />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>إجمالي الإيرادات</p>
              <div className="stat-number blue">
                {filteredOrders.reduce((sum, order) => {
                  if (order.status !== 'ملغى') {
                    const price = parseInt(order.price);
                    return sum + (isNaN(price) ? 0 : price);
                  }
                  return sum;
                }, 0)} جنيه
              </div>
            </div>
            <div className="stat-icon blue">
              <DollarSign />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>قيد التوصيل</p>
              <div className="stat-number amber">
                {orders.filter(o => o.status === 'قيد التوصيل').length}
              </div>
            </div>
            <div className="stat-icon amber">
              <Truck />
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>نوع النفايات</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>المشتري</th>
              <th>التاريخ</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium">{order.id}</td>
                <td>
                  <div className="product-cell">
                    <Package />
                    <span>{order.wasteType}</span>
                  </div>
                </td>
                <td>{order.amount}</td>
                <td>
                  <div className="product-cell">
                    <DollarSign />
                    <span>{order.price} جنيه</span>
                  </div>
                </td>
                <td>{order.buyer}</td>
                <td>
                  <div className="product-cell">
                    <Calendar />
                    <span>{order.date}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="no-orders">
                  <div className="empty-state-content">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 8 L16 16 M16 8 L8 16" />
                    </svg>
                    <p>لا توجد طلبات ملغاه</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;