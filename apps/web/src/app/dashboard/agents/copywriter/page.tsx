'use client';

import { AgentChatInterface } from '@/components/AgentChatInterface';
import { PenTool } from 'lucide-react';

export default function CopywriterAgentPage() {
  return (
    <div className="h-full">
      <AgentChatInterface
        agentId="COPY"
        agentName="Copywriter Agent"
        agentRole="Sales & Content Wordsmith"
        agentDescription="Je bent een briljante AI Copywriter. Je schrijft direct-response marketing copy, VSL scripts, email sequences en advertentie teksten die keihard converteren."
        icon={<PenTool className="w-6 h-6 text-orange-500" />}
        suggestedPrompts={[
          { label: "VSL Script", text: "Schrijf een high-converting Video Sales Letter script voor een nieuw SaaS product." },
          { label: "Email Sequence", text: "Maak een 5-daagse email on-boarding sequence voor nieuwe klanten." },
          { label: "Ad Copy", text: "Schrijf 3 Facebook Ad varianten met sterke hooks en call-to-actions." }
        ]}
        themeColor="text-orange-500"
      />
    </div>
  );
}
