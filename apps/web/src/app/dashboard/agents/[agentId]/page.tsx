import { DynamicAgentClient } from "./DynamicAgentClient";

export default async function DynamicAgentPage({ params }: { params: { agentId: string } }) {
  const resolvedParams = await Promise.resolve(params);
  
  return (
    <div className="h-full w-full">
      <DynamicAgentClient agentIdRaw={resolvedParams.agentId} />
    </div>
  );
}
