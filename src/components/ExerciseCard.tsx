import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  Video,
  Flame,
  AlertCircle,
  ImageIcon
} from 'lucide-react';
import { Exercise, CompletedSetLog } from '../types/workout';
import { ExerciseVisualGuide } from './ExerciseVisualGuide';
import { MuscleAnatomyViewer } from './MuscleAnatomyViewer';
import { HoldStopwatch } from './HoldStopwatch';

interface ExerciseCardProps {
  exercise: Exercise;
  dayId: string;
  setLogs: Record<string, CompletedSetLog>;
  onToggleSet: (setNum: number, weight?: string, reps?: string) => void;
  onStartRestTimer: (seconds: number, exerciseName: string) => void;
  onOpenDetailedModal: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  dayId,
  setLogs,
  onToggleSet,
  onStartRestTimer,
  onOpenDetailedModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnatomy, setShowAnatomy] = useState(false);
  const [activeAlternative, setActiveAlternative] = useState<string>(
    exercise.alternatives ? exercise.alternatives[0] : exercise.name
  );
  const [weights, setWeights] = useState<Record<number, string>>({});

  // Calculate sets completed for this exercise
  const completedCount = exercise.sets.filter((set) => {
    const key = `${dayId}_${exercise.id}_set_${set.setNum}`;
    return !!setLogs[key]?.completed;
  }).length;

  const allSetsCompleted = completedCount === exercise.sets.length && exercise.sets.length > 0;

  const handleSetCheck = (setNum: number, defaultReps?: string) => {
    const key = `${dayId}_${exercise.id}_set_${setNum}`;
    const currentlyDone = !!setLogs[key]?.completed;
    const currentWeight = weights[setNum] || setLogs[key]?.weightKg || '';

    onToggleSet(setNum, currentWeight, defaultReps);

    // If marking as done and has rest time, start rest timer automatically
    if (!currentlyDone && exercise.defaultRestSeconds > 0) {
      onStartRestTimer(exercise.defaultRestSeconds, exercise.name);
    }
  };

  const handleWeightChange = (setNum: number, val: string) => {
    setWeights((prev) => ({ ...prev, [setNum]: val }));
  };

  return (
    <article
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        allSetsCompleted
          ? 'bg-slate-900/50 border-emerald-900/50 shadow-sm'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 shadow-md'
      }`}
    >
      {/* Top Header Row */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                {exercise.alternatives ? activeAlternative : exercise.name}
              </h3>

              {exercise.isForearmGrip && (
                <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Forearm & Grip (F)
                </span>
              )}

              {allSetsCompleted && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Done
                </span>
              )}
            </div>

            {/* Target Area and Primary Muscle Summary */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-slate-300 font-medium">Target: {exercise.targetArea}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-400/90 truncate max-w-xs">
                Engages: {exercise.primaryMuscles.slice(0, 2).join(', ')}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowAnatomy(!showAnatomy)}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                showAnatomy
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
              title="Show target muscle anatomy"
            >
              <Flame className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenDetailedModal}
              className="p-2 rounded-xl text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-amber-400 transition-colors"
              title="Open full video guide & technique breakdown"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Exercise Photos Quick Preview Strip */}
        {exercise.photos && exercise.photos.length > 0 && (
          <div className="flex items-center gap-2.5 p-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 shrink-0">
              {exercise.photos.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setIsExpanded(true)}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-700/80 cursor-pointer hover:border-amber-400 transition-colors group/thumb"
                  title={`${exercise.name} - ${p.label}`}
                >
                  <img
                    src={p.url}
                    alt={`${exercise.name} step ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-200"
                  />
                  <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-mono px-1 rounded text-amber-400">
                    {idx === 0 ? 'Start' : 'End'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-slate-300 block truncate">
                Exercise Form Pictures ({exercise.photos.length} Stages)
              </span>
              <button
                onClick={() => setIsExpanded(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 mt-0.5"
              >
                <span>View start & contraction images</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Alternative Selector if Exercise has choice (e.g. Shoulder Press or Lateral Raise) */}
        {exercise.alternatives && (
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium px-2">Select variation:</span>
            {exercise.alternatives.map((alt) => (
              <button
                key={alt}
                onClick={() => setActiveAlternative(alt)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeAlternative === alt
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {alt}
              </button>
            ))}
          </div>
        )}

        {/* SETS INTERACTIVE CHECKLIST */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
            <span>Prescribed Sets & Target Reps</span>
            <span className="font-mono text-amber-400">
              {completedCount}/{exercise.sets.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {exercise.sets.map((set) => {
              const key = `${dayId}_${exercise.id}_set_${set.setNum}`;
              const isDone = !!setLogs[key]?.completed;
              const savedWeight = setLogs[key]?.weightKg || weights[set.setNum] || '';

              return (
                <div
                  key={set.setNum}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                      : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Set {set.setNum}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {set.targetReps ? `${set.targetReps} reps` : set.targetDescription}
                    </span>
                  </div>

                  {/* Weight / Note logger */}
                  {!set.isTimed && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <input
                        type="text"
                        placeholder="Weight (kg)"
                        value={savedWeight}
                        onChange={(e) => handleWeightChange(set.setNum, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2.5 py-1 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono text-xs"
                      />
                    </div>
                  )}

                  {/* Check button */}
                  <button
                    onClick={() => handleSetCheck(set.setNum, set.targetReps)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${isDone ? 'stroke-[3]' : 'text-slate-400'}`} />
                    <span>{isDone ? 'Completed' : 'Mark Set Done'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Timed Hold Stopwatch if timed exercise */}
          {exercise.sets.some((s) => s.isTimed) && (
            <div className="mt-2">
              <HoldStopwatch
                targetSeconds={exercise.sets[0]?.targetSeconds}
                label={exercise.sets[0]?.targetDescription || 'Hold Timer'}
                onFinish={(elapsed) => {
                  // Find next incomplete set and complete it with elapsed time
                  const nextIncomplete = exercise.sets.find((s) => {
                    const k = `${dayId}_${exercise.id}_set_${s.setNum}`;
                    return !setLogs[k]?.completed;
                  });
                  if (nextIncomplete) {
                    handleSetCheck(nextIncomplete.setNum, `${elapsed}s`);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Anatomical Map Drawer */}
        {showAnatomy && (
          <div className="mt-3 pt-3 border-t border-slate-800">
            <MuscleAnatomyViewer
              highlightedGroups={exercise.anatomyHighlightGroups}
              primaryMusclesText={exercise.primaryMuscles}
              secondaryMusclesText={exercise.secondaryMuscles}
              exerciseName={exercise.name}
              compact
            />
          </div>
        )}

        {/* Form Cues & Visual Preview Expand Button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 font-medium transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{isExpanded ? 'Hide Form Guide & Video' : 'Show Form Guide, Visuals & Video'}</span>
          </button>

          {exercise.defaultRestSeconds > 0 && (
            <button
              onClick={() => onStartRestTimer(exercise.defaultRestSeconds, exercise.name)}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Rest ({exercise.defaultRestSeconds}s)</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Accordion: Visual Kinematics + Step-by-Step + Tips */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 space-y-4">
          <ExerciseVisualGuide exercise={exercise} />

          {/* Form Guidance Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Step by Step */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="font-semibold text-slate-200 uppercase tracking-wider block text-[11px]">
                Execution Steps
              </span>
              <ol className="space-y-2 list-decimal list-inside text-slate-300">
                {exercise.stepByStep.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pro Form Cues & Common Mistakes */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                <span className="font-semibold text-amber-400 uppercase tracking-wider block text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Key Form Cues
                </span>
                <ul className="space-y-1 text-slate-300">
                  {exercise.formTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {exercise.commonMistakes.length > 0 && (
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 space-y-1.5">
                  <span className="font-semibold text-red-400 uppercase tracking-wider block text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Mistakes to Avoid
                  </span>
                  <ul className="space-y-1 text-slate-400">
                    {exercise.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
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
      )}
    </article>
  );
};
