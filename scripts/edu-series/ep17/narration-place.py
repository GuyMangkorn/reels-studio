#!/usr/bin/env python3
"""EDU-EP17-SHORT narration placement (Editor, W5.3 Draft, 14 Nov 2026) on EDU-EP17-SHEET-R1.2 (storyboard.md "Voice and subtitle cues") and measure.json.
Narrator = the R2.2 Kore x1.05 read (store projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav, 40.80 s, 48 kHz mono, no gain), cut in its real pauses (8.00 / 15.48 / 22.48 / 29.38 / 36.48 s) and
placed with measure.json's per-segment offsets (-0.11 / +4.44 / +6.78 / +8.20 / +11.07 / +13.35 s); the normal-voice L10 at the end of the read (39.67-40.53 s) is NOT placed (the whisper take replaces it).
Character takes (store chars/): V01 f238, V05 f298, V02 f598, V03 f1162, V04 f1425 (file starts = measure.json item f0), L10 whisper f1683. No gain, no atempo, no edits to the takes.
Writes public/narration/EDU-EP17-SHORT-narration-v1.wav (1815 f, 48 kHz mono) and out/EDU-EP17-SHORT/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep17/narration-place.py"""
import array, os, wave
V = os.path.expanduser('~/ReelsStore/projects/edu/EDU/voice/')
FPS, SR, TOTAL = 30, 48000, 1815
def load(p):
    w = wave.open(p); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, p
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
out = array.array('h', bytes(2 * TOTAL * SR // FPS)); log = []
def put(src, start_s, a=0, b=None):
    b = len(src) if b is None else b; s0 = round(start_s * SR)
    for i in range(a, b):
        j = s0 + i - a
        if 0 <= j < len(out): out[j] = max(-32768, min(32767, out[j] + src[i]))
nar = load(V + 'ep17_narration_kore_x1.05.3f4b801b.wav')
# (read start s, read end s, offset s): the first read starts at 0.11 s so that L01 (read 0.36 s) lands at 0.25 s
segs = [(0.11, 8.00, -0.11), (8.00, 15.48, 4.44), (15.48, 22.48, 6.78), (22.48, 29.38, 8.20), (29.38, 36.48, 11.07), (36.48, 39.50, 13.35)]
for a, b, o in segs:
    put(nar, a + o, round(a * SR), round(b * SR)); log.append(f'NAR read {a:.2f}-{b:.2f} s -> offset {o} s = f{(a + o) * FPS:.1f}-f{(b + o) * FPS:.1f}')
for name, f in (('ep17_V01_boy', 238), ('ep17_V05_boy', 298), ('ep17_V02_boy', 598), ('ep17_V03_boy', 1162), ('ep17_V04_grandma', 1425), ('ep17_L10_whisper_kore', 1683)):
    put(load(V + 'chars/' + name + '.wav'), f / FPS); log.append(f'{name} file start f{f}')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP17-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP17-SHORT-narration-v1.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP17-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
