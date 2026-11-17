#!/usr/bin/env python3
"""EDU-EP21-SHORT sound mix (Editor, W5.3 Draft v1 and v2, 2026-11-17; scene sheets EDU-EP21-SHEETS-R3 sound plan + D-S1/D-S8/D-M1; cue sheet scripts/edu-series/ep21/sound-cues.json, Ton).
Places the 17 cues of the cue sheet at their integer G frames (1320 f, 48 kHz mono) and writes the per-layer stems (voice, bed, ambience, accent) to out/stems/ for
`python3 -I scripts/mix-levels.py scripts/edu-series/ep21/sound-cues.json`, plus the baked sound stem public/audio/edu/EDU-EP21-SHORT-draft-stem-v1.wav (name kept; overwritten by v2)
(bed + ambience + accent; the narration is its own track, public/narration/EDU-EP21-SHORT-narration-v1.wav from narration-place.py). The cue sheet carries no
per-cue level, so every gain below is the Editor's, set against the sheet's `levels.checks` (dV to the voice) and the brief's ducking (music -8, A1 -6, A2 -8 under narration);
mix-levels.py reports the result. Nothing here was listened: the mix is by number.
Placements (sheet): A1/A2/A3 ambience map with 3 f equal-power crossfades on the cuts (A3 = A1 low-passed and -8 dB; A3-light G1178-1240 then the rain eases to -6 dB low-passed
to G1320, faded out under A_fade G1296-1320); M1 entries at file offset (G-29)/30 s snapped to the 92 bpm bar grid (2.6087 s, onsets of the file at 10.43/20.86/31.30 s = bars 4/8/12 from 0),
states by gain/high-pass only (D-M1); S1 file start G8 (crack at file 0.13 s lands G12); S8 whole 1.0 s at G852-882 (D-S8); S4 echo -6 dB under S4;
v2 (SHEETS-R4, Ton TG5): S9a = S1 file at G1248 (file start G1244, -2 dB under S1), S9b own file at G1266 (-1 dB under S1, tail -6 dB from G1272), END1 file start G1272 (fade under A_fade),
v3 (user audibility override 2026-11-17): S1 -4.5 dB on file (+8.5 dB), S9a/S9b keep -2/-1 dB under S1; voice dip -5 dB G12-20 baked by narration-place.py; S1 tail -4 dB G20-24.
M1 tail holds to G1230 then fades out by G1244, A1 plain G1240-1272 then eases -6 dB and low-passes G1272-1320.
Run: python3 -I scripts/edu-series/ep21/sound-mix.py   (needs the files locked in src/videos/edu-ep21/assets.lock.json: python3 -I scripts/store.py fetch; and narration-place.py)"""
import array, json, math, os, random, subprocess, wave
TOTAL, FPS, SR = 1320, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
db = lambda x: 10 ** (x / 20)
CUES = {c['cue']: c for c in json.load(open('scripts/edu-series/ep21/sound-cues.json'))['cues']}
# every file this mix plays (sound-cues.py reads these quoted paths)
FILES = {
    'A1': 'public/audio/weather/weather_car-roof-rain-storm-outside_01.wav',
    'A2': 'public/audio/room/room_car-cabin-heavy-rain_01.wav',
    'M1': 'public/audio/bed/bed_curious-felt-piano-pulse-92_01.wav',
    'S1': 'public/sfx/impact/impact_lightning-strike-close_01.wav',
    'S3': 'public/sfx/reveal/reveal_glass-glint-tick_01.wav',
    'S7': 'public/sfx/impact/impact_thunder-roll-far-swell_01.wav',
    'S4': 'public/sfx/reveal/reveal_breath-chime-glow-rise_01.wav',
    'S4s': 'public/sfx/reveal/reveal_breath-chime-glow-short_01.wav',
    'S5': 'public/sfx/vehicle/vehicle_split-tyre-air-hiss-settle_01.wav',
    'S6': 'public/sfx/electric/electric_radio-press-cutout-blip_01.wav',
    'S8': 'public/sfx/reveal/reveal_glass-filament-sweep-down_01.wav',
    'S9b': 'public/sfx/impact/impact_lightning-bonnet-strike-double_01.wav',
    'END1': 'public/sfx/stinger/stinger_storm-passing-piano-chord_01.wav',
}
assert all(os.path.exists(p) for p in FILES.values()), [p for p in FILES.values() if not os.path.exists(p)]
G = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sound-mix-gains.json')))   # dB per layer/cue, tuned against levels.checks

