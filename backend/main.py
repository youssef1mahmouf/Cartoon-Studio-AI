from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize database
from database import init_db

app = FastAPI(
    title="Cartoon Studio AI Backend",
    description="AI-powered cartoon production studio backend",
    version="0.1.0",
)

# Initialize database tables on startup
init_db()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 routes
from backend.api.v1.endpoints import router

app.include_router(
    router,
    prefix="/api",
)

@app.get("/")
async def root():
    return {
        "message": "Cartoon Studio AI API",
        "version": "0.1.0",
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }