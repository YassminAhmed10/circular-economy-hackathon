// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:54464/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout:', error.config?.url);
        } else if (error.response) {
            console.error('❌ API Error:', error.response.status, error.config?.url, error.response.data);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('factory');
                window.location.href = '/login';
            }
        } else if (error.request) {
            console.error('❌ No response from server:', error.request);
        } else {
            console.error('❌ Request setup error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    testDB: () => api.get('/auth/test-db'),
};

// Registration endpoints
export const registrationAPI = {
    register: (formData) => {
        // تحقق من أن ownerPhone ليس بريدًا إلكترونيًا (يحتوي على @)
        let ownerPhone = formData.ownerPhone;
        if (ownerPhone && ownerPhone.includes('@')) {
            ownerPhone = formData.phone; // استخدم رقم هاتف المصنع بدلاً من ذلك
        }

        const requestData = {
            factoryName: formData.factoryName,
            factoryNameEn: formData.factoryName,
            industryType: formData.industryType,
            location: formData.location,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            ownerName: formData.ownerName,
            ownerPhone: ownerPhone || formData.phone, // تأمين إضافي
            taxNumber: formData.taxNumber || '000000000',
            registrationNumber: formData.registrationNumber || '000000000',
            establishmentYear: parseInt(formData.establishmentYear) || new Date().getFullYear(),
            factorySize: 1000,
            productionCapacity: parseFloat(formData.productionCapacity) || 100,
            password: formData.password,
            fax: '',
            website: '',
            ownerEmail: formData.email,
            numberOfEmployees: 50,
            descriptionAr: formData.mainProducts || 'Factory description',
            descriptionEn: formData.mainProducts || 'Factory description',
            LogoBase64: formData.logoPreview || null
        };

        console.log('Sending registration data with LogoBase64:', requestData.LogoBase64 ? 'present' : 'null');
        return api.post('/register/factory', requestData);
    }
};

// Profile endpoints
export const profileAPI = {
    getProfile: () => api.get('/profile/me'),
    updateProfile: (data) => api.put('/profile/me', data),
    changePassword: (current, newPass) => api.put('/profile/password', { currentPassword: current, newPassword: newPass }),
    getStats: () => api.get('/profile/stats'),
    requestVerification: () => api.post('/profile/request-verification'),
    verifyFactory: (factoryId) => api.put(`/profile/verify-factory/${factoryId}`),
};

export const adminVerificationAPI = {
    getRequests: () => api.get('/admin/verification-requests'),
    approveFactory: (factoryId) => api.put(`/admin/verification-requests/${factoryId}/approve`),
    rejectFactory: (factoryId, reason) => api.put(`/admin/verification-requests/${factoryId}/reject`, { reason }),
    getListingRequests: () => api.get('/admin/listing-requests'),
    approveListing: (listingId) => api.put(`/admin/listing-requests/${listingId}/approve`),
    rejectListing: (listingId, reason) => api.put(`/admin/listing-requests/${listingId}/reject`, { reason }),
    getNotifications: () => api.get('/admin/notifications'),
};

// Marketplace endpoints
export const marketplaceAPI = {
    getListings: (params) => api.get('/marketplace/waste-listings', { params }),
    getListingById: (id) => api.get(`/marketplace/waste-listings/${id}`),
    createListing: (data) => api.post('/marketplace/waste-listings', data),
    updateListing: (id, data) => api.put(`/marketplace/waste-listings/${id}`, data),
    deleteListing: (id) => api.delete(`/marketplace/waste-listings/${id}`),
    getMyListings: () => api.get('/marketplace/my-listings'),
    getCategories: () => api.get('/marketplace/categories'),
    debugTable: () => api.get('/marketplace/debug-table'),
    diagnoseConnection: () => api.get('/marketplace/diagnose-connection'),
};

// Orders endpoints
export const ordersAPI = {
    getOrders: (params) => api.get('/orders', { params }),
    getOrderById: (id) => api.get(`/orders/${id}`),
    createOrder: (data) => api.post('/orders', data),
    updateOrderStatus: (id, status, deliveryDate) => api.put(`/orders/${id}/status`, { status, deliveryDate }),
    cancelOrder: (id) => api.delete(`/orders/${id}`),
    getOrderStats: () => api.get('/orders/stats'),
    debugDB: () => api.get('/orders/debug-db'),
};

// Dashboard endpoints
export const dashboardAPI = {
    getDashboard: () => api.get('/dashboard'),
    getAnalytics: () => api.get('/dashboard/analytics'),
    getCategories: () => api.get('/dashboard/categories'),
};

// Test function to check API connection
export const testAPIConnection = async () => {
    try {
        const response = await api.get('/auth/test-db');
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            details: error.response?.data || error.request || 'No response from server'
        };
    }
};

export default api;