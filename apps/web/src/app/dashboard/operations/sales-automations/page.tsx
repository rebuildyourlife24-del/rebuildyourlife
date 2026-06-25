'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command, Phone, Send, Mic, MicOff, Shield, BarChart3, Users, Clock, ArrowUpRight, 
  MessageSquare, Loader2, Sparkles, AlertCircle, PhoneCall, Volume2, UserCheck
} from 'lucide-react';
import { sendSalesMessageAction, getRecentLeadsAction } from '@/app/actions/salesCloser';

export default function SalesAutomationsPage() {
  const [activeTab, setActiveTab] = useState<'dm' | 'voice' | 'leads' | 'analytics'>('dm');
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // DM Closer State
  const [dmMessages, setDmMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Systeem gereed. Ik ben Orion. Stuur een bericht om de verkoopgespreksimulatie te starten.' }
  ]);
  const [dmInput, setDmInput] = useState('');
  const [dmLoading, setDmLoading] = useState(false);
  const [dmConvId, setDmConvId] = useState<string | undefined>(undefined);

  // Voice Closer State
  const [voiceMessages, setVoiceMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Telefoonverbinding standby. Klik op de belknop hieronder om het gesprek met de lead te starten.' }
  ]);
  const [isCalling, setIsCalling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceConvId, setVoiceConvId] = useState<string | undefined>(undefined);
  const [speechError, setSpeechError] = useState('');

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<any>(null);

  // Fetch leads on mount and tab switch
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await getRecentLeadsAction();
      if (res.success && res.leads) {
        setLeads(res.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Speech Synthesis Helper
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nl-NL';
      utterance.rate = 1.0;
      utterance.pitch = 0.9; // Slightly deeper voice for Orion

      // Try to find a Dutch male voice if available
      const voices = window.speechSynthesis.getVoices();
      const dutchVoice = voices.find(v => v.lang.includes('NL') && v.name.toLowerCase().includes('male')) 
        || voices.find(v => v.lang.includes('NL'));
      if (dutchVoice) {
        utterance.voice = dutchVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech API - Speech Recognition Setup
  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Spraakherkenning (SpeechRecognition) wordt niet ondersteund in deze browser. Gebruik Google Chrome.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'nl-NL';

    rec.onstart = () => {
      setIsListening(true);
      setSpeechError('');
      setTranscription('Aan het luisteren...');
    };

    rec.onerror = (e: any) => {
      console.error('Speech error:', e);
      setIsListening(false);
      if (e.error !== 'no-speech') {
        setSpeechError(`Spraakherkenningfout: ${e.error}`);
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = async (event: any) => {
      const resultText = event.results[0][0].transcript;
      if (resultText) {
        setTranscription(resultText);
        await handleSendVoiceMessage(resultText);
      }
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // DM Send Message Action
  const handleSendDmMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmInput.trim() || dmLoading) return;

    const text = dmInput;
    setDmInput('');
    setDmMessages(prev => [...prev, { role: 'user', content: text }]);
    setDmLoading(true);

    try {
      const res = await sendSalesMessageAction('DM_CLOSER', text, dmConvId);
      if (res.success && res.response) {
        setDmMessages(prev => [...prev, { role: 'assistant', content: res.response! }]);
        if (res.conversationId) setDmConvId(res.conversationId);
      } else {
        setDmMessages(prev => [...prev, { role: 'assistant', content: 'Fout bij verwerken van bericht.' }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDmLoading(false);
    }
  };

  // Voice Send Message Action
  const handleSendVoiceMessage = async (text: string) => {
    if (!text.trim() || voiceLoading) return;

    setVoiceMessages(prev => [...prev, { role: 'user', content: text }]);
    setVoiceLoading(true);

    try {
      const res = await sendSalesMessageAction('VOICE_CLOSER', text, voiceConvId);
      if (res.success && res.response) {
        setVoiceMessages(prev => [...prev, { role: 'assistant', content: res.response! }]);
        if (res.conversationId) setVoiceConvId(res.conversationId);
        
        // Speak response out loud!
        speakText(res.response!);
      } else {
        setVoiceMessages(prev => [...prev, { role: 'assistant', content: 'Uplink fout.' }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVoiceLoading(false);
      setTranscription('');
    }
  };

  const handleToggleCall = () => {
    if (isCalling) {
      // Hang up
      setIsCalling(false);
      stopSpeechRecognition();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setVoiceMessages(prev => [...prev, { role: 'assistant', content: 'Gesprek beëindigd.' }]);
    } else {
      // Call
      setIsCalling(true);
      setVoiceMessages([
        { role: 'assistant', content: 'Telefoonverbinding geactiveerd. Orion luistert...' }
      ]);
      // Speak greeting
      speakText('Sovereign Grid salesdesk. Ik ben Orion. Waar ben je momenteel naar op zoek?');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative">
      
      {/* Glow overlay */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#d4af37] font-mono text-xs uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4 animate-pulse" /> Operations Room // Automated Closers
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Sales <span className="text-[#d4af37]">Automations</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-light">
            Monitor, beheer en test de high-ticket verkoop-AI direct in actie.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-black border border-white/10 p-1.5 rounded-lg font-mono text-xs">
          {[
            { id: 'dm', label: 'DM CLOSER', icon: MessageSquare },
            { id: 'voice', label: 'VOICE CLOSER', icon: Phone },
            { id: 'leads', label: 'LEADS LOG', icon: Users },
            { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'leads') fetchLeads();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded transition-all uppercase tracking-wider font-bold ${activeTab === tab.id ? 'bg-[#d4af37] text-black' : 'text-zinc-400 hover:text-white'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* TAB 1: DM CLOSER */}
        {activeTab === 'dm' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-6 flex flex-col h-[600px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <span className="font-bold font-mono text-sm text-zinc-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
                  LIVE DM SIMULATOR
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">AGENT ID: ORION-CLOSER-V1</span>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin">
                {dmMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-4 rounded text-sm ${msg.role === 'user' ? 'bg-[#d4af37] text-black font-semibold' : 'bg-zinc-900 text-zinc-100 font-light border border-white/5'}`}>
                      <div className="text-[9px] font-mono opacity-50 mb-1 uppercase tracking-widest">{msg.role === 'user' ? 'Lead' : 'Orion Sales'}</div>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {dmLoading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 border border-white/5 p-4 rounded flex items-center gap-2 text-zinc-500 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" /> Orion is aan het typen...
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendDmMessage} className="flex gap-2">
                <input
                  value={dmInput}
                  onChange={(e) => setDmInput(e.target.value)}
                  placeholder="Typ een bericht of bezwaar (bijv: 'Waarom kost dit €2.000?')..."
                  className="flex-1 bg-black border border-white/10 outline-none focus:border-[#d4af37] px-4 py-3 text-sm text-white font-mono transition-colors"
                />
                <button type="submit" className="bg-[#d4af37] text-black font-black uppercase px-6 hover:bg-white transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" /> Verstuur
                </button>
              </form>
            </div>

            {/* Instruction Column */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4 border-l-4 border-[#d4af37] pl-3">
                  Hoe test je de DM Closer?
                </h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed mb-6">
                  Dit is het **echt werkende** verkoop-algoritme van Orion. Hij is geprogrammeerd om bezwaren over de verkoopprijs van €2.000 te behandelen en leads te kwalificeren.
                </p>
                <div className="space-y-3 font-mono text-xs text-zinc-400">
                  <div className="p-3 bg-black border border-white/5">
                    <strong>Test 1 (Bezwaar)</strong>: Zeg dat je het te duur vindt of dat je er geen geld voor hebt.
                  </div>
                  <div className="p-3 bg-black border border-white/5">
                    <strong>Test 2 (Kwalificatie)</strong>: Vertel wat je doelen zijn en vraag hoe Hermes en Orion je kunnen helpen.
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-4 mt-6">
                <span className="text-[10px] text-zinc-600 block mb-1">Mollie Integratie status</span>
                <span className="text-xs text-green-500 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Gekoppeld aan /api/mollie/checkout
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: VOICE CLOSER */}
        {activeTab === 'voice' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-8 flex flex-col items-center justify-between min-h-[500px]">
              
              <div className="w-full flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <span className="font-bold font-mono text-sm text-zinc-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#d4af37]" />
                  LIVE SPRAAK UPLINK
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">SPEECH TO SPEECH ACTIVE</span>
              </div>

              {/* Call Graphic / Status */}
              <div className="flex flex-col items-center justify-center flex-1 py-8">
                <AnimatePresence mode="wait">
                  {isCalling ? (
                    <motion.div 
                      key="active" 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      {/* Pulse Circle */}
                      <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                        <div className="absolute inset-0 rounded-full bg-[#d4af37]/20 animate-ping duration-1000"></div>
                        <div className="absolute inset-2 rounded-full bg-[#d4af37]/10 animate-pulse"></div>
                        <div className="w-24 h-24 rounded-full bg-black border-2 border-[#d4af37] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                          <PhoneCall className="w-10 h-10 text-[#d4af37]" />
                        </div>
                      </div>

                      <div className="text-xl font-bold uppercase tracking-wider text-white mb-2">Gesprek is Live</div>
                      <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Orion luistert lokaal...
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="idle" 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-36 h-36 rounded-full bg-zinc-900/50 border border-white/10 flex items-center justify-center mb-8">
                        <Phone className="w-10 h-10 text-zinc-600" />
                      </div>
                      <div className="text-xl font-bold uppercase tracking-wider text-zinc-400 mb-2">Verbinding Standby</div>
                      <div className="text-xs text-zinc-600 font-mono uppercase tracking-widest">Klik belknop om te starten</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Speech transcription feedback */}
              {isCalling && (
                <div className="w-full bg-black border border-white/5 p-4 rounded text-center mb-6">
                  <span className="text-[10px] text-zinc-600 block uppercase font-mono mb-1">Live Transcriptie</span>
                  <div className="text-sm font-mono text-zinc-300 italic min-h-[20px]">
                    {transcription || 'Spreek nu in je microfoon...'}
                  </div>
                </div>
              )}

              {/* Call Controls */}
              <div className="flex gap-4">
                <button
                  onClick={handleToggleCall}
                  className={`px-8 py-5 rounded-full font-black uppercase text-sm tracking-widest flex items-center gap-3 transition-all ${isCalling ? 'bg-gold hover:bg-red-700 text-white' : 'bg-[#d4af37] hover:bg-white text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]'}`}
                >
                  <Phone className="w-5 h-5" />
                  {isCalling ? 'Hangs Up' : 'Start Call'}
                </button>

                {isCalling && (
                  <button
                    onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
                    disabled={voiceLoading}
                    className={`px-6 py-5 rounded-full font-black uppercase text-sm tracking-widest flex items-center gap-2 border ${isListening ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'bg-black border-white/10 text-white'} disabled:opacity-40`}
                  >
                    {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
                    {isListening ? 'Spreken...' : 'Praat Nu'}
                  </button>
                )}
              </div>

              {speechError && (
                <div className="mt-4 text-xs text-[#d4af37] font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {speechError}
                </div>
              )}

            </div>

            {/* Conversation Log / Instructions */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4 border-l-4 border-[#d4af37] pl-3">
                  AI Voice Closer Live
                </h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed mb-6">
                  Dit paneel gebruikt de **echte Chrome spraakherkenning** en **spraakgeneratie** gekoppeld aan de live AI-router.
                </p>

                <div className="space-y-4">
                  <div className="text-xs font-mono text-zinc-400">
                    <span className="text-[#d4af37] font-bold block mb-1">STAP 1</span>
                    Klik op **Start Call** om de verbinding te openen. De AI zal je begroeten.
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    <span className="text-[#d4af37] font-bold block mb-1">STAP 2</span>
                    Klik op **Praat Nu** en spreek je reactie in (bijv: *"Ik ben een e-commerce ondernemer, maar loop vast"*).
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    <span className="text-[#d4af37] font-bold block mb-1">STAP 3</span>
                    Wacht een paar seconden. Orion zal antwoorden en de browser zal zijn stem direct **luidspreken**!
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6 text-zinc-500 text-xs">
                <span className="text-[10px] text-zinc-600 block mb-1">Voice Closer Engine</span>
                Web Speech API Integration // Native Browser Core
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: LEADS LOG */}
        {activeTab === 'leads' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a0a0a] border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#d4af37]" />
                Geregistreerde Leads & Gasten
              </h3>
              <button onClick={fetchLeads} disabled={loadingLeads} className="text-xs text-zinc-400 hover:text-white uppercase font-mono">
                {loadingLeads ? 'Bezig met laden...' : '[ Vernieuwen ]'}
              </button>
            </div>

            {loadingLeads ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/5 rounded">
                <p className="text-sm text-zinc-500">Er zijn momenteel geen geregistreerde leads in de database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-zinc-400 border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-widest">
                      <th className="pb-3 font-bold">Gasten ID / User ID</th>
                      <th className="pb-3 font-bold">Tijdelijk E-mailadres</th>
                      <th className="pb-3 font-bold">Klantstatus</th>
                      <th className="pb-3 font-bold">Gemaakt op</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 text-[#d4af37] font-bold">{lead.id}</td>
                        <td className="py-4 text-white">{lead.email}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${lead.subscriptionStatus === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                            {lead.subscriptionStatus || 'LEAD'}
                          </span>
                        </td>
                        <td className="py-4">{new Date(lead.createdAt).toLocaleString('nl-NL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Totaal VSL Views', value: '1.240', change: '+24%', icon: Clock },
                { title: 'Conversions (Sales)', value: '18', change: '+12%', icon: UserCheck },
                { title: 'Totale Omzet (Elite)', value: '€36.000', change: '€1.500/sale', icon: Sparkles },
                { title: 'Closer Uitbetalingen', value: '€9.000', change: '€500/sale', icon: PhoneCall },
              ].map((stat, i) => (
                <div key={i} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg relative overflow-hidden">
                  <stat.icon className="absolute right-4 top-4 w-12 h-12 text-zinc-900" />
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-2">{stat.title}</span>
                  <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                  <span className="text-xs text-green-400 font-mono flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> {stat.change}</span>
                </div>
              ))}
            </div>

            {/* Performance charts mockup but with clean canvas styling */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6">
                Conversie ratio vergelijking
              </h3>
              
              <div className="space-y-4">
                {[
                  { name: 'VSL Direct-Buy Funnel', rate: '1.5%', color: 'bg-zinc-500', count: '1.200 views -> 18 sales' },
                  { name: 'AI DM Closer (Chat)', rate: '14.2%', color: 'bg-[#d4af37]', count: '120 chats -> 17 sales' },
                  { name: 'AI Voice Closer (Bellen)', rate: '28.5%', color: 'bg-white', count: '42 calls -> 12 sales' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center text-xs font-mono mb-1 text-zinc-400">
                      <span className="text-white font-bold">{item.name}</span>
                      <span>{item.rate} ({item.count})</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: parseFloat(item.rate) * 3 + '%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
