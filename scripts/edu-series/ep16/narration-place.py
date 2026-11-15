#!/usr/bin/env python3
"""EDU-EP16-SHORT narration placement (Editor, W5.3 Draft) on EDU-EP16-SHEETS-R2 ("Units, clocks and conventions", N1-N4).
The locked read public/narration/EDU-EP16-SHORT-narration-v2.wav (voice lock v2, Kore, atempo 1.028571, 55.045 s, 48 kHz mono, no L06 trim) is cut in the measured silences 22.412 / 33.899 / 45.854 s
and placed in four pieces at offsets +0.80 / +1.90 / +2.60 / +3.80 s (N1..N4). No gain, no atempo; 3 ms edge fades inside the silences only (click guard).
Writes public/narration/EDU-EP16-SHORT-narration-placed-v2.wav (1800 f at 48 kHz mono, the composition narration) and out/EDU-EP16-SHORT/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep16/narration-place.py"""
import array, os, wave
FPS, SR, TOTAL = 30, 48000, 1800
w = wave.open('public/narration/EDU-EP16-SHORT-narration-v2.wav'); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2
nar = array.array('h'); nar.frombytes(w.readframes(w.getnframes()))
out = array.array('h', bytes(2 * TOTAL * SR // FPS)); log = []
segs = [('N1', 0.0, 22.412, 0.80), ('N2', 22.412, 33.899, 1.90), ('N3', 33.899, 45.854, 2.60), ('N4', 45.854, len(nar) / SR, 3.80)]
fade = int(0.003 * SR)
for name, a, b, o in segs:
    i0, i1 = round(a * SR), round(b * SR); s0 = round((a + o) * SR)
    for i in range(i0, i1):
        g = min(1.0, (i - i0 + 1) / fade, (i1 - i) / fade)
        out[s0 + i - i0] = max(-32768, min(32767, int(nar[i] * g)))
    log.append(f'{name} file {a:.3f}-{b:.3f} s -> offset +{o:.2f} s = f{(a + o) * FPS:.1f}-f{(b + o) * FPS:.1f}')
os.makedirs('out/EDU-EP16-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP16-SHORT-narration-placed-v2.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP16-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
