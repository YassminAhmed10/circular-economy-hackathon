/**
 * Test Utility: Factory Profile Data
 * يُستخدم لاختبار تحديثات بيانات المصنع وتتبع تدفق البيانات من Profile إلى WasteDetails
 */

export const TEST_FACTORY_PROFILES = [
  {
    id: 1,
    factoryId: 1,
    factoryName: 'مصنع الدلتا',
    industryType: 'بلاستيك HDPE',
    location: 'العاشر من رمضان',
    address: 'العاشر من رمضان - الشرقية',
    email: 'delta@example.com',
    phone: '201001234567',
    ownerName: 'أحمد علي',
    ownerPhone: '201001234567',
    taxNumber: '777755',
    registrationNumber: '234455',
    establishmentYear: 2015,
    productionCapacity: '150+ موظف',
    mainProducts: 'إعادة تدوير البلاستيك',
    logoPreview: 'https://via.placeholder.com/200/059669/ffffff?text=Delta',
    isVerified: true,
    rating: 4.7,
    completedOrders: 45,
    certifications: ['ISO 9001', 'ISO 14001'],
  },
  {
    id: 2,
    factoryId: 2,
    factoryName: 'الشركة المصرية للصلب',
    industryType: 'حديد وصلب',
    location: 'السادس من أكتوبر',
    address: 'السادس من أكتوبر - الجيزة',
    email: 'steel@example.com',
    phone: '201009876543',
    ownerName: 'محمد السيد',
    ownerPhone: '201009876543',
    taxNumber: '888866',
    registrationNumber: '345566',
    establishmentYear: 2010,
    productionCapacity: '300+ موظف',
    mainProducts: 'صهر وإعادة تصنيع المعادن',
    logoPreview: 'https://via.placeholder.com/200/ea580c/ffffff?text=Steel',
    isVerified: true,
    rating: 4.9,
    completedOrders: 200,
    certifications: ['ISO 9001', 'ISO 50001'],
  },
  {
    id: 3,
    factoryId: 3,
    factoryName: 'مصنع النور',
    industryType: 'إعادة تدوير البلاستيك',
    location: 'الجيزة',
    address: 'الجيزة - مصر',
    email: 'elnour2@gmail.com',
    phone: '201234567890',
    ownerName: 'علي محمود',
    ownerPhone: '201234567890',
    taxNumber: '999977',
    registrationNumber: '567788',
    establishmentYear: 2012,
    productionCapacity: '100+ موظف',
    mainProducts: 'تدوير البلاستيك والأكياس',
    logoPreview: 'https://via.placeholder.com/200/1a8fab/ffffff?text=Nour',
    isVerified: true,
    rating: 4.5,
    completedOrders: 30,
    certifications: ['ISO 9001', 'ISO 14001'],
  },
  {
    id: 4,
    factoryId: 4,
    factoryName: 'شركة نوردانتكس للغزل',
    industryType: 'نسيج وقطن',
    location: 'المحلة الكبرى',
    address: 'المحلة الكبرى - الغربية',
    email: 'nordantex@example.com',
    phone: '201234567891',
    ownerName: 'فاطمة أحمد',
    ownerPhone: '201234567891',
    taxNumber: '111122',
    registrationNumber: '111133',
    establishmentYear: 2014,
    productionCapacity: '120+ موظف',
    mainProducts: 'غزل النسيج والقطن',
    logoPreview: 'https://via.placeholder.com/200/8b5cf6/ffffff?text=Nordantex',
    isVerified: true,
    rating: 4.3,
    completedOrders: 18,
    certifications: ['ISO 9001', 'GOTS'],
  },
  {
    id: 5,
    factoryId: 5,
    factoryName: 'مصنع الخشب المتحد',
    industryType: 'خشب وفلين',
    location: 'برج العرب الجديدة',
    address: 'برج العرب الجديدة - الإسكندرية',
    email: 'woodunited@example.com',
    phone: '201234567892',
    ownerName: 'إبراهيم محمود',
    ownerPhone: '201234567892',
    taxNumber: '222233',
    registrationNumber: '222244',
    establishmentYear: 2016,
    productionCapacity: '60+ موظف',
    mainProducts: 'معالجة الخشب والفلين',
    logoPreview: 'https://via.placeholder.com/200/92400e/ffffff?text=WoodUnited',
    isVerified: false,
    rating: 4.2,
    completedOrders: 12,
    certifications: ['ISO 9001'],
  },
  {
    id: 6,
    factoryId: 6,
    factoryName: 'زجاج مصر للصناعة',
    industryType: 'زجاج',
    location: 'العامرية',
    address: 'العامرية - الإسكندرية',
    email: 'glassegypt@example.com',
    phone: '201234567893',
    ownerName: 'سارة السيد',
    ownerPhone: '201234567893',
    taxNumber: '333344',
    registrationNumber: '333355',
    establishmentYear: 2013,
    productionCapacity: '90+ موظف',
    mainProducts: 'صهر وإعادة تصنيع الزجاج',
    logoPreview: 'https://via.placeholder.com/200/0369a1/ffffff?text=GlassEgypt',
    isVerified: true,
    rating: 4.0,
    completedOrders: 25,
    certifications: ['ISO 9001', 'ISO 14001'],
  },
  {
    id: 7,
    factoryId: 7,
    factoryName: 'الكيماويات الصناعية المصرية',
    industryType: 'كيماويات',
    location: 'شبرا الخيمة',
    address: 'شبرا الخيمة - القليوبية',
    email: 'chemegypt@example.com',
    phone: '201234567894',
    ownerName: 'يوسف الغندور',
    ownerPhone: '201234567894',
    taxNumber: '444455',
    registrationNumber: '444466',
    establishmentYear: 2011,
    productionCapacity: '200+ موظف',
    mainProducts: 'معالجة وتصنيع الكيماويات',
    logoPreview: 'https://via.placeholder.com/200/dc2626/ffffff?text=ChemEgypt',
    isVerified: true,
    rating: 4.6,
    completedOrders: 60,
    certifications: ['ISO 9001', 'ISO 14001', 'MSDS'],
  },
  {
    id: 8,
    factoryId: 8,
    factoryName: 'مصنع الألومنيوم القاهرة',
    industryType: 'ألومنيوم ونحاس',
    location: 'العاشر من رمضان',
    address: 'العاشر من رمضان - الشرقية',
    email: 'aluminumcairo@example.com',
    phone: '201234567895',
    ownerName: 'حسن علي',
    ownerPhone: '201234567895',
    taxNumber: '555566',
    registrationNumber: '555577',
    establishmentYear: 2012,
    productionCapacity: '250+ موظف',
    mainProducts: 'تصنيع وإعادة تدوير الألومنيوم والنحاس',
    logoPreview: 'https://via.placeholder.com/200/7c3aed/ffffff?text=AlumCairo',
    isVerified: true,
    rating: 4.8,
    completedOrders: 120,
    certifications: ['ISO 9001', 'ISO 50001', 'ISO 14001'],
  },
  {
    id: 9,
    factoryId: 9,
    factoryName: 'مصنع بلاستيكو مصر',
    industryType: 'بلاستيك ABS و PVC',
    location: 'مدينة نصر',
    address: 'مدينة نصر - القاهرة',
    email: 'plastico@example.com',
    phone: '201234567896',
    ownerName: 'ندى القاضي',
    ownerPhone: '201234567896',
    taxNumber: '666677',
    registrationNumber: '666688',
    establishmentYear: 2013,
    productionCapacity: '100+ موظف',
    mainProducts: 'تصنيع وتدوير بلاستيك ABS و PVC',
    logoPreview: 'https://via.placeholder.com/200/f97316/ffffff?text=Plastico',
    isVerified: false,
    rating: 4.4,
    completedOrders: 40,
    certifications: ['ISO 9001'],
  },
  {
    id: 10,
    factoryId: 10,
    factoryName: 'مصنع الأجهزة الحديثة',
    industryType: 'إلكترونيات',
    location: 'القاهرة',
    address: 'القاهرة - مصر',
    email: 'moderndevices@example.com',
    phone: '201234567897',
    ownerName: 'مريم عبدالله',
    ownerPhone: '201234567897',
    taxNumber: '777788',
    registrationNumber: '777799',
    establishmentYear: 2015,
    productionCapacity: '110+ موظف',
    mainProducts: 'معالجة E-waste واستخلاص المعادن',
    logoPreview: 'https://via.placeholder.com/200/06b6d4/ffffff?text=ModernDevices',
    isVerified: true,
    rating: 4.5,
    completedOrders: 22,
    certifications: ['ISO 9001', 'R2 Certified'],
  },
];

