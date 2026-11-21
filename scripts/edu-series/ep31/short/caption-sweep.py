#!/usr/bin/env python3
"""EDU-EP31-SHORT caption-zone sweep (Editor, W5.3, 2026-11-21): per shot, caption-zone.py --band 1100:1344 mean/p95 over its measurement stills
(out/ep31-w53/<mode>/<frame>.png from clean-stills.mjs, three frames per shot at 1/4, 1/2 and 3/4). Usage: python3 -I scripts/edu-series/ep31/short/caption-sweep.py MODE...
Prints one table: shot, then per mode the worst (highest) mean and p95 of the shot's frames, and `ok` when mean <= 0.30 and p95 <= 0.40."""
import json, os, re, subprocess, sys
ROOT = 'out/ep31-w53'
rows = re.findall(r"id: '(B\d\d-SH\d\d)', start: (\d+), N: (\d+)", open('src/painted/edu31/shots/index.ts').read())
shots = {i: [int(a) + int(n) // 4, int(a) + int(n) // 2, int(a) + (3 * int(n)) // 4] for i, a, n in rows}
res = {}
for mode in sys.argv[1:]:
    files = [f'{ROOT}/{mode}/{f}.png' for fr in shots.values() for f in fr]
    out = json.loads(subprocess.run(['python3', '-I', 'scripts/caption-zone.py', '--band', '1100:1344', '--max-mean', '0.30', *files], capture_output=True, text=True, check=True).stdout)
    for shot, fr in shots.items():
        v = [out[f'{ROOT}/{mode}/{f}.png'] for f in fr]
        res[(shot, mode)] = (max(x['mean'] for x in v), max(x['p95'] for x in v))
json.dump({f'{s}|{m}': v for (s, m), v in res.items()}, open(f'{ROOT}/sweep-{"-".join(sys.argv[1:])}.json', 'w'))
print('shot       ' + ''.join(f'{m:>16}' for m in sys.argv[1:]))
for shot in shots:
    print(f'{shot:10s} ' + ''.join(f'  {res[(shot, m)][0]:.2f}/{res[(shot, m)][1]:.2f} {"ok" if res[(shot, m)][0] <= 0.30 and res[(shot, m)][1] <= 0.40 else "--"}' for m in sys.argv[1:]))
