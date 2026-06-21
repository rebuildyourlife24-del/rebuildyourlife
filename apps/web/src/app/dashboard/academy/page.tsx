import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { BookOpen, PlayCircle, CheckCircle2, Lock } from 'lucide-react';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch {
    return null;
  }
}

export default async function AcademyPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/auth/login');

  // Fetch courses with user progress
  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' },
    include: {
      lessons: true,
      userProgress: {
        where: { userId: user.id }
      }
    }
  });

  const userTier = user.subscriptionTier;
  const isPremiumUser = userTier !== 'FREE' && userTier !== 'STARTER';

  return (
    <div className="max-w-[1400px] mx-auto min-h-[85vh] p-8">
      {/* Header */}
      <div className="mb-12 border-b border-cyan-900/30 pb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-transparent blur-xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white tracking-tighter uppercase mb-2">
            De Academie
          </h1>
          <p className="text-cyan-500 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Training & Kennis Overdracht
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {courses.map((course) => {
          const isLocked = course.tierAccess === 'PREMIUM' && !isPremiumUser;
          const totalLessons = course.lessons.length;
          const completedLessons = course.userProgress.filter(p => p.completed).length;
          const progressPercentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

          return (
            <Card key={course.id} className={`bg-cyan-950/20 backdrop-blur-md border ${isLocked ? 'border-red-900/50' : 'border-cyan-500/30'} p-6 relative overflow-hidden group`}>
              {/* Thumbnail Placeholder */}
              <div className="w-full h-40 bg-black/50 rounded-lg mb-6 flex items-center justify-center border border-cyan-900/50 relative overflow-hidden">
                {isLocked ? (
                  <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Lock className="w-12 h-12 text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    <span className="text-red-500 text-xs font-black uppercase tracking-widest">Apex Operator Only</span>
                  </div>
                ) : (
                  <PlayCircle className="w-16 h-16 text-cyan-500/30" />
                )}
                {course.thumbnail && !isLocked && (
                  <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                )}
              </div>

              <div className="flex justify-between items-start mb-2">
                <h2 className="text-white font-bold text-lg">{course.title}</h2>
                {course.tierAccess === 'PREMIUM' && (
                  <span className="bg-red-900/50 text-red-400 text-[9px] px-2 py-1 rounded uppercase font-black tracking-wider">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-cyan-400/60 text-xs mb-6 h-12 line-clamp-3">
                {course.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[10px] uppercase font-bold text-cyan-500">
                  <span>Progressie</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <button 
                disabled={isLocked}
                className={`w-full py-3 rounded text-xs font-black tracking-widest uppercase transition-colors ${
                  isLocked 
                    ? 'bg-red-950/30 text-red-500/50 border border-red-900/30 cursor-not-allowed'
                    : 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-600/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                }`}
              >
                {isLocked ? 'Upgrade Required' : 'Start Module'}
              </button>
            </Card>
          );
        })}

        {courses.length === 0 && (
          <div className="col-span-3 text-center py-20 border border-cyan-900/30 rounded-xl bg-cyan-950/10">
            <BookOpen className="w-12 h-12 text-cyan-500/30 mx-auto mb-4" />
            <h3 className="text-cyan-300 font-bold uppercase tracking-widest mb-2">Geen Modules Gevonden</h3>
            <p className="text-cyan-500/50 text-sm">De academie wordt momenteel geüpdatet met nieuwe kennis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
