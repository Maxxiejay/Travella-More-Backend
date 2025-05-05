// File: paymentController.js (for your existing backend)

const https = require('https');
const { v4: uuidv4 } = require('uuid');

// Helper function to make Paystack API requests
const paystack = (request) => {
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: request.path,
    method: request.method,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      reject(error);
    });

    if (request.body) {
      req.write(JSON.stringify(request.body));
    }
    req.end();
  });
};

// Initialize payment
exports.initializePayment = async (req, res) => {
  try {
    const { amount, email, reference = uuidv4(), metadata = {} } = req.body;

    if (!amount || !email) {
      return res.status(400).json({
        success: false,
        message: 'Amount and email are required'
      });
    }

    // Convert amount to kobo (smallest currency unit)
    const amountInKobo = Math.round(parseFloat(amount) * 100);

    // Create request to Paystack
    const request = {
      method: 'POST',
      path: '/transaction/initialize',
      body: {
        email,
        amount: amountInKobo,
        reference,
        callback_url: process.env.PAYMENT_CALLBACK_URL || `${process.env.BASE_URL}/api/payments/verify`,
        metadata: {
          ...metadata,
          user_id: req.user ? req.user.id : null
        }
      }
    };

    // Initialize transaction with Paystack
    const response = await paystack(request);

    return res.status(200).json({
      success: true,
      message: 'Payment initialized',
      data: response.data
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.message
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Reference is required'
      });
    }

    // Create request to Paystack
    const request = {
      method: 'GET',
      path: `/transaction/verify/${reference}`
    };

    // Verify transaction with Paystack
    const response = await paystack(request);

    // Handle successful payment here (update database, etc.)
    if (response.data && response.data.status === 'success') {
      // Update your database based on the payment status
      // For example: Update order status, create subscription, etc.
      // const metadata = response.data.metadata;
      // await YourModel.updateStatus(metadata.order_id, 'paid');
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified',
      data: response.data
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

// List transactions
exports.listTransactions = async (req, res) => {
  try {
    // Create request to Paystack
    const request = {
      method: 'GET',
      path: '/transaction'
    };

    // Get transactions from Paystack
    const response = await paystack(request);

    return res.status(200).json({
      success: true,
      message: 'Transactions retrieved',
      data: response.data
    });
  } catch (error) {
    console.error('List transactions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions',
      error: error.message
    });
  }
};