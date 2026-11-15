#!/usr/bin/env python3
"""EDU-EP17-SHORT sound mix (Editor, W5.3 redraft, 2026-11-15; SHEETS-R1.2, candidate B read, v2 narration): places the 71 cues of scripts/edu-series/ep17/sound-cues.json at their integer G frames (1709 f, 48 kHz mono) and writes
the per-layer stems (voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep17/sound-cues.json`, plus the baked sound stem public/audio/edu/EDU-EP17-SHORT-draft-stem-v2.wav
(bed + texture + accent; the narration is its own track). Levels are `dV` = LU under the placed narration's integrated loudness (measured here), by number to the EP08b rows of the sheet's `levels.checks` (the sheet's prose
"-14 dB under NAR" would sum to dV ~10 and fail them): gain = (VOICE - dV) - file reference (integrated LUFS for beds/loops, momentary max for short cues). The bed layer (music + ambience) is ducked 6 dB while any voice speaks (hold 0.3 s).
Energy steps of M1/M2 (sheet "Sound plan") are gain offsets: 0.5 -8 dB, 1 -4, 1.5 -2, 2 0 (dV 19.5), 2.5 +1, 3 +2. Nothing here was listened: the mix is by number.
Needs public/narration/EDU-EP17-SHORT-narration-v2.wav (narration-place.py) and the locked files in public/. Run: python3 -I scripts/edu-series/ep17/sound-mix.py"""
import array, json, math, os, random, re, shutil, subprocess, wave
TOTAL, FPS, SR = 1709, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
CUES = {c['cue']: c for c in json.load(open('scripts/edu-series/ep17/sound-cues.json'))['cues']}
# every file this mix plays (sound-cues.py reads these quoted paths; the mix asserts the cue sheet names the same files)
PLACED = {
    'public/audio/bed/bed_curious-explainer-light_01.wav',
    'public/audio/bed/bed_dark-pulse-felt-piano_01.wav',
    'public/audio/bed/bed_held-note-marimba-pad_01.wav',
    'public/audio/nature/nature_open-sea-overcast_01.wav',
    'public/audio/nature/nature_seaside-yard-afternoon_01.wav',
    'public/audio/water/water_deep-hush-empty_01.wav',
    'public/audio/water/water_shallows-engines-far_01.wav',
    'public/audio/water/water_shallows-hush-bubbles_01.wav',
    'public/sfx/comedy/comedy_cartoon-brake_01.wav',
    'public/sfx/comedy/comedy_hose-pinch-squeak_01.wav',
    'public/sfx/comedy/comedy_toy-helicopter-flutter_01.wav',
    'public/sfx/electric/electric_call-chime-phone_01.wav',
    'public/sfx/electric/electric_glide-soft-tone_01.wav',
    'public/sfx/electric/electric_glitch-blip-soft_01.wav',
    'public/sfx/electric/electric_signal-zip-up_01.wav',
    'public/sfx/electric/electric_spark-crackle-tiny_01.wav',
    'public/sfx/electric/electric_spark-crackle-tiny_02.wav',
    'public/sfx/electric/electric_spark-crackle-tiny_03.wav',
    'public/sfx/electric/electric_spark-crackle-tiny_04.wav',
    'public/sfx/mechanical/mechanical_anchor-drag-snap_01.wav',
    'public/sfx/mechanical/mechanical_anchor-furrow-drag_01.wav',
    'public/sfx/mechanical/mechanical_chain-clinks-underwater_01.wav',
    'public/sfx/mechanical/mechanical_chain-runout-heavy_01.wav',
    'public/sfx/mechanical/mechanical_hull-groan-distant_01.wav',
    'public/sfx/mechanical/mechanical_trawl-scrape-sand_01.wav',
    'public/sfx/pulse/pulse_data-tick-sonar_01.wav',
    'public/sfx/pulse/pulse_underwater-soft-thump_01.wav',
    'public/sfx/reveal/reveal_glass-twinkle-sustain_01.wav',
    'public/sfx/reveal/reveal_glass-shimmer-soft_01.wav',
    'public/sfx/stinger/stinger_low-muted-hit_01.wav',
    'public/sfx/stinger/stinger_marimba-call-ending_01.wav',
    'public/sfx/stinger/stinger_marimba-turn-sting_01.wav',
    'public/sfx/tension/tension_underwater-riser-soft_01.wav',
    'public/sfx/ui/ui_pop-soft-tail_01.wav',
    'public/sfx/vehicle/vehicle_motorway-to-hum_01.wav',
    'public/sfx/water/water_hose-flow-loop_01.wav',
    'public/sfx/water/water_hose-spray-loop_01.wav',
    'public/sfx/water/water_splash-whoosh-dive_01.wav',
}
assert PLACED == {c['file'] for c in CUES.values()}, 'cue sheet and PLACED differ'
_cache = {}
def rel(c): return c['file'][len('public/'):]
def load(r, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-i', 'public/' + r, '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else ''), '-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
def meas(r):
    if r not in _cache:
        t = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', 'public/' + r, '-af', 'pan=mono|c0=0.5*c0+0.5*c1,apad=whole_dur=1,ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
        _cache[r] = (float(re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', t, re.M)[-1]), max(float(x) for x in re.findall(r'M:\s*(-?[\d.]+)', t)))
    return _cache[r]
db = lambda x: 10 ** (x / 20)
def wav(path):
    w = wave.open(path); a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
VOICE_PATH = 'public/narration/EDU-EP17-SHORT-narration-v2.wav'
voice = wav(VOICE_PATH); assert len(voice) == N, ('voice file is %d samples, the mix needs %d (run narration-place.py)' % (len(voice), N))
VOICE = float(re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', VOICE_PATH, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr, re.M)[-1])
MEASURED = VOICE; VOICE = -16.0   # level reference pinned to the v2 read (2026-11-15 L19 slowdown moved the integrated reading to -15.9 only by gating; all other narration is unchanged, so every cue keeps its v2 gain)
print('voice integrated %.1f LUFS (reference pinned to %.1f)' % (MEASURED, VOICE))
def G(dV, r, kind='I'): return VOICE - dV - meas(r)[0 if kind == 'I' else 1]
bed, tex, acc = (array.array('f', bytes(4 * N)) for _ in range(3))
B = SR // 100; nb = N // B
speak = [math.sqrt(sum(x * x for x in voice[i * B:(i + 2) * B]) / max(1, len(voice[i * B:(i + 2) * B]))) / 32768 > db(-46) for i in range(nb)]
held = []; last = -999
for i in range(nb):
    if speak[i]: last = i
    held.append(i - last <= 30)
duck = []; cur = 1.0
for i in range(nb):
    tgt = db(-6) if held[i] else 1.0; k = 1 - math.exp(-1 / (6 if tgt < cur else 30)); cur += (tgt - cur) * k; duck.append(cur)
DUCK = 6.0
def ramp(points):
    pts = [(F(f), d) for f, d in points]
    def g(j):
        if j <= pts[0][0]: return db(pts[0][1]) if pts[0][1] > -60 else 0.0
        if j >= pts[-1][0]: return db(pts[-1][1]) if pts[-1][1] > -60 else 0.0
        for (a, x), (b, y) in zip(pts, pts[1:]):
            if a <= j <= b:
                d = x + (y - x) * (j - a) / max(1, b - a); return db(d) if d > -60 else 0.0
    return g
def loopfill(snd, n, xf=0.4):
    x = int(xf * SR); out = array.array('f', bytes(4 * n)); pos = 0; L = len(snd)
    if L >= n: out[:] = snd[:n]; return out
    while pos < n:
        for i in range(L):
            j = pos + i
            if j >= n: break
            w = 1.0
            if pos > 0 and i < x: w = i / x
            if pos + L - x < n and i >= L - x: w = (L - i) / x
            out[j] += snd[i] * w
        pos += L - x
    return out
def put(track, snd, f0, f1, gain_fn, fin=0.004, fout=0.004):
    s0, s1 = F(f0), min(F(f1), N); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR))
    for j in range(s0, s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * gain_fn(j) * min(1.0, (k + 1) / fi, (s1 - j) / fo)
ONE = lambda j: 1.0
def win(track, cue, dV, pts=None, af='', xf=0.4, extra=0.0, f0=None, kind='I'):
    """Loop/play cue's file over [frame, endFrame) with the sheet's fades at dV under the voice; `pts` = extra dB envelope on G frames; bed track gets the duck allowance."""
    c = CUES[cue]; r = rel(c); a = c['frame'] if f0 is None else f0; b = c['endFrame']
    s = loopfill(load(r, af), F(b) - F(a), xf); base = G(dV, r, kind) + extra + (DUCK if track is bed else 0.0)
    e = ramp(pts) if pts else ONE
    put(track, s, a, b, lambda j: db(base) * e(j), c.get('fadeInFrames', 0) / FPS or 0.004, c.get('fadeOutFrames', 0) / FPS or 0.004)
CAPPED = []
def one(track, cue, dV, kind='M', f=None, until=None, af='', fout=0.02, fin=0.002, trim=None, cap=-3.0):
    c = CUES[cue]; r = rel(c); snd = load(r, af)
    if trim: snd = snd[:F(trim)]
    gdb = G(dV, r, kind); pk = max(abs(x) for x in snd) * db(gdb)
    if pk > db(cap): CAPPED.append((cue, cap - 20 * math.log10(pk))); gdb += cap - 20 * math.log10(pk)
    g = db(gdb); f = c['frame'] if f is None else f; s = F(f); n = len(snd); end = F(until) if until else N
    fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR))
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end): track[j] += snd[k] * g * min(1.0, (k + 1) / fi, (n - k) / fo, (end - j) / fo)
AMB, A2B = 22.0, 25.0   # ambience dV; A2b sits below A2a
E = {0.5: -8, 1: -4, 1.5: -2, 2: 0, 2.5: 1, 3: 2}; M1DV = 19.5

