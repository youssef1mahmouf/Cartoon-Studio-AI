import aiohttp
import os
import json
from . import VoiceProvider


class PiperProvider(VoiceProvider):
    """Piper TTS provider implementation.
    
    Backup voice generation provider for Kokoro.
    """
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or os.getenv("PIPER_API_KEY", "")
        self.base_url = base_url or os.getenv("PIPER_BASE_URL", "http://localhost:50021")
        self.session = None
    
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
                raise Exception(f"Piper error {response.status}: {error_text}")
            return await response.json()
    
    async def generate_voice(self, text: str, voice_id: str = "") -> bytes:
        """Generate audio from text using Piper TTS."""
        endpoint = "/tts"
        payload = {
            "text": text,
            "voice": voice_id or "default",
        }
        response = await self._request(endpoint, payload)
        if "audio" in response:
            import base64
            return base64.b64decode(response["audio"])
        raise Exception("No audio in Piper response")
    
    async def get_voice_samples(self, character_name: str) -> List[bytes]:
        """Get voice samples for character."""
        # Piper generates on-the-fly, return empty list
        return []
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()