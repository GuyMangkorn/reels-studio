#!/usr/bin/env python3
"""EDU-EP17-SHORT sound mix (Editor, W5.3 Draft, 14 Nov 2026): places the 52 cues of scripts/edu-series/ep17/sound-cues.json (Ton R1) at their integer frames (1815 f, 48 kHz mono) and writes the
per-layer stems (voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep17/sound-cues.json`, plus the baked sound stem
public/audio/edu/EDU-EP17-SHORT-draft-stem-v1.wav (bed + texture + accent; narration is its own track).
Gains: each cue's startGainDb is applied as dB on the library file as stored (Ton: "starting value from the library master"); `GAIN` below holds the Editor's per-cue adjustments from the mix-levels run
(each with its reason). Music map from the sheet: bed f92 file 0 s, mute f199-219, f489-673 -12 dB + low-pass 1.5 kHz, f673-732 -15 dB, f732-877 full, f877-928 cut, f928-1052 none, f1052-1126 -6 dB,
f1126-1299 out, f1299-1502 -6 dB + low-pass 3 kHz, out at f1502. Silence policy: hens (A17-VM) end with the stream joining f489+; hens S17-22 and crickets A17-VN-b ramp out f1512-1542; fire alone after.
Nothing here was listened: levels are by number. Run: python3 -I scripts/edu-series/ep17/narration-place.py && python3 -I scripts/edu-series/ep17/sound-mix.py"""
import array, json, math, os, subprocess, wave
TOTAL, FPS, SR = 1815, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
db = lambda x: 10 ** (x / 20)
cues = {c['cue']: c for c in json.load(open('scripts/edu-series/ep17/sound-cues.json'))['cues']}
LIB = [
    'public/audio/bed/bed_isan-brisk-march-112bpm_01.wav',
    'public/audio/stinger/stinger_isan-fire-low-note_01.wav',
    'public/audio/stinger/stinger_pong-lang-flourish_01.wav',
    'public/audio/stinger/stinger_reed-deflate-slide_01.wav',
    'public/audio/stinger/stinger_reed-festive-line_01.wav',
    'public/audio/stinger/stinger_wood-low-note-held_01.wav',
    'public/sfx/action/action_axe-green-wood_01.wav',
    'public/sfx/action/action_slap-forearm_01.wav',
    'public/sfx/creature/creature_giant-drink-far_01.wav',
    'public/sfx/creature/creature_hens-content-coop_01.wav',
    'public/sfx/creature/creature_mosquito-whine-close_01.wav',
    'public/sfx/creature/creature_theropod-footfall-sub_01.wav',
    'public/sfx/creature/creature_theropod-sniffs_01.wav',
    'public/sfx/electric/electric_phone-error-buzz_01.wav',
    'public/sfx/electric/electric_phone-lock-click_01.wav',
    'public/sfx/foley/foley_bucket-clank-tin_01.wav',
    'public/sfx/foley/foley_dry-log-knock_01.wav',
    'public/sfx/foley/foley_green-leaves-on-flame_01.wav',
    'public/sfx/foley/foley_hens-peck-dirt_01.wav',
    'public/sfx/foley/foley_log-onto-fire-sparks_01.wav',
    'public/sfx/foley/foley_match-strike-damp-fail_01.wav',
    'public/sfx/foley/foley_pot-fires-roar_01.wav',
    'public/sfx/foley/foley_sleeve-swish_01.wav',
    'public/sfx/foley/foley_tarp-drag-flap_01.wav',
    'public/sfx/foley/foley_wet-wood-hiss_01.wav',
    'public/sfx/nature/nature_campfire-night-crackle_01.wav',
    'public/sfx/nature/nature_dusk-stream-mosquito-rising_01.wav',
    'public/sfx/nature/nature_village-morning-hens_01.wav',
    'public/sfx/nature/nature_village-night-insects_01.wav',
    'public/sfx/ui/ui_metal-glint-chime_01.wav',
    'public/sfx/ui/ui_wood-peg-card-pop_01.wav',
    'public/sfx/water/water_hands-scoop-stream_01.wav',
    'public/sfx/water/water_rain-into-tin-bucket_01.wav',
    'public/sfx/water/water_river-pebbles-babble_01.wav',
    'public/sfx/water/water_single-drip-stream_01.wav',
    'public/sfx/weather/weather_rain-thatch-tin-heavy_01.wav',
    'public/sfx/whoosh/whoosh_sky-ripple-wormhole_01.wav',
]
LIBMAP = {os.path.splitext(os.path.basename(p))[0]: p for p in LIB}
def path(c): return LIBMAP[c['id']]
def load(rel, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-i', rel, '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else ''), '-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
# cue -> extra dB after the mix-levels run 1 (accents/textures that overlap speech sit 12 / 18 LU under it; Ton's startGainDb are starting values; B04 background was 11.1 dV against 15)
GAIN = {'S17-13': -9, 'S17-15a': -8, 'S17-15b': -8, 'S17-15c': -8, 'A17-RN': 4, 'S17-16a': -3, 'S17-16b': -3, 'S17-16c': -3, 'S17-19': -5, 'S17-01': -3, 'S17-07': -4, 'S17-09a': -6, 'S17-09b': -6, 'S17-09c': -6,
        'S17-09d': -6, 'S17-06': -3, 'S17-03': -8, 'S17-04': -6, 'S17-05': -6, 'S17-20': -6, 'S17-10': -6, 'S17-08': -4}
