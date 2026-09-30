import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, RotateCcw, Clock, Target, Sparkles, Flame } from 'lucide-react';
import { DayWorkout, WorkoutState } from '../types/workout';
import { playChime } from '../utils/audio';

interface WorkoutSessionTrackerProps {
  currentDay: DayWorkout;
  workoutState: WorkoutState;
  onCompleteSession: (dayId: string) => void;
  onResetSession: (dayId: string) => void;
}

export const WorkoutSessionTracker: React.FC<WorkoutSessionTrackerProps> = ({
  currentDay,
  workoutState,
  onCompleteSession,
  onResetSession,
}) => {
  const isRestDay = currentDay.category === 'rest';

  // Calculate stats for current day
  const totalSets = currentDay.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = currentDay.exercises.reduce((sum, ex) => {
    return (
      sum +
      ex.sets.filter((s) => workoutState.setLogs[`${currentDay.id}_${ex.id}_set_${s.setNum}`]?.completed).length
    );
  }, 0);

  const percent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const isMarkedCompleted = !!workoutState.completedDays[currentDay.id];

  // Weekly stats
  const completedDaysCount = Object.keys(workoutState.completedDays).length;

  const handleFinishWorkout = () => {
    onCompleteSession(currentDay.id);
    playChime(880, 0.4);
    setTimeout(() => playChime(1320, 0.5), 180);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#ffffff'],
      });
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Session Title & Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
              {currentDay.dayName} · Session Overview
            </span>
            {isMarkedCompleted && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Session Completed
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            {currentDay.title}: {currentDay.subtitle}
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDay.estimatedDurationMin > 0 ? `~${currentDay.estimatedDurationMin} min` : 'Rest Day'}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDay.exercises.length} Exercises</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400/90 font-medium">
              Focus: {currentDay.focusAreas.join(', ')}
            </span>
          </div>
        </div>

        {/* Right Side: Progress Ring & Action Controls */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-slate-800/80 shrink-0">
          {!isRestDay ? (
            <>
              {/* Progress Metric */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="19"
                      fill="transparent"
                      stroke="#1e293b"
                      strokeWidth="4"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="19"
                      fill="transparent"
                      stroke={isMarkedCompleted ? '#10b981' : '#f59e0b'}
                      strokeWidth="4"
                      strokeDasharray={119.38}
                      strokeDashoffset={119.38 - (119.38 * percent) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute font-mono text-xs font-bold text-slate-100">
                    {percent}%
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Session Sets
                  </span>
                  <div className="font-mono text-sm font-bold text-slate-100">
                    <span className="text-amber-400">{completedSets}</span> / {totalSets}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <button
                  onClick={handleFinishWorkout}
                  disabled={isMarkedCompleted && percent === 100}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 whitespace-nowrap ${
                    isMarkedCompleted
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{isMarkedCompleted ? 'Completed!' : 'Complete Session'}</span>
                </button>

                {completedSets > 0 && (
                  <button
                    onClick={() => onResetSession(currentDay.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    title="Reset sets for this session"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Rest & Muscle Growth Day
                </span>
                <span className="text-[11px] text-slate-400">
                  Allow fibers to repair and replenish glycogen.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Linear progress bar across full session */}
      {!isRestDay && (
        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-4">
          <div
            className={`h-full transition-all duration-300 ${
              isMarkedCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
};
