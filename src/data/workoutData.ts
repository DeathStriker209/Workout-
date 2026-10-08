import { Category, DayWorkout, EquipKind, Exercise, MuscleGroup } from '../types/workout';
import { getExercisePhotos } from './exercisePhotos';

// Raw entries: muscles, category and equipment are set in META below so they stay easy to audit.
type RawExercise = Omit<Exercise, 'category' | 'equipment' | 'anatomyHighlightGroups'> & { anatomyHighlightGroups: string[] };
type RawDay = Omit<DayWorkout, 'exercises'> & { exercises: RawExercise[] };

const RAW_WORKOUT_DAYS: RawDay[] = [
  // DAY 1: MONDAY - LIFT A
  {
    id: 'day-1',
    dayNumber: 1,
    dayName: 'Monday',
    shortDay: 'Mon',
    title: 'Lift A',
    category: 'lift',
    subtitle: 'Full Upper/Lower Compound + Forearm & Grip',
    focusAreas: ['Legs', 'Lats', 'Chest', 'Shoulders', 'Arms', 'Forearms & Grip'],
    estimatedDurationMin: 65,
    exercises: [
      {
        id: 'leg-press',
        name: 'Leg Press',
        targetArea: 'Lower Body (Quads & Glutes)',
        primaryMuscles: ['Quadriceps (Vastus Medialis, Lateralis, Intermedius, Rectus Femoris)', 'Gluteus Maximus'],
        secondaryMuscles: ['Hamstrings', 'Adductor Magnus', 'Calves (Gastrocnemius)'],
        anatomyHighlightGroups: ['quadriceps', 'glutes'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'A 45-degree sled press designed to safely load the knee and hip extensors under heavy tension without axial spine compression.',
        stepByStep: [
          'Sit firmly into the sled with your lower back and sacrum flat against the back pad.',
          'Position feet shoulder-width apart in the center of the platform with toes slightly pointed outward (~10-15°).',
          'Release safety catches, grip the handles, and brace your core with a deep belly breath.',
          'Lower the sled smoothly until your knees reach approximately 90 degrees without allowing your tailbone to peel off the pad.',
          'Drive through the mid-foot and heel to press back up, stopping just shy of a harsh knee lockout.'
        ],
        formTips: [
          'Never lock knees rigidly at the top of the stroke.',
          'Ensure lower back stays firmly pinned against the seat to protect lumbar spine.',
          'Descend under a deliberate 2-3 second count.'
        ],
        commonMistakes: [
          'Rounding the lower back / pelvic tuck at the bottom of the movement.',
          'Allowing knees to cave inward during the pressing drive.'
        ],
        videoEmbedId: 'IZxyjW7MPJQ',
        videoSearchQuery: 'leg press correct form tutorial',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal (Hip & Knee Flexion/Extension)',
          tempo: '3-0-1-0 (3s eccentric, explosive drive)'
        }
      },
      {
        id: 'lat-pulldown-a',
        name: 'Lat Pulldown',
        targetArea: 'Upper Back & Lats (Vertical Pull)',
        primaryMuscles: ['Latissimus Dorsi', 'Teres Major'],
        secondaryMuscles: ['Biceps Brachii', 'Brachialis', 'Rhomboids', 'Lower Trapezius', 'Posterior Deltoid'],
        anatomyHighlightGroups: ['back', 'biceps'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'The premier vertical pulling movement for broadening the latissimus dorsi and building full upper back width.',
        stepByStep: [
          'Adjust thigh pads snugly over your quads to anchor your body down.',
          'Grip the bar slightly wider than shoulder width with an overhand (pronated) grip.',
          'Depress and retract your scapulae down into your back pockets before initiating the pull.',
          'Pull the bar down toward upper collarbones while driving your elbows downward and slightly inward.',
          'Control the bar back up into a full stretch at the top overhead position.'
        ],
        formTips: [
          'Think of pulling your elbows to your hips rather than pulling with your hands.',
          'Keep a proud, upright chest with only a modest 10-15 degree backward lean.',
          'Squeeze lats hard at bottom for a 1-second pause.'
        ],
        commonMistakes: [
          'Excessively rocking backwards like a rowing motion.',
          'Pulling the bar behind the neck (stresses cervical spine and rotator cuffs).'
        ],
        videoEmbedId: 'CAwf7n6Luuc',
        videoSearchQuery: 'lat pulldown proper form execution',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Frontal / Scapular Plane',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'smith-machine-bench-press',
        name: 'Smith Machine Bench Press',
        targetArea: 'Chest & Triceps (Horizontal Push)',
        primaryMuscles: ['Pectoralis Major (Sternal & Costal heads)'],
        secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii (Lateral & Medial heads)'],
        anatomyHighlightGroups: ['chest', 'triceps', 'shoulders'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Fixed-track horizontal chest press that provides exceptional chest isolation and safety when training to high intensity.',
        stepByStep: [
          'Center flat bench so the barbell tracks directly across the mid-to-lower sternum.',
          'Retract and pin shoulder blades into the bench and plant feet firmly flat on the floor.',
          'Grip the bar roughly 1.5 times shoulder-width so forearms are vertical at the bottom position.',
          'Rotate bar off the catches, take a diaphragmatic breath to brace chest and core.',
          'Lower bar smoothly until touching or hovering 1 inch above your chest, then press back up forcefully.'
        ],
        formTips: [
          'Tuck elbows at roughly 45–60 degrees relative to your torso (avoid 90-degree flare).',
          'Maintain a stable arch in thoracic spine while glutes stay glued to bench.',
          'Do not bounce the bar off ribs.'
        ],
        commonMistakes: [
          'Setting the bench too far back, forcing bar path over neck/face.',
          'Lifting shoulder blades off the bench at top lockout.'
        ],
        videoEmbedId: 'U_YwQ9g8V1Y',
        videoSearchQuery: 'smith machine bench press tutorial form',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Transverse / Horizontal Abduction & Adduction',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'shoulder-press-a',
        name: 'Shoulder Press',
        targetArea: 'Shoulders (Vertical Push)',
        primaryMuscles: ['Anterior Deltoid', 'Lateral Deltoid'],
        secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Serratus Anterior'],
        anatomyHighlightGroups: ['shoulders', 'triceps'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Seated dumbbell or machine overhead press for developing dense shoulder caps and overhead pushing power.',
        stepByStep: [
          'Sit with back supported on an 80–85 degree incline bench.',
          'Bring dumbbells to shoulder height, palms angled slightly inward (scapular plane ~30°).',
          'Brace core and press weight upward in a smooth arc until arms are extended overhead.',
          'Lower with control back to ear level, maintaining continuous tension on the deltoids.'
        ],
        formTips: [
          'Avoid hyper-arching lower back; keep ribs pulled down.',
          'Do not slam dumbbells together at the top.',
          'Press in the natural scapular plane rather than flared out to sides.'
        ],
        commonMistakes: [
          'Dropping elbows below resting plane, putting excessive stress on rotator cuffs.',
          'Using leg drive or thrusting hips forward off bench.'
        ],
        videoEmbedId: 'qEwKCR5JCog',
        videoSearchQuery: 'seated dumbbell shoulder press proper form',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Frontal / Scapular Plane Overhead',
          tempo: '2-0-1-0'
        }
      },
      {
        id: 'lateral-raise-a',
        name: 'Lateral Raise',
        targetArea: 'Shoulders (Side Delts Width)',
        primaryMuscles: ['Lateral Deltoid'],
        secondaryMuscles: ['Anterior Deltoid', 'Posterior Deltoid', 'Supraspinatus', 'Upper Trapezius'],
        anatomyHighlightGroups: ['shoulders'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '15' },
          { setNum: 2, targetReps: '12' },
          { setNum: 3, targetReps: '10' },
        ],
        description: 'The golden isolation exercise for building 3D round shoulder width and the classic V-taper physique.',
        stepByStep: [
          'Stand tall with feet hip-width apart, holding light-to-moderate dumbbells by your sides.',
          'Hinge slightly forward at hips (~10-15 degrees) with a subtle micro-bend in elbows.',
          'Raise arms outward in the scapular plane (about 20-30 degrees in front of direct side).',
          'Lead with elbows until upper arms are parallel to the floor.',
          'Pause briefly at the top peak contraction, then lower slowly over 2 seconds.'
        ],
        formTips: [
          'Lead with the elbows, not hands or thumbs.',
          'Think of pouring water from a pitcher at top position (slight internal angle).',
          'Eliminate momentum; do not swing hips or bounce knees.'
        ],
        commonMistakes: [
          'Using excessive weight and shrugging traps up toward ears.',
          'Swinging torso back and forth to throw dumbbells up.'
        ],
        videoEmbedId: '3VcKaXpzqRo',
        videoSearchQuery: 'dumbbell lateral raise form science based',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Scapular Plane Abduction',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'cable-crunch',
        name: 'Cable Crunch',
        targetArea: 'Core & Abdominals',
        primaryMuscles: ['Rectus Abdominis (Six-Pack muscles)'],
        secondaryMuscles: ['Internal Obliques', 'External Obliques', 'Transverse Abdominis'],
        anatomyHighlightGroups: ['abs'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '15' },
          { setNum: 2, targetReps: '12' },
          { setNum: 3, targetReps: '10' },
        ],
        description: 'Loaded spinal flexion under constant cable resistance to stimulate hyper-dense abdominal hypertrophy.',
        stepByStep: [
          'Attach rope to high pulley. Kneel on floor roughly 2 feet back facing the cable stack.',
          'Hold rope handles tight against sides of your head/ears with thumbs near cheekbones.',
          'Lock hips in a fixed position; do not sit back onto your calves during the crunch.',
          'Flex spine forward, curling your ribcage down toward your pelvis and drawing navel in.',
          'Contract abs hard at bottom, pause for 1 second, then slowly unroll back to stretch.'
        ],
        formTips: [
          'The motion is spinal flexion (rounding your back like a cat), NOT a hip hinge.',
          'Keep your hip angle stationary throughout every repetition.',
          'Exhale all air at the bottom contraction to achieve maximal rectus contraction.'
        ],
        commonMistakes: [
          'Sitting hips back onto heels like a child pose (turns it into hip extension).',
          'Pulling down with arm strength rather than contracting abdominal wall.'
        ],
        videoEmbedId: '2fORO_PW46c',
        videoSearchQuery: 'cable crunch form tutorial abs',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal (Spinal Flexion)',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'overhead-tricep-extension',
        name: 'Overhead Tricep Extension',
        targetArea: 'Arms (Triceps Long Head)',
        primaryMuscles: ['Triceps Brachii (Long Head)'],
        secondaryMuscles: ['Triceps Brachii (Lateral & Medial heads)', 'Anconeus'],
        anatomyHighlightGroups: ['triceps'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Elevates arms overhead to stretch the triceps long head into maximum eccentric elongation for superior muscle growth.',
        stepByStep: [
          'Use rope attachment on low or mid cable pulley (or single dumbbell behind head).',
          'Stand facing away from cable stack, in a split stance with rope pulled overhead.',
          'Keep upper arms pinned beside ears, elbows pointing forward.',
          'Bend elbows to lower hands behind head until feeling a deep tricep stretch.',
          'Extend elbows forcefully to lock out overhead, flaring rope ends outward at peak.'
        ],
        formTips: [
          'Keep elbows tucked and avoid flaring out excessively.',
          'Emphasize the deep bottom stretch where the long head is under maximum tension.',
          'Keep ribcage down and avoid arching lower spine.'
        ],
        commonMistakes: [
          'Allowing upper arms to drift forward and back during reps.',
          'Cutting range of motion short at the bottom stretch.'
        ],
        videoEmbedId: 'ns-rgcz4-hY',
        videoSearchQuery: 'cable overhead tricep extension proper form',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal (Elbow Extension Overhead)',
          tempo: '3-0-1-0'
        }
      },
      {
        id: 'reverse-curl',
        name: 'Reverse Curl',
        targetArea: 'Arms & Forearms',
        primaryMuscles: ['Brachioradialis (Forearm Top)', 'Brachialis'],
        secondaryMuscles: ['Biceps Brachii', 'Wrist Extensors (Extensor Carpi Radialis)'],
        anatomyHighlightGroups: ['forearms', 'biceps'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Pronated (overhand) grip curls that deactivate standard bicep supination, transferring massive load directly to brachioradialis.',
        stepByStep: [
          'Hold an EZ-curl bar or straight barbell with an overhand (pronated) grip, hands shoulder-width.',
          'Pin elbows against sides of your ribcage, shoulders pulled back.',
          'Curl the bar upward toward chest while maintaining rigid wrists.',
          'Squeeze top of forearms and brachialis hard at top, then lower under a strict 2-3s count.'
        ],
        formTips: [
          'Keep wrists locked straight; do not let them hyperextend backwards under load.',
          'EZ bar reduces strain on the wrist joint compared to a straight bar.',
          'Do not swing or lean back to hoist weight.'
        ],
        commonMistakes: [
          'Allowing elbows to flare or drift forward in front of torso.',
          'Using too heavy weight and letting wrists flop downwards.'
        ],
        videoEmbedId: 'nRgxYX2Ve9w',
        videoSearchQuery: 'reverse curl ez bar form tutorial forearm',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal (Pronated Elbow Flexion)',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'f-wrist-curls',
        name: '(F) Wrist Curls',
        isForearmGrip: true,
        targetArea: 'Forearms & Grip (Flexor Compartment)',
        primaryMuscles: ['Forearm Flexors (Flexor Carpi Radialis, Flexor Carpi Ulnaris, Flexor Digitorum Superficialis)'],
        secondaryMuscles: ['Palmaris Longus', 'Finger Flexor tendons'],
        anatomyHighlightGroups: ['forearms'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '15' },
          { setNum: 2, targetReps: '12' },
          { setNum: 3, targetReps: '10' },
        ],
        description: 'Targeted wrist flexion isolation to thicken the inner forearm bellies and build immense crushing grip power.',
        stepByStep: [
          'Kneel beside a flat bench with forearms resting flat across pad, wrists hanging just off edge.',
          'Hold barbell or dumbbells with palms facing upward.',
          'Allow weight to roll down into fingers slowly for maximum flexor stretch.',
          'Curl fingers back into palm, then curl wrists upward into peak contraction.',
          'Hold top squeeze for a full second before lowering with deliberate control.'
        ],
        formTips: [
          'Resting forearms securely prevents elbow compensation.',
          'Rolling bar onto finger tips engages the deep finger flexor tendons.',
          'Focus on full ROM: deep stretch at bottom, hard squeeze at top.'
        ],
        commonMistakes: [
          'Lifting forearms off bench during curl.',
          'Moving too quickly without pausing at peak contraction.'
        ],
        videoEmbedId: '3Vdc_cv4kCE',
        videoSearchQuery: 'wrist curls forearms proper form bodybuilding',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal (Wrist Flexion)',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'f-farmers-carries',
        name: "(F) Farmer's Carries",
        isForearmGrip: true,
        targetArea: 'Forearms, Grip & Total Body Stability',
        primaryMuscles: ['Forearm Flexors (Crush Grip)', 'Trapezius (Upper & Middle)'],
        secondaryMuscles: ['Core (Obliques, Transverse Abdominis)', 'Quadriceps', 'Calves', 'Erector Spinae'],
        anatomyHighlightGroups: ['forearms', 'back', 'abs'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetDescription: '30-40m walk' },
          { setNum: 2, targetDescription: '30-40m walk' },
          { setNum: 3, targetDescription: '30-40m walk' },
        ],
        description: 'Loaded carry holding heavy dumbbells or kettlebells over distance, taxing grip endurance and spinal stabilization.',
        stepByStep: [
          'Deadlift two heavy dumbbells or kettlebells up from the floor with neutral spine.',
          'Stand fully upright with shoulders rolled back and down, chest proud, core braced.',
          'Walk forward in a smooth, heel-to-toe stride over 30–40 meters.',
          'Prevent the weights from swinging or touching your legs.',
          'Lower weights safely to floor at end of the distance with flat back.'
        ],
        formTips: [
          'Do not shrug weights up to ears; pack shoulders down.',
          'Take short, deliberate, controlled strides rather than sprinting.',
          'Resist any lateral torso swaying.'
        ],
        commonMistakes: [
          'Leaning forward or hyperextending lower back.',
          'Letting shoulders round forward under heavy load.'
        ],
        videoEmbedId: 'p5M848-18e4',
        videoSearchQuery: 'farmers walk proper form carry technique',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Multi-planar Functional Locomotion',
          tempo: 'Steady Cadence'
        }
      },
      {
        id: 'f-plate-pinch-hold',
        name: '(F) Plate Pinch Hold',
        isForearmGrip: true,
        targetArea: 'Hand Strength & Pinch Grip',
        primaryMuscles: ['Adductor Pollicis (Thumb)', 'Flexor Pollicis Longus', 'Finger Extensor & Flexor Digitorum'],
        secondaryMuscles: ['Wrist Stabilizers', 'Forearm Muscles'],
        anatomyHighlightGroups: ['forearms'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetDescription: 'Hold to near-failure (~20-40 sec)', targetSeconds: 30, isTimed: true },
          { setNum: 2, targetDescription: 'Hold to near-failure (~20-40 sec)', targetSeconds: 30, isTimed: true },
          { setNum: 3, targetDescription: 'Hold to near-failure (~20-40 sec)', targetSeconds: 30, isTimed: true },
        ],
        description: 'Pinching smooth iron or bumper plates between fingertips and thumb until near-muscular failure to build unbreakable pinch grip.',
        stepByStep: [
          'Place two equal weight plates smooth-side out (or one wide bumper plate).',
          'Pinch the rim between your extended thumb on one side and fingers on the other.',
          'Deadlift the plates up and stand completely upright beside your hip.',
          'Start your hold stopwatch and breathe continuously through nose.',
          'Hold until grip begins slipping (near failure around 20-40 seconds), then safely set down.'
        ],
        formTips: [
          'Do not let plates rest against your thigh or pocket.',
          'Keep thumb active and pressing hard into the plate surface.',
          'Stop right before plates drop to prevent toe injury.'
        ],
        commonMistakes: [
          'Curling fingers under lip of plate (defeats pinch aspect).',
          'Holding breath during the isometric hold.'
        ],
        videoEmbedId: 'qZ24wM2D0hM',
        videoSearchQuery: 'plate pinch hold grip strength tutorial',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Isometric Thumb Opposition',
          tempo: 'Static Hold to Near Failure'
        }
      }
    ]
  },

  // DAY 2: TUESDAY - CARDIO
  {
    id: 'day-2',
    dayNumber: 2,
    dayName: 'Tuesday',
    shortDay: 'Tue',
    title: 'Cardio',
    category: 'cardio',
    subtitle: 'Low-Impact Aerobic Conditioning & Flush',
    focusAreas: ['Cardiovascular System', 'Active Recovery', 'Leg Endurance'],
    estimatedDurationMin: 25,
    exercises: [
      {
        id: 'cycle-session-day-2',
        name: 'Stationary Cycling (Zone 2)',
        targetArea: 'Cardiovascular System & Lower Body Aerobic Flush',
        primaryMuscles: ['Quadriceps', 'Hamstrings', 'Gluteus Maximus', 'Calves (Gastrocnemius & Soleus)'],
        secondaryMuscles: ['Cardiovascular Heart Muscle', 'Hip Flexors', 'Core Stabilizers'],
        anatomyHighlightGroups: ['cardio', 'quadriceps', 'calves'],
        defaultRestSeconds: 0,
        sets: [
          { setNum: 1, targetDescription: 'Cycle, 20-25 min moderate pace (Zone 2 aerobic)', targetSeconds: 1350, isTimed: true }
        ],
        description: 'Steady-state stationary cycle at moderate intensity to boost mitochondrial density, burn calories, and accelerate muscle recovery between heavy lifting days.',
        stepByStep: [
          'Adjust saddle height so your leg has a slight 25–30° knee bend at bottom of pedal stroke.',
          'Warm up for 2–3 minutes at very light resistance and easy cadence (70–80 RPM).',
          'Increase resistance to moderate level where cadence stays smooth between 80–90 RPM.',
          'Maintain steady breathing: you should be able to speak in short sentences without gasping (Zone 2).',
          'Finish with a 2-minute cool-down spin to flush metabolic waste from legs.'
        ],
        formTips: [
          'Keep posture relaxed through shoulders; don\'t death-grip handlebars.',
          'Pedal in circles (pulling up as well as pushing down) rather than stomping.',
          'Hydrate throughout the 20-25 minute ride.'
        ],
        commonMistakes: [
          'Pedaling too fast with zero resistance (spinning out with no heart rate benefit).',
          'Setting saddle too low, leading to anterior knee joint discomfort.'
        ],
        videoEmbedId: 'r5cst1fB91s',
        videoSearchQuery: 'indoor cycling posture and technique cadence',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Continuous Circular Locomotion',
          tempo: '80-90 RPM Steady Cadence'
        }
      }
    ]
  },

  // DAY 3: WEDNESDAY - LIFT B
  {
    id: 'day-3',
    dayNumber: 3,
    dayName: 'Wednesday',
    shortDay: 'Wed',
    title: 'Lift B',
    category: 'lift',
    subtitle: 'Posterior Chain & Upper Pull/Push Strength',
    focusAreas: ['Hamstrings & Glutes', 'Mid Back', 'Chest', 'Rear Delts', 'Triceps', 'Biceps'],
    estimatedDurationMin: 60,
    exercises: [
      {
        id: 'sldl',
        name: 'SLDL (Stiff-Leg Deadlift)',
        targetArea: 'Posterior Chain (Hamstrings & Glutes)',
        primaryMuscles: ['Hamstrings (Biceps Femoris, Semitendinosus, Semimembranosus)', 'Gluteus Maximus'],
        secondaryMuscles: ['Erector Spinae (Lower Back)', 'Adductor Magnus', 'Lats & Forearm Grip'],
        anatomyHighlightGroups: ['hamstrings', 'glutes', 'back'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Hip-hinge staple that stretches the hamstrings under heavy eccentric tension to maximize posterior chain thickness and athletic power.',
        stepByStep: [
          'Stand with feet hip-width apart, holding barbell with overhand grip just outside thighs.',
          'Unlock knees with a soft 15-degree bend and lock that knee angle in place throughout the rep.',
          'Push hips back as far as possible, hinging at the waist while keeping chest proud and spine neutral.',
          'Lower barbell closely down the front of shins until feeling a deep hamstring stretch (mid-shin).',
          'Drive hips forward and contract glutes and hamstrings to return to upright stance.'
        ],
        formTips: [
          'Bar must stay in light contact with legs throughout the entire movement.',
          'Think of pushing your hips back to touch an imaginary wall behind you.',
          'Do not bend knees further as you descend; this is a hinge, not a squat.'
        ],
        commonMistakes: [
          'Rounding the thoracic or lumbar spine to reach lower to the floor.',
          'Allowing bar to drift away from body, placing strain on lower back.'
        ],
        videoEmbedId: 'JCXUYuzwNrM',
        videoSearchQuery: 'stiff leg deadlift form guide hamstring',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal (Pure Hip Hinge)',
          tempo: '3-1-1-0'
        }
      },
      {
        id: 'seated-cable-row',
        name: 'Seated Cable Row',
        targetArea: 'Mid Back & Lats (Horizontal Pull)',
        primaryMuscles: ['Rhomboids', 'Middle Trapezius', 'Latissimus Dorsi'],
        secondaryMuscles: ['Posterior Deltoids', 'Biceps Brachii', 'Brachialis', 'Erector Spinae'],
        anatomyHighlightGroups: ['back', 'biceps'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Horizontal rowing movement that develops deep back density, shoulder health, and postural strength.',
        stepByStep: [
          'Sit upright on machine with feet on footplates, knees slightly bent.',
          'Grip V-bar handle with neutral grip, sit back with torso vertical and chest up.',
          'Initiate pull by retracting scapulae, then drive elbows back close to ribcage.',
          'Pull handle into lower abdomen / belly button and squeeze shoulder blades together for 1 second.',
          'Extend arms forward with control, allowing shoulder blades to stretch forward around ribcage.'
        ],
        formTips: [
          'Maintain an upright torso; resist swinging back and forth with momentum.',
          'Drive through elbows, pulling hands into lower abdomen.',
          'Let shoulder blades protract forward at the stretch to maximize lat length.'
        ],
        commonMistakes: [
          'Hyperextending lower back violently on the pull.',
          'Shrugging shoulders upward towards ears.'
        ],
        videoEmbedId: 'GZbfZ033f74',
        videoSearchQuery: 'seated cable row form tutorial bodybuilding',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal / Horizontal Adduction',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'pec-deck',
        name: 'Pec Deck',
        targetArea: 'Chest (Horizontal Adduction)',
        primaryMuscles: ['Pectoralis Major (Sternal & Clavicular heads)'],
        secondaryMuscles: ['Anterior Deltoids'],
        anatomyHighlightGroups: ['chest'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Machine chest fly offering a constant tension curve across the entire range of motion, providing a deep stretch and peak inner squeeze.',
        stepByStep: [
          'Adjust seat height so handles/pads align horizontally with mid-chest level.',
          'Sit with back and head pressed firmly into pad, feet planted on floor.',
          'Grip handles with elbows slightly bent and wrists neutral.',
          'Sweep arms forward in a wide hugging motion, bringing hands together in front of chest.',
          'Squeeze pecs hard together for 1 full second, then slowly return to deep stretch.'
        ],
        formTips: [
          'Maintain a soft, fixed bend at elbows; do not turn it into a press.',
          'Keep chest puffed out and shoulders back throughout the rep.',
          'Emphasize the 2-second negative stretch.'
        ],
        commonMistakes: [
          'Allowing shoulders to roll forward at full contraction.',
          'Setting seat too high or too low, stressing the shoulder capsule.'
        ],
        videoEmbedId: 'O-21Bfl5iAI',
        videoSearchQuery: 'pec deck machine fly proper form',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Transverse (Horizontal Adduction)',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'rear-delt-fly',
        name: 'Rear Delt Fly',
        targetArea: 'Upper Back & Rear Shoulders',
        primaryMuscles: ['Posterior Deltoid'],
        secondaryMuscles: ['Infraspinatus', 'Teres Minor', 'Rhomboids', 'Middle Trapezius'],
        anatomyHighlightGroups: ['shoulders', 'back'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '15' },
          { setNum: 2, targetReps: '12' },
          { setNum: 3, targetReps: '10' },
        ],
        description: 'Crucial exercise for shoulder joint balance, posture, and spherical 3D deltoid development.',
        stepByStep: [
          'Use reverse pec deck machine facing into pad (or dumbbells bent-over at 90°).',
          'Adjust seat so handles are at eye/shoulder level.',
          'Grip handles with neutral or pronated grip and maintain a subtle bend in elbows.',
          'Pull arms out and back in a wide arc, leading with back of wrists and elbows.',
          'Contract rear delts at peak for 1 second, then control back to starting point.'
        ],
        formTips: [
          'Focus on moving the back of your hands away from each other.',
          'Avoid pinching shoulder blades excessively together (which shifts focus to traps/rhomboids).',
          'Keep neck relaxed and neutral.'
        ],
        commonMistakes: [
          'Using too much weight and jerking torso backward.',
          'Shrugging traps and lifting shoulders up.'
        ],
        videoEmbedId: 'EA7u4Q_8408',
        videoSearchQuery: 'reverse pec deck rear delt fly form tutorial',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Transverse Horizontal Abduction',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'jm-press',
        name: 'JM Press',
        targetArea: 'Arms (Triceps Strength & Mass)',
        primaryMuscles: ['Triceps Brachii (All 3 heads, heavy lateral & medial activation)'],
        secondaryMuscles: ['Pectoralis Major', 'Anterior Deltoid'],
        anatomyHighlightGroups: ['triceps'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Made famous by powerlifter JM Blakley: a devastating hybrid between a close-grip bench press and a skull crusher for colossal tricep strength.',
        stepByStep: [
          'Lie on a flat bench under barbell or Smith machine bar.',
          'Take a shoulder-width grip with thumbs wrapped.',
          'Unrack bar directly over chest with arms extended.',
          'Lower bar toward your clavicle / upper chest area while letting elbows fold down and forward at ~45 degrees.',
          'When forearms touch biceps near the neck/throat area, drive forcefully up using pure triceps extension.'
        ],
        formTips: [
          'Keep wrists stacked rigid above elbows.',
          'Control the bar descent with precision; do not rush the eccentric.',
          'Smith machine provides great stability when learning this movement pattern.'
        ],
        commonMistakes: [
          'Turning it into a standard close grip bench press (elbows moving too far out).',
          'Allowing bar to hit neck; keep motion controlled.'
        ],
        videoEmbedId: 'u4YvG5L9hXo',
        videoSearchQuery: 'jm press tutorial powerlifting triceps form',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal Compound Elbow Extension',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'rope-pushdown',
        name: 'Rope Pushdown',
        targetArea: 'Arms (Triceps Lateral & Medial Head)',
        primaryMuscles: ['Triceps Brachii (Lateral & Medial heads)'],
        secondaryMuscles: ['Triceps Brachii (Long head)', 'Anconeus'],
        anatomyHighlightGroups: ['triceps'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Cable pushdown using a flexible rope attachment, allowing you to spread the handles apart at the bottom for maximum tricep shortening.',
        stepByStep: [
          'Attach rope to high cable pulley. Stand with a slight forward torso lean (~10 degrees).',
          'Grip rope knots with palms facing each other, elbows glued against your sides.',
          'Push hands straight downward until arms are completely extended.',
          'At the bottom, actively spread the rope ends apart and rotate wrists downward for peak contraction.',
          'Slowly allow elbows to flex back up to 90 degrees before next rep.'
        ],
        formTips: [
          'Elbows must stay pinned at your sides like a door hinge.',
          'Pause and hold the bottom contraction for a full 1-second count.',
          'Do not use shoulders to press down the weight.'
        ],
        commonMistakes: [
          'Elbows drifting forward and backward during the repetition.',
          'Flaring elbows out to the side.'
        ],
        videoEmbedId: 'vB5OHsJ3EME',
        videoSearchQuery: 'rope tricep pushdown correct form',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal (Elbow Extension with Spread)',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'hammer-curl',
        name: 'Hammer Curl',
        targetArea: 'Arms (Biceps Width & Forearms)',
        primaryMuscles: ['Brachialis', 'Brachioradialis'],
        secondaryMuscles: ['Biceps Brachii (Long head)'],
        anatomyHighlightGroups: ['biceps', 'forearms'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Neutral-grip dumbbell curls that target the deep brachialis muscle underneath the bicep, pushing the bicep peak higher and widening the upper arm.',
        stepByStep: [
          'Stand upright holding dumbbells at your sides with palms facing inward toward each other (neutral grip).',
          'Keep elbows tight to your flanks and shoulders pulled down and back.',
          'Curl weights upward while maintaining thumbs-up orientation.',
          'Stop when dumbbells reach near shoulder height and flex brachialis hard.',
          'Lower dumbbells smoothly along the same path under full control.'
        ],
        formTips: [
          'Do not supinate (rotate) wrists; keep thumbs pointing directly up throughout.',
          'Keep upper body still; avoid using hip swing or back extension.',
          'Can be performed alternating or both arms together.'
        ],
        commonMistakes: [
          'Swinging the torso to generate momentum.',
          'Allowing elbows to flare outward away from body.'
        ],
        videoEmbedId: 'zC3nLlEvin4',
        videoSearchQuery: 'dumbbell hammer curl form tutorial brachialis',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal Neutral Elbow Flexion',
          tempo: '2-0-1-0'
        }
      }
    ]
  },

  // DAY 4: THURSDAY - CARDIO
  {
    id: 'day-4',
    dayNumber: 4,
    dayName: 'Thursday',
    shortDay: 'Thu',
    title: 'Cardio',
    category: 'cardio',
    subtitle: 'Mid-Week Aerobic Flush & Stamina',
    focusAreas: ['Cardiovascular System', 'Active Recovery', 'Fat Metabolism'],
    estimatedDurationMin: 25,
    exercises: [
      {
        id: 'cycle-session-day-4',
        name: 'Stationary Cycling (Moderate Pace)',
        targetArea: 'Cardiovascular System & Aerobic Capacity',
        primaryMuscles: ['Quadriceps', 'Hamstrings', 'Gluteus Maximus', 'Calves'],
        secondaryMuscles: ['Heart & Circulatory System', 'Hip Flexors'],
        anatomyHighlightGroups: ['cardio', 'quadriceps', 'calves'],
        defaultRestSeconds: 0,
        sets: [
          { setNum: 1, targetDescription: 'Cycle, 20-25 min moderate pace (Zone 2 steady aerobic)', targetSeconds: 1350, isTimed: true }
        ],
        description: 'Thursday mid-week cardio session focused on active muscular flush, aerobic base maintenance, and steady caloric expenditure.',
        stepByStep: [
          'Mount bike, adjust toe straps or cleat shoes snugly.',
          'Spin gently for 3 minutes at light resistance to warm knees and hips.',
          'Settle into target pace: steady 80-90 RPM with heart rate in Zone 2.',
          'Maintain rhythmic nasal-diaphragmatic breathing.',
          'Cooldown spin for 2 minutes to bring heart rate back to baseline.'
        ],
        formTips: [
          'Keep pedal strokes smooth through the full 360-degree rotation.',
          'Check posture periodically: avoid hunching over handlebars.',
          'Stay hydrated with small, regular sips of water.'
        ],
        commonMistakes: [
          'Bouncing in the saddle (indicates resistance is too low or cadence too chaotic).',
          'Setting saddle too high, rocking hips from side to side.'
        ],
        videoEmbedId: 'r5cst1fB91s',
        videoSearchQuery: 'zone 2 cardio cycling guide endurance',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Continuous Circular Locomotion',
          tempo: '80-90 RPM Cadence'
        }
      }
    ]
  },

  // DAY 5: FRIDAY - LIFT C
  {
    id: 'day-5',
    dayNumber: 5,
    dayName: 'Friday',
    shortDay: 'Fri',
    title: 'Lift C',
    category: 'lift',
    subtitle: 'Quad/Hamstring Isolation, Biceps & Forearm Finisher',
    focusAreas: ['Quads', 'Hamstrings', 'Lats', 'Delts', 'Biceps', 'Forearms & Grip'],
    estimatedDurationMin: 65,
    exercises: [
      {
        id: 'leg-extension',
        name: 'Leg Extension',
        targetArea: 'Legs (Quadriceps Isolation)',
        primaryMuscles: ['Quadriceps (Rectus Femoris, Vastus Lateralis, Vastus Medialis, Vastus Intermedius)'],
        secondaryMuscles: ['None (Pure Knee Extension Isolation)'],
        anatomyHighlightGroups: ['quadriceps'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '15' },
          { setNum: 2, targetReps: '12' },
          { setNum: 3, targetReps: '10' },
        ],
        description: 'Single-joint knee extension machine that isolates the four heads of the quadriceps under constant peak tension.',
        stepByStep: [
          'Adjust back pad so knees line up precisely with the machine pivot axis.',
          'Position ankle pad resting comfortably against the lower shins above feet.',
          'Hold side handles tightly to anchor hips down onto seat pad.',
          'Extend legs upward until knees are straight, squeezing quads violently for 1 full second.',
          'Lower weight smoothly over a controlled 2-3 second descent.'
        ],
        formTips: [
          'Hold the top contraction for 1 second to maximize rectus femoris recruitment.',
          'Do not lift hips or butt off the seat during the movement.',
          'Point toes slightly up and neutral.'
        ],
        commonMistakes: [
          'Kicking weight up fast using explosive momentum.',
          'Setting the ankle pad too high on shin or too low on toes.'
        ],
        videoEmbedId: 'YyvSfVjQeL0',
        videoSearchQuery: 'leg extension proper form quadriceps isolation',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal Knee Extension',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'lying-hamstring-curl',
        name: 'Lying Hamstring Curl',
        targetArea: 'Legs (Hamstring Knee Flexion)',
        primaryMuscles: ['Hamstrings (Biceps Femoris short & long heads, Semitendinosus, Semimembranosus)'],
        secondaryMuscles: ['Gastrocnemius (Calves)', 'Gracilis', 'Sartorius'],
        anatomyHighlightGroups: ['hamstrings', 'calves'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '15' },
          { setNum: 2, targetReps: '12' },
          { setNum: 3, targetReps: '10' },
        ],
        description: 'Isolates the knee-flexion function of the hamstrings, which cannot be trained with deadlifts alone.',
        stepByStep: [
          'Lie prone on machine with knees just off the edge of bench, pad resting against Achilles/lower calves.',
          'Grip handles firmly and actively drive pelvis downward into the bench pad.',
          'Curl heels upward toward glutes in a smooth, continuous arc.',
          'Squeeze hamstrings tightly at peak contraction near glutes.',
          'Resist the load as you lower the weight back down slowly over 3 seconds.'
        ],
        formTips: [
          'Keep hips pinned to pad; avoid arching lower back to curl weight.',
          'Point toes (plantarflexion) slightly if calves cramp, or keep neutral.',
          'Control the eccentric; do not let weight stack crash.'
        ],
        commonMistakes: [
          'Lifting hips off the bench at top of the curl.',
          'Swinging weights using lower back hyperextension.'
        ],
        videoEmbedId: '1Tq3QdYUuHs',
        videoSearchQuery: 'lying leg curl proper form hamstring',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal Knee Flexion',
          tempo: '3-1-1-0'
        }
      },
      {
        id: 'lat-pulldown-c',
        name: 'Lat Pulldown',
        targetArea: 'Upper Back & Lats',
        primaryMuscles: ['Latissimus Dorsi', 'Teres Major'],
        secondaryMuscles: ['Biceps Brachii', 'Brachialis', 'Rhomboids', 'Lower Trapezius'],
        anatomyHighlightGroups: ['back', 'biceps'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Second vertical pull session of the week to accumulate high-quality volume for wide, dense lats.',
        stepByStep: [
          'Secure thighs under pads, grip bar with wide pronated grip.',
          'Retract shoulder blades down, puff chest up toward the ceiling.',
          'Pull elbows directly down into back pockets until bar grazes upper chest.',
          'Pause for a beat, squeeze lats, then let bar elevate back to full overhead stretch.'
        ],
        formTips: [
          'Focus on driving elbows straight down rather than pulling with forearms.',
          'Keep torso stable with only minimal 10-15° lean.',
          'Allow scapulae to elevate fully at the top for maximum stretch.'
        ],
        commonMistakes: [
          'Swinging whole body back like a seated row.',
          'Yanking the bar with wrist flexors.'
        ],
        videoEmbedId: 'CAwf7n6Luuc',
        videoSearchQuery: 'lat pulldown technique bodybuilding',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Frontal Plane Vertical Pull',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'shoulder-press-or-lateral-raise',
        name: 'Shoulder Press or Lateral Raise',
        targetArea: 'Shoulders (Anterior or Lateral Deltoid)',
        alternatives: ['Overhead Shoulder Press', 'Dumbbell / Cable Lateral Raise'],
        primaryMuscles: ['Lateral Deltoid (if Lateral Raise) OR Anterior Deltoid (if Press)'],
        secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Supraspinatus'],
        anatomyHighlightGroups: ['shoulders'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Choose between Overhead Shoulder Press (for vertical pressing strength) OR Lateral Raise (for pure lateral delt width and capped shoulders).',
        stepByStep: [
          'Option A (Shoulder Press): Sit upright, press dumbbells overhead in natural arc, lower to ear level.',
          'Option B (Lateral Raise): Stand with slight hinge, raise arms in scapular plane with elbows leading until parallel to floor.',
          'Select the variation based on your weekly shoulder recovery and whether you desire more mass or width.'
        ],
        formTips: [
          'If pressing: brace core and avoid excessive lumbar arching.',
          'If raising: lead with elbows and keep 1-second pause at top of rep.'
        ],
        commonMistakes: [
          'Using excessive weight and compromising strict form.',
          'Shrugging traps instead of isolating the deltoid.'
        ],
        videoEmbedId: '3VcKaXpzqRo',
        videoSearchQuery: 'lateral raise vs shoulder press form',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Frontal / Scapular Plane',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'preacher-curl',
        name: 'Preacher Curl',
        targetArea: 'Arms (Biceps Short Head Isolation)',
        primaryMuscles: ['Biceps Brachii (Short/Inner Head)'],
        secondaryMuscles: ['Brachialis', 'Brachioradialis'],
        anatomyHighlightGroups: ['biceps'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Arms anchored to the angled preacher bench pad, preventing all shoulder cheating and isolating the inner bicep head.',
        stepByStep: [
          'Adjust seat so armpits sit comfortably against the top edge of the angled pad.',
          'Rest triceps flat against pad, holding EZ bar or dumbbells with supinated grip.',
          'Curl bar upward toward chin while keeping upper arms glued to the pad.',
          'Squeeze biceps hard at top peak, then lower smoothly under full control.',
          'Stop just a few degrees shy of complete elbow lockout at bottom to protect distal tendon.'
        ],
        formTips: [
          'Do not lean back or lift elbows off the pad.',
          'Never drop weight abruptly at the bottom stretch (protects bicep tendon).',
          'Squeeze peak contraction for a solid 1-second count.'
        ],
        commonMistakes: [
          'Hyper-extending elbows forcefully at bottom.',
          'Lifting torso and elbows off the support pad.'
        ],
        videoEmbedId: 'fIWP-FRFNU0',
        videoSearchQuery: 'preacher curl proper form bicep',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal Supported Elbow Flexion',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'incline-dumbbell-curl',
        name: 'Incline Dumbbell Curl',
        targetArea: 'Arms (Biceps Long Head & Peak)',
        primaryMuscles: ['Biceps Brachii (Long Head)'],
        secondaryMuscles: ['Brachialis', 'Anterior Deltoid'],
        anatomyHighlightGroups: ['biceps'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '12' },
          { setNum: 2, targetReps: '10' },
          { setNum: 3, targetReps: '8' },
        ],
        description: 'Seated on an incline bench with arms hanging behind the torso, putting the bicep long head into an extreme stretch for maximum growth.',
        stepByStep: [
          'Set adjustable bench to 45–60 degrees.',
          'Sit back with head and back against bench, arms hanging straight down holding dumbbells.',
          'Keep upper arms stationary and curl dumbbells up while supinating wrists (turning palms outward).',
          'Squeeze biceps peak at top, avoiding letting elbows drift forward.',
          'Lower weights slowly back into the full hanging stretch.'
        ],
        formTips: [
          'Allow arms to hang completely perpendicular to the floor at the bottom.',
          'Rotate palms toward ceiling as you curl to maximize bicep peak contraction.',
          'Keep shoulders pinned back into the bench.'
        ],
        commonMistakes: [
          'Swinging elbows forward to cheat the weight up.',
          'Setting bench too flat (causes excessive shoulder hyperextension).'
        ],
        videoEmbedId: 'soxrZlIl35U',
        videoSearchQuery: 'incline dumbbell curl long head bicep form',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal Supinated Elbow Flexion',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'f-reverse-wrist-curls',
        name: '(F) Reverse Wrist Curls',
        isForearmGrip: true,
        targetArea: 'Forearms (Extensor Compartment)',
        primaryMuscles: ['Forearm Extensors (Extensor Carpi Radialis Longus & Brevis, Extensor Digitorum)'],
        secondaryMuscles: ['Brachioradialis', 'Wrist Stabilizers'],
        anatomyHighlightGroups: ['forearms'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '15' },
          { setNum: 2, targetReps: '12' },
          { setNum: 3, targetReps: '10' },
        ],
        description: 'Overhand wrist curls to develop the dorsal top-side forearm extensors, balancing wrist flexors and preventing elbow tendonitis.',
        stepByStep: [
          'Rest forearms flat across a bench or across your thighs with palms facing down (pronated).',
          'Hold a light barbell or dumbbells with wrists extending over the edge.',
          'Lower wrists downward into a full extension stretch.',
          'Lift knuckles upward toward ceiling by curling wrists back into peak extension.',
          'Hold top squeeze for 1 second, then lower under steady control.'
        ],
        formTips: [
          'Use moderate/light weight with strict control; extensors are smaller muscles.',
          'Keep forearms pinned firmly to bench; do not let elbows rise.',
          'Feel the burn in the top of your forearm.'
        ],
        commonMistakes: [
          'Using too much weight and jerkily rocking forearms.',
          'Skipping full range of motion at bottom stretch.'
        ],
        videoEmbedId: 'F4eBq_Ea1Fw',
        videoSearchQuery: 'reverse wrist curls forearm extensor proper form',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Sagittal Wrist Extension',
          tempo: '2-1-1-0'
        }
      },
      {
        id: 'f-pronation-supination-curls',
        name: '(F) Pronation/Supination Curls',
        isForearmGrip: true,
        targetArea: 'Forearms (Rotators & Arm Wrestling Power)',
        primaryMuscles: ['Pronator Teres', 'Pronator Quadratus', 'Supinator', 'Biceps Brachii'],
        secondaryMuscles: ['Brachioradialis', 'Wrist Flexors & Extensors'],
        anatomyHighlightGroups: ['forearms'],
        defaultRestSeconds: 60,
        sets: [
          { setNum: 1, targetReps: '15 each direction' },
          { setNum: 2, targetReps: '12 each direction' },
          { setNum: 3, targetReps: '10 each direction' },
        ],
        description: 'Forearm rotation using an unevenly weighted dumbbell (or sledgehammer) to isolate pronator and supinator rotational strength for bulletproof wrists and arm wrestling dominance.',
        stepByStep: [
          'Take a dumbbell loaded on only one side (or choke up on a dumbbell so the weight is off-center).',
          'Rest forearm flat on a bench with wrist extending past the edge, thumb pointing upward.',
          'Slowly rotate forearm outward so palm faces up (supination) under control.',
          'Rotate smoothly back through neutral to rotate inward so palm faces down (pronation).',
          'Complete prescribed reps for each direction, then switch arms. (The animation shows the side-lying version: same rotation, same muscles.)'
        ],
        formTips: [
          'Keep elbow and upper arm completely stationary.',
          'Move at a deliberate, controlled tempo (avoid letting weight whip or snap wrist).',
          'Start with light resistance until forearm tendons adapt.'
        ],
        commonMistakes: [
          'Using shoulder rotation instead of pure forearm radius/ulna rotation.',
          'Letting the off-balance weight jerk the wrist into hyperextension.'
        ],
        videoEmbedId: 'v8T9sR6kI7Q',
        videoSearchQuery: 'pronation supination forearm exercise arm wrestling',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Transverse Forearm Rotation (Pronation/Supination)',
          tempo: '2-1-2-1 Controlled Rotation'
        }
      },
      {
        id: 'f-cable-hook-position-hold',
        name: '(F) Cable Hook-Position Hold',
        isForearmGrip: true,
        targetArea: 'Forearms & Wrist Flexor Hook Integrity',
        primaryMuscles: ['Forearm Flexors (Flexor Carpi Radialis & Ulnaris)', 'Pronator Teres'],
        secondaryMuscles: ['Brachialis', 'Biceps Brachii', 'Finger Flexors'],
        anatomyHighlightGroups: ['forearms'],
        defaultRestSeconds: 90,
        sets: [
          { setNum: 1, targetDescription: 'Hold to near-failure', isTimed: true, targetSeconds: 30 },
          { setNum: 2, targetDescription: 'Hold to near-failure', isTimed: true, targetSeconds: 30 },
          { setNum: 3, targetDescription: 'Hold to near-failure', isTimed: true, targetSeconds: 30 },
        ],
        description: 'Arm-wrestler style static hold: locks the wrist into an aggressive flexed "hook" position at 90-degree elbow angle against heavy cable resistance until near-failure.',
        stepByStep: [
          'Set cable pulley at mid-chest or elbow height with a thick strap or single handle.',
          'Face sideways or slightly toward cable stack; grip handle with wrist curled inward into a deep "hook" (wrist flexion).',
          'Lock elbow at approximately 90 degrees tight against your side or pad.',
          'Step out to place heavy tension on the cable, maintaining the curled wrist position.',
          'Start timer and hold this isometric hook battle position until your wrist is about to slip open (near-failure).'
        ],
        formTips: [
          'Never let the cable pull your wrist back into extension; maintain the hook curvature.',
          'Engage your lats and core to lock the upper arm stationary.',
          'Breathe rhythmically while maintaining maximal static isometric tension.'
        ],
        commonMistakes: [
          'Allowing the wrist to flatten or open up backwards (defeats the hook hold).',
          'Pulling with the shoulder instead of holding isometric forearm tension.'
        ],
        videoEmbedId: 'b7Vp8Y2F6-8',
        videoSearchQuery: 'arm wrestling hook training cable hold technique',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Isometric Hook Flexion & Adduction',
          tempo: 'Static Hold to Near Failure'
        }
      }
    ]
  },

  // DAY 6: SATURDAY - CARDIO
  {
    id: 'day-6',
    dayNumber: 6,
    dayName: 'Saturday',
    shortDay: 'Sat',
    title: 'Cardio',
    category: 'cardio',
    subtitle: 'Weekend Aerobic Stamina & Fat Oxidation',
    focusAreas: ['Cardiovascular System', 'Active Recovery', 'Aerobic Base'],
    estimatedDurationMin: 25,
    exercises: [
      {
        id: 'cycle-session-day-6',
        name: 'Stationary Cycling (Weekend Moderate Pace)',
        targetArea: 'Cardiovascular Conditioning',
        primaryMuscles: ['Quadriceps', 'Hamstrings', 'Gluteus Maximus', 'Calves'],
        secondaryMuscles: ['Heart & Cardiovascular Endurance', 'Metabolic Efficiency'],
        anatomyHighlightGroups: ['cardio', 'quadriceps', 'calves'],
        defaultRestSeconds: 0,
        sets: [
          { setNum: 1, targetDescription: 'Cycle, 20-25 min moderate pace (Zone 2)', targetSeconds: 1350, isTimed: true }
        ],
        description: 'Saturday cardio session to cap off the week of lifting, burn fat, support mitochondrial function, and prepare the body for Sunday deep rest.',
        stepByStep: [
          'Set up bike with comfortable seat and handlebar positioning.',
          '3-minute gentle warm up spinning at easy 70 RPM.',
          'Maintain steady, enjoyable moderate pace for 20 minutes (80-90 RPM).',
          'Focus on smooth leg turnover and controlled nasal/mouth breathing.',
          '2-minute slow deceleration spin.'
        ],
        formTips: [
          'Keep your upper body relaxed and light on hands.',
          'Maintain a stable cadence without surging or lagging.',
          'Enjoy music or a podcast while keeping exertion strictly in Zone 2.'
        ],
        commonMistakes: [
          'Overexerting into Zone 4/5 sprinting (can hinder recovery for next week Lift A).',
          'Poor saddle posture.'
        ],
        videoEmbedId: 'r5cst1fB91s',
        videoSearchQuery: 'weekend indoor cycling zone 2 aerobic conditioning',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Continuous Circular Locomotion',
          tempo: '80-90 RPM Steady State'
        }
      }
    ]
  },

  // DAY 7: SUNDAY - REST
  {
    id: 'day-7',
    dayNumber: 7,
    dayName: 'Sunday',
    shortDay: 'Sun',
    title: 'Rest',
    category: 'rest',
    subtitle: 'Full Systemic CNS & Muscular Recovery',
    focusAreas: ['CNS Regeneration', 'Muscle Protein Synthesis', 'Hydration & Nutrition'],
    estimatedDurationMin: 0,
    exercises: [
      {
        id: 'full-rest-protocol',
        name: 'Full Rest & Recovery Protocol',
        targetArea: 'Systemic Central Nervous System & Soft Tissue Restoration',
        primaryMuscles: ['Full Body Muscle Tissue Repair', 'Joint Capsules', 'Tendon & Ligament Rebuilding'],
        secondaryMuscles: ['Central Nervous System (CNS)', 'Immune System'],
        anatomyHighlightGroups: ['chest', 'back', 'quadriceps', 'hamstrings', 'shoulders', 'biceps', 'triceps', 'abs'],
        defaultRestSeconds: 0,
        sets: [
          { setNum: 1, targetDescription: 'Full rest, no lifting or cardio (Complete recovery day)' }
        ],
        description: 'Non-negotiable full recovery day. Muscle growth and strength adaptations occur during rest when protein synthesis and glycogen restoration are optimized.',
        stepByStep: [
          'No lifting or strenuous cardio today: let connective tissues decompress.',
          'Prioritize sleep: aim for 8–9 hours of deep, uninterrupted rest.',
          'Nutritional replenishment: hit your target protein intake (1.6–2.2g per kg bodyweight) and complex carbs.',
          'Hydration: drink 3–4 liters of water with adequate electrolytes (sodium, potassium, magnesium).',
          'Optional: 15–20 minutes of gentle leisure walking or light foam rolling if feeling stiff.'
        ],
        formTips: [
          'Stay mentally off workout stress—let motivation rebuild for Monday Lift A.',
          'Eat nutrient-dense whole foods to fuel muscle protein synthesis.',
          'Sleep in a cool, dark room.'
        ],
        commonMistakes: [
          'Sneaking in "extra" workouts or intense yardwork that drains recovery reserves.',
          'Drastically cutting protein intake because you did not lift.'
        ],
        videoEmbedId: 'g4YmIug3B9U',
        videoSearchQuery: 'muscle recovery rest day science hypertrophy',
        visualDemonstration: {
          type: 'illustration',
          movementPlane: 'Static Rest / Zero Axial Load',
          tempo: 'Deep Rest & Sleep'
        }
      }
    ]
  }
];

