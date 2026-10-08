import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Pause, Play, Plus, RotateCcw, Timer as TimerIcon, X } from 'lucide-react';
import { playChime } from '../utils/audio';
import { EASE, Tap } from './ui';

type TimerState = { total: number; endAt: number | null; pausedLeft: number; label: string } | null;

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * Rest timer driven by the clock, not by counting ticks. Android pauses the app when the
 * screen locks; because we store the end time, the countdown is still right when you come back.
 */
export function useRestTimer() {
  const [t, setT] = useState<TimerState>(null);
  const [now, setNow] = useState(() => Date.now());
  const running = !!t?.endAt;
  const left = t ? (t.endAt ? Math.max(0, Math.ceil((t.endAt - now) / 1000)) : t.pausedLeft) : 0;

  useEffect(() => {
    if (!running) return;
    const i = window.setInterval(() => setNow(Date.now()), 250);
    const wake = () => setNow(Date.now());
    document.addEventListener('visibilitychange', wake);
    return () => { clearInterval(i); document.removeEventListener('visibilitychange', wake); };
  }, [running]);

  // finished
  useEffect(() => {
    if (t?.endAt && left === 0) {
      setT({ ...t, endAt: null, pausedLeft: 0 });
      playChime(880, 0.4); window.setTimeout(() => playChime(1320, 0.5), 200);
      try { navigator.vibrate?.([200, 100, 200]); } catch { /* not supported */ }
    }
  }, [left, t]);

  const start = useCallback((s: number, label = 'Rest') => {
    const n = Date.now(); setNow(n);
    setT({ total: s, endAt: n + s * 1000, pausedLeft: s, label });
  }, []);
  const toggle = () => {
    if (!t) return;
    const n = Date.now(); setNow(n);
    if (t.endAt) setT({ ...t, endAt: null, pausedLeft: left });
    else if (left === 0) setT({ ...t, endAt: n + t.total * 1000, pausedLeft: t.total });
    else setT({ ...t, endAt: n + left * 1000 });
  };
  const adjust = (d: number) => {
    if (!t) return;
    const n = Date.now(); setNow(n);
    const nl = Math.max(5, left + d);
    setT({ ...t, total: Math.max(d > 0 && left === 0 ? nl : t.total, nl), endAt: t.endAt || left === 0 ? n + nl * 1000 : null, pausedLeft: nl });
  };
  const close = () => setT(null);
  return { t, left, running, done: !!t && left === 0, start, toggle, adjust, close };
}
export type RestTimerApi = ReturnType<typeof useRestTimer>;

function Ring({ size, stroke, frac, done }: { size: number; stroke: number; frac: number; done: boolean }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90 block" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#26262e" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={done ? '#4ade80' : '#ff5733'} strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
        style={{ transition: 'stroke-dashoffset .3s linear, stroke .3s' }} />
    </svg>
  );
}

