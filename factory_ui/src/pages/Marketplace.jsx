import React, { useState, useEffect } from 'react';
import './Marketplace.css';
import { FiSearch, FiMapPin, FiPackage, FiCheckCircle, FiEye } from 'react-icons/fi';
import { MdRecycling } from 'react-icons/md';
import { GiWoodPile, GiGlassShot } from 'react-icons/gi';
import { BsFileText, BsBoxSeam } from 'react-icons/bs';
import { FaIndustry } from 'react-icons/fa';
import { RiTShirtLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

// استيراد الصور المحلية
import paperWasteImage from '../assets/مخلفات الورق.png';
import plasticWasteImage from '../assets/مخلفات البلاستيك.png';
import woodWasteImage from '../assets/مخلفات الخشب.png';
import metalWasteImage from '../assets/مخلفات المعادن.png';
import glassWasteImage from '../assets/مخلفات الزجاج.png';
import textileWasteImage from '../assets/مخلفات النسيج.png';

const API_BASE_URL = 'https://localhost:54464';

const Marketplace = ({ user }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wasteItems, setWasteItems] = useState([]);
    const [categories, setCategories] = useState([]);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('الأحدث');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    useEffect(() => {
        fetchWasteListings();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchWasteListings();
    }, [selectedCategory, searchTerm, sortBy]);

    const fetchWasteListings = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (selectedCategory !== 'الكل') {
                const categoryMap = {
                    'بلاستيك': 'plastic',
                    'معادن': 'metal',
                    'ورق': 'paper',
                    'زجاج': 'glass',
                    'خشب': 'wood',
                    'نسيج': 'textile',
                    'كيماويات': 'chemical',
                    'مطاط': 'rubber'
                };
                const englishCategory = categoryMap[selectedCategory];
                if (englishCategory) params.append('category', englishCategory);
            }

            if (searchTerm) params.append('search', searchTerm);

            if (sortBy === 'الأقل سعراً') {
                params.append('sortBy', 'price');
                params.append('sortDescending', 'false');
            } else if (sortBy === 'الأعلى سعراً') {
                params.append('sortBy', 'price');
                params.append('sortDescending', 'true');
            } else if (sortBy === 'الأحدث') {
                params.append('sortBy', 'date');
                params.append('sortDescending', 'true');
            }

            const url = `${API_BASE_URL}/api/Marketplace/waste-listings${params.toString() ? '?' + params.toString() : ''}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                const transformedItems = data.data.map(item => ({
                    id: item.id,
                    title: item.type,
                    category: getArabicCategory(item.category),
                    subType: item.typeEn,
                    quantity: `${item.amount} ${item.unit}`,
                    price: item.price.toLocaleString(),
                    location: item.location,
                    company: item.factoryName,
                    description: item.description,
                    date: getRelativeTime(item.createdAt),
                    verified: item.status === 'Active',
                    sellerRating: 4.5,
                    views: item.views || 0,
                    distance: 'غير محدد'
                }));

                setWasteItems(transformedItems);
                setError(null);
            } else {
                setError(data.message || 'فشل في تحميل البيانات');
            }
        } catch (err) {
            console.error('Error fetching waste listings:', err);
            setError('فشل في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Marketplace/categories`);
            const data = await response.json();

            if (data.success) {
                const categoryMap = {
                    'plastic': { name: 'بلاستيك', icon: MdRecycling },
                    'metal': { name: 'معادن', icon: FaIndustry },
                    'paper': { name: 'ورق', icon: BsFileText },
                    'glass': { name: 'زجاج', icon: GiGlassShot },
                    'wood': { name: 'خشب', icon: GiWoodPile },
                    'textile': { name: 'نسيج', icon: RiTShirtLine }
                };

                const transformedCategories = [
                    { name: 'الكل', icon: BsBoxSeam, count: wasteItems.length },
                    ...data.data.map(cat => ({
                        name: cat.name,
                        icon: categoryMap[cat.id]?.icon || BsBoxSeam,
                        count: cat.count
                    }))
                ];

                setCategories(transformedCategories);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            // Set default categories on error
            setCategories([
                { name: 'الكل', icon: BsBoxSeam, count: 0 },
                { name: 'بلاستيك', icon: MdRecycling, count: 0 },
                { name: 'معادن', icon: FaIndustry, count: 0 },
                { name: 'ورق', icon: BsFileText, count: 0 },
                { name: 'زجاج', icon: GiGlassShot, count: 0 },
                { name: 'خشب', icon: GiWoodPile, count: 0 },
                { name: 'نسيج', icon: RiTShirtLine, count: 0 }
            ]);
        }
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'منذ لحظات';
        if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
        if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
        if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
        return `منذ ${Math.floor(diffInSeconds / 604800)} أسبوع`;
    };

    const getArabicCategory = (englishCategory) => {
        const categoryMap = {
            'plastic': 'بلاستيك',
            'metal': 'معادن',
            'paper': 'ورق',
            'glass': 'زجاج',
            'wood': 'خشب',
            'textile': 'نسيج',
            'chemical': 'كيماويات',
            'rubber': 'مطاط'
        };
        return categoryMap[englishCategory] || englishCategory;
    };

    const getImageForCategory = (category) => {
        switch (category) {
            case 'ورق': return paperWasteImage;
            case 'بلاستيك': return plasticWasteImage;
            case 'خشب': return woodWasteImage;
            case 'معادن': return metalWasteImage;
            case 'زجاج': return glassWasteImage;
            case 'نسيج': return textileWasteImage;
            default: return plasticWasteImage;
        }
    };

    const plasticTypes = ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Other'];
    const metalTypes = ['حديد', 'ألومنيوم', 'نحاس', 'ستيل', 'مختلط'];
    const paperTypes = ['كرتون', 'ورق أبيض', 'ورق جرائد', 'ورق مختلط'];

    const locations = [...new Set(wasteItems.map(item => item.location))];

    const getSubTypesForCategory = (category) => {
        switch (category) {
            case 'بلاستيك': return plasticTypes;
            case 'معادن': return metalTypes;
            case 'ورق': return paperTypes;
            default: return [];
        }
    };

    const filteredItems = wasteItems.filter(item => {
        const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
        const matchesSearch = searchTerm === '' ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const itemPrice = parseInt(item.price.replace(/,/g, ''));
        const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
        const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(item.location);
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.subType);

        return matchesCategory && matchesSearch && matchesPrice && matchesLocation && matchesType;
    });

    const toggleLocation = (location) => {
        setSelectedLocations(prev =>
            prev.includes(location)
                ? prev.filter(l => l !== location)
                : [...prev, location]
        );
    };

    const toggleType = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const viewDetails = (id) => {
        navigate(`/waste-details/${id}`);
    };

    if (loading) {
        return (
            <div className="marketplace-page">
                <div className="loading-container" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    flexDirection: 'column'
                }}>
                    <div className="loading-spinner" style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #10b981',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '1rem'
                    }}></div>
                    <p>جاري تحميل السوق...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="marketplace-page" dir="rtl">

            {/* Hero Section */}
            <div className="marketplace-hero" style={{
                background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
                padding: '3rem 2rem',
                borderRadius: '1rem',
                margin: '2rem',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="hero-content">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>سوق المخلفات الصناعية</h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>
                        حوّل المخلفات إلى فرص تجارية واستفد من الاقتصاد الدائري
                    </p>

                    <div className="hero-search" style={{
                        display: 'flex',
                        maxWidth: '600px',
                        margin: '0 auto',
                        gap: '0.5rem'
                    }}>
                        <div className="search-input-wrapper" style={{
                            flex: 1,
                            position: 'relative'
                        }}>
                            <FiSearch className="search-icon" size={20} style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#64748b'
                            }} />
                            <input
                                type="text"
                                placeholder="ابحث عن نوع المخلفات أو اسم الشركة..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <button
                            className="search-button"
                            onClick={fetchWasteListings}
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: '#064e3b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            بحث
                        </button>
                    </div>
                </div>
            </div>

            <div className="marketplace-main" style={{
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                gap: '2rem',
                padding: '0 2rem'
            }}>

                {/* Sidebar Filters */}
                <aside className="filters-sidebar" style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    height: 'fit-content',
                    position: 'sticky',
                    top: '1rem'
                }}>
                    <div className="filter-section" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="filter-title" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>
                            الفئات
                            <span className="filter-count" style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                fontWeight: 'normal'
                            }}>{filteredItems.length} منتج</span>
                        </h3>
                        <div className="filter-options" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.name}
                                        className={`filter-option ${selectedCategory === cat.name ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedCategory(cat.name);
                                            setSelectedTypes([]);
                                        }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.75rem',
                                            backgroundColor: selectedCategory === cat.name ? '#d1fae5' : 'transparent',
                                            border: selectedCategory === cat.name ? '2px solid #10b981' : '2px solid transparent',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            width: '100%',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div className="filter-option-content" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Icon size={18} color={selectedCategory === cat.name ? '#059669' : '#64748b'} />
                                            <span style={{ color: selectedCategory === cat.name ? '#065f46' : '#1e293b' }}>{cat.name}</span>
                                        </div>
                                        <span className="category-count" style={{
                                            fontSize: '0.875rem',
                                            color: '#64748b',
                                            backgroundColor: '#f1f5f9',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px'
                                        }}>{cat.count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedCategory !== 'الكل' && getSubTypesForCategory(selectedCategory).length > 0 && (
                        <div className="filter-section" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="filter-title" style={{
                                marginBottom: '1rem',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}>النوع</h3>
                            <div className="filter-options" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {getSubTypesForCategory(selectedCategory).map((type, index) => (
                                    <label key={`type-${index}-${type}`} className="checkbox-option" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedTypes.includes(type)}
                                            onChange={() => toggleType(type)}
                                            style={{ width: '1rem', height: '1rem' }}
                                        />
                                        <span style={{ fontSize: '0.95rem' }}>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="filter-section" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="filter-title" style={{
                            marginBottom: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>الموقع</h3>
                        <div className="filter-options" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                            {locations.map((location, index) => (
                                <label key={`location-${index}-${location}`} className="checkbox-option" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedLocations.includes(location)}
                                        onChange={() => toggleLocation(location)}
                                        style={{ width: '1rem', height: '1rem' }}
                                    />
                                    <span style={{ fontSize: '0.95rem' }}>{location}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="filter-title" style={{
                            marginBottom: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>نطاق السعر (ج/طن)</h3>
                        <div className="price-range">
                            <div className="price-values" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                color: '#475569'
                            }}>
                                <span>{priceRange[0].toLocaleString()} ج</span>
                                <span> - </span>
                                <span>{priceRange[1].toLocaleString()} ج</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="500"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="price-slider"
                                style={{ width: '100%', marginBottom: '1rem' }}
                            />
                            <div className="price-inputs" style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.5rem'
                            }}>
                                <div className="price-input-group">
                                    <label style={{ fontSize: '0.875rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>من</label>
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '0.375rem'
                                        }}
                                    />
                                </div>
                                <div className="price-input-group">
                                    <label style={{ fontSize: '0.875rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>إلى</label>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '0.375rem'
                                        }}
                                    />
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
                        }}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#f1f5f9',
                            border: '2px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            color: '#1e293b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: '500'
                        }}
                    >
                        <FiSearch size={16} />
                        إعادة تعيين الفلاتر
                    </button>
                </aside>

                {/* Main Content */}
                <div className="marketplace-content">

                    {/* Results Header */}
                    <div className="results-header" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        backgroundColor: 'white',
                        padding: '1rem 1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div className="results-count">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                                المنتجات المتاحة
                            </h2>
                            <div className="stats" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span className="count-badge" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    backgroundColor: '#f1f5f9',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    color: '#475569'
                                }}>
                                    <FiPackage size={14} />
                                    {filteredItems.length} منتج
                                </span>
                                <span className="category-badge" style={{
                                    backgroundColor: '#d1fae5',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    color: '#065f46'
                                }}>
                                    {selectedCategory === 'الكل' ? 'جميع الفئات' : selectedCategory}
                                </span>
                            </div>
                        </div>

                        <div className="results-controls">
                            <div className="sort-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', color: '#475569' }}>ترتيب حسب:</label>
                                <select
                                    className="sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        padding: '0.5rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="الأحدث">الأحدث</option>
                                    <option value="الأقل سعراً">الأقل سعراً</option>
                                    <option value="الأعلى سعراً">الأعلى سعراً</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Waste Cards Grid */}
                    <div className="waste-cards-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <div key={item.id} className="waste-card" style={{
                                    backgroundColor: 'white',
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => viewDetails(item.id)}
                                >
                                    <div className="card-header" style={{
                                        padding: '0.75rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div className="card-category-badge" style={{
                                            backgroundColor: '#d1fae5',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500',
                                            color: '#065f46'
                                        }}>
                                            {item.category}
                                        </div>
                                        <div className="card-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                            {item.verified && (
                                                <div className="verified-badge" title="موثق من المنصة" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    color: '#10b981',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <FiCheckCircle size={14} />
                                                    <span>موثق</span>
                                                </div>
                                            )}
                                            <div className="view-count" title="عدد المشاهدات" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                color: '#64748b',
                                                fontSize: '0.75rem'
                                            }}>
                                                <FiEye size={14} />
                                                <span>{item.views}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-image" style={{ height: '200px', overflow: 'hidden' }}>
                                        <img
                                            src={getImageForCategory(item.category)}
                                            alt={item.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300/f1f5f9/64748b?text=ECOv'
                                            }}
                                        />
                                    </div>

                                    <div className="card-content" style={{ padding: '1rem' }}>
                                        <h3 className="card-title" style={{
                                            fontSize: '1.125rem',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem',
                                            color: '#1e293b'
                                        }}>{item.title}</h3>
                                        <div className="card-subtitle" style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.75rem',
                                            fontSize: '0.875rem'
                                        }}>
                                            <span className="company-name" style={{ color: '#64748b' }}>{item.company}</span>
                                            <div className="rating" style={{ color: '#f59e0b' }}>
                                                ★ {item.sellerRating}
                                            </div>
                                        </div>
                                        <p className="card-description" style={{
                                            fontSize: '0.875rem',
                                            color: '#475569',
                                            marginBottom: '1rem',
                                            lineHeight: '1.5',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>{item.description}</p>

                                        <div className="card-details" style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            marginBottom: '1rem',
                                            fontSize: '0.875rem',
                                            color: '#475569'
                                        }}>
                                            <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="الكمية المتاحة">
                                                <FiPackage size={16} />
                                                <span>{item.quantity}</span>
                                            </div>
                                            <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="الموقع">
                                                <FiMapPin size={16} />
                                                <span>{item.location}</span>
                                                {item.distance !== 'غير محدد' && (
                                                    <small style={{ color: '#94a3b8' }}>({item.distance})</small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card-footer" style={{
                                            borderTop: '1px solid #e2e8f0',
                                            paddingTop: '1rem'
                                        }}>
                                            <div className="price-section" style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '0.75rem'
                                            }}>
                                                <div className="price-info">
                                                    <span className="price-label" style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>السعر للطن</span>
                                                    <span className="price-value" style={{ fontSize: '1.125rem', fontWeight: '600', color: '#10b981' }}>{item.price} جنيه</span>
                                                </div>
                                                <div className="date-posted" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                    {item.date}
                                                </div>
                                            </div>
                                            <button
                                                className="view-details-btn"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    backgroundColor: '#10b981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.375rem',
                                                    cursor: 'pointer',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                عرض التفاصيل
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results" style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '4rem',
                                backgroundColor: 'white',
                                borderRadius: '1rem',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                            }}>
                                <div className="no-results-icon" style={{ marginBottom: '1rem' }}>
                                    <FiSearch size={64} color="#94a3b8" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>لا توجد نتائج</h3>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>جرب تغيير معايير البحث أو الفئة المختارة</p>
                                <button
                                    className="reset-search-btn"
                                    onClick={() => {
                                        setSelectedCategory('الكل');
                                        setSearchTerm('');
                                        setSelectedLocations([]);
                                        setSelectedTypes([]);
                                        fetchWasteListings();
                                    }}
                                    style={{
                                        padding: '0.75rem 2rem',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    عرض جميع المنتجات
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Marketplace;