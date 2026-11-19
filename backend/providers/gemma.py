import aiohttp
import os
import json
from . import TextProvider


class GemmaProvider(TextProvider):
    """Gemma AI provider implementation.
    
    Supports: Google Gemma models
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or os.getenv("GEMMA_API_KEY", "")
        self.base_url = base_url or os.getenv("GEMMA_BASE_URL", "https://generativelanguage.googleapis.com")
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
                raise Exception(f"Gemma error {response.status}: {error_text}")
            return await response.json()
    
    async def generate_text(self, prompt: str, model: str = "gemma-7b") -> str:
        """Generate text using Gemma model."""
        full_url = f"{self.base_url}/v1beta/models/{model}:generateContent?key={self.api_key}"
        async with self.session.post(full_url, json=payload) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"Gemma error {response.status}: {error_text}")
            data = await response.json()
            if "candidates" in data and len(data["candidates"]) > 0:
                return data["candidates"][0]["content"]["parts"][0]["text"]
        raise Exception("No response from Gemma")
    
    async def analyze_script(self, script: str) -> dict:
        """Analyze script structure."""
        prompt = f"""Analyze this screenplay script. Return JSON with:
- genre
- target_audience
- act_structure
- character_count
- scene_count
- strengths
- weaknesses
- suggestions

Script:
{script}"""
        
        result = await self.generate_text(prompt)
        try:
            return json.loads(result)
        except:
            return {"raw_analysis": result}
    
    async def extract_scenes(self, script: str) -> List[dict]:
        """Extract scenes."""
        prompt = f"""Extract all scenes. Return JSON array with:
- scene_number
- location
- time_of_day
- description
- characters_present

Script:
{script}"""
        
        result = await self.generate_text(prompt)
        try:
            return json.loads(result)
        except:
            return []
    
    async def extract_characters(self, script: str) -> List[dict]:
        """Extract character names."""
        prompt = f"""Extract character names and descriptions. Return JSON array with:
- name
- role
- first_appearance

Script:
{script}"""
        
        result = await self.generate_text(prompt)
        try:
            return json.loads(result)
        except:
            return []
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()