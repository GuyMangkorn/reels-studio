#!/usr/bin/env python3
"""EDU-EP16-SHORT sound mix (Editor, R1.5b draft, 14 Nov 2026; EDU-EP16-SHEET-R1.5b, narration R2.3 re-placed at 2100 f): places the 83 cues of scripts/edu-series/ep16/sound-cues.json at their integer frames (2100 f, 48 kHz mono)
and writes the per-layer stems (voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep16/sound-cues.json`, plus the baked sound stem
public/audio/edu/EDU-EP16-SHORT-draft-stem-v1.wav (bed + texture + accent; the narration + character takes are their own track, narration-place.py).
Each cue gets its sheet gain (`startGainDb`, library master vs a -15.5 LUFS voice) plus the layer trim and the per-cue trim in ADJ below (set from mix-levels.py, listed in the round's notes).
Music map (sound-cues.md R1.5b notes): bass-only f377-443, hard cut f487 back f517 at -3 dB, thin one held note f1283 (-9 dB, low-pass 800 Hz) faded out f1333-1350, silent until f1624 (only M16-pizz f1598 plays),
night variant f1624-1753 (-4 dB, low-pass 3 kHz), normal f1753-1818 with M16-restate, f1818-1874 -4 dB low-pass 1 kHz, f1874-1929 normal, hard stop f1929.
Silence drop f1366: A16-RV goes to -26 dB (flow only; the sheet asks -18, the B05 drop row asks 30 LU under the voice) until f1494 and is back at 0 dB by f1504; the insects return as A16-FE-ret f1494-1504. S16-41 pulse stops dead at f1498.
Editor choices the sheet leaves open (listed in the round notes): A16-VN fades f80-f100 under the 0.5 s crossfade to A16-VM-a; S16-20 (laugh) is ducked a further 5 dB while V09 speaks (f1540-1592); S16-27b plays at -30 dB (the sheet's range is -28..-34, by number);
A16-VM-b is -6 dB while S16-32 plays and -6 dB in shot 14 (f1202-1283) and +3 dB in shots 12-13 for the wind; S16-38g is low-passed at 200 Hz (sheet); S16-23 drops 6 dB at f1874 and holds to f1929; E-TAG fades out from f2090 to f2100.
Nothing here was listened: levels are by number. Needs public/narration/EDU-EP16-SHORT-narration-v1.wav and the locked library files in public/.
Run: python3 -I scripts/edu-series/ep16/sound-mix.py"""
import array, json, math, os, random, re, shutil, subprocess, wave
TOTAL, FPS, SR = 2100, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
db = lambda x: 10 ** (x / 20)
ROOT = os.getcwd()
CUES = json.load(open('scripts/edu-series/ep16/sound-cues.json'))['cues']
LAYER_TRIM = {'bed': 0.0, 'texture': 0.0, 'accent': 0.0}          # dB on top of the sheet, all cues of the layer
ADJ = {'S16-04a': -8.0, 'S16-04b': -8.0, 'S16-04c': -8.0, 'S16-04d': -8.0, 'S16-19': -8.0, 'S16-13': -5.0, 'M16-bed': -1.5, 'E-TAG': 1.0, 'S16-27b': -2.0, 'S16-18': -7.5, 'S16-34': 2.0, 'M16-pizz': 2.5, 'M16-low': -3.0, 'S16-25': -3.0, 'S16-38a': -4.0, 'S16-38b': -4.0, 'S16-38c': -4.0, 'S16-38d': -4.0, 'S16-38e': -4.0, 'S16-38f': -4.0, 'S16-42': -4.0, 'S16-43a': -2.0}                                                           # per-cue dB trims (cue id -> dB), filled from mix-levels.py
DUCK_BED = 0.0                                                     # dB the beds drop while the voice speaks
FILES = {   # cue -> locked public/ file (src/videos/edu-ep16/assets.lock.json), literal so scripts/sound-cues.py sees every sound
    'A16-VN': 'audio/nature/nature_village-night-insects_01.wav',
    'S16-WORM': 'sfx/whoosh/whoosh_sky-ripple-wormhole_01.wav',
    'A16-VM-a': 'audio/nature/nature_village-morning-hens_01.wav',
    'M16-bed': 'audio/bed/bed_isan-cheeky-phin-100bpm_01.wav',
    'S16-01': 'sfx/foley/foley_flipflop-run-dirt_01.wav',
    'S16-02': 'sfx/creature/creature_hens-squawk-startled_01.wav',
    'S16-27': 'sfx/creature/creature_longneck-breath-rumble_01.wav',
    'A16-FE': 'audio/nature/nature_forest-edge-insects_01.wav',
    'S16-03': 'sfx/foley/foley_fern-frond-push_01.wav',
    'S16-28': 'sfx/creature/creature_dragonfly-giant-pass_01.wav',
    'S16-04a': 'sfx/ui/ui_pong-lang-tick_01.wav',
    'S16-04b': 'sfx/ui/ui_pong-lang-tick_01.wav',
    'S16-04c': 'sfx/ui/ui_pong-lang-tick_01.wav',
    'S16-04d': 'sfx/ui/ui_pong-lang-tick_01.wav',
    'S16-30': 'sfx/creature/creature_ankylosaur-forest-steps_01.wav',
    'S16-05a': 'sfx/whoosh/whoosh_reverse-shimmer-petal_01.wav',
    'S16-05b': 'sfx/whoosh/whoosh_reverse-shimmer-petal_01.wav',
    'S16-05c': 'sfx/whoosh/whoosh_reverse-shimmer-petal_01.wav',
    'S16-05d': 'sfx/whoosh/whoosh_reverse-shimmer-petal_01.wav',
    'S16-06': 'sfx/action/action_slap-back-of-hand_01.wav',
    'S16-07a': 'sfx/foley/foley_seeds-patter-leaves_01.wav',
    'S16-sleeve': 'sfx/foley/foley_sleeve-swish_01.wav',
    'S16-08': 'sfx/creature/creature_longneck-chew-leaves_01.wav',
    'S16-09': 'sfx/creature/creature_giant-nasal-breath_01.wav',
    'S16-10': 'sfx/foley/foley_seeds-rattle-palm_01.wav',
    'M16-run': 'audio/stinger/stinger_phin-upward-run_01.wav',
    'S16-11': 'sfx/whoosh/whoosh_seed-toss-small_01.wav',
    'S16-07b': 'sfx/foley/foley_seeds-patter-leaves_01.wav',
    'S16-08b': 'sfx/creature/creature_longneck-chew-leaves_01.wav',
    'S16-29': 'sfx/foley/foley_seedcone-crunch-jaws_01.wav',
    'S16-29b': 'sfx/foley/foley_seedcone-crunch-jaws_01.wav',
    'A16-VM-b': 'audio/nature/nature_village-morning-hens_01.wav',
    'S16-31a': 'sfx/creature/creature_ankylosaur-paddy-step_01.wav',
    'S16-31b': 'sfx/creature/creature_ankylosaur-paddy-step_01.wav',
    'S16-31c': 'sfx/creature/creature_ankylosaur-paddy-step_01.wav',
    'S16-12': 'sfx/action/action_hoe-thunk-mud_01.wav',
    'S16-31e': 'sfx/creature/creature_ankylosaur-huff-shake_01.wav',
    'S16-31d': 'sfx/creature/creature_ankylosaur-paddy-step_01.wav',
    'S16-32': 'sfx/nature/nature_paddy-day-night-cycle_01.wav',
    'S16-13': 'sfx/foley/foley_calendar-page-rips_02.wav',
    'S16-14': 'sfx/foley/foley_teak-door-creak_01.wav',
    'S16-33': 'sfx/foley/foley_rice-grain-trickle-sill_01.wav',
    'M16-tada': 'audio/stinger/stinger_pong-lang-tada_01.wav',
    'S16-15a': 'sfx/foley/foley_burlap-string-pull_01.wav',
    'S16-16': 'sfx/foley/foley_rice-sack-thud_01.wav',
    'S16-17': 'sfx/foley/foley_rice-pour-shell_01.wav',
    'A16-RV': 'audio/water/water_river-pebbles-babble_01.wav',
    'S16-18': 'sfx/water/water_net-splash-river_01.wav',
    'S16-37': 'sfx/creature/creature_pterosaur-flock-takeoff_01.wav',
    'S16-45': 'sfx/foley/foley_reed-wade-scramble_01.wav',
    'S16-41': 'sfx/tension/tension_heartbeat-soft-rise-72_01.wav',
    'S16-38a': 'sfx/creature/creature_theropod-footfall-mid_01.wav',
    'S16-38b': 'sfx/creature/creature_theropod-footfall-mid_01.wav',
    'S16-40': 'sfx/foley/foley_fern-body-push-far_01.wav',
    'S16-42': 'sfx/creature/creature_theropod-sniffs-deep_01.wav',
    'S16-38c': 'sfx/creature/creature_theropod-footfall-mid_01.wav',
    'S16-38d': 'sfx/creature/creature_theropod-footfall-mid_01.wav',
    'S16-43a': 'sfx/foley/foley_boy-relief-exhale_01.wav',
    'S16-38e': 'sfx/creature/creature_theropod-footfall-mid_01.wav',
    'A16-FE-ret': 'audio/nature/nature_forest-edge-insects_01.wav',
    'S16-38f': 'sfx/creature/creature_theropod-footfall-mid_01.wav',
    'S16-43b': 'sfx/foley/foley_villagers-relief-sigh_01.wav',
    'S16-18b': 'sfx/water/water_net-splash-river_01.wav',
    'S16-19': 'sfx/creature/creature_pterosaur-wing-rush_01.wav',
    'S16-20': 'sfx/crowd/crowd_villagers-laugh-warm_01.wav',
    'S16-34': 'sfx/creature/creature_pterosaur-gulp-far_01.wav',
    'M16-pizz': 'audio/stinger/stinger_pizz-button-comic_01.wav',
    'A16-FI': 'audio/nature/nature_campfire-night-crackle_01.wav',
    'S16-21': 'sfx/foley/foley_fish-grill-sizzle_01.wav',
    'S16-22': 'sfx/foley/foley_clay-bowl-slide-mat_01.wav',
    'A16-VM-c': 'audio/nature/nature_village-morning-hens_01.wav',
    'M16-restate': 'audio/stinger/stinger_phin-upward-run_01.wav',
    'S16-23': 'sfx/creature/creature_hens-content-coop_01.wav',
    'S16-24': 'sfx/foley/foley_eggs-clink-apron_01.wav',
    'M16-low': 'audio/stinger/stinger_phin-low-note_01.wav',
    'S16-25': 'sfx/creature/creature_hen-purr-trill_01.wav',
    'S16-26': 'sfx/creature/creature_hen-claw-scratch_01.wav',
    'S16-27b': 'sfx/creature/creature_longneck-breath-rumble_01.wav',
    'V06-cluck': 'sfx/creature/creature_hen-cluck-single_02.wav',
    'S16-41b': 'sfx/tension/tension_heartbeat-soft-rise-72_01.wav',
    'S16-38g': 'sfx/creature/creature_theropod-footfall-mid_01.wav',
    'S16-44': 'sfx/foley/foley_hen-beak-peck-single_01.wav',
    'E-TAG': 'audio/stinger/stinger_isan-series-tag_01.wav',
}
def pub(c): return 'public/' + FILES[c['cue']]
def load(path, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-i', path, '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else ''), '-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
voice = array.array('h'); w = wave.open('public/narration/EDU-EP16-SHORT-narration-v1.wav'); voice.frombytes(w.readframes(w.getnframes()))
assert len(voice) == N, (len(voice), N)
# ---- voice activity -> duck envelope
B = SR // 100; nb = N // B; speak = []
for i in range(nb):
    seg = voice[i * B:(i + 2) * B]; speak.append(math.sqrt(sum(x * x for x in seg) / max(1, len(seg))) / 32768 > db(-46))
