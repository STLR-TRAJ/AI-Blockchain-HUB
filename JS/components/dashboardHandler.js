class DashboardHandler {
    constructor() {
        this.initializeDashboard();
        this.setupEventListeners();
    }

    initializeDashboard() {
        this.updateRecentActivities();
        this.updateMeetingAnalytics();
        this.checkForMeetingRedirect();
    }

    setupEventListeners() {
        // Handle tab switching
        document.querySelectorAll('[data-tab-trigger]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                this.switchTab(trigger.dataset.tabTrigger);
            });
        });
    }

    updateRecentActivities() {
        const recentActivityList = document.querySelector('.recent-activity-list');
        if (!recentActivityList) return;

        const meetings = this.getRecentMeetings();
        const votes = this.getRecentVotes();
        const activities = this.combineActivities(meetings, votes);

        recentActivityList.innerHTML = activities.map(activity => {
            if (activity.type === 'meeting') {
                return `
                    <div class="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <i class="fas fa-users text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div class="ml-4 flex-1">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                                New Meeting Scheduled: ${activity.title}
                            </p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                ${new Date(activity.date + 'T' + activity.time).toLocaleString()}
                            </p>
                        </div>
                        <a href="BoardMeetings.html" class="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `;
            } else {
                return `
                    <div class="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <i class="fas fa-vote-yea text-green-600 dark:text-green-400"></i>
                        </div>
                        <div class="ml-4 flex-1">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                                New Vote Cast
                            </p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Vote: ${activity.vote.charAt(0).toUpperCase() + activity.vote.slice(1)}
                            </p>
                        </div>
                        <a href="Voting.html?meetingId=${activity.meetingId}" class="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `;
            }
        }).join('');
    }

    updateMeetingAnalytics() {
        const analyticsContainer = document.getElementById('meeting-analytics');
        if (!analyticsContainer) return;

        const analytics = this.getMeetingAnalytics();
        const meetings = this.getAllMeetings();
        const votes = this.getAllVotes();

        analyticsContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Meetings</h3>
                    <p class="text-3xl font-bold text-blue-600">${analytics.totalMeetings}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Participation Rate</h3>
                    <p class="text-3xl font-bold text-green-600">${analytics.participationRate}%</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Approval Rate</h3>
                    <p class="text-3xl font-bold text-yellow-600">${analytics.votingStats.approvalRate}%</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Votes</h3>
                    <p class="text-3xl font-bold text-purple-600">${this.getActiveVotesCount()}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vote Distribution</h3>
                    <canvas id="voteDistributionChart"></canvas>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meeting Types</h3>
                    <canvas id="meetingTypesChart"></canvas>
                </div>
            </div>

            <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Voting Timeline</h3>
                <canvas id="votingTimelineChart"></canvas>
            </div>
        `;

        this.initializeAnalyticsCharts(analytics, meetings, votes);
    }

    initializeAnalyticsCharts(analytics, meetings, votes) {
        // Vote Distribution Chart
        new Chart(document.getElementById('voteDistributionChart'), {
            type: 'pie',
            data: {
                labels: ['Approved', 'Rejected', 'Abstained'],
                datasets: [{
                    data: [
                        analytics.votingStats.approved,
                        analytics.votingStats.rejected,
                        analytics.votingStats.abstained
                    ],
                    backgroundColor: ['#10B981', '#EF4444', '#6B7280']
                }]
            }
        });

        // Meeting Types Chart
        const typeLabels = Object.keys(analytics.meetingTypes);
        const typeData = Object.values(analytics.meetingTypes);
        new Chart(document.getElementById('meetingTypesChart'), {
            type: 'bar',
            data: {
                labels: typeLabels,
                datasets: [{
                    data: typeData,
                    backgroundColor: '#3B82F6'
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Voting Timeline Chart
        const timelineData = this.prepareTimelineData(votes);
        new Chart(document.getElementById('votingTimelineChart'), {
            type: 'line',
            data: {
                labels: timelineData.labels,
                datasets: [{
                    label: 'Votes Cast',
                    data: timelineData.data,
                    borderColor: '#3B82F6',
                    tension: 0.1
                }]
            }
        });
    }

    // Helper methods
    getRecentMeetings() {
        const meetings = JSON.parse(localStorage.getItem('meetings') || '{}');
        return Object.values(meetings)
            .sort((a, b) => new Date(b.created) - new Date(a.created))
            .slice(0, 5)
            .map(m => ({ ...m, type: 'meeting' }));
    }

    getRecentVotes() {
        const votes = JSON.parse(localStorage.getItem('meetingVotes') || '{}');
        return Object.values(votes)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5)
            .map(v => ({ ...v, type: 'vote' }));
    }

    combineActivities(meetings, votes) {
        return [...meetings, ...votes]
            .sort((a, b) => {
                const dateA = a.type === 'meeting' ? new Date(a.created) : new Date(a.timestamp);
                const dateB = b.type === 'meeting' ? new Date(b.created) : new Date(b.timestamp);
                return dateB - dateA;
            })
            .slice(0, 5);
    }

    getMeetingAnalytics() {
        return JSON.parse(localStorage.getItem('meetingAnalytics') || '{}');
    }

    getAllMeetings() {
        return JSON.parse(localStorage.getItem('meetings') || '{}');
    }

    getAllVotes() {
        return JSON.parse(localStorage.getItem('meetingVotes') || '{}');
    }

    getActiveVotesCount() {
        const meetings = this.getAllMeetings();
        const votes = this.getAllVotes();
        return Object.values(meetings).filter(meeting => {
            const meetingVotes = Object.values(votes)
                .filter(v => v.meetingId === meeting.id);
            return meetingVotes.length < meeting.participants.length;
        }).length;
    }

    prepareTimelineData(votes) {
        const sortedVotes = Object.values(votes)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        return {
            labels: sortedVotes.map(v => new Date(v.timestamp).toLocaleDateString()),
            data: sortedVotes.map((_, i) => i + 1)
        };
    }

    checkForMeetingRedirect() {
        const meetingId = new URLSearchParams(window.location.search).get('meetingId');
        if (meetingId) {
            const meetingSection = document.getElementById('meeting-analytics');
            if (meetingSection) {
                meetingSection.scrollIntoView({ behavior: 'smooth' });
                this.switchTab('voting');
            }
        }
    }

    switchTab(tabId) {
        // Update tab triggers
        document.querySelectorAll('[data-tab-trigger]').forEach(trigger => {
            const isActive = trigger.dataset.tabTrigger === tabId;
            trigger.classList.toggle('bg-blue-600', isActive);
            trigger.classList.toggle('text-white', isActive);
            trigger.classList.toggle('bg-gray-100', !isActive);
            trigger.classList.toggle('text-gray-600', !isActive);
        });

        // Update tab content
        document.querySelectorAll('[data-tab-content]').forEach(content => {
            content.classList.toggle('hidden', content.dataset.tabContent !== tabId);
        });
    }

    updateVotingSection() {
        const votingContent = document.querySelector('[data-tab-content="voting"]');
        if (!votingContent) return;

        const activeVotes = this.getActiveVotes();
        
        votingContent.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Active Voting Stats -->
                <div class="lg:col-span-2">
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Active Voting Sessions</h3>
                            <a href="BoardMeetings.html" class="text-blue-600 hover:text-blue-700 text-sm">
                                View All Meetings
                            </a>
                        </div>
                        
                        <div class="space-y-4">
                            ${this.renderActiveVotingSessions(activeVotes)}
                        </div>
                    </div>

                    <!-- Voting Analytics -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Voting Analytics</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <canvas id="votingTrendsChart"></canvas>
                            </div>
                            <div>
                                <canvas id="participationRateChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity & Quick Actions -->
                <div class="space-y-6">
                    <!-- Quick Actions -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <a href="BoardMeetings.html" 
                                class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <i class="fas fa-calendar-plus text-blue-600 dark:text-blue-400"></i>
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">Schedule Meeting</h4>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Create a new board meeting</p>
                                </div>
                            </a>
                            <a href="Voting.html" 
                                class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                                <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                    <i class="fas fa-vote-yea text-green-600 dark:text-green-400"></i>
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">Cast Vote</h4>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Vote on active meetings</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    <!-- Recent Votes -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Votes</h3>
                        <div class="space-y-4">
                            ${this.renderRecentVotes()}
                        </div>
                    </div>

                    <!-- Voting Summary -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Voting Summary</h3>
                        <div class="space-y-4">
                            ${this.renderVotingSummary()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.initializeVotingCharts();
    }

    renderActiveVotingSessions(activeVotes) {
        if (!activeVotes.length) {
            return `
                <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                    <i class="fas fa-vote-yea text-4xl mb-2"></i>
                    <p>No active voting sessions</p>
                </div>
            `;
        }

        return activeVotes.map(vote => `
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">${vote.title}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Ends: ${new Date(vote.date + 'T' + vote.time).toLocaleString()}
                        </p>
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full ${
                        this.getVotingStatusClass(vote)
                    }">
                        ${this.getVotingStatusText(vote)}
                    </span>
                </div>
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Participation</span>
                        <span class="text-gray-900 dark:text-white">
                            ${this.calculateParticipation(vote)}%
                        </span>
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-600" 
                            style="width: ${this.calculateParticipation(vote)}%">
                        </div>
                    </div>
                </div>
                <div class="mt-4 flex justify-end">
                    <a href="Voting.html?meetingId=${vote.id}" 
                        class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Vote Now
                    </a>
                </div>
            </div>
        `).join('');
    }

    renderRecentVotes() {
        const votes = this.getRecentVotes();
        if (!votes.length) {
            return '<p class="text-gray-500 dark:text-gray-400">No recent votes</p>';
        }

        return votes.map(vote => `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full ${
                        vote.vote === 'approve' ? 'bg-green-100 text-green-600' :
                        vote.vote === 'reject' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                    } flex items-center justify-center">
                        <i class="fas ${
                            vote.vote === 'approve' ? 'fa-check' :
                            vote.vote === 'reject' ? 'fa-times' :
                            'fa-minus'
                        }"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                            ${this.getMeetingTitle(vote.meetingId)}
                        </p>
                        <p class="text-xs text-gray-500">
                            ${new Date(vote.timestamp).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderVotingSummary() {
        const analytics = this.getMeetingAnalytics();
        const stats = analytics.votingStats || { approved: 0, rejected: 0, abstained: 0 };
        
        return `
            <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">${stats.approved}</div>
                    <div class="text-sm text-gray-500">Approved</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-red-600">${stats.rejected}</div>
                    <div class="text-sm text-gray-500">Rejected</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-gray-600">${stats.abstained}</div>
                    <div class="text-sm text-gray-500">Abstained</div>
                </div>
            </div>
            <div class="mt-4">
                <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-500">Overall Approval Rate</span>
                    <span class="text-gray-900 dark:text-white">${stats.approvalRate}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-green-600" style="width: ${stats.approvalRate}%"></div>
                </div>
            </div>
        `;
    }

    // Helper methods
    getActiveVotes() {
        const meetings = this.getAllMeetings();
        const votes = this.getAllVotes();
        
        return Object.values(meetings)
            .filter(meeting => {
                const meetingDate = new Date(meeting.date + 'T' + meeting.time);
                const now = new Date();
                const meetingVotes = Object.values(votes)
                    .filter(v => v.meetingId === meeting.id);
                
                return meetingDate > now || 
                    (meetingVotes.length < meeting.participants.length);
            })
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
    }

    calculateParticipation(meeting) {
        const votes = this.getAllVotes();
        const meetingVotes = Object.values(votes)
            .filter(v => v.meetingId === meeting.id);
        return Math.round((meetingVotes.length / meeting.participants.length) * 100);
    }

    getVotingStatusClass(meeting) {
        const participation = this.calculateParticipation(meeting);
        return participation < 50 ? 'bg-yellow-100 text-yellow-800' :
               participation < 75 ? 'bg-blue-100 text-blue-800' :
               'bg-green-100 text-green-800';
    }

    getVotingStatusText(meeting) {
        const participation = this.calculateParticipation(meeting);
        return participation < 50 ? 'Low Participation' :
               participation < 75 ? 'Active' :
               'High Participation';
    }

    getMeetingTitle(meetingId) {
        const meetings = this.getAllMeetings();
        return meetings[meetingId]?.title || 'Unknown Meeting';
    }

    initializeVotingCharts() {
        // Voting Trends Chart
        const votingTrends = this.calculateVotingTrends();
        new Chart(document.getElementById('votingTrendsChart'), {
            type: 'line',
            data: {
                labels: votingTrends.labels,
                datasets: [{
                    label: 'Votes Cast',
                    data: votingTrends.data,
                    borderColor: '#3B82F6',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Voting Trends'
                    }
                }
            }
        });

        // Participation Rate Chart
        const participationData = this.calculateParticipationData();
        new Chart(document.getElementById('participationRateChart'), {
            type: 'doughnut',
            data: {
                labels: ['Voted', 'Pending'],
                datasets: [{
                    data: [participationData.voted, participationData.pending],
                    backgroundColor: ['#10B981', '#E5E7EB']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Overall Participation'
                    }
                }
            }
        });
    }

    calculateVotingTrends() {
        const votes = this.getAllVotes();
        const sortedVotes = Object.values(votes)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        return {
            labels: sortedVotes.map(v => new Date(v.timestamp).toLocaleDateString()),
            data: sortedVotes.map((_, i) => i + 1)
        };
    }

    calculateParticipationData() {
        const meetings = this.getAllMeetings();
        const votes = this.getAllVotes();
        
        const totalPossibleVotes = Object.values(meetings)
            .reduce((sum, meeting) => sum + meeting.participants.length, 0);
        const totalVotes = Object.keys(votes).length;
        
        return {
            voted: totalVotes,
            pending: totalPossibleVotes - totalVotes
        };
    }
} 