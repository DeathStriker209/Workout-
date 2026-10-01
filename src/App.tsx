import React, { useEffect, useRef, useState } from 'react';
import { App as CapApp } from '@capacitor/app';
import confetti from 'canvas-confetti';
import { Calendar, Dumbbell, Timer, ChevronLeft, ChevronRight, Check, RotateCcw, Search, Pause, Play, X } from 'lucide-react';
import { WORKOUT_DAYS as DAYS } from './data/workoutData';
import { DayWorkout, Exercise, WorkoutState, CompletedSetLog } from './types/workout';
import { Body, regionsFor } from './components/Body';
import { EquipArt, equipOf } from './components/Equip';
import { playChime } from './utils/audio';

const KEY = 'apexlift_workout_tracker_state_v4';
const card = 'bg-[#17171c] rounded-3xl p-5';
const tag = 'inline-block text-[10px] font-bold tracking-wider uppercase text-[#ff5733] bg-[#3a1d18] rounded-xl px-3 py-2';
const badge = 'rounded-full bg-[#3a1d18] text-[#ff5733] font-bold flex items-center justify-center shrink-0';
const blank: WorkoutState = { setLogs: {}, completedDays: {}, activeDayId: 'day-1', selectedExerciseModalId: null, currentRestTimer: null };

type Nav = { tab: 'home' | 'ex'; day?: string; cat?: string; ex?: string };

const CATS = ['Biceps', 'Triceps', 'Chest', 'Back', 'Legs', 'Forearms', 'Core', 'Cardio', 'Shoulders', 'Other'];
const FALLBACK: Record<string, string> = {
  Biceps: '#b45309', Triceps: '#9a3412', Chest: '#991b1b', Back: '#1d4ed8', Legs: '#7c3aed',
  Forearms: '#0f766e', Core: '#be185d', Cardio: '#0369a1', Shoulders: '#4d7c0f', Other: '#52525b',
};
const GROUP: Record<string, string> = {
  biceps: 'Biceps', arms: 'Biceps', triceps: 'Triceps', chest: 'Chest', back: 'Back', shoulders: 'Shoulders',
  forearms: 'Forearms', abs: 'Core', cardio: 'Cardio', quadriceps: 'Legs', hamstrings: 'Legs',
  glutes: 'Legs', calves: 'Legs', legs: 'Legs',
};
const parentOf = (n: Nav): Nav | null =>
  n.ex ? { tab: n.tab, day: n.day, cat: n.cat }
  : n.day ? { tab: 'home' }
  : n.cat ? { tab: 'ex' }
  : n.tab === 'ex' ? { tab: 'home' }
  : null;
const catOf = (e: Exercise) => (e.isForearmGrip ? 'Forearms' : GROUP[e.anatomyHighlightGroups[0]] ?? 'Other');

const ALL: Exercise[] = [];
const seen = new Set<string>();
DAYS.filter((d) => d.category !== 'rest').forEach((d) =>
  d.exercises.forEach((e) => { if (!seen.has(e.name)) { seen.add(e.name); ALL.push(e); } })
);
const catPhoto = (c: string) => ALL.find((e) => catOf(e) === c && e.photos?.length)?.photos?.[0].url;

const totalSets = (d: DayWorkout) => d.exercises.reduce((a, e) => a + e.sets.length, 0);
const doneSets = (d: DayWorkout, logs: Record<string, CompletedSetLog>) =>
  d.exercises.reduce((a, e) => a + e.sets.filter((s) => logs[`${d.id}_${e.id}_set_${s.setNum}`]?.completed).length, 0);
const shortName = (m: string) => m.split('(')[0].trim();

