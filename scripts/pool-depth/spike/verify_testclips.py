"""Encoded-clip checks (Blender python): Remotion stills vs source PNGs. Blender -b --python this -- (no args)"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from analyze_testclips import rd8, stats
R = 'assets/blender/pool-depth/renders/testclips'; O = 'out/pooldepth-test'
res = {}
src08 = {f: rd8(f'{R}/SH08/F{f:03d}.png') for f in (90, 104, 119, 209)}
src01 = rd8(f'{R}/SH01/F000.png')
# 1 color survival: known pixels (sRGB deck, water, shirt) PNG vs Remotion decode, clip frame 15 (= F105)
s105 = rd8(f'{R}/SH08/F105.png'); d105 = rd8(f'{O}/r08_15.png')
res['px_before_after'] = {n: [s105[y, x].tolist(), d105[y, x].tolist()] for n, (x, y) in {'deck': (540, 1500), 'water': (300, 700), 'shirt': (540, 450), 'shorts': (540, 560)}.items()}
res['frame15_vs_F105'] = stats(s105, d105)
# 2 hold
r = {f: rd8(f'{O}/r08_{f}.png') for f in (0, 15, 29, 30, 75, 119)}
res['sh08_decode_vs_src'] = {'rem0_vs_F090': stats(src08[90], r[0]), 'rem29_vs_F119': stats(src08[119], r[29])}
res['sh08_hold'] = {f'rem{f}_vs_rem29': stats(r[29], r[f]) for f in (30, 75, 119)}
r3 = {f: rd8(f'{O}/r03_{f}.png') for f in (0, 30, 31, 119)}
s150, s180 = rd8(f'{R}/SH03/F150.png'), rd8(f'{R}/SH03/F180.png')
res['sh03_decode_vs_src'] = {'rem0_vs_F150': stats(s150, r3[0]), 'rem30_vs_F180': stats(s180, r3[30])}
res['sh03_hold'] = {f'rem{f}_vs_rem30': stats(r3[30], r3[f]) for f in (31, 119)}
# 3 seam
rs08, rs01 = rd8(f'{O}/rs08.png'), rd8(f'{O}/rs01.png')
res['seam'] = {'png_F209_vs_SH01F0': stats(src08[209], src01), 'rem_F209_vs_rem_SH01F0': stats(rs08, rs01),
               'rem_F209_vs_png_F209': stats(src08[209], rs08), 'rem_SH01F0_vs_png_SH01F0': stats(src01, rs01),
               'rem_clip_last_F119(phase0)_vs_rem_SH01F0': stats(r[29], rs01), 'rem_clip_last_F119_vs_png_SH01F0': stats(src01, r[29]),
               'png_F119_vs_png_F209': stats(src08[119], src08[209])}
# 4 coin: mask region from Blender mask pass (F180); gold classifier calibrated on PNG pixels inside the mask
m180 = rd8(f'{R}/SH03_mask/F180.png'); m150 = rd8(f'{R}/SH03_mask/F150.png')
mk = lambda m: (np.clip(np.minimum(m[..., 0], m[..., 2]).astype(int) - m[..., 1], 0, 255) / 255.0) > 0.5
M180, M150 = mk(m180), mk(m150)
ys, xs = np.where(M180)
res['coin'] = {'mask_px_F150': int(M150.sum()), 'mask_px_F180': int(M180.sum()), 'bbox_F180': [int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())]}
x0, x1, y0, y1 = xs.min() - 12, xs.max() + 12, ys.min() - 12, ys.max() + 12
def gold(a):  # R>G>B warm saturated
    a = a.astype(int); return (a[..., 0] - a[..., 2] > 60) & (a[..., 0] > a[..., 1]) & (a[..., 1] > a[..., 2]) & (a[..., 0] > 120)
box = (slice(y0, y1), slice(x0, x1))
res['coin']['gold_in_box'] = {'png_F150': int(gold(s150)[box].sum()), 'png_F180': int(gold(s180)[box].sum()),
                              'rem_F150': int(gold(r3[0])[box].sum()), 'rem_F180': int(gold(r3[30])[box].sum()),
                              'rem_F180_inside_mask': int((gold(r3[30]) & M180).sum()), 'png_F180_inside_mask': int((gold(s180) & M180).sum())}
res['coin']['mean_abs_diff_in_mask_F180_png_vs_rem'] = float(np.abs(s180.astype(int) - r3[30].astype(int))[M180].mean())
res['coin']['mean_abs_diff_F150_vs_F180_in_mask_rem'] = float(np.abs(r3[0].astype(int) - r3[30].astype(int))[M180].mean())
# F150 coin area: pixels in the F180 mask region equal to wall interior (F150 shows nothing of the coin); gold in F150 over the whole frame
res['coin']['gold_whole_frame'] = {'rem_F150': int(gold(r3[0]).sum()), 'png_F150': int(gold(s150).sum())}
print('VERIFY', json.dumps(res, indent=1))
