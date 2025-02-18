import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line, Bar } from 'react-chartjs-2';
import { fetchMarketData } from '../store/slices/marketDataSlice';
import MarketSummary from '../components/financial/MarketSummary';
import TechnicalAnalysis from '../components/financial/TechnicalAnalysis';
import NewsFeed from '../components/financial/NewsFeed';

const FinancialAnalysis = () => {
  const dispatch = useDispatch();
  const { stocks, crypto, forex, loading } = useSelector(state => state.marketData);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  useEffect(() => {
    dispatch(fetchMarketData());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MarketSummary data={{ stocks, crypto, forex }} />
        <TechnicalAnalysis />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Market Overview
          </h3>
          {/* Add market overview chart */}
        </div>
      </div>
      <NewsFeed />
    </div>
  );
};

export default FinancialAnalysis; 