from abc import ABC, abstractmethod
from typing import Dict, Any, List
import logging
from dataclasses import dataclass
from uuid import UUID
import sys
import os

# Ensure the syndicate module is available
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from syndicate.llm_router import SovereignRouter
except ImportError:
    SovereignRouter = None

# Setup structured logging for agents according to Master Constitution
logger = logging.getLogger("syndicate.agents")

@dataclass
class AgentResult:
    status: str  # "SUCCESS", "FAILED", "PENDING_APPROVAL"
    data: Dict[str, Any]
    metrics: Dict[str, Any]  # Telemetry data

class BaseAgent(ABC):
    """
    Abstract Base Class for all 18 Syndicate AI Council members.
    Enforces the Engineering Constitution:
    - Every feature must be modular.
    - Every feature must be replaceable.
    - Every feature must be observable (logging/metrics).
    """
    
    def __init__(self, name: str, role: str, system_prompt: str = ""):
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        if SovereignRouter:
            self.llm = SovereignRouter()
        else:
            self.llm = None
        logger.info(f"Instantiated Council Member: {self.name} ({self.role})")

    async def think(self, user_prompt: str) -> str:
        """
        Uses the SovereignRouter to generate a response via Groq/Gemini/OpenRouter.
        """
        if not self.llm:
            return "[SYSTEM] LLM Router is Offline."
        self.log_action("THINKING", {"prompt": user_prompt})
        response = self.llm.think(self.system_prompt, user_prompt)
        self.log_action("THOUGHT_COMPLETE", {"response_length": len(response)})
        return response

    @abstractmethod
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        """
        Core execution loop for the agent.
        Must be implemented by every council member.
        """
        pass

    def log_action(self, action: str, details: Dict[str, Any]):
        """Standardized audit trail for all agent actions."""
        logger.info(f"[{self.name}] ACTION: {action}", extra={"details": details})
        
    def request_approval(self, action: str, details: Dict[str, Any]) -> AgentResult:
        """
        Governance Plane: Triggered when an agent needs HITL approval before committing.
        Enforces UPCP (The Forge) 5 Laws before proposing.
        """
        from syndicate.upcp import UPCPEngine
        if not UPCPEngine.validate(self.name, action, details):
            self.log_action(f"UPCP_FORGE_REJECTED", {"action": action, "reason": "Failed 5 Laws of Creation"})
            return AgentResult(
                status="FAILED",
                data={"error": "UPCP Validation Failed: The Forge rejected the proposal."},
                metrics={"upcp_blocked": True}
            )

        self.log_action(f"REQUESTED_APPROVAL for {action}", details)
        return AgentResult(
            status="PENDING_APPROVAL",
            data={"action": action, "details": details},
            metrics={"approval_required": True, "upcp_passed": True}
        )
