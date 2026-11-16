#!/usr/bin/env python3
"""EDU-EP18-SHORT sound mix (Editor, W5 draft, 2026-11-16; SHEETS-R1.0, Ton's sound-cues.json, 60 placements, ALL UNLISTENED by Ton): places every cue of scripts/edu-series/ep18/short/sound-cues.json at its integer G
frame (1872 f, 48 kHz mono) and writes the per-layer stems (voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep18/short/sound-cues.json`, plus the baked
sound stem public/audio/edu/EDU-EP18-SHORT-stem-v2.wav (bed + texture + accent; the placed narration is its own track). Method as EP17 sound-mix.py: levels are `dV` = LU under the placed narration's
integrated loudness (pinned -16.0), gain = (VOICE - dV) - file reference (integrated LUFS for beds/loops, momentary max for short cues); the bed layer (music + ambience) is ducked 6 dB while any voice speaks (hold 0.3 s).
Music energy steps are gain offsets (0.5 -8 dB, 1 -4, 1.5 -2, 2 0, 2.5 +1, 3 +2) on dV 19.5. Judgement calls, all by number and not listened: crickets sit 8 dB under the fan (the cue text's "-18 dB relative to the fan" would be inaudible);
M1 +2 dB lift from G297; M2 -6 dB under the stadium; M5 faint = -6 dB; A1 -12 dB in the halt G185-216. Needs public/narration/EDU-EP18-SHORT-narration-placed-v2.wav (narration-place.py).
Run: python3 -I scripts/edu-series/ep18/short/sound-mix.py"""
import array, json, math, os, random, re, subprocess, wave
TOTAL, FPS, SR = 1872, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
CUES = {c['cue']: c for c in json.load(open('scripts/edu-series/ep18/short/sound-cues.json'))['cues']}
# every file this mix plays (sound-cues.py reads these quoted paths; the mix asserts the cue sheet names the same files)
PLACED = {
    'public/audio/bed/bed_cello-held-breath_01.wav',
    'public/audio/bed/bed_kalimba-explainer-100_01.wav',
    'public/audio/bed/bed_kalimba-home-sparse_01.wav',
    'public/audio/bed/bed_kalimba-low-pulse_01.wav',
    'public/audio/bed/bed_sub-swell-rise_01.wav',
    'public/audio/bed/bed_warm-pad-felt-third_01.wav',
    'public/audio/city/city_stadium-hush-far_01.wav',
    'public/audio/nature/nature_night-crickets_01.wav',
    'public/audio/nature/nature_rice-field-wind_01.wav',
    'public/audio/nature/nature_river-bank-morning_01.wav',
    'public/audio/nature/nature_river-dawn-hull_01.wav',
    'public/audio/nature/nature_village-lane-afternoon_01.wav',
    'public/audio/room/room_fan-night-oscillating_01.wav',
    'public/sfx/action/action_slap-forearm_01.wav',
    'public/sfx/creature/creature_dog-lick-hand_01.wav',
    'public/sfx/creature/creature_dog-sniff-snuffle_01.wav',
    'public/sfx/creature/creature_hippo-snort-spray_01.wav',
    'public/sfx/creature/creature_hippo-yawn-bellow_01.wav',
    'public/sfx/creature/creature_mosquito-whine-close_01.wav',
    'public/sfx/creature/creature_snake-slither-hiss_01.wav',
    'public/sfx/electric/electric_phone-shutter-flash_01.wav',
    'public/sfx/electric/electric_phone-wake-click_01.wav',
    'public/sfx/electric/electric_post-send-whoop_01.wav',
    'public/sfx/electric/electric_scroll-swipe-glass_01.wav',
    'public/sfx/foley/foley_blanket-settle-sigh_01.wav',
    'public/sfx/foley/foley_dog-trot-dirt_01.wav',
    'public/sfx/foley/foley_lamp-rocker-click_01.wav',
    'public/sfx/foley/foley_sandal-step-dirt-a_01.wav',
    'public/sfx/foley/foley_sandal-step-dirt-b_01.wav',
    'public/sfx/stinger/stinger_kalimba-shrug-ending_01.wav',
    'public/sfx/stinger/stinger_low-muted-hit_01.wav',
    'public/sfx/ui/ui_click-tick_01.wav',
    'public/sfx/vehicle/vehicle_motorbike-pass-doppler_01.wav',
    'public/sfx/water/water_charge-surge-bow-wave_01.wav',
    'public/sfx/water/water_halt-slap-snort_01.wav',
    'public/sfx/water/water_paddle-strokes-canoe_01.wav',
    'public/sfx/water/water_paddy-entry-slide_01.wav',
    'public/sfx/water/water_river-bulge-surface_01.wav',
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
VOICE_PATH = 'public/narration/EDU-EP18-SHORT-narration-placed-v2.wav'
voice = wav(VOICE_PATH); assert len(voice) == N, ('voice file is %d samples, the mix needs %d (run narration-place.py)' % (len(voice), N))
VOICE = float(re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', VOICE_PATH, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr, re.M)[-1])
MEASURED = VOICE; VOICE = -16.0
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
def win(track, cue, dV, pts=None, af='', xf=0.4, src0=0, rot=0.0, kind='I'):
    """Play/loop the cue's file over [frame, endFrame) with the sheet's fades at dV under the voice; src0 = start frame inside the file (srcStartFrame); rot = roll the loop by that fraction (second use of A3 starts mid-way); `pts` = dB envelope on G frames."""
    c = CUES[cue]; r = rel(c); a, b = c['frame'], c['endFrame']; snd = load(r, af)
    if src0: snd = snd[F(src0):]
    if rot: k = int(len(snd) * rot); snd = snd[k:] + snd[:k]
    s = loopfill(snd, F(b) - F(a), xf) if c.get('loop') else snd[:F(b) - F(a)]
    base = G(dV, r, kind) + (DUCK if track is bed else 0.0); e = ramp(pts) if pts else ONE
    put(track, s, a, b, lambda j: db(base) * e(j), c.get('fadeInFrames', 0) / FPS or 0.004, c.get('fadeOutFrames', 0) / FPS or 0.004)
CAPPED = []
def one(track, cue, dV, kind='M', af='', cap=-3.0, until=None, gdb_extra=0.0, pts=None):
    c = CUES[cue]; r = rel(c); snd = load(r, af); gdb = G(dV, r, kind) + gdb_extra; pk = max(abs(x) for x in snd) * db(gdb)
    if pk > db(cap): CAPPED.append((cue, cap - 20 * math.log10(pk))); gdb += cap - 20 * math.log10(pk)
    g = db(gdb); e = ramp(pts) if pts else ONE; s = F(c['frame']); n = len(snd); end = F(until if until else c['endFrame']) if (until or c.get('endFrame')) else N
    fo = max(1, int((c.get('fadeOutFrames') or 1) / FPS * SR)); fi = max(1, int(0.002 * SR))
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end): track[j] += snd[k] * g * e(j) * min(1.0, (k + 1) / fi, (n - k) / (0.02 * SR), (end - j) / fo)

AMB, E, M1DV = 22.0, {0.5: -8, 1: -4, 1.5: -2, 2: 0, 2.5: 1, 3: 2}, 19.5
# ================= BED layer (ducked under the voice): ambience then music
win(bed, 'A1-B01', AMB, [(0, 0), (180, 0), (185, -12), (212, -12), (217, 0)])        # A1 -20 dB in the halt G185-216 (near-silence)
win(bed, 'A2-B02', AMB, [(297, 0), (333, 0), (340, -3), (385, -3), (392, 0)])        # A2 low under the post G333-389
win(bed, 'A3-B03', AMB); win(bed, 'A5-B03', AMB); win(bed, 'A3-B04', AMB, rot=0.5)   # A3 second use starts mid-file (hen burst differs)
win(bed, 'A4-B04', AMB + 1, [(858, 0), (864, -6), (900, -6), (906, 0)])              # A4 low in the V03 clear G866-899 (source -50 LUFS hiss-heavy: judge by ear)
win(bed, 'A6-B05', AMB + 2); win(bed, 'A6x-B05', AMB + 10)
win(bed, 'A6-B06', AMB, [(1381, 0), (1495, 0), (1501, -6), (1658, -6), (1664, 0)]); win(bed, 'A6x-B06', AMB + 8, [(1381, 0), (1495, 0), (1501, -6), (1658, -6), (1664, 0)])
win(bed, 'M-motorbike', AMB - 3.5, kind='M')
win(bed, 'M1-in', M1DV, [(39, E[2.5]), (185, E[2.5])])
win(bed, 'M1-back', M1DV, [(217, E[2.5]), (295, E[2.5]), (305, E[2.5] - 2), (500, E[2.5] - 2), (508, E[2])], src0=146)   # the +2 lift drops back at the post (B02 background 14.5 against 15)
win(bed, 'M2', M1DV, [(508, E[2]), (580, E[2])])
win(bed, 'M2-back', M1DV, [(620, E[2]), (752, E[2]), (760, E[2] - 6), (866, E[2] - 6)], src0=72)
win(bed, 'M3', M1DV, [(904, E[1.5]), (1077, E[1.5])])
win(bed, 'M4', M1DV, [(1077, E[1]), (1141, E[1])])
win(bed, 'M5', M1DV, [(1391, -9), (1661, -9)])
win(bed, 'M6', 13.5, kind='M')
# ================= TEXTURE layer
TX = 20.0
for cue in ('S10-B02', 'S10-B05-1', 'S10-B05-2', 'S10-B05-3', 'S10-B05-4'): pass
win(tex, 'S10-B02', TX + 4, kind='M')                                                  # very quiet (plant for CL03)
win(tex, 'S10-B05-1', TX, kind='M'); win(tex, 'S10-B05-2', TX, kind='M'); win(tex, 'S10-B05-3', TX, [(1285, 0), (1369, -6)], kind='M'); win(tex, 'S10-B05-4', TX, [(1357, -6), (1381, -6)], kind='M')   # -6 dB over the pull-back from G1285
for cue in ('S13-1', 'S13-2', 'S13-3', 'S13-4', 'S13-single', 'S14-B03', 'S14-B04', 'S15-a', 'S18', 'S17', 'S16-b'): one(tex, cue, TX, 'M')
one(tex, 'S15-b', TX, 'M', gdb_extra=-6.0); one(tex, 'S16-a', TX + 4, 'M')
# ================= ACCENT layer
ACC = 13.5
for cue in ('S3', 'S4', 'S6', 'S22'): one(acc, cue, ACC + 2.0, 'M')
one(acc, 'S7', ACC + 4.0, 'M'); one(acc, 'S11', ACC + 3.5, 'M')   # B02 background was 14.8/13.7 against 15: S7/S11 2 dB, S8/S9 2 dB, S12 1.5 dB quieter
one(acc, 'S20', ACC + 10.0, 'M')
one(acc, 'S8', ACC + 8.0, 'M'); one(acc, 'S12', 8.5, 'M', cap=-4.0)
one(acc, 'S1', 7.0, 'M', pts=[(0, 0), (30, 0), (39, -14)]); one(acc, 'S2', 7.0, 'M', pts=[(2, 0), (30, 0), (39, -14)])   # hit in the lead (peak row), tails under L01 (G39-60)
one(acc, 'S5', 0.0, 'M', cap=-2.0); one(acc, 'S19', -8.0, 'M', cap=-5.0); one(acc, 'S21', -4.0, 'M', cap=-11.0)                      # gap accents, peak -6..3 LU
one(acc, 'S12-b', 15.0, 'M')
for k, r in enumerate((1.00, 1.06, 1.12, 1.18, 1.24, 1.30, 1.36), 1): one(acc, 'S9-t%d' % k, ACC + 6.0, 'M', af='asetrate=%d,aresample=%d' % (round(SR * r), SR))
one(acc, 'END1', 0.0, 'M', cap=-3.0)
# ================= stems
for cue, d in CAPPED: print('  capped: %s gain lowered by %.1f dB to peak %.0f dBFS' % (cue, -d, -3))
def apply_duck(tr):
    for i in range(nb):
        g = duck[i]
        for j in range(i * B, (i + 1) * B): tr[j] *= g
apply_duck(bed)
for tr in (bed, tex, acc):
    for j in range(F(TOTAL), N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
def wr(tr, p, dither=False):
    rnd = random.Random(17)
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    print(p, 'peak %.1f dBFS' % (20 * math.log10(max(abs(x) for x in a) / 32767 + 1e-9)))
wr(array.array('f', (x / 32767 for x in voice)), 'out/stems/voice.wav', True)
wr(bed, 'out/stems/bed.wav', True); wr(tex, 'out/stems/texture.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(bed, tex, acc))), 'public/audio/edu/EDU-EP18-SHORT-stem-v2.wav')