/**
 * Initialize test factory profiles in localStorage
 * استخدام: importTestFactoryData() في console
 */
export const importTestFactoryData = () => {
  try {
    const existing = JSON.parse(localStorage.getItem('ecov_factories') || '[]');
    console.log('Current factory data:', existing);
    
    // Merge with test data (avoid duplicates)
    const merged = TEST_FACTORY_PROFILES.filter(
      tf => !existing.some(e => e.id === tf.id)
    );
    
    const updated = [...existing, ...merged];
    localStorage.setItem('ecov_factories', JSON.stringify(updated));
    
    console.log('✅ Test factory profiles imported:', updated);
    console.log('Total factories now:', updated.length);
    
    return updated;
  } catch (err) {
    console.error('❌ Error importing test data:', err);
  }
};

/**
 * Clear factory cache
 */
export const clearFactoriesCache = () => {
  localStorage.removeItem('ecov_factories');
  console.log('✅ Factory cache cleared');
};

/**
 * View current factory cache
 */
export const viewFactoriesCache = () => {
  const cache = JSON.parse(localStorage.getItem('ecov_factories') || '[]');
  console.log('📦 Current Factories Cache:', cache);
  console.table(cache.map(f => ({
    ID: f.id,
    Name: f.factoryName,
    Location: f.location,
    Phone: f.phone,
    Rating: f.rating,
  })));
  return cache;
};

