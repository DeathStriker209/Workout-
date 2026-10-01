import React from 'react';
import { MUSCLES, SILHOUETTE, VIEWBOX } from './BodyData';

// Which traced regions light up for each muscle group used in the workout data
const MAP: Record<string, string[]> = {
  chest: ['chest'], back: ['back', 'traps'], shoulders: ['delts'], biceps: ['biceps'], triceps: ['triceps'],
  arms: ['biceps', 'triceps'], forearms: ['forearms'], abs: ['abs'], quadriceps: ['quads'], hamstrings: ['hams'],
  glutes: ['glutes'], calves: ['calves'], legs: ['quads', 'hams'], cardio: [],
};

export const regionsFor = (groups: string[]) => new Set(groups.flatMap((g) => MAP[g] ?? []));

export const Body: React.FC<{ on: Set<string>; className?: string }> = ({ on, className }) => (
  <svg viewBox={VIEWBOX} className={className}>
    {SILHOUETTE.map((d, i) => <path key={i} d={d} fill="#999999" />)}
    {MUSCLES.map(([, region, d], i) => <path key={i} d={d} fill={on.has(region) ? '#e64d2f' : '#000000'} />)}
  </svg>
);
