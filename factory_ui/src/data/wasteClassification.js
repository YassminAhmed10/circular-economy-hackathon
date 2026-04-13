/**
 * Waste Classification System - Frontend Constants
 * Maps enums from backend to frontend display values
 */

export const WASTE_TYPES = {
  1: { id: 1, enName: 'Plastic', arName: 'بلاستيك' },
  2: { id: 2, enName: 'Metal', arName: 'معادن' },
  3: { id: 3, enName: 'Paper', arName: 'ورق' },
  4: { id: 4, enName: 'Glass', arName: 'زجاج' },
  5: { id: 5, enName: 'Packaging', arName: 'تغليف' },
  6: { id: 6, enName: 'Electronics', arName: 'إلكترونيات' },
  7: { id: 7, enName: 'Textile', arName: 'نسيج' },
  8: { id: 8, enName: 'Chemicals', arName: 'مواد كيميائية' },
  9: { id: 9, enName: 'Organic', arName: 'عضوي' },
  10: { id: 10, enName: 'Wood', arName: 'خشب' },
}

export const WASTE_SUBTYPES = {
  // Plastic
  101: { id: 101, typeId: 1, enName: 'PET', arName: 'PET' },
  102: { id: 102, typeId: 1, enName: 'HDPE', arName: 'HDPE' },
  103: { id: 103, typeId: 1, enName: 'PVC', arName: 'PVC' },
  104: { id: 104, typeId: 1, enName: 'LDPE', arName: 'LDPE' },
  105: { id: 105, typeId: 1, enName: 'PP', arName: 'PP' },
  106: { id: 106, typeId: 1, enName: 'PS', arName: 'PS' },
  107: { id: 107, typeId: 1, enName: 'Mixed Plastic', arName: 'بلاستيك مختلط' },

  // Metal
  201: { id: 201, typeId: 2, enName: 'Aluminum', arName: 'ألومنيوم' },
  202: { id: 202, typeId: 2, enName: 'Steel', arName: 'فولاذ' },
  203: { id: 203, typeId: 2, enName: 'Copper', arName: 'نحاس' },
  204: { id: 204, typeId: 2, enName: 'Iron', arName: 'حديد' },
  205: { id: 205, typeId: 2, enName: 'Mixed Metal', arName: 'معادن مختلطة' },
  206: { id: 206, typeId: 2, enName: 'Brass', arName: 'نحاس أصفر' },

  // Paper
  301: { id: 301, typeId: 3, enName: 'Cardboard', arName: 'كرتون' },
  302: { id: 302, typeId: 3, enName: 'Office Paper', arName: 'ورق المكاتب' },
  303: { id: 303, typeId: 3, enName: 'Newspaper', arName: 'جريدة' },
  304: { id: 304, typeId: 3, enName: 'Mixed Paper', arName: 'ورق مختلط' },
  305: { id: 305, typeId: 3, enName: 'Tissue', arName: 'مناديل' },

  // Glass
  401: { id: 401, typeId: 4, enName: 'Clear Glass', arName: 'زجاج شفاف' },
  402: { id: 402, typeId: 4, enName: 'Green Glass', arName: 'زجاج أخضر' },
  403: { id: 403, typeId: 4, enName: 'Brown Glass', arName: 'زجاج بني' },
  404: { id: 404, typeId: 4, enName: 'Mixed Glass', arName: 'زجاج مختلط' },

  // Packaging
  501: { id: 501, typeId: 5, enName: 'Plastic Packaging', arName: 'تغليف بلاستيكي' },
  502: { id: 502, typeId: 5, enName: 'Paper Packaging', arName: 'تغليف ورقي' },
  503: { id: 503, typeId: 5, enName: 'Foam Packaging', arName: 'تغليف رغوي' },
  504: { id: 504, typeId: 5, enName: 'Glass Packaging', arName: 'تغليف زجاجي' },
  505: { id: 505, typeId: 5, enName: 'Metal Packaging', arName: 'تغليف معدني' },
  506: { id: 506, typeId: 5, enName: 'Mixed Packaging', arName: 'تغليف مختلط' },

  // Electronics
  601: { id: 601, typeId: 6, enName: 'Computers', arName: 'أجهزة كمبيوتر' },
  602: { id: 602, typeId: 6, enName: 'Phones', arName: 'هواتف' },
  603: { id: 603, typeId: 6, enName: 'Appliances', arName: 'أجهزة كهربائية' },
  604: { id: 604, typeId: 6, enName: 'Batteries', arName: 'بطاريات' },
  605: { id: 605, typeId: 6, enName: 'Mixed E-Waste', arName: 'نفايات إلكترونية مختلطة' },

  // Textile
  701: { id: 701, typeId: 7, enName: 'Cotton', arName: 'قطن' },
  702: { id: 702, typeId: 7, enName: 'Polyester', arName: 'بوليستر' },
  703: { id: 703, typeId: 7, enName: 'Wool', arName: 'صوف' },
  704: { id: 704, typeId: 7, enName: 'Mixed', arName: 'مختلط' },

  // Chemical
  801: { id: 801, typeId: 8, enName: 'Non-Hazardous', arName: 'غير خطرة' },
  802: { id: 802, typeId: 8, enName: 'Hazardous', arName: 'خطرة' },
  803: { id: 803, typeId: 8, enName: 'Solvents & Oils', arName: 'مذيبات وزيوت' },

  // Organic
  901: { id: 901, typeId: 9, enName: 'Food Waste', arName: 'بقايا طعام' },
  902: { id: 902, typeId: 9, enName: 'Garden Waste', arName: 'بقايا حديقة' },
  903: { id: 903, typeId: 9, enName: 'Wood Waste', arName: 'بقايا خشب' },
  904: { id: 904, typeId: 9, enName: 'Mixed Organic', arName: 'عضوي مختلط' },

  // Wood (from Organic)
  903: { id: 903, typeId: 10, enName: 'Wood Waste', arName: 'بقايا خشب' },
}

