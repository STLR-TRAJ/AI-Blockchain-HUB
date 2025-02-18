const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.register = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    const user = await User.create({
        username,
        email,
        password,
        preferences: {
            theme: req.body.theme || 'light',
            marketAlerts: {
                enabled: false,
                threshold: 5
            }
        }
    });

    const token = signToken(user._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                preferences: user.preferences
            }
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // Update login history
    user.lastLogin = new Date();
    user.loginHistory.push({
        timestamp: new Date(),
        ip: req.ip,
        device: req.headers['user-agent']
    });
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                preferences: user.preferences
            }
        }
    });
}); 