import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Exercise } from '../types/workout';

// Realistic Anatomical Exercise Illustrations
import ecorcheShoulderPressImg from '../assets/images/ecorche_shoulder_press_1790764197031.jpg';
import ecorcheLegPressImg from '../assets/images/ecorche_leg_press_1790764211781.jpg';
import benchPressImg from '../assets/images/bench_press_anatomy_1790763465153.jpg';
import latPulldownImg from '../assets/images/lat_pulldown_anatomy_1790763477988.jpg';
import squatDeadliftImg from '../assets/images/squat_deadlift_anatomy_1790763490743.jpg';

interface ExerciseExecutionAnatomyProps {
  exercise: Exercise;
  onOpenFullBodyAnatomy?: () => void;
}

export const ExerciseExecutionAnatomy: React.FC<ExerciseExecutionAnatomyProps> = ({
  exercise,
  onOpenFullBodyAnatomy,
}) => {
  const [phase, setPhase] = useState<'setup' | 'contraction'>('contraction');
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Determine illustration & callouts based on exercise type / id
  const getExerciseBiomechanics = () => {
    const id = exercise.id.toLowerCase();
    const name = exercise.name.toLowerCase();

    // Shoulder press / overhead press matching user's reference
    if (
      id.includes('shoulder') ||
      name.includes('shoulder') ||
      name.includes('overhead') ||
      name.includes('military') ||
      id.includes('lateral-raise') ||
      (name.includes('press') && !name.includes('bench') && !name.includes('leg'))
    ) {
      return {
        image: ecorcheShoulderPressImg,
        title: `${exercise.name} Biomechanics (Ecorche)`,
        tempo: '2-0-1-0 Tempo',
        plane: 'Coronal / Scapular Plane Push',
      };
    }

    if (id.includes('leg-press') || name.includes('leg press')) {
      return {
        image: ecorcheLegPressImg,
        title: 'Sled 45° Leg Press Biomechanics (Ecorche)',
        tempo: '3-0-1-0 Tempo',
        plane: 'Sagittal (Hip & Knee Flexion/Extension)',
      };
    }

    if (id.includes('bench') || id.includes('chest') || id.includes('press') && !id.includes('leg')) {
      return {
        image: benchPressImg,
        title: `${exercise.name} Biomechanics`,
        tempo: '2-1-1-0 Tempo',
        plane: 'Transverse / Horizontal Push',
        callouts: [
          {
            id: 'pecs',
            muscleName: 'Pectoralis Major (Sternal & Clavicular)',
            role: 'primary' as const,
            pinX: 48,
            pinY: 42,
            labelX: 8,
            labelY: 30,
            side: 'left' as const,
            biomechanicsCue: 'Horizontal adductor of the humerus. Retract scapulae to place maximum stretch on chest fibers.'
          },
          {
            id: 'triceps',
            muscleName: 'Triceps Brachii',
            role: 'synergist' as const,
            pinX: 38,
            pinY: 48,
            labelX: 8,
            labelY: 68,
            side: 'left' as const,
            biomechanicsCue: 'Elbow extensor during concentric drive. Flaring elbows puts stress on rotator cuff.'
          },
          {
            id: 'delts',
            muscleName: 'Anterior Deltoids',
            role: 'synergist' as const,
            pinX: 45,
            pinY: 36,
            labelX: 72,
            labelY: 32,
            side: 'right' as const,
            biomechanicsCue: 'Assists shoulder flexion. Keep shoulder blades pinched back to minimize anterior shoulder shear.'
          },
          {
            id: 'lats',
            muscleName: 'Lats & Rotator Cuff (Stabilizers)',
            role: 'stabilizer' as const,
            pinX: 54,
            pinY: 52,
            labelX: 72,
            labelY: 70,
            side: 'right' as const,
            biomechanicsCue: 'Provides rigid foundation on the bench. Actively pull the bar apart to engage stabilizers.'
          }
        ]
      };
    }

    if (id.includes('pull') || id.includes('row') || id.includes('lat') || id.includes('back')) {
      return {
        image: latPulldownImg,
        title: `${exercise.name} Biomechanics`,
        tempo: '2-1-1-0 Tempo',
        plane: 'Frontal / Scapular Plane Pull',
        callouts: [
          {
            id: 'lats',
            muscleName: 'Latissimus Dorsi & Teres Major',
            role: 'primary' as const,
            pinX: 48,
            pinY: 44,
            labelX: 8,
            labelY: 32,
            side: 'left' as const,
            biomechanicsCue: 'Draws humerus down and in. Focus on driving elbows directly toward your back pockets.'
          },
          {
            id: 'rhomboids',
            muscleName: 'Rhomboids & Mid Trapezius',
            role: 'synergist' as const,
            pinX: 52,
            pinY: 36,
            labelX: 8,
            labelY: 68,
            side: 'left' as const,
            biomechanicsCue: 'Retracts shoulder blades together at peak contraction. Squeeze for a full second.'
          },
          {
            id: 'biceps',
            muscleName: 'Biceps Brachii & Brachialis',
            role: 'synergist' as const,
            pinX: 38,
            pinY: 38,
            labelX: 72,
            labelY: 34,
            side: 'right' as const,
            biomechanicsCue: 'Elbow flexor. Initiate the pull from the lats and scapula rather than pulling with your arms.'
          },
          {
            id: 'forearms',
            muscleName: 'Forearm Flexors (Grip)',
            role: 'stabilizer' as const,
            pinX: 34,
            pinY: 26,
            labelX: 72,
            labelY: 68,
            side: 'right' as const,
            biomechanicsCue: 'Crush grip on the handle ensures torque transfer without slipping.'
          }
        ]
      };
    }

    // Default lower/full body (squats, deadlifts, hinges)
    return {
      image: squatDeadliftImg,
      title: `${exercise.name} Biomechanics`,
      tempo: '3-1-1-0 Tempo',
      plane: 'Sagittal Posterior Chain',
      callouts: [
        {
          id: 'posterior',
          muscleName: 'Gluteus Maximus & Hamstrings',
          role: 'primary' as const,
          pinX: 46,
          pinY: 52,
          labelX: 8,
          labelY: 34,
          side: 'left' as const,
          biomechanicsCue: 'Powerful hip extensors. Drive hips forward through the floor while keeping chest tall.'
        },
        {
          id: 'erectors',
          muscleName: 'Spinal Erectors (Lower Back)',
          role: 'stabilizer' as const,
          pinX: 48,
          pinY: 42,
          labelX: 8,
          labelY: 70,
          side: 'left' as const,
          biomechanicsCue: 'Isometric brace against flexion. Never let the lumbar spine round during the stroke.'
        },
        {
          id: 'quads',
          muscleName: 'Quadriceps (Knee Drive)',
          role: 'synergist' as const,
          pinX: 52,
          pinY: 60,
          labelX: 72,
          labelY: 36,
          side: 'right' as const,
          biomechanicsCue: 'Extends knees out of the bottom position. Push the floor away.'
        },
        {
          id: 'core',
          muscleName: 'Transverse Abdominis & Core',
          role: 'stabilizer' as const,
          pinX: 54,
          pinY: 46,
          labelX: 72,
          labelY: 70,
          side: 'right' as const,
          biomechanicsCue: 'Valsalva maneuver: deep belly breath and intra-abdominal brace protects the spine.'
        }
      ]
    };
  };

  const biomechanics = getExerciseBiomechanics();

  // Automatic rep loop: transitions between setup (stretch) and contraction (peak)
  useEffect(() => {
    if (!isLooping) return;
    const interval = setInterval(() => {
      setPhase((prev) => (prev === 'setup' ? 'contraction' : 'setup'));
    }, 2400);
    return () => clearInterval(interval);
  }, [isLooping]);

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden bg-slate-950 border border-slate-800 rounded-3xl p-2 select-none">
      {/* Top Biomechanics Navigation Bar */}
      <div className="shrink-0 flex items-center justify-between pb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 truncate">
            {biomechanics.title}
          </span>
        </div>

        {/* Phase Toggle & Auto-Rep Play/Pause */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => {
              setIsLooping(false);
              setPhase('setup');
            }}
            className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition-all ${
              phase === 'setup' && !isLooping
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Setup / Stretch
          </button>
          <button
            onClick={() => {
              setIsLooping(false);
              setPhase('contraction');
            }}
            className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition-all ${
              phase === 'contraction' && !isLooping
                ? 'bg-red-500 text-white font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Peak Contraction
          </button>
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-1 rounded-lg text-[9px] font-mono transition-all ${
              isLooping
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Auto-repeat rep execution"
          >
            {isLooping ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Exercise Execution with Muscle Highlight and Pointer Lines */}
      <div className="relative flex-1 my-1 w-full min-h-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden flex items-center justify-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />

        {/* Phase Indicator HUD Top Right */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950/90 border border-slate-800 backdrop-blur-md">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              phase === 'contraction' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-[9px] font-mono font-bold uppercase text-slate-300">
            {phase === 'contraction' ? 'CONCENTRIC: PEAK TENSION' : 'ECCENTRIC: DEEP STRETCH'}
          </span>
        </div>

        {/* Biomechanical Tempo Badge Top Left */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[8px] font-mono text-amber-300">
          <Zap className="w-2.5 h-2.5 text-amber-400" />
          <span>{biomechanics.tempo}</span>
        </div>

        {/* The Exercise Biomechanical Image */}
        <div className="relative w-full h-full max-h-[290px] flex items-center justify-center p-1">
          <img
            src={biomechanics.image}
            alt={biomechanics.title}
            className={`w-full h-full object-contain rounded-xl transition-all duration-700 ${
              phase === 'contraction'
                ? 'scale-[1.02] filter contrast-[1.12] brightness-[1.05]'
                : 'scale-[0.98] filter contrast-[0.98] brightness-[0.95]'
            }`}
          />

          {/* Glowing Muscle Contraction Overlay Shader when in contraction phase */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              phase === 'contraction' ? 'opacity-40' : 'opacity-10'
            }`}
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.35) 0%, rgba(245, 158, 11, 0.15) 45%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </div>

      {/* Execution Coaching Guidance: HOW TO DO THE EXERCISE */}
      <div className="shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase font-extrabold text-amber-400">
              Biomechanical Execution Form Cues
            </span>
          </div>

          {onOpenFullBodyAnatomy && (
            <button
              onClick={onOpenFullBodyAnatomy}
              className="text-[9px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 active:scale-95"
            >
              <span>Full-Body Map</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Step-by-Step Points */}
        <div className="grid grid-cols-2 gap-1.5 text-[9px] text-slate-300">
          <div className="bg-slate-950/70 p-1.5 rounded-xl border border-slate-800/80 flex items-start gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <span className="font-bold text-slate-200 block">Setup & Grip</span>
              <span className="text-slate-400 line-clamp-2">
                {exercise.stepByStep?.[0] || 'Anchor firmly into position with full stability.'}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-1.5 rounded-xl border border-slate-800/80 flex items-start gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <span className="font-bold text-slate-200 block">Eccentric Control</span>
              <span className="text-slate-400 line-clamp-2">
                {exercise.stepByStep?.[3] || 'Lower under 2-3s tempo into a full muscular stretch.'}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-1.5 rounded-xl border border-slate-800/80 flex items-start gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <span className="font-bold text-slate-200 block">Concentric Drive</span>
              <span className="text-slate-400 line-clamp-2">
                {exercise.stepByStep?.[4] || 'Drive explosively; squeeze peak contraction without locking joints.'}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-1.5 rounded-xl border border-slate-800/80 flex items-start gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <span className="font-bold text-slate-200 block">Key Form Rule</span>
              <span className="text-emerald-300/90 line-clamp-2">
                {exercise.formTips?.[0] || 'Never bounce the load; maintain continuous muscle tension.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
