class UIHandler {
    constructor() {
        this.initializeCharts();
        this.initializeTooltips();
        this.setupDynamicUI();
        this.initializeTheme();
    }

    initializeCharts() {
        // Configure chart themes based on dark/light mode
        Chart.defaults.color = document.documentElement.classList.contains('dark') 
            ? '#9CA3AF' 
            : '#4B5563';

        // Update charts when theme changes
        document.querySelector('.dark-mode-toggle')?.addEventListener('click', () => {
            this.updateChartsTheme();
        });
    }

    updateChartsTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#9CA3AF' : '#4B5563';
        const gridColor = isDark ? '#374151' : '#E5E7EB';

        Chart.helpers.each(Chart.instances, (chart) => {
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.options.plugins.legend.labels.color = textColor;
            chart.update();
        });
    }

    initializeTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip hidden absolute bg-gray-900 text-white p-2 rounded text-sm';
            tooltip.textContent = element.dataset.tooltip;
            
            element.addEventListener('mouseenter', () => {
                tooltip.classList.remove('hidden');
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left}px`;
                tooltip.style.top = `${rect.bottom + 5}px`;
            });

            element.addEventListener('mouseleave', () => {
                tooltip.classList.add('hidden');
            });

            document.body.appendChild(tooltip);
        });
    }

    setupDynamicUI() {
        // Handle collapsible sections
        document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const target = document.querySelector(trigger.dataset.target);
                target?.classList.toggle('hidden');
                trigger.querySelector('.icon')?.classList.toggle('rotate-180');
            });
        });

        // Handle tabs
        document.querySelectorAll('.tab-trigger').forEach(tab => {
            tab.addEventListener('click', () => {
                const group = tab.closest('.tab-group');
                const target = document.querySelector(tab.dataset.target);

                group.querySelectorAll('.tab-trigger').forEach(t => 
                    t.classList.remove('active-tab'));
                group.querySelectorAll('.tab-content').forEach(c => 
                    c.classList.add('hidden'));

                tab.classList.add('active-tab');
                target?.classList.remove('hidden');
            });
        });
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'true') {
            document.documentElement.classList.add('dark');
        }
    }
} 