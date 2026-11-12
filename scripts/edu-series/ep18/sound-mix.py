#!/usr/bin/env python3
"""EDU-EP18-SHORT sound mix (Editor, W5.3 half-size draft, 2026-11-12): places the 46 cues of scripts/edu-series/ep18/sound-cues.json (ROWS-R2.2 frames, 1468 f, 48 kHz)
and writes per-layer stems (voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep18/sound-cues.json`, plus the baked sound stem
public/audio/edu/EDU-EP18-SHORT-draft-stem-v1.wav (bed + texture + accent; narration is its own track). Levels are `dV` = LU under the voice (-16 LUFS read) while it speaks; each file is
measured here (integrated LUFS for beds/loops, 400 ms momentary max for hits, as scripts/mix-levels.py reads them) and set to dV. Beds are ducked 6 dB while the voice speaks.
Stems are stereo: every layer is a mono sum written as 0.707 per channel (same loudness as the mono voice stem) except the K1 ball swish, panned left to right. Seams and offsets per the cue sheet
(W1 loop starts after the quiet head, A2/A1 long crossfades, S3 trimmed 0.006 s, S1 inSec 0.35, H1/B1/H2/P1 sync offsets, SL transient on f1356, F1 low shelf from f610).
Nothing here was listened: levels are by number. Needs public/narration/EDU-EP18-SHORT-narration-v1.wav (narration-place.py) and the public/ sounds locked (lock-sounds.sh). Run: python3 -I scripts/edu-series/ep18/sound-mix.py"""
import array, glob, json, math, os, re, subprocess, tempfile, wave
TOTAL, FPS, SR = 1468, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
db = lambda x: 10 ** (x / 20)
VOICE = -16.0
Z = lambda: array.array('f', bytes(4 * N))
bed, tex, acc, pnL, pnR = Z(), Z(), Z(), Z(), Z()

def load(rel, ss=0.0, t=None, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', 'public/' + rel, '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else '')] + ['-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
def wav(path):
    w = wave.open(path); a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
VOICE_PATH = 'public/narration/EDU-EP18-SHORT-narration-v1.wav'
voice = wav(VOICE_PATH)
assert len(voice) == N, ('voice file is %d samples, the ROWS-R2.2 mix needs %d (re-run narration-place.py)' % (len(voice), N))
# ---- voice activity -> duck envelope (10 ms blocks; speaking = 20 ms rms above -46 dBFS, held 0.3 s; 60 ms attack / 300 ms release)
B = SR // 100; nb = N // B
speak = []
for i in range(nb):
    seg = voice[i * B:(i + 2) * B]; r = math.sqrt(sum(x * x for x in seg) / max(1, len(seg))) / 32768
    speak.append(r > db(-46))
held = [False] * nb; last = -999
for i in range(nb):
    if speak[i]: last = i
    held[i] = i - last <= 30
duck = []; cur = 1.0; lo = db(-6)
for i in range(nb):
    tgt = lo if held[i] else 1.0; k = 1 - math.exp(-1 / (6 if tgt < cur else 30)); cur += (tgt - cur) * k; duck.append(cur)
def apply_duck(tr):
    for i in range(nb):
        g = duck[i]
        for j in range(i * B, (i + 1) * B): tr[j] *= g

def env(points):
    """piecewise-linear dB envelope over global frames -> function(sample index) -> dB."""
    pts = [(F(f), d) for f, d in points]; k = [0]
    def g(j):
        if j <= pts[0][0]: return pts[0][1]
        if j >= pts[-1][0]: return pts[-1][1]
        while pts[k[0] + 1][0] < j: k[0] += 1
        (a, x), (b, y) = pts[k[0]], pts[k[0] + 1]; return x + (y - x) * (j - a) / (b - a)
    return g
def ramp(points):
    e = env(points); return lambda j: db(e(j))
def loopfill(snd, n, xf=0.4):
    """loop `snd` to n samples with a linear crossfade of xf s at the joins."""
    x = int(xf * SR); out = array.array('f', bytes(4 * n)); pos = 0; L = len(snd)
    while pos < n:
        for i in range(L):
            j = pos + i
            if j >= n: break
            w = 1.0
            if pos > 0 and i < x: w = i / x
            if pos + L - x < n and i >= L - x: w = (L - i) / x if pos + L < n + x else 1.0
            out[j] += snd[i] * w
        pos += L - x
    return out
def put(track, snd, f0, f1, gfun, fade_in=0.004, fade_out=0.004):
    s0, s1 = F(f0), min(F(f1), N); fi = max(1, int(fade_in * SR)); fo = max(1, int(fade_out * SR))
    for j in range(max(0, s0), s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * gfun(j) * min(1.0, (k + 1) / fi, (s1 - j) / fo)
def bedtrack(track, snd, f0, f1, dBpts, xf=0.4, fade_in=0.004, fade_out=0.004, loop=True):
    n = F(f1) - F(f0); s = loopfill(snd, n, xf) if loop else snd
    put(track, s, f0, f1, ramp(dBpts), fade_in, fade_out)
def shot(track, snd, f, dB, fin=0.002, fout=0.02, until=None, pan=None):
    """one-shot at frame f (float ok). pan = function(k sample in file) -> -1..1 (constant power, writes pnL/pnR instead of `track`)."""
    g = db(dB); s = F(f); n = len(snd); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR)); end = F(until) if until else N
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end):
            v = snd[k] * g * min(1.0, (k + 1) / fi, (n - k) / fo, (end - j) / fo)
            if pan is None: track[j] += v
            else:
                th = (pan(k) + 1) * math.pi / 4; pnL[j] += v * math.cos(th); pnR[j] += v * math.sin(th)
