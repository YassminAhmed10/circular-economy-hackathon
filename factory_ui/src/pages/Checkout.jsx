// Checkout.jsx — ECOv Premium Redesign 2026
// Full checkout flow: shipping choice → payment → confirm
// Two shipping modes: buyer-arranged OR ECOv-suggested carriers

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Truck, Package, DollarSign,
  CreditCard, Building2, Smartphone, CheckCircle2,
  ChevronLeft, ChevronDown, MapPin, Calendar,
  Shield, Lock, ArrowRight, Leaf, Clock,
  Star, Phone, AlertCircle, Receipt, Home
} from 'lucide-react';
import './Checkout.css';

// ═══════════════════════════════════════════════════
// MOCK — carrier companies ECOv suggests
// ═══════════════════════════════════════════════════
const CARRIERS = [
  {
    id: 'bosta',
    name: 'بوسطة',
    nameEn: 'Bosta',
    color: '#e63946',
    bg: 'rgba(230,57,70,0.1)',
    eta: '1–2 يوم عمل',
    price: 250,
    rating: 4.8,
  },
  {
    id: 'aramex',
    name: 'أرامكس',
    nameEn: 'Aramex',
    color: '#e07b20',
    bg: 'rgba(224,123,32,0.1)',
    eta: '2–3 أيام',
    price: 180,
    rating: 4.6,
  },
  {
    id: 'dhl',
    name: 'DHL',
    nameEn: 'DHL',
    color: '#f5c518',
    bg: 'rgba(245,197,24,0.12)',
    eta: '1 يوم عمل',
    price: 380,
    rating: 4.9,
  },
  {
    id: 'ecov',
    name: 'أسطول ECOv',
    nameEn: 'ECOv Fleet',
    color: '#1a7a3c',
    bg: 'rgba(26,122,60,0.12)',
    eta: '3–5 أيام',
    price: 120,
    rating: 4.7,
  },
  {
    id: 'mylerz',
    name: 'مايلرز',
    nameEn: 'Mylerz',
    color: '#5a2d8a',
    bg: 'rgba(90,45,138,0.1)',
    eta: '2–4 أيام',
    price: 160,
    rating: 4.5,
  },
  {
    id: 'fedex',
    name: 'FedEx',
    nameEn: 'FedEx',
    color: '#1a4a8a',
    bg: 'rgba(26,74,138,0.1)',
    eta: '1–2 يوم',
    price: 320,
    rating: 4.7,
  },
]

// ─── Payment methods ──────────────────────────────
const PAY_METHODS = [
  { id:'card',        label:'بطاقة ائتمان',  Icon:CreditCard,  iconBg:'rgba(26,74,138,0.1)',  iconColor:'#1a4a8a' },
  { id:'bank',        label:'تحويل بنكي',    Icon:Building2,   iconBg:'rgba(26,122,60,0.1)',  iconColor:'#1a7a3c' },
  { id:'installment', label:'تقسيط',         Icon:Calendar,    iconBg:'rgba(199,123,26,0.1)', iconColor:'#c77b1a' },
]

// ─── Steps ────────────────────────────────────────
const STEPS = ['الشحن', 'الدفع', 'التأكيد']

