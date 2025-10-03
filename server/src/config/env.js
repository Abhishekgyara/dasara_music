export const env = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/melodymind',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3001',
  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB || 15),
  AI_FACE_ADAPTER: process.env.AI_FACE_ADAPTER || 'mock',
  AI_TEXT_ADAPTER: process.env.AI_TEXT_ADAPTER || 'mock',
  AI_AUDIO_ADAPTER: process.env.AI_AUDIO_ADAPTER || 'mock',
  AI_RECO_ADAPTER: process.env.AI_RECO_ADAPTER || 'mock',
  // Hugging Face
  HF_API_TOKEN: process.env.HF_API_TOKEN || '',
  HF_IMAGE_MODEL_ID: process.env.HF_IMAGE_MODEL_ID || 'trpakov/vit-face-expression',
  HF_TEXT_MODEL_ID: process.env.HF_TEXT_MODEL_ID || 'joeddav/distilbert-base-uncased-go-emotions-student',
  HF_AUDIO_MODEL_ID: process.env.HF_AUDIO_MODEL_ID || 'ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition',
  HF_EMBED_MODEL_ID: process.env.HF_EMBED_MODEL_ID || 'sentence-transformers/all-MiniLM-L6-v2',
};


