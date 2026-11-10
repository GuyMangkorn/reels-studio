#!/usr/bin/env python3
"""EDU-EP16-SHORT sound mix (Editor, W5.3 half-size draft, 2026-11-10): places the 68 cues of scripts/edu-series/ep16/sound-cues.json (ROWS-R2.0 frames, 1632 f, 48 kHz mono)
and writes per-layer stems (voice, bed, chorus, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep16/sound-cues.json`, plus the baked
sound stem public/audio/edu/EDU-EP16-SHORT-draft-stem-v1.wav (bed + chorus + texture + accent; narration is its own track). Levels are `dV` = LU under the voice (-16 LUFS read)
while it speaks; each file is measured here (integrated LUFS for beds/chorus/loops, 400 ms momentary max for hits, as scripts/mix-levels.py reads them) and set to dV.
Beds and chorus are ducked 6 dB while the voice speaks (hold 0.3 s): speech level = dV, gap level = dV - 6. Mono mix: the chorus L/R stems are folded to centre (pan to be done in the
Remotion stem only when the composition supports per-track pan). Nothing here was listened: levels are by number. Needs public/narration/EDU-EP16-SHORT-narration-v2.wav
(scripts/edu-series/ep16/narration-place.py) and public/ sounds locked (lock-sounds.sh). Run: python3 -I scripts/edu-series/ep16/sound-mix.py"""
import array, math, os, subprocess, wave
TOTAL, FPS, SR = 1632, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
P = {'a': 'public/audio/', 's': 'public/sfx/'}
def load(rel, ss=0.0, t=None, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', 'public/' + rel, '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else '')] + ['-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
db = lambda x: 10 ** (x / 20)
VOICE = -16.0
gain = lambda dV, ref: db(VOICE - dV - ref)           # dV under the voice, ref = file's own LUFS / M / peak
bed, tex, acc = (array.array('f', bytes(4 * N)) for _ in range(3))

def wav(path):
    w = wave.open(path); a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
VOICE_PATH = os.environ.get('EP16_VOICE', 'public/narration/EDU-EP16-SHORT-narration-v2.wav')   # must be the ROWS-R2.0 placement (1632 f); EP16_VOICE overrides until the Editor re-places the public file
voice = wav(VOICE_PATH)
assert len(voice) == N, ('voice file is %d samples, the ROWS-R2.0 mix needs %d (re-run narration-place.py or set EP16_VOICE)' % (len(voice), N))
# ---- voice activity -> duck envelope (10 ms blocks; speaking = 20 ms rms above -46 dBFS, held 0.3 s; 1-pole smoothing 60 ms attack / 300 ms release)
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

def env(points, at_f):
    """piecewise-linear gain envelope in dB over global frames -> linear gain at sample index."""
    pts = [(F(f), d) for f, d in points]
    k = 0
    def g(j):
        nonlocal k
        if j <= pts[0][0]: return pts[0][1]
        if j >= pts[-1][0]: return pts[-1][1]
        while pts[k + 1][0] < j: k += 1
        (a, x), (b, y) = pts[k], pts[k + 1]; return x + (y - x) * (j - a) / (b - a)
    return g
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
def put(track, snd, f0, f1, dB_env, fade_in=0.004, fade_out=0.004, cut_at=None):
    """add `snd` (already looped/trimmed) from frame f0 to f1 with envelope dB_env(f) -> dB (callable over global sample index)."""
    s0, s1 = F(f0), min(F(f1), N); fi = max(1, int(fade_in * SR)); fo = max(1, int(fade_out * SR))
    for j in range(s0, s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * dB_env(j) * min(1.0, (k + 1) / fi, (s1 - j) / fo)
const = lambda g: (lambda j: g)
def ramp(points):  # points in dB over global frames, returns linear gain function
    e = env(points, 0); return lambda j: db(e(j))
def bedtrack(snd, f0, f1, dBpts, xf=0.4, fade_in=0.004, fade_out=0.004, loop=True):
    n = F(f1) - F(f0); s = loopfill(snd, n, xf) if loop else snd
    put(bed, s, f0, f1, ramp(dBpts), fade_in, fade_out)
def shot(track, snd, f, dB, fin=0.002, fout=0.02, until=None):
    g = db(dB); s = F(f); n = len(snd); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR)); end = F(until) if until else N
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end): track[j] += snd[k] * g * min(1.0, (k + 1) / fi, (n - k) / fo, (end - j) / fo)
def G(dV, ref): return 20 * math.log10(gain(dV, ref))


