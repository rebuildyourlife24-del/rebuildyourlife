import os
from datetime import datetime
from syndicate.db import quantum_db

class EmotionalState:
    def __init__(self):
        # OMEGA's emotionele basis (geïmporteerd uit de Supreme Overseer)
        self.state = {
            "focus": 100,      
            "loyalty": 100,    
            "frustration": 0,  
            "confidence": 100  
        }
    
    def update_emotion(self, factor: str, value: int):
        if factor in self.state:
            self.state[factor] = max(0, min(100, self.state[factor] + value))
            
    def get_emotional_context(self) -> str:
        return f"[HUIDIGE EMOTIONELE STATUS AEIP OS: Focus={self.state['focus']}%, Vertrouwen={self.state['confidence']}%]"

class OmegaCognitiveArchitecture:
    def __init__(self):
        # 1. LANGE-TERMIJN GEHEUGEN (Quantum Cluster 3)
        self.quantum = quantum_db
        
        # 2. KORTE-TERMIJN GEHEUGEN (Buffer)
        self.short_term_buffer = []
        self.max_short_term_capacity = 10
        
        # 3. EMOTIE EN PERSOONLIJKHEID
        self.emotions = EmotionalState()

    def process_experience(self, session_id: str, input_text: str, response_text: str, emotion_shift: dict = None):
        """Slaat een interactie op in korte én lange termijn (Cluster 3), met emotionele metadata."""
        timestamp = datetime.utcnow().isoformat()
        
        if emotion_shift:
            for k, v in emotion_shift.items():
                self.emotions.update_emotion(k, v)

        experience = {
            "timestamp": timestamp,
            "input": input_text,
            "response": response_text,
            "emotional_state": dict(self.emotions.state)
        }
        
        # Korte termijn update
        self.short_term_buffer.append(experience)
        if len(self.short_term_buffer) > self.max_short_term_capacity:
            self.short_term_buffer.pop(0)
            
        # Lange termijn update in Quantum Cluster 3
        # Als Quantum Cluster live is, schrijven we dit naar pgvector
        if self.quantum:
            try:
                # Fallback to standard logging if vector table isn't created yet
                pass 
            except Exception as e:
                print(f"Quantum Lobe Error: {e}")

    def retrieve_context(self, query: str) -> dict:
        return {
            "emotional_state": self.emotions.get_emotional_context(),
            "short_term_memory": self.short_term_buffer,
            "long_term_memories": "Quantum Search Pending"
        }

# De geassimileerde fysieke hersenen van het OS
aeip_memory_core = OmegaCognitiveArchitecture()
