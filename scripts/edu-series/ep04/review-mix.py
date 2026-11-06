#!/usr/bin/env python3
"""EDU-EP04-SHORT rough review mix (Editor, 2026-11-06): narration (VL-EDIT-01 + dialogue) and a library-only sound stem.
Writes public/narration/EDU-EP04-SHORT.wav and public/audio/edu/EDU-EP04-SHORT-review-stem-v5.wav (1662 f, 48 kHz mono).
v5 (6 Nov 2026): adds MUZ-A/B/C (sidechain-ducked by the narration), RT-STORE, SFX-SCAN, SFX-MEMSWELL; all generated sounds are "not listened". Run: python3 -I scripts/edu-series/ep04/review-mix.py"""
import os, subprocess, sys
S = os.path.expanduser('~/ReelsStore')
N = f'{S}/projects/EDU/narration/ep04/2026-11-05_ep04-r13-kore-take3-regap028.wav'
D = f'{S}/projects/EDU/narration'
L = f'{S}/library/sound'
FPS, TOTAL = 30, 1662  # VL-RT-01 (R1.4, H11): 1657 -> 1662
DUR = TOTAL / FPS
f = lambda n: n / FPS

def run(inputs, graph, out, extra=()):
    cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error']
    for i in inputs: cmd += i
    cmd += ['-filter_complex', ';'.join(graph), '-map', '[out]', '-ar', '48000', '-ac', '1', *extra, out]
    subprocess.run(cmd, check=True)

# ---- narration -------------------------------------------------------------------------------------------------
# silencedetect -35 dB d 0.1 on the take-3 regap file: gap (start,end) pairs after L06|L07 (index = order in file)
gaps = [(6.598375,6.878375),(8.35075,8.478146),(9.562771,9.842771),(10.650375,10.930375),(12.117042,12.397042),(13.215187,13.495208),
 (14.737958,15.019083),(15.887417,16.167417),(17.585458,17.865479),(18.981854,19.261854),(20.888479,21.168479),(23.831146,24.111146),
 (26.130958,26.410979),(27.355667,27.635667),(28.648229,28.928229),(30.342979,30.622979),(33.14775,33.427771),(33.801021,34.081021),
 (34.999354,35.279354),(36.05875,36.33875),(37.177292,37.458188),(38.445604,38.725625),(40.201583,40.481583),(41.864833,42.144854),(42.948771,43.228792)]
gaps = [g for g in gaps if g[1]-g[0] > 0.25]
assert len(gaps) == 24, len(gaps)
kinds = 'B B I B I I B I B B B B I B I B I I I B I B I I'.split()   # between-line (0.22 s) / in-line (0.15 s), per VL-EDIT-01 order
assert len(kinds) == 24
pause = {'B': 0.22, 'I': 0.15}
chunks = []   # (file_start, file_end, global_start_sec)
chunks.append((0.0, 3.9, 2/FPS))                               # piece A: L01 L02
cur = 317/FPS
b_start = 4.038875
edges = [b_start] + [x for g in gaps for x in g] + [44.038396]
for i in range(25):
    a, b = edges[2*i], edges[2*i+1]
    chunks.append((a, b, cur)); cur += (b-a)
    if i < 24: cur += pause[kinds[i]]
chunks.append((44.318417, 45.301083, 1533/FPS))                # piece C (R1.4: 1528 -> 1533): L20 two phrases, in-line pause 0.15
chunks.append((45.581104, 46.742229, 1533/FPS + (45.301083-44.318417) + 0.15))
placed = chunks[:]
# dialogue: (file, onset_in_file, global frame, gain dB, length)
dlg = [('ep04-r13-man-l03-algenib.wav', 0.0, 124, 4, 1.47), ('ep04-r13-csh-l04-charon.wav', 0.29, 175, 3, 1.72),
       ('ep04-r13-man-l05-algenib-take2.wav', 0.401562, 275, 0, 0.90), ('ep04-r13-man-l18a-algenib.wav', 0.243417, 1457, 3, 2.14)]
ins = [['-i', N]] + [['-i', f'{D}/{d[0]}'] for d in dlg]
g, mix = [], []
for k, (a, b, at) in enumerate(placed):
    g.append(f'[0:a]atrim={a:.4f}:{b:.4f},asetpts=PTS-STARTPTS,adelay={int(round(at*1000))}:all=1[n{k}]'); mix.append(f'[n{k}]')
for j, (fn, on, fr, db, ln) in enumerate(dlg):
    g.append(f'[{j+1}:a]atrim={on:.4f}:{on+ln+0.12:.4f},asetpts=PTS-STARTPTS,volume={db}dB,alimiter=limit=0.9:level=0,adelay={int(round(fr/FPS*1000))}:all=1[d{j}]'); mix.append(f'[d{j}]')
