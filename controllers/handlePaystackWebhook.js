const crypto = require('crypto');

exports.handlePaystackWebhook = async (req, res) => {
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = req.body;
  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    
    const pkg = await Package.findOne({ where: { paystackReference: reference } });
    if (pkg && pkg.paymentStatus !== 'paid') {
      await pkg.update({ paymentStatus: 'paid' });
    }
  }
  
  res.sendStatus(200);
};