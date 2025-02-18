import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { LightningBoltIcon, TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/solid';

const AIRecommendations = () => {
    const { recommendations, loading } = useSelector(state => state.ai);

    const getActionColor = (action) => {
        switch (action.toLowerCase()) {
            case 'buy':
                return 'text-green-500';
            case 'sell':
                return 'text-red-500';
            case 'hold':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 80) return 'bg-green-500';
        if (confidence >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                    <LightningBoltIcon className="h-5 w-5 mr-2 text-blue-500" />
                    AI Recommendations
                </h2>
            </div>

            <div className="space-y-4">
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-base font-medium text-gray-800 dark:text-white">
                                    {rec.symbol}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {rec.name}
                                </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${getActionColor(rec.action)}`}>
                                {rec.action.toUpperCase()}
                            </span>
                        </div>

                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    AI Confidence
                                </span>
                                <span className="text-sm font-medium text-gray-800 dark:text-white">
                                    {rec.confidence}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                    className={`${getConfidenceColor(rec.confidence)} h-2 rounded-full`}
                                    style={{ width: `${rec.confidence}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                            <p>{rec.reasoning}</p>
                        </div>

                        <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <TrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
                                Target: ${rec.priceTarget}
                            </div>
                            <div className="flex items-center">
                                <TrendingDownIcon className="h-4 w-4 mr-1 text-red-500" />
                                Stop: ${rec.stopLoss}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AIRecommendations; 