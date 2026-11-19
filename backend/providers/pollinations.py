import aiohttp
import os
import json
from . import ImageProvider


class PollinationsProvider(ImageProvider):
    """Pollinations AI provider implementation.
    
    Supports: FLUX, SDXL models for image generation
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or os.getenv("POLLINATIONS_API_KEY", "")
        self.base_url = base_url or os.getenv("POLLINATIONS_BASE_URL", "https://api.pollinations.ai")
        self.session = None
    
    async def _get_session(self):
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def _request(self, endpoint: str, payload: dict) -> dict:
        session = await self._get_session()
        headers = {
            "Content-Type": "application/json",
        }
        url = f"{self.base_url}/{endpoint}"
        async with session.post(url, headers=headers, json=payload) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"Pollinations error {response.status}: {error_text}")
            return await response.json()
    
    async def generate_image(self, prompt: str, model: str = "flux") -> bytes:
        """Generate image from prompt using Pollinations."""
        endpoint = "/v1/generate"
        payload = {
            "prompt": prompt,
            "model": model,
            "width": 1024,
            "height": 1024,
        }
        response = await self._request(endpoint, payload)
        if "image" in response:
            # Return base64 decoded image bytes
            import base64
            return base64.b64decode(response["image"])
        raise Exception("No image in Pollinations response")
    
    async def generate_character_prompt(self, character_name: str, description: str) -> str:
        """Generate optimized character prompt for image generation."""
        return f"{character_name}, {description}, high quality, detailed, cinematic lighting"
    
    async def generate_background_prompt(self, background_name: str, description: str) -> str:
        """Generate optimized background prompt for image generation."""
        return f"{background_name}, {description}, detailed environment, concept art, high quality"
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()