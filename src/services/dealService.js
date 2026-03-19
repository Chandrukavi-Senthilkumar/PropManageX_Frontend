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
    // Fetch specifically for a Unit or Lead
    getLeadsByUnit: (unitID) => apiClient.get(`/Lead?unitID=${unitID}`).then(res => res.data),
    getVisitsByLead: (leadID) => apiClient.get(`/SiteVisit?leadID=${leadID}`).then(res => res.data),
    getDealsByLead: (leadID) => apiClient.get(`/Deal?leadID=${leadID}`).then(res => res.data),
    getLeadsByUnit: (unitID) => apiClient.get(`/Lead?unitID=${unitID}`).then(res => res.data),
    getLeadsByProperty: (propertyID) => apiClient.get(`/Lead?propertyID=${propertyID}`).then(res => res.data),
    getSiteVisitsByLead: (id) => apiClient.get(`/SiteVisit?leadID=${id}`).then(res => res.data),
    getDealsByLead: (id) => apiClient.get(`/Deal?leadID=${id}`).then(res => res.data),

    //Get All API Calls
    getAllDeals: () => apiClient.get('/Deal').then(res => res.data),
    getAllSiteVisits: () => apiClient.get('/SiteVisit').then(res => res.data),

    // Create methods remain the same
    createLead: (data) => apiClient.post('/Lead', data).then(res => res.data),
    createSiteVisit: (data) => apiClient.post('/SiteVisit', data).then(res => res.data),
    createDeal: (data) => apiClient.post('/Deal', data).then(res => res.data)
};