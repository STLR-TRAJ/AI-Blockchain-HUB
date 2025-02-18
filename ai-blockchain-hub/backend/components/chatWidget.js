class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.createWidget();
        this.setupEventListeners();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'fixed bottom-4 right-4 z-50';
        widget.innerHTML = `
            <!-- Chat Button -->
            <button id="chat-widget-button" class="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <i class="fas fa-robot text-xl"></i>
            </button>

            <!-- Chat Window -->
            <div id="chat-widget-window" class="hidden absolute bottom-16 right-0 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col">
                <!-- Header -->
                <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-robot text-white"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800 dark:text-white">KRSNA AI</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Online</p>
                        </div>
                    </div>
                    <button id="close-chat-widget" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Messages -->
                <div id="widget-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
                    <!-- Messages will be inserted here -->
                </div>

                <!-- Input -->
                <div class="p-4 border-t dark:border-gray-700">
                    <form id="widget-chat-form" class="flex space-x-2">
                        <input 
                            type="text" 
                            class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Type your message..."
                        >
                        <button 
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
    }

    setupEventListeners() {
        const button = document.getElementById('chat-widget-button');
        const closeButton = document.getElementById('close-chat-widget');
        const window = document.getElementById('chat-widget-window');
        const form = document.getElementById('widget-chat-form');

        button?.addEventListener('click', () => this.toggleWidget());
        closeButton?.addEventListener('click', () => this.closeWidget());
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMessage(e.target.querySelector('input').value);
            e.target.querySelector('input').value = '';
        });
    }

    toggleWidget() {
        const window = document.getElementById('chat-widget-window');
        this.isOpen = !this.isOpen;
        window?.classList.toggle('hidden');
    }

    closeWidget() {
        const window = document.getElementById('chat-widget-window');
        this.isOpen = false;
        window?.classList.add('hidden');
    }

    handleMessage(message) {
        // Add to messages
        const messagesDiv = document.getElementById('widget-messages');
        if (messagesDiv && message.trim()) {
            // Add user message
            this.addMessage(messagesDiv, 'user', message);

            // Simulate AI response
            setTimeout(() => {
                this.addMessage(messagesDiv, 'ai', `This is a response to: "${message}"`);
            }, 1000);
        }
    }

    addMessage(container, type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'}`;
        messageDiv.innerHTML = `
            <div class="max-w-[70%] p-3 rounded-lg ${
                type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
            }">
                ${content}
            </div>
        `;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }
} 