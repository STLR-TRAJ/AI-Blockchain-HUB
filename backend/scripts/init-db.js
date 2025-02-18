const mongoose = require('mongoose');
const User = require('../models/User');
const FinancialNews = require('../models/FinancialNews');
const PoliticalNews = require('../models/PoliticalNews');
require('dotenv').config();

const initializeDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create admin user
        await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initializeDB(); 