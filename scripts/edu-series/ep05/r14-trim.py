#!/usr/bin/env python3
"""EDU-EP05 R1.4: trim the internal pauses of the picked L05-A / L15-A takes (out/edu05/voice-r14/, Kore x1.10) and write
S/lines/2026-11-07_ep05-nar-<L>-kore-x110-r14.wav (48 kHz mono, 0.05 s lead like the placed lines, 0.10 s tail).
Pause rule: every silence (<= -35 dB, >= 0.08 s) longer than CAP is cut from its middle down to CAP; the first pause of L05 (the "..." break) and
all L15 "..." breaks use CAP_BREAK. Run: python3 -I scripts/edu-series/ep05/r14-trim.py [cap_other cap_break]"""
import os, re, subprocess, sys
S = os.path.expanduser('~/ReelsStore/projects/edu/EDU/narration/ep05/lines')
SRC = 'out/edu05/voice-r14'
cap_other = float(sys.argv[1]) if len(sys.argv) > 1 else 0.10
cap_break = float(sys.argv[2]) if len(sys.argv) > 2 else 0.22
BREAKS = {'L05': [0], 'L15': [1, 2, 3]}  # index (after the lead) of the silences that are "..." breaks
def sil(p):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'silencedetect=n=-35dB:d=0.08', '-f', 'null', '-'], capture_output=True, text=True).stderr
    a = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', o)]; b = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', o)]
    return list(zip(a, b))
for L in ('L05', 'L15'):
    p = f'{SRC}/{L}-A.wav'
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]))
    ss = sil(p); lead = ss[0][1] if ss and ss[0][0] < 0.01 else 0.0
    tail = ss[-1][0] if ss and ss[-1][1] > dur - 0.01 else dur
    inner = [s for s in ss if s[0] > 0.01 and s[1] < dur - 0.01]
    segs = []; cur = lead - 0.05
    for i, (a, b) in enumerate(inner):
        cap = cap_break if i in BREAKS[L] else cap_other
        if b - a > cap:
            segs.append((cur, a + cap / 2)); cur = b - cap / 2
    segs.append((cur, tail + 0.10))
    fc = ';'.join(f'[0:a]atrim={x:.4f}:{y:.4f},asetpts=PTS-STARTPTS,afade=t=in:d=0.004,afade=t=out:st={y-x-0.004:.4f}:d=0.004[s{i}]' for i, (x, y) in enumerate(segs))
    fc += ';' + ''.join(f'[s{i}]' for i in range(len(segs))) + f'concat=n={len(segs)}:v=0:a=1[o]'
    out = f'{S}/2026-11-07_ep05-nar-{L}-kore-x110-r14.wav'
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', p, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '1', out], check=True)
    d2 = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]))
    print(L, 'src', round(dur, 3), 'speech', round(tail - lead, 3), 'inner pauses', [round(b - a, 3) for a, b in inner], '->', round(d2, 3), 'file; onset 0.05, speech', round(d2 - 0.15, 3), out)
    os.makedirs('out/edu05/voice-r14/final', exist_ok=True)
    subprocess.run(['cp', out, f'out/edu05/voice-r14/final/{L}-A-r14.wav'])
