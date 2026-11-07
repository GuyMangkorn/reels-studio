#!/usr/bin/env python3
"""EDU-EP05-SHORT narration placement (Editor, W5.3, 2026-11-06). NAR split files (voice-measure.json, Kore x1.10) + TINY picks placed so the
speech onset lands on the frame stated in scene-sheets.md (EDU-EP05-SHEETS-R1). Writes public/narration/EDU-EP05-SHORT.wav (1963 f, 48 kHz mono)
and out/EDU-EP05-SHORT/audio/placements.txt. Run: python3 -I scripts/edu-series/ep05/narration-place.py"""
import os, subprocess
S = os.path.expanduser('~/ReelsStore/projects/EDU/narration/ep05')
FPS, TOTAL = 30, 1963
DUR = TOTAL / FPS
# (file, start of the FILE in global frames, gain dB). NAR: file start = onset frame - 0.05 s (in-file onset); TINY: file start as stated per shot.
nar = {'L01': 6, 'L02': 45, 'L03': 141, 'L04': 244, 'L05': 347, 'L06': 469, 'L07': 590, 'L09': 753, 'L10': 872, 'L11': 1004,
       'L12': 1081, 'L13': 1221, 'L14': 1356, 'L15': 1425, 'L16': 1620, 'L17': 1771}
# R1.4 (2026-11-07): L15 = picked candidate A (trimmed, r14-trim.py). L05 r14 is 0.85 s over its slot and would overlap L06 (G469): kept on the old take
# until the user picks a retime option (build-notes R1.4); set R14_L05 = True once the following lines are shifted.
R14 = {'L15'} | ({'L05'} if os.environ.get('R14_L05') else set())
cues = [(f'{S}/lines/' + (f'2026-11-07_ep05-nar-{k}-kore-x110-r14.wav' if k in R14 else f'2026-11-06_ep05-nar-{k}-kore-x110.wav'), f / FPS - 0.05, 0) for k, f in nar.items()]
tiny = [('V01-t1', 218), ('V02-t2', 318), ('V03-t2', 552), ('L08-t1', 658), ('2026-11-06_ep05-V04-t2-tight', 916), ('V05-t1', 1193),
        ('V06-t2', 1280), ('V07-t1', 1592), ('V08-t1', 1883)]
cues += [(f'{S}/tiny/{k}.wav', f / FPS, 0) for k, f in tiny]
cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error']
for p, _, _ in cues: cmd += ['-i', p]
g = [f'[{i}:a]volume={db}dB,adelay={int(round(at * 1000))}:all=1[c{i}]' for i, (_, at, db) in enumerate(cues)]
g.append(''.join(f'[c{i}]' for i in range(len(cues))) + f'amix=inputs={len(cues)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},alimiter=limit=0.95:level=0[out]')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP05-SHORT/audio', exist_ok=True)
subprocess.run(cmd + ['-filter_complex', ';'.join(g), '-map', '[out]', '-ar', '48000', '-ac', '1', 'public/narration/EDU-EP05-SHORT.wav'], check=True)
with open('out/EDU-EP05-SHORT/audio/placements.txt', 'w') as fh:
    for p, at, _ in cues: fh.write(f'{os.path.basename(p)} {at:.3f}\n')
print('ok', TOTAL, 'f')
