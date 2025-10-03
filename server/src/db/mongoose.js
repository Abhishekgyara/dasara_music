import mongoose from 'mongoose';
import { env } from '../config/env.js';

mongoose.set('strictQuery', true);

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: true,
    maxPoolSize: 10,
  });
}

export function toJSON(schema) {
  schema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
      // normalize id
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
}