/**
 * Update single factory (for testing)
 */
export const updateTestFactory = (id, updates) => {
  try {
    const cache = JSON.parse(localStorage.getItem('ecov_factories') || '[]');
    const index = cache.findIndex(f => f.id === id);
    
    if (index >= 0) {
      cache[index] = { ...cache[index], ...updates };
      localStorage.setItem('ecov_factories', JSON.stringify(cache));
      console.log('✅ Factory updated:', cache[index]);
      return cache[index];
    } else {
      console.warn(`⚠️ Factory with ID ${id} not found`);
    }
  } catch (err) {
    console.error('❌ Error updating factory:', err);
  }
};

/**
 * Test waste-to-factory mapping
 */
export const testWasteMappings = () => {
  const factories = JSON.parse(localStorage.getItem('ecov_factories') || '[]');
  const listings = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
  
  console.log('=== WASTE-TO-FACTORY MAPPING TEST ===');
  console.log(`📦 Total factories: ${factories.length}`);
  console.log(`🗑️  Total listings: ${listings.length}`);
  
  listings.forEach((waste, i) => {
    const factory = factories.find(f => f.id === waste.factoryId || f.factoryId === waste.factoryId);
    console.log(`  Listing ${i + 1}: ${waste.titleAr || 'Unknown'}`);
    console.log(`    → factoryId: ${waste.factoryId}`);
    console.log(`    → Found factory: ${factory ? factory.factoryName : '❌ NOT FOUND'}`);
  });
};

/**
 * Clean database: remove all fake listings created from test data
 * Keep only real listings created via list-waste (source: 'list-waste')
 * Usage: cleanupFakeListings()
 */
export const cleanupFakeListings = () => {
  try {
    const testEmails = TEST_FACTORY_PROFILES.map(f => f.email).filter(Boolean);
    const testFactoryIds = TEST_FACTORY_PROFILES.map(f => f.factoryId).filter(Boolean);
    let listings = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
    const before = listings.length;

    // Keep ONLY listings that:
    // 1. Have source: 'list-waste' (created from the form)
    // OR have a valid email + factoryId combination
    const cleaned = listings.filter(l => {
      if (!l) return false;
      
      // If it has source='list-waste', it's real
      if (l.source === 'list-waste') return true;
      
      // If it was created by test factories, it's fake → remove
      const isTestEmail = l.email && testEmails.includes(l.email);
      const isTestFactoryId = l.factoryId && testFactoryIds.includes(Number(l.factoryId));
      const isTestCompany = (l.companyEn || l.companyNameEn) && 
                            TEST_FACTORY_PROFILES.some(f => f.factoryName === l.companyEn || f.factoryName === l.companyNameEn);
      
      // If any of these match, it's from test data → remove
      return !(isTestEmail || isTestFactoryId || isTestCompany);
    });

    localStorage.setItem('ecov_listings', JSON.stringify(cleaned));
    const removed = before - cleaned.length;
    console.log(`✅ Cleanup complete: removed ${removed} fake listings, ${cleaned.length} real listings remain`);
    console.table(cleaned.map(c => ({ id: c.id, title: c.titleAr || c.titleEn, email: c.email, source: c.source, factoryId: c.factoryId })));
    return { removed, remaining: cleaned.length, cleaned };
  } catch (err) {
    console.error('❌ Error during cleanup:', err);
    return null;
  }
};

