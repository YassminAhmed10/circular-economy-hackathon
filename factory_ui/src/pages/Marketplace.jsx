import React, { useState, useEffect } from 'react';
import './Marketplace.css';
import { FiSearch, FiMapPin, FiPackage, FiCheckCircle, FiEye } from 'react-icons/fi';
import { MdRecycling } from 'react-icons/md';
import { GiWoodPile, GiGlassShot } from 'react-icons/gi';
import { BsFileText, BsBoxSeam } from 'react-icons/bs';
import { FaIndustry } from 'react-icons/fa';
import { RiTShirtLine } from 'react-icons/ri';
import { useNavigate, useLocation } from 'react-router-dom';

// ── استيراد الصور المحلية ──
import paperWasteImage    from '../assets/مخلفات الورق.png';
import plasticWasteImage  from '../assets/مخلفات البلاستيك.png';
import woodWasteImage     from '../assets/مخلفات الخشب.png';
import metalWasteImage    from '../assets/مخلفات المعادن.png';
import glassWasteImage    from '../assets/مخلفات الزجاج.png';
import textileWasteImage  from '../assets/مخلفات النسيج.png';
import chemicalsImg       from '../assets/Chemicals.png';
import mineralsImg        from '../assets/Minerals.png';
import electronicsImg     from '../assets/Electronics .png';   // لاحظ المسافة

