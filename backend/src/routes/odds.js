const express = require('express');
const axios = require('axios');
const router = express.Router();

// Simple proxy / stub to fetch odds from an external provider. In production, use rate-limiting, caching, and a secure API key.
router.get('/', async (req, res, next) => {
  try {
    // Example: fetch from configured API; here we simulate with static data
    // const resp = await axios.get(process.env.EXTERNAL_ODDS_API);
    const sample = [
      { matchId: 'm1', teams: 'Team A vs Team B', odds: 1.8, start: Date.now() + 3600000 },
      { matchId: 'm2', teams: 'Team C vs Team D', odds: 2.4, start: Date.now() + 7200000 }
    ];
    res.json({ data: sample });
  } catch (err) { next(err); }
});

module.exports = router;
