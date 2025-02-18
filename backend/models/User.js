const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'analyst', 'admin'],
        default: 'user'
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        marketAlerts: {
            enabled: {
                type: Boolean,
                default: false
            },
            threshold: {
                type: Number,
                default: 5
            }
        },
        watchlist: [{
            symbol: String,
            type: {
                type: String,
                enum: ['stock', 'crypto', 'forex']
            }
        }]
    },
    lastLogin: Date,
    loginHistory: [{
        timestamp: Date,
        ip: String,
        device: String
    }]
}, {
    timestamps: true
});

// Password encryption middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.addToWatchlist = function(symbol, type) {
    if (!this.preferences.watchlist.some(item => item.symbol === symbol)) {
        this.preferences.watchlist.push({ symbol, type });
    }
};

module.exports = mongoose.model('User', userSchema); 