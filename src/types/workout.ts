export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'arms'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'legs'
  | 'abs'
  | 'forearms'
  | 'cardio';

export interface ExerciseSet {
  setNum: number;
  targetReps?: string; // e.g. "12", "10", "8", "15"
  targetDescription?: string; // e.g. "30-40m walk", "Hold to near-failure (~20-40 sec)"
  targetSeconds?: number; // for timed exercises
  isTimed?: boolean;
}

export interface ExercisePhoto {
  url: string;
  label: string;
}

export interface Exercise {
  id: string;
  name: string;
  isForearmGrip?: boolean; // For (F) tag
  alternatives?: string[]; // e.g. "Shoulder press or lateral raise"
  targetArea: string; // e.g. "Upper Back & Lats"
  primaryMuscles: string[]; // e.g. ["Latissimus Dorsi", "Teres Major"]
  secondaryMuscles: string[]; // e.g. ["Biceps Brachii", "Rhomboids"]
  anatomyHighlightGroups: MuscleGroup[];
  sets: ExerciseSet[];
  defaultRestSeconds: number; // e.g. 90
  description: string;
  stepByStep: string[];
  formTips: string[];
  commonMistakes: string[];
  photos?: ExercisePhoto[]; // Real step-by-step exercise photos from internet
  videoEmbedId?: string; // YouTube video ID or demonstration reference
  videoSearchQuery?: string;
  visualDemonstration: {
    type: 'illustration' | 'animation';
    movementPlane: string;
    tempo: string; // e.g. "2-0-1-0"
  };
}

export interface DayWorkout {
  id: string;
  dayNumber: number;
  dayName: string; // "Monday", "Tuesday", etc.
  shortDay: string; // "Mon", "Tue", etc.
  title: string; // "Lift A", "Cardio", "Lift B", etc.
  category: 'lift' | 'cardio' | 'rest';
  subtitle: string;
  focusAreas: string[];
  estimatedDurationMin: number;
  exercises: Exercise[];
}

export interface CompletedSetLog {
  completed: boolean;
  weightKg?: string;
  actualReps?: string;
  completedAt?: string;
}

// Workout session storage schema
export interface WorkoutState {
  // Map of `${dayId}_${exerciseId}_set_${setNum}` -> CompletedSetLog
  setLogs: Record<string, CompletedSetLog>;
  // Map of `${dayId}` -> session status
  completedDays: Record<string, { completedAt: string; completedSets: number; totalSets: number }>;
  activeDayId: string;
  selectedExerciseModalId: string | null;
  currentRestTimer: {
    active: boolean;
    remainingSeconds: number;
    initialSeconds: number;
    exerciseName?: string;
  } | null;
}
