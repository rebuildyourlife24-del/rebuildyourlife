'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  experiencePoints: number;
  avatarUrl: string | null;
  role: string;
}

export default function LeaderboardWidget() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/syndicate/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.leaderboard);
        }
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const getRankColor = (index: number) => {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-slate-300';
    if (index === 2) return 'text-amber-600';
    return 'text-cyan-600';
  };

  return (
    <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.05)] backdrop-blur-sm">
      <h3 className="text-sm font-black text-cyan-400 tracking-widest uppercase flex items-center gap-2 mb-4 pb-4 border-b border-cyan-900/30">
        <Trophy className="w-4 h-4" /> The Elite Board
      </h3>
      
      {loading ? (
        <div className="text-xs text-cyan-500/50 uppercase tracking-widest animate-pulse">Loading Elite...</div>
      ) : (
        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 flex items-center justify-center font-black text-xs ${getRankColor(index)}`}>
                  {index < 3 ? <Medal className="w-5 h-5" /> : `#${index + 1}`}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {user.firstName || 'Anonymous'} {user.lastName || ''}
                  </span>
                  {user.role === 'ADMIN' && (
                    <span className="text-[9px] text-amber-500 uppercase tracking-widest font-black">Founder</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-cyan-900/30">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                <span className="text-xs font-black text-amber-400">{user.experiencePoints}</span>
              </div>
            </div>
          ))}
          {users.length === 0 && (
             <div className="text-xs text-cyan-500/50 uppercase tracking-widest">Nog geen data.</div>
          )}
        </div>
      )}
    </div>
  );
}
