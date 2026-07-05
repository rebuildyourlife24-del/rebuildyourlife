import { Card } from '@/components/ui/Card';
import { Briefcase, FileText, Download, Target, PenTool, Database, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const tools = [
  {
    category: 'Marketing Tools (AI)',
    items: [
      { name: 'AI Product Hunter', desc: 'Vind winnende Dropshipping producten in seconden.', icon: <Search className="w-5 h-5 text-amber-400" />, href: '/dashboard/modules/product-hunter' },
      { name: 'Cold Email Generator', desc: 'Genereer B2B lead scripts op basis van bedrijfsdata.', icon: <Database className="w-5 h-5 text-amber-400" />, href: '/dashboard/modules/cold-email' },
      { name: 'SEO Audit Scanner', desc: 'Volledige on-page scan van je e-com winkel.', icon: <Target className="w-5 h-5 text-amber-400" />, href: '/dashboard/modules/seo-audit' },
    ]
  },
  {
    category: 'De Vault (SOP\'s & Templates)',
    items: [
      { name: 'Sales Call Script Matrix', desc: 'Het plug & play script voor high-ticket sluitingen.', icon: <FileText className="w-5 h-5 text-zinc-300" />, href: '#' },
      { name: 'Notion CEO Dashboard', desc: 'Jouw life OS & business tracker in Notion.', icon: <Database className="w-5 h-5 text-zinc-300" />, href: '#' },
      { name: 'Ultimate Email Swipe File', desc: 'Bewezen email flows voor E-com & Agency.', icon: <PenTool className="w-5 h-5 text-zinc-300" />, href: '#' },
    ]
  }
];

export default function ToolsPage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-amber-500/30 glass-cyber p-8 md:p-12 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-amber-500/10 border border-amber-500/40 text-amber-400 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <Briefcase className="w-3 h-3 mr-2" />
                Tools & Resources
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              The <span className="text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">Vault</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Jouw wapenkamer. Gebruik onze custom AI-tools voor marketing en download de exacte SOP's en templates die wij gebruiken om miljoenenomzetten te draaien.
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-12">
        {tools.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wide">{section.category}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, i) => (
                <Link key={i} href={item.href} className="group block h-full">
                  <div className="glass-cyber rounded-[1.5rem] p-6 h-full flex flex-col hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] border border-white/5 hover:border-amber-500/30 transition-all relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
                    
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-zinc-400 font-light flex-1">
                      {item.desc}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                        {item.href === '#' ? 'Download' : 'Open Tool'}
                      </span>
                      {item.href === '#' ? <Download className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" /> : <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
