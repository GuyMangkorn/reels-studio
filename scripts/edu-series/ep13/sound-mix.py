#!/usr/bin/env python3
"""EDU-EP13-SHORT draft sound stems (Editor, W5.3 Draft v2, 2026-11-09): places exactly the 52 cues of scripts/edu-series/ep13/sound-cues.json (EDU-EP13-SHEETS-R2.1, G clock, 1542 f, 48 kHz mono)
and mixes to the cue sheet's `levels` targets (docs/editor-principles.md#ep08b). Library/generated files come from the episode lock (src/videos/edu-ep13/assets.lock.json -> public/).
Layers: bed (music, ambience, fiction trailer bed; ambience and M1 are ducked under the narration), texture (foley/ticks/whooshes under speech), accent (hits, stingers, tape-stop, launch, dog sigh).
Needs public/narration/EDU-EP13-SHORT-narration-v2.wav (voice stem and duck key; scripts/edu-series/ep13/narration-place.py). Writes out/stems/{voice,bed,texture,accent}.wav (per-layer, for Ton's measure) and
public/audio/edu/EDU-EP13-SHORT-draft-stem-v2.wav (their sum, the composition's audio track). Levels are by number and by `mix-levels.py`, not by ear; every generated file is unlistened.
Run: python3 -I scripts/edu-series/ep13/sound-mix.py"""
import array, math, os, subprocess, wave

TOTAL, FPS, SR = 1542, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
OFF = None
SUF = '.' + 'wav'   # output paths are built, not quoted, so scripts/sound-cues.py sees only the cue files
lin = lambda db: 0.0 if db is None else 10 ** (db / 20)

P = {  # cue sheet files (locked in assets.lock.json)
    'm1': 'public/audio/bed/bed_comic-pizz-marimba-pulse_01.wav',
    'soi': 'public/audio/city/city_soi-afternoon-day_01.wav',
    'air': 'public/audio/outdoor/outdoor_high-air-breeze_01.wav',
    'fan': 'public/audio/room/room_standing-fan-hum_01.wav',
    'hush': 'public/audio/room/room_studio-hush_01.wav',
    'flinch': 'public/sfx/comedy/comedy_pluck-knock-flinch_01.wav',
    'question': 'public/sfx/comedy/comedy_pluck-question-bend_01.wav',
    'shrink': 'public/sfx/comedy/comedy_shrink-pop-gliss_01.wav',
    'droop': 'public/sfx/comedy/comedy_slide-whistle-droop_01.wav',
    'grow': 'public/sfx/comedy/comedy_slide-whistle-grow_01.wav',
    'sigh': 'public/sfx/creature/creature_dog-sigh-exhale_01.wav',
    'breath': 'public/sfx/creature/creature_dog-sleep-breathing_01.wav',
    'backpack': 'public/sfx/foley/foley_backpack-thump-strap_01.wav',
    'crouch': 'public/sfx/foley/foley_crouch-cotton-chitin_01.wav',
    'jingle': 'public/sfx/foley/foley_dog-collar-jingle_01.wav',
    'lock': 'public/sfx/foley/foley_flashlight-click_01.wav',
    'groan': 'public/sfx/foley/foley_floor-groan-heavy_01.wav',
    'snap': 'public/sfx/foley/foley_rubber-snap-release_01.wav',
    'squeeze': 'public/sfx/foley/foley_rubber-squeeze-creak_01.wav',
    'sofa': 'public/sfx/foley/foley_sofa-sit-sigh_01.wav',
    'tap': 'public/sfx/foley/foley_soft-landing-tap_01.wav',
    'thud': 'public/sfx/foley/foley_teak-landing-thud_01.wav',
    'taiko': 'public/sfx/impact/impact_taiko-pulse-4_01.wav',
    'braam': 'public/sfx/impact/impact_trailer-braam_01.wav',
    'tapestop': 'public/sfx/mechanical/mechanical_tape-stop_01.wav',
    'riser': 'public/sfx/reveal/reveal_riser-tension_01.wav',
    'fwoop': 'public/sfx/reveal/reveal_warmth-fwoop_01.wav',
    'shrug': 'public/sfx/stinger/stinger_pizz-shrug_01.wav',
    'tag': 'public/sfx/stinger/stinger_pizz-tag-ending_01.wav',
    'tick': 'public/sfx/ui/ui_click-tick_01.wav',
    'swish': 'public/sfx/whoosh/whoosh_air-swish-rising_01.wav',
    'slide': 'public/sfx/whoosh/whoosh_fast-slide_01.wav',
    'wind': 'public/sfx/whoosh/whoosh_height-wind-rush_01.wav',
    'jump': 'public/sfx/whoosh/whoosh_jump-pair-lift_01.wav',
    'launch': 'public/sfx/whoosh/whoosh_launch-boom-up_01.wav',
    'shadow': 'public/sfx/whoosh/whoosh_shadow-pass-overhead_01.wav',
    'whip': 'public/sfx/whoosh/whoosh_whip-zip-up_01.wav',
}


