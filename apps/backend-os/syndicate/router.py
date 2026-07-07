import os
import itertools
import logging
from dotenv import load_dotenv

# We load the global .env and local .env
load_dotenv("../../.env")
load_dotenv("../../.env.local")

from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

logger = logging.getLogger(__name__)

class SovereignLLMRouter:
    def __init__(self):
        self.groq_keys = self._get_keys_by_prefix("GROQ_API_KEY")
        self.cerebras_keys = self._get_keys_by_prefix("CEREBRAS_API_KEY")
        self.gemini_keys = self._get_keys_by_prefix("GEMINI_API_KEY")
        self.openrouter_keys = self._get_keys_by_prefix("OPENROUTER_API_KEY")
        
        print(f"[Router] Booting Sovereign AI. Keys loaded: Groq({len(self.groq_keys)}), Cerebras({len(self.cerebras_keys)}), Gemini({len(self.gemini_keys)}), OpenRouter({len(self.openrouter_keys)})")

        self.groq_pool = [
            ChatGroq(api_key=k, model="llama3-70b-8192", temperature=0) for k in self.groq_keys
        ]
        
        self.cerebras_pool = [
            ChatOpenAI(api_key=k, base_url="https://api.cerebras.ai/v1", model="llama3.1-8b", temperature=0) for k in self.cerebras_keys
        ]
        
        self.gemini_pool = [
            ChatGoogleGenerativeAI(api_key=k, model="gemini-1.5-flash", temperature=0) for k in self.gemini_keys
        ]
        
        self.openrouter_pool = [
            ChatOpenAI(api_key=k, base_url="https://openrouter.ai/api/v1", model="openai/gpt-4o-mini", temperature=0) for k in self.openrouter_keys
        ]

        # Iterators for Round-Robin
        self.groq_iter = itertools.cycle(self.groq_pool) if self.groq_pool else None
        self.cerebras_iter = itertools.cycle(self.cerebras_pool) if self.cerebras_pool else None
        self.gemini_iter = itertools.cycle(self.gemini_pool) if self.gemini_pool else None
        self.openrouter_iter = itertools.cycle(self.openrouter_pool) if self.openrouter_pool else None

    def _get_keys_by_prefix(self, prefix: str):
        keys = []
        for key, value in os.environ.items():
            if key.startswith(prefix) and value.strip():
                keys.append(value.strip())
        # Deduplicate while preserving order
        return list(dict.fromkeys(keys))

    def get_llm(self):
        """
        Returns a dynamically assembled LLM with Round-Robin primary and massive fallbacks.
        Hierarchy: Groq -> Cerebras -> Gemini -> OpenRouter
        """
        fallbacks = []
        
        # Determine Primary LLM
        primary = None
        
        if self.groq_iter:
            primary = next(self.groq_iter)
        elif self.cerebras_iter:
            primary = next(self.cerebras_iter)
        elif self.gemini_iter:
            primary = next(self.gemini_iter)
        elif self.openrouter_iter:
            primary = next(self.openrouter_iter)
        else:
            raise ValueError("No API keys found for any provider. Sovereign AI cannot boot.")

        # Build Fallback Chain
        # Add next Groq keys
        for _ in range(max(0, len(self.groq_pool) - 1)):
            if self.groq_iter: fallbacks.append(next(self.groq_iter))
            
        # Add Cerebras keys
        for _ in range(len(self.cerebras_pool)):
            if self.cerebras_iter: fallbacks.append(next(self.cerebras_iter))

        # Add Gemini keys
        for _ in range(len(self.gemini_pool)):
            if self.gemini_iter: fallbacks.append(next(self.gemini_iter))

        # Add OpenRouter keys
        for _ in range(len(self.openrouter_pool)):
            if self.openrouter_iter: fallbacks.append(next(self.openrouter_iter))

        # Ensure we don't duplicate the primary in fallbacks
        if primary in fallbacks:
            fallbacks.remove(primary)

        if fallbacks:
            return primary.with_fallbacks(fallbacks)
        return primary

sovereign_router = SovereignLLMRouter()
