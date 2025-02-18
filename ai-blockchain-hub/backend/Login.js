// Security Configuration
const SECURITY_CONFIG = {
    passwordMinLength: 12,
    passwordMaxLength: 128,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
    jwtExpiration: '1h',
    csrfTokenExpiration: 3600, // 1 hour in seconds
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: 100
};

// Security Utility Functions
class SecurityUtils {
    static generateCSRFToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    static async hashPassword(password) {
        // Using Argon2id for password hashing (recommended for 2024-2025)
        const argon2 = require('argon2');
        return await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
            saltLength: 32
        });
    }

    static validatePassword(password) {
        // Password complexity requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,128}$/;
        
        if (!passwordRegex.test(password)) {
            throw new Error(
                'Password must contain at least one uppercase letter, ' +
                'one lowercase letter, one number, one special character, ' +
                'and be between 12-128 characters long'
            );
        }
        
        // Check against common password lists
        if (this.isCommonPassword(password)) {
            throw new Error('This password is too common. Please choose a stronger password.');
        }
    }

    static sanitizeInput(input) {
        // XSS prevention
        const xss = require('xss');
        return xss(input.trim());
    }

    static validateEmail(email) {
        // Email validation with modern standards
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
    }

    static generateSecureToken() {
        return crypto.randomBytes(48).toString('base64');
    }
}

// Rate Limiting Implementation
class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.blockedIPs = new Map();
    }

    checkRateLimit(ip) {
        const now = Date.now();
        const windowStart = now - SECURITY_CONFIG.rateLimitWindow;

        // Clean up old requests
        this.requests.forEach((timestamps, key) => {
            this.requests.set(key, timestamps.filter(time => time > windowStart));
        });

        // Check if IP is blocked
        if (this.blockedIPs.has(ip)) {
            const blockExpiry = this.blockedIPs.get(ip);
            if (now < blockExpiry) {
                throw new Error('Too many requests. Please try again later.');
            }
            this.blockedIPs.delete(ip);
        }

        // Get requests for this IP
        const ipRequests = this.requests.get(ip) || [];
        ipRequests.push(now);
        this.requests.set(ip, ipRequests);

        // Check rate limit
        if (ipRequests.length > SECURITY_CONFIG.rateLimitMaxRequests) {
            this.blockedIPs.set(ip, now + SECURITY_CONFIG.lockoutDuration);
            throw new Error('Rate limit exceeded. Please try again later.');
        }
    }
}

// Login Session Management
class SessionManager {
    constructor() {
        this.activeSessions = new Map();
        this.failedAttempts = new Map();
    }

    async createSession(userId, ip) {
        const sessionToken = SecurityUtils.generateSecureToken();
        const session = {
            userId,
            ip,
            createdAt: new Date(),
            lastActivity: new Date(),
            csrfToken: SecurityUtils.generateCSRFToken()
        };

        this.activeSessions.set(sessionToken, session);
        return { sessionToken, csrfToken: session.csrfToken };
    }

    validateSession(sessionToken, ip, csrfToken) {
        const session = this.activeSessions.get(sessionToken);
        if (!session) {
            throw new Error('Invalid session');
        }

        // Validate IP address
        if (session.ip !== ip) {
            this.terminateSession(sessionToken);
            throw new Error('Session IP mismatch');
        }

        // Validate CSRF token
        if (session.csrfToken !== csrfToken) {
            throw new Error('Invalid CSRF token');
        }

        // Update last activity
        session.lastActivity = new Date();
    }

    terminateSession(sessionToken) {
        this.activeSessions.delete(sessionToken);
    }

    trackLoginAttempt(ip) {
        const attempts = this.failedAttempts.get(ip) || { count: 0, lastAttempt: null };
        const now = Date.now();

        // Reset counter if lockout duration has passed
        if (attempts.lastAttempt && (now - attempts.lastAttempt) > SECURITY_CONFIG.lockoutDuration) {
            attempts.count = 0;
        }

        attempts.count++;
        attempts.lastAttempt = now;
        this.failedAttempts.set(ip, attempts);

        if (attempts.count >= SECURITY_CONFIG.maxLoginAttempts) {
            throw new Error(`Account temporarily locked. Please try again after ${SECURITY_CONFIG.lockoutDuration / 60000} minutes`);
        }
    }
}

// Main Authentication Class
class AuthenticationService {
    constructor() {
        this.sessionManager = new SessionManager();
        this.rateLimiter = new RateLimiter();
        this.ssoService = new SSOService();
        this.initDatabase();
    }

