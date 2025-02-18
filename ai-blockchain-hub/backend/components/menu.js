class MenuComponent {
    constructor() {
        this.initializeMenu();
    }

    initializeMenu() {
        const menuHTML = `
        <!-- Menu Dropdown -->
        <div class="relative" id="menuDropdown">
            <button class="menu-trigger flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <i class="fas fa-bars text-gray-600 dark:text-gray-400"></i>
                <span class="text-gray-800 dark:text-white">Menu</span>
            </button>

            <!-- Dropdown Content -->
            <div class="menu-content hidden absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50">
                <!-- User Section -->
                <div class="p-4 border-b dark:border-gray-700">
                    <div class="flex items-center space-x-3 mb-4">
                        <img src="${window.location.pathname.includes('/html/') ? '../assets/default-avatar.png' : 'assets/default-avatar.png'}" alt="User" class="w-10 h-10 rounded-full">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-800 dark:text-white">Guest User</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Welcome to AI Blockchain Hub</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <a href="${window.location.pathname.includes('/html/') ? 'Login.html' : 'html/Login.html'}" 
                           class="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center">
                            Login
                        </a>
                        <a href="${window.location.pathname.includes('/html/') ? 'Register.html' : 'html/Register.html'}" 
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-center">
                            Register
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="p-4 border-b dark:border-gray-700">
                    <h4 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Quick Links</h4>
                    <a href="${window.location.pathname.includes('/html/') ? '../Home.html' : 'Home.html'}" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-home text-gray-600 dark:text-gray-400"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Home</span>
                    </a>
                    <a href="${window.location.pathname.includes('/html/') ? 'DashBoard.html' : 'html/DashBoard.html'}" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-chart-line text-gray-600 dark:text-gray-400"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Dashboard</span>
                    </a>
                    <a href="${window.location.pathname.includes('/html/') ? 'Compiler.html' : 'html/Compiler.html'}" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-code text-gray-600 dark:text-gray-400"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Compiler</span>
                    </a>
                </div>

                <!-- Info Links -->
                <div class="p-4 border-b dark:border-gray-700">
                    <h4 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Information</h4>
                    <a href="${window.location.pathname.includes('/html/') ? 'About.html' : 'html/About.html'}" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-info-circle text-gray-600 dark:text-gray-400"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">About Us</span>
                    </a>
                    <a href="${window.location.pathname.includes('/html/') ? 'FAQ.html' : 'html/FAQ.html'}" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-question-circle text-gray-600 dark:text-gray-400"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">FAQ</span>
                    </a>
                </div>

                <!-- KRSNA AI Section -->
                <div class="p-4 border-b dark:border-gray-700">
                    <h4 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">KRSNA AI</h4>
                    <a href="${window.location.pathname.includes('/html/') ? 'KRSNA-AI.html' : 'html/KRSNA-AI.html'}" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-robot text-blue-600"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Chat with KRSNA AI</span>
                    </a>
                </div>

                <!-- Settings Section -->
                <div class="p-4 border-b dark:border-gray-700">
                    <h4 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Settings</h4>
                    <a href="Settings.html" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-cog text-gray-600 dark:text-gray-400"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Settings</span>
                    </a>
                    <!-- Appearance -->
                    <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-paint-brush text-gray-600 dark:text-gray-400"></i>
                            <span class="text-sm text-gray-600 dark:text-gray-400">Appearance</span>
                        </div>
                        <select class="text-sm bg-transparent border-gray-300 dark:border-gray-600 rounded">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </div>
                </div>

                <!-- Social Media Section -->
                <div class="p-4">
                    <h4 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Connect With Us</h4>
                    <div class="grid grid-cols-4 gap-2">
                        <a href="#" class="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="fab fa-twitter text-[#1DA1F2]"></i>
                        </a>
                        <a href="#" class="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="fab fa-linkedin text-[#0A66C2]"></i>
                        </a>
                        <a href="#" class="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="fab fa-github text-gray-800 dark:text-white"></i>
                        </a>
                        <a href="#" class="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="fab fa-discord text-[#5865F2]"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;

        // Insert menu into the page
        const menuContainer = document.querySelector('#menu-container');
        if (menuContainer) {
            menuContainer.innerHTML = menuHTML;
        }
    }
} 