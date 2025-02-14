const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh-token', authController.refreshToken);

// SSO routes
router.get('/sso/:provider', authController.initiateSSO);
router.get('/sso/:provider/callback', authController.handleSSOCallback);

// Password management
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authenticate, authController.changePassword);

// 2FA
router.post('/2fa/enable', authenticate, authController.enable2FA);
router.post('/2fa/verify', authenticate, authController.verify2FA);
router.post('/2fa/disable', authenticate, authController.disable2FA);

// Profile management
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router; 