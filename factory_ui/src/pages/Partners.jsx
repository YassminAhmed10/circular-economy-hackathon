// Partners.jsx — ECOv · شبكة الشركاء — Premium Redesign
import React, { useState } from 'react';
import {
  Search, Filter, MapPin, Star, Phone, Mail, Globe,
  Building2, Recycle, Package, Users, CheckCircle, Sparkles
} from 'lucide-react';
import './Partners.css';

const PARTNER_TYPES = [
  { id: 'all',        label: 'جميع الأنواع',        emoji: '🌿', icon: Building2 },
  { id: 'recycling',  label: 'مصانع إعادة التدوير', emoji: '♻️', icon: Recycle   },
  { id: 'collection', label: 'شركات التجميع',       emoji: '📦', icon: Package   },
  { id: 'logistics',  label: 'خدمات النقل',         emoji: '🚚', icon: null      },
  { id: 'technology', label: 'تكنولوجيا النفايات',  emoji: '💻', icon: null      },
  { id: 'consulting', label: 'الاستشارات',          emoji: '👥', icon: Users     },
];

const LOCATIONS = [
  'جميع المحافظات','القاهرة','الجيزة','الإسكندرية',
  'القليوبية','بور سعيد','السويس','الدقهلية','الشرقية','الغربية',
];

const PARTNERS = [
  {
    id:1, name:'مصنع إعادة التدوير المتقدم', type:'recycling',
    description:'متخصصون في إعادة تدوير البلاستيك والورق بجودة عالية وتقنيات حديثة',
    location:'القاهرة', rating:4.8, reviews:124,
    phone:'+20 123 456 7890', email:'contact@advanced-recycling.com', website:'www.advanced-recycling.com',
    specialties:['بلاستيك','ورق','معادن'], verified:true,
    logo:'https://ui-avatars.com/api/?name=AR&background=16a34a&color=fff&size=200&bold=true',
  },
  {
    id:2, name:'الشركة الخضراء للتجميع', type:'collection',
    description:'خدمات تجميع النفايات الصناعية من المصانع بكفاءة واحترافية عالية',
    location:'الجيزة', rating:4.5, reviews:89,
    phone:'+20 987 654 3210', email:'info@green-collection.com', website:'www.green-collection.com',
    specialties:['تجميع','فرز','نقل'], verified:true,
    logo:'https://ui-avatars.com/api/?name=GC&background=3b82f6&color=fff&size=200&bold=true',
  },
  {
    id:3, name:'نقليات إيكو', type:'logistics',
    description:'نقل وتوصيل النفايات الصناعية بأمان وكفاءة عبر أسطول متطور',
    location:'الإسكندرية', rating:4.7, reviews:156,
    phone:'+20 555 444 3333', email:'transport@eco-logistics.com', website:'www.eco-logistics.com',
    specialties:['نقل','تخزين','لوجستيات'], verified:true,
    logo:'https://ui-avatars.com/api/?name=EL&background=8b5cf6&color=fff&size=200&bold=true',
  },
  {
    id:4, name:'تكنو-واست', type:'technology',
    description:'تقنيات متطورة لمعالجة وإدارة النفايات وتحليل البيانات البيئية',
    location:'القاهرة', rating:4.9, reviews:67,
    phone:'+20 111 222 3333', email:'tech@techno-waste.com', website:'www.techno-waste.com',
    specialties:['تكنولوجيا','تحليل','مراقبة'], verified:true,
    logo:'https://ui-avatars.com/api/?name=TW&background=d97706&color=fff&size=200&bold=true',
  },
  {
    id:5, name:'مصنع المعادن الثانوية', type:'recycling',
    description:'إعادة تدوير المعادن بأنواعها المختلفة بمستوى جودة عالمي',
    location:'بور سعيد', rating:4.6, reviews:92,
    phone:'+20 222 333 4444', email:'metals@secondary-metals.com', website:'www.secondary-metals.com',
    specialties:['معادن','نحاس','ألومنيوم'], verified:false,
    logo:'https://ui-avatars.com/api/?name=MM&background=64748b&color=fff&size=200&bold=true',
  },
  {
    id:6, name:'استشارات البيئة المستدامة', type:'consulting',
    description:'استشارات متخصصة في إدارة النفايات والاقتصاد الدائري للمصانع',
    location:'القاهرة', rating:4.8, reviews:45,
    phone:'+20 777 888 9999', email:'consulting@sustainable-env.com', website:'www.sustainable-env.com',
    specialties:['استشارات','تدريب','شهادات'], verified:true,
    logo:'https://ui-avatars.com/api/?name=SE&background=10b981&color=fff&size=200&bold=true',
  },
];

