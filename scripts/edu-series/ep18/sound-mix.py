#!/usr/bin/env python3
"""EDU-EP18-SHORT sound mix (Editor, W5.3 Draft, 14 Nov 2026; SHEET-R1.1, SS-R1.1): places the 36 cues of scripts/edu-series/ep18/sound-cues.json at their integer frames (1737 f, 48 kHz mono) and writes
per-layer stems (voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep18/sound-cues.json`, plus the baked stem public/audio/edu/EDU-EP18-SHORT-draft-stem-v1.wav
(bed + texture + accent; narration is its own track). Gain per cue = the cue sheet's startGainDb on the library master plus TRIM (Editor's per-cue trim in dB, set from mix-levels.py; empty = Ton's start gain).
Nothing here was listened. Interpretations the sheet leaves open (all in edit-plan.md):
 * M18-bed: one file from f92; plays f92-303, muted f303-369 (W-PHONE), plays f369-855, -6 dB from f855 (ramp 855-880), faded out by f1036 (the music map: out by f1036, M18-desc on the dissolves, nothing in f1138-1222);
   nothing of it plays in the recipe window.
 * A18-IN covers f190-303, f369-435, f700-1264; A18-IN-b is its continuation f1264-1530 (same file, same gain; the sheet lists both, a double would be +6 dB).
 * M18-desc: three notes 0.86 s apart (26 f); the last note lands on the last jug dissolve (shot 15 +75 = f1111), so the file starts at f1059.4.
 * S18-11 (spoon-taps _02, 1.12 s, six hits 0.05-1.01 s) is stretched x1.2 (atempo 0.8333) so the six hits land f1301.8, 1309.4, 1316.2, 1323.4, 1329.2, 1336.4, inside the sugar clause (f1302-1342).
 * M18-resolve from file 3.9 s at f1530 (fade in 0.6 s), fade out 1 s from f1710; M18-pad f1264-1560 with its fade out f1530-1560; E-TAG cut at f1737 with a 0.25 s fade.
Needs public/narration/EDU-EP18-SHORT-narration-v1.wav (narration-place.py) and the locked library files in public/. Run: python3 -I scripts/edu-series/ep18/sound-mix.py"""
import array, math, os, random, shutil, subprocess, wave
TOTAL, FPS, SR = 1737, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
db = lambda x: 10 ** (x / 20)
_cache = {}
def load(rel, ss=0.0, af=''):
    k = (rel, ss, af)
    if k not in _cache:
        cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', 'public/' + rel, '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else ''), '-f', 'f32le', '-']
        a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); _cache[k] = a
    return _cache[k]
