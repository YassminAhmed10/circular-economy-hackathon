// src/services/circularEconomyApi.js
import axios from 'axios';
import api from './api';

const API_BASE_URL = import.meta.env.VITE_CE_API_URL || 'https://localhost:54464/api/circular-economy';

const ceApi = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000
});

// ── Interceptors ──────────────────────────────────────────────────────────────
ceApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        console.log('🔄 CE API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

ceApi.interceptors.response.use(
    (response) => {
        console.log('✅ CE API Response:', response.status, response.data?.message || 'Success');
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        console.error('❌ CE API Error:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || error.message);
    }
);

// ==================== WASTE ASSETS ====================

export const createWasteAsset       = async (req)          => safeCall(() => ceApi.post('/waste-assets', req));
export const getWasteAssets         = async (factoryId, status, page = 1, pageSize = 10) => {
    const params = { pageIndex: page - 1, pageSize };
    if (factoryId) params.factoryId = factoryId;
    if (status)    params.status    = status;
    return safeCall(() => ceApi.get('/waste-assets', { params }));
};
export const getWasteAsset          = async (id)           => safeCall(() => ceApi.get(`/waste-assets/${id}`));
export const updateWasteAsset       = async (id, req)      => safeCall(() => ceApi.put(`/waste-assets/${id}`, req));

// ==================== WASTE ASSET OFFERS ====================

export const createWasteAssetOffer  = async (req)          => safeCall(() => ceApi.post('/waste-asset-offers', req));
export const getWasteAssetOffers    = async (wasteAssetId) => safeCall(() => ceApi.get('/waste-asset-offers', { params: { wasteAssetId } }));
export const acceptWasteAssetOffer  = async (id, req)      => safeCall(() => ceApi.post(`/waste-asset-offers/${id}/accept`, req));
export const rejectWasteAssetOffer  = async (id, req)      => safeCall(() => ceApi.post(`/waste-asset-offers/${id}/reject`, req));

// ==================== RECYCLING ORDERS ====================

export const createRecyclingOrder   = async (req)          => safeCall(() => ceApi.post('/recycling-orders', req));
export const getRecyclingOrders     = async (filters = {}) => safeCall(() => ceApi.get('/recycling-orders', { params: filters }));
export const getRecyclingOrder      = async (id)           => safeCall(() => ceApi.get(`/recycling-orders/${id}`));
export const completeRecyclingOrder = async (id, req)      => safeCall(() => ceApi.post(`/recycling-orders/${id}/complete`, req));

// ==================== IMPACT & ANALYTICS ====================

export const getFactoryImpact       = async (factoryId)    => safeCall(() => ceApi.get(`/factory-impact/${factoryId}`));
export const getPlatformImpact      = async ()             => safeCall(() => ceApi.get('/platform-impact'));

// ==================== MARKETPLACE ORDERS ====================

/**
 * Create a marketplace order (buyer purchases waste listing).
 * The backend will immediately RESERVE the requested quantity
 * (deduct from available, track in ReservedAmount).
 * 
 * @param {{ wasteListingId, amount, notes, orderType, recipientName,
 *           recipientPhone, deliveryAddress, governorate,
 *           deliveryMethod, paymentMethod, recyclerId }} orderData
 */
export const createMarketplaceOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        const payload  = response?.data ?? response;
        if (payload?.success) {
            // Broadcast so Marketplace component can refresh quantities
            window.dispatchEvent(new CustomEvent('orderCreated', {
                detail: { listingId: orderData.wasteListingId, amount: orderData.amount }
            }));
            return { success: true, data: payload.data, message: payload.message };
        }
        return { success: false, error: payload?.message || 'Failed to create order' };
    } catch (error) {
        return { success: false, error: error?.message || 'Failed to create order' };
    }
};

// ── Legacy alias ─────────────────────────────────────────────────────────────
export const createOrder = createMarketplaceOrder;

/**
 * Get all orders for a factory (buyer + seller sides).
 */
export const getFactoryOrders = async (factoryId, role = 'all') => {
    try {
        const response = await api.get('/orders', { params: { factoryId, role } });
        const payload  = response?.data ?? response;
        return payload?.success
            ? { success: true, data: payload.data, message: payload.message }
            : { success: false, error: payload?.message || 'Failed to fetch orders' };
    } catch (error) {
        return { success: false, error: error?.message || 'Failed to fetch orders' };
    }
};

