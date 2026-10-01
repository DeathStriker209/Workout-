import React from 'react';

export type EquipKind = 'cable' | 'dumbbell' | 'barbell' | 'machine';

export const equipOf = (n: string): { label: string; kind: EquipKind } =>
  /smith/i.test(n) ? { label: 'Smith machine', kind: 'barbell' }
  : /plate pinch/i.test(n) ? { label: 'Weight plates', kind: 'dumbbell' }
  : /ez|barbell|jm press|sldl|deadlift|reverse curl|preacher/i.test(n) ? { label: 'Barbell / EZ bar', kind: 'barbell' }
  : /cable|pulldown|pushdown|row|crunch/i.test(n) ? { label: 'Cable machine', kind: 'cable' }
  : /cycl/i.test(n) ? { label: 'Exercise bike', kind: 'machine' }
  : /leg press|extension|hamstring curl|pec deck|rear delt/i.test(n) ? { label: 'Machine', kind: 'machine' }
  : { label: 'Dumbbells', kind: 'dumbbell' };

const L = '#d4d4d8', M = '#a1a1aa', D = '#71717a', R = '#ff5733';

export const EquipArt: React.FC<{ kind: EquipKind }> = ({ kind }) => (
  <svg viewBox="0 0 120 80" height={64} className="mx-auto block">
    {kind === 'cable' && (<>
      <rect x="14" y="14" width="12" height="58" rx="2" fill={L} /><rect x="94" y="14" width="12" height="58" rx="2" fill={L} />
      <rect x="17" y="26" width="6" height="30" fill={D} /><rect x="97" y="26" width="6" height="30" fill={D} />
      <rect x="8" y="70" width="26" height="6" rx="2" fill={M} /><rect x="86" y="70" width="26" height="6" rx="2" fill={M} />
      <rect x="14" y="10" width="92" height="5" rx="2.5" fill={R} />
    </>)}
    {kind === 'dumbbell' && (<>
      <rect x="30" y="37" width="60" height="6" rx="3" fill={M} />
      {[0, 1].map((s) => (<g key={s} transform={s ? 'translate(120 0) scale(-1 1)' : undefined}>
        <rect x="22" y="24" width="10" height="32" rx="3" fill={L} /><rect x="12" y="29" width="10" height="22" rx="3" fill={R} />
      </g>))}
    </>)}
    {kind === 'barbell' && (<>
      <rect x="6" y="38" width="108" height="4" rx="2" fill={M} />
      {[0, 1].map((s) => (<g key={s} transform={s ? 'translate(120 0) scale(-1 1)' : undefined}>
        <rect x="20" y="14" width="9" height="52" rx="3" fill={L} /><rect x="30" y="22" width="7" height="36" rx="3" fill={R} />
      </g>))}
    </>)}
    {kind === 'machine' && (<>
      <rect x="12" y="68" width="96" height="6" rx="2" fill={M} />
      <rect x="84" y="12" width="12" height="56" rx="2" fill={L} /><rect x="87" y="22" width="6" height="30" fill={R} />
      <rect x="22" y="52" width="38" height="8" rx="3" fill={L} />
      <rect x="20" y="20" width="8" height="38" rx="3" fill={D} transform="rotate(14 24 40)" />
      <rect x="60" y="40" width="26" height="4" rx="2" fill={M} />
    </>)}
  </svg>
);