VOICE_PATH = 'public/narration/EDU-EP18-SHORT-narration-v1.wav'
bed, tex, acc = (array.array('f', bytes(4 * N)) for _ in range(3))
TRIM = {'A18-IN': -4.0, 'A18-IN-b': -14.0, 'M18-bed': -3.5, 'S18-08': -3.0, 'M18-lownote': -3.0, 'M18-desc': -3.0, 'S18-10': -15.0, 'S18-11': -16.0, 'S18-12': -16.0, 'S18-13': -16.0, 'M18-pad': -9.0}   # cue -> dB trim (mix-levels.py)
def gain(cue, start_db): return db(start_db + TRIM.get(cue, 0.0))
def ramp(points):
    """piecewise-linear dB envelope over global frames (values <= -60 are silence) -> linear gain at sample index j."""
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
def put(track, snd, f0, f1, g, fin_f=0.15, fout_f=0.15, env=None):
    """snd laid from global frame f0 (fractional ok) to f1 with linear fades of fin_f / fout_f frames; g = linear gain."""
    s0 = F(f0); s1 = min(F(f1), N); fi = max(1, int(fin_f * SR / FPS)); fo = max(1, int(fout_f * SR / FPS))
    for j in range(max(0, s0), s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * g * min(1.0, (k + 1) / fi, (s1 - j) / fo) * (env(j) if env else 1.0)
def bedloop(cue, rel, f0, f1, start_db, xf_f=8, extra=None):
    """loop window f0-f1 with an xf_f-frame fade at both ends centred on the boundaries (beds crossfade by 6-12 f)."""
    a, b = f0 - xf_f / 2, f1 + xf_f / 2
    snd = loopfill(load(rel), F(b) - F(a), 0.4)
    put(bed, snd, max(0, a), b, gain(cue, start_db), xf_f if f0 > 0 else 0.15, xf_f if f1 < TOTAL else 6, extra)
def one(track, cue, rel, f, start_db, af='', ss=0.0, fin=0.15, fout=1.0, until=None):
    snd = load(rel, ss, af); end = until if until else f + len(snd) * FPS / SR
    put(track, snd, f, end, gain(cue, start_db), fin, fout)

M = 'audio/bed/'; ST = 'audio/stinger/'; SX = 'sfx/'
# ================= BED layer
bedloop('A18-VN', SX + 'nature/nature_village-night-insects_01.wav', 0, 92, -19.5)
bedloop('A18-VM', SX + 'nature/nature_village-morning-hens_01.wav', 92, 122, -19.5)
bedloop('A18-RV', SX + 'water/water_river-pebbles-babble_01.wav', 122, 190, -19.0)
IN = SX + 'room/room_stilt-house-night-quiet_01.wav'
bedloop('A18-IN', IN, 190, 303, -17.0); bedloop('A18-VN-b', SX + 'nature/nature_village-night-insects_01.wav', 303, 369, -19.5)
bedloop('A18-IN', IN, 369, 435, -17.0); bedloop('A18-VN-b', SX + 'nature/nature_village-night-insects_01.wav', 435, 528, -19.5)
bedloop('A18-SH', SX + 'room/room_shop-night-moths_01.wav', 528, 700, -16.5)
bedloop('A18-IN', IN, 700, 1264, -17.0); bedloop('A18-IN-b', IN, 1264, 1530, -17.0)
bedloop('A18-MM', SX + 'nature/nature_village-morning-hens_01.wav', 1530, TOTAL, -19.5)
# M18-bed: one file from f92
m18 = load(M + 'bed_isan-tender-kalimba-72bpm_01.wav')
e = ramp([(92, -60), (96, 0), (300, 0), (306, -60), (366, -60), (372, 0), (855, 0), (880, -6), (1000, -6), (1036, -60)])
put(bed, m18, 92, 1236, gain('M18-bed', -19.5), 0.15, 1.0, e)
pad = load(M + 'bed_isan-tender-calm-pad_02.wav')
put(bed, pad, 1264, 1560, gain('M18-pad', -19.5), 6, 30, ramp([(1264, 0), (1530, 0), (1560, -60)]))
res = load(M + 'bed_isan-tender-resolve_01.wav', ss=3.9)
put(bed, res, 1530, TOTAL, gain('M18-resolve', -19.5), 18, 27, ramp([(1530, 0), (1710, 0), (1737, -60)]))
# ================= TEXTURE layer
one(tex, 'S18-01', SX + 'water/water_hands-slurp-small_01.wav', 126, -5.0)
one(tex, 'S18-farsplash', SX + 'water/water_giant-wade-far_01.wav', 162, -16.0)
one(tex, 'S18-02', SX + 'electric/electric_phone-wake-click_01.wav', 230, 0.0)
one(tex, 'S18-03a', SX + 'foley/foley_bamboo-ladder-creak_02.wav', 307, -4.0)
one(tex, 'S18-longneck', SX + 'creature/creature_longneck-far-moan_01.wav', 343, -23.5)
one(tex, 'S18-04', SX + 'electric/electric_phone-error-beeps-soft_01.wav', 409, -21.5)
one(tex, 'S18-05', SX + 'electric/electric_phone-torch-click_01.wav', 496, -3.0)
one(tex, 'S18-06', SX + 'foley/foley_bead-curtain-brush_01.wav', 528, 0.0)
one(tex, 'S18-07', SX + 'foley/foley_cardboard-box-slide-glass_01.wav', 647, -10.5)
one(tex, 'S18-08', SX + 'water/water_cloth-wring-bowl_01.wav', 702, -12.0)
one(tex, 'S18-09', SX + 'foley/foley_glass-jar-ring-soft_01.wav', 1236, -2.5)
for cue, f in (('S18-14a', 1404), ('S18-14b', 1434), ('S18-14c', 1464)): one(tex, cue, SX + 'water/water_sips-soft_01.wav', f, -10.5)
fan = loopfill(load(SX + 'whoosh/whoosh_hand-fan-loop_01.wav'), F(1623) - F(1530), 0.3)
put(tex, fan, 1530, 1623, gain('S18-15', -8.0), 4, 6)
# ================= ACCENT layer
one(acc, 'S18-WORM', SX + 'whoosh/whoosh_sky-ripple-wormhole_01.wav', 0, -17.0, fout=2.0)
one(acc, 'M18-lownote', ST + 'stinger_kalimba-low-note_01.wav', 669, -12.5)
one(acc, 'M18-desc', ST + 'stinger_kalimba-descending-three_01.wav', 1059.4, -15.0)
one(acc, 'M18-rise', ST + 'stinger_kalimba-rising-run_01.wav', 1236, -14.0)
one(acc, 'S18-10', SX + 'water/water_pour-bottle-glug_01.wav', 1264, -3.0)
one(acc, 'S18-11', SX + 'foley/foley_spoon-taps-rim-knife_02.wav', 1300, -5.0, af='atempo=0.8333')
one(acc, 'S18-12', SX + 'foley/foley_salt-scrape-fall_01.wav', 1364, -5.0)
one(acc, 'S18-13', SX + 'foley/foley_spoon-stir-bottle_01.wav', 1374, -5.0)
one(acc, 'V03-cluck', SX + 'creature/creature_hen-cluck-single_02.wav', 1659, -8.5)
one(acc, 'E-TAG', ST + 'stinger_isan-series-tag_01.wav', 1677, 0.0, until=TOTAL, fout=7.5)
# ================= stems
for tr in (bed, tex, acc):
    for j in range(F(TOTAL) - 1, N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
def wr(tr, p, dither=False):
    rnd = random.Random(18)   # stems only: +-1 LSB (-90 dBFS) dither, because scripts/mix-levels.py drops ebur128 'nan' steps (all-zero 400 ms windows) and misaligns every later step
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    pk = max(abs(x) for x in a) / 32767; print(p, 'peak %.1f dBFS' % (20 * math.log10(pk + 1e-9)))
shutil.copy(VOICE_PATH, 'out/stems/voice.wav')
wr(bed, 'out/stems/bed.wav', True); wr(tex, 'out/stems/texture.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(bed, tex, acc))), 'public/audio/edu/EDU-EP18-SHORT-draft-stem-v1.wav')