console.log('✅ Test utilities loaded. Use in console:');
console.log('  - importTestFactoryData()');
console.log('  - viewFactoriesCache()');
console.log('  - clearFactoriesCache()');
console.log('  - updateTestFactory(id, updates)');
console.log('  - testWasteMappings()');
console.log('  - cleanupFakeListings() ← Remove all fake listings');
console.log('  - clearMarketplaceCompletely() ← Clear localStorage only');
console.log('  - deleteAllListingsComplete() ← 🗑️ DELETE FROM DATABASE + localStorage!');

/**
 * Clear all listings cache (destructive).
 * Usage: clearListingsCache()
 */
export const clearListingsCache = () => {
  try {
    localStorage.removeItem('ecov_listings');
    console.log('✅ Listings cache cleared (ecov_listings removed).');
  } catch (err) {
    console.error('❌ Error clearing listings cache:', err);
  }
};

/**
 * Remove suspected test/fake listings from localStorage while keeping genuine ones.
 * Criteria: listings linked to test factory emails or test factoryIds defined above.
 * Usage: removeFakeListings()
 */
export const removeFakeListings = () => {
  try {
    const testEmails = TEST_FACTORY_PROFILES.map(f => f.email).filter(Boolean);
    const testFactoryIds = TEST_FACTORY_PROFILES.map(f => f.factoryId).filter(Boolean);

    const listings = JSON.parse(localStorage.getItem('ecov_listings') || '[]');
    const before = listings.length;

    const cleaned = listings.filter(l => {
      if (!l) return false;
      const emailMatch = l.email && testEmails.includes(l.email);
      const factoryIdMatch = l.factoryId && testFactoryIds.includes(Number(l.factoryId));
      const companyMatch = (l.companyEn && TEST_FACTORY_PROFILES.some(f => f.factoryName === l.companyEn)) ||
                           (l.companyNameEn && TEST_FACTORY_PROFILES.some(f => f.factoryName === l.companyNameEn));

      // If any match → treat as test listing → remove it
      return !(emailMatch || factoryIdMatch || companyMatch);
    });

    localStorage.setItem('ecov_listings', JSON.stringify(cleaned));
    console.log(`✅ Removed ${before - cleaned.length} suspected fake listings; ${cleaned.length} remain.`);
    return cleaned;
  } catch (err) {
    console.error('❌ Error removing fake listings:', err);
    return null;
  }
};

/**
 * List suspected fake listings without deleting (for review).
 * Usage: listSuspectedFakeListings()
 */
export const listSuspectedFakeListings = () => {
  try {
    const testEmails = TEST_FACTORY_PROFILES.map(f => f.email).filter(Boolean);
    const testFactoryIds = TEST_FACTORY_PROFILES.map(f => f.factoryId).filter(Boolean);
    const listings = JSON.parse(localStorage.getItem('ecov_listings') || '[]');

    const suspects = listings.filter(l => {
      if (!l) return false;
      const emailMatch = l.email && testEmails.includes(l.email);
      const factoryIdMatch = l.factoryId && testFactoryIds.includes(Number(l.factoryId));
      const companyMatch = (l.companyEn && TEST_FACTORY_PROFILES.some(f => f.factoryName === l.companyEn)) ||
                           (l.companyNameEn && TEST_FACTORY_PROFILES.some(f => f.factoryName === l.companyNameEn));
      return emailMatch || factoryIdMatch || companyMatch;
    });

    console.log(`⚠️ Found ${suspects.length} suspected fake listings:`);
    console.table(suspects.map(s => ({ id: s.id, title: s.titleAr || s.titleEn || s.companyNameEn || s.companyEn, email: s.email, factoryId: s.factoryId })));
    return suspects;
  } catch (err) {
    console.error('❌ Error listing suspected fake listings:', err);
    return [];
  }
};

