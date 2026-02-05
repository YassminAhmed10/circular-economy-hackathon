import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Marketplace from './pages/Marketplace'
import WasteDetails from './pages/WasteDetails'
import ListWaste from './pages/ListWaste'
import Profile from './pages/Profile'
import Partners from './pages/Partners'
import MyListings from './pages/MyListings'
import Orders from './pages/Orders'
import Messages from './pages/Messages'
import Analytics from './pages/Analytics'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

// مكون لتحديد نوع الهيدر بناءً على الصفحة
function Layout({ children, user, onLogout, showDashboardNavbar = false }) {
  const location = useLocation()
  
  // الصفحات التي تظهر فيها Home Navbar فقط
  const homePages = ['/', '/login', '/registration']
  
  if (homePages.includes(location.pathname)) {
    return <>{children}</> // بدون Navbar (سيكون في Home)
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

// Protected Route Component
function ProtectedRoute({ children, user }) {
  const location = useLocation()
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  
  return children
}

function AppContent() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const handleRegistrationSuccess = (userData) => {
    const newUser = {
      ...userData,
      isLoggedIn: true
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const handleLoginSuccess = (userData) => {
    const loggedInUser = {
      ...userData,
      isLoggedIn: true
    }
    setUser(loggedInUser)
    localStorage.setItem('user', JSON.stringify(loggedInUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/registration" element={<Registration onRegister={handleRegistrationSuccess} />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/marketplace" 
          element={
            <ProtectedRoute user={user}>
              <Marketplace user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/waste-details/:id" 
          element={
            <ProtectedRoute user={user}>
              <WasteDetails user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/list-waste" 
          element={
            <ProtectedRoute user={user}>
              <ListWaste user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} onUpdateUser={setUser} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/partners" 
          element={
            <ProtectedRoute user={user}>
              <Partners user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/my-listings" 
          element={
            <ProtectedRoute user={user}>
              <MyListings user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute user={user}>
              <Orders user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute user={user}>
              <Messages user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute user={user}>
              <Analytics user={user} />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App