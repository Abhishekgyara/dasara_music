import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { ai } from '../services/ai/index.js';
import { env } from '../config/env.js';
import { Song } from '../models/Song.js';
import { JournalEntry } from '../models/JournalEntry.js';

const router = express.Router();

// Mood-based recommendations
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const moodLabel = (req.query.mood || 'neutral').toString();
    const history = await JournalEntry.find({ userId: req.user.id }).sort({ date: -1 }).limit(50);
    const reco = await ai.reco.recommend({ moodLabel, history, limit: 25 });
    // naive filter by mood tags or genres
    const songs = await Song.find({
      $or: [{ moodTags: moodLabel }, { genres: { $in: reco.genres } }],
    })
      .limit(reco.limit)
      .sort({ createdAt: -1 });
    const ranked = env.AI_RECO_ADAPTER === 'hf' && env.HF_API_TOKEN
      ? await ai.reco.rankSongs({ moodLabel, history, songs })
      : songs;
    res.json({ success: true, moodLabel, items: ranked });
  } catch (e) {
    next(e);
  }
});

// Create a smart playlist from mood
router.post('/playlists', requireAuth, async (req, res, next) => {
  try {
    // Delegate to playlists route in real-world; just return reco list here
    const moodLabel = (req.body?.moodLabel || 'neutral').toString();
    const reco = await ai.reco.recommend({ moodLabel, history: [], limit: 20 });
    const songs = await Song.find({ $or: [{ moodTags: moodLabel }, { genres: { $in: reco.genres } }] }).limit(reco.limit);
    res.status(201).json({ success: true, items: songs, moodLabel });
  } catch (e) { next(e); }
});

export default router;