// ══════════════════════════════════════════════════
// STEP 1 — Shipping
// ══════════════════════════════════════════════════
function StepShipping({ form, setForm }) {
  const shipMode    = form.shipMode
  const setShipMode = (v) => setForm(f => ({ ...f, shipMode: v, selectedCarrier: '' }))
  const carrier     = form.selectedCarrier
  const setCarrier  = (v) => setForm(f => ({ ...f, selectedCarrier: v }))

  return (
    <div>
      {/* ── Shipping mode choice ──────────────────── */}
      <div className="ck-ship-options">
        {/* Option A: Buyer arranges shipping */}
        <div
          className={`ck-ship-opt ${shipMode === 'buyer' ? 'selected' : ''}`}
          onClick={() => setShipMode('buyer')}
        >
          <input type="radio" name="shipMode" value="buyer" readOnly checked={shipMode === 'buyer'} />
          <div className="ck-ship-opt-check" />
          <div className="ck-ship-opt-icon" style={{ background:'rgba(26,74,138,0.1)', border:'1px solid rgba(26,74,138,0.15)' }}>
            <Truck style={{ color:'#1a4a8a' }} size={24} />
          </div>
          <div className="ck-ship-opt-title">أنا أرتب الشحن بنفسي</div>
          <div className="ck-ship-opt-desc">
            ستحدد شركة الشحن والتاريخ بنفسك، وتنسق مع البائع مباشرةً.
          </div>
          <span className="ck-ship-opt-badge" style={{ background:'rgba(26,74,138,0.1)', color:'#1a4a8a', border:'1px solid rgba(26,74,138,0.15)' }}>
            <DollarSign size={11} /> مرونة أكبر
          </span>
        </div>

        {/* Option B: ECOv suggests carriers */}
        <div
          className={`ck-ship-opt ${shipMode === 'ecov' ? 'selected' : ''}`}
          onClick={() => setShipMode('ecov')}
        >
          <input type="radio" name="shipMode" value="ecov" readOnly checked={shipMode === 'ecov'} />
          <div className="ck-ship-opt-check" />
          <div className="ck-ship-opt-icon" style={{ background:'rgba(26,122,60,0.1)', border:'1px solid rgba(26,122,60,0.15)' }}>
            <Leaf style={{ color:'#1a7a3c' }} size={24} />
          </div>
          <div className="ck-ship-opt-title">ECOv تختار لي شركة الشحن</div>
          <div className="ck-ship-opt-desc">
            اخترنا لك أفضل شركات الشحن بأسعار تفضيلية. وفّر وقتك واستلم بسرعة.
          </div>
          <span className="ck-ship-opt-badge" style={{ background:'rgba(26,122,60,0.1)', color:'#1a7a3c', border:'1px solid rgba(26,122,60,0.15)' }}>
            <Star size={11} /> الأفضل سعراً
          </span>
        </div>
      </div>

      {/* ── Buyer fills own shipping info ──────────── */}
      {shipMode === 'buyer' && (
        <div className="ck-form-section">
          <div className="ck-form-row">
            <div className="ck-field">
              <label>اسم شركة الشحن <span className="req">*</span></label>
              <input className="ck-input" placeholder="مثال: DHL، Aramex..." value={form.buyerCarrierName}
                onChange={e => setForm(f => ({ ...f, buyerCarrierName: e.target.value }))} />
            </div>
            <div className="ck-field">
              <label>رقم التتبع (اختياري)</label>
              <input className="ck-input" placeholder="سيُضاف عند الاستلام" value={form.trackingNum}
                onChange={e => setForm(f => ({ ...f, trackingNum: e.target.value }))} />
            </div>
          </div>
          <div className="ck-form-row">
            <div className="ck-field">
              <label>تاريخ الاستلام المتوقع <span className="req">*</span></label>
              <input className="ck-input" type="date" value={form.pickupDate}
                onChange={e => setForm(f => ({ ...f, pickupDate: e.target.value }))} />
            </div>
            <div className="ck-field">
              <label>ملاحظات الشحن</label>
              <input className="ck-input" placeholder="أي تعليمات خاصة..." value={form.shipNotes}
                onChange={e => setForm(f => ({ ...f, shipNotes: e.target.value }))} />
            </div>
          </div>
        </div>
      )}

      {/* ── ECOv-suggested carriers grid ──────────── */}
      {shipMode === 'ecov' && (
        <div className="ck-form-section">
          <div style={{ fontSize:13, fontWeight:600, color:'var(--ck-txt3)', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
            <Star size={14} color="var(--ck-green)" />
            اختر شركة الشحن المناسبة لك
          </div>
          <div className="ck-carriers">
            {CARRIERS.map(c => (
              <div key={c.id}
                className={`ck-carrier ${carrier === c.id ? 'selected' : ''}`}
                onClick={() => setCarrier(c.id)}
              >
                <div className="ck-carrier-check" />
                <div className="ck-carrier-logo" style={{ background: c.bg, color: c.color }}>
                  {c.emoji}
                </div>
                <div className="ck-carrier-name">{c.name}</div>
                <div className="ck-carrier-eta">
                  <Clock size={10} style={{ display:'inline', marginLeft:3 }} />{c.eta}
                </div>
                <div className="ck-carrier-price">{c.price} جنيه</div>
                <div style={{ fontSize:11, color:'var(--ck-txt4)', marginTop:4 }}>
                  ⭐ {c.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quantity selector ────────────────────── */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--ck-txt)', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
          <Package size={16} color="var(--ck-green)" />
          الكمية المطلوبة
        </div>
        <div className="ck-qty-card">
          <div className="ck-qty-info">
            <div className="ck-qty-info-row">
              <span className="ck-qty-label">الكمية الإجمالية المعروضة</span>
              <span className="ck-qty-available">{form.availableAmount} {form.unit}</span>
            </div>
            <div className="ck-qty-bar-wrap">
              <div
                className="ck-qty-bar-fill"
                style={{ width: `${Math.min(100, (parseFloat(form.requestedQty) / parseFloat(form.availableAmount)) * 100) || 0}%` }}
              />
            </div>
            <div style={{ fontSize:11, color:'var(--ck-txt4)', marginTop:6 }}>
              متبقي: {Math.max(0, parseFloat(form.availableAmount) - parseFloat(form.requestedQty || 0)).toFixed(2)} {form.unit}
            </div>
          </div>

          <div className="ck-qty-controls">
            <div className="ck-field" style={{ flex:1 }}>
              <label>الكمية المطلوبة <span className="req">*</span></label>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <button
                  type="button"
                  className="ck-qty-btn"
                  onClick={() => {
                    const step = parseFloat(form.qtyStep) || 0.5
                    const cur  = parseFloat(form.requestedQty) || 0
                    const next = Math.max(step, parseFloat((cur - step).toFixed(2)))
                    setForm(f => ({ ...f, requestedQty: String(next) }))
                  }}
                >−</button>
                <input
                  className="ck-input"
                  type="number"
                  min={parseFloat(form.qtyStep) || 0.5}
                  max={parseFloat(form.availableAmount)}
                  step={parseFloat(form.qtyStep) || 0.5}
                  value={form.requestedQty}
                  onChange={e => {
                    const val = Math.min(parseFloat(form.availableAmount), Math.max(0, parseFloat(e.target.value) || 0))
                    setForm(f => ({ ...f, requestedQty: String(val) }))
                  }}
                  style={{ textAlign:'center', fontWeight:700, fontSize:16 }}
                />
                <button
                  type="button"
                  className="ck-qty-btn"
                  onClick={() => {
                    const step = parseFloat(form.qtyStep) || 0.5
                    const cur  = parseFloat(form.requestedQty) || 0
                    const next = Math.min(parseFloat(form.availableAmount), parseFloat((cur + step).toFixed(2)))
                    setForm(f => ({ ...f, requestedQty: String(next) }))
                  }}
                >+</button>
                <div className="ck-qty-unit">{form.unit}</div>
              </div>
            </div>

            <div className="ck-qty-presets">
              {[0.25, 0.5, 0.75, 1].map(pct => {
                const val = parseFloat((parseFloat(form.availableAmount) * pct).toFixed(2))
                return (
                  <button
                    key={pct}
                    type="button"
                    className={`ck-qty-preset ${parseFloat(form.requestedQty) === val ? 'active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, requestedQty: String(val) }))}
                  >
                    {pct * 100}%
                  </button>
                )
              })}
            </div>
          </div>

          <div className="ck-qty-total-row">
            <span>إجمالي السعر للكمية المطلوبة</span>
            <span className="ck-qty-total-val">
              {(parseFloat(form.requestedQty || 0) * (parseFloat(form.unitPrice) || 0)).toLocaleString()} {form.currency}
            </span>
          </div>
        </div>
      </div>

      {/* ── Delivery address ─────────────────────── */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--ck-txt)', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
          <MapPin size={16} color="var(--ck-green)" />
          عنوان التسليم
        </div>
        <div className="ck-form-row">
          <div className="ck-field">
            <label>المحافظة <span className="req">*</span></label>
            <div className="ck-select-wrap">
              <select className="ck-select" value={form.governorate}
                onChange={e => setForm(f => ({ ...f, governorate: e.target.value }))}>
                <option value="">اختر المحافظة</option>
                {['القاهرة','الجيزة','الإسكندرية','بورسعيد','السويس','الإسماعيلية','المنصورة','أسيوط','أسوان','الأقصر'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <ChevronDown className="ck-select-icon" />
            </div>
          </div>
          <div className="ck-field">
            <label>المدينة / المنطقة <span className="req">*</span></label>
            <input className="ck-input" placeholder="مثال: مدينة نصر، المعادي..." value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          </div>
        </div>
        <div className="ck-form-row single">
          <div className="ck-field">
            <label>العنوان التفصيلي <span className="req">*</span></label>
            <textarea className="ck-textarea" rows={3}
              placeholder="الشارع، رقم المبنى، الدور، الشقة..."
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
        </div>
        <div className="ck-form-row">
          <div className="ck-field">
            <label>اسم المستلم <span className="req">*</span></label>
            <input className="ck-input" placeholder="الاسم الكامل" value={form.receiverName}
              onChange={e => setForm(f => ({ ...f, receiverName: e.target.value }))} />
          </div>
          <div className="ck-field">
            <label>رقم هاتف المستلم <span className="req">*</span></label>
            <input className="ck-input" placeholder="01xxxxxxxxx" value={form.receiverPhone}
              onChange={e => setForm(f => ({ ...f, receiverPhone: e.target.value }))} />
          </div>
        </div>
        <div className="ck-form-row single">
          <div className="ck-field">
            <label>
              البريد الإلكتروني <span className="req">*</span>
              <span style={{ fontSize:11, fontWeight:500, color:'var(--ck-txt4)', marginRight:8 }}>
                (ستصلك رسالة بـ Tracking Number عند شحن الطلب)
              </span>
            </label>
            <div style={{ position:'relative' }}>
              <input
                className="ck-input"
                type="email"
                placeholder="example@email.com"
                value={form.receiverEmail}
                onChange={e => setForm(f => ({ ...f, receiverEmail: e.target.value }))}
                style={{ paddingLeft: 44 }}
              />
              <span style={{
                position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
                fontSize:15, pointerEvents:'none', opacity:.6
              }}>✉️</span>
            </div>
            <div style={{
              display:'flex', alignItems:'center', gap:6, marginTop:7,
              fontSize:12, color:'var(--ck-txt4)',
              background:'var(--ck-surface2)', borderRadius:10, padding:'8px 12px',
              border:'1px solid var(--ck-border)'
            }}>
              <span style={{ fontSize:14 }}>📦</span>
              ستتلقى إيميل تلقائي يحتوي على رقم التتبع فور تسليم الشحنة لشركة الشحن
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════
// STEP 2 — Payment
// ══════════════════════════════════════════════════
function StepPayment({ form, setForm, totalAmount }) {
  const method = form.payMethod
  const setMethod = (v) => setForm(f => ({ ...f, payMethod: v }))

  const INSTALLMENTS = [
    { months: 3,  monthly: Math.ceil(totalAmount / 3) },
    { months: 6,  monthly: Math.ceil(totalAmount / 6) },
    { months: 12, monthly: Math.ceil(totalAmount / 12) },
  ]

  return (
    <div>
      {/* ── Method tabs ───────────────────────────── */}
      <div className="ck-pay-methods">
        {PAY_METHODS.map(({ id, label, Icon, iconBg, iconColor }) => (
          <div key={id}
            className={`ck-pay-method ${method === id ? 'selected' : ''}`}
            onClick={() => setMethod(id)}
          >
            <div className="ck-pay-method-icon" style={{ background: iconBg, border:`1px solid ${iconColor}20` }}>
              <Icon style={{ color: iconColor }} />
            </div>
            <div className="ck-pay-method-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Credit card fields ───────────────────── */}
      {method === 'card' && (
        <div className="ck-card-fields">
          <div className="ck-form-row single">
            <div className="ck-field">
              <label>اسم حامل البطاقة <span className="req">*</span></label>
              <input className="ck-input" placeholder="كما هو مكتوب على البطاقة"
                value={form.cardName}
                onChange={e => setForm(f => ({ ...f, cardName: e.target.value }))} />
            </div>
          </div>
          <div className="ck-form-row single">
            <div className="ck-field">
              <label>رقم البطاقة <span className="req">*</span></label>
              <div className="ck-card-number-wrap">
                <input className="ck-input"
                  placeholder="1234  5678  9012  3456"
                  maxLength={19}
                  value={form.cardNumber}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
                    const fmt = raw.replace(/(.{4})/g, '$1 ').trim()
                    setForm(f => ({ ...f, cardNumber: fmt }))
                  }} />
                <span className="ck-card-brand">
                  {form.cardNumber.startsWith('4') ? '💳 Visa' :
                   form.cardNumber.startsWith('5') ? '💳 MC' : '💳'}
                </span>
              </div>
            </div>
          </div>
          <div className="ck-form-row">
            <div className="ck-field">
              <label>تاريخ الانتهاء <span className="req">*</span></label>
              <input className="ck-input" placeholder="MM / YY" maxLength={7}
                value={form.cardExpiry}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g,'').slice(0,4)
                  if (v.length >= 2) v = v.slice(0,2) + ' / ' + v.slice(2)
                  setForm(f => ({ ...f, cardExpiry: v }))
                }} />
            </div>
            <div className="ck-field">
              <label>CVV <span className="req">*</span></label>
              <input className="ck-input" placeholder="•••" type="password" maxLength={4}
                value={form.cardCvv}
                onChange={e => setForm(f => ({ ...f, cardCvv: e.target.value.replace(/\D/,'').slice(0,4) }))} />
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8, fontSize:12, color:'var(--ck-txt4)' }}>
            <Lock size={13} color="var(--ck-green)" />
            بياناتك محمية بتشفير SSL 256-bit
          </div>
        </div>
      )}

      {/* ── Bank transfer info ───────────────────── */}
      {method === 'bank' && (
        <div className="ck-bank-info">
          <div style={{ fontSize:13, color:'var(--ck-txt3)', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
            <AlertCircle size={14} color="var(--ck-gold)" />
            حوّل المبلغ خلال 48 ساعة لتأكيد طلبك
          </div>
          {[
            { label:'اسم البنك',      value:'البنك التجاري الدولي CIB' },
            { label:'اسم الحساب',     value:'شركة ECOv للتجارة البيئية' },
            { label:'رقم الحساب',     value:'1234 5678 9012' },
            { label:'SWIFT',          value:'CIBEEGCX' },
            { label:'مرجع التحويل',   value:`ECO-${Date.now().toString().slice(-6)}` },
          ].map(({ label, value }) => (
            <div key={label} className="ck-bank-row">
              <span>{label}</span>
              <span style={{ fontFamily:'monospace', fontSize:13 }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Installment plans ───────────────────── */}
      {method === 'installment' && (
        <div>
          <div style={{ fontSize:13, color:'var(--ck-txt3)', marginBottom:14 }}>
            اختر عدد الأقساط المناسب لك — بدون فوائد خلال فترة العرض
          </div>
          <div className="ck-installment-opts">
            {INSTALLMENTS.map(({ months, monthly }) => (
              <div key={months}
                className={`ck-inst-opt ${form.installmentPlan === months ? 'selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, installmentPlan: months }))}
              >
                <div className="ck-inst-months">{months}</div>
                <div className="ck-inst-label">أقساط</div>
                <div className="ck-inst-monthly">{monthly.toLocaleString()} جنيه / شهر</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20 }}>
            <div className="ck-form-row single">
              <div className="ck-field">
                <label>اسم حامل البطاقة <span className="req">*</span></label>
                <input className="ck-input" placeholder="كما هو مكتوب على البطاقة"
                  value={form.cardName}
                  onChange={e => setForm(f => ({ ...f, cardName: e.target.value }))} />
              </div>
            </div>
            <div className="ck-form-row single">
              <div className="ck-field">
                <label>رقم البطاقة <span className="req">*</span></label>
                <input className="ck-input" placeholder="1234  5678  9012  3456" maxLength={19}
                  value={form.cardNumber}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g,'').slice(0,16)
                    setForm(f => ({ ...f, cardNumber: raw.replace(/(.{4})/g,'$1 ').trim() }))
                  }} />
              </div>
            </div>
            <div className="ck-form-row">
              <div className="ck-field">
                <label>تاريخ الانتهاء <span className="req">*</span></label>
                <input className="ck-input" placeholder="MM / YY" maxLength={7}
                  value={form.cardExpiry}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g,'').slice(0,4)
                    if (v.length>=2) v = v.slice(0,2)+' / '+v.slice(2)
                    setForm(f => ({ ...f, cardExpiry: v }))
                  }} />
              </div>
              <div className="ck-field">
                <label>CVV <span className="req">*</span></label>
                <input className="ck-input" placeholder="•••" type="password" maxLength={4}
                  value={form.cardCvv}
                  onChange={e => setForm(f => ({ ...f, cardCvv: e.target.value.slice(0,4) }))} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════
// STEP 3 — Review & Confirm
// ══════════════════════════════════════════════════
function StepConfirm({ form, product, shippingCost }) {
  const selectedCarrierObj = CARRIERS.find(c => c.id === form.selectedCarrier)
  const productTotal = parseFloat(form.requestedQty || 0) * parseFloat(form.unitPrice || 0)

  const payLabel = {
    card:        'بطاقة ائتمان',
    bank:        'تحويل بنكي',
    installment: `تقسيط (${form.installmentPlan} أشهر)`,
  }[form.payMethod] || '—'

  return (
    <div>
      {[
        {
          title: 'تفاصيل المنتج',
          rows: [
            { label:'المنتج',           value: product.title },
            { label:'الكمية المطلوبة',   value: `${form.requestedQty} ${form.unit}` },
            { label:'سعر الوحدة',        value: `${parseFloat(form.unitPrice).toLocaleString()} ${form.currency} / ${form.unit}` },
            { label:'إجمالي المنتج',     value: `${productTotal.toLocaleString()} ${form.currency}` },
          ]
        },
        {
          title: 'بيانات الشحن',
          rows: [
            { label:'طريقة الشحن', value: form.shipMode === 'buyer' ? 'أرتبه بنفسي' : `ECOv — ${selectedCarrierObj?.name || '—'}` },
            { label:'تكلفة الشحن', value: `${shippingCost} جنيه` },
            { label:'العنوان',      value: `${form.governorate}، ${form.city}` },
            { label:'المستلم',     value: form.receiverName || '—' },
            { label:'الهاتف',      value: form.receiverPhone || '—' },
            { label:'الإيميل',     value: form.receiverEmail || '—' },
          ]
        },
        {
          title: 'طريقة الدفع',
          rows: [
            { label:'الطريقة', value: payLabel },
            ...(form.payMethod === 'card' || form.payMethod === 'installment'
              ? [{ label:'البطاقة', value: form.cardNumber ? `**** ${form.cardNumber.slice(-4)}` : '—' }]
              : []),
          ]
        },
      ].map(({ title, rows }) => (
        <div key={title} style={{ marginBottom: 20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--ck-txt3)', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.5px' }}>
            {title}
          </div>
          <div style={{ background:'var(--ck-surface2)', borderRadius:16, border:'1px solid var(--ck-border)', overflow:'hidden' }}>
            {rows.map(({ label, value }, i) => (
              <div key={i} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'12px 18px', fontSize:14,
                borderBottom: i < rows.length-1 ? '1px dashed var(--ck-border2)' : 'none'
              }}>
                <span style={{ color:'var(--ck-txt3)' }}>{label}</span>
                <span style={{ color:'var(--ck-txt)', fontWeight:700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{
        background:'var(--ck-green-lt)', border:'1px solid rgba(26,122,60,0.2)',
        borderRadius:16, padding:'14px 18px', display:'flex', alignItems:'center', gap:10,
        fontSize:13, color:'var(--ck-green)', fontWeight:600
      }}>
        <Shield size={16} />
        طلبك محمي بضمان ECOv للجودة. يمكنك الإلغاء خلال 24 ساعة.
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════
// MAIN CHECKOUT
// ══════════════════════════════════════════════════
export default function Checkout({ lang = 'ar', dark = false }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Product passed via router state, or use mock
  const product = location.state?.product || {
    id:              1,
    title:           'بلاستيك PET نظيف',
    type:            'بلاستيك',
    amount:          '5 طن',
    availableAmount: 5,
    unitPrice:       1500,
    unit:            'طن',
    currency:        'جنيه',
    price:           7500,
    seller:          'مصنع الإنتاج الوطني',
    location:        'القاهرة',
  }

  const [step, setStep] = useState(0)  // 0=shipping, 1=payment, 2=confirm
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    // quantity
    requestedQty:    '0',                           // FIXED: Start from 0 so remaining = total
    availableAmount: String(product.availableAmount || 2.5),
    unitPrice:       String(product.unitPrice || 1500),
    unit:            product.unit || 'طن',
    currency:        product.currency || 'جنيه',
    qtyStep:         '0.5',
    // shipping
    shipMode:        'ecov',
    selectedCarrier: '',
    buyerCarrierName:'',
    trackingNum:     '',
    pickupDate:      '',
    shipNotes:       '',
    // address
    governorate:     '',
    city:            '',
    address:         '',
    receiverName:    '',
    receiverPhone:   '',
    receiverEmail:   '',
    // payment
    payMethod:       'card',
    cardName:        '',
    cardNumber:      '',
    cardExpiry:      '',
    cardCvv:         '',
    installmentPlan: 3,
  })

  const selectedCarrierObj = CARRIERS.find(c => c.id === form.selectedCarrier)
  const shippingCost  = form.shipMode === 'buyer' ? 0 : (selectedCarrierObj?.price || 0)
  const productTotal  = parseFloat(form.requestedQty || 0) * parseFloat(form.unitPrice || 0)
  const totalAmount   = productTotal + shippingCost

  const canNext = () => {
    if (step === 0) {
      // FIXED: Validate quantity > 0 and within available
      const qty = parseFloat(form.requestedQty);
      if (isNaN(qty) || qty <= 0 || qty > parseFloat(form.availableAmount)) return false;

      // لازم عنوان التسليم مكتمل
      if (!form.governorate || !form.city || !form.address || !form.receiverName || !form.receiverPhone || !form.receiverEmail) return false
      // لو ECOv لازم يختار شركة شحن
      if (form.shipMode === 'ecov' && !form.selectedCarrier) return false
      // لو هو اللي بيرتب لازم يكتب اسم الشركة
      if (form.shipMode === 'buyer' && !form.buyerCarrierName) return false
      return true
    }

    if (step === 1) {
      if (!form.payMethod) return false
      // بطاقة أو تقسيط: لازم اسم البطاقة وأول 13 رقم على الأقل
      if (form.payMethod === 'card' || form.payMethod === 'installment') {
        if (!form.cardName.trim()) return false
        if (form.cardNumber.replace(/\s/g, '').length < 13) return false
      }
      // تحويل بنكي: مش محتاج حاجة إضافية
      return true
    }

    // step 2: مراجعة — دايماً يقدر يكمل
    return true
  }

  const handleNext = () => {
    if (step < 2) setStep(s => s + 1)
    else {
      // Submit
      setSubmitted(true)
    }
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  // ── Success screen ──────────────────────────────
  if (submitted) {
    const orderRef = `ECO-${Date.now().toString().slice(-7)}`
    return (
      <div className={`ck-root${dark ? ' ck-dark' : ''}`} dir={dir}>
        <div className="ck-body">
          <div className="ck-success">
            <div className="ck-success-circle">
              <CheckCircle2 size={46} />
            </div>
            <h2>تم تأكيد طلبك بنجاح! 🎉</h2>
            <p>
              شكراً لك! سيتواصل معك البائع قريباً لتنسيق عملية الاستلام.
              يمكنك متابعة طلبك من صفحة الطلبات.
              <br />
              <span style={{ fontSize:13, color:'var(--ck-green)', fontWeight:600 }}>
                ✉️ سيُرسل رقم التتبع إلى {form.receiverEmail} فور شحن الطلب
              </span>
            </p>
            <div className="ck-success-details">
              {[
                { label:'رقم الطلب',            value: orderRef },
                { label:'المنتج',               value: product.title },
                { label:'الكمية المطلوبة',       value: `${form.requestedQty} ${form.unit}` },
                { label:'المبلغ الإجمالي',       value: `${totalAmount.toLocaleString()} جنيه` },
                { label:'طريقة الدفع',           value: { card:'بطاقة ائتمان', bank:'تحويل بنكي', installment:'تقسيط' }[form.payMethod] },
                { label:'شركة الشحن',            value: form.shipMode === 'buyer' ? form.buyerCarrierName : (selectedCarrierObj?.name || '—') },
                { label:'عنوان التسليم',         value: `${form.governorate}، ${form.city}` },
                { label:'إيميل التتبع',          value: form.receiverEmail || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="ck-success-detail-row">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
              <button className="ck-success-btn" onClick={() => navigate('/orders')}>
                <Receipt size={16} />
                متابعة طلباتي
              </button>
              <button className="ck-success-btn" style={{ background:'transparent', color:'var(--ck-green)', border:'1.5px solid var(--ck-green)', boxShadow:'none' }}
                onClick={() => navigate('/')}>
                <Home size={16} />
                الرئيسية
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Card header configs ─────────────────────────
  const cardHeaders = [
    { icon:<Truck />, iconBg:'rgba(26,74,138,0.1)', iconColor:'#1a4a8a', title:'خيارات الشحن', sub:'حدد طريقة وصول البضاعة إليك' },
    { icon:<CreditCard />, iconBg:'rgba(26,122,60,0.1)', iconColor:'#1a7a3c', title:'طريقة الدفع', sub:'ادفع بالطريقة الأنسب لك' },
    { icon:<Receipt />, iconBg:'rgba(199,123,26,0.1)', iconColor:'#c77b1a', title:'مراجعة وتأكيد', sub:'تحقق من تفاصيل طلبك قبل الإرسال' },
  ]

  const ch = cardHeaders[step]
  const stepBtnLabels = ['التالي: الدفع', 'التالي: المراجعة', 'تأكيد وإتمام الطلب']

  return (
    <div className={`ck-root${dark ? ' ck-dark' : ''}`} dir={dir}>
      <div className="ck-body">

        {/* Header */}
        <div className="ck-header">
          <div className="ck-header-icon">
            <ShoppingCart />
          </div>
          <div className="ck-header-text">
            <h1>إتمام الدفع</h1>
            <p>أكمل بيانات طلبك لإتمام عملية الشراء بأمان</p>
          </div>
        </div>

        {/* Back button */}
        <button className="ck-back-btn" onClick={() => step > 0 ? setStep(s => s-1) : navigate(-1)}>
          <ChevronLeft size={15} />
          {step === 0 ? 'العودة للمنتج' : 'السابق'}
        </button>

        {/* Steps */}
        <div className="ck-steps">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className={`ck-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                <div className="ck-step-circle">
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className="ck-step-label">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex:1, height:2, background: i < step ? 'var(--ck-step-done)' : 'var(--ck-step-idle)', borderRadius:99, margin:'0 6px', transition:'background .4s' }}/>}
            </React.Fragment>
          ))}
        </div>

        {/* Main grid */}
        <div className="ck-grid">
          {/* ── Left: form card ─────────────────── */}
          <div>
            <div className="ck-card" style={{ animationDelay:'.1s' }}>
              <div className="ck-card-hd">
                <div className="ck-card-hd-icon" style={{ background: ch.iconBg, border:`1px solid ${ch.iconColor}20` }}>
                  {React.cloneElement(ch.icon, { size:18, style:{ color: ch.iconColor } })}
                </div>
                <div>
                  <h2>{ch.title}</h2>
                  <p>{ch.sub}</p>
                </div>
              </div>
              <div className="ck-card-body">
                {step === 0 && <StepShipping form={form} setForm={setForm} />}
                {step === 1 && <StepPayment form={form} setForm={setForm} totalAmount={totalAmount} />}
                {step === 2 && <StepConfirm form={form} product={product} shippingCost={shippingCost} />}
              </div>
            </div>

            {/* Next / Submit button (below card on mobile) */}
            <button
              onClick={handleNext}
              disabled={!canNext()}
              style={{
                width:'100%', padding:'15px',
                background: canNext() ? 'var(--ck-green)' : 'var(--ck-chip)',
                color: canNext() ? 'white' : 'var(--ck-txt4)',
                border:'none', borderRadius:16,
                fontSize:15, fontWeight:700,
                fontFamily:"'IBM Plex Sans Arabic',sans-serif",
                cursor: canNext() ? 'pointer' : 'not-allowed',
                display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                transition:'all .25s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: canNext() ? '0 6px 20px rgba(26,122,60,0.3)' : 'none',
                marginTop:16,
              }}
            >
              {stepBtnLabels[step]}
              <ArrowRight size={17} />
            </button>
          </div>

          {/* ── Right: order summary ─────────────── */}
          <div className="ck-summary">
            <div className="ck-summary-card">
              <div className="ck-summary-hd">
                <h3>ملخص الطلب</h3>
              </div>

              {/* Product */}
              <div className="ck-summary-product">
                <div className="ck-summary-product-img">
                  <Leaf />
                </div>
                <div>
                  <div className="ck-summary-product-name">{product.title}</div>
                  <div className="ck-summary-product-meta"><Package size={12} />{product.type}</div>
                  <div className="ck-summary-product-meta"><Star size={12} />{product.amount}</div>
                  <div className="ck-summary-product-meta"><MapPin size={12} />{product.location}</div>
                  <div className="ck-summary-product-meta"><Building2 size={12} />{product.seller}</div>
                </div>
              </div>

              {/* Rows */}
              <div className="ck-summary-rows">
                <div className="ck-summary-row">
                  <span>الكمية المطلوبة</span>
                  <span>{form.requestedQty} {form.unit}</span>
                </div>
                <div className="ck-summary-row">
                  <span>سعر الوحدة</span>
                  <span>{parseFloat(form.unitPrice).toLocaleString()} {form.currency} / {form.unit}</span>
                </div>
                <div className="ck-summary-row">
                  <span>سعر المنتج</span>
                  <span>{productTotal.toLocaleString()} {form.currency}</span>
                </div>
                <div className="ck-summary-row">
                  <span>تكلفة الشحن</span>
                  <span>{shippingCost === 0 ? 'على المشتري' : `${shippingCost} جنيه`}</span>
                </div>
                <div className="ck-summary-row">
                  <span>ضريبة القيمة المضافة</span>
                  <span>مشمولة</span>
                </div>
                <div className="ck-summary-row total">
                  <span>الإجمالي</span>
                  <span>{totalAmount.toLocaleString()} ج</span>
                </div>
              </div>

              {/* Carrier badge */}
              {form.shipMode === 'ecov' && selectedCarrierObj && (
                <div className="ck-summary-ship-badge">
                  <Truck size={16} />
                  <div>
                    <div style={{ fontWeight:700 }}>{selectedCarrierObj.name}</div>
                    <div style={{ fontSize:11, opacity:.7 }}>وصول خلال {selectedCarrierObj.eta}</div>
                  </div>
                </div>
              )}

              {form.shipMode === 'buyer' && form.buyerCarrierName && (
                <div className="ck-summary-ship-badge" style={{ background:'var(--ck-blue-lt)', borderColor:'rgba(26,74,138,0.2)', color:'var(--ck-blue)' }}>
                  <Truck size={16} />
                  <div>
                    <div style={{ fontWeight:700 }}>{form.buyerCarrierName}</div>
                    <div style={{ fontSize:11, opacity:.7 }}>شحن يرتبه المشتري</div>
                  </div>
                </div>
              )}

              {/* Submit inside summary (desktop) */}
              <button
                className="ck-submit-btn"
                onClick={handleNext}
                disabled={!canNext()}
                style={{ opacity: canNext() ? 1 : .5, cursor: canNext() ? 'pointer' : 'not-allowed' }}
              >
                <Lock size={16} />
                {stepBtnLabels[step]}
              </button>

              <div className="ck-secure-note">
                <Shield size={13} />
                دفع آمن — تشفير SSL 256-bit
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}