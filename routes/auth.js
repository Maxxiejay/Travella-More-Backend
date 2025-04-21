const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  validateSignup, 
  validateSignin, 
  validateEmail,
  validatePasswordReset,
  validateNewPassword
} = require('../middleware/validators');
const authMiddleware = require('../middleware/auth');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', validateSignup, authController.signup);

/**
 * @route   POST /api/auth/signin
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/signin', validateSignin, authController.signin);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile data
 * @access  Private
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email with token
 * @access  Public
 */
router.get('/verify-email/:token', authController.verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Public
 */
router.post('/resend-verification', validateEmail, authController.resendVerification);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post('/forgot-password', validateEmail, authController.forgotPassword);

/**
 * @route   GET /api/auth/reset-password/:token
 * @desc    Validate password reset token
 * @access  Public
 */
router.get('/reset-password/:token', authController.validateResetToken);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password/:token', validateNewPassword, authController.resetPassword);

/**
 * @route   POST /api/auth/test-email
 * @desc    Send a test email to verify email configuration
 * @access  Public
 */
router.post('/test-email', validateEmail, authController.testEmailService);

module.exports = router;