def rate_ramp(snd, r0, r1, n=None):
    """read `snd` with playback rate going linearly r0 -> r1 (pitch/speed glide) for n output samples; linear interpolation."""
    n = n or len(snd); out = array.array('f', bytes(4 * n)); p = 0.0
    for i in range(n):
        r = r0 + (r1 - r0) * i / max(1, n - 1); a = int(p)
        if a + 1 >= len(snd): break
        fr = p - a; out[i] = snd[a] * (1 - fr) + snd[a + 1] * fr; p += r
    return out

CUES = json.load(open('scripts/edu-series/ep18/sound-cues.json'))['cues']
# sound id of every cue, written out so scripts/sound-cues.py can read the placement from this source
IDS = {
    'B01-A1': 'weather_tin-awning-rain-alley_01.wav', 'B01-A2': 'city_soi-floor-rain-puddle_01.wav', 'B01-W1': 'creature_mosquito-whine-circling_01.wav',
    'B01-FS': 'foley_flipflop-run-wet_01.wav', 'B01-S1': 'whoosh_shrink-zip-pop_01.wav', 'B01-A3': 'weather_giant-rain-slowed-hush_01.wav',
    'B01-W2': 'creature_mosquito-wingbeat-slowed_01.wav', 'B01-M0': 'tone_bowed-bass-swell_01.wav', 'B01-D1': 'water_mass-descend-wobble_01.wav',
    'B01-H1': 'water_drop-swallow-gloomp_01.wav', 'B01-W2-back': 'creature_mosquito-wingbeat-slowed_01.wav', 'B01-D1-close': 'water_mass-descend-wobble_01.wav',
    'B01-B1': 'foley_brass-balance-settle_01.wav', 'B01-M1-thin': 'bed_kalimba-curious-thin_01.wav', 'B02-H2': 'impact_water-whump-soft_01.wav',
    'B02-F1': 'whoosh_falling-air-rush-steady_01.wav', 'B02-W2-muffled': 'creature_mosquito-wingbeat-slowed_01.wav', 'B02-M1-relief': 'bed_kalimba-curious-relief_01.wav',
    'B02-M1-bright': 'bed_kalimba-curious-bright_01.wav', 'B02-A1-insert': 'weather_tin-awning-rain-alley_01.wav', 'B02-K1': 'whoosh_air-swish-rising_01.wav',
    'B02-KF': 'foley_feather-flutter-tiny_01.wav', 'B02-S4': 'reveal_light-air-riser_01.wav', 'B04-M1b': 'tension_pizz-ostinato-tick_01.wav',
    'B04-T1': 'ui_wood-tick-fine_01.wav', 'B04-T1-b': 'ui_wood-tick-fine_02.wav', 'B04-T1-c': 'ui_wood-tick-fine_03.wav', 'B04-T1-d': 'ui_wood-tick-fine_04.wav',
    'B04-T1-20': 'ui_glass-tick-soft_01.wav', 'B04-F1-if': 'whoosh_falling-air-rush-steady_01.wav', 'B04-H3': 'water_small-cold-tap_01.wav',
    'B05-S3': 'reveal_rewind-whirr_01.wav', 'B05-H1-replay': 'water_drop-swallow-gloomp_01.wav', 'B05-F1-replay': 'whoosh_falling-air-rush-steady_01.wav',
    'B05-M1-thin': 'bed_kalimba-curious-thin_01.wav', 'B05-M1-relief': 'bed_kalimba-curious-relief_01.wav', 'B05-S5': 'water_film-slide-off-shlip_02.wav',
    'B05-W2-flyoff': 'creature_mosquito-wingbeat-slowed_01.wav', 'B05-P1': 'water_puddle-splash-below_01.wav', 'B05-S2': 'whoosh_snapback-rumble-zip_01.wav',
    'B05-A1': 'weather_tin-awning-rain-alley_01.wav', 'B05-A2': 'city_soi-floor-rain-puddle_01.wav', 'B05-W1': 'creature_mosquito-whine-circling_01.wav',
    'B05-SL': 'foley_palm-ankle-slap_01.wav', 'B05-E1': 'comedy_kalimba-nope-gc_01.wav', 'B05-tag': 'stinger_pizz-tag-ending_01.wav',
}
assert all(IDS[c['cue']] == c['id'] + '.wav' for c in CUES) and len(IDS) == len(CUES), 'IDS out of date with the cue sheet'
def path_of(i):
    g = glob.glob('public/**/' + i + '.wav', recursive=True); assert g, i; return g[0][len('public/'):]
