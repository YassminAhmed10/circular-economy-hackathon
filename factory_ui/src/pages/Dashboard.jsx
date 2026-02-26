// src/pages/Dashboard.js - Three‑column full width + fixed arrows + remove pending KPI + keep pending box

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, DollarSign, Clock, CheckCircle2, AlertCircle,
  Plus, Eye, Users, TrendingUp, Clock3, Award,
  ArrowRight, X, MessageSquare,
  Building2, Star, ShoppingCart, Bell,
  Zap, Settings, ChevronLeft, ChevronRight
} from 'lucide-react'
import './Dashboard.css'

// ═══════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════
const T = {
  ar: {
    welcome:'مرحباً', tons:'طن', egp:'ج',
    totalRevenue:'إجمالي الإيرادات', wasteOffered:'المخلفات المعروضة',
    pendingOrders:'طلبات معلّقة', completionRate:'معدل الإتمام', needsReply:'يحتاج رد',
    monthlyRevenue:'الإيرادات الشهرية', last6months:'آخر 6 أشهر',
    vsLastPeriod:'▲ 18.3% عن الفترة السابقة',
    weeklyViews:'مشاهدات الإعلانات (آخر 7 أيام)', total:'إجمالي',
    recentActivity:'النشاط الأخير', viewAll:'عرض الكل',
    completed:'✓ مكتمل', pending:'⏳ معلّق',
    wasteBreakdown:'توزيع المخلفات',
    performance:'مؤشرات الأداء', details:'تفاصيل',
    completionDeals:'معدل إتمام الصفقات', quickReply:'نسبة الرد السريع',
    buyerSatisfaction:'رضا المشترين', descAccuracy:'دقة وصف المنتجات',
    pendingAlertTitle:'طلبات تنتظر ردك',
    pendingAlertDesc:'الرد السريع يرفع تقييمك ويزيد فرص البيع',
    reviewOrders:'مراجعة الطلبات', myListingsTitle:'إعلاناتي',
    product:'المنتج', category:'الفئة', quantity:'الكمية',
    pricePerTon:'السعر/طن', views:'المشاهدات', offers:'العروض',
    status:'الحالة', published:'نُشر', action:'إجراء',
    edit:'تعديل', delete:'حذف',
    activeListings:'إعلانات نشطة', suspendedListings:'إعلانات معلّقة',
    totalOffers:'إجمالي العروض', totalViews:'إجمالي المشاهدات',
    viewsLast7:'مشاهدات آخر 7 أيام',
    activeTag:'● نشط', suspendedTag:'⏸ معلّق',
    avgDealValue:'متوسط قيمة الصفقة', daysSinceLastSale:'أيام منذ آخر بيع',
    repeatBuyers:'مشترون متكررون', topDeal:'أعلى صفقة',
    topSelling:'أفضل الفئات مبيعاً', byRevenue:'حسب الإيراد',
    monthlyDeals:'عدد الصفقات شهرياً', totalDeals:'إجمالي',
    deal:'صفقة', export:'تصدير', analyticsSummary:'ملخص التحليلات',
    days:['أح','إث','ث','أر','خ','ج','س'],
    months:{ يوليو:'يوليو', أغسطس:'أغسطس', سبتمبر:'سبتمبر', أكتوبر:'أكتوبر', نوفمبر:'نوفمبر', ديسمبر:'ديسمبر' },
    incomingReq:'طلبات الشراء الواردة', incomingDesc:'مصانع طلبت شراء منتجاتك من السوق',
    accept:'قبول', reject:'رفض', contact:'تواصل',
    reqProduct:'المنتج المطلوب', reqQty:'الكمية المطلوبة',
    offeredPrice:'السعر المعروض', reqTime:'وقت الطلب',
    accepted:'✓ مقبول', rejected:'✗ مرفوض', newBadge:'جديد',
    noReqs:'لا توجد طلبات حالياً', noReqsSub:'ستظهر هنا طلبات المصانع',
    notifications:'الإشعارات', markAll:'قراءة الكل', today:'اليوم', earlier:'سابقاً',
    noNotifs:'لا توجد إشعارات',
    prev:'السابق', next:'التالي', reqOf:'من',
  },
  en: {
    welcome:'Welcome', tons:'ton', egp:'EGP',
    totalRevenue:'Total Revenue', wasteOffered:'Waste Offered',
    pendingOrders:'Pending Orders', completionRate:'Completion Rate', needsReply:'Needs Reply',
    monthlyRevenue:'Monthly Revenue', last6months:'Last 6 months',
    vsLastPeriod:'▲ 18.3% vs last period',
    weeklyViews:'Ad Views (Last 7 days)', total:'Total',
    recentActivity:'Recent Activity', viewAll:'View All',
    completed:'✓ Completed', pending:'⏳ Pending',
    wasteBreakdown:'Waste Breakdown',
    performance:'Performance Indicators', details:'Details',
    completionDeals:'Deal Completion Rate', quickReply:'Quick Reply Rate',
    buyerSatisfaction:'Buyer Satisfaction', descAccuracy:'Description Accuracy',
    pendingAlertTitle:'Orders awaiting your reply',
    pendingAlertDesc:'Quick replies boost your rating and sales',
    reviewOrders:'Review Orders', myListingsTitle:'My Listings',
    product:'Product', category:'Category', quantity:'Quantity',
    pricePerTon:'Price/ton', views:'Views', offers:'Offers',
    status:'Status', published:'Published', action:'Action',
    edit:'Edit', delete:'Delete',
    activeListings:'Active Listings', suspendedListings:'Suspended',
    totalOffers:'Total Offers', totalViews:'Total Views',
    viewsLast7:'Views last 7 days',
    activeTag:'● Active', suspendedTag:'⏸ Suspended',
    avgDealValue:'Avg Deal Value', daysSinceLastSale:'Days Since Last Sale',
    repeatBuyers:'Repeat Buyers', topDeal:'Top Deal',
    topSelling:'Top Selling Categories', byRevenue:'By Revenue',
    monthlyDeals:'Monthly Deals', totalDeals:'Total',
    deal:'deals', export:'Export', analyticsSummary:'Analytics Summary',
    days:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    months:{ يوليو:'July', أغسطس:'Aug', سبتمبر:'Sep', أكتوبر:'Oct', نوفمبر:'Nov', ديسمبر:'Dec' },
    incomingReq:'Incoming Purchase Requests', incomingDesc:'Factories requesting to buy your products',
    accept:'Accept', reject:'Reject', contact:'Contact',
    reqProduct:'Requested Product', reqQty:'Requested Qty',
    offeredPrice:'Offered Price', reqTime:'Request Time',
    accepted:'✓ Accepted', rejected:'✗ Rejected', newBadge:'New',
    noReqs:'No requests yet', noReqsSub:'Factory purchase requests will appear here',
    notifications:'Notifications', markAll:'Mark all read', today:'Today', earlier:'Earlier',
    noNotifs:'No notifications',
    prev:'Prev', next:'Next', reqOf:'of',
  }
}

