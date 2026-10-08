import React from 'react';
import { EquipKind } from '../types/workout';

const L = '#d4d4d8', M = '#a1a1aa', D = '#71717a', R = '#ff5733';

const mirror = (child: React.ReactNode) =>
  [0, 1].map((s) => <g key={s} transform={s ? 'translate(120 0) scale(-1 1)' : undefined}>{child}</g>);

export const EquipArt: React.FC<{ kind: EquipKind; h?: number }> = ({ kind, h = 64 }) => (
  <svg viewBox="0 0 120 80" height={h} className="mx-auto block" aria-hidden>
    {kind === 'barbell' && (<>
      <rect x="6" y="38" width="108" height="4" rx="2" fill={M} />
      {mirror(<><rect x="20" y="14" width="9" height="52" rx="3" fill={L} /><rect x="30" y="22" width="7" height="36" rx="3" fill={R} /></>)}
    </>)}
    {kind === 'dumbbell' && (<>
      <rect x="30" y="37" width="60" height="6" rx="3" fill={M} />
      {mirror(<><rect x="22" y="24" width="10" height="32" rx="3" fill={L} /><rect x="12" y="29" width="10" height="22" rx="3" fill={R} /></>)}
    </>)}
    {kind === 'cable' && (<>
      {mirror(<><rect x="14" y="14" width="12" height="58" rx="2" fill={L} /><rect x="17" y="26" width="6" height="30" fill={D} /><rect x="8" y="70" width="26" height="6" rx="2" fill={M} /></>)}
      <rect x="14" y="10" width="92" height="5" rx="2.5" fill={R} />
      <path d="M46 15 V40 M74 15 V40" stroke={M} strokeWidth="1.5" />
      <rect x="40" y="40" width="40" height="5" rx="2.5" fill={L} />
    </>)}
    {kind === 'pulldown' && (<>
      <rect x="12" y="72" width="96" height="5" rx="2" fill={M} />
      <rect x="84" y="8" width="12" height="64" rx="2" fill={L} /><rect x="87" y="22" width="6" height="32" fill={D} />
      <rect x="30" y="8" width="66" height="6" rx="2" fill={L} />
      <path d="M36 14 V34 M64 14 V34" stroke={M} strokeWidth="2" />
      <rect x="28" y="32" width="44" height="5" rx="2.5" fill={R} />
      <rect x="40" y="58" width="30" height="6" rx="2" fill={L} /><rect x="36" y="48" width="26" height="4" rx="2" fill={D} />
      <rect x="54" y="64" width="5" height="8" fill={M} />
    </>)}
    {kind === 'machine' && (<>
      <rect x="12" y="68" width="96" height="6" rx="2" fill={M} />
      <rect x="84" y="12" width="12" height="56" rx="2" fill={L} /><rect x="87" y="22" width="6" height="30" fill={R} />
      <rect x="22" y="52" width="38" height="8" rx="3" fill={L} />
      <rect x="20" y="20" width="8" height="38" rx="3" fill={D} transform="rotate(14 24 40)" />
      <rect x="60" y="40" width="26" height="4" rx="2" fill={M} />
    </>)}
    {kind === 'bodyweight' && (<>
      <circle cx="60" cy="14" r="8" fill={L} />
      <path d="M60 24 V50 M60 30 L40 20 M60 30 L80 20 M60 50 L46 74 M60 50 L74 74" stroke={L} strokeWidth="7" strokeLinecap="round" />
      <path d="M52 34 h16" stroke={R} strokeWidth="7" strokeLinecap="round" />
    </>)}
    {kind === 'bar' && (<>
      {mirror(<><rect x="18" y="10" width="8" height="64" rx="3" fill={L} /><rect x="12" y="72" width="20" height="5" rx="2" fill={M} /></>)}
      <rect x="18" y="12" width="84" height="6" rx="3" fill={R} />
      <rect x="40" y="18" width="5" height="14" rx="2" fill={M} /><rect x="75" y="18" width="5" height="14" rx="2" fill={M} />
    </>)}
    {kind === 'bench' && (<>
      <rect x="14" y="32" width="92" height="10" rx="4" fill={R} />
      {mirror(<><rect x="24" y="42" width="6" height="26" fill={L} /><rect x="16" y="66" width="22" height="5" rx="2" fill={M} /></>)}
    </>)}
    {kind === 'bike' && (<>
      <circle cx="30" cy="58" r="15" fill="none" stroke={L} strokeWidth="5" />
      <circle cx="30" cy="58" r="4" fill={M} />
      <path d="M30 58 L58 34 L86 58 M58 34 L52 18 M80 22 L72 54" stroke={L} strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="42" y="13" width="20" height="6" rx="3" fill={R} />
      <rect x="72" y="18" width="18" height="6" rx="3" fill={M} />
      <rect x="66" y="70" width="40" height="5" rx="2" fill={M} />
    </>)}
    {kind === 'treadmill' && (<>
      <path d="M12 66 L96 56" stroke={R} strokeWidth="8" strokeLinecap="round" />
      <path d="M92 56 L100 18" stroke={L} strokeWidth="5" strokeLinecap="round" />
      <rect x="86" y="10" width="26" height="10" rx="3" fill={L} />
      <path d="M88 30 L74 32" stroke={M} strokeWidth="4" strokeLinecap="round" />
      <rect x="10" y="68" width="92" height="5" rx="2" fill={M} />
    </>)}
    {kind === 'rope' && (<>
      <path d="M30 28 C20 70, 100 70, 90 28" stroke={M} strokeWidth="3" fill="none" />
      <rect x="25" y="10" width="10" height="22" rx="4" fill={R} /><rect x="85" y="10" width="10" height="22" rx="4" fill={R} />
    </>)}
    {kind === 'wheel' && (<>
      <rect x="18" y="37" width="84" height="6" rx="3" fill={M} />
      <circle cx="60" cy="40" r="22" fill={L} /><circle cx="60" cy="40" r="9" fill={R} />
      <rect x="10" y="35" width="14" height="10" rx="4" fill={D} /><rect x="96" y="35" width="14" height="10" rx="4" fill={D} />
    </>)}
    {kind === 'plate' && (<>
      <circle cx="60" cy="40" r="30" fill={L} /><circle cx="60" cy="40" r="22" fill="none" stroke={M} strokeWidth="2" />
      <circle cx="60" cy="40" r="7" fill={R} />
    </>)}
  </svg>
);
