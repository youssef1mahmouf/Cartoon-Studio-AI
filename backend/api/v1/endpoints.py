from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from database.__init__ import get_db, SessionLocal
from database.Models import (
    Project,
    Episode,
    Scene,
    Character,
    Background,
    Voice,
    Asset,
    Render,
    Script,
    PipelineJob,
    PipelineStep,
)

router = APIRouter(prefix="/v1", tags=["v1"])


# Request body models
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class EpisodeCreate(BaseModel):
    project_id: str
    title: str
    script: Optional[str] = None



@router.get("/projects", response_model=List[dict])
async def get_projects(db: Session = Depends(get_db)):
    """Get all projects."""
    projects = db.query(Project).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
        }
        for p in projects
    ]


@router.post("/projects", response_model=dict)
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
):
    """Create a new project."""
    # Check if project already exists
    existing = db.query(Project).filter(Project.name == project_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Project name already exists")
    
    project = Project(name=project_data.name, description=project_data.description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
    }


@router.get("/projects/{project_id}", response_model=dict)
async def get_project(project_id: str, db: Session = Depends(get_db)):
    """Get a specific project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
    }


@router.get("/episodes", response_model=List[dict])
async def get_episodes(db: Session = Depends(get_db)):
    """Get all episodes."""
    episodes = db.query(Episode).all()
    return [
        {
            "id": e.id,
            "project_id": e.project_id,
            "title": e.title,
            "script": e.script,
            "status": e.status,
            "created_at": e.created_at,
            "updated_at": e.updated_at,
        }
        for e in episodes
    ]


@router.post("/episodes", response_model=dict)
async def create_episode(
    episode_data: EpisodeCreate,
    db: Session = Depends(get_db),
):
    """Create a new episode."""
    # Check if project exists
    project = db.query(Project).filter(Project.id == episode_data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    episode = Episode(project_id=episode_data.project_id, title=episode_data.title, script=episode_data.script)
    db.add(episode)
    db.commit()
    db.refresh(episode)
    return {
        "id": episode.id,
        "project_id": episode.project_id,
        "title": episode.title,
        "script": episode.script,
        "status": episode.status,
        "created_at": episode.created_at,
        "updated_at": episode.updated_at,
    }


@router.get("/episodes/{episode_id}", response_model=dict)
async def get_episode(episode_id: str, db: Session = Depends(get_db)):
    """Get a specific episode."""
    episode = db.query(Episode).filter(Episode.id == episode_id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    return {
        "id": episode.id,
        "project_id": episode.project_id,
        "title": episode.title,
        "script": episode.script,
        "status": episode.status,
        "created_at": episode.created_at,
        "updated_at": episode.updated_at,
    }


@router.get("/scenes", response_model=List[dict])
async def get_scenes(db: Session = Depends(get_db)):
    """Get all scenes."""
    scenes = db.query(Scene).all()
    return [
        {
            "id": s.id,
            "episode_id": s.episode_id,
            "scene_number": s.scene_number,
            "description": s.description,
            "image_path": s.image_path,
            "created_at": s.created_at,
        }
        for s in scenes
    ]


@router.post("/scenes", response_model=dict)
async def create_scene(
    episode_id: str,
    scene_number: int,
    description: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Create a new scene."""
    # Check if episode exists
    episode = db.query(Episode).filter(Episode.id == episode_id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    # Check if scene number already exists for this episode
    existing = db.query(Scene).filter(
        Scene.episode_id == episode_id, Scene.scene_number == scene_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Scene number already exists")
    
    scene = Scene(
        episode_id=episode_id,
        scene_number=scene_number,
        description=description,
    )
    db.add(scene)
    db.commit()
    db.refresh(scene)
    return {
        "id": scene.id,
        "episode_id": scene.episode_id,
        "scene_number": scene.scene_number,
        "description": scene.description,
        "image_path": scene.image_path,
        "created_at": scene.created_at,
    }


@router.get("/characters", response_model=List[dict])
async def get_characters(db: Session = Depends(get_db)):
    """Get all characters."""
    characters = db.query(Character).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "project_id": c.project_id,
            "prompt": c.prompt,
            "image_path": c.image_path,
            "created_at": c.created_at,
        }
        for c in characters
    ]


@router.post("/characters", response_model=dict)
async def create_character(
    name: str,
    project_id: str,
    prompt: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Create a new character."""
    # Check if project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if character name already exists in project
    existing = db.query(Character).filter(
        Character.name == name, Character.project_id == project_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Character name already exists in project")
    
    character = Character(
        name=name,
        project_id=project_id,
        prompt=prompt,
    )
    db.add(character)
    db.commit()
    db.refresh(character)
    return {
        "id": character.id,
        "name": character.name,
        "project_id": character.project_id,
        "prompt": character.prompt,
        "image_path": character.image_path,
        "created_at": character.created_at,
    }


@router.get("/backgrounds", response_model=List[dict])
async def get_backgrounds(db: Session = Depends(get_db)):
    """Get all backgrounds."""
    backgrounds = db.query(Background).all()
    return [
        {
            "id": b.id,
            "project_id": b.project_id,
            "prompt": b.prompt,
            "image_path": b.image_path,
            "created_at": b.created_at,
        }
        for b in backgrounds
    ]


@router.post("/backgrounds", response_model=dict)
async def create_background(
    project_id: str,
    prompt: str,
    db: Session = Depends(get_db),
):
    """Create a new background."""
    # Check if project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    background = Background(
        project_id=project_id,
        prompt=prompt,
    )
    db.add(background)
    db.commit()
    db.refresh(background)
    return {
        "id": background.id,
        "project_id": background.project_id,
        "prompt": background.prompt,
        "image_path": background.image_path,
        "created_at": background.created_at,
    }


@router.get("/voices", response_model=List[dict])
async def get_voices(db: Session = Depends(get_db)):
    """Get all voices."""
    voices = db.query(Voice).all()
    return [
        {
            "id": v.id,
            "character_id": v.character_id,
            "voice_provider": v.voice_provider,
            "audio_path": v.audio_path,
            "created_at": v.created_at,
        }
        for v in voices
    ]


@router.post("/voices", response_model=dict)
async def create_voice(
    character_id: str,
    voice_provider: str,
    db: Session = Depends(get_db),
):
    """Create a new voice."""
    # Check if character exists
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    
    voice = Voice(
        character_id=character_id,
        voice_provider=voice_provider,
        audio_path=f"/assets/voices/{character_id}.wav",
    )
    db.add(voice)
    db.commit()
    db.refresh(voice)
    return {
        "id": voice.id,
        "character_id": voice.character_id,
        "voice_provider": voice.voice_provider,
        "audio_path": voice.audio_path,
        "created_at": voice.created_at,
    }


@router.get("/assets", response_model=List[dict])
async def get_assets(db: Session = Depends(get_db)):
    """Get all assets."""
    assets = db.query(Asset).all()
    return [
        {
            "id": a.id,
            "type": a.type,
            "path": a.path,
            "created_at": a.created_at,
        }
        for a in assets
    ]


@router.post("/assets", response_model=dict)
async def create_asset(
    type: str,
    path: str,
    db: Session = Depends(get_db),
):
    """Create a new asset."""
    asset = Asset(type=type, path=path)
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return {
        "id": asset.id,
        "type": asset.type,
        "path": asset.path,
        "created_at": asset.created_at,
    }


@router.get("/renders", response_model=List[dict])
async def get_renders(db: Session = Depends(get_db)):
    """Get all renders."""
    renders = db.query(Render).all()
    return [
        {
            "id": r.id,
            "episode_id": r.episode_id,
            "path": r.path,
            "status": r.status,
            "created_at": r.created_at,
            "updated_at": r.updated_at,
        }
        for r in renders
    ]


@router.post("/renders", response_model=dict)
async def create_render(
    episode_id: str,
    status: str = "pending",
    db: Session = Depends(get_db),
):
    """Create a new render."""
    # Check if episode exists
    episode = db.query(Episode).filter(Episode.id == episode_id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    # Check if render already exists for this episode
    existing = db.query(Render).filter(Render.episode_id == episode_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Render already exists for this episode")
    
    render = Render(episode_id=episode_id, status=status)
    db.add(render)
    db.commit()
    db.refresh(render)
    return {
        "id": render.id,
        "episode_id": render.episode_id,
        "path": render.path,
        "status": render.status,
        "created_at": render.created_at,
        "updated_at": render.updated_at,
    }


@router.get("/renders/{episode_id}", response_model=dict)
async def get_render(episode_id: str, db: Session = Depends(get_db)):
    """Get render for a specific episode."""
    render = db.query(Render).filter(Render.episode_id == episode_id).first()
    if not render:
        raise HTTPException(status_code=404, detail="Render not found for episode")
    return {
        "id": render.id,
        "episode_id": render.episode_id,
        "path": render.path,
        "status": render.status,
        "created_at": render.created_at,
        "updated_at": render.updated_at,
    }


@router.put("/projects/{project_id}", response_model=dict)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
):
    """Update a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project_data.name is not None:
        project.name = project_data.name
    if project_data.description is not None:
        project.description = project_data.description
    db.commit()
    db.refresh(project)
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
    }


@router.delete("/projects/{project_id}", response_model=dict)
async def delete_project(project_id: str, db: Session = Depends(get_db)):
    """Delete a project and all its episodes."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"id": project_id, "detail": "Project deleted"}


@router.patch("/episodes/{episode_id}", response_model=dict)
async def update_episode(
    episode_id: str,
    title: Optional[str] = None,
    script: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Update an episode."""
    episode = db.query(Episode).filter(Episode.id == episode_id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    if title is not None:
        episode.title = title
    if script is not None:
        episode.script = script
    if status is not None:
        episode.status = status
    db.commit()
    db.refresh(episode)
    return {
        "id": episode.id,
        "project_id": episode.project_id,
        "title": episode.title,
        "script": episode.script,
        "status": episode.status,
        "created_at": episode.created_at,
        "updated_at": episode.updated_at,
    }


@router.delete("/episodes/{episode_id}", response_model=dict)
async def delete_episode(episode_id: str, db: Session = Depends(get_db)):
    """Delete an episode."""
    episode = db.query(Episode).filter(Episode.id == episode_id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    db.delete(episode)
    db.commit()
    return {"id": episode_id, "detail": "Episode deleted"}


@router.get("/scripts/{episode_id}", response_model=dict)
async def get_script_by_episode(episode_id: str, db: Session = Depends(get_db)):
    """Get the script for a specific episode."""
    script = db.query(Script).filter(Script.episode_id == episode_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found for episode")
    return {
        "id": script.id,
        "episode_id": script.episode_id,
        "content": script.content,
        "version": script.version,
        "status": script.status,
        "created_at": script.created_at,
        "updated_at": script.updated_at,
    }


@router.get("/scripts", response_model=List[dict])
async def get_scripts(
    episode_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get all scripts, optionally filtered by episode."""
    query = db.query(Script)
    if episode_id:
        query = query.filter(Script.episode_id == episode_id)
    scripts = query.all()
    return [
        {
            "id": s.id,
            "episode_id": s.episode_id,
            "content": s.content,
            "version": s.version,
            "status": s.status,
            "created_at": s.created_at,
            "updated_at": s.updated_at,
        }
        for s in scripts
    ]


@router.post("/scripts", response_model=dict)
async def create_script(
    episode_id: str,
    content: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Create a new script for an episode."""
    episode = db.query(Episode).filter(Episode.id == episode_id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    existing = db.query(Script).filter(Script.episode_id == episode_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Script already exists for episode")
    script = Script(episode_id=episode_id, content=content)
    db.add(script)
    db.commit()
    db.refresh(script)
    return {
        "id": script.id,
        "episode_id": script.episode_id,
        "content": script.content,
        "version": script.version,
        "status": script.status,
        "created_at": script.created_at,
        "updated_at": script.updated_at,
    }


@router.patch("/scripts/{episode_id}", response_model=dict)
async def update_script(
    episode_id: str,
    content: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Update a script."""
    script = db.query(Script).filter(Script.episode_id == episode_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found for episode")
    if content is not None:
        script.content = content
        script.version = (script.version or 1) + 1
    if status is not None:
        script.status = status
    db.commit()
    db.refresh(script)
    return {
        "id": script.id,
        "episode_id": script.episode_id,
        "content": script.content,
        "version": script.version,
        "status": script.status,
        "created_at": script.created_at,
        "updated_at": script.updated_at,
    }


@router.post("/scripts/{episode_id}/analyze", response_model=dict)
async def analyze_script(
    episode_id: str,
    db: Session = Depends(get_db),
):
    """Analyze a script and mark it as analyzing."""
    script = db.query(Script).filter(Script.episode_id == episode_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found for episode")
    script.status = "analyzing"
    db.commit()
    db.refresh(script)
    return {
        "ok": True,
        "episode_id": episode_id,
        "status": script.status,
    }


@router.delete("/scripts/{episode_id}", response_model=dict)
async def delete_script(episode_id: str, db: Session = Depends(get_db)):
    """Delete a script."""
    script = db.query(Script).filter(Script.episode_id == episode_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found for episode")
    db.delete(script)
    db.commit()
    return {"episode_id": episode_id, "detail": "Script deleted"}


@router.get("/scenes/{scene_id}", response_model=dict)
async def get_scene(scene_id: str, db: Session = Depends(get_db)):
    """Get a specific scene."""
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    return {
        "id": scene.id,
        "episode_id": scene.episode_id,
        "scene_number": scene.scene_number,
        "description": scene.description,
        "image_path": scene.image_path,
        "created_at": scene.created_at,
    }


@router.patch("/scenes/{scene_id}", response_model=dict)
async def update_scene(
    scene_id: str,
    scene_number: Optional[int] = None,
    description: Optional[str] = None,
    image_path: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Update a scene."""
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    if scene_number is not None:
        scene.scene_number = scene_number
    if description is not None:
        scene.description = description
    if image_path is not None:
        scene.image_path = image_path
    if status is not None:
        scene.status = status  # type: ignore[assignment]
    db.commit()
    db.refresh(scene)
    return {
        "id": scene.id,
        "episode_id": scene.episode_id,
        "scene_number": scene.scene_number,
        "description": scene.description,
        "image_path": scene.image_path,
        "created_at": scene.created_at,
    }


@router.delete("/scenes/{scene_id}", response_model=dict)
async def delete_scene(scene_id: str, db: Session = Depends(get_db)):
    """Delete a scene."""
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    db.delete(scene)
    db.commit()
    return {"id": scene_id, "detail": "Scene deleted"}


@router.get("/characters/{character_id}", response_model=dict)
async def get_character(character_id: str, db: Session = Depends(get_db)):
    """Get a specific character."""
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return {
        "id": character.id,
        "name": character.name,
        "project_id": character.project_id,
        "prompt": character.prompt,
        "image_path": character.image_path,
        "created_at": character.created_at,
    }


@router.patch("/characters/{character_id}", response_model=dict)
async def update_character(
    character_id: str,
    name: Optional[str] = None,
    project_id: Optional[str] = None,
    prompt: Optional[str] = None,
    image_path: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Update a character."""
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    if name is not None:
        character.name = name
    if project_id is not None:
        character.project_id = project_id
    if prompt is not None:
        character.prompt = prompt
    if image_path is not None:
        character.image_path = image_path
    if status is not None:
        character.status = status  # type: ignore[assignment]
    db.commit()
    db.refresh(character)
    return {
        "id": character.id,
        "name": character.name,
        "project_id": character.project_id,
        "prompt": character.prompt,
        "image_path": character.image_path,
        "created_at": character.created_at,
    }


@router.delete("/characters/{character_id}", response_model=dict)
async def delete_character(character_id: str, db: Session = Depends(get_db)):
    """Delete a character."""
    character = db.query(Character).filter(Character.id == character_id).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    db.delete(character)
    db.commit()
    return {"id": character_id, "detail": "Character deleted"}


@router.get("/backgrounds/{background_id}", response_model=dict)
async def get_background(background_id: str, db: Session = Depends(get_db)):
    """Get a specific background."""
    background = (
        db.query(Background).filter(Background.id == background_id).first()
    )
    if not background:
        raise HTTPException(status_code=404, detail="Background not found")
    return {
        "id": background.id,
        "project_id": background.project_id,
        "prompt": background.prompt,
        "image_path": background.image_path,
        "created_at": background.created_at,
    }


@router.patch("/backgrounds/{background_id}", response_model=dict)
async def update_background(
    background_id: str,
    prompt: Optional[str] = None,
    image_path: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Update a background."""
    background = (
        db.query(Background).filter(Background.id == background_id).first()
    )
    if not background:
        raise HTTPException(status_code=404, detail="Background not found")
    if prompt is not None:
        background.prompt = prompt
    if image_path is not None:
        background.image_path = image_path
    if status is not None:
        background.status = status  # type: ignore[assignment]
    db.commit()
    db.refresh(background)
    return {
        "id": background.id,
        "project_id": background.project_id,
        "prompt": background.prompt,
        "image_path": background.image_path,
        "created_at": background.created_at,
    }


@router.delete("/backgrounds/{background_id}", response_model=dict)
async def delete_background(background_id: str, db: Session = Depends(get_db)):
    """Delete a background."""
    background = (
        db.query(Background).filter(Background.id == background_id).first()
    )
    if not background:
        raise HTTPException(status_code=404, detail="Background not found")
    db.delete(background)
    db.commit()
    return {"id": background_id, "detail": "Background deleted"}


@router.get("/voices/{voice_id}", response_model=dict)
async def get_voice(voice_id: str, db: Session = Depends(get_db)):
    """Get a specific voice."""
    voice = db.query(Voice).filter(Voice.id == voice_id).first()
    if not voice:
        raise HTTPException(status_code=404, detail="Voice not found")
    return {
        "id": voice.id,
        "character_id": voice.character_id,
        "voice_provider": voice.voice_provider,
        "audio_path": voice.audio_path,
        "created_at": voice.created_at,
    }


@router.patch("/voices/{voice_id}", response_model=dict)
async def update_voice(
    voice_id: str,
    voice_provider: Optional[str] = None,
    audio_path: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Update a voice."""
    voice = db.query(Voice).filter(Voice.id == voice_id).first()
    if not voice:
        raise HTTPException(status_code=404, detail="Voice not found")
    if voice_provider is not None:
        voice.voice_provider = voice_provider
    if audio_path is not None:
        voice.audio_path = audio_path
    if status is not None:
        voice.status = status  # type: ignore[assignment]
    db.commit()
    db.refresh(voice)
    return {
        "id": voice.id,
        "character_id": voice.character_id,
        "voice_provider": voice.voice_provider,
        "audio_path": voice.audio_path,
        "created_at": voice.created_at,
    }


@router.delete("/voices/{voice_id}", response_model=dict)
async def delete_voice(voice_id: str, db: Session = Depends(get_db)):
    """Delete a voice."""
    voice = db.query(Voice).filter(Voice.id == voice_id).first()
    if not voice:
        raise HTTPException(status_code=404, detail="Voice not found")
    db.delete(voice)
    db.commit()
    return {"id": voice_id, "detail": "Voice deleted"}


@router.patch("/renders/{render_id}", response_model=dict)
async def update_render(
    render_id: str,
    path: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Update a render job."""
    render = db.query(Render).filter(Render.id == render_id).first()
    if not render:
        raise HTTPException(status_code=404, detail="Render not found")
    if path is not None:
        render.path = path
    if status is not None:
        render.status = status
    db.commit()
    db.refresh(render)
    return {
        "id": render.id,
        "episode_id": render.episode_id,
        "path": render.path,
        "status": render.status,
        "created_at": render.created_at,
        "updated_at": render.updated_at,
    }


@router.delete("/renders/{render_id}", response_model=dict)
async def delete_render(render_id: str, db: Session = Depends(get_db)):
    """Delete a render job."""
    render = db.query(Render).filter(Render.id == render_id).first()
    if not render:
        raise HTTPException(status_code=404, detail="Render not found")
    db.delete(render)
    db.commit()
    return {"id": render_id, "detail": "Render deleted"}


@router.get("/pipeline/jobs", response_model=List[dict])
async def get_pipeline_jobs(
    episode_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get all pipeline jobs, optionally filtered by episode."""
    query = db.query(PipelineJob)
    if episode_id:
        query = query.filter(PipelineJob.episode_id == episode_id)
    jobs = query.all()
    return [
        {
            "id": j.id,
            "episode_id": j.episode_id,
            "status": j.status,
            "current_step": j.current_step,
            "steps": [
                {
                    "id": s.id,
                    "name": s.name,
                    "status": s.status,
                    "started_at": s.started_at,
                    "completed_at": s.completed_at,
                    "error": s.error,
                }
                for s in j.steps
            ],
            "progress": j.progress,
            "created_at": j.created_at,
            "updated_at": j.updated_at,
        }
        for j in jobs
    ]


@router.get("/pipeline/jobs/{job_id}", response_model=dict)
async def get_pipeline_job(job_id: str, db: Session = Depends(get_db)):
    """Get a specific pipeline job."""
    job = db.query(PipelineJob).filter(PipelineJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Pipeline job not found")
    return {
        "id": job.id,
        "episode_id": job.episode_id,
        "status": job.status,
        "current_step": job.current_step,
        "steps": [
            {
                "id": s.id,
                "name": s.name,
                "status": s.status,
                "started_at": s.started_at,
                "completed_at": s.completed_at,
                "error": s.error,
            }
            for s in job.steps
        ],
        "progress": job.progress,
        "created_at": job.created_at,
        "updated_at": job.updated_at,
    }


@router.post("/pipeline/jobs", response_model=dict)
async def create_pipeline_job(
    episode_id: str,
    db: Session = Depends(get_db),
):
    """Create a new pipeline job for an episode."""
    episode = db.query(Episode).filter(Episode.id == episode_id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    existing = (
        db.query(PipelineJob).filter(PipelineJob.episode_id == episode_id).first()
    )
    if existing:
        raise HTTPException(
            status_code=400, detail="Pipeline job already exists for episode"
        )
    job = PipelineJob(episode_id=episode_id, status="pending", progress=0)
    db.add(job)
    db.commit()
    db.refresh(job)
    default_steps = [
        "Script Analysis",
        "Scene Extraction",
        "Character Generation",
        "Background Generation",
        "Voice Generation",
        "Render Assembly",
    ]
    for step_name in default_steps:
        step = PipelineStep(
            pipeline_job_id=job.id,
            name=step_name,
            status="pending",
        )
        db.add(step)
    db.commit()
    db.refresh(job)
    return {
        "id": job.id,
        "episode_id": job.episode_id,
        "status": job.status,
        "current_step": job.current_step,
        "steps": [
            {
                "id": s.id,
                "name": s.name,
                "status": s.status,
                "started_at": s.started_at,
                "completed_at": s.completed_at,
                "error": s.error,
            }
            for s in job.steps
        ],
        "progress": job.progress,
        "created_at": job.created_at,
        "updated_at": job.updated_at,
    }


@router.patch("/pipeline/jobs/{job_id}", response_model=dict)
async def update_pipeline_job(
    job_id: str,
    status: Optional[str] = None,
    current_step: Optional[str] = None,
    progress: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """Update a pipeline job."""
    job = db.query(PipelineJob).filter(PipelineJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Pipeline job not found")
    if status is not None:
        job.status = status
    if current_step is not None:
        job.current_step = current_step
    if progress is not None:
        job.progress = progress
    db.commit()
    db.refresh(job)
    return {
        "id": job.id,
        "episode_id": job.episode_id,
        "status": job.status,
        "current_step": job.current_step,
        "steps": [
            {
                "id": s.id,
                "name": s.name,
                "status": s.status,
                "started_at": s.started_at,
                "completed_at": s.completed_at,
                "error": s.error,
            }
            for s in job.steps
        ],
        "progress": job.progress,
        "created_at": job.created_at,
        "updated_at": job.updated_at,
    }


@router.get("/pipeline/status/{job_id}", response_model=dict)
async def get_pipeline_status(job_id: str, db: Session = Depends(get_db)):
    """Get the status of a pipeline job."""
    job = db.query(PipelineJob).filter(PipelineJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Pipeline job not found")
    return {
        "id": job.id,
        "episode_id": job.episode_id,
        "status": job.status,
        "current_step": job.current_step,
        "progress": job.progress,
        "created_at": job.created_at,
        "updated_at": job.updated_at,
    }


@router.post("/pipeline/cancel/{job_id}", response_model=dict)
async def cancel_pipeline_job(job_id: str, db: Session = Depends(get_db)):
    """Cancel a pipeline job."""
    job = db.query(PipelineJob).filter(PipelineJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Pipeline job not found")
    job.status = "failed"
    db.commit()
    db.refresh(job)
    return {
        "id": job.id,
        "episode_id": job.episode_id,
        "status": job.status,
        "detail": "Pipeline job cancelled",
    }
