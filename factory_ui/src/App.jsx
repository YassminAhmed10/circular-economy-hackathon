
import { useState } from 'react'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)

  const handleRegistrationSuccess = (userData) => {
    setUser(userData)
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'registration':
        return <Registration onNavigate={setCurrentPage} onRegister={handleRegistrationSuccess} />
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} user={user} />
      case 'login':
        return <Login onNavigate={setCurrentPage} setUser={setUser} />
      default:
        return <Home onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="font-sans antialiased">
      {renderPage()}
    </div>
  )
}

export default App