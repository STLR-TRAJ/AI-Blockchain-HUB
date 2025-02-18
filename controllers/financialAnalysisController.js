const FinancialAnalysisService = require('../services/financialAnalysisService');
const cache = require('../utils/cache');

class FinancialAnalysisController {
    async getMarketAnalysis(req, res) {
        try {
            const cacheKey = 'market-analysis';
            const cachedData = await cache.get(cacheKey);

            if (cachedData) {
                return res.json(cachedData);
            }

            const analysis = await FinancialAnalysisService.getMarketAnalysis();
            await cache.set(cacheKey, analysis, 300); // Cache for 5 minutes
            res.json(analysis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSectorAnalysis(req, res) {
        try {
            const { sector } = req.params;
            const analysis = await FinancialAnalysisService.getSectorAnalysis(sector);
            res.json(analysis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTechnicalIndicators(req, res) {
        try {
            const { symbol } = req.params;
            const indicators = await FinancialAnalysisService.getTechnicalIndicators(symbol);
            res.json(indicators);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new FinancialAnalysisController(); 