#!/usr/bin/env python3
"""EDU-EP03-SHORT W5.3 sound stem (Editor, 5 Nov 2026): the whole non-narration sound as ONE 52.367 s stereo 48 kHz stem, per scene sheets SS-R3.1
("Sound" lines of scenes/*.md) on the composition clock (1571 f at 30 fps). Library sounds and the Draft generations are generated, not listened (measured only).
New sounds are filed in the library (edu3 generations, see build-notes); owner lines O1/O2 (store projects/EDU/narration/owner-o*.wav, Algenib) sit in the stem, trimmed per the sheet index.
Level reference: the placed narration plays at about -16 LUFS; beds sit 12-20 dB under it, one-shots are set by peak (dB re full scale).

Usage (numpy + soundfile, e.g. ~/Developer/reels-creator/out/voice-venv/bin/python):
  python -I scripts/edu-series/ep03/sound-mix.py <outDir>
Writes <outDir>/EDU-EP03-SHORT-sound-stem-v1.wav, <outDir>/mix-check.wav (placed narration + stem) and cues.json.
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf

SR, FPS, TOTAL = 48000, 30, 1571
LIB = os.path.expanduser('~/ReelsStore/library/sound/')
RAW = LIB + '_raw/'
ROOT = os.getcwd()
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
N = TOTAL * SR // FPS
fs = lambda f: int(round(f * SR / FPS))
db = lambda g: 10 ** (g / 20)


def load(path, a=0.0, b=None):
    """48 kHz stereo float; resampled through ffmpeg when needed; seconds window [a, b)."""
    x, sr = sf.read(path, always_2d=True)
    if sr != SR:
        r = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ar', str(SR), '-ac', str(x.shape[1]), '-'], capture_output=True, check=True).stdout
        x = np.frombuffer(r, '<f4').reshape(-1, x.shape[1]).astype(float)
    if x.shape[1] == 1: x = np.repeat(x, 2, 1)
    x = x[:, :2]
    return x[int(a * SR):(int(b * SR) if b else None)]


def onset(x, thr=-32):
    """Trim so the first sample is ~8 ms before the first frame louder than thr dB re peak (the file's attack lands on the cue frame)."""
    m = np.abs(x).max(1); lim = m.max() * db(thr)
    i = int(np.argmax(m > lim))
    return x[max(0, i - int(0.008 * SR)):]


def shape(x, peak=None, length=None, fade_out=0.04, fade_in=0.004):
    if length: x = x[:int(length * SR)]
    x = x.copy(); n = int(fade_in * SR); x[:n] *= np.linspace(0, 1, n)[:, None]
    n = min(int(fade_out * SR), len(x)); x[-n:] *= np.linspace(1, 0, n)[:, None]
    if peak is not None: x = x / (np.abs(x).max() + 1e-12) * db(peak)
    return x


def lowpass(x, hz):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', f'lowpass=f={hz}', '-f', 'f32le', '-'], input=x.astype('<f4').tobytes(), capture_output=True, check=True).stdout
    return np.frombuffer(r, '<f4').reshape(-1, 2).astype(float)


def curve(points):
    """Piecewise-linear dB curve over frames -> linear gain array; a gain of None = digital silence; two points on one frame = a step."""
    g = np.zeros(N); fr = np.arange(N) * FPS / SR
    pts = sorted(points, key=lambda p: p[0])
    lin = lambda d: 0.0 if d is None else db(d)
    for (f0, d0), (f1, d1) in zip(pts[:-1], pts[1:]):
        m = (fr >= f0) & (fr < f1)
        if not m.any(): continue
        if d0 is None or d1 is None: g[m] = np.linspace(lin(d0), lin(d1), m.sum())
        else: g[m] = db(np.interp(fr[m], [f0, f1], [d0, d1]))
    g[fr >= pts[-1][0]] = lin(pts[-1][1])
    return g


def tile(x, n):
    """Loop x to n samples with a 0.4 s equal-power crossfade at each seam."""
    cf = int(0.4 * SR); out = x[:cf].copy() * 0; out = np.zeros((0, 2)); cur = x.copy()
    while len(cur) < n + cf:
        t = np.linspace(0, np.pi / 2, cf)[:, None]
        cur = np.concatenate([cur[:-cf], cur[-cf:] * np.cos(t) + x[:cf] * np.sin(t), x[cf:]])
    return cur[:n]


mix = np.zeros((N, 2))
cues = []


def put(x, frame, gain_db=0.0, name='', pan=0.0):
    o = fs(frame); n = max(0, min(len(x), N - o))
    mix[o:o + n] += x[:n] * db(gain_db); cues.append({'cue': name, 'frame': frame, 'gain_db': gain_db, 'sec': round(len(x) / SR, 3)})


def bed(x, curve_pts, name):
    mix[:] += tile(x, N) * curve(curve_pts)[:, None]; cues.append({'cue': name, 'curve': curve_pts})



def rev(x): return x[::-1].copy()


def speed(x, k):
    """Resample by factor k (pitch and speed together), linear interpolation."""
    n = int(len(x) / k); i = np.arange(n) * k
    return np.stack([np.interp(i, np.arange(len(x)), x[:, c]) for c in (0, 1)], 1)


def pan(x, p):
    """p -1 left .. +1 right, constant-power."""
    a = (p + 1) * np.pi / 4
    return x * np.array([np.cos(a), np.sin(a)]) * np.sqrt(2)


def bed_at(x, pts, name):
    """Bed played on the composition clock (no restart), gated by a dB curve: keeps the groove through the gain moves."""
    mix[:] += tile(x, N) * curve(pts)[:, None]; cues.append({'cue': name, 'curve': pts})


# ---- music: guitar park bed (library, new, 105 bpm) on the composition clock. File is -14 LUFS; nominal -15 dB.
# O1 c164-216 and O2 c316-375: -6 dB dip; pad (B03 c466-729) replaces it; B05 c1061 returns; B06 lift c1224-1376; B07 settles.
guitar = load(LIB + 'music/bed/bed_edu3-park-guitar-105_01.wav')
g_pts = [(0, None), (6, -17), (150, -17), (154, -13), (164, -19), (216, -19), (222, -14), (312, -14), (316, -20), (376, -20), (380, -15), (454, -15), (484, None), (1061, None), (1062, -24), (1073, -15), (1204, -15), (1224, -15), (1262, -11), (1360, -11), (1376, -17), (1556, -17), (1563, -17), (1571, None)]
bed_at(guitar, g_pts, 'guitar bed (edu3-park-guitar-105)')
# pad under the flip and the diagram (B03-B04, c466-1073); near-silence c976-988 (the read's own pause, -12 dB), pad out by c1073
pad = load(LIB + 'music/bed/bed_warm-pad-felt-third_01.wav')
bed_at(pad, [(0, None), (466, None), (484, -20), (729, -20), (735, -24), (976, -24), (979, -36), (986, -36), (990, -24), (1061, -24), (1073, None)], 'pad (temp bed_warm-pad-felt-third_01) B03-B04')
# plucked line: temp = explainer bed low-passed, B04 c729-1061, same near-silence
pl = lowpass(load(LIB + 'music/bed/bed_curious-explainer-light_01.wav'), 2800)
bed_at(pl, [(0, None), (729, None), (745, -24), (976, -24), (979, -40), (986, -40), (990, -24), (1050, -24), (1066, None)], 'plucked line (temp bed_curious-explainer-light_01, low-passed 2.8 kHz) B04')

# ---- ambience: birds + breeze (library, new), normal view -30 dB; dog view low-passed and -6 dB (c466-1061, c1260-1365)
birds = load(LIB + 'ambience/outdoor/outdoor_park-birds-breeze_01.wav')
birds_lp = lowpass(birds, 1800)
bed_at(birds, [(0, -30), (466, -30), (478, None), (1061, None), (1068, -30), (1260, -30), (1266, None), (1365, None), (1372, -30), (1571, -30)], 'birds normal')
bed_at(birds_lp, [(0, None), (466, None), (478, -36), (1055, -36), (1068, None), (1260, None), (1266, -36), (1362, -36), (1372, None)], 'birds dog view (low-passed, -6 dB)')

# ---- owner lines (Algenib, store projects/EDU/narration/owner-o1.wav, owner-o2.wav), trimmed per the sheet index
OWN = os.path.expanduser('~/ReelsStore/projects/EDU/narration/')
put(shape(load(OWN + 'owner-o1.wav', 0.10, 1.85), fade_in=0.01, fade_out=0.03), 164, 0, 'O1 B02-SH01')
put(shape(load(OWN + 'owner-o2.wav', 0.25, 2.15), fade_in=0.01, fade_out=0.03), 316, 0, 'O2 B02-SH03')

L = lambda rel: load(LIB + rel)
sq = shape(onset(L('sfx/foley/foley_dog-ball-squeak_01.wav')), peak=-16)
put(sq, 30, 0, 'ball squeak B01-SH01 l30')
bark = shape(onset(L('sfx/creature/creature_dog-bark-happy_01.wav')), peak=-12, fade_out=0.08)
put(bark, 156, 0, 'bark B02-SH01 l6')
wh = shape(L('sfx/whoosh/whoosh_air-swish-rising_01.wav'), peak=-14)
put(wh, 160, 0, 'throw whoosh B02-SH01 l10'); put(wh, 1248, 0, 'throw whoosh B06-SH01 l44')
paws = onset(L('sfx/foley/foley_dog-paws-gallop-skid_01.wav'))
put(shape(paws, peak=-20, length=1.1, fade_out=0.5), 165, 0, 'paws fading out B02-SH01 l15')
put(shape(paws, peak=-14), 244, 0, 'paws + skid B02-SH02 l26-50')
thud = shape(onset(L('sfx/foley/foley_ball-thud-roll-grass_01.wav')), peak=-14, fade_out=0.1)
put(thud, 222, 0, 'ball thud/hit/roll B02-SH02 l4'); put(thud, 1264, 0, 'ball thud/hit/roll B06-SH02 l4')
sn = onset(L('sfx/creature/creature_dog-sniff-snuffle_01.wav'))
put(shape(sn, peak=-16, length=0.55, fade_out=0.1), 270, 0, 'sniff B02-SH02 l52')
put(shape(sn[int(0.7 * SR):], peak=-17, length=0.55, fade_out=0.1), 284, 0, 'sniff B02-SH02 l66')
put(shape(onset(L('sfx/creature/creature_dog-whine-puzzled_01.wav')), peak=-14, length=0.7, fade_out=0.2), 296, 0, 'puzzled whine B02-SH02 l78')
put(pan(shape(sn, peak=-26, length=0.5, fade_out=0.1), 0.7), 338, 0, 'off-screen sniff B02-SH03 l26 (panned right)')
shim = L('sfx/reveal/reveal_glass-shimmer-soft_01.wav')
put(shape(shim, peak=-10, fade_out=0.15), 466, 0, 'flip shimmer B03-SH01 l0')
put(shape(shim, peak=-14, length=0.8, fade_out=0.15), 1260, 0, 'short shimmer B06-SH02 l0')
sw = L('sfx/reveal/reveal_reverse-swell-airy_01.wav')
put(shape(sw, peak=-22, length=0.8, fade_out=0.2), 628, 0, 'soft swish B03-SH03 l0'); put(shape(sw, peak=-22, length=0.8, fade_out=0.2), 692, 0, 'soft swish B03-SH03 l64')
pop = L('sfx/ui/ui_pop_01.wav')
for f in (779, 789, 799, 841, 849): put(shape(pop, peak=-12), f, 0, 'cone pop B04-SH01')
for f in (807, 852): put(shape(speed(pop, 1.0595), peak=-12), f, 0, 'label pop (+1 semitone) B04-SH01')
put(shape(pop, peak=-10), 978, 0, 'bubble pop B04-SH02 l104')
put(shape(onset(L('sfx/foley/foley_chalk-scribble_01.wav')), peak=-14, length=0.4, fade_out=0.05), 958, 0, 'chalk cross-out B04-SH02 l84')
put(shape(rev(shim[:int(0.8 * SR)]), peak=-12, fade_in=0.1, fade_out=0.01), 1042, 0, 'reverse shimmer B04-SH02 l168 (peak at c1066)')
put(shape(rev(shim[:int(0.53 * SR)]), peak=-14, fade_in=0.1, fade_out=0.01), 1362, 0, 'reverse shimmer B06-SH02 l102 (peak at c1378)')
put(shape(sn, peak=-15, length=1.7, fade_out=0.15), 1065, 0, 'snuffles B05-SH01 l4')
put(shape(onset(L('sfx/foley/foley_dog-tail-thumps_01.wav')), peak=-16), 1160, 0, 'tail thumps B05-SH01 l99')
put(shape(sn[int(1.5 * SR):], peak=-14, length=0.5, fade_out=0.1), 1190, 0, 'happy snort B05-SH01 l129')
put(shape(onset(L('sfx/foley/foley_canvas-bag-flap_01.wav')), peak=-16), 1206, 0, 'bag flap B06-SH01 l2')
put(shape(speed(paws, 1.25), peak=-14, length=41 / FPS, fade_out=0.3), 1294, 0, 'paws gallop + skid B06-SH02 l34-75 (c1294-1335, SS-R3.2)')
put(shape(bark, peak=-8), 1356, 0, 'happy bark stinger B06-SH02 l96 (attack c1356, SS-R3.2)')

# ---- closing tag (W9, 2026-11-06, user: "closing music like EP02"): the same library file EP02 closes on, placed as EP02 places it
# (starts at the last word's end, peak -10 dB, bed stays under). EP02: 1.4 s + 0.6 s fade over its A_fade; here the hold is live (3.0 s), so 2.2 s with a 0.5 s fade,
# finished by c1548 (sheet: nothing starts after c1556; the hard restart at c0 hears no ring). Last word ends c1481 (49.365 s).
tagx = shape(load(LIB + 'sfx/stinger/stinger_pizz-tag-ending_01.wav'), peak=-10, length=2.2, fade_out=0.5)
put(tagx, 1482, 0, 'closing pizz tag stinger_pizz-tag-ending_01 (EP02 close) from c1482')

pk = np.abs(mix).max()
if pk > db(-1.0): mix *= db(-1.0) / pk
sf.write(f'{OUT}/EDU-EP03-SHORT-sound-stem-v1.wav', mix.astype('float32'), SR, subtype='PCM_24')
nar, _ = sf.read(ROOT + '/public/narration/EDU-EP03-SHORT.wav')
chk = mix + np.repeat(nar[:N, None], 2, 1)
sf.write(f'{OUT}/mix-check.wav', chk.astype('float32'), SR, subtype='PCM_24')
json.dump(cues, open(f'{OUT}/cues.json', 'w'), indent=1)
print('stem', N / SR, 's peak', round(20 * np.log10(np.abs(mix).max()), 2), 'dBFS; cues', len(cues))
