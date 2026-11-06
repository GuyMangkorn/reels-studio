#!/usr/bin/env python3
"""EDU-EP05-SHORT rough review sound stem v2 (Editor, W5.3, 2026-11-07): v2: NG-M1..M3 and NG-S1..S9 generated (library). Every file is
"not listened" (generated, unlistened); levels are by number, not ear. Writes public/audio/edu/EDU-EP05-SHORT-review-stem-v2.wav (1963 f, 48 kHz mono).
Needs public/narration/EDU-EP05-SHORT.wav (narration-place.py) as the duck key. Run: python3 -I scripts/edu-series/ep05/review-mix.py
Policy (scene-sheets): G1332-1356 silence (music and birds out, breeze -6 dB); no hard impact in the fall (landing = soft boing); end fade to digital silence by G1962."""
import os, subprocess
L = os.path.expanduser('~/ReelsStore/library/sound')
FPS, TOTAL = 30, 1963
DUR = TOTAL / FPS
ins, g, mix = [], [], []
def add(rel, loop=False):
    ins.append((['-stream_loop', '-1'] if loop else []) + ['-i', f'{L}/{rel}']); return len(ins) - 1
def cue(rel, fr, db, trim=None, ex=''):       # one-shot at global frame fr
    i = add(rel); k = len(mix)
    chain = [f'atrim=0:{trim}' if trim else '', ex, f'volume={db}dB', f'adelay={int(round(fr / FPS * 1000))}:all=1']
    g.append(f'[{i}:a]' + ','.join(c for c in chain if c) + f'[c{k}]'); mix.append(f'[c{k}]')
def bed(rel, a, b, db, ex='', fade=0.15, name=None):  # looped bed over [a, b) frames, hard-ish edges
    i = add(rel, True); k = len(mix); n = (b - a) / FPS
    chain = [f'atrim=0:{n}', ex, f'volume={db}dB', f'afade=t=in:d={fade}', f'afade=t=out:st={n - fade}:d={fade}', f'adelay={int(round(a / FPS * 1000))}:all=1']
    g.append(f'[{i}:a]' + ','.join(c for c in chain if c) + f'[b{k}]'); mix.append(f'[b{k}]')
    return f'[b{k}]'
