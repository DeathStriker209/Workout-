import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Video,
  ImageIcon,
  Compass,
  Flame,
  RotateCcw,
  Timer,
  Play,
  Layers,
  ListOrdered
} from 'lucide-react';
import { Exercise, DayWorkout, CompletedSetLog, WorkoutState } from '../types/workout';
import { MuscleAnatomyViewer } from './MuscleAnatomyViewer';
import { ExerciseExecutionAnatomy } from './ExerciseExecutionAnatomy';
import { HoldStopwatch } from './HoldStopwatch';
import { playChime } from '../utils/audio';

interface ExerciseDetailPageProps {
  exercise: Exercise;
  day: DayWorkout;
  workoutState: WorkoutState;
  onBackToDayExercises: () => void;
  onToggleSet: (setNum: number, weight?: string, reps?: string) => void;
  onStartRestTimer: (seconds: number, exerciseName: string) => void;
}

export const ExerciseDetailPage: React.FC<ExerciseDetailPageProps> = ({
  exercise,
  day,
  workoutState,
  onBackToDayExercises,
  onToggleSet,
  onStartRestTimer,
}) => {
  // Mobile Segments: 'execution' (How to do + 3D anatomy) | 'anatomy' (Full body map) | 'sets' | 'form'
  const [activeSegment, setActiveSegment] = useState<'execution' | 'anatomy' | 'sets' | 'form'>('execution');
  const [activeAlternative, setActiveAlternative] = useState<string>(
    exercise.alternatives ? exercise.alternatives[0] : exercise.name
  );
  const [weights, setWeights] = useState<Record<number, string>>({});

  // Check how many sets are completed
  const completedSetsCount = exercise.sets.filter((s) => {
    return !!workoutState.setLogs[`${day.id}_${exercise.id}_set_${s.setNum}`]?.completed;
  }).length;

  const allSetsDone = completedSetsCount === exercise.sets.length && exercise.sets.length > 0;

  // Handler when "Set Done" is clicked:
  // Checks the set and triggers the 2-minute (120s) timer with +10s / -10s buttons!
  const handleSetDoneClick = (setNum: number, targetReps?: string) => {
    const key = `${day.id}_${exercise.id}_set_${setNum}`;
    const currentlyDone = !!workoutState.setLogs[key]?.completed;
    const currentWeight = weights[setNum] || workoutState.setLogs[key]?.weightKg || '';

    onToggleSet(setNum, currentWeight, targetReps);

    if (!currentlyDone) {
      // User just finished this set! Play feedback chime and start 2-min timer!
      playChime(880, 0.25);
      onStartRestTimer(120, `${exercise.name} (Set ${setNum})`);
    }
  };

  const handleWeightChange = (setNum: number, val: string) => {
    setWeights((prev) => ({ ...prev, [setNum]: val }));
  };

  const photoStart = exercise.photos?.[0];
  const photoEnd = exercise.photos?.[1];

  return (
    <div className="h-full flex flex-col justify-between max-w-md mx-auto w-full overflow-hidden select-none pb-1">
      {/* Top Bar with Back Button */}
      <div className="shrink-0 flex items-center justify-between border-b border-slate-800/80 pb-2">
        <button
          onClick={onBackToDayExercises}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-amber-400 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {day.shortDay}</span>
        </button>

        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
          {day.dayName} · {day.title}
        </span>
      </div>

      {/* Exercise Title & Summary Header */}
      <div className="shrink-0 space-y-1 my-1">
        <div className="flex items-center justify-between gap-1">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight font-display truncate">
            {exercise.alternatives ? activeAlternative : exercise.name}
          </h1>
          {exercise.isForearmGrip && (
            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded-md shrink-0">
              (F) Grip
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">
            <span className="text-amber-400 font-semibold">Target:</span> {exercise.targetArea}
          </span>
          <span className="font-mono text-slate-300 font-bold shrink-0">
            {completedSetsCount}/{exercise.sets.length} Sets Done
          </span>
        </div>

        {/* Alternative variation selector if available */}
        {exercise.alternatives && (
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-[10px]">
            <span className="text-slate-400 font-semibold px-1">Var:</span>
            {exercise.alternatives.map((alt) => (
              <button
                key={alt}
                onClick={() => setActiveAlternative(alt)}
                className={`flex-1 py-0.5 px-1.5 rounded-lg text-center transition-all truncate ${
                  activeAlternative === alt
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {alt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Screen-Fitted Mobile Segments Bar (Tabs) */}
      <div className="shrink-0 grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-[11px]">
        <button
          onClick={() => setActiveSegment('execution')}
          className={`py-1.5 px-1 rounded-xl font-bold transition-all text-center flex flex-col items-center gap-0.5 ${
            activeSegment === 'execution'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span className="text-[10px]">How-To 3D</span>
        </button>

        <button
          onClick={() => setActiveSegment('anatomy')}
          className={`py-1.5 px-1 rounded-xl font-bold transition-all text-center flex flex-col items-center gap-0.5 ${
            activeSegment === 'anatomy'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="text-[10px]">Body Map</span>
        </button>

        <button
          onClick={() => setActiveSegment('sets')}
          className={`py-1.5 px-1 rounded-xl font-bold transition-all text-center flex flex-col items-center gap-0.5 ${
            activeSegment === 'sets'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span className="text-[10px]">Sets & 2m</span>
        </button>

        <button
          onClick={() => setActiveSegment('form')}
          className={`py-1.5 px-1 rounded-xl font-bold transition-all text-center flex flex-col items-center gap-0.5 ${
            activeSegment === 'form'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span className="text-[10px]">Form & Tips</span>
        </button>
      </div>

      {/* Main Content Area (Fitted to Screen Height) */}
      <div className="flex-1 my-1.5 min-h-0 overflow-hidden flex flex-col justify-between">
        {/* TAB 1: 3D EXERCISE EXECUTION ANATOMY & BIOMECHANICS */}
        {activeSegment === 'execution' && (
          <div className="h-full w-full min-h-0 overflow-hidden">
            <ExerciseExecutionAnatomy
              exercise={exercise}
              onOpenFullBodyAnatomy={() => setActiveSegment('anatomy')}
            />
          </div>
        )}

        {/* TAB 2: SETS, REPS & 2-MIN REST TIMER */}
        {activeSegment === 'sets' && (
          <div className="h-full flex flex-col justify-between overflow-hidden space-y-2">
            {/* Quick 2-Minute Rest Timer Launch Banner */}
            <div className="shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Timer className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Rest Between Sets
                  </span>
                  <span className="text-xs font-bold text-slate-100">
                    2:00 Rest Interval
                  </span>
                </div>
              </div>

              <button
                onClick={() => onStartRestTimer(120, exercise.name)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1"
              >
                <Timer className="w-3.5 h-3.5" />
                <span>Start 2m</span>
              </button>
            </div>

            {/* Set by Set List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-0">
              {exercise.sets.map((set) => {
                const key = `${day.id}_${exercise.id}_set_${set.setNum}`;
                const isDone = !!workoutState.setLogs[key]?.completed;
                const weightVal = weights[set.setNum] || workoutState.setLogs[key]?.weightKg || '';

                return (
                  <div
                    key={set.setNum}
                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                      isDone
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    {/* Left: Set number & Reps */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-100">
                          Set {set.setNum}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">
                          · {set.targetReps} reps
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 block truncate">
                        {set.targetDescription || 'Strict form & full range'}
                      </span>
                    </div>

                    {/* Middle: Weight Input */}
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="text"
                        placeholder="kg / lbs"
                        value={weightVal}
                        onChange={(e) => handleWeightChange(set.setNum, e.target.value)}
                        className="w-16 px-2 py-1 text-center font-mono text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Right: Done Button (Starts 2m timer) */}
                    <button
                      onClick={() => handleSetDoneClick(set.setNum, set.targetReps)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Done</span>
                        </>
                      ) : (
                        <span>Done</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Optional Hold Stopwatch if this is a timed isometric exercise */}
            {exercise.sets.some((s) => s.isTimed || s.targetSeconds || (s.targetDescription && s.targetDescription.includes('sec'))) && (
              <div className="shrink-0 pt-1">
                <HoldStopwatch targetSeconds={45} label={`${exercise.name} Isometric Hold`} />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: 3D ANATOMY TARGET DIAGRAM */}
        {activeSegment === 'anatomy' && (
          <div className="h-full flex items-center justify-center min-h-0 overflow-hidden">
            <MuscleAnatomyViewer
              highlightedGroups={exercise.anatomyHighlightGroups}
              primaryMusclesText={exercise.primaryMuscles}
              secondaryMusclesText={exercise.secondaryMuscles}
              exerciseName={exercise.targetArea}
            />
          </div>
        )}

        {/* TAB 4: STEP-BY-STEP FORM & ACTION PHOTOS */}
        {activeSegment === 'form' && (
          <div className="h-full flex flex-col justify-between overflow-hidden bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5">
            <div className="shrink-0 flex items-center justify-between pb-1 border-b border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-amber-400">
                Execution Form & Reference Photos
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Setup vs Contraction
              </span>
            </div>

            {/* Quick 2-Photo Visual Preview */}
            {(photoStart || photoEnd) && (
              <div className="shrink-0 grid grid-cols-2 gap-2 my-1.5 h-24">
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center p-1">
                  {photoStart ? (
                    <img
                      src={photoStart.url}
                      alt={`${exercise.name} setup`}
                      className="w-full h-full object-contain rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-700" />
                  )}
                  <span className="absolute bottom-0.5 left-1 right-1 text-[8px] bg-slate-950/80 text-center font-bold text-slate-300 py-0.5 rounded">
                    1. Setup & Stretch
                  </span>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center p-1">
                  {photoEnd ? (
                    <img
                      src={photoEnd.url}
                      alt={`${exercise.name} peak`}
                      className="w-full h-full object-contain rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-700" />
                  )}
                  <span className="absolute bottom-0.5 left-1 right-1 text-[8px] bg-slate-950/80 text-center font-bold text-amber-400 py-0.5 rounded">
                    2. Peak Contraction
                  </span>
                </div>
              </div>
            )}

            {/* Step-by-Step Points and Form Tips */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 py-1 min-h-0 text-xs text-slate-300">
              {exercise.stepByStep && exercise.stepByStep.length > 0 ? (
                exercise.stepByStep.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-snug">{step}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">Execute with full range of motion, controlled eccentric tempo, and firm grip.</p>
              )}

              {/* Form Tips Box */}
              {exercise.formTips && exercise.formTips.length > 0 && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1 mt-1">
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Coach Form Cues:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200">
                    {exercise.formTips.map((cue, i) => (
                      <li key={i}>{cue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="shrink-0 pt-1 text-center">
              <span className="text-[9px] text-slate-500">
                Focus on progressive overload: record weights and quality reps each week.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Action Bar */}
      <div className="shrink-0 pt-1 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={onBackToDayExercises}
          className="text-slate-400 hover:text-slate-200 font-semibold text-[11px] flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <button
          onClick={() => onStartRestTimer(120, exercise.name)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl border border-slate-800 text-xs font-bold active:scale-95"
        >
          <Timer className="w-3.5 h-3.5" />
          <span>2m Rest Timer</span>
        </button>
      </div>
    </div>
  );
};
