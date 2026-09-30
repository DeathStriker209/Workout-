import React, { useState, useEffect } from 'react';
import { MuscleGroup } from '../types/workout';
import { Flame, Activity, Rotate3d, Zap } from 'lucide-react';
import { MUSCLE_METADATA } from '../data/workoutData';
import { playChime } from '../utils/audio';

// 3D Anatomical Ecorche (Human muscular system without skin)
import ecorcheMusclesFront from '../assets/images/ecorche_muscles_front_1790764165010.jpg';
import ecorcheMusclesBack from '../assets/images/ecorche_muscles_back_1790764179921.jpg';

interface MuscleAnatomyViewerProps {
  highlightedGroups: MuscleGroup[];
  primaryMusclesText?: string[];
  secondaryMusclesText?: string[];
  exerciseName?: string;
  compact?: boolean;
  onMuscleTap?: (group: MuscleGroup) => void;
}

export const MuscleAnatomyViewer: React.FC<MuscleAnatomyViewerProps> = ({
  highlightedGroups,
  primaryMusclesText = [],
  secondaryMusclesText = [],
  exerciseName,
  compact = false,
  onMuscleTap,
}) => {
  // Determine if primary muscle is predominantly posterior (back, glutes, hamstrings, triceps)
  const isPosteriorPrimary = highlightedGroups.some((g) =>
    ['back', 'glutes', 'hamstrings', 'triceps'].includes(g)
  );

  const [activeView, setActiveView] = useState<'front' | 'back' | 'dual'>(
    isPosteriorPrimary ? 'back' : 'front'
  );
  const [is3DAngle, setIs3DAngle] = useState<boolean>(false);
  const [activeDisplayMode, setActiveDisplayMode] = useState<'glow' | 'thermal'>('glow');

  // Auto-switch view when highlighted groups change to match target anatomy
  useEffect(() => {
    if (isPosteriorPrimary) {
      setActiveView('back');
    } else if (
      highlightedGroups.some((g) =>
        ['chest', 'abs', 'biceps', 'quadriceps'].includes(g)
      )
    ) {
      setActiveView('front');
    }
  }, [highlightedGroups, isPosteriorPrimary]);

  const isHighlighted = (group: MuscleGroup) => highlightedGroups.includes(group);

  // Primary active muscle info
  const primaryGroup = highlightedGroups[0] || 'chest';
  const primaryMeta = MUSCLE_METADATA[primaryGroup] || {
    label: primaryGroup.toUpperCase(),
    area: 'Target Zone',
    description: 'Direct agonist under mechanical load',
  };

  const handleMuscleClick = (
    group: MuscleGroup,
    _label?: string,
    _coords?: { x: number; y: number }
  ) => {
    playChime(750, 0.15);
    if (onMuscleTap) {
      onMuscleTap(group);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-2.5 shadow-xl select-none w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Top Header & Interactive Control Bar */}
      <div className="shrink-0 flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-800/80">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-red-400 font-extrabold truncate">
              3D Muscular Anatomy (Ecorche)
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 truncate">
            {exerciseName || primaryMeta.label}
          </h4>
        </div>

        {/* View Controls: Front / Back / Dual / 3D Tilt / Thermal */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 text-xs">
          <button
            onClick={() => setActiveView('front')}
            className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
              activeView === 'front'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setActiveView('back')}
            className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
              activeView === 'back'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Back
          </button>
          <button
            onClick={() => setActiveView('dual')}
            className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
              activeView === 'dual'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Dual Anterior & Posterior Muscular Anatomy"
          >
            Dual
          </button>
          <button
            onClick={() => setIs3DAngle(!is3DAngle)}
            className={`p-1 rounded-lg transition-all flex items-center gap-0.5 text-[10px] font-mono ${
              is3DAngle
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle 3D Perspective Tilt"
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold">3D</span>
          </button>
          <button
            onClick={() =>
              setActiveDisplayMode(activeDisplayMode === 'glow' ? 'thermal' : 'glow')
            }
            className={`p-1 rounded-lg transition-all flex items-center text-[10px] ${
              activeDisplayMode === 'thermal'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Thermal Heatmap Shader"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Ecorche Muscular Anatomy Stage Container */}
      <div
        className="relative flex-1 my-1.5 w-full min-h-0 flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden"
        style={{ perspective: '900px' }}
      >
        {/* Holographic Subtle Floor Grid */}
        <div
          className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"
          style={{
            transform: 'rotateX(60deg) translateY(70px)',
            transformOrigin: 'bottom center',
          }}
        />

        {/* Dynamic Overhead Rim Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-28 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Live HUD Badge Top Left */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[9px] font-mono text-slate-300 shadow-md">
          <Activity className="w-3 h-3 text-red-400 animate-pulse" />
          <span>{activeView === 'front' ? 'ANTERIOR' : activeView === 'back' ? 'POSTERIOR' : 'DUAL VIEW'}</span>
          {activeDisplayMode === 'thermal' && (
            <span className="text-red-400">· THERMAL</span>
          )}
          {is3DAngle && <span className="text-red-400">· 3D</span>}
        </div>

        {/* 3D Spatial Canvas Wrapper (Transforms on 3D tilt) */}
        <div
          className="relative w-full h-full max-h-[310px] flex items-center justify-center transition-transform duration-500 ease-out"
          style={{
            transform: is3DAngle
              ? 'rotateY(-18deg) rotateX(8deg) scale(0.96)'
              : 'rotateY(0deg) rotateX(0deg) scale(1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 3D ANATOMICAL ECORCHE MODEL (MUSCLES ONLY, NO SKIN) */}
          {activeView === 'dual' ? (
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="w-1/2 h-full relative flex items-center justify-center">
                <span className="absolute top-1 left-2 text-[8px] font-mono font-bold text-red-400/90 uppercase tracking-widest bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800 z-10">
                  ANTERIOR
                </span>
                <img
                  src={ecorcheMusclesFront}
                  alt="Anterior Muscular System Without Skin"
                  className="w-full h-full object-contain select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] filter brightness-[0.95] contrast-[1.05]"
                  loading="eager"
                  draggable={false}
                />
              </div>
              <div className="w-1/2 h-full relative flex items-center justify-center">
                <span className="absolute top-1 right-2 text-[8px] font-mono font-bold text-red-400/90 uppercase tracking-widest bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800 z-10">
                  POSTERIOR
                </span>
                <img
                  src={ecorcheMusclesBack}
                  alt="Posterior Muscular System Without Skin"
                  className="w-full h-full object-contain select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] filter brightness-[0.95] contrast-[1.05]"
                  loading="eager"
                  draggable={false}
                />
              </div>
            </div>
          ) : (
            <img
              src={activeView === 'front' ? ecorcheMusclesFront : ecorcheMusclesBack}
              alt={activeView === 'front' ? 'Anterior Muscular System Without Skin' : 'Posterior Muscular System Without Skin'}
              className="w-full h-full object-contain select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] filter brightness-[0.95] contrast-[1.05]"
              loading="eager"
              draggable={false}
            />
          )}

          {/* REAL-TIME TARGET MUSCLE HIGHLIGHT OVERLAY (SVG Coordinate Mask) */}
          <svg
            viewBox={activeView === 'dual' ? '0 0 600 400' : '0 0 300 400'}
            className="absolute inset-0 w-full h-full object-contain pointer-events-auto"
            aria-label="Real Human Muscle Target Highlights"
          >
            <defs>
              {/* Fiery Red-Orange Muscular Agonist Glow (Like reference image) */}
              <linearGradient id="active-amber-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="15%" stopColor="#ff7043" stopOpacity="0.92" />
                <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.88" />
                <stop offset="80%" stopColor="#e11d48" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#be123c" stopOpacity="0.85" />
              </linearGradient>

              {/* Thermal Infrared Heatmap Shader */}
              <linearGradient id="active-thermal-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="20%" stopColor="#f43f5e" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.85" />
                <stop offset="80%" stopColor="#8b5cf6" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
              </linearGradient>

              {/* Secondary Assisting Muscle Shader */}
              <linearGradient id="secondary-ember-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.45" />
              </linearGradient>

              {/* Luminous Glow Filter for Highlighted Muscles */}
              <filter id="real-muscle-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ---------------- ANTERIOR (FRONT VIEW) OVERLAYS ---------------- */}
            {(activeView === 'front' || activeView === 'dual') && (
              <g id="real-front-muscle-layers">
                {/* CHEST / PECTORALIS MAJOR */}
                <g
                  onClick={() =>
                    handleMuscleClick('chest', 'Pectoralis Major (Chest)', { x: 150, y: 122 })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Pec */}
                  <path
                    d="M112 108 C128 106 146 108 147 122 C146 138 132 146 114 142 C104 134 104 118 112 108 Z"
                    fill={
                      isHighlighted('chest')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('chest') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('chest') ? 2.5 : 0.8}
                    filter={isHighlighted('chest') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('chest') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Pec */}
                  <path
                    d="M188 108 C172 106 154 108 153 122 C154 138 168 146 186 142 C196 134 196 118 188 108 Z"
                    fill={
                      isHighlighted('chest')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('chest') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('chest') ? 2.5 : 0.8}
                    filter={isHighlighted('chest') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('chest') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {isHighlighted('chest') && (
                    <g pointerEvents="none">
                      <line x1="150" y1="108" x2="150" y2="138" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
                    </g>
                  )}
                </g>

                {/* SHOULDERS (DELTOIDS - ANTERIOR & LATERAL) */}
                <g
                  onClick={() =>
                    handleMuscleClick('shoulders', 'Deltoids (Shoulders)', { x: 98, y: 104 })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Deltoid */}
                  <path
                    d="M94 92 C108 92 112 104 108 122 C100 134 88 128 86 114 C84 102 88 94 94 92 Z"
                    fill={
                      isHighlighted('shoulders')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('shoulders') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('shoulders') ? 2.5 : 0.8}
                    filter={isHighlighted('shoulders') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('shoulders') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Deltoid */}
                  <path
                    d="M206 92 C192 92 188 104 192 122 C200 134 212 128 214 114 C216 102 212 94 206 92 Z"
                    fill={
                      isHighlighted('shoulders')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('shoulders') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('shoulders') ? 2.5 : 0.8}
                    filter={isHighlighted('shoulders') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('shoulders') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* BICEPS (BICEPS BRACHII) */}
                <g
                  onClick={() =>
                    handleMuscleClick('biceps', 'Biceps Brachii (Arms)', { x: 86, y: 148 })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Bicep */}
                  <path
                    d="M84 128 C98 128 98 152 92 168 C82 170 78 154 78 140 C80 132 82 128 84 128 Z"
                    fill={
                      isHighlighted('biceps') || isHighlighted('arms')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={
                      isHighlighted('biceps') || isHighlighted('arms')
                        ? '#fef08a'
                        : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth={isHighlighted('biceps') || isHighlighted('arms') ? 2.5 : 0.8}
                    filter={
                      isHighlighted('biceps') || isHighlighted('arms')
                        ? 'url(#real-muscle-glow)'
                        : undefined
                    }
                    className={
                      isHighlighted('biceps') || isHighlighted('arms')
                        ? 'animate-pulse'
                        : 'hover:opacity-75'
                    }
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Bicep */}
                  <path
                    d="M216 128 C202 128 202 152 208 168 C218 170 222 154 222 140 C220 132 218 128 216 128 Z"
                    fill={
                      isHighlighted('biceps') || isHighlighted('arms')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={
                      isHighlighted('biceps') || isHighlighted('arms')
                        ? '#fef08a'
                        : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth={isHighlighted('biceps') || isHighlighted('arms') ? 2.5 : 0.8}
                    filter={
                      isHighlighted('biceps') || isHighlighted('arms')
                        ? 'url(#real-muscle-glow)'
                        : undefined
                    }
                    className={
                      isHighlighted('biceps') || isHighlighted('arms')
                        ? 'animate-pulse'
                        : 'hover:opacity-75'
                    }
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* FOREARMS & GRIP (BRACHIORADIALIS & FLEXORS) */}
                <g
                  onClick={() =>
                    handleMuscleClick('forearms', 'Forearms & Grip', { x: 74, y: 202 })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Forearm */}
                  <path
                    d="M74 174 C86 174 88 210 80 234 C72 232 66 210 68 188 C70 178 72 174 74 174 Z"
                    fill={
                      isHighlighted('forearms')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('forearms') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('forearms') ? 2.5 : 0.8}
                    filter={isHighlighted('forearms') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('forearms') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Forearm */}
                  <path
                    d="M226 174 C214 174 212 210 220 234 C228 232 234 210 232 188 C230 178 228 174 226 174 Z"
                    fill={
                      isHighlighted('forearms')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('forearms') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('forearms') ? 2.5 : 0.8}
                    filter={isHighlighted('forearms') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('forearms') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* ABDOMINALS (RECTUS ABDOMINIS & CORE) */}
                <g
                  onClick={() =>
                    handleMuscleClick('abs', 'Rectus Abdominis (Core & Abs)', { x: 150, y: 182 })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Upper & Mid Abs Pack */}
                  <path
                    d="M136 148 C144 146 156 146 164 148 C168 184 168 214 164 226 C154 228 146 228 136 226 C132 214 132 184 136 148 Z"
                    fill={
                      isHighlighted('abs')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('abs') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('abs') ? 2.5 : 0.8}
                    filter={isHighlighted('abs') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('abs') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Obliques Left & Right */}
                  <path
                    d="M120 166 C134 166 132 212 124 224 C116 214 114 186 120 166 Z"
                    fill={
                      isHighlighted('abs')
                        ? 'url(#secondary-ember-glow)'
                        : 'rgba(255,255,255,0.02)'
                    }
                    stroke={isHighlighted('abs') ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={isHighlighted('abs') ? 1.5 : 0.6}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  <path
                    d="M180 166 C166 166 168 212 176 224 C184 214 186 186 180 166 Z"
                    fill={
                      isHighlighted('abs')
                        ? 'url(#secondary-ember-glow)'
                        : 'rgba(255,255,255,0.02)'
                    }
                    stroke={isHighlighted('abs') ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={isHighlighted('abs') ? 1.5 : 0.6}
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* QUADRICEPS (THIGHS - RECTUS FEMORIS & VASTUS) */}
                <g
                  onClick={() =>
                    handleMuscleClick('quadriceps', 'Quadriceps (Front Thighs)', { x: 130, y: 275 })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Quad */}
                  <path
                    d="M116 236 C132 236 144 242 144 278 C144 306 138 318 126 318 C116 314 110 274 116 236 Z"
                    fill={
                      isHighlighted('quadriceps') || isHighlighted('legs')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={
                      isHighlighted('quadriceps') || isHighlighted('legs')
                        ? '#fef08a'
                        : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth={
                      isHighlighted('quadriceps') || isHighlighted('legs') ? 2.5 : 0.8
                    }
                    filter={
                      isHighlighted('quadriceps') || isHighlighted('legs')
                        ? 'url(#real-muscle-glow)'
                        : undefined
                    }
                    className={
                      isHighlighted('quadriceps') || isHighlighted('legs')
                        ? 'animate-pulse'
                        : 'hover:opacity-75'
                    }
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Quad */}
                  <path
                    d="M184 236 C168 236 156 242 156 278 C156 306 162 318 174 318 C184 314 190 274 184 236 Z"
                    fill={
                      isHighlighted('quadriceps') || isHighlighted('legs')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={
                      isHighlighted('quadriceps') || isHighlighted('legs')
                        ? '#fef08a'
                        : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth={
                      isHighlighted('quadriceps') || isHighlighted('legs') ? 2.5 : 0.8
                    }
                    filter={
                      isHighlighted('quadriceps') || isHighlighted('legs')
                        ? 'url(#real-muscle-glow)'
                        : undefined
                    }
                    className={
                      isHighlighted('quadriceps') || isHighlighted('legs')
                        ? 'animate-pulse'
                        : 'hover:opacity-75'
                    }
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* CALVES / ANTERIOR TIBIALIS (LOWER LEGS) */}
                <g
                  onClick={() =>
                    handleMuscleClick('calves', 'Calves & Tibialis', { x: 128, y: 350 })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Calf Front */}
                  <path
                    d="M118 326 C130 326 134 348 132 374 C124 374 120 356 118 336 C116 330 118 326 118 326 Z"
                    fill={
                      isHighlighted('calves')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('calves') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('calves') ? 2.2 : 0.8}
                    filter={isHighlighted('calves') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('calves') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Calf Front */}
                  <path
                    d="M182 326 C170 326 166 348 168 374 C176 374 180 356 182 336 C184 330 182 326 182 326 Z"
                    fill={
                      isHighlighted('calves')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('calves') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('calves') ? 2.2 : 0.8}
                    filter={isHighlighted('calves') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('calves') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>
              </g>
            )}

            {/* ---------------- POSTERIOR (BACK VIEW) OVERLAYS ---------------- */}
            {(activeView === 'back' || activeView === 'dual') && (
              <g id="real-back-muscle-layers" transform={activeView === 'dual' ? 'translate(300, 0)' : undefined}>
                {/* TRAPEZIUS (UPPER & MID TRAPS) */}
                <g
                  onClick={() =>
                    handleMuscleClick('back', 'Trapezius (Upper & Mid Traps)', { x: 150, y: 88 })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  <path
                    d="M136 68 C144 64 156 64 164 68 C176 86 172 108 150 126 C128 108 124 86 136 68 Z"
                    fill={
                      isHighlighted('back') || isHighlighted('shoulders')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={
                      isHighlighted('back') || isHighlighted('shoulders')
                        ? '#fef08a'
                        : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth={
                      isHighlighted('back') || isHighlighted('shoulders') ? 2.5 : 0.8
                    }
                    filter={
                      isHighlighted('back') || isHighlighted('shoulders')
                        ? 'url(#real-muscle-glow)'
                        : undefined
                    }
                    className={
                      isHighlighted('back') || isHighlighted('shoulders')
                        ? 'animate-pulse'
                        : 'hover:opacity-75'
                    }
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* LATISSIMUS DORSI (LATS / UPPER & MID BACK WINGS) */}
                <g
                  onClick={() =>
                    handleMuscleClick('back', 'Latissimus Dorsi (Lats & Wings)', { x: 150, y: 145 })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Lat Wing */}
                  <path
                    d="M112 110 C128 116 136 128 136 166 C124 168 112 152 108 132 C106 120 108 112 112 110 Z"
                    fill={
                      isHighlighted('back')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('back') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('back') ? 2.5 : 0.8}
                    filter={isHighlighted('back') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('back') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Lat Wing */}
                  <path
                    d="M188 110 C172 116 164 128 164 166 C176 168 188 152 192 132 C194 120 192 112 188 110 Z"
                    fill={
                      isHighlighted('back')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('back') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('back') ? 2.5 : 0.8}
                    filter={isHighlighted('back') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('back') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* REAR DELTOIDS (POSTERIOR SHOULDERS) */}
                <g
                  onClick={() =>
                    handleMuscleClick('shoulders', 'Rear Deltoids (Posterior Shoulders)', {
                      x: 94,
                      y: 98,
                    })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Rear Delt */}
                  <path
                    d="M92 92 C104 94 108 106 104 120 C96 122 88 112 88 102 C88 96 90 92 92 92 Z"
                    fill={
                      isHighlighted('shoulders')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('shoulders') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('shoulders') ? 2.2 : 0.8}
                    filter={isHighlighted('shoulders') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('shoulders') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Rear Delt */}
                  <path
                    d="M208 92 C196 94 192 106 196 120 C204 122 212 112 212 102 C212 96 210 92 208 92 Z"
                    fill={
                      isHighlighted('shoulders')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('shoulders') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('shoulders') ? 2.2 : 0.8}
                    filter={isHighlighted('shoulders') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('shoulders') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* TRICEPS BRACHII (POSTERIOR ARMS) */}
                <g
                  onClick={() =>
                    handleMuscleClick('triceps', 'Triceps Brachii (Arm Extensors)', {
                      x: 82,
                      y: 144,
                    })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Tricep */}
                  <path
                    d="M84 124 C94 126 94 154 88 170 C78 168 76 146 78 132 C80 126 82 124 84 124 Z"
                    fill={
                      isHighlighted('triceps') || isHighlighted('arms')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={
                      isHighlighted('triceps') || isHighlighted('arms')
                        ? '#fef08a'
                        : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth={isHighlighted('triceps') || isHighlighted('arms') ? 2.5 : 0.8}
                    filter={
                      isHighlighted('triceps') || isHighlighted('arms')
                        ? 'url(#real-muscle-glow)'
                        : undefined
                    }
                    className={
                      isHighlighted('triceps') || isHighlighted('arms')
                        ? 'animate-pulse'
                        : 'hover:opacity-75'
                    }
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Tricep */}
                  <path
                    d="M216 124 C206 126 206 154 212 170 C222 168 224 146 222 132 C220 126 218 124 216 124 Z"
                    fill={
                      isHighlighted('triceps') || isHighlighted('arms')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={
                      isHighlighted('triceps') || isHighlighted('arms')
                        ? '#fef08a'
                        : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth={isHighlighted('triceps') || isHighlighted('arms') ? 2.5 : 0.8}
                    filter={
                      isHighlighted('triceps') || isHighlighted('arms')
                        ? 'url(#real-muscle-glow)'
                        : undefined
                    }
                    className={
                      isHighlighted('triceps') || isHighlighted('arms')
                        ? 'animate-pulse'
                        : 'hover:opacity-75'
                    }
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* LOWER BACK (ERECTOR SPINAE / LUMBAR) */}
                <g
                  onClick={() =>
                    handleMuscleClick('back', 'Erector Spinae (Lower Back Spinal Column)', {
                      x: 150,
                      y: 190,
                    })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  <path
                    d="M140 170 C146 168 154 168 160 170 C162 192 162 208 158 214 C152 216 148 216 142 214 C138 208 138 192 140 170 Z"
                    fill={
                      isHighlighted('back')
                        ? 'url(#secondary-ember-glow)'
                        : 'rgba(255,255,255,0.02)'
                    }
                    stroke={isHighlighted('back') ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={isHighlighted('back') ? 2 : 0.6}
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* GLUTEUS MAXIMUS (GLUTES) */}
                <g
                  onClick={() =>
                    handleMuscleClick('glutes', 'Gluteus Maximus (Glutes / Hip Extensors)', {
                      x: 150,
                      y: 236,
                    })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Glute */}
                  <path
                    d="M120 216 C144 216 148 228 147 254 C134 262 116 256 114 238 C114 226 116 218 120 216 Z"
                    fill={
                      isHighlighted('glutes')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('glutes') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('glutes') ? 2.5 : 0.8}
                    filter={isHighlighted('glutes') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('glutes') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Glute */}
                  <path
                    d="M180 216 C156 216 152 228 153 254 C166 262 184 256 186 238 C186 226 184 218 180 216 Z"
                    fill={
                      isHighlighted('glutes')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('glutes') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('glutes') ? 2.5 : 0.8}
                    filter={isHighlighted('glutes') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('glutes') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* HAMSTRINGS (BICEPS FEMORIS & SEMITENDINOSUS) */}
                <g
                  onClick={() =>
                    handleMuscleClick('hamstrings', 'Hamstrings (Posterior Thighs)', {
                      x: 130,
                      y: 288,
                    })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Hamstring */}
                  <path
                    d="M118 260 C134 260 144 268 144 298 C144 316 136 324 126 322 C118 316 114 290 118 260 Z"
                    fill={
                      isHighlighted('hamstrings') || isHighlighted('legs')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={
                      isHighlighted('hamstrings') || isHighlighted('legs')
                        ? '#fef08a'
                        : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth={
                      isHighlighted('hamstrings') || isHighlighted('legs') ? 2.5 : 0.8
                    }
                    filter={
                      isHighlighted('hamstrings') || isHighlighted('legs')
                        ? 'url(#real-muscle-glow)'
                        : undefined
                    }
                    className={
                      isHighlighted('hamstrings') || isHighlighted('legs')
                        ? 'animate-pulse'
                        : 'hover:opacity-75'
                    }
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Hamstring */}
                  <path
                    d="M182 260 C166 260 156 268 156 298 C156 316 164 324 174 322 C182 316 186 290 182 260 Z"
                    fill={
                      isHighlighted('hamstrings') || isHighlighted('legs')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={
                      isHighlighted('hamstrings') || isHighlighted('legs')
                        ? '#fef08a'
                        : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth={
                      isHighlighted('hamstrings') || isHighlighted('legs') ? 2.5 : 0.8
                    }
                    filter={
                      isHighlighted('hamstrings') || isHighlighted('legs')
                        ? 'url(#real-muscle-glow)'
                        : undefined
                    }
                    className={
                      isHighlighted('hamstrings') || isHighlighted('legs')
                        ? 'animate-pulse'
                        : 'hover:opacity-75'
                    }
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>

                {/* CALVES (GASTROCNEMIUS & SOLEUS) */}
                <g
                  onClick={() =>
                    handleMuscleClick('calves', 'Gastrocnemius & Soleus (Calves)', {
                      x: 128,
                      y: 352,
                    })
                  }
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Left Calf Rear */}
                  <path
                    d="M116 328 C132 328 136 348 134 374 C124 376 118 358 116 338 Z"
                    fill={
                      isHighlighted('calves')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('calves') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('calves') ? 2.2 : 0.8}
                    filter={isHighlighted('calves') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('calves') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* Right Calf Rear */}
                  <path
                    d="M184 328 C168 328 164 348 166 374 C176 376 182 358 184 338 Z"
                    fill={
                      isHighlighted('calves')
                        ? activeDisplayMode === 'thermal'
                          ? 'url(#active-thermal-glow)'
                          : 'url(#active-amber-glow)'
                        : 'rgba(255,255,255,0.03)'
                    }
                    stroke={isHighlighted('calves') ? '#fef08a' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isHighlighted('calves') ? 2.2 : 0.8}
                    filter={isHighlighted('calves') ? 'url(#real-muscle-glow)' : undefined}
                    className={isHighlighted('calves') ? 'animate-pulse' : 'hover:opacity-75'}
                    style={{ mixBlendMode: 'screen' }}
                  />
                </g>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Target Chips Legend (Fits cleanly on mobile) */}
      <div className="shrink-0 space-y-1 pt-1 border-t border-slate-800/80">
        {primaryMusclesText.length > 0 && (
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider shrink-0">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Target:</span>
            </span>
            <div className="flex flex-wrap gap-1 justify-end">
              {primaryMusclesText.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-amber-500/15 text-amber-300 font-semibold px-2 py-0.5 rounded-lg border border-amber-500/30 text-[10px]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {secondaryMusclesText.length > 0 && (
          <div className="flex items-center justify-between gap-1 text-[9px] text-slate-400">
            <span className="uppercase tracking-wider font-semibold shrink-0">Secondary:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {secondaryMusclesText.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
