import { useState } from 'react'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch(currentPage) {
      case 'registration':
        return <Registration />
      case 'dashboard':
        return <Dashboard />
      default:
        return <Home />
    }
  }

  return (
    <div className="font-sans antialiased">
      {/* Demo Navigation - Fixed at top right */}
      <div className="fixed top-6 right-6 z-50 bg-white rounded-2xl shadow-2xl p-4 border-2 border-slate-200">
        <div className="text-xs font-bold text-slate-600 mb-3">DEMO NAVIGATION</div>
        <div className="flex flex-col gap-2">
          {['home', 'registration', 'dashboard'].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                currentPage === page
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {renderPage()}
    </div>
  )
}

export default App