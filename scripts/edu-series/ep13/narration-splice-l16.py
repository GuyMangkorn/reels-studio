#!/usr/bin/env python3
"""EDU-EP13-SHORT script R6 (Editor, 2026-11-10): splice L16 Take A (user pick) into the full Kore read in place of the old L16.
Base: ep13-nar-kore-r5b-B-slow10-l13t4.wav (46.167 s, the delivered read). Take A speech starts 0.32 s, so the take is laid with its sample 0 at read 30.72 s
-> new L16 speech starts at the old 31.04 s (L16 start, G1003, unchanged). Splice points sit in room tone (read 30.72 s peak 21, read 34.95 s peak 30, take tail
4.23 s peak 26); 10 ms linear crossfades. Take A is already level with the read (speech -15.5 vs -15.3 dBFS RMS, same peak, room -64 vs -63 dBFS): no gain, no atempo.
Take end 4.23 s lands on read 34.95 s, so the file keeps the exact length (46.167 s) and every later line keeps its time; L16 now ends 34.83 s (old 34.77, +0.06 s).
R6 taste lift (user, 2026-11-10): GAIN_DB (default 1.5; 0 reproduces the plain r6-A splice) is applied to the take only (L16 speech region), ramped in/out over
30 ms at the take edges (inside room tone), then a soft-knee tanh limiter (knee 0.60 FS, ceiling 0.8413 FS = -1.5 dBFS) guards peaks.
Run: python3 -I scripts/edu-series/ep13/narration-splice-l16.py [base.wav] [gain_db]   Writes out/edu13/voice/full/ep13-nar-kore-r6-A-slow10.wav (gain 0) or ...-r6-A-g15-slow10.wav"""
import array, math, os, sys, wave
SR = 48000
BASE = sys.argv[1] if len(sys.argv) > 1 else 'out/edu13/voice/full/ep13-nar-kore-r5b-B-slow10-l13t4.wav'
TAKE = 'out/edu13/voice/ep13-l16-r6-A.wav'
GAIN_DB = float(sys.argv[2]) if len(sys.argv) > 2 else 1.5
OUT = 'out/edu13/voice/full/ep13-nar-kore-r6-A-slow10.wav' if GAIN_DB == 0 else 'out/edu13/voice/full/ep13-nar-kore-r6-A-g15-slow10.wav'
KNEE, CEIL, RAMP = 0.60, 10 ** (-1.5 / 20), round(0.030 * SR)
X, Y, XF = round(30.72 * SR), round(34.95 * SR), round(0.010 * SR)
def load(p):
    w = wave.open(p); assert (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (SR, 1, 2), p
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
r, t = load(BASE), load(TAKE); out = array.array('h', r)
def lift(i, v):
    if GAIN_DB == 0: return v
    g = 10 ** (GAIN_DB / 20); e = min(1.0, i / RAMP, (Y + XF - X - 1 - i) / RAMP)
    x = v / 32768 * (1 + (g - 1) * max(0.0, e)); m = abs(x)
    if m > KNEE: m = KNEE + (CEIL - KNEE) * math.tanh((m - KNEE) / (CEIL - KNEE))
    return round(math.copysign(m, x) * 32768)
t = array.array('h', [lift(i, v) for i, v in enumerate(t)])
for n in range(X, Y + XF):
    wt = (n - X) / XF if n < X + XF else 1.0 if n < Y else 1 - (n - Y) / XF
    out[n] = round(wt * t[n - X] + (1 - wt) * r[n])
os.makedirs(os.path.dirname(OUT), exist_ok=True)
w = wave.open(OUT, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
assert len(out) == len(r)
print(f'{OUT}: {len(out) / SR:.3f} s; take 0-{(Y + XF - X) / SR:.3f} s laid at read {X / SR:.2f}-{(Y + XF) / SR:.3f} s')