by = {c['cue']: c for c in CUES}
def S(cue, **kw): return load(path_of(by[cue]['id']), **kw)
_m = {}
def meas(cid, snd, kind):
    """kind 'I' integrated LUFS or 'M' momentary max with 0.4 s silence either side (what mix-levels reads)."""
    k = (cid, kind)
    if k in _m: return _m[k]
    pad = array.array('f', bytes(4 * int(0.4 * SR))); data = (pad + snd + pad) if kind == 'M' else snd
    with tempfile.TemporaryDirectory() as tmp:
        mf = os.path.join(tmp, 'm.txt')
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', "ebur128=metadata=1,ametadata=print:key=lavfi.r128.M:file='%s'" % mf, '-f', 'null', '-'], input=data.tobytes(), capture_output=True)
        txt = r.stderr.decode(errors='replace'); ms = [float(v) for v in re.findall(r'lavfi\.r128\.M=(-?[\d.]+)', open(mf).read().replace('-inf', '-120'))]
        I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', txt)[-1])
    _m[k] = I if kind == 'I' else max(ms); return _m[k]
LOG = []
def lvl(cid, snd, dV, kind, peak=-3.0):
    ref = meas(cid, snd, kind); g = (VOICE - dV) - ref
    pk = max(abs(x) for x in snd) or 1e-6; g = min(g, peak - 20 * math.log10(pk))
    LOG.append('%-16s %s ref %6.1f dV %5.1f gain %+5.1f dB' % (cid, kind, ref, dV, g)); return g
