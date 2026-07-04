"use client";

import { useState, useEffect } from "react";
import { getTickets, createTicketMessage } from "@/app/actions/helpdesk";
import { LifeBuoy, MessageSquare, Send, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function NativeHelpdeskPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getTickets();
    if (res.success) {
      setTickets(res.tickets || []);
      if (res.tickets && res.tickets.length > 0 && !activeTicket) {
        setActiveTicket(res.tickets[0]);
      }
    }
    setLoading(false);
  };

  const handleReply = async () => {
    if (!replyText.trim() || isSending || !activeTicket) return;
    setIsSending(true);
    
    // Optimistic UI update
    const newMsg = { id: Date.now(), sender: "AGENT", body: replyText, createdAt: new Date() };
    setActiveTicket({ ...activeTicket, messages: [...activeTicket.messages, newMsg] });
    setReplyText("");

    const res = await createTicketMessage(activeTicket.id, newMsg.body);
    if (!res.success) {
      alert("Failed to send message");
    }
    
    setIsSending(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 text-white min-h-[85vh] flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-widest flex items-center gap-3">
          <LifeBuoy className="w-8 h-8 text-blue-500" />
          RYL Native Helpdesk
        </h1>
        <p className="text-zinc-400 font-mono text-sm mt-2 max-w-xl">
          Volledig onafhankelijke customer support. Zeg je Zendesk en Gorgias abonnementen op. Dit systeem vangt e-mails op en Orion (AI) leest mee.
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-[600px]">
        {/* Left Sidebar: Ticket List */}
        <div className="w-1/3 bg-black/40 border border-white/10 rounded-2xl p-4 overflow-y-auto flex flex-col gap-2">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 pl-2">Inbox ({tickets.length})</h3>
          
          {loading ? (
            <div className="text-center py-10 text-xs text-zinc-500">Laden...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 text-xs text-zinc-500">Geen open tickets.</div>
          ) : (
            tickets.map(ticket => (
              <button 
                key={ticket.id}
                onClick={() => setActiveTicket(ticket)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  activeTicket?.id === ticket.id 
                    ? 'bg-blue-950/40 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'bg-zinc-900/50 border-transparent hover:bg-zinc-800'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm truncate pr-2">{ticket.customerName}</h4>
                  <span className={`text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
                    ticket.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' :
                    ticket.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate font-mono">{ticket.subject}</p>
                
                <div className="flex items-center gap-2 mt-3 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                  {ticket.status === 'OPEN' && <span className="flex items-center gap-1 text-blue-400"><AlertCircle className="w-3 h-3" /> Open</span>}
                  {ticket.status === 'RESOLVED' && <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-3 h-3" /> Opgelost</span>}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right Side: Active Ticket View */}
        <div className="flex-1 bg-black/60 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          {activeTicket ? (
            <>
              {/* Ticket Header */}
              <div className="p-6 border-b border-white/10 bg-zinc-900/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{activeTicket.subject}</h2>
                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                      <span>{activeTicket.customerName} &lt;{activeTicket.customerEmail}&gt;</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-green-500/20 transition-colors">
                      Markeer als Opgelost
                    </button>
                  </div>
                </div>
                
                {/* AI Suggestion Banner */}
                <div className="mt-4 p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-lg flex items-start gap-3">
                  <div className="bg-indigo-500/20 p-1.5 rounded mt-0.5">
                    <MessageSquare className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest block mb-1">Orion AI Suggestie</span>
                    <p className="text-xs text-indigo-200">De klant vraagt naar de levertijd. Volgens de database is order #482 gister verzonden. Klik op 'Genereer Antwoord' om dit automatisch in te vullen.</p>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {activeTicket.messages?.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'CUSTOMER' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-4 rounded-xl text-sm ${
                      msg.sender === 'CUSTOMER' 
                        ? 'bg-zinc-900 border border-white/5 text-zinc-200' 
                        : 'bg-blue-900/20 border border-blue-500/20 text-white'
                    }`}>
                      <span className="block text-[9px] uppercase font-bold tracking-widest text-zinc-500 mb-2">
                        {msg.sender === 'CUSTOMER' ? activeTicket.customerName : 'Support Agent (Jij)'}
                      </span>
                      <p className="whitespace-pre-wrap">{msg.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-white/10 bg-zinc-900/80 flex gap-4">
                <textarea 
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Typ je antwoord hier..."
                  className="flex-1 bg-black border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500/50 resize-none h-24"
                />
                <div className="flex flex-col gap-2 justify-end w-32">
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg py-2 text-[10px] font-bold uppercase tracking-widest transition-colors">
                    AI Antwoord
                  </button>
                  <button 
                    onClick={handleReply}
                    disabled={!replyText.trim() || isSending}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" /> Stuur
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
              <LifeBuoy className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-mono">Selecteer een ticket om te reageren.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
