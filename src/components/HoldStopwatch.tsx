import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import { playChime } from '../utils/audio';

interface HoldStopwatchProps {
  targetSeconds?: number;
  label?: string;
  onFinish?: (elapsedSeconds: number) => void;
}

export const HoldStopwatch: React.FC<HoldStopwatchProps> = ({
  targetSeconds = 30,
  label = 'Isometric Hold Timer',
  onFinish,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (targetSeconds && next === targetSeconds) {
            playChime(780, 0.3);
          }
          return next;
        });
      }, 1000);
    } else if (!isActive && seconds !== 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, targetSeconds]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const handleCompleteHold = () => {
    setIsActive(false);
    playChime(1000, 0.4);
    if (onFinish) {
      onFinish(seconds);
    }
  };

  const formatMinSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`} />
        <div>
          <span className="text-slate-400 font-medium block">{label}</span>
          <span className="text-[11px] text-slate-500">
            {targetSeconds ? `Target: ~${targetSeconds}s to near failure` : 'Stopwatch'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-lg font-bold text-amber-400 tabular-nums">
          {formatMinSec(seconds)}
        </span>

        <button
          onClick={handleToggle}
          className={`p-2 rounded-lg font-semibold transition-all ${
            isActive
              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
              : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
          }`}
          title={isActive ? 'Pause' : 'Start Hold'}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {seconds > 0 && (
          <button
            onClick={handleCompleteHold}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
            title="Log Hold as Set Done"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        )}
      </div>
    </div>
  );
};