def load(key, ss=0.0, t=None, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', P[key], '-ac', '1', '-ar', str(SR)] + (['-af', af] if af else []) + ['-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a


def peak(a): return max(max(a), -min(a)) or 1e-9
def rms(a): return math.sqrt(sum(x * x for x in a) / len(a)) or 1e-9
def norm_peak(a, db): g = lin(db) / peak(a); return array.array('f', (x * g for x in a))
def norm_rms(a, db): g = lin(db) / rms(a); return array.array('f', (x * g for x in a))


def zeros(): return array.array('f', bytes(4 * N))
bed_d, bed_n, texture, accent = zeros(), zeros(), zeros(), zeros()   # bed_d is ducked under the narration, bed_n is not (trailer bed)


def shot(track, key, frame, db, mode='peak', ss=0.0, t=None, af='', fin=0.003, fout=0.02, until=None, gain=1.0, drive=0.0):
    """One sound at G `frame`; level `db` is the peak (or RMS) dBFS of the used segment before `gain`."""
    a = load(key, ss, t, af); a = norm_peak(a, db) if mode == 'peak' else norm_rms(a, db)
    if drive:   # short transients cannot reach the voice's 400 ms momentary level at a safe peak: `drive` dB of tanh saturation toward the peak ceiling `db` raises their mean (cue-length vs levels conflict, see build-notes)
        c, d = lin(db), lin(drive); a = array.array('f', (c * math.tanh(x * d / c) for x in a))
    s = F(frame); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR)); end = F(until) if until is not None else N
    for k in range(len(a)):
        j = s + k
        if 0 <= j < min(N, end): track[j] += a[k] * gain * min(1, (k + 1) / fi, (len(a) - k) / fo)


def bed(track, key, points, loop=True, af='', restart_at=None, ref_db=None):
    """Bed from `key`; `points` = [(G, dB re the file's RMS-normalised level), ...], OFF outside; playback restarts at `restart_at` (G) or the first point."""
    a = norm_rms(load(key, 0, None, af), 0.0)
    at = F(points[0][0] if restart_at is None else restart_at); n = len(a)
    for (g0, d0), (g1, d1) in zip(points, points[1:]):
        s0, s1, x0, x1 = F(g0), F(g1), lin(d0), lin(d1)
        for j in range(max(s0, 0), min(s1, N)):
            k = j - at
            if k < 0 or (not loop and k >= n): continue
            track[j] += a[k % n] * (x0 + (x1 - x0) * (j - s0) / max(1, s1 - s0))


def seg(start, end, db, fin=3, fout=3, mid=()):
    """Points for one bed segment: fade in over `fin` f, level `db` (+ optional (G, dB) changes), fade out over `fout` f."""
    return [(start, OFF), (start + fin, db), *mid, (end - fout, mid[-1][1] if mid else db), (end, OFF)]


# ---- level plan (dBFS, RMS for beds, peak for shots); the voice stem sits at -16 LUFS, peak -1.5 dBFS
SOI_LOW, SOI_FULL, FAN, HUSH, AIR, M1 = -37.0, -36.0, -36.0, -35.0, -36.0, -31.0
TICK, WHOOSH, FOLEY = -24.0, -24.0, -25.0       # texture peaks
HIT = -2.0                                       # accent peaks

