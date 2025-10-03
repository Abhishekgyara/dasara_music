import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import { connectMongo } from './db/mongoose.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

// Routes
import authRoutes from './routes/auth.js';
import songRoutes from './routes/songs.js';
import moodRoutes from './routes/mood.js';
import voiceRoutes from './routes/voice.js';
import recommendationRoutes from './routes/recommendations.js';
import journalRoutes from './routes/journal.js';
import gameRoutes from './routes/games.js';
import analyticsRoutes from './routes/analytics.js';
import playlistRoutes from './routes/playlists.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  await connectMongo();

  const app = express();

  // In index.js, update the CORS configuration:
// In index.js, update the CORS configuration to allow port 3001:
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3001',  // React app is on 3001
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

  app.disable('x-powered-by');
  app.use(helmet());

  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health and root
  app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'MelodyMind API', version: '1.0.0' });
  });
  app.get('/', (_req, res) => {
    res.json({ message: 'Welcome to MelodyMind API', version: '1.0.0' });
  });

  // API v1
  const api = express.Router();
  app.use('/api/v1', api);

  api.use('/auth', authRoutes);
  api.use('/songs', songRoutes);
  api.use('/mood', moodRoutes);
  api.use('/voice', voiceRoutes);
  api.use('/recommendations', recommendationRoutes);
  api.use('/journal', journalRoutes);
  api.use('/games', gameRoutes);
  api.use('/analytics', analyticsRoutes);
  api.use('/playlists', playlistRoutes);

  // 404 and error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`MelodyMind API listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', err);
  process.exit(1);
});


