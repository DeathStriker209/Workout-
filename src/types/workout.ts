// Muscle regions drawn on the body map (see components/Body.tsx)
export type MuscleGroup =
  | 'chest'
  | 'shoulders' // front & side delts
  | 'reardelts'
  | 'traps'
  | 'lats'
  | 'upperback' // rhomboids, teres, infraspinatus
  | 'lowerback' // erector spinae
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'adductors'
  | 'abductors'
  | 'cardio';

export type Category =
  | 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Forearms' | 'Legs' | 'Core' | 'Cardio';

export type EquipKind =
  | 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'pulldown' | 'bodyweight' | 'bar'
  | 'bike' | 'treadmill' | 'rope' | 'wheel' | 'plate' | 'bench';

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
  category: Category;
  equipment: { label: string; kind: EquipKind };
  isForearmGrip?: boolean; // For (F) tag
  hideInLibrary?: boolean; // plan-only duplicates
  alternatives?: string[];
  targetArea: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  anatomyHighlightGroups: MuscleGroup[]; // primary movers (bright on the map)
  secondaryGroups?: MuscleGroup[]; // helpers (dim on the map)
  sets: ExerciseSet[];
  defaultRestSeconds: number;
  description: string;
  stepByStep: string[];
  formTips: string[];
  commonMistakes: string[];
  photos?: ExercisePhoto[];
  videoEmbedId?: string;
  videoSearchQuery?: string;
  visualDemonstration?: {
    type: 'illustration' | 'animation';
    movementPlane: string;
    tempo: string;
  };
}

export interface DayWorkout {
  id: string;
  dayNumber: number;
  dayName: string;
  shortDay: string;
  title: string;
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

export interface WorkoutState {
  // Map of `${dayId}_${exerciseId}_set_${setNum}` -> CompletedSetLog
  setLogs: Record<string, CompletedSetLog>;
  // Map of `${dayId}` -> session status
  completedDays: Record<string, { completedAt: string; completedSets: number; totalSets: number }>;
  // Map of `${dayId}_${plannedExerciseId}` -> id of the swap option picked (absent = option A)
  swaps?: Record<string, string>;
}
