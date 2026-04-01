import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import RevenueReducer from './slices/revenueSlice';
import notificationReducer from './slices/notificationSlice';
export const store = configureStore({
    reducer: {
        admin: adminReducer,
       notification: notificationReducer,
        reveny:RevenueReducer

    },
});