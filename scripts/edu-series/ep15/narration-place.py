#!/usr/bin/env python3
"""EDU-EP15-SHORT narration placement (Editor, W5.3 Draft) on EDU-EP15-ROWS-R2.3 (storyboard.md "Units, clocks and conventions" + "Voice and subtitle cues").
The user-approved C1 Kore read (store projects/edu/EDU/audio/2026-11-10_ep15-nar-kore-c1-fullread.wav, 51.40 s, 48 kHz mono, no atempo) is cut in real pauses at 9.48 / 16.09 / 23.99 / 38.70 s; the breath 38.70-38.99 s before L13 is NOT placed
(cut out), then 47.21 s. Segment offsets: 0.30 s (L01-L03), 1.00 s (L04-L05), 1.40 s (L07-L08), 1.70 s (L09-L12), 1.41 s (L13-L15), 5.5577 s (L16). V01 Despina: file start f285 (voice onset f293); V02 Algenib: file start f1491
(voice f1498-1539). No gain, no atempo, no edits to the takes. Total 1793 f at 48 kHz mono. Writes public/narration/EDU-EP15-SHORT-narration-v1.wav and out/EDU-EP15-SHORT/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep15/narration-place.py"""
import array, os, wave
R = os.path.expanduser('~/ReelsStore/projects/edu/EDU/audio/')
FPS, SR, TOTAL = 30, 48000, 1793
def load(n):
    w = wave.open(R + n); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, n
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
out = array.array('h', bytes(2 * TOTAL * SR // FPS)); log = []
def put(src, start_s, a=0, b=None):
    b = len(src) if b is None else b; s0 = round(start_s * SR)
    for i in range(a, b):
        j = s0 + i - a
        if 0 <= j < len(out): out[j] = max(-32768, min(32767, out[j] + src[i]))
nar = load('2026-11-10_ep15-nar-kore-c1-fullread.wav')
segs = [(0.0, 9.48, 0.30), (9.48, 16.09, 1.00), (16.09, 23.99, 1.40), (23.99, 38.70, 1.70), (38.99, 47.21, 1.41), (47.21, len(nar) / SR, 5.5577)]   # 38.70-38.99 s (breath before L13) stays out
for a, b, o in segs:
    put(nar, a + o, round(a * SR), round(b * SR)); log.append(f'NAR read {a:.3f}-{b:.3f} s -> offset {o} s = f{(a + o) * FPS:.1f}-f{(b + o) * FPS:.1f}')
put(load('2026-11-10_ep15-char-v01-b-despina.wav'), 285 / FPS); log.append('V01 Despina file start f285 (voice onset f%.1f)' % (285 + 0.256 * FPS))
put(load('2026-11-10_ep15-char-v02-c-algenib.wav'), 1491 / FPS); log.append('V02 Algenib file start f1491 (voice onset f%.1f)' % (1491 + 0.227 * FPS))
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP15-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP15-SHORT-narration-v1.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP15-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
