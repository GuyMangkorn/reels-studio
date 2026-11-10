#!/usr/bin/env python3
"""EDU-EP14-SHORT narration placement (Editor, W5.3 Draft; retimed 2026-11-10 to EDU-EP14-ROWS-R4.1) per measure.json `lock`.
The user's slowed R4 Kore read (s090-g095, 56.147 s, 48 kHz mono; speech atempo 0.90, gaps 0.95) is cut at the W700 and V01 silences (read 17.7925 s, 20.5125 s, from measure.json) and placed with offsets 0.35 / 0.8567 / 2.14 s (measure.json lock.offsets_s).
Girl takes (Leda a): V01 file start f647 (voice onset f653); its first 0.17 s is silenced (54 ms blip + 5 ms tick at 0.125 s), 20 ms fade-in to the voice.
V02 file start f1739 (voice onset f1745); the 34 ms blip at 1.233-1.275 s is cut (see build-notes: abrupt onset from -64 dB, low-frequency, -33 dB RMS: a pop, not a breath; not listened).
No gain, no atempo. Total 1815 f at 48 kHz mono. Writes public/narration/EDU-EP14-SHORT-narration-v1.wav and out/EDU-EP14-SHORT/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep14/narration-place.py"""
import array, json, os, wave
R = os.path.expanduser('~/ReelsStore/projects/EDU/audio/')
FPS, SR, TOTAL = 30, 48000, 1815
lock = json.load(open('scripts/edu-series/ep14/measure.json'))['lock']
off = lock['offsets_s']; cuts = lock['cuts_read_s']
def load(n):
    w = wave.open(R + n); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, n
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
out = array.array('h', bytes(2 * TOTAL * SR // FPS)); log = []
def put(src, start_s, a=0, b=None):
    b = len(src) if b is None else b; s0 = round(start_s * SR)
    for i in range(a, b):
        j = s0 + i - a
        if 0 <= j < len(out): out[j] = max(-32768, min(32767, out[j] + src[i]))
nar = load('2026-11-09_ep14-r4-nar-kore-s090-g095.wav')
segs = [(0.0, cuts['W700'], off['lead_in_A']), (cuts['W700'], cuts['V01'], off['after_W700_B']), (cuts['V01'], len(nar) / SR, off['after_V01_C'])]
for a, b, o in segs:
    put(nar, a + o, round(a * SR), round(b * SR)); log.append(f'NAR read {a:.3f}-{b:.3f} s -> offset {o} s = f{(a + o) * FPS:.1f}-f{(b + o) * FPS:.1f}')
v01 = load('2026-11-09_ep14-girl-v01-a-leda.wav')
for i in range(round(0.17 * SR)): v01[i] = 0
for i in range(round(0.17 * SR), round(0.19 * SR)): v01[i] = int(v01[i] * (i - round(0.17 * SR)) / round(0.02 * SR))
put(v01, 647 / FPS); log.append('V01 file start f647 (voice onset f%.1f)' % (647 + 0.204 * FPS))
v02 = load('2026-11-09_ep14-girl-v02-a-leda.wav')
a, b = round(1.228 * SR), round(1.290 * SR)   # blip 1.233-1.275 s plus margin; 5 ms fades each side of the hole
f = round(0.005 * SR)
for i in range(a - f, a): v02[i] = int(v02[i] * (a - i) / f)
for i in range(a, b): v02[i] = 0
for i in range(b, b + f): v02[i] = int(v02[i] * (i - b) / f)
put(v02, 1739 / FPS); log.append('V02 file start f1739 (voice onset f%.1f); blip 1.228-1.290 s zeroed' % (1739 + 0.19 * FPS))
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP14-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP14-SHORT-narration-v1.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP14-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
