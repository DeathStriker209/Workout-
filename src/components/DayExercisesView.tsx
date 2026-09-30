import React from 'react';
import { ArrowLeft, ChevronRight, Check, CheckCircle2, Dumbbell, Sparkles, Trophy } from 'lucide-react';
import { DayWorkout, Exercise, WorkoutState } from '../types/workout';

interface DayExercisesViewProps {
  day: DayWorkout;
  workoutState: WorkoutState;
  onBackToDays: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onCompleteDaySession: () => void;
}

export const DayExercisesView: React.FC<DayExercisesViewProps> = ({
  day,
  workoutState,
  onBackToDays,
  onSelectExercise,
  onCompleteDaySession,
}) => {
  const isCompleted = !!workoutState.completedDays[day.id];

  // Total sets and completed sets for this day
  const totalSets = day.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = day.exercises.reduce((sum, ex) => {
    return (
      sum +
      ex.sets.filter((s) => workoutState.setLogs[`${day.id}_${ex.id}_set_${s.setNum}`]?.completed).length
    );
  }, 0);

  const percent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="h-full flex flex-col justify-between max-w-md mx-auto w-full overflow-hidden select-none pb-1">
      {/* Top Navigation & Back Button */}
      <div className="shrink-0 flex items-center justify-between border-b border-slate-800/80 pb-2">
        <button
          onClick={onBackToDays}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-amber-400 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Days</span>
        </button>

        <span className="text-[10px] font-mono text-slate-400">
          {day.dayName} · Day {day.dayNumber}
        </span>
      </div>

      {/* Day Overview Banner (Compact Screen Fit) */}
      <div className="shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2 my-1 shadow-md">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400 block">
              {day.dayName} Workout
            </span>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight font-display truncate">
              {day.title}: {day.subtitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 shrink-0">
            <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
              {completedSets}/{totalSets} Sets
            </span>
            <span className="text-[10px] font-bold text-emerald-400">
              {percent}%
            </span>
          </div>
        </div>

        {/* Areas It Hits Highlight */}
        <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
          <span className="text-amber-400 font-bold uppercase tracking-wider">Hits:</span>
          <span className="text-slate-300 truncate">{day.focusAreas.join(' · ')}</span>
        </div>

        {/* Progress Bar */}
        {totalSets > 0 && (
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>

      {/* Prescribed Exercises Section (ONLY shows exercises for this day) */}
      <div className="flex-1 my-1 overflow-y-auto pr-0.5 space-y-1.5 min-h-0">
        {day.exercises.map((exercise, idx) => {
          const exerciseSetsDone = exercise.sets.filter((s) => {
            return !!workoutState.setLogs[`${day.id}_${exercise.id}_set_${s.setNum}`]?.completed;
          }).length;
          const isExDone = exerciseSetsDone === exercise.sets.length && exercise.sets.length > 0;

          const photoThumb = exercise.photos?.[0]?.url;

          return (
            <button
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              className={`w-full text-left p-2.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2.5 group active:scale-[0.99] ${
                isExDone
                  ? 'bg-slate-900/90 border-emerald-900/60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Visual Thumbnail or Number */}
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {photoThumb ? (
                    <img src={photoThumb} alt={exercise.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-mono text-xs font-bold text-slate-400">{idx + 1}</span>
                  )}
                  {isExDone && (
                    <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                      {exercise.name}
                    </h2>
                    {exercise.isForearmGrip && (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 rounded shrink-0">
                        (F)
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                    <span className="text-slate-300 font-medium truncate">{exercise.targetArea}</span>
                    <span className="text-slate-600">·</span>
                    <span className="font-mono text-amber-400/90 shrink-0">
                      {exercise.sets.length} {exercise.sets.length === 1 ? 'Set' : 'Sets'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Done Badge & Chevron */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[11px] text-slate-300">
                  {exerciseSetsDone}/{exercise.sets.length}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Session Complete Button */}
      <div className="shrink-0 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={onBackToDays}
          className="text-slate-400 hover:text-slate-200 font-semibold text-xs flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <button
          onClick={onCompleteDaySession}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 active:scale-95"
        >
          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Mark Day Complete</span>
        </button>
      </div>
    </div>
  );
};
