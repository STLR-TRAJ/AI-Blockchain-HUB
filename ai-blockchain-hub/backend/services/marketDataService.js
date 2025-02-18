const axios = require('axios');
const WebSocket = require('ws');
const { createLogger } = require('../utils/logger');

class MarketDataService {
    constructor() {
        this.logger = createLogger('MarketData');
        this.subscribers = new Map();
        this.websockets = new Map();
        this.initializeWebSockets();
    }

    // Stock Market Data (Using Alpha Vantage and Finnhub)
    async getStockQuote(symbol) {
        try {
            const [alphaVantageData, finnhubData] = await Promise.all([
                axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`),
                axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`)
            ]);

            return {
                price: parseFloat(alphaVantageData.data['Global Quote']['05. price']),
                change: parseFloat(alphaVantageData.data['Global Quote']['09. change']),
                changePercent: parseFloat(alphaVantageData.data['Global Quote']['10. change percent']),
                volume: parseInt(alphaVantageData.data['Global Quote']['06. volume']),
                high: finnhubData.data.h,
                low: finnhubData.data.l,
                open: finnhubData.data.o,
                previousClose: finnhubData.data.pc
            };
        } catch (error) {
            this.logger.error(`Error fetching stock quote: ${error.message}`);
            throw error;
        }
    }

    // Crypto Data (Using Binance API)
    async getCryptoData(symbol = 'BTCUSDT') {
        try {
            const [tickerData, depth] = await Promise.all([
                axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`),
                axios.get(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=10`)
            ]);

            return {
                price: parseFloat(tickerData.data.lastPrice),
                change: parseFloat(tickerData.data.priceChange),
                changePercent: parseFloat(tickerData.data.priceChangePercent),
                volume: parseFloat(tickerData.data.volume),
                high: parseFloat(tickerData.data.highPrice),
                low: parseFloat(tickerData.data.lowPrice),
                orderBook: {
                    bids: depth.data.bids.map(([price, quantity]) => ({ price: parseFloat(price), quantity: parseFloat(quantity) })),
                    asks: depth.data.asks.map(([price, quantity]) => ({ price: parseFloat(price), quantity: parseFloat(quantity) }))
                }
            };
        } catch (error) {
            this.logger.error(`Error fetching crypto data: ${error.message}`);
            throw error;
        }
    }

    // Forex Data (Using Fixer.io API)
    async getForexRates(base = 'USD', symbols = ['EUR', 'GBP', 'JPY']) {
        try {
            const response = await axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.FOREX_API_KEY}&base=${base}&symbols=${symbols.join(',')}`);
            
            return {
                base: response.data.base,
                rates: response.data.rates,
                timestamp: response.data.timestamp
            };
        } catch (error) {
            this.logger.error(`Error fetching forex rates: ${error.message}`);
            throw error;
        }
    }

    // Real-time WebSocket connections
    initializeWebSockets() {
        // Finnhub WebSocket for stocks
        const stockWs = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);
        
        stockWs.on('open', () => {
            this.logger.info('Stock WebSocket connected');
            // Subscribe to some major stocks
            ['AAPL', 'GOOGL', 'MSFT', 'AMZN'].forEach(symbol => {
                stockWs.send(JSON.stringify({ type: 'subscribe', symbol }));
            });
        });

        // Binance WebSocket for crypto
        const cryptoWs = new WebSocket('wss://stream.binance.com:9443/ws');
        
        cryptoWs.on('open', () => {
            this.logger.info('Crypto WebSocket connected');
            // Subscribe to BTC and ETH trades
            cryptoWs.send(JSON.stringify({
                method: 'SUBSCRIBE',
                params: ['btcusdt@trade', 'ethusdt@trade'],
                id: 1
            }));
        });

        this.setupWebSocketHandlers(stockWs, 'stock');
        this.setupWebSocketHandlers(cryptoWs, 'crypto');
    }

    // Additional market data methods
    async getMarketIndices() {
        try {
            const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/indices?apiKey=${process.env.POLYGON_API_KEY}`);
            
            return response.data.tickers.map(ticker => ({
                symbol: ticker.ticker,
                name: ticker.name,
                value: ticker.day.c,
                change: ticker.day.cp,
                volume: ticker.day.v
            }));
        } catch (error) {
            this.logger.error(`Error fetching market indices: ${error.message}`);
            throw error;
        }
    }

    // Technical Analysis Data
    async getTechnicalIndicators(symbol, interval = '1d') {
        try {
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=SMA,RSI,MACD&symbol=${symbol}&interval=${interval}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            );

            return {
                sma: response.data.SMA,
                rsi: response.data.RSI,
                macd: response.data.MACD
            };
        } catch (error) {
            this.logger.error(`Error fetching technical indicators: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new MarketDataService(); 