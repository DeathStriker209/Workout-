#!/usr/bin/env python3
"""Makes small still thumbnails (public/exercise-thumbs/<id>.webp) from the exercise GIFs.
Lists show these instead of dozens of moving GIFs, which keeps scrolling smooth on older phones.
Run after install_gifs.py:  python3 scripts/make_thumbs.py   (needs Pillow: pip install pillow)
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
GIFS, OUT = os.path.join(ROOT, 'exercise-gifs'), os.path.join(ROOT, 'exercise-thumbs')
os.makedirs(OUT, exist_ok=True)
n = 0
for f in sorted(os.listdir(GIFS)):
    if not f.endswith('.gif'):
        continue
    im = Image.open(os.path.join(GIFS, f))
    im.seek(getattr(im, 'n_frames', 1) // 2)  # middle frame: usually mid-rep, the clearest pose
    frame = im.convert('RGB')
    frame.thumbnail((160, 160), Image.LANCZOS)
    frame.save(os.path.join(OUT, f[:-4] + '.webp'), quality=82, method=6)
    n += 1
print(f'{n} thumbnails written to public/exercise-thumbs')
