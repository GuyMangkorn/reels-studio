"""POOLDEPTH test-clip analysis. Run with Blender's python (it has numpy; system python does not):
  Blender -b --python scripts/pool-depth/spike/analyze_testclips.py -- <cmd> args
Commands: seq <dirA> <first> <last> [prefix]   per-step diff stats of a PNG sequence F###.png (+ wrap last->first)
          diff <a.png> <b.png> [mask.png]      max/mean/count diffs (0-255 scale)
          px <png> <x> <y>                     RGB at pixel
"""
import sys, os, json
import numpy as np
import bpy


def rd(path):
    img = bpy.data.images.load(path)
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    bpy.data.images.remove(img)
    # PNG sRGB 8-bit loaded as sRGB-encoded floats (colorspace sRGB -> pixels returns linear?) force byte values
    return a.reshape(h, w, 4)[::-1, :, :3]


def rd8(path):
    img = bpy.data.images.load(path)
    img.colorspace_settings.name = 'Non-Color'
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    bpy.data.images.remove(img)
    return np.rint(a.reshape(h, w, 4)[::-1, :, :3] * 255.0).astype(np.int16)


def stats(a, b):
    d = np.abs(a.astype(np.int16) - b.astype(np.int16))
    m = d.max(axis=2)
    return {'mean': float(d.mean()), 'max': int(d.max()), 'gt2': int((m > 2).sum()), 'gt8': int((m > 8).sum()), 'any': int((m > 0).sum())}


if __name__ == '__main__':
    A = sys.argv[sys.argv.index('--') + 1:]
    c = A[0]
    if c == 'diff':
        a, b = rd8(A[1]), rd8(A[2])
        print('DIFF', json.dumps(stats(a, b)))
    elif c == 'sheet':
        # sheet <out.png> <cols> <step> img1 img2 ... : each image downsampled by `step` (nearest), tiled in `cols` columns
        out, cols, st = A[1], int(A[2]), int(A[3])
        ims = [rd8(p)[::st, ::st] for p in A[4:]]
        h, w = ims[0].shape[:2]
        rows = (len(ims) + cols - 1) // cols
        S = np.full((rows * h, cols * w, 3), 255, np.int16)
        for i, im in enumerate(ims):
            r, k = divmod(i, cols)
            S[r * h:(r + 1) * h, k * w:(k + 1) * w] = im
        buf = np.ones((rows * h, cols * w, 4), np.float32)
        buf[..., :3] = S / 255.0
        img = bpy.data.images.new('sheet', cols * w, rows * h)
        img.colorspace_settings.name = 'Non-Color'
        img.pixels.foreach_set(buf[::-1].reshape(-1))
        img.filepath_raw = out
        img.file_format = 'PNG'
        img.save()
        print('SHEET', out, S.shape)
    elif c == 'px':
        a = rd8(A[1]); x, y = int(A[2]), int(A[3])
        print('PX', a[y, x].tolist())
    elif c == 'seq':
        d, f0, f1 = A[1], int(A[2]), int(A[3])
        fr = {f: rd8(os.path.join(d, f'{A[4] if len(A) > 4 else "F"}{f:03d}.png')) for f in range(f0, f1 + 1)}
        steps = []
        for f in range(f0, f1):
            steps.append((f, f + 1, stats(fr[f], fr[f + 1])))
        wrap = stats(fr[f1], fr[f0])
        # water region = pixels that ever change by > 8 between steps
        mov = np.zeros(fr[f0].shape[:2], bool)
        for f in range(f0, f1):
            mov |= np.abs(fr[f] - fr[f + 1]).max(axis=2) > 8
        wsteps = []
        for f in range(f0, f1):
            d_ = np.abs(fr[f] - fr[f + 1]).max(axis=2)
            wsteps.append(float(np.abs(fr[f] - fr[f + 1]).mean(axis=2)[mov].mean()))
        wd = float(np.abs(fr[f1] - fr[f0]).mean(axis=2)[mov].mean())
        print('SEQ', json.dumps({'region_px': int(mov.sum()), 'region_frac': float(mov.mean()),
                                  'step_mean': [round(s[2]['mean'], 3) for s in steps], 'step_max': [s[2]['max'] for s in steps],
                                  'step_mean_avg': float(np.mean([s[2]['mean'] for s in steps])), 'wrap_last_to_first': wrap,
                                  'region_step_avg': float(np.mean(wsteps)), 'region_step_max': float(np.max(wsteps)), 'region_wrap': wd,
                                  'bg_gt8_outside_region': 0}))
