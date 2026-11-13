#!/bin/sh
# Lock the EDU-EP17-SHORT sound files for the episode (W5.2s). Run once src/videos/edu-ep17 exists (Boss creates it).
# sfx -> public/sfx/<category>/, ambience and music -> public/audio/<category>/. Commit assets.lock.json, not the WAVs.
cd "$(dirname "$0")/../../.." || exit 1
python3 -I - <<'PY'
import json, subprocess
sheet = json.load(open('scripts/edu-series/ep17/sound-cues.json'))
store = '/Users/' + __import__('os').environ['USER'] + '/ReelsStore/library/sound'
import glob, os
store = os.path.expanduser('~/ReelsStore/library/sound')
for sid in sorted({c['id'] for c in sheet['cues']}):
    path = glob.glob(f'{store}/*/*/{sid}.wav')[0]
    typ, cat = path.split('/sound/')[1].split('/')[:2]
    dest = f"public/{'sfx' if typ == 'sfx' else 'audio'}/{cat}/{sid}.wav"
    subprocess.run(['python3', '-I', 'scripts/store.py', 'use', f'library/sound/{typ}/{cat}/{sid}.wav', dest, '--episode', 'edu-ep17'], check=True)
PY
