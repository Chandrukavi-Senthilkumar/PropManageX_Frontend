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

export const maintenanceService = {
    // Admin: Fetch all requests
    getAllRequests: () => 
        apiClient.get('/Maintenance').then(res => res.data),

    getRequestsByProperty: (propertyID) => 
        apiClient.get(`/Maintenance?propertyID=${propertyID}`).then(res => res.data),

    createRequest: (data) => 
        apiClient.post('/Maintenance', data).then(res => res.data),

    // NEW: Update Status
    updateStatus: (id, status) => 
        apiClient.put(`/Maintenance/${id}/status`, { status }).then(res => res.data),

    // NEW: Assign Vendor/Details
    assignVendor: (payload) => 
        apiClient.post('/Maintenance/vendor', payload).then(res => res.data)
};