const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();

const registerSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().min(8).required(), name: Joi.string().max(100) });
const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

function formatUser(user) {
  return { id: user._id, email: user.email, name: user.name, balance: user.balance, avatar: user.avatar };
}

router.post('/register', async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { email, password, name } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 12);
    user = new User({ email, password: hash, name });
    await user.save();
    const token = generateToken(user);
    res.json({ token, user: formatUser(user) });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: formatUser(user) });
  } catch (err) { next(err); }
});

router.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ message: 'GitHub OAuth not configured' });
  }
  const redirectUri = req.query.redirect_uri || process.env.FRONTEND_URL;
  const scope = 'read:user user:email';
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  res.redirect(githubAuthUrl);
});

router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'No code provided' });

    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, { headers: { Accept: 'application/json' } });

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.status(400).json({ message: 'Failed to get access token' });

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const emailRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const email = emailRes.data.find(e => e.primary)?.email || emailRes.data[0]?.email;
    const githubId = String(userRes.data.id);
    const name = userRes.data.login;
    const avatar = userRes.data.avatar_url;

    let user = await User.findOne({ githubId });
    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        user.githubId = githubId;
        user.avatar = avatar;
        await user.save();
      }
    }

    if (!user) {
      user = new User({
        email: email || `${githubId}@github.local`,
        name,
        githubId,
        avatar,
        password: 'oauth'
      });
      await user.save();
    }

    const token = generateToken(user);
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}&user=${encodeURIComponent(JSON.stringify(formatUser(user)))}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('GitHub OAuth error:', err.message);
    res.redirect(`${process.env.FRONTEND_URL}?error=github_auth_failed`);
  }
});

router.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ message: 'Google OAuth not configured' });
  }
  const redirectUri = req.query.redirect_uri || process.env.FRONTEND_URL;
  const scope = 'profile email';
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`;
  res.redirect(googleAuthUrl);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'No code provided' });

    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.FRONTEND_URL
    });

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const googleId = String(userRes.data.id);
    const email = userRes.data.email;
    const name = userRes.data.name;
    const avatar = userRes.data.picture;

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.avatar = avatar;
        await user.save();
      }
    }

    if (!user) {
      user = new User({
        email,
        name,
        googleId,
        avatar,
        password: 'oauth'
      });
      await user.save();
    }

    const token = generateToken(user);
    const redirectUrl = `${process.env.FRONTEND_URL}?token=${token}&user=${encodeURIComponent(JSON.stringify(formatUser(user)))}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('Google OAuth error:', err.message);
    res.redirect(`${process.env.FRONTEND_URL}?error=google_auth_failed`);
  }
});

module.exports = router;