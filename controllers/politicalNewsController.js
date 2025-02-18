const PoliticalNewsService = require('../services/politicalNewsService');
const cache = require('../utils/cache');

class PoliticalNewsController {
    async getNews(req, res) {
        try {
            const {
                region,
                category,
                importance,
                timeframe,
                page = 1,
                limit = 10
            } = req.query;

            const cacheKey = `news:${region}:${category}:${importance}:${timeframe}:${page}`;
            const cachedData = await cache.get(cacheKey);

            if (cachedData) {
                return res.json(cachedData);
            }

            const filter = this.buildFilter(region, category, importance, timeframe);
            const news = await PoliticalNewsService.getFilteredNews(filter, page, limit);
            
            await cache.set(cacheKey, news, 300); // Cache for 5 minutes
            res.json(news);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAnalysis(req, res) {
        try {
            const { newsId } = req.params;
            const analysis = await PoliticalNewsService.getDetailedAnalysis(newsId);
            res.json(analysis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getImpactReport(req, res) {
        try {
            const { region, timeframe } = req.query;
            const report = await PoliticalNewsService.generateImpactReport(region, timeframe);
            res.json(report);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PoliticalNewsController(); 