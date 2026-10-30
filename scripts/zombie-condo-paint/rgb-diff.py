"""Decoded-RGB comparison of two 1080-wide PNG frames (PNG bytes differ between runs; pixels are the test).
Usage: python3 -I scripts/zombie-condo-paint/rgb-diff.py A.png B.png [--width 1080]
Prints `identical` with the decoded md5, or the number of differing pixels, the largest per-channel difference (0-255),
the bounding box of the differing pixels and how many of them differ by more than 3 levels (the RK-24 class)."""
import argparse, hashlib, shutil, subprocess, sys

FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'


def decoded(path):
    return subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('a')
    ap.add_argument('b')
    ap.add_argument('--width', type=int, default=1080)
    args = ap.parse_args()
    a, b = decoded(args.a), decoded(args.b)
    if len(a) != len(b):
        print(f'size differs: {len(a)} vs {len(b)} bytes')
        sys.exit(1)
    if a == b:
        print(f'identical md5 {hashlib.md5(a).hexdigest()}')
        return
    w = args.width
    count = worst = big = 0
    x0 = y0 = 10 ** 9
    x1 = y1 = -1
    for p in range(len(a) // 3):
        i = 3 * p
        d = max(abs(a[i] - b[i]), abs(a[i + 1] - b[i + 1]), abs(a[i + 2] - b[i + 2]))
        if d:
            count += 1
            worst = max(worst, d)
            big += d > 3
            x, y = p % w, p // w
            x0, x1, y0, y1 = min(x0, x), max(x1, x), min(y0, y), max(y1, y)
    print(f'differs: {count} px ({100 * count / (len(a) // 3):.4f} %), max level {worst}, >3 levels {big} px, bbox x {x0}-{x1} y {y0}-{y1}')


main()
