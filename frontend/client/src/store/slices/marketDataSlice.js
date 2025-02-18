import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import marketDataService from '../../services/marketDataService';

export const fetchMarketData = createAsyncThunk(
  'marketData/fetchMarketData',
  async () => {
    const response = await marketDataService.getMarketData();
    return response.data;
  }
);

const marketDataSlice = createSlice({
  name: 'marketData',
  initialState: {
    stocks: [],
    crypto: [],
    forex: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateStockPrice: (state, action) => {
      const { symbol, price } = action.payload;
      const stockIndex = state.stocks.findIndex(s => s.symbol === symbol);
      if (stockIndex !== -1) {
        state.stocks[stockIndex].price = price;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload.stocks;
        state.crypto = action.payload.crypto;
        state.forex = action.payload.forex;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateStockPrice } = marketDataSlice.actions;
export default marketDataSlice.reducer; 