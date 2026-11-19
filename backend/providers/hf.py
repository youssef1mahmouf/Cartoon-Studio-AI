import aiohttp
import os
import json
from . import ImageProvider


class HFProvider(ImageProvider):
    """HuggingFace AI provider backup implementation.
    
    Supports: FLUX, SDXL models as backup to Pollinations
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or os.getenv("HF_API_KEY", "")
        self.base_url = base_url or os.getenv("HF_BASE_URL", "https://api-inference.huggingface.co")
        self.session = None
    
    async def _get_session(self):
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def _request(self, endpoint: str, payload: dict) -> dict:
        session = await self._get_session()
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        url = f"{self.base_url}/{endpoint}"
        async with session.post(url, headers=headers, json=payload) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"HuggingFace error {response.status}: {error_text}")
            return await response.json()
    
    async def generate_image(self, prompt: str, model: str = "sdxl") -> bytes:
        """Generate image from prompt using HuggingFace."""
        endpoint = "/models/" + model
        payload = {
            "inputs": prompt,
        }
        response = await self._request(endpoint, payload)
        if "image" in response:
            import base64
            return base64.b64decode(response["image"])
        raise Exception("No image in HuggingFace response")
    
    async def generate_character_prompt(self, character_name: str, description: str) -> str:
        """Generate optimized character prompt."""
        return f"{character_name}, {description}, high quality, detailed, cinematic lighting"
    
    async def generate_background_prompt(self, background_name: str, description: str) -> str:
        """Generate optimized background prompt."""
        return f"{background_name}, {description}, detailed environment, concept art, high quality"
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()