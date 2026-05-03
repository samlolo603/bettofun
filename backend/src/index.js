const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const betRoutes = require('./routes/bets');
const oddsRoutes = require('./routes/odds');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, message: 'Too many attempts, please try again later' });
app.use('/api/auth', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/odds', oddsRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

let isConnected = false;

async function connectDB() {
  if (!isConnected && process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      isConnected = true;
    } catch (err) {
      console.error('MongoDB error:', err.message);
    }
  }
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

module.exports = app;
module.exports.handler = (req, res) => {
  app(req, res);
};