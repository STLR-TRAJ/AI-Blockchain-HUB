const axios = require('axios');
const WebSocket = require('ws');
const cache = require('../utils/cache');
const logger = require('../utils/logger');
const MarketData = require('../models/MarketData');

class MarketDataService {
    constructor() {
        this.apis = {
            stocks: process.env.ALPHA_VANTAGE_API_KEY,
            crypto: process.env.BINANCE_API_KEY,
            forex: process.env.FOREX_API_KEY
        };
        this.websockets = new Map();
        this.subscribers = new Map();
        this.initializeWebSockets();
    }

    async getMarketData(type, symbol) {
        const cacheKey = `${type}-${symbol}`;
        const cachedData = await cache.get(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        let data;
        switch (type) {
            case 'stock':
                data = await this.getStockData(symbol);
                break;
            case 'crypto':
                data = await this.getCryptoData(symbol);
                break;
            case 'forex':
                data = await this.getForexData(symbol);
                break;
            default:
                throw new Error('Invalid market type');
        }

        await cache.set(cacheKey, data, 60); // Cache for 1 minute
        await this.saveMarketData(type, symbol, data);

        return data;
    }

    async getStockData(symbol) {
        try {
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apis.stocks}`
            );

            return {
                symbol,
                price: parseFloat(response.data['Global Quote']['05. price']),
                change: parseFloat(response.data['Global Quote']['09. change']),
                changePercent: parseFloat(response.data['Global Quote']['10. change percent']),
                volume: parseInt(response.data['Global Quote']['06. volume']),
                timestamp: new Date()
            };
        } catch (error) {
            logger.error(`Error fetching stock data: ${error.message}`);
            throw error;
        }
    }

    // ... similar methods for crypto and forex

    async saveMarketData(type, symbol, data) {
        try {
            await MarketData.create({
                type,
                symbol,
                price: data.price,
                change: data.change,
                changePercent: data.changePercent,
                volume: data.volume,
                timestamp: data.timestamp
            });
        } catch (error) {
            logger.error(`Error saving market data: ${error.message}`);
        }
    }

    subscribeToUpdates(symbol, callback) {
        if (!this.subscribers.has(symbol)) {
            this.subscribers.set(symbol, new Set());
        }
        this.subscribers.get(symbol).add(callback);
    }

    unsubscribeFromUpdates(symbol, callback) {
        if (this.subscribers.has(symbol)) {
            this.subscribers.get(symbol).delete(callback);
        }
    }
}

module.exports = new MarketDataService(); 