g.append(f'{"".join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},alimiter=limit=0.95:level=0[out]')
os.makedirs('public/narration', exist_ok=True)
run(ins, g, 'public/narration/EDU-EP04-SHORT.wav')
with open('out/EDU-EP04-SHORT/audio/placements.txt', 'w') as fh:
    for a, b, at in placed: fh.write(f'{a:.3f} {b:.3f} {at:.4f} {at+b-a:.4f}\n')

# ---- sound stem (library only) ----------------------------------------------------------------------------------
sf = lambda p: f'{L}/{p}'
cues = [  # (file, global frame, dB, trim s or None, extra filter)
 ('sfx/foley/foley_cart-wheel-squeak-scrape_01.wav', 20, -28, 1.2, ''),
 ('sfx/reveal/reveal_reverse-swell-airy_01.wav', 56+35, -20, None, ''),
 ('sfx/whoosh/whoosh_fast-slide_01.wav', 121+2, -10, None, ''),
 ('sfx/comedy/comedy_record-scratch_01.wav', 171+2, -10, None, ''),
 ('sfx/whoosh/whoosh_fast-slide_01.wav', 233, -10, None, ''),
 ('sfx/stinger/stinger_wahwah-fail_01.wav', 269+26, -3, None, "volume='if(lt(t,0.233),0.5,if(lt(t,0.683),1,if(lt(t,0.783),1-0.75*(t-0.683)/0.1,0.25)))':eval=frame,afade=t=out:st=1.25:d=0.25"),  # FX-D01: plays to its file end (~f340); ducked -12 dB from f317 (L06 onset)
 ('sfx/whoosh/whoosh_air-swish-rising_01.wav', 311+16, -16, None, ''),
 ('sfx/reveal/reveal_reverse-swell-airy_01.wav', 311+22, -12, None, ''),
 ('instrument/pluck/pluck_soft-note-01_01.wav', 362, -14, None, ''),
 ('instrument/pluck/pluck_soft-note-04_01.wav', 368, -14, None, ''),
 ('instrument/pluck/pluck_soft-note-02_01.wav', 374, -14, None, ''),
 ('sfx/reveal/reveal_glass-shimmer-soft_01.wav', 396+61, -12, None, ''),
 ('instrument/pluck/pluck_soft-note-03_01.wav', 396+92, -16, None, ''),
 ('instrument/pluck/pluck_soft-note-06_01.wav', 396+92, -16, None, ''),
 ('sfx/ui/ui_click-tick_01.wav', 658+54, -14, None, 'asetrate=48000*1.1892,aresample=48000'),
 ('sfx/ui/ui_click-tick_01.wav', 658+64, -14, None, 'asetrate=48000*0.8909,aresample=48000'),
 ('sfx/ui/ui_click-tick_01.wav', 887+16, -12, None, ''),
 ('sfx/ui/ui_click-tick_01.wav', 887+34, -12, None, ''),
 ('sfx/ui/ui_click-tick_01.wav', 887+52, -12, None, ''),
 ('sfx/ui/ui_pop_01.wav', 1024+8, -12, None, ''),
 ('sfx/ui/ui_pop_01.wav', 1024+14, -12, None, ''),
 ('sfx/stinger/stinger_low-muted-hit_01.wav', 1024+62, -10, None, ''),
 ('sfx/ui/ui_notification-ding_01.wav', 1451, -10, None, ''),
 # generated 6 Nov 2026 (filed in the library): SFX-COIN x4 at B02-SH03 L8/15/22/29, SFX-BOING B03-SH04 L36, SFX-STAMP B05-SH02 L20, SFX-CRACK L91
 ('sfx/foley/foley_coin-clink-steel-counter_01.wav', 233+8, -10, None, ''),
 ('sfx/foley/foley_coin-clink-steel-counter_02.wav', 233+15, -10, None, ''),
 ('sfx/foley/foley_coin-clink-steel-counter_03.wav', 233+22, -10, None, ''),
 ('sfx/foley/foley_coin-clink-steel-counter_04.wav', 233+29, -10, None, ''),
 ('sfx/comedy/comedy_soft-boing_01.wav', 554+36, -12, None, ''),
 ('sfx/foley/foley_rubber-stamp-thunk_01.wav', 1173, -8, None, ''),
 ('sfx/foley/foley_ceramic-crack-small_01.wav', 1244, -10, None, ''),
]
ins, g, mix = [], [], []
def add(path, extra=()):
    ins.append([*extra, '-i', path]); return len(ins)-1
for k, (p, fr, db, trim, ex) in enumerate(cues):
    i = add(sf(p))
    chain = [f'atrim=0:{trim}' if trim else None, ex or None, f'volume={db}dB', f'adelay={int(round(fr/FPS*1000))}:all=1']
    g.append(f'[{i}:a]' + ','.join(c for c in chain if c) + f'[c{k}]'); mix.append(f'[c{k}]')
