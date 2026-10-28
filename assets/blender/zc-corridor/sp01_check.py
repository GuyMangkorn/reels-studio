"""SP01 image checks (QA tool; reads local renders, writes JSON). Run with any Python that has numpy, e.g. Blender's:
  /Applications/Blender.app/Contents/Resources/5.2/python/bin/python3.13 -I assets/blender/zc-corridor/sp01_check.py <check> [...]
Images are decoded with ffmpeg (PATH or /opt/homebrew/bin) to 8-bit RGB.

checks:
  temporal                 eevee64/eevee32 vs eevee256 reference over clip F60-F71 + full eevee64 consecutive-pair scan
  compare A.png B.png      mean/max abs diff, per-channel mean signed diff (B - A), outside/inside ZC-CAPZONE
  capbox CAP.png NOCAP.png bounding box of caption pixels (|diff| > 40)
Results print as JSON.
"""
import json, os, shutil, subprocess, sys
import numpy as np

W, H = 1080, 1920
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
SEQ = os.path.join(ROOT, 'out', 'blender', 'zc-corridor', 'B01-SH01')
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'


def load(path):
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(np.int16)


def frame(preset, f):
    return load(os.path.join(SEQ, preset, f'frame_{f:04d}.png'))


def mad(a, b):
    return float(np.abs(a - b).mean())


def temporal():
    out = {'window': 'clip F60-F71', 'pairs': []}
    for f in range(60, 71):
        row = {'pair': f'{f}-{f + 1}'}
        for p in ('eevee32', 'eevee64', 'eevee256'):
            row[p] = round(mad(frame(p, f), frame(p, f + 1)), 3)
        row['excess64'] = round(row['eevee64'] - row['eevee256'], 3)
        row['excess32'] = round(row['eevee32'] - row['eevee256'], 3)
        out['pairs'].append(row)
    for p in ('eevee32', 'eevee64'):
        out[f'spatial_err_{p}_vs_256'] = round(float(np.mean([mad(frame(p, f), frame('eevee256', f)) for f in range(60, 72)])), 3)
        ex = [r['excess' + p[5:]] for r in out['pairs']]
        out[f'mean_excess_{p}'] = round(float(np.mean(ex)), 3)
        out[f'max_excess_{p}'] = round(float(np.max(ex)), 3)
    seq = []
    prev = frame('eevee64', 0)
    for f in range(1, 150):
        cur = frame('eevee64', f)
        seq.append(round(mad(prev, cur), 3))
        prev = cur
    med = float(np.median(seq))
    out['full_eevee64_pair_mad_median'] = round(med, 3)
    out['full_eevee64_pair_mad_max'] = max(seq)
    out['full_eevee64_outliers_gt_3x_median'] = [f'{i}-{i + 1}:{v}' for i, v in enumerate(seq) if v > 3 * med]
    out['full_eevee64_pair_mad'] = seq
    return out


def compare(a, b):
    A, B = load(a), load(b)
    d = B - A
    cap = slice(860, 1249)
    mask = np.ones((H, W), bool)
    mask[cap] = False
    return {'a': os.path.relpath(a, ROOT), 'b': os.path.relpath(b, ROOT),
            'mean_abs': round(float(np.abs(d).mean()), 3), 'max_abs': int(np.abs(d).max()),
            'mean_abs_outside_capzone': round(float(np.abs(d)[mask].mean()), 3),
            'mean_signed_rgb_b_minus_a': [round(float(d[..., c].mean()), 3) for c in range(3)],
            'identical': bool((d == 0).all())}


def capbox(cap, nocap):
    d = np.abs(load(cap) - load(nocap)).max(axis=2) > 40
    ys, xs = np.nonzero(d)
    return {'x': [int(xs.min()), int(xs.max())], 'y': [int(ys.min()), int(ys.max())], 'pixels': int(d.sum()),
            'inside_box_x120_888_y288_1248': bool(xs.min() >= 120 and xs.max() <= 888 and ys.min() >= 288 and ys.max() <= 1248)}


if __name__ == '__main__':
    c = sys.argv[1]
    r = temporal() if c == 'temporal' else compare(*sys.argv[2:4]) if c == 'compare' else capbox(*sys.argv[2:4])
    print(json.dumps(r, indent=1))
