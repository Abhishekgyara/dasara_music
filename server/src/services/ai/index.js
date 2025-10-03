import { env } from '../../config/env.js';
import fetch from 'node-fetch';

// --- Label mappings ---
const faceLabelToMood = (label) => {
  const map = {
    happy: 'happy',
    happiness: 'happy',
    angry: 'angry',
    anger: 'angry',
    disgust: 'disgust',
    fear: 'fear',
    fearful: 'fear',
    surprise: 'surprise',
    surprised: 'surprise',
    sad: 'sad',
    sadness: 'sad',
    neutral: 'neutral',
    calm: 'calm',
    relaxed: 'relaxed',
  };
  return map[String(label).toLowerCase()] || 'neutral';
};

const goEmotionToMood = (label) => {
  const map = {
    joy: 'happy',
    optimism: 'happy',
    admiration: 'happy',
    approval: 'happy',
    gratitude: 'happy',
    amusement: 'happy',
    pride: 'happy',
    love: 'happy',
    relief: 'relaxed',
    anger: 'angry',
    annoyance: 'angry',
    disappointment: 'sad',
    sadness: 'sad',
    grief: 'sad',
    remorse: 'sad',
    embarrassment: 'sad',
    fear: 'anxious',
    anxiety: 'anxious',
    nervousness: 'anxious',
    disgust: 'disgust',
    surprise: 'surprise',
    curiosity: 'focused',
    realization: 'focused',
    confusion: 'neutral',
    neutral: 'neutral',
  };
  return map[String(label).toLowerCase()] || 'neutral';
};

// Helpers
async function hfRequest(modelId, input, isBinary = false) {
  if (!env.HF_API_TOKEN) throw new Error('HF_API_TOKEN not set');
  const url = `https://api-inference.huggingface.co/models/${modelId}`;
  const headers = {
    Authorization: `Bearer ${env.HF_API_TOKEN}`,
  };
  if (!isBinary) headers['Content-Type'] = 'application/json';
  const body = isBinary ? input : JSON.stringify(input);
  const resp = await fetch(url, { method: 'POST', headers, body });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HF error ${resp.status}: ${text}`);
  }
  const contentType = resp.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return resp.json();
  return resp.arrayBuffer();
}

// Pluggable adapters (mock or huggingface)
class FaceAdapter {
  async analyzeImage(buffer) {
    if (env.AI_FACE_ADAPTER === 'mock' || !env.HF_API_TOKEN) {
      return { moodLabel: 'neutral', confidence: 0.5, intensity: 5, details: {} };
    }
    // Use facial expression classifier
    const out = await hfRequest(env.HF_IMAGE_MODEL_ID, buffer, true);
    // Expect array of {label, score}
    let top = null;
    if (Array.isArray(out)) {
      top = out.reduce((a, b) => (b.score > (a?.score || 0) ? b : a), null);
    }
    const label = top?.label || 'neutral';
    const score = Number(top?.score || 0.5);
    const moodLabel = faceLabelToMood(label);
    const intensity = Math.min(10, Math.max(0, score * 10));
    return { moodLabel, confidence: score, intensity, details: { raw: out } };
  }
}

class TextAdapter {
  async analyzeText(text, intensity) {
    if (env.AI_TEXT_ADAPTER === 'mock' || !env.HF_API_TOKEN) {
      const base = text?.length ? Math.min(0.9, 0.3 + text.length / 200) : 0.5;
      return { moodLabel: 'neutral', confidence: base, intensity: intensity ?? 5, rawScore: base };
    }
    const out = await hfRequest(env.HF_TEXT_MODEL_ID, { inputs: text });
    // Handle both sentiment models and go-emotions (multi-label)
    let label = 'neutral';
    let score = 0.5;
    if (Array.isArray(out)) {
      // sentiment: [[{label, score}, ...]] or go-emotions: [{label, score}, ...]
      const arr = Array.isArray(out[0]) ? out[0] : out;
      const top = arr.reduce((a, b) => (b.score > (a?.score || 0) ? b : a), null);
      if (top) {
        label = String(top.label).toLowerCase();
        score = Number(top.score) || 0.5;
      }
    }
    const moodLabel = goEmotionToMood(label);
    const conf = score;
    const finalIntensity = intensity ?? (moodLabel === 'happy' ? conf * 8 + 2 : moodLabel === 'sad' ? (1 - conf) * 8 + 2 : 5);
    return { moodLabel, confidence: conf, intensity: finalIntensity, rawScore: conf };
  }
}

class AudioAdapter {
  async analyzeAudio(buffer) {
    if (env.AI_AUDIO_ADAPTER === 'mock' || !env.HF_API_TOKEN) {
      return { moodLabel: 'calm', confidence: 0.7, intensity: 7, features: {} };
    }
    // HF superb emotion recognition: input is binary audio
    const out = await hfRequest(env.HF_AUDIO_MODEL_ID, buffer, true);
    // Output format varies; try to map common patterns
    let label = 'neutral';
    let score = 0.6;
    if (Array.isArray(out) && out[0]?.label) {
      label = String(out[0].label).toLowerCase();
      score = Number(out[0].score) || 0.6;
    }
    const moodMap = { happy: 'happy', anger: 'angry', angry: 'angry', sad: 'sad', sadness: 'sad', fear: 'anxious', fearful: 'anxious', disgust: 'disgust', surprise: 'surprise', surprised: 'surprise', neutral: 'neutral', calm: 'calm' };
    const moodLabel = moodMap[label] || 'neutral';
    const intensity = Math.min(10, Math.max(0, score * 10));
    return { moodLabel, confidence: score, intensity, features: {} , rawScore: score };
  }
}

class RecommendationAdapter {
  async recommend({ moodLabel, history = [], limit = 20 }) {
    const genres = moodLabel === 'happy' ? ['pop'] : moodLabel === 'energetic' ? ['rock'] : moodLabel === 'sad' ? ['acoustic', 'indie'] : ['ambient'];
    return { genres, limit, seedHistory: history.slice(-20) };
  }

  async embed(text) {
    if (!env.HF_API_TOKEN) throw new Error('HF_API_TOKEN not set');
    const out = await hfRequest(env.HF_EMBED_MODEL_ID, { inputs: text });
    // Expect nested arrays; flatten first row
    const v = Array.isArray(out) ? (Array.isArray(out[0]) ? out[0] : out) : out;
    return Float32Array.from(v);
  }

  cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length && i < b.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
  }

  async rankSongs({ moodLabel, history, songs }) {
    if (env.AI_RECO_ADAPTER !== 'hf' || !env.HF_API_TOKEN) return songs; // no-op
    const userText = [
      `Current mood: ${moodLabel}.`,
      ...(history || []).slice(0, 10).map((h) => `Journal mood: ${h.moodLabel}, notes: ${h.notes || ''}`),
    ].join('\n');
    const userVec = await this.embed(userText);
    const scored = [];
    for (const s of songs) {
      const meta = `${s.title || ''} ${s.artist || ''} ${Array.isArray(s.genres) ? s.genres.join(' ') : ''} ${Array.isArray(s.moodTags) ? s.moodTags.join(' ') : ''}`;
      const v = await this.embed(meta);
      const score = this.cosine(userVec, v);
      scored.push({ s, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map((x) => x.s);
  }
}

export const ai = {
  face: new FaceAdapter(),
  text: new TextAdapter(),
  audio: new AudioAdapter(),
  reco: new RecommendationAdapter(),
};


