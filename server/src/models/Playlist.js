import mongoose from 'mongoose';
import { toJSON } from '../db/mongoose.js';

const playlistItemSchema = new mongoose.Schema(
  {
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    order: { type: Number, default: 0 },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const playlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    name: { type: String, required: true },
    description: { type: String },
    moodLabel: { type: String },
    isPublic: { type: Boolean, default: false },
    items: [playlistItemSchema],
  },
  { timestamps: true }
);

toJSON(playlistSchema);

export const Playlist = mongoose.model('Playlist', playlistSchema);


