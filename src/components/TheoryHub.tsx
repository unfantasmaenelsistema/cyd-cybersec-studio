import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  Award,
  Lightbulb,
  ChevronRight,
  Download,
  Sparkles,
  Trophy,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { TabType } from '../types';
import { THEORY_MODULES, TheoryModule } from '../data/theoryData';
import { cydAudio } from '../utils/audio';

interface TheoryHubProps {
  onNavigateTab: (tab: TabType) => void;
}

const PROGRESS_STORAGE_KEY = 'cyd-theory-completed-modules';
const ANSWERS_STORAGE_KEY = 'cyd-theory-correct-answers';

const loadStoredSet = (key: string): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
};

const levelBadgeColor: Record<TheoryModule['level'], string> = {
  Principiante: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
  Intermedio: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
  Avanzado: 'text-rose-400 bg-rose-500/20 border-rose-500/40'
};

export const TheoryHub: React.FC<TheoryHubProps> = ({ onNavigateTab }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(THEORY_MODULES[0].id);
  const [completedModules, setCompletedModules] = useState<Set<string>>(() => loadStoredSet(PROGRESS_STORAGE_KEY));
  const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(() => loadStoredSet(ANSWERS_STORAGE_KEY));
  const [selectedOptionByQuestion, setSelectedOptionByQuestion] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [studentName, setStudentName] = useState<string>('');

  const currentModule = useMemo(
    () => THEORY_MODULES.find((m) => m.id === selectedModuleId) || THEORY_MODULES[0],
    [selectedModuleId]
  );

  // Persist progress to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(Array.from(completedModules)));
    } catch {
      // Storage might be unavailable (private browsing, etc.) — ignore
    }
  }, [completedModules]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(Array.from(correctAnswers)));
    } catch {
      // ignore
    }
  }, [correctAnswers]);

  const totalModules = THEORY_MODULES.length;
  const completedCount = completedModules.size;
  const progressPercent = Math.round((completedCount / totalModules) * 100);
  const courseComplete = completedCount === totalModules;

  const handleSelectModule = (mod: TheoryModule) => {
    setSelectedModuleId(mod.id);
    cydAudio.playClick();
  };

  const handleSelectQuizOption = (questionKey: string, optionId: string) => {
    if (submittedQuestions.has(questionKey)) return;
    setSelectedOptionByQuestion((prev) => ({ ...prev, [questionKey]: optionId }));
    cydAudio.playClick();
  };

  const handleSubmitQuizAnswer = (moduleId: string, questionId: string) => {
    const questionKey = `${moduleId}:${questionId}`;
    const selectedId = selectedOptionByQuestion[questionKey];
    if (!selectedId || submittedQuestions.has(questionKey)) return;

    setSubmittedQuestions((prev) => new Set(prev).add(questionKey));

    const module = THEORY_MODULES.find((m) => m.id === moduleId);
    const question = module?.quiz.find((q) => q.id === questionId);
    const chosen = question?.options.find((o) => o.id === selectedId);

    if (chosen?.correct) {
      cydAudio.playSonarPing();
      setCorrectAnswers((prev) => {
        const next = new Set(prev).add(questionKey);
        // Check if this completes the module
        if (module && module.quiz.every((q) => next.has(`${moduleId}:${q.id}`))) {
          setCompletedModules((completedPrev) => {
            if (completedPrev.has(moduleId)) return completedPrev;
            return new Set(completedPrev).add(moduleId);
          });
        }
        return next;
      });
    } else {
      cydAudio.playDeauthAlarm();
    }
  };

  const handleDownloadCertificate = () => {
    cydAudio.playSonarPing();
    const name = studentName.trim() || 'Alumno/a de CYD CyberSec Studio';
    const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const content = `================================================================================
CERTIFICADO DE FINALIZACIÓN · CURSO TEÓRICO CYD CYBERSEC STUDIO
Un Fantasma en el Sistema (https://www.unfantasmaenelsistema.com/)
================================================================================

Se certifica que:

  ${name}

ha completado satisfactoriamente los ${totalModules} módulos teóricos del curso
"Ciberseguridad y Hardware Hacking con Placas CYD ESP32", incluyendo la
evaluación práctica asociada a cada módulo:

${THEORY_MODULES.map((m, i) => `  ${i + 1}. [${m.level}] ${m.title}`).join('\n')}

Fecha de finalización: ${date}

--------------------------------------------------------------------------------
Este certificado acredita la superación del contenido teórico-práctico de la
suite CYD CyberSec Studio con fines educativos y de divulgación en
ciberseguridad defensiva y ofensiva autorizada.
--------------------------------------------------------------------------------
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado_CYD_CyberSec_${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CURSO TEÓRICO · {totalModules} MÓDULOS</span>
            <span>·</span>
            <span>DE LA TEORÍA A LA PRÁCTICA EN UN CLIC</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>Ciberseguridad y Hardware Hacking con la CYD: el Curso</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Cada módulo explica el protocolo o concepto a nivel de bytes y termina con un enlace directo a la herramienta interactiva donde puedes verlo funcionar en tiempo real, más una evaluación corta para consolidar lo aprendido.
          </p>
        </div>

        {/* Overall progress */}
        <div className="w-full md:w-64 shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-mono">Progreso del curso</span>
            <span className="text-amber-400 font-bold font-mono">{completedCount}/{totalModules}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Certificate banner when course is complete */}
      {courseComplete && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-emerald-500/10 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-white">¡Curso completado! Los {totalModules} módulos están superados.</h3>
              <p className="text-xs text-slate-300 mt-0.5">Descarga tu certificado de finalización para dejar constancia del trabajo realizado.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Tu nombre para el certificado"
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500/50 w-48"
            />
            <button
              onClick={handleDownloadCertificate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Certificado</span>
            </button>
          </div>
        </div>
      )}

      {/* Main layout: module list + content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Module list */}
        <div className="lg:col-span-4 space-y-2">
          {THEORY_MODULES.map((mod) => {
            const isSelected = mod.id === selectedModuleId;
            const isCompleted = completedModules.has(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/70 ring-2 ring-amber-500/20 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-[10px] font-mono text-slate-500">Módulo {mod.order}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${levelBadgeColor[mod.level]}`}>
                      {mod.level}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {mod.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>~{mod.estimatedMinutes} min</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Module content */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            {/* Module header */}
            <div className="border-b border-slate-800 pb-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${levelBadgeColor[currentModule.level]}`}>
                  {currentModule.level}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{currentModule.tag}</span>
                {completedModules.has(currentModule.id) && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Módulo superado</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {currentModule.order}. {currentModule.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{currentModule.summary}</p>
            </div>

            {/* Sections */}
            <div className="space-y-5">
              {currentModule.sections.map((section, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 shrink-0" />
                    <span>{section.heading}</span>
                  </h4>
                  <div className="space-y-2.5 pl-5">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs text-slate-300 leading-relaxed font-sans">
                        {p}
                      </p>
                    ))}
                    {section.keyPoints && section.keyPoints.length > 0 && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                        {section.keyPoints.map((kp, kpIdx) => (
                          <div key={kpIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{kp}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Practice links */}
            {currentModule.practiceLinks.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pruébalo ahora mismo en la suite:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentModule.practiceLinks.map((link, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        cydAudio.playClick();
                        onNavigateTab(link.targetTab);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quiz */}
          {currentModule.quiz.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Evalúa lo aprendido</h3>
                  <p className="text-[11px] text-slate-400">Responde correctamente todas las preguntas para marcar este módulo como superado.</p>
                </div>
              </div>

              <div className="space-y-5">
                {currentModule.quiz.map((q) => {
                  const questionKey = `${currentModule.id}:${q.id}`;
                  const isSubmitted = submittedQuestions.has(questionKey);
                  const selectedId = selectedOptionByQuestion[questionKey];
                  const isCorrect = correctAnswers.has(questionKey);

                  return (
                    <div key={q.id} className="space-y-2.5">
                      <p className="text-xs font-semibold text-slate-200">{q.question}</p>
                      <div className="space-y-1.5">
                        {q.options.map((opt) => {
                          const isChosen = selectedId === opt.id;
                          let optionStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';
                          if (isSubmitted && isChosen) {
                            optionStyle = opt.correct
                              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                              : 'bg-rose-950/50 border-rose-500/60 text-rose-200';
                          } else if (isSubmitted && opt.correct) {
                            optionStyle = 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300';
                          } else if (isChosen) {
                            optionStyle = 'bg-slate-800 border-amber-500/50 text-white';
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectQuizOption(questionKey, opt.id)}
                              disabled={isSubmitted}
                              className={`w-full text-left p-2.5 rounded-lg border text-[11px] leading-relaxed transition-colors ${optionStyle} ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              {opt.text}
                              {isSubmitted && isChosen && (
                                <div className="mt-1.5 text-[10px] opacity-90">{opt.explanation}</div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {!isSubmitted ? (
                        <button
                          onClick={() => handleSubmitQuizAnswer(currentModule.id, q.id)}
                          disabled={!selectedId}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 transition-colors"
                        >
                          Comprobar Respuesta
                        </button>
                      ) : (
                        <div className={`flex items-center gap-1.5 text-[11px] font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                          <span>{isCorrect ? '¡Correcto!' : 'Revisa la explicación y vuelve a intentarlo en otro módulo similar.'}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next module nav */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Módulo {currentModule.order} de {totalModules}
            </span>
            {currentModule.order < totalModules && (
              <button
                onClick={() => {
                  const next = THEORY_MODULES.find((m) => m.order === currentModule.order + 1);
                  if (next) handleSelectModule(next);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <span>Siguiente Módulo</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
        <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Tu progreso se guarda automáticamente en este navegador (localStorage). Si cambias de dispositivo o borras los datos de navegación, el progreso del curso se reiniciará.
        </span>
      </div>
    </div>
  );
};
