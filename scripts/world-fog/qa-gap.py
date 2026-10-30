"""WFOG-EP01-SHORT S04-SH01 outline gap (SS-R3.3: >= 80 px between the worker's outline and the narrator's on every frame).

Usage: python3 -I scripts/world-fog/qa-gap.py FRAME.png [FRAME.png ...] [--rows 560:1380:4] [--worker-max-x 740] [--narrator-min-x 730]
Stdlib only (ffmpeg reads 1080x1920 stills as rgb24). For each frame prints one JSON line with the worker's right-most
navy pixel (coat, hood), the narrator's left-most non-background pixel and their row-wise gap in px, over the given rows.
Segmentation is colour-based and approximate: navy = blue-dominant and dark; narrator = not shop background (dark, low
colour spread) and not navy. Read the printed rows with the labelled crop before trusting a failing frame.
"""
import argparse, json, shutil, subprocess, sys

W, H = 1080, 1920
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'


def frame_rgb(path):
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         check=True, capture_output=True).stdout
    return raw


def px(raw, x, y):
    i = (y * W + x) * 3
    return raw[i], raw[i + 1], raw[i + 2]


def is_navy(r, g, b):
    return b - r >= 18 and b >= g and (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 <= 0.42


def is_background(r, g, b):
    lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    spread = max(r, g, b) - min(r, g, b)
    return spread <= 14 and lum <= 0.60


def measure(path, y0, y1, step, wmax, nmin):
    raw = frame_rgb(path)
    rows = []
    gap_min = None
    for y in range(y0, y1, step):
        wr = None
        for x in range(min(wmax, W - 1), 299, -1):
            if is_navy(*px(raw, x, y)):
                wr = x
                break
        nl = None
        for x in range(nmin, min(W, 900)):
            r, g, b = px(raw, x, y)
            if not is_background(r, g, b) and not is_navy(r, g, b):
                nl = x
                break
        gap = (nl - wr) if (wr is not None and nl is not None) else None
        rows.append((y, wr, nl, gap))
        if gap is not None and (gap_min is None or gap < gap_min[1]):
            gap_min = (y, gap)
    return {'frame': path, 'rows_measured': len(rows), 'worker_right_max': max((r[1] for r in rows if r[1] is not None), default=None),
            'narrator_left_min': min((r[2] for r in rows if r[2] is not None), default=None),
            'gap_min_px': gap_min[1] if gap_min else None, 'gap_min_row': gap_min[0] if gap_min else None,
            'rows_with_both': sum(1 for r in rows if r[3] is not None)}


def main():
    ap = argparse.ArgumentParser(description='S04-SH01 worker-narrator outline gap per frame')
    ap.add_argument('frames', nargs='+')
    ap.add_argument('--rows', default='560:1380:4')
    ap.add_argument('--worker-max-x', type=int, default=740)
    ap.add_argument('--narrator-min-x', type=int, default=730)
    a = ap.parse_args()
    y0, y1, step = (int(v) for v in a.rows.split(':'))
    for f in a.frames:
        print(json.dumps(measure(f, y0, y1, step, a.worker_max_x, a.narrator_min_x)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
