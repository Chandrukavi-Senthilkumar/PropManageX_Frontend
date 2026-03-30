import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import RevenueReducer from './slices/revenueSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
       
        reveny:RevenueReducer

    },
});