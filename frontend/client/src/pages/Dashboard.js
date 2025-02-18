import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketSummary } from '../store/slices/marketDataSlice';
import MarketOverview from '../components/dashboard/MarketOverview';
import TrendingAssets from '../components/dashboard/TrendingAssets';
import NewsHighlights from '../components/dashboard/NewsHighlights';
import AIRecommendations from '../components/dashboard/AIRecommendations';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { marketSummary, loading } = useSelector(state => state.marketData);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(fetchMarketSummary());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Welcome back, {user?.username}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Here's your market overview and latest updates
                </p>
            </div>

            {/* Market Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MarketOverview data={marketSummary} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <TrendingAssets />
                    <NewsHighlights />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <AIRecommendations />
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Your Watchlist
                        </h3>
                        {user?.preferences?.watchlist.map(item => (
                            <div
                                key={item.symbol}
                                className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-white">
                                        {item.symbol}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.type}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                                        ${marketSummary[item.symbol]?.price.toFixed(2)}
                                    </p>
                                    <p className={`text-xs ${
                                        marketSummary[item.symbol]?.change >= 0
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                    }`}>
                                        {marketSummary[item.symbol]?.change}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 