    async initDatabase() {
        try {
            await db.connect();
        } catch (error) {
            console.error('Database connection failed:', error);
        }
    }

    async verifyUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Check login attempts
        if (user.lockUntil && user.lockUntil > Date.now()) {
            throw new Error('Account is locked. Try again later.');
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            await user.incrementLoginAttempts();
            throw new Error('Invalid password');
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lastLogin = new Date();
        await user.save();

        return user;
    }

    async login(email, password, ip) {
        try {
            // Rate limiting check
            this.rateLimiter.checkRateLimit(ip);

            // Input validation and sanitization
            email = SecurityUtils.sanitizeInput(email);
            SecurityUtils.validateEmail(email);

            // Track login attempt
            this.sessionManager.trackLoginAttempt(ip);

            // Here you would typically verify against your database
            // For demonstration, we'll assume user verification
            const user = await this.verifyUser(email, password);

            // Create session
            const sessionData = await this.sessionManager.createSession(user.id, ip);

            // Clear failed attempts on successful login
            this.sessionManager.failedAttempts.delete(ip);

            return {
                success: true,
                sessionToken: sessionData.sessionToken,
                csrfToken: sessionData.csrfToken
            };

        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Authentication failed');
        }
    }

    async signup(userData, ip) {
        try {
            // Rate limiting check
            this.rateLimiter.checkRateLimit(ip);

            // Input validation and sanitization
            const sanitizedData = {
                email: SecurityUtils.sanitizeInput(userData.email),
                name: SecurityUtils.sanitizeInput(userData.name),
                password: userData.password // Will be hashed, no sanitization needed
            };

            // Validate email and password
            SecurityUtils.validateEmail(sanitizedData.email);
            SecurityUtils.validatePassword(sanitizedData.password);

            // Hash password
            const hashedPassword = await SecurityUtils.hashPassword(sanitizedData.password);

            // Here you would typically save to your database
            // For demonstration, we'll just return success
            return {
                success: true,
                message: 'User registered successfully'
            };

        } catch (error) {
            console.error('Signup error:', error);
            throw new Error('Registration failed: ' + error.message);
        }
    }

    logout(sessionToken) {
        this.sessionManager.terminateSession(sessionToken);
        return { success: true, message: 'Logged out successfully' };
    }

    // Add SSO methods
    async initiateSSOLogin(provider) {
        try {
            const authUrl = await this.ssoService.initializeSSO(provider);
            window.location.href = authUrl;
        } catch (error) {
            console.error('SSO Initiation Error:', error);
            throw new Error('Failed to initiate SSO login');
        }
    }

    async handleSSOCallback(provider, code, state) {
        try {
            const ssoResult = await this.ssoService.handleCallback(provider, code, state);
            if (ssoResult.success) {
                const sessionData = await this.sessionManager.createSession(
                    ssoResult.userId,
                    getUserIP()
                );
                return {
                    success: true,
                    sessionToken: sessionData.sessionToken,
                    csrfToken: sessionData.csrfToken
                };
            }
        } catch (error) {
            console.error('SSO Callback Error:', error);
            throw new Error('SSO authentication failed');
        }
    }
}

// Event Listeners for UI
document.addEventListener('DOMContentLoaded', () => {
    const auth = new AuthenticationService();

    // Login Form Handler
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const result = await auth.login(email, password, getUserIP());
            
            if (result.success) {
                // Store tokens securely
                sessionStorage.setItem('csrfToken', result.csrfToken);
                // Use httpOnly cookies for sessionToken
                window.location.href = '/dashboard';
            }
        } catch (error) {
            showError(error.message);
        }
    });

    // Signup Form Handler
    document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const userData = {
                email: document.getElementById('signupEmail').value,
                name: document.getElementById('signupName').value,
                password: document.getElementById('signupPassword').value
            };
            const result = await auth.signup(userData, getUserIP());
            
            if (result.success) {
                showSuccess('Registration successful! Please login.');
                // Switch to login form
                showLoginForm();
            }
        } catch (error) {
            showError(error.message);
        }
    });

    // Add SSO button handlers
    const ssoButtons = document.querySelectorAll('.sso-login-btn');
    ssoButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const provider = button.dataset.provider;
            try {
                await auth.initiateSSOLogin(provider);
            } catch (error) {
                showError(error.message);
            }
        });
    });
});

// Helper Functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    // Add to DOM
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    // Add to DOM
}

function getUserIP() {
    // In a real application, this would be handled server-side
    return '127.0.0.1';
}
