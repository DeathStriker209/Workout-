import React from 'react';
import { Check, Dumbbell, HeartPulse, BedDouble, Calendar } from 'lucide-react';
import { DayWorkout, WorkoutState } from '../types/workout';
import { WORKOUT_DAYS } from '../data/workoutData';

interface DaySelectorProps {
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
  workoutState: WorkoutState;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDayId,
  onSelectDay,
  workoutState,
}) => {
  // Determine today's day number in JavaScript (0 = Sunday, 1 = Monday, etc.)
  const todayJs = new Date().getDay();
  // Map JS day (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat) to workout days (1=Mon..7=Sun)
  const todayWorkoutDayNum = todayJs === 0 ? 7 : todayJs;

  const getDayCategoryIcon = (category: 'lift' | 'cardio' | 'rest') => {
    switch (category) {
      case 'lift':
        return <Dumbbell className="w-3.5 h-3.5" />;
      case 'cardio':
        return <HeartPulse className="w-3.5 h-3.5" />;
      case 'rest':
        return <BedDouble className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Select Training Day</span>
        </span>
        <span className="text-[11px] text-slate-500">
          Click any day to load exercises & sets
        </span>
      </div>

      {/* Grid of Day Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {WORKOUT_DAYS.map((day) => {
          const isSelected = day.id === selectedDayId;
          const isToday = day.dayNumber === todayWorkoutDayNum;
          const isDayCompleted = !!workoutState.completedDays[day.id];

          // Calculate completed sets for this day
          const totalDaySets = day.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
          const completedSets = day.exercises.reduce((sum, ex) => {
            return (
              sum +
              ex.sets.filter((s) => workoutState.setLogs[`${day.id}_${ex.id}_set_${s.setNum}`]?.completed).length
            );
          }, 0);

          return (
            <button
              key={day.id}
              onClick={() => onSelectDay(day.id)}
              className={`relative text-left p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between min-h-[96px] group active:scale-[0.98] ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : isDayCompleted
                  ? 'bg-slate-900/90 border-emerald-800/60 text-slate-200 hover:border-emerald-700'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Top row: Day name + Today indicator */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-slate-950 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {day.shortDay}
                </span>

                <div className="flex items-center gap-1">
                  {isToday && (
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider ${
                        isSelected ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      Today
                    </span>
                  )}
                  {isDayCompleted && (
                    <span
                      className={`p-0.5 rounded-full ${
                        isSelected ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                      title="Session marked completed"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>

              {/* Middle row: Program Title (Lift A, Cardio, etc.) */}
              <div className="my-1">
                <div className="flex items-center gap-1.5">
                  <span className={isSelected ? 'text-slate-950' : 'text-amber-400'}>
                    {getDayCategoryIcon(day.category)}
                  </span>
                  <span className="text-sm font-extrabold tracking-tight truncate">
                    {day.title}
                  </span>
                </div>
                <p
                  className={`text-[10px] truncate mt-0.5 ${
                    isSelected ? 'text-slate-900 font-medium' : 'text-slate-500'
                  }`}
                >
                  Day {day.dayNumber}
                </p>
              </div>

              {/* Bottom row: Set progress bar & count */}
              <div className="w-full pt-1.5 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                    {day.category === 'rest' ? 'Recovery' : `${completedSets}/${totalDaySets} Sets`}
                  </span>
                  {day.category !== 'rest' && totalDaySets > 0 && (
                    <span className={isSelected ? 'text-slate-950 font-bold' : 'text-amber-400'}>
                      {Math.round((completedSets / totalDaySets) * 100)}%
                    </span>
                  )}
                </div>

                {day.category !== 'rest' && (
                  <div
                    className={`w-full h-1 rounded-full overflow-hidden ${
                      isSelected ? 'bg-amber-600/50' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`h-full transition-all duration-300 ${
                        isSelected ? 'bg-slate-950' : isDayCompleted ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{
                        width: `${totalDaySets > 0 ? (completedSets / totalDaySets) * 100 : 0}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
