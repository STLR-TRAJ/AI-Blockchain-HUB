const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    password: {
        type: String,
        required: function() {
            return !this.ssoProvider; // Password required only if not SSO
        },
        minlength: 12
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'analyst'],
        default: 'user'
    },
    ssoProvider: {
        type: String,
        enum: ['google', 'github', 'microsoft', null],
        default: null
    },
    ssoId: String,
    profilePicture: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
}, {
    timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ ssoProvider: 1, ssoId: 1 });

// Pre-save middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = async function() {
    if (this.lockUntil && this.lockUntil > Date.now()) {
        throw new Error('Account is locked. Try again later.');
    }

    this.loginAttempts += 1;
    
    if (this.loginAttempts >= 5) {
        this.lockUntil = Date.now() + (15 * 60 * 1000); // Lock for 15 minutes
    }

    await this.save();
};

module.exports = mongoose.model('User', userSchema); 