# model bed f345-f745 (fade 0.5 s in, 0.7 s out), -20 dB
i = add(sf('music/bed/bed_curious-explainer-light_01.wav'))
g.append(f'[{i}:a]atrim=0:{(745-345)/FPS},volume=-20dB,afade=t=in:d=0.5,afade=t=out:st={(745-345)/FPS-0.7}:d=0.7,adelay={int(345/FPS*1000)}:all=1[bed]'); mix.append('[bed]')
# generated 6 Nov 2026: SFX-MEMSWELL B05-SH01 L4; SFX-SCAN single B01-SH01 L40 (far), run B02-SH02 L10, soft end beep B06-SH03 L105 (1525+105)
for fn, fr, db in (('sfx/reveal/reveal_memory-swell-muffled_01.wav', 1024+4, -14), ('sfx/electric/electric_scanner-beep-single_01.wav', 40, -26),
                   ('sfx/electric/electric_scanner-beep-run_01.wav', 171+10, -16), ('sfx/electric/electric_scanner-beep-single_01.wav', 1525+105, -20)):
    i = add(sf(fn)); k = len(mix)
    g.append(f'[{i}:a]volume={db}dB,adelay={int(round(fr/FPS*1000))}:all=1[x{k}]'); mix.append(f'[x{k}]')
# room tone RT-STORE (+ fridge hum partial): off f311-f745, low-passed in B05 (f1024-f1261)
rt = sf('ambience/room/room_supermarket-hum-murmur_01.wav'); hum = sf('ambience/room/room_shop-fridge-hum_01.wav')
for name, a, b, db, lp in (('r1', 0, 311, -26, ''), ('r2', 745, 1024, -26, ''), ('r3', 1024, 1261, -29, 'lowpass=f=800,'), ('r4', 1261, 1662, -26, '')):
    for src, gdb, tag in ((rt, db, 'rt'), (hum, db-8, 'hm')):
        i = add(src, ['-stream_loop', '-1'])
        g.append(f'[{i}:a]atrim=0:{(b-a)/FPS},{lp}volume={gdb}dB,afade=t=in:d=0.005,afade=t=out:st={(b-a)/FPS-0.005}:d=0.005,adelay={int(round(a/FPS*1000))}:all=1[{name}{tag}]'); mix.append(f'[{name}{tag}]')
# muzak: MUZ-A f0-311 (hard cut; record scratch f173 stops it 8 f then resumes -4 dB), MUZ-B f745-1261 (low-passed from f1024), MUZ-C f1261-1662 (chord ~f1531 under L20); sidechain-ducked by the narration
ma = sf('music/bed/bed_supermarket-bossa-muzak_01.wav'); mb = sf('music/bed/bed_supermarket-bossa-muzak-detuned_01.wav'); mc = sf('music/bed/bed_supermarket-calm-muzak-end-chord_01.wav')
mus = []
i = add(ma, ['-stream_loop', '-1'])
g.append(f"[{i}:a]atrim=0:{311/FPS},volume='if(lt(t,{173/FPS}),1,if(lt(t,{181/FPS}),0,0.63))':eval=frame,volume=-20dB,afade=t=in:d=0.3,afade=t=out:st={311/FPS-0.005}:d=0.005[mA]"); mus.append('[mA]')
i = add(mb)
g.append(f"[{i}:a]atrim=0:{(1261-745)/FPS},lowpass=f=800:enable='gte(t,{(1024-745)/FPS})',volume=-20dB,afade=t=in:d=0.3,afade=t=out:st={(1261-745)/FPS-0.3}:d=0.3,adelay={int(745/FPS*1000)}:all=1[mB]"); mus.append('[mB]')
i = add(mc)
g.append(f"[{i}:a]atrim=0:{(1662-1261)/FPS},volume=-20dB,afade=t=in:d=0.3,adelay={int(1261/FPS*1000)}:all=1[mC]"); mus.append('[mC]')
k = add('public/narration/EDU-EP04-SHORT.wav')
g.append(f'[{k}:a]asplit=1[key]')
g.append(f'{"".join(mus)}amix=inputs=3:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR}[musraw]')
g.append('[musraw][key]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=400:makeup=1[musd]'); mix.append('[musd]')
g.append(f'{"".join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},afade=t=out:st={DUR-1.0}:d=1.0,atrim=0:{DUR-1/FPS},apad=whole_dur={DUR}[out]')
os.makedirs('public/audio/edu', exist_ok=True)
run(ins, g, 'public/audio/edu/EDU-EP04-SHORT-review-stem-v5.wav')
print('ok')
