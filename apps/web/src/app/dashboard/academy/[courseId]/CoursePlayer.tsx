'use client';

import { useState } from 'react';
import { Play, CheckCircle2, Circle, ArrowLeft, Clock, BookOpen, ChevronRight, ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  duration: number;
  order: number;
  userProgress: {
    completed: boolean;
  }[];
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

interface CoursePlayerProps {
  course: Course;
  userId: string;
}

export default function CoursePlayer({ course, userId }: CoursePlayerProps) {
  // Vind de eerste les om te starten
  const allLessons = course.modules.flatMap(m => m.lessons);
  const firstUncompletedLesson = allLessons.find(l => !l.userProgress.some(p => p.completed)) || allLessons[0];
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(firstUncompletedLesson || null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    course.modules.reduce((acc, m) => {
      // Open standaard de module van de actieve les
      const hasActiveLesson = m.lessons.some(l => l.id === firstUncompletedLesson?.id);
      acc[m.id] = hasActiveLesson || m.order === 1;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Lokale state voor voortgang om de UI direct te updaten
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(
    allLessons.reduce((acc, l) => {
      acc[l.id] = l.userProgress.some(p => p.completed);
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [saving, setSaving] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleMarkComplete = async (lessonId: string, completed: boolean) => {
    setSaving(true);
    try {
      const response = await fetch('/api/academy/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          completed,
        }),
      });

      if (response.ok) {
        setCompletedLessons(prev => ({
          ...prev,
          [lessonId]: completed
        }));

        // Automatisch naar de volgende les gaan als we deze voltooien
        if (completed) {
          const currentIndex = allLessons.findIndex(l => l.id === lessonId);
          if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
            // Wacht heel even voor een betere UX, zodat de gebruiker het vinkje ziet
            setTimeout(() => {
              setCurrentLesson(allLessons[currentIndex + 1]);
              // Zorg dat de module van de volgende les is uitgeklapt
              const nextLessonModule = course.modules.find(m => 
                m.lessons.some(l => l.id === allLessons[currentIndex + 1].id)
              );
              if (nextLessonModule) {
                setExpandedModules(prev => ({
                  ...prev,
                  [nextLessonModule.id]: true
                }));
              }
            }, 1000);
          }
        }
      } else {
        console.error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setSaving(false);
    }
  };

  // Helper om duur te formatteren
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!currentLesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-cyan-500">
        <BookOpen className="w-16 h-16 mb-4 animate-pulse" />
        <p className="uppercase tracking-widest text-xs font-black">Geen lessen beschikbaar in deze module.</p>
        <Link href="/dashboard/academy" className="mt-4 text-xs text-white border border-cyan-500/30 px-4 py-2 rounded bg-cyan-950/20 hover:bg-cyan-600/30">
          Terug naar de Academie
        </Link>
      </div>
    );
  }

  const isCurrentCompleted = completedLessons[currentLesson.id];

  return (
    <div className="max-w-[1600px] mx-auto min-h-[85vh] p-4 lg:p-8 flex flex-col gap-6">
      {/* Navigatie header */}
      <div className="flex justify-between items-center border-b border-cyan-900/30 pb-4">
        <Link href="/dashboard/academy" className="text-cyan-400 hover:text-cyan-300 text-xs font-black tracking-widest uppercase flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Terug naar Academie
        </Link>
        <div className="text-right">
          <span className="text-[10px] text-cyan-500 uppercase tracking-widest font-black block">Training</span>
          <span className="text-white text-sm font-bold">{course.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Hoofdscherm (Speler en Content) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Videospeler */}
          <div className="w-full aspect-video bg-black rounded-lg border border-cyan-900/40 relative overflow-hidden group shadow-[0_0_30px_rgba(6,182,212,0.05)]">
            {currentLesson.videoUrl ? (
              <video 
                key={currentLesson.id}
                src={currentLesson.videoUrl} 
                controls 
                className="w-full h-full object-contain"
                poster="/assets/video-poster-dark.png" // Optioneel
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-cyan-600/40 bg-cyan-950/5">
                <Play className="w-20 h-20 mb-4 stroke-1" />
                <span className="text-xs uppercase tracking-widest font-black">Geen video beschikbaar voor deze les</span>
              </div>
            )}
          </div>

          {/* Les Info */}
          <div className="bg-cyan-950/10 border border-cyan-900/30 rounded-lg p-6 space-y-6 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-cyan-900/20 pb-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight uppercase mb-1">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center gap-4 text-[11px] text-cyan-400 uppercase font-black tracking-widest">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {formatDuration(currentLesson.duration)}
                  </span>
                  <span>•</span>
                  <span className="text-cyan-500">Voltooid: {isCurrentCompleted ? 'JA' : 'NEE'}</span>
                </div>
              </div>

              {/* Voltooi Knop */}
              <button
                onClick={() => handleMarkComplete(currentLesson.id, !isCurrentCompleted)}
                disabled={saving}
                className={`px-6 py-3 rounded text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 border ${
                  isCurrentCompleted
                    ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-950/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'bg-cyan-600/20 text-cyan-300 border-cyan-500/50 hover:bg-cyan-600/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                }`}
              >
                {isCurrentCompleted ? (
                  <>
                    <Check className="w-4 h-4" /> Les Voltooid
                  </>
                ) : (
                  <>
                    {saving ? 'Verwerken...' : 'Markeer als Voltooid'}
                  </>
                )}
              </button>
            </div>

            {/* Markdown / Tekst Content */}
            <div className="prose prose-invert max-w-none text-cyan-100/80 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {currentLesson.content}
            </div>
          </div>
        </div>

        {/* Sidebar (Modules & Lessen) */}
        <div className="bg-cyan-950/15 border border-cyan-900/30 rounded-lg p-4 space-y-4 backdrop-blur-sm">
          <h2 className="text-xs font-black uppercase text-cyan-400 tracking-widest border-b border-cyan-900/30 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Cursus Structuur
          </h2>

          <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
            {course.modules.map((module) => {
              const isExpanded = expandedModules[module.id];
              const completedInModule = module.lessons.filter(l => completedLessons[l.id]).length;
              const totalInModule = module.lessons.length;

              return (
                <div key={module.id} className="border border-cyan-900/20 rounded overflow-hidden bg-black/20">
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-3 flex justify-between items-center text-left hover:bg-cyan-900/10 transition-colors border-b border-cyan-900/10"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-cyan-500 block">
                        Fase {module.order} • {completedInModule}/{totalInModule} voltooid
                      </span>
                      <span className="text-white text-xs font-bold tracking-tight block">
                        {module.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-cyan-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-cyan-500" />
                    )}
                  </button>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="p-1 space-y-1 bg-black/10">
                      {module.lessons.map((lesson) => {
                        const isActive = currentLesson.id === lesson.id;
                        const isCompleted = completedLessons[lesson.id];

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={`w-full p-2.5 rounded text-left flex items-start gap-3 transition-all ${
                              isActive 
                                ? 'bg-cyan-600/10 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.05)]' 
                                : 'border border-transparent hover:bg-cyan-900/5 text-cyan-400/70 hover:text-cyan-300'
                            }`}
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-950/20" />
                              ) : isActive ? (
                                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                              ) : (
                                <Circle className="w-4 h-4 text-cyan-800" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className={`text-[11px] font-medium block truncate ${isActive ? 'text-white font-bold' : ''}`}>
                                {lesson.title}
                              </span>
                              <span className="text-[9px] text-cyan-600 font-bold tracking-widest block uppercase mt-0.5">
                                {formatDuration(lesson.duration)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
