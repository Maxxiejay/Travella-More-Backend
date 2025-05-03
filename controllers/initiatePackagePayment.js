const axios = require('axios');
const Package = require('../models/Package');
const { PAYSTACK_SECRET_KEY, CLIENT_BASE_URL } = process.env;

exports.initiatePackagePayment = async (req, res, next) => {
  try {
    const packageId = req.params.id;
    const userId = req.user.id;
    
    const pkg = await Package.findOne({ where: { id: packageId, userId } });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    if (pkg.paymentStatus === 'paid') return res.status(400).json({ success: false, message: 'Package already paid for' });
    
    const paystackData = {
      email: req.user.email,
      amount: pkg.cost * 100, // Paystack expects amount in kobo
      metadata: {
        packageId: pkg.id
      },
      callback_url: `${CLIENT_BASE_URL}/payment-success`
    };
    
    const response = await axios.post('https://api.paystack.co/transaction/initialize', paystackData, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const reference = response.data.data.reference;
    
    await pkg.update({ paystackReference: reference });
    
    res.status(200).json({
      success: true,
      message: 'Payment initialized',
      authorization_url: response.data.data.authorization_url
    });
  } catch (err) {
    console.error('Error initiating Paystack payment:', err);
    next(err);
  }
};