DUCK = 6.0
def sl(a, s0, s1): return a[int(s0 * SR):int(s1 * SR)]
# ================= dV targets (LU under the voice while it speaks); edit here after mix-levels
DV = {'A1': 22, 'A2': 22, 'A3': 21, 'A1ins': 28, 'M0': 22, 'M1': 20, 'F1': 23, 'M1b': 24, 'A1b': 24, 'A2b': 24,
      'W1': 22, 'W2': 22, 'W2m': 28, 'W2f': 23,
      'FS': 14, 'D1': 16, 'H1': 13, 'B1': 14, 'K1': 14, 'KF': 16, 'S4': 14, 'T1': 18, 'T120': 14, 'H3': 18, 'S3': 14, 'H1r': 19, 'S5': 17,
      'S1': 3.5, 'H2': -2, 'P1': 0, 'S2': 0, 'SL': 0, 'E1': 0, 'tag': 0}
EOT = TOTAL
# ================= BED layer (ambience + music), ducked under the voice
a1 = S('B01-A1'); a1g = lvl('B01-A1', a1, DV['A1'], 'I') + DUCK
bedtrack(bed, a1, 0, 50, [(0, a1g), (38, a1g), (50, a1g - 24)], xf=0.8, fade_out=0.0005)                       # full level, smeared out by S1, gone at the f50 cut
a2 = S('B01-A2'); a2g = lvl('B01-A2', a2, DV['A2'], 'I') + DUCK
bedtrack(bed, a2, 0, 50, [(0, a2g), (38, a2g), (50, a2g - 24)], xf=1.0, fade_out=0.0005)
# A3: -6 dB under SH06 (f248-324), -30 dB over SH07 +0..+14 (f324-339), low-passed 500 Hz and -4 dB in SH15 (f866-980), hard off at f980
a3 = S('B01-A3'); a3lp = S('B01-A3', af='lowpass=f=500'); a3g = lvl('B01-A3', a3, DV['A3'], 'I') + DUCK
n3 = F(980) - F(50); base, lpv = loopfill(a3, n3, 0.5), loopfill(a3lp, n3, 0.5); mix3 = array.array('f', base)
for i in range(n3):
    wgt = min(1.0, max(0.0, (i * FPS / SR + 50 - 862) / 8))
    if wgt: mix3[i] = base[i] * (1 - wgt) + lpv[i] * wgt
put(bed, mix3, 50, 980, ramp([(50, a3g - 40), (62, a3g), (244, a3g), (252, a3g - 6), (320, a3g - 6), (324, a3g - 30), (339, a3g - 30), (354, a3g), (866, a3g), (872, a3g - 4), (979, a3g - 4), (980, -60)]), 0.3, 0.0005)
m0 = S('B01-M0'); m0g = lvl('B01-M0', m0, DV['M0'], 'I') + DUCK
bedtrack(bed, m0, 66, 132, [(66, m0g), (132, m0g)], loop=False, fade_in=0.2, fade_out=0.15)
m1t = S('B01-M1-thin'); m1g = lvl('B01-M1-thin', m1t, DV['M1'], 'I') + DUCK
bedtrack(bed, m1t, 281, 324, [(281, m1g), (324, m1g)], loop=False, fade_in=0.05, fade_out=0.08)                    # phrase end at f324 (near-silence follows)
m1r = S('B02-M1-relief'); m1b = S('B02-M1-bright')
bedtrack(bed, m1r, 386, 503, [(386, m1g), (503, m1g)], loop=False, fade_in=0.1, fade_out=0.05)
bedtrack(bed, m1b, 503, 594, [(503, m1g), (594, m1g)], loop=False, fade_in=0.05, fade_out=0.06)                     # plays to its phrase end f594, stops clean
a1i = S('B02-A1-insert', af='lowpass=f=900'); a1ig = lvl('B02-A1-insert', a1i, DV['A1ins'], 'I') + DUCK
bedtrack(bed, a1i, 503, 549, [(503, a1ig), (549, a1ig)], xf=0.5, fade_in=0.05, fade_out=0.05)
# F1: -12 dB at f359, -6 in SH09-SH11, 0 with +4 dB low shelf from f610 (SH12 +3), -4 in SH14, 8 f room tail after the freeze (f823)
f1 = S('B02-F1'); f1sh = S('B02-F1', af='bass=g=4:f=300'); f1g = lvl('B02-F1', f1, DV['F1'], 'I') + DUCK
nf = F(831) - F(359); fb, fs_ = loopfill(f1, nf, 0.5), loopfill(f1sh, nf, 0.5); mixf = array.array('f', fb)
for i in range(nf):
    wgt = min(1.0, max(0.0, (i * FPS / SR + 359 - 607) / 3))
    if wgt: mixf[i] = fb[i] * (1 - wgt) + fs_[i] * wgt
