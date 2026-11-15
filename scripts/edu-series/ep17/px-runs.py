"""Pixel-run measure on a rendered frame column (EDU-EP17 Boss W5: tube thickness for the N15 equal-scale proof, picture extents).
Usage: python3 -I scripts/edu-series/ep17/px-runs.py FRAME.png X Y0 Y1 MODE [MODE ...]
MODE: green (hose: G > R+40 and G > B+20), dark (luma < 0.12), bright (luma > 0.9). Prints the runs (y0-y1, length) of each mode in the column.
Needs ffmpeg on PATH; no Python packages.
"""
import shutil, subprocess, sys

FF = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
path, x, y0, y1 = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
raw = subprocess.run([FF, '-v', 'error', '-i', path, '-vf', f'crop=1:{y1 - y0}:{x}:{y0}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
px = [raw[i:i + 3] for i in range(0, len(raw), 3)]
luma = lambda c: (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255
TEST = {'green': lambda c: c[1] > c[0] + 40 and c[1] > c[2] + 20, 'dark': lambda c: luma(c) < 0.12, 'bright': lambda c: luma(c) > 0.9}
for mode in sys.argv[5:]:
    runs, start = [], None
    for i, c in enumerate(px + [b'\x00\x00\x00' if mode != 'dark' else b'\xff\xff\xff']):
        hit = TEST[mode](c) if i < len(px) else False
        if hit and start is None: start = i
        if not hit and start is not None: runs.append((y0 + start, y0 + i - 1, i - start)); start = None
    print(f'{path} x={x} {mode}: ' + ', '.join(f'{a}-{b} ({n} px)' for a, b, n in runs if n >= 3))
