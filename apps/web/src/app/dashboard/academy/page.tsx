import { getCoursesAction } from '@/app/actions/academy';
import { Card } from '@/components/ui/Card';
import { GraduationCap, ArrowRight, Play, CheckCircle2, Flame, Lock } from 'lucide-react';
import Link from 'next/link';

// Dynamisch voor server rendering
export const dynamic = 'force-dynamic';

export default async function AcademyPage() {
  // Fetch courses on server-side
  const result = await getCoursesAction();
  const courses = result.success && result.courses ? result.courses : [];

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-purple-500/20 glass-cyber p-8 md:p-12 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <GraduationCap className="w-3 h-3 mr-2" />
                The Academy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Level Up Your <span className="text-purple-400">Skillset</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Hier smeed je het fundament van je online imperium. Bestudeer de modules, verdien XP en speel nieuwe AI agents vrij door theorie in praktijk te brengen.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-black/50 border border-white/10 rounded-xl p-4 min-w-[120px] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-mono">Huidige Streak</p>
                <p className="text-2xl font-black text-white flex items-center">3 <Flame className="w-5 h-5 text-amber-500 ml-1" /></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any, idx: number) => {
          const isLocked = false; // Add logic based on user tier if needed
          
          return (
            <Link key={course.id} href={`/dashboard/academy/${course.id}`} className="group">
              <div className="glass-cyber rounded-[1.5rem] overflow-hidden h-full flex flex-col hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] border border-white/5 hover:border-purple-500/30 transition-all">
                {/* Course Thumbnail */}
                <div className="h-48 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  
                  {course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-20 h-20 rounded-full border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-purple-400 opacity-50" />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md">
                      {course._count?.modules || 0} Modules
                    </span>
                  </div>
                  
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center">
                      <div className="bg-black/80 border border-white/10 rounded-full p-4">
                        <Lock className="w-6 h-6 text-zinc-400" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Course Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-zinc-400 font-light flex-1 line-clamp-3 mb-4">
                    {course.description || 'Geen beschrijving beschikbaar.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    {/* Placeholder Progress Bar */}
                    <div className="flex-1 mr-4">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[15%]"></div>
                      </div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 font-mono">
                        15% Voltooid
                      </p>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:border-purple-400 transition-colors">
                      <Play className="w-4 h-4 text-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {courses.length === 0 && (
          <div className="col-span-full py-20 text-center border border-white/10 border-dashed rounded-[2rem] bg-white/5">
            <GraduationCap className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Geen cursussen gevonden</h3>
            <p className="text-zinc-500">De content database is momenteel leeg. Gebruik de admin om modules toe te voegen.</p>
          </div>
        )}
      </div>
    </div>
  );
}
