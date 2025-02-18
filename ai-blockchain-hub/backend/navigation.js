// Navigation and Page Interaction Handler
class NavigationHandler {
    constructor() {
        this.ui = new UIHandler();
        this.notifications = new NotificationSystem();
        this.forms = new FormHandler();
        this.initializeSidebar();
        this.initializeModals();
        this.setupEventListeners();
        this.setupPageSpecificFeatures();
    }

    initializeSidebar() {
        // Highlight current page in sidebar
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href').includes(currentPage)) {
                link.classList.add('bg-gray-100', 'dark:bg-gray-700');
            }
        });
    }

    initializeModals() {
        // Initialize all modals
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modalId = trigger.dataset.modal;
                this.toggleModal(modalId);
            });
        });
    }

    setupEventListeners() {
        // Dark mode toggle
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('darkMode', 
                    document.documentElement.classList.contains('dark'));
            });
        }

        // Handle notifications
        const notificationBell = document.querySelector('.notification-badge');
        if (notificationBell) {
            notificationBell.addEventListener('click', this.handleNotifications);
        }
    }

    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.toggle('hidden');
        }
    }

    handleNotifications() {
        // Implement notification handling
    }

    setupPageSpecificFeatures() {
        const currentPage = window.location.pathname.split('/').pop();
        
        switch(currentPage) {
            case 'AIInsights.html':
                this.initializeAIFeatures();
                break;
            case 'FinancialAnalysis.html':
                this.initializeFinancialFeatures();
                break;
            case 'Voting.html':
                this.initializeVotingFeatures();
                break;
        }
    }

    initializeAIFeatures() {
        this.aiHandler = new AIHandler();
    }

    initializeFinancialFeatures() {
        this.financialHandler = new FinancialHandler();
    }

    initializeVotingFeatures() {
        this.blockchainHandler = new BlockchainHandler();
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationHandler();
}); 