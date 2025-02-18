class MeetingVoting {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-vote-btn]')) {
                this.showVotingModal(e.target.closest('.meeting-card').dataset.meetingId);
            }
        });
    }

    showVotingModal(meetingId) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.id = 'voting-modal';
        
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 m-4">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Meeting Vote</h3>
                    <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" onclick="this.closest('#voting-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="voting-form" class="space-y-4">
                    <input type="hidden" name="meetingId" value="${meetingId}">
                    
                    <div class="space-y-3">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Vote</label>
                        <div class="space-y-2">
                            <label class="flex items-center space-x-3">
                                <input type="radio" name="vote" value="approve" class="text-blue-600" required>
                                <span class="text-gray-700 dark:text-gray-300">Approve</span>
                            </label>
                            <label class="flex items-center space-x-3">
                                <input type="radio" name="vote" value="reject" class="text-blue-600">
                                <span class="text-gray-700 dark:text-gray-300">Reject</span>
                            </label>
                            <label class="flex items-center space-x-3">
                                <input type="radio" name="vote" value="abstain" class="text-blue-600">
                                <span class="text-gray-700 dark:text-gray-300">Abstain</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comments (optional)</label>
                        <textarea name="comments" rows="3" 
                            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
                    </div>

                    <div class="flex justify-end space-x-3 mt-6">
                        <button type="button" 
                            onclick="this.closest('#voting-modal').remove()"
                            class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Submit Vote
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupVotingForm(modal.querySelector('#voting-form'));
    }

    setupVotingForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            
            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                const voteData = {
                    meetingId: formData.get('meetingId'),
                    vote: formData.get('vote'),
                    comments: formData.get('comments'),
                    timestamp: new Date().toISOString()
                };

                this.updateMeetingCard(voteData);
                this.showNotification('Vote submitted successfully!', 'success');
                form.closest('#voting-modal').remove();
            } catch (error) {
                this.showNotification('Failed to submit vote. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Vote';
            }
        });
    }

    updateMeetingCard(voteData) {
        const meetingCard = document.querySelector(`[data-meeting-id="${voteData.meetingId}"]`);
        if (!meetingCard) return;

        const voteStatus = meetingCard.querySelector('.vote-status');
        if (voteStatus) {
            voteStatus.className = `px-2 py-1 text-sm rounded-full ${
                voteData.vote === 'approve' ? 'bg-green-100 text-green-800' :
                voteData.vote === 'reject' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
            }`;
            voteStatus.textContent = `Voted: ${voteData.vote.charAt(0).toUpperCase() + voteData.vote.slice(1)}`;
        }
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
} 