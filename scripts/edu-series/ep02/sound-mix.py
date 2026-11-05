#!/usr/bin/env python3
"""EDU-EP02-SHORT W5.3 sound stem (Editor, 5 Nov 2026): the whole non-narration sound as ONE 59.033 s stereo 48 kHz stem, per scene sheets SS-R2
("Sound" lines of scenes/*.md) on the composition clock (1771 f at 30 fps). Library sounds and the Draft generations are generated, not listened (measured only).
Raw generations (audio-studio) live in $REELS_STORE/library/sound/_raw/edu2-*; cook vocal takes (Gemini TTS Aoede/Leda, out/edu02/vocal/) are cut by window below.
Level reference: the placed narration plays at about -16 LUFS; beds sit 12-20 dB under it, one-shots are set by peak (dB re full scale).

Usage (numpy + soundfile, e.g. ~/Developer/reels-creator/out/voice-venv/bin/python):
  python -I scripts/edu-series/ep02/sound-mix.py <outDir>
Writes <outDir>/EDU-EP02-SHORT-sound-stem-v1.wav, <outDir>/mix-check.wav (placed narration + stem) and cues.json.
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf

SR, FPS, TOTAL = 48000, 30, 1771
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


# ---- music bed: temp `bed_curious-explainer-light_01` (sheet: NEEDS-GEN comic pizzicato kitchen bed; temp per sheet). Level -13 dB re the file's -14 LUFS master = about -27 LUFS.
bed_x = load(LIB + 'music/bed/bed_curious-explainer-light_01.wav')
bed_pts = [(0, None), (20, -15), (116, -15), (122, -26), (160, -26), (172, -17), (266, -17), (272, None), (287, None), (293, -15), (324, -15), (339, -24), (630, -24), (640, -14), (775, -14), (779, None), (789, None), (795, -19), (875, -19), (885, -13), (1020, -13), (1024, -26), (1052, -26), (1060, -14), (1136, -14), (1140, -24), (1150, -24), (1155, -14), (1214, -14), (1218, -24), (1232, -24), (1238, -15), (1324, -15), (1326, None), (1358, None), (1364, -10), (1548, -10), (1556, -15), (1726, -15), (1771, None)]
bed(bed_x, bed_pts, 'music bed (temp: bed_curious-explainer-light_01)')

# ---- ambience: kitchen room tone + pot hiss (very low), out under the cell (c 324-630) and the eye macro (686-779)
for rel, g in (('ambience/room/room_soi-morning-quiet_01.wav', -34), ('ambience/room/room_pot-steam-hiss_01.wav', -40)):
    a = load(LIB + rel)
    pts = [(0, g), (324, g), (339, None), (630, None), (636, g), (686, g), (692, None), (779, None), (781, g), (1722, g), (1771, None)]
    bed(a, [(f, None if d is None else d) for f, d in pts], 'ambience ' + os.path.basename(rel))
# the wet cell bed (fiction, generated): c 324-630, low
cell = load(RAW + 'edu2-wet-cell-bed.wav')
bed(cell, [(0, None), (324, None), (339, -30), (600, -30), (630, None)], 'wet cell bed (generated)')

# ---- chop and onion foley (generated candidates: chop v1, knife-press v1, wet pops v1, bread v1, slice v2)
chop = shape(onset(load(RAW + 'edu2-chop-wood_v1.wav')), peak=-7, length=0.45)
tok = shape(onset(load(RAW + 'edu2-chop-wood_v2.wav')), peak=-16, length=0.25)
put(chop, 122, 0, 'chop B01-SH03 l6')
put(tok, 170, 0, 'whole-onion tok B02-SH01 l10')
put(shape(onset(load(RAW + 'edu2-knife-press_v1.wav')), peak=-8, length=0.9), 304, 0, 'knife press B02-SH02 l20')
pops = onset(load(RAW + 'edu2-wet-pops_v1.wav'))
put(shape(pops, peak=-9, length=0.5), 472, 0, 'wet pop (tear) B03-SH02 l14')
put(shape(pops, peak=-12, length=0.4), 475, 0, 'wet pop (sac) B03-SH02 l17')
for f in (488, 498, 507): put(shape(pops[:int(0.3 * SR)], peak=-18, length=0.2), f, 0, 'small pop')
for base, fl, g in ((779, (12, 30, 48, 66, 84), -14), (928, (10, 28, 46, 64, 82), -14), (1050, (40, 58, 76), -14), (1186, (0, 14), -14), (1355, (6, 24, 42, 60), -14), (1686, (12, 42, 72), -7)):
    for l in fl: put(chop, base + l, g, f'chop tick c{base + l}')
put(shape(onset(load(RAW + 'edu2-bread-crunch_v1.wav')), peak=-8, length=0.5), 932, 0, 'bread crunch B05-SH02 l4')
put(shape(onset(load(RAW + 'edu2-match-strike_v1.wav')), peak=-9, length=1.2), 1056, 0, 'match B05-SH03 l6')
put(shape(onset(load(RAW + 'edu2-goggle-snap_v2.wav')), peak=-6, length=0.5), 1326, 0, 'goggle strap snap B06-SH02 l24')
put(shape(onset(load(RAW + 'edu2-slice-stroke_v2.wav')), peak=-12, length=2.0, fade_out=0.15), 1454, 0, 'slice stroke B06-SH04 l31')
put(shape(onset(load(RAW + 'edu2-chalk-scribble_v1.wav')), peak=-18, length=0.6), 1638, 0, 'chalk B07-SH02 l32')

# ---- water and air (library + generated)
put(shape(load(LIB + 'sfx/reveal/reveal_reverse-swell-airy_01.wav'), peak=-12), 566, 0, 'reverse swell B03-SH03 l44')
put(shape(load(LIB + 'sfx/whoosh/whoosh_air-swish-rising_01.wav'), peak=-14), 654, 0, 'air swish B04-SH01 l24')
tick = load(LIB + 'sfx/ui/ui_click-tick_01.wav')
for f in (716, 726, 735): put(shape(tick, peak=-12), f, 0, 'nerve flick tick B04-SH02')
gush = onset(load(RAW + 'edu2-tear-gush_v2.wav'))
put(shape(gush, peak=-14, length=1.4, fade_out=0.2), 731, 0, 'tear gush B04-SH02 l48')
put(shape(gush[int(1.4 * SR):], peak=-26, length=2.0, fade_in=0.3, fade_out=0.4), 789, 0, 'tear trickle B04-SH03') if len(gush) > int(2.0 * SR) else None
put(shape(load(LIB + 'sfx/ui/ui_pop_01.wav'), peak=-12), 913, 0, 'ui pop B05-SH01 l38')
put(shape(load(LIB + 'sfx/foley/foley_fridge-seal-pop_01.wav'), peak=-12), 1154, 0, 'fridge seal pop B05-SH04 l0')
fh = load(LIB + 'ambience/room/room_shop-fridge-hum_01.wav')
mix[fs(1154):fs(1186)] += fh[:fs(1186) - fs(1154)] * db(-30) * curve([(0, None), (1154, -30), (1184, -30), (1186, None)])[fs(1154):fs(1186), None] / db(-30)
put(shape(load(LIB + 'sfx/foley/foley_fridge-seal-thump_01.wav'), peak=-12), 1186, 0, 'fridge thump B05-SH05 l0')
put(shape(load(LIB + 'sfx/instrument/pluck/pluck_soft-note-03_01.wav') if False else load(LIB + 'instrument/pluck/pluck_soft-note-03_01.wav'), peak=-16), 357, 0, 'pluck B03-SH01 l33')
put(shape(load(LIB + 'instrument/pluck/pluck_soft-note-05_01.wav'), peak=-16), 381, 0, 'pluck B03-SH01 l57')

# ---- stings in the gaps (generated music candidates, trimmed to the gap plus a short tail)
put(shape(onset(load(RAW + 'edu2-wahwah-sting_v1.wav')), peak=-8, length=0.85, fade_out=0.12), 1024, 0, 'wah-wah sting B05-SH02 (G4 21 f)')
shrug = shape(onset(load(RAW + 'edu2-shrug-sting_v1.wav')), peak=-12, length=0.4, fade_out=0.1)
put(shrug, 1139, 0, 'shrug sting B05-SH03 (G5 9 f)'); put(shrug, 1218, 0, 'shrug sting B05-SH05 (G6 9 f)')
put(shape(onset(load(RAW + 'edu2-toy-alarm_v1.wav')), peak=-12, length=0.7, fade_out=0.15), 1728, 0, 'toy alarm B07-SH03 l42')
tag = shape(load(RAW + 'edu2-pizz-tag_v2.wav'), peak=-10, length=1.4, fade_out=0.6)
put(tag, 1726, 0, 'pizz tag from c1726 (fades with the picture)')

# ---- cook vocal takes (Gemini TTS, out/edu02/vocal/; windows chosen on the 50 ms envelope)
V = ROOT + '/out/edu02/vocal/'
wail = shape(load(V + 'wail-Aoede.wav', 0.50, 1.55), peak=-8, fade_out=0.08, fade_in=0.01)
put(wail, 125, 0, 'cook wail-sob B01-SH03 l9 (G1 48 f, take Aoede 0.50-1.55 s)')
put(shape(load(V + 'sniff-Aoede.wav', 0.17, 0.42), peak=-10, fade_in=0.01), 162, 0, 'cook sniff B02-SH01 l2')
put(shape(lowpass(load(V + 'sob-Aoede.wav', 0.20, 0.70), 1400), peak=-10, fade_in=0.01), 964, 0, 'muffled sob (lowpass 1.4 kHz) B05-SH02 l36')

pk = np.abs(mix).max()
if pk > db(-1.0): mix *= db(-1.0) / pk
sf.write(f'{OUT}/EDU-EP02-SHORT-sound-stem-v1.wav', mix.astype('float32'), SR, subtype='PCM_24')
nar, _ = sf.read(ROOT + '/public/narration/EDU-EP02-SHORT.wav')
chk = mix + np.repeat(nar[:N, None], 2, 1) * db(-3)
sf.write(f'{OUT}/mix-check.wav', chk.astype('float32'), SR, subtype='PCM_24')
json.dump(cues, open(f'{OUT}/cues.json', 'w'), indent=1)
print('stem', N / SR, 's peak', round(20 * np.log10(np.abs(mix).max()), 2), 'dBFS; cues', len(cues))