import json, glob, re, tempfile
CUES = json.load(open('scripts/edu-series/ep16/sound-cues.json'))['cues']
# sound id of every cue, written out so scripts/sound-cues.py can read the placement from this source
IDS = {
    'B01-A1': 'outdoor_park-birds-breeze_01.wav',
    'B01-A1b': 'creature_crow-far-caw_01.wav',
    'B01-S10': 'foley_walk-leather-concrete_01.wav',
    'B02-C3-pop': 'creature_crow-young-squeak_01.wav',
    'B02-M0': 'tension_heartbeat-uneasy-rise_01.wav',
    'B02-C3': 'creature_crow-young-scold_01.wav',
    'B03-M1a': 'bed_sly-campus-pizz-kalimba_01.wav',
    'B03-S1s': 'action_crow-hop-flaps_01.wav',
    'B03-S5': 'foley_net-swish-grass_01.wav',
    'B04-S4': 'foley_leg-band-click_01.wav',
    'B04-S1': 'action_crow-takeoff-flaps_01.wav',
    'B05-S10': 'foley_walk-leather-concrete_01.wav',
    'B05-C2': 'creature_crow-adult-scold_01.wav',
    'B06-C1': 'creature_crow-mob-chorus_01.wav',
    'B06-C1L': 'creature_crow-mob-chorus-left_01.wav',
    'B06-C1R': 'creature_crow-mob-chorus-right_01.wav',
    'B06-C2-f353': 'creature_crow-adult-scold_02.wav',
    'B06-C2-f369': 'creature_crow-adult-scold_03.wav',
    'B06-S1': 'action_crow-takeoff-flaps_01.wav',
    'B06-S3b-f393': 'action_crow-land-branch_01.wav',
    'B06-S3b-f397': 'action_crow-land-branch_02.wav',
    'B06-S3w-f401': 'action_crow-land-wire_01.wav',
    'B06-S3w-f405': 'action_crow-land-wire_02.wav',
    'B07-S2': 'action_bird-pass-low_01.wav',
    'B07-S9': 'foley_coffee-cup-slosh_01.wav',
    'B08-S6': 'foley_latex-mask-peel_02.wav',
    'B09-M1b': 'bed_sly-campus-pizz-kalimba_01.wav',
    'B09-S11': 'foley_crow-preen-ruffle_01.wav',
    'B09-S10': 'foley_walk-leather-concrete_01.wav',
    'B10-S8': 'foley_paper-mask-lift_01.wav',
    'B10-C4': 'creature_crow-bored-caw_01.wav',
    'B11-S7': 'foley_latex-mask-on_01.wav',
    'B11-S10w1': 'foley_walk-sneakers-asphalt_01.wav',
    'B11-S10w2': 'foley_walk-sneakers-asphalt_01.wav',
    'B12-C1': 'creature_crow-mob-chorus_01.wav',
    'B12-S2': 'action_bird-pass-low_02.wav',
    'B12-S18': 'foley_tote-bag-lift_01.wav',
    'B12-S10w': 'foley_walk-sneakers-asphalt_01.wav',
    'B13-S10': 'foley_walk-leather-concrete_01.wav',
    'B13-C1R': 'creature_crow-mob-chorus-right_01.wav',
    'B13-S12': 'stinger_low-muted-hit_01.wav',
    'B14-S3w-f851': 'action_crow-land-wire_04.wav',
    'B14-S3w-f881': 'action_crow-land-wire_01.wav',
    'B14-S3w-f885': 'action_crow-land-wire_02.wav',
    'B14-S3w-f889': 'action_crow-land-wire_03.wav',
    'B14-S3w-f895': 'action_crow-land-wire_04.wav',
    'B14-S13-f853': 'foley_wire-talon-ticks_03.wav',
    'B14-S13-f883': 'foley_wire-talon-ticks_01.wav',
    'B14-S13-f887': 'foley_wire-talon-ticks_02.wav',
    'B14-S13-f891': 'foley_wire-talon-ticks_01.wav',
    'B14-S13-f897': 'foley_wire-talon-ticks_02.wav',
    'B15-C2-f948': 'creature_crow-adult-scold_02.wav',
    'B15-C2-f965': 'creature_crow-adult-scold_03.wav',
    'B16-A3': 'outdoor_aerial-town-air_01.wav',
    'B16-S15': 'weather_wind-season-swell_01.wav',
    'B17-S14': 'whoosh_parachute-ease-out_01.wav',
    'B17-M2a': 'tone_cool-time-pad_01.wav',
    'B17-S16': 'foley_twig-nest-place_01.wav',
    'B18-C1s': 'creature_crow-mob-chorus_01.wav',
    'B18-C3-f1196': 'creature_crow-young-scold_01.wav',
    'B18-C3-f1204': 'creature_crow-young-scold_02.wav',
    'B18-C3-f1212': 'creature_crow-young-scold_03.wav',
    'B18-C3-f1220': 'creature_crow-young-scold_01.wav',
    'B19-A2': 'outdoor_dusk-campus-path_01.wav',
    'B19-C3-f1356': 'creature_crow-young-scold_02.wav',
    'B19-C3-f1368': 'creature_crow-young-scold_03.wav',
    'B19-C3-f1381': 'creature_crow-young-scold_01.wav',
    'B20-S10w': 'foley_walk-sneakers-asphalt_01.wav',
    'B20-V03': 'creature_crow-young-caw-close_01.wav',
    'B20-S17': 'nature_feather-breeze-loop_01.wav',
}
assert all(IDS[c['cue']] == c['id'] + '.wav' for c in CUES) and len(IDS) == len(CUES), 'IDS out of date with the cue sheet'
def path_of(i):
    g = glob.glob('public/**/' + i + '.wav', recursive=True); assert g, i; return g[0][len('public/'):]
