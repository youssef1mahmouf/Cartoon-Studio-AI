# Running Cartoon Studio AI - npm start Guide

## Quick Start

Run `npm start` from the project root to start both frontend and backend concurrently.

## What `npm start` Does

The root `package.json` now includes a `start` script that runs:

```
npm run dev:frontend  →  Next.js on port 3002
npm run dev:backend   →  FastAPI on port 8001
```

Using `concurrently` to run both simultaneously.

## Ports Used

- **Frontend**: `http://localhost:3002` (Next.js development server)
- **Backend**: `http://localhost:8001` (FastAPI server)

## Important Notes

### 1. Both Servers Must Run Together
- `npm start` launches BOTH servers simultaneously
- The frontend will automatically connect to the backend
- **Don't run the backend separately** when using `npm start`

### 2. CORS Configuration
The backend CORS is configured for these origins:
- `http://localhost:3000` (default Next.js port)
- `http://localhost:3001` (alternative Next.js port)
- `http://localhost:3002` (this project's Next.js port)
- `http://127.0.0.1:3000/3002`

### 3. API Base URL
Frontend API client is configured at `/api/v1`, which maps to:
- `http://localhost:8001/api/v1/projects`
- `http://localhost:8001/api/v1/episodes`
- etc.

### 4. Environment Variables (Optional)
You can set `NEXT_PUBLIC_API_URL` to customize the API base:
```bash
set NEXT_PUBLIC_API_URL=http://localhost:8001
# Or on Linux/Mac:
export NEXT_PUBLIC_API_URL=http://localhost:8001
```

### 5. Database Requirements
The backend supports PostgreSQL + Redis (configure via `.env` file):
- `POSTGRES_SERVER` - default: localhost
- `POSTGRES_PORT` - default: 5432
- `POSTGRES_USER` - default: postgres
- `POSTGRES_DB` - default: cartoon_studio
- `REDIS_HOST` - default: localhost
- `REDIS_PORT` - default: 6379

**For development**, the API works without a database (returns 404 for data endpoints until DB is set up, but routes and CRUD structure is functional).

## Troubleshooting Network Error

### Problem: "Network Error" when accessing http://localhost:3002/projects

**Solution**: Ensure you're using `npm start` NOT running servers separately:

```bash
# 1. From project root
npm start

# 2. Wait for both servers to start (takes a few seconds)
# 3. Open http://localhost:3002 in your browser

# If you get Network Error:
# - Make sure npm start completed without errors
# - Check that both "frontend" and "backend" are starting
# - Look at the console output for any error messages
```

### Common Issues

**Issue 1: One server fails to start**
- Check the console output for specific error messages
- Ensure all dependencies are installed: `npm install`
- Ensure `concurrently` is available: `npm list concurrently`

**Issue 2: Frontend can't connect to backend**
- Verify both servers are running in the `npm start` output
- Check that CORS origins include `localhost:3002`
- Ensure no firewall is blocking the ports

**Issue 3: API returns 404 for projects**
- This is NORMAL without a database configured
- The routes exist and structure is correct
- Data endpoints need PostgreSQL setup via `.env` file

**Issue 4: TypeScript errors in frontend**
- Run `npm run build` to check for compile errors
- Ensure Node.js version is compatible (^20.0.0 specified in package.json)

## Project Structure Overview

```
Cartoon Studio AI/
├── package.json          ← Root config with npm start script
├── backend/              ← FastAPI application
│   ├── main.py           ← Entry point, CORS, routes
│   ├── core/config.py    ← Settings/configuration
│   ├── api/v1/endpoints.py ← API routes (projects, episodes, etc.)
│   └── database/Models.py ← SQLAlchemy ORM models
├── frontend/             ← Next.js application
│   ├── app/              ← Pages and components
│   ├── store/            ← Zustand state stores
│   ├── lib/api/          ← Axios API client
│   └── components/       ← UI components (Button with toast, etc.)
└── database/             ← SQLAlchemy base and migrations
```

## API Endpoints Available

After running `npm start`, these endpoints will be available:

**Backend (port 8001):**
- `GET /` - API information
- `GET /health` - Health check
- `GET/POST /api/v1/projects` - Project management
- `GET/POST /api/v1/episodes` - Episode management
- And more: scenes, characters, backgrounds, voices, assets, renders

**Frontend (port 3002):**
- Dashboard page with statistics
- Project creation/editing
- Episode management
- Pipeline visualization
- Asset generation

## Development Workflow

1. Run `npm start` to start both servers
2. Open http://localhost:3002 in your browser
3. Use the UI to create projects, episodes, etc.
4. Data flows: Frontend → API (/api/v1) → Backend → Database
5. Check console logs for any errors

## Stopping the Servers
Press `Ctrl+C` in the terminal where `npm start` is running to stop both servers.