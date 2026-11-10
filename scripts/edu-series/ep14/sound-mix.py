#!/usr/bin/env python3
"""EDU-EP14-SHORT sound mix (Editor, W5.3 Draft, 2026-11-09; retimed to ROWS-R4.1 by Ton, 2026-11-10): places the 46 cues of scripts/edu-series/ep14/sound-cues.json (ROWS-R4.1 frames, 1815 f, 48 kHz mono) and writes
per-layer stems (voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep14/sound-cues.json`, plus the baked sound stem
public/audio/edu/EDU-EP14-SHORT-draft-stem-v1.wav (bed + texture + accent; narration is its own track). Levels are `dV` = LU under the voice (-16 LUFS read) while it speaks:
gain = (-16 - dV) - file reference (integrated LUFS for beds and long sounds, momentary max for short accents, peak for ticks). Beds are ducked 6 dB while the voice speaks (hold 0.3 s).
Silence policy: every layer is exact zero on f554-564 (R1 dead stop, slam, white frame) and from f1814. Nothing here was listened: levels are by number.
Library files are read from public/ (locked by lock-sounds.sh). Needs public/narration/EDU-EP14-SHORT-narration-v1.wav. Run: python3 -I scripts/edu-series/ep14/sound-mix.py"""
import array, math, os, subprocess, wave
TOTAL, FPS, SR = 1815, 30, 48000
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
VOICE_PATH = os.environ.get('EP14_VOICE', 'public/narration/EDU-EP14-SHORT-narration-v1.wav')   # must be the R4.1 placement (1815 f); EP14_VOICE overrides until the Editor re-places the public file
voice = wav(VOICE_PATH)
assert len(voice) == N, ('voice file is %d samples, the R4.1 mix needs %d (re-run narration-place.py for R4.1 or set EP14_VOICE)' % (len(voice), N))
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

# ---- library files and their references (ebur128 on the mono sum: I = integrated LUFS, M = momentary max, pk = true peak)
a1 = load('audio/weather/weather_tin-roof-rain-shelter_01.wav'); A1I = -17.1
a2 = load('audio/city/city_wet-road-rain-bus_01.wav'); A2I = -17.9
a1lp = load('audio/weather/weather_tin-roof-rain-shelter_01.wav', af='lowpass=f=800')
d1 = load('audio/tension/tension_airless-glass-drone_01.wav'); D1I = -18.7
m1 = load('audio/bed/bed_kalimba-rain-explainer_02.wav'); M1I = -18.8
whf = load('audio/whoosh/whoosh_shaft-fall-air-rush_01.wav'); WHI = -17.6
tick = load('sfx/ui/ui_click-tick_01.wav'); pop = load('sfx/ui/ui_pop_01.wav')
DUCK = 6.0   # gap level over speech level for the beds

