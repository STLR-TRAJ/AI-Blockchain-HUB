class MeetingScheduler {
    constructor() {
        this.setupEventListeners();
        this.upcomingMeetings = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        this.pastMeetings = document.querySelector('tbody');
    }

    setupEventListeners() {
        // Open scheduler button
        const scheduleBtn = document.getElementById('schedule-meeting-btn');
        scheduleBtn?.addEventListener('click', () => {
            this.showSchedulerModal();
        });

        // Close on backdrop click
        const modal = document.getElementById('schedule-modal');
        modal?.addEventListener('click', (e) => {
            if (e.target.id === 'schedule-modal') {
                this.hideSchedulerModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSchedulerModal();
            }
        });
    }

    showSchedulerModal() {
        const modal = document.getElementById('schedule-modal');
        if (modal) {
            modal.classList.remove('hidden');
            // Set minimum date to today
            const dateInput = modal.querySelector('input[type="date"]');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
                dateInput.value = today;
            }
            // Reset form
            document.getElementById('meeting-form')?.reset();
        }
    }

    hideSchedulerModal() {
        const modal = document.getElementById('schedule-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async scheduleMeeting(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Scheduling...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create meeting object
            const meeting = {
                title: formData.get('title'),
                date: formData.get('date'),
                time: formData.get('time'),
                duration: formData.get('duration'),
                type: formData.get('meeting-type'),
                description: formData.get('description'),
                participants: formData.get('participants').split(',').map(email => email.trim()),
                created: new Date().toISOString()
            };

            // Add meeting to the appropriate section
            this.addMeetingToUpcoming(meeting);
            
            // Show success message
            this.showNotification('Meeting scheduled successfully!', 'success');
            
            // Close modal
            this.hideSchedulerModal();
        } catch (error) {
            this.showNotification('Failed to schedule meeting. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = 'Schedule Meeting';
            submitBtn.disabled = false;
        }
    }

    addMeetingToUpcoming(meeting) {
        if (!this.upcomingMeetings) return;

        const meetingCard = document.createElement('div');
        meetingCard.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 card-hover meeting-card';
        meetingCard.dataset.meetingId = Date.now().toString();
        meetingCard.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${meeting.title}</h3>
                    <p class="text-sm text-gray-500 mt-1">
                        ${new Date(meeting.date + 'T' + meeting.time).toLocaleString()}
                    </p>
                </div>
                <span class="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">Scheduled</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">${meeting.description}</p>
            <div class="flex items-center justify-between">
                <div class="flex -space-x-2">
                    ${meeting.participants.slice(0, 3).map(() => `
                        <div class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white dark:border-gray-800"></div>
                    `).join('')}
                    ${meeting.participants.length > 3 ? `
                        <div class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs">
                            +${meeting.participants.length - 3}
                        </div>
                    ` : ''}
                </div>
                <div class="flex items-center space-x-2">
                    <span class="vote-status"></span>
                    <a href="Voting.html?meetingId=${meetingCard.dataset.meetingId}" 
                       class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200">
                        Go to Vote
                    </a>
                    <button class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200">Join</button>
                    <button class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Details</button>
                </div>
            </div>
        `;

        // Store meeting data in localStorage for access in voting page
        const meetingData = {
            ...meeting,
            id: meetingCard.dataset.meetingId,
            status: 'scheduled'
        };
        this.storeMeetingData(meetingData);

        this.upcomingMeetings.insertBefore(meetingCard, this.upcomingMeetings.firstChild);
    }

    storeMeetingData(meeting) {
        const meetings = JSON.parse(localStorage.getItem('meetings') || '{}');
        meetings[meeting.id] = meeting;
        localStorage.setItem('meetings', JSON.stringify(meetings));
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-50 animate-fade-in`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Fade out animation
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    }
} 