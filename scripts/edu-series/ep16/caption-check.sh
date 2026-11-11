#!/bin/sh
# EDU-EP16 caption check (Editor W5.3): sh scripts/edu-series/ep16/caption-check.sh [outdir]
# rects.json (12/50/88 % of each shot, compact quiet rectangle of its caption) -> clean stills on one Chrome (CALM plate as set in src/painted/edu16/frame.tsx, no caption text, no guide) -> scripts/caption-zone.py per rectangle.
D=${1:-out/qa/edu-ep16/cap}; mkdir -p $D/clean
npx tsx scripts/edu-series/ep16/caption-rects.mts > $D/rects.json 2> $D/rects.err || { tail -3 $D/rects.err; exit 1; }
python3 -I - "$D" <<'PY'
import json, re, subprocess, sys
d = sys.argv[1]; ids = re.findall(r"\['(S\d\d-B\d\d-SH\d\d)'", open('src/painted/edu16/clock.ts').read()); rs = json.load(open(d + '/rects.json'))
args = [f"{ids.index(r['shot']) + 1}:{r['L']}" for r in rs]
import os; env = dict(os.environ, GUIDES='0')
subprocess.run(['sh', 'scripts/edu-series/ep16/render-shots.sh', d + '/clean'] + args, env=env, capture_output=True)
res = []
for r, a in zip(rs, args):
    n, L = a.split(':'); f = f"{d}/clean/s{int(n):02d}_{int(L):03d}.png"
    o = json.loads(subprocess.run(['python3', '-I', 'scripts/caption-zone.py', '--band', f"{r['y0']}:{r['y1']}", f"--x={r['x0']}:{r['x1']}", f], capture_output=True, text=True).stdout)[f]
    res.append({**r, **o})
json.dump(res, open(d + '/caption-zone-rects.json', 'w'), indent=1)
print(f"{'shot':13} {'L':>4} {'cue':4} {'ln':>2} {'mean':>6} {'p95':>6} pass")
for x in res: print(f"{x['shot']:13} {x['L']:>4} {x['cue']:4} {x['lines']:>2} {x['mean']:6.3f} {x['p95']:6.3f} {x['pass']}")
bad = sorted({x['shot'] for x in res if not x['pass']}); print('ALL PASS' if not bad else 'FAIL: ' + ', '.join(bad))
PY
