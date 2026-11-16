#!/usr/bin/env python3
"""EDU-EP18-SHORT narration v2 (Editor, 2026-11-16, script EDU-EP18-SCRIPT-R2.1): swap NAR L12 inside the locked v1 read.
v1 L12 "แต่ที่หนึ่ง… ไม่ต้องกัดใครให้เจ็บเลย" (file 33.445-35.733 s) -> "…ตัวเล็กนิดเดียว แต่ฆ่าได้มากกว่านั้นอีก" (out/ep18/voice/l12/l12_x1.05.wav, one Gemini Kore take, atempo 1.05, gain -0.8 dB to match L11/L13 at -16.1 LUFS).
Everything outside file 33.340-35.966 s (the L12 span up to the L12|L13 cut centre used by narration-place.py) is v1 sample for sample; the old L12 span is replaced by
room tone (the file's own quietest 0.16 s in the L11|L12 gap) with the new L12 laid on top so its speech onset (0.019 s into the clip) lands at the old onset (33.445 s). File length unchanged (56.626 s).
Run: python3 -I scripts/edu-series/ep18/short/narration-l12-swap.py"""
import array, math, wave
SR = 48000
def load(p):
    w = wave.open(p); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, p
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
v1 = load('public/narration/EDU-EP18-SHORT-narration-v1.wav'); new = load('out/ep18/voice/l12/l12_x1.05.wav')
A, B, ON, FADE = round(33.34 * SR), round(35.966 * SR), round(33.378 * SR - 0.019 * SR), round(0.010 * SR)
# fit: the new line is 5 f longer than v1 L12 and V04 sits at G1158 right behind v1's L12 end, so (1) speech onset 2 f earlier (33.378 s) and
# (2) 0.10 s cut from the middle of the 0.238 s pause after 'แต่ที่หนึ่ง' (clip 1.34-1.57 s), 15 ms equal-power join; L12 end stays at v1's end (35.725 vs 35.733 s).
CUT0, CUT1, JX = round(1.40 * SR), round(1.50 * SR), round(0.015 * SR)
head, tailc = new[:CUT0], new[CUT1:]
new = array.array('h', head[:-JX]) + array.array('h', (int(head[CUT0 - JX + k] * math.cos(k / JX * math.pi / 2) + tailc[k] * math.sin(k / JX * math.pi / 2)) for k in range(JX))) + tailc[JX:]
W = round(0.16 * SR); best = None
for s in range(round(33.0 * SR), round(33.33 * SR) - W, round(0.01 * SR)):
    e = sum(x * x for x in v1[s:s + W])
    if best is None or e < best[0]: best = (e, s)
tile = v1[best[1]:best[1] + W]; TXF = round(0.040 * SR); step = W - TXF; n = B - A
rt = array.array('f', bytes(4 * n))
for t in range(0, n, step):
    for k in range(min(W, n - t)):
        w = 1.0
        if t > 0 and k < TXF: w = math.sin(k / TXF * math.pi / 2)
        if t + W < n and W - k <= TXF: w = min(w, math.sin((W - k) / TXF * math.pi / 2))
        rt[t + k] += tile[k] * w
out = array.array('f', v1)
for i in range(n):
    w = 1.0
    if i < FADE: w = i / FADE
    if n - i <= FADE: w = min(w, (n - i) / FADE)
    out[A + i] = v1[A + i] * (1 - w) + rt[i] * w      # crossfade old -> room tone at both ends
for k, x in enumerate(new):
    if ON + k < B: out[ON + k] += x
o = wave.open('public/narration/EDU-EP18-SHORT-narration-v2.wav', 'wb'); o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR)
o.writeframes(array.array('h', (max(-32768, min(32767, int(round(x)))) for x in out)).tobytes()); o.close()
print('room tone from file %.3f s; new L12 clip %.3f s starting %.3f s; len %.3f s' % (best[1] / SR, len(new) / SR, ON / SR, len(out) / SR))
