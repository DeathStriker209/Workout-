import React, { useCallback, useEffect, useRef, useState } from 'react';
import { App as CapApp } from '@capacitor/app';
import confetti from 'canvas-confetti';
import { MotionConfig, motion } from 'motion/react';
import {
  BedDouble, Check, ChevronLeft, ChevronRight, Droplets, Dumbbell, Footprints, Heart, House, Moon, RotateCcw,
  Search, Timer, Utensils, X, Ban, CircleAlert, CircleCheck, Play, ArrowLeftRight,
} from 'lucide-react';
import { WORKOUT_DAYS as DAYS } from './data/workoutData';
import { LIBRARY_EXERCISES } from './data/exerciseLibrary';
import { ALTERNATIVES } from './data/alternatives';
import { Category, CompletedSetLog, DayWorkout, Exercise, MuscleGroup, WorkoutState } from './types/workout';
import { Body, MUSCLE_LABEL, regionsFor } from './components/Body';
import { EquipArt } from './components/Equip';
import { Splash } from './components/Splash';
import { Confirm, Sheet, Tap } from './components/ui';
import { TimerDock, TimerPanel, fmt, timer, useTimerBase } from './components/RestTimer';
import { playChime } from './utils/audio';

const KEY = 'apexlift_workout_tracker_state_v4';
const blank: WorkoutState = { setLogs: {}, completedDays: {}, swaps: {} };

// ---------- design tokens (kept as class strings so Tailwind can see them) ----------
const card = 'bg-[#17171c] rounded-[24px] border border-white/[.04]';
const pill = 'inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff6a4a] bg-[#3a1d18] rounded-full px-3 py-1.5';
const muted = 'text-[#9a9aa3]';
const NAV_DELAY = 60; // ms: lets the press animation show before the screen changes
const LETTERS = 'ABCDEFG';

type Nav = { tab: 'home' | 'ex'; day?: string; cat?: Category; ex?: string };
const depth = (n: Nav) => (n.ex ? 3 : n.day || n.cat ? 2 : 1);
const parentOf = (n: Nav): Nav | null =>
  n.ex ? { tab: n.tab, day: n.day, cat: n.cat }
  : n.day ? { tab: 'home' }
  : n.cat ? { tab: 'ex' }
  : n.tab === 'ex' ? { tab: 'home' }
  : null;

// ---------- exercise catalogue ----------
const PLAN_EX: Exercise[] = [];
{
  const seen = new Set<string>();
  DAYS.forEach((d) => d.exercises.forEach((e) => {
    if (e.hideInLibrary || seen.has(e.name)) return;
    seen.add(e.name); PLAN_EX.push(e);
  }));
}
const ALL: Exercise[] = [...PLAN_EX, ...LIBRARY_EXERCISES];
const BY_ID = new Map<string, Exercise>();
DAYS.forEach((d) => d.exercises.forEach((e) => BY_ID.set(e.id, e)));
ALL.forEach((e) => BY_ID.set(e.id, e));

/** Option A (the planned exercise) followed by its swap options. */
const optionsFor = (slot: Exercise): Exercise[] =>
  [slot, ...(ALTERNATIVES[slot.id] ?? []).map((id) => BY_ID.get(id)).filter((x): x is Exercise => !!x)];

const CATS: { c: Category; view: 'front' | 'back' | 'frontUpper' | 'backUpper' | 'frontLower'; on: MuscleGroup[] }[] = [
  { c: 'Chest', view: 'frontUpper', on: ['chest'] },
  { c: 'Back', view: 'backUpper', on: ['lats', 'upperback', 'traps', 'lowerback'] },
  { c: 'Shoulders', view: 'frontUpper', on: ['shoulders'] },
  { c: 'Biceps', view: 'frontUpper', on: ['biceps'] },
  { c: 'Triceps', view: 'backUpper', on: ['triceps'] },
  { c: 'Forearms', view: 'frontUpper', on: ['forearms'] },
  { c: 'Legs', view: 'frontLower', on: ['quadriceps', 'adductors', 'abductors', 'calves'] },
  { c: 'Core', view: 'frontUpper', on: ['abs', 'obliques'] },
  { c: 'Cardio', view: 'front', on: [] },
];

const TRAINING_DAYS = DAYS.filter((d) => d.category !== 'rest');
const setKey = (d: string, e: string, n: number) => `${d}_${e}_set_${n}`;
const totalSets = (d: DayWorkout) => (d.category === 'rest' ? 0 : d.exercises.reduce((a, e) => a + e.sets.length, 0));
const doneSets = (d: DayWorkout, logs: Record<string, CompletedSetLog>) =>
  d.category === 'rest' ? 0 : d.exercises.reduce((a, e) => a + e.sets.filter((s) => logs[setKey(d.id, e.id, s.setNum)]?.completed).length, 0);
const exDone = (d: DayWorkout, e: Exercise, logs: Record<string, CompletedSetLog>) =>
  e.sets.length > 0 && e.sets.every((s) => logs[setKey(d.id, e.id, s.setNum)]?.completed);
const setsSummary = (e: Exercise) => {
  const r = e.sets.map((s) => s.targetReps).filter(Boolean) as string[];
  if (r.length) return `${e.sets.length} × ${new Set(r).size === 1 ? r[0] : r.join(' / ')} reps`;
  const t = e.sets[0];
  if (t?.isTimed && t.targetSeconds) return e.sets.length > 1 ? `${e.sets.length} × ${t.targetSeconds}s` : `${Math.round(t.targetSeconds / 60)} min`;
  return t?.targetDescription ?? '';
};
const todayNumber = () => ((new Date().getDay() + 6) % 7) + 1;

