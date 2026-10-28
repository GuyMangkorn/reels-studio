"""SP02 image checks (QA tool; reads local renders and sp02-manifest.json, writes JSON). Run with a Python that has numpy, e.g. Blender's:
  /Applications/Blender.app/Contents/Resources/5.2/python/bin/python3.13 -I assets/blender/zc-unit/sp02_check.py <check>
Images are decoded with ffmpeg (PATH or /opt/homebrew/bin) to 8-bit RGB.

checks (Boss-chosen thresholds, recorded because the brief gives none):
  caps      (b)(c)  per cut-face cap: inside its projected rectangle (eroded 3 px) every pixel must be one flat colour
                    (max |deviation from the median| <= 2 levels); the capped corridor cap must be exactly (0,0,0). Stills + truck frames.
  caption   (d)     rows y 860-1248 (ZC-CAPZONE): mean Rec.709 luma of display values <= 0.25 and p95 <= 0.40 (outline captions)
  nonblack          luma of the capped corridor zone per truck frame (frame-step): must be 0 in every frame
Results print as JSON.
"""
import json, os, shutil, subprocess, sys
import numpy as np

W, H = 1080, 1920
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
MF = json.load(open(os.path.join(HERE, 'sp02-manifest.json')))
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
SP = os.path.join(ROOT, 'out', 'blender', 'zc-unit', 'sp02')


def load(path):
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(np.int16)


def luma(a):
    v = a / 255.0
    return 0.2126 * v[..., 0] + 0.7152 * v[..., 1] + 0.0722 * v[..., 2]


def rect_px(r, erode=3):
    x0, x1 = sorted((r[0], r[2]))
    y0, y1 = sorted((r[1], r[3]))
    x0, x1 = int(np.ceil(max(x0, 0) + erode)), int(np.floor(min(x1, W) - erode))
    y0, y1 = int(np.ceil(max(y0, 0) + erode)), int(np.floor(min(y1, H) - erode))
    return (x0, x1, y0, y1) if x1 > x0 and y1 > y0 else None


def caps_check(img, rects):
    rows = {}
    blk = rects.get('zc-cap_corridor_black')
    for name, r in rects.items():
        if blk and name.startswith('zc-cap_slab'):
            r = [max(r[0], blk[2]) if blk[2] > blk[0] else r[0], r[1], r[2], r[3]]   # the capped-corridor cap overlays the slab caps on its side by design
        bb = rect_px(r)
        if not bb:
            rows[name] = 'off-screen/too small'
            continue
        x0, x1, y0, y1 = bb
        reg = img[y0:y1, x0:x1].reshape(-1, 3)
        med = np.median(reg, axis=0)
        dev = int(np.abs(reg - med).max())
        row = {'px': int(reg.shape[0]), 'median_rgb': [int(v) for v in med], 'max_dev': dev}
        if name == 'zc-cap_corridor_black':
            row['max_value'] = int(reg.max())
        rows[name] = row
    return rows


def run_caps():
    out = {}
    for shot in ('B02', 'B09SH01', 'B09SH03', 'B07SH02', 'B07SH02mid', 'B07SH02start'):
        d = MF[f'still/{shot}']
        out[shot] = caps_check(load(os.path.join(ROOT, d['file'])), d['cap_rects_px'])
    td = os.path.join(SP, 'truck')
    cr = json.load(open(os.path.join(td, 'caprects.json')))
    worst, blackmax, drift = 0, 0, {}
    for k in sorted(cr, key=int):
        res = caps_check(load(os.path.join(td, f'frame_{int(k):04d}.png')), cr[k])
        for n, r in res.items():
            if isinstance(r, dict):
                worst = max(worst, r['max_dev'])
                if n == 'zc-cap_corridor_black':
                    blackmax = max(blackmax, r['max_value'])
                drift.setdefault(n, set()).add(tuple(r['median_rgb']))
    out['truck'] = {'frames': len(cr), 'worst_cap_max_dev': worst, 'corridor_cap_max_value_all_frames': blackmax,
                    'median_colour_variants_per_cap': {n: len(v) for n, v in drift.items()}}
    return out


def run_caption():
    out = {}
    files = {s: os.path.join(ROOT, MF[f'still/{s}']['file']) for s in ('B02', 'B09SH01', 'B09SH03', 'B07SH02', 'B07SH02mid', 'B07SH02start')}
    td = os.path.join(SP, 'truck')
    for k in (0, 30, 59):
        files[f'truck_F{k}'] = os.path.join(td, f'frame_{k:04d}.png')
    for n, p in files.items():
        y = luma(load(p))[860:1249]
        out[n] = {'mean': round(float(y.mean()), 3), 'p95': round(float(np.percentile(y, 95)), 3), 'max': round(float(y.max()), 3)}
        out[n]['pass'] = bool(out[n]['mean'] <= 0.25 and out[n]['p95'] <= 0.40)
    return out


if __name__ == '__main__':
    c = sys.argv[1]
    print(json.dumps({'caps': run_caps, 'caption': run_caption}[c](), indent=1))