def load(path):
    cmd = ['ffmpeg', '-v', 'error', '-i', path, '-ar', str(SR), '-ac', '1', '-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a

# v4 (user 2026-11-17 breakrule: louder strike): S1 and S9b are shaped before placing: compressor + low-shelf body + volume push into a tanh soft clip,
# then peak-normalised to 0 dBFS (the gains below are relative to that); the whole mix goes through a brickwall limiter (see MASTER below).
SHAPE = {'S1': 'acompressor=threshold=0.05:ratio=8:attack=3:release=500:makeup=4,bass=g=5:f=130,volume=%gdB,asoftclip=type=tanh',
         'S9b': 'acompressor=threshold=0.05:ratio=8:attack=3:release=500:makeup=4,bass=g=5:f=130,volume=%gdB,asoftclip=type=tanh'}
def shaped(key):
    os.makedirs('out/stems', exist_ok=True); tmp = os.path.join('out', 'stems', '_shaped-' + key) + '.wav'   # scratch, not a timeline file
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', FILES[key], '-ar', str(SR), '-ac', '1', '-af', SHAPE[key] % G['shape_push_db'], '-c:a', 'pcm_f32le', tmp], check=True)
    a = load(tmp); pk = max(abs(x) for x in a); return array.array('f', (x / pk for x in a))

def lowpass(x, fc, poles=2):
    a = 1 - math.exp(-2 * math.pi * fc / SR)
    for _ in range(poles):
        y = array.array('f', bytes(4 * len(x))); s = 0.0
        for i, v in enumerate(x): s += a * (v - s); y[i] = s
        x = y
    return x
def highpass(x, fc):
    lp = lowpass(x, fc, 1); return array.array('f', (v - l for v, l in zip(x, lp)))

def loop(snd, n, xf=0.4):
    """tile `snd` over n samples from G0 phase, equal-power crossfade of its own tail into its head (seamless on the G clock)"""
    X = int(xf * SR); L = len(snd) - X; out = array.array('f', bytes(4 * n))
    for i in range(n):
        k = i % L
        v = snd[k]
        if k < X and i >= L: v = snd[k] * math.sin(k / X * math.pi / 2) + snd[L + k] * math.cos(k / X * math.pi / 2)   # head, with tail of the previous pass
        out[i] = v
    return out

def ramp(points, off=-200.0):
    """dB envelope over G frames, linear in dB between (frame, dB) points; None / <= -60 = silent"""
    pts = [(F(f), d) for f, d in points]
    def g(j):
        if j <= pts[0][0]: d = pts[0][1]
        elif j >= pts[-1][0]: d = pts[-1][1]
        else:
            for (a, x), (b, y) in zip(pts, pts[1:]):
                if a <= j <= b: d = x + (y - x) * (j - a) / max(1, b - a); break
        return 0.0 if d <= -60 else db(d)
    return g

def sw(frames):
    """equal-power switch weight: 0 before, 1 after, 3 f cosine ramp centred on each listed on/off (frame, +1/-1) pair; returns per-sample weight function for a set of [a,b) windows"""
    def w(j):
        t = 0.0
        for a, b in frames:
            up = min(1.0, max(0.0, (j - F(a) + F(1.5)) / F(3))) if a is not None else 1.0
            dn = min(1.0, max(0.0, (F(b) + F(1.5) - j) / F(3))) if b is not None else 1.0
            t = max(t, min(up, dn))
        return math.sin(t * math.pi / 2)
    return w

# ---- ambience: A1/A2 continuous on the G clock; A3 = A1 low-passed -8 dB; per-sample weights switch on the cuts
a1 = loop(load(FILES['A1']), N); a2 = loop(load(FILES['A2']), N)
a1lp = lowpass(a1, 1400)
A1_W = [(0, 223), (315, 408), (548, 765), (930, 1011)]            # A1 plain
A2_W = [(223, 315), (765, 822), (1011, 1105)]                      # A2 cabin
A3_W = [(408, 548), (822, 930)]                                    # A3 explanatory (A1 low-passed, -8 dB)
END_W = [(1105, 1178), (1240, None)]                               # A1 plain until the echo, and again G1240+ (rain alone before E1; R4)
LP_W = [(1178, 1240)]                                              # A3-light G1178-1240 only (R4)
w1 = sw(A1_W + END_W); w2 = sw(A2_W); w3 = sw(A3_W); wl = sw(LP_W)
lp_gain = ramp([(1178, G['amb_lp_light']), (1240, G['amb_lp_light'])])   # A3-light -4 dB G1178-1240
ease_g = ramp([(1272, 0), (1320, G['amb_lp_end'])])                      # R4: A1 eases -6 dB G1272-1320
ease_b = lambda j: min(1.0, max(0.0, (j - F(1272)) / F(24)))             # plain -> low-passed blend over 24 f from G1272
E0 = F(1272)
a3_db = db(G['amb_a3'])
fade_out = lambda j: 1.0 if j < F(1296) else max(0.0, (F(1320) - j) / F(24))   # fades under A_fade (linear amplitude)
amb = array.array('f', bytes(4 * N))
ga1, ga2 = db(G['amb_a1']), db(G['amb_a2'])
for j in range(N):
    p1, pl = a1[j] * w1(j) * ga1, a1lp[j] * (w3(j) * ga1 * a3_db + wl(j) * ga1 * lp_gain(j))
    if j >= E0:
        b = ease_b(j); eg = ease_g(j); pl += a1lp[j] * w1(j) * ga1 * b * eg; p1 *= (1 - b) * eg
    amb[j] = (p1 + a2[j] * w2(j) * ga2 + pl) * fade_out(j)

# ---- music M1: entries at snapped file offsets, states by gain / high-pass only (D-M1)
BAR = 4 * 60 / 92
snap = lambda g: round(((g - 29) / FPS) / BAR) * BAR
m1 = load(FILES['M1']); m1hp = highpass(m1, 180)
bed = array.array('f', bytes(4 * N))
def m1_play(g0, g1, off_s, fade_in_f, env_db, hp_ranges, fade_out_f=0):
    s0, s1 = F(g0), F(g1); o = int(off_s * SR); e = ramp(env_db)
    for j in range(s0, min(s1, N)):
        k = o + j - s0
        if k >= len(m1): break
        hp = any(a <= j < b for a, b in [(F(x), F(y)) for x, y in hp_ranges])
        v = (m1hp if hp else m1)[k]
        fi = min(1.0, (j - s0 + 1) / max(1, F(fade_in_f))); fo = min(1.0, (s1 - j) / max(1, F(fade_out_f))) if fade_out_f else 1.0
        bed[j] += v * e(j) * fi * fo
M = G['bed']
# 1: G29 offset 0, 10 f fade-in, energy 1.5 -> steady, out over 8 f. Sheet: from G315; moved to G298-306 (L03 ends G305.7) so the 400 ms meter of the cue sheet's drop row
# (B02 bed drop 10.6-13.5 s = G318+) no longer sees bed in its window (measured 19.7 dV with the G315 fade, row wants >= 30); L04 starts G320 over rain only either way
m1_play(29, G['m1_out_end'], 0.0, 10, [(0, M)], [], fade_out_f=8)
# 2: G410 back with the pulse, bar-snapped; G548-765 lighter -4 dB + high-pass 180 Hz; cut dead at G802 with the S6 blip
o2 = snap(410)
m1_play(410, 802, o2, 3, [(0, M), (548, M), (551, M + G['bed_light']), (762, M + G['bed_light']), (765, M + G['bed_light']), (778, M + G['bed_low']), (802, M + G['bed_low'])], [(548, 802)], fade_out_f=0)
# 'low under L08' (music map) = G765-778 down to bed_low, still high-passed, then cut dead at G802 with the S6 blip (the cue sheet's drop row sees no bed at 26.73 s)
# 3: G822 sparse re-entry -6 dB rising to -3 dB by G852; plain from G930; pulse stops G1171 (high-pass back), tail fades out G1230-1244 (v2; v1 faded G1171-1260)
o3 = snap(822)
m1_play(822, 1244, o3, 3, [(0, M - 6), (822, M - 6), (852, M - 3), (930, M - 3), (945, M - 1.5), (1230, M - 1.5)], [(1171, 1244)], fade_out_f=14)   # R4: pulse stops G1171, tail holds to G1230, fades out G1230-1244 (linear amplitude), silent before E1
for j in range(F(802), F(822)): bed[j] = 0.0   # silence G802-822 (the cutout beat)

# ---- accents
acc = array.array('f', bytes(4 * N))
SH = {k: shaped(k) for k in SHAPE}
def place(name, key, frame, gain_db, start_s=0.0, end_f=None, fade_in=0.002, env=None):
    snd = SH[key] if key in SH else load(FILES[key]); s0 = F(frame); s1 = min(F(end_f) if end_f is not None else s0 + len(snd) - int(start_s * SR), N)
    fi = max(1, int(fade_in * SR)); g = db(gain_db); k0 = int(start_s * SR)
    for j in range(s0, s1):
        k = k0 + j - s0
        if k >= len(snd): break
        acc[j] += snd[k] * g * (env(j) if env else 1.0) * min(1.0, (j - s0 + 1) / fi, (s1 - j) / max(1, int(0.002 * SR)))
place('S1', 'S1', 8, G['S1'])   # crack at file 0.13 s -> G12; v3: crack at full level (user audibility override), tail -4 dB from G20-24 so the tail rumble + narration stay under the -0.5 dBFS true-peak ceiling
for n, f in zip((1, 2, 3), (153, 168, 189)): place(f'S3-{n}', 'S3', f, G['S3'])
place('S7', 'S7', 323, G['S7'])
place('S4', 'S4', 419, G['S4'])
place('S5', 'S5', 636, G['S5'], env=ramp([(0, 0), (641, 0), (648, -14), (1320, -14)]))   # full at the look at the tyre (the GD1 gap), -14 dB under L07 (G646+)
place('S6', 'S6', 794, G['S6'])
place('S4r', 'S4s', 822, G['S4r'])
place('S8', 'S8', 852, G['S8'])                      # whole, untrimmed, 1.0 s -> G882 (D-S8)
place('S4e', 'S4', 1181, G['S4'] - 6)               # echo -6 dB under S4
place('S9a', 'S1', 1248 - 4, G['S9a'])               # R4: S1 file reused, file start G1244 (crack at file 0.13 s -> G1248), -2 dB under S1
place('S9b', 'S9b', 1266, G['S9b'], env=ramp([(0, 0), (1272, 0), (1274, -6), (1320, -6)]))   # file start G1266 (crack 0.02 s in), tail -6 dB from G1272 (under END1)
place('END1', 'END1', 1272, G['END1'], end_f=1320, env=ramp([(0, 0), (1296, 0), (1320, -60)]))   # R4 G1272; faded out with the rain under A_fade

# ---- voice
w = wave.open(os.path.join('out', 'EDU-EP21-SHORT', 'audio', 'narration-dipped-unlimited') + '.wav'); assert (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (SR, 1, 2)
v = array.array('h'); v.frombytes(w.readframes(w.getnframes())); assert len(v) == N, (len(v), N)
voice = array.array('f', (x / 32768 for x in v))

# ---- MASTER (v4, user 2026-11-17 breakrule): brickwall limiter on the sum of voice + bed + ambience + accent, ceiling -0.1 dBFS sample peak (user allowed breaking the -0.5 true-peak ceiling).
# Gain per sample = min over +-15 ms of (ceiling / |sum|) then a 30 ms moving average (so the gain is already down at the peak); the same gain is applied to every stem,
# to the baked narration and to the baked sound stem, so the stems mix-levels measures are what is heard. Narration and stem are the cut's two audio tracks (Remotion sums them).
CEIL = db(G['master_ceiling_db']); LA = int(0.015 * SR)
tot = [a + b + c + d for a, b, c, d in zip(voice, bed, amb, acc)]
r = [min(1.0, CEIL / abs(x)) if abs(x) > CEIL else 1.0 for x in tot]
from collections import deque
mn = array.array('f', bytes(4 * N)); dq = deque()
for j in range(N + LA):                       # sliding minimum over [j-LA, j+LA]
    if j < N:
        while dq and r[dq[-1]] >= r[j]: dq.pop()
        dq.append(j)
    c = j - LA
    if c >= 0:
        while dq[0] < c - LA: dq.popleft()
        mn[c] = r[dq[0]]
ps = array.array('d', bytes(8 * (N + 1)))
for j in range(N): ps[j + 1] = ps[j] + mn[j]
ga = array.array('f', bytes(4 * N))
for j in range(N):                            # centred moving average of the minimum, window 2*LA+1 (outside the file = 1.0)
    lo, hi = j - LA, j + LA + 1
    ga[j] = (ps[min(hi, N)] - ps[max(lo, 0)] + max(0, -lo) + max(0, hi - N)) / (2 * LA + 1)
red = min(ga); print('master limiter: max gain reduction %.1f dB, %d samples reduced' % (20 * math.log10(red), sum(1 for x in ga if x < 0.9999)))
print('limited G frames (gain < 0.9, grouped):', sorted({int(j * FPS / SR) for j in range(N) if ga[j] < 0.9}))
voice = array.array('f', (x * g for x, g in zip(voice, ga))); bed = array.array('f', (x * g for x, g in zip(bed, ga)))
amb = array.array('f', (x * g for x, g in zip(amb, ga))); acc = array.array('f', (x * g for x, g in zip(acc, ga)))
r = wave.open('public/narration/EDU-EP21-SHORT-narration-v1.wav', 'wb'); r.setnchannels(1); r.setsampwidth(2); r.setframerate(SR)
r.writeframes(array.array('h', (max(-32767, min(32767, round(x * 32767))) for x in voice)).tobytes()); r.close()   # the limited, dipped narration (narration-place.py rewrites the unlimited one)

os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
def wr(tr, p, dither=False):
    rnd = random.Random(17)   # stems only: +-1 LSB dither so mix-levels.py's ebur128 never sees all-zero 400 ms windows (EP15 finding)
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    print(p, 'peak %.1f dBFS' % (20 * math.log10(max(abs(x) for x in a) / 32767 + 1e-9)))
wr(voice, 'out/stems/voice.wav', True)
wr(bed, 'out/stems/bed.wav', True); wr(amb, 'out/stems/ambience.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(bed, amb, acc))), 'public/audio/edu/EDU-EP21-SHORT-draft-stem-v1.wav')