// ---------- small pieces ----------
/** List picture: a small still image (fast), then the photo, then an equipment drawing. */
function Thumb({ ex, size = 56 }: { ex: Exercise; size?: number }) {
  const [step, setStep] = useState(0);
  const src = step === 0 ? `/exercise-thumbs/${ex.id}.webp` : step === 1 ? ex.photos?.[0]?.url : undefined;
  return (
    <div className="rounded-2xl bg-white overflow-hidden shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      {src ? <img src={src} alt="" loading="lazy" decoding="async" width={size} height={size} className="w-full h-full object-contain"
        onError={() => setStep((s) => (s === 0 && ex.photos?.length ? 1 : 2))} />
        : <div className="w-full h-full bg-[#26262e] flex items-center justify-center"><EquipArt kind={ex.equipment.kind} h={size * 0.55} /></div>}
    </div>
  );
}

/** Big form demo: animated GIF, falling back to the two-position photos. */
function FormPic({ ex }: { ex: Exercise }) {
  const photos = ex.photos ?? [];
  const [i, setI] = useState(0);
  const [noGif, setNoGif] = useState(false);
  const [bad, setBad] = useState(false);
  useEffect(() => {
    if (!noGif || photos.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % photos.length), 1000);
    return () => clearInterval(t);
  }, [noGif, photos.length]);
  if (!noGif)
    return (
      <div className="bg-white rounded-[24px] overflow-hidden">
        <img src={`/exercise-gifs/${ex.id}.gif`} alt={`${ex.name} demonstration`} decoding="async" className="w-full max-h-[19rem] object-contain block mx-auto" onError={() => setNoGif(true)} />
      </div>
    );
  if (bad || !photos.length) return null;
  return (
    <div className="relative bg-white rounded-[24px] overflow-hidden">
      {photos.map((p, k) => (
        <img key={p.url} src={p.url} alt={p.label} onError={() => setBad(true)}
          className={`w-full block transition-opacity duration-300 ${k ? 'absolute inset-0 h-full object-contain' : ''}`} style={{ opacity: i === k ? 1 : 0 }} />
      ))}
    </div>
  );
}

function Stopwatch({ target }: { target?: number }) {
  const [start, setStart] = useState<number | null>(null);
  const [base, setBase] = useState(0);
  const [, force] = useState(0);
  useEffect(() => { if (start === null) return; const i = setInterval(() => force((x) => x + 1), 500); return () => clearInterval(i); }, [start]);
  const t = base + (start ? Math.floor((Date.now() - start) / 1000) : 0);
  const hit = useRef(false);
  useEffect(() => { if (target && t >= target && !hit.current) { hit.current = true; playChime(780, 0.3); } }, [t, target]);
  const frac = target ? Math.min(1, t / target) : 0;
  return (
    <div className={`${card} p-4 flex items-center gap-4`}>
      <div className="flex-1">
        <div className={`${muted} text-xs`}>{target ? `Hold timer, target ${fmt(target)}` : 'Hold timer'}</div>
        <div className="font-display text-[1.9rem] leading-tight tabular-nums">{fmt(t)}</div>
        {target ? <div className="h-1 rounded-full bg-[#26262e] mt-1.5 overflow-hidden"><div className="bar h-full bg-[#ff5733]" style={{ transform: `scaleX(${frac})` }} /></div> : null}
      </div>
      <Tap onClick={() => { if (start) { setBase(t); setStart(null); } else setStart(Date.now()); }} className="h-11 px-5 rounded-2xl bg-[#ff5733] font-semibold">{start ? 'Stop' : 'Start'}</Tap>
      <Tap onClick={() => { setStart(null); setBase(0); hit.current = false; }} className="w-11 h-11 rounded-2xl bg-[#26262e] flex items-center justify-center" aria-label="Reset stopwatch"><RotateCcw size={17} /></Tap>
    </div>
  );
}

function ProgressRing({ frac, size = 64, children }: { frac: number; size?: number; children?: React.ReactNode }) {
  const s = 6, r = (size - s) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#2a2a31" strokeWidth={s} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#ff5733" strokeWidth={s} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - frac)} style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/** Thin progress bar that grows with a transform (cheap to animate). */
const Bar = ({ frac, className = 'h-1' }: { frac: number; className?: string }) => (
  <div className={`${className} bg-[#26262e] rounded-full overflow-hidden`}>
    <div className="bar h-full rounded-full bg-[#ff5733]" style={{ transform: `scaleX(${frac})` }} />
  </div>
);

/** Option chips (A, B, C…) at the top of a plan exercise. Only scrolls sideways to keep the pick in view. */
function SwapBar({ slot, shown, onPick }: { slot: Exercise; shown: Exercise; onPick: (e: Exercise) => void }) {
  const opts = optionsFor(slot);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = ref.current, el = box?.querySelector<HTMLElement>('[data-on="true"]');
    if (box && el) box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }, [shown.id]);
  if (opts.length < 2) return null;
  return (
    <div className="-mx-5">
      <div className={`px-5 mb-2 text-[0.8rem] ${muted} flex items-center gap-1.5`}><ArrowLeftRight size={13} />Swap exercise, same muscles</div>
      <div ref={ref} className="relative flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {opts.map((o, i) => {
          const on = o.id === shown.id;
          return (
            <Tap key={o.id} data-on={on} onClick={() => onPick(o)} scale={0.94} aria-pressed={on}
              className={`shrink-0 flex items-center gap-2 h-11 pl-1.5 pr-4 rounded-full border transition-colors duration-200 ${on ? 'bg-[#ff5733] border-transparent' : 'bg-[#17171c] border-white/[.06]'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${on ? 'bg-white/25' : 'bg-[#26262e] text-[#ff6a4a]'}`}>{LETTERS[i]}</span>
              <span className={`text-[0.9rem] font-semibold whitespace-nowrap ${on ? '' : 'text-[#c9c9d0]'}`}>{o.name}</span>
            </Tap>
          );
        })}
      </div>
    </div>
  );
}

