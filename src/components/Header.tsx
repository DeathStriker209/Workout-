import React from 'react';
import { Dumbbell, RotateCcw, Timer, Sparkles } from 'lucide-react';

interface HeaderProps {
  completedSessionsCount: number;
  totalSessionsCount: number;
  onOpenTimer: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  completedSessionsCount,
  totalSessionsCount,
  onOpenTimer,
  onResetAll,
}) => {
  return (
    <header className="shrink-0 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2 w-full z-20 select-none">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Brand Icon + Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 shrink-0">
            <Dumbbell className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-extrabold tracking-tight text-slate-100 font-display block leading-none">
              ApexLift
            </span>
            <span className="text-[9px] text-amber-400 font-mono tracking-tight block">
              7-Day Mobile Guide
            </span>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick 2-Minute Rest Timer Button */}
          <button
            onClick={onOpenTimer}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-400 transition-all active:scale-95 shadow-sm"
            title="Start 2-minute rest interval"
          >
            <Timer className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px]">2m Rest</span>
          </button>

          {/* Reset Week Progress */}
          <button
            onClick={onResetAll}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl border border-slate-800 transition-colors shrink-0"
            title="Reset weekly progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
