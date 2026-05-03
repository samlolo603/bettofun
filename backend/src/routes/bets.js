const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const Bet = require('../models/Bet');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const placeSchema = Joi.object({ matchId: Joi.string().required(), stake: Joi.number().positive().required(), odds: Joi.number().positive().required(), market: Joi.string().optional() });

router.post('/', auth, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error } = placeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { matchId, stake, odds, market } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, balance: { $gte: stake } },
      { $inc: { balance: -stake } },
      { new: true, session }
    );
    if (!updatedUser) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const bet = new Bet({ user: updatedUser._id, matchId, stake, odds, potentialReturn: +(stake * odds).toFixed(2), market });
    await bet.save({ session });

    await session.commitTransaction();
    res.json({ bet });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

router.get('/history', auth, async (req, res, next) => {
  try {
    const bets = await Bet.find({ user: req.user._id }).sort({ placedAt: -1 });
    res.json({ bets });
  } catch (err) { next(err); }
});

module.exports = router;
