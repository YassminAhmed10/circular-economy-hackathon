import { useState } from 'react'
import { Factory, Bell, User, ChevronDown, Eye, Edit, Trash2, FileText, TrendingUp, Cloud, Droplet } from 'lucide-react'
import './Dashboard.css'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('seller')

  const sellerMetrics = [
    { label: 'Total Wastes Listed', value: '145', icon: <Factory className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Views', value: '2,300', icon: <Eye className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Requests', value: '18', icon: <FileText className="w-6 h-6" />, color: 'from-emerald-500 to-emerald-600' }
  ]

  const buyerMetrics = [
    { label: 'Total Purchases', value: '68', icon: <Factory className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
    { label: 'Cost Savings', value: '450,000 EGP', icon: <TrendingUp className="w-6 h-6" />, color: 'from-green-500 to-green-600' },
    { label: 'CO2 Saved', value: '320 Tons', icon: <Cloud className="w-6 h-6" />, color: 'from-teal-500 to-teal-600' },
    { label: 'Water Saved', value: '1.5M Liters', icon: <Droplet className="w-6 h-6" />, color: 'from-cyan-500 to-cyan-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Factory className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800">Dawr Al-Masane'</span>
              </div>
              <div className="flex gap-6">
                {['Dashboard', 'Listings', 'Marketplace', 'Reports', 'Profile'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`font-medium transition-colors ${
                      item === 'Dashboard' 
                        ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                        : 'text-slate-600 hover:text-emerald-600'
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 w-64"
                />
                <span className="absolute left-3 top-3 text-slate-400">??</span>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                <User className="w-5 h-5 text-slate-600" />
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-700">Factory Manager -</div>
                  <div className="text-xs text-slate-500">El-Sewedy Electric</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Seller Dashboard */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Seller Dashboard</h2>
            
            {/* Key Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Key Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                {sellerMetrics.map((metric, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mb-3`}>
                      <div className="text-white">{metric.icon}</div>
                    </div>
                    <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
                    <div className="text-2xl font-bold text-slate-800">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Listed Wastes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Listed Wastes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Material</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Quantity</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Views</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { material: 'Plastic Scraps (PET)', quantity: '5.2 Tons', status: 'Active', views: 450, color: 'emerald' },
                      { material: 'Metal Shavings', quantity: '12.5 Tons', status: 'Pending', views: 210, color: 'amber' },
                      { material: 'Plastic Scraps (PET)', quantity: '5.2 Tons', status: 'Active', views: 450, color: 'emerald' }
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-2 text-sm font-medium text-slate-700">{item.material}</td>
                        <td className="py-4 px-2 text-sm text-slate-600">{item.quantity}</td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'Active' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-sm text-slate-600">{item.views}</td>
                        <td className="py-4 px-2">
                          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            Edit/Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((_, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">New request for Paper Waste from GreenCycle.</p>
                      <p className="text-xs text-slate-500 mt-1">2 minutes ago</p>
                    </div>
                    <span className="text-xs text-slate-400">1 hour ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Buyer Dashboard */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Buyer Dashboard</h2>
            
            {/* Key Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                {buyerMetrics.map((metric, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mb-3`}>
                      <div className="text-white">{metric.icon}</div>
                    </div>
                    <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
                    <div className="text-2xl font-bold text-slate-800">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase History */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Purchase History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Material</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Quantity</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Supplier</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Date</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Cost</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { material: 'Recycled Cardboard', quantity: '8 Tons', supplier: 'PaperLink', date: 'Oct 25, 2023', cost: '18,000 EGP' },
                      { material: 'Metal Shavings', quantity: '9 Tons', supplier: 'PaperLink', date: 'Oct 25, 2023', cost: '12,000 EGP' },
                      { material: 'Recycled Cardboard', quantity: '8 Tons', supplier: 'PaperLink', date: 'Oct 25, 2023', cost: '18,000 EGP' }
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-2 text-sm font-medium text-slate-700">{item.material}</td>
                        <td className="py-4 px-2 text-sm text-slate-600">{item.quantity}</td>
                        <td className="py-4 px-2 text-sm text-slate-600">{item.supplier}</td>
                        <td className="py-4 px-2 text-sm text-slate-600">{item.date}</td>
                        <td className="py-4 px-2 text-sm text-slate-600">{item.cost}</td>
                        <td className="py-4 px-2">
                          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Savings Reports */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Savings Reports</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3">Financial Impact</h4>
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Cost vs. Savings</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3">Environmental Impact</h4>
                  <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Cloud className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">CO2 & Water Savings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard