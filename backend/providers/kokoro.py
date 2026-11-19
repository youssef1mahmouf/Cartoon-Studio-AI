import aiohttp
import os
import json
from . import VoiceProvider


class KokoroProvider(VoiceProvider):
    """Kokoro TTS provider implementation.
    
    Primary voice generation provider.
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or os.getenv("KOKORO_API_KEY", "")
        self.base_url = base_url or os.getenv("KOKORO_BASE_URL", "http://localhost:8880")
        self.session = None
        self.voices = {
            "male": "af_heart",
            "female": "am_michael",
            "child": "am_evening",
        }
    
    async def _get_session(self):
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def _request(self, endpoint: str, payload: dict = None) -> dict:
        session = await self._get_session()
        headers = {
            "Content-Type": "application/json",
        }
        url = f"{self.base_url}/{endpoint}"
        async with session.post(url, headers=headers, json=payload) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"Kokoro error {response.status}: {error_text}")
            return await response.json()
    
    async def generate_voice(self, text: str, voice_id: str = "") -> bytes:
        """Generate audio from text using Kokoro TTS."""
        vid = voice_id or self.voices["male"]
        endpoint = "/tts"
        payload = {
            "text": text,
            "voice": vid,
        }
        response = await self._request(endpoint, payload)
        if "audio" in response:
            import base64
            return base64.b64decode(response["audio"])
        raise Exception("No audio in Kokoro response")
    
    async def get_voice_samples(self, character_name: str) -> List[bytes]:
        """Get voice samples for character."""
        # Kokoro generates on-the-fly, return empty list or default sample
        return []
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()