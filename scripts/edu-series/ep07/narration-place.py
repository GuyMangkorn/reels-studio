#!/usr/bin/env python3
"""EDU-EP07-SHORT narration placement (Editor, W5.3, 2026-11-08). Places each locked line file WHOLE (no atempo, no inner cut) so its voiced onset lands on
the frame of scene-sheets.md (SHEETS-R1.1 "Narration placement"). Onset in file is MEASURED here (10 ms frames, -40 dBFS) and compared with the sheet.
Writes public/narration/EDU-EP07-SHORT.wav (1798 f, 48 kHz mono) and out/EDU-EP07-SHORT/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep07/narration-place.py"""
import os, subprocess, wave, struct, array
S = os.path.expanduser('~/ReelsStore/projects/EDU/audio/EDU-EP07-SHORT/narration')
FPS, TOTAL = 30, 1798
DUR = TOTAL / FPS
N = lambda k: f'{S}/lines/2026-11-08_ep07-nar95-{k}.wav'
# id -> (file, onset G, sheet onset-in-file)
ON = {'L01': (N('L01'), 16, 0.06), 'L02': (N('L02'), 146, 0.06), 'L03': (N('L03'), 174, 0.06),
      'D01': (f'{S}/2026-11-08_ep07-D01.wav', 276, 0.11), 'D02': (f'{S}/2026-11-08_ep07-D02.wav', 345, 0.16),
      'L05': (N('L05'), 399, 0.06), 'L06': (N('L06'), 582, 0.06), 'L07': (N('L07'), 755, 0.06), 'L08': (N('L08'), 982, 0.06),
      'D03': (f'{S}/2026-11-08_ep07-D03-lvl16.wav', 1093, 0.20), 'L09': (N('L09'), 1164, 0.06), 'L10': (N('L10'), 1249, 0.06),
      'L11': (N('L11'), 1335, 0.06), 'L12': (N('L12'), 1434, 0.06), 'L13': (N('L13'), 1522, 0.06), 'L14': (N('L14'), 1622, 0.06)}
def voiced(path, floor_db=-40.0):
    w = wave.open(path); n = w.getnframes(); sr = w.getframerate(); ch = w.getnchannels()
    a = array.array('h'); a.frombytes(w.readframes(n))
    if ch > 1: a = a[::ch]
    hop = sr // 100; on = off = None
    for i in range(0, len(a) - hop, hop):
        seg = a[i:i + hop]; rms = (sum(x * x for x in seg) / len(seg)) ** 0.5 / 32768
        if rms > 0 and 20 * __import__('math').log10(rms) > floor_db:
            if on is None: on = i / sr
            off = (i + hop) / sr
    return on, off, n / sr
cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error']; g, lab, log = [], [], []
for i, (k, (f, G, sheet)) in enumerate(ON.items()):
    on, off, dur = voiced(f); at = G / FPS - on
    cmd += ['-i', f]
    g.append(f'[{i}:a]aresample=48000,adelay={int(round(at * 1000))}:all=1[c{i}]'); lab.append(f'[c{i}]')
    log.append(f'{k} onset G{G} measured onset {on:.2f}s (sheet {sheet:.2f}) voiced end G{round((at + off) * FPS)} file-start {at:.3f}s dur {dur:.2f}s')
g.append(''.join(lab) + f'amix=inputs={len(lab)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR}[out]')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP07-SHORT/audio', exist_ok=True)
subprocess.run(cmd + ['-filter_complex', ';'.join(g), '-map', '[out]', '-ar', '48000', '-ac', '1', '-t', str(DUR), 'public/narration/EDU-EP07-SHORT.wav'], check=True)
open('out/EDU-EP07-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n')
print('\n'.join(log)); print('ok', TOTAL, 'f')
