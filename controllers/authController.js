const jwt = require('jsonwebtoken');
const User = require('../JS/models/User');
const { SecurityUtils } = require('../JS/Login');

class AuthController {
    async register(req, res) {
        try {
            const { email, password, name } = req.body;

            // Validate input
            SecurityUtils.validateEmail(email);
            SecurityUtils.validatePassword(password);

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            // Create user
            const user = new User({
                email,
                password,
                name
            });

            await user.save();

            // Generate tokens
            const token = this.generateToken(user);

            res.status(201).json({
                status: 'success',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check password
            const isValid = await user.comparePassword(password);
            if (!isValid) {
                await user.incrementLoginAttempts();
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate token
            const token = this.generateToken(user);

            // Update last login
            user.lastLogin = new Date();
            user.loginAttempts = 0;
            await user.save();

            res.json({
                status: 'success',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    generateToken(user) {
        return jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    // Add other controller methods...
}

module.exports = new AuthController(); 