import { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomeNavbar from './components/HomeNavbar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

// تحميل المكونات بكسل (لتحسين الأداء)
const Home = lazy(() => import('./pages/Home'))
const Registration = lazy(() => import('./pages/Registration'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Marketplace = lazy(() => import('./pages/Marketplace'))
const WasteDetails = lazy(() => import('./pages/WasteDetails'))
const ListWaste = lazy(() => import('./pages/ListWaste'))
const Profile = lazy(() => import('./pages/Profile'))
const Partners = lazy(() => import('./pages/Partners'))
const MyListings = lazy(() => import('./pages/MyListings'))
const Orders = lazy(() => import('./pages/Orders'))
const Messages = lazy(() => import('./pages/Messages'))
const Analytics = lazy(() => import('./pages/Analytics'))

// مكون تخطيط للصفحة الرئيسية فقط
function HomeLayout({ children, user, onLogout }) {
    const location = useLocation()

    return (
        <div className="app-container" dir="rtl">
            {user ? (
                // للمستخدم المسجل: نعرض الـ Navbar الكامل
                <Navbar user={user} onLogout={onLogout} />
            ) : (
                // للمستخدم غير المسجل: نعرض الـ HomeNavbar البسيط
                <HomeNavbar user={user} onLogout={onLogout} />
            )}
            <main className="main-content">
                {children}
            </main>
            {/* نعرض Footer فقط لغير المسجلين في الصفحة الرئيسية */}
            {!user && <Footer />}
        </div>
    )
}

// مكون تخطيط رئيسي للصفحات الأخرى
function MainLayout({ children, user, onLogout }) {
    return (
        <div className="app-container" dir="rtl">
            {/* للصفحات الأخرى، نعرض Navbar فقط للمسجلين */}
            {user && <Navbar user={user} onLogout={onLogout} />}
            <main className="main-content">
                {children}
            </main>
            {/* لا نعرض Footer في الصفحات الأخرى */}
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

// Fallback component للتحميل
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

function AppContent() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('ecov_user')
        return savedUser ? JSON.parse(savedUser) : null
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        // محاكاة تحميل البيانات الأولية
        const loadInitialData = async () => {
            try {
                setIsLoading(true)
                await new Promise(resolve => setTimeout(resolve, 1000))
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        loadInitialData()
    }, [])

    const handleRegistrationSuccess = (userData) => {
        try {
            const newUser = {
                ...userData,
                isLoggedIn: true,
                joinedDate: new Date().toISOString(),
                level: 'مبتدئ',
                rating: 4.5
            }
            setUser(newUser)
            localStorage.setItem('ecov_user', JSON.stringify(newUser))
        } catch (err) {
            setError('حدث خطأ أثناء حفظ بيانات المستخدم')
        }
    }

    const handleLoginSuccess = (userData) => {
        try {
            const loggedInUser = {
                ...userData,
                isLoggedIn: true,
                lastLogin: new Date().toISOString()
            }
            setUser(loggedInUser)
            localStorage.setItem('ecov_user', JSON.stringify(loggedInUser))
        } catch (err) {
            setError('حدث خطأ أثناء تسجيل الدخول')
        }
    }

    const handleLogout = () => {
        try {
            setUser(null)
            localStorage.removeItem('ecov_user')
        } catch (err) {
            setError('حدث خطأ أثناء تسجيل الخروج')
        }
    }

    if (isLoading) {
        return <LoadingScreen message="جاري تحميل التطبيق..." />
    }

    if (error) {
        return (
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
    }

    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    {/* الصفحة الرئيسية - لها تخطيط خاص */}
                    <Route path="/" element={
                        <HomeLayout user={user} onLogout={handleLogout}>
                            <Suspense fallback={<PageLoader />}>
                                <Home user={user} />
                            </Suspense>
                        </HomeLayout>
                    } />

                    {/* صفحات التسجيل والدخول - بدون Navbar */}
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

                    {/* الصفحات المحمية - تظهر فقط للمسجلين */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Dashboard user={user} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/marketplace"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Marketplace user={user} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/waste-details/:id"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <WasteDetails user={user} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/list-waste"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <ListWaste user={user} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Profile user={user} onUpdateUser={setUser} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/partners"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Partners user={user} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/my-listings"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <MyListings user={user} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Orders user={user} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Messages user={user} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute user={user}>
                                <MainLayout user={user} onLogout={handleLogout}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Analytics user={user} />
                                    </Suspense>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 Page */}
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

                    {/* Catch all route - redirect to 404 */}
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