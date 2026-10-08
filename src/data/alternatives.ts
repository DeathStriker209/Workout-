// Swap options for each exercise in the weekly plan.
// Option A is always the planned exercise; these are B, C, D… Every alternative trains the
// same main muscles, so you can switch when a machine is taken or a movement doesn't feel right.
export const ALTERNATIVES: Record<string, string[]> = {
  // Monday: Lift A
  'leg-press': ['hack-squat', 'smith-squat', 'goblet-squat'],
  'lat-pulldown-a': ['close-grip-pulldown', 'pull-up', 'chin-up'],
  'smith-machine-bench-press': ['barbell-bench-press', 'dumbbell-bench-press', 'machine-chest-press'],
  'shoulder-press-a': ['arnold-press', 'machine-shoulder-press', 'overhead-press'],
  'lateral-raise-a': ['cable-lateral-raise', 'upright-row'],
  'cable-crunch': ['machine-crunch', 'crunch', 'reverse-crunch'],
  'overhead-tricep-extension': ['dumbbell-overhead-extension', 'skull-crusher'],
  'reverse-curl': ['hammer-curl', 'cross-body-hammer-curl'],
  'f-wrist-curls': ['behind-back-wrist-curl', 'finger-curls'],
  'f-farmers-carries': ['dumbbell-shrug', 'wrist-roller'],
  'f-plate-pinch-hold': ['finger-curls', 'f-farmers-carries'],

  // Cardio days
  'cycle-session-day-2': ['incline-treadmill-walk', 'elliptical', 'stair-climber'],
  'cycle-session-day-4': ['incline-treadmill-walk', 'elliptical', 'stair-climber'],
  'cycle-session-day-6': ['incline-treadmill-walk', 'elliptical', 'stair-climber'],

  // Wednesday: Lift B
  'sldl': ['romanian-deadlift', 'good-morning', 'deadlift'],
  'seated-cable-row': ['machine-row', 'dumbbell-row', 't-bar-row'],
  'pec-deck': ['cable-crossover', 'dumbbell-fly', 'low-to-high-cable-fly'],
  'rear-delt-fly': ['face-pull', 'reverse-cable-fly', 'incline-reverse-fly'],
  'jm-press': ['close-grip-bench-press', 'skull-crusher'],
  'rope-pushdown': ['straight-bar-pushdown', 'dumbbell-kickback', 'reverse-grip-pushdown'],
  'hammer-curl': ['cable-rope-hammer-curl', 'cross-body-hammer-curl', 'reverse-curl'],

  // Friday: Lift C
  'leg-extension': ['hack-squat', 'goblet-squat'],
  'lying-hamstring-curl': ['seated-leg-curl', 'romanian-deadlift'],
  'lat-pulldown-c': ['close-grip-pulldown', 'pull-up', 'chin-up'],
  'shoulder-press-or-lateral-raise': ['lateral-raise-a', 'machine-shoulder-press', 'cable-lateral-raise'],
  'preacher-curl': ['spider-curl', 'concentration-curl', 'ez-bar-curl'],
  'incline-dumbbell-curl': ['drag-curl', 'dumbbell-curl', 'barbell-curl'],
  'f-reverse-wrist-curls': ['wrist-roller', 'reverse-curl'],
  'f-pronation-supination-curls': ['wrist-roller', 'hammer-curl'],
  'f-cable-hook-position-hold': ['f-wrist-curls', 'wrist-roller'],
};
