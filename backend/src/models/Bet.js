const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchId: { type: String, required: true },
  market: { type: String },
  stake: { type: Number, required: true },
  odds: { type: Number, required: true },
  potentialReturn: { type: Number },
  status: { type: String, enum: ['pending','won','lost','cancelled'], default: 'pending' },
  placedAt: { type: Date, default: Date.now },
  settledAt: { type: Date }
});

module.exports = mongoose.model('Bet', betSchema);
