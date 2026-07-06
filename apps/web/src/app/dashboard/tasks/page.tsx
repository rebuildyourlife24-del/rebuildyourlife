"use client";

import { motion } from "framer-motion";
import { WidgetGrid } from "@/components/widgets/WidgetGrid";
import { WidgetBase } from "@/components/widgets/WidgetBase";
import { Target, CheckCircle2, CircleDashed, AlertTriangle, Play, Pause, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function TasksPage() {
  const activeTasks = [
    { id: 1, title: "Analyseer Q3 Financiën", assignee: "Midas (CFO)", status: "IN_PROGRESS", progress: 65 },
    { id: 2, title: "Genereer SEO Blog: '5 AI Tools'", assignee: "Apollo (Copy)", status: "PENDING", progress: 0 },
    { id: 3, title: "Review Facebook Ads ROAS", assignee: "Vulcan (Ads)", status: "COMPLETED", progress: 100 },
  ];

  const failedEvents = [
    { id: "evt_991", type: "Order.Created", reason: "Mollie API Timeout", timestamp: "10 mins ago" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center bg-primary/10 border border-primary/30 text-primary px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
              <Target className="w-3 h-3 mr-2" />
              Task Queue
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
            Task <span className="text-primary">Center</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm mt-2">
            Beheer alle handmatige en autonome agent-taken in the Swarm.
          </p>
        </div>
        
        <Button className="bg-primary text-primary-foreground font-bold hover:bg-primary/90">
          Nieuwe Taak Delegeren
        </Button>
      </motion.div>

      {/* Grid */}
      <motion.div variants={itemVariants}>
        <WidgetGrid className="grid-cols-1 lg:grid-cols-3">
          
          {/* Active Tasks Widget (Takes up 2 columns on large screens) */}
          <WidgetBase 
            title="Swarm Task Execution" 
            icon={<Bot className="w-4 h-4" />}
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              {activeTasks.map(task => (
                <div key={task.id} className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex items-start gap-3">
                    {task.status === "COMPLETED" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                    ) : task.status === "IN_PROGRESS" ? (
                      <Play className="w-5 h-5 text-primary mt-0.5 animate-pulse" />
                    ) : (
                      <CircleDashed className="w-5 h-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-foreground">{task.title}</h4>
                      <p className="text-xs text-primary font-mono mt-1">Toegekend aan: {task.assignee}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <div className="flex w-full justify-between text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
                      <span>{task.status}</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${task.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-primary'}`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </WidgetBase>

          {/* DLQ / Errors Widget */}
          <WidgetBase 
            title="Dead Letter Queue" 
            icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
            className="border-destructive/30"
          >
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground mb-2">
                Asynchrone events die zijn gecrasht en wachten op handmatige of automatische retry.
              </p>
              
              {failedEvents.length > 0 ? (
                failedEvents.map(evt => (
                  <div key={evt.id} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-destructive uppercase tracking-widest">{evt.type}</span>
                      <span className="text-[9px] text-muted-foreground">{evt.timestamp}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{evt.reason}</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="h-6 text-[10px] px-2">Retry Event</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-muted-foreground">Discard</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Queue is healthy</p>
                </div>
              )}
            </div>
          </WidgetBase>
          
        </WidgetGrid>
      </motion.div>
    </motion.div>
  );
}
