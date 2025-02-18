import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import TechnicalIndicators from './TechnicalIndicators';

const MarketAnalysis = ({ asset }) => {
    const [analysisData, setAnalysisData] = useState(null);
    const [selectedIndicators, setSelectedIndicators] = useState(['RSI', 'MACD']);
    const [timeRange, setTimeRange] = useState('1D');

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${asset.symbol} Analysis`,
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    const renderAnalysisSummary = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Technical Analysis
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Trend</span>
                        <span className={`font-medium ${getTrendColor(analysisData?.trend)}`}>
                            {analysisData?.trend}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Support</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                            ${analysisData?.support.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Resistance</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                            ${analysisData?.resistance.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Market Sentiment
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Sentiment Score</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-full rounded-full bg-blue-500"
                                    style={{ width: `${analysisData?.sentiment.score}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                                {analysisData?.sentiment.score}%
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Signal</span>
                        <span className={`font-medium ${getSignalColor(analysisData?.sentiment.signal)}`}>
                            {analysisData?.sentiment.signal}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {renderAnalysisSummary()}
            <TechnicalIndicators
                data={analysisData?.indicators}
                selected={selectedIndicators}
                onSelect={setSelectedIndicators}
            />
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Price Analysis
                    </h3>
                    <div className="flex space-x-2">
                        {['1D', '1W', '1M', '3M', '1Y'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 rounded ${
                                    timeRange === range
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-96">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default MarketAnalysis; 