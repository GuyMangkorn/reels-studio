#!/usr/bin/env python3
"""EDU-EP11-SHORT sound stem v5 (rewind layers +5 dB vs v4, 2026-11-09; Editor, W5.3 Draft, 2026-11-09), per scene-sheets.md EDU-EP11-SHEETS-R1.3 "Sound plan" and the shot blocks (1788 f, 48 kHz mono).
Library files only (shared library ~/ReelsStore/library/sound); new this pass: mechanical_cable-snap-rattle_01 (S2), crowd_period-gasp-hall_01 (S5), foley_rope-chop-platform-drop_01 (S3+S4),
crowd_hall-1854-murmur_01 (NG-A3). Fallbacks for S1, S6-S9, A1, A2, M1 are library files (see comments). Every generated file is unlistened: levels are by number, not by ear.
Layers are sample-exact (envelopes in dB over global frames); the ambience/music bus is ducked under the narration (sidechaincompress). G893-904 (black slot) is exact zero on every layer.
Needs public/narration/EDU-EP11-SHORT-narration-v2.wav (duck key). Writes public/audio/edu/EDU-EP11-SHORT-draft-stem-v5.wav. Run: python3 -I scripts/edu-series/ep11/sound-mix.py"""
import array, os, subprocess, wave
L = os.path.expanduser('~/ReelsStore/library/sound')
TOTAL, FPS, SR = 1788, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
def load(rel, ss=0.0, t=None, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', f'{L}/{rel}', '-ac', '1', '-ar', str(SR)] + (['-af', af] if af else []) + ['-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
lin = lambda db: 0.0 if db is None else 10 ** (db / 20)
OFF = None
def env(points): return [(F(a), F(b), lin(x), lin(y)) for (a, x), (b, y) in zip(points, points[1:]) if b > a]
def bed(track, snd, points, loop=True, at=0):
    n = len(snd)
    for s0, s1, g0, g1 in env(points):
        d = max(1, s1 - s0)
        for j in range(s0, min(s1, N)):
            k = j - at
            if k < 0 or (not loop and k >= n): continue
            track[j] += snd[k % n] * (g0 + (g1 - g0) * (j - s0) / d)
def shot(track, snd, frame, db, fin=0.004, fout=0.02, until=None):
    g = lin(db); s = F(frame); n = len(snd); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR)); end = F(until) if until else N
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end): track[j] += snd[k] * g * min(1, (k + 1) / fi, (n - k) / fo)
mus, mix = array.array('f', bytes(4 * N)), array.array('f', bytes(4 * N))
tick = load('sfx/ui/ui_click-tick_01.wav', af='lowpass=f=2600')
hb = load('sfx/tension/tension_heartbeat-slow_01.wav', t=0.85, af='lowpass=f=220')
hum = load('ambience/room/room_shop-fridge-hum_01.wav', af='lowpass=f=400')              # FALLBACK NG-A1 lift hum + fan
wind = load('ambience/nature/nature_wind-eerie-street_01.wav', af='highpass=f=250')      # FALLBACK NG-A2 shaft wind (rising by gain)
hall = load('ambience/crowd/crowd_hall-1854-murmur_01.wav')                             # NG-A3 (generated this pass)
hush = load('ambience/crowd/crowd_hall-1854-murmur_01.wav', af='lowpass=f=800')         # street hush (A3 low-passed)
# ---- falling lift (user note 2026-11-09: add a rushing/scraping 'ครืด ๆ' under the whole fall): rumble + rail scrape loop and air rush loop, both rising with the fall clock, dead at the black G893
bed(mus, load('ambience/mechanical/mechanical_lift-fall-rumble-scrape_01.wav'), [(39, OFF), (45, -29), (327, -22), (540, -20), (546, -26), (656, -26), (662, -20), (843, -15), (892, -12), (893, OFF)], at=F(39))
bed(mus, load('ambience/whoosh/whoosh_shaft-fall-air-rush_01.wav'), [(42, OFF), (50, -37), (327, -27), (540, -23), (546, -29), (656, -29), (662, -23), (843, -16), (892, -12), (893, OFF)], at=F(42))
# ---- B01: arrival chime, hum, snap, flicker, drop
shot(mix, load('sfx/ui/ui_entry-chime-two-tone_01.wav'), 3, -25)                                           # FALLBACK S1 (L+3)
bed(mus, hum, [(0, -17), (30, -17), (33, OFF)])                                                           # A1 dies with the snap
shot(mix, load('sfx/mechanical/mechanical_cable-snap-rattle_01.wav'), 30, -12)                            # S2 snap on the gap after "ขาด"
shot(mix, load('sfx/electric/electric_light-flicker-buzz_01.wav', t=0.4), 30, -24, fout=0.1)             # flicker G30-42
shot(mix, load('sfx/whoosh/whoosh_heavy-cinematic_01.wav'), 39, -18, fout=0.15)                           # the drop on "ร่วง"
bed(mus, wind, [(42, OFF), (50, -36), (327, -30), (540, -30), (546, -36), (662, -36), (843, -24), (892, -20), (893, OFF)])   # A2 same bed to the black, dead at G893
FLIPS = [120, 239, 322, 385, 438, 485, 528, 567, 604, 638, 670, 701, 730, 759, 786, 812, 837, 862, 886]
for g in FLIPS: shot(mix, tick, g, -33 if g > 800 else -28)                                                                    # one tick per counter flip
# ---- B02: plucks on the numbers, whooshes, wah-wah on "สิบเจ็ด"
for g, n in ((375, '01'), (402, '02'), (430, '05')): shot(mix, load(f'instrument/pluck/pluck_soft-note-{n}_01.wav'), g, -20)
shot(mix, load('sfx/whoosh/whoosh_air-swish-rising_01.wav', af='volume=1'), 476, -26, fout=0.1)
shot(mix, load('instrument/pluck/pluck_soft-note-02_01.wav'), 519, -20)
shot(mix, load('sfx/whoosh/whoosh_air-swish-rising_01.wav'), 538, -26, fout=0.08)
shot(mix, load('sfx/stinger/stinger_marimba-deflate-shrug_01.wav'), 593, -26)                                      # deflation beat (user note 2026-11-09: wah-wah not liked; new generated marimba shrug)
# ---- B03: pulse, riser, bonk
for g in range(662, 893, 30): shot(mix, hb, g, -24 + 8 * (g - 662) / 231)                                   # heartbeat G662-893, rising
shot(mix, load('sfx/reveal/reveal_riser-tension_01.wav'), 782, -25, fin=0.1, fout=0.01, until=893)         # riser (file 3.69 s, SD13 planned 4.23 s) ends dead on the black
shot(mix, load('sfx/whoosh/whoosh_air-swish-rising_01.wav'), 762, -28, fout=0.08)                          # push-off
shot(mix, load('sfx/comedy/comedy_soft-boing_01.wav'), 800, -23)                                           # ceiling bonk, soft: boing + knuckle rap (no impact)
shot(mix, load('sfx/impact/impact_knuckle-rap_01.wav', af='lowpass=f=900'), 800, -25)
# ---- B04: black (silent) -> shimmer, hall, 1854 axe/gasp/drop, catch, strings
shot(mix, load('sfx/reveal/reveal_glass-shimmer-soft_01.wav'), 905, -28, fout=0.3)
bed(mus, hall, [(965, OFF), (985, -26), (1180, -26), (1186, -31), (1210, -31), (1214, OFF)], at=F(965))   # A3, -6 dB from G1180
shot(mix, load('sfx/foley/foley_rope-chop-platform-drop_01.wav'), 1091, -12, fout=0.2)                      # S3 chop + S4 drop-and-stop (one clip)
shot(mix, load('sfx/crowd/crowd_period-gasp-hall_01.wav'), 1092, -14, fout=0.2)                             # S5 gasp in the slot G1091-1109
shot(mix, load('sfx/foley/foley_deadbolt-clack_01.wav', af='highpass=f=700'), 1155, -14)                    # FALLBACK S6 catch clack on "จับ" (pawl bite)
bed(mus, load('music/bed/bed_warm-pad-felt-third_01.wav'), [(1155, OFF), (1162, -24), (1290, -24), (1316, OFF)], loop=False, at=F(1155))   # FALLBACK M1, in on the bite, out by G1316
bed(mus, hush, [(1210, OFF), (1220, -34), (1305, -34), (1316, OFF)], at=F(1210))                            # street hush SH06
shot(mix, load('foley/foley_knife-tok-wood_01.wav'.replace('foley/', 'sfx/foley/'), af='lowpass=f=600'), 1250, -30)   # one far hoof
# ---- B05: rewind, stamp, cable tones, jaws, clamp ring-out, bell, tag
shot(mix, load('sfx/whoosh/whoosh_air-swish-rising_01.wav', af='areverse'), 1325, -10, fout=0.05)         # FALLBACK S9 rewind (reversed swish)
shot(mix, load('sfx/reveal/reveal_rewind-whirr_01.wav'), 1326, -6, fout=0.02)                                 # rewind whirr (user verdict 2026-11-09), rising sweep ends on G1339
shot(mix, load('sfx/foley/foley_rubber-stamp-thunk_01.wav'), 1341, -14)                                     # stamp "แทบ"
bed(mus, hum, [(1340, OFF), (1346, -20), (1385, -20), (1400, -26), (1500, -26), (1501, OFF)], at=F(1340))  # A1 fresh run (motor), stops at the clamp
bed(mus, wind, [(1385, OFF), (1390, -30), (1500, -26), (1500.5, OFF)], at=F(1385))                         # A2 under SH02/SH03, cut dead at the clamp
for k, g in zip((0, 2, 4, 5, 7, 9), (1393, 1398, 1403, 1409, 1414, 1419)):
    shot(mix, load('music/stinger/stinger_felt-note-single_01.wav', t=0.5, af=f'asetrate={SR * 2 ** (k / 12):.1f},aresample={SR}'), g, -22, fout=0.1)   # one tone per cable, pitch-stepped
