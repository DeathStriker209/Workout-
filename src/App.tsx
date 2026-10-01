import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Dumbbell, Timer, ChevronLeft, ChevronRight, Check, RotateCcw, Search } from 'lucide-react';
import { WORKOUT_DAYS as DAYS } from './data/workoutData';
import { DayWorkout, Exercise, WorkoutState, CompletedSetLog } from './types/workout';
import { RestTimerFloating } from './components/RestTimerFloating';
import { HoldStopwatch } from './components/HoldStopwatch';
import { MuscleAnatomyViewer } from './components/MuscleAnatomyViewer';
import { playChime } from './utils/audio';

const KEY = 'apexlift_workout_tracker_state_v4';
const card = 'bg-[#17171c] rounded-3xl p-5';
const tag = 'inline-block text-[11px] font-bold tracking-wider uppercase text-[#ff5733] bg-[#3a1d18] rounded-xl px-3 py-2';
const blank: WorkoutState = { setLogs: {}, completedDays: {}, activeDayId: 'day-1', selectedExerciseModalId: null, currentRestTimer: null };

type Nav = { tab: 'home' | 'ex'; day?: string; cat?: string; ex?: string };

const CATS = ['Biceps', 'Triceps', 'Chest', 'Back', 'Legs', 'Forearms', 'Core', 'Cardio', 'Shoulders', 'Other'];
const COLOR: Record<string, string> = {
  Biceps: '#b45309', Triceps: '#9a3412', Chest: '#991b1b', Back: '#1d4ed8', Legs: '#7c3aed',
  Forearms: '#0f766e', Core: '#be185d', Cardio: '#0369a1', Shoulders: '#4d7c0f', Other: '#52525b',
};
const GROUP: Record<string, string> = {
  biceps: 'Biceps', arms: 'Biceps', triceps: 'Triceps', chest: 'Chest', back: 'Back', shoulders: 'Shoulders',
  forearms: 'Forearms', abs: 'Core', cardio: 'Cardio', quadriceps: 'Legs', hamstrings: 'Legs',
  glutes: 'Legs', calves: 'Legs', legs: 'Legs',
};
const catOf = (e: Exercise) => (e.isForearmGrip ? 'Forearms' : GROUP[e.anatomyHighlightGroups[0]] ?? 'Other');
const equip = (n: string) =>
  /smith/i.test(n) ? 'Smith machine'
  : /cable|pulldown|pushdown|row|crunch/i.test(n) ? 'Cable machine'
  : /cycl/i.test(n) ? 'Exercise bike'
  : /leg press|extension|hamstring curl|pec deck|rear delt/i.test(n) ? 'Machine'
  : /dumbbell|hammer|wrist|pronation|raise|shoulder press|farmer|pinch/i.test(n) ? 'Dumbbells'
  : 'Gym equipment';

// Library: every unique exercise across the week (rest day excluded)
const ALL: Exercise[] = [];
const seen = new Set<string>();
DAYS.filter((d) => d.category !== 'rest').forEach((d) =>
  d.exercises.forEach((e) => { if (!seen.has(e.name)) { seen.add(e.name); ALL.push(e); } })
);

