import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    getPendingPayments,
    getPaymentSummary,
    processPayment,
} from '../services/circularEconomyApi'
import './Payment.css'
import { ArrowLeft, CreditCard, Truck,  ShoppingCart, AlertCircle, Loader } from 'lucide-react'

// ═══════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════
const T = {
    ar: {
        title: 'إدارة المدفوعات',
        subtitle: 'عرض ومعالجة المدفوعات المعلقة',
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        cartEmpty: 'السلة فارغة',
        addItems: 'أضف عناصر للمتابعة',
        pending: 'قيد الانتظار',
        processed: 'تمت معالجتها',
        trackOrder: 'تتبع الطلب',
        continueShopping: 'متابعة التسوق',
        totalPending: 'إجمالي المعلق',
        processedToday: 'تمت معالجتها اليوم',
        satisfactionRate: 'معدل الرضا',
        payableAmount: 'المبلغ المستحق',
        payableLabel: 'يجب عليك الدفع:',
        receivableLabel: 'سيتم استقبالك:',
        viewDetails: 'عرض التفاصيل',
        processPayment: 'معالجة الدفع',
    },
    en: {
        title: 'Payment Management',
        subtitle: 'View and process pending payments',
        loading: 'Loading...',
        error: 'An error occurred',
        cartEmpty: 'Cart is empty',
        addItems: 'Add items to continue',
        pending: 'Pending',
        processed: 'Processed',
        trackOrder: 'Track Order',
        continueShopping: 'Continue Shopping',
        totalPending: 'Total Pending',
        processedToday: 'Processed Today',
        satisfactionRate: 'Satisfaction Rate',
        payableAmount: 'Amount Due',
        payableLabel: 'You must pay:',
        receivableLabel: 'You will receive:',
        viewDetails: 'View Details',
        processPayment: 'Process Payment',
    }
}

// ═══════════════════════════════════════════════════
// MAIN PAYMENT COMPONENT
// ═══════════════════════════════════════════════════
export default function Payment({ user, lang = 'ar' }) {
    const t = T[lang] || T.ar
    const ar = lang === 'ar'
    const navigate = useNavigate()

    const [payments, setPayments] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(null)
    const [error, setError] = useState(null)

    const loadPaymentsData = async () => {
        if (!user?.factoryId) return
        setLoading(true)
        setError(null)
        try {
            const [paymentsRes, summaryRes] = await Promise.all([
                getPendingPayments(user.factoryId, 'both'),
                getPaymentSummary(user.factoryId)
            ])
            if (paymentsRes.success) setPayments(paymentsRes.data || [])
            if (summaryRes.success) setSummary(summaryRes.data)
        } catch (err) {
            setError(t.error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPaymentsData()
    }, [user?.factoryId])

    const handleProcessPayment = async (paymentId) => {
        setProcessing(paymentId)
        try {
            const res = await processPayment(paymentId)
            if (res.success) {
                await loadPaymentsData()
            }
        } finally {
            setProcessing(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    <p>{t.loading}</p>
                </div>
            </div>
        )
    }

    if (!payments || payments.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.cartEmpty}</h2>
                    <p className="text-slate-600 mb-6">{t.addItems}</p>
                    <button 
                        onClick={() => navigate('/market')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} /> {t.continueShopping}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8" dir={ar ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.title}</h1>
                    <p className="text-slate-600">{t.subtitle}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                            <p className="text-slate-600 text-sm font-medium">{t.totalPending}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">
                                {summary.totalPending?.toLocaleString(ar ? 'ar-EG' : 'en-US')} EGP
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                            <p className="text-slate-600 text-sm font-medium">{t.processedToday}</p>
                            <p className="text-2xl font-bold text-green-600 mt-2">
                                {summary.processedToday || 0}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                            <p className="text-slate-600 text-sm font-medium">{t.payableAmount}</p>
                            <p className="text-2xl font-bold text-blue-600 mt-2">
                                {summary.payableAmount?.toLocaleString(ar ? 'ar-EG' : 'en-US')} EGP
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                            <p className="text-slate-600 text-sm font-medium">{t.satisfactionRate}</p>
                            <p className="text-2xl font-bold text-orange-600 mt-2">
                                {summary.satisfactionRate || 0}%
                            </p>
                        </div>
                    </div>
                )}

                {/* Payments Table */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-900">{t.viewDetails}</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-900">{t.pending}</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-900">{t.processed}</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-900">{t.processPayment}</th>
                            </tr>
                        </thead>
                        <tbody divide-y divide-slate-200>
                            {payments.map((payment) => (
                                <tr key={payment.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-slate-900">{payment.id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{payment.pending || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{payment.processed || '-'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => handleProcessPayment(payment.id)}
                                            disabled={processing === payment.id}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                                        >
                                            <CreditCard size={16} />
                                            {processing === payment.id ? t.loading : t.processPayment}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-4 justify-center">
                    <button 
                        onClick={() => navigate('/waste-tracking')}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <Truck size={16} /> {t.trackOrder}
                    </button>
                    <button 
                        onClick={() => navigate('/market')}
                        className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition flex items-center gap-2"
                    >
                        <ShoppingCart size={16} /> {t.continueShopping}
                    </button>
                </div>
            </div>
        </div>
    )
}
