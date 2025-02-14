class CompilerHandler {
    constructor() {
        this.setupMonacoEditor();
        this.setupEventListeners();
        this.setupTemplates();
        this.setupCharts();
        this.currentTab = 'output';
    }

    setupMonacoEditor() {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs' }});
        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(document.getElementById('editor'), {
                value: this.getDefaultTemplate('python'),
                language: 'python',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                scrollBeyondLastLine: false,
                automaticLayout: true
            });

            // Handle language changes
            document.getElementById('language-select')?.addEventListener('change', (e) => {
                const language = e.target.value;
                monaco.editor.setModelLanguage(this.editor.getModel(), language);
                this.editor.setValue(this.getDefaultTemplate(language));
            });
        });
    }

    setupEventListeners() {
        // Run button
        document.getElementById('compile-btn')?.addEventListener('click', () => {
            this.runCode();
        });

        // Template button
        document.getElementById('template-btn')?.addEventListener('click', () => {
            this.showTemplateModal();
        });

        // Tab switching
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Clear output
        document.getElementById('clear-output')?.addEventListener('click', () => {
            document.getElementById('output-tab').innerHTML = '';
        });

        // Export button
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportResults();
        });
    }

    getDefaultTemplate(language) {
        const templates = {
            python: `import yfinance as yf
import pandas as pd
import numpy as np

# Get stock data
def analyze_stock(symbol, period='1y'):
    stock = yf.Ticker(symbol)
    data = stock.history(period=period)
    
    # Calculate technical indicators
    data['SMA20'] = data['Close'].rolling(window=20).mean()
    data['SMA50'] = data['Close'].rolling(window=50).mean()
    
    return data

# Example usage
data = analyze_stock('BTC-USD')
print(data.tail())
`,
            pine: `// PineScript Example
//@version=5
indicator("Custom Strategy", overlay=true)

// Calculate EMAs
ema20 = ta.ema(close, 20)
ema50 = ta.ema(close, 50)

// Generate signals
longCondition = ta.crossover(ema20, ema50)
shortCondition = ta.crossunder(ema20, ema50)

// Plot signals
plotshape(longCondition, "Buy", shape.triangleup, location.belowbar, color.green)
plotshape(shortCondition, "Sell", shape.triangledown, location.abovebar, color.red)
`,
            solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TradingBot {
    struct Trade {
        address trader;
        uint256 amount;
        bool isBuy;
        uint256 timestamp;
    }
    
    Trade[] public trades;
    
    event TradeExecuted(address trader, uint256 amount, bool isBuy);
    
    function executeTrade(uint256 amount, bool isBuy) public {
        trades.push(Trade(msg.sender, amount, isBuy, block.timestamp));
        emit TradeExecuted(msg.sender, amount, isBuy);
    }
}
`
        };
        return templates[language] || '// Write your code here\n';
    }

    async runCode() {
        const code = this.editor.getValue();
        const language = document.getElementById('language-select').value;
        const outputTab = document.getElementById('output-tab');

        outputTab.innerHTML = '<div class="text-blue-500">Running...</div>';

        try {
            // Simulate execution
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (language === 'python') {
                this.simulatePythonAnalysis(code);
            } else if (language === 'pine') {
                this.simulatePineScriptAnalysis(code);
            } else {
                this.simulateSolidityCompilation(code);
            }
        } catch (error) {
            outputTab.innerHTML = `
                <div class="text-red-500">Error:</div>
                <pre class="text-red-400 mt-2">${error.message}</pre>
            `;
        }
    }

    simulatePythonAnalysis(code) {
        // Simulate Python analysis results
        const data = this.generateMockData();
        this.updateChart(data);
        
        document.getElementById('output-tab').innerHTML = `
            <div class="text-green-500">Analysis completed successfully!</div>
            <div class="mt-4">
                <h3 class="font-bold">Results:</h3>
                <pre class="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
Stock Analysis Results:
- Moving Averages Calculated
- RSI: 56.78
- MACD Signal: Buy
- Support Level: 45000
- Resistance Level: 48000
                </pre>
            </div>
        `;

        document.getElementById('analysis-tab').innerHTML = `
            <div class="space-y-4">
                <div class="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
                    <h3 class="font-bold text-green-800 dark:text-green-200">Trading Signals</h3>
                    <p class="text-green-600 dark:text-green-300">Strong Buy Signal Detected</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 class="font-bold">Technical Indicators</h4>
                        <ul class="mt-2 space-y-2">
                            <li>RSI: 56.78 (Neutral)</li>
                            <li>MACD: Bullish Crossover</li>
                            <li>Stochastic: Overbought</li>
                        </ul>
                    </div>
                    <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 class="font-bold">Price Levels</h4>
                        <ul class="mt-2 space-y-2">
                            <li>Support: $45,000</li>
                            <li>Resistance: $48,000</li>
                            <li>Current: $46,500</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    setupCharts() {
        const ctx = document.getElementById('analysis-chart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Price',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    generateMockData() {
        const data = [];
        let price = 46000;
        for (let i = 0; i < 100; i++) {
            price += (Math.random() - 0.5) * 1000;
            data.push({
                date: new Date(2024, 0, i + 1),
                price: price
            });
        }
        return data;
    }

    updateChart(data) {
        this.chart.data.labels = data.map(d => d.date.toLocaleDateString());
        this.chart.data.datasets[0].data = data.map(d => d.price);
        this.chart.update();
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        ['output', 'chart', 'analysis'].forEach(tab => {
            const element = document.getElementById(`${tab}-tab`);
            const button = document.querySelector(`[data-tab="${tab}"]`);
            
            if (tab === tabName) {
                element.classList.remove('hidden');
                button.classList.remove('bg-gray-100', 'text-gray-700');
                button.classList.add('bg-blue-100', 'text-blue-700');
            } else {
                element.classList.add('hidden');
                button.classList.remove('bg-blue-100', 'text-blue-700');
                button.classList.add('bg-gray-100', 'text-gray-700');
            }
        });
    }

    exportResults() {
        const data = {
            code: this.editor.getValue(),
            output: document.getElementById('output-tab').innerHTML,
            analysis: document.getElementById('analysis-tab').innerHTML,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analysis-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
} 