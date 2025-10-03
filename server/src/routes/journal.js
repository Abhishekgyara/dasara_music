import express from 'express';
import dayjs from 'dayjs';
import { requireAuth } from '../middleware/auth.js';
import { JournalEntry } from '../models/JournalEntry.js';

const router = express.Router();

// Create or upsert
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { date, moodLabel, intensity, notes, tags } = req.body || {};
    if (!date || !moodLabel || intensity === undefined) return res.status(400).json({ success: false, message: 'date, moodLabel, intensity required' });
    const d = dayjs(date).startOf('day').toDate();
    const entry = await JournalEntry.findOneAndUpdate(
      { userId: req.user.id, date: d },
      { moodLabel, intensity, notes, tags },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(entry);
  } catch (e) { next(e); }
});

// Get by id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await JournalEntry.findById(req.params.id);
    if (!item || item.userId.toString() !== req.user.id) return res.status(404).json({ success: false, message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// List range
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const start = req.query.start ? dayjs(String(req.query.start)).startOf('day').toDate() : dayjs().subtract(30, 'day').startOf('day').toDate();
    const end = req.query.end ? dayjs(String(req.query.end)).endOf('day').toDate() : dayjs().endOf('day').toDate();
    const items = await JournalEntry.find({ userId: req.user.id, date: { $gte: start, $lte: end } }).sort({ date: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

// Calendar view (by month)
router.get('/month/:year/:month', requireAuth, async (req, res, next) => {
  try {
    const year = Number(req.params.year);
    const month = Number(req.params.month) - 1; // 0-based
    const start = dayjs().year(year).month(month).startOf('month').toDate();
    const end = dayjs().year(year).month(month).endOf('month').toDate();
    const items = await JournalEntry.find({ userId: req.user.id, date: { $gte: start, $lte: end } }).sort({ date: 1 });
    res.json(items);
  } catch (e) { next(e); }
});

export default router;


