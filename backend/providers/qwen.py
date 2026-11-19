import aiohttp
import os
import json
from . import TextProvider


class QwenProvider(TextProvider):
    """Qwen AI provider implementation.
    
    Supports: Qwen models for text generation
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or os.getenv("QWEN_API_KEY", "")
        self.base_url = base_url or os.getenv("QWEN_BASE_URL", "https://dashscope.aliyuncs.com")
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
                raise Exception(f"Qwen error {response.status}: {error_text}")
            return await response.json()
    
    async def generate_text(self, prompt: str, model: str = "qwen-turbo") -> str:
        """Generate text using Qwen model."""
        endpoint = "compatible-mode/v1/chat/completions"
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
        }
        response = await self._request(endpoint, payload)
        if "choices" in response and len(response["choices"]) > 0:
            return response["choices"][0]["message"]["content"]
        raise Exception("No response from Qwen")
    
    async def analyze_script(self, script: str) -> dict:
        """Analyze script structure."""
        prompt = f"""Analyze the following screenplay script. Return JSON with:
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
        """Extract scenes from script."""
        prompt = f"""Extract all scenes. Return JSON array with scene_number, location, time_of_day, description, characters_present.

Script:
{script}"""
        
        result = await self.generate_text(prompt)
        try:
            return json.loads(result)
        except:
            return []
    
    async def extract_characters(self, script: str) -> List[dict]:
        """Extract character names."""
        prompt = f"""Extract character names and descriptions. Return JSON array with name, role, first_appearance.

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