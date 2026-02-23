/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Factory, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logooo1ecov.png';
import './Login.css';

// ✅ FIXED: Create an API config
const API_CONFIG = {
    BASE_URL: "https://localhost:54464",
    ENDPOINTS: {
        LOGIN: "/api/auth/login"
    }
};

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isBackendOnline, setIsBackendOnline] = useState(null);

    useEffect(() => {
        checkBackendStatus();
    }, []);

    const checkBackendStatus = async () => {
        try {
            const endpoints = [
                '/',
                '/api/health',
                '/health',
                '/swagger/v1/swagger.json',
                '/favicon.ico'
            ];

            let isOnline = false;

            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                        mode: 'no-cors'
                    });
                    isOnline = true;
                    console.log(`Backend reachable at: ${endpoint}`);
                    break;
                } catch (err) {
                    console.log(`Endpoint ${endpoint} failed:`, err.message);
                    continue;
                }
            }

            setIsBackendOnline(isOnline);

            if (!isOnline) {
                try {
                    await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                        method: 'OPTIONS',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    setIsBackendOnline(true);
                } catch (error) {
                    console.log('CORS preflight also failed:', error.message);
                }
            }

        } catch (error) {
            console.log('Backend status check error:', error.message);
            setIsBackendOnline(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    rememberMe: formData.rememberMe
                })
            });

            console.log('Login response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Login error response:', errorText);
                throw new Error(`Login failed: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            // Handle the response based on your DTO structure
            if (result.success && result.data) {
                // ApiResponse<LoginResponse> format
                handleLoginSuccess(result.data);
            } else if (result.token) {
                // Direct token response
                handleLoginSuccess(result);
            } else {
                setError(result.message || 'Login failed');
            }

        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = (loginData) => {
        console.log('Login success data:', loginData);

        // Extract token - it could be in different places
        const token = loginData.token || loginData.accessToken;

        if (!token) {
            console.error('No token in response:', loginData);
            setError('Invalid server response: No token received');
            return;
        }

        // Store token in localStorage (always store token, rememberMe controls user data storage)
        localStorage.setItem('token', token);

        // Also store user data if rememberMe is checked
        if (formData.rememberMe) {
            localStorage.setItem('user', JSON.stringify({
                id: loginData.user?.id || loginData.userId,
                email: loginData.user?.email || formData.email,
                fullName: loginData.user?.fullName || loginData.fullName,
                role: loginData.user?.role || loginData.role,
                factoryId: loginData.user?.factoryId || loginData.factoryId || loginData.factory?.id
            }));
        } else {
            // Store in sessionStorage for session-only
            sessionStorage.setItem('user', JSON.stringify({
                id: loginData.user?.id || loginData.userId,
                email: loginData.user?.email || formData.email,
                fullName: loginData.user?.fullName || loginData.fullName,
                role: loginData.user?.role || loginData.role,
                factoryId: loginData.user?.factoryId || loginData.factoryId || loginData.factory?.id
            }));
        }

        // Call the onLoginSuccess callback if provided
        if (onLoginSuccess) {
            onLoginSuccess({
                id: loginData.user?.id || loginData.userId,
                fullName: loginData.user?.fullName || loginData.fullName,
                email: loginData.user?.email || formData.email,
                role: loginData.user?.role || loginData.role,
                factoryId: loginData.user?.factoryId || loginData.factoryId || loginData.factory?.id,
                factory: loginData.factory,
                token: token,
                isLoggedIn: true
            });
        }

        // Navigate to dashboard
        navigate('/dashboard');
    };

    const handleRememberMe = (e) => {
        setFormData({ ...formData, rememberMe: e.target.checked });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden" dir="rtl">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-teal-500/10 rounded-full blur-3xl"></div>
            </div>

            <nav className="relative bg-black/30 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="ECOv Logo" className="h-12 w-auto object-contain" />
                            <div className="hidden sm:block">
                                <h1 className="text-white font-bold text-lg">ECOv</h1>
                                <p className="text-emerald-300 text-xs">Circular Economy Platform</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isBackendOnline === true ? 'bg-green-500' : isBackendOnline === false ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                <span className="text-white text-sm">
                                    {isBackendOnline === true ? 'Server Connected' :
                                        isBackendOnline === false ? 'Server Disconnected' :
                                            'Checking...'}
                                </span>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/20 backdrop-blur-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="font-semibold">Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="hidden lg:block text-white space-y-8">
                            <div>
                                <h2 className="text-5xl font-bold mb-4 leading-tight">
                                    Welcome to
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> ECOv</span>
                                </h2>
                                <p className="text-xl text-slate-300 leading-relaxed">
                                    Circular Economy Platform for Egyptian Factories
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Factory className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Manage Your Factory Efficiently</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Track waste, analyze data, and communicate with partners in one place
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                                    <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-6 h-6 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Advanced Security</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Protect your factory data with the latest security and encryption standards
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Trusted Partner Network</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Connect with certified factories and recyclers from all over Egypt
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                                {isBackendOnline === false && (
                                    <div className="bg-yellow-500/90 p-4 text-white text-center">
                                        <p className="font-bold">⚠️ Warning</p>
                                        <p className="text-sm">Server status: Checking connection... Login may still work.</p>
                                        <button
                                            onClick={checkBackendStatus}
                                            className="mt-2 px-4 py-1 bg-white/20 rounded text-sm hover:bg-white/30"
                                        >
                                            Retry Connection Check
                                        </button>
                                    </div>
                                )}

                                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-white text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                                            <Lock className="w-10 h-10 text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">
                                        Login
                                    </h2>
                                    <p className="text-emerald-100 text-lg">
                                        Access your factory dashboard
                                    </p>
                                </div>

                                {error && (
                                    <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-center font-medium whitespace-pre-line">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="p-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-slate-700 font-bold mb-3 text-lg">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                                                    <Mail className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full pr-12 pl-4 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-lg bg-white"
                                                    placeholder="example@company.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-slate-700 font-bold mb-3 text-lg">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                                                    <Lock className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full pr-12 pl-12 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-lg bg-white"
                                                    placeholder="Enter password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors z-10"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.rememberMe}
                                                    onChange={handleRememberMe}
                                                    className="w-5 h-5 text-emerald-600 rounded border-2 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                                                />
                                                <span className="text-slate-700 font-medium group-hover:text-emerald-600 transition-colors">Remember me</span>
                                            </label>
                                            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all">
                                                Forgot password?
                                            </a>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Logging in...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Login</span>
                                                    <ArrowLeft className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="px-8 pb-8">
                                    <div className="border-t-2 border-slate-200 pt-6 text-center">
                                        <p className="text-slate-600 mb-4 text-lg font-medium">
                                            Don't have an account? Register your factory now
                                        </p>
                                        <button
                                            onClick={() => navigate('/registration')}
                                            className="w-full py-4 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl transition-all hover:shadow-md text-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Register New Factory
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-slate-300">
                                    Having login issues?{' '}
                                    <a href="#" className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-colors">
                                        Contact Support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative text-center pb-8 text-slate-400 text-sm">
                <p>© 2026 ECOv - All rights reserved</p>
            </div>
        </div>
    );
}

export default Login;