import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, Calendar, DollarSign, Trash2, Clock, Eye, Users, MessageCircle, Phone, Mail, Shield, ChevronLeft, Heart, Share2, AlertCircle } from 'lucide-react';

function WasteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [waste, setWaste] = useState({
    id: id,
    title: 'نفايات بلاستيك عالية الجودة للإعادة التدوير',
    type: 'بلاستيك',
    description: 'نفايات بلاستيك نظيفة من نوع PET، مناسبة لإعادة التدوير. مخزنة في ظروف مناسبة وجاهزة للتسليم.',
    amount: '2.5',
    unit: 'طن',
    frequency: 'شهري',
    price: '1500',
    currency: 'جنيه',
    location: 'القاهرة',
    address: 'المنطقة الصناعية، القاهرة',
    date: '2024-01-15',
    views: 145,
    offers: 8,
    status: 'متاح',
    seller: {
      name: 'مصنع الأمل للصناعات الغذائية',
      rating: 4.8,
      totalSales: 45,
      joined: '2023-06-15',
      verified: true,
      phone: '+20 123 456 7890',
      email: 'contact@al-amal.com'
    },
    specifications: {
      material: 'PET',
      color: 'شفاف',
      purity: '95%',
      packaging: 'أكياس 25 كجم',
      storage: 'مخزن مغلق'
    }
  });

  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('إرسال رسالة:', message);
      setMessage('');
      setShowContactForm(false);
      alert('تم إرسال رسالتك بنجاح!');
    }
  };

  const handleMakeOffer = () => {
    navigate('/messages');
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'بلاستيك': return 'bg-blue-100 text-blue-800';
      case 'ورق': return 'bg-amber-100 text-amber-800';
      case 'معادن': return 'bg-slate-100 text-slate-800';
      case 'زجاج': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          العودة
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Waste Info */}
          <div className="lg:col-span-2">
            {/* Waste Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(waste.type)}`}>
                      {waste.type}
                    </span>
                    <span className="text-sm text-slate-500">{waste.frequency}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      waste.status === 'متاح' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {waste.status}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{waste.title}</h1>
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{waste.views} مشاهدة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{waste.offers} عروض</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>تاريخ النشر: {waste.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-lg ${
                      isLiked ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Waste Image & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 h-full">
                    <div className="flex items-center justify-center h-48">
                      <Package className="w-32 h-32 text-emerald-600" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-slate-600 mb-1">الكمية المتاحة</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {waste.amount} <span className="text-lg text-slate-600">{waste.unit}</span>
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-slate-600 mb-1">السعر</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {waste.price} <span className="text-lg text-slate-600">{waste.currency}</span>
                    </p>
                    <p className="text-sm text-slate-500">لل{waste.unit} الواحد</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-slate-600 mb-1">الموقع</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{waste.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">الوصف التفصيلي</h3>
                <p className="text-slate-700 leading-relaxed">{waste.description}</p>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">المواصفات</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-600 text-sm mb-1">نوع المادة</p>
                    <p className="font-medium">{waste.specifications.material}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-600 text-sm mb-1">اللون</p>
                    <p className="font-medium">{waste.specifications.color}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-600 text-sm mb-1">النقاوة</p>
                    <p className="font-medium">{waste.specifications.purity}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-600 text-sm mb-1">التغليف</p>
                    <p className="font-medium">{waste.specifications.packaging}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-600 text-sm mb-1">التخزين</p>
                    <p className="font-medium">{waste.specifications.storage}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-600 text-sm mb-1">العنوان</p>
                    <p className="font-medium">{waste.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">عن البائع</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xl font-bold text-slate-900">{waste.seller.name}</h4>
                      {waste.seller.verified && (
                        <Shield className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{waste.seller.rating}</span>
                        <span>⭐</span>
                      </div>
                      <span>{waste.seller.totalSales} عملية بيع</span>
                      <span>منضم منذ {waste.seller.joined}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all"
                >
                  تواصل مع البائع
                </button>
              </div>

              {showContactForm && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Phone className="w-5 h-5 text-slate-500" />
                        <span>{waste.seller.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-500" />
                        <span>{waste.seller.email}</span>
                      </div>
                    </div>
                    <div>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="w-full h-24 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="mt-3 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        إرسال رسالة
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">إتخاذ إجراء</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleMakeOffer}
                  className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  تقديم عرض شراء
                </button>

                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full px-6 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  مراسلة البائع
                </button>

                <button className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  الاتصال بالبائع
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between text-slate-600 mb-2">
                  <span>السعر الإجمالي</span>
                  <span className="text-2xl font-bold text-emerald-700">
                    {waste.price * waste.amount} {waste.currency}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  لـ {waste.amount} {waste.unit}
                </p>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">نصائح أمان</h4>
              </div>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>لا تدفع مبالغ خارج المنصة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>تحقق من هوية البائع</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>استخدم وسائل الدفع الآمنة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>تأكد من فحص البضاعة قبل الشراء</span>
                </li>
              </ul>
            </div>

            {/* Similar Listings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h4 className="font-semibold text-slate-900 mb-4">عروض مشابهة</h4>
              <div className="space-y-4">
                {[
                  { title: 'بلاستيك PET نظيف', amount: '1.5 طن', price: '1400', location: 'الجيزة' },
                  { title: 'نفايات ورق مكتبي', amount: '800 كجم', price: '750', location: 'القاهرة' },
                  { title: 'معادن خردة', amount: '3 طن', price: '3200', location: 'الإسكندرية' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.amount} • {item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700">{item.price} جنيه</p>
                      <p className="text-xs text-slate-500">للطن</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WasteDetails;