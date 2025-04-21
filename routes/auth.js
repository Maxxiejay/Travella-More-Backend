const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateSignin } = require('../middleware/validators');

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
router.get('/profile', require('../middleware/auth'), authController.getProfile);

module.exports = router;
