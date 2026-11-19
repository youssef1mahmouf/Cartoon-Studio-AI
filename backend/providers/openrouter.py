import aiohttp
import os
import json
from . import TextProvider, ImageProvider, VoiceProvider


class OpenRouterProvider(TextProvider):
    """OpenRouter AI provider implementation.
    
    Supports: DeepSeek V3, DeepSeek R1, Qwen, Llama, Gemma models
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.base_url = base_url or os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
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
                raise Exception(f"OpenRouter error {response.status}: {error_text}")
            return await response.json()
    
    async def generate_text(self, prompt: str, model: str = "deepseek-v3") -> str:
        """Generate text using specified model."""
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
        }
        response = await self._request("chat", payload)
        if "choices" in response and len(response["choices"]) > 0:
            return response["choices"][0]["message"]["content"]
        raise Exception("No response from OpenRouter")
    
    async def analyze_script(self, script: str) -> dict:
        """Analyze script structure, tone, pacing, and suggest improvements."""
        prompt = f"""Analyze the following screenplay script. Provide a comprehensive analysis including:
1. Genre and target audience
2. Act structure breakdown
3. Character count and arcs
4. Scene count and pacing
5. Strengths and weaknesses
6. Suggestions for improvement

Script:
{script}

Return analysis as JSON with keys: genre, target_audience, act_structure, character_count, scene_count, strengths, weaknesses, suggestions."""
        
        result = await self.generate_text(prompt)
        try:
            return json.loads(result)
        except:
            return {"raw_analysis": result}
    
    async def extract_scenes(self, script: str) -> List[dict]:
        """Extract scene headings, action, and descriptions from script."""
        prompt = f"""Extract all scenes from this screenplay script. For each scene, provide:
1. Scene number/heading (INT./EXT.)
2. Location
3. Time of day
4. Brief description of action
5. Characters present

Return as JSON array where each object has: scene_number, location, time_of_day, description, characters_present.

Script:
{script}"""
        
        result = await self.generate_text(prompt)
        try:
            return json.loads(result)
        except:
            return []
    
    async def extract_characters(self, script: str) -> List[dict]:
        """Extract character names and descriptions from script."""
        prompt = f"""Extract all character names and brief descriptions from this screenplay script.

For each character, provide:
1. Character name
2. Role/description
3. Screen time estimate
4. First appearance scene

Return as JSON array. Script:
{script}"""
        
        result = await self.generate_text(prompt)
        try:
            return json.loads(result)
        except:
            return []
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()