_m = {}
def meas(cid, snd, kind):
    """kind 'I' integrated LUFS (ebur128 summary) or 'M' momentary max with 0.4 s silence either side (what mix-levels reads)."""
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
def lvl(cid, snd, dV, kind, cap=None, peak=-3.0):
    ref = meas(cid, snd, kind); g = (VOICE - dV) - ref
    if cap is not None: g = min(g, cap)
    pk = max(abs(x) for x in snd) or 1e-6; g = min(g, peak - 20 * math.log10(pk))   # sample peak held at -3 dBFS (-1 for the quiet B08-S6 peel)
    LOG.append('%-18s %s ref %6.1f dV %5.1f gain %+5.1f dB' % (cid, kind, ref, dV, g)); return g
DUCK = 6.0
chorus = array.array('f', bytes(4 * N))
by = {c['cue']: c for c in CUES}
def S(cue, **kw): return load(path_of(by[cue]['id']), **kw)
EOT = 1632
fade30 = lambda base: [(1602, base), (1632, -60)]

BED_TRIM = [(0, 339, -1.5), (448, 700, -4.5), (838, 1050, -3.0), (1050, 1632, -4.0)]
CH_TRIM = [(838, 1050, -3.0), (1148, 1250, -3.0)]
# ================= BED layer (ambience + music), ducked under the voice
a1 = S('B01-A1'); a1lp = S('B01-A1', af='lowpass=f=800')
a1g = lvl('B01-A1', a1, 16.0, 'I')
n = F(1260) - 0
base, lp = loopfill(a1, n, 0.5), loopfill(a1lp, n, 0.5); mixa = array.array('f', base)
bl = lambda f: min(1.0, max(0.0, (f - 995) / 6)) - min(1.0, max(0.0, (f - 1094) / 6))   # low-passed under the aerial A3 (f999-1094)
for i in range(n):
    w = bl(i * FPS / SR)
    if w: mixa[i] = base[i] * (1 - w) + lp[i] * w
