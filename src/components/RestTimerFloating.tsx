import React, { useEffect, useState } from 'react';
import { Timer, X, Pause, Play, Plus, Minus, RotateCcw } from 'lucide-react';
import { playChime } from '../utils/audio';

interface RestTimerFloatingProps {
  initialSeconds?: number;
  exerciseName?: string;
  onClose: () => void;
}

export const RestTimerFloating: React.FC<RestTimerFloatingProps> = ({
  initialSeconds = 120,
  exerciseName = 'Rest Interval',
  onClose,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [totalTime, setTotalTime] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setTotalTime(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playChime(920, 0.4);
          clearInterval(timer);
          return 0;
        }
        if (prev === 4 || prev === 3 || prev === 2) {
          playChime(600, 0.15); // subtle tick down
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const addTime = (delta: number) => {
    setSecondsLeft((prev) => Math.max(0, prev + delta));
    setTotalTime((prev) => Math.max(prev, secondsLeft + delta));
  };

  const progressPercent = totalTime > 0 ? ((totalTime - secondsLeft) / totalTime) * 100 : 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="absolute bottom-16 left-3 right-3 z-40 max-w-[390px] mx-auto bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-2xl p-3 backdrop-blur-lg animate-slideUp">
      {/* Progress Line */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-amber-500 h-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Timer className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              2-Min Rest Timer
            </span>
            <h4 className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">{exerciseName}</h4>
          </div>
        </div>

        {/* Big Countdown Numbers */}
        <div className="font-mono text-2xl font-bold tracking-tight text-amber-400 tabular-nums">
          {formattedTime}
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Dismiss rest timer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Timer Controls with +10s and -10s */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addTime(-10)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium transition-colors border border-slate-700/50"
            title="Subtract 10 seconds"
          >
            -10s
          </button>
          <button
            onClick={() => addTime(10)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium transition-colors border border-slate-700/50"
            title="Add 10 seconds"
          >
            +10s
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSecondsLeft(120)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset to 2 minutes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