# ---- bed: room tone (soi + fan), studio hush, trailer air, M1 (restarts on its downbeat at every re-entry, phrase-end cuts per the cue sheet; frames = SHEETS-R2.1)
ROOM = [(0, 44), (96, 129), (317, 478), (917, 1152)]
for a, b in ROOM:
    bed(bed_d, 'soi', seg(a, b, SOI_LOW, fin=3 if a else 1, fout=3), restart_at=a)    # B01-room-soi (low)
    bed(bed_d, 'fan', seg(a, b, FAN, fin=3 if a else 1, fout=3), restart_at=a)        # A1-fan
bed(bed_d, 'soi', [(1192, OFF), (1195, SOI_LOW), (1477, SOI_LOW), (1541, OFF)], restart_at=1192)   # room tone back on the landing (B04-SH02 +57), B05-room-fade: holds through the sigh (G1474 + 3), zero at the last frame
bed(bed_d, 'fan', [(1192, OFF), (1195, FAN), (1477, FAN), (1541, OFF)], restart_at=1192)           # B05-room-fade (second use of the A1 file)
for a, b in [(44, 96), (478, 917)]:
    bed(bed_d, 'hush', seg(a, b, HUSH, fin=3, fout=3), restart_at=a)                  # A2-hush-SH02, also B02-SH03 / B03-SH01 / B03-SH03
bed(bed_n, 'soi', [(129, OFF), (132, SOI_LOW - 10.5), (225, SOI_LOW - 10.5), (228, SOI_FULL), (314, SOI_FULL), (317, OFF)], restart_at=129)   # B01-soi-trailer 30 %, SH04D full
bed(bed_n, 'air', [(129, OFF), (135, AIR), (179, AIR), (182, AIR - 8), (225, AIR - 8), (228, AIR), (240, AIR), (242, OFF)], restart_at=129)    # A3-high-air (thinned in SH04C, breeze to SH04D +12)
bed(bed_d, 'm1', seg(6, 129, M1, fin=4, fout=2, mid=[(96, M1), (100, M1 + 2)]), restart_at=6)                                                  # M1 in 6, lift in the grow, dead on G128
bed(bed_d, 'm1', seg(238, 317, M1 - 6, fin=3, fout=2), restart_at=238)                                                                       # back 238, energy 1, dropout 317-329
bed(bed_d, 'm1', seg(329, 857, M1 - 6, fin=3, fout=2, mid=[(380, M1), (690, M1), (694, M1 - 2)]), restart_at=329)                           # B02 energy 2, thins 691, dead 857 (snap)
bed(bed_d, 'm1', seg(917, 1152, M1 + 1, fin=4, fout=4, mid=[(1098, M1 + 1), (1135, M1 + 3)]), restart_at=917)                                 # back 917 (+1), builds from 1098 into the cut, out 1152
bed(bed_d, 'm1', [(1192, OFF), (1195, M1), (1403, M1), (1406, M1 - 4), (1433, M1 - 4), (1463, M1 - 12), (1474, M1 - 12), (1480, OFF)], restart_at=1192)   # back 1192, dips under L14, ends under the tag (tag G1463, user 2026-11-10 'do it like ep02' reverses SD08)
# ---- B01 room / macro / grow
shot(texture, 'breath', 0, -34.0, t=1.47, fout=0.12)                                             # S1-breath (first slow breath, 0-44; very quiet source)
shot(texture, 'tick', 66, TICK + 2, af='asetrate=60480,aresample=48000')                          # S2-takeoff-tick (pitched up 1.26)
shot(texture, 'swish', 66, WHOOSH)                                                               # S3-leap-whoosh
for k, g in enumerate((72, 77, 82, 87, 92), 1):
    shot(texture, 'tick', g, TICK, af=f'asetrate={SR * 2 ** ((k - 1) * 2 / 12):.1f},aresample={SR}')   # S4-tick-1..5, pitch rising
