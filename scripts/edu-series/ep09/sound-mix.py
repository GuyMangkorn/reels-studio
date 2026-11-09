#!/usr/bin/env python3
"""EDU-EP09-SHORT sound stem (Editor, W5.3 Draft, 2026-11-08), per scene-sheets.md EDU-EP09-SHEETS-R2 "Sound plan" and the per-shot cues. 1606 f, 48 kHz mono.
Library files only, all generated and unlistened (levels by number, not by ear). NEEDS-GEN in this draft: M1 = generated `bed_edu09-puppet-pizz-marimba_01` (r3); M2 = SYNTHESISED here in code
(additive piano, note onsets = PIANO_TUNE of src/painted/edu09/piano.ts so the audible notes equal the visual presses; C-G position, no wrong notes, ends on C+E+G); S1 = silence (sheet fallback).
Seam: bed and clock are read as loops and the last 12 f crossfade into their own continuation (bed(j-N)), so G1605 -> G0 is continuous. Tag silent from G1582.
Needs public/narration/EDU-EP09-SHORT-draft.wav (narration-place.py) as the sidechain key. Writes public/audio/edu/EDU-EP09-SHORT-draft-stem-r3.wav. Run: python3 -I scripts/edu-series/ep09/sound-mix.py"""
import array, math, os, subprocess
L = os.path.expanduser('~/ReelsStore/library/sound')
FPS, SR, TOTAL = 30, 48000, 1606
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
lin = lambda db: 0.0 if db is None else 10 ** (db / 20)
OFF = None
def load(rel, ss=0.0, t=None, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', f'{L}/{rel}', '-ac', '1', '-ar', str(SR)] + (['-af', af] if af else []) + ['-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
def env(points): return [(F(a), F(b), lin(x), lin(y)) for (a, x), (b, y) in zip(points, points[1:]) if b > a]
def bed(track, snd, points, loop=True, at=0, seam=False):
    n = len(snd); X = F(12)
    for s0, s1, g0, g1 in env(points):
        d = max(1, s1 - s0)
        for j in range(s0, min(s1, N)):
            k = j - at
            if k < 0 or (not loop and k >= n): continue
            v = snd[k % n]
            if seam and j >= N - X: w = (j - (N - X)) / X; v = v * (1 - w) + snd[(k - N) % n] * w
            track[j] += v * (g0 + (g1 - g0) * (j - s0) / d)
def shot(track, snd, frame, db, fin=0.004, fout=0.02, until=None):
    g = lin(db); s = F(frame); n = len(snd); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR)); end = F(until) if until else N
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end): track[j] += snd[k] * g * min(1, (k + 1) / fi, (n - k) / fo)
mus, mix = array.array('f', bytes(4 * N)), array.array('f', bytes(4 * N))
room, clock = load('ambience/room/room_condo-night-quiet_01.wav'), load('sfx/tension/tension_clock-pulse_01.wav')
roomLP = load('ambience/room/room_condo-night-quiet_01.wav', af='lowpass=f=1100')
# ---- dining bed + far clock: B01 level, -6 dB dip G622-1214 (B03), out for the piano room G1214-1355, back at the B01 level from G1355; seam crossfade
bed(mix, room, [(0, -26), (621, -26), (622, -32), (1213, -32), (1214, OFF), (1355, OFF), (1356, -26), (TOTAL, -26)], seam=True)
bed(mix, clock, [(0, -34), (621, -34), (622, -40), (1213, -40), (1214, OFF), (1355, OFF), (1356, -34), (TOTAL, -34)], seam=True)
bed(mix, roomLP, [(1214, -30), (1354, -30), (1355, OFF)])   # piano room: low-passed, lower, no clock
# ---- M1 = library `bed_edu09-puppet-pizz-marimba_01` (generated 2026-11-09, 90 bpm, 18.5 s loop; the loop is crossfaded inside the file). Brief energy plan: nothing under L01/try/V01 (silent until G203,
# V01 ends G196), B01 L02-L03 soft (1.5), B02 louder (2); out with a 12 f fade ending on G622 (no music on the see-through, silence policy 3). Gains are before the narration sidechain (~-3 dB under speech).
bed(mus, load('music/bed/bed_edu09-puppet-pizz-marimba_01.wav'), [(203, OFF), (233, -18), (351, -18), (371, -16), (610, -16), (622, OFF)], at=F(203))
# ---- B02: taps on the words (SD06), shrug on the end of "ไว้" (L87 of SH03)
tap = load('sfx/foley/foley_soft-landing-tap_01.wav')
for g in (351 + 26, 351 + 45, 351 + 56): shot(mix, tap, g, -14)
shot(mix, load('sfx/stinger/stinger_pizz-shrug_01.wav'), 511 + 87, -20, fout=0.2)
# ---- B03: shimmer + cord plucks per shot
pl = lambda i: load(f'instrument/pluck/pluck_soft-note-0{i}_01.wav')
shot(mix, load('sfx/reveal/reveal_glass-shimmer-soft_01.wav'), 622, -24, fout=0.3)
for i, g in zip((1, 2, 3, 4), (696, 699, 702, 705)): shot(mix, pl(i), g, -20)          # SH01 L74/77/80/83
for i, g in zip((1, 2, 3, 4), (736, 738, 740, 742)): shot(mix, pl(i), g, -22)          # SH07 L9/11/13/15
shot(mix, pl(5), 768 + 3, -20); shot(mix, pl(6), 768 + 20, -20); shot(mix, pl(3), 768 + 78, -18)   # SH02
for i in (1, 2, 3): shot(mix, pl(i), 905 + 6, -26)                                      # SH03 soft chord
shot(mix, pl(2), 905 + 84, -22); shot(mix, pl(4), 905 + 99, -22)
# taut tone from L89 of SH04, cut dead on G1214 (no tail)
shot(mix, load('music/tone/tone_thin-unresolved_01.wav'), 1080 + 89, -24, fin=0.3, fout=0.001, until=1214)
# ---- B04: M2 synthesised piano, notes = PIANO_TUNE onsets (shot-local, shot starts G1214)
HZ = {'thumb': 261.63, 'index': 293.66, 'middle': 329.63, 'ring': 349.23, 'little': 392.0}
TUNE = [(0, ['middle']), (10, ['little']), (20, ['ring']), (30, ['index']), (42, ['thumb', 'middle']), (64, ['index']), (74, ['ring']), (84, ['middle']), (96, ['little']), (108, ['thumb', 'middle', 'little'])]
def piano(freq, dur, vel):
    n = int((dur + 0.6) * SR); out = array.array('f', bytes(4 * n)); rel = int(dur * SR)
    for h, a in ((1, 1.0), (2, 0.55), (3, 0.3), (4, 0.18), (5, 0.1), (6, 0.06)):
        dec = 1.8 + 0.9 * h
        for k in range(n):
            t = k / SR; e = math.exp(-t * dec) * (1 - math.exp(-t * 600))
            if k > rel: e *= math.exp(-(k - rel) / SR * 14)
            out[k] += a * e * math.sin(2 * math.pi * freq * h * t * (1 + 0.0004 * h * h))
    return array.array('f', (x * vel * 0.3 for x in out))
