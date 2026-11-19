from . import TextProvider, ImageProvider, VoiceProvider
from .openrouter import OpenRouterProvider
from .deepseek import DeepSeekProvider
from .qwen import QwenProvider
from .llama import LlamaProvider
from .gemma import GemmaProvider
from .pollinations import PollinationsProvider
from .hf import HFProvider
from .kokoro import KokoroProvider
from .piper import PiperProvider


class ProviderFactory:
    """Factory class to create and manage AI provider instances.

    Implements the Adapter Pattern to ensure loose coupling between
    the application and AI provider implementations.
    """

    @staticmethod
    def create_text_provider(provider_name: str = "openrouter", **kwargs) -> TextProvider:
        """Create a text AI provider instance."""
        providers = {
            "openrouter": OpenRouterProvider,
            "deepseek": DeepSeekProvider,
            "qwen": QwenProvider,
            "llama": LlamaProvider,
            "gemma": GemmaProvider,
        }
        provider_class = providers.get(provider_name.lower())
        if not provider_class:
            raise ValueError(f"Unknown text provider: {provider_name}")
        return provider_class(**kwargs)

    @staticmethod
    def create_image_provider(provider_name: str = "pollinations", **kwargs) -> ImageProvider:
        """Create an image AI provider instance."""
        providers = {
            "pollinations": PollinationsProvider,
            "hf": HFProvider,
        }
        provider_class = providers.get(provider_name.lower())
        if not provider_class:
            raise ValueError(f"Unknown image provider: {provider_name}")
        return provider_class(**kwargs)

    @staticmethod
    def create_voice_provider(provider_name: str = "kokoro", **kwargs) -> VoiceProvider:
        """Create a voice AI provider instance."""
        providers = {
            "kokoro": KokoroProvider,
            "piper": PiperProvider,
        }
        provider_class = providers.get(provider_name.lower())
        if not provider_class:
            raise ValueError(f"Unknown voice provider: {provider_name}")
        return provider_class(**kwargs)

    @staticmethod
    def get_available_text_providers() -> list:
        return ["openrouter", "deepseek", "qwen", "llama", "gemma"]

    @staticmethod
    def get_available_image_providers() -> list:
        return ["pollinations", "hf"]

    @staticmethod
    def get_available_voice_providers() -> list:
        return ["kokoro", "piper"]