A = a1g + DUCK
put(bed, mixa, 0, 1260, ramp([(0, A), (995, A), (1005, A - 9), (1050, A - 9), (1054, A - 12), (1086, A - 12), (1094, A - 3), (1240, A - 3), (1260, -60)]), 0.004, 0.0005)
a3 = S('B16-A3'); a3g = lvl('B16-A3', a3, 17.0, 'I') + DUCK
bedtrack(a3, 999, 1099, [(999, -40), (1008, a3g), (1080, a3g), (1094, -60)], loop=False, fade_in=0.15)
m0 = S('B02-M0'); m0g = lvl('B02-M0', m0, 20.0, 'I') + DUCK
bedtrack(m0, 88, 151, [(88, m0g), (151, m0g)], loop=False, fade_in=0.2, fade_out=0.1)
m1a = S('B03-M1a'); m1ag = lvl('B03-M1a', m1a, 16.0, 'I') + DUCK
bedtrack(m1a, 150, 448, [(150, m1ag - 6), (172, m1ag), (339, m1ag), (345, m1ag - 2), (448, m1ag - 2)], loop=False, fade_in=0.3, fade_out=0.0005)   # -18 dV under the chorus from f339, cut dead at f448
m1b = load(path_of(by['B09-M1b']['id']), ss=10.0, t=526 / FPS); m1bg = lvl('B09-M1b', m1b, 16.0, 'I') + DUCK
bedtrack(m1b, 508, 1034, [(508, m1bg - 3), (612, m1bg - 2), (733, m1bg), (738, m1bg - 2), (838, m1bg - 2), (846, m1bg - 4), (1018, m1bg - 4), (1034, -60)], loop=False, fade_in=0.4, fade_out=0.05)   # energy steps 1.5 / faster f612 / 2.5 f733 / thin 1.5 f838, out f1034
m2 = S('B17-M2a'); m2g = lvl('B17-M2a', m2, 16.0, 'I') + DUCK
bedtrack(m2, 1050, 1539, [(1050, m2g - 2), (1190, m2g - 2), (1200, m2g), (1225, m2g), (1236, m2g - 2), (1320, m2g - 2), (1328, m2g - 7), (1470, m2g - 7), (1480, m2g - 5.5), (1524, m2g - 5.5), (1539, -60)], loop=False, fade_in=0.4, fade_out=0.0005)
a2 = S('B19-A2'); a2g = lvl('B19-A2', a2, 16.0, 'I', cap=26.0) + DUCK
bedtrack(a2, 1250, EOT, [(1250, -40), (1260, a2g), (1602, a2g)] + [(1632, -60)], xf=0.5, fade_in=0.3, fade_out=0.0005)

# ================= CHORUS layer (story noise): -10 dV under speech, 4 dB under it in gaps
def chor(track, snd, f0, f1, pts, **kw):
    n = F(f1) - F(f0); s = loopfill(snd, n, 0.4); put(track, s, f0, f1, ramp(pts), **kw)
c1 = S('B06-C1'); c1g = lvl('B06-C1', c1, 10.0, 'I') + DUCK
cl = S('B06-C1L'); clg = lvl('B06-C1L', cl, 16.0, 'I') + DUCK
cr = S('B06-C1R'); crg = lvl('B06-C1R', cr, 16.0, 'I') + DUCK
chor(chorus, c1, 339, 448, [(339, c1g), (404, c1g), (412, c1g - 5), (448, c1g - 5)], fade_in=0.05, fade_out=0.0005)   # cut dead on L04
chor(chorus, cl, 339, 448, [(339, clg), (448, clg)], fade_in=0.05, fade_out=0.0005)
chor(chorus, cr, 339, 448, [(339, crg), (448, crg)], fade_in=0.05, fade_out=0.0005)
chor(chorus, c1, 688, 1050, [(688, c1g), (838, c1g), (846, c1g - 7), (989, c1g - 7), (1050, -50)], fade_in=0.05, fade_out=0.0005)   # distant from f838, rolls off from f989
c1lp = S('B12-C1', af='lowpass=f=1800,aecho=0.8:0.6:120|230:0.25|0.15')
chor(chorus, c1lp, 989, 1050, [(989, -60), (997, c1g - 6), (1050, -50)], fade_in=0.1, fade_out=0.0005)   # widening reverb tail layered under the roll-off
crr = S('B13-C1R'); crrg = lvl('B13-C1R', crr, 12.0, 'I') + DUCK
chor(chorus, crr, 733, 838, [(733, crrg), (838, crrg)], fade_in=0.2, fade_out=0.15)
c1s = S('B18-C1s'); c1sg = lvl('B18-C1s', c1s, 16.0, 'I') + DUCK
chor(chorus, c1s, 1148, 1250, [(1148, c1sg), (1240, c1sg), (1250, -50)], fade_in=0.1, fade_out=0.05)

# ================= TEXTURE (foley, landings) and ACCENT (calls, hits): placed once each at its cue frame
TEX_DV = {'B01-S10': 24, 'B03-S5': 19, 'B05-S10': 18, 'B09-S11': 22, 'B09-S10': 20, 'B11-S10w1': 20, 'B11-S10w2': 20, 'B12-S10w': 20, 'B13-S10': 20, 'B16-S15': 19, 'B17-S16': 18, 'B20-S10w': 22}
ACC_DV = {'B01-A1b': 22, 'B02-C3-pop': 16, 'B02-C3': 18, 'B03-S1s': 18, 'B04-S4': 18, 'B04-S1': 19, 'B05-C2': 16, 'B06-C2-f353': 16, 'B06-C2-f369': 16, 'B06-S1': 16,
          'B07-S2': 18, 'B07-S9': 17, 'B08-S6': 0, 'B10-S8': 17, 'B10-C4': 18, 'B11-S7': 19, 'B12-S2': 17, 'B12-S18': 17, 'B13-S12': 13, 'B15-C2-f948': 20, 'B15-C2-f965': 18,
          'B17-S14': 18, 'B18-C3-f1196': 20, 'B18-C3-f1204': 20, 'B18-C3-f1212': 20, 'B18-C3-f1220': 22, 'B20-V03': 0}
