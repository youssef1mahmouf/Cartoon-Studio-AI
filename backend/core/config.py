from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cartoon Studio AI"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = "cartoon_studio"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # OpenRouter
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    
    # Pollinations
    POLLINATIONS_API_KEY: str = ""
    
    # HuggingFace
    HF_API_KEY: str = ""
    
    # TTS
    KOKORO_API_KEY: str = ""
    PIPIR_API_KEY: str = ""
    
    # FFmpeg
    FFMPEG_PATH: str = "ffmpeg"
    
    # Storage
    LOCAL_STORAGE_PATH: str = "./storage"
    S3_ENDPOINT: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET: str = ""

    class Config:
        env_file = ".env"

settings = Settings()