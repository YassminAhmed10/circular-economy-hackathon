import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package, MapPin, Calendar, DollarSign, Trash2,
  Clock, Eye, Users, MessageCircle, Phone, Mail,
  Shield, ChevronLeft, Heart, Share2, AlertCircle,
  ShoppingCart
} from 'lucide-react';
import './WasteDetails.css';

function WasteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [waste, setWaste] = useState({
    id: id,
    title: 'نفايات بلاستيك عالية الجودة للإعادة التدوير',
    type: 'بلاستيك',
    description: 'نفايات بلاستيك نظيفة من نوع PET، مناسبة لإعادة التدوير. مخزنة في ظروف مناسبة وجاهزة للتسليم.',
    amount: '2.5',
    unit: 'طن',
    frequency: 'شهري',
    price: '1500',
    currency: 'جنيه',
    location: 'القاهرة',
    address: 'المنطقة الصناعية، القاهرة',
    date: '2024-01-15',
    views: 145,
    offers: 8,
    status: 'متاح',
    seller: {
      name: 'مصنع الأمل للصناعات الغذائية',
      rating: 4.8,
      totalSales: 45,
      joined: '2023-06-15',
      verified: true,
      phone: '+20 123 456 7890',
      email: 'contact@al-amal.com'
    },
    specifications: {
      material: 'PET',
      color: 'شفاف',
      purity: '95%',
      packaging: 'أكياس 25 كجم',
      storage: 'مخزن مغلق'
    }
  });

  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('إرسال رسالة:', message);
      setMessage('');
      setShowContactForm(false);
      alert('تم إرسال رسالتك بنجاح!');
    }
  };

  // ── Navigate to Checkout passing product data ──
  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        product: {
          id:              waste.id,
          title:           waste.title,
          type:            waste.type,
          amount:          `${waste.amount} ${waste.unit}`,
          availableAmount: parseFloat(waste.amount),   // رقم بس
          unitPrice:       parseFloat(waste.price),    // سعر الوحدة الواحدة
          unit:            waste.unit,
          currency:        waste.currency,
          price:           parseFloat(waste.price) * parseFloat(waste.amount),
          seller:          waste.seller.name,
          location:        waste.location,
        }
      }
    })
  }

  const getTypeClass = (type) => {
    switch (type) {
      case 'بلاستيك': return 'type-plastic';
      case 'ورق':     return 'type-paper';
      case 'معادن':   return 'type-metal';
      case 'زجاج':    return 'type-glass';
      default:        return '';
    }
  };

  return (
    <div className="waste-container">
      {/* زر العودة */}
      <button onClick={() => navigate(-1)} className="back-button">
        <ChevronLeft className="w-4 h-4" />
        العودة
      </button>

      <div className="waste-grid">
        {/* ── العمود الأيسر ──────────────────────── */}
        <div className="waste-left">

          {/* بطاقة الإعلان الرئيسية */}
          <div className="waste-card">
            <div className="waste-header">
              <div>
                <div className="waste-tags">
                  <span className={`waste-tag ${getTypeClass(waste.type)}`}>{waste.type}</span>
                  <span className="waste-tag" style={{ background:'var(--db-surface2)', color:'var(--db-txt3)' }}>{waste.frequency}</span>
                  <span className={`waste-tag ${waste.status === 'متاح' ? 'status-available' : 'status-pending'}`}>
                    {waste.status}
                  </span>
                </div>
                <h1 className="waste-title">{waste.title}</h1>
                <div className="waste-meta">
                  <span className="waste-meta-item"><Eye /><span>{waste.views} مشاهدة</span></span>
                  <span className="waste-meta-item"><Users /><span>{waste.offers} عروض</span></span>
                  <span className="waste-meta-item"><Calendar /><span>تاريخ النشر: {waste.date}</span></span>
                </div>
              </div>
              <div className="waste-actions">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`icon-button ${isLiked ? 'liked' : ''}`}
                >
                  <Heart className={isLiked ? 'fill-current' : ''} />
                </button>
                <button className="icon-button"><Share2 /></button>
              </div>
            </div>

            {/* الصورة والإحصائيات */}
            <div className="waste-media">
              <div className="waste-image"><Package /></div>
              <div className="waste-stats">
                <div className="stat-box">
                  <p className="stat-label">الكمية المتاحة</p>
                  <p className="stat-value">{waste.amount} <small>{waste.unit}</small></p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">السعر</p>
                  <p className="stat-value emerald">{waste.price} <small>{waste.currency}</small></p>
                  <p className="stat-label" style={{ marginTop:4 }}>لل{waste.unit} الواحد</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">الموقع</p>
                  <div className="stat-location"><MapPin /><span>{waste.location}</span></div>
                </div>
              </div>
            </div>

            {/* الوصف */}
            <h3 className="section-title">الوصف التفصيلي</h3>
            <p className="waste-description">{waste.description}</p>

            {/* المواصفات */}
            <h3 className="section-title">المواصفات</h3>
            <div className="specs-grid">
              <div className="spec-item"><p className="spec-label">نوع المادة</p><p className="spec-value">{waste.specifications.material}</p></div>
              <div className="spec-item"><p className="spec-label">اللون</p><p className="spec-value">{waste.specifications.color}</p></div>
              <div className="spec-item"><p className="spec-label">النقاوة</p><p className="spec-value">{waste.specifications.purity}</p></div>
              <div className="spec-item"><p className="spec-label">التغليف</p><p className="spec-value">{waste.specifications.packaging}</p></div>
              <div className="spec-item"><p className="spec-label">التخزين</p><p className="spec-value">{waste.specifications.storage}</p></div>
              <div className="spec-item"><p className="spec-label">العنوان</p><p className="spec-value">{waste.address}</p></div>
            </div>
          </div>

          {/* معلومات البائع */}
          <div className="waste-card">
            <h3 className="section-title">عن البائع</h3>
            <div className="seller-info">
              <div className="seller-profile">
                <div className="seller-avatar"><Package /></div>
                <div className="seller-details">
                  <div className="seller-name">
                    <span>{waste.seller.name}</span>
                    {waste.seller.verified && <Shield className="verified-badge" size={18} />}
                  </div>
                  <div className="seller-stats">
                    <span>{waste.seller.rating} ⭐</span>
                    <span>{waste.seller.totalSales} عملية بيع</span>
                    <span>منضم منذ {waste.seller.joined}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowContactForm(!showContactForm)} className="contact-button">
                تواصل مع البائع
              </button>
            </div>

            {showContactForm && (
              <div className="contact-form">
                <div className="contact-details">
                  <div className="contact-item"><Phone /><span>{waste.seller.phone}</span></div>
                  <div className="contact-item"><Mail /><span>{waste.seller.email}</span></div>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="message-input"
                />
                <button onClick={handleSendMessage} className="send-button">
                  <MessageCircle size={16} />
                  إرسال رسالة
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── العمود الأيمن ──────────────────────── */}
        <div className="waste-right">

          {/* بطاقة إتخاذ إجراء */}
          <div className="actions-card">
            <h3 className="actions-title">إتخاذ إجراء</h3>

            <div className="action-buttons">

              {/* ── زر الدفع الجديد ─────────────── */}
              <button onClick={handleCheckout} className="action-btn-checkout">
                <ShoppingCart size={18} />
                الدفع — Checkout
              </button>

              <button onClick={() => setShowContactForm(true)} className="action-btn-secondary">
                <MessageCircle size={18} />
                مراسلة البائع
              </button>

              <button className="action-btn-outline">
                <Phone size={18} />
                الاتصال بالبائع
              </button>
            </div>

            <div className="price-total">
              <span>السعر الإجمالي</span>
              <span>{(parseFloat(waste.price) * parseFloat(waste.amount)).toLocaleString()} {waste.currency}</span>
            </div>
            <p className="price-unit">لـ {waste.amount} {waste.unit}</p>

            {/* Secure badge */}
            <div className="checkout-secure-note">
              <Shield size={13} />
              دفع آمن عبر منصة ECOv
            </div>
          </div>

          {/* نصائح الأمان */}
          <div className="safety-card">
            <div className="safety-header">
              <AlertCircle size={20} />
              <h4>نصائح أمان</h4>
            </div>
            <ul className="safety-list">
              <li><span>•</span> لا تدفع مبالغ خارج المنصة</li>
              <li><span>•</span> تحقق من هوية البائع</li>
              <li><span>•</span> استخدم وسائل الدفع الآمنة</li>
              <li><span>•</span> تأكد من فحص البضاعة قبل الشراء</li>
            </ul>
          </div>

          {/* عروض مشابهة */}
          <div className="similar-card">
            <h4 className="similar-title">عروض مشابهة</h4>
            <div className="similar-list">
              {[
                { title:'بلاستيك PET نظيف',   amount:'1.5 طن',  price:'1400', location:'الجيزة'       },
                { title:'نفايات ورق مكتبي',   amount:'800 كجم', price:'750',  location:'القاهرة'      },
                { title:'معادن خردة',          amount:'3 طن',    price:'3200', location:'الإسكندرية'  },
              ].map((item, index) => (
                <div key={index} className="similar-item">
                  <div className="similar-item-info">
                    <p>{item.title}</p>
                    <p>{item.amount} • {item.location}</p>
                  </div>
                  <div className="similar-item-price">
                    <span className="price">{item.price} جنيه</span>
                    <span className="unit">للطن</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WasteDetails;