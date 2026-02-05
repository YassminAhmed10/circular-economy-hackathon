import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Calendar, DollarSign, Eye } from 'lucide-react';

function WasteCard({ waste }) {
  const getTypeColor = (type) => {
    switch(type) {
      case 'بلاستيك': return 'bg-blue-100 text-blue-800';
      case 'ورق': return 'bg-amber-100 text-amber-800';
      case 'معادن': return 'bg-slate-100 text-slate-800';
      case 'زجاج': return 'bg-emerald-100 text-emerald-800';
      case 'عضوية': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{waste.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(waste.type)}`}>
                {waste.type}
              </span>
              <span className="text-sm text-slate-500">{waste.frequency}</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-slate-700">
            <div className="flex-1">
              <span className="font-medium">{waste.amount} {waste.unit}</span>
              <p className="text-sm text-slate-500">الكمية المتاحة</p>
            </div>
            <div className="text-left">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 ml-1 text-slate-500" />
                <span className="font-bold text-lg text-emerald-700">{waste.price} {waste.currency}</span>
              </div>
              <p className="text-sm text-slate-500">السعر</p>
            </div>
          </div>

          <div className="flex items-center text-slate-600">
            <MapPin className="w-4 h-4 ml-2 text-slate-500" />
            <span>{waste.location}</span>
          </div>

          <div className="flex items-center text-slate-600">
            <Calendar className="w-4 h-4 ml-2 text-slate-500" />
            <span>تاريخ النشر: {waste.date}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            {waste.views} مشاهدة • {waste.offers} عروض
          </span>
          <Link
            to={`/waste-details/${waste.id}`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WasteCard;