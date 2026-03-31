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
    // Fetch requests filtered by propertyID
    getRequestsByProperty: (propertyID) => 
        apiClient.get(`/Maintenance?propertyID=${propertyID}`).then(res => res.data),

    // POST: Only sends unitID, category, description, priority, status, and raisedDate
    createRequest: (data) => 
        apiClient.post('/Maintenance', data).then(res => res.data)
};