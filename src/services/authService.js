import axios from 'axios';
import Cookies from 'js-cookie';

// 1. Base Configuration
const API_BASE_URL = "http://localhost:5154/api/AdminAuth";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * AUTH SERVICE
 * Handles Signup, OTP Verification, Password Setting, and Login
 */
export const authService = {
  
  // Helper to store tokens after successful Login or Set-Password
  handleAuthSuccess: (data) => {
    const { accessToken, refreshToken, tokenType } = data;
    
    // Store in LocalStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Store in Cookies (Expires in 1 day for security)
    Cookies.set('accessToken', accessToken, { expires: 1, secure: true, sameSite: 'strict' });
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, { expires: 7 });
    }
    
    console.log("Tokens stored successfully in LocalStorage and Cookies.");
  },

  // STEP 1: Admin Signup
  registerAdmin: async (adminData) => {
    try {
      const response = await apiClient.post('/signup', adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Signup failed");
    }
  },

  // STEP 2: Verify OTP
  // Expects { adminMailId, otp }
  verifyOtp: async (verifyData) => {
    try {
      const response = await apiClient.post('/verify-otp', verifyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("OTP verification failed");
    }
  },

  // STEP 3: Set Password
  // Expects { adminMailId, password, confirmPassword }
  setPassword: async (passwordData) => {
    try {
      const response = await apiClient.post('/set-password', passwordData);
      
      // If your backend returns a token immediately after setting the password:
      if (response.data.accessToken) {
        authService.handleAuthSuccess(response.data);
      }
      
      return response.data;
    } catch (error) {
      // This handles the "AdminMailId is required" error you saw earlier
      throw error.response?.data || new Error("Failed to set password");
    }
  },

  // STEP 4: Login
  // Expects { email, password }
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      
      if (response.data.accessToken) {
        authService.handleAuthSuccess(response.data);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Login failed");
    }
  },

  // Logout Helper
  logout: () => {
    localStorage.clear();
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    window.location.href = "/login";
  }
};