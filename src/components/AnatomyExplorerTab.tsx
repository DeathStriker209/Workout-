import React, { useState } from 'react';
import { MuscleGroup, Exercise } from '../types/workout';
import { WORKOUT_DAYS, MUSCLE_METADATA } from '../data/workoutData';
import { MuscleAnatomyViewer } from './MuscleAnatomyViewer';
import { Target, ChevronRight, Video, Flame, X, Dumbbell } from 'lucide-react';

interface AnatomyExplorerTabProps {
  onSelectExercise: (exercise: Exercise, dayId: string) => void;
}

export const AnatomyExplorerTab: React.FC<AnatomyExplorerTabProps> = ({ onSelectExercise }) => {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('back');
  const [showExercisesDrawer, setShowExercisesDrawer] = useState<boolean>(false);

  // Find all exercises across all 7 days targeting the selected muscle
  const matchingExercises: { exercise: Exercise; dayId: string; dayTitle: string }[] = [];
  WORKOUT_DAYS.forEach((day) => {
    day.exercises.forEach((ex) => {
      if (ex.anatomyHighlightGroups.includes(selectedMuscle)) {
        matchingExercises.push({ exercise: ex, dayId: day.id, dayTitle: `${day.dayName} (${day.title})` });
      }
    });
  });

  const muscleMeta = MUSCLE_METADATA[selectedMuscle] || {
    label: selectedMuscle.toUpperCase(),
    area: 'Full Body',
    description: 'Targeted muscle group involved in lifting execution.',
  };

  const muscleList: MuscleGroup[] = [
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'forearms',
    'quadriceps',
    'hamstrings',
    'glutes',
    'abs',
    'calves',
  ];

  return (
    <div className="h-full flex flex-col justify-between max-w-md mx-auto w-full overflow-hidden select-none">
      {/* Top Header & Compact Muscle Chips Bar */}
      <div className="shrink-0 space-y-2 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              3D Anatomy Target Map
            </h2>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
            {muscleMeta.label}
          </span>
        </div>

        {/* Horizontal Quick Muscle Chips (Fit-the-screen compact bar) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {muscleList.map((m) => {
            const isSelected = m === selectedMuscle;
            const label = MUSCLE_METADATA[m]?.label || m;
            return (
              <button
                key={m}
                onClick={() => setSelectedMuscle(m)}
                className={`py-1 px-2.5 rounded-xl text-center text-[10px] font-bold transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Biomechanical Muscle Model (Screen-Fitted) */}
      <div className="flex-1 flex items-center justify-center my-1 min-h-0 overflow-hidden">
        <MuscleAnatomyViewer
          highlightedGroups={[selectedMuscle]}
          primaryMusclesText={[muscleMeta.label]}
          secondaryMusclesText={[]}
          exerciseName={muscleMeta.area}
          onMuscleTap={(group) => setSelectedMuscle(group)}
        />
      </div>

      {/* Bottom Fitted Summary Card with 1-Tap Slide-Up Drawer */}
      <div className="shrink-0 mt-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400 block">
              Active Biomechanical Focus
            </span>
            <h3 className="text-xs font-bold text-slate-100 truncate">
              {muscleMeta.label} <span className="text-slate-400 font-normal">({muscleMeta.area})</span>
            </h3>
          </div>

          <button
            onClick={() => setShowExercisesDrawer(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 active:scale-95 shrink-0"
          >
            <Dumbbell className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Exercises ({matchingExercises.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[10px] text-slate-400 line-clamp-1">
          {muscleMeta.description}
        </p>
      </div>

      {/* Slide-Up Drawer Modal for Targeted Exercises (Keeps main screen fitted!) */}
      {showExercisesDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-4 max-h-[80vh] flex flex-col shadow-2xl animate-slideUp">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Target: <span className="text-amber-400">{muscleMeta.label}</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {matchingExercises.length} Movements in 7-Day Routine
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowExercisesDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Exercise Items inside the Drawer only */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
              {matchingExercises.map(({ exercise, dayId, dayTitle }, idx) => (
                <button
                  key={`${dayId}-${exercise.id}-${idx}`}
                  onClick={() => {
                    setShowExercisesDrawer(false);
                    onSelectExercise(exercise, dayId);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/50 transition-all flex items-center justify-between gap-2 group active:scale-[0.99]"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                        {exercise.name}
                      </span>
                      {exercise.isForearmGrip && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 rounded">
                          (F)
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate font-mono">
                      {dayTitle} · {exercise.sets.length} Sets
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-slate-500 group-hover:text-amber-400">
                    <span className="text-[10px] font-bold hidden sm:inline">Open</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            {/* Close Drawer Button */}
            <button
              onClick={() => setShowExercisesDrawer(false)}
              className="mt-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
            >
              Done Viewing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
