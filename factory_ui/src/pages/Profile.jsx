import React, { useState } from 'react';
import { User, Building2, Mail, Phone, MapPin, FileText, Edit2, Save, Camera, Shield, Calendar, CheckCircle } from 'lucide-react';

function Profile({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    factoryName: user?.factoryName || 'مصنع الأمل للصناعات الغذائية',
    ownerName: user?.ownerName || 'أحمد محمد',
    email: user?.email || 'ahmed@al-amal.com',
    phone: user?.phone || '01234567890',
    location: user?.location || 'القاهرة',
    address: user?.address || 'المنطقة الصناعية، القاهرة',
    industryType: user?.industryType || 'صناعات غذائية',
    taxNumber: user?.taxNumber || '123-456-789',
    registrationDate: '2024-01-15',
    verified: user?.verified || false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser(formData);
    }
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // هنا يجب إرسال طلب لتغيير كلمة المرور للخادم
    console.log('تغيير كلمة المرور:', passwordData);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">الملف الشخصي</h1>
              <p className="text-slate-600">إدارة معلومات مصنعك وتحديث البيانات</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  تعديل الملف
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Building2 className="w-16 h-16 text-emerald-600" />
                  </div>
                  <button className="absolute bottom-2 right-2 bg-emerald-600 text-white p-2 rounded-full">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 mb-1">{formData.factoryName}</h2>
                <p className="text-slate-600 mb-3">{formData.industryType}</p>
                
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  formData.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {formData.verified ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      حساب موثق
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      قيد المراجعة
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <User className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium">المالك / المدير</p>
                    <p className="text-sm text-slate-600">{formData.ownerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium">تاريخ التسجيل</p>
                    <p className="text-sm text-slate-600">{formData.registrationDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium">الرقم الضريبي</p>
                    <p className="text-sm text-slate-600">{formData.taxNumber}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">الإحصائيات</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">12</p>
                    <p className="text-sm text-slate-600">إعلانات نشطة</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">45</p>
                    <p className="text-sm text-slate-600">طلبات مكتملة</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">4.8</p>
                    <p className="text-sm text-slate-600">تقييم</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">98%</p>
                    <p className="text-sm text-slate-600">رضا العملاء</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                المعلومات الأساسية
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    اسم المصنع
                  </label>
                  <input
                    type="text"
                    name="factoryName"
                    value={formData.factoryName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    اسم المالك / المدير
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    المحافظة
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="القاهرة">القاهرة</option>
                    <option value="الجيزة">الجيزة</option>
                    <option value="الإسكندرية">الإسكندرية</option>
                    <option value="القليوبية">القليوبية</option>
                    <option value="بور سعيد">بور سعيد</option>
                    <option value="السويس">السويس</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    نوع الصناعة
                  </label>
                  <select
                    name="industryType"
                    value={formData.industryType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="صناعات غذائية">صناعات غذائية</option>
                    <option value="نسيج وملابس">نسيج وملابس</option>
                    <option value="كيماويات">كيماويات</option>
                    <option value="معادن وتصنيع">معادن وتصنيع</option>
                    <option value="بلاستيك">بلاستيك</option>
                    <option value="ورق وطباعة">ورق وطباعة</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-medium mb-2">
                    العنوان التفصيلي
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>
            </form>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                تغيير كلمة المرور
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    كلمة المرور الحالية
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all"
                  >
                    تغيير كلمة المرور
                  </button>
                </div>
              </div>
            </form>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                إعدادات الحساب
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">الإشعارات البريدية</p>
                    <p className="text-sm text-slate-600">تلقي تحديثات عن العروض الجديدة والطلبات</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">رسائل التطبيق</p>
                    <p className="text-sm text-slate-600">إشعارات داخل التطبيق عن النشاطات</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">العرض العام للملف</p>
                    <p className="text-sm text-slate-600">عرض معلومات مصنعك في السوق</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <button className="px-6 py-3 border-2 border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all">
                  حذف الحساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;