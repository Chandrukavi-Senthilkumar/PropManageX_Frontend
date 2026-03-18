import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = "http://localhost:5154/";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

export const contractService = {
    // GET: Fetch contracts (assuming filtering by DealID is possible)
    getContracts: () => apiClient.get('/contracts').then(res => res.data),
    
    // POST: Create a new contract
    createContract: (data) => apiClient.post('/contracts', data).then(res => res.data)
};