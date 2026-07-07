from typing import Dict, Any
from .base_agent import BaseAgent, AgentResult

def create_stub_agent(name: str, role: str) -> type:
    class StubAgent(BaseAgent):
        def __init__(self):
            super().__init__(name=name, role=role)
            
        async def execute(self, state: Dict[str, Any]) -> AgentResult:
            self.log_action("ANALYZING_STATE", {"state_keys": list(state.keys())})
            # Stubs simply request approval for a placeholder action
            return self.request_approval(f"{self.name.upper()}_ACTION_DRAFT", {"message": f"{self.name} is ready for integration."})
    
    return StubAgent

# Generate the remaining 16 agents of the 18-Person Council dynamically as stubs for now
OrionAgent = create_stub_agent("CEO (Orion)", "Strategic oversight, goal setting, final approval")
CFOAgent = create_stub_agent("CFO", "Wallet splitting (90/10), budget allocation, financial auditing")
COOAgent = create_stub_agent("COO", "Workflow orchestration, logistics, performance monitoring")
CMOAgent = create_stub_agent("CMO", "Campaign strategy, market analysis, audience targeting")
CROAgent = create_stub_agent("CRO", "Sales pipeline, conversion optimization, pricing strategy")
HermesAgent = create_stub_agent("Hermes", "Inter-agent communication, external API routing, message bus")
LeadDataScientistAgent = create_stub_agent("Lead Data Scientist", "Analytics, prediction engines, business genome analysis")
HeadOfSEOAgent = create_stub_agent("Head of SEO & Content", "Organic traffic, keyword strategy, copywriting")
LeadFrontendAgent = create_stub_agent("Lead Frontend Engineer", "React/Next.js UI generation, UX optimization")
LeadBackendAgent = create_stub_agent("Lead Backend Engineer", "Python/FastAPI logic, database migrations (Prisma)")
QALeadAgent = create_stub_agent("QA Lead", "Testing, build verification, breaking build prevention")
HeadOfGrowthAgent = create_stub_agent("Head of Growth", "Viral loops, A/B testing, rapid experimentation")
CustomerSuccessAgent = create_stub_agent("Customer Success Manager", "User onboarding, support automation, retention")
LegalComplianceAgent = create_stub_agent("Legal & Compliance Officer", "GDPR, AI ethics, risk assessment")
MarketIntelligenceAgent = create_stub_agent("Market Intelligence Analyst", "Competitor scraping (Firecrawl), trend spotting")
DevOpsArchitectAgent = create_stub_agent("DevOps / Cloud Architect", "Vercel deployments, Supabase health, CI/CD pipelines")
