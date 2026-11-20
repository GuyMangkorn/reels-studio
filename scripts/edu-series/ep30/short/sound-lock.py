"""Lock the EP30 cue-sheet sounds for the episode (store.py use). Needs src/videos/edu-ep30/ to exist (Editor creates it).
Run from the repo root: python3 -I scripts/edu-series/ep30/short/sound-lock.py"""
import glob, json, os, subprocess, sys
EP = 'edu-ep30'
LIB = os.path.expanduser('~/ReelsStore/library/sound')
if not os.path.isdir(f'src/videos/{EP}'): sys.exit(f'src/videos/{EP} does not exist yet; Editor creates the episode folder, then rerun.')
ids = sorted({c['id'] for c in json.load(open('scripts/edu-series/ep30/sound-cues.json'))['cues']})
for sid in ids:
    hit = glob.glob(f'{LIB}/*/*/{sid}.wav')
    if not hit: sys.exit(f'{sid}: not in the library')
    typ, cat = hit[0].split('/')[-3:-1]
    pub = f'public/{"sfx" if typ == "sfx" else "audio"}/{cat}/{sid}.wav'
    subprocess.run(['python3', '-I', 'scripts/store.py', 'use', f'library/sound/{typ}/{cat}/{sid}.wav', pub, '--episode', EP], check=True)
