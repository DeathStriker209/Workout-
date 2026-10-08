#!/usr/bin/env python3
"""Copies the animated GIF for each exercise into public/exercise-gifs/<exercise-id>.gif

GIFs come from https://github.com/omercotkd/exercises-gifs (MIT licence).
Every GIF below was checked by eye, so the list is explicit instead of a name search.

Usage (from the project folder):  python3 scripts/install_gifs.py [path-to-exercises-gifs-repo]
"""
import os, shutil, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else '/workspaces/exercises-gifs'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'exercise-gifs')
os.makedirs(OUT, exist_ok=True)

# our exercise id -> GIF id in the exercises-gifs repo
GIFS = {
    # weekly plan
    'leg-press': '0739', 'lat-pulldown-a': '0579', 'lat-pulldown-c': '0579', 'smith-machine-bench-press': '0748',
    'shoulder-press-a': '0405', 'shoulder-press-or-lateral-raise': '0405', 'lateral-raise-a': '0334',
    'cable-crunch': '0175', 'overhead-tricep-extension': '0194', 'reverse-curl': '0080', 'f-wrist-curls': '0364',
    'f-farmers-carries': '2133', 'sldl': '0116', 'seated-cable-row': '0861', 'pec-deck': '0596',
    'rear-delt-fly': '0602', 'jm-press': '0052', 'rope-pushdown': '0200', 'hammer-curl': '0313',
    'leg-extension': '0585', 'lying-hamstring-curl': '0586', 'preacher-curl': '0592', 'incline-dumbbell-curl': '0318',
    'f-reverse-wrist-curls': '0385', 'f-pronation-supination-curls': '0347',
    # seated upright bike (the old one showed someone standing on the pedals)
    'cycle-session-day-2': '0798', 'cycle-session-day-4': '0798', 'cycle-session-day-6': '0798',
    # biceps
    'barbell-curl': '0031', 'ez-bar-curl': '0447', 'dumbbell-curl': '0294', 'cable-curl': '0868',
    'concentration-curl': '0297', 'spider-curl': '0454', 'cable-rope-hammer-curl': '0165', 'drag-curl': '0038',
    'cross-body-hammer-curl': '0298', 'cable-overhead-curl': '1636',
    # triceps
    'close-grip-bench-press': '0030', 'skull-crusher': '0060', 'straight-bar-pushdown': '0201',
    'reverse-grip-pushdown': '0207', 'dumbbell-kickback': '0333', 'dumbbell-overhead-extension': '0430',
    'triceps-dips': '0814', 'bench-dips': '0129', 'diamond-push-up': '0283',
    # chest
    'barbell-bench-press': '0025', 'incline-barbell-bench-press': '0047', 'dumbbell-bench-press': '0289',
    'incline-dumbbell-press': '0314', 'decline-bench-press': '0033', 'dumbbell-fly': '0308', 'cable-crossover': '0227',
    'low-to-high-cable-fly': '0179', 'machine-chest-press': '0577', 'push-up': '0662', 'chest-dips': '0251',
    # back
    'pull-up': '0652', 'chin-up': '1326', 'barbell-row': '0027', 'dumbbell-row': '0293', 't-bar-row': '0606',
    'deadlift': '0032', 'straight-arm-pulldown': '0238', 'machine-row': '1350', 'close-grip-pulldown': '0818',
    'back-extension': '0489', 'barbell-shrug': '0095', 'dumbbell-shrug': '0406', 'inverted-row': '0499',
    # shoulders
    'arnold-press': '2137', 'overhead-press': '1457', 'machine-shoulder-press': '0869', 'dumbbell-front-raise': '0310',
    'cable-lateral-raise': '0192', 'upright-row': '0120', 'face-pull': '0203', 'reverse-cable-fly': '0225',
    'incline-reverse-fly': '0383',
    # legs
    'barbell-back-squat': '0043', 'front-squat': '0042', 'goblet-squat': '1760', 'hack-squat': '0743',
    'smith-squat': '0770', 'romanian-deadlift': '0085', 'bulgarian-split-squat': '0410', 'dumbbell-lunge': '0336',
    'walking-lunge': '1460', 'glute-bridge': '1409', 'seated-leg-curl': '0599', 'standing-calf-raise': '0605',
    'seated-calf-raise': '0594', 'hip-adduction': '0598', 'hip-abduction': '0597', 'step-up': '0431',
    'good-morning': '0044',
    # core
    'plank': '2135', 'hanging-leg-raise': '0472', 'hanging-knee-raise': '1764', 'russian-twist': '0687',
    'ab-wheel-rollout': '0857', 'bicycle-crunch': '0003', 'crunch': '0274', 'lying-leg-raise': '0620',
    'side-plank': '0705', 'dead-bug': '0276', 'reverse-crunch': '0872', 'machine-crunch': '1452',
    # forearms
    'wrist-roller': '0859', 'behind-back-wrist-curl': '0104', 'finger-curls': '0455',
    # cardio
    'incline-treadmill-walk': '3666', 'treadmill-run': '0684', 'elliptical': '2141', 'stair-climber': '2311',
    'jump-rope': '2612', 'burpee': '1160', 'mountain-climber': '0630', 'ski-erg': '2142', 'jumping-jacks': '3223',
}

done, missing = 0, []
for ex_id, gif in GIFS.items():
    src = os.path.join(SRC, 'assets', gif + '.gif')
    if os.path.exists(src):
        shutil.copy(src, os.path.join(OUT, ex_id + '.gif'))
        done += 1
    else:
        missing.append(f'{ex_id} ({gif})')
print(f"{done} GIFs installed, {len(missing)} missing: {', '.join(missing) or 'none'}")
print("Now run: python3 scripts/make_thumbs.py  (makes the small list pictures)")
