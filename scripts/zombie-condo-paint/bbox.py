"""Bounding box of non-paper pixels in a region of a 1080x1920 frame (lead-height measure on model sheets).
Usage: python3 -I scripts/zombie-condo-paint/bbox.py FRAME.png X0 Y0 X1 Y1 [--paper efe6d2] [--tol 60]
Prints x/y min/max (absolute) and the height. Ground lines and labels in the region count as ink: choose the region to exclude them."""
import argparse, shutil, subprocess

ap = argparse.ArgumentParser()
ap.add_argument('png'); ap.add_argument('box', nargs=4, type=int)
ap.add_argument('--paper', default='efe6d2'); ap.add_argument('--tol', type=int, default=60)
a = ap.parse_args()
x0, y0, x1, y1 = a.box
raw = subprocess.run([shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg', '-v', 'error', '-i', a.png, '-vf', f'crop={x1 - x0}:{y1 - y0}:{x0}:{y0}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
pr, pg, pb = (int(a.paper[i:i + 2], 16) for i in (0, 2, 4))
w, h = x1 - x0, y1 - y0
xs, ys = [], []
for i in range(0, len(raw), 3):
    if abs(raw[i] - pr) + abs(raw[i + 1] - pg) + abs(raw[i + 2] - pb) > a.tol:
        p = i // 3
        xs.append(p % w); ys.append(p // w)
if not xs: print('empty')
else: print(f'x {x0 + min(xs)}-{x0 + max(xs)} y {y0 + min(ys)}-{y0 + max(ys)} height {max(ys) - min(ys) + 1}')
