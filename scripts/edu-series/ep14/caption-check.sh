#!/bin/sh
# EDU-EP14 R4.3 caption-patch check: sh scripts/edu-series/ep14/caption-check.sh <outdir>   (rects.json from caption-rects.mts in <outdir>)
# Renders clean stills (no caption text, patch on) at each rect frame on one Chrome, then runs caption-zone.py on each caption rectangle (band = its y-range, --x = its x-range).
D=${1:-out/qa/edu-ep14/r43}; mkdir -p $D/clean
python3 -I - "$D" <<'PY' | node scripts/stills.mjs src/painted/edu14/build-index.ts > $D/stills.log 2>&1
import json, sys
d = sys.argv[1]
for r in json.load(open(d + '/rects.json')):
    print(f"EDU14-{r['shot']} {r['L']} {d}/clean/{r['shot']}_{r['L']}.png")
PY
python3 -I - "$D" <<'PY'
import json, subprocess, sys
d = sys.argv[1]; res = []
for r in json.load(open(d + '/rects.json')):
    f = f"{d}/clean/{r['shot']}_{r['L']}.png"
    o = json.loads(subprocess.run(['python3', '-I', 'scripts/caption-zone.py', '--band', f"{r['y0']}:{r['y1']}", '--x', f"{r['x0']}:{r['x1']}", f], capture_output=True, text=True).stdout)[f]
    res.append({**r, **o})
json.dump(res, open(d + '/caption-zone-rects.json', 'w'), indent=1)
print(f"{'shot':13} {'L':>4} {'cue':4} {'ln':>2} {'mean':>6} {'p95':>6} pass")
for x in res: print(f"{x['shot']:13} {x['L']:>4} {x['cue']:4} {x['lines']:>2} {x['mean']:6.3f} {x['p95']:6.3f} {x['pass']}")
print('ALL PASS' if all(x['pass'] for x in res) else 'FAIL: ' + ', '.join(f"{x['shot']}@{x['L']}" for x in res if not x['pass']))
PY
