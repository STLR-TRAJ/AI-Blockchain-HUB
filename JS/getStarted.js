class GetStartedHandler {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const getStartedBtn = document.getElementById('get-started-btn');
        getStartedBtn?.addEventListener('click', () => this.showOnboardingModal());
    }

    showOnboardingModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.id = 'onboarding-modal';
        modal.innerHTML = this.getModalContent();
        document.body.appendChild(modal);

        // Initialize the first step
        this.showStep(1);

        // Setup modal close
        document.getElementById('close-modal')?.addEventListener('click', () => {
            modal.remove();
        });

        // Setup navigation buttons
        document.getElementById('next-step')?.addEventListener('click', () => this.nextStep());
        document.getElementById('prev-step')?.addEventListener('click', () => this.prevStep());
    }

    getModalContent() {
        return `
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <!-- Progress Bar -->
                        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div id="progress-bar" class="bg-blue-600 h-2.5 rounded-full" style="width: 25%"></div>
                        </div>

                        <!-- Step Content -->
                        <div id="step-1" class="step-content">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to AI Blockchain Hub!</h3>
                            <p class="text-gray-600 dark:text-gray-400">Let's get you set up with your account.</p>
                        </div>

                        <div id="step-2" class="step-content hidden">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Interests</h3>
                            <div class="space-y-2">
                                <label class="flex items-center space-x-3">
                                    <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600">
                                    <span class="text-gray-700 dark:text-gray-300">AI Technology</span>
                                </label>
                                <label class="flex items-center space-x-3">
                                    <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600">
                                    <span class="text-gray-700 dark:text-gray-300">Blockchain Development</span>
                                </label>
                                <label class="flex items-center space-x-3">
                                    <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600">
                                    <span class="text-gray-700 dark:text-gray-300">Cryptocurrency</span>
                                </label>
                            </div>
                        </div>

                        <div id="step-3" class="step-content hidden">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customize Your Experience</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Language</label>
                                    <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option>English</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notification Preferences</label>
                                    <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option>All notifications</option>
                                        <option>Important only</option>
                                        <option>None</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div id="step-4" class="step-content hidden">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Begin!</h3>
                            <p class="text-gray-600 dark:text-gray-400">Your account is now set up. Click complete to start exploring.</p>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button id="next-step" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Next
                        </button>
                        <button id="prev-step" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Back
                        </button>
                        <button id="close-modal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
        
        // Show current step
        document.getElementById(`step-${step}`)?.classList.remove('hidden');
        
        // Update progress bar
        const progress = (step / this.totalSteps) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        
        // Update buttons
        const nextBtn = document.getElementById('next-step');
        const prevBtn = document.getElementById('prev-step');
        
        if (nextBtn) {
            nextBtn.textContent = step === this.totalSteps ? 'Complete' : 'Next';
        }
        
        if (prevBtn) {
            prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';
        }
    }

    nextStep() {
        if (this.currentStep === this.totalSteps) {
            // Complete onboarding
            this.completeOnboarding();
        } else {
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    completeOnboarding() {
        // Save user preferences
        const preferences = this.collectPreferences();
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        
        // Redirect to registration
        window.location.href = 'html/Register.html';
    }

    collectPreferences() {
        // Collect all user selections from the onboarding process
        return {
            interests: Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.nextElementSibling.textContent),
            language: document.querySelector('select:first-of-type').value,
            notifications: document.querySelector('select:last-of-type').value
        };
    }
} 