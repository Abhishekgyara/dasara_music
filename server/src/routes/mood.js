import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { ai } from '../services/ai/index.js';


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// Image (webcam snapshot)
router.post('/image', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'file required' });
    const result = await ai.face.analyzeImage(req.file.buffer);
    const saved = await MoodDetection.create({
      userId: req.user.id,
      detectionType: 'image',
      moodLabel: result.moodLabel,
      confidence: result.confidence,
      intensity: result.intensity,
      metadata: result.details,
    });
    res.json({ mood_label: result.moodLabel, confidence: result.confidence, intensity: result.intensity, detectionId: saved.id });
  } catch (e) {
    next(e);
  }
});

// Text sentiment
router.post('/text', requireAuth, async (req, res, next) => {
  try {
    const { text, intensity } = req.body || {};
    if (!text) return res.status(400).json({ success: false, message: 'text required' });
    const result = await ai.text.analyzeText(text, intensity);
    const saved = await MoodDetection.create({
      userId: req.user.id,
      detectionType: 'text',
      moodLabel: result.moodLabel,
      confidence: result.confidence,
      intensity: result.intensity,
      rawScore: result.rawScore,
      metadata: { textLength: text.length },
    });
    res.json({ mood_label: result.moodLabel, intensity: result.intensity, raw_score: result.rawScore, confidence: result.confidence, detectionId: saved.id });
  } catch (e) {
    next(e);
  }
});

// Audio
router.post('/audio', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'file required' });
    const result = await ai.audio.analyzeAudio(req.file.buffer);
    const saved = await MoodDetection.create({
      userId: req.user.id,
      detectionType: 'audio',
      moodLabel: result.moodLabel,
      confidence: result.confidence,
      intensity: result.intensity,
      rawScore: result.rawScore,
      metadata: result.features,
    });
    res.json({ mood_label: result.moodLabel, confidence: result.confidence, features: result.features, detectionId: saved.id });
  } catch (e) {
    next(e);
  }
});

// History
router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const items = await MoodDetection.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(limit);
    res.json(items);
  } catch (e) {
    next(e);
  }
});

export default router;


