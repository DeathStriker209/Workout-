import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DaysListView } from './components/DaysListView';
import { DayExercisesView } from './components/DayExercisesView';
import { ExerciseDetailPage } from './components/ExerciseDetailPage';
import { RestTimerFloating } from './components/RestTimerFloating';
import { WeeklyProgressStats } from './components/WeeklyProgressStats';
import { AnatomyExplorerTab } from './components/AnatomyExplorerTab';
import { MobileBottomNav } from './components/MobileBottomNav';
import { WORKOUT_DAYS } from './data/workoutData';
import { DayWorkout, Exercise, WorkoutState, CompletedSetLog } from './types/workout';
import confetti from 'canvas-confetti';
import { playChime } from './utils/audio';
import { Wifi, Battery, Signal } from 'lucide-react';

const STORAGE_KEY = 'apexlift_workout_tracker_state_v4';

type ScreenView = 'days' | 'day_exercises' | 'exercise_detail';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('days');
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'workout' | 'anatomy' | 'history'>('workout');

  // Workout Progress State
  const [workoutState, setWorkoutState] = useState<WorkoutState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          setLogs: parsed.setLogs || {},
          completedDays: parsed.completedDays || {},
          activeDayId: parsed.activeDayId || 'day-1',
          selectedExerciseModalId: null,
          currentRestTimer: null,
        };
      }
    } catch {
      // Fallback
    }

    return {
      setLogs: {},
      completedDays: {},
      activeDayId: 'day-1',
      selectedExerciseModalId: null,
      currentRestTimer: null,
    };
  });

  // Floating Rest Timer (2 minutes default with +10s / -10s)
  const [restTimerState, setRestTimerState] = useState<{
    visible: boolean;
    seconds: number;
    name: string;
  } | null>(null);


  // Current system clock for mobile status bar
  const [clockTime, setClockTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setClockTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          setLogs: workoutState.setLogs,
          completedDays: workoutState.completedDays,
          activeDayId: workoutState.activeDayId,
        })
      );
    } catch {
      // Ignore storage quota
    }
  }, [workoutState.setLogs, workoutState.completedDays, workoutState.activeDayId]);

  // Handle browser popstate / back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        setCurrentScreen(e.state.screen || 'days');
        setSelectedDayId(e.state.dayId || null);
        setSelectedExerciseId(e.state.exerciseId || null);
      } else {
        setCurrentScreen('days');
        setSelectedDayId(null);
        setSelectedExerciseId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Currently active day and exercise objects
  const currentDay = WORKOUT_DAYS.find((d) => d.id === selectedDayId) || WORKOUT_DAYS[0];
  const currentExercise =
    currentDay.exercises.find((ex) => ex.id === selectedExerciseId) || currentDay.exercises[0];

  // NAVIGATION HANDLERS:
  // 1. From Days List -> Click Day -> Open Day Exercises Page
  const handleSelectDay = (day: DayWorkout) => {
    setSelectedDayId(day.id);
    setSelectedExerciseId(null);
    setCurrentScreen('day_exercises');
    setActiveTab('workout');
    window.history.pushState({ screen: 'day_exercises', dayId: day.id }, '', `#${day.id}`);
  };

  // 2. From Day Exercises -> Click Exercise -> Open Exercise Detail Page
  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExerciseId(exercise.id);
    setCurrentScreen('exercise_detail');
    window.history.pushState(
      { screen: 'exercise_detail', dayId: selectedDayId, exerciseId: exercise.id },
      '',
      `#${selectedDayId}-${exercise.id}`
    );
  };

  // 3. Back from Exercise Detail -> Back to Day Exercises
  const handleBackToDayExercises = () => {
    setSelectedExerciseId(null);
    setCurrentScreen('day_exercises');
    window.history.pushState({ screen: 'day_exercises', dayId: selectedDayId }, '', `#${selectedDayId}`);
  };

  // 4. Back from Day Exercises -> Back to Days List
  const handleBackToDays = () => {
    setSelectedDayId(null);
    setSelectedExerciseId(null);
    setCurrentScreen('days');
    window.history.pushState({ screen: 'days' }, '', '#days');
  };

  // SET CHECKING & REST TIMER (2-MIN WITH +10s / -10s)
  const handleToggleSet = (
    dayId: string,
    exerciseId: string,
    setNum: number,
    weight?: string,
    defaultReps?: string
  ) => {
    const key = `${dayId}_${exerciseId}_set_${setNum}`;
    setWorkoutState((prev) => {
      const currentDone = !!prev.setLogs[key]?.completed;
      const updatedLogs: Record<string, CompletedSetLog> = {
        ...prev.setLogs,
        [key]: {
          completed: !currentDone,
          weightKg: weight ?? prev.setLogs[key]?.weightKg ?? '',
          actualReps: defaultReps ?? prev.setLogs[key]?.actualReps ?? '',
          completedAt: !currentDone ? new Date().toISOString() : undefined,
        },
      };

      // Check if all sets for this day are completed
      const dayObj = WORKOUT_DAYS.find((d) => d.id === dayId);
      const updatedCompletedDays = { ...prev.completedDays };

      if (dayObj) {
        const totalSets = dayObj.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
        const doneCount = dayObj.exercises.reduce((acc, ex) => {
          return (
            acc +
            ex.sets.filter((s) => updatedLogs[`${dayId}_${ex.id}_set_${s.setNum}`]?.completed).length
          );
        }, 0);

        if (doneCount === totalSets && totalSets > 0) {
          updatedCompletedDays[dayId] = {
            completedAt: new Date().toISOString(),
            completedSets: doneCount,
            totalSets,
          };
          try {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24'],
            });
          } catch {
            // ignore
          }
        }
      }

      return {
        ...prev,
        setLogs: updatedLogs,
        completedDays: updatedCompletedDays,
      };
    });
  };

  // Start 2-min timer
  const handleStartRestTimer = (seconds = 120, name = 'Rest Interval') => {
    setRestTimerState({
      visible: true,
      seconds,
      name,
    });
  };

  // Complete entire session
  const handleCompleteSession = (dayId: string) => {
    const day = WORKOUT_DAYS.find((d) => d.id === dayId);
    if (!day) return;

    setWorkoutState((prev) => {
      const updatedLogs = { ...prev.setLogs };
      day.exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          const k = `${dayId}_${ex.id}_set_${set.setNum}`;
          if (!updatedLogs[k]?.completed) {
            updatedLogs[k] = {
              completed: true,
              weightKg: updatedLogs[k]?.weightKg || '',
              actualReps: set.targetReps || '',
              completedAt: new Date().toISOString(),
            };
          }
        });
      });

      const totalSets = day.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
      return {
        ...prev,
        setLogs: updatedLogs,
        completedDays: {
          ...prev.completedDays,
          [dayId]: {
            completedAt: new Date().toISOString(),
            completedSets: totalSets,
            totalSets,
          },
        },
      };
    });

    playChime(880, 0.4);
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  // Reset day sets
  const handleResetSession = (dayId: string) => {
    const day = WORKOUT_DAYS.find((d) => d.id === dayId);
    if (!day) return;

    setWorkoutState((prev) => {
      const updatedLogs = { ...prev.setLogs };
      day.exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          const k = `${dayId}_${ex.id}_set_${set.setNum}`;
          delete updatedLogs[k];
        });
      });
      const updatedCompletedDays = { ...prev.completedDays };
      delete updatedCompletedDays[dayId];

      return {
        ...prev,
        setLogs: updatedLogs,
        completedDays: updatedCompletedDays,
      };
    });
  };

  // Reset all progress
  const handleResetAll = () => {
    if (window.confirm('Reset all completed workout sets and session history for the week?')) {
      setWorkoutState({
        setLogs: {},
        completedDays: {},
        activeDayId: 'day-1',
        selectedExerciseModalId: null,
        currentRestTimer: null,
      });
      setRestTimerState(null);
      setCurrentScreen('days');
      setSelectedDayId(null);
      setSelectedExerciseId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center font-sans antialiased text-slate-100 p-0 sm:p-4 md:p-6 selection:bg-amber-500/20 selection:text-amber-300">
      {/* MOBILE-ONLY COMPATIBLE CONTAINER
          On desktop: Sleek phone frame with bezel and dynamic island.
          On mobile: 100vw x 100dvh native viewport without scroll spillover!
      */}
      <div className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[92vh] sm:max-h-[860px] bg-slate-950 sm:rounded-[40px] sm:border-[6px] sm:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden relative">
        {/* Smartphone Top Notch / Status Bar */}
        <div className="shrink-0 h-8 bg-slate-950 px-5 flex items-center justify-between text-xs text-slate-400 select-none z-30">
          <span className="font-semibold text-[11px] text-slate-200">{clockTime}</span>
          
          {/* Dynamic Island Speaker Notch */}
          <div className="w-20 h-4 bg-slate-900 rounded-full border border-slate-800/80 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-slate-800" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Top App Header */}
        <Header
          completedSessionsCount={Object.keys(workoutState.completedDays).length}
          totalSessionsCount={7}
          onOpenTimer={() => handleStartRestTimer(120, 'Rest Interval')}
          onResetAll={handleResetAll}
        />

        {/* Screen-Fitted Main Viewport (Zero Scroll Spillover) */}
        <main className="flex-1 min-h-0 overflow-hidden px-3.5 py-2 flex flex-col relative">
          {activeTab === 'workout' && (
            <>
              {/* PAGE 1: DAYS LIST (Monday to Sunday list format, showing areas it hits) */}
              {currentScreen === 'days' && (
                <DaysListView onSelectDay={handleSelectDay} workoutState={workoutState} />
              )}

              {/* PAGE 2: EXERCISES OF THE DAY (Only shows exercises for that day) */}
              {currentScreen === 'day_exercises' && selectedDayId && (
                <DayExercisesView
                  day={currentDay}
                  workoutState={workoutState}
                  onBackToDays={handleBackToDays}
                  onSelectExercise={handleSelectExercise}
                  onCompleteDaySession={() => handleCompleteSession(currentDay.id)}
                />
              )}

              {/* PAGE 3: EXERCISE DETAIL (Only shows that exercise with 3D anatomy, photos, points, sets & 2-min timer) */}
              {currentScreen === 'exercise_detail' && selectedDayId && selectedExerciseId && (
                <ExerciseDetailPage
                  exercise={currentExercise}
                  day={currentDay}
                  workoutState={workoutState}
                  onBackToDayExercises={handleBackToDayExercises}
                  onToggleSet={(setNum, weight, reps) =>
                    handleToggleSet(currentDay.id, currentExercise.id, setNum, weight, reps)
                  }
                  onStartRestTimer={handleStartRestTimer}
                />
              )}
            </>
          )}

          {/* TAB 2: INTERACTIVE 3D ANATOMY EXPLORER (Screen-Fitted) */}
          {activeTab === 'anatomy' && (
            <AnatomyExplorerTab
              onSelectExercise={(exercise, dayId) => {
                setSelectedDayId(dayId);
                setSelectedExerciseId(exercise.id);
                setCurrentScreen('exercise_detail');
                setActiveTab('workout');
              }}
            />
          )}

          {/* TAB 3: WEEKLY PROGRESS PERFORMANCE (Screen-Fitted) */}
          {activeTab === 'history' && (
            <WeeklyProgressStats
              workoutState={workoutState}
              onSelectDay={(dayId) => {
                const day = WORKOUT_DAYS.find((d) => d.id === dayId);
                if (day) handleSelectDay(day);
              }}
              onResetSession={handleResetSession}
              onResetAll={handleResetAll}
            />
          )}
        </main>

        {/* Floating 2-Minute Rest Timer with +10s / -10s controls */}
        {restTimerState?.visible && (
          <RestTimerFloating
            initialSeconds={restTimerState.seconds}
            exerciseName={restTimerState.name}
            onClose={() => setRestTimerState(null)}
          />
        )}

        {/* Native Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'workout') {
              setCurrentScreen('days');
              setSelectedDayId(null);
              setSelectedExerciseId(null);
            }
          }}
          onOpenRestTimer={() => handleStartRestTimer(120, 'Rest Interval')}
        />
      </div>
    </div>
  );
}
