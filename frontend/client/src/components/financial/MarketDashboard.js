import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Line, Bar } from 'react-chartjs-2';
import { fetchMarketData } from '../../store/slices/marketDataSlice';
import MarketCard from './MarketCard';
import TechnicalChart from './TechnicalChart';
import AlertsPanel from './AlertsPanel';

const MarketDashboard = () => {
    const dispatch = useDispatch();
    const { stocks, crypto, forex, loading } = useSelector(state => state.marketData);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [timeframe, setTimeframe] = useState('1D');

    useEffect(() => {
        dispatch(fetchMarketData());
        const interval = setInterval(() => {
            dispatch(fetchMarketData());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [dispatch]);

    const renderMarketOverview = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MarketCard
                    title="Stock Markets"
                    data={stocks}
                    type="stock"
                    onSelect={(asset) => setSelectedAsset(asset)}
                />
                <MarketCard
                    title="Cryptocurrency"
                    data={crypto}
                    type="crypto"
                    onSelect={(asset) => setSelectedAsset(asset)}
                />
                <MarketCard
                    title="Forex"
                    data={forex}
                    type="forex"
                    onSelect={(asset) => setSelectedAsset(asset)}
                />
            </div>
        );
    };

    const renderDetailedView = () => {
        if (!selectedAsset) return null;

        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {selectedAsset.symbol} Analysis
                    </h2>
                    <div className="flex space-x-2">
                        {['1D', '1W', '1M', '3M', '1Y'].map(period => (
                            <button
                                key={period}
                                onClick={() => setTimeframe(period)}
                                className={`px-3 py-1 rounded ${
                                    timeframe === period
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TechnicalChart asset={selectedAsset} timeframe={timeframe} />
                    <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                                Technical Indicators
                            </h3>
                            {/* Technical indicators content */}
                        </div>
                        <AlertsPanel asset={selectedAsset} />
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {renderMarketOverview()}
            {renderDetailedView()}
        </div>
    );
};

export default MarketDashboard; 