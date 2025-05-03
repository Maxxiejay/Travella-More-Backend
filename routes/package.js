/**
 * Package Routes
 * Defines routes for package operations
 */
const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const authMiddleware = require('../middleware/auth');
const { 
  validateCreatePackage, 
  validatePackageId, 
  validateUpdatePackage 
} = require('../middleware/packageValidators');

/**
 * @route   POST /api/packages
 * @desc    Create a new package
 * @access  Public (Optional: Private with authentication)
 */
router.post('/', validateCreatePackage, packageController.createPackage);

/**
 * @route   GET /api/packages/:id
 * @desc    Get a package by ID
 * @access  Public/Private (depending on package visibility)
 */
router.get('/:id', validatePackageId, packageController.getPackage);

/**
 * @route   GET /api/packages
 * @desc    Get all packages (admin) or user packages (regular user)
 * @access  Private
 */
router.get('/', authMiddleware, packageController.getUserPackages);

/**
 * @route   GET /api/packages/admin/all
 * @desc    Get all packages (admin only)
 * @access  Private (Admin)
 */
router.get('/admin/all', authMiddleware, packageController.getAllPackages);

/**
 * @route   PUT /api/packages/:id
 * @desc    Update a package
 * @access  Private
 */
router.put('/:id', [authMiddleware, validatePackageId, validateUpdatePackage], packageController.updatePackage);

/**
 * @route   DELETE /api/packages/:id
 * @desc    Delete a package
 * @access  Private
 */
router.delete('/:id', [authMiddleware, validatePackageId], packageController.deletePackage);

/**
 * @route   POST /api/packages/paystack/webhook
 * @desc    Paystack Webhook to confirm payment
 * @access  Public
 */
router.post('/paystack/webhook', packageController.handlePaystackWebhook);

/**
 * @route   POST /api/packages/:id/pay
 * @desc    Initialize Paystack payment for a package
 * @access  Private
 */
router.post('/:id/pay', authMiddleware, validatePackageId, packageController.initiatePackagePayment);

module.exports = router;