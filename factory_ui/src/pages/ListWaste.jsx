import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Trash2, MapPin, DollarSign, Calendar, FileText, Upload, X, CheckCircle } from 'lucide-react';

function ListWaste() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    wasteType: '',
    amount: '',
    unit: 'طن',
    frequency: 'شهري',
    price: '',
    currency: 'جنيه',
    location: '',
    description: '',
    images: []
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length <= 5) {
      setFormData({
        ...formData,
        images: [...formData.images, ...files.map(file => URL.createObjectURL(file))]
      });
    } else {
      alert('يمكنك تحميل 5 صور كحد أقصى');
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate API call
    const newListing = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      views: 0,
      offers: 0,
      status: 'نشط'
    };
    
    console.log('New listing created:', newListing);
    
    // Navigate to my listings page
    navigate('/my-listings');
  };

  const wasteTypes = [
    { value: 'بلاستيك', label: 'بلاستيك', color: 'bg-blue-100 text-blue-800' },
    { value: 'ورق', label: 'ورق', color: 'bg-amber-100 text-amber-800' },
    { value: 'معادن', label: 'معادن', color: 'bg-slate-100 text-slate-800' },
    { value: 'زجاج', label: 'زجاج', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'عضوية', label: 'عضوية', color: 'bg-green-100 text-green-800' },
    { value: 'إلكترونيات', label: 'إلكترونيات', color: 'bg-purple-100 text-purple-800' },
  ];

  const locations = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'بور سعيد',
    'السويس', 'الدقهلية', 'الشرقية', 'الغربية', 'المنوفية'
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">إضافة نفايات جديدة</h1>
          <p className="text-slate-600">قم بإضافة نفاياتك الصناعية للبيع في السوق</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === currentStep ? 'bg-emerald-600 text-white' :
                step < currentStep ? 'bg-emerald-100 text-emerald-600' :
                'bg-slate-200 text-slate-500'
              }`}>
                {step < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-bold">{step}</span>
                )}
              </div>
              {step < 3 && (
                <div className={`h-1 w-16 ${
                  step < currentStep ? 'bg-emerald-600' : 'bg-slate-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-emerald-600" />
                معلومات أساسية
              </h2>

              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  عنوان الإعلان
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                  placeholder="مثال: نفايات بلاستيك عالية الجودة للإعادة التدوير"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-3">
                  نوع النفايات
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {wasteTypes.map((type) => (
                    <button
                      type="button"
                      key={type.value}
                      onClick={() => setFormData({ ...formData, wasteType: type.value })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.wasteType === type.value 
                          ? 'border-emerald-600 bg-emerald-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <Trash2 className="w-6 h-6 mb-2 text-slate-600" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    الكمية
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                      placeholder="100"
                      required
                    />
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="طن">طن</option>
                      <option value="كجم">كجم</option>
                      <option value="لتر">لتر</option>
                      <option value="قطعة">قطعة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    تكرار الإنتاج
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                    required
                  >
                    <option value="يومي">يومي</option>
                    <option value="أسبوعي">أسبوعي</option>
                    <option value="شهري">شهري</option>
                    <option value="سنوي">سنوي</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all"
                >
                  التالي
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                السعر والموقع
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    السعر
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                      placeholder="1500"
                      required
                    />
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="جنيه">جنيه</option>
                      <option value="دولار">دولار</option>
                      <option value="يورو">يورو</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    الموقع
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                    required
                  >
                    <option value="">اختر المحافظة</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  الوصف التفصيلي
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                  placeholder="صف النفايات بالتفصيل، الحالة، طريقة التخزين، أي شروط خاصة..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-3">
                  صور النفايات (اختياري - حد أقصى 5 صور)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length < 5 && (
                    <label className="border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-600">رفع صورة</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all"
                >
                  التالي
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                مراجعة وتأكيد
              </h2>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-emerald-900 mb-4">تفاصيل الإعلان</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-600 mb-1">العنوان</p>
                      <p className="font-medium">{formData.title || 'لم يتم تحديد'}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">نوع النفايات</p>
                      <p className="font-medium">{formData.wasteType || 'لم يتم تحديد'}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">الكمية</p>
                      <p className="font-medium">
                        {formData.amount ? `${formData.amount} ${formData.unit}` : 'لم يتم تحديد'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">التكرار</p>
                      <p className="font-medium">{formData.frequency || 'لم يتم تحديد'}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">السعر</p>
                      <p className="font-medium">
                        {formData.price ? `${formData.price} ${formData.currency}` : 'لم يتم تحديد'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">الموقع</p>
                      <p className="font-medium">{formData.location || 'لم يتم تحديد'}</p>
                    </div>
                  </div>
                  
                  {formData.description && (
                    <div>
                      <p className="text-slate-600 mb-1">الوصف</p>
                      <p className="font-medium">{formData.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all"
                >
                  السابق
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  نشر الإعلان
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            نصائح لنشر إعلان ناجح
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
              <span>استخدم صوراً واضحة وعالية الجودة للنفايات</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
              <span>صف النفايات بدقة واذكر إن كانت نظيفة أو مختلطة</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
              <span>حدد سعراً معقولاً بناءً على نوع وجودة النفايات</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
              <span>اذكر طريقة التغليف والتخزين المتاحة</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ListWaste;