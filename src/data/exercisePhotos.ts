import { ExercisePhoto } from '../types/workout';

export const EXERCISE_PHOTOS_DATABASE: Record<string, ExercisePhoto[]> = {
  'leg-press': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg',
      label: 'Setup & Bottom Stretch (Knees at 90°)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/1.jpg',
      label: 'Concentric Drive (Stop before knee lockout)',
    },
  ],
  'lat-pulldown-a': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Full_Range-Of-Motion_Lat_Pulldown/0.jpg',
      label: 'Starting Hang (Full lat stretch & scapular elevation)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Full_Range-Of-Motion_Lat_Pulldown/1.jpg',
      label: 'Peak Lat Contraction (Elbows driven to collarbones)',
    },
  ],
  'smith-machine-bench-press': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Bench_Press/0.jpg',
      label: 'Descent to Lower Chest (Elbows tucked 45-60°)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Bench_Press/1.jpg',
      label: 'Top Lockout & Pectoral Flexion',
    },
  ],
  'shoulder-press-a': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shoulder_Press/0.jpg',
      label: 'Racked at Shoulder Level in Scapular Plane',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shoulder_Press/1.jpg',
      label: 'Overhead Lockout & Deltoid Contraction',
    },
  ],
  'lateral-raise-a': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg',
      label: 'Starting Stance (Dumbbells resting at sides)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/1.jpg',
      label: 'Parallel Elevation (Elbows leading, side delts engaged)',
    },
  ],
  'cable-crunch': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crunch/0.jpg',
      label: 'Kneeling Stance (Rope handles anchored to cheekbones)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crunch/1.jpg',
      label: 'Maximal Spinal Flexion (Ribs pulled to pelvis)',
    },
  ],
  'overhead-tricep-extension': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Overhead_Triceps_Extension/0.jpg',
      label: 'Eccentric Stretch Behind Head (Long head loaded)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Overhead_Triceps_Extension/1.jpg',
      label: 'Overhead Extension with Rope Flared Outward',
    },
  ],
  'reverse-curl': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Dumbbell_Reverse_Curl/0.jpg',
      label: 'Overhand (Pronated) Grip at Thighs',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Dumbbell_Reverse_Curl/1.jpg',
      label: 'Brachioradialis Peak Flexion with Rigid Wrists',
    },
  ],
  'f-wrist-curls': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Up_Barbell_Wrist_Curl_Over_A_Bench/0.jpg',
      label: 'Wrists Dropped over Bench Edge (Fingers opened)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Up_Barbell_Wrist_Curl_Over_A_Bench/1.jpg',
      label: 'Full Wrist Flexion & Forearm Squeeze',
    },
  ],
  'f-farmers-carries': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Farmers_Walk/0.jpg',
      label: 'Heavy Deadlift Setup & Trapezius Engagement',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Farmers_Walk/1.jpg',
      label: 'Upright Heel-to-Toe Stride (Crushing grip)',
    },
  ],
  'f-plate-pinch-hold': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plate_Pinch/0.jpg',
      label: 'Smooth Plate Rim Fingertip Pinch Grip',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plate_Pinch/1.jpg',
      label: 'Static Upright Hold to Near-Failure',
    },
  ],
  'cycle-session-day-2': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/0.jpg',
      label: 'Stationary Cycle Saddle Alignment (25° knee angle)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/1.jpg',
      label: 'Steady Zone 2 Aerobic Cadence (80-90 RPM)',
    },
  ],
  'sldl': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Barbell_Deadlift/0.jpg',
      label: 'Upright Setup with Soft Knee Angle',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Barbell_Deadlift/1.jpg',
      label: 'Deep Hamstring Hip Hinge (Neutral spine)',
    },
  ],
  'seated-cable-row': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg',
      label: 'Forward Lat Stretch & Controlled Protraction',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/1.jpg',
      label: 'Scapular Retraction & Drive into Abdomen',
    },
  ],
  'pec-deck': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butterfly/0.jpg',
      label: 'Arms Open in Wide Eccentric Pectoral Stretch',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butterfly/1.jpg',
      label: 'Hands Swept Inward for Peak Inner Chest Squeeze',
    },
  ],
  'rear-delt-fly': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Rear_Lateral_Raise/0.jpg',
      label: 'Starting Hand Position (Lead with elbows)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Rear_Lateral_Raise/1.jpg',
      label: 'Posterior Deltoid Contraction in Wide Arc',
    },
  ],
  'jm-press': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/JM_Press/0.jpg',
      label: 'Barbell Locked Out Over Upper Chest',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/JM_Press/1.jpg',
      label: 'Elbows Folded Forward toward Throat/Clavicle',
    },
  ],
  'rope-pushdown': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg',
      label: 'Elbows Pinned at 90° Beside Ribcage',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/1.jpg',
      label: 'Full Tricep Lockout & Knots Flared Outward',
    },
  ],
  'hammer-curl': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Hammer_Curl/0.jpg',
      label: 'Neutral (Thumbs-Up) Starting Grip at Sides',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Hammer_Curl/1.jpg',
      label: 'Brachialis Peak Contraction Near Shoulder',
    },
  ],
  'cycle-session-day-4': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/0.jpg',
      label: 'Mid-Week Cardio Flush Saddle Setup',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/1.jpg',
      label: 'Rhythmic Aerobic Pedal Turnover (Zone 2)',
    },
  ],
  'leg-extension': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg',
      label: 'Starting Ankle Pad Position (Knees at 90°)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/1.jpg',
      label: 'Full Knee Extension & Peak Quad Squeeze',
    },
  ],
  'lying-hamstring-curl': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/0.jpg',
      label: 'Prone Position on Bench (Pad on lower calf)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/1.jpg',
      label: 'Heels Curled into Glutes (Hips pressed down)',
    },
  ],
  'lat-pulldown-c': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Full_Range-Of-Motion_Lat_Pulldown/0.jpg',
      label: 'Deep Vertical Pull Overhead Stretch',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Full_Range-Of-Motion_Lat_Pulldown/1.jpg',
      label: 'Bar Brought to Upper Chest (Lats flexed)',
    },
  ],
  'shoulder-press-or-lateral-raise': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg',
      label: 'Option A/B: Starting Dumbbell Position',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/1.jpg',
      label: 'Deltoid Isolation at Parallel Plane',
    },
  ],
  'preacher-curl': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Preacher_Curls/0.jpg',
      label: 'Armpits Anchored Over Angled Preacher Pad',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Preacher_Curls/1.jpg',
      label: 'Biceps Short Head Peak Contraction',
    },
  ],
  'incline-dumbbell-curl': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/0.jpg',
      label: 'Hanging Incline Stretch Behind Torso',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/1.jpg',
      label: 'Supinated Bicep Long Head Peak Squeeze',
    },
  ],
  'f-reverse-wrist-curls': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Down_Wrist_Curl_Over_A_Bench/0.jpg',
      label: 'Forearms Flat on Bench (Palms facing downward)',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Down_Wrist_Curl_Over_A_Bench/1.jpg',
      label: 'Knuckles Curled High into Forearm Extensors',
    },
  ],
  'f-pronation-supination-curls': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Wrist_Curl/0.jpg',
      label: 'Forearm Supported with Offset Dumbbell Neutral',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Wrist_Curl/1.jpg',
      label: 'Controlled Radial & Ulnar Rotational Turn',
    },
  ],
  'f-cable-hook-position-hold': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Wrist_Curl/1.jpg',
      label: 'Wrist Curled Inward into Arm-Wrestling Hook',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Wrist_Curl/0.jpg',
      label: 'Locked 90° Elbow Static Isometric Tension',
    },
  ],
  'cycle-session-day-6': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/0.jpg',
      label: 'Weekend Aerobic Ride Setup',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/1.jpg',
      label: 'Cadence Holding Smooth 80-90 RPM',
    },
  ],
  'full-rest-protocol': [
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hamstring_Stretch/0.jpg',
      label: 'Decompression & Soft Tissue Elongation',
    },
    {
      url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hamstring_Stretch/1.jpg',
      label: 'Full Rest & Parasympathetic Recovery',
    },
  ],
};

export function getExercisePhotos(exerciseId: string): ExercisePhoto[] {
  return EXERCISE_PHOTOS_DATABASE[exerciseId] || [];
}
