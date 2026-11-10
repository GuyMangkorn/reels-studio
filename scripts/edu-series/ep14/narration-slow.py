#!/usr/bin/env python3
"""EDU-EP14-SHORT slower narration (user pick, 2026-11-09): the locked R4 Kore read, no new Gemini request, speech atempo 0.90, gaps atempo 0.95.
Source (store): projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-fullread.wav (51.44 s, 48 kHz mono).
Cut at the speech-run edges measure.json `previous.lock_R3.0`.lines (read_onset_s/read_end_s); lead-in = 0 .. L01 onset and every between-run gap at 0.95, each speech run at 0.90
(ffmpeg atrim + asetpts + atempo, concat). The tail after the last run (51.105 .. 51.44 s) is appended unchanged (no atempo); the rebuild is sample-identical to the user-picked file (56.147 s) for the first 55.81 s; the 0.34 s tail (noise floor, peak -26 dBFS) differs by at most 28 LSB and is 62 samples (1.3 ms) shorter.
Run: python3 -I scripts/edu-series/ep14/narration-slow.py [out.wav]   (default out/ep14-slow/nar-kore-x0.90speech-x0.95gaps-full.wav)
Then: python3 -I scripts/store.py put <out> projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-s090-g095.wav"""
import json, os, subprocess, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
SRC = os.path.expanduser('~/ReelsStore/projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-fullread.wav')
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/ep14-slow/nar-kore-x0.90speech-x0.95gaps-full.wav'
SPEECH, GAPS = 0.90, 0.95
m = json.loads((HERE / 'measure.json').read_text())
lines = m['previous']['lock_R3.0']['lines']  # the unslowed read's edges (R3.0/R3.1 timing)
runs = sorted((v['read_onset_s'], v['read_end_s']) for v in lines.values())
segs = [(0.0, runs[0][0], GAPS)]
for i, (a, b) in enumerate(runs):
    segs.append((a, b, SPEECH))
    if i + 1 < len(runs):
        segs.append((b, runs[i + 1][0], GAPS))
segs.append((runs[-1][1], None, None))
parts = [f'[0:a]atrim={a:.4f}{'' if b is None else ':%.4f' % b},asetpts=PTS-STARTPTS{'' if r is None else f',atempo={r}'}[s{i}]' for i, (a, b, r) in enumerate(segs)]
fc = ';'.join(parts) + ';' + ''.join(f'[s{i}]' for i in range(len(segs))) + f'concat=n={len(segs)}:v=0:a=1[o]'
os.makedirs(os.path.dirname(OUT), exist_ok=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', SRC, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', OUT], check=True)
print(OUT)
