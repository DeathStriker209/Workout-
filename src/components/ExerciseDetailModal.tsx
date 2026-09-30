import React, { useEffect } from 'react';
import { X, Check, Dumbbell, Compass, Sparkles, AlertCircle, Video } from 'lucide-react';
import { Exercise } from '../types/workout';
import { MuscleAnatomyViewer } from './MuscleAnatomyViewer';
import { ExerciseVisualGuide } from './ExerciseVisualGuide';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
  // Lock body scroll while modal is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                Exercise Masterclass
              </span>
              {exercise.isForearmGrip && (
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  (F) Forearm & Grip
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-100">{exercise.name}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Video & Kinematics Demonstration */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>Video & Motion Demonstration</span>
            </h4>
            <ExerciseVisualGuide exercise={exercise} />
          </div>

          {/* Biomechanical Anatomy Map */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Target Areas & Muscular Engagement
            </h4>
            <MuscleAnatomyViewer
              highlightedGroups={exercise.anatomyHighlightGroups}
              primaryMusclesText={exercise.primaryMuscles}
              secondaryMusclesText={exercise.secondaryMuscles}
              exerciseName={exercise.name}
            />
          </div>

          {/* Movement Description */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Movement Purpose & Biomechanics
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{exercise.description}</p>
          </div>

          {/* Form Guide Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Step-by-Step */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Execution Steps
              </span>
              <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
                {exercise.stepByStep.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pro Tips & Mistakes */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Key Form Cues
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {exercise.formTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {exercise.commonMistakes.length > 0 && (
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-2">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Common Pitfalls to Avoid
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    {exercise.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Tempo: <span className="font-mono text-amber-400">{exercise.visualDemonstration.tempo}</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
