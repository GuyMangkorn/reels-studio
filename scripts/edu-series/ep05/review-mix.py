#!/usr/bin/env python3
"""EDU-EP05-SHORT rough review sound stem v1 (Editor, W5.3, 2026-11-06): LIBRARY-ONLY, no NG-* generated (scene-sheets Sound plan). Every file is
"not listened" (generated, unlistened); levels are by number, not ear. Writes public/audio/edu/EDU-EP05-SHORT-review-stem-v1.wav (1963 f, 48 kHz mono).
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
# one-shots (NG-* stand-ins are library fallbacks named in the sound plan)
cue('_raw/reveal_glass-shimmer-soft_01.wav', 190, -14)                    # NG-S1 stand-in, shrink touch L53 (G190)
cue('_raw/whoosh_air-swish-rising_01.wav', 276, -16)                       # lift-off peak (G276)
cue('sfx/comedy/comedy_soft-boing_01.wav', 499, -16)                       # soft landing on "ถึงพื้น" (G499); no thud
cue('sfx/comedy/comedy_soft-boing_01.wav', 693, -18, ex='asetrate=48000*1.25,aresample=48000')   # NG-S4 stand-in, hand into the drop (G693)
cue('sfx/foley/foley_wet-pops-bubbles_01.wav', 976, -14)                   # snap (G976) NG-S5 stand-in
cue('sfx/foley/foley_bread-bite-crunch_01.wav', 1229, -16)                 # nibble 1 (L8)
cue('sfx/foley/foley_bread-bite-crunch_01.wav', 1241, -16)                 # nibble 2 (L20)
cue('sfx/stinger/stinger_pizz-shrug_01.wav', 1305, -20)                    # slump (G1297-1315)
cue('_raw/reveal_reverse-swell-airy_01.wav', 1620, -22)                    # small riser into V07 (G1592-1620)
cue('_raw/stinger_outro-resolve_01.wav', 1648, -14, 3.0)                   # lift sting (G1648), NG-S9 stand-in
cue('sfx/stinger/stinger_pizz-tag-ending_01.wav', 1890, -18)               # end tag after V08
# music: curious bed G0-1000 low; warm pad G1356-1939 (cold B04 NG-M2 missing -> silence); end chord under the fade
mus = []
i = add('_raw/bed_pool-curious-sparse_01.wav'); n = 1000 / FPS
g.append(f'[{i}:a]atrim=0:{n},volume=-24dB,afade=t=in:d=0.5,afade=t=out:st={n - 0.4}:d=0.4[mA]'); mus.append('[mA]')
i = add('_raw/bed_warm-pad-felt-third_01.wav', True); n = (1939 - 1356) / FPS
g.append(f"[{i}:a]atrim=0:{n},volume='if(lt(t,2.4),0.5,1)':eval=frame,volume=-23dB,afade=t=in:d=1.0,afade=t=out:st={n - 0.6}:d=0.6,adelay={int(1356 / FPS * 1000)}:all=1[mB]"); mus.append('[mB]')
nar = len(ins); ins.append(['-i', 'public/narration/EDU-EP05-SHORT.wav'])
g.append(f'[{nar}:a]asplit=1[key]')
g.append(f'{"".join(mus)}amix=inputs={len(mus)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR}[musraw]')
g.append('[musraw][key]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=400:makeup=1[musd]'); mix.append('[musd]')
g.append(f'{"".join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},volume=6dB,afade=t=out:st={DUR - 0.8}:d=0.8,atrim=0:{DUR - 1 / FPS},apad=whole_dur={DUR}[out]')
cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error']
for x in ins: cmd += x
os.makedirs('public/audio/edu', exist_ok=True)
subprocess.run(cmd + ['-filter_complex', ';'.join(g), '-map', '[out]', '-ar', '48000', '-ac', '1', 'public/audio/edu/EDU-EP05-SHORT-review-stem-v1.wav'], check=True)
print('ok')
