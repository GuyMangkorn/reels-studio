#!/usr/bin/env python3
"""W5.3 caption legibility with the stroke counted (ZCONDO2-SHORT-TH). Needs numpy, scipy and Pillow (`python3 -m venv V && V/bin/pip install numpy scipy pillow`; run with V/bin/python).
Usage: caption-contrast.py render [SHOT_SUBSTR...]     render the real caption frame (composition) and the plain plate frame for the sample frames of each cue -> out/zc2d/cc/
       caption-contrast.py measure [SHOT_SUBSTR...]    per shot: for every sampled frame, the halo metrics at the current peak and the faintest peak (0.01 steps) that passes
Rule ZC2-CAP-L1 (build-notes 'caption legibility rule'): G = the white caption glyph pixels (caption layer, luma >= 0.93); H = the halo, pixels within 12 px of G that are not G
(stroke, glow and bare plate, all counted as they are drawn). CR = 1.05 / (mean relative luminance of H + 0.05) (WCAG ratio, glyph white vs halo) must be >= 4.0 (5.0 on shots whose unshaded halo luma is >= 0.75: the brightest) on every sampled
frame, and the p90 display luma of H must be <= 0.60 (no light patch touching the letters). A frame at another shade peak q is synthesised from the two renders: the
shade (CaptionShade, colour 20,16,12, vertical profile of `lines`, solid across the text) is inverted and re-applied; caption pixels keep their alpha."""
import json, os, re, subprocess, sys
CR_MIN, CR_BRIGHT, BRIGHT_BG, P90_MAX, R = 4.0, 5.0, 0.75, 0.60, 12
D = os.environ.get('CC_DIR', 'out/zc2d/cc')
SRC = open('src/painted/zc2kit/draft-spec.tsx').read(); IDX = open('src/videos/zombie-condo2/index.ts').read()
at = {m[0]: (int(m[1]), int(m[2])) for m in re.findall(r"\{id: '(ZC2-B\d\d-SH\w+)', at: (\d+), n: (\d+)", IDX)}
cues, peak = {}, {}
for m in re.finditer(r"^  '(ZC2-B\d\d-SH\w+)': \{.*?cues: (\[[^\n]*?\]), peak: ([0-9.]+)", SRC, re.M | re.S): cues[m.group(1)] = json.loads(m.group(2)); peak[m.group(1)] = float(m.group(3))
capw = {k: int(v) for k, v in re.findall(r"'(ZC2-B\d\d-SH\w+)': (\d+)", re.search(r"CAP_W: Record<string, number> = \{(.*?)\};", SRC, re.S).group(1))}
two = set(re.findall(r"'(ZC2-B\d\d-SH\w+)'", re.search(r"TWO_LINE = new Set\(\[(.*?)\]\)", SRC).group(1)))
sel = [a for a in sys.argv[2:]]
def samples(sid):
    n = at[sid][1]; out = []
    for a, b in cues.get(sid, []):
        b = min(b, n); out += [a + 2, (a + b) // 2, b - 3]
    return sorted(set(out))
shots = [s for s in cues if (not sel or any(x in s for x in sel)) and cues[s]]
os.makedirs(D, exist_ok=True)
if sys.argv[1] == 'render':
    comp = sorted({at[s][0] + f for s in shots for f in samples(s)})
    subprocess.run(['node', 'scripts/render.mjs', 'ZCONDO2-SHORT-TH', '--stills', '--frames=' + ','.join(map(str, comp))], check=True, capture_output=True)
    jobs = []
    for s in shots:
        for f in samples(s):
            os.replace(f'out/ZCONDO2-SHORT-TH/stills/{at[s][0] + f}.png', f'{D}/{s[4:]}-{f}-A.png'); jobs.append(f'ZC2D-{s[4:]} {f} {D}/{s[4:]}-{f}-P.png')
    subprocess.run(['node', 'scripts/stills.mjs', 'src/painted/zc2kit/draft-index.ts'], input='\n'.join(jobs) + '\n', text=True, check=True, capture_output=True)
    print('rendered', len(jobs), 'pairs'); sys.exit()
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation
Y0, Y1 = 1040, 1290
yy, rr = np.arange(Y0, Y1), np.arange(-R, R + 1)
DISK = (rr[:, None] ** 2 + rr[None, :] ** 2) <= R * R
SMOOTH = lambda t: t * t * (3 - 2 * t)
def profile(lines):  # vertical shade shape k(y) of CaptionShade for lines 1|2, y in [Y0, Y1)
    t0, s0, s1, t1 = (1060, 1160, 1250, 1330) if lines == 1 else (970, 1076, 1250, 1330)
    k = np.where(yy < s0, SMOOTH(np.clip((yy - t0) / (s0 - t0), 0, 1)), np.where(yy <= s1, 1.0, 1 - SMOOTH(np.clip((yy - s1) / (t1 - s1), 0, 1))))
    return k[:, None, None]
SC = np.array([20, 16, 12], float) / 255
lin = lambda c: np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
luma = lambda a: 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
def load(p): return np.asarray(Image.open(p).convert('RGB').crop((0, Y0, 1080, Y1)), float) / 255
def metrics(S, G, H):
    Y = lin(S)[H] @ np.array([0.2126, 0.7152, 0.0722])
    return 1.05 / (Y.mean() + 0.05), float(np.percentile(luma(S)[H], 90))
def synth(fr, q):  # frame at shade peak q (shade k, unshaded plate bg, caption alpha cov)
    Pq = fr['bg'] * (1 - fr['k'] * q) + SC * fr['k'] * q
    return np.clip(fr['A'] + (Pq - fr['P']) * (1 - fr['cov']), 0, 1)
def worst(frs, q):
    w = [metrics(synth(f, q), f['G'], f['H']) for f in frs]
    return min(x[0] for x in w), max(x[1] for x in w)
rows = []
for s in shots:
    p0, ln = peak[s], 2 if s in two else 1; k = profile(ln); frs = []
    for f in samples(s):
        fa, fp = f'{D}/{s[4:]}-{f}-A.png', f'{D}/{s[4:]}-{f}-P.png'
        if not (os.path.exists(fa) and os.path.exists(fp)): continue
        A, P = load(fa), load(fp)
        cap = np.abs(A - P).max(-1) > 6 / 255
        G = cap & (luma(A) >= 0.93); H = binary_dilation(G, DISK) & ~G
        if G.sum() < 50: continue
        a0 = k * p0; bg = np.clip((P - SC * a0) / (1 - a0), 0, 1)
        cov = np.clip((luma(P) - luma(A)) / np.maximum(luma(P) - 0.05, 1e-3), 0, 1)[..., None]; cov = np.where(cap[..., None], cov, 0)
        frs.append(dict(f=f, A=A, P=P, bg=bg, cov=cov, k=k, G=G, H=H))
    if not frs: continue
    cur = worst(frs, p0); chosen = float('nan'); lo, hi = 0, 100
    bgm = float(np.mean([luma(f['bg'])[f['H']].mean() for f in frs])); need = CR_BRIGHT if bgm >= BRIGHT_BG else CR_MIN
    ok = lambda i: (lambda w: w[0] >= need and w[1] <= P90_MAX)(worst(frs, i / 100))
    if ok(100): 
        while lo < hi:
            mid = (lo + hi) // 2
            if ok(mid): hi = mid
            else: lo = mid + 1
        chosen = lo / 100
    fin = worst(frs, chosen) if chosen == chosen else (float('nan'),) * 2
    zero = worst(frs, 0.0)
    if os.environ.get('CC_DUMP'):  # crops of the frames at the chosen peak (CC_PEAK=x overrides), for the eye
        q = float(os.environ.get('CC_PEAK', chosen if chosen == chosen else p0)); os.makedirs(os.environ['CC_DUMP'], exist_ok=True)
        for f in frs: Image.fromarray((synth(f, q) * 255).round().astype('uint8')).save(f"{os.environ['CC_DUMP']}/{s[4:]}-{f['f']}-q{round(q * 100):02d}.png")
    rows.append((s, p0, chosen, cur, fin, bgm, zero)); print(f'{s[4:]:10s} peak {p0:.2f} -> {chosen:.2f}   CR at old peak {cur[0]:.2f}, at 0 {zero[0]:.2f} (p90 {zero[1]:.2f}), at new {fin[0]:.2f} (p90 {fin[1]:.2f})   unshaded halo bg luma {bgm:.2f}   frames {len(frs)}', flush=True)
json.dump({r[0]: {'old': r[1], 'new': r[2], 'cr_old': r[3][0], 'cr_new': r[4][0], 'p90_new': r[4][1], 'bg': r[5], 'cr_zero': r[6][0], 'p90_zero': r[6][1]} for r in rows}, open(f'{D}/result.json', 'w'), indent=1)
