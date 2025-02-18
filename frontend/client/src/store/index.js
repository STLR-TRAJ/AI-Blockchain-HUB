import { configureStore } from '@reduxjs/toolkit';
import marketDataReducer from './slices/marketDataSlice';
import politicalNewsReducer from './slices/politicalNewsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    marketData: marketDataReducer,
    politicalNews: politicalNewsReducer,
    auth: authReducer,
  },
}); 