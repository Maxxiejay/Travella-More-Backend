// File: payment.js (for your existing backend)

const express = require('express');
const router = express.Router();
// Use your existing authentication middleware
const auth = require('../middleware/auth'); // Adjust path as needed

// Import the controller (will be created in step 2)
const paymentController = require('../controllers/paymentController');

// Basic routes needed for payment processing
router.post('/initialize', auth, paymentController.initializePayment);
router.get('/verify', paymentController.verifyPayment);
router.get('/transactions', auth, paymentController.listTransactions);

module.exports = router;