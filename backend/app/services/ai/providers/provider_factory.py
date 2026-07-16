from typing import Dict, Any
from app.services.ai.interfaces import AIProvider
from app.services.ai.providers.mock_provider import MockAIProvider

# In a real scenario, you'd import OpenAIProvider, etc. here once implemented.

class ProviderFactory:
    @staticmethod
    def get_provider(provider_name: str, api_key: str, model: str, config: Dict[str, Any] = None) -> AIProvider:
        provider_name = provider_name.lower()
        
        if provider_name == "mock":
            return MockAIProvider(api_key, model, config)
        elif provider_name == "openai":
            # return OpenAIProvider(api_key, model, config)
            return MockAIProvider(api_key, model, config) # Fallback to mock for now
        elif provider_name == "gemini":
            # return GeminiProvider(api_key, model, config)
            return MockAIProvider(api_key, model, config)
        elif provider_name == "claude":
            # return ClaudeProvider(api_key, model, config)
            return MockAIProvider(api_key, model, config)
        elif provider_name == "ollama":
            # return OllamaProvider(api_key, model, config)
            return MockAIProvider(api_key, model, config)
        else:
            raise ValueError(f"Unknown AI Provider: {provider_name}")
