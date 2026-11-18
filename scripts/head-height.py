#!/usr/bin/env python3
"""Head height per column over a video: the top of the head (hair included) and the chin, found where the figure's width
drops to the neck below its widest row. For turn checks such as KIT-HEAD-TURN / KIT-HEAD-TALK-TURN (user, 18 Nov 2026).

Usage: python3 -I scripts/head-height.py VIDEO.mp4 [--cols 2] [--every 0.25] [--y0 600 --y1 1400] [--paper efe8dc]
Bounds are in 1920-tall units and scale to the video (half-size drafts). Prints one row per sampled time and a summary (min, max, spread %) per column. Needs ffmpeg/ffprobe on PATH.
"""
import argparse
import json
import subprocess
import sys


def frames(video, every):
    info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,duration',
                                      '-of', 'json', video], capture_output=True, check=True, text=True).stdout)['streams'][0]
    w, h, dur = int(info['width']), int(info['height']), float(info['duration'])
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-vf', f'fps=1/{every}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         capture_output=True, check=True).stdout
    size = w * h * 3
    for i in range(len(raw) // size):
        yield i * every, w, h, raw[i * size:(i + 1) * size]
    _ = dur


def measure(buf, w, x0, x1, y0, y1, paper, k=1.0):
    widths = []
    for y in range(y0, y1):
        row = y * w * 3
        xs = [x for x in range(x0, x1, 1) if max(abs(buf[row + x * 3 + k] - paper[k]) for k in range(3)) > 30]
        v = xs[-1] - xs[0] if xs else 0
        widths.append((y, 0 if v > 0.92 * (x1 - x0) else v))  # a full-width row is a guide line, not the head
    top = next((y for y, v in widths if v > 20 * k), None)
    if top is None:
        return None
    head = [(v, y) for y, v in widths if y < top + 450 * k]
    widest, ywide = max(head)
    chin = next((y for y, v in widths if y > ywide and v < 0.45 * widest), None)
    return top, chin


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('--cols', type=int, default=2)
    ap.add_argument('--every', type=float, default=0.25)
    ap.add_argument('--y0', type=int, default=600)
    ap.add_argument('--y1', type=int, default=1400)
    ap.add_argument('--paper', default='efe8dc')
    a = ap.parse_args()
    paper = tuple(int(a.paper[i:i + 2], 16) for i in (0, 2, 4))
    heights = [[] for _ in range(a.cols)]
    for t, w, h, buf in frames(a.video, a.every):
        cw = w // a.cols
        cells = []
        for c in range(a.cols):
            k = h / 1920  # bounds are given for a 1920-tall frame; drafts are half size
            m = measure(buf, w, c * cw + int(20 * k), (c + 1) * cw - int(20 * k), int(a.y0 * k), min(int(a.y1 * k), h), paper, k)
            if m and m[1]:
                heights[c].append(m[1] - m[0])
                cells.append(f'{m[0]:>5} {m[1]:>5} {m[1] - m[0]:>4}')
            else:
                cells.append('    -     -    -')
        print(f'{t:5.2f}s  ' + '  |  '.join(cells))
    for c, hs in enumerate(heights):
        if hs:
            lo, hi = min(hs), max(hs)
            print(f'col {c}: height min {lo} max {hi} spread {hi - lo} px ({100 * (hi - lo) / lo:.1f}%)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
