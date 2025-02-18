class FinancialAnalysisHandler {
    constructor() {
        this.initializeCharts();
        this.loadMarketData();
        this.setupEventListeners();
    }

    async loadMarketData() {
        try {
            const response = await fetch('/api/financial-analysis/market');
            const data = await response.json();
            this.updateDashboard(data);
        } catch (error) {
            console.error('Failed to load market data:', error);
            this.showError('Failed to load market data');
        }
    }

    updateDashboard(data) {
        this.updateMarketSummary(data.marketData);
        this.updateTechnicalChart(data.analysis.technicalAnalysis);
        this.updateAIPredictions(data.predictions);
        this.updateSectorAnalysis(data.analysis.sectorAnalysis);
        this.updateNewsFeed(data.news);
    }

    updateMarketSummary(data) {
        const container = document.getElementById('market-summary');
        if (!container) return;

        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">S&P 500</span>
                    <div class="flex items-center">
                        <span class="text-lg font-semibold ${this.getPriceClass(data.sp500.change)}">
                            ${data.sp500.price}
                        </span>
                        <span class="ml-2 text-sm ${this.getPriceClass(data.sp500.change)}">
                            ${data.sp500.change}%
                        </span>
                    </div>
                </div>
                <!-- Add more market indicators -->
            </div>
        `;
    }

    updateTechnicalChart(data) {
        const ctx = document.getElementById('technicalChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.dates,
                datasets: [{
                    label: 'Price',
                    data: data.prices,
                    borderColor: '#3B82F6',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    getPriceClass(change) {
        return change >= 0 ? 'text-green-600' : 'text-red-600';
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }
} 