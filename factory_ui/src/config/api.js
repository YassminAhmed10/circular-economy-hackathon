// src/config/api.js

const API_CONFIG = {
    // 🔥 استخدم نفس البروتوكول والميناء في كل الملفات
    BASE_URL: "https://localhost:54464",  // أو "http://localhost:54464" - استخدم نفس الذي في Login
    ENDPOINTS: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/Register/factory",
        TEST: "/api/test",
        HEALTH: "/health"
    }
};

export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const testBackendConnection = async () => {
    console.log('🔌 اختبار اتصال Backend...');

    const endpoints = [
        `${API_CONFIG.BASE_URL}/`,
        `${API_CONFIG.BASE_URL}/health`,
        `${API_CONFIG.BASE_URL}/test`,
        `${API_CONFIG.BASE_URL}/swagger`
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`🔍 اختبار: ${endpoint}`);
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                mode: 'cors',
                credentials: 'omit'
            });

            console.log(`📊 ${endpoint}: ${response.status} ${response.statusText}`);

            if (response.ok) {
                const data = await response.text();
                console.log(`✅ استجابة:`, data.substring(0, 200));
                return { success: true, endpoint };
            }
        } catch (error) {
            console.error(`❌ ${endpoint}:`, error.message);
        }
    }

    return { success: false };
};

export default API_CONFIG;