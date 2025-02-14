class NavigationComponent {
    constructor() {
        this.initializeNavigation();
    }

    initializeNavigation() {
        const currentPage = window.location.pathname.split('/').pop();
        const navHTML = `
        <nav class="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-10">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between h-16">
                    <!-- Logo -->
                    <div class="flex items-center">
                        <a href="${this.getBasePath()}Home.html" class="flex items-center">
                            <i class="fas fa-cube text-blue-600 text-2xl mr-2"></i>
                            <span class="text-xl font-bold text-gray-800 dark:text-white">AI Blockchain Hub</span>
                        </a>
                    </div>

                    <!-- Main Navigation -->
                    <div class="hidden md:flex items-center space-x-4">
                        <a href="${this.getBasePath()}Home.html" 
                           class="${this.getLinkClass(currentPage, 'Home.html')}">Home</a>
                        <a href="${this.getBasePath()}html/DashBoard.html" 
                           class="${this.getLinkClass(currentPage, 'DashBoard.html')}">Dashboard</a>
                        <a href="${this.getBasePath()}html/Compiler.html" 
                           class="${this.getLinkClass(currentPage, 'Compiler.html')}">Compiler</a>
                        <a href="${this.getBasePath()}html/About.html" 
                           class="${this.getLinkClass(currentPage, 'About.html')}">About</a>
                        <a href="${this.getBasePath()}html/FAQ.html" 
                           class="${this.getLinkClass(currentPage, 'FAQ.html')}">FAQ</a>
                    </div>

                    <!-- User Menu -->
                    <div class="flex items-center space-x-4">
                        <button id="theme-toggle" class="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <i class="fas fa-moon"></i>
                        </button>
                        <a href="${this.getBasePath()}html/Login.html" 
                           class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Login
                        </a>
                    </div>
                </div>
            </div>
        </nav>`;

        // Insert navigation into the page
        document.body.insertAdjacentHTML('afterbegin', navHTML);
        this.setupEventListeners();
    }

    getBasePath() {
        return window.location.pathname.includes('/html/') ? '../' : '';
    }

    getLinkClass(currentPage, linkPage) {
        const isActive = currentPage === linkPage;
        return isActive 
            ? 'text-blue-600 font-medium' 
            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600';
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const icon = themeToggle.querySelector('i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        });

        // Add dark mode toggle button to all pages
        const navEnd = document.querySelector('.nav-end');
        if (navEnd) {
            navEnd.insertAdjacentHTML('afterbegin', `
                <button data-dark-toggle class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg class="sun-icon hidden w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
                        </path>
                    </svg>
                    <svg class="moon-icon w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z">
                        </path>
                    </svg>
                </button>
            `);
        }
    }
} 