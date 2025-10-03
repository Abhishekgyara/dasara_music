import mongoose from 'mongoose';
import { toJSON } from '../db/mongoose.js';

const gameSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    gameSlug: { type: String, required: true },
    durationSec: { type: Number, required: true },
    preMood: { type: String },
    postMood: { type: String },
    score: { type: Number },
    notes: { type: String },
    metadata: {},
  },
  { timestamps: true }
);

toJSON(gameSessionSchema);

export const GameSession = mongoose.model('GameSession', gameSessionSchema);


