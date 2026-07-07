import random
from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

def generate_seo_campaign():
    """Mocks generating an SEO campaign using an LLM."""
    keywords = ["God-Mode OS", "AI Automation SaaS", "Sovereign AI Router", "Agentic Frameworks"]
    target_keyword = random.choice(keywords)
    
    return {
        "title": f"The Ultimate Guide to {target_keyword} in 2026",
        "keyword": target_keyword,
        "word_count": random.randint(1200, 2500),
        "difficulty": "Medium",
        "search_volume": random.randint(5000, 50000)
    }

class HeadOfSEOAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Head of SEO & Content",
            role="Organic traffic, keyword strategy, copywriting"
        )
        
    async def execute(self, state: Dict[str, Any]) -> AgentResult:
        self.log_action("ANALYZING_SEARCH_TRENDS", {"state_keys": list(state.keys())})
        
        # 1. Check for Governance Approved Actions
        approved_actions = state.get("approved_actions", [])
        for act in list(approved_actions):
            if act.get("agent") == self.name and act.get("action") == "PUBLISH_ARTICLE":
                state["approved_actions"].remove(act) # Consume the event
                
                details = act.get("details", {})
                self.log_action("ARTICLE_PUBLISHED", details)
                return self.success(f"Head of SEO published: {details.get('title')}")

        # 2. Propose action: Generate new SEO Campaign
        campaign = generate_seo_campaign()
        draft = {
            "target": "Blog / CMS",
            "reason": f"Detected high search volume ({campaign['search_volume']}) for '{campaign['keyword']}'. Generated a {campaign['word_count']}-word article.",
            "title": campaign["title"]
        }
        
        return self.request_approval("PUBLISH_ARTICLE", draft)