# ================= BED layer (ambience + music), ducked under the voice
# A1/A2 open: from f0, hard cut at f55 (the hit)
bedtrack(a1, 0, 55, [(0, G(19.5, A1I) + DUCK), (55, G(19.5, A1I) + DUCK)], fade_out=0.0005)
bedtrack(a2, 0, 55, [(0, G(22.5, A2I) + DUCK), (55, G(22.5, A2I) + DUCK)], fade_out=0.0005)
# D1 no-air drone: fades in over 0.5 s from f58, -20 dB in L02a (f179-282: sheet drop window, bed >= 30 dV), out hard at f554 with R1; D1-b f565-686 thin, out hard at the colour cut
d1g = G(16.5, D1I) + DUCK
bedtrack(d1, 58, 554, [(58, -60), (73, d1g), (157, d1g), (179, d1g - 20), (282, d1g - 20), (314, d1g), (554, d1g)], xf=0.5, fade_in=0.5, fade_out=0.0005)
d1b = G(19.5, D1I) + DUCK
bedtrack(d1, 565, 686, [(565, -60), (571, d1b), (686, d1b)], xf=0.5, fade_in=0.2, fade_out=0.0005)
# A1/A2 back from f686 (colour cut) to the end; sheet rows: full gap level at f686 (release), B02-SH02 -10 dB, B03-B04 low-passed -10 dB, B05 -4 dB, zero by f1814
a1g = G(19.5, A1I) + DUCK
a1_pts = [(686, a1g), (733, a1g), (751, a1g - 10), (923, a1g - 10), (933, a1g), (1033, a1g), (1041, a1g - 10), (1514, a1g - 10), (1522, a1g - 6), (1742, a1g - 6), (1760, a1g - 9), (1814, -60)]
n = F(1814) - F(686)
base, lp = loopfill(a1, n, 0.5), loopfill(a1lp, n, 0.5)
mixa = array.array('f', base)
bl = lambda f: min(1.0, max(0.0, (f - 1037) / 6)) - min(1.0, max(0.0, (f - 1516) / 6))   # 1 inside the macro window f1041-1516 (6 f blend)
for i in range(n):
    w = bl((F(686) + i) * FPS / SR)
    if w: mixa[i] = base[i] * (1 - w) + lp[i] * w
put(bed, mixa, 686, 1814, ramp(a1_pts), 0.004, 0.0005)
a2g = G(22.5, A2I) + DUCK
a2_pts = [(686, a2g - 3), (923, a2g - 3), (933, a2g - 6), (1742, a2g - 6), (1760, a2g - 9), (1814, -60)]
bedtrack(a2, 686, 1814, a2_pts, xf=0.5, fade_out=0.0005)
# M1 kalimba bed: enters on the colour cut, file 0-34.65 s (_02: natural ending kept, R4.1) -> ends f1725 on its phrase, under E1 (no fade; 30 ms file taper + 40 ms anti-click), thinned in B03 macro, +3 dB swell at the burst (f1364)
m1g = G(20.5, M1I) + DUCK
m1_pts = [(686, m1g), (1033, m1g), (1045, m1g - 2), (1215, m1g - 2), (1227, m1g), (1476, m1g), (1486, m1g + 3), (1520, m1g + 3), (1552, m1g - 4.5), (1728, m1g - 4.5)]
bedtrack(m1, 686, 686 + len(m1) * FPS / SR, m1_pts, loop=False, fade_out=0.04)

# ================= TEXTURE layer (whoosh, ticks, pops, foley)
def ticks_run(frames, pk, filt=''):
    for f in frames: shot(tex, tick, f, pk - (-1.0))
