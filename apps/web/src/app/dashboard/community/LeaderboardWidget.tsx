"use client";

import { useEffect, useState } from 'react';
import { Trophy, Loader2, Star, Zap } from 'lucide-react';

export default function LeaderboardWidget() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/syndicate/leaderboard');
      const data = await res.json();
      if (data.success) {
        setLeaders(data.leaderboard);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-amber-500" /></div>;
  }

  return (
    <div className="bg-black/60 border border-amber-500/20 rounded-2xl overflow-hidden sticky top-6">
      <div className="bg-amber-500/10 p-4 border-b border-amber-500/20 flex items-center gap-3">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-amber-500 font-black uppercase tracking-widest text-sm">Top Operators</h3>
      </div>
      
      <div className="p-4 space-y-4">
        {leaders.map((user, index) => (
          <div key={user.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                index === 0 ? 'bg-amber-500 text-black' : 
                index === 1 ? 'bg-zinc-300 text-black' : 
                index === 2 ? 'bg-orange-700 text-white' : 
                'bg-zinc-800 text-zinc-500'
              }`}>
                {index + 1}
              </div>
              <div>
                <p className="text-white text-sm font-bold truncate max-w-[120px]">{user.firstName} {user.lastName}</p>
                <div className="flex items-center gap-1 text-xs text-amber-500/70 font-mono">
                  <Star size={10} /> {user.experiencePoints || 0} XP
                </div>
              </div>
            </div>
            {index === 0 && <Zap className="w-4 h-4 text-amber-500 animate-pulse" />}
          </div>
        ))}

        {leaders.length === 0 && (
          <p className="text-xs text-zinc-500 text-center py-4">Nog geen XP verdiend in de Syndicate.</p>
        )}
      </div>
    </div>
  );
}
