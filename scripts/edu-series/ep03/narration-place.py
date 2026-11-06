#!/usr/bin/env python3
"""EDU-EP03-SHORT W5.3 (Editor, 5 Nov 2026): place the locked Kore v1 read as the six segments N1-N6 of the scene sheets SS-R3.1
(scenes/index.md "Clocks and audio placement") with silent gaps G1..G5 between them, as ONE mono 48 kHz track of exactly 1571 frames,
and write the per-frame amplitude json. Cuts sit on whole file frames inside measured silences and are snapped to the nearest zero
crossing within +-10 ms; the result and the cut shifts are printed.

Usage (needs numpy + soundfile, e.g. ~/Developer/reels-creator/out/voice-venv/bin/python):
  python -I scripts/edu-series/ep03/narration-place.py <narration.wav> <out.wav> <amplitude.json>
"""
import json, sys
import numpy as np, soundfile as sf

SR, FPS, TOTAL = 48000, 30, 1571
# (file start frame, file end frame, placed at composition frame); gaps are the differences (G1 223 f ... G5 20 f).
SEGS = [(0, 147, 0), (156, 830, 379), (830, 966, 1061), (966, 1020, 1203), (1020, 1113, 1264), (1113, 1625, 1377)]
fs = lambda f: int(round(f * SR / FPS))
x, sr = sf.read(sys.argv[1]); assert sr == SR
x = x if x.ndim == 1 else x[:, 0]


def snap(i):
    lo, hi = max(1, i - 480), min(len(x) - 1, i + 480)
    s = np.where(np.signbit(x[lo - 1:hi - 1]) != np.signbit(x[lo:hi]))[0]
    return i if len(s) == 0 else lo + int(s[np.argmin(np.abs(lo + s - i))])


out = np.zeros(TOTAL * SR // FPS)
shifts = []
for k, (a, b, at) in enumerate(SEGS):
    ia = 0 if a == 0 else snap(fs(a)); ib = len(x) if k == len(SEGS) - 1 else snap(fs(b))
    shifts.append((k + 1, round((ia - fs(a)) / SR * 1000, 1), round((ib - fs(b)) / SR * 1000, 1) if k < len(SEGS) - 1 else None))
    seg = x[ia:ib].copy()
    n = min(len(seg), 96)  # 2 ms fades at the cut so a snapped cut never clicks
    seg[:n] *= np.linspace(0, 1, n) if a else 1
    if k < len(SEGS) - 1: seg[-n:] *= np.linspace(1, 0, n)
    o = fs(at)
    out[o:o + len(seg)] += seg[:len(out) - o]
sf.write(sys.argv[2], out.astype('float32'), SR, subtype='PCM_24')
h = SR // FPS
rms = [float(np.sqrt((out[i * h:(i + 1) * h] ** 2).mean())) for i in range(TOTAL)]
pk = max(rms)
json.dump([round(v / pk, 4) for v in rms], open(sys.argv[3], 'w')); open(sys.argv[3], 'a').write('\n')
print('segment cut shifts (ms: start, end):', shifts)
print('frames', TOTAL, 'duration', len(out) / SR, 'peak dBFS', round(20 * np.log10(abs(out).max()), 2))
