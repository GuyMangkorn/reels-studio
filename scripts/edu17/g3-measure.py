#!/usr/bin/env python3 -I
"""EDU-EP17 group 3 pixel measures on 1080x1920 stills (ffmpeg raw decode, no image library); numbers come from the pixels, not from the code values.

  python3 -I scripts/edu17/g3-measure.py bowl FRAME.png [--cx 540 --cy 640]
      Outer wall of the K02 bowl: the extent of the concrete rim colour (#cdc7ba, +-4) on the row and column 6 px off (cx, cy) (the aisle lines run along the axes). Expect 517 x 431 px.
  python3 -I scripts/edu17/g3-measure.py limb FRAME.png [--cx 540 --cy 960]
      Globe radius: on four rays from (cx, cy) the radius of the steepest brightness step between r 420 and 580. Expect 500 +- 5.
  python3 -I scripts/edu17/g3-measure.py dot FRAME.png --x X --y Y
      Diameter of the K01 blue (#2f7df6, +-14) dot on the row and column through (x, y). Expect 18 px.
  python3 -I scripts/edu17/g3-measure.py match A.png B.png [--box 0:0:1080:1176]
      Mean absolute difference (0-255, RGB) of two frames inside a box x:y:w:h (the SH01 +0 / SH16 +47 match).
"""
import argparse, json, math, shutil, subprocess

FF = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
W, H = 1080, 1920


def load(path):
    return subprocess.run([FF, '-v', 'error', '-i', path, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout


def px(raw, x, y):
    i = 3 * (y * W + x)
    return raw[i], raw[i + 1], raw[i + 2]


def near(c, t, tol):
    return all(abs(a - b) <= tol for a, b in zip(c, t))


def extent(raw, cx, cy, target, tol, horizontal):
    n = W if horizontal else H
    hits = [i for i in range(n) if near(px(raw, i, cy) if horizontal else px(raw, cx, i), target, tol)]
    return (min(hits), max(hits), max(hits) - min(hits) + 1) if hits else None


def main():
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest='cmd', required=True)
    b = sub.add_parser('bowl'); b.add_argument('png'); b.add_argument('--cx', type=int, default=540); b.add_argument('--cy', type=int, default=640)
    l = sub.add_parser('limb'); l.add_argument('png'); l.add_argument('--cx', type=int, default=540); l.add_argument('--cy', type=int, default=960)
    d = sub.add_parser('dot'); d.add_argument('png'); d.add_argument('--x', type=int, required=True); d.add_argument('--y', type=int, required=True)
    m = sub.add_parser('match'); m.add_argument('a'); m.add_argument('b'); m.add_argument('--box', default='0:0:1080:1176')
    a = ap.parse_args()
    if a.cmd == 'bowl':
        raw = load(a.png); t = (0xcd, 0xc7, 0xba)
        hx, vy = extent(raw, a.cx, a.cy + 6, t, 4, True), extent(raw, a.cx + 6, a.cy, t, 4, False) # 6 px off the axes: the radial aisle lines run along them
        print(json.dumps({'width': hx and hx[2], 'x': hx and hx[:2], 'height': vy and vy[2], 'y': vy and vy[:2], 'centre': hx and vy and [(hx[0] + hx[1]) / 2, (vy[0] + vy[1]) / 2]}))
    elif a.cmd == 'limb':
        raw = load(a.png); out = {}
        for name, (dx, dy) in {'left': (-1, 0), 'right': (1, 0), 'up': (0, -1), 'down': (0, 1)}.items():
            best, br = -1, 0
            prev = None
            for r in range(420, 581):
                x, y = a.cx + dx * r, a.cy + dy * r
                if not (0 <= x < W and 0 <= y < H): prev = None; continue
                v = sum(px(raw, x, y))
                if prev is not None and abs(v - prev) > best: best, br = abs(v - prev), r
                prev = v
            out[name] = br
        out['mean'] = sum(out.values()) / 4
        print(json.dumps(out))
    elif a.cmd == 'dot':
        raw = load(a.png); t = (0x2f, 0x7d, 0xf6)
        hx, vy = extent(raw, a.x, a.y, t, 14, True), extent(raw, a.x, a.y, t, 14, False)
        # only the run around (x, y)
        def run(horizontal):
            n = W if horizontal else H; c = a.x if horizontal else a.y; s = a.x if horizontal else a.y
            ok = lambda i: near(px(raw, i, a.y) if horizontal else px(raw, a.x, i), t, 14)
            lo = hi = c
            if not ok(c):
                for k in range(1, 12):
                    if ok(c - k): lo = hi = c - k; break
                    if ok(c + k): lo = hi = c + k; break
                else: return None
            while lo - 1 >= 0 and ok(lo - 1): lo -= 1
            while hi + 1 < n and ok(hi + 1): hi += 1
            return hi - lo + 1
        print(json.dumps({'width': run(True), 'height': run(False)}))
    else:
        x, y, w, h = map(int, a.box.split(':')); A, B = load(a.a), load(a.b); s = 0
        for yy in range(y, y + h):
            i0 = 3 * (yy * W + x)
            s += sum(abs(p - q) for p, q in zip(A[i0:i0 + 3 * w], B[i0:i0 + 3 * w]))
        print(json.dumps({'mad': s / (3 * w * h)}))


main()
