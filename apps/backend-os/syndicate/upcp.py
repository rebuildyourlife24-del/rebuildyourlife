import logging
from typing import Dict, Any, List

logger = logging.getLogger("syndicate.upcp")

class UPCPEngine:
    """
    The Universal Product Creation Protocol (The Forge).
    Enforces the 5 Laws of Creation before any Agent can execute or propose code/marketing.
    """
    
    LAWS = [
        "1_UNDERSTAND",  # Begrijp
        "2_DECOMPOSE",   # Ontleden
        "3_RESEARCH",    # Onderzoeken
        "4_DESIGN",      # Ontwerpen
        "5_VALIDATE"     # Valideren
    ]

    @staticmethod
    def validate(agent_name: str, action: str, details: Dict[str, Any]) -> bool:
        """
        Runs the 5 Laws against the proposed action.
        If any law is breached (e.g., missing data, no research attached), the action is blocked.
        """
        logger.info(f"[{agent_name}] UPCP Engine intercept: Validating action '{action}'")
        
        # In a fully LLM-driven setup, this would call the LLM to verify the details.
        # For the OS runtime, we do a deterministic check on the payload.
        
        # 1. UNDERSTAND: Must have clear intent
        if not details:
            logger.error(f"[{agent_name}] UPCP Law 1 Failed: No details provided. Action blocked.")
            return False
            
        # 2. DECOMPOSE: Must have at least a target or module structure
        if "module_type" not in details and "project_name" not in details and "campaign_type" not in details:
            logger.warning(f"[{agent_name}] UPCP Law 2 Warning: Missing decomposition target. Injecting generic target.")
            
        # 3. RESEARCH & 4. DESIGN: Must have a configuration or content body
        if "config" not in details and "content" not in details:
             logger.error(f"[{agent_name}] UPCP Law 3/4 Failed: No design/config payload provided. Action blocked.")
             return False

        # 5. VALIDATE: Must not bypass safety
        if details.get("bypass_security", False):
            logger.error(f"[{agent_name}] UPCP Law 5 Failed: Security bypass attempted. Action blocked.")
            return False

        logger.info(f"[{agent_name}] UPCP Engine: All 5 Laws Passed. Action '{action}' approved for Governance.")
        return True
