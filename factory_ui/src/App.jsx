import { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomeNavbar from './components/HomeNavbar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'
import Checkout from './pages/Checkout'
import './App.css'

const Home         = lazy(() => import('./pages/Home'))
const Registration = lazy(() => import('./pages/Registration'))
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const Login        = lazy(() => import('./pages/Login'))
const Marketplace  = lazy(() => import('./pages/Marketplace'))
const WasteDetails = lazy(() => import('./pages/WasteDetails'))
const ListWaste    = lazy(() => import('./pages/ListWaste'))
const Profile      = lazy(() => import('./pages/Profile'))
const Partners     = lazy(() => import('./pages/Partners'))
const MyListings   = lazy(() => import('./pages/MyListings'))
const Orders       = lazy(() => import('./pages/Orders'))
const Sales        = lazy(() => import('./pages/Sales'))
const Messages     = lazy(() => import('./pages/Messages'))
const Analytics    = lazy(() => import('./pages/Analytics'))

// ── HomeLayout ───────────────────────────────────────────────────────────────
function HomeLayout({ children, user, onLogout, lang, setLang, dark, setDark }) {
  return (
    <div
      className="app-container"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: dark ? '#0f1a12' : '#fff', minHeight: '100vh', transition: 'background .3s' }}
    >
      <HomeNavbar
        user={user}
        onLogout={onLogout}
        lang={lang}
        setLang={setLang}
        dark={dark}
        setDark={setDark}
      />
      <main className="main-content">
        {children}
      </main>
      {!user && <Footer />}
    </div>
  )
}

// ── MarketLayout ─────────────────────────────────────────────────────────────
function MarketLayout({ children, user, onLogout, lang, setLang, dark, setDark }) {
  return (
    <div
      className="app-container"
      dir="rtl"
      style={{ background: dark ? '#0f1a12' : '#fff', minHeight: '100vh', transition: 'background .3s' }}
    >
      <HomeNavbar
        user={user}
        onLogout={onLogout}
        lang={lang}
        setLang={setLang}
        dark={dark}
        setDark={setDark}
      />
      <main className="main-content">
        {children}
      </main>
      {!user && <Footer />}
    </div>
  )
}

