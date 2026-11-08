#!/usr/bin/env python3
"""EDU-EP08-SHORT sound stem v3 (Editor, W5.3 Draft R2, 2026-11-08), per scene-sheets.md "Sound plan" (EDU-EP08-SHEETS-R2, 1762 f). Library files only: NEEDS-GEN NG-M1/NG-M2/NG-S1..S8 are
NOT generated in this draft (cost); the sheet's fallbacks are used and composed from library files (see the FALLBACK comments). Every file is generated and unlistened: levels are by number, not by ear.
Layers are built sample-exact in Python (envelopes in dB over global frames); the music bus is ducked under the narration with sidechaincompress.
Silence G95-G100 is exact zero on every layer (the helmet clears at G95; V01 ends at G93.9). Everything fades with the picture G1738-G1761 to true silence.
Writes public/audio/edu/EDU-EP08-SHORT-draft-stem-v3.wav (total frames from timeline.json, 48 kHz mono; R1.3: 1745 f; cues from the V02 slot on shifted by E11 = 14 f, tail cues by D). Needs public/narration/EDU-EP08-SHORT-narration-v3.wav (duck key). Run: python3 -I scripts/edu-series/ep08/sound-mix.py"""
import array, os, subprocess
L = os.path.expanduser('~/ReelsStore/library/sound')
import json
TOTAL = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'timeline.json')))['total_frames']   # R1.2 re-lock: 1731 f (R1.1: 1762)
FPS, SR = 30, 48000
E11 = [x['start'] for x in json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'timeline.json')))['shots'] if x['id'] == 'S01-B05-SH01'][0] - 1398   # R1.3: L11 got longer; every cue from the V02 slot (R1.1/R1.2 G1398) on moves by E11 (14 f)
D = TOTAL - 1762   # every cue at or after L13's end (R1.1 G1692) moves with the new tail
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
def load(rel, ss=0.0, t=None, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', f'{L}/{rel}', '-ac', '1', '-ar', str(SR)] + (['-af', af] if af else []) + ['-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
lin = lambda db: 0.0 if db is None else 10 ** (db / 20)
def env(points):  # [(frame, dB or None)] -> segments (s0, s1, g0, g1); outside = 0
    return [(F(a), F(b), lin(x), lin(y)) for (a, x), (b, y) in zip(points, points[1:]) if b > a]
def bed(track, snd, points, loop=True, pos0=0, at=0):  # snd starts at sample `at` of the timeline, read from pos0
    n = len(snd)
    for s0, s1, g0, g1 in env(points):
        d = max(1, s1 - s0)
        for j in range(s0, min(s1, N)):
            k = j - at + pos0
            if k < 0 or (not loop and k >= n): continue
            track[j] += snd[k % n] * (g0 + (g1 - g0) * (j - s0) / d)
def shot(track, snd, frame, db, fin=0.004, fout=0.02, off=0.0, until=None):  # one-shot with its first sample (minus `off` s) on a frame; `until` = frame where it is cut dead
    g = lin(db); s = F(frame) - int(off * SR); n = len(snd); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR)); end = F(until) if until else N
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end): track[j] += snd[k] * g * min(1, (k + 1) / fi, (n - k) / fo)
OFF = None
mus, mix = array.array('f', bytes(4 * N)), array.array('f', bytes(4 * N))
HB, HBN = load('sfx/tension/tension_heartbeat-slow_01.wav', t=0.85, af='lowpass=f=220'), None   # one felt beat per cue
tick = load('sfx/ui/ui_click-tick_01.wav', af='lowpass=f=2600')
# ---- B01-SH01/SH02 (G0-94): pad low + breath + carrier hiss, everything out on one frame G95 (hold 2.5)
bed(mus, load('ambience/space/space_thin-airy-pad_01.wav'), [(0, -20), (94, -20), (95, OFF)])
bed(mix, load('sfx/foley/foley_sleeper-breath-tent_01.wav'), [(0, -26), (94, -26), (95, OFF)])                    # FALLBACK NG-S1 suit breathing
bed(mix, load('sfx/electric/electric_radio-static-burst_01.wav', af='lowpass=f=4500'), [(0, -40), (94, -40), (95, OFF)])  # FALLBACK NG-S2 carrier hiss
shot(mix, load('sfx/foley/foley_flashlight-click_01.wav', af='lowpass=f=1800'), 21, -22)                          # clasp slip, muffled (SH01 L21)
# ---- heartbeat (felt) and ring ticks: B01-SH03 .. flashback grid 30 f from G101 (last G701, out over G728-739), B04 every 24 f from G1127 (+3 dB), B04-SH03/B05-SH01 every 30 f softer, last G1430
for g in list(range(101, 728, 30)): shot(mix, HB, g, -20)                                                          # includes G251 (the lock click, kept: both)
for g in list(range(1127, 1340, 24)): shot(mix, HB, g, -17)
for g in (1340, 1370, 1400 + E11): shot(mix, HB, g, -23)
shot(mix, HB, 1430 + E11, -25)
for g in [101, 233, 371, 517, 669, 1178, 1273, 1372, 1433 + E11, 1482 + E11]: shot(mix, tick, g, -26)                          # start tick + one per story second (ticks stop at G1482)
# ---- B01 cards and the objection insert
shot(mix, load('sfx/ui/ui_pop_01.wav'), 125, -14)                                                                  # balloon pop (SH03 L24)
shot(mix, load('sfx/comedy/comedy_record-scratch_01.wav'), 135, -20, fout=0.1)                                     # the red cross stops it (SH03 L34)
clack = load('sfx/foley/foley_deadbolt-clack_01.wav', af='highpass=f=700')                                         # FALLBACK NG-S3 two-stage ring lock (SH04 L9, L18)
shot(mix, clack, 242, -24); shot(mix, clack, 251, -20)
shot(mix, load('sfx/pulse/pulse_underwater-soft-thump_01.wav', af='lowpass=f=220'), 279, -26)                       # stamp thump (optional, SH05 L7)
# ---- B02 gags and flask
ice = load('sfx/water/water_ice-settle-tick_01.wav')                                                               # FALLBACK NG-S4 ice crackle: ticks layered (L3, L15 groups)
for g, db in ((374, -22), (376, -24), (378, -26), (386, -22), (388, -25), (394, -24), (398, -27)): shot(mix, ice, g, db)
shot(mix, load('sfx/stinger/stinger_pizz-shrug_01.wav'), 393, -18)                                                 # shrug on the ice failing (L22)
bed(mus, load('music/bed/bed_edu05-curious-theme_01.wav'), [(340, OFF), (352, -19), (490, -19), (500, -19), (503, OFF)], at=F(340))   # FALLBACK NG-M1, in at B02-SH01 L47, out dead on the cut G503
# ---- B03 glitter, drop card, flashback, air returns
shot(mix, load('sfx/reveal/reveal_glass-shimmer-soft_01.wav'), 515, -30, fout=0.3)                                 # glitter shimmer, very soft (L12)
for g in (652, 663, 671, 681, 692): shot(mix, load('sfx/ui/ui_pop_01.wav', af='asetrate=60000,aresample=48000'), g, -30)   # drop-card bubble pops (L42-82)
hum = load('sfx/hum/hum_low-travelling-flat_01.wav', af='lowpass=f=400')
bed(mix, hum, [(728, OFF), (739, -26), (1113, -26), (1126, OFF)])                                                  # FALLBACK NG-S6 chamber hum
pop = load('sfx/ui/ui_pop_01.wav', af='lowpass=f=2400')
shot(mix, pop, 856, -12)                                                                                           # hose pops loose (SH03 L128)
shot(mix, load('sfx/electric/electric_radio-static-burst_01.wav', t=0.9, af='highpass=f=2500,lowpass=f=9000,afade=t=out:st=0.1:d=0.8'), 856, -26, fin=0.01, fout=0.5)   # FALLBACK NG-S5 falling hiss
bed(mus, load('ambience/bed/bed_sub-drone-fade-in_01.wav'), [(923, OFF), (944, -26), (1113, -26), (1126, OFF)])
shot(mix, load('sfx/reveal/reveal_memory-swell-muffled_01.wav', t=1.4), 1084, -20, fin=0.15, fout=0.25)            # air returns, rising with the needle (L37)
# ---- B04: string harmonic builds as a riser, releases without a hit, glitter exhale
tu = load('music/tone/tone_thin-unresolved_01.wav')
bed(mus, tu, [(1151, OFF), (1163, -26), (1253, -24), (1336, -14), (1340, -16), (1349, OFF)], loop=False, at=F(1151))
shot(mix, load('sfx/reveal/reveal_glass-shimmer-soft_01.wav'), 1349, -20, fout=0.3)                                # FALLBACK NG-S7 glitter exhale shimmer
# ---- B05: radio, tow, thud, warm pad, tag, hiss
shot(mix, load('sfx/electric/electric_radio-static-burst_01.wav', t=0.4), 1399 + E11, -24, fin=0.01, fout=0.1)           # V02 crackle (L1-13)
warm = load('music/bed/bed_edu1-warm-pad-loop62_01.wav')                                                           # FALLBACK NG-M2 (pad alone), in at B05-SH01 L19
bed(mus, warm, [(1417 + E11, OFF), (1433 + E11, -22), (1481 + E11, -22), (1487 + E11, -28), (1692 + D, -28), (1697 + D, -30), (1738 + D, -30), (1761 + D, OFF)], at=F(1417 + E11))
shot(mix, load('sfx/pulse/pulse_underwater-soft-thump_01.wav', af='lowpass=f=150'), 1482 + E11, -10)                     # the hatch's felt thud, the tick stops (L43)
shot(mix, load('sfx/stinger/stinger_pizz-tag-ending_01.wav', t=2.2), 1693 + D, -13, fout=0.55, until=1759 + D)             # UT15 tag from G1693 (one frame after L13's unfaded voiced end)
bed(mix, load('sfx/electric/electric_radio-static-burst_01.wav', af='highpass=f=2500,lowpass=f=7000'), [(1705 + D, OFF), (1718 + D, -44), (1738 + D, -38), (1761 + D, OFF)])   # FALLBACK NG-S8 airlock hiss, rising, never full
def wr(tr, p):
    a = array.array('h', (max(-32767, min(32767, int(x * 32767))) for x in tr))
    open(p, 'wb').write(a.tobytes())
