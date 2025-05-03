const axios = require('axios');
const { Package, User } = require('../models');

exports.payForPackage = async (req, res, next) => {
  try {
    const { packageId } = req.params;
    const pkg = await Package.findByPk(packageId);
    
    if (!pkg || pkg.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Invalid or already paid package' });
    }
    
    const user = await User.findByPk(pkg.userId);
    const paystackSecret = process.env.PAYSTACK_SECRET;
    
    const paystackRes = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: pkg.price * 100,
        metadata: {
          type: 'package',
          packageId: pkg.id
        }
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const { authorization_url, reference } = paystackRes.data.data;
    
    // Save reference to package
    await pkg.update({ paystackReference: reference });
    
    res.status(200).json({
      success: true,
      message: 'Payment initialized',
      paymentUrl: authorization_url
    });
  } catch (err) {
    console.error('Paystack init error:', err.response?.data || err);
    next(err);
  }
};