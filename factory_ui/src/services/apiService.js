// src/services/apiService.js
import API_CONFIG from '../config/api';

const { BASE_URL } = API_CONFIG;

// Export all functions individually
export const testConnection = async () => {
    console.log('🔌 اختبار الاتصال مع Backend...');

    const endpoints = [
        `${BASE_URL}/`,
        `${BASE_URL}/health`,
        `${BASE_URL}/test`,
        `${BASE_URL}/swagger`
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
                return true;
            }
        } catch (error) {
            console.error(`❌ ${endpoint}:`, error.message);
        }
    }
    return false;
};

// دالة POST موحدة
export const post = async (endpoint, data) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    console.log(`📤 POST Request to: ${url}`);
    console.log('📦 Data:', data);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors',
            credentials: 'omit'
        });

        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Server Error (${response.status}):`, errorText);

            // محاولة تحليل الخطأ
            let errorMessage = `HTTP ${response.status}: ${errorText}`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.message) errorMessage = errorJson.message;
                if (errorJson.errors) errorMessage += `\n${errorJson.errors.join(', ')}`;
            } catch {
                // إذا لم يكن JSON
            }

            throw new Error(errorMessage);
        }

        const responseData = await response.json();
        console.log(`✅ POST Success:`, responseData);
        return responseData;

    } catch (error) {
        console.error(`❌ API Error for ${url}:`, error);

        // إذا كان خطأ في الاتصال، جرب HTTP إذا كنا نستخدم HTTPS
        if (error.message.includes('Failed to fetch') || error.message.includes('net::ERR_EMPTY_RESPONSE')) {
            console.log('🔄 محاولة مع HTTP بدلاً من HTTPS...');

            const httpUrl = url.replace('https://', 'http://');
            try {
                const httpResponse = await fetch(httpUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!httpResponse.ok) {
                    throw new Error(`HTTP ${httpResponse.status}`);
                }

                const httpData = await httpResponse.json();
                console.log('✅ HTTP POST Success:', httpData);
                return httpData;
            } catch (httpError) {
                console.error('❌ HTTP POST also failed:', httpError);
            }
        }

        throw error;
    }
};

// دالة خاصة للتسجيل
export const registerFactory = async (factoryData) => {
    return post(API_CONFIG.ENDPOINTS.REGISTER, factoryData);
};

// دالة خاصة للـ login
export const loginUser = async (email, password, rememberMe = false) => {
    return post(API_CONFIG.ENDPOINTS.LOGIN, {
        email,
        password,
        rememberMe
    });
};

// Export default object
const apiService = {
    testConnection,
    post,
    registerFactory,
    loginUser
};

export default apiService;