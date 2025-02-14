class DarkModeHandler {
    constructor() {
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.setupEventListeners();
        this.initializeDarkMode();
    }

    setupEventListeners() {
        const toggleBtns = document.querySelectorAll('[data-dark-toggle]');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggleDarkMode());
        });

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem('darkMode') === null) {
                this.setDarkMode(e.matches);
            }
        });
    }

    initializeDarkMode() {
        // Check for user preference first
        if (localStorage.getItem('darkMode') === null) {
            // If no preference, check system preference
            this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        this.setDarkMode(this.darkMode);
    }

    toggleDarkMode() {
        this.setDarkMode(!this.darkMode);
    }

    setDarkMode(enabled) {
        this.darkMode = enabled;
        localStorage.setItem('darkMode', enabled);

        // Update HTML class
        if (enabled) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Update toggle button icons
        this.updateToggleButtons();

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('darkModeChanged', { detail: { enabled } }));
    }

    updateToggleButtons() {
        const toggleBtns = document.querySelectorAll('[data-dark-toggle]');
        toggleBtns.forEach(btn => {
            const sunIcon = btn.querySelector('.sun-icon');
            const moonIcon = btn.querySelector('.moon-icon');
            
            if (sunIcon && moonIcon) {
                if (this.darkMode) {
                    sunIcon.classList.remove('hidden');
                    moonIcon.classList.add('hidden');
                } else {
                    sunIcon.classList.add('hidden');
                    moonIcon.classList.remove('hidden');
                }
            }
        });
    }
} 