os.makedirs('out/EDU-EP08-SHORT/audio', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
wr(mus, 'out/EDU-EP08-SHORT/audio/mus.raw'); wr(mix, 'out/EDU-EP08-SHORT/audio/mix.raw')
DUR = TOTAL / FPS
g = ('[0:a]aformat=sample_fmts=fltp[mus];[1:a]aformat=sample_fmts=fltp[mx];[2:a]aformat=sample_fmts=fltp,asplit=1[key];'
     '[mus][key]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=400:makeup=1[musd];'
     f'[musd][mx]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},volume=4dB,alimiter=limit=0.89:level=disabled'+'[out]')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'out/EDU-EP08-SHORT/audio/mus.raw', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'out/EDU-EP08-SHORT/audio/mix.raw',
               '-i', 'public/narration/EDU-EP08-SHORT-narration-v3.wav', '-filter_complex', g, '-map', '[out]', '-ar', str(SR), '-ac', '1', '-t', str(DUR), 'public/audio/edu/EDU-EP08-SHORT-draft-stem-v3.wav'], check=True)
print('ok')

def zero_exact(path):  # exact zero G95-100 (frames 95..100) (sample-exact; the ffmpeg enable window lands on chunk boundaries)
    import wave
    w = wave.open(path); par = w.getparams(); d = bytearray(w.readframes(w.getnframes())); w.close()
    a, b = round(95 / 30 * par.framerate) * 2 * par.nchannels, round(101 / 30 * par.framerate) * 2 * par.nchannels
    d[a:b] = bytes(b - a)
    o = wave.open(path, 'wb'); o.setparams(par); o.writeframes(bytes(d)); o.close()
zero_exact('public/audio/edu/EDU-EP08-SHORT-draft-stem-v3.wav')
