// src/services/authService.js
import { apiService, setAuthToken, clearAuthData } from './apiService';

export const authService = {
    // تسجيل الدخول
    async login(email, password, rememberMe = false) {
        try {
            console.log('🔐 محاولة تسجيل الدخول:', email);

            const response = await apiService.post('/api/auth/login', {
                email,
                password,
                rememberMe
            });

            if (response.success && response.data?.token) {
                // حفظ التوكن
                setAuthToken(response.data.token);

                // حفظ بيانات المستخدم
                const userData = {
                    ...response.data.user,
                    isLoggedIn: true,
                    lastLogin: new Date().toISOString()
                };

                localStorage.setItem('ecov_user', JSON.stringify(userData));

                console.log('✅ تسجيل الدخول ناجح:', userData);
                return {
                    success: true,
                    message: 'تم تسجيل الدخول بنجاح',
                    user: userData,
                    token: response.data.token
                };
            } else {
                throw new Error(response.message || 'فشل تسجيل الدخول');
            }
        } catch (error) {
            console.error('❌ خطأ تسجيل الدخول:', error);
            throw error;
        }
    },

    // تسجيل الخروج
    async logout() {
        try {
            // محاولة إرسال طلب تسجيل الخروج للخادم
            await apiService.post('/api/auth/logout');
        } catch (error) {
            console.warn('⚠️ خطأ في تسجيل الخروج من الخادم:', error);
        } finally {
            // تنظيف البيانات المحلية في كل الأحوال
            clearAuthData();
            console.log('✅ تم تسجيل الخروج');
        }
    },

    // التحقق من حالة المصادقة
    async checkAuth() {
        try {
            const token = localStorage.getItem('ecov_token');
            const userStr = localStorage.getItem('ecov_user');

            if (!token || !userStr) {
                return { isAuthenticated: false };
            }

            const user = JSON.parse(userStr);

            // التحقق من صلاحية التوكن مع الخادم
            const response = await apiService.get('/api/auth/verify');

            if (response.success) {
                return {
                    isAuthenticated: true,
                    user,
                    token
                };
            } else {
                clearAuthData();
                return { isAuthenticated: false };
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من المصادقة:', error);
            clearAuthData();
            return { isAuthenticated: false };
        }
    },

    // تحديث التوكن
    async refreshToken() {
        try {
            const response = await apiService.post('/api/auth/refresh');

            if (response.success && response.data?.token) {
                setAuthToken(response.data.token);
                return {
                    success: true,
                    token: response.data.token
                };
            }

            return { success: false, message: 'فشل تجديد التوكن' };
        } catch (error) {
            console.error('❌ خطأ في تجديد التوكن:', error);
            throw error;
        }
    }
};