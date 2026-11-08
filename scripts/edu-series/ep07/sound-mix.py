#!/usr/bin/env python3
"""EDU-EP07-SHORT sound stem v2 (Editor, W5.3 R1.2 draft, 2026-11-08), per scene-sheets.md "Sound plan" (EDU-EP07-SHEETS-R1.2; v1 = R1.1, 1798 f). Library files only
(EP07 cues filed 2026-11-08: ukulele loop 100 bpm / 900 f, pestle thocks, double dog bark, soi/night ambience, space pad, motorbike, paper fan; the rest are older
library fallbacks named in the sheet: cold pad = bed_edu05-cold-theme_01 (NG-M2), warm pad = tone_soft-sustain-reflective_01 (NG-M3), ui_pop + reverse swell (NG-S2),
sub hit (NG-S5), glass shimmer (NG-S6, Moon), tag stinger). Every file is generated and unlistened: levels are by number, not by ear.
Layers are built sample-exact in Python (envelopes in dB over global frames), then the music bus is ducked under the narration with sidechaincompress.
Silence G784-875 is exact zero on every layer. Writes public/audio/edu/EDU-EP07-SHORT-draft-stem-v2.wav (1580 f, 48 kHz mono).
Needs public/narration/EDU-EP07-SHORT.wav (duck key). Run: python3 -I scripts/edu-series/ep07/sound-mix.py"""
import array, os, subprocess
L = os.path.expanduser('~/ReelsStore/library/sound')
FPS, TOTAL, SR = 30, 1580, 48000
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
# ---- M1 ukulele (loop 900 f = 30 s). Segment A: position = G (strum on G0). Segment B (hard return G1400): position = G - 680, so the loop point lands on G1580 and G1579 flows into G0.
# hold 0-33, under the pad 33-166, full 170-395, thinner from 395, step down + high-cut ~3 kHz from 601 (L15, "a question"), out over 721-727 ("แม้แต่ข่าวร้าย"); 1400-1580 full, -8 dB duck under the tag 1538-1572, back to B01 level by 1579
m1 = load('music/bed/bed_edu07-ukulele-street-100bpm_01.wav')
m1lp = load('music/bed/bed_edu07-ukulele-street-100bpm_01.wav', af='lowpass=f=3000')
bed(mus, m1, [(0, -9), (33, -9), (36, -17), (166, -17), (170, -9), (395, -9), (399, -12), (598, -12), (604, OFF)])
bed(mus, m1lp, [(598, OFF), (604, -17), (721, -17), (727, OFF)])
bed(mus, m1, [(1399, OFF), (1400, -9), (1538, -9), (1541, -17), (1572, -17), (1579, -9), (1580, -9)], at=F(1400), pos0=F(720))
# ---- A1 soi ambience (12 s loop = 360 f; A: position (G+2) mod 360; B: position (G+222) mod 360 so G1580 = G0 position), un-ducked bus; -6 dB at 721, out by 749, hard return 1400
a1 = load('ambience/city/city_soi-afternoon-day_01.wav')
bed(mix, a1, [(0, -20), (33, -20), (36, -30), (166, -30), (170, -20), (721, -20), (722, -26), (749, OFF)], pos0=F(2))
bed(mix, a1, [(1399, OFF), (1400, -20), (1580, -20)], at=F(1400), pos0=F((1400 + 222) % 360))
# ---- NG-A3 space pad swell: B01-SH02 33-170 only (cutaway swell retired with SH02/SH03)
a3 = load('ambience/space/space_thin-airy-pad_01.wav')
bed(mus, a3, [(33, OFF), (36, -20), (165, -20), (170, OFF)], loop=False, at=F(33))
# ---- NG-A2 night air (10 s loop) G875-1400: fades in 12 f under D03, low under B04-SH04..B05-SH01, hard out on the cut
a2 = load('ambience/city/city_still-night-air_01.wav')
bed(mix, a2, [(875, OFF), (887, -24), (942, -24), (948, -27), (1399, -27), (1400, OFF)])
# ---- NG-M2 cold pad (fallback bed_edu05-cold-theme_01) 942-1300 -> NG-M3 warm pad (tone_soft-sustain-reflective_01) 1300-1400; Jupiter tone 1135-1330
bed(mus, load('music/bed/bed_edu05-cold-theme_01.wav'), [(942, OFF), (948, -25), (1300, -25), (1312, OFF)], loop=False, at=F(942))
bed(mus, load('music/tone/tone_soft-sustain-reflective_01.wav'), [(1300, OFF), (1312, -20), (1398, -20), (1400, OFF)], loop=False, at=F(1300))
bed(mus, load('music/tone/tone_thin-unresolved_01.wav'), [(1135, OFF), (1141, -14), (1300, -14), (1330, OFF)], loop=False, at=F(1135))
# ---- clock ticks (softened, low-passed): every 20 f 170-390; every 10 f 395-555 (-22); every 15 f 559-709 (-22, -20 from 601); every 10 f 721-741; race every 5 f 749-779 (-22); none on/after 784
tick = load('sfx/ui/ui_click-tick_01.wav', af='lowpass=f=2600')
for g in range(170, 395, 20): shot(mix, tick, g, -24)
for g in range(395, 558, 10): shot(mix, tick, g, -22)
for g in (559, 574, 589): shot(mix, tick, g, -22)
for g in (604, 619, 634, 649, 664, 679, 694, 709): shot(mix, tick, g, -20)
for g in (721, 731, 741): shot(mix, tick, g, -22)
for g in range(749, 780, 5): shot(mix, tick, g, -22)
# ---- NG-S1 pestle thocks on contact frames, three variants in turn; last thock G742 (muted from the "tick alone", Film recommends the mute; G759, G776 contacts are silent)
th = [load(f'sfx/foley/foley_pestle-papaya-thock_0{i}.wav') for i in (1, 2, 3)]
contacts = [(5, -16), (23, -16)] + [(g, -22) for g in range(185, 258, 18)] + [(g, -20) for g in (275, 293, 311, 329)] + [(g, -10) for g in (347, 365, 383)] \
    + [(g, -24) for g in range(401, 564, 18)] + [(g, -24) for g in (581, 599, 617, 635)] + [(g, -22) for g in (653, 671, 689, 707)] + [(g, -28) for g in (725, 742)] \
    + [(g, -20) for g in (1404, 1422, 1440, 1458)] + [(g, -16) for g in range(1476, 1567, 18)]
