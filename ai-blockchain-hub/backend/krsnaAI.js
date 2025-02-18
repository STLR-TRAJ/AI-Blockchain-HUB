class KrsnaAI {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatForm = document.getElementById('chat-form');
        this.messageInput = document.getElementById('message-input');
        this.setupEventListeners();
        this.initializeChat();
    }

    setupEventListeners() {
        this.chatForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
    }

    initializeChat() {
        this.addMessage({
            type: 'ai',
            content: 'Hello! I am KRSNA AI. How can I assist you today?'
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage({
            type: 'user',
            content: message
        });

        // Clear input
        this.messageInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Simulate AI response (replace with actual API call)
            await this.getAIResponse(message);
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addMessage({
                type: 'error',
                content: 'Sorry, I encountered an error. Please try again.'
            });
        }
    }

    async getAIResponse(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove typing indicator
        this.removeTypingIndicator();

        // Add AI response
        this.addMessage({
            type: 'ai',
            content: `This is a simulated response to: "${message}"`
        });
    }

    addMessage({ type, content }) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'}`;

        const messageBubble = document.createElement('div');
        messageBubble.className = `max-w-[70%] p-4 rounded-lg ${
            type === 'user' 
                ? 'bg-blue-600 text-white' 
                : type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
        }`;
        messageBubble.textContent = content;

        messageDiv.appendChild(messageBubble);
        this.chatMessages?.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex justify-start';
        indicator.innerHTML = `
            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <div class="flex space-x-2">
                    <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        `;
        this.chatMessages?.appendChild(indicator);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        document.getElementById('typing-indicator')?.remove();
    }

    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
} 