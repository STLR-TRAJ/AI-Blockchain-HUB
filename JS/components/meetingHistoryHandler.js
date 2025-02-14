class MeetingHistoryHandler {
    constructor() {
        this.initializeHistory();
        this.setupEventListeners();
    }

    initializeHistory() {
        const meetings = this.getAllMeetings();
        const votes = this.getAllVotes();
        this.updateHistoryTable(meetings, votes);
        this.updateAnalytics(meetings, votes);
    }

    getAllMeetings() {
        return JSON.parse(localStorage.getItem('meetings') || '{}');
    }

    getAllVotes() {
        return JSON.parse(localStorage.getItem('meetingVotes') || '{}');
    }

    updateHistoryTable(meetings, votes) {
        const tbody = document.querySelector('.meeting-history tbody');
        if (!tbody) return;

        tbody.innerHTML = Object.values(meetings)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(meeting => {
                const meetingVotes = Object.values(votes)
                    .filter(vote => vote.meetingId === meeting.id);
                const voteStats = this.calculateVoteStats(meetingVotes);
                
                return `
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">${meeting.title}</div>
                            <div class="text-sm text-gray-500">${meeting.type}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            ${new Date(meeting.date + 'T' + meeting.time).toLocaleString()}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center">
                                <div class="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full bg-green-500" 
                                         style="width: ${voteStats.approvalRate}%"></div>
                                </div>
                                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    ${voteStats.approvalRate}%
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${meetingVotes.length}/${meeting.participants.length}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onclick="historyHandler.showMeetingDetails('${meeting.id}')"
                                class="text-blue-600 hover:text-blue-900 mr-3">
                                Details
                            </button>
                            <a href="DashBoard.html?meetingId=${meeting.id}#meeting-analytics"
                                class="text-green-600 hover:text-green-900">
                                Analytics
                            </a>
                        </td>
                    </tr>
                `;
            }).join('');
    }

    calculateVoteStats(votes) {
        if (!votes.length) return { approvalRate: 0, approved: 0, rejected: 0, abstained: 0 };

        const approved = votes.filter(v => v.vote === 'approve').length;
        const rejected = votes.filter(v => v.vote === 'reject').length;
        const abstained = votes.filter(v => v.vote === 'abstain').length;
        const approvalRate = Math.round((approved / votes.length) * 100);

        return { approvalRate, approved, rejected, abstained };
    }

    showMeetingDetails(meetingId) {
        const meeting = this.getAllMeetings()[meetingId];
        const votes = Object.values(this.getAllVotes())
            .filter(vote => vote.meetingId === meetingId);
        const stats = this.calculateVoteStats(votes);

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full m-4 p-6">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${meeting.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">
                            ${new Date(meeting.date + 'T' + meeting.time).toLocaleString()}
                        </p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Meeting Details</h4>
                        <div class="space-y-2 text-gray-600 dark:text-gray-400">
                            <p><span class="font-medium">Type:</span> ${meeting.type}</p>
                            <p><span class="font-medium">Duration:</span> ${meeting.duration} minutes</p>
                            <p><span class="font-medium">Description:</span> ${meeting.description}</p>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Voting Results</h4>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Approved</span>
                                <div class="flex items-center">
                                    <div class="h-2 w-24 bg-gray-200 rounded-full overflow-hidden mr-2">
                                        <div class="h-full bg-green-500" 
                                             style="width: ${(stats.approved/votes.length)*100}%"></div>
                                    </div>
                                    <span class="text-sm text-gray-600 dark:text-gray-400">
                                        ${stats.approved}
                                    </span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Rejected</span>
                                <div class="flex items-center">
                                    <div class="h-2 w-24 bg-gray-200 rounded-full overflow-hidden mr-2">
                                        <div class="h-full bg-red-500" 
                                             style="width: ${(stats.rejected/votes.length)*100}%"></div>
                                    </div>
                                    <span class="text-sm text-gray-600 dark:text-gray-400">
                                        ${stats.rejected}
                                    </span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Abstained</span>
                                <div class="flex items-center">
                                    <div class="h-2 w-24 bg-gray-200 rounded-full overflow-hidden mr-2">
                                        <div class="h-full bg-gray-500" 
                                             style="width: ${(stats.abstained/votes.length)*100}%"></div>
                                    </div>
                                    <span class="text-sm text-gray-600 dark:text-gray-400">
                                        ${stats.abstained}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6">
                            <a href="DashBoard.html?meetingId=${meetingId}#meeting-analytics"
                                class="inline-flex items-center text-blue-600 hover:text-blue-700">
                                <span>View detailed analytics</span>
                                <i class="fas fa-arrow-right ml-2"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mt-6 border-t dark:border-gray-700 pt-6">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Comments</h4>
                    <div class="space-y-4">
                        ${votes.slice(0, 3).map(vote => `
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">Anonymous User</span>
                                    <span class="text-xs text-gray-500">${new Date(vote.timestamp).toLocaleString()}</span>
                                </div>
                                <p class="text-gray-600 dark:text-gray-400">${vote.comments || 'No comment provided'}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    updateAnalytics(meetings, votes) {
        // Send analytics data to dashboard
        const analyticsData = {
            totalMeetings: Object.keys(meetings).length,
            votingStats: this.calculateOverallVotingStats(votes),
            meetingTypes: this.calculateMeetingTypeStats(meetings),
            participationRate: this.calculateParticipationRate(meetings, votes),
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('meetingAnalytics', JSON.stringify(analyticsData));
    }

    calculateOverallVotingStats(votes) {
        const allVotes = Object.values(votes);
        return this.calculateVoteStats(allVotes);
    }

    calculateMeetingTypeStats(meetings) {
        return Object.values(meetings).reduce((acc, meeting) => {
            acc[meeting.type] = (acc[meeting.type] || 0) + 1;
            return acc;
        }, {});
    }

    calculateParticipationRate(meetings, votes) {
        const totalParticipants = Object.values(meetings)
            .reduce((sum, meeting) => sum + meeting.participants.length, 0);
        const totalVotes = Object.keys(votes).length;
        return Math.round((totalVotes / totalParticipants) * 100);
    }
} 