#!/usr/bin/env python3
"""EDU-EP07-SHORT sound stem v1 (Editor, W5.3 Draft, 2026-11-08), per scene-sheets.md "Sound plan" (EDU-EP07-SHEETS-R1.1). Library files only
(EP07 cues filed 2026-11-08: ukulele loop 100 bpm / 900 f, pestle thocks, double dog bark, soi/night ambience, space pad, motorbike, paper fan; the rest are older
library fallbacks named in the sheet: cold pad = bed_edu05-cold-theme_01 (NG-M2), warm pad = tone_soft-sustain-reflective_01 (NG-M3), ui_pop + reverse swell (NG-S2),
sub hit (NG-S5), glass shimmer (NG-S6, Moon), tag stinger). Every file is generated and unlistened: levels are by number, not by ear.
Layers are built sample-exact in Python (envelopes in dB over global frames), then the music bus is ducked under the narration with sidechaincompress.
Silence G1002-1093 is exact zero on every layer. Writes public/audio/edu/EDU-EP07-SHORT-draft-stem-v1.wav (1798 f, 48 kHz mono).
Needs public/narration/EDU-EP07-SHORT.wav (duck key). Run: python3 -I scripts/edu-series/ep07/sound-mix.py"""
import array, os, subprocess
L = os.path.expanduser('~/ReelsStore/library/sound')
FPS, TOTAL, SR = 30, 1798, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
def load(rel, ss=0.0, t=None, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', f'{L}/{rel}', '-ac', '1', '-ar', str(SR)] + (['-af', af] if af else []) + ['-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
lin = lambda db: 0.0 if db is None else 10 ** (db / 20)
def env(points):  # [(frame, dB or None)] -> dict of (s0, s1, g0, g1) segments; outside = 0
    return [(F(a), F(b), lin(x), lin(y)) for (a, x), (b, y) in zip(points, points[1:]) if b > a]
def bed(track, snd, points, loop=True, pos0=0, at=0):  # snd starts at sample `at` of the timeline, read from pos0
    n = len(snd)
    for s0, s1, g0, g1 in env(points):
        d = max(1, s1 - s0)
        for j in range(s0, min(s1, N)):
            k = j - at + pos0
            if k < 0 or (not loop and k >= n): continue
            track[j] += snd[k % n] * (g0 + (g1 - g0) * (j - s0) / d)
def shot(track, snd, frame, db, fin=0.004, fout=0.02, off=0.0):  # one-shot with its first sample (minus `off` s) on a frame
    g = lin(db); s = F(frame) - int(off * SR); n = len(snd); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR))
    for k in range(n):
        j = s + k
        if 0 <= j < N: track[j] += snd[k] * g * min(1, (k + 1) / fi, (n - k) / fo)
mus, mix = array.array('f', bytes(4 * N)), array.array('f', bytes(4 * N))
OFF = None
# ---- M1 ukulele (loop 900 f, position = G mod 900; strum on G0): hold, under the pad 33-166, thinner from 395, out in the cutaway 578-903, thin 903-1002, hard return 1618, duck -8 under the tag
m1 = load('music/bed/bed_edu07-ukulele-street-100bpm_01.wav')
bed(mus, m1, [(0, -9), (33, -9), (36, -17), (166, -17), (170, -9), (395, -9), (399, -12), (576, -12), (579, OFF), (903, OFF), (906, -15), (999, -15), (1002, OFF),
              (1617, OFF), (1618, -9), (1756, -9), (1759, -17), (1790, -17), (1797, -9), (1798, -9)])