const totalSets = (d: DayWorkout) => d.exercises.reduce((a, e) => a + e.sets.length, 0);
const doneSets = (d: DayWorkout, logs: Record<string, CompletedSetLog>) =>
  d.exercises.reduce((a, e) => a + e.sets.filter((s) => logs[`${d.id}_${e.id}_set_${s.setNum}`]?.completed).length, 0);

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

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ setLogs: ws.setLogs, completedDays: ws.completedDays })); } catch { /* ignore */ }
  }, [ws.setLogs, ws.completedDays]);

  const go = (n: Nav) => { setNav(n); window.history.pushState(n, ''); };
  useEffect(() => {
    const f = (e: PopStateEvent) => setNav(e.state ?? { tab: 'home' });
    window.addEventListener('popstate', f);
    return () => window.removeEventListener('popstate', f);
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
    <button onClick={() => window.history.back()} className="flex items-center gap-1 text-[#ff5733] text-lg font-semibold">
      <ChevronLeft size={22} /> {label}
    </button>
  );

  const row = (e: Exercise, sub: string, onClick: () => void, done = false, i?: number) => (
    <button key={e.id} onClick={onClick} className={`${card} w-full text-left flex items-center gap-4 !py-4`}>
      {i !== undefined && <div className="w-9 h-9 rounded-full bg-[#3a1d18] text-[#ff5733] font-bold flex items-center justify-center shrink-0">{i + 1}</div>}
      <div className="flex-1 min-w-0">
        <div className="font-bold">{e.name}</div>
        <div className="text-gray-400 text-sm truncate">{sub}</div>
      </div>
      {done ? <Check className="text-[#ff5733]" /> : <ChevronRight className="text-gray-600" />}
    </button>
  );

  // ---------- HOME: Mon–Sun split ----------
  const home = () => (
    <div className="px-5 pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">ApexLift</h1>
        <button onClick={resetAll} className="p-2 text-gray-500"><RotateCcw size={20} /></button>
      </div>
      <p className="text-gray-400 mt-1 mb-6">{Object.keys(ws.completedDays).length} of 7 days done this week</p>
      <div className="space-y-3">
        {DAYS.map((d) => {
          const t = totalSets(d), n = doneSets(d, ws.setLogs);
          const today = d.dayNumber === ((new Date().getDay() + 6) % 7) + 1;
          return (
            <button key={d.id} onClick={() => go({ tab: 'home', day: d.id })} className={`${card} w-full text-left flex items-center gap-4`}
              style={today ? { boxShadow: 'inset 0 0 0 1.5px #ff5733' } : undefined}>
              <div className="w-12 h-12 rounded-2xl bg-[#3a1d18] text-[#ff5733] font-bold flex items-center justify-center shrink-0">{d.shortDay}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{d.dayName}</span>
                  {today && <span className="text-[10px] font-bold bg-[#ff5733] rounded-full px-2 py-0.5">TODAY</span>}
                </div>
                <div className="text-gray-400 text-sm truncate">{d.title} · {d.subtitle}</div>
                {t > 0 && <div className="h-1.5 bg-[#2a2a31] rounded-full mt-2"><div className="h-full rounded-full bg-[#ff5733]" style={{ width: `${(n / t) * 100}%` }} /></div>}
              </div>
              {ws.completedDays[d.id] ? <Check className="text-[#ff5733]" /> : <ChevronRight className="text-gray-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  // ---------- DAY: exercises of that day ----------
  const dayScreen = (d: DayWorkout) => {
    const t = totalSets(d), n = doneSets(d, ws.setLogs);
    return (
      <div className="px-5 pt-8">
        {back('Home')}
        <div className={`${card} mt-4`}>
          <span className={tag}>{d.dayName} · {d.title}</span>
          <h1 className="text-2xl font-bold mt-3">{d.subtitle}</h1>
          {t > 0 && <p className="text-gray-400 mt-2">{n}/{t} sets done · ~{d.estimatedDurationMin} min</p>}
        </div>
        <div className="space-y-3 mt-4">
          {d.exercises.map((e, i) =>
            row(e, e.sets.length ? `${e.sets.length} sets${e.sets[0].targetReps ? ' · ' + e.sets.map((s) => s.targetReps).join('/') + ' reps' : ''}` : e.targetArea,
              () => go({ tab: 'home', day: d.id, ex: e.id }),
              e.sets.length > 0 && e.sets.every((s) => ws.setLogs[`${d.id}_${e.id}_set_${s.setNum}`]?.completed), i)
          )}
        </div>
        {t > 0 && (
          <div className="flex gap-3 mt-5">
            <button onClick={() => finishDay(d)} className="flex-1 bg-[#ff5733] rounded-2xl py-3.5 font-bold">Finish workout</button>
            <button onClick={() => resetDay(d)} className="bg-[#17171c] rounded-2xl px-5 text-gray-300">Reset</button>
          </div>
        )}
      </div>
    );
  };

  // ---------- EXERCISE DETAIL ----------
  const detail = (e: Exercise, dayId?: string) => {
    const c = catOf(e);
    const timed = e.sets.find((s) => s.isTimed);
    return (
      <div className="px-5 pt-8 space-y-4">
        {back(dayId ? DAYS.find((d) => d.id === dayId)!.dayName : c)}
        <div className={card}>
          <span className={tag}>{c} · {e.targetArea.split('(')[0].trim()}</span>
          <h1 className="text-3xl font-bold mt-3">{e.name}</h1>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={`${card} text-center`}>
            <div className="font-bold mb-3">Equipment</div>
            <Dumbbell className="mx-auto text-[#ff5733]" size={52} />
            <div className="text-gray-400 text-sm mt-3">{equip(e.name)}</div>
          </div>
          <div className={`${card} text-center overflow-hidden`}>
            <div className="font-bold mb-3">Muscles</div>
            <MuscleAnatomyViewer highlightedGroups={e.anatomyHighlightGroups} exerciseName={e.name} compact />
            <div className="text-gray-400 text-xs mt-2">{e.primaryMuscles.map((m) => m.split('(')[0].trim()).join(', ')}</div>
          </div>
        </div>
        {dayId && e.sets.length > 0 && (
          <div className={card}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg">My Sets</h2>
              <button onClick={() => startTimer(e.defaultRestSeconds || 120, e.name)} className="flex items-center gap-1 text-[#ff5733] text-sm font-semibold"><Timer size={16} /> Rest timer</button>
            </div>
            {e.sets.map((s) => {
              const l = ws.setLogs[`${dayId}_${e.id}_set_${s.setNum}`];
              return (
                <div key={s.setNum} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#3a1d18] text-[#ff5733] font-bold text-sm flex items-center justify-center">{s.setNum}</div>
                  <div className="flex-1 text-sm text-gray-300">{s.targetReps ? `${s.targetReps} reps` : s.targetDescription}</div>
                  {s.targetReps && (
                    <input inputMode="decimal" placeholder="kg" value={l?.weightKg ?? ''} onChange={(ev) => setKg(dayId, e, s.setNum, ev.target.value)}
                      className="w-16 bg-[#0d0d12] rounded-xl px-2 py-2 text-center text-sm outline-none" />
                  )}
                  <button onClick={() => toggle(dayId, e, s.setNum)} className={`w-10 h-10 rounded-xl flex items-center justify-center ${l?.completed ? 'bg-[#ff5733]' : 'bg-[#2a2a31] text-gray-500'}`}><Check size={20} /></button>
                </div>
              );
            })}
          </div>
        )}
        {timed && <HoldStopwatch targetSeconds={timed.targetSeconds} />}
        <div className={card}>
          <h2 className="font-bold text-lg mb-3">Movement</h2>
          {e.stepByStep.map((s, i) => (
            <div key={i} className="flex gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#3a1d18] text-[#ff5733] font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</div>
              <p className="text-gray-300 leading-7">{s}</p>
            </div>
          ))}
        </div>
        {e.formTips.length > 0 && (
          <div className={card}>
            <h2 className="font-bold text-lg mb-2">Form tips</h2>
            {e.formTips.map((t, i) => <p key={i} className="text-gray-300 leading-7 mb-2">• {t}</p>)}
          </div>
        )}
        {e.photos && e.photos.length > 0 && (
          <div className="bg-white rounded-3xl p-3 flex gap-2">
            {e.photos.map((p) => (
              <img key={p.url} src={p.url} alt={p.label} className="h-56 flex-1 min-w-0 object-contain" onError={(ev) => (ev.currentTarget.style.display = 'none')} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // ---------- EXERCISES LIBRARY ----------
  const library = () => {
    const open = (e: Exercise) => go({ tab: 'ex', cat: nav.cat, ex: e.id });
    if (nav.cat) {
      return (
        <div className="px-5 pt-8">
          {back('Exercises')}
          <h1 className="text-4xl font-bold my-4">{nav.cat}</h1>
          <div className="space-y-3">{ALL.filter((e) => catOf(e) === nav.cat).map((e) => row(e, e.targetArea, () => open(e)))}</div>
        </div>
      );
    }
    const found = q.trim() ? ALL.filter((e) => e.name.toLowerCase().includes(q.trim().toLowerCase())) : null;
    return (
      <div className="px-5 pt-10">
        <h1 className="text-4xl font-bold mb-5">Exercises</h1>
        <div className="flex items-center gap-3 bg-[#17171c] rounded-2xl px-4 py-3 mb-5">
          <Search size={20} className="text-gray-500" />
          <input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Search exercises..." className="bg-transparent outline-none flex-1" />
        </div>
        {found ? (
          <div className="space-y-3">{found.map((e) => row(e, catOf(e), () => open(e)))}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {CATS.map((c) => {
              const n = ALL.filter((e) => catOf(e) === c).length;
              if (!n) return null;
              return (
                <button key={c} onClick={() => go({ tab: 'ex', cat: c })} className="h-36 rounded-3xl p-4 flex flex-col justify-end text-left"
                  style={{ background: `linear-gradient(150deg, ${COLOR[c]}, #0d0d12 90%)` }}>
                  <div className="text-xl font-bold">{c}</div>
                  <div className="text-gray-300 text-sm">{n} exercises</div>
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
    <button onClick={() => go({ tab: id })} className="flex-1 flex flex-col items-center gap-1 py-2">
      <div className={`px-5 py-1.5 rounded-full ${nav.tab === id ? 'bg-[#3a1d18] text-[#ff5733]' : 'text-gray-500'}`}><Icon size={22} /></div>
      <span className={`text-xs ${nav.tab === id ? 'text-[#ff5733]' : 'text-gray-500'}`}>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white max-w-md mx-auto pb-32">
      {screen}
      {timer && <RestTimerFloating key={timer.id} initialSeconds={timer.s} exerciseName={timer.n} onClose={() => setTimer(null)} />}
      <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-[#0d0d12] border-t border-[#1f1f26] flex px-4 pb-3 pt-1 z-30">
        {tab('home', 'Home', Calendar)}
        {tab('ex', 'Exercises', Dumbbell)}
        <button onClick={() => startTimer(120)} className="flex-1 flex flex-col items-center gap-1 py-2 text-gray-500">
          <div className="px-5 py-1.5"><Timer size={22} /></div>
          <span className="text-xs">Timer</span>
        </button>
      </nav>
    </div>
  );
}
