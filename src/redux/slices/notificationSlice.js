import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: null, // { type, message }
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showSuccess: (state, action) => {
      state.notification = {
        type: 'success',
        message: action.payload,
      };
    },
    showError: (state, action) => {
      state.notification = {
        type: 'error',
        message: action.payload,
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  showSuccess,
  showError,
  clearNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;