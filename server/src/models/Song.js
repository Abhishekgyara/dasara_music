import mongoose from 'mongoose';
import { toJSON } from '../db/mongoose.js';

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String },
    album: { type: String },
    duration: { type: Number },
    genres: [String],
    moodTags: [String],
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files', index: true },
    coverUrl: { type: String },
  },
  { timestamps: true }
);

toJSON(songSchema);

export const Song = mongoose.model('Song', songSchema);


