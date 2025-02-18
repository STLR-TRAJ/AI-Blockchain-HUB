class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.initializeWebSocket();
        this.setupNotificationUI();
    }

    initializeWebSocket() {
        this.ws = new WebSocket('wss://your-websocket-server');
        
        this.ws.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            this.addNotification(notification);
        };
    }

    addNotification(notification) {
        this.notifications.unshift(notification);
        this.updateNotificationBadge();
        this.showNotificationToast(notification);
    }

    showNotificationToast(notification) {
        const toast = document.createElement('div');
        toast.className = `
            fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 
            transform transition-transform duration-300 translate-x-full
        `;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${this.getNotificationIcon(notification.type)} text-${this.getNotificationColor(notification.type)} mr-3"></i>
                <div>
                    <h4 class="font-semibold text-gray-800 dark:text-white">${notification.title}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${notification.message}</p>
                </div>
            </div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const unread = this.notifications.filter(n => !n.read).length;
            badge.textContent = unread;
            badge.classList.toggle('hidden', unread === 0);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: 'green-500',
            warning: 'yellow-500',
            error: 'red-500',
            info: 'blue-500'
        };
        return colors[type] || colors.info;
    }
} 