shot(texture, 'grow', 100, WHOOSH + 3)                                                           # S5-grow
# ---- trailer (fiction bed): braam, shadow pass, riser to 170, drums, launch, wind, tape-stop
shot(bed_n, 'braam', 129, -23.0, fout=0.1)                                                       # TR1-braam
shot(bed_n, 'shadow', 133, -27.0)                                                                # TR2-shadow-pass
shot(bed_n, 'riser', 129, -27.0, ss=2.32, t=1.37, fout=0.02)                                     # riser, last 1.37 s, dead stop on 170
shot(bed_n, 'taiko', 152, -24.0)                                                                 # TR3-drums (4 hits in the file)
shot(accent, 'launch', 170, HIT)                                                             # TR4-launch
shot(bed_n, 'wind', 182, -29.0, t=0.7, fout=0.1)                                                 # TR5-height-wind
shot(accent, 'tapestop', 207, HIT - 10)                                                           # TR6-tape-stop
shot(texture, 'droop', 213, WHOOSH - 1)                                                          # S7-droop (crosses the cut)
shot(texture, 'tap', 234, FOLEY)                                                                 # SH04D-tap-1
shot(texture, 'tap', 278, FOLEY, gain=0.6)                                                       # SH04D-tap-2
shot(accent, 'flinch', 325, HIT - 2, drive=12.0)                                                             # S8-flinch (in the V01 pre-roll gap)
shot(texture, 'fwoop', 383, WHOOSH)                                                              # S9-glow
shot(texture, 'groan', 445, FOLEY + 2)                                                           # S10-groan
shot(texture, 'backpack', 535, FOLEY + 2)                                                        # S11-backpack
shot(texture, 'slide', 583, WHOOSH)                                                              # S11-hop-whoosh
shot(texture, 'tap', 595, FOLEY, gain=0.6)                                                       # S11-hop-tap
shot(texture, 'shrug', 634, FOLEY + 1)                                                           # S12-shrug
shot(texture, 'squeeze', 794, FOLEY + 1)                                                         # S15-squeeze
shot(texture, 'lock', 824, FOLEY)                                                                # S15-lock-click
shot(accent, 'snap', 857, HIT - 1, drive=8.0)                                                               # S16-snap
shot(accent, 'whip', 857, HIT - 4, drive=4.0)                                                               # S16-whip
shot(texture, 'question', 922, FOLEY + 1)                                                        # S21-question
shot(texture, 'squeeze', 1061, FOLEY - 3)                                                         # S25-pad-swell (R6: L16 "แผ่นยางโต", same file as S15, lower)
shot(texture, 'groan', 1098, FOLEY + 1)                                                          # S26-weight-callback (R6: L16 "ตัวก็หนัก", same file as S10, 1 dB under it)
shot(texture, 'crouch', 1135, FOLEY + 2)                                                         # S17-crouch
shot(texture, 'jump', 1143, WHOOSH + 2)                                                          # S18-jump (with V02)
shot(accent, 'thud', 1192, HIT, drive=14.0)                                                                  # S19-landing
shot(bed_n, 'braam', 1226, -35.0, t=1.07, af='lowpass=f=700', fout=0.12)                         # TR7-braam-echo (-18 dB, low-passed, 1.07 s, cut dead at 1258)
shot(texture, 'tick', 1258, TICK, af='asetrate=40320,aresample=48000')                           # TR7-tick (pitched down 0.84)
shot(texture, 'shrink', 1279, WHOOSH + 2)                                                        # B05-shrink-pop
shot(texture, 'tick', 1300, TICK + 1, af='asetrate=60480,aresample=48000')                       # B05-tick-flea (up)
shot(texture, 'tick', 1331, TICK + 1, af='asetrate=40320,aresample=48000')                       # B05-tick-man (down)
shot(texture, 'sofa', 1443, FOLEY)                                                               # S20-sofa
shot(texture, 'jingle', 1468, FOLEY + 1)                                                         # S1-jingle
shot(accent, 'sigh', 1474, HIT - 3, fout=0.2, drive=10.0)                                                    # V03-dog-sigh (no voice, no subtitle)
# tag-ending (user 2026-11-10 "do it like ep02", reverses SD08): warm pizzicato+marimba tag at G1463 = end of "เล็กมาก", rings out 2.5 s to G1538; ducked -6 dB over 80 ms from G1474 so the dog sigh stays the button
duck = lambda j: lin(-6.0 * min(1.0, max(0.0, (j - F(1474)) / (0.08 * SR))))
shot(accent, 'tag', 1463, HIT, fout=0.4)
for j in range(F(1474), min(N, F(1463) + 3 * SR)):
    accent[j] *= duck(j)