put(bed, mixf, 359, 831, ramp([(359, f1g - 12), (420, f1g - 12), (428, f1g - 6), (603, f1g - 6), (610, f1g), (754, f1g), (760, f1g - 4), (823, f1g - 4), (831, f1g - 40)]), 0.1, 0.0005)
f1i = S('B04-F1-if'); put(bed, loopfill(f1i, F(980) - F(866), 0.5), 866, 980, ramp([(866, f1g - 8), (978, f1g - 1), (979.5, f1g - 1), (980, -60)]), 0.1, 0.0005)
m1bo = S('B04-M1b', t=222 / FPS); mbg = lvl('B04-M1b', m1bo, DV['M1b'], 'I') + DUCK
bedtrack(bed, m1bo, 758, 980, [(758, mbg - 3), (860, mbg), (870, mbg + 3), (979, mbg + 3), (980, -60)], loop=False, fade_in=0.15, fade_out=0.0005)   # plays through the freeze, +3 dB over SH15, hard off f980
f1r = S('B05-F1-replay'); put(bed, loopfill(f1r, F(1167) - F(1005), 0.5), 1005, 1167, ramp([(1005, f1g - 8 - 12), (1020, f1g - 8), (1147, f1g - 8), (1167, f1g - 8 - 40)]), 0.05, 0.0005)   # F4-E17: fall-away ramp f1147-f1167, -40 dB at the SH17 touch, off there
m1t2 = S('B05-M1-thin'); m1r2 = S('B05-M1-relief')
bedtrack(bed, m1t2, 1007, 1095, [(1007, m1g - 2), (1095, m1g - 1)], loop=False, fade_in=0.1, fade_out=0.05)
bedtrack(bed, m1r2, 1095, 1183, [(1095, m1g - 3), (1182, m1g)], loop=False, fade_in=0.05, fade_out=0.0005)            # hard stop f1183 (the splash cut)
# ending ambience: A1/A2 back at full by f1198, A2 plops +2 dB from f1262, both fade over f1438-f1467 with the strings tag
a1b = S('B05-A1'); a1bg = lvl('B05-A1', a1b, DV['A1b'], 'I') + DUCK
bedtrack(bed, a1b, 1183, EOT, [(1183, a1bg - 40), (1198, a1bg), (1438, a1bg), (1467, -60)], xf=1.0, fade_in=0.004, fade_out=0.0005)
a2b = S('B05-A2'); a2bg = lvl('B05-A2', a2b, DV['A2b'], 'I') + DUCK
bedtrack(bed, a2b, 1183, EOT, [(1183, a2bg - 40), (1198, a2bg), (1260, a2bg), (1266, a2bg + 2), (1438, a2bg + 2), (1467, -60)], xf=1.0, fade_in=0.004, fade_out=0.0005)

