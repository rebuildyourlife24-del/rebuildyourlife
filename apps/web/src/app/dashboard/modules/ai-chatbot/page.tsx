"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Save, Copy, CheckCircle, Settings, MessageSquare, Code, Wand2, Loader2 } from "lucide-react";
import { trainChatbotAction } from "@/app/actions/modules";

export default function AiChatbotModule() {
  const [botName, setBotName] = useState("Klantenservice Bot");
  const [botPrompt, setBotPrompt] = useState("Je bent een behulpzame assistent voor ons bedrijf. Beantwoord vragen kort en vriendelijk.");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePrompt = async () => {
    if (!botName) return;
    setIsGenerating(true);
    const res = await trainChatbotAction(botName, botPrompt);
    if (res.success && res.prompt) {
      setBotPrompt(res.prompt);
    }
    setIsGenerating(false);
  };

  const handleSave = () => {
    // TODO: Sla de configuratie op in de database onder UserBusinessModule.config
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const embedCode = `<script src="https://ryl.app/embed/chatbot.js" data-bot-id="USER_BOT_ID" data-color="${primaryColor}"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen text-white bg-slate-950">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bot className="text-blue-500" size={32} />
            <h1 className="text-3xl font-bold">AI Chatbot Agency</h1>
          </div>
          <p className="text-slate-400">
            Configureer je AI-bot en kopieer de code om hem op de website van je klant te installeren.
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
          {isSaved ? "Opgeslagen!" : "Opslaan & Activeren"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Linker kolom: Configuratie */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="text-emerald-400" size={20} />
              Bot Instellingen
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Naam van de Bot (zichtbaar voor klanten)
                </label>
                <input 
                  type="text" 
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Bijv. Support Eva"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-400">
                    Instructies (Prompt) - Wat moet de bot doen?
                  </label>
                  <button 
                    onClick={handleGeneratePrompt}
                    disabled={isGenerating}
                    className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} 
                    Verrijk met AI
                  </button>
                </div>
                <textarea 
                  value={botPrompt}
                  onChange={(e) => setBotPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Beschrijf de rol van de bot..."
                />
                <p className="text-xs text-slate-500 mt-2">Tip: Hoe specifieker, hoe beter de bot reageert op klantvragen.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Huisstijl Kleur
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer bg-slate-950 border border-slate-800 p-1"
                  />
                  <span className="text-slate-300 font-mono">{primaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Code className="text-blue-400" size={20} />
              Installatie Code
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Kopieer deze code en plak hem in de <code>&lt;head&gt;</code> of voor de <code>&lt;/body&gt;</code> tag van de website van je klant.
            </p>
            <div className="relative">
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto font-mono">
                {embedCode}
              </pre>
              <button 
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors text-slate-300"
                title="Kopieer code"
              >
                {copied ? <CheckCircle size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Rechter kolom: Live Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-sm font-medium text-slate-400">Live Preview</span>
          </div>
          
          <div className="flex-1 bg-slate-950 p-4 relative">
            {/* Fake Website Content */}
            <div className="space-y-4 opacity-20">
              <div className="h-8 bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-5/6" />
              <div className="h-32 bg-slate-800 rounded w-full mt-8" />
            </div>

            {/* Chat Widget Preview */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute bottom-4 right-4 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div 
                className="p-4 text-white flex items-center gap-3"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <span className="font-bold">{botName}</span>
              </div>
              <div className="p-4 h-64 bg-slate-50 flex flex-col">
                <div className="bg-slate-200 text-slate-800 text-sm p-3 rounded-xl rounded-tl-none w-4/5 mb-3">
                  Hallo! Hoe kan ik je vandaag helpen?
                </div>
                <div className="mt-auto">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Typ je bericht..." 
                      className="w-full text-sm bg-white border border-slate-200 rounded-full px-4 py-2 pr-10 text-slate-800 outline-none focus:border-blue-500"
                      disabled
                    />
                    <div 
                      className="absolute right-1.5 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <MessageSquare size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
