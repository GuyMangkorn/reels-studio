"""EDU-EP11 spike pixel measures (needs ffmpeg). Usage: python3 -I scripts/edu-series/ep11/spikes/measure-pixels.py out/edu11/spikes   (prints JSON)
- SP2: bounding box of the car shell colour #c0c8cf in each section still (car hold +-2 px, car bottom <= 1160)
- SP3: inset white-border rect in the inset-phase stills (slot INSET 760-1040 x 640-1138 +-4 px); f1236 vs the story-frame-0 reference (differing bytes)
"""
import json, shutil, subprocess, sys

W, H = 1080, 1920
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'

def load(path):
    return subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout

def bbox(raw, rgb, tol):
    x0, y0, x1, y1, n = W, H, -1, -1, 0
    r0, g0, b0 = rgb
    for y in range(H):
        row = raw[y * W * 3:(y + 1) * W * 3]
        for x in range(W):
            i = x * 3
            if abs(row[i] - r0) <= tol and abs(row[i + 1] - g0) <= tol and abs(row[i + 2] - b0) <= tol:
                n += 1
                if x < x0: x0 = x
                if x > x1: x1 = x
                if y < y0: y0 = y
                if y > y1: y1 = y
    return {'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1, 'px': n}

def white_runs(vals, minrun=4):
    runs, start = [], None
    for i, v in enumerate(vals + [False]):
        if v and start is None: start = i
        if not v and start is not None:
            if i - start >= minrun: runs.append((start, i - 1))
            start = None
    return runs

def inset_rect(raw):
    px = lambda x, y: raw[(y * W + x) * 3:(y * W + x) * 3 + 3]
    white = lambda x, y: min(px(x, y)) >= 250
    col = [white(900, y) for y in range(H)]       # a column through the slot, clear of the figure
    row = [white(x, 700) for x in range(W)]       # a row through the slot, above her head
    cr, rr = white_runs(col), white_runs(row)
    return {'column x=900 white runs (y)': cr, 'row y=700 white runs (x)': rr}

out = {}
d = sys.argv[1]
for name in ['sp2-f286', 'sp2-f600', 'sp2-f790', 'sp2-f600-yaw']:
    out[name] = bbox(load(f'{d}/{name}.png'), (0xc0, 0xc8, 0xcf), 3)
for f in [878, 1000, 1211]:
    out[f'sp3-f{f} inset border'] = inset_rect(load(f'{d}/sp3-f{f}.png'))
a, b = load(f'{d}/sp3-f1236.png'), load(f'{d}/sp3-f0hud.png')
diff = [abs(x - y) for x, y in zip(a, b)]
out['sp3 f1236 vs story-frame-0+HUD'] = {'bytes': len(a), 'differing bytes': sum(1 for v in diff if v), 'max diff': max(diff)}
print(json.dumps(out, indent=1))
