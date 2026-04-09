import { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomeNavbar from './components/HomeNavbar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'
import VerificationBanner from './components/VerificationBanner'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const Registration = lazy(() => import('./pages/Registration'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Marketplace = lazy(() => import('./pages/Marketplace'))
const WasteDetails = lazy(() => import('./pages/WasteDetails'))
const ListWaste = lazy(() => import('./pages/ListWaste'))
const SustainablePackagingWaste = lazy(() => import('./pages/SustainablePackagingWaste'))
const Profile = lazy(() => import('./pages/Profile'))
const Partners = lazy(() => import('./pages/Partners'))
const MyListings = lazy(() => import('./pages/MyListings'))
const Orders = lazy(() => import('./pages/Orders'))
const Messages = lazy(() => import('./pages/Messages'))
const Analytics = lazy(() => import('./pages/Analytics'))
const AdminVerification = lazy(() => import('./pages/AdminVerification'))

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
function DashboardLayout({ children, user, onLogout, lang, setLang, dark, setDark, bannerHidden, setBannerHidden, showVerifiedSuccess }) {
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
            {!bannerHidden && (
                <VerificationBanner
                    user={user}
                    lang={lang}
                    dark={dark}
                    showVerifiedSuccess={showVerifiedSuccess}
                    onClose={() => setBannerHidden(true)}
                />
            )}
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

function AdminRoute({ children, user }) {
    const location = useLocation()
    if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
    if ((user.role || '').toLowerCase() !== 'admin') return <Navigate to="/dashboard" replace />
    return children
}

// ── PageLoader ────────────────────────────────────────────────────────────────
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
    const [error, setError] = useState(null)

    const [lang, setLang] = useState('ar')
    const [dark, setDark] = useState(false)
    const [bannerHidden, setBannerHidden] = useState(false)
    const [showVerifiedSuccessBanner, setShowVerifiedSuccessBanner] = useState(false)

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
            const newUser = { ...userData, isLoggedIn: true, joinedDate: new Date().toISOString(), level: 'مبتدئ', rating: 4.5, logoPreview: userData.logoPreview }
            setUser(newUser)
            localStorage.setItem('ecov_user', JSON.stringify(newUser))
            setBannerHidden(false)
        } catch (e) {
            setError('حدث خطأ أثناء حفظ بيانات المستخدم')
        }
    }

    const handleLoginSuccess = (userData) => {
        try {
            const userEmail = (userData?.email || '').trim().toLowerCase()
            const statusKey = `ecov_factory_status_${userEmail}`
            const verifiedSeenKey = `ecov_verified_banner_seen_${userEmail}`

            const previousStatus = (localStorage.getItem(statusKey) || '').trim().toLowerCase()
            const currentStatus = (userData?.status || '').trim().toLowerCase()
            const isNowVerified = currentStatus === 'approved' || currentStatus === 'active'
            const wasVerifiedBefore = previousStatus === 'approved' || previousStatus === 'active'
            const alreadyShown = localStorage.getItem(verifiedSeenKey) === '1'
            const shouldShowVerifiedSuccess = isNowVerified && !wasVerifiedBefore && !alreadyShown

            if (userEmail) {
                localStorage.setItem(statusKey, currentStatus)
                if (shouldShowVerifiedSuccess) {
                    localStorage.setItem(verifiedSeenKey, '1')
                }
            }

            const loggedInUser = { ...userData, isLoggedIn: true, lastLogin: new Date().toISOString() }
            setUser(loggedInUser)
            localStorage.setItem('ecov_user', JSON.stringify(loggedInUser))
            setShowVerifiedSuccessBanner(shouldShowVerifiedSuccess)
            setBannerHidden(false)
        } catch (e) {
            setError('حدث خطأ أثناء تسجيل الدخول')
        }
    }

    const handleLogout = () => {
        try {
            setUser(null);
            localStorage.removeItem('ecov_user');
            setBannerHidden(false);
            setShowVerifiedSuccessBanner(false);
        } catch (e) {
            setError('حدث خطأ أثناء تسجيل الخروج')
        }
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

    const navProps = { user, onLogout: handleLogout, lang, setLang, dark, setDark }

    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <HomeLayout {...navProps}>
                            <Suspense fallback={<PageLoader />}>
                                <Home user={user} lang={lang} dark={dark} />
                            </Suspense>
                        </HomeLayout>
                    } />

                    <Route path="/market" element={
                        <MarketLayout {...navProps}>
                            <Suspense fallback={<PageLoader />}>
                                <Marketplace user={user} lang={lang} dark={dark} />
                            </Suspense>
                        </MarketLayout>
                    } />
                    <Route path="/marketplace" element={<Navigate to="/market" replace />} />

                    <Route path="/waste-details/:id" element={
                        <MarketLayout {...navProps}>
                            <Suspense fallback={<PageLoader />}>
                                <WasteDetails user={user} lang={lang} dark={dark} />
                            </Suspense>
                        </MarketLayout>
                    } />

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

                    <Route path="/dashboard" element={
                        <ProtectedRoute user={user}>
                            <DashboardLayout {...navProps} bannerHidden={bannerHidden} setBannerHidden={setBannerHidden} showVerifiedSuccess={showVerifiedSuccessBanner}>
                                <Suspense fallback={<PageLoader />}>
                                    <Dashboard user={user} lang={lang} dark={dark} />
                                </Suspense>
                            </DashboardLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/verification" element={
                        <AdminRoute user={user}>
                            <div className="app-container" dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: dark ? '#0f1a12' : '#f8fafc' }}>
                                <main className="main-content" style={{ paddingTop: 0 }}>
                                    <Suspense fallback={<PageLoader />}>
                                        <AdminVerification user={user} lang={lang} dark={dark} />
                                    </Suspense>
                                </main>
                            </div>
                        </AdminRoute>
                    } />

                    {[
                        { path: '/list-waste', Component: ListWaste },
                        { path: '/packaging-waste', Component: SustainablePackagingWaste },
                        { path: '/profile', Component: Profile, extraProps: { onUpdateUser: setUser } },
                        { path: '/partners', Component: Partners },
                        { path: '/my-listings', Component: MyListings },
                        { path: '/orders', Component: Orders },
                        { path: '/messages', Component: Messages },
                        { path: '/analytics', Component: Analytics },
                    ].map(({ path, Component, extraProps = {} }) => (
                        <Route key={path} path={path} element={
                            <ProtectedRoute user={user}>
                                <DashboardLayout {...navProps} bannerHidden={bannerHidden} setBannerHidden={setBannerHidden} showVerifiedSuccess={showVerifiedSuccessBanner}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Component user={user} lang={lang} dark={dark} {...extraProps} />
                                    </Suspense>
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                    ))}

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