class FinancialHandler {
    constructor() {
        this.initializeMarketData();
        this.setupRealTimeUpdates();
        this.initializeCharts();
    }

    initializeMarketData() {
        this.marketData = {
            stocks: new Map(),
            indices: new Map(),
            currencies: new Map()
        };
    }

    setupRealTimeUpdates() {
        // Connect to market data stream
        this.marketSocket = new WebSocket('wss://market-data-stream');
        
        this.marketSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.updateMarketData(data);
        };
    }

    updateMarketData(data) {
        // Update relevant market data
        if (data.type === 'stock') {
            this.marketData.stocks.set(data.symbol, data);
        }
        
        // Update UI
        this.updateMarketDisplay();
        this.checkAlertConditions(data);
    }

    initializeCharts() {
        // Portfolio performance chart
        this.portfolioChart = new Chart(
            document.getElementById('portfolioChart'),
            this.getPortfolioChartConfig()
        );

        // Asset allocation chart
        this.allocationChart = new Chart(
            document.getElementById('allocationChart'),
            this.getAllocationChartConfig()
        );
    }

    getPortfolioChartConfig() {
        return {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [],
                    borderColor: '#10B981',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        };
    }

    updateMarketDisplay() {
        // Update market data displays
        document.querySelectorAll('[data-market-symbol]').forEach(element => {
            const symbol = element.dataset.marketSymbol;
            const data = this.marketData.stocks.get(symbol);
            if (data) {
                this.updatePriceDisplay(element, data);
            }
        });
    }

    updatePriceDisplay(element, data) {
        const priceElement = element.querySelector('.price');
        const changeElement = element.querySelector('.change');

        if (priceElement) {
            priceElement.textContent = data.price.toFixed(2);
        }

        if (changeElement) {
            const change = ((data.price - data.previousClose) / data.previousClose) * 100;
            changeElement.textContent = `${change.toFixed(2)}%`;
            changeElement.classList.toggle('text-green-500', change >= 0);
            changeElement.classList.toggle('text-red-500', change < 0);
        }
    }

    checkAlertConditions(data) {
        // Check for price alerts
        const alerts = this.getAlertSettings();
        alerts.forEach(alert => {
            if (this.isAlertTriggered(data, alert)) {
                this.triggerAlert(alert);
            }
        });
    }

    getAlertSettings() {
        // Retrieve alert settings from localStorage or API
        return JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    }

    isAlertTriggered(data, alert) {
        // Check if price crosses alert threshold
        return (alert.type === 'above' && data.price > alert.price) ||
               (alert.type === 'below' && data.price < alert.price);
    }

    triggerAlert(alert) {
        // Trigger notification
        const notification = new NotificationSystem();
        notification.addNotification({
            type: 'warning',
            title: 'Price Alert',
            message: `${alert.symbol} has crossed your ${alert.type} threshold of ${alert.price}`
        });
    }
} 