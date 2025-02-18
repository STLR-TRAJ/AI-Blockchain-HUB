import React from 'react';
import { motion } from 'framer-motion';

const TechnicalIndicators = ({ data, selected, onSelect }) => {
    const indicators = [
        { id: 'RSI', name: 'Relative Strength Index' },
        { id: 'MACD', name: 'MACD' },
        { id: 'BB', name: 'Bollinger Bands' },
        { id: 'SMA', name: 'Simple Moving Average' },
        { id: 'EMA', name: 'Exponential Moving Average' }
    ];

    const getIndicatorValue = (id) => {
        if (!data) return null;
        switch (id) {
            case 'RSI':
                return {
                    value: data.rsi,
                    interpretation: data.rsi > 70 ? 'Overbought' : data.rsi < 30 ? 'Oversold' : 'Neutral'
                };
            case 'MACD':
                return {
                    value: data.macd.value,
                    signal: data.macd.signal,
                    interpretation: data.macd.value > data.macd.signal ? 'Bullish' : 'Bearish'
                };
            default:
                return null;
        }
    };

    const getIndicatorColor = (id) => {
        const value = getIndicatorValue(id);
        if (!value) return 'text-gray-600';

        switch (id) {
            case 'RSI':
                return value.value > 70 ? 'text-red-500' : value.value < 30 ? 'text-green-500' : 'text-blue-500';
            case 'MACD':
                return value.value > value.signal ? 'text-green-500' : 'text-red-500';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Technical Indicators
                </h3>
                <div className="flex space-x-2">
                    {indicators.map((indicator) => (
                        <button
                            key={indicator.id}
                            onClick={() => onSelect(
                                selected.includes(indicator.id)
                                    ? selected.filter(id => id !== indicator.id)
                                    : [...selected, indicator.id]
                            )}
                            className={`px-3 py-1 rounded text-sm ${
                                selected.includes(indicator.id)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}
                        >
                            {indicator.id}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selected.map((id) => {
                    const indicator = indicators.find(i => i.id === id);
                    const value = getIndicatorValue(id);

                    return (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                        >
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                {indicator.name}
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Value</span>
                                    <span className={`font-medium ${getIndicatorColor(id)}`}>
                                        {value?.value?.toFixed(2)}
                                    </span>
                                </div>
                                {value?.signal && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Signal</span>
                                        <span className="font-medium text-gray-800 dark:text-white">
                                            {value.signal.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Signal</span>
                                    <span className={`text-sm font-medium ${
                                        value?.interpretation === 'Bullish' ? 'text-green-500' :
                                        value?.interpretation === 'Bearish' ? 'text-red-500' :
                                        'text-blue-500'
                                    }`}>
                                        {value?.interpretation}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default TechnicalIndicators; 