shot(mix, load('music/stinger/stinger_felt-note-single_01.wav', af=f'asetrate={SR * 2 ** (9 / 12):.1f},aresample={SR}'), 1425, -26, fout=0.4, until=1467)   # held tone, one cable
shot(mix, load('sfx/mechanical/mechanical_cable-snap-rattle_01.wav'), 1467, -20)                           # S2 again, lower
shot(mix, load('sfx/impact/impact_door-slam-body_01.wav'), 1500, -21, fout=0.3)                              # FALLBACK S7 clamp hit on "จับ"
bed(mus, load('ambience/room/room_shop-fridge-hum_01.wav', af='lowpass=f=500'), [(1520, OFF), (1530, -27), (1728, -27), (1760, -33), (1787, OFF)], at=F(1520))   # NG-A1 fan only
shot(mix, load('sfx/ui/ui_notification-ding_01.wav', af=f'asetrate={SR * 0.5:.1f},aresample={SR}'), 1689, -14, fout=0.3)   # FALLBACK S8 bell, an octave down, on the press
shot(mix, load('sfx/stinger/stinger_pizz-tag-ending_01.wav', t=2.0), 1728, -13, fout=0.5, until=1787)       # UT15 tag
def wr(tr, p):
    a = array.array('h', (max(-32767, min(32767, int(x * 32767))) for x in tr)); open(p, 'wb').write(a.tobytes())
