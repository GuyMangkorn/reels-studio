#!/usr/bin/env python3
"""EDU-EP18-SHORT narration placement (Editor, W5.3 Draft, 14 Nov 2026) on EDU-EP18-SHEET-R1.1 (storyboard.md "Voice and subtitle cues") and measure.json (voice lock R2.2).
The locked Kore read (store projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav, 39.97 s, 48 kHz mono, atempo 1.05 already in the file) is cut at the quietest 20 ms inside each
gap where the placement offset changes, and each piece is laid at read time + offset (measure.json offset_s). Nothing is cut inside L07-L09: they keep their own gaps (one piece), so the recipe
answer window L07 onset -> L09 onset is the read's own 8.88 s with no added air. Character takes (store .../voice/chars/): V01 file start f223, V04 f700, V05 f788, V02 f937 (measure.json f0). No gain, no atempo,
no edits to the takes. Total 1737 f at 48 kHz mono. Writes public/narration/EDU-EP18-SHORT-narration-v1.wav and out/EDU-EP18-SHORT/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep18/narration-place.py"""
import array, math, os, wave
V = os.path.expanduser('~/ReelsStore/projects/edu/EDU/voice/')
FPS, SR, TOTAL = 30, 48000, 1737
def load(p):
    w = wave.open(p); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, p
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
out = array.array('h', bytes(2 * TOTAL * SR // FPS)); log = []
def put(src, start_s, a=0, b=None):
    b = len(src) if b is None else b; s0 = round(start_s * SR)
    for i in range(a, b):
        j = s0 + i - a
        if 0 <= j < len(out): out[j] = max(-32768, min(32767, out[j] + src[i]))
nar = load(V + 'ep18_narration_kore_x1.05.5bfff882.wav')
# read-time line spans (measure.json read_s) and the gap between neighbouring spans where the offset changes: cut = quietest 20 ms inside the gap
gaps = [(7.23, 7.61), (12.72, 13.20), (16.83, 17.34), (19.86, 20.24), (26.23, 26.70)]
def quiet(a, b):
    w = SR // 50; best = None
    for i in range(round(a * SR), round(b * SR) - w, w // 4):
        r = math.sqrt(sum(x * x for x in nar[i:i + w]) / w)
        if best is None or r < best[0]: best = (r, i + w // 2)
    return best[1]
cuts = [quiet(a, b) for a, b in gaps]
bounds = [0] + cuts + [len(nar)]
offs = [-0.01, 4.69, 6.31, 11.16, 14.30, 15.43]   # L01-L02 | L03-L03b | L04 | L05 | L06-L06b | L07-L09
for k, o in enumerate(offs):
    a, b = bounds[k], bounds[k + 1]
    put(nar, a / SR + o, a, b); log.append(f'NAR read {a / SR:.3f}-{b / SR:.3f} s -> offset {o} s = f{(a / SR + o) * FPS:.1f}-f{(b / SR + o) * FPS:.1f}')
for name, f0 in (('ep18_V01_grandma', 223), ('ep18_V04_grandma', 700), ('ep18_V05_boy', 788), ('ep18_V02_boy', 937)):
    put(load(V + f'chars/{name}.wav'), f0 / FPS); log.append(f'{name} file start f{f0}')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP18-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP18-SHORT-narration-v1.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP18-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
