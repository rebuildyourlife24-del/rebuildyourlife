'use client';

import { useEffect, useState } from 'react';
import { Shield, Package, Mail, Brain, Check, X, Loader2, Video } from 'lucide-react';

interface PendingItem {
  id: string;
  type: 'HYPOTHESIS' | 'SHOPIFY_PRODUCT' | 'EMAIL_CAMPAIGN' | 'MARKETING_VIDEO';
  title: string;
  description: string;
  meta: string;
}

export default function SentinelDashboard() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/sentinel/pending');
      const data = await res.json();
      if (data.success) {
        const formatted: PendingItem[] = [];
        
        data.data.hypotheses.forEach((h: any) => {
          formatted.push({
            id: h.id,
            type: 'HYPOTHESIS',
            title: `Agent ${h.agent?.name || 'System'}: Nieuwe Hypothese`,
            description: h.claim,
            meta: `Domein: ${h.domain}`
          });
        });

        data.data.shopifyProducts.forEach((p: any) => {
          formatted.push({
            id: p.id,
            type: 'SHOPIFY_PRODUCT',
            title: p.title,
            description: p.description.replace(/<[^>]+>/g, ''), // strip HTML
            meta: `Prijs: €${p.price} | Shopify DRAFT`
          });
        });

        data.data.emailCampaigns?.forEach((e: any) => {
          formatted.push({
            id: e.id,
            type: 'EMAIL_CAMPAIGN',
            title: e.name,
            description: e.subject,
            meta: `Campagne DRAFT`
          });
        });

        data.data.marketingVideos?.forEach((v: any) => {
          formatted.push({
            id: v.id,
            type: 'MARKETING_VIDEO',
            title: v.title,
            description: v.script.replace(/<[^>]+>/g, '').substring(0, 150) + '...',
            meta: `AI Video Script DRAFT`
          });
        });

        setItems(formatted);
      }
    } catch (err) {
      alert('Kan de Sentinel wachtrij niet laden');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, type: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/sentinel/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, action })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setItems(prev => prev.filter(i => i.id !== id));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Fout bij verwerken van de actie.');
    } finally {
      setProcessingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HYPOTHESIS': return <Brain className="w-5 h-5 text-purple-400" />;
      case 'SHOPIFY_PRODUCT': return <Package className="w-5 h-5 text-green-400" />;
      case 'EMAIL_CAMPAIGN': return <Mail className="w-5 h-5 text-blue-400" />;
      case 'MARKETING_VIDEO': return <Video className="w-5 h-5 text-pink-400" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            Sentinel War Room
          </h1>
          <p className="text-white/60 mt-1">
            Handmatige goedkeuring van door AI gegenereerde producten, campagnes en beslissingen.
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-400 font-semibold">{items.length} Acties in de wachtrij</span>
        </div>
      </div>

      {/* Grid of Actions */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/50">
          Er staan momenteel geen acties in de wachtrij.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="text-xs font-bold text-white/50 uppercase tracking-wider">
                    {item.type.replace('_', ' ')}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-3">{item.description}</p>
                <div className="text-xs font-mono text-white/40 mb-6 bg-black/20 p-2 rounded">
                  {item.meta}
                </div>
              </div>
              
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => handleAction(item.id, item.type, 'APPROVE')}
                  disabled={processingId === item.id}
                  className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {processingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Approve
                </button>
                <button
                  onClick={() => handleAction(item.id, item.type, 'REJECT')}
                  disabled={processingId === item.id}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {processingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
