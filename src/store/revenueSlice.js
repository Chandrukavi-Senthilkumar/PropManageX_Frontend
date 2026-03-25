import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { revenueReportService } from '../services/revenueReportService';

const initialState = {
  reports: [],
  status: 'idle',
  error: null,
  notification: null,
};

export const fetchRevenueReports = createAsyncThunk('revenue/fetchRevenueReports', async (filter = {}) => {
  const response = await revenueReportService.getReports(filter);
  const items = response?.data?.items || response?.data || [];
  return Array.isArray(items) ? items : [];
});

export const createRevenueReport = createAsyncThunk('revenue/createRevenueReport', async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await revenueReportService.createReport(payload);
    await dispatch(fetchRevenueReports());
    return response;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Could not create revenue report');
  }
});

export const updateRevenueReport = createAsyncThunk('revenue/updateRevenueReport', async ({ id, values }, { dispatch, rejectWithValue }) => {
  try {
    const response = await revenueReportService.updateReport(id, values);
    await dispatch(fetchRevenueReports());
    return response;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Could not update revenue report');
  }
});

export const deleteRevenueReport = createAsyncThunk('revenue/deleteRevenueReport', async (id, { dispatch, rejectWithValue }) => {
  try {
    const response = await revenueReportService.deleteReport(id);
    await dispatch(fetchRevenueReports());
    return response;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Could not delete revenue report');
  }
});

const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {
    clearRevenueNotification(state) {
      state.notification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueReports.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRevenueReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reports = action.payload;
      })
      .addCase(fetchRevenueReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createRevenueReport.fulfilled, (state) => {
        state.notification = { type: 'success', message: 'Revenue report created.' };
      })
      .addCase(createRevenueReport.rejected, (state, action) => {
        state.notification = { type: 'error', message: action.payload || action.error.message };
      })
      .addCase(updateRevenueReport.fulfilled, (state) => {
        state.notification = { type: 'success', message: 'Revenue report updated.' };
      })
      .addCase(updateRevenueReport.rejected, (state, action) => {
        state.notification = { type: 'error', message: action.payload || action.error.message };
      })
      .addCase(deleteRevenueReport.fulfilled, (state) => {
        state.notification = { type: 'success', message: 'Revenue report deleted.' };
      })
      .addCase(deleteRevenueReport.rejected, (state, action) => {
        state.notification = { type: 'error', message: action.payload || action.error.message };
      });
  },
});

export const { clearRevenueNotification } = revenueSlice.actions;
export default revenueSlice.reducer;
