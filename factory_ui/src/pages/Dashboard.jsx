import { ShoppingCart, TrendingUp, Package, Eye, BarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({ user }) {
    const navigate = useNavigate()

    // Stats data (will come from API later)
    const dashboardStats = {
        totalWaste: '145 طن',
        totalViews: '2,300',
        activeOrders: '18',
        totalRevenue: '24,500 ج'
    }

    // Quick actions data
    const quickActions = [
        {
            title: 'نظرة على السوق',
            description: 'تصفح أحدث عروض النفايات المتاحة',
            icon: <ShoppingCart className="w-5 h-5 text-emerald-600" />,
            buttonText: 'زيارة السوق',
            onClick: () => navigate('/marketplace'),
            primary: false
        },
        {
            title: 'إضافة نفايات',
            description: 'بيع نفايات مصنعك في السوق',
            icon: <Package className="w-5 h-5 text-emerald-600" />,
            buttonText: 'إضافة نفايات جديدة',
            onClick: () => navigate('/list-waste'),
            primary: true
        },
        {
            title: 'التحليلات',
            description: 'تحليل أداء مصنعك وإحصاءات المبيعات',
            icon: <BarChart className="w-5 h-5 text-emerald-600" />,
            buttonText: 'عرض التحليلات',
            onClick: () => navigate('/analytics'),
            primary: false
        }
    ]

    // Stats cards data
    const statsCards = [
        {
            title: 'إجمالي النفايات',
            value: dashboardStats.totalWaste,
            icon: <Package className="w-6 h-6 text-emerald-600" />,
            color: 'emerald'
        },
        {
            title: 'المشاهدات',
            value: dashboardStats.totalViews,
            icon: <Eye className="w-6 h-6 text-blue-600" />,
            color: 'blue'
        },
        {
            title: 'الطلبات النشطة',
            value: dashboardStats.activeOrders,
            icon: <ShoppingCart className="w-6 h-6 text-purple-600" />,
            color: 'purple'
        },
        {
            title: 'إجمالي الإيرادات',
            value: dashboardStats.totalRevenue,
            icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
            color: 'amber'
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50" dir="rtl">
            <div className="pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <h2 className="text-3xl font-bold mb-2">مرحباً بك في ECOv</h2>
                            <p className="text-emerald-100 text-lg">منصة الاقتصاد الدائري للمصانع</p>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="text-2xl font-bold">{user?.name || 'مصنع الأمل للصناعات الغذائية'}</div>
                            <div className="text-emerald-100">آخر تحديث: اليوم الساعة 10:30 ص</div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => (
                        <ActionCard key={index} {...action} />
                    ))}
                </div>
            </div>
        </div>
    )
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
    const colorClasses = {
        emerald: 'bg-emerald-100',
        blue: 'bg-blue-100',
        purple: 'bg-purple-100',
        amber: 'bg-amber-100'
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 text-sm mb-1">{title}</p>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

// Action Card Component
function ActionCard({ title, description, icon, buttonText, onClick, primary = false }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                {icon}
            </div>
            <p className="text-slate-600 mb-4">{description}</p>
            <button
                onClick={onClick}
                className={`w-full py-2 rounded-lg font-medium transition-all ${primary
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
            >
                {buttonText}
            </button>
        </div>
    )
}

export default Dashboard