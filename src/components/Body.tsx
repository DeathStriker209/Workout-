import React from 'react';

// [region, cx, cy, rx, ry, rotation]
type Reg = [string, number, number, number, number, number?];
const FRONT: Reg[] = [
  ['delts', 30, 36, 8, 8], ['delts', 70, 36, 8, 8],
  ['chest', 42, 42, 9, 8], ['chest', 58, 42, 9, 8],
  ['abs', 50, 62, 6.5, 12], ['abs', 38, 64, 3.5, 10], ['abs', 62, 64, 3.5, 10],
  ['biceps', 24, 53, 6, 13, 8], ['biceps', 76, 53, 6, 13, -8],
  ['forearms', 19, 79, 5, 13, 6], ['forearms', 81, 79, 5, 13, -6],
  ['quads', 41, 110, 9, 23], ['quads', 59, 110, 9, 23],
  ['calves', 40, 153, 6, 17], ['calves', 60, 153, 6, 17],
];
const BACK: Reg[] = [
  ['traps', 50, 33, 13, 7],
  ['delts', 30, 36, 8, 8], ['delts', 70, 36, 8, 8],
  ['back', 40, 54, 10, 14], ['back', 60, 54, 10, 14], ['back', 50, 72, 8, 6],
  ['triceps', 24, 53, 6, 13, 8], ['triceps', 76, 53, 6, 13, -8],
  ['forearms', 19, 79, 5, 13, 6], ['forearms', 81, 79, 5, 13, -6],
  ['glutes', 42, 86, 9, 8], ['glutes', 58, 86, 9, 8],
  ['hams', 41, 117, 8, 17], ['hams', 59, 117, 8, 17],
  ['calves', 40, 153, 6, 17], ['calves', 60, 153, 6, 17],
];
const MAP: Record<string, string[]> = {
  chest: ['chest'], back: ['back', 'traps'], shoulders: ['delts'], biceps: ['biceps'], triceps: ['triceps'],
  arms: ['biceps', 'triceps'], forearms: ['forearms'], abs: ['abs'], quadriceps: ['quads'], hamstrings: ['hams'],
  glutes: ['glutes'], calves: ['calves'], legs: ['quads', 'hams'], cardio: [],
};

export const regionsFor = (groups: string[]) => new Set(groups.flatMap((g) => MAP[g] ?? []));

export const Body: React.FC<{ side: 'front' | 'back'; on: Set<string>; h: number }> = ({ side, on, h }) => (
  <svg viewBox="0 0 100 186" height={h} className="block">
    <g fill="#8e8e93">
      <circle cx="50" cy="13" r="9" />
      <rect x="45" y="20" width="10" height="10" rx="3" />
      <rect x="35" y="30" width="30" height="70" rx="13" />
      <ellipse cx="16" cy="97" rx="4" ry="5" /><ellipse cx="84" cy="97" rx="4" ry="5" />
      <ellipse cx="39" cy="177" rx="7" ry="4" /><ellipse cx="61" cy="177" rx="7" ry="4" />
    </g>
    {(side === 'front' ? FRONT : BACK).map(([n, x, y, rx, ry, r = 0], i) => (
      <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${r} ${x} ${y})`}
        fill={on.has(n) ? '#ff5733' : '#111116'} stroke="#8e8e93" strokeWidth="1.3" />
    ))}
  </svg>
);
