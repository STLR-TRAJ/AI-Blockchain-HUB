import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/solid';
import AssetChart from './AssetChart';

const TrendingAssets = () => {
    const { trendingAssets, loading } = useSelector(state => state.marketData);

    const getPerformanceColor = (performance) => {
        if (performance >= 10) return 'text-green-500';
        if (performance >= 5) return 'text-green-400';
        if (performance >= 0) return 'text-green-300';
        if (performance >= -5) return 'text-red-300';
        if (performance >= -10) return 'text-red-400';
        return 'text-red-500';
    };

    if (loading) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-yellow-400" />
                    Trending Assets
                </h2>
                <select className="form-select text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg">
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingAssets.map((asset, index) => (
                    <motion.div
                        key={asset.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-base font-medium text-gray-800 dark:text-white">
                                    {asset.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {asset.symbol}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                    ${asset.price.toFixed(2)}
                                </p>
                                <p className={`text-sm font-medium ${getPerformanceColor(asset.performance24h)}`}>
                                    {asset.performance24h > 0 ? '+' : ''}
                                    {asset.performance24h.toFixed(2)}%
                                </p>
                            </div>
                        </div>

                        <div className="h-24">
                            <AssetChart 
                                data={asset.priceHistory}
                                color={asset.performance24h >= 0 ? '#10B981' : '#EF4444'}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                                <p className="text-gray-500 dark:text-gray-400">Volume</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    ${(asset.volume24h / 1000000).toFixed(2)}M
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-500 dark:text-gray-400">Market Cap</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    ${(asset.marketCap / 1000000000).toFixed(2)}B
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-500 dark:text-gray-400">Rank</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    #{asset.rank}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TrendingAssets; 