/** Small floating timer above the tab bar. Tap it to open the big timer. */
export function TimerDock({ api, onExpand }: { api: RestTimerApi; onExpand: () => void }) {
  const { t, left, running, done } = api;
  return (
    <AnimatePresence>
      {t && (
        <motion.div className="fixed inset-x-0 bottom-[calc(5.6rem+env(safe-area-inset-bottom))] max-w-md mx-auto px-4 z-40"
          initial={{ y: 40, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.28, ease: EASE }}>
          <div className={`flex items-center gap-3 rounded-[22px] p-2 pr-2.5 border backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,.55)] transition-colors ${done ? 'bg-[#13261a]/95 border-[#4ade80]/30' : 'bg-[#1b1b21]/95 border-white/[.06]'}`}>
            <Tap onClick={onExpand} className="flex items-center gap-3 flex-1 min-w-0 text-left" scale={0.97} aria-label="Open timer">
              <div className="relative">
                <Ring size={46} stroke={4} frac={t.total ? left / t.total : 0} done={done} />
                <div className={`absolute inset-0 flex items-center justify-center ${done ? 'text-[#4ade80]' : 'text-[#ff6a4a]'}`}><TimerIcon size={17} /></div>
              </div>
              <div className="min-w-0">
                <div className={`font-display text-[1.6rem] leading-none tabular-nums ${done ? 'text-[#4ade80]' : ''}`}>{done ? 'Go!' : fmt(left)}</div>
                <div className="text-[#9a9aa3] text-xs truncate mt-1">{done ? 'Rest over, next set' : t.label}</div>
              </div>
            </Tap>
            <Tap onClick={() => api.adjust(15)} className="h-10 px-3 rounded-xl bg-[#26262e] text-xs font-bold" aria-label="Add 15 seconds">+15</Tap>
            <Tap onClick={api.toggle} className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? 'bg-[#4ade80] text-black' : 'bg-[#ff5733]'}`} aria-label={running ? 'Pause' : done ? 'Restart' : 'Resume'}>
              {running ? <Pause size={17} fill="currentColor" /> : done ? <RotateCcw size={17} /> : <Play size={17} fill="currentColor" />}
            </Tap>
            <Tap onClick={api.close} className="w-8 h-10 flex items-center justify-center text-[#6b6b74]" aria-label="Close timer"><X size={18} /></Tap>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const PRESETS = [45, 60, 90, 120, 180];

/** Big timer, shown inside a bottom sheet. */
export function TimerPanel({ api }: { api: RestTimerApi }) {
  const { t, left, running, done } = api;
  const total = t?.total ?? 120;
  const shown = t ? left : 120;
  return (
    <div className="text-center">
      <h2 className="font-display text-xl">Rest timer</h2>
      <p className="text-[#9a9aa3] text-sm mt-1 truncate">{t ? t.label : 'Pick a rest time to start'}</p>
      <div className="relative w-[232px] h-[232px] mx-auto mt-6">
        <Ring size={232} stroke={12} frac={t ? shown / total : 1} done={done} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div key={done ? 'done' : 'run'} initial={{ scale: done ? 0.8 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={`font-display text-[3.6rem] leading-none tabular-nums ${done ? 'text-[#4ade80]' : ''}`}>{done ? 'Go!' : fmt(shown)}</motion.div>
          <div className="text-[#9a9aa3] text-xs mt-2">{done ? 'Rest over' : running ? `of ${fmt(total)}` : t ? 'Paused' : 'Ready'}</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <Tap onClick={() => (t ? api.adjust(-15) : api.start(105))} className="w-14 h-14 rounded-full bg-[#26262e] flex items-center justify-center" aria-label="Minus 15 seconds"><Minus size={20} /></Tap>
        <Tap onClick={() => (t ? api.toggle() : api.start(120))} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,87,51,.35)] ${done ? 'bg-[#4ade80] text-black shadow-none' : 'bg-[#ff5733]'}`} aria-label={running ? 'Pause' : 'Start'}>
          {running ? <Pause size={30} fill="currentColor" /> : done ? <RotateCcw size={28} /> : <Play size={30} fill="currentColor" className="ml-1" />}
        </Tap>
        <Tap onClick={() => (t ? api.adjust(15) : api.start(135))} className="w-14 h-14 rounded-full bg-[#26262e] flex items-center justify-center" aria-label="Plus 15 seconds"><Plus size={20} /></Tap>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {PRESETS.map((s) => (
          <Tap key={s} onClick={() => api.start(s, t?.label && t.label !== 'Rest' ? t.label : 'Rest')}
            className={`h-10 px-3.5 rounded-full text-sm font-semibold ${t?.total === s ? 'bg-[#3a1d18] text-[#ff5733]' : 'bg-[#1d1d23] text-[#c4c4cc]'}`}>{fmt(s)}</Tap>
        ))}
      </div>
    </div>
  );
}
