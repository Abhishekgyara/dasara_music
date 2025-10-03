import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { ai } from '../services/ai/index.js';

const router = express.Router();

function parseCommand(text) {
  const t = String(text || '').trim().toLowerCase();
  if (!t) return { action: null };

  // Basic verb commands
  if (/(^|\s)(pause|hold|wait|stop playing)(\s|$)/.test(t)) return { action: 'pause' };
  if (/(^|\s)(resume|continue|play)(\s|$)/.test(t)) return { action: 'resume' };
  if (/(^|\s)(next|skip)(\s|$)/.test(t)) return { action: 'next' };
  if (/(^|\s)(previous|back|prev)(\s|$)/.test(t)) return { action: 'previous' };
  if (/(^|\s)(stop)(\s|$)/.test(t)) return { action: 'stop' };
  if (/volume up|turn it up|louder/.test(t)) return { action: 'volume_up' };
  if (/volume down|turn it down|softer|quieter/.test(t)) return { action: 'volume_down' };

  // Play specific
  const playMatch = t.match(/play\s+(.*)/);
  if (playMatch) {
    const query = playMatch[1].trim();
    return { action: 'play', parameters: { query } };
  }

  return { action: null };
}

// Normalize a mood from free text using AI text analyzer
async function detectMoodFromText(text) {
  const res = await ai.text.analyzeText(text);
  return {
    mood_label: res.moodLabel,
    intensity: res.intensity,
    confidence: res.confidence,
    raw_score: res.rawScore,
  };
}

// POST /voice/command -> parse a command string and optionally a mood
router.post('/command', requireAuth, async (req, res, next) => {
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ success: false, message: 'text required' });
    const command = parseCommand(text);
    const mood = await detectMoodFromText(text);
    res.json({ success: true, command, mood });
  } catch (e) { next(e); }
});

// POST /voice/analyze -> analyze transcript for mood and commands (alias)
router.post('/analyze', requireAuth, async (req, res, next) => {
  try {
    const { transcript } = req.body || {};
    if (!transcript) return res.status(400).json({ success: false, message: 'transcript required' });
    const command = parseCommand(transcript);
    const mood = await detectMoodFromText(transcript);
    res.json({ success: true, command, mood });
  } catch (e) { next(e); }
});

export default router;