for i, (f0, notes) in enumerate(TUNE):
    end = 140 if i == len(TUNE) - 1 else (60 if len(notes) == 2 else TUNE[i + 1][0] - 1)
    dur = (end - f0) / FPS + 0.05
    for nm in notes:
        shot(mus, piano(HZ[nm], dur, 1.0 if len(notes) < 3 else 0.8), 1214 + f0, -9, fin=0.001, fout=0.02)
# ---- B05: music out (retry is room tone only); L15 sparse plucks; UT15 tag at the end of L15's last word (G1525), <= 57 f, 15 f fade, silent from G1582
for i, g in zip((1, 4, 2), (1418, 1446, 1474)): shot(mix, pl(i), g, -26)
shot(mix, load('sfx/stinger/stinger_pizz-tag-ending_01.wav', t=1.9), 1525, -16, fout=0.5, until=1582)
def wr(tr, p): open(p, 'wb').write(array.array('h', (max(-32767, min(32767, int(x * 32767))) for x in tr)).tobytes())
os.makedirs('out/EDU-EP09-SHORT/audio', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
wr(mus, 'out/EDU-EP09-SHORT/audio/mus.raw'); wr(mix, 'out/EDU-EP09-SHORT/audio/mix.raw')
DUR = TOTAL / FPS
g = ('[0:a]aformat=sample_fmts=fltp[mus];[1:a]aformat=sample_fmts=fltp[mx];[2:a]aformat=sample_fmts=fltp,asplit=1[key];'
     '[mus][key]sidechaincompress=threshold=0.02:ratio=2.5:attack=40:release=400:makeup=1[musd];'
     f'[musd][mx]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},volume=4dB,alimiter=limit=0.89:level=disabled[out]')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'out/EDU-EP09-SHORT/audio/mus.raw', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'out/EDU-EP09-SHORT/audio/mix.raw',
               '-i', 'public/narration/EDU-EP09-SHORT-draft.wav', '-filter_complex', g, '-map', '[out]', '-ar', str(SR), '-ac', '1', '-t', str(DUR), 'public/audio/edu/EDU-EP09-SHORT-draft-stem-r3.wav'], check=True)
print('ok')
