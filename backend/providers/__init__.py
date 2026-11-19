from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List, Optional


class TextProvider(ABC):
    """Abstract base class for text AI providers."""
    
    @abstractmethod
    async def generate_text(self, prompt: str, model: str = "") -> str:
        """Generate text response for a given prompt."""
        pass
    
    @abstractmethod
    async def analyze_script(self, script: str) -> dict:
        """Analyze a script and return structured insights."""
        pass
    
    @abstractmethod
    async def extract_scenes(self, script: str) -> List[dict]:
        """Extract scenes from a script."""
        pass
    
    @abstractmethod
    async def extract_characters(self, script: str) -> List[dict]:
        """Extract characters from a script."""
        pass


class ImageProvider(ABC):
    """Abstract base class for image AI providers."""
    
    @abstractmethod
    async def generate_image(self, prompt: str, model: str = "flux") -> bytes:
        """Generate an image from a prompt."""
        pass
    
    @abstractmethod
    async def generate_character_prompt(self, character_name: str, description: str) -> str:
        """Generate a character prompt for image generation."""
        pass
    
    @abstractmethod
    async def generate_background_prompt(self, background_name: str, description: str) -> str:
        """Generate a background prompt for image generation."""
        pass


class VoiceProvider(ABC):
    """Abstract base class for voice AI providers."""
    
    @abstractmethod
    async def generate_voice(self, text: str, voice_id: str = "") -> bytes:
        """Generate audio from text."""
        pass
    
    @abstractmethod
    async def get_voice_samples(self, character_name: str) -> List[bytes]:
        """Get voice samples for a character."""
        pass