const Marketplace = ({ user }) => {
  const navigate  = useNavigate();
  const location  = useLocation();                              // ← لقراءة URL params

  // ── قراءة ?category= من الـ URL ──
  const getInitialCategory = () => {
    const params = new URLSearchParams(location.search);
    const cat    = params.get('category');
    if (!cat) return 'الكل';
    // الفئات المدعومة
    const validCats = ['بلاستيك','معادن','ورق','زجاج','خشب','نسيج','كيماويات','إلكترونيات'];
    return validCats.includes(cat) ? cat : 'الكل';
  };

  const [selectedCategory,  setSelectedCategory]  = useState(getInitialCategory);
  const [searchTerm,        setSearchTerm]        = useState('');
  const [sortBy,            setSortBy]            = useState('الأحدث');
  const [priceRange,        setPriceRange]        = useState([0, 10000]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTypes,     setSelectedTypes]     = useState([]);

  // ── تحديث الفئة لو تغيّر الـ URL من الخارج ──
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat    = params.get('category');
    if (cat) {
      const validCats = ['بلاستيك','معادن','ورق','زجاج','خشب','نسيج','كيماويات','إلكترونيات'];
      if (validCats.includes(cat)) {
        setSelectedCategory(cat);
        setSelectedTypes([]);           // reset sub-types عند تغيير الفئة
      }
    }
  }, [location.search]);

  // ── دالة الصورة لكل فئة (صور محلية + fallback) ──
  const getImageForCategory = (category) => {
    switch(category) {
      case 'ورق':         return paperWasteImage;
      case 'بلاستيك':     return plasticWasteImage;
      case 'خشب':         return woodWasteImage;
      case 'معادن':       return metalWasteImage;
      case 'زجاج':        return glassWasteImage;
      case 'نسيج':        return textileWasteImage;
      case 'كيماويات':    return chemicalsImg;
      case 'إلكترونيات':  return electronicsImg;
      default:            return plasticWasteImage;
    }
  };

  const plasticTypes = ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Other'];
  const metalTypes   = ['حديد', 'ألومنيوم', 'نحاس', 'ستيل', 'مختلط'];
  const paperTypes   = ['كرتون', 'ورق أبيض', 'ورق جرائد', 'ورق مختلط'];

  const wasteItems = [
    {
      id: 1,
      title: 'بلاستيك PET',
      category: 'بلاستيك',
      subType: 'PET',
      quantity: '5 طن',
      price: '3,000',
      location: 'القاهرة',
      company: 'مصنع النور للبلاستيك',
      description: 'بلاستيك PET نظيف جاهز لإعادة التدوير، مناسبة لمصانع إعادة التدوير وإنتاج حبيبات بلاستيك جديدة',
      date: 'منذ يومين',
      verified: true,
      sellerRating: 4.8,
      views: 245,
      distance: '5 كم',
      details: { type:'PET', purity:'95%', packaging:'بالات مكبوسة', availability:'متوفر فوراً', minOrder:'1 طن', payment:'تحويل بنكي أو نقدي', delivery:'متاح' }
    },
    {
      id: 2,
      title: 'خشب معاد التدوير',
      category: 'خشب',
      subType: 'طبيعي',
      quantity: '10 طن',
      price: '2,000',
      location: 'الإسكندرية',
      company: 'مصنع الأخشاب المصرية',
      description: 'خشب من مخلفات التصنيع، قطع متنوعة الأحجام، صالح لصناعة الأثاث والألواح الخشبية',
      date: 'منذ 3 أيام',
      verified: true,
      sellerRating: 4.5,
      views: 187,
      distance: '15 كم',
      details: { type:'خشب طبيعي', thickness:'متنوعة', quality:'جيدة', availability:'متوفر فوراً', minOrder:'2 طن', payment:'نقدي', delivery:'متاح' }
    },
    {
      id: 3,
      title: 'معادن مختلطة',
      category: 'معادن',
      subType: 'مختلط',
      quantity: '3 طن',
      price: '8,000',
      location: 'الجيزة',
      company: 'شركة الحديد والصلب',
      description: 'معادن متنوعة من عمليات التصنيع: حديد، ألومنيوم، نحاس. جاهزة للصهر وإعادة التدوير',
      date: 'منذ 5 أيام',
      verified: false,
      sellerRating: 4.2,
      views: 89,
      distance: '8 كم',
      details: { type:'مختلطة', metals:'حديد، ألومنيوم، نحاس', purity:'90%', availability:'خلال أسبوع', minOrder:'500 كجم', payment:'تحويل بنكي', delivery:'يتطلب ترتيب' }
    },
    {
      id: 4,
      title: 'كرتون وورق',
      category: 'ورق',
      subType: 'كرتون',
      quantity: '8 طن',
      price: '1,500',
      location: 'القاهرة',
      company: 'مصنع التعبئة والتغليف',
      description: 'كرتون نظيف من مخلفات التعبئة والتغليف، مناسب لإعادة التدوير وإنتاج ورق جديد',
      date: 'منذ يوم',
      verified: true,
      sellerRating: 4.9,
      views: 312,
      distance: '3 كم',
      details: { type:'كرتون مموج', weight:'متوسط', condition:'جاف ونظيف', availability:'متوفر فوراً', minOrder:'1 طن', payment:'نقدي أو تحويل', delivery:'متاح' }
    },
    {
      id: 5,
      title: 'زجاج شفاف',
      category: 'زجاج',
      subType: 'شفاف',
      quantity: '4 طن',
      price: '1,000',
      location: 'الإسكندرية',
      company: 'مصنع الزجاج الحديث',
      description: 'زجاج شفاف نظيف، مكسور وقطع صغيرة، قابل لإعادة الصهر وتصنيع منتجات زجاجية جديدة',
      date: 'منذ 4 أيام',
      verified: true,
      sellerRating: 4.7,
      views: 156,
      distance: '12 كم',
      details: { type:'زجاج صودا-جير', color:'شفاف', purity:'98%', availability:'متوفر فوراً', minOrder:'500 كجم', payment:'نقدي', delivery:'متاح' }
    },
    {
      id: 6,
      title: 'نسيج قطني',
      category: 'نسيج',
      subType: 'قطن',
      quantity: '2 طن',
      price: '4,000',
      location: 'المحلة الكبرى',
      company: 'مصانع الغزل والنسيج',
      description: 'بقايا قماش قطني من عمليات القص والتفصيل، مناسبة لإعادة التدوير وصناعة الخيوط',
      date: 'منذ أسبوع',
      verified: false,
      sellerRating: 4.0,
      views: 78,
      distance: '25 كم',
      details: { type:'قطن 100%', color:'أبيض ومتنوع', quality:'جيد', availability:'خلال 3 أيام', minOrder:'200 كجم', payment:'تحويل بنكي', delivery:'يتم التوصيل' }
    },
    {
      id: 7,
      title: 'بلاستيك HDPE',
      category: 'بلاستيك',
      subType: 'HDPE',
      quantity: '4 طن',
      price: '3,500',
      location: 'السويس',
      company: 'شركة البلاستيك المتقدمة',
      description: 'بلاستيك HDPE عالي الجودة، مناسب لصناعة العبوات البلاستيكية والأنابيب',
      date: 'منذ 6 أيام',
      verified: true,
      sellerRating: 4.6,
      views: 198,
      distance: '30 كم',
      details: { type:'HDPE', purity:'96%', packaging:'بالات', availability:'متوفر فوراً', minOrder:'1 طن', payment:'تحويل بنكي', delivery:'متاح' }
    },
    {
      id: 8,
      title: 'خشب MDF',
      category: 'خشب',
      subType: 'MDF',
      quantity: '6 طن',
      price: '1,800',
      location: 'المنصورة',
      company: 'مصنع ألواح الخشب',
      description: 'ألواح MDF مستعملة، صالحة لإعادة التدوير وتصنيع الأثاث والألواح الجديدة',
      date: 'منذ يومين',
      verified: true,
      sellerRating: 4.4,
      views: 123,
      distance: '18 كم',
      details: { type:'MDF', thickness:'18 مم', condition:'جيد', availability:'متوفر فوراً', minOrder:'1 طن', payment:'نقدي', delivery:'متاح' }
    },
    {
      id: 9,
      title: 'حديد خردة',
      category: 'معادن',
      subType: 'حديد',
      quantity: '7 طن',
      price: '6,500',
      location: 'حلوان',
      company: 'مصنع الصلب المتكامل',
      description: 'حديد خردة من مخلفات البناء والتصنيع، جاهز لإعادة الصهر والتدوير',
      date: 'منذ 3 أيام',
      verified: true,
      sellerRating: 4.3,
      views: 167,
      distance: '10 كم',
      details: { type:'حديد', purity:'92%', packaging:'قطع كبيرة', availability:'متوفر فوراً', minOrder:'2 طن', payment:'نقدي', delivery:'متاح' }
    },
    {
      id: 10,
      title: 'ورق جرائد',
      category: 'ورق',
      subType: 'ورق جرائد',
      quantity: '5 طن',
      price: '1,200',
      location: 'الإسكندرية',
      company: 'دار الطباعة الحديثة',
      description: 'ورق جرائد نظيف، مناسب لإعادة التدوير وصناعة ورق التواليت والمناديل',
      date: 'منذ يوم',
      verified: true,
      sellerRating: 4.7,
      views: 189,
      distance: '7 كم',
      details: { type:'ورق جرائد', condition:'جاف ونظيف', quality:'جيد', availability:'متوفر فوراً', minOrder:'1 طن', payment:'نقدي', delivery:'متاح' }
    }
  ];

  const categories = [
    { name:'الكل',        icon:BsBoxSeam,    count:wasteItems.length },
    { name:'بلاستيك',    icon:MdRecycling,  count:wasteItems.filter(i=>i.category==='بلاستيك').length },
    { name:'معادن',      icon:FaIndustry,   count:wasteItems.filter(i=>i.category==='معادن').length },
    { name:'ورق',        icon:BsFileText,   count:wasteItems.filter(i=>i.category==='ورق').length },
    { name:'زجاج',       icon:GiGlassShot,  count:wasteItems.filter(i=>i.category==='زجاج').length },
    { name:'خشب',        icon:GiWoodPile,   count:wasteItems.filter(i=>i.category==='خشب').length },
    { name:'نسيج',       icon:RiTShirtLine, count:wasteItems.filter(i=>i.category==='نسيج').length },
  ];

  const locations = ['القاهرة','الإسكندرية','الجيزة','المحلة الكبرى','السويس','المنصورة','حلوان'];

  const getSubTypesForCategory = (cat) => {
    switch(cat) {
      case 'بلاستيك': return plasticTypes;
      case 'معادن':   return metalTypes;
      case 'ورق':     return paperTypes;
      default:        return [];
    }
  };

  const filteredItems = wasteItems.filter(item => {
    const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch   = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const itemPrice       = parseInt(item.price.replace(/,/g, ''));
    const matchesPrice    = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(item.location);
    const matchesType     = selectedTypes.length === 0     || selectedTypes.includes(item.subType);
    return matchesCategory && matchesSearch && matchesPrice && matchesLocation && matchesType;
  });

  const toggleLocation = (loc)  => setSelectedLocations(p => p.includes(loc)  ? p.filter(l=>l!==loc)  : [...p, loc]);
  const toggleType     = (type) => setSelectedTypes(p      => p.includes(type) ? p.filter(t=>t!==type) : [...p, type]);
  const viewDetails    = (id)   => navigate(`/waste-details/${id}`);

  // ── تغيير الفئة يُحدّث الـ URL أيضاً ──
  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    setSelectedTypes([]);
    if (catName === 'الكل') {
      navigate('/market', { replace: true });
    } else {
      navigate(`/market?category=${encodeURIComponent(catName)}`, { replace: true });
    }
  };

  return (
    <div className="marketplace-page" dir="rtl">

      {/* Hero */}
      <div className="marketplace-hero">
        <div className="hero-content">
          <h1>سوق المخلفات الصناعية</h1>
          <p>حوّل المخلفات إلى فرص تجارية واستفد من الاقتصاد الدائري</p>
          <div className="hero-search">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" size={20} />
              <input
                type="text"
                placeholder="ابحث عن نوع المخلفات أو اسم الشركة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="search-button">بحث</button>
          </div>
        </div>
      </div>

      <div className="marketplace-main">

        {/* Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3 className="filter-title">
              الفئات
              <span className="filter-count">{filteredItems.length} منتج</span>
            </h3>
            <div className="filter-options">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    className={`filter-option ${selectedCategory === cat.name ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.name)}
                  >
                    <div className="filter-option-content">
                      <Icon size={18} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="category-count">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedCategory !== 'الكل' && getSubTypesForCategory(selectedCategory).length > 0 && (
            <div className="filter-section">
              <h3 className="filter-title">النوع</h3>
              <div className="filter-options">
                {getSubTypesForCategory(selectedCategory).map((type) => (
                  <label key={type} className="checkbox-option">
                    <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="filter-section">
            <h3 className="filter-title">الموقع</h3>
            <div className="filter-options">
              {locations.map((loc) => (
                <label key={loc} className="checkbox-option">
                  <input type="checkbox" checked={selectedLocations.includes(loc)} onChange={() => toggleLocation(loc)} />
                  <span>{loc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">نطاق السعر (ج/طن)</h3>
            <div className="price-range">
              <div className="price-values">
                <span>{priceRange[0].toLocaleString()} ج</span>
                <span> - </span>
                <span>{priceRange[1].toLocaleString()} ج</span>
              </div>
              <input
                type="range" min="0" max="10000" step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="price-slider"
              />
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>من</label>
                  <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value)||0, priceRange[1]])} />
                </div>
                <div className="price-input-group">
                  <label>إلى</label>
                  <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)||10000])} />
                </div>
              </div>
            </div>
          </div>

          <button
            className="reset-filters"
            onClick={() => {
              setSelectedCategory('الكل');
              setSelectedLocations([]);
              setSelectedTypes([]);
              setPriceRange([0, 10000]);
              setSearchTerm('');
              navigate('/market', { replace: true });
            }}
          >
            <FiSearch size={16} />
            إعادة تعيين الفلاتر
          </button>
        </aside>

        {/* Content */}
        <div className="marketplace-content">
          <div className="results-header">
            <div className="results-count">
              <h2>المنتجات المتاحة</h2>
              <div className="stats">
                <span className="count-badge"><FiPackage size={14} />{filteredItems.length} منتج</span>
                <span className="category-badge">{selectedCategory === 'الكل' ? 'جميع الفئات' : selectedCategory}</span>
              </div>
            </div>
            <div className="results-controls">
              <div className="sort-container">
                <label>ترتيب حسب:</label>
                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="الأحدث">الأحدث</option>
                  <option value="الأقل سعراً">الأقل سعراً</option>
                  <option value="الأعلى سعراً">الأعلى سعراً</option>
                  <option value="الأقرب جغرافياً">الأقرب جغرافياً</option>
                  <option value="الأعلى تقييماً">الأعلى تقييماً</option>
                </select>
              </div>
            </div>
          </div>

          <div className="waste-cards-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item.id} className="waste-card">
                  <div className="card-header">
                    <div className="card-category-badge">{item.category}</div>
                    <div className="card-actions">
                      {item.verified && (
                        <div className="verified-badge" title="موثق من المنصة">
                          <FiCheckCircle size={14} /><span>موثق</span>
                        </div>
                      )}
                      <div className="view-count" title="عدد المشاهدات">
                        <FiEye size={14} /><span>{item.views}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-image">
                    <img
                      src={getImageForCategory(item.category)}
                      alt={item.title}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300/f1f5f9/64748b?text=ECOv'; }}
                    />
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{item.title}</h3>
                    <div className="card-subtitle">
                      <span className="company-name">{item.company}</span>
                      <div className="rating">★ {item.sellerRating}</div>
                    </div>
                    <p className="card-description">{item.description}</p>
                    <div className="card-details">
                      <div className="detail-item" title="الكمية المتاحة">
                        <FiPackage size={16} /><span>{item.quantity}</span>
                      </div>
                      <div className="detail-item" title="الموقع">
                        <FiMapPin size={16} /><span>{item.location}</span><small>({item.distance})</small>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="price-section">
                        <div className="price-info">
                          <span className="price-label">السعر للطن</span>
                          <span className="price-value">{item.price} جنيه</span>
                        </div>
                        <div className="date-posted">{item.date}</div>
                      </div>
                      <div className="action-buttons">
                        <button className="view-details-btn" onClick={() => viewDetails(item.id)}>
                          عرض التفاصيل
                        </button>
                        {user && (
                          <button className="contact-btn">تواصل مع البائع</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon"><FiSearch size={64} /></div>
                <h3>لا توجد نتائج</h3>
                <p>جرب تغيير معايير البحث أو الفئة المختارة</p>
                <button
                  className="reset-search-btn"
                  onClick={() => { setSelectedCategory('الكل'); setSearchTerm(''); setSelectedLocations([]); setSelectedTypes([]); navigate('/market', { replace:true }); }}
                >
                  عرض جميع المنتجات
                </button>
              </div>
            )}
          </div>

          {filteredItems.length > 0 && (
            <div className="pagination">
              <button className="page-btn disabled">السابق</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <span className="page-dots">...</span>
              <button className="page-btn">10</button>
              <button className="page-btn">التالي</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;