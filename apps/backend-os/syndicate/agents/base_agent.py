from abc import ABC, abstractmethod
from typing import Dict, Any, List
import logging
from dataclasses import dataclass
from uuid import UUID

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
    
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        logger.info(f"Instantiated Council Member: {self.name} ({self.role})")

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
        """
        self.log_action(f"REQUESTED_APPROVAL for {action}", details)
        return AgentResult(
            status="PENDING_APPROVAL",
            data={"action": action, "details": details},
            metrics={"approval_required": True}
        )