held = []; last = -999
for i in range(nb):
    if speak[i]: last = i
    held.append(i - last <= 30)
duck = []; cur = 1.0; lo = db(-DUCK_BED)
for i in range(nb):
    tgt = lo if held[i] else 1.0; k = 1 - math.exp(-1 / (6 if tgt < cur else 30)); cur += (tgt - cur) * k; duck.append(cur)
tracks = {l: array.array('f', bytes(4 * N)) for l in ('bed', 'texture', 'accent')}
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
    while pos < n:
        for i in range(L):
            j = pos + i
            if j >= n: break
            wgt = 1.0
            if pos > 0 and i < x: wgt = i / x
            if pos + L - x < n and i >= L - x: wgt = (L - i) / x if pos + L < n + x else 1.0
            out[j] += snd[i] * wgt
        pos += L - x
    return out
def put(track, snd, f0, f1, gain_fn, fin=0.004, fout=0.004):
    s0, s1 = F(f0), min(F(f1), N); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR))
    for j in range(s0, s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * gain_fn(j) * min(1.0, (k + 1) / fi, (s1 - j) / fo)
cue = {c['cue']: c for c in CUES}
def gain_db(c): return c['startGainDb'] + LAYER_TRIM[c['layer']] + ADJ.get(c['cue'], 0.0)
def one(name, f=None, until=None, fin=0.002, fout=0.02, env=None, af='', src=None, db_extra=0.0):
    c = cue[name]; f = c['frame'] if f is None else f; snd = load(src or pub(c), af); n = len(snd) / SR * FPS
    end = f + n if until is None else until
    e = env or (lambda j: 1.0); g = db(gain_db(c) + db_extra)
    put(tracks[c['layer']], snd, f, end, lambda j: g * e(j), fin, fout)
def loop(name, f0=None, f1=None, env=None, xf=0.4, fin=0.25, fout=0.25, db_extra=0.0):
    c = cue[name]; f0 = c['frame'] if f0 is None else f0; f1 = c.get('untilFrame', TOTAL) if f1 is None else f1
    snd = loopfill(load(pub(c)), F(f1) - F(f0), xf); e = env or (lambda j: 1.0); g = db(gain_db(c) + db_extra)
    put(tracks[c['layer']], snd, f0, f1, lambda j: g * e(j), fin, fout)

def speech_env(extra_db):
    """envelope: `extra_db` dB lower while the voice speaks (held mask of the duck stage), 0 dB otherwise"""
    return lambda j: db(extra_db) if held[min(len(held) - 1, j // B)] else 1.0
LOOPS = {'A16-VN', 'A16-VM-a', 'A16-FE', 'S16-08', 'S16-08b', 'A16-VM-b', 'A16-RV', 'A16-FE-ret', 'A16-FI', 'S16-21', 'A16-VM-c', 'S16-23'}
# ================= BED layer: ambiences and the M16 music bed with its map
loop('A16-VN', 0, 100, env=ramp([(0, 0), (80, 0), (100, -60)]), fin=0.004)
loop('A16-VM-a', 92, 217, fin=0.5)
loop('A16-FE', 217, 929, fin=0.25, fout=0.25)
loop('A16-VM-b', 929, 1350, env=ramp([(929, 0), (968, 0), (975, -2), (1024, -2), (1030, -3), (1126, -3), (1132, 3), (1196, 3), (1202, -6), (1283, -6), (1290, 0), (1350, 0)]), fin=0.25, fout=0.25)
RV = ramp([(1350, 0), (1365, 0), (1366, -26), (1494, -26), (1504, 0), (1624, 0)])   # silence drop: a cut at f1366 (1 f), flow only until f1494
loop('A16-RV', 1350, 1624, env=RV, fin=0.25, fout=0.25)
loop('A16-FE-ret', 1494, 1624, env=ramp([(1494, -60), (1504, 0), (1624, 0)]), fin=0.05, fout=0.25)
loop('A16-FI', 1624, 1753, fin=0.25, fout=0.25)
loop('A16-VM-c', 1753, 2100, fin=0.4, fout=0.25)
# M16 bed: one file from f92 to f1929; low-pass copies cross-faded in over the map windows
c = cue['M16-bed']; m1 = load(pub(c)); m300, m800, m3k, m1k = (load(pub(c), f'lowpass=f={hz}') for hz in (300, 800, 3000, 1000))
MEND = 1929
def mapped(j):
    f = j * FPS / SR
    def win(a, b, ramp_f=4): return min(1.0, max(0.0, (f - a) / ramp_f)) * min(1.0, max(0.0, (b - f) / ramp_f))
    gain, lp, wt = 0.0, None, 0.0
    for a, b, which, d in ((377, 443, 300, -6), (1283, 1350, 800, -9), (1624, 1753, 3000, -4), (1818, 1874, 1000, -4)):
        k = win(a, b)
        if k > 0: lp, wt, gain = which, k, gain + d * k
    if 517 <= f < 637: gain += -3 * min(1.0, (f - 517) / 4)
    fade = 1.0 if f < 1333 else max(0.0, (1350 - f) / 17) if f < 1350 else 0.0
    cut = 0.0 if (487 <= f < 517 or 1333 <= f < 1624 or f >= MEND) else 1.0
    return gain, lp, wt, cut, fade
mt = tracks['bed']; g0 = db(gain_db(c)); s0 = F(92)
for j in range(s0, min(N, F(MEND))):
    k = j - s0
    if k >= len(m1): break
    gain, lp, wt, cut, fade = mapped(j)
    if not cut and fade <= 0: continue
    f = j * FPS / SR
    x = m1[k]
    if lp: x = m1[k] * (1 - wt) + {300: m300, 800: m800, 3000: m3k, 1000: m1k}[lp][k] * wt
    edge = min(1.0, (f - 92) * 30 / 120 + 0.03, (MEND - f) * 30 / 30 + 0.0, (f - 517) * 30 / 40 if 517 <= f < 540 else 1.0, (487 + 1.2 - f) * 30 / 40 if 485 < f < 488.2 else 1.0, (f - 1624) * 30 / 40 if 1624 <= f < 1650 else 1.0)
    if 1333 <= f < 1350: cut = 1.0
    mt[j] += x * g0 * db(gain) * max(0.0, edge) * (fade if 1333 <= f < 1350 else cut)
# ================= TEXTURE layer
for n in ('S16-01', 'S16-27', 'S16-03', 'S16-05a', 'S16-05b', 'S16-05c', 'S16-05d', 'S16-07a', 'S16-sleeve', 'S16-10', 'S16-11', 'S16-07b', 'S16-33', 'S16-15a', 'S16-16', 'S16-17', 'S16-22', 'S16-24', 'S16-26', 'S16-40', 'S16-43b'): one(n)
one('S16-27b', until=1929, fout=0.1)
one('S16-45', until=1405, fout=0.25)
one('S16-41', until=1498, fout=0.02)
one('S16-41b', until=2045, fout=0.06)
loop('S16-08', 677, 781, fin=0.05, fout=0.05); loop('S16-08b', 888, 929, fin=0.05, fout=0.05)
loop('S16-21', 1624, 1753, fin=0.1, fout=0.1)
loop('S16-23', 1753, 1929, env=ramp([(1753, 0), (1874, 0), (1881, -6), (1929, -6)]), fin=0.1, fout=0.05)
# ================= ACCENT layer
for n in ('S16-WORM', 'S16-02', 'S16-28', 'S16-04a', 'S16-04b', 'S16-04c', 'S16-04d', 'S16-30', 'S16-06', 'S16-09', 'M16-run', 'S16-29', 'S16-29b', 'S16-31a', 'S16-31b', 'S16-31c', 'S16-12', 'S16-31e', 'S16-31d', 'S16-13', 'S16-14', 'M16-tada', 'S16-18',
          'S16-38a', 'S16-38b', 'S16-42', 'S16-38c', 'S16-38d', 'S16-43a', 'S16-38e', 'S16-38f', 'S16-18b', 'S16-34', 'M16-pizz', 'M16-restate', 'M16-low', 'S16-25', 'V06-cluck', 'S16-44'): one(n)
one('S16-32', until=1128, fout=0.3)
one('S16-37', until=1384, fout=0.15)
one('S16-19', until=1544, fout=0.25)
one('S16-20', env=speech_env(-5.0), fout=0.1)       # laugh under V09 (f1540-1592): a further 5 dB down while the voice speaks, full level after
one('S16-38g', af='lowpass=f=200')
one('E-TAG', until=2100, fout=0.33)
# ================= ducking, cut-off, stems
for i in range(nb):
    g = duck[i]
    for j in range(i * B, (i + 1) * B): tracks['bed'][j] *= g
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
def wr(tr, p, dither=False):
    rnd = random.Random(16)   # stems only: +-1 LSB dither (scripts/mix-levels.py drops ebur128 'nan' steps of an all-zero 400 ms window)
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    print(p, 'peak %.1f dBFS' % (20 * math.log10(max(abs(x) for x in a) / 32767 + 1e-9)))
wr(array.array('f', (x / 32768 for x in voice)), 'out/stems/voice.wav', True)   # voice stem = the narration track + dither (the narration file itself is untouched)
wr(tracks['bed'], 'out/stems/bed.wav', True); wr(tracks['texture'], 'out/stems/texture.wav', True); wr(tracks['accent'], 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(tracks['bed'], tracks['texture'], tracks['accent']))), 'public/audio/edu/EDU-EP16-SHORT-draft-stem-v1.wav')
