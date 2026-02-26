// Orders.jsx — ECOv Premium Redesign 2026
// Aesthetic: Clean Depth × Warm Olive — Playfair Display numbers

import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, CheckCircle, Clock, XCircle,
  Package, DollarSign, Calendar, Truck,
  Building2, Tag, LayoutList
} from 'lucide-react';
import './Orders.css';

// ─── Waste type accent colors ─────────────────────
const TYPE_CFG = {
  'بلاستيك': { color:'#2563eb', bg:'rgba(37,99,235,0.1)' },
  'ورق':     { color:'#be185d', bg:'rgba(190,24,93,0.1)' },
  'معادن':   { color:'#b8620a', bg:'rgba(184,98,10,0.1)' },
  'زجاج':    { color:'#5b2fa0', bg:'rgba(91,47,160,0.1)' },
  'خشب':     { color:'#3a7d20', bg:'rgba(58,125,32,0.1)' },
}

// ─── Status config ────────────────────────────────
const STATUS_CFG = {
  'مكتمل':       { cls:'completed', Icon:CheckCircle },
  'قيد التوصيل': { cls:'delivered', Icon:Truck       },
  'معلق':        { cls:'pending',   Icon:Clock        },
  'ملغى':        { cls:'cancelled', Icon:XCircle      },
}

function Orders() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const statusFilter = searchParams.get('status');

  const statusMap = {
    completed: 'مكتمل',
    pending:   'معلق',
    cancelled: 'ملغى',
    delivered: 'قيد التوصيل',
  };

  const [orders] = useState([
    { id:'ORD-001', wasteType:'بلاستيك', amount:'2.5 طن',  price:'1500', buyer:'مصنع إعادة التدوير المتقدم', date:'2024-01-15', status:'مكتمل',       deliveryDate:'2024-01-20' },
    { id:'ORD-002', wasteType:'ورق',     amount:'800 كجم', price:'800',  buyer:'شركة الأوراق الخضراء',       date:'2024-01-10', status:'قيد التوصيل', deliveryDate:'2024-01-25' },
    { id:'ORD-003', wasteType:'معادن',   amount:'5 طن',    price:'3500', buyer:'مصنع المعادن الجديد',         date:'2023-12-20', status:'ملغى',         deliveryDate:'-'          },
    { id:'ORD-004', wasteType:'زجاج',    amount:'1.2 طن',  price:'1200', buyer:'مصنع الزجاج الحديث',          date:'2024-01-05', status:'معلق',         deliveryDate:'-'          },
    { id:'ORD-005', wasteType:'خشب',     amount:'3 طن',    price:'2100', buyer:'شركة الأخشاب المتحدة',        date:'2024-01-18', status:'مكتمل',        deliveryDate:'2024-01-22' },
  ]);

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    const ar = statusMap[statusFilter];
    return ar ? orders.filter(o => o.status === ar) : orders;
  }, [orders, statusFilter]);

  const setFilter = (f) => f ? navigate(`/orders?status=${f}`) : navigate('/orders');

  const totalRevenue = filteredOrders.reduce((s, o) => {
    if (o.status !== 'ملغى') {
      const p = parseInt(o.price);
      return s + (isNaN(p) ? 0 : p);
    }
    return s;
  }, 0);

  const pageTitle = statusFilter === 'completed' ? 'الطلبات المكتملة' : 'الطلبات والمبيعات';

  const FILTERS = [
    { key: null,        label: 'الكل' },
    { key: 'completed', label: 'المكتملة' },
    { key: 'delivered', label: 'قيد التوصيل' },
    { key: 'pending',   label: 'المعلقة' },
    { key: 'cancelled', label: 'الملغاة' },
  ];

  return (
    <div className="orders-container" dir="rtl">

      {/* ─── Header ─────────────────────────────── */}
      <div className="orders-header">
        <div className="orders-header-inner">
          <div className="orders-header-icon">
            <LayoutList />
          </div>
          <h1>{pageTitle}</h1>
        </div>
        <p>إدارة وتتبع جميع طلبات النفايات الصناعية</p>
      </div>

      {/* ─── Filter Pills ────────────────────────── */}
      <div className="filter-buttons">
        {FILTERS.map(({ key, label }) => (
          <button
            key={label}
            onClick={() => setFilter(key)}
            className={`filter-btn ${statusFilter === key ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── Stats Grid ─────────────────────────── */}
      <div className="stats-grid">
        {[
          {
            label: 'إجمالي الطلبات',
            value: filteredOrders.length,
            cls: '',
            Icon: ShoppingBag,
            icCls: '',
            delay: '0s',
          },
          {
            label: 'مكتملة',
            value: orders.filter(o => o.status === 'مكتمل').length,
            cls: 'emerald',
            Icon: CheckCircle,
            icCls: '',
            delay: '.07s',
          },
          {
            label: 'إجمالي الإيرادات',
            value: <>{totalRevenue.toLocaleString()}<span className="stat-unit">جنيه</span></>,
            cls: 'blue',
            Icon: DollarSign,
            icCls: 'blue',
            delay: '.14s',
          },
          {
            label: 'قيد التوصيل',
            value: orders.filter(o => o.status === 'قيد التوصيل').length,
            cls: 'amber',
            Icon: Truck,
            icCls: 'amber',
            delay: '.21s',
          },
        ].map(({ label, value, cls, Icon, icCls, delay }, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: delay }}>
            <div className="stat-card-content">
              <div className="stat-info">
                <p>{label}</p>
                <div className={`stat-number ${cls}`}>{value}</div>
              </div>
              <div className={`stat-icon ${icCls}`}>
                <Icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Table ──────────────────────────────── */}
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
            {filteredOrders.map((order) => {
              const typeCfg  = TYPE_CFG[order.wasteType] || TYPE_CFG['خشب'];
              const stCfg    = STATUS_CFG[order.status]  || STATUS_CFG['معلق'];
              const StIcon   = stCfg.Icon;

              return (
                <tr key={order.id}>

                  {/* Order ID */}
                  <td>
                    <span className="order-id">{order.id}</span>
                  </td>

                  {/* Waste Type */}
                  <td>
                    <div className="product-cell">
                      <div className="product-icon-wrap"
                        style={{ background: typeCfg.bg, borderColor: `${typeCfg.color}20` }}>
                        <Package style={{ color: typeCfg.color }} />
                      </div>
                      <span style={{ fontWeight:600, color: typeCfg.color }}>{order.wasteType}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td>
                    <span className="amount-val">{order.amount}</span>
                  </td>

                  {/* Price */}
                  <td>
                    <div className="price-val">
                      <DollarSign />
                      {parseInt(order.price).toLocaleString()} جنيه
                    </div>
                  </td>

                  {/* Buyer */}
                  <td>
                    <span className="buyer-name">{order.buyer}</span>
                    <span className="buyer-sub">
                      <Building2 />
                      {order.deliveryDate !== '-' ? `توصيل: ${order.deliveryDate}` : 'لم يُحدد موعد'}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <div className="date-cell">
                      <Calendar />
                      {order.date}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`status-badge ${stCfg.cls}`}>
                      <StIcon />
                      {order.status}
                    </span>
                  </td>

                </tr>
              );
            })}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="no-orders">
                  <div className="empty-state-content">
                    <div className="empty-icon-wrap">
                      <ShoppingBag />
                    </div>
                    <h3>لا توجد طلبات</h3>
                    <p>لا توجد طلبات مطابقة للفلتر المحدد</p>
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