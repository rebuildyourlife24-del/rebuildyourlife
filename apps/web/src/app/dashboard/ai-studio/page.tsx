"use client";

import { motion } from "framer-motion";
import { WidgetGrid } from "@/components/widgets/WidgetGrid";
import { WidgetBase } from "@/components/widgets/WidgetBase";
import { Brain, Cpu, MessageSquare, Terminal, Database, Sparkles, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RemotionStudio } from "@/components/video/RemotionStudio";

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

export default function AIStudioPage() {
  const models = [
    { name: "GPT-4o", provider: "OpenAI", status: "ACTIVE", type: "Core Reasoning" },
    { name: "Claude 3.5 Sonnet", provider: "Anthropic", status: "ACTIVE", type: "Coding & Analysis" },
    { name: "Llama 3 70B", provider: "Groq", status: "STANDBY", type: "High-Speed Inference" },
  ];

  const customPrompts = [
    { name: "Copywriting Framework", category: "Marketing", uses: 124 },
    { name: "Financial Risk Auditor", category: "Finance", uses: 56 },
    { name: "SEO Article Generator", category: "Content", uses: 890 },
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
              <Brain className="w-3 h-3 mr-2" />
              Intelligence Hub
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
            AI <span className="text-primary">Studio</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm mt-2">
            Configureer foundational models, beheer systeem-prompts, en train je eigen specifieke AI-agenten.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="font-bold border-border/50 text-foreground">
            <Settings2 className="w-4 h-4 mr-2" /> API Keys
          </Button>
          <Button className="bg-primary text-primary-foreground font-bold hover:bg-primary/90">
            <Sparkles className="w-4 h-4 mr-2" /> Nieuwe Agent Trainen
          </Button>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div variants={itemVariants}>
        <WidgetGrid className="grid-cols-1 lg:grid-cols-3">
          
          {/* Active Models */}
          <WidgetBase 
            title="LLM Router & Models" 
            icon={<Cpu className="w-4 h-4" />}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {models.map((model, i) => (
                <div key={i} className="p-4 rounded-xl bg-card border border-border/50 flex flex-col gap-3 group hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden">
                  {model.status === 'ACTIVE' && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>
                  )}
                  <div className="flex justify-between items-start">
                    <Database className={`w-5 h-5 ${model.status === 'ACTIVE' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${model.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {model.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-foreground">{model.name}</h3>
                    <p className="text-xs text-muted-foreground">{model.provider} • {model.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </WidgetBase>

          {/* Prompt Library */}
          <WidgetBase 
            title="Prompt Library" 
            icon={<Terminal className="w-4 h-4" />}
          >
            <div className="flex flex-col gap-3">
              {customPrompts.map((prompt, i) => (
                <div key={i} className="p-3 bg-muted/30 border border-border/30 rounded-lg flex items-center justify-between group hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div>
                      <p className="text-sm font-bold text-foreground">{prompt.name}</p>
                      <p className="text-[10px] text-primary font-mono uppercase tracking-widest">{prompt.category}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{prompt.uses}x</span>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground">
                Bekijk Alle Prompts →
              </Button>
            </div>
          </WidgetBase>
          
        </WidgetGrid>
      </motion.div>

      <motion.div variants={itemVariants}>
        <RemotionStudio />
      </motion.div>
    </motion.div>
  );
}
