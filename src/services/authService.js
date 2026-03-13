import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = "http://localhost:5154/api/AdminAuth";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTOR: Automatically adds the Bearer token to every request
apiClient.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    handleAuthSuccess: (data) => {
        const { accessToken, refreshToken } = data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        Cookies.set('accessToken', accessToken, { expires: 1, secure: true, sameSite: 'strict' });
        if (refreshToken) {
            Cookies.set('refreshToken', refreshToken, { expires: 7 });
        }
    },

    registerAdmin: async (adminData) => {
        const response = await apiClient.post('/signup', adminData);
        return response.data;
    },

    verifyOtp: async (verifyData) => {
        const response = await apiClient.post('/verify-otp', verifyData);
        return response.data;
    },

    setPassword: async (passwordData) => {
        const response = await apiClient.post('/set-password', passwordData);
        if (response.data.accessToken) {
            authService.handleAuthSuccess(response.data);
        }
        return response.data;
    },


  addUser: async (userData) => {
    const response = await apiClient.post('/add-user', userData);
    return response.data;
},

    login: async (credentials) => {
        const response = await apiClient.post('/login', credentials);
        if (response.data.accessToken) {
            authService.handleAuthSuccess(response.data);
        }
        return response.data;
    },

    logout: () => {
        localStorage.clear();
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = "/login";
    }
};