import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = "http://localhost:5154/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

export const SaleService = {
    // --- LEADS ---
    getLeads: (params) => apiClient.get('/Lead', { params }).then(res => res.data),
    createLead: (data) => apiClient.post('/Lead', data).then(res => res.data),

    // --- SITE VISITS ---
    getSiteVisits: (params) => apiClient.get('/SiteVisit', { params }).then(res => res.data),
    createSiteVisit: (data) => apiClient.post('/SiteVisit', data).then(res => res.data),

    // --- DEALS ---
    getDeals: (params) => apiClient.get('/Deal', { params }).then(res => res.data),
    createDeal: (data) => apiClient.post('/Deal', data).then(res => res.data)
};