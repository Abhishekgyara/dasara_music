import mongoose from 'mongoose';
import { toJSON } from '../db/mongoose.js';

const journalEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    date: { type: Date, required: true, index: true },
    moodLabel: { type: String, required: true },
    intensity: { type: Number, min: 0, max: 10, required: true },
    notes: { type: String },
    tags: [String],
  },
  { timestamps: true }
);

journalEntrySchema.index({ userId: 1, date: 1 }, { unique: true });
toJSON(journalEntrySchema);

export const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);


