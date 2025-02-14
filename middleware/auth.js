const jwt = require('jsonwebtoken');
const User = require('../JS/models/User');
const { promisify } = require('util');

exports.authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        // Check if user changed password after token was issued
        if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
            return res.status(401).json({ message: 'Password recently changed, please login again' });
        }

        // Grant access
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
}; 