#!/usr/bin/env python3
"""EDU-EP16-SHORT narration placement (Editor, W5.3 Draft, 2026-11-10) per EDU-EP16-ROWS-R2.0 "Narration placement".
The locked R3 Kore read (48.32 s, 48 kHz mono, no atempo; store projects/EDU/audio/2026-11-10_ep16-nar-kore-fullread-r3.wav) is cut at the middle of the real pause before L04, L07, L08, L10 and L12
(read 13.77 / 22.08 / 25.56 / 32.16 / 38.49 s) and placed with offsets 0 / 0.90 / 2.10 / 2.40 / 3.00 / 3.30 s. V01 Charon file start f412 (voice onset f420), V02 Aoede file start f692 (voice onset f700).
No gain; 6 ms fades at every cut (all cuts sit in silence). Total 1632 f = 54.40 s at 48 kHz mono. Writes public/narration/EDU-EP16-SHORT-narration-v2.wav (the placed track replaces the raw copy; the raw read stays in the store)
and out/EDU-EP16-SHORT/audio/placements-v2.txt. NOT LISTENED. Run: python3 -I scripts/edu-series/ep16/narration-place.py"""
import array, os, wave
R = os.path.expanduser('~/ReelsStore/projects/EDU/audio/')
FPS, SR, TOTAL = 30, 48000, 1632
def load(n):
    w = wave.open(R + n); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, n
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
out = array.array('h', bytes(2 * TOTAL * SR // FPS)); log = []
def put(src, start_s, a=0, b=None, fade=0.006):
    b = len(src) if b is None else b; s0 = round(start_s * SR); fi = round(fade * SR)
    for i in range(a, b):
        j = s0 + i - a
        g = min(1.0, (i - a + 1) / fi, (b - i) / fi)
        if 0 <= j < len(out): out[j] = max(-32768, min(32767, out[j] + int(src[i] * g)))
# v2 (2026-11-10, accepted r9 read, 46.52 s, L08 without "but"): thirteen segments, each cut mid-pause (r9 9.45 / 13.92 / 15.80 / 19.40 / 22.14 / 25.15 / 27.75 / 29.61 / 31.29 / 34.02 / 37.35 / 42.00 s; the 29.61 cut lets the 15->16 picture cut f989 stay inside the L09 pause).
# Offset = v1 (r3-based) placed onset minus r9 onset per line, rounded: every line within 0.08 s of its v1 onset except L01-L02 (offset 0: -0.04/-0.07), L03 (+0.07: -0.12 so it ends before the shot-6/7 cut f408), L05 (-0.10) and L06 (-0.15; pulled earlier so V02 keeps a 0.47 s gap after L06). v1 used cuts 13.77/22.08/25.56/32.16/38.49 and offsets 0/.9/2.1/2.4/3.0/3.3 on the r3 read.
nar = load('2026-11-10_ep16-nar-kore-fullread-r9.wav')
cuts = [0.0, 9.45, 13.92, 15.80, 19.40, 22.14, 25.15, 27.75, 29.61, 31.29, 34.02, 37.35, 42.00, len(nar) / SR]
offs = [0.0, -0.12, 0.85, 1.005, 0.98, 2.03, 2.80, 3.16, 3.27, 3.90, 4.25, 4.48, 4.525]
for a, b, o in zip(cuts, cuts[1:], offs):
    put(nar, a + o, round(a * SR), round(b * SR)); log.append(f'NAR read {a:.3f}-{b:.3f} s -> offset {o} s = f{(a + o) * FPS:.1f}-f{(b + o) * FPS:.1f}')
v01 = load('2026-11-10_ep16-char-v01-man-charon-final.wav'); put(v01, 412 / FPS, fade=0.002); log.append('V01 file start f412 (voice onset f%.1f)' % (412 + 0.27 * FPS))
v02 = load('2026-11-10_ep16-char-v02-woman-aoede-final.wav'); put(v02, 692 / FPS, fade=0.002); log.append('V02 file start f692 (voice onset f%.1f)' % (692 + 0.28 * FPS))
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP16-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP16-SHORT-narration-v2.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP16-SHORT/audio/placements-v2.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
