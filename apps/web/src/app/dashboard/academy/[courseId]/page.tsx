import { getCourseDetailsAction, completeLessonAction } from '@/app/actions/academy';
import { notFound } from 'next/navigation';
import { ChevronLeft, PlayCircle, CheckCircle2, Lock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { AcademyVideoPlayer } from '@/components/AcademyVideoPlayer';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const result = await getCourseDetailsAction(params.courseId);
  
  if (!result.success || !result.course) {
    notFound();
  }

  const course = result.course;
  const lessons = course.modules?.flatMap((m: any) => m.lessons) || [];
  
  // Zoek de eerste niet-voltooide les, of gewoon de eerste les
  const activeLessonIndex = 0; 
  const activeLesson = lessons[activeLessonIndex];

  // Progress calculations
  const totalLessons = lessons.length;
  // TODO: calculate actual progress based on UserLessonProgress relations
  const completedLessons = 0;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row overflow-hidden bg-[#020202]">
      
      {/* Sidebar: Course Modules & Lessons */}
      <div className="w-full lg:w-[400px] h-full flex flex-col border-r border-white/5 bg-black/40">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 shrink-0">
          <Link href="/dashboard/academy" className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-purple-400 mb-4 transition-colors uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4 mr-1" /> Terug naar Academy
          </Link>
          <h2 className="text-xl font-bold text-white mb-2 leading-tight">{course.title}</h2>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-widest mb-2">
              <span>Voortgang</span>
              <span className="text-purple-400">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Lesson List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {lessons.map((lesson: any, index: number) => {
            // Mocking status for UI purposes
            const isCompleted = false;
            const isActive = index === activeLessonIndex;
            const isLocked = false;

            return (
              <button 
                key={lesson.id}
                className={`w-full text-left p-4 rounded-xl flex items-start gap-4 transition-all duration-200 border ${
                  isActive 
                    ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                    : isCompleted 
                      ? 'bg-white/5 border-transparent hover:bg-white/10'
                      : 'bg-black/40 border-transparent hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isActive ? (
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-20 animate-ping"></span>
                      <PlayCircle className="w-5 h-5 text-purple-400 relative z-10" />
                    </div>
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-zinc-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center text-[9px] font-mono text-zinc-500">
                      {index + 1}
                    </div>
                  )}
                </div>
                
                <div>
                  <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-zinc-300'} mb-1`}>
                    {lesson.title}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                    <span>{lesson.durationMinutes || 10} MIN</span>
                    {lesson.videoUrl && <span>• VIDEO</span>}
                    {lesson.content && <span>• TEXT</span>}
                  </p>
                </div>
              </button>
            );
          })}
          
          {lessons.length === 0 && (
            <div className="text-center p-6 border border-white/5 border-dashed rounded-xl">
              <p className="text-sm text-zinc-500">Nog geen lessen beschikbaar in deze cursus.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Video Player & Info */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative">
        {activeLesson ? (
          <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            
            {/* Video Player */}
            {activeLesson.videoUrl ? (
              <AcademyVideoPlayer videoUrl={activeLesson.videoUrl} lessonId={activeLesson.id} />
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center gap-4">
                <FileText className="w-12 h-12 text-zinc-600" />
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Tekst gebaseerde module</p>
              </div>
            )}
            
            {/* Lesson Info */}
            <div className="glass-cyber rounded-[1.5rem] p-8 border border-white/5">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                  <span className="inline-block text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold mb-2">
                    Module {activeLessonIndex + 1}
                  </span>
                  <h1 className="text-3xl font-black text-white">{activeLesson.title}</h1>
                </div>
                
                {/* Mark as Complete Action */}
                <form action={async () => {
                  'use server';
                  await completeLessonAction(activeLesson.id);
                }}>
                  <button type="submit" className="px-6 py-3 bg-white/5 hover:bg-emerald-500/20 text-white hover:text-emerald-400 border border-white/10 hover:border-emerald-500/50 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Markeer als Voltooid
                  </button>
                </form>
              </div>

              <div className="prose prose-invert prose-p:text-zinc-400 prose-headings:text-white max-w-none">
                {activeLesson.content ? (
                  <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
                ) : (
                  <p>Deze module bevat geen extra tekstuele content. Bekijk de video hierboven voor de volledige uitleg.</p>
                )}
              </div>
            </div>
            
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-zinc-500">Selecteer een les uit het menu.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
