#!/usr/bin/env python3
"""EDU-EP16-SHORT sound mix (Editor, W5.3 Draft re-render on EDU-EP16-SHEETS-R2, 2026-11-15; voice lock v2 read placed N1-N4): places the 39 cues of scripts/edu-series/ep16/sound-cues.json at their integer frames
(1800 f, 48 kHz) and writes the per-layer MONO stems (voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep16/sound-cues.json`, plus the baked
sound stem public/audio/edu/EDU-EP16-SHORT-draft-stem-v2.wav (bed + texture + accent, stereo: only S14/S15 are panned; narration is its own track).
Levels are `dV` = LU under the placed narration's integrated loudness (measured here): gain = (VOICE - dV) - the file's reference (integrated LUFS for beds/loops, momentary max for short accents).
Beds (A1, M1, M2, hum) are ducked 6 dB while the voice speaks (hold 0.3 s). Nothing here was listened: levels are by number, to the rows of the sheet's `levels.checks`.
User decisions (delivery.md, 15 Nov 2026): M1 drone keeps running through W-STOP f672-735 with a -3 dB step at f735 (L18 start); S02 blips in B03 (f588-672) are 12 dB under the voice; S20 strike gets -6 dB mix gain;
whoosh/S17 ends get a 4 f fade ending at the sheet frame. Run: python3 -I scripts/edu-series/ep16/sound-mix.py (after narration-place.py)."""
import array, math, os, random, re, subprocess, wave
TOTAL, FPS, SR = 1800, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
_cache = {}
def load(rel, ss=0.0, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', 'public/' + rel, '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else ''), '-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
def meas(rel):
    """(integrated LUFS, momentary max LUFS) of a public/ file's mono sum, padded to 1 s (mix-levels.py reads the stem the same way)."""
    if rel not in _cache:
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', 'public/' + rel, '-af', 'pan=mono|c0=0.5*c0+0.5*c1,apad=whole_dur=1,ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
        i = float(re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', r, re.M)[-1]); m = max(float(x) for x in re.findall(r'M:\s*(-?[\d.]+)', r))
        _cache[rel] = (i, m)
    return _cache[rel]
db = lambda x: 10 ** (x / 20)
def wav(path):
    w = wave.open(path); a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
VOICE_PATH = 'public/narration/EDU-EP16-SHORT-narration-placed-v2.wav'
voice = wav(VOICE_PATH)
assert len(voice) == N, ('voice file is %d samples, the mix needs %d (run narration-place.py)' % (len(voice), N))
VOICE = float(re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', VOICE_PATH, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr, re.M)[-1])
print('voice integrated %.1f LUFS' % VOICE)
def G(dV, rel, kind='I'): return VOICE - dV - meas(rel)[0 if kind == 'I' else 1]
Z = lambda: array.array('f', bytes(4 * N))
bed, tex, accL, accR = Z(), Z(), Z(), Z()
# ---- voice activity -> duck envelope for the bed layer
B = SR // 100; nb = N // B
speak = [math.sqrt(sum(x * x for x in voice[i * B:(i + 2) * B]) / max(1, len(voice[i * B:(i + 2) * B]))) / 32768 > db(-46) for i in range(nb)]
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
DUCK = 6.0
def speaking(f):
    i = int(F(f) / B); return any(held[max(0, i - 2):i + 25])   # voice within 0.25 s after the frame (or just before it)
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
def put(track, snd, f0, f1, gain_fn, fade_in=0.004, fade_out=0.004):
    s0, s1 = F(f0), min(F(f1), N); fi = max(1, int(fade_in * SR)); fo = max(1, int(fade_out * SR))
    for j in range(s0, s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * gain_fn(j) * min(1.0, (k + 1) / fi, (s1 - j) / fo)
def bedwin(rel, f0, f1, dV, pts=None, xf=0.4, extra=0.0, kind='I', fade_in=0.004, fade_out=0.004, track=None, duck_allow=True, skip=0):
    """`rel` looped over [f0,f1) at dV under the voice in speech (+ duck allowance for the bed layer); pts = extra dB envelope on global frames."""
    tr = bed if track is None else track
    snd = load(rel)[F(skip):]; s = loopfill(snd, F(f1) - F(f0), xf) if len(snd) < F(f1) - F(f0) else snd
    base = G(dV, rel, kind) + extra + (DUCK if tr is bed and duck_allow else 0.0)
    e = ramp(pts) if pts else (lambda j: 1.0)
    put(tr, s, f0, f1, lambda j: db(base) * e(j), fade_in, fade_out)
CAP = -3.0; CAPPED = []
def shot(tracks, snd, f, gdb, fin=0.002, fout=0.02, until=None, pan=None):
    pk = max(abs(x) for x in snd) * db(gdb)
    if pk > db(CAP): CAPPED.append((f, gdb, CAP - 20 * math.log10(pk))); gdb += CAP - 20 * math.log10(pk)
    gains = [db(gdb)] * len(tracks) if pan is None else [db(gdb) * p for p in pan]
    s = F(f); n = len(snd); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR)); end = F(until) if until else N
    for tr, g in zip(tracks, gains):
        for k in range(n):
            j = s + k
            if 0 <= j < min(N, end): tr[j] += snd[k] * g * min(1.0, (k + 1) / fi, (n - k) / fo, (end - j) / fo)
def one(tracks, rel, f, dV, kind='M', skip_f=0, until=None, fade_f=None, gain_db=None, pan=None, **kw):
    """short cue: first `skip_f` frames of the file dropped (startOffsetFrames); `until` = last frame sounding, with a `fade_f`-frame fade ending there."""
    snd = load(rel)[F(skip_f):]
    if until is not None: snd = snd[:F(until) - F(f)]
    g = G(dV, rel, kind) if gain_db is None else gain_db
    if fade_f is not None: kw['fout'] = fade_f / FPS
    shot(tracks, snd, f, g, until=None, pan=pan, **kw)
ACC = [accL, accR]; TEX = [tex]
A1, HUM = 'audio/city/city_rooftop-night-bangkok-far_01.wav', 'audio/city/city_still-night-air_01.wav'
DR, DRD = 'audio/bed/bed_cold-sub-drone-loop_01.wav', 'audio/bed/bed_cold-sub-drone-down-semitone_01.wav'

# ================= BED layer (ducked under the voice): A1 roof bed, hum, M1 drone, M2 pad
A_DV = 19.5
bedwin(A1, 0, 121, 20.0, [(0, 0), (107, 0), (121, -60)])                                        # A1-open, fades out by f121 (designed silence f121-163)
bedwin(A1, 489, 803, A_DV + 5.0, [(489, -60), (501, 0), (788, 0), (803, -60)])                 # A1-ret1: thinned (-4 dB), fade in over S11, out by f803; the hum that remains under W-STOP
bedwin(HUM, 1097, 1171, A_DV, [(1097, -60), (1101, 0), (1158, 0), (1171, -60)], xf=0.4)          # A1-ret2: city hum returns first (S21), out into the forest
bedwin(A1, 1323, 1495, A_DV + 1.0, [(1323, -60), (1332, 0), (1475, 0), (1478, -3), (1489, -3), (1495, -60)])  # A1-ret3 (-3 dB dip at f1478, hands over to the hum f1495)
bedwin(HUM, 1495, 1800, A_DV, [(1495, -60), (1501, 0), (1800, 0)], xf=0.4)                       # A1-hum to the end (alone from f1785)
# M1 drone f123 -> 1421, then the semitone-down file to the end. -3 dB step at f735 (user, 15 Nov: keeps running through W-STOP; L18 start). Dead f1091-1097 (strike silence), back by f1111.
M_DV = 20.5
m1_env = ramp([(123, -60), (153, 0), (735, 0), (741, -3), (1083, -3), (1091, -60), (1097, -60), (1111, -3), (1421, -3), (1427, -60)])
snd = load(DR); s = loopfill(snd, F(1427) - F(123), 1.5); base = G(M_DV, DR) + DUCK
put(bed, s, 123, 1427, lambda j: db(base) * m1_env(j), 0.004, 0.004)
dn = load(DRD); dn_env = ramp([(1415, -60), (1421, -3), (1800, -3)]); s2 = loopfill(dn, F(1800) - F(1415), 1.5); base2 = G(M_DV, DRD) + DUCK
put(bed, s2, 1415, 1800, lambda j: db(base2) * dn_env(j), 0.004, 0.004)                         # 6 f crossfade at f1421 (the loop file ramps out over 1421-1427)
bedwin('audio/tone/tone_cold-glass-pad-sparse_01.wav', 237, 552, 25.0, [(237, -60), (243, 0), (507, 0), (552, -60)], fade_out=0.002)   # M2 pad, 1.5 s fade from f481

# ================= TEXTURE layer (not ducked)
HEAD = 'audio/space/space_inside-head-air_01.wav'
bedwin(HEAD, 316, 489, 20.5, [(316, -60), (324, 0), (475, 0), (489, -60)], track=tex, xf=0.5)          # S08-1
bedwin(HEAD, 803, 1091, 20.0, [(803, -60), (813, 0), (1083, 0), (1091, -60)], track=tex, xf=0.5)       # S08-2, stops by the strike silence
bedwin(HEAD, 1171, 1185, 27.0, [(1171, 0), (1179, 0), (1185, -60)], track=tex)                          # S08-3, 14 f, 6 f fade
one(TEX, 'audio/tension/tension_travel-tone-bead-up-down_01.wav', 404, 23.0, 'I', until=469, fade_f=2)          # S09
one(TEX, 'audio/mechanical/mechanical_soft-clock-ticks-slow_01.wav', 404, 23.0, 'I', until=482, fade_f=6)        # S10, trimmed to 78 f, last 6 f faded
TS = 'audio/tension/tension_travel-tone-slow-low_01.wav'
one(TEX, TS, 933, 20.0, 'I', until=1081, fade_f=1)                                                       # S18, snaps off at contact
one(TEX, 'audio/nature/nature_forest-leaf-wind-insects-stop_01.wav', 1173, 20.0, 'I', fin=0.3, fade_f=4)         # S24 forest
one(TEX, 'audio/tone/tone_end-sky-sine-fade_02.wav', 1497, 20.0, 'M', fin=0.001, fade_f=1)                   # S28 END-TONE _02 (fade-in 30 f and fade-out f1755-1785 baked in, no extra fade), aim 20 under L15/L16

# ================= ACCENT layer
def sp(f): return speaking(f)
one(ACC, 'audio/ui/ui_old-electronic-ping-eerie_01.wav', 0, 0.0, 'M')                                      # S01 PING in the open gap (peak -6..3)
BL = 'audio/ui/ui_soft-blip-short_01.wav'; blip_log = []
for n in range(1, 33):
    f = 21 * n
    if 316 <= f < 489: continue                                                                           # muted over the thought-space
    if f >= 571:
        dV = 12.5 if sp(f) else 3.0                                                                       # B03: 12 under in speech (user, 15 Nov: EP08b floor), forward in a gap
    else: dV = 17.8 if f == 126 else 14.5                                                              # f126 sits on the L02 onset: the row meter reads it 2.7 LU louder than set, so 17.8 reads >= 15
    one(ACC, BL, f, dV, 'M'); blip_log.append((f, dV, sp(f)))
one(ACC, 'audio/vocal/vocal_happy-gasp-young-woman_01.wav', 8, 8.0, 'M')                                   # S03 gasp (lands in the W-PING silence, before L01 at f31)
one(ACC, 'audio/foley/foley_headphone-band-creak_01.wav', 43, 17.0, 'M')                                  # S04
one(ACC, 'audio/foley/foley_knit-sleeve-rustle_01.wav', 53, 17.0, 'M')                                    # S05
BLOOM = 'audio/reveal/reveal_thought-bubble-bloom_01.wav'
one(ACC, BLOOM, 307, 17.0, 'M')                                                                        # S06
one(ACC, 'audio/whoosh/whoosh_inhale-into-thought_01.wav', 309, 18.0, 'M', until=326, fade_f=4)           # S07 ends f312, 4 f fade
one(ACC, 'audio/whoosh/whoosh_exhale-out-of-thought_01.wav', 489, 13.5, 'M', skip_f=12, until=501, fade_f=2)  # S11 startOffsetFrames 12
one(ACC, 'audio/tension/tension_airy-swell-stop-dead_01.wav', 636, 17.0, 'M', until=693, fade_f=0.0005 * FPS, fin=0.01)   # S12 riser, ends dead at f693 (the missing blip)
one(ACC, 'audio/whoosh/whoosh_muffled-iris-in_01.wav', 797, 18.0, 'M', until=815, fade_f=4)               # S13
PAN_L, PAN_R = 1.82, 0.18                                                                              # centre-equivalent in the mono sum, R at -20 dB
one(ACC, 'audio/tension/tension_breathy-swell-left_01.wav', 809, 13.5, 'M', pan=[PAN_L, PAN_R])           # S14
one(ACC, 'audio/tension/tension_breathy-swell-right_01.wav', 827, 13.5, 'M', pan=[PAN_R, PAN_L])          # S15
one(ACC, 'audio/reveal/reveal_warm-two-note-shimmer_01.wav', 856, 13.5, 'M')                              # S16
one(ACC, 'audio/tension/tension_low-breath-rise_01.wav', 875, 13.5, 'M', until=890, fade_f=4)             # S17 ends f850, 4 f fade
one(ACC, 'audio/tension/tension_pressure-riser-choked_01.wav', 1019, 13.5, 'M', until=1081, fade_f=1)       # S19 ends dead on f1081
one(ACC, 'audio/impact/impact_dull-sub-thud-muffled_02.wav', 1081, 0.0, 'M', gain_db=-6.0, fin=0.001, fout=0.13)   # S20 strike: mix gain -6 dB (user, 15 Nov); silent by f1091
one(ACC, 'audio/whoosh/whoosh_muffled-iris-out_01.wav', 1097, 14.5, 'M', skip_f=15, until=1109, fade_f=2)  # S21 startOffsetFrames 15
one(ACC, 'audio/foley/foley_swallow-small_01.wav', 1112, 13.5, 'M')                                       # S22
one(ACC, BLOOM, 1169, 13.5, 'M')                                                                       # S06b (S23 reuse)
one(ACC, 'audio/foley/foley_knit-sleeve-rustle_02.wav', 1452, 6.0, 'M')                                   # S25 (W-OFF silence: forward, no speech)
one(ACC, 'audio/foley/foley_held-breath-in_01.wav', 1454, 6.0, 'M')                                       # S26
one(ACC, 'audio/foley/foley_flashlight-click_01.wav', 1478, 3.0, 'M')                                     # S27 lamp click, close and dry
one(ACC, 'audio/tone/tone_end-lonely-note_01.wav', 1762, 0.0, 'M', gain_db=0.0, until=1800, fin=0.001, fade_f=0.6)   # S29 END-NOTE (user pick as is, 15 Nov): file -3 dBFS peak, no gain; placed span f1762-1800 (38 f), 20 ms fade-out only

# ================= silence policy, ducking, stems
for f, g, d in CAPPED: print('  capped: f%d at %.1f dB gain lowered by %.1f dB to peak %.0f dBFS' % (f, g, -d, CAP))
apply_duck(bed)
for tr in (bed, tex, accL, accR):
    for j in range(F(TOTAL) - 1, N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
def wr(trs, p, dither=False, seed=16):
    rnd = random.Random(seed)   # stems only: +-1 LSB dither so mix-levels.py never sees an all-zero 400 ms window ('nan' steps shift every later step)
    chans = [array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr)) for tr in trs]
    w = wave.open(p, 'wb'); w.setnchannels(len(chans)); w.setsampwidth(2); w.setframerate(SR)
    if len(chans) == 1: w.writeframes(chans[0].tobytes())
    else:
        inter = array.array('h', bytes(2 * N * len(chans)))
        for c, ch in enumerate(chans): inter[c::len(chans)] = ch
        w.writeframes(inter.tobytes())
    w.close(); pk = max(max(abs(x) for x in ch) for ch in chans) / 32767; print(p, 'peak %.1f dBFS' % (20 * math.log10(pk + 1e-9)))
wr([array.array('f', (x / 32768 for x in voice))], 'out/stems/voice.wav', True, 99)   # dithered stem copy of the placed narration (the video plays the clean file)
mono_acc = array.array('f', ((a + b) * 0.5 for a, b in zip(accL, accR)))
wr([bed], 'out/stems/bed.wav', True); wr([tex], 'out/stems/texture.wav', True); wr([mono_acc], 'out/stems/accent.wav', True)
wr([array.array('f', (a + b + c for a, b, c in zip(bed, tex, accL))), array.array('f', (a + b + c for a, b, c in zip(bed, tex, accR)))], 'public/audio/edu/EDU-EP16-SHORT-draft-stem-v2.wav')
print('blips (frame, dV, speaking):', ' '.join('f%d/%g/%s' % (f, d, 'S' if s else 'g') for f, d, s in blip_log))