/**
 * 🗑️ NUCLEAR OPTION: Clear ALL marketplace listings completely
 * This removes ALL waste listings from localStorage and makes it empty
 * Start fresh with no data
 * Usage: clearMarketplaceCompletely()
 */
export const clearMarketplaceCompletely = () => {
  try {
    const confirmed = window.confirm('⚠️ هل أنت متأكد؟ هذا سيحذف جميع الاعلانات من السوق!\n\n🗑️ Are you sure? This will DELETE ALL marketplace listings!');
    
    if (!confirmed) {
      console.log('❌ Clear operation cancelled');
      return { status: 'cancelled', message: 'عملية الحذف ملغاة / Clear operation cancelled' };
    }

    // Store count before clearing
    const before = JSON.parse(localStorage.getItem('ecov_listings') || '[]').length;

    // Clear all marketplace related data
    localStorage.removeItem('ecov_listings');
    localStorage.removeItem('ecov_marketplace_filters');
    localStorage.removeItem('ecov_marketplace_search');

    console.clear();
    console.log('%c🗑️ MARKETPLACE CLEARED!', 'color: red; font-size: 20px; font-weight: bold;');
    console.log(`%c✅ Deleted ${before} listings completely`, 'color: green; font-size: 14px;');
    console.log('%c📊 Marketplace is now EMPTY', 'color: blue; font-size: 14px;');
    console.log('%c🔄 Refresh the page to see changes', 'color: orange; font-size: 14px;');

    return {
      status: 'success',
      message: `✅ تم حذف ${before} اعلان تماما - السوق فارغ الآن!`,
      deletedCount: before,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error('❌ Error clearing marketplace:', err);
    return {
      status: 'error',
      message: 'حدث خطأ في عملية الحذف',
      error: err.message
    };
  }
};

/**
 * 🗑️ COMPLETE NUCLEAR DELETION: Delete ALL listings from both API database AND localStorage
 * This will permanently delete all waste listings from the system
 * Usage: deleteAllListingsComplete()
 */
export const deleteAllListingsComplete = async () => {
  try {
    // First, check current user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const factory = JSON.parse(localStorage.getItem('factory') || '{}');
    console.log('👤 Current user:', { email: user.email, role: user.role, factoryId: factory?.id });
    
    const confirmed = window.confirm(
      '⚠️⚠️⚠️ تحذير نهائي!\n' +
      'هذا سيحذف جميع الاعلانات من قاعدة البيانات والسوق نهائيا!\n\n' +
      '🗑️ FINAL WARNING!\n' +
      'This will PERMANENTLY delete ALL listings from DATABASE and MARKETPLACE!\n\n' +
      'هل أنت متأكد جدا؟ / Are you absolutely sure?'
    );
    
    if (!confirmed) {
      console.log('❌ Delete operation cancelled');
      return { status: 'cancelled', message: 'عملية الحذف ملغاة' };
    }

    console.log('%c🔄 Starting nuclear deletion...', 'color: orange; font-size: 16px;');

    // Step 1: Import marketplaceAPI dynamically to avoid circular imports
    const { marketplaceAPI } = await import('../services/api');

    // Step 2: Get all listings
    console.log('📋 Fetching all listings from API...');
    const response = await marketplaceAPI.getListings({ limit: 10000 });
    const allListings = response?.data?.data || [];
    console.log(`📊 Found ${allListings.length} listings in database`);

    // Step 3: Delete each listing from API
    let deletedCount = 0;
    let failedCount = 0;

    if (allListings.length > 0) {
      console.log('%c🗑️ Deleting from DATABASE...', 'color: red; font-size: 14px;');
      
      for (const listing of allListings) {
        try {
          await marketplaceAPI.deleteListing(listing.id);
          deletedCount++;
          console.log(`✅ Deleted listing ID: ${listing.id}`);
        } catch (err) {
          failedCount++;
          console.warn(`⚠️ Failed to delete listing ID: ${listing.id}`, err.response?.status, err.response?.data?.message || err.message);
        }
      }
    }

    // Step 4: Clear localStorage
    const localBefore = JSON.parse(localStorage.getItem('ecov_listings') || '[]').length;
    localStorage.removeItem('ecov_listings');
    localStorage.removeItem('ecov_marketplace_filters');
    localStorage.removeItem('ecov_marketplace_search');

    // Step 5: Show results
    console.clear();
    console.log('%c✅✅✅ NUCLEAR DELETION COMPLETE! ✅✅✅', 'color: green; font-size: 20px; font-weight: bold;');
    if (failedCount > 0 && user.role !== 'Admin') {
      console.log('%c⚠️ WARNING: User is not Admin, can only delete own listings', 'color: orange; font-size: 14px;');
      console.log('%c📝 To delete ALL listings, user needs Admin role in database', 'color: orange; font-size: 14px;');
    }
    console.log(`%c🗑️ Database deletions: ${deletedCount} successful, ${failedCount} failed`, 'color: blue; font-size: 14px;');
    console.log(`%c🗑️ LocalStorage deletions: ${localBefore} removed`, 'color: blue; font-size: 14px;');
    console.log('%c📊 Marketplace is COMPLETELY EMPTY now', 'color: green; font-size: 14px;');
    console.log('%c🔄 Ready to refresh and start fresh!', 'color: orange; font-size: 14px;');

    return {
      status: 'success',
      message: `✅✅ تم حذف جميع الاعلانات نهائيا!`,
      deletedFromDatabase: deletedCount,
      failedFromDatabase: failedCount,
      deletedFromLocalStorage: localBefore,
      totalDeleted: deletedCount + localBefore,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error('❌ Error in nuclear deletion:', err);
    return {
      status: 'error',
      message: 'حدث خطأ في عملية الحذف النهائية',
      error: err.message
    };
  }
};

// 🌐 EXPOSE ALL TEST UTILITIES TO WINDOW OBJECT FOR BROWSER CONSOLE ACCESS
if (typeof window !== 'undefined') {
  window.importTestFactoryData = importTestFactoryData;
  window.viewFactoriesCache = viewFactoriesCache;
  window.clearFactoriesCache = clearFactoriesCache;
  window.updateTestFactory = updateTestFactory;
  window.testWasteMappings = testWasteMappings;
  window.cleanupFakeListings = cleanupFakeListings;
  window.clearMarketplaceCompletely = clearMarketplaceCompletely;
  window.deleteAllListingsComplete = deleteAllListingsComplete;
  
  /**
   * 🔐 Check current user's role
   * Usage: getUserInfo()
   */
  window.getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const factory = JSON.parse(localStorage.getItem('factory') || '{}');
    const token = localStorage.getItem('token');
    
    console.log('%c👤 CURRENT USER INFO:', 'color: blue; font-size: 14px; font-weight: bold;');
    console.log(`   Email: ${user.email || 'N/A'}`);
    console.log(`   Role: ${user.role || 'N/A'} ${user.role === 'Admin' ? '✅' : '❌'}`);
    console.log(`   Factory ID: ${factory?.id || 'N/A'}`);
    console.log(`   Token exists: ${token ? '✅' : '❌'}`);
    
    if (user.role !== 'Admin') {
      console.log('%c⚠️ User is NOT Admin - to delete all listings, need to promote to Admin in database', 'color: orange;');
      console.log('%c   SQL: UPDATE Users SET Role = "Admin" WHERE Id = (SELECT UserId FROM ...)', 'color: gray; font-size: 12px;');
    }
    
    return { user, factory, hasToken: !!token, isAdmin: user.role === 'Admin' };
  };

  /**
   * 🧪 Test a single listing deletion
   * Usage: testDeleteListing(3956)
   */
  window.testDeleteListing = async (listingId) => {
    const { marketplaceAPI } = await import('../services/api');
    try {
      console.log(`🧪 Testing deletion of listing ${listingId}...`);
      const result = await marketplaceAPI.deleteListing(listingId);
      console.log('✅ SUCCESS:', result);
      return result;
    } catch (err) {
      console.error('❌ ERROR:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.response?.data?.message || err.message,
        data: err.response?.data
      });
      return null;
    }
  };
}