// ── DashboardLayout ───────────────────────────────────────────────────────────
function DashboardLayout({ children, user, onLogout, lang, setLang, dark, setDark }) {
  return (
    <div
      className="app-container"
      dir="rtl"
      style={{ background: '#f1f5f9', minHeight: '100vh' }}
    >
      <HomeNavbar
        user={user}
        onLogout={onLogout}
        lang={lang}
        setLang={setLang}
        dark={dark}
        setDark={setDark}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

// ── CheckoutLayout — بدون footer، نظيف ───────────────────────────────────────
function CheckoutLayout({ children, user, onLogout, lang, setLang, dark, setDark }) {
  return (
    <div
      className="app-container"
      dir="rtl"
      style={{ background: '#f0f5f1', minHeight: '100vh' }}
    >
      <HomeNavbar
        user={user}
        onLogout={onLogout}
        lang={lang}
        setLang={setLang}
        dark={dark}
        setDark={setDark}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

// ── MainLayout ────────────────────────────────────────────────────────────────
function MainLayout({ children, user, onLogout }) {
  return (
    <div className="app-container" dir="rtl">
      {user && <Navbar user={user} onLogout={onLogout} />}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

// ── ProtectedRoute ────────────────────────────────────────────────────────────
function ProtectedRoute({ children, user }) {
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

// ── PageLoader ────────────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-emerald-700 font-medium">جاري تحميل الصفحة...</p>
      </div>
    </div>
  )
}

// ── AppContent ────────────────────────────────────────────────────────────────
function AppContent() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecov_user')
    return saved ? JSON.parse(saved) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)
  const [lang, setLang]           = useState('ar')
  const [dark, setDark]           = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 800))
      } catch (e) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleRegistrationSuccess = (userData) => {
    try {
      const newUser = {
        ...userData,
        isLoggedIn: true,
        joinedDate: new Date().toISOString(),
        level: 'مبتدئ',
        rating: 4.5,
      }
      setUser(newUser)
      localStorage.setItem('ecov_user', JSON.stringify(newUser))
    } catch {
      setError('حدث خطأ أثناء حفظ بيانات المستخدم')
    }
  }

  const handleLoginSuccess = (userData) => {
    try {
      const loggedInUser = {
        ...userData,
        isLoggedIn: true,
        lastLogin: new Date().toISOString(),
      }
      setUser(loggedInUser)
      localStorage.setItem('ecov_user', JSON.stringify(loggedInUser))
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول')
    }
  }

  const handleLogout = () => {
    try {
      setUser(null)
      localStorage.removeItem('ecov_user')
    } catch {
      setError('حدث خطأ أثناء تسجيل الخروج')
    }
  }

  if (isLoading) return <LoadingScreen message="جاري تحميل التطبيق..." />

  if (error) return (
    <div className="error-page">
      <h1>خطأ</h1>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={() => setError(null)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-all"
      >
        إعادة المحاولة
      </button>
    </div>
  )

  // Props مشتركة
  const navProps = { user, onLogout: handleLogout, lang, setLang, dark, setDark }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>

          {/* ══ HOME ══ */}
          <Route path="/" element={
            <HomeLayout {...navProps}>
              <Suspense fallback={<PageLoader />}>
                <Home user={user} lang={lang} dark={dark} />
              </Suspense>
            </HomeLayout>
          } />

          {/* ══ MARKETPLACE ══ */}
          <Route path="/market" element={
            <MarketLayout {...navProps}>
              <Suspense fallback={<PageLoader />}>
                <Marketplace user={user} />
              </Suspense>
            </MarketLayout>
          } />

          <Route path="/marketplace" element={<Navigate to="/market" replace />} />

          {/* ══ WASTE DETAILS ══ */}
          <Route path="/waste-details/:id" element={
            <MarketLayout {...navProps}>
              <Suspense fallback={<PageLoader />}>
                <WasteDetails user={user} />
              </Suspense>
            </MarketLayout>
          } />

          {/* ══ CHECKOUT ══ */}
          <Route path="/checkout" element={
            <ProtectedRoute user={user}>
              <CheckoutLayout {...navProps}>
                <Checkout lang={lang} dark={dark} />
              </CheckoutLayout>
            </ProtectedRoute>
          } />

          {/* ══ AUTH ══ */}
          <Route path="/login" element={
            <div className="app-container" dir="rtl">
              <main className="main-content">
                <Suspense fallback={<PageLoader />}>
                  <Login onLoginSuccess={handleLoginSuccess} />
                </Suspense>
              </main>
            </div>
          } />

          <Route path="/registration" element={
            <div className="app-container" dir="rtl">
              <main className="main-content">
                <Suspense fallback={<PageLoader />}>
                  <Registration onRegister={handleRegistrationSuccess} />
                </Suspense>
              </main>
            </div>
          } />

          {/* ══ DASHBOARD ══ */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <DashboardLayout {...navProps}>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard user={user} lang={lang} dark={dark} />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ══ PROTECTED ROUTES ══ */}
          {[
            { path: '/list-waste',  Component: ListWaste,  props: { user } },
            { path: '/profile',     Component: Profile,    props: { user, onUpdateUser: setUser } },
            { path: '/partners',    Component: Partners,   props: { user } },
            { path: '/my-listings', Component: MyListings, props: { user } },
            { path: '/orders',      Component: Orders,     props: { user } },
            { path: '/sales',       Component: Sales,      props: { user } },
            { path: '/messages',    Component: Messages,   props: { user } },
            { path: '/analytics',   Component: Analytics,  props: { user } },
          ].map(({ path, Component, props }) => (
            <Route key={path} path={path} element={
              <ProtectedRoute user={user}>
                <DashboardLayout {...navProps}>
                  <Suspense fallback={<PageLoader />}>
                    <Component {...props} />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            } />
          ))}

          {/* ══ 404 ══ */}
          <Route path="/404" element={
            <div className="app-container" dir="rtl">
              <main className="main-content">
                <div className="error-page">
                  <h1>404</h1>
                  <p>الصفحة التي تبحث عنها غير موجودة</p>
                  <a href="/" className="btn-primary">العودة للرئيسية</a>
                </div>
              </main>
            </div>
          } />

          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

function App() {
  return (
    <div className="app-wrapper">
      <AppContent />
    </div>
  )
}

export default App