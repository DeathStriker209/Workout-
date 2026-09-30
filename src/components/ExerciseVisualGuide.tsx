import React, { useState } from 'react';
import { Play, Pause, Video, Compass, Sparkles, ImageIcon } from 'lucide-react';
import { Exercise } from '../types/workout';
import { ExercisePhotosGallery } from './ExercisePhotosGallery';

interface ExerciseVisualGuideProps {
  exercise: Exercise;
  bannerImage?: string;
  defaultTab?: 'photos' | 'simulation' | 'video';
}

export const ExerciseVisualGuide: React.FC<ExerciseVisualGuideProps> = ({
  exercise,
  defaultTab = exercise.photos && exercise.photos.length > 0 ? 'photos' : 'simulation',
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'simulation' | 'video'>(defaultTab);
  const [isPlayingMotion, setIsPlayingMotion] = useState(true);

  // SVG Animated movement loop based on exercise kinematics
  const renderKinematicLoop = () => {
    return (
      <div className="relative w-full h-56 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-800">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />

        {/* Biomechanical animated SVG path */}
        <svg viewBox="0 0 240 160" className="w-full h-full max-h-48 z-10">
          <defs>
            <linearGradient id="barbell-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="pulse-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Movement trajectory guideline */}
          <path
            d="M 120 30 L 120 130"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-40"
          />

          {/* Torso / Base reference */}
          <ellipse cx="120" cy="142" rx="36" ry="6" fill="#1e293b" />
          <circle cx="120" cy="50" r="16" fill="#334155" stroke="#475569" strokeWidth="2" />
          <path d="M 112 66 L 128 66 L 124 110 L 116 110 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />

          {/* Animated Weight / Barbell / Cable bar */}
          <g
            style={{
              animation: isPlayingMotion ? 'workout-stroke 2.8s ease-in-out infinite alternate' : 'none',
              transformOrigin: '120px 80px',
            }}
          >
            {/* Left Weight Plate */}
            <rect x="52" y="68" width="12" height="28" rx="3" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <rect x="66" y="73" width="8" height="18" rx="2" fill="#d97706" />

            {/* Shaft */}
            <rect x="74" y="80" width="92" height="4" rx="2" fill="url(#barbell-grad)" />

            {/* Right Weight Plate */}
            <rect x="166" y="73" width="8" height="18" rx="2" fill="#d97706" />
            <rect x="176" y="68" width="12" height="28" rx="3" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />

            {/* Grip hands */}
            <circle cx="95" cy="82" r="5" fill="#f59e0b" opacity="0.9" />
            <circle cx="145" cy="82" r="5" fill="#f59e0b" opacity="0.9" />

            {/* Tension Glow Arc */}
            <path
              d="M 90 70 Q 120 60 150 70"
              stroke="#fbbf24"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              className="opacity-80"
            />
          </g>

          {/* Motion Path Direction Indicator */}
          <g className="text-[10px] font-sans fill-amber-400">
            <text x="14" y="32" fontSize="9" fill="#94a3b8">
              CONCENTRIC ↑
            </text>
            <text x="14" y="142" fontSize="9" fill="#94a3b8">
              ECCENTRIC ↓
            </text>
          </g>
        </svg>

        {/* Movement Plane & Tempo Overlay */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-800">
          <span className="flex items-center gap-1 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{exercise.visualDemonstration.movementPlane}</span>
          </span>
          <span className="font-mono text-amber-400 font-medium">
            Tempo: {exercise.visualDemonstration.tempo}
          </span>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlayingMotion(!isPlayingMotion)}
          className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-slate-300 hover:text-amber-400 transition-colors"
          title={isPlayingMotion ? 'Pause kinematic preview' : 'Play kinematic preview'}
        >
          {isPlayingMotion ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <style>{`
          @keyframes workout-stroke {
            0% {
              transform: translateY(-24px) scale(0.98);
            }
            45% {
              transform: translateY(22px) scale(1.02);
            }
            55% {
              transform: translateY(22px) scale(1.02);
            }
            100% {
              transform: translateY(-24px) scale(0.98);
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Media Type Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {/* TAB 1: Internet Photos */}
          {exercise.photos && exercise.photos.length > 0 && (
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeMediaTab === 'photos'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Real Exercise Photos</span>
            </button>
          )}

          {/* TAB 2: Kinematic Form Guide */}
          <button
            onClick={() => setActiveMediaTab('simulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeMediaTab === 'simulation'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kinematics & Motion</span>
          </button>

          {/* TAB 3: Video Tutorial */}
          <button
            onClick={() => setActiveMediaTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeMediaTab === 'video'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Tutorial</span>
          </button>
        </div>

        {exercise.isForearmGrip && (
          <span className="text-xs text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
            (F) Grip Finisher
          </span>
        )}
      </div>

      {/* Main Display Area */}
      {activeMediaTab === 'photos' && exercise.photos && exercise.photos.length > 0 && (
        <ExercisePhotosGallery photos={exercise.photos} exerciseName={exercise.name} />
      )}

      {activeMediaTab === 'simulation' && (
        <div className="space-y-2">
          {renderKinematicLoop()}

          {/* Quick Execution Guidance Strip */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Primary Target
              </span>
              <p className="text-slate-200 font-medium truncate mt-0.5">{exercise.targetArea}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Recommended Rest
              </span>
              <p className="text-slate-200 font-medium mt-0.5">
                {exercise.defaultRestSeconds > 0 ? `${exercise.defaultRestSeconds}s between sets` : 'Continuous'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeMediaTab === 'video' && (
        <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {exercise.videoEmbedId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${exercise.videoEmbedId}?rel=0&modestbranding=1`}
              title={`${exercise.name} Tutorial Video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="p-6 text-center text-slate-400">
              <Video className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm">Video tutorial available on YouTube</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  exercise.videoSearchQuery || `${exercise.name} workout form`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-semibold rounded-lg hover:bg-amber-400 transition-colors"
              >
                Search on YouTube
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
