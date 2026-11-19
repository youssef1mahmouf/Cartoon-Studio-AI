import aiohttp
import os
import json
from . import TextProvider


class DeepSeekProvider(TextProvider):
    """DeepSeek AI provider implementation.
    
    Supports: DeepSeek V3 and DeepSeek R1 models
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or os.getenv("DEEPSEEK_API_KEY", "")
        self.base_url = base_url or os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
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
                raise Exception(f"DeepSeek error {response.status}: {error_text}")
            return await response.json()
    
    async def generate_text(self, prompt: str, model: str = "deepseek-v3") -> str:
        """Generate text using DeepSeek model."""
        endpoint = "v1/chat/completions"
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
        }
        response = await self._request(endpoint, payload)
        if "choices" in response and len(response["choices"]) > 0:
            return response["choices"][0]["message"]["content"]
        raise Exception("No response from DeepSeek")
    
    async def analyze_script(self, script: str) -> dict:
        """Analyze script structure and provide insights."""
        prompt = f"""Analyze the following screenplay script. Provide analysis in JSON format with:
1. genre
2. target_audience
3. act_structure (list of acts with titles)
4. character_count (integer)
5. scene_count (integer)
6. strengths (list)
7. weaknesses (list)
8. suggestions (list)

Script:
{script}"""
        
        result = await self.generate_text(prompt)
        try:
            return json.loads(result)
        except:
            return {"raw_analysis": result}
    
    async def extract_scenes(self, script: str) -> List[dict]:
        """Extract scenes from script."""
        prompt = f"""Extract all scenes from this screenplay script. Return JSON array with:
- scene_number: scene heading (INT./EXT.)
- location: scene location
- time_of_day: TIME OF DAY
- description: brief action description
- characters_present: list of character names

Script:
{script}"""
        
        result = await self.generate_text(prompt)
        try:
            return json.loads(result)
        except:
            return []
    
    async def extract_characters(self, script: str) -> List[dict]:
        """Extract character names and descriptions."""
        prompt = f"""Extract all character names and brief descriptions from this screenplay script.

Return JSON array with:
- name: character name
- role: role/description
- first_appearance: estimated first scene

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