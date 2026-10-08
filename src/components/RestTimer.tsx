import React, { useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Pause, Play, Plus, RotateCcw, Timer as TimerIcon, X } from 'lucide-react';
import { playChime } from '../utils/audio';
import { EASE, Tap } from './ui';

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// ─────────────────────────────────────────────────────────────────────────────
// Timer store. It lives outside React so the ticking clock only re-renders the
// timer itself, never the whole app. The countdown is worked out from the end
// time, so it stays correct when Android pauses the app with the screen locked.
// ─────────────────────────────────────────────────────────────────────────────
export type TimerBase = { total: number; endAt: number | null; pausedLeft: number; label: string } | null;

let base: TimerBase = null;
let now = Date.now();
let ticker: number | undefined;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

const leftOf = (b: TimerBase, n: number) => (b ? (b.endAt ? Math.max(0, Math.ceil((b.endAt - n) / 1000)) : b.pausedLeft) : 0);

function tick() {
  now = Date.now();
  if (base?.endAt && now >= base.endAt) {
    base = { ...base, endAt: null, pausedLeft: 0 };
    playChime(880, 0.4); window.setTimeout(() => playChime(1320, 0.5), 200);
    try { navigator.vibrate?.([200, 100, 200]); } catch { /* not supported */ }
  }
  syncTicker();
  emit();
}
function syncTicker() {
  const running = !!base?.endAt;
  if (running && ticker === undefined) ticker = window.setInterval(tick, 500);
  if (!running && ticker !== undefined) { clearInterval(ticker); ticker = undefined; }
}
const set = (b: TimerBase) => { base = b; now = Date.now(); syncTicker(); emit(); };
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => base?.endAt && tick());

export const timer = {
  start(s: number, label = 'Rest') { const n = Date.now(); set({ total: s, endAt: n + s * 1000, pausedLeft: s, label }); },
  toggle() {
    if (!base) return;
    const n = Date.now(), left = leftOf(base, n);
    if (base.endAt) set({ ...base, endAt: null, pausedLeft: left });
    else if (left === 0) set({ ...base, endAt: n + base.total * 1000, pausedLeft: base.total });
    else set({ ...base, endAt: n + left * 1000 });
  },
  adjust(d: number) {
    if (!base) return;
    const n = Date.now(), left = leftOf(base, n), nl = Math.max(5, left + d);
    const keepRunning = !!base.endAt || left === 0;
    set({ ...base, total: Math.max(left === 0 ? nl : base.total, nl), endAt: keepRunning ? n + nl * 1000 : null, pausedLeft: nl });
  },
  close() { set(null); },
};

/** Changes only when the timer is started, paused, adjusted or closed. Cheap for the app shell. */
export const useTimerBase = () => useSyncExternalStore(subscribe, () => base);
/** Live countdown. Only the timer UI uses this. */
function useTimerLive() {
  const b = useTimerBase();
  const n = useSyncExternalStore(subscribe, () => now);
  const left = leftOf(b, n);
  return { t: b, left, running: !!b?.endAt, done: !!b && left === 0 };
}

function Ring({ size, stroke, frac, done }: { size: number; stroke: number; frac: number; done: boolean }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90 block" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#26262e" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={done ? '#4ade80' : '#ff5733'} strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
        style={{ transition: 'stroke-dashoffset .5s linear, stroke .3s' }} />
    </svg>
  );
}

/** Small floating timer above the tab bar. Tap it to open the big timer. */
export function TimerDock({ onExpand }: { onExpand: () => void }) {
  const { t, left, running, done } = useTimerLive();
  return (
    <AnimatePresence>
      {t && (
        <motion.div className="fixed inset-x-0 bottom-[calc(5.6rem+env(safe-area-inset-bottom))] max-w-md mx-auto px-4 z-40"
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}>
          <div className={`flex items-center gap-3 rounded-[22px] p-2 pr-2.5 border shadow-[0_8px_24px_rgba(0,0,0,.5)] transition-colors ${done ? 'bg-[#13261a] border-[#4ade80]/30' : 'bg-[#1b1b21] border-white/[.06]'}`}>
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
            <Tap onClick={() => timer.adjust(15)} className="h-10 px-3 rounded-xl bg-[#26262e] text-xs font-bold" aria-label="Add 15 seconds">+15</Tap>
            <Tap onClick={timer.toggle} className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? 'bg-[#4ade80] text-black' : 'bg-[#ff5733]'}`} aria-label={running ? 'Pause' : done ? 'Restart' : 'Resume'}>
              {running ? <Pause size={17} fill="currentColor" /> : done ? <RotateCcw size={17} /> : <Play size={17} fill="currentColor" />}
            </Tap>
            <Tap onClick={timer.close} className="w-8 h-10 flex items-center justify-center text-[#6b6b74]" aria-label="Close timer"><X size={18} /></Tap>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const PRESETS = [45, 60, 90, 120, 180];

/** Big timer, shown inside a bottom sheet. */
export function TimerPanel() {
  const { t, left, running, done } = useTimerLive();
  const total = t?.total ?? 120;
  const shown = t ? left : 120;
  return (
    <div className="text-center">
      <h2 className="font-display text-xl">Rest timer</h2>
      <p className="text-[#9a9aa3] text-sm mt-1 truncate">{t ? t.label : 'Pick a rest time to start'}</p>
      <div className="relative w-[232px] h-[232px] mx-auto mt-6">
        <Ring size={232} stroke={12} frac={t ? shown / total : 1} done={done} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-display text-[3.6rem] leading-none tabular-nums ${done ? 'text-[#4ade80] pop' : ''}`}>{done ? 'Go!' : fmt(shown)}</div>
          <div className="text-[#9a9aa3] text-xs mt-2">{done ? 'Rest over' : running ? `of ${fmt(total)}` : t ? 'Paused' : 'Ready'}</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <Tap onClick={() => (t ? timer.adjust(-15) : timer.start(105))} className="w-14 h-14 rounded-full bg-[#26262e] flex items-center justify-center" aria-label="Minus 15 seconds"><Minus size={20} /></Tap>
        <Tap onClick={() => (t ? timer.toggle() : timer.start(120))} className={`w-20 h-20 rounded-full flex items-center justify-center ${done ? 'bg-[#4ade80] text-black' : 'bg-[#ff5733] shadow-[0_8px_20px_rgba(255,87,51,.3)]'}`} aria-label={running ? 'Pause' : 'Start'}>
          {running ? <Pause size={30} fill="currentColor" /> : done ? <RotateCcw size={28} /> : <Play size={30} fill="currentColor" className="ml-1" />}
        </Tap>
        <Tap onClick={() => (t ? timer.adjust(15) : timer.start(135))} className="w-14 h-14 rounded-full bg-[#26262e] flex items-center justify-center" aria-label="Plus 15 seconds"><Plus size={20} /></Tap>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {PRESETS.map((s) => (
          <Tap key={s} onClick={() => timer.start(s, t?.label ?? 'Rest')}
            className={`h-10 px-3.5 rounded-full text-sm font-semibold ${t?.total === s ? 'bg-[#3a1d18] text-[#ff5733]' : 'bg-[#1d1d23] text-[#c4c4cc]'}`}>{fmt(s)}</Tap>
        ))}
      </div>
    </div>
  );
}
