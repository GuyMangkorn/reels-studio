#!/usr/bin/env python3 -I
"""EDU-EP17 spike frame metrics (ffmpeg raw decode, no image library).

  python3 -I scripts/edu17/frame-metrics.py disc FRAME.png --cx 540 --cy 960 [--space 05070d]
      Diameter of the non-space disc through (cx, cy): vertical and horizontal extent (px). SP1: globe radius 500 +- 5 px at h 7,860 km.
  python3 -I scripts/edu17/frame-metrics.py pops DIR PREFIX FIRST LAST [--w 135] [--h 240] [--ratio 3.0] [--floor 0.6]
      Mean absolute difference (0-255) between consecutive frames PREFIXnnn.png and the ratio of each step to the mean of its 4 neighbouring steps.
  python3 -I scripts/edu17/frame-metrics.py pairs DIR PREFIX COUNT
      Mean absolute difference of each (even, odd) frame pair PREFIXnnn.png (the SP1 seam pairs).
      A step is a pop candidate when ratio > --ratio and its value > --floor (so quiet stretches do not flag on noise). Prints the steps sorted by ratio.
"""
import argparse, os, shutil, subprocess, sys

FF = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'


def decode(path, w, h):
    raw = subprocess.run([FF, '-v', 'error', '-i', path, '-vf', f'scale={w}:{h}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    return raw


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    d = sub.add_parser('disc'); d.add_argument('png'); d.add_argument('--cx', type=int, default=540); d.add_argument('--cy', type=int, default=960); d.add_argument('--space', default='05070d')
    q = sub.add_parser('pops'); q.add_argument('dir'); q.add_argument('prefix'); q.add_argument('first', type=int); q.add_argument('last', type=int)
    q.add_argument('--w', type=int, default=135); q.add_argument('--h', type=int, default=240); q.add_argument('--ratio', type=float, default=3.0); q.add_argument('--floor', type=float, default=0.6)
    r = sub.add_parser('pairs'); r.add_argument('dir'); r.add_argument('prefix'); r.add_argument('count', type=int); r.add_argument('--w', type=int, default=135); r.add_argument('--h', type=int, default=240)
    a = ap.parse_args()
    if a.cmd == 'pairs':
        for k in range(a.count):
            x = decode(os.path.join(a.dir, f'{a.prefix}{2 * k:03d}.png'), a.w, a.h); y = decode(os.path.join(a.dir, f'{a.prefix}{2 * k + 1:03d}.png'), a.w, a.h)
            print(f'pair {k} (n{2 * k}/n{2 * k + 1}): diff {sum(abs(i - j) for i, j in zip(x, y)) / len(x):.4f}')
        return
    if a.cmd == 'disc':
        W, H = 1080, 1920
        raw = decode(a.png, W, H)
        sp = tuple(int(a.space[i:i + 2], 16) for i in (0, 2, 4))
        isspace = lambda x, y: all(abs(raw[(y * W + x) * 3 + k] - sp[k]) < 10 for k in range(3))
        ys = [y for y in range(0, H - 60) if not isspace(a.cx, y)]
        xs = [x for x in range(W) if not isspace(x, a.cy)]
        print(f'vertical {min(ys)}..{max(ys)} = {max(ys) - min(ys) + 1} px (radius {(max(ys) - min(ys) + 1) / 2:.1f}); horizontal {min(xs)}..{max(xs)} = {max(xs) - min(xs) + 1} px (radius {(max(xs) - min(xs) + 1) / 2:.1f})')
        return
    prev, steps = None, []
    for n in range(a.first, a.last + 1):
        cur = decode(os.path.join(a.dir, f'{a.prefix}{n:03d}.png'), a.w, a.h)
        if prev is not None:
            steps.append((n - 1, sum(abs(x - y) for x, y in zip(prev, cur)) / len(cur)))
        prev = cur
    out = []
    for i, (n, v) in enumerate(steps):
        nb = [steps[j][1] for j in (i - 2, i - 1, i + 1, i + 2) if 0 <= j < len(steps)]
        r = v / ((sum(nb) / len(nb)) or 1e-9)
        out.append((n, v, r))
    cand = [o for o in out if o[2] > a.ratio and o[1] > a.floor]
    print(f'{len(steps)} steps; mean {sum(v for _, v in steps) / len(steps):.3f}, max {max(v for _, v in steps):.3f} (step {max(steps, key=lambda s: s[1])[0]}); candidates (ratio > {a.ratio}, value > {a.floor}): {len(cand)}')
    for n, v, r in sorted(out, key=lambda o: -o[2])[:12]:
        print(f'  step n{n}->n{n + 1}: diff {v:.3f}, ratio {r:.2f}{"  <-- candidate" if (r > a.ratio and v > a.floor) else ""}')


main()
