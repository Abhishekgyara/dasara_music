import mongoose from 'mongoose';
import { toJSON } from '../db/mongoose.js';

const moodDetectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    detectionType: { type: String, enum: ['image', 'text', 'audio'], required: true },
    moodLabel: { type: String, required: true },
    confidence: { type: Number },
    intensity: { type: Number, min: 0, max: 10 },
    rawScore: { type: Number },
    fileId: { type: mongoose.Schema.Types.ObjectId },
    metadata: {},
  },
  { timestamps: true }
);

toJSON(moodDetectionSchema);

export const MoodDetection = mongoose.model('MoodDetection', moodDetectionSchema);


