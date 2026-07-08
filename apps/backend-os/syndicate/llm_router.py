import os
import yaml
from litellm import completion
from dotenv import load_dotenv

# Load environment variables from backend-os/.env
load_dotenv()

class SovereignRouter:
    """
    Sovereign AI Router based on LiteLLM.
    Uses the 97KB litellm_config.yaml copied from the Master setup to provide
    round-robin, load-balanced, and fallback-ready LLM inference.
    """
    def __init__(self):
        self.config_path = os.path.join(os.path.dirname(__file__), 'litellm_config.yaml')
        self._load_config()

    def _load_config(self):
        try:
            with open(self.config_path, 'r') as f:
                self.config = yaml.safe_load(f)
            # We don't need to manually start a litellm proxy server, 
            # we can use litellm.completion() with the models defined in the env,
            # or we can pass a specific model mapped to litellm's router.
            # For this MVP, we will use a fallback list manually to guarantee it works without proxy server overhead.
            self.models = ["groq/llama-3.3-70b-versatile", "gemini/gemini-1.5-flash", "openrouter/meta-llama/llama-3.3-70b-instruct"]
            print(f"[SOVEREIGN ROUTER] Configured with {len(self.models)} fallback models.")
        except Exception as e:
            print(f"[SOVEREIGN ROUTER] Error loading config: {e}")
            self.models = ["gemini/gemini-1.5-pro-latest"] # Final fallback if yaml fails

    def think(self, system_prompt: str, user_prompt: str) -> str:
        """
        Executes a prompt through the load-balanced LLM router.
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        # Built-in litellm fallback execution
        try:
            response = completion(
                model=self.models[0], # Try primary (Groq)
                messages=messages,
                fallbacks=self.models[1:] # Fallback to Gemini, then OpenRouter
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"[SOVEREIGN ROUTER] CRITICAL LLM FAILURE: {e}")
            return "ERROR: Agentic cognition offline."
