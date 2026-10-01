#!/usr/bin/env python3
"""Copies the right animated GIF for each exercise into public/exercise-gifs/<exercise-id>.gif
Usage (from the project folder):  python3 scripts/install_gifs.py [path-to-exercises-gifs-repo]
"""
import csv, os, shutil, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else '/workspaces/exercises-gifs'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'exercise-gifs')
os.makedirs(OUT, exist_ok=True)
rows = list(csv.DictReader(open(os.path.join(SRC, 'exercises.csv'), encoding='utf-8')))

# our exercise id -> ordered list of (name words, equipment text). Words starting with '-' are excluded.
PICK = {
  'cable-crunch': [(['kneeling', 'crunch'], 'cable'), (['crunch', '-side', '-reverse', '-seated'], 'cable')],
  'cycle-session-day-2': [(['bike'], 'stationary'), (['stationary', 'bike'], '')],
  'cycle-session-day-4': [(['bike'], 'stationary'), (['stationary', 'bike'], '')],
  'cycle-session-day-6': [(['bike'], 'stationary'), (['stationary', 'bike'], '')],
  'hammer-curl': [(['hammer', 'curl'], 'dumbbell')],
  'incline-dumbbell-curl': [(['incline', 'curl'], 'dumbbell')],
  'jm-press': [(['jm', 'press'], 'barbell'), (['jm', 'press'], '')],
  'lat-pulldown-a': [(['pulldown', '-one', '-reverse'], 'lever'), (['pulldown'], 'lever')],
  'lat-pulldown-c': [(['pulldown', '-one', '-reverse'], 'lever'), (['pulldown'], 'lever')],
  'lateral-raise-a': [(['lateral', 'raise', '-seated', '-incline', '-one'], 'dumbbell'), (['lateral', 'raise'], 'dumbbell')],
  'leg-extension': [(['leg', 'extension'], 'lever')],
  'leg-press': [(['leg', 'press', '-single', '-one'], 'sled'), (['leg', 'press'], 'lever')],
  'lying-hamstring-curl': [(['lying', 'leg', 'curl'], 'lever')],
  'overhead-tricep-extension': [(['overhead', 'triceps'], 'cable'), (['overhead', 'triceps'], 'dumbbell'), (['overhead', 'triceps'], 'barbell')],
  'pec-deck': [(['seated', 'fly', '-reverse'], 'lever')],
  'preacher-curl': [(['preacher', 'curl'], 'lever'), (['preacher', 'curl'], '')],
  'rear-delt-fly': [(['seated', 'reverse', 'fly'], 'lever'), (['rear', 'delt'], 'cable')],
  'reverse-curl': [(['reverse', 'curl', '-wrist'], 'barbell'), (['reverse', 'curl', '-wrist'], '')],
  'rope-pushdown': [(['pushdown', 'rope'], 'cable'), (['pushdown', '-reverse', '-incline', '-straight'], 'cable')],
  'seated-cable-row': [(['seated', 'row', '-one', '-single'], 'cable')],
  'shoulder-press-a': [(['seated', 'shoulder', 'press', '-arnold', '-one'], 'dumbbell'), (['shoulder', 'press', '-arnold', '-one'], 'dumbbell')],
  'shoulder-press-or-lateral-raise': [(['seated', 'shoulder', 'press', '-arnold', '-one'], 'dumbbell'), (['shoulder', 'press', '-arnold', '-one'], 'dumbbell')],
  'sldl': [(['stiff', 'deadlift'], 'barbell'), (['straight', 'leg', 'deadlift'], 'barbell'), (['stiff', 'leg', 'deadlift'], 'dumbbell')],
  'smith-machine-bench-press': [(['smith', 'bench', 'press', '-incline', '-decline', '-reverse', '-close'], 'smith')],
  'f-wrist-curls': [(['wrist', 'curl', '-reverse'], 'dumbbell'), (['wrist', 'curl', '-reverse'], 'barbell')],
  'f-reverse-wrist-curls': [(['reverse', 'wrist', 'curl'], 'dumbbell'), (['reverse', 'wrist', 'curl'], 'barbell')],
  'f-pronation-supination-curls': [(['pronation'], 'dumbbell')],
  'f-farmers-carries': [(['farmers', 'walk'], 'dumbbell'), (['farmers', 'walk'], '')],
}

def find(words, eq):
    inc = [w for w in words if not w.startswith('-')]
    exc = [w[1:] for w in words if w.startswith('-')]
    hits = [r for r in rows if all(w in r['name'].lower() for w in inc) and not any(w in r['name'].lower() for w in exc)
            and eq in r['equipment'].lower()]
    hits.sort(key=lambda r: len(r['name']))
    return hits[0] if hits else None

done, missing = 0, []
for ex_id, options in PICK.items():
    hit = next((h for h in (find(w, e) for w, e in options) if h), None)
    src = os.path.join(SRC, 'assets', hit['id'] + '.gif') if hit else None
    if hit and os.path.exists(src):
        shutil.copy(src, os.path.join(OUT, ex_id + '.gif'))
        print(f"OK   {ex_id:34s} <- {hit['id']} {hit['name']} ({hit['equipment']})")
        done += 1
    else:
        print(f"MISS {ex_id}")
        missing.append(ex_id)
print(f"\n{done} GIFs installed, {len(missing)} missing (those keep the photos): {', '.join(missing) or 'none'}")
