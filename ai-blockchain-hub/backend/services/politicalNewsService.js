const PoliticalNews = require('../models/PoliticalNews');
const axios = require('axios');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

class PoliticalNewsService {
    constructor() {
        this.newsAPIs = {
            primary: process.env.PRIMARY_NEWS_API,
            secondary: process.env.SECONDARY_NEWS_API,
            economic: process.env.ECONOMIC_NEWS_API
        };
        this.aiModel = new AIAnalysisModel();
    }

    async fetchAndProcessNews() {
        try {
            const rawNews = await this.fetchFromMultipleSources();
            const processedNews = await this.processNewsData(rawNews);
            const analyzedNews = await this.analyzeNews(processedNews);
            await this.saveNews(analyzedNews);
            await this.updateRelatedContent(analyzedNews);
            
            return analyzedNews;
        } catch (error) {
            console.error('Error in news processing:', error);
            throw error;
        }
    }

    async fetchFromMultipleSources() {
        const responses = await Promise.all([
            axios.get(`${this.newsAPIs.primary}/latest`),
            axios.get(`${this.newsAPIs.secondary}/political`),
            axios.get(`${this.newsAPIs.economic}/global`)
        ]);

        return responses.flatMap(response => response.data);
    }

    async processNewsData(rawNews) {
        return rawNews.map(news => {
            const tokens = tokenizer.tokenize(news.content);
            const tfidf = new TfIdf();
            tfidf.addDocument(tokens);

            return {
                ...news,
                importance: this.calculateImportance(news, tfidf),
                region: this.determineRegion(news),
                category: this.categorizeNews(news)
            };
        });
    }

    async analyzeNews(news) {
        return await Promise.all(news.map(async item => {
            const aiAnalysis = await this.aiModel.analyze(item);
            const economicImpact = await this.calculateEconomicImpact(item);
            const socialImpact = await this.calculateSocialImpact(item);

            return {
                ...item,
                aiAnalysis,
                impact: {
                    economic: economicImpact,
                    social: socialImpact,
                    geopolitical: await this.calculateGeopoliticalImpact(item)
                }
            };
        }));
    }

    calculateImportance(news, tfidf) {
        const keywordScores = tfidf.listTerms(0);
        const relevanceScore = this.calculateRelevanceScore(keywordScores);
        const impactScore = this.assessImpact(news);
        
        return (relevanceScore + impactScore) / 2;
    }

    async updateRelatedContent(news) {
        await Promise.all(news.map(async item => {
            const relatedNews = await this.findRelatedNews(item);
            const updatedDashboard = await this.updateDashboardMetrics(item);
            const notifications = await this.generateNotifications(item);

            return {
                relatedNews,
                updatedDashboard,
                notifications
            };
        }));
    }
}

module.exports = new PoliticalNewsService(); 