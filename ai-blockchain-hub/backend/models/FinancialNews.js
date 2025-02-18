const mongoose = require('mongoose');

const financialNewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: true,
        enum: ['Banking', 'Technology', 'Healthcare', 'Energy', 'Real Estate', 'Retail', 'Manufacturing', 'Crypto']
    },
    marketImpact: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        required: true
    },
    analysis: {
        stockMarket: {
            impact: Number,
            analysis: String,
            affectedIndices: [String]
        },
        forex: {
            impact: Number,
            analysis: String,
            affectedPairs: [String]
        },
        commodities: {
            impact: Number,
            analysis: String,
            affectedItems: [String]
        }
    },
    indicators: {
        technical: [{
            name: String,
            value: Number,
            signal: String
        }],
        fundamental: [{
            name: String,
            value: Number,
            trend: String
        }]
    },
    aiPredictions: {
        shortTerm: {
            scenario: String,
            probability: Number,
            priceTargets: {
                support: Number,
                resistance: Number
            }
        },
        longTerm: {
            scenario: String,
            probability: Number,
            forecast: String
        }
    },
    relatedAssets: [{
        symbol: String,
        name: String,
        correlation: Number
    }],
    publishedDate: Date,
    lastUpdated: Date
}, {
    timestamps: true
});

financialNewsSchema.index({ sector: 1, publishedDate: -1 });
financialNewsSchema.index({ 'analysis.stockMarket.impact': 1 });
financialNewsSchema.index({ 'marketImpact': 1 });

module.exports = mongoose.model('FinancialNews', financialNewsSchema); 