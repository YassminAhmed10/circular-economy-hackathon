# 🔧 تحميل بيانات مصنع النور - دليل سريع

## المشكلة الحالية
- الإعلان ID: `1775908792583` (مصنع النور - elnour2@gmail.com)
- لم يتم العثور على factory profile في localStorage

## الحل السريع

### الخطوة 1: فتح Browser Console
- اضغط `F12` أو `Ctrl+Shift+I`
- اختر تبويب `Console`

### الخطوة 2: تحميل بيانات مصنع النور

انسخ الأمر التالي في Console:

```javascript
TestFactoryData.importTestFactoryData()
```

### الخطوة 3: التحقق من البيانات

انسخ الأمر التالي:

```javascript
TestFactoryData.viewFactoriesCache()
```

يجب أن تشاهد جدول يحتوي على 3 مصانع:
- مصنع الدلتا (delta@example.com)
- الشركة المصرية للصلب (steel@example.com)
- مصنع النور (elnour2@gmail.com) ✅

### الخطوة 4: إعادة تحميل الصفحة

اضغط `F5` أو `Ctrl+Shift+R` (إعادة تحميل حاد)

### الخطوة 5: التحقق من الإعلان

- أغلق console
- يجب أن تشاهد بيانات مصنع النور الآن!

## البيانات المعروضة

عند فتح الإعلان، ستشاهد:

### عن البائع
```
🏢 مصنع النور ✓ موثق
⭐ 4.5 | 30 عملية بيع | منضم منذ 2012
```

### البيانات الساسية
```
الموقع: الجيزة
الهاتف: +201234567890
سنوات الخبرة: 14 سنة
عدد الموظفين: 100+ موظف
```

### معلومات التسجيل
```
صاحب المصنع: علي محمود
هاتف المسؤول: +201234567890
السجل التجاري: 567788
الرقم الضريبي: 999977
```

### التخصصات
```
إعادة تدوير البلاستيك | تدوير البلاستيك والأكياس
```

### الشهادات
```
ISO 9001 | ISO 14001
```

## Debugging

إذا لم تظهر البيانات:

### 1. تحقق من القائمة المحملة:
```javascript
TestFactoryData.testWasteMappings()
```

### 2. افحص البيانات المحددة:
```javascript
const factories = JSON.parse(localStorage.getItem('ecov_factories'))
factories.find(f => f.email === 'elnour2@gmail.com')
```

### 3. تحقق من بيانات الإعلان:
```javascript
const listings = JSON.parse(localStorage.getItem('ecov_listings'))
listings.find(l => l.id.toString().includes('1775908792583'))
```

### 4. امسح وأعد التحميل:
```javascript
TestFactoryData.clearFactoriesCache()
TestFactoryData.importTestFactoryData()
location.reload()
```

## كيفية ربط الإعلانات الحالية

للإعلانات التي تم إنشاؤها قبل هذا التحديث:

### المتطلب: أن يحتوي الإعلان على أحد:
1. `factoryId` - مباشرة
2. `email` - بريد المصنع
3. `companyAr` - اسم المصنع

### البحث يحدث بهذا الترتيب:
```
factoryId → email → companyAr (اسم المصنع)
```

## التطوير المستقبلي

- [ ] حفظ email تلقائياً عند إنشاء إعلان جديد
- [ ] ربط الإعلانات القديمة بـ email الحساب
- [ ] واجهة إدارة مصانع من Dashboard
- [ ] مزامنة تلقائية مع API