# ================= BED layer (ducked under the voice)
win(bed, 'A1-B01', AMB)
win(bed, 'A1-B01b', AMB, [(229, 0), (349, 0), (353, -2), (376, -2), (380, 0)])   # sheet: -16 in W-SKY G353-380; its -10 under V01 and in the bubble is NOT applied (it sums with M1 and the textures past the EP08b background floor, dV 12.7 measured)
win(bed, 'A1-B03', AMB, [(607, -6), (660, -6), (666, 0)])             # faint in the split's upper half
win(bed, 'A1-V03', AMB); win(bed, 'A1-B05', AMB); win(bed, 'A1-B05c', AMB)
win(bed, 'A1-B06', AMB)
for c in ('A2a-B01', 'A2a-B04', 'A2a-B04b'): win(bed, c, AMB)
for c in ('A2b-B01', 'A2b-B04', 'A2b-B04b'): win(bed, c, A2B)
LP = 'lowpass=f=1800'   # flashback: A2a heard through the "reconstruction", Editor low-pass
win(bed, 'A2a-B05', AMB, af=LP); win(bed, 'A2a-B05b', AMB, af=LP)
for c in ('A3-B01', 'A3-B03', 'A3-B04'): win(bed, c, AMB)
win(bed, 'A5-sea', AMB); win(bed, 'A5-descent', AMB)
win(bed, 'M3-hold', 20.5)
win(bed, 'M2-pulse', 19.5, [(1064, E[1.5]), (1256, E[1.5]), (1364, E[1.5] - 4)])    # 1.5, thins G1256-1364
def m1_run(start, f0, f1, pts, fi, fo, cue):
    """One M1 pass from file start `start` (global frame), gain points are dB offsets (file loops if shorter than the span)."""
    c = CUES[cue]; r = rel(c); s = loopfill(load(r), F(f1) - F(start), 0.4); base = G(M1DV, r) + DUCK; e = ramp(pts)
    put(bed, s, start, f1, lambda j: db(base) * e(j), fi / FPS, fo / FPS)
