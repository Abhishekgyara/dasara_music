import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { GameSession } from '../models/GameSession.js';

const router = express.Router();

router.post('/record', requireAuth, async (req, res, next) => {
  try {
    const { gameSlug, durationSec, preMood, postMood, score, notes, metadata } = req.body || {};
    if (!gameSlug || !durationSec) return res.status(400).json({ success: false, message: 'gameSlug and durationSec required' });
    const session = await GameSession.create({ userId: req.user.id, gameSlug, durationSec, preMood, postMood, score, notes, metadata });
    res.status(201).json(session);
  } catch (e) { next(e); }
});

router.get('/user/me', requireAuth, async (req, res, next) => {
  try {
    const items = await GameSession.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (e) { next(e); }
});

router.get('/stats', requireAuth, async (req, res, next) => {
  try {
    const agg = await GameSession.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$gameSlug',
          totalSessions: { $sum: 1 },
          totalDuration: { $sum: '$durationSec' },
          avgScore: { $avg: '$score' },
        },
      },
      { $sort: { totalDuration: -1 } },
    ]);
    res.json({ byGame: agg });
  } catch (e) { next(e); }
});

export default router;


