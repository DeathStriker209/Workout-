import React from 'react';
import { ChevronRight, Dumbbell, HeartPulse, BedDouble, CheckCircle2, Flame, Calendar, Clock, Target } from 'lucide-react';
import { DayWorkout, WorkoutState } from '../types/workout';
import { WORKOUT_DAYS } from '../data/workoutData';

interface DaysListViewProps {
  onSelectDay: (day: DayWorkout) => void;
  workoutState: WorkoutState;
}

export const DaysListView: React.FC<DaysListViewProps> = ({ onSelectDay, workoutState }) => {
  // Determine current day of week (0=Sun, 1=Mon, ..., 6=Sat)
  const todayJs = new Date().getDay();
  const todayWorkoutDayNum = todayJs === 0 ? 7 : todayJs;

  const getDayCategoryIcon = (category: 'lift' | 'cardio' | 'rest') => {
    switch (category) {
      case 'lift':
        return <Dumbbell className="w-4 h-4 text-amber-400" />;
      case 'cardio':
        return <HeartPulse className="w-4 h-4 text-sky-400" />;
      case 'rest':
        return <BedDouble className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col justify-between max-w-md mx-auto w-full overflow-hidden select-none pb-1">
      {/* Editorial Header */}
      <div className="shrink-0 space-y-0.5 border-b border-slate-800/80 pb-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">
            7-Day Split Routine
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Mon · Sun
          </span>
        </div>
        <h1 className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight font-display">
          Weekly Training Schedule
        </h1>
        <p className="text-[11px] text-slate-400 truncate">
          Tap any day to see its exercises & target 3D muscle anatomy.
        </p>
      </div>

      {/* Days List: Monday to Sunday in clean, compact mobile list format */}
      <div className="flex-1 my-1.5 overflow-y-auto pr-0.5 space-y-1.5 min-h-0">
        {WORKOUT_DAYS.map((day) => {
          const isToday = day.dayNumber === todayWorkoutDayNum;
          const isCompleted = !!workoutState.completedDays[day.id];

          // Compute sets completed
          const totalDaySets = day.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
          const completedDaySets = day.exercises.reduce((sum, ex) => {
            return (
              sum +
              ex.sets.filter((s) => workoutState.setLogs[`${day.id}_${ex.id}_set_${s.setNum}`]?.completed).length
            );
          }, 0);

          return (
            <button
              key={day.id}
              onClick={() => onSelectDay(day)}
              className={`w-full text-left p-2.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2.5 group active:scale-[0.99] ${
                isCompleted
                  ? 'bg-slate-900/90 border-emerald-900/60 hover:border-emerald-700/80'
                  : isToday
                  ? 'bg-slate-900/90 border-amber-500/50 hover:border-amber-400 shadow-md shadow-amber-500/5'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Left Column: Icon & Day Details */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                      : isToday
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 group-hover:text-amber-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : getDayCategoryIcon(day.category)}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                      {day.dayName}
                    </h2>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({day.title})
                    </span>

                    {isToday && (
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Areas It Hits */}
                  <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                    <span className="text-amber-400/90 font-semibold shrink-0">Hits:</span>
                    <span className="text-slate-300 truncate">{day.focusAreas.slice(0, 2).join(' · ')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Sets counter & Chevron */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-slate-200 block">
                    {completedDaySets}/{totalDaySets}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">
                    sets
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Bottom Status Bar */}
      <div className="shrink-0 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Rest intervals: 2-minute default</span>
        <span className="text-amber-400 font-bold">7-Day Plan Active</span>
      </div>
    </div>
  );
};
