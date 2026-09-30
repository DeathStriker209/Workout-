import React from 'react';
import { Dumbbell, Flame, Trophy, Timer } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'workout' | 'anatomy' | 'history';
  onSelectTab: (tab: 'workout' | 'anatomy' | 'history') => void;
  onOpenRestTimer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenRestTimer,
}) => {
  return (
    <nav className="shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 z-30 select-none">
      <div className="flex items-center justify-around">
        {/* TAB 1: WORKOUT */}
        <button
          onClick={() => onSelectTab('workout')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'workout'
              ? 'text-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-lg ${
              activeTab === 'workout' ? 'bg-amber-500/20' : 'bg-transparent'
            }`}
          >
            <Dumbbell className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">Workouts</span>
        </button>

        {/* TAB 2: 3D ANATOMY */}
        <button
          onClick={() => onSelectTab('anatomy')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'anatomy'
              ? 'text-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-lg ${
              activeTab === 'anatomy' ? 'bg-amber-500/20' : 'bg-transparent'
            }`}
          >
            <Flame className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">3D Anatomy</span>
        </button>

        {/* QUICK 2-MIN REST TIMER BUTTON */}
        <button
          onClick={onOpenRestTimer}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-amber-300 hover:text-amber-200 active:scale-95 transition-all"
        >
          <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Timer className="w-4 h-4 animate-pulse stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">2m Rest</span>
        </button>

        {/* TAB 3: PROGRESS */}
        <button
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'text-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-lg ${
              activeTab === 'history' ? 'bg-amber-500/20' : 'bg-transparent'
            }`}
          >
            <Trophy className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">Progress</span>
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-28 h-1 bg-slate-800 rounded-full mx-auto mt-1" />
    </nav>
  );
};
