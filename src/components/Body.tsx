import React from 'react';
import { MUSCLES, SILHOUETTE, VIEWBOX } from './BodyData';

// Which drawn regions light up for each muscle group used in the exercise data
const MAP: Record<string, string[]> = {
  chest: ['chest'], shoulders: ['delts'], reardelts: ['reardelts'], traps: ['traps'], lats: ['lats'],
  upperback: ['upperback'], lowerback: ['lowerback'], biceps: ['biceps'], triceps: ['triceps'],
  forearms: ['forearms'], abs: ['abs'], obliques: ['obliques'], quadriceps: ['quads'], hamstrings: ['hams'],
  glutes: ['glutes'], calves: ['calves'], adductors: ['adductors'], abductors: ['abductors'], cardio: [],
};

export const regionsFor = (groups: string[] = []) => new Set(groups.flatMap((g) => MAP[g] ?? []));

export const MUSCLE_LABEL: Record<string, string> = {
  chest: 'Chest', shoulders: 'Shoulders', reardelts: 'Rear Delts', traps: 'Traps', lats: 'Lats', upperback: 'Upper Back',
  lowerback: 'Lower Back', biceps: 'Biceps', triceps: 'Triceps', forearms: 'Forearms', abs: 'Abs', obliques: 'Obliques',
  quadriceps: 'Quads', hamstrings: 'Hamstrings', glutes: 'Glutes', calves: 'Calves', adductors: 'Inner Thighs',
  abductors: 'Outer Hips', cardio: 'Heart & Lungs',
};

const ACCENT = '#ff5733';
const DIM = '#8a3423';

/** Front + back muscle map. `on` = primary movers (bright), `soft` = helpers (dim). */
const VIEWS = { both: VIEWBOX, front: '20 10 231 530', back: '251 10 231 530', frontUpper: '30 40 211 250', backUpper: '261 40 211 250', frontLower: '30 230 211 310' };

export const Body: React.FC<{ on: Set<string>; soft?: Set<string>; className?: string; view?: keyof typeof VIEWS }> = ({ on, soft, className, view = 'both' }) => (
  <svg viewBox={VIEWS[view]} className={className} shapeRendering="geometricPrecision" role="img" aria-label="Muscle map">
    {SILHOUETTE.map((d, i) => <path key={i} d={d} fill="#8e8e96" />)}
    {MUSCLES.map(([, region, d], i) => (
      <path key={i} d={d} fill={on.has(region) ? ACCENT : soft?.has(region) ? DIM : '#050507'}
        style={{ transition: 'fill .25s ease' }} />
    ))}
  </svg>
);
