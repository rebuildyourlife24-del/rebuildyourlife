import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Network, Database, Monitor, Activity, 
  Briefcase, GraduationCap, Users, Megaphone, Mail 
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" } 
  },
};

const models = [
  { id: 'ecommerce', title: 'E-Commerce & Webshops', desc: 'Fysieke producten, dropshipping, en merken.', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'affiliate', title: 'Affiliate Marketing', desc: 'Promoot andermans producten voor commissie.', icon: Network, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'digital-products', title: 'Digitale Producten', desc: 'E-books, templates, en downloads.', icon: Database, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'saas', title: 'SaaS & Software', desc: 'Software-as-a-Service, apps en tools.', icon: Monitor, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'trading', title: 'Trading & Crypto', desc: 'Aandelen, forex, crypto en daytrading.', icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'agency', title: 'B2B Agency & Diensten', desc: 'Marketing, design, en development diensten.', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'coaching', title: 'Coaching & Academy', desc: 'Online cursussen en 1-op-1 coaching.', icon: GraduationCap, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'memberships', title: 'Memberships', desc: 'Abonnementen, communities en groepen.', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'content', title: 'Content & Social Media', desc: 'YouTube, TikTok, podcasts en blogs.', icon: Megaphone, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'lead-gen', title: 'Lead Generatie', desc: 'Leads verzamelen en verkopen aan B2B.', icon: Mail, color: 'text-lime-500', bg: 'bg-lime-500/10', border: 'border-lime-500/20' },
];

export default function BusinessModelsPage() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-[1600px] mx-auto space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Applications <span className="text-primary">Launcher</span></h1>
        <p className="text-muted-foreground max-w-2xl text-sm">Beheer en schaal je verschillende verdienmodellen vanuit één centraal overzicht. Elk model heeft zijn eigen geïsoleerde agent-swarm en data-lake.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {models.map((model) => {
          const Icon = model.icon;
          return (
            <motion.div variants={itemVariants} key={model.id}>
              <Link 
                href={`/dashboard/${model.id}`}
                className={`flex flex-col p-6 rounded-[1.5rem] glass-panel border border-border/50 hover:border-primary/50 transition-all duration-300 group ${model.border} relative overflow-hidden h-full`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 transition-opacity opacity-10 group-hover:opacity-30 ${model.bg}`}></div>
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border bg-card ${model.border} ${model.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2">{model.title}</h3>
                <p className="text-sm text-muted-foreground flex-1">{model.desc}</p>
                
                <div className="mt-6 flex items-center text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  Open Model <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
}
