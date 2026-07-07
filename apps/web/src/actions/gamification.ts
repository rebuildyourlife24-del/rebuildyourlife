'use server';

import { prisma } from '@rebuildyourlife/database';
import { getSessionAction } from '@/app/actions/auth';

const RANKS = [
    { level: 1, name: "Initiate", xp: 0 },
    { level: 2, name: "Apprentice", xp: 1000 },
    { level: 3, name: "Operative", xp: 2500 },
    { level: 4, name: "Specialist", xp: 5000 },
    { level: 5, name: "Strategist", xp: 10000 },
    { level: 6, name: "Director", xp: 20000 },
    { level: 7, name: "Executive", xp: 35000 },
    { level: 8, name: "Commander", xp: 55000 },
    { level: 9, name: "Visionary", xp: 85000 },
    { level: 10, name: "Mastermind", xp: 130000 },
    { level: 11, name: "Syndicate Boss", xp: 200000 },
    { level: 12, name: "The Architect", xp: 350000 }
];

export async function getOperatorRank() {
  const session = await getSessionAction(); 
  const user = session?.user;
  
  if (!user) {
    return { level: 1, name: "Initiate", xp: 0, nextLevelXp: 1000, progress: 0 };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { experiencePoints: true, clearanceLevel: true }
  });

  const xp = dbUser?.experiencePoints || 0;
  
  let currentLevel = 1;
  let rankName = RANKS[0].name;
  let nextLevelXp = RANKS[1].xp;
  
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].xp) {
      currentLevel = RANKS[i].level;
      rankName = RANKS[i].name;
      
      if (i + 1 < RANKS.length) {
        nextLevelXp = RANKS[i + 1].xp;
      } else {
        nextLevelXp = xp; // Maxed out
      }
    }
  }

  // Calculate percentage to next level (relative to the current rank's base XP)
  let baseRankXp = 0;
  const currentRankIndex = RANKS.findIndex(r => r.level === currentLevel);
  if (currentRankIndex >= 0) {
      baseRankXp = RANKS[currentRankIndex].xp;
  }
  
  let progress = 100;
  if (nextLevelXp > baseRankXp) {
      progress = Math.min(100, Math.max(0, ((xp - baseRankXp) / (nextLevelXp - baseRankXp)) * 100));
  }

  return {
    level: currentLevel,
    name: rankName,
    xp: xp,
    nextLevelXp,
    progress
  };
}
