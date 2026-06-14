import { Shield, BrainCircuit, Activity } from "lucide-react";

export default function GuaranteePage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 selection:bg-gold-500/30">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-semibold tracking-wide uppercase mb-8">
            <Shield className="w-4 h-4" />
            <span>Juridisch Verankerd</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            The 100% Recovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-600">Guarantee</span>.
          </h1>
          <p className="mt-6 text-xl leading-8 text-zinc-400 max-w-3xl mx-auto">
            Geen loze beloftes. Wij garanderen jouw financiële onafhankelijkheid met keihard kapitaal vanuit ons eigen platform-waarborgfonds.
          </p>
        </div>
      </div>

      {/* Opt-In Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 border-t border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Twee Routes. Jij Bepaalt.</h2>
            <p className="text-lg text-zinc-400 mb-8">
              Ons platform is gebouwd om vermogen te creëren. Je bent <strong>nooit verplicht</strong> om de controle over je inkomsten uit handen te geven. Je kiest zelf hoe je de AI inzet.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 h-fit">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Route A: Zelfstandig Bouwen</h3>
                  <p className="text-zinc-500 mt-2">Gebruik de AI Opportunity Engine puur om extra inkomsten (E-com, SaaS) te genereren. Jij betaalt zelf je vaste lasten en beheert je eigen bankrekening.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 bg-red-900/20 border border-red-500/20 rounded-lg p-2 h-fit">
                  <BrainCircuit className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Route B: Luxury Administration (Opt-In)</h3>
                  <p className="text-zinc-500 mt-2">Heb je moeite met overzicht of diepe schulden? Geef de AI een mandaat. Wij nemen de betalingen over, onderhandelen met schuldeisers, en garanderen je 2x het gemiddelde ZZP-loon als vrij leefgeld.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent blur-3xl rounded-full" />
            <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-4">Het Waarborgfonds</h3>
              <p className="text-zinc-400 mb-6">
                Elke AI-onderneming op ons platform draagt 0,5% van de winst af aan de centrale kluis. Dit geld vormt de "Rebuild Guarantee Vault". 
              </p>
              <div className="p-4 bg-black/50 rounded-xl border border-gold-500/20">
                <p className="text-sm text-gold-400/80 mb-2 font-mono">LIVE FUND BACKING</p>
                <p className="text-3xl font-bold text-white">100% Gedekt</p>
              </div>
              <p className="text-xs text-zinc-600 mt-4">
                * Mocht de AI door externe marktfactoren falen om je schulden af te betalen, vult dit fonds het tekort aan. Je bent 100% gegarandeerd.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