/** Staggered entrance on the home screen (CSS animation, delay from --i). */
const rise = (i: number) => ({ className: 'rise', style: { ['--i' as string]: i } as React.CSSProperties });

// =====================================================================
export default function App() {
  const [splash, setSplash] = useState(true);
  const [ready, setReady] = useState(false);
  const [nav, setNav] = useState<Nav>({ tab: 'home' });
  const [dir, setDir] = useState(0);
  const [ws, setWs] = useState<WorkoutState>(() => {
    try {
      const p = JSON.parse(localStorage.getItem(KEY) || '');
      return { setLogs: p.setLogs || {}, completedDays: p.completedDays || {}, swaps: p.swaps || {} };
    } catch { return blank; }
  });
  const [q, setQ] = useState('');
  const [sheet, setSheet] = useState<{ kind: 'muscle' | 'equip'; ex: Exercise } | { kind: 'timer' } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const timerBase = useTimerBase(); // only changes on start/pause/close, not every second

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ws)); } catch { /* storage full or blocked */ }
  }, [ws]);

  const go = (n: Nav) => {
    setDir(n.tab !== nav.tab && depth(n) === 1 ? 0 : depth(n) >= depth(nav) ? 1 : -1);
    setNav(n); window.scrollTo(0, 0);
  };

  // Android back button: close popup -> close sheet -> go up one level -> exit app
  const goBack = () => {
    if (confirmReset) { setConfirmReset(false); return; }
    if (sheet) { setSheet(null); return; }
    const p = parentOf(nav);
    if (p) go(p); else { try { CapApp.exitApp(); } catch { /* web */ } }
  };
  const backRef = useRef(goBack);
  backRef.current = goBack;
  useEffect(() => {
    const h = CapApp.addListener('backButton', () => backRef.current());
    return () => { h.then((x) => x.remove()).catch(() => {}); };
  }, []);

  /** The exercise actually being done in a plan slot (A = planned, or a swap). */
  const chosen = (dayId: string, slot: Exercise) => BY_ID.get(ws.swaps?.[`${dayId}_${slot.id}`] ?? '') ?? slot;
  const choose = (dayId: string, slot: Exercise, pick: Exercise) =>
    setWs((p) => {
      const swaps = { ...p.swaps };
      if (pick.id === slot.id) delete swaps[`${dayId}_${slot.id}`]; else swaps[`${dayId}_${slot.id}`] = pick.id;
      return { ...p, swaps };
    });

  const withDone = (p: WorkoutState, logs: Record<string, CompletedSetLog>, dayId: string): WorkoutState => {
    const d = DAYS.find((x) => x.id === dayId)!;
    const cd = { ...p.completedDays };
    const t = totalSets(d), n = doneSets(d, logs);
    if (t > 0 && n === t) {
      if (!cd[dayId]) { try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 }, colors: ['#ff5733', '#ffb199', '#ffffff', '#4aa8ff'], disableForReducedMotion: true }); } catch { /* no canvas */ } playChime(880, 0.4); }
      cd[dayId] = { completedAt: new Date().toISOString(), completedSets: n, totalSets: t };
    } else delete cd[dayId];
    return { ...p, setLogs: logs, completedDays: cd };
  };

  const toggle = (dayId: string, slot: Exercise, shown: Exercise, num: number) => {
    const k = setKey(dayId, slot.id, num);
    const cur = ws.setLogs[k];
    const was = !!cur?.completed;
    const s = slot.sets.find((x) => x.setNum === num);
    setWs((p) => withDone(p, { ...p.setLogs, [k]: { completed: !was, weightKg: cur?.weightKg ?? '', actualReps: s?.targetReps ?? '', completedAt: !was ? new Date().toISOString() : undefined } }, dayId));
    if (!was && s?.targetReps) timer.start(shown.defaultRestSeconds || slot.defaultRestSeconds || 120, shown.name);
  };

  const setKg = (dayId: string, slot: Exercise, num: number, w: string) => {
    const k = setKey(dayId, slot.id, num);
    setWs((p) => ({ ...p, setLogs: { ...p.setLogs, [k]: { ...p.setLogs[k], completed: !!p.setLogs[k]?.completed, weightKg: w } } }));
  };

  const finishDay = (d: DayWorkout) =>
    setWs((p) => {
      const logs = { ...p.setLogs };
      d.exercises.forEach((e) => e.sets.forEach((s) => {
        const k = setKey(d.id, e.id, s.setNum);
        if (!logs[k]?.completed) logs[k] = { completed: true, weightKg: logs[k]?.weightKg ?? '', actualReps: s.targetReps ?? '', completedAt: new Date().toISOString() };
      }));
      return withDone(p, logs, d.id);
    });

  const resetDay = (d: DayWorkout) =>
    setWs((p) => {
      const logs = { ...p.setLogs };
      d.exercises.forEach((e) => e.sets.forEach((s) => delete logs[setKey(d.id, e.id, s.setNum)]));
      const cd = { ...p.completedDays };
      delete cd[d.id];
      return { ...p, setLogs: logs, completedDays: cd };
    });

  // Keeps your exercise swaps; clears ticks and weights.
  const doResetAll = () => { setWs((p) => ({ ...blank, swaps: p.swaps })); timer.close(); setConfirmReset(false); };

  const back = (label: string) => (
    <Tap onClick={goBack} scale={0.92} className="flex items-center gap-0.5 -ml-1.5 h-10 pr-3 text-[#ff6a4a] text-[1.05rem] font-semibold">
      <ChevronLeft size={22} /> {label}
    </Tap>
  );

  const row = (e: Exercise, sub: React.ReactNode, onClick: () => void, done = false, key?: string) => (
    <Tap key={key ?? e.id} onClick={onClick} delay={NAV_DELAY} scale={0.97}
      className={`${card} w-full text-left flex items-center gap-3.5 p-2.5 pr-4`}>
      <Thumb ex={e} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[1.05rem] leading-snug">{e.name}</div>
        <div className={`${muted} text-[0.85rem] truncate mt-0.5`}>{sub}</div>
      </div>
      {done
        ? <span className="w-7 h-7 rounded-full bg-[#ff5733] flex items-center justify-center"><Check size={16} strokeWidth={3} /></span>
        : <ChevronRight size={18} className="text-[#55555e]" />}
    </Tap>
  );

  // ---------- HOME ----------
  const home = () => {
    const tn = todayNumber();
    const today = DAYS.find((d) => d.dayNumber === tn)!;
    const doneCount = TRAINING_DAYS.filter((d) => ws.completedDays[d.id]).length;
    const t = totalSets(today), n = doneSets(today, ws.setLogs);
    const next = DAYS.find((d) => d.dayNumber > tn && d.category !== 'rest') ?? DAYS[0];
    const plural = (k: number) => `${k} ${k === 1 ? 'exercise' : 'exercises'}`;
    return (
      <div className="px-5 pt-[calc(1.75rem+env(safe-area-inset-top))]">
        <header {...rise(0)}>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <h1 className="font-display text-[1.75rem] leading-none">ApexLift</h1>
              <p className={`${muted} text-[0.85rem] mt-1`}>{doneCount} of {TRAINING_DAYS.length} workouts done this week</p>
            </div>
            <ResetButton onClick={() => setConfirmReset(true)} />
          </div>
        </header>

        {/* week strip */}
        <div {...rise(1)}>
          <div className="grid grid-cols-7 gap-1.5 mt-6">
            {DAYS.map((d) => {
              const done = !!ws.completedDays[d.id];
              const isToday = d.dayNumber === tn;
              const rest = d.category === 'rest';
              return (
                <Tap key={d.id} onClick={() => go({ tab: 'home', day: d.id })} delay={NAV_DELAY} scale={0.9} className="flex flex-col items-center gap-1.5 py-1" aria-label={`${d.dayName}, ${d.title}`}>
                  <span className={`text-[0.75rem] font-semibold ${isToday ? 'text-[#ff6a4a]' : 'text-[#6b6b74]'}`}>{d.shortDay.slice(0, 2)}</span>
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-[#ff5733]' : 'bg-[#17171c]'} ${isToday && !done ? 'ring-2 ring-[#ff5733] ring-offset-2 ring-offset-[#0d0d12]' : ''}`}>
                    {done ? <Check size={17} strokeWidth={3} /> : rest ? <Moon size={15} className="text-[#6b6b74]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a44]" />}
                  </span>
                </Tap>
              );
            })}
          </div>
        </div>

        {/* today */}
        <div {...rise(2)}>
          <Tap onClick={() => go({ tab: 'home', day: today.id })} delay={NAV_DELAY} scale={0.975}
            className="relative w-full text-left rounded-[28px] overflow-hidden p-5 mt-5 bg-[radial-gradient(120%_90%_at_100%_0%,#4a1f15_0%,#1d1414_45%,#17171c_100%)] border border-[#ff5733]/15">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[0.85rem] font-semibold text-[#ff8a6e]">Today, {today.dayName}</div>
                <div className="font-display text-[2.7rem] leading-[0.95] mt-2">{today.category === 'rest' ? 'Rest day' : today.title}</div>
                <p className="text-[#c9c9d0] text-[0.95rem] leading-snug mt-2.5">{today.category === 'rest' ? `Recover today. Next up: ${next.dayName}, ${next.title}.` : today.subtitle}</p>
              </div>
              {today.category === 'rest'
                ? <div className="w-16 h-16 rounded-full bg-[#26262e] flex items-center justify-center shrink-0"><Moon size={26} className="text-[#c9c9d0]" /></div>
                : <ProgressRing frac={t ? n / t : 0}><span className="text-[0.8rem] font-bold tabular-nums">{n}/{t}</span></ProgressRing>}
            </div>
            <div className="flex items-center gap-2 mt-5">
              {today.category !== 'rest' && <>
                <span className="text-[0.8rem] bg-white/[.06] rounded-full px-3 py-1.5">{plural(today.exercises.length)}</span>
                <span className="text-[0.8rem] bg-white/[.06] rounded-full px-3 py-1.5">~{today.estimatedDurationMin} min</span>
              </>}
              <span className="ml-auto inline-flex items-center gap-1.5 bg-[#ff5733] rounded-full pl-3.5 pr-3 h-10 font-semibold text-[0.95rem]">
                {today.category === 'rest' ? 'Recovery plan' : ws.completedDays[today.id] ? 'Done' : n > 0 ? 'Continue' : 'Start'}
                {ws.completedDays[today.id] ? <Check size={16} strokeWidth={3} /> : <Play size={14} fill="currentColor" />}
              </span>
            </div>
          </Tap>
        </div>

        <h2 {...rise(3)}><span className="block font-display text-[1.15rem] mt-7 mb-3">This week</span></h2>
        <div className="space-y-2.5">
          {DAYS.map((d, i) => {
            const tt = totalSets(d), nn = doneSets(d, ws.setLogs);
            const isToday = d.dayNumber === tn;
            const done = !!ws.completedDays[d.id];
            return (
              <div key={d.id} {...rise(4 + i)}>
                <Tap onClick={() => go({ tab: 'home', day: d.id })} delay={NAV_DELAY} scale={0.97}
                  className={`${card} w-full text-left flex items-center gap-3.5 p-3 pr-4 ${isToday ? '!border-[#ff5733]/40' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl font-bold text-[0.85rem] flex items-center justify-center shrink-0 ${done ? 'bg-[#ff5733] text-white' : 'bg-[#3a1d18] text-[#ff6a4a]'}`}>{d.shortDay}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[1.05rem]">{d.title}</span>
                      {isToday && <span className="text-[0.7rem] font-bold bg-[#ff5733] rounded-full px-2 py-0.5">Today</span>}
                    </div>
                    <div className={`${muted} text-[0.85rem] truncate mt-0.5`}>{d.subtitle}</div>
                    {tt > 0 && <Bar frac={nn / tt} className="h-1 mt-2" />}
                  </div>
                  {done ? <span className="w-7 h-7 rounded-full bg-[#ff5733] flex items-center justify-center"><Check size={16} strokeWidth={3} /></span>
                    : d.category === 'rest' ? <Moon size={18} className="text-[#55555e]" /> : <ChevronRight size={18} className="text-[#55555e]" />}
                </Tap>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ---------- DAY ----------
  const dayScreen = (d: DayWorkout) => {
    if (d.category === 'rest') return restScreen(d);
    const t = totalSets(d), n = doneSets(d, ws.setLogs);
    const plural = (k: number) => `${k} ${k === 1 ? 'exercise' : 'exercises'}`;
    return (
      <div className="px-5 pt-[calc(1.25rem+env(safe-area-inset-top))]">
        {back('Home')}
        <div className={`${card} p-5 mt-2`}>
          <span className={pill}>{d.dayName}</span>
          <h1 className="font-display text-[2.2rem] leading-none mt-3">{d.title}</h1>
          <p className="text-[#c9c9d0] mt-2 leading-snug">{d.subtitle}</p>
          <div className="flex gap-2 mt-4 text-[0.8rem]">
            <span className="bg-white/[.06] rounded-full px-3 py-1.5">{plural(d.exercises.length)}</span>
            <span className="bg-white/[.06] rounded-full px-3 py-1.5">~{d.estimatedDurationMin} min</span>
            <span className="bg-white/[.06] rounded-full px-3 py-1.5 tabular-nums">{n}/{t} sets</span>
          </div>
          <Bar frac={t ? n / t : 0} className="h-1.5 mt-4" />
        </div>
        <div className="space-y-2.5 mt-3">
          {d.exercises.map((slot) => {
            const e = chosen(d.id, slot);
            const sub = e.id !== slot.id
              ? <span className="inline-flex items-center gap-1"><ArrowLeftRight size={12} className="text-[#ff6a4a]" />Swapped · {setsSummary(slot)}</span>
              : setsSummary(slot);
            return row(e, sub, () => go({ tab: 'home', day: d.id, ex: slot.id }), exDone(d, slot, ws.setLogs), slot.id);
          })}
        </div>
        <div className="flex gap-3 mt-4">
          <Tap onClick={() => finishDay(d)} scale={0.97} className="flex-1 h-14 bg-[#ff5733] rounded-[20px] font-semibold text-[1.05rem]">
            {ws.completedDays[d.id] ? 'Workout complete' : 'Finish workout'}
          </Tap>
          <Tap onClick={() => resetDay(d)} scale={0.95} className="h-14 px-5 bg-[#17171c] border border-white/[.04] rounded-[20px] text-[#c9c9d0] font-semibold">Reset</Tap>
        </div>
      </div>
    );
  };

  const restScreen = (d: DayWorkout) => {
    const r = d.exercises[0];
    const icons = [Ban, BedDouble, Utensils, Droplets, Footprints];
    return (
      <div className="px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] space-y-3">
        {back('Home')}
        <div className="relative rounded-[28px] overflow-hidden p-6 bg-[radial-gradient(110%_100%_at_100%_0%,#1d2f4f_0%,#151a26_45%,#17171c_100%)] border border-white/[.05]">
          <div className="pop w-16 h-16 rounded-full bg-[#4aa8ff]/15 text-[#8fd3ff] flex items-center justify-center"><Moon size={30} /></div>
          <h1 className="font-display text-[2.2rem] leading-none mt-5">Rest &amp; recover</h1>
          <p className="text-[#c9c9d0] mt-3 leading-relaxed">{r.description}</p>
        </div>
        <div className={`${card} p-5`}>
          <h2 className="font-display text-[1.15rem] mb-4">Today's recovery</h2>
          <div className="space-y-4">
            {r.stepByStep.map((s, i) => {
              const Icon = icons[i] ?? CircleCheck;
              return (
                <div key={i} className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#4aa8ff]/10 text-[#8fd3ff] flex items-center justify-center shrink-0"><Icon size={18} /></div>
                  <p className="text-[#c9c9d0] leading-relaxed pt-2">{s}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`${card} p-5`}>
          <h2 className="font-display text-[1.15rem] mb-3">Good to know</h2>
          {[...r.formTips, ...r.commonMistakes.map((m) => `Avoid: ${m.charAt(0).toLowerCase()}${m.slice(1)}`)].map((t, i) => (
            <p key={i} className="text-[#9a9aa3] leading-relaxed mb-2 flex gap-2"><span className="text-[#8fd3ff]">•</span>{t}</p>
          ))}
        </div>
      </div>
    );
  };

  // ---------- EXERCISE DETAIL ----------
  const detail = (slot: Exercise, dayId?: string) => {
    const e = dayId ? chosen(dayId, slot) : slot; // what's shown (may be a swap)
    const plan = dayId ? slot : e; // sets come from the plan slot
    const timed = plan.sets.find((s) => s.isTimed);
    const prim = e.anatomyHighlightGroups;
    const rest = e.defaultRestSeconds || plan.defaultRestSeconds || 120;
    return (
      <div className="px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] space-y-3">
        {back(dayId ? DAYS.find((d) => d.id === dayId)!.dayName : nav.cat ?? (q ? 'Search' : 'Exercises'))}
        {dayId && <SwapBar slot={slot} shown={e} onPick={(o) => choose(dayId, slot, o)} />}
        <div key={e.id} className="screen-in space-y-3" style={{ ['--dir' as string]: 0 }}>
          <div className={`${card} p-5`}>
            <span className={pill}>{e.category}</span>
            <h1 className="font-display text-[1.9rem] leading-[1.02] mt-3">{e.name}</h1>
            <p className={`${muted} mt-2 leading-snug`}>{e.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Tap onClick={() => setSheet({ ex: e, kind: 'equip' })} scale={0.96} className={`${card} p-4 text-center`}>
              <div className="font-semibold mb-3">Equipment</div>
              <div className="h-[11.5rem] flex items-center justify-center"><EquipArt kind={e.equipment.kind} h={88} /></div>
              <div className={`${muted} text-[0.8rem] mt-1 truncate`}>{e.equipment.label}</div>
            </Tap>
            <Tap onClick={() => setSheet({ ex: e, kind: 'muscle' })} scale={0.96} className={`${card} p-4 text-center`}>
              <div className="font-semibold mb-3">Muscles</div>
              <Body on={regionsFor(prim)} soft={regionsFor(e.secondaryGroups)} className="h-[11.5rem] w-auto mx-auto block" />
              <div className={`${muted} text-[0.8rem] mt-1 truncate`}>{prim.map((g) => MUSCLE_LABEL[g]).join(', ') || '—'}</div>
            </Tap>
          </div>
          {dayId && plan.sets.length > 0 ? (
            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-[1.15rem]">My sets</h2>
                <Tap onClick={() => timer.start(rest, e.name)} scale={0.92} className="flex items-center gap-1.5 text-[#ff6a4a] text-sm font-semibold h-9 px-1">
                  <Timer size={16} /> Rest {fmt(rest)}
                </Tap>
              </div>
              {plan.sets.map((s) => {
                const l = ws.setLogs[setKey(dayId, slot.id, s.setNum)];
                return (
                  <div key={s.setNum} className="flex items-center gap-3 py-1.5">
                    <div className={`w-8 h-8 rounded-full text-[0.8rem] font-bold flex items-center justify-center shrink-0 ${l?.completed ? 'bg-[#ff5733]' : 'bg-[#3a1d18] text-[#ff6a4a]'}`}>{s.setNum}</div>
                    <div className="flex-1 text-[#c9c9d0]">{s.targetReps ? `${s.targetReps} reps` : s.targetDescription}</div>
                    {s.targetReps && (
                      <label className="flex items-center bg-[#0d0d12] rounded-xl pr-2.5 focus-within:ring-2 focus-within:ring-[#ff5733]/60">
                        <input inputMode="decimal" placeholder="0" value={l?.weightKg ?? ''} onChange={(ev) => setKg(dayId, slot, s.setNum, ev.target.value)}
                          className="w-12 bg-transparent py-2.5 text-center outline-none tabular-nums" aria-label={`Set ${s.setNum} weight in kg`} />
                        <span className="text-[#6b6b74] text-xs">kg</span>
                      </label>
                    )}
                    <Tap onClick={() => toggle(dayId, slot, e, s.setNum)} scale={0.85} aria-label={`Mark set ${s.setNum} done`} aria-pressed={!!l?.completed}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${l?.completed ? 'bg-[#ff5733]' : 'bg-[#26262e] text-[#6b6b74]'}`}>
                      <span key={String(!!l?.completed)} className={l?.completed ? 'pop flex' : 'flex'}><Check size={19} strokeWidth={3} /></span>
                    </Tap>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`${card} p-5 flex items-center gap-4`}>
              <div className="flex-1">
                <div className={`${muted} text-xs`}>Suggested</div>
                <div className="font-semibold mt-0.5">{setsSummary(e)}</div>
              </div>
              {e.defaultRestSeconds > 0 && (
                <Tap onClick={() => timer.start(e.defaultRestSeconds, e.name)} scale={0.94} className="flex items-center gap-1.5 h-10 px-3.5 rounded-2xl bg-[#3a1d18] text-[#ff6a4a] font-semibold text-sm">
                  <Timer size={16} /> Rest {fmt(e.defaultRestSeconds)}
                </Tap>
              )}
            </div>
          )}
          {timed && <Stopwatch key={e.id} target={timed.targetSeconds} />}
          <div className={`${card} p-5`}>
            <h2 className="font-display text-[1.15rem] mb-4">How to do it</h2>
            {e.stepByStep.map((s, i) => (
              <div key={i} className="flex gap-3.5 mb-3.5 last:mb-0">
                <div className="w-7 h-7 rounded-full bg-[#3a1d18] text-[#ff6a4a] text-[0.8rem] font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                <p className="text-[#c9c9d0] leading-relaxed pt-0.5">{s}</p>
              </div>
            ))}
          </div>
          {e.formTips.length > 0 && (
            <div className={`${card} p-5`}>
              <h2 className="font-display text-[1.15rem] mb-3">Form tips</h2>
              {e.formTips.map((t, i) => <p key={i} className="text-[#c9c9d0] leading-relaxed mb-2.5 last:mb-0 flex gap-2.5"><CircleCheck size={18} className="text-[#4ade80] shrink-0 mt-0.5" />{t}</p>)}
            </div>
          )}
          {e.commonMistakes.length > 0 && (
            <div className={`${card} p-5`}>
              <h2 className="font-display text-[1.15rem] mb-3">Common mistakes</h2>
              {e.commonMistakes.map((t, i) => <p key={i} className="text-[#c9c9d0] leading-relaxed mb-2.5 last:mb-0 flex gap-2.5"><CircleAlert size={18} className="text-[#ff6a4a] shrink-0 mt-0.5" />{t}</p>)}
            </div>
          )}
          <FormPic key={`pic-${e.id}`} ex={e} />
        </div>
      </div>
    );
  };

  // ---------- EXERCISES LIBRARY ----------
  const library = () => {
    const open = (e: Exercise) => go({ tab: 'ex', cat: nav.cat, ex: e.id });
    if (nav.cat) {
      const exs = ALL.filter((e) => e.category === nav.cat);
      return (
        <div className="px-5 pt-[calc(1.25rem+env(safe-area-inset-top))]">
          {back('Exercises')}
          <h1 className="font-display text-[2.2rem] leading-none mt-2">{nav.cat}</h1>
          <p className={`${muted} mt-1.5 mb-4`}>{exs.length} exercises</p>
          <div className="space-y-2.5">
            {exs.map((e) => row(e, `${e.equipment.label}  ·  ${setsSummary(e)}`, () => open(e)))}
          </div>
        </div>
      );
    }
    const term = q.trim().toLowerCase();
    const found = term ? ALL.filter((e) => `${e.name} ${e.category} ${e.equipment.label} ${e.targetArea}`.toLowerCase().includes(term)) : null;
    return (
      <div className="px-5 pt-[calc(1.75rem+env(safe-area-inset-top))]">
        <h1 className="font-display text-[1.75rem] leading-none">Exercises</h1>
        <p className={`${muted} text-[0.85rem] mt-1.5`}>{ALL.length} exercises with demos</p>
        <label className="flex items-center gap-3 bg-[#17171c] border border-white/[.04] rounded-2xl px-4 h-12 mt-5 mb-4 focus-within:border-[#ff5733]/50 transition-colors">
          <Search size={18} className="text-[#6b6b74]" />
          <input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Search exercises, muscles, equipment" className="bg-transparent outline-none flex-1 text-[0.95rem] placeholder:text-[#6b6b74]" />
          {q && <Tap onClick={() => setQ('')} scale={0.85} className="text-[#6b6b74] -mr-1 p-1" aria-label="Clear search"><X size={16} /></Tap>}
        </label>
        {found ? (
          found.length ? <div className="space-y-2.5">{found.map((e) => row(e, `${e.category}  ·  ${e.equipment.label}`, () => open(e)))}</div>
            : <p className={`${muted} text-center py-10`}>No exercises match "{q}". Try a muscle like "chest" or equipment like "cable".</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {CATS.map(({ c, view, on }) => {
              const n = ALL.filter((e) => e.category === c).length;
              return (
                <Tap key={c} onClick={() => go({ tab: 'ex', cat: c })} delay={NAV_DELAY} scale={0.96}
                  className={`${card} relative h-[8.5rem] overflow-hidden text-left`}>
                  <div className="absolute right-[-22px] top-1 bottom-[-6px] w-[56%] flex justify-center">
                    {c === 'Cardio'
                      ? <div className="self-center w-16 h-16 rounded-full bg-[#3a1d18] flex items-center justify-center"><Heart size={30} className="text-[#ff5733]" fill="#ff5733" /></div>
                      : <Body view={view} on={regionsFor(on)} className="h-full w-auto" />}
                  </div>
                  <div className="absolute left-4 bottom-3.5 [text-shadow:0_1px_8px_#17171c]">
                    <div className="font-display text-[1.2rem] leading-tight">{c}</div>
                    <div className={`${muted} text-[0.8rem]`}>{n} exercises</div>
                  </div>
                </Tap>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const day = DAYS.find((d) => d.id === nav.day);
  const exObj = nav.ex ? day?.exercises.find((e) => e.id === nav.ex) ?? BY_ID.get(nav.ex) : undefined;
  const screen = exObj ? detail(exObj, day?.id) : nav.tab === 'home' ? (day ? dayScreen(day) : home()) : library();
  const screenKey = `${nav.tab}/${nav.day ?? ''}/${nav.cat ?? ''}/${nav.ex ?? ''}`;

  const timerOn = sheet?.kind === 'timer';
  const tab = (id: 'home' | 'ex', label: string, Icon: typeof House) => {
    const on = nav.tab === id && !timerOn;
    return (
      <Tap onClick={() => (nav.tab === id && depth(nav) === 1 ? window.scrollTo({ top: 0, behavior: 'smooth' }) : go({ tab: id }))} scale={0.9}
        className="flex-1 flex flex-col items-center gap-1 pt-2 pb-1" aria-label={label}>
        <div className="relative px-5 py-1.5">
          {on && <motion.div layoutId="tabpill" className="absolute inset-0 rounded-full bg-[#3a1d18]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
          <Icon size={21} className={`relative ${on ? 'text-[#ff6a4a]' : 'text-[#6b6b74]'}`} />
        </div>
        <span className={`text-[0.72rem] font-medium ${on ? 'text-[#ff6a4a]' : 'text-[#6b6b74]'}`}>{label}</span>
      </Tap>
    );
  };

  const onReveal = useCallback(() => setReady(true), []);
  const onSplashDone = useCallback(() => setSplash(false), []);
  const sheetEx = sheet && sheet.kind !== 'timer' ? sheet.ex : null;

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-screen bg-[#0d0d12] text-[#f4f4f5] max-w-md mx-auto ${timerBase ? 'pb-48' : 'pb-32'}`}>
        {ready && (
          <main key={screenKey} className="screen-in" style={{ ['--dir' as string]: dir }}>
            {screen}
          </main>
        )}

        <TimerDock onExpand={() => setSheet({ kind: 'timer' })} />

        <Sheet open={!!sheet} onClose={() => setSheet(null)} label={sheet?.kind === 'timer' ? 'Rest timer' : sheet?.kind === 'muscle' ? 'Muscles worked' : 'Equipment'}>
          {sheet?.kind === 'timer' && <TimerPanel />}
          {sheet?.kind === 'muscle' && sheetEx && (
            <>
              <h2 className="font-display text-xl text-center">Muscles worked</h2>
              <p className={`${muted} text-sm text-center mt-1`}>{sheetEx.name}</p>
              <Body on={regionsFor(sheetEx.anatomyHighlightGroups)} soft={regionsFor(sheetEx.secondaryGroups)} className="h-[21rem] w-auto mx-auto block mt-5" />
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {sheetEx.anatomyHighlightGroups.map((m) => <span key={m} className="bg-[#ff5733] rounded-full px-4 py-2 text-sm font-semibold">{MUSCLE_LABEL[m]}</span>)}
                {(sheetEx.secondaryGroups ?? []).map((m) => <span key={m} className="border border-[#8a3423] text-[#ffb19e] rounded-full px-4 py-2 text-sm font-medium">{MUSCLE_LABEL[m]}</span>)}
              </div>
              {(sheetEx.secondaryGroups?.length ?? 0) > 0 && (
                <div className={`flex justify-center gap-5 mt-4 text-xs ${muted}`}>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ff5733]" />Main target</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8a3423]" />Also working</span>
                </div>
              )}
            </>
          )}
          {sheet?.kind === 'equip' && sheetEx && (
            <>
              <h2 className="font-display text-xl text-center">Equipment</h2>
              <p className={`${muted} text-sm text-center mt-1`}>{sheetEx.name}</p>
              <div className="py-8"><EquipArt kind={sheetEx.equipment.kind} h={150} /></div>
              <div className="text-center font-semibold text-lg">{sheetEx.equipment.label}</div>
            </>
          )}
        </Sheet>

        <Confirm open={confirmReset} icon={<RotateCcw size={28} />} title="Reset this week?"
          body="This clears every ticked set and every weight you've entered for all 7 days. It can't be undone."
          confirmLabel="Reset week" onConfirm={doResetAll} onCancel={() => setConfirmReset(false)} />

        <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-[#0d0d12] border-t border-white/[.05] flex px-3 pb-[calc(.5rem+env(safe-area-inset-bottom))] z-30">
          {tab('home', 'Home', House)}
          {tab('ex', 'Exercises', Dumbbell)}
          <Tap onClick={() => setSheet({ kind: 'timer' })} scale={0.9} className="flex-1 flex flex-col items-center gap-1 pt-2 pb-1" aria-label="Timer">
            <div className="relative px-5 py-1.5">
              {timerOn && <motion.div layoutId="tabpill" className="absolute inset-0 rounded-full bg-[#3a1d18]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <Timer size={21} className={`relative ${timerOn || timerBase?.endAt ? 'text-[#ff6a4a]' : 'text-[#6b6b74]'}`} />
              {timerBase?.endAt ? <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-[#ff5733]" /> : null}
            </div>
            <span className={`text-[0.72rem] font-medium ${timerOn ? 'text-[#ff6a4a]' : 'text-[#6b6b74]'}`}>Timer</span>
          </Tap>
        </nav>

        {splash && <Splash onReveal={onReveal} onDone={onSplashDone} />}
      </div>
    </MotionConfig>
  );
}

/** Round reset button; the arrow spins back when pressed. */
function ResetButton({ onClick }: { onClick: () => void }) {
  const [spin, setSpin] = useState(0);
  return (
    <Tap onClick={() => { setSpin((s) => s - 360); window.setTimeout(onClick, 140); }} scale={0.88}
      className="w-11 h-11 rounded-full bg-[#17171c] border border-white/[.06] flex items-center justify-center text-[#c9c9d0]" aria-label="Reset week">
      <span className="flex" style={{ transform: `rotate(${spin}deg)`, transition: 'transform .5s cubic-bezier(.22,1,.36,1)' }}><RotateCcw size={18} /></span>
    </Tap>
  );
}
