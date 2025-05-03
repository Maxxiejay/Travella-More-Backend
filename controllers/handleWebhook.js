const crypto = require('crypto');

exports.handleWebhook = async (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = req.body;
  
  if (event.event === 'charge.success') {
    const metadata = event.data.metadata;
    const reference = event.data.reference;
    
    if (metadata.type === 'package') {
      const pkg = await Package.findOne({ where: { id: metadata.packageId, paystackReference: reference } });
      
      if (pkg && pkg.status !== 'paid') {
        pkg.status = 'paid';
        await pkg.save();
        
        // If user is subscribed, update usage
        const user = await User.findByPk(pkg.userId);
        if (user.subscriptionStatus === 'active') {
          const subscription = await Subscription.findOne({ where: { userId: user.id } });
          if (subscription && subscription.packagesUsed < 15) {
            subscription.packagesUsed += 1;
            await subscription.save();
          }
        }
      }
    }
  }
  
  res.sendStatus(200);
};