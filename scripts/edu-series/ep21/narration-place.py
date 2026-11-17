#!/usr/bin/env python3
"""EDU-EP21-SHORT narration placement (Editor, W5.3 Draft, 2026-11-17) on scene sheets EDU-EP21-SHEETS-R3 "Narration placement".
The approved read (store projects/edu/EDU/narration/ep21/2026-11-16_kore-x0.9975-r2/full_1.05x0.95.wav, 40.945 s, 48 kHz mono, no gain) is cut once at the
centre of the L06>L07 gap (file 21.135 s). Segment A (0 -> 21.135 s) sits at G = 30*t, segment B (21.135 -> end) at G = 30*t + 10 (GD1, +10 f = 0.3333 s).
The 10 added frames are ROOM TONE, never digital silence: the quietest 0.08 s inside that gap tiled with 40 ms equal-power crossfades, joined to both
segment edges with 25 ms equal-power crossfades (the EP17 narration-place.py method). The tail to G1320 is room tone from the file's own last 0.2 s the same way.
Writes public/narration/EDU-EP21-SHORT-narration-v1.wav (generated, not in Git) and out/EDU-EP21-SHORT/audio/placements-v1.txt. Run: python3 -I scripts/edu-series/ep21/narration-place.py"""
import array, math, os, wave
SRC = os.path.expanduser('~/ReelsStore/projects/edu/EDU/narration/ep21/2026-11-16_kore-x0.9975-r2/full_1.05x0.95.wav')
FPS, SR, TOTAL = 30, 48000, 1320
CUT_S, GAP = 21.135, (21.07, 21.20)     # L06 end / L07 start (voice-measure.md)
ADD = round(10 / FPS * SR)
XF, TXF, W = round(0.025 * SR), round(0.040 * SR), round(0.08 * SR)
w = wave.open(SRC); assert (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (SR, 1, 2)
a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); nar = array.array('f', (x / 32768 for x in a))
N = TOTAL * SR // FPS; out = array.array('f', bytes(4 * N)); log = []

def quiet(lo_s, hi_s):
    best = None
    for s in range(round(lo_s * SR), round(hi_s * SR) - W, round(0.005 * SR)):
        e = sum(v * v for v in nar[s:s + W])
        if best is None or e < best[0]: best = (e, s)
    return nar[best[1]:best[1] + W], best[1] / SR, 10 * math.log10(best[0] / W + 1e-12)
def tile(t, length):
    step = W - TXF; res = array.array('f', bytes(4 * length))
    for o in range(0, length, step):
        for k in range(min(W, length - o)):
            g = 1.0
            if o > 0 and k < TXF: g = math.sin(k / TXF * math.pi / 2)
            if o + W < length and W - k <= TXF: g = min(g, math.sin((W - k) / TXF * math.pi / 2))
            res[o + k] += t[k] * g
    return res
def put(arr, start, fin=0, fout=0):
    n = len(arr)
    for k in range(n):
        j = start + k
        if 0 <= j < N:
            g = 1.0
            if fin and k < fin: g = math.sin(k / fin * math.pi / 2)
            if fout and n - k <= fout: g = min(g, math.sin((n - k) / fout * math.pi / 2))
            out[j] += arr[k] * g
cut = round(CUT_S * SR)
put(nar[:cut + XF], 0, fout=XF)                         # A, its tail overlaps the room tone by XF (equal power)
rt, at, lvl = quiet(GAP[0] + 0.01, GAP[1] - 0.01)
put(tile(rt, ADD + 2 * XF), cut - XF, fin=XF, fout=XF)
put(nar[cut - XF:], cut - XF + ADD, fin=XF)             # B starts XF early so its fade-in is the join; its first XF overlaps the room tone
log.append(f'A file 0-{CUT_S} s -> G0-{CUT_S*FPS:.1f}; GD1 room tone {ADD/SR*FPS:.0f} f from file {at:.3f} s ({lvl:.1f} dB mean-square); B file {CUT_S}-{len(nar)/SR:.3f} s -> G{CUT_S*FPS+10:.1f}-{(len(nar)/SR)*FPS+10:.1f}')
end = cut + ADD + (len(nar) - cut)
if end < N:
    tt, at2, lvl2 = quiet(len(nar) / SR - 0.30, len(nar) / SR - 0.02)
    put(tile(tt, N - end + XF), end - XF, fin=XF)
    log.append(f'tail room tone G{end/SR*FPS:.1f}-{TOTAL} from file {at2:.3f} s ({lvl2:.1f} dB mean-square)')
# Draft v3 (user 2026-11-17 audibility override), v4 (user 2026-11-17 breakrule: louder strike, -5 -> -9 dB): voice-only sidechain-style dip under the S1 crack (lands G12 = 0.400 s): -9 dB, 40 ms attack ending at the crack,
# hold to 0.517 s, 150 ms release ending G20 (0.667 s); linear in dB. The narration is its own track, so the dip is baked here (S1 stays on the accent stem).
DIP_DB, DIP_A, DIP_T, DIP_R = -9.0, round(0.040 * SR), round(12 / FPS * SR), round(0.150 * SR)
d0, d1 = DIP_T - DIP_A, round(20 / FPS * SR) - DIP_R
for j in range(d0, d1 + DIP_R):
    t = (j - d0) / DIP_A if j < DIP_T else (1.0 if j < d1 else 1.0 - (j - d1) / DIP_R)
    out[j] *= 10 ** (DIP_DB * t / 20)
log.append(f'voice dip {DIP_DB} dB: attack G{d0/SR*FPS:.2f}-{DIP_T/SR*FPS:.0f}, hold to G{d1/SR*FPS:.1f}, release to G20')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP21-SHORT/audio', exist_ok=True)
pk = max(abs(x) for x in out)
for dst in ('public/narration/EDU-EP21-SHORT-narration-v1.wav', 'out/EDU-EP21-SHORT/audio/narration-dipped-unlimited.wav'):   # v4: sound-mix.py reads the second and rewrites the first with the master limiter
    r = wave.open(dst, 'wb'); r.setnchannels(1); r.setsampwidth(2); r.setframerate(SR)
    r.writeframes(array.array('h', (max(-32767, min(32767, round(x * 32767))) for x in out)).tobytes()); r.close()
log.append(f'out {N/SR:.3f} s, peak {20*math.log10(pk):.1f} dBFS')
open('out/EDU-EP21-SHORT/audio/placements-v1.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
