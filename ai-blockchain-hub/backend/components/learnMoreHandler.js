class LearnMoreHandler {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const learnMoreBtn = document.querySelector('[data-learn-more]');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => this.showLearnMoreModal());
        }
    }

    showLearnMoreModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto py-8';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full mx-4 my-8">
                <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">About AI Blockchain Hub</h2>
                    <button onclick="this.closest('.fixed').remove()" 
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                    <!-- Project Overview -->
                    <section>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Project Overview
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                            AI Blockchain Hub is a revolutionary platform that combines artificial intelligence 
                            with blockchain technology to create a transparent, secure, and efficient 
                            governance system. Our platform enables organizations to make data-driven 
                            decisions while maintaining the highest standards of security and accountability.
                        </p>
                    </section>

                    <!-- Key Features -->
                    <section>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Key Features
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-shield-alt text-blue-600 mr-2"></i>
                                    <h4 class="font-medium text-gray-900 dark:text-white">Secure Voting System</h4>
                                </div>
                                <p class="text-gray-600 dark:text-gray-400">
                                    Blockchain-based voting ensures transparency and immutability of all decisions.
                                </p>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-brain text-blue-600 mr-2"></i>
                                    <h4 class="font-medium text-gray-900 dark:text-white">AI-Powered Analytics</h4>
                                </div>
                                <p class="text-gray-600 dark:text-gray-400">
                                    Advanced analytics for better decision-making and trend prediction.
                                </p>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-users text-blue-600 mr-2"></i>
                                    <h4 class="font-medium text-gray-900 dark:text-white">Stakeholder Management</h4>
                                </div>
                                <p class="text-gray-600 dark:text-gray-400">
                                    Comprehensive tools for managing stakeholder relationships and engagement.
                                </p>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-chart-line text-blue-600 mr-2"></i>
                                    <h4 class="font-medium text-gray-900 dark:text-white">Real-time Analytics</h4>
                                </div>
                                <p class="text-gray-600 dark:text-gray-400">
                                    Live monitoring and analysis of organizational performance metrics.
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Stakeholders -->
                    <section>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Key Stakeholders
                        </h3>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <i class="fas fa-building text-blue-600"></i>
                                </div>
                                <div class="ml-4">
                                    <h4 class="font-medium text-gray-900 dark:text-white">Organizations</h4>
                                    <p class="text-gray-600 dark:text-gray-400">
                                        Companies and institutions seeking transparent governance solutions.
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                    <i class="fas fa-user-tie text-green-600"></i>
                                </div>
                                <div class="ml-4">
                                    <h4 class="font-medium text-gray-900 dark:text-white">Board Members</h4>
                                    <p class="text-gray-600 dark:text-gray-400">
                                        Decision-makers who require secure and efficient voting mechanisms.
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                    <i class="fas fa-users text-purple-600"></i>
                                </div>
                                <div class="ml-4">
                                    <h4 class="font-medium text-gray-900 dark:text-white">Shareholders</h4>
                                    <p class="text-gray-600 dark:text-gray-400">
                                        Investors who benefit from transparent decision-making processes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Impact & Future -->
                    <section>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Impact & Future Prospects
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Societal Impact</h4>
                                <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>Enhanced transparency in organizational governance</li>
                                    <li>Reduced fraud and manipulation in voting systems</li>
                                    <li>Improved stakeholder trust and engagement</li>
                                    <li>Better environmental, social, and governance (ESG) tracking</li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Market Impact</h4>
                                <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>Revolutionizing corporate governance</li>
                                    <li>Setting new standards for organizational transparency</li>
                                    <li>Creating new opportunities for global collaboration</li>
                                    <li>Driving innovation in blockchain technology</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- Future Roadmap -->
                    <section>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Future Roadmap
                        </h3>
                        <div class="relative">
                            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-600"></div>
                            <div class="space-y-6 relative">
                                <div class="ml-8">
                                    <div class="absolute -left-4 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        <span class="text-white text-sm">Q4</span>
                                    </div>
                                    <h4 class="font-medium text-gray-900 dark:text-white">Enhanced AI Integration</h4>
                                    <p class="text-gray-600 dark:text-gray-400">
                                        Advanced predictive analytics and automated decision support systems.
                                    </p>
                                </div>
                                <div class="ml-8">
                                    <div class="absolute -left-4 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        <span class="text-white text-sm">Q1</span>
                                    </div>
                                    <h4 class="font-medium text-gray-900 dark:text-white">Global Expansion</h4>
                                    <p class="text-gray-600 dark:text-gray-400">
                                        Expanding platform accessibility to international markets.
                                    </p>
                                </div>
                                <div class="ml-8">
                                    <div class="absolute -left-4 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        <span class="text-white text-sm">Q2</span>
                                    </div>
                                    <h4 class="font-medium text-gray-900 dark:text-white">Mobile Integration</h4>
                                    <p class="text-gray-600 dark:text-gray-400">
                                        Launch of mobile applications for enhanced accessibility.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Footer -->
                <div class="p-6 border-t dark:border-gray-700">
                    <div class="flex justify-between items-center">
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            Want to learn more? Contact our team.
                        </div>
                        <button onclick="this.closest('.fixed').remove()"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
} 