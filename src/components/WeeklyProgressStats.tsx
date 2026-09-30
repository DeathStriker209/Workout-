import React from 'react';
import { CheckCircle2, Trophy, Flame, Dumbbell, RotateCcw, ChevronRight, Calendar, HeartPulse, BedDouble } from 'lucide-react';
import { WorkoutState } from '../types/workout';
import { WORKOUT_DAYS } from '../data/workoutData';

interface WeeklyProgressStatsProps {
  workoutState: WorkoutState;
  onSelectDay: (dayId: string) => void;
  onResetSession: (dayId: string) => void;
  onResetAll: () => void;
}

export const WeeklyProgressStats: React.FC<WeeklyProgressStatsProps> = ({
  workoutState,
  onSelectDay,
  onResetSession,
  onResetAll,
}) => {
  const completedDaysKeys = Object.keys(workoutState.completedDays);
  const totalCompletedDays = completedDaysKeys.length;

  // Calculate total sets completed across all days
  const totalSetsCompleted = Object.values(workoutState.setLogs).filter((l) => l.completed).length;

  // Total prescribed sets in the entire 7-day program
  const totalWeeklySets = WORKOUT_DAYS.reduce((acc, day) => {
    return acc + day.exercises.reduce((s, ex) => s + ex.sets.length, 0);
  }, 0);

  const overallWeeklyPercent = totalWeeklySets > 0 ? Math.round((totalSetsCompleted / totalWeeklySets) * 100) : 0;

  return (
    <div className="h-full flex flex-col justify-between max-w-md mx-auto w-full overflow-hidden select-none pb-1">
      {/* Top Header Card */}
      <div className="shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              Weekly Progress Dashboard
            </h2>
          </div>
          <button
            onClick={onResetAll}
            className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 active:scale-95"
            title="Reset weekly progress"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
          <span className="text-slate-400">7-Day Split Adherence:</span>
          <span className="font-mono text-amber-400 font-bold">{overallWeeklyPercent}% Complete</span>
        </div>
        {/* Adherence Bar */}
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-1">
          <div
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full transition-all duration-300"
            style={{ width: `${Math.min(100, overallWeeklyPercent)}%` }}
          />
        </div>
      </div>

      {/* 3 Metric Cards - Formatted for Mobile Screen Fit */}
      <div className="shrink-0 grid grid-cols-3 gap-2 my-2">
        {/* Sessions Done */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-400">Sessions</span>
          <div className="font-mono text-lg font-extrabold text-slate-100 tabular-nums my-0.5">
            {totalCompletedDays} <span className="text-xs text-slate-500 font-normal">/ 7</span>
          </div>
          <span className="text-[9px] text-amber-400 font-semibold truncate">Completed</span>
        </div>

        {/* Total Sets */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-400">Sets</span>
          <div className="font-mono text-lg font-extrabold text-amber-400 tabular-nums my-0.5">
            {totalSetsCompleted}
          </div>
          <span className="text-[9px] text-slate-400 font-mono truncate">of {totalWeeklySets} sets</span>
        </div>

        {/* Adherence % */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-400">Volume</span>
          <div className="font-mono text-lg font-extrabold text-emerald-400 tabular-nums my-0.5">
            {overallWeeklyPercent}%
          </div>
          <span className="text-[9px] text-slate-400 truncate">Target Hit</span>
        </div>
      </div>

      {/* 7-Day Interactive Program Matrix (Fitted to Screen) */}
      <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between min-h-0 overflow-hidden">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-300">
            7-Day Program Matrix
          </span>
          <span className="text-[9px] text-slate-500 font-mono">Tap day to train</span>
        </div>

        {/* 7-Day Quick Row / Grid - Fits perfectly in viewport */}
        <div className="flex-1 grid grid-rows-7 gap-1 min-h-0">
          {WORKOUT_DAYS.map((day) => {
            const isCompleted = !!workoutState.completedDays[day.id];
            const totalDaySets = day.exercises.reduce((s, ex) => s + ex.sets.length, 0);
            const doneDaySets = day.exercises.reduce((s, ex) => {
              return (
                s +
                ex.sets.filter((st) => workoutState.setLogs[`${day.id}_${ex.id}_set_${st.setNum}`]?.completed).length
              );
            }, 0);

            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`w-full px-2.5 py-1 rounded-xl border flex items-center justify-between text-left transition-all active:scale-[0.99] ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400'
                    : doneDaySets > 0
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 font-mono text-[11px] font-bold text-slate-300 shrink-0">
                    {day.shortDay}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {day.title}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate hidden xs:inline">
                    · {day.focusAreas[0]}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {doneDaySets}/{totalDaySets} sets
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="shrink-0 mt-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300 font-medium">Split Status:</span>
        </div>
        <span className="text-amber-400 font-bold">
          {totalCompletedDays === 7 ? '🎉 Weekly Split Finished!' : `${7 - totalCompletedDays} Sessions Remaining`}
        </span>
      </div>
    </div>
  );
};