export default function Partners() {
  const [search,      setSearch]      = useState('');
  const [selType,     setSelType]     = useState('all');
  const [selLocation, setSelLocation] = useState('جميع المحافظات');

  const filtered = PARTNERS.filter(p => {
    const q = search.trim().toLowerCase();
    const mSearch = !q || p.name.includes(q) || p.description.includes(q);
    const mType   = selType === 'all' || p.type === selType;
    const mLoc    = selLocation === 'جميع المحافظات' || p.location === selLocation;
    return mSearch && mType && mLoc;
  });

  const totalRating = (PARTNERS.reduce((s,p) => s + p.rating, 0) / PARTNERS.length).toFixed(1);

  return (
    <div className="partners-container" dir="rtl">

      {/* ── Header ── */}
      <div className="partners-header">
        <div className="ph-orb-wrap">
          <div className="ph-orb">
            <div className="ph-orb-glow"/>
            <div className="ph-orb-core"><Users size={22} color="white"/></div>
            <div className="ph-orb-ring r1"/>
            <div className="ph-orb-ring r2"/>
          </div>
        </div>
        <div className="ph-eyebrow"><Sparkles size={10}/> شبكة الشركاء</div>
        <h1>شبكة <em>الشركاء</em></h1>
        <p>تواصل مع شركات إعادة التدوير والخدمات المتخصصة</p>
      </div>

      {/* ── Stats ── */}
      <div className="stats-grid">
        <div className="stat-card" style={{animationDelay:'0s'}}>
          <div className="stat-card-content">
            <div className="stat-info">
              <p>إجمالي الشركاء</p>
              <div className="stat-number">{PARTNERS.length}</div>
            </div>
            <div className="stat-icon"><Users size={22}/></div>
          </div>
        </div>
        <div className="stat-card" style={{animationDelay:'.07s'}}>
          <div className="stat-card-content">
            <div className="stat-info">
              <p>شركاء معتمدون</p>
              <div className="stat-number emerald">{PARTNERS.filter(p=>p.verified).length}</div>
            </div>
            <div className="stat-icon"><CheckCircle size={22}/></div>
          </div>
        </div>
        <div className="stat-card" style={{animationDelay:'.14s'}}>
          <div className="stat-card-content">
            <div className="stat-info">
              <p>متوسط التقييم</p>
              <div className="stat-number amber">{totalRating}</div>
            </div>
            <div className="stat-icon amber"><Star size={22}/></div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="filter-section">
        <div className="search-row">
          <div className="search-wrapper">
            <Search className="search-icon"/>
            <input className="search-input" type="text"
              placeholder="ابحث عن شركاء..."
              value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <div className="filter-group">
            <div className="select-wrapper">
              <select className="select-input" value={selType} onChange={e=>setSelType(e.target.value)}>
                {PARTNER_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <Filter className="select-icon"/>
            </div>
            <div className="select-wrapper">
              <select className="select-input" value={selLocation} onChange={e=>setSelLocation(e.target.value)}>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <MapPin className="select-icon"/>
            </div>
          </div>
        </div>

        <div className="type-filters">
          {PARTNER_TYPES.map(t => (
            <button key={t.id}
              className={`type-btn${selType===t.id?' active':''}`}
              onClick={() => setSelType(t.id)}>
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Search size={30}/></div>
          <h3>لا توجد نتائج</h3>
          <p>جرب البحث باستخدام مصطلحات مختلفة أو تغيير الفلاتر</p>
        </div>
      ) : (
        <div className="partners-grid">
          {filtered.map((p, i) => (
            <PartnerCard key={p.id} partner={p} delay={i * 0.07}/>
          ))}
        </div>
      )}

      {/* ── Become Partner ── */}
      <div className="become-partner">
        <div className="bp-bg"/>
        <div className="bp-blob b1"/>
        <div className="bp-blob b2"/>
        <div className="partner-cta">
          <div className="cta-content">
            <h3>كن شريكاً <em>معنا</em></h3>
            <p>انضم إلى شبكتنا من الشركاء المتميزين ووسّع فرص أعمالك في مجال الاقتصاد الدائري والنفايات الصناعية</p>
            <div className="cta-features">
              <div className="feature-item"><CheckCircle size={14}/> وصول إلى آلاف المصانع</div>
              <div className="feature-item"><CheckCircle size={14}/> علامة تجارية معتمدة</div>
              <div className="feature-item"><CheckCircle size={14}/> دعم فني مستمر</div>
            </div>
          </div>
          <button className="cta-button">سجّل كشريك</button>
        </div>
      </div>

    </div>
  );
}

/* ── Partner Card Component ── */
function PartnerCard({ partner, delay }) {
  return (
    <div className="partner-card" style={{animationDelay:`${delay}s`}}>
      <div className="partner-content">

        {/* Header */}
        <div className="partner-header">
          <div className="partner-profile">
            <img src={partner.logo} alt={partner.name} className="partner-logo"
              onError={e => { e.target.src = `https://picsum.photos/seed/${partner.id+10}/56/56`; }}/>
            <div>
              <div className="partner-name-wrapper">
                <span className="partner-name">{partner.name}</span>
                {partner.verified && <CheckCircle className="verified-badge"/>}
              </div>
              <div className="partner-location">
                <MapPin/><span>{partner.location}</span>
              </div>
            </div>
          </div>
          <div className="partner-rating">
            <Star/>
            <span>{partner.rating}</span>
            <span className="rating-count">({partner.reviews})</span>
          </div>
        </div>

        {/* Description */}
        <p className="partner-description">{partner.description}</p>

        {/* Specialties */}
        <div className="partner-specialties">
          {partner.specialties.map(s => (
            <span key={s} className="specialty-tag">{s}</span>
          ))}
        </div>

        {/* Contact */}
        <div className="contact-info">
          <div className="contact-item"><Phone/><span>{partner.phone}</span></div>
          <div className="contact-item"><Mail/><span>{partner.email}</span></div>
          <div className="contact-item"><Globe/><span>{partner.website}</span></div>
        </div>

        {/* Actions */}
        <div className="partner-actions">
          <button className="btn-primary">تواصل الآن</button>
          <button className="btn-secondary">عرض الملف</button>
        </div>

      </div>
    </div>
  );
}