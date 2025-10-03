# MelodyMind Backend (Node.js + Express + MongoDB)

## Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)

## Setup
1. cd MelodyMind/server
2. Create a .env file with the variables below
3. npm install
4. npm run dev

Server: http://localhost:8000 (health: /health)

## .env (example)
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/melodymind
JWT_SECRET=change-me-in-prod
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
MAX_FILE_SIZE_MB=15

## API base
/api/v1

## Endpoints
- Auth: POST /auth/signup, POST /auth/login
- Songs: POST /songs/upload (multipart file), GET /songs, GET /songs/stream/:id
- Mood: POST /mood/image (multipart), POST /mood/text (json), POST /mood/audio (multipart), GET /mood/history
- Recommendations: GET /recommendations?mood=calm, POST /recommendations/playlists
- Playlists: POST /playlists, GET /playlists/:id, PUT /playlists/:id, DELETE /playlists/:id, POST /playlists/:id/items, GET /playlists/:id/items, POST /playlists/generate
- Journal: POST /journal, GET /journal, GET /journal/:id, GET /journal/month/:year/:month
- Games: POST /games/record, GET /games/user/me, GET /games/stats
- Analytics: GET /analytics/summary, GET /analytics/trends?days=30

Use Authorization: Bearer <token> for protected routes.

## AI adapters
Pluggable under src/services/ai. Replace methods to integrate real providers.
