import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from .base import Base

# Import all models so they are registered with Base.metadata
from . import Models  # noqa: F401

# SQLite for development
SQLITE_DATABASE_URL = os.getenv(
    "DATABASE_URL", "sqlite:///./database/carton_studio.db"
)

# PostgreSQL URL from environment
POSTGRES_DATABASE_URL = os.getenv(
    "POSTGRES_URL", "postgresql://postgres:postgres@localhost:5432/cartoon_studio"
)

engine = create_engine(
    SQLITE_DATABASE_URL if "sqlite" in SQLITE_DATABASE_URL else POSTGRES_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLITE_DATABASE_URL else {},
    echo=False,
)

SessionLocal = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)


def init_db():
    """Initialize the database, creating all tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()