// ---------- Rest timer (docked above the nav bar) ----------
function RestTimer({ s, n, onClose }: { s: number; n: string; onClose: () => void }) {
  const [left, setLeft] = useState(s);
  const [total, setTotal] = useState(s);
  const [run, setRun] = useState(true);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setLeft((l) => {
      if (l > 1) return l - 1;
      clearInterval(t); setRun(false);
      playChime(880, 0.4); setTimeout(() => playChime(1320, 0.5), 200);
      try { navigator.vibrate?.(300); } catch { /* ignore */ }
      return 0;
    }), 1000);
    return () => clearInterval(t);
  }, [run]);
  const adj = (d: number) => { setLeft((l) => Math.max(1, l + d)); setTotal((t) => Math.max(t, left + d)); setRun(true); };
  const btn = 'bg-[#2a2a31] rounded-xl px-3 py-2 text-xs font-bold';
  return (
    <div className="fixed inset-x-0 bottom-[5.4rem] max-w-md mx-auto px-4 z-40">
      <div className="bg-[#1e1e25] border border-[#2c2c35] rounded-2xl p-3 shadow-2xl">
        <div className="h-1 bg-[#2c2c35] rounded-full mb-3 overflow-hidden">
          <div className="h-full bg-[#ff5733] transition-all" style={{ width: `${Math.min(100, (left / total) * 100)}%` }} />
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold tabular-nums text-[#ff5733] w-16">{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</div>
          <div className="flex-1 min-w-0 text-xs text-gray-400 truncate">{left === 0 ? 'Rest over!' : `Rest · ${n}`}</div>
          <button onClick={() => adj(-10)} className={btn}>-10s</button>
          <button onClick={() => adj(10)} className={btn}>+10s</button>
          <button onClick={() => (left === 0 ? (setLeft(total), setRun(true)) : setRun(!run))} className="bg-[#ff5733] rounded-xl p-2">
            {run ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={onClose} className="p-1 text-gray-500"><X size={18} /></button>
        </div>
      </div>
    </div>
  );
}

// ---------- Hold stopwatch ----------
function Stopwatch({ target }: { target?: number }) {
  const [t, setT] = useState(0);
  const [on, setOn] = useState(false);
  useEffect(() => { if (!on) return; const i = setInterval(() => setT((x) => x + 1), 1000); return () => clearInterval(i); }, [on]);
  useEffect(() => { if (target && t === target) playChime(780, 0.3); }, [t, target]);
  return (
    <div className={`${card} flex items-center gap-3 !py-4`}>
      <div className="flex-1">
        <div className="text-xs text-gray-400">Hold timer{target ? ` · target ${target}s` : ''}</div>
        <div className="text-2xl font-bold tabular-nums">{Math.floor(t / 60)}:{String(t % 60).padStart(2, '0')}</div>
      </div>
      <button onClick={() => setOn(!on)} className="bg-[#ff5733] rounded-xl px-4 py-2 font-bold text-sm">{on ? 'Stop' : 'Start'}</button>
      <button onClick={() => { setOn(false); setT(0); }} className="bg-[#2a2a31] rounded-xl p-2.5"><RotateCcw size={16} /></button>
    </div>
  );
}

// ---------- Form photo: full-width white card, flips between positions ----------
function FormPic({ photos }: { photos: { url: string; label: string }[] }) {
  const [i, setI] = useState(0);
  const [bad, setBad] = useState(false);
  useEffect(() => {
    if (photos.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % photos.length), 1000);
    return () => clearInterval(t);
  }, [photos.length]);
  if (bad) return null;
  return (
    <div className="relative bg-white rounded-3xl overflow-hidden">
      {photos.map((p, k) => (
        <img key={p.url} src={p.url} alt={p.label} onError={() => setBad(true)}
          className={`w-full block ${k ? 'absolute inset-0 h-full object-contain' : ''}`} style={{ opacity: i === k ? 1 : 0 }} />
      ))}
    </div>
  );
}

