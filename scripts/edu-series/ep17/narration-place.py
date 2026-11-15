#!/usr/bin/env python3
"""EDU-EP17-SHORT narration placement v2 (Editor, voice re-lock 2026-11-15) on scripts/edu-series/ep17/measure-v2.json ("placement_proposal"; a proposal for Film's retime, not approved timing).
The user-picked Kore read B (store projects/edu/EDU/audio/2026-11-15_ep17-nar-v2-B-fullread-x1.05.wav, 50.256 s, 48 kHz mono, x1.05, no pause surgery) is cut at the centres of five line-boundary
gaps (L03|L04, L04|L05, L07|L09, L10|L12, L15|L17) into segments A-F; each segment is placed whole at its offset and every gap is extended with ROOM TONE, never digital silence:
the quietest 0.16 s of that gap tiled with 40 ms equal-power crossfades, joined to both segment edges with 25 ms equal-power crossfades. The lead (L01 onset G12) and the tail (W-HOLD) are room tone
from the file's own head and tail the same way. V01-V03 (Algenib) and the sister laugh (Aoede, phone-speaker filter, -12 LU under the narration) are placed as in measure-v2.json. No gain on the narration or V takes.
Writes public/narration/EDU-EP17-SHORT-narration-v2.wav (generated, not in Git) and out/EDU-EP17-SHORT/audio/placements-v2.txt. Run: python3 -I scripts/edu-series/ep17/narration-place.py"""
import array, json, math, os, re, subprocess, wave
R = os.path.expanduser('~/ReelsStore/projects/edu/EDU/audio/')
D = os.path.dirname(os.path.abspath(__file__))
FPS, SR = 30, 48000
M = json.load(open(os.path.join(D, 'measure-v2.json'))); P = M['placement_proposal']; TOTAL = P['total_f']
NARF = '2026-11-15_ep17-nar-v2-B-fullread-x1.05.wav'
XF, TXF = round(0.025 * SR), round(0.040 * SR)
def load(n, af=None):
    p = R + n
    if af:
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-af', af, '-f', 's16le', '-ar', str(SR), '-ac', '1', '-'], check=True, capture_output=True).stdout
        a = array.array('h'); a.frombytes(raw); return a
    w = wave.open(p); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, n
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
    """quietest 0.16 s window of src[lo_s:hi_s], tiled to `length` samples with TXF equal-power crossfades"""
    W = round(0.16 * SR); best = None
    for s in range(round(lo_s * SR), round(hi_s * SR) - W, round(0.01 * SR)):
        e = sum(v * v for v in src[s:s + W]);
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
    """place a float array (room tone) at start_s with equal-power fades"""
    s0 = round(start_s * SR); n = len(arr)
    for k in range(n):
        j = s0 + k
        if 0 <= j < len(out):
            w = 1.0
            if fin and k < fin: w = math.sin(k / fin * math.pi / 2)
            if fout and n - k <= fout: w = min(w, math.sin((n - k) / fout * math.pi / 2))
            out[j] += arr[k] * w
nar = load(NARF); off = P['segment_offset_s']; segs = 'ABCDEF'
# L19 slowdown (user, 2026-11-15): segment F is split at the centre of the L18|L19 gap; the L19 piece (F2) is time-stretched 5% longer (atempo 1/1.05, pitch kept) and
# placed so L19's onset stays where it was (laugh anchor, shot cut G1618 unchanged); the extra length comes out of the W-HOLD tail room tone. Join = 25 ms equal-power crossfade in the gap.
SLOW = 1.05; L19_CUT = round((47.365 + 47.755) / 2, 3)
cuts = [0.0] + [c['cut_file_s'] for c in P['cuts']] + [len(nar) / SR]
gap_of = {}   # cut file centre -> (gap start, gap end) from measure-v2.json
for lab, (a, b) in M['line_boundary_pause_s'].items():
    gap_of[round((a + b) / 2, 3)] = (a, b)