// ═══════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════
const MONTHLY_REV = [
  { m:'يوليو',   v:42000, deals:8  }, { m:'أغسطس',  v:58000, deals:11 },
  { m:'سبتمبر', v:51000, deals:9  }, { m:'أكتوبر',  v:67000, deals:13 },
  { m:'نوفمبر',  v:74000, deals:15 }, { m:'ديسمبر', v:87240, deals:18 },
]
const WASTE_BREAKDOWN = [
  { ar:'بلاستيك', en:'Plastic', tons:5.2, pct:38, rev:15600, color:'#3b82f6' },
  { ar:'معادن',   en:'Metals',  tons:3.1, pct:23, rev:20150, color:'#ca8a04' },
  { ar:'ورق',     en:'Paper',   tons:2.8, pct:21, rev:4200,  color:'#db2777' },
  { ar:'خشب',     en:'Wood',    tons:1.4, pct:10, rev:2520,  color:'#16a34a' },
  { ar:'أخرى',    en:'Other',   tons:1.1, pct:8,  rev:2200,  color:'#6b7280' },
]
const WEEKLY_VIEWS = [45,78,52,91,63,88,112]
const ACTIVITIES = [
  { id:1, ar:'بيع بلاستيك PET',  en:'Sell PET Plastic',  buyerAr:'مصنع إعادة التدوير الأخضر', buyerEn:'Green Recycling Factory', qtyAr:'500 كجم', qtyEn:'500 kg', price:3500,  timeAr:'منذ ساعتين', timeEn:'2h ago',    status:'completed' },
  { id:2, ar:'طلب زيوت مستعملة', en:'Used Oil Request',   buyerAr:'شركة الطاقة المتجددة',      buyerEn:'Renewable Energy Co.',    qtyAr:'200 لتر', qtyEn:'200 L',  price:4000,  timeAr:'منذ 5 ساعات',timeEn:'5h ago',    status:'pending'   },
  { id:3, ar:'بيع كرتون',         en:'Sell Cardboard',     buyerAr:'مصنع الورق المتحد',          buyerEn:'United Paper Factory',    qtyAr:'1 طن',   qtyEn:'1 ton',  price:2000,  timeAr:'أمس',         timeEn:'Yesterday', status:'completed' },
  { id:4, ar:'عرض حديد خردة',    en:'Scrap Iron Offer',   buyerAr:'شركة الصلب المصرية',         buyerEn:'Egyptian Steel Co.',      qtyAr:'3 طن',   qtyEn:'3 tons', price:19500, timeAr:'منذ يومين',  timeEn:'2d ago',    status:'pending'   },
  { id:5, ar:'بيع زجاج شفاف',    en:'Sell Clear Glass',   buyerAr:'مصنع الزجاج الحديث',         buyerEn:'Modern Glass Factory',    qtyAr:'400 كجم',qtyEn:'400 kg', price:1200,  timeAr:'منذ 3 أيام', timeEn:'3d ago',    status:'completed' },
]
const LISTINGS = [
  { id:1, ar:'بلاستيك PET',catAr:'بلاستيك',en:'PET Plastic', catEn:'Plastic', qtyAr:'5 طن', qtyEn:'5 ton', price:3000, views:245, offers:3, status:'active',  ageAr:'منذ يومين', ageEn:'2d ago' },
  { id:2, ar:'كرتون نظيف', catAr:'ورق',    en:'Cardboard',    catEn:'Paper',   qtyAr:'8 طن', qtyEn:'8 ton', price:1500, views:312, offers:5, status:'active',  ageAr:'منذ يوم',   ageEn:'1d ago' },
  { id:3, ar:'حديد خردة',  catAr:'معادن',  en:'Scrap Iron',   catEn:'Metals',  qtyAr:'3 طن', qtyEn:'3 ton', price:6500, views:89,  offers:1, status:'pending', ageAr:'منذ 5 أيام',ageEn:'5d ago' },
  { id:4, ar:'خشب MDF',    catAr:'خشب',    en:'MDF Wood',     catEn:'Wood',    qtyAr:'6 طن', qtyEn:'6 ton', price:1800, views:123, offers:2, status:'active',  ageAr:'منذ 3 أيام',ageEn:'3d ago' },
  { id:5, ar:'زجاج شفاف',  catAr:'زجاج',   en:'Clear Glass',  catEn:'Glass',   qtyAr:'4 طن', qtyEn:'4 ton', price:2200, views:67,  offers:0, status:'pending', ageAr:'منذ 5 أيام',ageEn:'5d ago' },
]

const PURCHASE_REQS_INIT = [
  { id:1, factoryAr:'مصنع إعادة التدوير الأخضر',factoryEn:'Green Recycling Factory', locAr:'القاهرة',locEn:'Cairo',     productAr:'بلاستيك PET',productEn:'PET Plastic',    qtyAr:'2 طن',qtyEn:'2 tons', price:5800,  timeAr:'منذ 10 دقائق',timeEn:'10 min ago', rating:4.8, deals:24, status:'new',      msgAr:'نحتاج 2 طن من بلاستيك PET أسبوعياً، يمكن توقيع عقد طويل الأمد.', msgEn:'We need 2 tons of PET plastic weekly, open to a long-term contract.' },
  { id:2, factoryAr:'شركة الصلب المصرية',         factoryEn:'Egyptian Steel Co.',       locAr:'الإسكندرية',locEn:'Alexandria', productAr:'حديد خردة',  productEn:'Scrap Iron',    qtyAr:'5 طن',qtyEn:'5 tons', price:32000, timeAr:'منذ ساعة',    timeEn:'1h ago',    rating:4.5, deals:61, status:'new',      msgAr:'مهتمون بشراء حديد الخردة بشكل دوري كل شهر.',                        msgEn:'Interested in purchasing scrap iron on a monthly recurring basis.' },
  { id:3, factoryAr:'مصنع الورق المتحد',           factoryEn:'United Paper Factory',     locAr:'الجيزة',  locEn:'Giza',      productAr:'كرتون نظيف', productEn:'Clean Cardboard',qtyAr:'10 طن',qtyEn:'10 tons',price:14000, timeAr:'منذ 3 ساعات', timeEn:'3h ago',    rating:4.2, deals:38, status:'accepted', msgAr:'لدينا خط إنتاج جديد يحتاج كرتون بصفة منتظمة.',                       msgEn:'New production line requiring regular cardboard supply.' },
  { id:4, factoryAr:'مصنع الزجاج الحديث',          factoryEn:'Modern Glass Factory',     locAr:'بورسعيد', locEn:'Port Said', productAr:'زجاج شفاف',  productEn:'Clear Glass',   qtyAr:'3 طن',qtyEn:'3 tons', price:7200,  timeAr:'أمس',          timeEn:'Yesterday', rating:4.9, deals:82, status:'rejected', msgAr:'نريد زجاجاً بمواصفات محددة، يرجى التواصل لمعرفة التفاصيل.',          msgEn:'Need glass with specific specs, please contact for details.' },
]

