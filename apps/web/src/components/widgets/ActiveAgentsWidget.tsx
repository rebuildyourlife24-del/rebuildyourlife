import * as React from "react";
import { WidgetBase } from "./WidgetBase";
import { Bot, Terminal } from "lucide-react";

export function ActiveAgentsWidget() {
  const agents = [
    { name: "Orion", role: "Chief Executive Officer", status: "ACTIVE", color: "text-yellow-500" },
    { name: "Hermes", role: "Personal Assistant", status: "ACTIVE", color: "text-emerald-500" },
  ];

  return (
    <WidgetBase 
      title="Active Agents" 
      icon={<Bot className="w-4 h-4" />}
      className="col-span-1"
      action={<button className="text-xs text-primary hover:underline">Manage</button>}
    >
      <div className="space-y-3">
        {agents.map((agent, i) => (
          <div key={i} className="flex flex-col gap-1 p-2 rounded-md hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold uppercase tracking-wide ${agent.color}`}>
                {agent.name}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
                {agent.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Terminal className="w-3 h-3" />
              <span>{agent.role}</span>
            </div>
          </div>
        ))}
      </div>
    </WidgetBase>
  );
}
