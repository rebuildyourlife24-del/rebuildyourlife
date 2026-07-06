'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Server, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { generateProductProposalsAction } from '../../actions/genesis';
import { pushProductToShopifyAction } from '../../actions/shopify-genesis';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function GenesisCashflowPage() {
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [pushStatus, setPushStatus] = useState<Record<string, string>>({});

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateProductProposalsAction();
    if (res.success && res.data) {
      setProposals(res.data);
    } else {
      console.error(res.error);
      alert("Fout bij genereren: " + res.error);
    }
    setLoading(false);
  };

  const handleApprove = async (product: any) => {
    setPushStatus(prev => ({ ...prev, [product.id]: 'Pushing...' }));
    
    const res = await pushProductToShopifyAction({
      title: product.title,
      description: product.description,
      price: product.suggestedPrice
    });

    if (res.success) {
      setPushStatus(prev => ({ ...prev, [product.id]: 'Succesvol gepusht naar velvrex (Draft)' }));
    } else {
      setPushStatus(prev => ({ ...prev, [product.id]: 'Fout: ' + res.error }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Server className="h-8 w-8 text-[#00f0ff]" />
            Genesis Protocol: Cash-Flow Mode
          </h1>
          <p className="text-gray-400 mt-1">
            Genereer winnende producten via AI en push ze met één klik naar je Shopify store.
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="bg-[#00f0ff] hover:bg-[#00c0cc] text-black font-bold">
          {loading ? 'Analyseren...' : 'Genereer 3 Product Voorstellen'}
        </Button>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {proposals.length === 0 && !loading && (
          <Card className="p-12 bg-black/40 border-[#00f0ff]/20 text-center">
            <Cpu className="h-16 w-16 text-[#00f0ff]/30 mx-auto mb-4" />
            <h2 className="text-xl text-white font-medium">Systeem is Stand-by</h2>
            <p className="text-gray-400 mt-2">Klik op genereren om het RYL OS productonderzoek te starten.</p>
          </Card>
        )}

        {proposals.map((p) => (
          <motion.div key={p.id} variants={itemVariants}>
            <Card className="p-6 bg-black/60 border border-[#00f0ff]/30 hover:border-[#00f0ff]/60 transition-all">
              <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{p.title}</h2>
                  <p className="text-gray-300">{p.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#d4af37]">€{p.suggestedPrice}</div>
                  <div className="text-xs text-gray-500">Inkoop: ±€{p.costPrice}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm uppercase tracking-widest text-[#00f0ff] font-bold">Thomas vd Leck Validatie (5 Punten)</h4>
                  
                  <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
                    <strong className="text-white block mb-1 text-sm"><span className="text-[#00f0ff]">1.</span> Probleemoplossend / Vraag</strong>
                    <p className="text-gray-400 text-xs leading-relaxed">{p.rationale.problemSolving}</p>
                  </div>
                  
                  <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
                    <strong className="text-white block mb-1 text-sm"><span className="text-[#00f0ff]">2.</span> Winstmarge</strong>
                    <p className="text-gray-400 text-xs leading-relaxed">{p.rationale.profitMargin}</p>
                  </div>

                  <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
                    <strong className="text-white block mb-1 text-sm"><span className="text-[#00f0ff]">3.</span> Impuls (Wow-factor)</strong>
                    <p className="text-gray-400 text-xs leading-relaxed">{p.rationale.impulse}</p>
                  </div>

                  <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
                    <strong className="text-white block mb-1 text-sm"><span className="text-[#00f0ff]">4.</span> Concurrentie / Trend</strong>
                    <p className="text-gray-400 text-xs leading-relaxed">{p.rationale.competition}</p>
                  </div>

                  <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
                    <strong className="text-white block mb-1 text-sm"><span className="text-[#00f0ff]">5.</span> Logistiek</strong>
                    <p className="text-gray-400 text-xs leading-relaxed">{p.rationale.logistics}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="bg-[#00f0ff]/5 p-4 rounded-xl border border-[#00f0ff]/20 mb-6">
                    <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                      Goedkeuring Vereist
                    </h5>
                    <p className="text-sm text-gray-400">
                      Als je akkoord gaat, injecteert RYL OS dit product onmiddellijk in velvrex.myshopify.com als Concept (Draft). Klanten zien dit pas als jij de afbeeldingen hebt toegevoegd en op 'Actief' klikt.
                    </p>
                  </div>

                  <Button 
                    onClick={() => handleApprove(p)} 
                    disabled={pushStatus[p.id] === 'Pushing...' || pushStatus[p.id]?.includes('Succesvol')}
                    className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-bold text-lg"
                  >
                    {pushStatus[p.id] || 'Geef Akkoord & Push naar Shopify'}
                    {!pushStatus[p.id] && <ArrowRight className="ml-2 w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
