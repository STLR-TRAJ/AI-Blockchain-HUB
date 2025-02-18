import React from 'react';
import { motion } from 'framer-motion';

const MarketCard = ({ title, data, type, onSelect }) => {
    const getPriceChangeColor = (change) => {
        return change >= 0 ? 'text-green-500' : 'text-red-500';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {title}
            </h3>
            <div className="space-y-4">
                {data.map((asset) => (
                    <motion.div
                        key={asset.symbol}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => onSelect(asset)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium text-gray-800 dark:text-white">
                                    {asset.symbol}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {asset.name}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                    ${asset.price.toFixed(2)}
                                </p>
                                <p className={`text-sm ${getPriceChangeColor(asset.changePercent)}`}>
                                    {asset.changePercent > 0 ? '+' : ''}
                                    {asset.changePercent.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>Vol: {(asset.volume / 1000000).toFixed(2)}M</span>
                                <span>High: ${asset.high.toFixed(2)}</span>
                                <span>Low: ${asset.low.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MarketCard; 