# ---- A1 soi ambience (12 s loop, position (G+2) mod 360), un-ducked bus
a1 = load('ambience/city/city_soi-afternoon-day_01.wav')
bed(mix, a1, [(0, -20), (33, -20), (36, -30), (166, -30), (170, -20), (576, -20), (579, OFF), (903, OFF), (906, -26), (999, -26), (1002, OFF), (1617, OFF), (1618, -20), (1798, -20)], pos0=F(2))
# ---- NG-A3 space pad swells: B01-SH02 33-170, B03-SH02/SH03 578-903
a3 = load('ambience/space/space_thin-airy-pad_01.wav')
bed(mus, a3, [(33, OFF), (36, -20), (165, -20), (170, OFF)], loop=False, at=F(33))
bed(mus, a3, [(578, OFF), (581, -20), (746, -20), (760, OFF)], loop=False, at=F(578))
bed(mus, a3, [(751, OFF), (763, -20), (900, -20), (903, OFF)], loop=False, at=F(751))
# ---- NG-A2 night air (10 s loop) G1093-1618: fades in 12 f under D03, hard out on the cut
a2 = load('ambience/city/city_still-night-air_01.wav')
bed(mix, a2, [(1093, OFF), (1105, -24), (1160, -24), (1166, -27), (1617, -27), (1618, OFF)])
# ---- NG-M2 cold pad (fallback bed_edu05-cold-theme_01) 1160-1518 -> NG-M3 warm pad (tone_soft-sustain-reflective_01) 1518-1618; Jupiter tone 1353-1548
bed(mus, load('music/bed/bed_edu05-cold-theme_01.wav'), [(1160, OFF), (1166, -25), (1518, -25), (1530, OFF)], loop=False, at=F(1160))
bed(mus, load('music/tone/tone_soft-sustain-reflective_01.wav'), [(1518, OFF), (1530, -20), (1616, -20), (1618, OFF)], loop=False, at=F(1518))
bed(mus, load('music/tone/tone_thin-unresolved_01.wav'), [(1353, OFF), (1359, -14), (1518, -14), (1548, OFF)], loop=False, at=F(1353))
# ---- clock ticks (softened, low-passed): every 20 f 170-395, every 15 f 395-578 (+2 dB), every 10 f 903-993
tick = load('sfx/ui/ui_click-tick_01.wav', af='lowpass=f=2600')
for g in list(range(170, 395, 20)): shot(mix, tick, g, -24)
for g in list(range(395, 578, 15)): shot(mix, tick, g, -22)
for g in list(range(903, 994, 10)): shot(mix, tick, g, -24)
# ---- NG-S1 pestle thocks on contact frames (G = 5 mod 18 in B01-B04; seam list in B05), three variants in turn
th = [load(f'sfx/foley/foley_pestle-papaya-thock_0{i}.wav') for i in (1, 2, 3)]
contacts = [(5, -16), (23, -16)] + [(g, -22) for g in range(185, 258, 18)] + [(g, -20) for g in (275, 293, 311, 329)] + [(g, -10) for g in (347, 365, 383)] \
    + [(g, -24) for g in range(401, 564, 18)] + [(g, -22) for g in (905, 923, 941, 959, 977, 995)] + [(g, -20) for g in (1622, 1640, 1658, 1676)] + [(g, -16) for g in range(1694, 1785, 18)]
for i, (g, db) in enumerate(contacts): shot(mix, th[i % 3], g, db, off=0.017)
# ---- one-shots
shot(mix, load('sfx/whoosh/whoosh_air-swish-rising_01.wav'), 23, -32)                                    # optional whip, B01-SH01
shot(mix, load('sfx/reveal/reveal_reverse-swell-airy_01.wav'), 21, -26)                                   # into the blink (ends dead at 21+24=45)
shot(mix, load('sfx/ui/ui_pop_01.wav'), 45, -13)                                                          # NG-S2 pop on the blink (G45)
shot(mix, load('sfx/foley/foley_paper-menu-fan_01.wav'), 278, -16)                                        # NG-S3 fan flaps from L6
shot(mix, load('sfx/vehicle/vehicle_motorbike-pass-doppler_01.wav'), 446, -16, off=1.474)                 # NG-S4 Doppler peak G446
shot(mix, load('sfx/impact/impact_sub-hit-short_01.wav'), 722, -12, off=0.089)                             # NG-S5 whomp, peak on the merge G722
shot(mix, load('sfx/reveal/reveal_glass-shimmer-soft_01.wav', t=1.0), 834, -17, off=0.043, fout=0.2)      # NG-S6 ping, flash arrives G834
shot(mix, load('sfx/reveal/reveal_glass-shimmer-soft_01.wav', t=1.0), 1308, -19, off=0.043, fout=0.2)     # Moon goes dark G1308
shot(mix, load('creature/creature_dog-bark-double-far_01.wav'.replace('creature/', 'sfx/creature/')), 1150, -16, off=0.05)  # NG-S7 dog onset G1150
shot(mix, load('sfx/reveal/reveal_riser-tension_01.wav', ss=0.40), 903, -19, fin=0.05, fout=0.001)        # riser, ends dead at G1002
# ---- end tag (UT15): 1.40 s from L14's last voiced frame, peak about -10 dB, fade over the last 0.6 s
shot(mix, load('sfx/stinger/stinger_pizz-tag-ending_01.wav', t=1.40), 1756, -14, fout=0.6)
def wr(tr, p):
    a = array.array('h', (max(-32767, min(32767, int(x * 32767))) for x in tr))
    open(p, 'wb').write(a.tobytes())
os.makedirs('out/EDU-EP07-SHORT/audio', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
wr(mus, 'out/EDU-EP07-SHORT/audio/mus.raw'); wr(mix, 'out/EDU-EP07-SHORT/audio/mix.raw')
DUR = TOTAL / FPS
g = ('[0:a]aformat=sample_fmts=fltp[mus];[1:a]aformat=sample_fmts=fltp[mx];[2:a]aformat=sample_fmts=fltp,asplit=1[key];'
     '[mus][key]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=400:makeup=1[musd];'
     f'[musd][mx]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},volume=4dB,alimiter=limit=0.89:level=disabled[out]')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'out/EDU-EP07-SHORT/audio/mus.raw', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'out/EDU-EP07-SHORT/audio/mix.raw',
               '-i', 'public/narration/EDU-EP07-SHORT.wav', '-filter_complex', g, '-map', '[out]', '-ar', str(SR), '-ac', '1', '-t', str(DUR), 'public/audio/edu/EDU-EP07-SHORT-draft-stem-v1.wav'], check=True)
print('ok')