for n, (a, b) in enumerate(zip(cuts, cuts[1:])):
    o = off[segs[n]]
    if n == 5:    # F: L17-L18 unchanged, L19 slowed
        l19on = M['line_onsets_s']['L19']; f2 = load(NARF, af='atrim=start=%.3f,asetpts=PTS-STARTPTS,atempo=%.6f' % (L19_CUT, 1 / SLOW))
        f2_start = (l19on + o) - (l19on - L19_CUT) * SLOW      # timeline s of F2 sample 0, onset kept
        put(nar, a + o, round(a * SR), round((f2_start - o) * SR) + XF, fin=XF, fout=XF, eq=True)
        put(f2, f2_start, fin=XF, eq=True)
        f2_end = f2_start + len(f2) / SR
        log.append('NAR F1 file %.3f-%.3f s -> G%.1f-G%.1f (offset %.3f s)' % (a, L19_CUT, (a + o) * FPS, f2_start * FPS, o))
        log.append('NAR F2 (L19) file %.3f-%.3f s x%.4f longer -> G%.1f-G%.1f, onset G%.1f kept' % (L19_CUT, b, SLOW, f2_start * FPS, f2_end * FPS, (l19on + o) * FPS))
        continue
    put(nar, a + o, round(a * SR), round(b * SR), fin=XF, fout=XF)
    log.append('NAR %s file %.3f-%.3f s -> G%.1f-G%.1f (offset %.3f s)' % (segs[n], a, b, (a + o) * FPS, (b + o) * FPS, o))
    if n < 5:
        g0, g1 = gap_of[b]; ins = off[segs[n + 1]] - o
        rt = roomtone(nar, g0 + 0.02, g1 - 0.02, round((ins + 2 * 0.025) * SR))      # spans cut centre on the timeline from (b+o-XF) to (b+o+ins+XF)
        putf(rt, b + o - 0.025, fin=XF, fout=XF)
        log.append('  room tone %.1f f (%.3f s) at G%.1f, source gap %.3f-%.3f s' % (ins * FPS, ins, (b + o) * FPS, g0, g1))
# lead and tail room tone
lead = off['A']; head = roomtone(nar, 0.02, 0.23, round((lead + 0.025) * SR)); putf(head, 0.0, fout=XF)
tail_start = f2_end; tail = roomtone(nar, 49.94, 50.25, round((TOTAL / FPS - tail_start + 0.025) * SR)); putf(tail, tail_start - 0.025, fin=XF)
log.append('LEAD room tone %.3f s, TAIL room tone %.3f s' % (lead, TOTAL / FPS - tail_start))
def take(name, tag, file_start, a, b, fin, fout):
    put(load(name), file_start + a, round(a * SR), round(b * SR), fin=round(fin / FPS * SR), fout=round(fout / FPS * SR))
    log.append('%s %s trim %.2f-%.2f s -> G%.1f-G%.1f' % (tag, name, a, b, (file_start + a) * FPS, (file_start + b) * FPS))
V = {'V01': (0.10, 1.85, 3, 3), 'V02': (0.25, 1.46, 3, 3), 'V03': (0.24, 0.88, 1, 2)}
for t, (a, b, fi, fo) in V.items():
    take('2026-11-15_ep17-char-%s-algenib.wav' % t.lower(), t, P['V_file_start_s'][t], a, b, fi, fo)
def lufs(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', r, re.M)[-1])
os.makedirs('out/EDU-EP17-SHORT/audio', exist_ok=True); tmp = 'out/EDU-EP17-SHORT/audio/_nar-only-v2.wav'
def write(path, arr):
    w = wave.open(path, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(array.array('h', (max(-32768, min(32767, int(round(x)))) for x in arr)).tobytes()); w.close()
write(tmp, out); NAR = lufs(tmp)
LAUGH_AF = 'highpass=f=400,lowpass=f=4000,aecho=0.8:0.85:22:0.18'
lf = load('2026-11-15_ep17-sister-laugh-aoede.wav', af=LAUGH_AF); lp = 'out/EDU-EP17-SHORT/audio/_laugh-v2.wav'; write(lp, lf); L = lufs(lp)
g = 10 ** ((NAR - 12 - L) / 20); ls = P['sister_laugh']['file_start_s']
put(lf, ls, gain=g)
log.append('LAUGH sister-laugh-aoede file start %.3f s (voiced G%.1f-%.1f), filter %s, filtered %.1f LUFS -> gain %.2f dB (narration %.1f LUFS, target -12 LU)' % (ls, *P['sister_laugh']['voiced_G'], LAUGH_AF, L, 20 * math.log10(g), NAR))
os.makedirs('public/narration', exist_ok=True); write('public/narration/EDU-EP17-SHORT-narration-v2.wav', out)
os.remove(tmp); os.remove(lp)
open('out/EDU-EP17-SHORT/audio/placements-v2.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log)); print('total %d f = %.3f s' % (TOTAL, TOTAL / FPS))
