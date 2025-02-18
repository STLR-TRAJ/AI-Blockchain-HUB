const mongoose = require('mongoose');

const politicalNewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true,
        enum: ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Global']
    },
    country: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Economic', 'Social', 'Diplomatic', 'Military', 'Environmental', 'Technology']
    },
    impact: {
        economic: {
            score: Number,
            analysis: String
        },
        social: {
            score: Number,
            analysis: String
        },
        geopolitical: {
            score: Number,
            analysis: String
        }
    },
    sources: [{
        name: String,
        url: String,
        credibilityScore: Number
    }],
    aiAnalysis: {
        summary: String,
        predictions: [{
            scenario: String,
            probability: Number,
            impact: String
        }],
        recommendations: [String]
    },
    relatedNews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PoliticalNews'
    }],
    tags: [String],
    publishedDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
politicalNewsSchema.index({ region: 1, country: 1 });
politicalNewsSchema.index({ category: 1 });
politicalNewsSchema.index({ publishedDate: -1 });
politicalNewsSchema.index({ tags: 1 });

module.exports = mongoose.model('PoliticalNews', politicalNewsSchema); 