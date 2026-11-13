#!/usr/bin/env python3
"""EDU-EP17-SHORT narration placement (Editor, W5.3 Draft, 2026-11-12) per EDU-EP17-ROWS-R2.4 "Units, clocks and conventions" (narration placement, character takes).
The locked Kore read (x1.08, 44.82 s, 48 kHz mono; store projects/edu/EDU/audio/2026-11-11_ep17-nar-kore-warm-fullread-r2-x1.08.wav) is cut at the middle of the real pause before L04, L06, L08, L10, L11, L14
(read 8.555 / 13.765 / 19.655 / 25.685 / 28.080 / 38.950 s) and placed with offsets 0 / 52 / 64 / 142 / 151 / 160 / 169 frames (global [0,257) [309,465) [477,654) [732,913) [922,993) [1002,1329) [1337,1514)).
V01 (MAN take A strained) file start f261, trimmed at 1.45 s with a 2 f fade (its silent tail would run under L04); V02 (take A strained) file start f704. Cuts sit in silence: 6 ms fades, except the cut at 25.685 s,
whose file pause is only 0.063 s (25.655-25.718): 2 f (66.7 ms) fades each side, as the sheet says (the out-fade begins 0.03 s before the pause; L09's tail there is below -32 dB).
No gain. Total 1561 f = 52.03 s at 48 kHz mono. Writes public/narration/EDU-EP17-SHORT-narration-v1.wav and out/EDU-EP17-SHORT/audio/placements-v1.txt. NOT LISTENED.
Run: python3 -I scripts/edu-series/ep17/narration-place.py"""
import array, os, wave
R = os.path.expanduser('~/ReelsStore/projects/edu/EDU/')
FPS, SR, TOTAL = 30, 48000, 1561
def load(n):
    w = wave.open(R + n); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, n
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
out = array.array('h', bytes(2 * (TOTAL * SR // FPS))); log = []
def put(src, start_f, a=0, b=None, fade_in=0.006, fade_out=0.006):
    b = len(src) if b is None else b; s0 = round(start_f * SR / FPS); fi = round(fade_in * SR); fo = round(fade_out * SR)
    for i in range(a, b):
        j = s0 + i - a
        g = min(1.0, (i - a + 1) / fi, (b - i) / fo)
        if 0 <= j < len(out): out[j] = max(-32768, min(32767, out[j] + int(src[i] * g)))
nar = load('audio/2026-11-11_ep17-nar-kore-warm-fullread-r2-x1.08.wav')
cuts = [0.0, 8.555, 13.765, 19.655, 25.685, 28.080, 38.950, len(nar) / SR]
offs_f = [0, 52, 64, 142, 151, 160, 169]
two = 2 / FPS
for k, (a, b, o) in enumerate(zip(cuts, cuts[1:], offs_f)):
    fi = two if k == 4 else 0.006      # segment E starts at 25.685: 2 f fade in
    fo = two if k == 3 else 0.006      # segment D ends at 25.685: 2 f fade out
    put(nar, a * FPS + o, round(a * SR), round(b * SR), fi, fo)
    log.append(f'NAR read {a:.3f}-{b:.3f} s -> offset {o} f = f{a * FPS + o:.1f}-f{b * FPS + o:.1f}')
v01 = load('samples/ep17_v01-A-strained.wav'); put(v01, 261, 0, round(1.45 * SR), 0.002, 2 / FPS); log.append('V01 file start f261 (voice [261, 304)), trimmed at 1.45 s, 2 f fade out')
v02 = load('samples/ep17_v02-A-strained.wav'); put(v02, 704, fade_in=0.002, fade_out=0.002); log.append('V02 file start f704 (voice [704, 711))')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP17-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP17-SHORT-narration-v1.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP17-SHORT/audio/placements-v1.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
