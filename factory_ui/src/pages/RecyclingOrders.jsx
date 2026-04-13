import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Loader, AlertCircle, CheckCircle, TrendingUp, Zap, BarChart3,
    MapPin, Package, Clock, DollarSign, X, Eye
} from 'lucide-react'
import ceApi from '../services/circularEconomyApi'
import './RecyclingOrders.css'

export default function RecyclingOrders({ user, lang = 'ar' }) {
    const navigate = useNavigate()
    const ar = lang === 'ar'
    
    const [orders, setOrders] = useState([])
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        if (user?.factoryId) {
            loadData()
        }
    }, [user])

    const loadData = async () => {
        setLoading(true)
        try {
            // Load orders
            const ordersRes = await fetch(`http://localhost:54465/api/recycler/${user.factoryId}/jobs`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
            })
            if (ordersRes.ok) {
                const data = await ordersRes.json()
                setOrders(Array.isArray(data) ? data : data.data || [])
            }

            // Load metrics
            const metricsRes = await fetch(`http://localhost:54465/api/recycler/${user.factoryId}/metrics`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
            })
            if (metricsRes.ok) {
                const data = await metricsRes.json()
                setMetrics(data.data || data)
            }
        } catch (err) {
            console.error('Error loading data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAccept = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:54465/api/recycler/jobs/${orderId}/accept`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
            })
            if (res.ok) {
                loadData()
            }
        } catch (err) {
            console.error('Error:', err)
        }
    }

    const handleReject = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:54465/api/recycler/jobs/${orderId}/reject`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
            })
            if (res.ok) {
                loadData()
            }
        } catch (err) {
            console.error('Error:', err)
        }
    }

    const handleComplete = async (orderId, data) => {
        try {
            const res = await fetch(`http://localhost:54465/api/recycler/jobs/${orderId}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (res.ok) {
                setSelectedOrder(null)
                loadData()
            }
        } catch (err) {
            console.error('Error:', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p className="text-slate-600">{ar ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </div>
        )
    }

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

    return (
        <div className="min-h-screen bg-slate-50" dir={ar ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">♻️ {ar ? 'مهام إعادة التدوير' : 'Recycling Jobs'}</h1>
                    <p className="text-blue-100">{ar ? 'إدارة وتتبع المهام' : 'Manage and track recycling operations'}</p>
                </div>
            </div>

            {/* Metrics */}
            {metrics && (
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-600 text-sm">{ar ? 'المعالج' : 'Processed'}</p>
                                    <p className="text-2xl font-bold text-slate-900">{metrics.totalOrdersProcessed || 0}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-600 text-sm">{ar ? 'الكفاءة' : 'Efficiency'}</p>
                                    <p className="text-2xl font-bold text-slate-900">{metrics.averageEfficiency || 0}%</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-600 text-sm">{ar ? 'CO2 ملتقى' : 'CO2 Avoided'}</p>
                                    <p className="text-2xl font-bold text-slate-900">{metrics.estimatedCo2Avoided || 0} kg</p>
                                </div>
                                <Zap className="w-8 h-8 text-yellow-600" />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-600 text-sm">{ar ? 'التقييم' : 'Rating'}</p>
                                    <p className="text-2xl font-bold text-slate-900">{metrics.rating || 0}/5 ⭐</p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Filter */}
                    <div className="border-b border-slate-200 p-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="all">{ar ? 'الكل' : 'All'}</option>
                            <option value="Pending">{ar ? 'معلق' : 'Pending'}</option>
                            <option value="InProgress">{ar ? 'قيد المعالجة' : 'In Progress'}</option>
                            <option value="Completed">{ar ? 'مكتمل' : 'Completed'}</option>
                        </select>
                    </div>

                    {/* Orders List */}
                    <div className="divide-y divide-slate-100">
                        {filteredOrders.length === 0 ? (
                            <div className="p-8 text-center">
                                <Package className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                <p className="text-slate-600">{ar ? 'لا توجد مهام' : 'No jobs found'}</p>
                            </div>
                        ) : (
                            filteredOrders.map(order => (
                                <div key={order.id} className="p-4 hover:bg-slate-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">Job #{order.id}</h3>
                                            <p className="text-sm text-slate-600">{order.wasteType || 'Waste'}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-xs font-medium ${
                                            order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                            order.status === 'InProgress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Package size={14} />
                                            <span>{order.quantity || 1} {order.unit || 'kg'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock size={14} />
                                            <span>{new Date(order.createdAt).toLocaleDateString(ar ? 'ar-EG' : 'en-US')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <DollarSign size={14} />
                                            <span>{order.price || 0} EGP</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {order.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAccept(order.id)}
                                                    className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                                                >
                                                    {ar ? 'قبول' : 'Accept'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(order.id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                                >
                                                    {ar ? 'رفض' : 'Reject'}
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'InProgress' && (
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                            >
                                                {ar ? 'إكمال' : 'Complete'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm hover:bg-slate-300"
                                        >
                                            <Eye size={14} className="inline mr-1" />
                                            {ar ? 'تفاصيل' : 'Details'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Job #{selectedOrder.id}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-500">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                            <div>
                                <p className="text-sm text-slate-600">{ar ? 'النوع' : 'Type'}</p>
                                <p className="font-semibold">{selectedOrder.wasteType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">{ar ? 'الكمية' : 'Quantity'}</p>
                                <p className="font-semibold">{selectedOrder.quantity} {selectedOrder.unit}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">{ar ? 'الحالة' : 'Status'}</p>
                                <p className="font-semibold">{selectedOrder.status}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="flex-1 px-4 py-2 bg-slate-200 text-slate-800 rounded"
                            >
                                {ar ? 'إغلاق' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
