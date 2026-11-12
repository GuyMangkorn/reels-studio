#!/usr/bin/env python3
"""EDU-EP18-SHORT narration placement (Editor, W5.3 draft, 2026-11-12) per EDU-EP18-ROWS-R2.2 "Narration placement" (storyboard.md, nine segments).
The locked Kore read (38.60 s, 48 kHz mono, atempo 1.0; store projects/edu/EDU/audio/2026-11-11_ep18-r1-nar-kore-raw.wav) is cut inside a real pause at
1.511 / 6.489 / 9.106 / 21.093 / 24.375 / 27.980(-28.130 dropped) / 34.255 / 35.810 s and placed with offsets +0.10 / 0.60 / 1.70 / 2.70 / 4.34 / 4.64 / 5.24 / 5.79 / 6.09 s.
No gain, 6 ms fades at every cut. V01-V03 character voices are not cast (slots left silent). Total 1468 f at 48 kHz mono.
Writes public/narration/EDU-EP18-SHORT-narration-v1.wav and out/EDU-EP18-SHORT/audio/placements-v1.txt. NOT LISTENED. Run: python3 -I scripts/edu-series/ep18/narration-place.py"""
import array, os, wave
R = os.path.expanduser('~/ReelsStore/projects/edu/EDU/audio/')
FPS, SR, TOTAL = 30, 48000, 1468
w = wave.open(R + '2026-11-11_ep18-r1-nar-kore-raw.wav'); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2
nar = array.array('h'); nar.frombytes(w.readframes(w.getnframes()))
out = array.array('h', bytes(2 * TOTAL * SR // FPS)); log = []
SEG = [('A', 0.0, 1.511, 0.10), ('B', 1.511, 6.489, 0.60), ('C', 6.489, 9.106, 1.70), ('D', 9.106, 21.093, 2.70), ('E', 21.093, 24.375, 4.34),
       ('F', 24.375, 27.980, 4.64), ('G', 28.130, 34.255, 5.24), ('H', 34.255, 35.810, 5.79), ('I', 35.810, 38.600, 6.09)]
fi = round(0.006 * SR)
for n, a, b, o in SEG:
    i0, i1 = round(a * SR), min(round(b * SR), len(nar)); j0 = round((a + o) * SR)
    for i in range(i0, i1):
        g = min(1.0, (i - i0 + 1) / fi, (i1 - i) / fi); j = j0 + i - i0
        if 0 <= j < len(out): out[j] = max(-32768, min(32767, out[j] + int(nar[i] * g)))
    log.append(f'seg {n} read {a:.3f}-{b:.3f} s -> offset {o} s = f{(a + o) * FPS:.1f}-f{(b + o) * FPS:.1f}')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP18-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP18-SHORT-narration-v1.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP18-SHORT/audio/placements-v1.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
