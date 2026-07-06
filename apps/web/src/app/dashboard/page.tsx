"use client";

import { motion } from "framer-motion";
import { WidgetGrid } from "@/components/widgets/WidgetGrid";
import { StatsWidget } from "@/components/widgets/StatsWidget";
import { ActiveAgentsWidget } from "@/components/widgets/ActiveAgentsWidget";
import { useRequireAuth } from "@/lib/auth";
import { ShieldAlert, Network, Zap } from "lucide-react";
import { WidgetBase } from "@/components/widgets/WidgetBase";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

export default function CommandCenter() {
  const { user } = useRequireAuth();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center bg-primary/10 border border-primary/30 text-primary px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2 shadow-[0_0_10px_currentColor]"></span>
            System Online
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
          Command <span className="text-primary">Center</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
          Welcome back, Operator {user?.firstName || 'Unknown'}. All systems are nominal.
          Your Swarm AI is actively monitoring the workspace.
        </p>
      </motion.div>

      {/* Primary Widget Grid */}
      <motion.div variants={itemVariants}>
        <WidgetGrid>
          <StatsWidget />
          <ActiveAgentsWidget />
          
          {/* Quick Action Widget Placeholder */}
          <WidgetBase 
            title="Active Automations" 
            icon={<Network className="w-4 h-4" />}
            className="col-span-1 sm:col-span-2 lg:col-span-1"
            action={<button className="text-xs text-primary hover:underline">Deploy</button>}
          >
            <div className="flex flex-col items-center justify-center h-full text-center p-4 gap-2">
              <Zap className="w-8 h-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground font-mono">No active Zapier/Make webhooks detected in current region.</p>
            </div>
          </WidgetBase>

          {/* Security Widget Placeholder */}
          <WidgetBase 
            title="Sentinel Security" 
            icon={<ShieldAlert className="w-4 h-4" />}
            className="col-span-1"
          >
             <div className="flex flex-col items-center justify-center h-full text-center p-4 gap-2">
              <ShieldAlert className="w-8 h-8 text-emerald-500/30" />
              <p className="text-xs text-emerald-500 font-mono">0 breaches. MFA enforced. DLQ is empty.</p>
            </div>
          </WidgetBase>
        </WidgetGrid>
      </motion.div>
    </motion.div>
  );
}