m1_run(12, 12, 356, [(12, E[2]), (98, E[2]), (102, E[2.5]), (225, E[2.5]), (229, -20), (284, -20), (288, E[2]), (350, E[2])], 12, 6, 'M1-in')
m1_run(380, 380, 541, [(380, E[2.5]), (541, E[2.5])], 6, 0.001 * FPS, 'M1-B02c')    # stops dead at G541
# M1 B03-B04: one pass; v2: file start 31 f before the cue frame (G697 - 3 = 694; start 666) so that, at 95 bpm (75.8 f/bar), the 5th downbeat falls on S16 G1045 as in v1 (assumed bar structure, not verified by ear); the first 28 f are silent (fade-in point G694)
m1_run(666, 666, 1070, [(666, -60), (694, -60), (697, E[1.5]), (702, E[1.5]), (705, E[1]), (743, E[1]), (747, E[2.5]), (849, E[2.5]), (853, -20), (877, -20), (881, E[3]), (989, E[3]), (993, E[2.5]), (1045, E[2.5]), (1049, E[2]), (1064, E[2])], 3, 6, 'M1-B04b')
m1_run(1388, 1388, 1649, [(1388, E[2]), (1575, E[2]), (1579, E[1.5]), (1630, E[1.5])], 12, 19, 'M1-B06')

