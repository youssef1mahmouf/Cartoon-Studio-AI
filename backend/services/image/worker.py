import asyncio
from typing import Dict, Any, List, Optional


class ImageGenerationWorker:
    """Worker for generating character and background images."""
    
    def __init__(self, provider="pollinations"):
        self.provider = provider
        self.initialized = False