const mongoose = require('mongoose');

const marketDataSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['stock', 'crypto', 'forex']
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: true
    },
    change: {
        type: Number,
        required: true
    },
    changePercent: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    high: Number,
    low: Number,
    open: Number,
    close: Number,
    timestamp: {
        type: Date,
        required: true
    },
    technicalIndicators: {
        rsi: Number,
        macd: {
            value: Number,
            signal: Number,
            histogram: Number
        },
        sma: {
            ma20: Number,
            ma50: Number,
            ma200: Number
        }
    },
    metadata: {
        source: String,
        lastUpdated: Date
    }
}, {
    timestamps: true,
    index: [
        { symbol: 1, timestamp: -1 },
        { type: 1 }
    ]
});

module.exports = mongoose.model('MarketData', marketDataSchema); 