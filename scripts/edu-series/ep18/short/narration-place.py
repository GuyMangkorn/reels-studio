#!/usr/bin/env python3
"""EDU-EP18-SHORT narration placement (Editor, W5 draft, 2026-11-16; scene sheets EDU-EP18-SHEETS-R1.0 "Narration placement").
The locked Kore x1.05 read (public/narration/EDU-EP18-SHORT-narration-v1.wav, 56.626 s, 48 kHz mono, no pause surgery) is cut at the centres of five
line-boundary gaps (L02|L03, L06|L07, L09|L10, L12|L13, L15|L16) into segments A-F and placed at G = 30*t_file + c (c = 33/53/57/81/117/126). Every added gap, the head and the
tail are ROOM TONE from the file's own quietest 0.16 s (40 ms equal-power tiles, 25 ms equal-power joins), never digital silence (EP17 narration-place.py method).
GIRL takes V01-V05 (Leda, out/ep18/voice/girl/, no gain) are placed by their voiced onset (silencedetect -35 dB) at the sheet's voiced-span starts G10/197/867/1158/1508.
Writes public/narration/EDU-EP18-SHORT-narration-placed-v1.wav (1872 f, generated, not in Git) and out/EDU-EP18-SHORT/audio/placements-v1.txt.
Run: python3 -I scripts/edu-series/ep18/short/narration-place.py [v1|v2]"""
import array, math, os, sys, wave
VER = sys.argv[1] if len(sys.argv) > 1 else 'v1'   # v2 = script R2.1 L12 swap (narration-l12-swap.py); cut centres and c offsets are the same for both
FPS, SR, TOTAL = 30, 48000, 1872
SRC = 'public/narration/EDU-EP18-SHORT-narration-%s.wav' % VER
GIRL = 'out/ep18/voice/girl/'
XF, TXF = round(0.025 * SR), round(0.040 * SR)
CUTS = [5.2325, 18.5155, 27.130, 35.966, 46.307]           # gap centres (file s)
GAPS = [(5.019, 5.454), (18.288, 18.745), (26.850, 27.389), (35.748, 36.197), (46.087, 46.528)]   # silencedetect gaps (file s)
C = [33, 53, 57, 81, 117, 126]; SEG = 'ABCDEF'
def load(p):
    w = wave.open(p); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, p
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
out = array.array('f', bytes(4 * TOTAL * SR // FPS)); log = []
def put(src, start_s, a=0, b=None, gain=1.0, fin=0, fout=0, eq=False):
    b = len(src) if b is None else b; s0 = round(start_s * SR); n = b - a
    for i in range(a, b):
        j = s0 + i - a
        if 0 <= j < len(out):
            k = i - a; w = 1.0
            if fin and k < fin: w = k / fin
            if fout and n - k <= fout: w = min(w, (n - k) / fout)
            if eq: w = math.sin(w * math.pi / 2)
            out[j] += src[i] * gain * w
def roomtone(src, lo_s, hi_s, length):
    W = round(0.16 * SR); best = None
    for s in range(round(lo_s * SR), round(hi_s * SR) - W, round(0.01 * SR)):
        e = sum(v * v for v in src[s:s + W])
        if best is None or e < best[0]: best = (e, s)
    tile = src[best[1]:best[1] + W]; step = W - TXF; res = array.array('f', bytes(4 * length))
    for t in range(0, length, step):
        for k in range(min(W, length - t)):
            w = 1.0
            if t > 0 and k < TXF: w = math.sin(k / TXF * math.pi / 2)
            if t + W < length and W - k <= TXF: w = min(w, math.sin((W - k) / TXF * math.pi / 2))
            res[t + k] += tile[k] * w
    return res
def putf(arr, start_s, fin=0, fout=0):
    s0 = round(start_s * SR); n = len(arr)
    for k in range(n):
        j = s0 + k
        if 0 <= j < len(out):
            w = 1.0
            if fin and k < fin: w = math.sin(k / fin * math.pi / 2)
            if fout and n - k <= fout: w = min(w, math.sin((n - k) / fout * math.pi / 2))
            out[j] += arr[k] * w
nar = load(SRC); dur = len(nar) / SR
cuts = [0.0] + CUTS + [dur]
for n, (a, b) in enumerate(zip(cuts, cuts[1:])):
    o = C[n] / FPS
    put(nar, a + o, round(a * SR), round(b * SR), fin=XF, fout=XF)
    log.append('NAR %s file %.3f-%.3f s -> G%.1f-G%.1f (c %d)' % (SEG[n], a, b, (a + o) * FPS, (b + o) * FPS, C[n]))
    if n < 5:
        g0, g1 = GAPS[n]; ins = (C[n + 1] - C[n]) / FPS
        rt = roomtone(nar, g0 + 0.02, g1 - 0.02, round((ins + 2 * 0.025) * SR)); putf(rt, b + o - 0.025, fin=XF, fout=XF)
        log.append('  room tone %d f at G%.1f (source gap %.3f-%.3f s)' % (C[n + 1] - C[n], (b + o) * FPS, g0, g1))
head = roomtone(nar, 0.0, 0.187, round((C[0] / FPS + 0.025) * SR)); putf(head, 0.0, fout=XF)
tail_s = dur + C[5] / FPS; tail = roomtone(nar, 56.21, 56.62, round((TOTAL / FPS - tail_s + 0.025) * SR)); putf(tail, tail_s - 0.025, fin=XF)
log.append('HEAD room tone %.3f s; TAIL room tone %.3f s from G%.1f' % (C[0] / FPS, TOTAL / FPS - tail_s, tail_s * FPS))
# V takes: (file, voiced onset in file s, trim end s, voiced-span start G, fade in f, fade out f)
for tag, f, on, end, g0, fi, fo in [('V01', 'v01_gasp.wav', 0.363, 0.95, 10, 1, 4), ('V02', 'v02_hey.wav', 0.229, 0.64, 197, 1, 3), ('V03', 'v03_inbreath.wav', 0.168, 1.10, 867, 2, 4),
                                    ('V04', 'v04_whimper.wav', 0.170, 1.47, 1158, 2, 4), ('V05', 'v05_eh.wav', 0.348, 0.60, 1508, 1, 3)]:
    v = load(GIRL + f); st = g0 / FPS - on
    put(v, st, 0, round(end * SR), fin=round(fi / FPS * SR), fout=round(fo / FPS * SR))
    log.append('%s %s voiced onset G%d, file 0-%.2f s -> G%.1f-G%.1f' % (tag, f, g0, end, st * FPS, (st + end) * FPS))
os.makedirs('out/EDU-EP18-SHORT/audio', exist_ok=True); os.makedirs('public/narration', exist_ok=True)
w = wave.open('public/narration/EDU-EP18-SHORT-narration-placed-%s.wav' % VER, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(array.array('h', (max(-32768, min(32767, int(round(x)))) for x in out)).tobytes()); w.close()
open('out/EDU-EP18-SHORT/audio/placements-%s.txt' % VER, 'w').write('\n'.join(log) + '\n'); print('\n'.join(log)); print('total %d f' % TOTAL)
