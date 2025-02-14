class VotingPageHandler {
    constructor() {
        this.meetingId = new URLSearchParams(window.location.search).get('meetingId');
        this.meeting = this.getMeetingData();
        this.initializePage();
        this.setupEventListeners();
    }

    getMeetingData() {
        const meetings = JSON.parse(localStorage.getItem('meetings') || '{}');
        return meetings[this.meetingId];
    }

    initializePage() {
        if (!this.meeting) {
            this.showError('Meeting not found');
            return;
        }

        const contentContainer = document.getElementById('voting-content');
        if (!contentContainer) return;

        contentContainer.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${this.meeting.title}</h2>
                        <p class="text-gray-600 dark:text-gray-400 mt-2">
                            Scheduled for: ${new Date(this.meeting.date + 'T' + this.meeting.time).toLocaleString()}
                        </p>
                    </div>
                    <span class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        ${this.meeting.type}
                    </span>
                </div>
                <div class="border-t dark:border-gray-700 pt-4 mt-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p class="text-gray-600 dark:text-gray-400">${this.meeting.description}</p>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cast Your Vote</h3>
                <form id="voting-form" class="space-y-6">
                    <div class="space-y-4">
                        <div class="flex space-x-4">
                            <button type="button" data-vote="approve" 
                                class="flex-1 px-4 py-3 border-2 rounded-lg text-center hover:bg-green-50 focus:ring-2 focus:ring-green-500">
                                <i class="fas fa-check text-green-500 text-xl mb-2"></i>
                                <div class="text-gray-900 dark:text-white font-medium">Approve</div>
                            </button>
                            <button type="button" data-vote="reject"
                                class="flex-1 px-4 py-3 border-2 rounded-lg text-center hover:bg-red-50 focus:ring-2 focus:ring-red-500">
                                <i class="fas fa-times text-red-500 text-xl mb-2"></i>
                                <div class="text-gray-900 dark:text-white font-medium">Reject</div>
                            </button>
                            <button type="button" data-vote="abstain"
                                class="flex-1 px-4 py-3 border-2 rounded-lg text-center hover:bg-gray-50 focus:ring-2 focus:ring-gray-500">
                                <i class="fas fa-minus text-gray-500 text-xl mb-2"></i>
                                <div class="text-gray-900 dark:text-white font-medium">Abstain</div>
                            </button>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Comments (optional)
                            </label>
                            <textarea id="vote-comments" rows="3" 
                                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <a href="BoardMeetings.html" 
                            class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                            Cancel
                        </a>
                        <button type="submit" id="submit-vote"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Submit Vote
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    setupEventListeners() {
        const form = document.getElementById('voting-form');
        if (!form) return;

        // Handle vote button selection
        const voteButtons = form.querySelectorAll('[data-vote]');
        let selectedVote = null;

        voteButtons.forEach(button => {
            button.addEventListener('click', () => {
                voteButtons.forEach(btn => btn.classList.remove('border-blue-500', 'bg-blue-50'));
                button.classList.add('border-blue-500', 'bg-blue-50');
                selectedVote = button.dataset.vote;
            });
        });

        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!selectedVote) {
                this.showNotification('Please select a vote option', 'error');
                return;
            }

            const submitBtn = document.getElementById('submit-vote');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                const voteData = {
                    meetingId: this.meetingId,
                    vote: selectedVote,
                    comments: document.getElementById('vote-comments').value,
                    timestamp: new Date().toISOString()
                };

                this.saveVote(voteData);
                this.showNotification('Vote submitted successfully!', 'success');
                
                // Redirect back to meetings page after short delay
                setTimeout(() => {
                    window.location.href = 'BoardMeetings.html';
                }, 1500);
            } catch (error) {
                this.showNotification('Failed to submit vote. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Vote';
            }
        });
    }

    saveVote(voteData) {
        const votes = JSON.parse(localStorage.getItem('meetingVotes') || '{}');
        votes[this.meetingId] = voteData;
        localStorage.setItem('meetingVotes', JSON.stringify(votes));
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-50 animate-fade-in`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    }

    showError(message) {
        const container = document.getElementById('voting-content');
        if (container) {
            container.innerHTML = `
                <div class="bg-red-50 dark:bg-red-900 rounded-xl shadow-md p-6 text-center">
                    <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                    <h2 class="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">${message}</h2>
                    <a href="BoardMeetings.html" class="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        Return to Meetings
                    </a>
                </div>
            `;
        }
    }
} 