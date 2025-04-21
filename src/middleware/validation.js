const { body } = require('express-validator');

/**
 * Validation rules for user signup
 */
exports.validateSignup = [
  // Username validation
  body('username')
    .trim()
    .not().isEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  
  // Email validation
  body('email')
    .trim()
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  // Password validation
  body('password')
    .trim()
    .not().isEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),
  
  // Full name validation
  body('fullName')
    .trim()
    .not().isEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  
  // Mobile validation
  body('mobile')
    .trim()
    .not().isEmpty().withMessage('Mobile number is required')
    .isMobilePhone().withMessage('Please provide a valid mobile number'),
  
  // Business name validation
  body('businessName')
    .trim()
    .not().isEmpty().withMessage('Business name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Business name must be between 2 and 100 characters'),
  
  // Business location validation
  body('businessLocation')
    .trim()
    .not().isEmpty().withMessage('Business location is required')
    .isLength({ min: 2, max: 200 }).withMessage('Business location must be between 2 and 200 characters')
];

/**
 * Validation rules for user signin
 */
exports.validateSignin = [
  // Email validation
  body('email')
    .trim()
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  // Password validation
  body('password')
    .trim()
    .not().isEmpty().withMessage('Password is required')
];
