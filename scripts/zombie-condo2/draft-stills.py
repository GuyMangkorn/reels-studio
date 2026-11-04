#!/usr/bin/env python3 -I
"""W5.2 draft evidence: start/middle/end stills (or --frames list) of ZC2D-<shot> compositions on one Chrome, then a 270 px qa-sheet per group.
Usage: scripts/zombie-condo2/draft-stills.py [--frames a,b,..] [--sheet NAME] SHOT_PREFIX...   (prefix e.g. B01 or B02-SH04; out/zc2d/<shot>-<frame>.png)"""
import re, subprocess, sys, os
args = sys.argv[1:]; frames = None; sheet = None
while args and args[0].startswith('--'):
    if args[0] == '--frames': frames = [int(x) for x in args[1].split(',')]
    if args[0] == '--sheet': sheet = args[1]
    args = args[2:]
t = open('storyboards/zombie-condo2/short/scene-sheet.md').read()
rows = re.findall(r'^\| (ZC2-B\d\d-SH\w+) \| B\d\d \| \[\d+, \d+\) \| (\d+) \|', t, re.M)
jobs, files = [], []
for sid, n in rows:
    if not any(sid.startswith('ZC2-' + a) or ('ZC2-' + a) in sid for a in args): continue
    n = int(n); fr = frames or [0, n // 2, n - 1]
    for f in fr:
        if f >= n: continue
        o = f'out/zc2d/{sid[4:]}-{f}.png'; jobs.append(f'ZC2D-{sid[4:]} {f} {o}'); files.append(o)
os.makedirs('out/zc2d', exist_ok=True)
r = subprocess.run(['node', 'scripts/stills.mjs', 'src/painted/zc2kit/draft-index.ts'], input='\n'.join(jobs) + '\n', text=True, capture_output=True)
open('out/logs/draft-stills.log', 'w').write(r.stdout + r.stderr)
print('rendered', len(files), 'rc', r.returncode)
if sheet: subprocess.run(['scripts/qa-sheet.sh', f'out/zc2d/{sheet}.png', '--cols', '6'] + files)