os.makedirs('out/EDU-EP11-SHORT/audio', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
wr(mus, 'out/EDU-EP11-SHORT/audio/mus.raw'); wr(mix, 'out/EDU-EP11-SHORT/audio/mix.raw')
DUR = TOTAL / FPS
g = ('[0:a]aformat=sample_fmts=fltp[mus];[1:a]aformat=sample_fmts=fltp[mx];[2:a]aformat=sample_fmts=fltp,asplit=2[key][key2];'
     '[mus][key]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=400:makeup=1[musd];'
     f'[musd][mx]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},volume=4dB[sum];'
     '[sum][key2]sidechaincompress=threshold=0.25:ratio=10:attack=3:release=90:makeup=1,alimiter=limit=0.89:level=disabled[out]')   # second, fast duck of the whole stem only on narration peaks (keeps mix true peak <= -1 dBTP)
OUT = 'public/audio/edu/EDU-EP11-SHORT-draft-stem-v5.wav'
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'out/EDU-EP11-SHORT/audio/mus.raw', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'out/EDU-EP11-SHORT/audio/mix.raw',
               '-i', 'public/narration/EDU-EP11-SHORT-narration-v2.wav', '-filter_complex', g, '-map', '[out]', '-ar', str(SR), '-ac', '1', '-t', str(DUR), OUT], check=True)
w = wave.open(OUT); par = w.getparams(); d = bytearray(w.readframes(w.getnframes())); w.close()
a, b = round(893 / 30 * par.framerate) * 2, round(905 / 30 * par.framerate) * 2   # black slot: exact zero (ducking tails and the limiter cannot leak)
d[a:b] = bytes(b - a)
o = wave.open(OUT, 'wb'); o.setparams(par); o.writeframes(bytes(d)); o.close(); print('ok')
