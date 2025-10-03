import express from 'express';
import dayjs from 'dayjs';
import { requireAuth } from '../middleware/auth.js';
import { JournalEntry } from '../models/JournalEntry.js';
import { GameSession } from '../models/GameSession.js';
import { MoodDetection } from '../models/MoodDetection.js';

const router = express.Router();

router.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const [entries, games, moods] = await Promise.all([
      JournalEntry.countDocuments({ userId: req.user.id }),
      GameSession.countDocuments({ userId: req.user.id }),
      MoodDetection.countDocuments({ userId: req.user.id }),
    ]);

    const moodAvgAgg = await JournalEntry.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$moodLabel', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
    ]);

    res.json({
      totalJournalEntries: entries,
      totalGameSessions: games,
      totalMoodDetections: moods,
      moodDistribution: moodAvgAgg,
    });
  } catch (e) { next(e); }
});

router.get('/trends', requireAuth, async (req, res, next) => {
  try {
    const days = Math.min(Number(req.query.days || 30), 365);
    const start = dayjs().subtract(days, 'day').startOf('day').toDate();
    const trend = await JournalEntry.aggregate([
      { $match: { userId: req.user.id, date: { $gte: start } } },
      {
        $group: {
          _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } },
          avgIntensity: { $avg: '$intensity' },
          totalEntries: { $sum: 1 },
        },
      },
      { $sort: { '_id.d': 1 } },
    ]);
    res.json(trend.map((x) => ({ date: x._id.d, avg_intensity: x.avgIntensity, total_entries: x.totalEntries })));
  } catch (e) { next(e); }
});

export default router;


