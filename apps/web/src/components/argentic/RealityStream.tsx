"use client";

export function RealityStream() {
  const events = [
    { time: '14:22:04', msg: 'Market signal: DE region demand surge detected', type: 'signal' },
    { time: '14:18:11', msg: 'Competitor pricing matrix adjusted by -5%', type: 'alert' },
    { time: '14:05:59', msg: 'Consumer sentiment index shifted positive', type: 'info' },
  ];

  const nervousSystem = [
    { time: '14:23:01', source: 'Hermes', msg: 'Refund process completed (Order #921)' },
    { time: '14:19:44', source: 'Ads Agent', msg: 'Campaign TikTok-A1 optimized for CPA' },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* REALITY STREAM */}
      <div className="border border-white/[0.02] bg-[#050505]/40 backdrop-blur-md p-6 flex-1 flex flex-col">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-6 border-b border-white/[0.02] pb-4">
          Reality Stream
        </h2>
        <div className="space-y-4">
          {events.map((evt, i) => (
            <div key={i} className="flex gap-4 group">
              <span className="text-[9px] text-zinc-600 font-mono mt-1 shrink-0">{evt.time}</span>
              <span className="text-xs text-zinc-300 font-sans font-light leading-relaxed group-hover:text-white transition-colors">{evt.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* EVENT NERVOUS SYSTEM */}
      <div className="border border-white/[0.02] bg-[#050505]/40 backdrop-blur-md p-6 flex-1 flex flex-col">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-6 border-b border-white/[0.02] pb-4">
          Event Nervous System
        </h2>
        <div className="space-y-4">
          {nervousSystem.map((evt, i) => (
            <div key={i} className="flex gap-4 group">
              <span className="text-[9px] text-zinc-600 font-mono mt-1 shrink-0">{evt.time}</span>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#C8A96B] mb-1">{evt.source}</span>
                <span className="text-xs text-zinc-400 font-sans font-light">{evt.msg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
