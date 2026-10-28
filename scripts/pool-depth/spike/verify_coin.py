import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from analyze_testclips import rd8
R = 'assets/blender/pool-depth/renders/testclips'; O = 'out/pooldepth-test'
mk = lambda m: (np.clip(np.minimum(m[..., 0], m[..., 2]).astype(int) - m[..., 1], 0, 255) / 255.0) > 0.5
M = mk(rd8(f'{R}/SH03_mask/F180.png')); M150 = mk(rd8(f'{R}/SH03_mask/F150.png'))
p150, p180 = rd8(f'{R}/SH03/F150.png').astype(int), rd8(f'{R}/SH03/F180.png').astype(int)
d150, d180 = rd8(f'{O}/r03_0.png').astype(int), rd8(f'{O}/r03_30.png').astype(int)
n = int(M.sum())
like = lambda a: int((np.abs(a - p180).max(axis=2)[M] <= 16).sum())   # coin-like = within 16/255 of the PNG F180 coin pixel
out = {'mask_px_F150_blender': int(M150.sum()), 'mask_px_F180_blender': n,
       'coinlike_in_F180_mask': {'png_F180': like(p180), 'dec_F180': like(d180), 'png_F150': like(p150), 'dec_F150': like(d150)},
       'F180_mask_mean_color_png': p180[M].mean(axis=0).round(1).tolist(), 'F180_mask_mean_color_dec': d180[M].mean(axis=0).round(1).tolist(),
       'F150_same_region_mean_color_png': p150[M].mean(axis=0).round(1).tolist(), 'F150_same_region_mean_color_dec': d150[M].mean(axis=0).round(1).tolist()}
# strict criterion on the F150 decode: threshold the decode at the coin-colour band (mean +-3 sd of F180 PNG coin pixels, per channel) over the coin box
c = p180[M]; mu, sd = c.mean(axis=0), c.std(axis=0)
ys, xs = np.where(M); box = (slice(ys.min() - 15, ys.max() + 15), slice(xs.min() - 15, xs.max() + 15))
band = lambda a: int((np.abs(a - mu) <= 3 * sd + 6).all(axis=2)[box].sum())
out['coin_colour_band_px_in_box'] = {'png_F150': band(p150), 'dec_F150': band(d150), 'png_F180': band(p180), 'dec_F180': band(d180), 'band_mu': mu.round(1).tolist(), 'band_sd': sd.round(1).tolist()}
print('COIN', json.dumps(out, indent=1))