export const CONTAMINATION_LEVELS = {
  1: { id: 1, enName: 'Low', arName: 'منخفض' },
  2: { id: 2, enName: 'Medium', arName: 'متوسط' },
  3: { id: 3, enName: 'High', arName: 'مرتفع' },
}

export const RECYCLABILITY_TYPES = {
  1: { id: 1, enName: 'Direct Use', arName: 'استخدام مباشر' },
  2: { id: 2, enName: 'Recyclable', arName: 'قابل للتدوير' },
  3: { id: 3, enName: 'Reusable', arName: 'قابل لإعادة الاستخدام' },
}

/**
 * Helper functions
 */

export const getSubTypesForType = (wasteTypeId) => {
  return Object.values(WASTE_SUBTYPES).filter(st => st.typeId === wasteTypeId)
}

export const getWasteTypeName = (typeId, lang = 'en') => {
  const type = WASTE_TYPES[typeId]
  return type ? (lang === 'ar' ? type.arName : type.enName) : 'Unknown'
}

export const getWasteSubTypeName = (subTypeId, lang = 'en') => {
  const subtype = WASTE_SUBTYPES[subTypeId]
  return subtype ? (lang === 'ar' ? subtype.arName : subtype.enName) : 'Unknown'
}

export const getContaminationLevelName = (levelId, lang = 'en') => {
  const level = CONTAMINATION_LEVELS[levelId]
  return level ? (lang === 'ar' ? level.arName : level.enName) : 'Unknown'
}

export const getRecyclabilityTypeName = (typeId, lang = 'en') => {
  const type = RECYCLABILITY_TYPES[typeId]
  return type ? (lang === 'ar' ? type.arName : type.enName) : 'Unknown'
}

/**
 * Convert legacy category string to new waste type/subtype
 */
export const mapLegacyCategory = (legacyCategory) => {
  const categoryMap = {
    'plastic': { wasteTypeId: 1, wasteSubTypeId: 107 },
    'metal': { wasteTypeId: 2, wasteSubTypeId: 205 },
    'paper': { wasteTypeId: 3, wasteSubTypeId: 304 },
    'glass': { wasteTypeId: 4, wasteSubTypeId: 404 },
    'packaging': { wasteTypeId: 5, wasteSubTypeId: 506 },
    'electronics': { wasteTypeId: 6, wasteSubTypeId: 605 },
    'textile': { wasteTypeId: 7, wasteSubTypeId: 704 },
  }

  const mapped = categoryMap[legacyCategory?.toLowerCase()]
  return mapped || { wasteTypeId: 1, wasteSubTypeId: 107 } // Default to Plastic/Mixed
}
