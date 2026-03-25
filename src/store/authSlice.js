import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Async thunk for fetching current user
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user');
    }
  }
);

// Check if user is authenticated based on token
const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken') || document.cookie.match(/(^|;)\s*accessToken\s*=\s*([^;]+)/)?.pop();
  return !!token;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: isAuthenticated(),
    userName: 'Guest',
    userRole: 'Visitor',
    profileDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      authService.logout();
      state.isAuthenticated = false;
      state.userName = 'Guest';
      state.userRole = 'Visitor';
      state.profileDetails = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        // After login, we might not have user data yet, so don't set userName here
        // It will be fetched separately
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (Array.isArray(data) && data.length > 0) {
          const current = data[0];
          state.userName = current.AdminName || current.name || 'Administrator';
          state.userRole = current.Role || current.role || 'Manager';
          state.profileDetails = current;
          state.isAuthenticated = true;
          localStorage.setItem('userName', state.userName);
          localStorage.setItem('userRole', state.userRole);
        } else if (data && typeof data === 'object') {
          const current = data;
          state.userName = current.AdminName || current.name || current.email || 'Administrator';
          state.userRole = current.Role || current.role || 'Manager';
          state.profileDetails = current;
          state.isAuthenticated = true;
          localStorage.setItem('userName', state.userName);
          localStorage.setItem('userRole', state.userRole);
        } else {
          state.isAuthenticated = false;
          state.userName = 'Guest';
          state.userRole = 'Visitor';
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.userName = 'Guest';
        state.userRole = 'Visitor';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;