# ================= TEXTURE layer (W1 whine, W2 wingbeat): start inside the file after the quiet head (head -32 vs tail -15.7 dB), crossfade 0.5 s
def w1clip(): return S('B01-W1', ss=1.0)
w1 = w1clip(); w1g = lvl('B01-W1', w1, DV['W1'], 'I')
put(tex, loopfill(w1, F(50), 0.5), 0, 50, ramp([(0, w1g), (38, w1g), (50, w1g - 24)]), 0.004, 0.0005)
w1b = w1clip(); n = F(1430) - F(1193)
put(tex, loopfill(w1b, n, 0.5), 1193, 1430, ramp([(1193, w1g - 20), (1203, w1g), (1383, w1g), (1395, w1g + 12), (1410, w1g + 12), (1430, -60)]), 0.1, 0.0005)   # rises f1391-f1410 (whine alone), under the tag
w2 = S('B01-W2'); w2g = lvl('B01-W2', w2, DV['W2'], 'I')
w2a = loopfill(w2, F(167) - F(50), 0.3)
tail0 = F(153) - F(50); tail = rate_ramp(w2a[tail0:], 1.0, 0.9, len(w2a) - tail0)                                          # f153-167: falls away slightly in pitch with the mosquito
for i in range(len(tail)): w2a[tail0 + i] = tail[i]
put(tex, w2a, 50, 167, ramp([(50, w2g - 30), (58, w2g), (153, w2g), (167, w2g - 30)]), 0.05, 0.05)
put(tex, loopfill(w2, F(324) - F(176), 0.3), 176, 324, ramp([(176, w2g - 30), (190, w2g), (320, w2g), (324, -60)]), 0.05, 0.003)   # out at f324: near-silence before W-HIT
w2m = S('B02-W2-muffled', af='lowpass=f=600'); w2mg = lvl('B02-W2-muffled', w2m, DV['W2m'], 'I')
put(tex, loopfill(w2m, F(420) - F(359), 0.3), 359, 420, ramp([(359, w2mg), (420, w2mg)]), 0.1, 0.1)
w2f = rate_ramp(loopfill(w2, F(1183) - F(1149), 0.3), 1.0, 0.85); w2fg = lvl('B05-W2-flyoff', w2f, DV['W2f'], 'I')
put(tex, w2f, 1149, 1183, ramp([(1149, w2fg), (1170, w2fg), (1182, w2fg - 30)]), 0.02, 0.0005)

# ================= ACCENT layer: one-shots placed at their cue frame (sync offsets from the cue sheet)
def A(cue, key, kind='M', dB_extra=0.0, **kw):
    s = S(cue, **kw.pop('load', {})); g = lvl(cue, s, DV[key], kind) + dB_extra; return s, g
s, g = A('B01-FS', 'FS'); shot(acc, s, 3.2, g, fout=0.05)                                       # steps at 0.01/0.36/0.71 s: the middle step on f14 (3.5 / 14.0 / 24.5)
s, g = A('B01-S1', 'S1', load={'ss': 0.35}); shot(acc, s, 38, g, fout=0.04)                       # inSec 0.35: the pop (0.74 s in the file) lands f50
s, g = A('B01-D1', 'D1', load={'t': 3.0}); shot(acc, s, 74, g, fout=0.15, until=164)
s, g = A('B01-D1-close', 'D1', dB_extra=3.0, load={'ss': 2.0, 't': 40 / FPS}); shot(acc, s, 222, g, fout=0.06, until=262)
s, g = A('B01-H1', 'H1'); shot(acc, s, 153 - 0.17 * FPS, g, fout=0.05)                            # gloomp event 0.17 s into the file
s, g = A('B01-B1', 'B1'); shot(acc, s, 252 - 0.15 * FPS, g, fout=0.05)
s, g = A('B02-H2', 'H2'); shot(acc, s, 339 - 0.14 * FPS, g, fout=0.1)
k1 = S('B02-K1'); k1g = lvl('B02-K1', k1, DV['K1'], 'M')
shot(acc, k1, 509, k1g, fout=0.04, pan=lambda k: -0.85 + 1.7 * min(1.0, max(0.0, (k / SR - 0.45) / 0.40)))   # peak 0.5 s in = f524; ball moves left to right (the file is right-heavy)
s, g = A('B02-KF', 'KF'); shot(acc, s, 526, g, fout=0.05)
s, g = A('B02-S4', 'S4'); shot(acc, s, 610 - len(s) * FPS / SR, g, fout=0.0005, until=610)         # riser stops dead on f610
for cue, locs in (('B04-T1', (0, 22, 43)), ('B04-T1-b', (5, 27, 49)), ('B04-T1-c', (11, 32, 54)), ('B04-T1-d', (16, 38, 59))):
    s, g = A(cue, 'T1')
    for L in locs: shot(acc, s, 758 + L, g, fout=0.01)