const NOTIFS_INIT = [
  { id:1,  type:'purchase', unread:true,  today:true,  titleAr:'طلب شراء جديد',         titleEn:'New Purchase Request',   bodyAr:'مصنع إعادة التدوير الأخضر يريد شراء 2 طن بلاستيك PET',  bodyEn:'Green Recycling Factory wants to buy 2 tons PET plastic',   timeAr:'منذ 10 دقائق', timeEn:'10 min ago' },
  { id:2,  type:'message',  unread:true,  today:true,  titleAr:'رسالة جديدة',            titleEn:'New Message',            bodyAr:'شركة الصلب المصرية: متى يمكنك شحن الحديد؟',               bodyEn:'Egyptian Steel Co.: When can you ship the iron?',            timeAr:'منذ 30 دقيقة', timeEn:'30 min ago' },
  { id:3,  type:'offer',    unread:true,  today:true,  titleAr:'عرض سعر مقبول',          titleEn:'Offer Accepted',         bodyAr:'تم قبول عرضك على كرتون نظيف بسعر 14,000 ج',               bodyEn:'Your cardboard offer of 14,000 EGP was accepted',            timeAr:'منذ ساعة',     timeEn:'1h ago'     },
  { id:4,  type:'purchase', unread:true,  today:true,  titleAr:'طلب شراء جديد',         titleEn:'New Purchase Request',   bodyAr:'شركة الصلب المصرية تطلب 5 طن حديد خردة بـ 32,000 ج',     bodyEn:'Egyptian Steel Co. requests 5 tons scrap iron at 32,000 EGP', timeAr:'منذ ساعة',     timeEn:'1h ago'     },
  { id:5,  type:'deal',     unread:false, today:true,  titleAr:'تأكيد صفقة',             titleEn:'Deal Confirmed',         bodyAr:'تم تأكيد بيع 500 كجم PET لمصنع إعادة التدوير الأخضر',    bodyEn:'Sale of 500kg PET to Green Recycling Factory confirmed',     timeAr:'منذ 3 ساعات',  timeEn:'3h ago'     },
  { id:6,  type:'message',  unread:false, today:false, titleAr:'رسالة من مصنع الزجاج',  titleEn:'Message from Glass Co.', bodyAr:'مصنع الزجاج الحديث: هل لديك زجاج بمواصفات أخرى؟',        bodyEn:'Modern Glass Factory: Do you have glass with other specs?',  timeAr:'أمس',          timeEn:'Yesterday'  },
  { id:7,  type:'system',   unread:false, today:false, titleAr:'تحديث سياسات الجودة',    titleEn:'Quality Policy Update',  bodyAr:'تمت إضافة معايير جودة جديدة لفئة المعادن',                bodyEn:'New quality standards added for metals category',            timeAr:'منذ يومين',    timeEn:'2d ago'     },
  { id:8,  type:'rating',   unread:false, today:false, titleAr:'تقييم 5 نجوم',           titleEn:'5-Star Rating',          bodyAr:'حصلت على تقييم ممتاز من مصنع الزجاج الحديث',              bodyEn:'You received an excellent rating from Modern Glass Factory', timeAr:'منذ 3 أيام',   timeEn:'3d ago'     },
]