for i, (g, db) in enumerate(contacts): shot(mix, th[i % 3], g, db, off=0.017)
# ---- one-shots
shot(mix, load('sfx/whoosh/whoosh_air-swish-rising_01.wav'), 23, -32)                                    # optional whip, B01-SH01
shot(mix, load('sfx/reveal/reveal_reverse-swell-airy_01.wav'), 21, -26)                                   # into the blink (ends dead at 21+24=45)
shot(mix, load('sfx/ui/ui_pop_01.wav'), 45, -13)                                                          # NG-S2 pop on the blink (G45)
shot(mix, load('sfx/foley/foley_paper-menu-fan_01.wav'), 278, -16)                                        # NG-S3 fan flaps from D01
shot(mix, load('sfx/foley/foley_paper-menu-fan_01.wav'), 398, -24)                                        # fan again, very soft (-8 dB vs D01), B03-SH01
shot(mix, load('sfx/vehicle/vehicle_motorbike-pass-doppler_01.wav'), 442, -16, off=1.474)                 # NG-S4 Doppler peak G442 (pause after "โลกยังวนต่อ")
shot(mix, load('sfx/creature/creature_cat-mrrp_01.wav', af='highpass=f=800,lowpass=f=4000'), 565, -30)    # cat clip through a phone speaker, onset L6 of B03-SH05
shot(mix, load('sfx/reveal/reveal_glass-shimmer-soft_01.wav', t=1.0), 1090, -19, off=0.043, fout=0.2)     # Moon goes dark G1090
shot(mix, load('sfx/creature/creature_dog-bark-double-far_01.wav'), 932, -16, off=0.05)                   # NG-S7 dog onset G932
shot(mix, load('sfx/reveal/reveal_riser-tension_01.wav', ss=3.02), 764, -20, fin=0.05, fout=0.001)        # riser, soft, ends dead on G784 (3.02 s -> 3.69 s = 20 f)
# ---- end tag (UT15): 1.40 s from L14's last voiced frame G1538, peak about -10 dB, fade over the last 0.6 s
shot(mix, load('sfx/stinger/stinger_pizz-tag-ending_01.wav', t=1.40), 1538, -14, fout=0.6)
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
               '-i', 'public/narration/EDU-EP07-SHORT.wav', '-filter_complex', g, '-map', '[out]', '-ar', str(SR), '-ac', '1', '-t', str(DUR), 'public/audio/edu/EDU-EP07-SHORT-draft-stem-v2.wav'], check=True)
print('ok')
