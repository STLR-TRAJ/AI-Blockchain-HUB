const FinancialNews = require('../models/FinancialNews');
const axios = require('axios');
const technicalIndicators = require('technicalindicators');

class FinancialAnalysisService {
    constructor() {
        this.marketAPIs = {
            stocks: process.env.STOCK_MARKET_API,
            forex: process.env.FOREX_API,
            crypto: process.env.CRYPTO_API
        };
        this.aiModel = new AIAnalysisModel();
    }

    async getMarketAnalysis() {
        try {
            const marketData = await this.fetchMarketData();
            const analysis = await this.analyzeMarketData(marketData);
            const predictions = await this.generatePredictions(analysis);
            
            return {
                marketData,
                analysis,
                predictions
            };
        } catch (error) {
            console.error('Market analysis error:', error);
            throw error;
        }
    }

    async fetchMarketData() {
        const [stocks, forex, crypto] = await Promise.all([
            axios.get(`${this.marketAPIs.stocks}/latest`),
            axios.get(`${this.marketAPIs.forex}/rates`),
            axios.get(`${this.marketAPIs.crypto}/prices`)
        ]);

        return {
            stocks: stocks.data,
            forex: forex.data,
            crypto: crypto.data
        };
    }

    async analyzeMarketData(data) {
        return {
            technicalAnalysis: this.performTechnicalAnalysis(data),
            fundamentalAnalysis: await this.performFundamentalAnalysis(data),
            sentimentAnalysis: await this.analyzeSentiment(data),
            correlationAnalysis: this.analyzeCorrelations(data)
        };
    }

    performTechnicalAnalysis(data) {
        // Implement technical analysis using indicators
        const rsi = technicalIndicators.RSI.calculate({
            values: data.stocks.prices,
            period: 14
        });

        const macd = technicalIndicators.MACD.calculate({
            values: data.stocks.prices,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9
        });

        return {
            rsi,
            macd,
            trends: this.analyzeTrends(data)
        };
    }

    async generatePredictions(analysis) {
        const aiPredictions = await this.aiModel.predict(analysis);
        return {
            shortTerm: this.generateShortTermPredictions(aiPredictions),
            longTerm: this.generateLongTermPredictions(aiPredictions),
            riskAssessment: this.assessRisk(analysis)
        };
    }
}

module.exports = new FinancialAnalysisService(); 