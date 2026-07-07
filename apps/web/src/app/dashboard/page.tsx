"use client";

import { motion } from "framer-motion";
import { ArgenticSidebar } from "@/components/argentic/ArgenticSidebar";
import { AutonomyMatrix } from "@/components/argentic/AutonomyMatrix";
import { DigitalTwinPanel } from "@/components/argentic/DigitalTwinPanel";
import { AICourt } from "@/components/argentic/AICourt";
import { RealityStream } from "@/components/argentic/RealityStream";
import { EarlyWarningRadar } from "@/components/argentic/EarlyWarningRadar";
import { ShieldCheck } from "lucide-react";

export default function SovereignCommandUltra() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0D] overflow-hidden text-zinc-300 font-sans selection:bg-purple-500/30">
      
      {/* V4.0 SOVEREIGN CANVAS BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-900/[0.03] rounded-full blur-[140px] animate-pulse-glow"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/[0.02] rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[1920px] mx-auto p-4 md:p-8 h-screen flex flex-col gap-6"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-light tracking-[0.2em] text-white">ARGENTIC</h1>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 px-3 py-1 border border-zinc-800 rounded-full bg-zinc-900/50">
              V4.1 SOVEREIGN COMMAND ULTRA
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            GOVERNANCE ENGINE ONLINE
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* LEFT: NAVIGATION */}
          <motion.div variants={panelVariants} className="col-span-2">
            <ArgenticSidebar />
          </motion.div>

          {/* CENTER: INTELLIGENCE & CONTROL */}
          <motion.div variants={panelVariants} className="col-span-6 flex flex-col gap-6">
            <div className="flex-1 min-h-[400px]">
              <AICourt />
            </div>
            <div className="h-[280px]">
              <AutonomyMatrix />
            </div>
          </motion.div>

          {/* RIGHT: REALITY & WARNINGS */}
          <motion.div variants={panelVariants} className="col-span-4 flex flex-col gap-6">
            <div className="h-[280px]">
              <EarlyWarningRadar />
            </div>
            <div className="flex-1 min-h-[250px]">
              <RealityStream />
            </div>
            <div className="h-[180px]">
              <DigitalTwinPanel />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
