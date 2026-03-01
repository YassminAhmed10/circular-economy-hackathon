import { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomeNavbar from './components/HomeNavbar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'
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

// ── DashboardLayout — HomeNavbar الأبيض لكل الصفحات المحمية ──────────────────
function DashboardLayout({ children, user, onLogout, lang, setLang, dark, setDark }) {
  return (
    <div
      className="app-container"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: dark ? '#0f1a12' : '#f1f5f9', minHeight: '100vh', transition: 'background .3s' }}
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

// ── MainLayout (للصفحات التانية اللي مش dashboard) ───────────────────────────
function MainLayout({ children, user, onLogout, lang, setLang, dark, setDark }) {
  return (
    <div
      className="app-container"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: dark ? '#0f1a12' : '#fff', minHeight: '100vh', transition: 'background .3s' }}
    >
      {user && <Navbar user={user} onLogout={onLogout} lang={lang} setLang={setLang} dark={dark} setDark={setDark} />}
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
// تم استبدال المحتوى القديم بـ LoadingScreen الجديد
function PageLoader() {
  return <LoadingScreen message="جاري تحميل الصفحة..." />
}

// ── AppContent ────────────────────────────────────────────────────────────────
function AppContent() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecov_user')
    return saved ? JSON.parse(saved) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)

  const [lang, setLang] = useState('ar')
  const [dark, setDark] = useState(false)

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
      const newUser = { ...userData, isLoggedIn: true, joinedDate: new Date().toISOString(), level: 'مبتدئ', rating: 4.5,logoPreview: userData.logoPreview}
      setUser(newUser)
      localStorage.setItem('ecov_user', JSON.stringify(newUser))
    } catch (e) {
      setError('حدث خطأ أثناء حفظ بيانات المستخدم')
    }
  }

  const handleLoginSuccess = (userData) => {
    try {
      const loggedInUser = { ...userData, isLoggedIn: true, lastLogin: new Date().toISOString() }
      setUser(loggedInUser)
      localStorage.setItem('ecov_user', JSON.stringify(loggedInUser))
    } catch (e) {
      setError('حدث خطأ أثناء تسجيل الدخول')
    }
  }

  const handleLogout = () => {
    try { setUser(null); localStorage.removeItem('ecov_user') }
    catch (e) { setError('حدث خطأ أثناء تسجيل الخروج') }
  }

  if (isLoading) return <LoadingScreen message="جاري تحميل التطبيق..." />

  if (error) return (
    <div className="error-page">
      <h1>خطأ</h1>
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => setError(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-all">
        إعادة المحاولة
      </button>
    </div>
  )

  // Props مشتركة للـ layouts
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
                <Marketplace user={user} lang={lang} dark={dark} />
              </Suspense>
            </MarketLayout>
          } />


          <Route path="/marketplace" element={<Navigate to="/market" replace />} />

          {/* ══ WASTE DETAILS ══ */}
          <Route path="/waste-details/:id" element={
            <MarketLayout {...navProps}>
              <Suspense fallback={<PageLoader />}>
                <WasteDetails user={user} lang={lang} dark={dark} />
              </Suspense>
            </MarketLayout>
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

          {/* ══ DASHBOARD — HomeNavbar الأبيض ══ */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <DashboardLayout {...navProps}>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard user={user} lang={lang} dark={dark} />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ══ PROTECTED ROUTES — بـ HomeNavbar الأبيض ══ */}
          {[
            { path:'/list-waste',  Component:ListWaste },
            { path:'/profile',     Component:Profile,    extraProps:{ onUpdateUser:setUser } },
            { path:'/partners',    Component:Partners },
            { path:'/my-listings', Component:MyListings },
            { path:'/orders',      Component:Orders },
            { path:'/messages',    Component:Messages },
            { path:'/analytics',   Component:Analytics },
          ].map(({ path, Component, extraProps = {} }) => (
            <Route key={path} path={path} element={
              <ProtectedRoute user={user}>
                <DashboardLayout {...navProps}>
                  <Suspense fallback={<PageLoader />}>
                    <Component user={user} lang={lang} dark={dark} {...extraProps} />
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