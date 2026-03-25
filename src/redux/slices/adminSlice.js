import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Async Thunk using the Service
export const fetchAdminProfile = createAsyncThunk(
    'admin/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await authService.getCurrentAdmin();
            return Array.isArray(data) ? data[0] : data; 
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to load admin profile"
            );
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearAdminState: (state) => {
            state.profile = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchAdminProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;