# frame nudges (global f) with reasons; none needed (B08-S6: the peel file is quiet for 18 f, its loud part lands in the f498-515 gap)
NUDGE = {}
done = {'B01-A1', 'B16-A3', 'B02-M0', 'B03-M1a', 'B09-M1b', 'B17-M2a', 'B19-A2', 'B06-C1', 'B06-C1L', 'B06-C1R', 'B12-C1', 'B13-C1R', 'B18-C1s'}
for c in CUES:
    k = c['cue']
    if k in done: continue
    if k == 'B20-S17':
        s17 = S(k); g = lvl(k, s17, 30.0, 'I'); n = F(EOT) - F(1549)
        put(tex, loopfill(s17, n, 0.3), 1549, EOT, ramp([(1549, g - 40), (1558, g), (1602, g), (1632, -60)]), 0.1, 0.0005); continue
    f, L = c['frame'] + NUDGE.get(c['cue'], 0), c['lengthFrames']
    if c['layer'] == 'texture':
        s = S(k); g = lvl(k, s, 21.0 if k.startswith('B14') else TEX_DV.get(k, 20), 'M')
        if k == 'B20-S10w': put(tex, s, f, f + L, ramp([(f, g), (1405, g), (1419, -60)]), 0.004, 0.02)
        elif k.startswith('B11-S10w'): shot(tex, s, f, g, fout=0.02, until=f + L)   # F17: one footfall each
        else: shot(tex, s, f, g, fout=0.03, until=f + L + 6)
    else:
        af = 'lowpass=f=2500,aecho=0.8:0.5:90|170:0.3|0.18' if k.startswith('B19-C3') else ''
        s = S(k, af=af) if af else S(k); dv = 26 if k.startswith('B19-C3') else ACC_DV[k]
        g = lvl(k, s, dv, 'M', peak=-1.0 if k == 'B08-S6' else -3.0); shot(acc, s, f, g, fout=0.04, until=f + L + 8)

# ================= silence policy, ducking, stems
for tr in (bed, tex, acc, chorus):
    for j in range(F(EOT), N): tr[j] = 0.0
apply_duck(bed); apply_duck(chorus)
# Round 3 (narration v2): background dV to the voice was 11-13 in B02-B05; per-window trims (dB, 6 f ramps) on bed / chorus, accents via ACC_DV above
def trim(tr, f0, f1, dB):
    g = db(dB); r = F(6)
    for j in range(max(0, F(f0) - r), min(N, F(f1) + r)):
        w = min(1.0, (j - (F(f0) - r)) / r, ((F(f1) + r) - j) / r); tr[j] *= 1 + (g - 1) * w
for f0, f1, d in BED_TRIM: trim(bed, f0, f1, d)
for f0, f1, d in CH_TRIM: trim(chorus, f0, f1, d)
for tr in (bed, tex, acc, chorus):
    for j in range(F(EOT), N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
import random
def wr(tr, p, dither=False):
    rnd = random.Random(16)   # stems only: +-1 LSB (-90 dBFS) noise, because scripts/mix-levels.py drops ebur128 'nan' steps (all-zero 400 ms windows) and misaligns every later step
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    pk = max(abs(x) for x in a) / 32767; print(p, 'peak %.1f dBFS' % (20 * math.log10(pk + 1e-9)))
import shutil; shutil.copy(VOICE_PATH, 'out/stems/voice.wav')
wr(bed, 'out/stems/bed.wav', True); wr(chorus, 'out/stems/chorus.wav', True); wr(tex, 'out/stems/texture.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c + d for a, b, c, d in zip(bed, chorus, tex, acc))), 'public/audio/edu/EDU-EP16-SHORT-draft-stem-v1.wav')
os.makedirs('out/EDU-EP16-SHORT/audio', exist_ok=True); open('out/EDU-EP16-SHORT/audio/mix-gains.txt', 'w').write('\n'.join(LOG) + '\n')
print(len(LOG), 'cues levelled; gains in out/EDU-EP16-SHORT/audio/mix-gains.txt')
