"""WFOG-EP01-SHORT frame measurements (episode QA; stdlib only, reads 1080x1920 stills through ffmpeg).

Usage (all commands print one JSON object):
  python3 -I scripts/world-fog/qa-measure.py lum FRAME.png X0 Y0 X1 Y1
      Rec.709 luma (0-1) of the box: mean, p05, p95.
  python3 -I scripts/world-fog/qa-measure.py mask FRAME.png X0 Y0 X1 Y1 PRED [--thr T]
      Pixels of the box matching PRED: count, centroid (cx, cy), bbox. PRED is one of
      dark (luma < T, default 0.2), red (red helmet / red torch shell), amber (warm lamp halo).
  python3 -I scripts/world-fog/qa-measure.py ring FRAME.png BX0 BY0 BX1 BY1 WIDTH
      Mean luma of the WIDTH px band just outside the box (BX0..BY1) on all four sides: the backlit ring.

Coordinates are full-frame pixels (1080 x 1920, top-left origin). The crop is done by ffmpeg, so the script stays fast.
"""
import argparse, json, shutil, subprocess, sys

W, H = 1080, 1920
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'


def pixels(path, x0, y0, x1, y1):
    """Rows of (r, g, b) tuples for the box [x0, x1) x [y0, y1) of the frame (clipped to the frame)."""
    x0, y0, x1, y1 = max(0, x0), max(0, y0), min(W, x1), min(H, y1)
    w, h = x1 - x0, y1 - y0
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-vf', f'scale={W}:{H},crop={w}:{h}:{x0}:{y0}',
                          '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    rows = []
    for j in range(h):
        base = j * w * 3
        rows.append([(raw[base + 3 * i], raw[base + 3 * i + 1], raw[base + 3 * i + 2]) for i in range(w)])
    return rows, x0, y0


def luma(c):
    return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255


def cmd_lum(a):
    rows, _, _ = pixels(a.frame, a.box[0], a.box[1], a.box[2], a.box[3])
    vals = sorted(luma(c) for r in rows for c in r)
    n = len(vals)
    return {'box': a.box, 'n': n, 'mean': round(sum(vals) / n, 4), 'p05': round(vals[int(0.05 * (n - 1))], 4), 'p95': round(vals[int(0.95 * (n - 1))], 4)}


PRED = {
    'dark': lambda c, thr: luma(c) < thr,
    'red': lambda c, thr: c[0] >= 150 and c[1] <= 110 and c[2] <= 110 and c[0] - c[1] >= 70,
    'amber': lambda c, thr: c[0] >= 190 and c[1] >= 140 and c[2] <= 150 and c[0] - c[2] >= 60,
}


def cmd_mask(a):
    if a.pred not in PRED:
        sys.exit(f'unknown PRED {a.pred}')
    rows, x0, y0 = pixels(a.frame, a.box[0], a.box[1], a.box[2], a.box[3])
    thr = a.thr if a.thr is not None else 0.2
    hits = [(x0 + i, y0 + j) for j, r in enumerate(rows) for i, c in enumerate(r) if PRED[a.pred](c, thr)]
    if not hits:
        return {'pred': a.pred, 'count': 0}
    xs, ys = [p[0] for p in hits], [p[1] for p in hits]
    lums = [luma(c) for r in rows for c in r if PRED[a.pred](c, thr)]
    return {'pred': a.pred, 'thr': thr, 'count': len(hits), 'cx': round(sum(xs) / len(xs), 1), 'cy': round(sum(ys) / len(ys), 1),
            'bbox': [min(xs), min(ys), max(xs), max(ys)], 'mean_luma': round(sum(lums) / len(lums), 4)}


def cmd_ring(a):
    bx0, by0, bx1, by1, wd = a.box[0], a.box[1], a.box[2], a.box[3], a.width
    outer = [bx0 - wd, by0 - wd, bx1 + wd, by1 + wd]
    rows, x0, y0 = pixels(a.frame, *outer)
    vals = []
    for j, r in enumerate(rows):
        y = y0 + j
        for i, c in enumerate(r):
            x = x0 + i
            if bx0 <= x < bx1 and by0 <= y < by1:
                continue
            vals.append(luma(c))
    vals.sort()
    n = len(vals)
    return {'box': a.box, 'width': wd, 'n': n, 'mean': round(sum(vals) / n, 4), 'p05': round(vals[int(0.05 * (n - 1))], 4)}


def main():
    ap = argparse.ArgumentParser(description='WFOG-EP01-SHORT frame measurements (JSON)')
    sub = ap.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('lum'); s.add_argument('frame'); s.add_argument('box', type=int, nargs=4)
    s = sub.add_parser('mask'); s.add_argument('frame'); s.add_argument('box', type=int, nargs=4); s.add_argument('pred'); s.add_argument('--thr', type=float)
    s = sub.add_parser('ring'); s.add_argument('frame'); s.add_argument('box', type=int, nargs=4); s.add_argument('width', type=int)
    a = ap.parse_args()
    out = {'lum': cmd_lum, 'mask': cmd_mask, 'ring': cmd_ring}[a.cmd](a)
    print(json.dumps(out, ensure_ascii=False))


if __name__ == '__main__':
    main()
