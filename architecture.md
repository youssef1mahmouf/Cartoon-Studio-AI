## API Routes

All routes are versioned under `/api/v1/`:

### Projects

- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/{id}` - Get project

### Episodes

- `GET /api/v1/episodes` - List episodes
- `POST /api/v1/episodes` - Create episode
- `GET /api/v1/episodes/{id}` - Get episode

### Scenes

- `GET /api/v1/scenes` - List scenes
- `POST /api/v1/scenes` - Create scene
- `GET /api/v1/scenes/{episode_id}` - Get episode scenes

### Characters

- `GET /api/v1/characters` - List characters
- `POST /api/v1/characters` - Create character
- `GET /api/v1/characters/{episode_id}` - Get episode characters

### Backgrounds

- `GET /api/v1/backgrounds` - List backgrounds
- `POST /api/v1/backgrounds` - Create background

### Voices

- `GET /api/v1/voices` - List voices
- `POST /api/v1/voices` - Create voice

### Assets

- `GET /api/v1/assets` - List assets
- `POST /api/v1/assets` - Create asset

### Renders

- `GET /api/v1/renders` - List renders
- `POST /api/v1/renders` - Create render
- `GET /api/v1/renders/{episode_id}` - Get episode render

## Database

SQLite V1, PostgreSQL V2 ready

## Adapters

Text: OpenRouter providers
Image: Pollinations + HuggingFace backup
Voice: Kokoro + Piper backup

## Environment

Backend: .env with DB and API keys
Frontend: .env with Next.js config

## Clean Architecture Overview

Cartoon Studio AI follows Clean Architecture principles with modular, scalable layers.
