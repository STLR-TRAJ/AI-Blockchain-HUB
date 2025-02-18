import React from 'react';
import { ArrowSmUpIcon, ArrowSmDownIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

const MarketOverview = ({ data }) => {
    const markets = [
        { id: 'stocks', name: 'Stock Market', index: 'S&P 500' },
        { id: 'crypto', name: 'Crypto Market', index: 'Total Market Cap' },
        { id: 'forex', name: 'Forex Market', index: 'DXY' },
        { id: 'commodities', name: 'Commodities', index: 'Gold' }
    ];

    const getChangeColor = (change) => {
        return change >= 0 ? 'text-green-500' : 'text-red-500';
    };

    return (
        <>
            {markets.map((market) => (
                <motion.div
                    key={market.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {market.name}
                    </h3>
                    <div className="mt-2 flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {data[market.id]?.value.toFixed(2)}
                        </p>
                        <span className={`ml-2 flex items-center text-sm ${getChangeColor(data[market.id]?.change)}`}>
                            {data[market.id]?.change >= 0 ? (
                                <ArrowSmUpIcon className="h-5 w-5" />
                            ) : (
                                <ArrowSmDownIcon className="h-5 w-5" />
                            )}
                            {Math.abs(data[market.id]?.change).toFixed(2)}%
                        </span>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {market.index}
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {data[market.id]?.indexValue}
                            </span>
                        </div>
                        <div className="mt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                                <div
                                    style={{ width: `${data[market.id]?.sentiment}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                />
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Market Sentiment: {data[market.id]?.sentiment}%
                        </p>
                    </div>
                </motion.div>
            ))}
        </>
    );
};

export default MarketOverview; 