# balcony bed G0-208 (low-passed), -6 dB G208-329; air/breeze
bed('ambience/outdoor/outdoor_dawn-street-empty_01.wav', 0, 208, -26, 'lowpass=f=1200')
bed('ambience/room/room_soi-morning-quiet_01.wav', 0, 208, -30, 'lowpass=f=1200')
bed('ambience/outdoor/outdoor_dawn-street-empty_01.wav', 208, 329, -32, 'lowpass=f=1200', 0.3)
bed('ambience/outdoor/outdoor_wind-open-roundabout_01.wav', 41, 137, -38, 'lowpass=f=900', 0.4)      # very low rise from below
bed('ambience/outdoor/outdoor_wind-open-roundabout_01.wav', 208, 493, -30, 'lowpass=f=1500', 0.3)    # blade breeze + drift air
# garden bed: far huge birds G493-1000; breeze only G1000-1332; silence G1332-1356; birds back low G1356-1963
bed('_raw/outdoor_park-birds-breeze_01.wav', 493, 1000, -28, 'lowpass=f=1500', 0.3)
bed('ambience/outdoor/outdoor_wind-open-roundabout_01.wav', 1000, 1332, -34, 'lowpass=f=1200', 0.2)
bed('ambience/outdoor/outdoor_wind-open-roundabout_01.wav', 1332, 1356, -40, 'lowpass=f=1200', 0.01)  # breeze -6 dB in the silence
bed('_raw/outdoor_park-birds-breeze_01.wav', 1356, 1939, -31, 'lowpass=f=1500', 0.4)
# one-shots: NG-* generated 2026-11-07 (library, all "not listened"); levels by number. Frames = shot start + L offset from the shot blocks.
cue('sfx/comedy/comedy_shrink-pop-gliss_01.wav', 190, -17)                 # NG-S1 shrink touch L53 (SH03 137+53)
cue('sfx/foley/foley_grass-creak-giant_01.wav', 212, -22)                  # NG-S2 giant grass creak L4 (208+4), runs ~2.7 s into SH05
cue('_raw/whoosh_air-swish-rising_01.wav', 276, -16)                       # lift-off peak (G276)
cue('sfx/foley/foley_soft-landing-tap_01.wav', 499, -18, ex='highpass=f=150')   # NG-S3 soft tap L6 (493+6), no low thump
cue('sfx/comedy/comedy_soft-boing_01.wav', 501, -22)                       # soft boing L8, -6 dB vs v1
cue('sfx/comedy/comedy_glass-boing-creak_01.wav', 665, -18)                # NG-S4 glassy boing + creak L2 (663+2)
cue('sfx/comedy/comedy_glass-boing-creak_01.wav', 769, -26, ex='atrim=start=0.4,asetpts=PTS-STARTPTS')   # soft creak on tug L20 (749+20)
cue('sfx/comedy/comedy_glass-boing-creak_01.wav', 799, -26, ex='atrim=start=0.4,asetpts=PTS-STARTPTS')   # tug L50
cue('sfx/foley/foley_wet-plop_01.wav', 976, -14)                           # NG-S5 snap/plop L108 (868+108)
cue('sfx/reveal/reveal_warmth-fwoop_01.wav', 1149, -20)                    # NG-S6 warmth fwoop L72 (1077+72)
cue('sfx/reveal/reveal_warmth-fwoop_01.wav', 1161, -20)                    # NG-S6 L84
cue('sfx/foley/foley_bread-bite-crunch_01.wav', 1229, -16)                 # nibble 1 (L8)
cue('sfx/foley/foley_bread-bite-crunch_01.wav', 1241, -16)                 # nibble 2 (L20)
cue('sfx/foley/foley_crumb-drag-scrape_01.wav', 1253, -20, 1.4)            # NG-S7 drag scrape L36-80 (1217+36..80)
cue('sfx/stinger/stinger_pizz-shrug_01.wav', 1305, -20)                    # slump (G1297-1315)
cue('_raw/reveal_reverse-swell-airy_01.wav', 1620, -22)                    # small riser into V07 (G1592-1620)
cue('music/stinger/stinger_brass-celesta-triumph_01.wav', 1648, -22)       # NG-S9 lift sting (G1648)
cue('sfx/stinger/stinger_pizz-tag-ending_01.wav', 1890, -18)               # end tag after V08
bed('sfx/foley/foley_ant-steps-tiny_01.wav', 1117, 1173, -44, 'lowpass=f=4000', 0.2)    # NG-S8 far, very low (SH02 L40-96)
bed('sfx/foley/foley_ant-steps-tiny_01.wav', 1332, 1430, -30, '', 0.01)    # NG-S8 close; the only sound in G1332-1356
# music: NG-M1 G0-1000 low; NG-M2 cold G1000-1332 hard out; NG-M3 warm G1356-1939 under the fade
mus = []
def song(rel, a, b, db, fi, fo, name):
    i = add(rel); n = (b - a) / FPS
    g.append(f'[{i}:a]atrim=0:{n},volume={db}dB,afade=t=in:d={fi},afade=t=out:st={n - fo}:d={fo},adelay={int(round(a / FPS * 1000))}:all=1[{name}]'); mus.append(f'[{name}]')
song('music/bed/bed_edu05-curious-theme_01.wav', 0, 1000, -25, 0.5, 0.4, 'mA')
song('music/bed/bed_edu05-cold-theme_01.wav', 1000, 1332, -26, 0.3, 0.04, 'mC')   # hard out on G1332 (1 f)
song('music/bed/bed_edu05-warm-theme_01.wav', 1356, 1939, -25, 0.4, 0.6, 'mB')
nar = len(ins); ins.append(['-i', 'public/narration/EDU-EP05-SHORT.wav'])
g.append(f'[{nar}:a]asplit=1[key]')
g.append(f'{"".join(mus)}amix=inputs={len(mus)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR}[musraw]')
g.append('[musraw][key]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=400:makeup=1[musd]'); mix.append('[musd]')
g.append(f'{"".join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},volume=6dB,afade=t=out:st={DUR - 0.8}:d=0.8,atrim=0:{DUR - 1 / FPS},apad=whole_dur={DUR}[out]')
cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error']
for x in ins: cmd += x
os.makedirs('public/audio/edu', exist_ok=True)
subprocess.run(cmd + ['-filter_complex', ';'.join(g), '-map', '[out]', '-ar', '48000', '-ac', '1', 'public/audio/edu/EDU-EP05-SHORT-review-stem-v2.wav'], check=True)
print('ok')
