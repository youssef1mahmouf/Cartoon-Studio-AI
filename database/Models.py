from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    Text,
    ForeignKey,
    Table,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from .base import Base


# Association table for many-to-many Episode-Character relationship
episode_character = Table(
    'episode_character',
    Base.metadata,
    Column('episode_id', String, ForeignKey('episodes.id'), primary_key=True),
    Column('character_id', String, ForeignKey('characters.id'), primary_key=True),
)

# Association table for many-to-many Episode-Background relationship
episode_background = Table(
    'episode_background',
    Base.metadata,
    Column('episode_id', String, ForeignKey('episodes.id'), primary_key=True),
    Column('background_id', String, ForeignKey('backgrounds.id'), primary_key=True),
)

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    episodes = relationship("Episode", back_populates="project", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name={self.name})>"


class Episode(Base):
    __tablename__ = "episodes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    script = Column(Text, nullable=True)
    status = Column(
        String,
        default="pending",
        nullable=False,
    )
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    project = relationship("Project", back_populates="episodes")
    scenes = relationship("Scene", back_populates="episode", cascade="all, delete-orphan")
    renders = relationship("Render", back_populates="episode", cascade="all, delete-orphan")
    scripts = relationship("Script", back_populates="episode", cascade="all, delete-orphan")
    pipeline_jobs = relationship(
        "PipelineJob", back_populates="episode", cascade="all, delete-orphan"
    )
    characters = relationship(
        "Character", secondary=episode_character, back_populates="episodes"
    )
    backgrounds = relationship(
        "Background", secondary=episode_background, back_populates="episodes"
    )

    def __repr__(self) -> str:
        return f"<Episode(id={self.id}, title={self.title})>"


class Scene(Base):
    __tablename__ = "scenes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    episode_id = Column(String, ForeignKey("episodes.id"), nullable=False)
    scene_number = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    image_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    episode = relationship("Episode", back_populates="scenes")

    def __repr__(self) -> str:
        return f"<Scene(id={self.id}, episode_id={self.episode_id}, number={self.scene_number})>"


class Character(Base):
    __tablename__ = "characters"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    prompt = Column(Text, nullable=True)
    image_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    project = relationship("Project")
    episodes = relationship(
        "Episode", secondary=episode_character, back_populates="characters"
    )
    voices = relationship("Voice", back_populates="character", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Character(id={self.id}, name={self.name})>"


class Background(Base):
    __tablename__ = "backgrounds"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    prompt = Column(Text, nullable=True)
    image_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    project = relationship("Project")
    episodes = relationship(
        "Episode", secondary=episode_background, back_populates="backgrounds"
    )

    def __repr__(self) -> str:
        return f"<Background(id={self.id}, project_id={self.project_id})>"


class Voice(Base):
    __tablename__ = "voices"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    character_id = Column(String, ForeignKey("characters.id"), nullable=False)
    voice_provider = Column(String, nullable=False)  # "kokoro" or "piper"
    audio_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    character = relationship("Character", back_populates="voices")

    def __repr__(self) -> str:
        return f"<Voice(id={self.id}, character_id={self.character_id})>"


class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String, nullable=False)  # "character", "background", "voice", "effect", "music"
    path = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    def __repr__(self) -> str:
        return f"<Asset(id={self.id}, type={self.type})>"


class Render(Base):
    __tablename__ = "renders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    episode_id = Column(String, ForeignKey("episodes.id"), nullable=False)
    path = Column(String, nullable=False)
    status = Column(
        String,
        default="pending",
        nullable=False,
    )
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    episode = relationship("Episode", back_populates="renders")

    def __repr__(self) -> str:
        return f"<Render(id={self.id}, episode_id={self.episode_id}, status={self.status})>"


class Script(Base):
    __tablename__ = "scripts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    episode_id = Column(String, ForeignKey("episodes.id"), nullable=False)
    content = Column(Text, nullable=True)
    version = Column(Integer, default=1, nullable=False)
    status = Column(
        String,
        default="pending",
        nullable=False,
    )
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    episode = relationship("Episode", back_populates="scripts")

    def __repr__(self) -> str:
        return f"<Script(id={self.id}, episode_id={self.episode_id}, version={self.version})>"


class PipelineStep(Base):
    __tablename__ = "pipeline_steps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    pipeline_job_id = Column(
        String, ForeignKey("pipeline_jobs.id"), nullable=False
    )
    name = Column(String, nullable=False)
    status = Column(
        String,
        default="pending",
        nullable=False,
    )
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    pipeline_job = relationship("PipelineJob", back_populates="steps")

    def __repr__(self) -> str:
        return f"<PipelineStep(id={self.id}, name={self.name}, status={self.status})>"


class PipelineJob(Base):
    __tablename__ = "pipeline_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    episode_id = Column(String, ForeignKey("episodes.id"), nullable=False)
    status = Column(
        String,
        default="pending",
        nullable=False,
    )
    current_step = Column(String, nullable=True)
    progress = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    episode = relationship("Episode", back_populates="pipeline_jobs")
    steps = relationship(
        "PipelineStep", back_populates="pipeline_job", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<PipelineJob(id={self.id}, episode_id={self.episode_id}, status={self.status})>"
