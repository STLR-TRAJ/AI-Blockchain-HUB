class Sidebar {
    constructor() {
        this.isCollapsed = false;
        this.initializeSidebar();
        this.overlay = this.createOverlay();
        this.setupEventListeners();
        this.highlightCurrentPage();
    }

    initializeSidebar() {
        const sidebarHTML = `
        <div id="sidebar" class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300">
            <!-- Logo Section -->
            <div class="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
                <a href="../Home.html" class="flex items-center">
                    <i class="fas fa-cube text-blue-600 text-2xl mr-2"></i>
                    <h1 class="text-xl font-bold text-gray-800 dark:text-white">AI Blockchain Hub</h1>
                </a>
                <button id="sidebarToggle" class="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <i class="fas fa-bars"></i>
                </button>
            </div>

            <!-- Navigation Links -->
            <nav class="mt-6 px-4 space-y-3">
                <a href="DashBoard.html" class="nav-link flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-chart-line w-5 h-5 mr-3"></i>
                    <span class="link-text">Dashboard</span>
                </a>
                <a href="FinancialNews.html" class="nav-link flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-newspaper w-5 h-5 mr-3"></i>
                    <span class="link-text">Financial News</span>
                </a>
                <a href="PoliticalUpdates.html" class="nav-link flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-landmark w-5 h-5 mr-3"></i>
                    <span class="link-text">Political Updates</span>
                </a>
                <a href="Voting.html" class="nav-link flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-vote-yea w-5 h-5 mr-3"></i>
                    <span class="link-text">Voting</span>
                </a>
                <a href="FinancialAnalysis.html" class="nav-link flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-chart-bar w-5 h-5 mr-3"></i>
                    <span class="link-text">Financial Analysis</span>
                </a>
                <a href="BoardMeetings.html" class="nav-link flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-users w-5 h-5 mr-3"></i>
                    <span class="link-text">Board Meetings</span>
                </a>
                <a href="AIInsights.html" class="nav-link flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-brain w-5 h-5 mr-3"></i>
                    <span class="link-text">AI Insights</span>
                </a>
                <a href="Settings.html" class="nav-link flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <i class="fas fa-cog w-5 h-5 mr-3"></i>
                    <span class="link-text">Settings</span>
                </a>
            </nav>

            <!-- User Section -->
            <div class="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
                <div class="flex items-center">
                    <img src="../assets/default-avatar.png" alt="User" class="w-8 h-8 rounded-full mr-3">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-800 dark:text-white">John Doe</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                    </div>
                    <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </div>
        `;

        // Insert sidebar into the page
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('sidebarToggle');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    this.toggleMobileSidebar();
                } else {
                    this.isCollapsed = !this.isCollapsed;
                    this.toggleSidebar();
                }
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const toggleBtn = document.getElementById('sidebarToggle');
            
            if (window.innerWidth < 1024 && 
                !sidebar.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                this.closeMobileSidebar();
            }
        });

        // Handle responsive behavior
        this.handleResponsive();
        window.addEventListener('resize', () => this.handleResponsive());
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.flex-1');
        const linkTexts = document.querySelectorAll('.link-text');

        if (this.isCollapsed) {
            sidebar.style.width = '5rem';
            mainContent.style.marginLeft = '5rem';
            linkTexts.forEach(text => text.style.display = 'none');
        } else {
            sidebar.style.width = '16rem';
            mainContent.style.marginLeft = '16rem';
            linkTexts.forEach(text => text.style.display = 'block');
        }
    }

    handleResponsive() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.flex-1');

        if (window.innerWidth < 1024) {
            sidebar.classList.add('transform', '-translate-x-full');
            mainContent.style.marginLeft = '0';
        } else {
            sidebar.classList.remove('transform', '-translate-x-full');
            mainContent.style.marginLeft = this.isCollapsed ? '5rem' : '16rem';
        }
    }

    highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-blue-600', 'dark:text-blue-500');
            }
        });
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden hidden';
        overlay.addEventListener('click', () => {
            this.closeMobileSidebar();
        });
        document.body.appendChild(overlay);
        return overlay;
    }

    toggleMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (window.innerWidth < 1024) {
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        }
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }
    }
} 