type Meta = { cat: Category; eq: [string, EquipKind]; p: MuscleGroup[]; s?: MuscleGroup[]; hide?: boolean };
const BIKE: Meta = { cat: 'Cardio', eq: ['Exercise bike', 'bike'], p: ['cardio', 'quadriceps'], s: ['glutes', 'hamstrings', 'calves'] };

// Primary (bright) and secondary (dim) muscles for every plan exercise
const META: Record<string, Meta> = {
  'leg-press': { cat: 'Legs', eq: ['Leg press machine', 'machine'], p: ['quadriceps', 'glutes'], s: ['hamstrings', 'adductors'] },
  'lat-pulldown-a': { cat: 'Back', eq: ['Lat pulldown machine', 'pulldown'], p: ['lats'], s: ['upperback', 'biceps', 'reardelts', 'forearms'] },
  'smith-machine-bench-press': { cat: 'Chest', eq: ['Smith machine', 'barbell'], p: ['chest'], s: ['triceps', 'shoulders'] },
  'shoulder-press-a': { cat: 'Shoulders', eq: ['Dumbbells + bench', 'dumbbell'], p: ['shoulders'], s: ['triceps', 'traps'] },
  'lateral-raise-a': { cat: 'Shoulders', eq: ['Dumbbells', 'dumbbell'], p: ['shoulders'], s: ['traps'] },
  'cable-crunch': { cat: 'Core', eq: ['Cable + rope', 'cable'], p: ['abs'], s: ['obliques'] },
  'overhead-tricep-extension': { cat: 'Triceps', eq: ['Cable + rope', 'cable'], p: ['triceps'] },
  'reverse-curl': { cat: 'Forearms', eq: ['Barbell / EZ bar', 'barbell'], p: ['forearms'], s: ['biceps'] },
  'f-wrist-curls': { cat: 'Forearms', eq: ['Dumbbells + bench', 'dumbbell'], p: ['forearms'] },
  'f-farmers-carries': { cat: 'Forearms', eq: ['Heavy dumbbells', 'dumbbell'], p: ['forearms', 'traps'], s: ['abs', 'obliques', 'upperback', 'quadriceps', 'calves'] },
  'f-plate-pinch-hold': { cat: 'Forearms', eq: ['Weight plates', 'plate'], p: ['forearms'] },
  'cycle-session-day-2': BIKE,
  'sldl': { cat: 'Legs', eq: ['Barbell', 'barbell'], p: ['hamstrings', 'glutes'], s: ['lowerback', 'forearms', 'traps'] },
  'seated-cable-row': { cat: 'Back', eq: ['Cable + V-bar', 'cable'], p: ['lats', 'upperback'], s: ['biceps', 'reardelts', 'traps', 'forearms'] },
  'pec-deck': { cat: 'Chest', eq: ['Pec deck machine', 'machine'], p: ['chest'], s: ['shoulders'] },
  'rear-delt-fly': { cat: 'Shoulders', eq: ['Reverse pec deck', 'machine'], p: ['reardelts'], s: ['upperback', 'traps'] },
  'jm-press': { cat: 'Triceps', eq: ['Barbell + bench', 'barbell'], p: ['triceps'], s: ['chest', 'shoulders'] },
  'rope-pushdown': { cat: 'Triceps', eq: ['Cable + rope', 'cable'], p: ['triceps'] },
  'hammer-curl': { cat: 'Biceps', eq: ['Dumbbells', 'dumbbell'], p: ['biceps', 'forearms'] },
  'cycle-session-day-4': { ...BIKE, hide: true },
  'leg-extension': { cat: 'Legs', eq: ['Leg extension machine', 'machine'], p: ['quadriceps'] },
  'lying-hamstring-curl': { cat: 'Legs', eq: ['Lying leg curl machine', 'machine'], p: ['hamstrings'], s: ['calves'] },
  'lat-pulldown-c': { cat: 'Back', eq: ['Lat pulldown machine', 'pulldown'], p: ['lats'], s: ['upperback', 'biceps', 'reardelts', 'forearms'] },
  'shoulder-press-or-lateral-raise': { cat: 'Shoulders', eq: ['Dumbbells', 'dumbbell'], p: ['shoulders'], s: ['triceps', 'traps'], hide: true },
  'preacher-curl': { cat: 'Biceps', eq: ['Preacher curl machine', 'machine'], p: ['biceps'], s: ['forearms'] },
  'incline-dumbbell-curl': { cat: 'Biceps', eq: ['Dumbbells + incline bench', 'dumbbell'], p: ['biceps'], s: ['forearms'] },
  'f-reverse-wrist-curls': { cat: 'Forearms', eq: ['Dumbbells + bench', 'dumbbell'], p: ['forearms'] },
  'f-pronation-supination-curls': { cat: 'Forearms', eq: ['Dumbbell', 'dumbbell'], p: ['forearms'], s: ['biceps'] },
  'f-cable-hook-position-hold': { cat: 'Forearms', eq: ['Cable + handle', 'cable'], p: ['forearms'], s: ['biceps'] },
  'cycle-session-day-6': { ...BIKE, hide: true },
  'full-rest-protocol': { cat: 'Cardio', eq: ['None', 'bodyweight'], p: [], hide: true },
};

export const WORKOUT_DAYS: DayWorkout[] = RAW_WORKOUT_DAYS.map((day) => ({
  ...day,
  exercises: day.exercises.map((ex) => {
    const m = META[ex.id];
    return {
      ...ex,
      category: m.cat,
      equipment: { label: m.eq[0], kind: m.eq[1] },
      anatomyHighlightGroups: m.p,
      secondaryGroups: m.s ?? [],
      hideInLibrary: m.hide,
      photos: getExercisePhotos(ex.id),
    };
  }),
}));