export default function App() {
  const [nav, setNav] = useState<Nav>({ tab: 'home' });
  const [ws, setWs] = useState<WorkoutState>(() => {
    try {
      const p = JSON.parse(localStorage.getItem(KEY) || '');
      return { ...blank, setLogs: p.setLogs || {}, completedDays: p.completedDays || {} };
    } catch { return blank; }
  });
  const [timer, setTimer] = useState<{ id: number; s: number; n: string } | null>(null);
  const [q, setQ] = useState('');
  const [sheet, setSheet] = useState<Exercise | null>(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ setLogs: ws.setLogs, completedDays: ws.completedDays })); } catch { /* ignore */ }
  }, [ws.setLogs, ws.completedDays]);

  const go = (n: Nav) => { setNav(n); window.scrollTo(0, 0); };

  // Back: close sheet -> go up one level -> (at Home) exit app
  const goBack = () => {
    if (sheet) { setSheet(null); return; }
    const p = parentOf(nav);
    if (p) { setNav(p); window.scrollTo(0, 0); } else CapApp.exitApp();
  };
  const backRef = useRef(goBack);
  backRef.current = goBack;
  useEffect(() => {
    const h = CapApp.addListener('backButton', () => backRef.current());
    return () => { h.then((x) => x.remove()); };
  }, []);

  const startTimer = (s = 120, n = 'Rest Interval') => setTimer({ id: Date.now(), s, n });

  const withDone = (p: WorkoutState, logs: Record<string, CompletedSetLog>, dayId: string): WorkoutState => {
    const d = DAYS.find((x) => x.id === dayId)!;
    const cd = { ...p.completedDays };
    const t = totalSets(d), n = doneSets(d, logs);
    if (t > 0 && n === t) {
      if (!cd[dayId]) { try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch { /* ignore */ } playChime(880, 0.4); }
      cd[dayId] = { completedAt: new Date().toISOString(), completedSets: n, totalSets: t };
    } else delete cd[dayId];
    return { ...p, setLogs: logs, completedDays: cd };
  };

  const toggle = (dayId: string, ex: Exercise, num: number) => {
    const k = `${dayId}_${ex.id}_set_${num}`;
    const cur = ws.setLogs[k];
    const was = !!cur?.completed;
    const s = ex.sets.find((x) => x.setNum === num);
    setWs((p) => withDone(p, { ...p.setLogs, [k]: { completed: !was, weightKg: cur?.weightKg ?? '', actualReps: s?.targetReps ?? '', completedAt: !was ? new Date().toISOString() : undefined } }, dayId));
    if (!was && s?.targetReps) startTimer(ex.defaultRestSeconds || 120, ex.name);
  };

  const setKg = (dayId: string, ex: Exercise, num: number, w: string) => {
    const k = `${dayId}_${ex.id}_set_${num}`;
    setWs((p) => ({ ...p, setLogs: { ...p.setLogs, [k]: { completed: !!p.setLogs[k]?.completed, weightKg: w, actualReps: p.setLogs[k]?.actualReps ?? '' } } }));
  };

  const finishDay = (d: DayWorkout) =>
    setWs((p) => {
      const logs = { ...p.setLogs };
      d.exercises.forEach((e) => e.sets.forEach((s) => {
        const k = `${d.id}_${e.id}_set_${s.setNum}`;
        if (!logs[k]?.completed) logs[k] = { completed: true, weightKg: logs[k]?.weightKg ?? '', actualReps: s.targetReps ?? '', completedAt: new Date().toISOString() };
      }));
      return withDone(p, logs, d.id);
    });

  const resetDay = (d: DayWorkout) =>
    setWs((p) => {
      const logs = { ...p.setLogs };
      d.exercises.forEach((e) => e.sets.forEach((s) => delete logs[`${d.id}_${e.id}_set_${s.setNum}`]));
      const cd = { ...p.completedDays };
      delete cd[d.id];
      return { ...p, setLogs: logs, completedDays: cd };
    });

  const resetAll = () => { if (window.confirm('Reset all sets and progress for the week?')) { setWs(blank); setTimer(null); } };

  const back = (label: string) => (
    <button onClick={goBack} className="flex items-center gap-1 text-[#ff5733] text-base font-semibold">
      <ChevronLeft size={20} /> {label}
    </button>
  );

  const row = (e: Exercise, sub: string, onClick: () => void, done = false, i?: number) => (
    <button key={e.id} onClick={onClick} className={`${card} w-full text-left flex items-center gap-3 !py-3.5`}>
      {i !== undefined && <div className={`w-8 h-8 text-sm ${badge}`}>{i + 1}</div>}
      <div className="flex-1 min-w-0">
        <div className="font-bold">{e.name}</div>
        <div className="text-gray-400 text-xs truncate">{sub}</div>
      </div>
      {done ? <Check size={18} className="text-[#ff5733]" /> : <ChevronRight size={18} className="text-gray-600" />}
    </button>
  );

  // ---------- HOME ----------
  const home = () => (
    <div className="px-5 pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ApexLift</h1>
        <button onClick={resetAll} className="p-2 text-gray-500"><RotateCcw size={18} /></button>
      </div>
      <p className="text-gray-400 text-sm mt-1 mb-5">{Object.keys(ws.completedDays).length} of 7 days done this week</p>
      <div className="space-y-2.5">
        {DAYS.map((d) => {
          const t = totalSets(d), n = doneSets(d, ws.setLogs);
          const today = d.dayNumber === ((new Date().getDay() + 6) % 7) + 1;
          return (
            <button key={d.id} onClick={() => go({ tab: 'home', day: d.id })} className={`${card} w-full text-left flex items-center gap-3 !py-3.5`}
              style={today ? { boxShadow: 'inset 0 0 0 1.5px #ff5733' } : undefined}>
              <div className="w-11 h-11 rounded-2xl bg-[#3a1d18] text-[#ff5733] font-bold text-sm flex items-center justify-center shrink-0">{d.shortDay}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{d.dayName}</span>
                  {today && <span className="text-[9px] font-bold bg-[#ff5733] rounded-full px-2 py-0.5">TODAY</span>}
                </div>
                <div className="text-gray-400 text-xs truncate">{d.title} · {d.subtitle}</div>
                {t > 0 && <div className="h-1 bg-[#2a2a31] rounded-full mt-2"><div className="h-full rounded-full bg-[#ff5733]" style={{ width: `${(n / t) * 100}%` }} /></div>}
              </div>
              {ws.completedDays[d.id] ? <Check size={18} className="text-[#ff5733]" /> : <ChevronRight size={18} className="text-gray-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  // ---------- DAY ----------
  const dayScreen = (d: DayWorkout) => {
    const t = totalSets(d), n = doneSets(d, ws.setLogs);
    return (
      <div className="px-5 pt-7">
        {back('Home')}
        <div className={`${card} mt-3`}>
          <span className={tag}>{d.dayName} · {d.title}</span>
          <h1 className="text-xl font-bold mt-3">{d.subtitle}</h1>
          {t > 0 && <p className="text-gray-400 text-sm mt-1.5">{n}/{t} sets done · ~{d.estimatedDurationMin} min</p>}
        </div>
        <div className="space-y-2.5 mt-3">
          {d.exercises.map((e, i) =>
            row(e, e.sets.length ? `${e.sets.length} sets${e.sets[0].targetReps ? ' · ' + e.sets.map((s) => s.targetReps).join('/') + ' reps' : ''}` : e.targetArea,
              () => go({ tab: 'home', day: d.id, ex: e.id }),
              e.sets.length > 0 && e.sets.every((s) => ws.setLogs[`${d.id}_${e.id}_set_${s.setNum}`]?.completed), i)
          )}
        </div>
        {t > 0 && (
          <div className="flex gap-3 mt-4">
            <button onClick={() => finishDay(d)} className="flex-1 bg-[#ff5733] rounded-2xl py-3 font-bold">Finish workout</button>
            <button onClick={() => resetDay(d)} className="bg-[#17171c] rounded-2xl px-5 text-gray-300">Reset</button>
          </div>
        )}
      </div>
    );
  };

  // ---------- EXERCISE DETAIL ----------
  const detail = (e: Exercise, dayId?: string) => {
    const c = catOf(e);
    const eq = equipOf(e.name);
    const on = regionsFor(e.anatomyHighlightGroups);
    const timed = e.sets.find((s) => s.isTimed);
    return (
      <div className="px-5 pt-7 space-y-3">
        {back(dayId ? DAYS.find((d) => d.id === dayId)!.dayName : c)}
        <div className={card}>
          <span className={tag}>{c} · {e.targetArea.split('(')[0].trim()}</span>
          <h1 className="text-2xl font-bold mt-3">{e.name}</h1>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={`${card} text-center !px-3`}>
            <div className="font-bold mb-3">Equipment</div>
            <EquipArt kind={eq.kind} />
            <div className="text-gray-400 text-xs mt-3">{eq.label}</div>
          </div>
          <button onClick={() => setSheet(e)} className={`${card} !px-3`}>
            <div className="font-bold mb-2">Muscles</div>
            <div className="flex justify-center gap-1"><Body side="front" on={on} h={92} /><Body side="back" on={on} h={92} /></div>
          </button>
        </div>
        {dayId && e.sets.length > 0 && (
          <div className={card}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-lg">My Sets</h2>
              <button onClick={() => startTimer(e.defaultRestSeconds || 120, e.name)} className="flex items-center gap-1 text-[#ff5733] text-sm font-semibold"><Timer size={15} /> Rest timer</button>
            </div>
            {e.sets.map((s) => {
              const l = ws.setLogs[`${dayId}_${e.id}_set_${s.setNum}`];
              return (
                <div key={s.setNum} className="flex items-center gap-3 py-1.5">
                  <div className={`w-7 h-7 text-xs ${badge}`}>{s.setNum}</div>
                  <div className="flex-1 text-sm text-gray-300">{s.targetReps ? `${s.targetReps} reps` : s.targetDescription}</div>
                  {s.targetReps && (
                    <input inputMode="decimal" placeholder="kg" value={l?.weightKg ?? ''} onChange={(ev) => setKg(dayId, e, s.setNum, ev.target.value)}
                      className="w-14 bg-[#0d0d12] rounded-xl px-2 py-2 text-center text-sm outline-none" />
                  )}
                  <button onClick={() => toggle(dayId, e, s.setNum)} className={`w-9 h-9 rounded-xl flex items-center justify-center ${l?.completed ? 'bg-[#ff5733]' : 'bg-[#2a2a31] text-gray-500'}`}><Check size={18} /></button>
                </div>
              );
            })}
          </div>
        )}
        {timed && <Stopwatch target={timed.targetSeconds} />}
        <div className={card}>
          <h2 className="font-bold text-lg mb-3">Movement</h2>
          {e.stepByStep.map((s, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <div className={`w-7 h-7 text-xs ${badge}`}>{i + 1}</div>
              <p className="text-gray-400 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
        {e.formTips.length > 0 && (
          <div className={card}>
            <h2 className="font-bold text-lg mb-2">Form tips</h2>
            {e.formTips.map((t, i) => <p key={i} className="text-gray-400 leading-relaxed mb-1.5">• {t}</p>)}
          </div>
        )}
        {e.photos && e.photos.length > 0 && <FormPic photos={e.photos} />}
      </div>
    );
  };

  // ---------- EXERCISES LIBRARY ----------
  const library = () => {
    const open = (e: Exercise) => go({ tab: 'ex', cat: nav.cat, ex: e.id });
    if (nav.cat) {
      return (
        <div className="px-5 pt-7">
          {back('Exercises')}
          <h1 className="text-3xl font-bold my-3">{nav.cat}</h1>
          <div className="space-y-2.5">{ALL.filter((e) => catOf(e) === nav.cat).map((e) => row(e, e.targetArea, () => open(e)))}</div>
        </div>
      );
    }
    const found = q.trim() ? ALL.filter((e) => e.name.toLowerCase().includes(q.trim().toLowerCase())) : null;
    return (
      <div className="px-5 pt-8">
        <h1 className="text-3xl font-bold mb-4">Exercises</h1>
        <div className="flex items-center gap-3 bg-[#17171c] rounded-2xl px-4 py-3 mb-4">
          <Search size={18} className="text-gray-500" />
          <input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Search exercises..." className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        {found ? (
          <div className="space-y-2.5">{found.map((e) => row(e, catOf(e), () => open(e)))}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {CATS.map((c) => {
              const n = ALL.filter((e) => catOf(e) === c).length;
              if (!n) return null;
              const img = catPhoto(c);
              return (
                <button key={c} onClick={() => go({ tab: 'ex', cat: c })} className="relative aspect-[6/5] rounded-3xl overflow-hidden text-left"
                  style={{ background: `linear-gradient(150deg, ${FALLBACK[c]}, #0d0d12 90%)` }}>
                  {img && <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(ev) => (ev.currentTarget.style.display = 'none')} />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.35) 60%, rgba(0,0,0,.45))' }} />
                  <div className="absolute bottom-3 left-4">
                    <div className="font-bold text-lg leading-tight">{c}</div>
                    <div className="text-gray-300 text-xs">{n} exercises</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const day = DAYS.find((d) => d.id === nav.day);
  const exObj = nav.ex ? day?.exercises.find((e) => e.id === nav.ex) ?? ALL.find((e) => e.id === nav.ex) : undefined;
  const screen = exObj ? detail(exObj, day?.id) : nav.tab === 'home' ? (day ? dayScreen(day) : home()) : library();

  const tab = (id: 'home' | 'ex', label: string, Icon: typeof Calendar) => (
    <button onClick={() => go({ tab: id })} className="flex-1 flex flex-col items-center gap-1 py-1.5">
      <div className={`px-5 py-1 rounded-full ${nav.tab === id ? 'bg-[#3a1d18] text-[#ff5733]' : 'text-gray-500'}`}><Icon size={20} /></div>
      <span className={`text-[11px] ${nav.tab === id ? 'text-[#ff5733]' : 'text-gray-500'}`}>{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen bg-[#0d0d12] text-white max-w-md mx-auto ${timer ? 'pb-48' : 'pb-28'}`}>
      {screen}
      {timer && <RestTimer key={timer.id} s={timer.s} n={timer.n} onClose={() => setTimer(null)} />}
      {sheet && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end" onClick={() => setSheet(null)}>
          <div className="w-full max-w-md mx-auto bg-[#0d0d12] rounded-t-3xl p-5 pb-8" onClick={(ev) => ev.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-bold text-center mb-4">Muscles Worked</h2>
            <div className="flex justify-center gap-6">
              <Body side="front" on={regionsFor(sheet.anatomyHighlightGroups)} h={250} />
              <Body side="back" on={regionsFor(sheet.anatomyHighlightGroups)} h={250} />
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[...sheet.primaryMuscles, ...sheet.secondaryMuscles.slice(0, 2)].map((m) => (
                <span key={m} className="bg-[#ff5733] rounded-full px-4 py-2 text-sm font-bold">{shortName(m)}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-[#0d0d12] border-t border-[#1f1f26] flex px-4 pb-2 pt-1 z-30">
        {tab('home', 'Home', Calendar)}
        {tab('ex', 'Exercises', Dumbbell)}
        <button onClick={() => startTimer(120)} className="flex-1 flex flex-col items-center gap-1 py-1.5 text-gray-500">
          <div className="px-5 py-1"><Timer size={20} /></div>
          <span className="text-[11px]">Timer</span>
        </button>
      </nav>
    </div>
  );
}
