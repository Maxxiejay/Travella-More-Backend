const express = require('express');
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', validation.validateSignup, authController.signup);

/**
 * @route   POST /api/auth/signin
 * @desc    Authenticate a user and get token
 * @access  Public
 */
router.post('/signin', validation.validateSignin, authController.signin);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', auth.authenticateToken, authController.getProfile);

module.exports = router;
