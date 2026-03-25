import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import  propertyReducer from './slices/propertySlice';
import RevenueReducer from './slices/revenueSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        property: propertyReducer,
        reveny:RevenueReducer

    },
});