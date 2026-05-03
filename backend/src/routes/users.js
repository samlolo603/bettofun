const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Joi = require('joi');

const router = express.Router();

router.get('/me', auth, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) { next(err); }
});

const depositSchema = Joi.object({ amount: Joi.number().positive().required() });

// Simple deposit endpoint - only enabled in development via ENABLE_DEV_DEPOSIT=true
// In production, integrate with a PCI-compliant payment gateway (e.g. Stripe Checkout)
router.post('/deposit', auth, async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_DEV_DEPOSIT) {
      return res.status(501).json({ message: 'Deposit via API disabled in production. Use a payment gateway.' });
    }
    const { error } = depositSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { amount } = req.body;
    const user = await User.findById(req.user._id);
    user.balance += amount;
    await user.save();
    res.json({ balance: user.balance });
  } catch (err) { next(err); }
});

module.exports = router;
