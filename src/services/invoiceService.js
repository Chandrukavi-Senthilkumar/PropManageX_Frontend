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

export const invoiceService = {
    // POST: Create a new invoice
    createInvoice: (data) => apiClient.post('/Invoice', data).then(res => res.data),
    
    // GET: Fetch invoices (supports filters via query string)
    getInvoices: (params = {}) => apiClient.get('/Invoice', { params }).then(res => res.data)
};