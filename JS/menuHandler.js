class MenuHandler {
    constructor() {
        this.initializeMenu();
        this.setupEventListeners();
    }

    initializeMenu() {
        this.menuTrigger = document.querySelector('.menu-trigger');
        this.menuContent = document.querySelector('.menu-content');
        this.appearanceSelect = document.querySelector('select');
        this.isOpen = false;
        
        // Set correct paths based on current page
        this.updatePaths();
    }

    setupEventListeners() {
        // Toggle menu on click
        if (this.menuTrigger) {
            this.menuTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.menuTrigger?.contains(e.target) && 
                !this.menuContent?.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Handle dark mode toggle
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('darkMode', 
                    document.documentElement.classList.contains('dark'));
            });
        }

        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'true') {
            document.documentElement.classList.add('dark');
        }
    }

    updatePaths() {
        const isHomePage = !window.location.pathname.includes('/html/');
        const prefix = isHomePage ? 'html/' : '';
        const assetPrefix = isHomePage ? '' : '../';
        
        // Update avatar image path
        const avatar = document.querySelector('.menu-content img');
        if (avatar) {
            avatar.src = `${assetPrefix}assets/default-avatar.png`;
        }
        
        // Update quick links
        const links = document.querySelectorAll('.menu-content a[href]');
        links.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) return;
            
            const href = link.getAttribute('href');
            if (href.startsWith('http')) return;
            
            if (isHomePage) {
                if (!href.startsWith('html/')) {
                    link.href = `html/${href}`;
                }
            } else {
                if (href === 'Home.html') {
                    link.href = '../Home.html';
                }
            }
        });
    }

    toggleMenu() {
        if (this.menuContent) {
            this.isOpen = !this.isOpen;
            this.menuContent.classList.toggle('hidden');
            
            // Add animation classes
            if (this.isOpen) {
                this.menuContent.classList.add('menu-enter');
                this.menuContent.classList.remove('menu-leave');
            } else {
                this.menuContent.classList.add('menu-leave');
                this.menuContent.classList.remove('menu-enter');
            }
        }
    }

    closeMenu() {
        if (this.menuContent && this.isOpen) {
            this.isOpen = false;
            this.menuContent.classList.add('hidden');
        }
    }
} 