import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, Clock, XCircle, Package, DollarSign, Calendar, Truck } from 'lucide-react';

function Orders() {
    const [orders, setOrders] = useState([
        {
            id: 'ORD-001',
            wasteType: 'بلاستيك',
            amount: '2.5 طن',
            price: '1500 جنيه',
            buyer: 'مصنع إعادة التدوير المتقدم',
            date: '2024-01-15',
            status: 'مكتمل',
            deliveryDate: '2024-01-20'
        },
        {
            id: 'ORD-002',
            wasteType: 'ورق',
            amount: '800 كجم',
            price: '800 جنيه',
            buyer: 'شركة الأوراق الخضراء',
            date: '2024-01-10',
            status: 'قيد التوصيل',
            deliveryDate: '2024-01-25'
        },
        {
            id: 'ORD-003',
            wasteType: 'معادن',
            amount: '5 طن',
            price: '3500 جنيه',
            buyer: 'مصنع المعادن الجديد',
            date: '2023-12-20',
            status: 'ملغى',
            deliveryDate: '-'
        },
        {
            id: 'ORD-004',
            wasteType: 'زجاج',
            amount: '1.2 طن',
            price: '1200 جنيه',
            buyer: 'مصنع الزجاج الحديث',
            date: '2024-01-05',
            status: 'معلق',
            deliveryDate: '-'
        }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'مكتمل': return 'bg-emerald-100 text-emerald-800';
            case 'قيد التوصيل': return 'bg-blue-100 text-blue-800';
            case 'معلق': return 'bg-amber-100 text-amber-800';
            case 'ملغى': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'مكتمل': return <CheckCircle className="w-4 h-4" />;
            case 'قيد التوصيل': return <Truck className="w-4 h-4" />;
            case 'معلق': return <Clock className="w-4 h-4" />;
            case 'ملغى': return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">الطلبات والمبيعات</h1>
                    <p className="text-slate-600">إدارة وتتبع جميع طلبات النفايات الصناعية</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">إجمالي الطلبات</p>
                                <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">مكتملة</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {orders.filter(o => o.status === 'مكتمل').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">إجمالي الإيرادات</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {orders.reduce((sum, order) => {
                                        if (order.status !== 'ملغى') {
                                            const price = parseInt(order.price);
                                            return sum + (isNaN(price) ? 0 : price);
                                        }
                                        return sum;
                                    }, 0)} جنيه
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">قيد التوصيل</p>
                                <p className="text-2xl font-bold text-amber-600">
                                    {orders.filter(o => o.status === 'قيد التوصيل').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                                <Truck className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-4 px-6 text-right font-semibold text-slate-700">رقم الطلب</th>
                                    <th className="py-4 px-6 text-right font-semibold text-slate-700">نوع النفايات</th>
                                    <th className="py-4 px-6 text-right font-semibold text-slate-700">الكمية</th>
                                    <th className="py-4 px-6 text-right font-semibold text-slate-700">السعر</th>
                                    <th className="py-4 px-6 text-right font-semibold text-slate-700">المشتري</th>
                                    <th className="py-4 px-6 text-right font-semibold text-slate-700">التاريخ</th>
                                    <th className="py-4 px-6 text-right font-semibold text-slate-700">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-4 px-6">
                                            <span className="font-medium text-slate-900">{order.id}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <Package className="w-4 h-4 ml-2 text-slate-500" />
                                                <span>{order.wasteType}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-medium">{order.amount}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <DollarSign className="w-4 h-4 ml-2 text-slate-500" />
                                                <span className="font-medium">{order.price}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span>{order.buyer}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 ml-2 text-slate-500" />
                                                <span>{order.date}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Orders;