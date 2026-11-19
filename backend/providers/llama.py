import aiohttp
import os
import json
from . import TextProvider


class LlamaProvider(TextProvider):
    """Llama AI provider implementation.
    
    Supports: Llama 3 and Llama 2 models
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or os.getenv("LLAMA_API_KEY", "")
        self.base_url = base_url or os.getenv("LLAMA_BASE_URL", "http://localhost:11434")
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
                raise Exception(f"Llama error {response.status}: {error_text}")
            return await response.json()
    
    async def generate_text(self, prompt: str, model: str = "llama3") -> str:
        """Generate text using Llama model via local Ollama."""
        endpoint = "api/chat"
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
        }
        response = await self._request(endpoint, payload)
        if "message" in response and "content" in response["message"]:
            return response["message"]["content"]
        raise Exception("No response from Llama")
    
    async def analyze_script(self, script: str) -> dict:
        """Analyze script structure."""
        prompt = f"""Analyze this screenplay script and return JSON with:
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
        prompt = f"""Extract all scenes from this script. Return JSON array with:
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