# S1 ticks follow the gauge needles (clock.ts): one tick per 25 km/h (no-air) or per 2 km/h (real dial)
lin = lambda a, b, L: max(0.0, min(1.0, (L - a) / (b - a)))
sm = lambda a, b, L: (lambda u: u * u * (3 - 2 * u))(lin(a, b, L))
def cross(fn, start, n, step, pk):
    last = int(fn(0) // step); out = []
    for L in range(n):
        k = int(fn(L) // step)
        if k > last: out.append(start + L); last = k
    return out
TK = -25.0   # tick peak dBFS (texture)
ticks_run([144, 145, 146, 147, 148], TK + 2)                                                         # S1 run on the 4 f snap, +76-+80
noair6 = lambda L: 350 * min(L, 65) / 65
noair7 = lambda L: (357 + 143 * L / 43) if L <= 43 else 500 + 200 * lin(43, 95, L)
t6 = cross(noair6, 392, 66, 25, TK); t7 = [f for f in cross(noair7, 458, 95, 25, TK) if abs(f - 484) > 2]
ticks_run(t6 + t7, TK)                                                                                 # S1-run-accel f392-552 (last tick f553 is the hard tick)
real = lambda L: 32 * (1 - (1 - lin(0, 148, L)) ** 3)
ticks_run(cross(real, 751, 148, 2, TK), TK - 1)                                                       # S1 ticks slowing +0-+148
ticks_run(cross(lambda L: 32 * sm(5, 54, L), 929, 55, 2, TK), TK - 3)                                  # needle A (+5-+54) -> softer; shot-local L offset 929 (cue f934 is +5)
ticks_run(cross(lambda L: 20 * sm(65, 98, L), 929, 100, 2, TK), TK - 4)                                 # needle B (+65-+98) softer
for f in (360, 364, 1457): shot(tex, tick, f, TK + 1)                                                  # S1 pin/label ticks, S17 ruler tick
for f in (78, 1039, 1193, 1292, 1404, 852): shot(tex, pop, f, TK + 1)                                   # S9 pops (dial, bun, bag, bubble, arrow)
# whoosh-fall: 4 s loop for 178 f; gain rides up to +119 (f870) then steady
whg0 = G(30, WHI); whg1 = G(18, WHI)
put(tex, loopfill(whf, F(929) - F(751), 0.3), 751, 929, ramp([(751, whg0), (870, whg1), (929, whg1)]), 0.02, 0.02)
shot(tex, load('sfx/foley/foley_water-balloon-squash_01.wav'), 1130, G(16, -24.2))                       # S12 squash
shot(tex, load('sfx/foley/foley_water-balloon-wobble_01.wav'), 1293, G(16, -22.9))                       # S14 wobble
shot(tex, load('sfx/foley/foley_wet-film-creak-rise_01.wav'), 1352, G(16, -29.3), fout=0.05)             # S15 creak, rises through the shot
shot(tex, load('sfx/vehicle/vehicle_bike-pass-rain_01.wav'), 956, G(15, -26.8), fout=0.05)               # S8 bike, centre f983
# S19 sleeve rustle: file peak -0.7 dBFS, loudness unmeasurable; set the peak at -22 dBFS (+6 dB vs the TK texture level, sheet Q-T4)
shot(tex, load('sfx/foley/foley_cotton-sleeve-rustle_01.wav'), 1535, -20 + 0.7)
pats = load('sfx/water/water_palm-raindrop-pats_01.wav'); PATG = G(20, -32.1)
shot(tex, pats[:int(0.3 * SR)], 1584, PATG, fout=0.05)                                                  # S18 first pat
shot(tex, loopfill(pats[:int(105 * SR / FPS)], F(1742) - F(1610), 12 / FPS), 1610, PATG, fout=0.02, until=1742)   # S18 pats f1610-1742 (105 f loop, 12 f crossfade)
put(tex, loopfill(pats[:int(105 * SR / FPS)], F(1814) - F(1742), 12 / FPS), 1742, 1814, ramp([(1742, PATG - 6), (1814, -60)]), 0.02, 0.0005)   # S18 sparse, fading to zero by f1673

# ================= ACCENT layer
shot(acc, load('sfx/water/water_drop-plip-puddle_01.wav'), 10, -22.0 + 0.9)                              # S11 hook plip in the syllable gap (peak -22)
rw = load('sfx/reveal/reveal_rewind-whirr_01.wav'); shot(acc, rw, 158, G(14.5, -17.3))                     # S2 rewind (over speech: dV 13)
gp = load('sfx/reveal/reveal_glass-pluck-ring_01.wav'); shot(acc, gp, 302, G(14.5, -22.5), fout=0.05)      # S3 let-go pluck
shot(acc, gp, 710, G(14.5, -22.5), fout=0.05)                                                          # S3 warm (little room)
lowt = load('sfx/ui/ui_click-tick_01.wav', af=f'asetrate={SR * 0.7:.1f},aresample={SR}')
shot(acc, lowt, 484, -20.0 + 1.0); shot(acc, lowt, 487, -20.0 + 1.0)                                       # S4 low double tick
shot(acc, tick, 553, -10.0 + 1.0, until=554)                                                              # S1 hard tick at the stop (cut at the f554 silence)
bb = load('sfx/impact/impact_bb-pellet-tick_01.wav')
for f in (589, 621): shot(acc, bb, f, -14.0 + 0.7)                                                        # S5 BB ticks
shot(acc, load('sfx/foley/foley_water-drop-skin-sting_01.wav'), 650, -12.0 + 0.7)                         # S6 sting in the silence
shot(acc, load('sfx/whoosh/whoosh_parachute-ease-out_01.wav'), 899, G(14.5, -13.1), fout=0.05)              # S7 brake whoosh
shot(acc, load('sfx/comedy/comedy_kalimba-nope_01.wav'), 1066, G(13.5, -19.0))                               # S10 nope pluck
shot(acc, load('sfx/water/water_drop-plip-puddle_01.wav'), 1104, -22.0 + 0.9)                              # S11 off-screen plip
shot(acc, load('sfx/stinger/stinger_pizz-shrug_01.wav'), 1234, G(12.5, -16.3), fout=0.05)                   # S13 shrug on "แต่"
shot(acc, load('sfx/water/water_film-burst-scatter_01.wav', af='volume=3dB,alimiter=limit=0.89:attack=1:release=30:level=disabled'), 1484, 0.0)                            # S16 burst (voice speaks on "แตก": dV 5, see build-notes)
e1 = load('audio/stinger/stinger_kalimba-drops-tag_01.wav')
put(acc, e1, 1723, 1723 + len(e1) * FPS / SR, ramp([(1723, G(14, -18.7)), (1738, G(14, -18.7)), (1740, G(-2.0, -18.7)), (1840, G(-2.0, -18.7))]), 0.002, 0.05)   # E1 ending tag: dV 14 over the last words (f1723-1738: row 'background >= 15 while speaking'), blooming to nominal dV -2.0 = measured about 5.5 (row accent -6..3) once the voice has stopped
pz = load('sfx/stinger/stinger_pizz-tag-ending_01.wav'); PZM = -10.2   # EP02's closing pizz tag (library, M max -10.2); lands as the V02 giggle ends (voice silent from f1757), rings through the hold, 0.5 s fade to the f1814 silence; E1/M1 are C-centred, same as this chord
put(acc, pz, 1757, 1814, ramp([(1757, G(0.0, PZM)), (1814, G(0.0, PZM))]), 0.002, 0.5)   # S19 pizz tag (user note, 10 Nov 2026)
# R1 riser: from f411, builds; file ends at f553.5, hard cut at the f554 boundary; envelope keeps it under the voice (L02c ends f535) then builds to the stop
r1 = load('sfx/tension/tension_dark-riser-sub-pulse_01.wav'); R1M = -6.9
r1g = G(1, R1M)
put(acc, r1, 411, 554, ramp([(411, r1g - 24), (486, r1g - 20), (535, r1g - 16), (546, r1g)]), 0.004, 0.001)

# ================= silence policy, ducking, stems
for tr in (bed, tex, acc):
    for j in range(F(554), F(565)): tr[j] = 0.0
    for j in range(F(1814), N): tr[j] = 0.0
apply_duck(bed)
for tr in (bed, tex, acc):   # duck tail must not leak into the silence
    for j in range(F(554), F(565)): tr[j] = 0.0
    for j in range(F(1814), N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
import random
def wr(tr, p, dither=False):
    rnd = random.Random(14)   # stems only: +-1 LSB (-90 dBFS) noise, because scripts/mix-levels.py drops ebur128 'nan' steps (all-zero 400 ms windows) and misaligns every later step
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    pk = max(abs(x) for x in a) / 32767; print(p, 'peak %.1f dBFS' % (20 * math.log10(pk + 1e-9)))
import shutil; shutil.copy(VOICE_PATH, 'out/stems/voice.wav')
wr(bed, 'out/stems/bed.wav', True); wr(tex, 'out/stems/texture.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(bed, tex, acc))), 'public/audio/edu/EDU-EP14-SHORT-draft-stem-v1.wav')
