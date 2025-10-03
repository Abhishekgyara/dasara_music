import mongoose from 'mongoose';
import { toJSON } from '../db/mongoose.js';

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    period: { type: String, enum: ['day', 'week', 'month'], required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    data: {},
  },
  { timestamps: true }
);

analyticsSnapshotSchema.index({ userId: 1, period: 1, startsAt: 1 }, { unique: true });
toJSON(analyticsSnapshotSchema);

export const AnalyticsSnapshot = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);