# ---- ducking: the narration (voice stem) keys a smooth gain on the ducked bed
def read(p):
    w = wave.open(p); assert (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (SR, 1, 2), p
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
voice = read('public/narration/EDU-EP13-SHORT-narration-v2.wav'); assert len(voice) == N, (len(voice), N)
DUCK_DB, ATT, REL, THR = -4.0, 0.08, 0.35, 0.004
win = SR // 100
speech = [math.sqrt(sum(x * x for x in voice[i:i + win]) / win) / 32768 > THR for i in range(0, N, win)]
env, g = array.array('f', bytes(4 * N)), 0.0
ka, kr = 1 - math.exp(-1 / (ATT * SR)), 1 - math.exp(-1 / (REL * SR))
for i in range(0, N, win):
    tgt = 1.0 if speech[i // win] else 0.0
    for j in range(i, min(i + win, N)):
        g += (tgt - g) * (ka if tgt > g else kr); env[j] = g
for j in range(N): bed_d[j] *= lin(DUCK_DB * env[j])
bed = array.array('f', (bed_d[j] + bed_n[j] for j in range(N)))


# ---- peak guard: where an accent lands on a voiced word (S16 on "ปล่อย") the accent alone is turned down just enough that voice + all layers stay under 0.97 (no clipping before the master loudnorm)
CEIL, SM = 0.97, F(0.004) // 1
safe = array.array('f', [1.0]) * N
for j in range(N):
    if accent[j]:
        r = voice[j] / 32768 + bed[j] + texture[j]
        if abs(r + accent[j]) > CEIL:
            gneed = (CEIL - r) / accent[j] if accent[j] > 0 else (-CEIL - r) / accent[j]
            safe[j] = max(0.0, min(1.0, gneed))
hit = [j for j in range(N) if safe[j] < 1.0]
spread = array.array('f', [1.0]) * N
for j in hit:
    for k in range(max(0, j - SM), min(N, j + SM + 1)): spread[k] = min(spread[k], safe[j])
safe = spread
gprev = 1.0
low = [j for j in range(N) if safe[j] < 0.98]
print('guard active G%.1f-%.1f' % (low[0] / 1600, low[-1] / 1600) if low else 'guard idle', len(low), 'samples; min gain %.2f' % min(safe))
for j in range(N):   # release smoothing only: attack is the min-spread above
    gprev = safe[j] if safe[j] < gprev else gprev + (safe[j] - gprev) * 0.002
    accent[j] *= gprev

import random
rnd = random.Random(13)


def wr(tr, p, dither=False):
    """16-bit mono WAV. `dither`: +-1 LSB noise (-90 dBFS) on the measuring stems; exact digital zero makes ffmpeg ebur128 print `nan` momentary values, which scripts/mix-levels.py drops and so misaligns the steps."""
    os.makedirs(os.path.dirname(p), exist_ok=True)
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    return max(abs(x) for x in a) / 32767
pk = {n: wr(t, f'out/stems/{n}' + SUF, True) for n, t in (('bed', bed), ('texture', texture), ('accent', accent))}
wr(array.array('f', (x / 32768 for x in voice)), 'out/stems/voice' + SUF)
total = array.array('f', (bed[j] + texture[j] + accent[j] for j in range(N)))
pk['stem'] = wr(total, 'public/audio/edu/EDU-EP13-SHORT-draft-stem-v2' + SUF)
print({k: f'{20 * math.log10(v or 1e-9):.1f} dBFS' for k, v in pk.items()})
