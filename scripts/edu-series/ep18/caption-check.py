#!/usr/bin/env python3
"""EDU-EP18 caption check (Editor W5.3, 2026-11-12). For each sample frame of each caption cue (3 per cue: 10/50/90 % of the lit span):
the clean plate still (src/painted/edu18/shots-index.ts via scripts/stills.mjs, no caption) and the composition still (render.mjs --stills) are diffed to find the caption ink box;
scripts/caption-zone.py then measures the clean plate inside that box padded 24 px (mean <= 0.25, p95 <= 0.40, the film-brief caption-zone rule), and the full band y 1176-1344 x 120-960.
Run after out/qa/edu-ep18/cap/{list.txt,meta.json,*.png} (clean) and out/EDU-EP18-SHORT/stills/<f>.png (composition) exist. Prints a table and writes out/qa/edu-ep18/cap/caption-zone.json."""
import json, subprocess
meta = json.load(open('out/qa/edu-ep18/cap/meta.json')); res = []
def raw(p): return subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vf', 'scale=1080:1920', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
def ink(a, b):
    x0 = y0 = 10 ** 9; x1 = y1 = -1
    for y in range(1100, 1420, 2):
        o = y * 3240; ra = a[o:o + 3240]; rb = b[o:o + 3240]
        for x in range(60, 1020, 2):
            i = x * 3
            if abs(ra[i] - rb[i]) + abs(ra[i + 1] - rb[i + 1]) + abs(ra[i + 2] - rb[i + 2]) > 150:
                x0 = min(x0, x); x1 = max(x1, x); y0 = min(y0, y); y1 = max(y1, y)
    return x0, y0, x1, y1
def zone(p, band, x):
    o = json.loads(subprocess.run(['python3', '-I', 'scripts/caption-zone.py', '--band', band, f'--x={x}', p], capture_output=True, text=True).stdout)[p]; return o
print(f"{'cue':5} {'f':>5} {'shot':9} {'L':>3} {'ink box':>22} {'ink mean':>8} {'ink p95':>7} {'band mean':>9} {'band p95':>8} pass(ink)")
for c, f, sid, L, out in meta:
    box = ink(raw(f'out/EDU-EP18-SHORT/stills/{f}.png'), raw(out))
    if box[2] < 0: print(c, f, 'no caption ink found'); continue
    x0, y0, x1, y1 = max(0, box[0] - 24), box[1] - 24, min(1080, box[2] + 24), min(1344, box[3] + 24)
    zi = zone(out, f'{y0}:{y1}', f'{x0}:{x1}'); zb = zone(out, '1176:1344', '120:960')
    res.append({'cue': c, 'f': f, 'shot': sid, 'L': L, 'box': [x0, y0, x1, y1], 'ink': zi, 'band': zb})
    print(f"{c:5} {f:5} {sid[-9:]:9} {L:3} {str(box):>22} {zi['mean']:8.3f} {zi['p95']:7.3f} {zb['mean']:9.3f} {zb['p95']:8.3f} {zi['pass']}")
json.dump(res, open('out/qa/edu-ep18/cap/caption-zone.json', 'w'), indent=1)
bad = sorted({r['cue'] for r in res if not r['ink']['pass']}); print('ALL PASS (ink box)' if not bad else 'FAIL ink box: ' + ', '.join(bad))
