class PoliticalNewsHandler {
    constructor() {
        this.newsContainer = document.getElementById('news-container');
        this.filtersContainer = document.getElementById('news-filters');
        this.analysisContainer = document.getElementById('analysis-container');
        this.setupEventListeners();
        this.initializeNews();
    }

    async initializeNews() {
        try {
            await this.loadNews();
            this.setupFilters();
            this.initializeCharts();
        } catch (error) {
            console.error('Failed to initialize news:', error);
            this.showError('Failed to load news content');
        }
    }

    async loadNews(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/political-news/news?${queryParams}`);
        const data = await response.json();
        this.renderNews(data);
    }

    renderNews(newsItems) {
        if (!this.newsContainer) return;

        this.newsContainer.innerHTML = newsItems.map(news => `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            ${news.title}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">
                            ${news.content.substring(0, 200)}...
                        </p>
                    </div>
                    <span class="px-3 py-1 text-sm rounded-full ${this.getImpactClass(news.impact.economic.score)}">
                        Impact: ${news.impact.economic.score}/10
                    </span>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        ${news.region}
                    </span>
                    <span class="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                        ${news.category}
                    </span>
                </div>

                <div class="border-t dark:border-gray-700 pt-4">
                    <button onclick="showAnalysis('${news._id}')" 
                            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
                        View Analysis
                    </button>
                </div>
            </div>
        `).join('');
    }

    getImpactClass(score) {
        if (score >= 7) return 'bg-red-100 text-red-800';
        if (score >= 4) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    }

    async showAnalysis(newsId) {
        const response = await fetch(`/api/political-news/analysis/${newsId}`);
        const analysis = await response.json();
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full m-4 p-6">
                <div class="flex justify-between items-start mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        AI Analysis
                    </h3>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Summary</h4>
                        <p class="text-gray-600 dark:text-gray-400">${analysis.aiAnalysis.summary}</p>
                    </div>

                    <div>
                        <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Predictions</h4>
                        <div class="space-y-2">
                            ${analysis.aiAnalysis.predictions.map(pred => `
                                <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span class="text-gray-700 dark:text-gray-300">${pred.scenario}</span>
                                    <span class="text-sm font-medium ${
                                        pred.probability > 0.7 ? 'text-red-600' : 
                                        pred.probability > 0.4 ? 'text-yellow-600' : 'text-green-600'
                                    }">
                                        ${Math.round(pred.probability * 100)}%
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Recommendations</h4>
                        <ul class="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                            ${analysis.aiAnalysis.recommendations.map(rec => `
                                <li>${rec}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
} 