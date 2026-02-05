import React, { useState } from 'react';
import './Marketplace.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WasteCard from '../components/WasteCard';
import FilterSidebar from '../components/FilterSidebar';

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // بيانات تجريبية للمخلفات
  const wasteItems = [
    {
      id: 1,
      title: 'بلاستيك PET',
      category: 'بلاستيك',
      quantity: '5 طن',
      price: '3000 جنيه/طن',
      location: 'القاهرة',
      company: 'مصنع النور للبلاستيك',
      image: '/api/placeholder/300/200',
      description: 'بلاستيك PET نظيف جاهز لإعادة التدوير',
      date: '2024-02-01'
    },
    {
      id: 2,
      title: 'خشب معاد التدوير',
      category: 'خشب',
      quantity: '10 طن',
      price: '2000 جنيه/طن',
      location: 'الإسكندرية',
      company: 'مصنع الأخشاب المصرية',
      image: '/api/placeholder/300/200',
      description: 'خشب من مخلفات التصنيع قابل للاستخدام',
      date: '2024-02-02'
    },
    {
      id: 3,
      title: 'معادن مختلطة',
      category: 'معادن',
      quantity: '3 طن',
      price: '8000 جنيه/طن',
      location: 'الجيزة',
      company: 'شركة الحديد والصلب',
      image: '/api/placeholder/300/200',
      description: 'معادن متنوعة من عمليات التصنيع',
      date: '2024-02-03'
    },
    {
      id: 4,
      title: 'كرتون وورق',
      category: 'ورق',
      quantity: '8 طن',
      price: '1500 جنيه/طن',
      location: 'القاهرة',
      company: 'مصنع التعبئة والتغليف',
      image: '/api/placeholder/300/200',
      description: 'كرتون نظيف من مخلفات التعبئة',
      date: '2024-02-04'
    },
    {
      id: 5,
      title: 'زجاج شفاف',
      category: 'زجاج',
      quantity: '4 طن',
      price: '1000 جنيه/طن',
      location: 'الإسكندرية',
      company: 'مصنع الزجاج الحديث',
      image: '/api/placeholder/300/200',
      description: 'زجاج شفاف قابل لإعادة الصهر',
      date: '2024-02-05'
    },
    {
      id: 6,
      title: 'نسيج قطني',
      category: 'نسيج',
      quantity: '2 طن',
      price: '4000 جنيه/طن',
      location: 'المحلة الكبرى',
      company: 'مصانع الغزل والنسيج',
      image: '/api/placeholder/300/200',
      description: 'بقايا قماش قطني من عمليات القص',
      date: '2024-02-06'
    }
  ];

  const categories = ['الكل', 'بلاستيك', 'معادن', 'ورق', 'زجاج', 'خشب', 'نسيج', 'كيماويات'];

  const filteredItems = wasteItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="marketplace-page">
      <Navbar />
      
      <div className="marketplace-container">
        {/* Header Section */}
        <div className="marketplace-header">
          <div className="header-content">
            <h1>سوق المخلفات الصناعية</h1>
            <p>اكتشف الفرص المتاحة وحوّل المخلفات إلى موارد قيمة</p>
          </div>
          
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="ابحث عن المخلفات أو الشركات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </div>
            
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter"></i>
              فلاتر
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="marketplace-content">
          {/* Sidebar Filters */}
          <FilterSidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showFilters={showFilters}
          />

          {/* Products Grid */}
          <div className="products-section">
            <div className="results-header">
              <h2>النتائج ({filteredItems.length})</h2>
              <div className="sort-options">
                <select>
                  <option>الأحدث</option>
                  <option>الأقل سعراً</option>
                  <option>الأعلى سعراً</option>
                  <option>الأقرب جغرافياً</option>
                </select>
              </div>
            </div>

            <div className="waste-grid">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <WasteCard key={item.id} waste={item} />
                ))
              ) : (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>لا توجد نتائج</h3>
                  <p>جرب تغيير معايير البحث</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;