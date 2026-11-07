#!/usr/bin/env python3
"""EDU-EP06-SHORT narration placement (Editor, W5.3, 2026-11-07). Cuts each NAR line from the locked Revision E full read (store narration/ep06,
lines.json fileStart/fileDur) and places it, with the OWN Leda takes L03/L03b, so the speech onset lands on the frame of scene-sheets.md (SHEETS-R1.1
"Line onsets on the timeline"). Writes public/narration/EDU-EP06-SHORT.wav (1685 f, 48 kHz mono) and out/EDU-EP06-SHORT/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep06/narration-place.py"""
import json, os, subprocess
S = os.path.expanduser('~/ReelsStore/projects/EDU/narration/ep06')
FPS, TOTAL = 30, 1685
DUR = TOTAL / FPS
FULL = f'{S}/2026-11-07_ep06-nar-kore-A-slow92-r13-e-fullread.wav'
on = {'L01': 4, 'L02': 50, 'L03': 160, 'L04': 294, 'L05': 343, 'L06': 411, 'L07': 526, 'L08': 644, 'L03b': 851, 'L09': 888,
      'L10': 1044, 'L11': 1183, 'L12': 1312, 'L13': 1410}
rows = {r['id']: r for r in json.load(open(f'{S}/lines.json'))}
cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error']
g, labels, log = [], [], []
for i, (k, f) in enumerate(on.items()):
    r = rows[k]
    if r.get('voice') == 'OWN':
        cmd += ['-i', f"{S}/{r['file']}"]; head = f"[{i}:a]anull"
    else:
        cmd += ['-i', FULL]; head = f"[{i}:a]atrim={r['fileStart']}:{r['fileStart'] + r['fileDur']},asetpts=PTS-STARTPTS"
    at = f / FPS - r['onsetInFile']
    g.append(f"{head},adelay={int(round(at * 1000))}:all=1[c{i}]"); labels.append(f'[c{i}]'); log.append(f'{k} onset G{f} file-start {at:.3f}s')
g.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR}[out]')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP06-SHORT/audio', exist_ok=True)
subprocess.run(cmd + ['-filter_complex', ';'.join(g), '-map', '[out]', '-ar', '48000', '-ac', '1', '-t', str(DUR), 'public/narration/EDU-EP06-SHORT.wav'], check=True)
open('out/EDU-EP06-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n')
print('ok', TOTAL, 'f')
