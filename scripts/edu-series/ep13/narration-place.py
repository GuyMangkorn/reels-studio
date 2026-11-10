#!/usr/bin/env python3
"""EDU-EP13-SHORT narration placement (Editor, W5.3 Draft v2, 2026-11-09; R6 2026-11-10: read = ep13-nar-kore-r6-A-slow10.wav from narration-splice-l16.py, same length, cuts and shifts unchanged) per scene-sheets.md EDU-EP13-SHEETS-R2.1 PL02 and "Timeline and voice placement".
The locked read (ep13-nar-kore-r5b-B-slow10.wav, atempo 0.94, 41.14 s) is cut at three silent points (read 4.69, 8.52, 31.31 s; each snapped to the quietest 5 ms inside +-60 ms)
and the four pieces are shifted whole by +10/+26/+72/+90 f. MAN Algenib V01 (x1.20, G321, slot 42 f) and V02 (x1.40, G1143, slot 12 f) are placed start-anchored.
No gain, no atempo, no inner cut. 1542 f at 48 kHz mono. Writes public/narration/EDU-EP13-SHORT-narration-v2.wav and out/edu13/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep13/narration-place.py"""
import array, os, wave
FPS, SR, TOTAL = 30, 48000, 1542
NAR = 'out/edu13/voice/full/ep13-nar-kore-r6-A-g15-slow10.wav'
MAN = 'out/edu13/voice/man-samples/'
CUTS = [5.58, 9.97, 35.20]; SHIFTS = [10, 26, 72, 90]
TAKES = [('V01', 321, 42, MAN + 'A_algenib_V01_t1.20.wav'), ('V02', 1143, 12, MAN + 'A_algenib_V02_t1.40.wav')]
def load(p):
    w = wave.open(p); assert (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (SR, 1, 2), p
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
nar = load(NAR); log = []
def quiet(t):
    c, h, win = round(t * SR), round(0.06 * SR), round(0.005 * SR)
    best = min(range(c - h, c + h, win), key=lambda i: sum(abs(x) for x in nar[i:i + win]))
    return best, max(abs(x) for x in nar[best - win:best + win])
pts = [0]
for t in CUTS:
    i, pk = quiet(t); pts.append(i); log.append(f'cut read {t:.2f} s -> sample {i} ({i / SR:.3f} s), local peak {pk} ({20 * __import__("math").log10(max(pk, 1) / 32768):.1f} dBFS)')
pts.append(len(nar))
out = array.array('h', bytes(2 * round(TOTAL / FPS * SR)))
def put(src, g0, a=0, b=None):
    b = len(src) if b is None else b; s0 = round(g0 * SR / FPS)
    for i in range(a, b):
        j = s0 + i - a
        assert 0 <= j < len(out), (g0, i)
        out[j] = max(-32768, min(32767, out[j] + src[i]))
for k, (a, b) in enumerate(zip(pts, pts[1:])):
    put(nar, SHIFTS[k] + a / SR * FPS, a, b)
    log.append(f'N{k + 1} read {a / SR:.3f}-{b / SR:.3f} s -> G{SHIFTS[k] + a / SR * FPS:.1f}-{SHIFTS[k] + b / SR * FPS:.1f}')
for name, g, slot, p in TAKES:
    t = load(p); ln = len(t) / SR * FPS; assert ln <= slot, (name, ln, slot)
    if name == 'V01':   # the take opens with 0.33 s of breath/room noise (-34..-48 dBFS) before the "เฮ้ย" onset at 0.34 s: -20 dB on the first 0.30 s (10 ms ramp) so S8 (G286) sits in a real gap
        cut, ramp = round(0.30 * SR), round(0.01 * SR)
        t = array.array('h', (int(x * (0.1 if i < cut - ramp else 0.1 + 0.9 * (i - (cut - ramp)) / ramp if i < cut else 1.0)) for i, x in enumerate(t)))
        log.append('V01 lead 0-0.30 s attenuated 20 dB (breath pre-roll)')
    put(t, g); log.append(f'{name} G{g}-{g + ln:.1f} (slot {slot} f, take {ln:.1f} f)')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/edu13/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP13-SHORT-narration-v2.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/edu13/audio/placements.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