def g(cue): return db(cues[cue]['startGainDb'] + GAIN.get(cue, 0.0))
def ramp(points):
    pts = [(F(f), d) for f, d in points]
    def fn(j):
        if j <= pts[0][0]: d = pts[0][1]
        elif j >= pts[-1][0]: d = pts[-1][1]
        else:
            for (a, x), (b, y) in zip(pts, pts[1:]):
                if a <= j <= b: d = x + (y - x) * (j - a) / max(1, b - a); break
        return db(d) if d > -60 else 0.0
    return fn
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
def put(track, snd, f0, f1, gain, fi=0.004, fo=0.004, env=None):
    s0, s1 = F(f0), min(F(f1), N); a = max(1, int(fi * SR)); b = max(1, int(fo * SR))
    for j in range(s0, s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * gain * (env(j) if env else 1.0) * min(1.0, (k + 1) / a, (s1 - j) / b)
bed, tex, acc = (array.array('f', bytes(4 * N)) for _ in range(3))
def loop(track, cue, f0=None, f1=None, pts=None, xf=0.3, af='', fi=0.2, fo=0.2):
    c = cues[cue]; f0 = c['frame'] if f0 is None else f0; f1 = c['untilFrame'] if f1 is None else f1
    put(track, loopfill(load(path(c), af), F(f1) - F(f0), xf), f0, f1, g(cue), fi, fo, ramp(pts) if pts else None)
def one(track, cue, f=None, shift=0.0, tail=None, fo=0.02, fi=0.002, pts=None):
    c = cues[cue]; f = c['frame'] if f is None else f; snd = load(path(c))
    if tail: snd = snd[:int(tail * SR)]
    put(track, snd, f - shift, f - shift + len(snd) * FPS / SR, g(cue), fi, fo, ramp(pts) if pts else None)
# ================= BED: ambiences
loop(bed, 'A17-VN', pts=[(0, 0), (80, 0), (92, -60)], fo=0.02, fi=0.005)
loop(bed, 'A17-VM', 92, 598, pts=[(92, -60), (104, 0), (489, 0), (501, -9), (580, -9), (598, -60)])         # morning hens: under the stream from shot 9
loop(bed, 'A17-RV', pts=[(489, -60), (501, 0), (673, 0), (679, -3), (720, -3), (732, -60)], af='')             # river f489-732; -3 dB in shot 11 (sheet: lowpass 6 kHz)
loop(bed, 'A17-RN', 877, 1126, pts=[(877, -60), (889, 0), (928, 0), (934, -6), (1114, -6), (1126, -60)])      # rain; -6 dB muffled from shot 14
c = cues['A17-DU']; put(bed, load(path(c)), 1126, 1299, g('A17-DU'), 0.2, 0.2, ramp([(1126, -60), (1138, 0), (1287, 0), (1299, -60)]))
loop(bed, 'A17-FI', 1299, 1815, pts=[(1299, -60), (1311, 0), (1755, 0), (1815, -12)], fo=0.2)               # fire stays to the end; down 12 dB under the stinger note
loop(bed, 'A17-VN-b', pts=[(1502, 0), (1532, 0), (1542, -60)], fi=0.2, fo=0.01)
# ================= BED: music march (one file, f92, map from the sheet)
mc = cues['M17-bed']; mp = path(mc); m_full = load(mp); m_lp15 = load(mp, 'lowpass=f=1500'); m_lp3 = load(mp, 'lowpass=f=3000')
mus = array.array('f', bytes(4 * N))
gm = ramp([(92, 0), (198, 0), (199, -60), (219, -60), (220, 0), (488, 0), (496, -12), (672, -12), (678, -15), (731, -15), (737, 0), (876, 0), (877, -60), (1052, -60), (1060, -6), (1125, -6), (1126, -60),
           (1299, -60), (1304, -6), (1501, -6), (1502, -60)])
for j in range(F(92), F(1502)):
    k = j - F(92)
    if k >= len(m_full): break
    f = j * FPS / SR
    if 489 <= f < 673: s = m_lp15[k]
    elif f >= 1299: s = m_lp3[k]
    else: s = m_full[k]
    mus[j] = s * gm(j) * db(mc['startGainDb'] + GAIN.get('M17-bed', 0.0))
for j in range(N): bed[j] += mus[j]
# ================= TEXTURE
loop(tex, 'S17-03', fi=0.1, fo=0.1)
one(tex, 'S17-04'); one(tex, 'S17-05'); one(tex, 'S17-08', fo=0.3); one(tex, 'S17-10'); 
loop(tex, 'S17-11', 732, 877, pts=[(732, -60), (744, 0), (868, 0), (877, -60)])
one(tex, 'S17-14', fo=0.3)
for k in 'abc': one(tex, 'S17-16' + k, fo=0.05)
one(tex, 'S17-drips'); one(tex, 'S17-18a', fo=0.3); one(tex, 'S17-farslurp', fo=0.2)
c = cues['S17-20']; sn = load(path(c)); put(tex, sn, 1387, 1387 + len(sn) * FPS / SR, g('S17-20'), 0.01, 0.02, ramp([(1387, 0), (1387 + len(sn) * FPS / SR - 32, 0), (1387 + len(sn) * FPS / SR, -60)]))
one(tex, 'S17-22', pts=[(1512, 0), (1522, -10), (1532, -60)])
# ================= ACCENT
one(acc, 'S17-WORM')
for cue in ('S17-01', 'S17-02', 'S17-06', 'S17-07', 'S17-09a', 'S17-12a', 'S17-13', 'S17-09b', 'S17-15a', 'S17-15b', 'S17-15c', 'S17-17', 'S17-09c', 'S17-19', 'S17-21', 'S17-09d',
            'S17-23a', 'S17-24', 'S17-23b', 'S17-23c', 'S17-23d', 'S17-23e'): one(acc, cue)
one(acc, 'M17-flourish', shift=16)          # first hit 0.52 s into the file lands on the cue frame
one(acc, 'M17-held', fo=0.5, pts=[(673, 0), (732, 0), (735, -60)]); one(acc, 'M17-reed', fo=0.1)
one(acc, 'M17-deflate', shift=9)                       # attack 0.3 s into the file lands on the cue frame
c = cues['E-FIRE']; sn = load(path(c)); put(acc, sn, 1755, 1815, g('E-FIRE'), 0.005, 1.5)
# ================= stems
def wr(tr, p, dither=False):
    import random; rnd = random.Random(17)
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    print(p, 'peak %.1f dBFS' % (20 * math.log10(max(abs(x) for x in a) / 32767 + 1e-9)))
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
import shutil; shutil.copy('public/narration/EDU-EP17-SHORT-narration-v1.wav', 'out/stems/voice.wav')
wr(bed, 'out/stems/bed.wav', True); wr(tex, 'out/stems/texture.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(bed, tex, acc))), 'public/audio/edu/EDU-EP17-SHORT-draft-stem-v1.wav')