export const getOrders = async (factoryId, filters = {}) => {
    try {
        const query    = new URLSearchParams({ factoryId, ...filters }).toString();
        const response = await api.get(`/orders?${query}`);
        const payload  = response?.data ?? response;
        return payload?.success
            ? { success: true, data: payload.data, message: payload.message }
            : { success: false, error: payload?.message || 'Failed to fetch orders' };
    } catch (error) {
        return { success: false, error: error?.message || 'Failed to fetch orders' };
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        const payload  = response?.data ?? response;
        return payload?.success
            ? { success: true, data: payload.data, message: payload.message }
            : { success: false, error: payload?.message || 'Failed to fetch order' };
    } catch (error) {
        return { success: false, error: error?.message || 'Failed to fetch order' };
    }
};

export const getOrderWithPayments = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}/with-payments`);
        const payload  = response?.data ?? response;
        return payload?.success
            ? { success: true, data: payload.data, message: payload.message }
            : { success: false, error: payload?.message || 'Failed to fetch order payments' };
    } catch (error) {
        return { success: false, error: error?.message || 'Failed to fetch order payments' };
    }
};

/**
 * Update order status.
 * Key statuses and their effect on listing quantity:
 *   "معلق"         → set on creation (quantity already reserved)
 *   "مقبول"        → reservation consumed; available stays reduced  ✅
 *   "مرفوض"        → reservation released; available restored       🔄
 *   "ملغى"         → reservation released; available restored       🔄
 *   "قيد التوصيل"  → in-progress, no quantity change
 *   "مكتمل"        → completed, no quantity change
 */
export const updateOrderStatus = async (orderId, newStatus, deliveryDate) => {
    try {
        const body = { status: newStatus };
        if (deliveryDate) body.deliveryDate = deliveryDate;

        const response = await api.put(`/orders/${orderId}/status`, body);
        const payload  = response?.data ?? response;

        if (payload?.success) {
            // Broadcast status change so listings can refresh
            window.dispatchEvent(new CustomEvent('orderStatusChanged', {
                detail: { orderId, newStatus }
            }));
            return { success: true, data: payload.data, message: payload.message };
        }
        return { success: false, error: payload?.message || 'Failed to update order status' };
    } catch (error) {
        return { success: false, error: error?.message || 'Failed to update order status' };
    }
};

/**
 * Seller accepts a pending order.
 * Reservation is consumed → available quantity stays reduced.
 */
export const acceptOrder = (orderId) => updateOrderStatus(orderId, 'مقبول');

/**
 * Seller rejects a pending order.
 * Reservation is released → available quantity is RESTORED.
 */
export const rejectOrder = (orderId) => updateOrderStatus(orderId, 'مرفوض');

/**
 * Buyer cancels a pending order.
 * Equivalent to rejection — quantity is RESTORED.
 */
export const cancelOrder = async (orderId) => {
    try {
        const response = await api.delete(`/orders/${orderId}`);
        const payload  = response?.data ?? response;
        if (payload?.success) {
            window.dispatchEvent(new CustomEvent('orderStatusChanged', {
                detail: { orderId, newStatus: 'ملغى' }
            }));
            return { success: true, data: payload.data, message: payload.message };
        }
        return { success: false, error: payload?.message || 'Failed to cancel order' };
    } catch (error) {
        return { success: false, error: error?.message || 'Failed to cancel order' };
    }
};

// ==================== PAYMENTS ====================

export const processPayment      = async (paymentId, data)   => safeCall(() => ceApi.post(`/payments/${paymentId}/process`, data));
export const refundPayment       = async (paymentId, data)   => safeCall(() => ceApi.post(`/payments/${paymentId}/refund`, data));
export const getOrderPayments    = async (orderId)           => {
    try {
        const r = await api.get(`/orders/${orderId}/payments`);
        const p = r?.data ?? r;
        return p?.success ? { success: true, data: p.data } : { success: false, error: p?.message };
    } catch (e) { return { success: false, error: e?.message }; }
};
export const getPendingPayments  = async (factoryId, role = 'both') =>
    safeCall(() => ceApi.get(`/payments/pending/${factoryId}`, { params: { role } }));
export const getPaymentSummary   = async (factoryId)         => safeCall(() => ceApi.get(`/payments/summary/${factoryId}`));
export const getOutstandingBalance = async (orderId)         => {
    try {
        const r = await api.get(`/orders/${orderId}/outstanding-balance`);
        const p = r?.data ?? r;
        return p?.success ? { success: true, data: p.data } : { success: false, error: p?.message };
    } catch (e) { return { success: false, error: e?.message }; }
};

// ==================== RECYCLER INTEGRATION ====================

export const requestRecycler        = async (orderId, data)  => { try { const r = await api.post(`/orders/${orderId}/request-recycler`, data); const p = r?.data ?? r; return p?.success ? { success: true, data: p.data } : { success: false, error: p?.message }; } catch(e) { return { success: false, error: e?.message }; } };
export const acceptRecyclerRequest  = async (orderId)        => { try { const r = await api.post(`/orders/${orderId}/accept-recycler-request`); const p = r?.data ?? r; return p?.success ? { success: true, data: p.data } : { success: false, error: p?.message }; } catch(e) { return { success: false, error: e?.message }; } };
export const rejectRecyclerRequest  = async (orderId, reason='') => { try { const r = await api.post(`/orders/${orderId}/reject-recycler-request`, { reason }); const p = r?.data ?? r; return p?.success ? { success: true, data: p.data } : { success: false, error: p?.message }; } catch(e) { return { success: false, error: e?.message }; } };
export const getSuitableRecyclers   = async (orderId)        => { try { const r = await api.get(`/orders/${orderId}/suitable-recyclers`); const p = r?.data ?? r; return p?.success ? { success: true, data: p.data } : { success: false, error: p?.message }; } catch(e) { return { success: false, error: e?.message }; } };
export const getRecyclerJobs        = async (recyclerId, status = 'all') => safeCall(() => ceApi.get(`/recycler/${recyclerId}/jobs`, { params: { status } }));
export const acceptRecyclingJob     = async (id)             => safeCall(() => ceApi.post(`/recycler/jobs/${id}/accept`));
export const rejectRecyclingJob     = async (id, reason='')  => safeCall(() => ceApi.post(`/recycler/jobs/${id}/reject`, { reason }));
export const completeRecyclingJob   = async (id, data)       => safeCall(() => ceApi.post(`/recycler/jobs/${id}/complete`, data));
export const getRecyclerMetrics     = async (recyclerId)     => safeCall(() => ceApi.get(`/recycler/${recyclerId}/metrics`));

// ==================== WASTE JOURNEY ====================

export const addWasteJourneyEntry   = async (req)            => safeCall(() => ceApi.post('/waste-journey', req));

// ==================== FACTORY PROFILE ====================

export const getComprehensiveFactoryProfile = async (factoryId) => safeCall(() => ceApi.get(`/profile/factory/${factoryId}/comprehensive`));
export const getMyComprehensiveProfile      = async ()           => safeCall(() => ceApi.get('/profile/me/comprehensive'));

// ==================== SHARED HELPER ====================

async function safeCall(fn) {
    try {
        const response = await fn();
        return { success: true, data: response.data, message: response.message };
    } catch (error) {
        return { success: false, error };
    }
}

// ==================== DEFAULT EXPORT ====================

export default {
    createWasteAsset, getWasteAssets, getWasteAsset, updateWasteAsset,
    createWasteAssetOffer, getWasteAssetOffers, acceptWasteAssetOffer, rejectWasteAssetOffer,
    createOrder, createMarketplaceOrder, getOrders, getFactoryOrders,
    getOrderById, getOrderWithPayments, updateOrderStatus,
    acceptOrder, rejectOrder, cancelOrder,
    createRecyclingOrder, getRecyclingOrders, getRecyclingOrder, completeRecyclingOrder,
    processPayment, refundPayment, getOrderPayments,
    getPendingPayments, getPaymentSummary, getOutstandingBalance,
    requestRecycler, acceptRecyclerRequest, rejectRecyclerRequest,
    getSuitableRecyclers, getRecyclerJobs, acceptRecyclingJob,
    rejectRecyclingJob, completeRecyclingJob, getRecyclerMetrics,
    getFactoryImpact, getPlatformImpact,
    addWasteJourneyEntry,
    getComprehensiveFactoryProfile, getMyComprehensiveProfile,
};