'use client';

import { useState } from 'react';
import { Play, CheckCircle2, Circle, ArrowLeft, Clock, BookOpen, ChevronRight, ChevronDown, Check, Download, BrainCircuit, XCircle } from 'lucide-react';
import Link from 'next/link';

interface QuizAnswer {
  id: string;
  answer: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  questions: QuizQuestion[];
  userPassed: boolean;
}

interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  duration: number;
  order: number;
  resources: Resource[];
  quizzes: Quiz[];
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
  const allLessons = course.modules.flatMap(m => m.lessons);
  const firstUncompletedLesson = allLessons.find(l => !l.userProgress.some(p => p.completed)) || allLessons[0];
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(firstUncompletedLesson || null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    course.modules.reduce((acc, m) => {
      const hasActiveLesson = m.lessons.some(l => l.id === firstUncompletedLesson?.id);
      acc[m.id] = hasActiveLesson || m.order === 1;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(
    allLessons.reduce((acc, l) => {
      acc[l.id] = l.userProgress.some(p => p.completed);
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [saving, setSaving] = useState(false);
  const [xpPop, setXpPop] = useState<number | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number, passed: boolean, message: string } | null>(null);
  const [passedQuizzes, setPassedQuizzes] = useState<Record<string, boolean>>(
    allLessons.flatMap(l => l.quizzes).reduce((acc, q) => {
      acc[q.id] = q.userPassed;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const submitQuiz = async (quizId: string) => {
    setQuizSubmitting(true);
    try {
      const response = await fetch('/api/academy/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, answers: quizAnswers })
      });
      
      const data = await response.json();
      if (response.ok) {
        setQuizResult({ score: data.score, passed: data.passed, message: data.message });
        if (data.passed) {
          setPassedQuizzes(prev => ({ ...prev, [quizId]: true }));
        }
        if (data.xpAwarded > 0) {
          setXpPop(data.xpAwarded);
          setTimeout(() => setXpPop(null), 3000);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleMarkComplete = async (lessonId: string, completed: boolean) => {
    setSaving(true);
    try {
      const response = await fetch('/api/academy/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, completed }),
      });

      const data = await response.json();

      if (response.ok) {
        setCompletedLessons(prev => ({ ...prev, [lessonId]: completed }));
        
        if (data.xpAwarded && data.xpAwarded > 0) {
          setXpPop(data.xpAwarded);
          setTimeout(() => setXpPop(null), 3000);
        }

        if (completed) {
          const currentIndex = allLessons.findIndex(l => l.id === lessonId);
          if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
            setTimeout(() => {
              setCurrentLesson(allLessons[currentIndex + 1]);
              setQuizAnswers({});
              setQuizResult(null);
              const nextLessonModule = course.modules.find(m => 
                m.lessons.some(l => l.id === allLessons[currentIndex + 1].id)
              );
              if (nextLessonModule) {
                setExpandedModules(prev => ({ ...prev, [nextLessonModule.id]: true }));
              }
            }, 1000);
          }
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setSaving(false);
    }
  };

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
    <div className="max-w-[1600px] mx-auto min-h-[85vh] p-4 lg:p-8 flex flex-col gap-6 relative">
      
      {/* XP Pop Animation */}
      {xpPop && (
        <div className="fixed top-20 right-10 z-50 animate-bounce bg-amber-500/20 border border-amber-500 text-amber-300 font-black px-6 py-4 rounded-xl shadow-[0_0_40px_rgba(245,158,11,0.4)] flex flex-col items-center">
          <span className="text-3xl">+{xpPop} XP</span>
          <span className="text-[10px] uppercase tracking-widest mt-1">Verdiend!</span>
        </div>
      )}

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
        {/* Hoofdscherm */}
        <div className="lg:col-span-3 space-y-6">
          {/* Videospeler */}
          <div className="w-full aspect-video bg-black rounded-lg border border-cyan-900/40 relative overflow-hidden group shadow-[0_0_30px_rgba(6,182,212,0.05)]">
            {currentLesson.videoUrl ? (
              <video 
                key={currentLesson.id}
                src={currentLesson.videoUrl} 
                controls 
                className="w-full h-full object-contain"
                poster="/assets/video-poster-dark.png"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-cyan-600/40 bg-cyan-950/5">
                <Play className="w-20 h-20 mb-4 stroke-1" />
                <span className="text-xs uppercase tracking-widest font-black">Geen video beschikbaar voor deze les</span>
              </div>
            )}
          </div>

          {/* Les Info & Voltooien */}
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
                  <><Check className="w-4 h-4" /> Les Voltooid</>
                ) : (
                  <>{saving ? 'Verwerken...' : 'Markeer als Voltooid'}</>
                )}
              </button>
            </div>

            {/* Resources / Vault */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className="bg-cyan-950/20 border border-cyan-900/30 rounded p-4 mb-6">
                <h3 className="text-[10px] font-black uppercase text-cyan-400 tracking-widest mb-3 flex items-center gap-2">
                  <Download className="w-3 h-3" /> Downloads & Resources
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.resources.map(res => (
                    <a key={res.id} href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-black/40 border border-cyan-900/40 hover:border-cyan-500/50 rounded transition-colors group">
                      <div className="p-2 bg-cyan-950 rounded text-cyan-400 group-hover:bg-cyan-900 transition-colors">
                        <Download className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{res.title}</div>
                        <div className="text-[9px] text-cyan-600 uppercase tracking-widest">{res.type}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Text Content */}
            <div className="prose prose-invert max-w-none text-cyan-100/80 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {currentLesson.content}
            </div>

            {/* Quizzes */}
            {currentLesson.quizzes && currentLesson.quizzes.length > 0 && (
              <div className="mt-8 pt-8 border-t border-cyan-900/30 space-y-8">
                {currentLesson.quizzes.map(quiz => {
                  const hasPassed = passedQuizzes[quiz.id];
                  return (
                    <div key={quiz.id} className="bg-black/40 border border-indigo-900/40 rounded-lg overflow-hidden">
                      <div className="bg-indigo-950/30 p-4 border-b border-indigo-900/40 flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> {quiz.title}
                          </h3>
                          {quiz.description && <p className="text-xs text-indigo-400/60 mt-1">{quiz.description}</p>}
                        </div>
                        {hasPassed && (
                          <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest uppercase rounded">
                            Behaald
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6 space-y-6">
                        {quizResult && !hasPassed && (
                          <div className={`p-4 rounded border ${quizResult.passed ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400' : 'bg-red-950/20 border-red-500/40 text-red-400'} flex items-start gap-3`}>
                            {quizResult.passed ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <XCircle className="w-5 h-5 mt-0.5" />}
                            <div>
                              <div className="font-bold text-sm">Score: {quizResult.score}%</div>
                              <div className="text-xs mt-1">{quizResult.message}</div>
                            </div>
                          </div>
                        )}

                        {!hasPassed ? (
                          <div className="space-y-8">
                            {quiz.questions.map(q => (
                              <div key={q.id} className="space-y-3">
                                <div className="text-sm font-bold text-white">{q.question}</div>
                                <div className="space-y-2">
                                  {q.answers.map(a => (
                                    <label key={a.id} className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${quizAnswers[q.id] === a.id ? 'bg-indigo-900/40 border-indigo-500/50 text-white' : 'bg-black/30 border-cyan-900/20 text-cyan-500 hover:bg-cyan-950/20 hover:border-cyan-800'}`}>
                                      <input 
                                        type="radio" 
                                        name={q.id} 
                                        value={a.id}
                                        checked={quizAnswers[q.id] === a.id}
                                        onChange={() => handleAnswerSelect(q.id, a.id)}
                                        className="hidden"
                                      />
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${quizAnswers[q.id] === a.id ? 'border-indigo-400' : 'border-cyan-800'}`}>
                                        {quizAnswers[q.id] === a.id && <div className="w-2 h-2 rounded-full bg-indigo-400" />}
                                      </div>
                                      <span className="text-xs">{a.answer}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <button 
                              onClick={() => submitQuiz(quiz.id)}
                              disabled={quizSubmitting || Object.keys(quizAnswers).length < quiz.questions.length}
                              className="w-full py-3 rounded text-xs font-black tracking-widest uppercase bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {quizSubmitting ? 'Bezig met nakijken...' : 'Dien in & Ontvang XP'}
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                            <h4 className="text-lg font-black text-white">Quiz Succesvol Afgerond!</h4>
                            <p className="text-xs text-emerald-400/70 mt-1">Je hebt de XP voor deze quiz verdiend.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
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
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-500" /> : <ChevronRight className="w-4 h-4 text-cyan-500" />}
                  </button>

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
