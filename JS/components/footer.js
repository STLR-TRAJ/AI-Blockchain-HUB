class Footer {
    constructor() {
        this.initializeFooter();
    }

    initializeFooter() {
        const footerHTML = `
        <footer class="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-auto">
            <div class="max-w-7xl mx-auto px-4 py-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <!-- Company Info -->
                    <div>
                        <h3 class="text-gray-800 dark:text-white font-semibold mb-3">AI Blockchain Hub</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">
                            Empowering decisions through AI and blockchain technology.
                        </p>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h3 class="text-gray-800 dark:text-white font-semibold mb-3">Quick Links</h3>
                        <ul class="space-y-2">
                            <li><a href="DashBoard.html" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">Dashboard</a></li>
                            <li><a href="AIInsights.html" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">AI Insights</a></li>
                            <li><a href="FinancialAnalysis.html" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">Financial Analysis</a></li>
                            <li><a href="Voting.html" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">Voting</a></li>
                        </ul>
                    </div>

                    <!-- Support -->
                    <div>
                        <h3 class="text-gray-800 dark:text-white font-semibold mb-3">Support</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">Help Center</a></li>
                            <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">Documentation</a></li>
                            <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">API Status</a></li>
                            <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">Contact Us</a></li>
                        </ul>
                    </div>

                    <!-- Legal -->
                    <div>
                        <h3 class="text-gray-800 dark:text-white font-semibold mb-3">Legal</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">Privacy Policy</a></li>
                            <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">Terms of Service</a></li>
                            <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Bottom Bar -->
                <div class="border-t dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p class="text-gray-600 dark:text-gray-400 text-sm">
                        © 2024 AI Blockchain Hub. All rights reserved.
                    </p>
                    <div class="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                            <i class="fab fa-linkedin"></i>
                        </a>
                        <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
        `;

        // Insert footer into the page
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
} 