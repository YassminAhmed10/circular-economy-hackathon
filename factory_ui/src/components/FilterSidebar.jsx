import React, { useState } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ categories, selectedCategory, onCategoryChange, showFilters }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [quantityRange, setQuantityRange] = useState({ min: '', max: '' });

  const locations = [
    'القاهرة',
    'الإسكندرية',
    'الجيزة',
    'الشرقية',
    'الدقهلية',
    'القليوبية',
    'المنوفية',
    'البحيرة'
  ];

  const handleLocationToggle = (location) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const handleReset = () => {
    onCategoryChange('الكل');
    setPriceRange({ min: '', max: '' });
    setSelectedLocations([]);
    setQuantityRange({ min: '', max: '' });
  };

  return (
    <div className={`filter-sidebar ${showFilters ? 'show' : ''}`}>
      <div className="filter-header">
        <h3>
          <i className="fas fa-filter"></i>
          الفلاتر
        </h3>
        <button className="reset-btn" onClick={handleReset}>
          إعادة تعيين
        </button>
      </div>

      {/* Categories Filter */}
      <div className="filter-section">
        <h4>الفئات</h4>
        <div className="category-list">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-item ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              <span>{category}</span>
              {selectedCategory === category && (
                <i className="fas fa-check"></i>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="filter-section">
        <h4>الموقع الجغرافي</h4>
        <div className="location-list">
          {locations.map((location, index) => (
            <label key={index} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => handleLocationToggle(location)}
              />
              <span className="checkmark"></span>
              <span className="label-text">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h4>نطاق السعر (جنيه/طن)</h4>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="من"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="إلى"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>
      </div>

      {/* Quantity Range Filter */}
      <div className="filter-section">
        <h4>الكمية المتاحة (طن)</h4>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="من"
            value={quantityRange.min}
            onChange={(e) => setQuantityRange({ ...quantityRange, min: e.target.value })}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="إلى"
            value={quantityRange.max}
            onChange={(e) => setQuantityRange({ ...quantityRange, max: e.target.value })}
          />
        </div>
      </div>

      {/* Apply Button */}
      <button className="apply-filters-btn">
        <i className="fas fa-check"></i>
        تطبيق الفلاتر
      </button>
    </div>
  );
};

export default FilterSidebar;