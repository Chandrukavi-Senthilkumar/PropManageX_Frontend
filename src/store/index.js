import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import propertyReducer from './propertySlice';
import revenueReducer from './revenueSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    revenue: revenueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;