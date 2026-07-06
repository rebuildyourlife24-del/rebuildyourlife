import * as React from "react";
import { WidgetBase } from "./WidgetBase";
import { Activity, Zap } from "lucide-react";

export function StatsWidget() {
  return (
    <WidgetBase 
      title="System Metrics" 
      icon={<Activity className="w-4 h-4" />}
      className="col-span-1"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Academy XP</span>
          <span className="text-xl font-black text-foreground">
            450<span className="text-xs text-primary ml-1">xp</span>
          </span>
        </div>
        
        <div className="flex items-center justify-between border-t border-border/30 pt-3">
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Global Health</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-500">OPTIMAL</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </div>
    </WidgetBase>
  );
}
