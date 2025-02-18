const mongoose = require('mongoose');

// MongoDB Configuration
const MONGODB_CONFIG = {
    url: process.env.MONGODB_URI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        auth: {
            username: process.env.MONGODB_USER,
            password: process.env.MONGODB_PASSWORD
        }
    }
};

// Database Connection
class DatabaseService {
    constructor() {
        this.isConnected = false;
        this.connection = null;
        
        // Handle process termination
        process.on('SIGINT', this.gracefulShutdown.bind(this));
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
    }

    async connect() {
        try {
            if (this.isConnected) return this.connection;

            console.log('Connecting to MongoDB...');
            const connection = await mongoose.connect(MONGODB_CONFIG.url, MONGODB_CONFIG.options);
            
            console.log('MongoDB Connected Successfully');
            
            // Handle connection events
            mongoose.connection.on('error', (err) => {
                console.error('MongoDB Connection Error:', err);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('MongoDB Disconnected. Attempting to reconnect...');
                this.isConnected = false;
                this.reconnect();
            });

            this.isConnected = true;
            this.connection = connection;
            return connection;

        } catch (error) {
            console.error('MongoDB Connection Failed:', error);
            throw error;
        }
    }

    async reconnect() {
        try {
            await this.connect();
        } catch (error) {
            console.error('Reconnection failed:', error);
            setTimeout(() => this.reconnect(), 5000);
        }
    }

    async gracefulShutdown() {
        try {
            await mongoose.disconnect();
            console.log('MongoDB disconnected through app termination');
            process.exit(0);
        } catch (error) {
            console.error('Error during graceful shutdown:', error);
            process.exit(1);
        }
    }
}

module.exports = new DatabaseService(); 