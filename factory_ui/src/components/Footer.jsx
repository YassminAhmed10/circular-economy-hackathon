import React from 'react';
import { Link } from 'react-router-dom';
import { Factory, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold">ECOv</span>
                <span className="text-sm text-slate-300 block">منصة الاقتصاد الدائري</span>
              </div>
            </div>
            <p className="text-slate-400 mb-6">
              منصة رائدة لربط المصانع مع شركات إعادة التدوير لتحقيق الاستدامة والاقتصاد الدائري.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-slate-400 hover:text-white transition-colors">
                  السوق
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-slate-400 hover:text-white transition-colors">
                  الشركاء
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  عن المنصة
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* For Factories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">للمصانع</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/registration" className="text-slate-400 hover:text-white transition-colors">
                  تسجيل مصنع
                </Link>
              </li>
              <li>
                <Link to="/list-waste" className="text-slate-400 hover:text-white transition-colors">
                  إضافة نفايات
                </Link>
              </li>
              <li>
                <Link to="/my-listings" className="text-slate-400 hover:text-white transition-colors">
                  إعلاناتي
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-slate-400 hover:text-white transition-colors">
                  التحليلات
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-400 hover:text-white transition-colors">
                  الملف الشخصي
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">اتصل بنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 ml-2 text-emerald-400 mt-1" />
                <span className="text-slate-400">support@ecov-platform.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 ml-2 text-emerald-400 mt-1" />
                <span className="text-slate-400">+20 123 456 7890</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 ml-2 text-emerald-400 mt-1" />
                <span className="text-slate-400">القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
          <p>© 2024 ECOv. جميع الحقوق محفوظة. | تصميم وتطوير لصالح الاقتصاد الدائري</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;