# ================= TEXTURE layer
TX = 20.0
win(tex, 'S1-B01', TX + 1, [(98, 0), (102, -6)])
win(tex, 'S1-last-dribble', TX + 1, [(229, 0), (241, -12)])
win(tex, 'S1b-B01', TX + 2); win(tex, 'S1b-B03', TX + 4)
win(tex, 'S1-B06', TX + 3)
for cue, dv in (('S13-chains', TX), ('S14-drag', TX), ('S15-trawl', TX), ('S20-runout', TX)): one(tex, cue, dv, 'M')
one(tex, 'S14-furrow', TX + 2, 'M', until=1364, fout=8 / FPS)
for cue in ('S9-heli', 'S10-motorway', 'S12-riser'):   # v2 stop/fade rules (SD30, SD32, page-turn): the cue sheet's endFrame and fadeOutFrames, applied here to Ton's whole file
    one(tex, cue, TX, 'M', until=CUES[cue]['endFrame'], fout=CUES[cue]['fadeOutFrames'] / FPS)
# S17: carries across the cut at G1162, low-passed from there (full band to G1162, 4 f crossfade)
c = CUES['S17-groan']; r = rel(c); full = load(r); lp = load(r, 'lowpass=f=1500'); g = db(G(TX, r, 'M')); s0 = F(c['frame']); fi = F(1162) - F(c['frame'])
for k in range(len(full)):
    j = s0 + k
    if j >= N: break
    w = min(1.0, max(0.0, (j - F(1162)) / F(4)))
    tex[j] += ((1 - w) * full[k] + w * lp[k]) * g * min(1.0, (k + 1) / 96, (len(full) - k) / 960)

# ================= ACCENT layer
ACC, GAP = 13.5, 0.0
for cue in ('S6-B03', 'S11-pinch', 'S16-hit', 'S22-glitch', 'S23-glide'): one(acc, cue, ACC, 'M')
for cue in ('S18-thump1', 'S18-thump2', 'S18-thump3'): one(acc, cue, ACC + 2.5, 'M')   # measured 10.6 LU at 13.5 (the voice is quiet there)
# B01 holds 8 accents in 8 s of speech: their summed energy broke the EP08b background floor (dV 12.6 at 13.5), so each sits 2 dB lower; S6-B01a and S19 measured 11 LU at 13.5 (windows on quiet syllables)
for cue in ('S3-zip', 'S4-brake', 'S5-dive', 'S7-globe'): one(acc, cue, ACC + 4.0, 'M')   # v2: the eight accents now sit in 7.2 s of speech (v1 8.2 s): 2 dB lower again for the EP08b background floor (dV 10.7 at +2.0)
one(acc, 'S6-B01a', ACC + 4.5, 'M'); one(acc, 'S19-turn', ACC + 2.5, 'M')
for cue in ('S6-B01-glow1', 'S6-B01-glow2', 'S6-B01-glow3'): one(acc, cue, ACC + 5.0, 'M')
for k in range(1, 8): one(acc, 'S21-spark%d' % k, ACC, 'M')
one(acc, 'S2-chime', GAP + 3.0, 'M')   # v2: 3 dB under the sheet's peak level (peak dV ~3, inside -6..3): its tail is inside the 400 ms meter step of the first speech steps
one(acc, 'S8-twinkle', GAP, 'M', cap=-2.0); one(acc, 'S24-pop', GAP, 'M', cap=-3.0)   # gap accents (W11: denser files; caps -2 / -3 dBFS: at -1 their energy ahead of and under the L05 onset took B02 background to dV 12.2)
one(acc, 'END1', GAP, 'M', until=CUES['END1']['endFrame'], fout=CUES['END1']['fadeOutFrames'] / FPS)   # W11: starts G1652 (cue sheet), trimmed to end G1707

# ================= stems
for cue, d in CAPPED: print('  capped: %s gain lowered by %.1f dB to peak -3 dBFS' % (cue, -d))
def apply_duck(tr):
    for i in range(nb):
        g = duck[i]
        for j in range(i * B, (i + 1) * B): tr[j] *= g
apply_duck(bed)
for tr in (bed, tex, acc):
    for j in range(F(TOTAL), N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
def wr(tr, p, dither=False):
    rnd = random.Random(17)   # stems only: +-1 LSB dither so mix-levels.py's ebur128 never sees all-zero 400 ms windows (EP15 finding)
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    print(p, 'peak %.1f dBFS' % (20 * math.log10(max(abs(x) for x in a) / 32767 + 1e-9)))
wr(array.array('f', (x / 32767 for x in voice)), 'out/stems/voice.wav', True)   # voice stem = the narration track, dithered like the others
wr(bed, 'out/stems/bed.wav', True); wr(tex, 'out/stems/texture.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(bed, tex, acc))), 'public/audio/edu/EDU-EP17-SHORT-draft-stem-v2.wav')