s, g = A('B04-T1-20', 'T120'); shot(acc, s, 823, g, fout=0.02)
s, g = A('B04-H3', 'H3'); shot(acc, s, 916, g, fout=0.05)                                         # optional; quiet (18 LU under) so it does not mask "ใกล้"
s3 = S('B05-S3'); s3 = s3[:int(13 * SR / FPS)]; s3g = lvl('B05-S3', s3, DV['S3'], 'M'); shot(acc, s3, 992, s3g, fout=0.002, until=1005)   # trimmed to its 13 f slot (0.006 s)
s, g = A('B05-H1-replay', 'H1r'); shot(acc, s, 1005 - 0.17 * FPS, g, fout=0.05)                   # H1 again, -6 dB under H1 at the same file sync (gain via dV)
s, g = A('B05-S5', 'S5'); shot(acc, s, 1129, g, fout=0.05)
s, g = A('B05-P1', 'P1'); shot(acc, s, 1167 - 0.05 * FPS, g, fout=0.1)   # F4-E17: transient (0.06 s) on the touch f1167 (SH17 +72); the 1.0 s tail runs across the f1183 cut under S2
s, g = A('B05-S2', 'S2'); shot(acc, s, 1183, g, fout=0.05)
s, g = A('B05-SL', 'SL', load={'af': 'alimiter=level_in=3:limit=0.5:attack=0.5:release=15:level=0'}); shot(acc, s, 1356 - 0.02 * FPS, g, fin=0.0005, fout=0.02)               # slap transient (0.02 s into the file) on f1356, no pre-roll
s, g = A('B05-E1', 'E1'); shot(acc, s, 1370, g, fout=0.05, until=1391)
s, g = A('B05-tag', 'tag'); shot(acc, s, 1410, g, fout=0.5, until=1467)                           # 0.5 s fade out ending f1467

# ================= silence policy, ducking, stems
apply_duck(bed)
for tr in (bed, tex, acc, pnL, pnR):
    for j in range(F(980), F(992)): tr[j] = 0.0                                                   # hard silence, every track off (S3 starts at f992)
    for j in range(F(EOT), N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
import random
S2 = 0.70710678
def wr(L, R, p, dither=False):
    rnd = random.Random(18)   # stems only: +-1 LSB (-90 dBFS) noise, because scripts/mix-levels.py drops ebur128 'nan' steps (all-zero 400 ms windows)
    w = wave.open(p, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    out = array.array('h', bytes(4 * N))
    for i in range(N):
        out[2 * i] = max(-32767, min(32767, int(L[i] * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0)))
        out[2 * i + 1] = max(-32767, min(32767, int(R[i] * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0)))
    w.writeframes(out.tobytes()); w.close()
    pk = max(abs(x) for x in out) / 32767; print(p, 'peak %.1f dBFS' % (20 * math.log10(pk + 1e-9)))
def wm(tr, p, dither):
    wr(array.array('f', (x * S2 for x in tr)), array.array('f', (x * S2 for x in tr)), p, dither)
import shutil; shutil.copy(VOICE_PATH, 'out/stems/voice.wav')
wm(bed, 'out/stems/bed.wav', True); wm(tex, 'out/stems/texture.wav', True)
accL = array.array('f', (a * S2 + l for a, l in zip(acc, pnL))); accR = array.array('f', (a * S2 + r for a, r in zip(acc, pnR)))
wr(accL, accR, 'out/stems/accent.wav', True)
wr(array.array('f', (b * S2 + t * S2 + a for b, t, a in zip(bed, tex, accL))), array.array('f', (b * S2 + t * S2 + a for b, t, a in zip(bed, tex, accR))), 'public/audio/edu/EDU-EP18-SHORT-draft-stem-v1.wav')
os.makedirs('out/EDU-EP18-SHORT/audio', exist_ok=True); open('out/EDU-EP18-SHORT/audio/mix-gains.txt', 'w').write('\n'.join(LOG) + '\n')
print(len(LOG), 'cues levelled; gains in out/EDU-EP18-SHORT/audio/mix-gains.txt')