// ═══════════════════════════════════════════════════
// DONUT CHART
// ═══════════════════════════════════════════════════
function DonutChart({ data, size=130 }) {
  const cx=size/2, cy=size/2, r=size*0.34, stroke=size*0.13, circ=2*Math.PI*r
  let offset=0
  const slices=data.map(d=>{const len=(d.pct/100)*circ;const s={...d,dashOffset:circ*0.25-offset,len};offset+=len;return s})
  return (
    <svg width={size} height={size} style={{flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--db-prog)" strokeWidth={stroke}/>
      {slices.map((s,i)=>(<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={stroke} strokeDasharray={`${s.len} ${circ-s.len}`} strokeDashoffset={s.dashOffset} strokeLinecap="round"/>))}
      <text x={cx} y={cy-7} textAnchor="middle" style={{fontSize:size*0.11,fontWeight:900,fill:'var(--db-txt)',fontFamily:"'Cairo',sans-serif"}}>13.6</text>
      <text x={cx} y={cy+10} textAnchor="middle" style={{fontSize:size*0.075,fill:'var(--db-txt3)',fontFamily:"'Cairo',sans-serif"}}>طن</text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════
// NOTIFICATION PANEL
// ═══════════════════════════════════════════════════
const NOTIF_TYPE = {
  purchase: { bg:'rgba(5,150,105,.15)',  ic:'#059669', Icon:ShoppingCart },
  message:  { bg:'rgba(37,99,235,.14)', ic:'#2563eb', Icon:MessageSquare },
  offer:    { bg:'rgba(245,158,11,.14)',ic:'#d97706', Icon:Zap           },
  deal:     { bg:'rgba(5,150,105,.15)', ic:'#059669', Icon:CheckCircle2  },
  system:   { bg:'rgba(124,58,237,.14)',ic:'#7c3aed', Icon:Settings      },
  rating:   { bg:'rgba(245,158,11,.14)',ic:'#f59e0b', Icon:Star          },
}

function NotifPanel({ notifs, onClose, onMarkAll, t, ar }) {
  const todayNotifs   = notifs.filter(n=>n.today)
  const earlierNotifs = notifs.filter(n=>!n.today)
  const unread = notifs.filter(n=>n.unread).length

  return (
    <>
      <div className="db-notif-overlay" onClick={onClose}/>
      <div className="db-notif-panel">
        <div className="db-notif-hd">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span className="db-notif-hd-title">{t.notifications}</span>
            {unread>0 && (
              <span style={{padding:'2px 9px',background:'#ef4444',color:'#fff',borderRadius:99,fontSize:11,fontWeight:800}}>{unread}</span>
            )}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button className="db-notif-ft" style={{padding:0,border:'none',background:'none'}} onClick={onMarkAll}>
              <span style={{fontSize:11,fontWeight:700,color:'var(--db-green)',cursor:'pointer',fontFamily:"'Cairo',sans-serif"}}>{t.markAll}</span>
            </button>
            <button onClick={onClose} style={{padding:6,background:'var(--db-surface2)',border:'1px solid var(--db-border)',borderRadius:8,cursor:'pointer',display:'flex',color:'var(--db-txt3)',transition:'background .15s'}}>
              <X size={15}/>
            </button>
          </div>
        </div>

        <div className="db-notif-list">
          {notifs.length===0 ? (
            <div className="db-empty">
              <Bell size={36} color="var(--db-border2)" style={{margin:'0 auto 12px',display:'block'}}/>
              <div className="db-empty-ttl">{t.noNotifs}</div>
            </div>
          ) : (
            <>
              {todayNotifs.length>0 && (
                <>
                  <div className="db-notif-group">{t.today}</div>
                  {todayNotifs.map(n=>(<NotifItem key={n.id} n={n} ar={ar}/>))}
                </>
              )}
              {earlierNotifs.length>0 && (
                <>
                  <div className="db-notif-group">{t.earlier}</div>
                  {earlierNotifs.map(n=>(<NotifItem key={n.id} n={n} ar={ar}/>))}
                </>
              )}
            </>
          )}
        </div>

        <div className="db-notif-ft">
          <button onClick={onClose}>{ar?'عرض كل الإشعارات':'View all notifications'} →</button>
        </div>
      </div>
    </>
  )
}

function NotifItem({ n, ar }) {
  const cfg = NOTIF_TYPE[n.type] || NOTIF_TYPE.system
  const Ic  = cfg.Icon
  return (
    <div className={`db-ni ${n.unread?'unread':''}`}>
      <div className="db-ni-ico" style={{background:cfg.bg}}>
        <Ic size={16} color={cfg.ic}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div className="db-ni-title">{ar?n.titleAr:n.titleEn}</div>
        <div className="db-ni-body">{ar?n.bodyAr:n.bodyEn}</div>
        <div className="db-ni-time">{ar?n.timeAr:n.timeEn}</div>
      </div>
      {n.unread && <div className="db-ni-dot"/>}
    </div>
  )
}

// ═══════════════════════════════════════════════════
// PURCHASE REQUESTS CAROUSEL (مع أسهم صحيحة حسب اللغة)
// ═══════════════════════════════════════════════════
function PurchaseReqs({ t, ar, reqs, onStatus }) {
  const [idx, setIdx] = useState(0)
  const newCount = reqs.filter(r=>r.status==='new').length
  const total = reqs.length

  const prev = () => setIdx(i => (i - 1 + total) % total)
  const next = () => setIdx(i => (i + 1) % total)

  const req = reqs[idx]

  return (
    <div className="db-card">
      <div className="db-pr-hd-full">
        <div className="db-pr-hd-info">
          <div className="db-pr-hd-ico"><ShoppingCart size={18} color="#fff"/></div>
          <div>
            <div className="db-pr-hd-title">{t.incomingReq}</div>
            <div className="db-pr-hd-sub">{t.incomingDesc}</div>
          </div>
          {newCount>0 && (
            <span style={{padding:'3px 10px',background:'#ef4444',color:'#fff',borderRadius:99,fontSize:11,fontWeight:900,animation:'pulse 2s infinite'}}>{newCount} {t.newBadge}</span>
          )}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:12,color:'var(--db-txt3)',fontWeight:700,whiteSpace:'nowrap'}}>
            {idx+1} {t.reqOf} {total}
          </span>
          {/* الأزرار: في RTL، الزر الأول (على اليمين) ينفذ prev وله أيقونة لليمين، والثاني (على اليسار) ينفذ next وله أيقونة لليسار */}
          <button className="db-nav-btn" onClick={prev} disabled={total<=1}>
            {ar ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
          </button>
          <button className="db-nav-btn" onClick={next} disabled={total<=1}>
            {ar ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
          </button>
          <button className="db-cl" style={{whiteSpace:'nowrap'}}>{t.viewAll} <ArrowRight size={13}/></button>
        </div>
      </div>

      {total===0 ? (
        <div className="db-empty">
          <ShoppingCart size={34} color="var(--db-border2)" style={{margin:'0 auto 10px',display:'block'}}/>
          <div className="db-empty-ttl">{t.noReqs}</div>
          <div className="db-empty-sub">{t.noReqsSub}</div>
        </div>
      ) : (
        <div className={`db-pr-single ${req.status==='new'?'is-new':''}`}>
          <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
            {/* تغيير الصورة: استخدام picsum بدلاً من ui-avatars */}
            <img
              src={`https://picsum.photos/seed/${req.id}/46/46`}
              alt={ar?req.factoryAr:req.factoryEn}
              style={{width:46,height:46,borderRadius:12,objectFit:'cover',flexShrink:0,border:'2px solid var(--db-border)'}}
              onError={(e)=>{e.target.src='https://picsum.photos/46/46?random='+req.id;}}
            />
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                <span className="db-pr-name">{ar?req.factoryAr:req.factoryEn}</span>
                {req.status==='new'      && <span style={{padding:'2px 8px',background:'#dcfce7',color:'#059669',borderRadius:99,fontSize:10,fontWeight:900}}>{t.newBadge}</span>}
                {req.status==='accepted' && <span style={{padding:'2px 8px',background:'#dcfce7',color:'#059669',borderRadius:99,fontSize:10,fontWeight:900}}>{t.accepted}</span>}
                {req.status==='rejected' && <span style={{padding:'2px 8px',background:'#fee2e2',color:'#dc2626',borderRadius:99,fontSize:10,fontWeight:900}}>{t.rejected}</span>}
              </div>

              <div style={{display:'flex',gap:14,marginBottom:10,flexWrap:'wrap'}}>
                <span className="db-pr-meta"><Building2 size={11}/>{ar?req.locAr:req.locEn}</span>
                <span className="db-pr-meta"><Star size={11} color="#f59e0b"/>{req.rating} · {req.deals} {ar?'صفقة':'deals'}</span>
              </div>

              <div className="db-pr-msg">"{ar?req.msgAr:req.msgEn}"</div>

              <div className="db-pr-chips">
                {[
                  {lbl:t.reqProduct,  val:ar?req.productAr:req.productEn, c:'#3b82f6'},
                  {lbl:t.reqQty,      val:ar?req.qtyAr:req.qtyEn,         c:'#059669'},
                  {lbl:t.offeredPrice,val:`${req.price.toLocaleString()} ${t.egp}`,   c:'#d97706'},
                  {lbl:t.reqTime,     val:ar?req.timeAr:req.timeEn,        c:'#7c3aed'},
                ].map(chip=>(
                  <div key={chip.lbl} className="db-pr-chip">
                    <div className="db-pr-chip-lbl">{chip.lbl}</div>
                    <div className="db-pr-chip-val" style={{color:chip.c}}>{chip.val}</div>
                  </div>
                ))}
              </div>

              <div className="db-pr-actions">
                {req.status==='new' && <>
                  <button className="db-btn-green" style={{padding:'7px 16px',fontSize:13}} onClick={()=>onStatus(req.id,'accepted')}>
                    <CheckCircle2 size={14}/>{t.accept}
                  </button>
                  <button className="db-btn-danger" onClick={()=>onStatus(req.id,'rejected')}>
                    <X size={14}/>{t.reject}
                  </button>
                </>}
                <button className="db-btn-blue">
                  <MessageSquare size={13}/>{t.contact}
                </button>
              </div>
            </div>
          </div>

          {total > 1 && (
            <div style={{display:'flex',justifyContent:'center',gap:6,marginTop:16,paddingTop:12,borderTop:'1px solid var(--db-border)'}}>
              {reqs.map((_,i)=>(
                <button
                  key={i}
                  onClick={()=>setIdx(i)}
                  style={{
                    width: i===idx ? 20 : 8,
                    height:8, borderRadius:99,
                    background: i===idx ? 'var(--db-green)' : 'var(--db-border2)',
                    border:'none', cursor:'pointer', padding:0,
                    transition:'all .25s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════
// DASHBOARD MAIN
// ═══════════════════════════════════════════════════
export default function Dashboard({ user, lang='ar', dark=false, showNotif, setShowNotif }) {
  const navigate = useNavigate()
  const [reqs,   setReqs]   = useState(PURCHASE_REQS_INIT)
  const [notifs, setNotifs] = useState(NOTIFS_INIT)

  const t   = T[lang] || T.ar
  const ar  = lang === 'ar'
  const dir = ar ? 'rtl' : 'ltr'
  const name = user?.name || (ar?'أحمد محمد':'Ahmed Mohamed')
  const maxRev = Math.max(...MONTHLY_REV.map(d=>d.v))
  const pendingCount = ACTIVITIES.filter(a=>a.status==='pending').length
  const todayStr = new Date().toLocaleDateString(ar?'ar-EG':'en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

  const handleStatus  = (id,st) => setReqs(prev=>prev.map(r=>r.id===id?{...r,status:st}:r))
  const handleMarkAll = () => setNotifs(prev=>prev.map(n=>({...n,unread:false})))

  const rootCls = `db-root${dark?' db-dark':''}`

  const C = {
    revBar: dark ? {active:'linear-gradient(180deg,#10b981,#059669)',idle:'linear-gradient(180deg,rgba(167,243,208,.4),rgba(110,231,183,.3))'} : {active:'linear-gradient(180deg,#10b981,#059669)',idle:'linear-gradient(180deg,#a7f3d0,#6ee7b7)'},
    wkBar:  dark ? {active:'#10b981',idle:'rgba(187,247,208,.3)'} : {active:'#059669',idle:'#bbf7d0'},
  }

  return (
    <div className={rootCls} dir={dir}>
      {showNotif && (
        <NotifPanel
          notifs={notifs}
          t={t}
          ar={ar}
          onClose={() => setShowNotif(false)}
          onMarkAll={handleMarkAll}
        />
      )}
      <div className="db-body">
        <div className="db-hdr">
          <div>
            <h1>{t.welcome}، {name} 👋</h1>
            <p>{todayStr}</p>
          </div>
        </div>

        {/* KPIs - تم إزالة البطاقة الثالثة (طلبات معلّقة) */}
        <div className="db-kpis">
          {[
            {lbl:t.totalRevenue,  val:'87,240',           unit:t.egp,  chg:'▲ 12.5%', up:true,  Icon:DollarSign, bg:'#ecfdf5', ic:'#059669'},
            {lbl:t.wasteOffered,  val:'13.6',              unit:t.tons, chg:'▲ 2.1',   up:true,  Icon:Package,    bg:'#eff6ff', ic:'#2563eb'},
            // تم حذف البطاقة الثالثة (pendingOrders)
            {lbl:t.completionRate,val:'78',                unit:'%',    chg:'▲ 5%',    up:true,  Icon:TrendingUp, bg:'#f5f3ff', ic:'#7c3aed'},
          ].map(({lbl,val,unit,chg,up,Icon,bg,ic},i)=>{
            const bgAdj = dark ? (up?'rgba(5,150,105,.14)':'rgba(217,119,6,.14)') : (up?'#ecfdf5':'#fffbeb')
            const icoBg = dark ? 'rgba(255,255,255,.06)' : bg
            // نضيف فحصًا لوجود lbl لتجنب الأخطاء
            return (
              <div className="db-kpi" key={lbl} style={{animationDelay:`${i*.08}s`}}>
                <div className="db-kpi-top">
                  <div className="db-kpi-ico" style={{background:icoBg}}><Icon size={19} color={ic}/></div>
                  <span className="db-kpi-chg" style={{color:up?'#059669':'#d97706',background:bgAdj}}>{chg}</span>
                </div>
                <div className="db-kpi-val">{val}<span className="db-kpi-unit">{unit}</span></div>
                <div className="db-kpi-lbl">{lbl}</div>
              </div>
            )
          })}
        </div>

        {/* ═══ THREE‑COLUMN LAYOUT (FULL WIDTH) ═══ */}
        <div className="db-three-col">
          {lang === 'ar' ? (
            /* RTL order: right column (pending + waste + performance) first, then middle, then left (purchases/activity) */
            <>
              {/* العمود الأيمن (في RTL) - مع إبقاء بطاقة "طلبات تنتظر ردك" */}
              <div className="db-col-right">
                {/* بطاقة طلبات تنتظر ردك (مُبقاة) */}
                <div className="db-pending-card">
                  <div className="db-pending-header">
                    <div className="db-pending-icon">
                      <AlertCircle size={22} />
                    </div>
                    <div>
                      <div className="db-pending-title">{t.pendingAlertTitle}</div>
                      <div className="db-pending-count">{pendingCount}</div>
                    </div>
                  </div>
                  <div className="db-pending-desc">{t.pendingAlertDesc}</div>
                  <button className="db-pending-btn" onClick={()=>navigate('/orders')}>
                    {t.reviewOrders}
                  </button>
                </div>

                {/* 6. Waste Breakdown */}
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.wasteBreakdown}</h3>
                    <span style={{fontSize:11,color:'var(--db-txt4)'}}>13.6 {t.tons}</span>
                  </div>
                  <div style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:24,marginBottom:20}}>
                      <DonutChart data={WASTE_BREAKDOWN} size={150}/>
                      <div style={{display:'flex',flexWrap:'wrap',gap:10,flex:1}}>
                        {WASTE_BREAKDOWN.map(d=>(
                          <div key={d.ar} style={{display:'flex',alignItems:'center',gap:7,minWidth:'45%'}}>
                            <div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/>
                            <span style={{fontSize:12,color:'var(--db-txt2)',fontWeight:600}}>{ar?d.ar:d.en}</span>
                            <span style={{fontSize:11,color:'var(--db-txt4)',marginRight:'auto',paddingRight:4}}>{d.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {WASTE_BREAKDOWN.map(d=>(
                      <div key={d.ar} style={{marginBottom:10}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                          <span style={{fontSize:11,color:'var(--db-txt2)',fontWeight:600}}>{ar?d.ar:d.en}</span>
                          <span style={{fontSize:11,color:'var(--db-txt3)'}}>{d.tons} {t.tons}</span>
                        </div>
                        <div className="db-prog"><div className="db-prog-fill" style={{width:`${d.pct}%`,background:d.color}}/></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Performance */}
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.performance}</h3>
                    <button className="db-cl" onClick={()=>navigate('/analytics')}>{t.details} <ArrowRight size={13}/></button>
                  </div>
                  <div style={{padding:'14px 20px',display:'flex',flexDirection:'column',gap:16}}>
                    {[
                      {l:t.completionDeals,  v:78, c:'#059669'},
                      {l:t.quickReply,       v:92, c:'#2563eb'},
                      {l:t.buyerSatisfaction,v:88, c:'#7c3aed'},
                      {l:t.descAccuracy,     v:95, c:'#d97706'},
                    ].map(({l,v,c})=>(
                      <div key={l}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <span style={{fontSize:12,color:'var(--db-txt3)'}}>{l}</span>
                          <span style={{fontSize:13,fontWeight:800,color:c}}>{v}%</span>
                        </div>
                        <div className="db-prog"><div className="db-prog-fill" style={{width:`${v}%`,background:c}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* العمود الأوسط (بدون تغيير) */}
              <div className="db-col-middle">
                {/* 1. Monthly Revenue */}
                <div className="db-card">
                  <div className="db-ch">
                    <div>
                      <h3>{t.monthlyRevenue}</h3>
                      <div className="db-ch-sub">{t.last6months}</div>
                    </div>
                    <div style={{textAlign:ar?'left':'right'}}>
                      <div style={{fontSize:20,fontWeight:900,color:'var(--db-txt)'}}>379,240 <span style={{fontSize:12,color:'var(--db-txt3)'}}>{t.egp}</span></div>
                      <div style={{fontSize:12,fontWeight:700,color:'var(--db-green)'}}>{t.vsLastPeriod}</div>
                    </div>
                  </div>
                  <div style={{padding:'20px 20px 16px'}}>
                    <div style={{display:'flex',alignItems:'flex-end',gap:10,height:160,marginBottom:8}}>
                      {MONTHLY_REV.map((d,i)=>{
                        const isLast=i===MONTHLY_REV.length-1
                        const pct=(d.v/maxRev)*100
                        return (
                          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                            <div style={{fontSize:10,fontWeight:800,color:isLast?'var(--db-green)':'var(--db-txt4)'}}>{(d.v/1000).toFixed(0)}k</div>
                            <div style={{width:'100%',height:`${Math.max(pct,5)}%`,minHeight:6,borderRadius:'8px 8px 0 0',
                              background:isLast?C.revBar.active:C.revBar.idle,
                              position:'relative',transition:'height .5s ease',
                              boxShadow:isLast?'0 -2px 12px rgba(5,150,105,.4)':'none'}}>
                              {isLast&&<div style={{position:'absolute',top:-4,left:'50%',transform:'translateX(-50%)',width:8,height:8,borderRadius:'50%',background:'#059669',border:'2px solid var(--db-surface)',boxShadow:'0 0 0 3px rgba(5,150,105,.25)'}}/>}
                            </div>
                            <div style={{fontSize:10,color:'var(--db-txt4)',whiteSpace:'nowrap'}}>{t.months[d.m]||d.m}</div>
                          </div>
                        )
                      })}
                    </div>
                    <div style={{borderTop:'1px dashed var(--db-border2)',paddingTop:8,display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:10,color:'var(--db-txt4)'}}>0</span>
                      <span style={{fontSize:10,color:'var(--db-txt4)'}}>87,240 {t.egp}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Weekly Views */}
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.weeklyViews}</h3>
                    <span style={{fontSize:12,fontWeight:800,color:'var(--db-green)'}}>{t.total}: {WEEKLY_VIEWS.reduce((a,b)=>a+b,0)}</span>
                  </div>
                  <div style={{padding:'16px 20px 20px'}}>
                    <div style={{display:'flex',alignItems:'flex-end',gap:8,height:100}}>
                      {WEEKLY_VIEWS.map((v,i)=>{
                        const max=Math.max(...WEEKLY_VIEWS), isToday=i===6
                        return (
                          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                            <div style={{fontSize:9,fontWeight:700,color:isToday?'var(--db-green)':'var(--db-txt4)'}}>{v}</div>
                            <div style={{width:'100%',height:`${(v/max)*100}%`,minHeight:4,borderRadius:'5px 5px 0 0',background:isToday?C.wkBar.active:C.wkBar.idle,transition:'background .3s'}}/>
                            <span style={{fontSize:9,color:isToday?'var(--db-green)':'var(--db-txt4)',fontWeight:isToday?800:400}}>{t.days[i]}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. My Listings */}
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.myListingsTitle} ({LISTINGS.length})</h3>
                    <button className="db-btn-green" style={{padding:'7px 14px',fontSize:12}} onClick={()=>navigate('/list-waste')}>
                      <Plus size={13}/>{ar?'إعلان جديد':'New Listing'}
                    </button>
                  </div>
                  <div style={{overflowX:'auto'}}>
                    <table className="db-tbl">
                      <thead><tr>
                        <th>{t.product}</th><th>{t.category}</th><th>{t.quantity}</th>
                        <th>{t.pricePerTon}</th><th>{t.views}</th><th>{t.offers}</th>
                        <th>{t.status}</th><th>{t.published}</th><th>{t.action}</th>
                      </tr></thead>
                      <tbody>
                        {LISTINGS.map(l=>(
                          <tr key={l.id}>
                            <td style={{fontWeight:700,color:'var(--db-txt)'}}>{ar?l.ar:l.en}</td>
                            <td><span style={{padding:'2px 9px',background:'var(--db-chip)',borderRadius:99,fontSize:11,fontWeight:600,color:'var(--db-txt3)'}}>{ar?l.catAr:l.catEn}</span></td>
                            <td>{ar?l.qtyAr:l.qtyEn}</td>
                            <td style={{fontWeight:700,color:'var(--db-green)'}}>{l.price.toLocaleString()} {t.egp}</td>
                            <td><span style={{display:'flex',alignItems:'center',gap:4}}><Eye size={12} color="var(--db-txt4)"/>{l.views}</span></td>
                            <td><span className="badge" style={{background:l.offers>0?(dark?'rgba(5,150,105,.18)':'#ecfdf5'):'var(--db-chip)',color:l.offers>0?'#059669':'var(--db-txt3)'}}>{l.offers} {t.offers}</span></td>
                            <td><span className="badge" style={{background:l.status==='active'?(dark?'rgba(5,150,105,.18)':'#ecfdf5'):(dark?'rgba(217,119,6,.16)':'#fffbeb'),color:l.status==='active'?'#059669':'#d97706'}}>{l.status==='active'?t.activeTag:t.suspendedTag}</span></td>
                            <td style={{fontSize:11,color:'var(--db-txt4)'}}>{ar?l.ageAr:l.ageEn}</td>
                            <td>
                              <div style={{display:'flex',gap:6}}>
                                <button className="db-btn-ghost" style={{padding:'4px 10px',fontSize:11}}>{t.edit}</button>
                                <button className="db-btn-danger" style={{padding:'4px 10px',fontSize:11}}>{t.delete}</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* العمود الأيسر (في RTL) */}
              <div className="db-col-left">
                {/* 4. Purchase Requests Carousel */}
                <PurchaseReqs t={t} ar={ar} reqs={reqs} onStatus={handleStatus}/>

                {/* 5. Recent Activity */}
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.recentActivity}</h3>
                    <button className="db-cl" onClick={()=>navigate('/orders')}>{t.viewAll} <ArrowRight size={13}/></button>
                  </div>
                  {ACTIVITIES.map(a=>{
                    const isOk = a.status==='completed'
                    const icoBg = dark
                      ? (isOk?'rgba(5,150,105,.18)':'rgba(217,119,6,.16)')
                      : (isOk?'#ecfdf5':'#fffbeb')
                    return (
                      <div key={a.id} className="db-act">
                        <div className="db-act-ico" style={{background:icoBg}}>
                          {isOk?<CheckCircle2 size={16} color="#059669"/>:<Clock size={16} color="#d97706"/>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:700,color:'var(--db-txt)',marginBottom:2}}>{ar?a.ar:a.en}</div>
                          <div style={{fontSize:11,color:'var(--db-txt3)',marginBottom:3}}>{ar?a.buyerAr:a.buyerEn}</div>
                          <div style={{display:'flex',gap:8,fontSize:10,color:'var(--db-txt4)'}}>
                            <span>{ar?a.qtyAr:a.qtyEn}</span><span>·</span><span>{ar?a.timeAr:a.timeEn}</span>
                          </div>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
                          <span style={{fontSize:14,fontWeight:900,color:'var(--db-txt)'}}>{a.price.toLocaleString()} {t.egp}</span>
                          <span className="badge" style={{background:isOk?(dark?'rgba(5,150,105,.18)':'#ecfdf5'):(dark?'rgba(217,119,6,.16)':'#fffbeb'),color:isOk?'#059669':'#d97706'}}>
                            {isOk?t.completed:t.pending}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            /* LTR order: left column (purchases/activity) first, then middle, then right (pending + waste + performance) */
            <>
              {/* left column (in LTR) */}
              <div className="db-col-left">
                <PurchaseReqs t={t} ar={ar} reqs={reqs} onStatus={handleStatus}/>
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.recentActivity}</h3>
                    <button className="db-cl" onClick={()=>navigate('/orders')}>{t.viewAll} <ArrowRight size={13}/></button>
                  </div>
                  {ACTIVITIES.map(a=>{
                    const isOk = a.status==='completed'
                    const icoBg = dark
                      ? (isOk?'rgba(5,150,105,.18)':'rgba(217,119,6,.16)')
                      : (isOk?'#ecfdf5':'#fffbeb')
                    return (
                      <div key={a.id} className="db-act">
                        <div className="db-act-ico" style={{background:icoBg}}>
                          {isOk?<CheckCircle2 size={16} color="#059669"/>:<Clock size={16} color="#d97706"/>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:700,color:'var(--db-txt)',marginBottom:2}}>{ar?a.ar:a.en}</div>
                          <div style={{fontSize:11,color:'var(--db-txt3)',marginBottom:3}}>{ar?a.buyerAr:a.buyerEn}</div>
                          <div style={{display:'flex',gap:8,fontSize:10,color:'var(--db-txt4)'}}>
                            <span>{ar?a.qtyAr:a.qtyEn}</span><span>·</span><span>{ar?a.timeAr:a.timeEn}</span>
                          </div>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
                          <span style={{fontSize:14,fontWeight:900,color:'var(--db-txt)'}}>{a.price.toLocaleString()} {t.egp}</span>
                          <span className="badge" style={{background:isOk?(dark?'rgba(5,150,105,.18)':'#ecfdf5'):(dark?'rgba(217,119,6,.16)':'#fffbeb'),color:isOk?'#059669':'#d97706'}}>
                            {isOk?t.completed:t.pending}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* middle column */}
              <div className="db-col-middle">
                {/* 1. Monthly Revenue */}
                <div className="db-card">
                  <div className="db-ch">
                    <div>
                      <h3>{t.monthlyRevenue}</h3>
                      <div className="db-ch-sub">{t.last6months}</div>
                    </div>
                    <div style={{textAlign:ar?'left':'right'}}>
                      <div style={{fontSize:20,fontWeight:900,color:'var(--db-txt)'}}>379,240 <span style={{fontSize:12,color:'var(--db-txt3)'}}>{t.egp}</span></div>
                      <div style={{fontSize:12,fontWeight:700,color:'var(--db-green)'}}>{t.vsLastPeriod}</div>
                    </div>
                  </div>
                  <div style={{padding:'20px 20px 16px'}}>
                    <div style={{display:'flex',alignItems:'flex-end',gap:10,height:160,marginBottom:8}}>
                      {MONTHLY_REV.map((d,i)=>{
                        const isLast=i===MONTHLY_REV.length-1
                        const pct=(d.v/maxRev)*100
                        return (
                          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                            <div style={{fontSize:10,fontWeight:800,color:isLast?'var(--db-green)':'var(--db-txt4)'}}>{(d.v/1000).toFixed(0)}k</div>
                            <div style={{width:'100%',height:`${Math.max(pct,5)}%`,minHeight:6,borderRadius:'8px 8px 0 0',
                              background:isLast?C.revBar.active:C.revBar.idle,
                              position:'relative',transition:'height .5s ease',
                              boxShadow:isLast?'0 -2px 12px rgba(5,150,105,.4)':'none'}}>
                              {isLast&&<div style={{position:'absolute',top:-4,left:'50%',transform:'translateX(-50%)',width:8,height:8,borderRadius:'50%',background:'#059669',border:'2px solid var(--db-surface)',boxShadow:'0 0 0 3px rgba(5,150,105,.25)'}}/>}
                            </div>
                            <div style={{fontSize:10,color:'var(--db-txt4)',whiteSpace:'nowrap'}}>{t.months[d.m]||d.m}</div>
                          </div>
                        )
                      })}
                    </div>
                    <div style={{borderTop:'1px dashed var(--db-border2)',paddingTop:8,display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:10,color:'var(--db-txt4)'}}>0</span>
                      <span style={{fontSize:10,color:'var(--db-txt4)'}}>87,240 {t.egp}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Weekly Views */}
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.weeklyViews}</h3>
                    <span style={{fontSize:12,fontWeight:800,color:'var(--db-green)'}}>{t.total}: {WEEKLY_VIEWS.reduce((a,b)=>a+b,0)}</span>
                  </div>
                  <div style={{padding:'16px 20px 20px'}}>
                    <div style={{display:'flex',alignItems:'flex-end',gap:8,height:100}}>
                      {WEEKLY_VIEWS.map((v,i)=>{
                        const max=Math.max(...WEEKLY_VIEWS), isToday=i===6
                        return (
                          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                            <div style={{fontSize:9,fontWeight:700,color:isToday?'var(--db-green)':'var(--db-txt4)'}}>{v}</div>
                            <div style={{width:'100%',height:`${(v/max)*100}%`,minHeight:4,borderRadius:'5px 5px 0 0',background:isToday?C.wkBar.active:C.wkBar.idle,transition:'background .3s'}}/>
                            <span style={{fontSize:9,color:isToday?'var(--db-green)':'var(--db-txt4)',fontWeight:isToday?800:400}}>{t.days[i]}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. My Listings */}
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.myListingsTitle} ({LISTINGS.length})</h3>
                    <button className="db-btn-green" style={{padding:'7px 14px',fontSize:12}} onClick={()=>navigate('/list-waste')}>
                      <Plus size={13}/>{ar?'إعلان جديد':'New Listing'}
                    </button>
                  </div>
                  <div style={{overflowX:'auto'}}>
                    <table className="db-tbl">
                      <thead><tr>
                        <th>{t.product}</th><th>{t.category}</th><th>{t.quantity}</th>
                        <th>{t.pricePerTon}</th><th>{t.views}</th><th>{t.offers}</th>
                        <th>{t.status}</th><th>{t.published}</th><th>{t.action}</th>
                      </tr></thead>
                      <tbody>
                        {LISTINGS.map(l=>(
                          <tr key={l.id}>
                            <td style={{fontWeight:700,color:'var(--db-txt)'}}>{ar?l.ar:l.en}</td>
                            <td><span style={{padding:'2px 9px',background:'var(--db-chip)',borderRadius:99,fontSize:11,fontWeight:600,color:'var(--db-txt3)'}}>{ar?l.catAr:l.catEn}</span></td>
                            <td>{ar?l.qtyAr:l.qtyEn}</td>
                            <td style={{fontWeight:700,color:'var(--db-green)'}}>{l.price.toLocaleString()} {t.egp}</td>
                            <td><span style={{display:'flex',alignItems:'center',gap:4}}><Eye size={12} color="var(--db-txt4)"/>{l.views}</span></td>
                            <td><span className="badge" style={{background:l.offers>0?(dark?'rgba(5,150,105,.18)':'#ecfdf5'):'var(--db-chip)',color:l.offers>0?'#059669':'var(--db-txt3)'}}>{l.offers} {t.offers}</span></td>
                            <td><span className="badge" style={{background:l.status==='active'?(dark?'rgba(5,150,105,.18)':'#ecfdf5'):(dark?'rgba(217,119,6,.16)':'#fffbeb'),color:l.status==='active'?'#059669':'#d97706'}}>{l.status==='active'?t.activeTag:t.suspendedTag}</span></td>
                            <td style={{fontSize:11,color:'var(--db-txt4)'}}>{ar?l.ageAr:l.ageEn}</td>
                            <td>
                              <div style={{display:'flex',gap:6}}>
                                <button className="db-btn-ghost" style={{padding:'4px 10px',fontSize:11}}>{t.edit}</button>
                                <button className="db-btn-danger" style={{padding:'4px 10px',fontSize:11}}>{t.delete}</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* right column (in LTR) - مع إبقاء بطاقة "طلبات تنتظر ردك" */}
              <div className="db-col-right">
                {/* Pending Card */}
                <div className="db-pending-card">
                  <div className="db-pending-header">
                    <div className="db-pending-icon">
                      <AlertCircle size={22} />
                    </div>
                    <div>
                      <div className="db-pending-title">{t.pendingAlertTitle}</div>
                      <div className="db-pending-count">{pendingCount}</div>
                    </div>
                  </div>
                  <div className="db-pending-desc">{t.pendingAlertDesc}</div>
                  <button className="db-pending-btn" onClick={()=>navigate('/orders')}>
                    {t.reviewOrders}
                  </button>
                </div>

                {/* 6. Waste Breakdown */}
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.wasteBreakdown}</h3>
                    <span style={{fontSize:11,color:'var(--db-txt4)'}}>13.6 {t.tons}</span>
                  </div>
                  <div style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:24,marginBottom:20}}>
                      <DonutChart data={WASTE_BREAKDOWN} size={150}/>
                      <div style={{display:'flex',flexWrap:'wrap',gap:10,flex:1}}>
                        {WASTE_BREAKDOWN.map(d=>(
                          <div key={d.ar} style={{display:'flex',alignItems:'center',gap:7,minWidth:'45%'}}>
                            <div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/>
                            <span style={{fontSize:12,color:'var(--db-txt2)',fontWeight:600}}>{ar?d.ar:d.en}</span>
                            <span style={{fontSize:11,color:'var(--db-txt4)',marginRight:'auto',paddingRight:4}}>{d.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {WASTE_BREAKDOWN.map(d=>(
                      <div key={d.ar} style={{marginBottom:10}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                          <span style={{fontSize:11,color:'var(--db-txt2)',fontWeight:600}}>{ar?d.ar:d.en}</span>
                          <span style={{fontSize:11,color:'var(--db-txt3)'}}>{d.tons} {t.tons}</span>
                        </div>
                        <div className="db-prog"><div className="db-prog-fill" style={{width:`${d.pct}%`,background:d.color}}/></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Performance */}
                <div className="db-card">
                  <div className="db-ch">
                    <h3>{t.performance}</h3>
                    <button className="db-cl" onClick={()=>navigate('/analytics')}>{t.details} <ArrowRight size={13}/></button>
                  </div>
                  <div style={{padding:'14px 20px',display:'flex',flexDirection:'column',gap:16}}>
                    {[
                      {l:t.completionDeals,  v:78, c:'#059669'},
                      {l:t.quickReply,       v:92, c:'#2563eb'},
                      {l:t.buyerSatisfaction,v:88, c:'#7c3aed'},
                      {l:t.descAccuracy,     v:95, c:'#d97706'},
                    ].map(({l,v,c})=>(
                      <div key={l}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <span style={{fontSize:12,color:'var(--db-txt3)'}}>{l}</span>
                          <span style={{fontSize:13,fontWeight:800,color:c}}>{v}%</span>
                        </div>
                        <div className="db-prog"><div className="db-prog-fill" style={{width:`${v}%`,background:c}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>{/* end db-three-col */}
      </div>
    </div>
  )
}