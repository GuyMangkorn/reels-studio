#!/usr/bin/env python3
"""EDU-EP15-SHORT sound mix (Editor, W5.3 Draft, 2026-11-10; ROWS-R2.3, C1 read): places the 58 cues of scripts/edu-series/ep15/sound-cues.json at their integer frames (1793 f, 48 kHz mono) and writes the
per-layer stems (voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep15/sound-cues.json`, plus the baked sound stem
public/audio/edu/EDU-EP15-SHORT-draft-stem-v1.wav (bed + texture + accent; narration is its own track). Levels are `dV` = LU under the voice (the placed narration's own integrated loudness, measured here)
while it speaks: gain = (VOICE - dV) - file reference (integrated LUFS for beds/loops, momentary max for short accents). Beds are ducked 6 dB while the voice speaks (hold 0.3 s), so a bed sits at dV in speech
and 6 dB closer in the gaps. Nothing here was listened: levels are by number, to the EP08b rows of the sheet's `levels.checks` (the sheet's prose "-14 dB under NAR" would sum to dV ~10 and fail them).
Interpretations that the sheet leaves open (all listed in task.md W5.3): A1 imagined = -10 dB low-passed 2 kHz in shot 2 and shot 17 +0-+18 (A2 out in shot 2 per storyboard, out in shot 17 too), A1/A2 out and H1 in over the
macro windows, A1 -12 dB in shot 5 and -4 dB in shot 15 (storyboard Sound lines), M1 energy arc as gains, S17 open loop only in shots 1 and 3, S3 (_02, 65 f) started f140 and cut dead at f204,
S12 (_02) started f1043 as the cue says (ends f1149), S13 nudged -4 f to f1185 into the 6 f gap (f1183-f1189) before the word "ยิ่ง" (word onset and M1 downbeat f1189; a hit on f1189 would sit on the word).
Needs public/narration/EDU-EP15-SHORT-narration-v1.wav (narration-place.py) and the locked library files in public/. Run: python3 -I scripts/edu-series/ep15/sound-mix.py"""
import array, math, os, re, subprocess, wave
TOTAL, FPS, SR = 1793, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
_cache = {}
def load(rel, ss=0.0, t=None, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', 'public/' + rel, '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else '')] + ['-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
def meas(rel):
    """(integrated LUFS, momentary max LUFS) of a public/ file's mono sum, padded to 1 s so a file under 400 ms still has a momentary reading (mix-levels.py reads the stem the same way)."""
    if rel not in _cache:
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', 'public/' + rel, '-af', 'pan=mono|c0=0.5*c0+0.5*c1,apad=whole_dur=1,ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
        i = float(re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', r, re.M)[-1]); m = max(float(x) for x in re.findall(r'M:\s*(-?[\d.]+)', r))
        _cache[rel] = (i, m)
    return _cache[rel]
db = lambda x: 10 ** (x / 20)
def wav(path):
    w = wave.open(path); a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
VOICE_PATH = 'public/narration/EDU-EP15-SHORT-narration-v1.wav'
voice = wav(VOICE_PATH)
assert len(voice) == N, ('voice file is %d samples, the mix needs %d (run narration-place.py)' % (len(voice), N))
VOICE = float(re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', VOICE_PATH, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr, re.M)[-1])
print('voice integrated %.1f LUFS' % VOICE)
def G(dV, rel, kind='I'): return VOICE - dV - meas(rel)[0 if kind == 'I' else 1]   # dB gain to put `rel` at dV under the voice
bed, tex, acc = (array.array('f', bytes(4 * N)) for _ in range(3))
# ---- voice activity -> duck envelope (10 ms blocks; speaking = 20 ms rms above -46 dBFS, held 0.3 s; 1-pole smoothing 60 ms attack / 300 ms release)
B = SR // 100; nb = N // B
speak = []
for i in range(nb):
    seg = voice[i * B:(i + 2) * B]; r = math.sqrt(sum(x * x for x in seg) / max(1, len(seg))) / 32768
    speak.append(r > db(-46))
held = [False] * nb; last = -999
for i in range(nb):
    if speak[i]: last = i
    held[i] = i - last <= 30
duck = []; cur = 1.0; lo = db(-6)
for i in range(nb):
    tgt = lo if held[i] else 1.0; k = 1 - math.exp(-1 / (6 if tgt < cur else 30)); cur += (tgt - cur) * k; duck.append(cur)
def apply_duck(tr):
    for i in range(nb):
        g = duck[i]
        for j in range(i * B, (i + 1) * B): tr[j] *= g
DUCK = 6.0

def ramp(points):
    """piecewise-linear dB envelope over global frames (values <= -60 are silence) -> linear gain at sample index j."""
    pts = [(F(f), d) for f, d in points]
    def g(j):
        if j <= pts[0][0]: return db(pts[0][1]) if pts[0][1] > -60 else 0.0
        if j >= pts[-1][0]: return db(pts[-1][1]) if pts[-1][1] > -60 else 0.0
        for (a, x), (b, y) in zip(pts, pts[1:]):
            if a <= j <= b:
                d = x + (y - x) * (j - a) / max(1, b - a); return db(d) if d > -60 else 0.0
    return g
def loopfill(snd, n, xf=0.4):
    x = int(xf * SR); out = array.array('f', bytes(4 * n)); pos = 0; L = len(snd)
    while pos < n:
        for i in range(L):
            j = pos + i
            if j >= n: break
            w = 1.0
            if pos > 0 and i < x: w = i / x
            if pos + L - x < n and i >= L - x: w = (L - i) / x if pos + L < n + x else 1.0
            out[j] += snd[i] * w
        pos += L - x
    return out
def put(track, snd, f0, f1, gain_fn, fade_in=0.004, fade_out=0.004):
    s0, s1 = F(f0), min(F(f1), N); fi = max(1, int(fade_in * SR)); fo = max(1, int(fade_out * SR))
    for j in range(s0, s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * gain_fn(j) * min(1.0, (k + 1) / fi, (s1 - j) / fo)
def loopwin(track, rel, f0, f1, dV, pts=None, xf=0.4, fade_in=0.004, fade_out=0.004, extra_db=0.0, af=''):
    """loop `rel` over [f0,f1) at dV under the voice (+ the bed duck allowance when the track is `bed`); pts = extra dB envelope over global frames."""
    snd = load(rel, af=af); s = loopfill(snd, F(f1) - F(f0), xf); base = G(dV, rel) + extra_db + (DUCK if track is bed else 0.0)
    e = ramp(pts) if pts else (lambda j: 1.0)
    put(track, s, f0, f1, lambda j: db(base) * e(j), fade_in, fade_out)
CAP = -3.0   # dBFS: a cue whose target level would peak above this is capped at it (the mix has no headroom for more; the dV it actually gets is printed and goes to Ton)
CAPPED = []
def shot(track, snd, f, gdb, fin=0.002, fout=0.02, until=None):
    pk = max(abs(x) for x in snd) * db(gdb)
    if pk > db(CAP): CAPPED.append((f, gdb, CAP - 20 * math.log10(pk))); gdb += CAP - 20 * math.log10(pk)
    g = db(gdb); s = F(f); n = len(snd); fi = max(1, int(fin * SR)); fo = max(1, int(fout * SR)); end = F(until) if until else N
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end): track[j] += snd[k] * g * min(1.0, (k + 1) / fi, (n - k) / fo, (end - j) / fo)
def one(track, rel, f, dV, kind='M', **kw):
    shot(track, load(rel), f, G(dV, rel, kind), **kw)

LIB = 'audio/'; SF = 'sfx/'
A1, A2 = 'audio/room/room_ceiling-fan-night-living_01.wav', 'audio/nature/nature_crickets-garden-sparse_01.wav'
H1, HUM = 'audio/room/room_studio-hush_01.wav', 'audio/electric/electric_streetlamp-hum-loop_01.wav'
M1, MOTH = 'audio/bed/bed_pizzicato-tiptoe-curious_03.wav', 'audio/creature/creature_moth-flutter-loop_01.wav'

# ================= BED layer: A1 room fan, A2 crickets, H1 hush, M1 pizzicato bed (ducked under the voice)
def room(rel, dV, a2=False):
    base = G(dV, rel) + DUCK
    full = loopfill(load(rel), N, 1.0 if not a2 else 0.5)
    if not a2:
        lp = loopfill(load(rel, af='lowpass=f=2000'), N, 1.0)
        wf = lambda f: min(1.0, max(0.0, f - 139)) * min(1.0, max(0.0, 204 - f)) + min(1.0, max(0.0, f - 1453)) * min(1.0, max(0.0, 1472 - f))
        for i in range(N):
            w = wf(i * FPS / SR)
            if w: full[i] = full[i] * (1 - w) + lp[i] * w
    imag = -10.0 if not a2 else -60.0
    p = [(0, 0), (139, 0), (140, imag), (203, imag), (204, 0)]
    p += ([(317, 0), (323, -12), (408, -12), (414, 0)] if not a2 else [])                  # shot 5: A1 at -12 dB
    p += [(516, 0), (528, -60), (775, -60), (779, 0), (925, 0), (931, -60), (1154, -60), (1158, 0)]   # macro 1 (H1), TV, macro 2, refrain
    p += ([(1293, 0), (1299, -4), (1370, -4), (1376, -60)] if not a2 else [(1370, 0), (1376, -60)])   # shot 15 -4 dB (A1); macro 3
    p += [(1415, -60), (1425, 0), (1453, 0), (1454, imag if not a2 else -60), (1471, imag if not a2 else -60), (1484, -60), (1549, -60), (1553, 0), (1763, 0), (1792, -60)]
    put(bed, full, 0, TOTAL, (lambda e: lambda j: db(base) * e(j))(ramp(p)), 0.004, 0.0005)
room(A1, 21.0); room(A2, 24.0, a2=True)
for f0, f1 in ((532, 775), (928, 1155), (1376, 1415)):   # H1 macro hush, -20 dB under NAR (sheet), 6 f in and out
    loopwin(bed, H1, f0, f1, 25.0 if f0 == 928 else 24.0 if f0 == 532 else 20.0, [(f0, -60), (f0 + 6, 0), (f1 - 6, 0), (f1, -60)], xf=0.5)
loopwin(tex, HUM, 775, 837, 30.0, [(775, -60), (779, 0), (833, 0), (837, -60)], xf=0.3)   # mains hum, -30 dB (texture layer: no duck)
# M1 (_03, 1364 f): enters f223 (shot 3 +19), file to its last note (~f1583), energy arc as gains: 1 -> -4 dB, 1.5 -> 0, 2 -> +1.5, 2.5 -> +2.5, 3 -> +3 (cap), W-HANG 0.5 -> -8
m1 = load(M1); m1g = G(22.0, M1) + DUCK
m1p = [(223, 0), (317, 0), (323, 1.5), (408, 1.5), (414, 0), (516, 0), (528, -6), (837, -6), (843, 0), (1081, 0), (1087, 0), (1155, 0), (1189, 3), (1219, 3), (1224, 1.5),
       (1376, 1.5), (1382, 2.5), (1415, 2.5), (1423, 0), (1451, 0), (1457, -8), (1550, -8), (1576, -8)]
m1e = ramp(m1p)
put(bed, m1, 223, 223 + len(m1) * FPS / SR, lambda j: db(m1g) * m1e(j), 0.002, 0.04)

# ================= TEXTURE layer
def mothwin(f0, f1, pts):
    snd = loopfill(load(MOTH), F(f1) - F(f0), 0.1); e = ramp(pts); g = db(G(28.0, MOTH))   # S17 open: very low (dV 28), shots 1 and 3 only
    put(tex, snd, f0, f1, lambda j: g * e(j), 0.004, 0.004)
mothwin(0, 140, [(0, -60), (6, 0), (130, 0), (140, -60)]); mothwin(204, 277, [(204, -60), (212, 0), (267, 0), (277, -60)])
mf = loopfill(load(MOTH), F(1570) - F(1550), 0.05); put(tex, mf, 1550, 1570, (lambda e: lambda j: db(G(24.0, MOTH)) * e(j))(ramp([(1550, 0), (1570, 12)])), 0.004, 0.002)   # S17 flutter, rising, hard cut f1570
sw = load('sfx/tension/tension_airy-swell-stop-dead_02.wav'); shot(tex, sw, 140, G(18.0, 'sfx/tension/tension_airy-swell-stop-dead_02.wav'), fin=0.02, fout=0.001, until=204)   # S3 ends dead on f204
GR = 'sfx/foley/foley_leather-grip-strain_01.wav'
one(tex, GR, 162, 19.0, 'I'); shot(tex, load(GR, af=f'asetrate={SR * 0.891:.1f},aresample={SR}'), 180, G(19.0, GR))   # S2 grip a/b (b pitched down 2 semitones)
TAP = ['sfx/foley/foley_gecko-foot-tap_01.wav', 'sfx/foley/foley_gecko-foot-tap_02.wav']
for k, f in enumerate((426, 435, 444, 453, 462, 471, 480, 489, 497)): one(tex, TAP[k % 2], f, 20.0, 'M')               # S1 steps, shot 6 (18+ under NAR)
for f, r in ((1265, 0), (1275, 1), (1285, 0)): one(tex, TAP[r], f, 20.0, 'M')                                          # S1 steps, shot 14
one(tex, TAP[0], 1436, 18.0, 'M')                                                                                       # S1 step c, shot 16 (after the snap)
DU = ['sfx/foley/foley_dust-grains-fall_01.wav', 'sfx/foley/foley_dust-grains-fall_02.wav']
for k, f in enumerate((462, 471, 480, 489, 497)): one(tex, DU[k % 2], f, 22.0, 'M')   # S8 dust with the steps 5-9 (_01, _02 alternating from step 5)
one(tex, 'sfx/comedy/comedy_plunger-leak-slip_01.wav', 359, 19.0, 'I', fout=0.1)                                         # S7 leak (texture), tail fades
one(tex, 'sfx/foley/foley_bristle-settle-velvet_01.wav', 950, 19.0, 'I')                                                # S11 settle
GL2 = 'sfx/reveal/reveal_glints-gather-swell_02.wav'; GL = 'sfx/reveal/reveal_glints-gather-swell_01.wav'
one(tex, GL2, 1043, 21.0, 'I', fin=0.02, fout=0.02)                                                                      # S12 glints swell (_02, 106 f) at the cue frame f1043, ends f1149, firming +121 = f1164 by the cue's own timing
gl = load(GL); gout = array.array('f', reversed(gl[:int(1.1 * SR)])); shot(tex, gout, 1376, G(18.0, GL), fin=0.001, fout=0.05)   # S12 out (cue file _01): first 1.1 s reversed (sparse -> dense reversed = dense -> sparse), 1376
one(tex, 'sfx/foley/foley_tape-peel-slow_02.wav', 1303, 19.0, 'I', fout=0.05)                                           # S14 peel
one(tex, GR, 1458, 10.0, 'I')                                                                                           # S2 hang grip (near silent, forward)

# ================= ACCENT layer
def acc1(rel, f, dV, kind='M', **kw): one(acc, rel, f, dV, kind, **kw)
acc1('sfx/whoosh/whoosh_air-swish-rising_01.wav', 140, 13.5)                 # S4 snap-in, in speech (>= 12)
acc1('sfx/ui/ui_pop_01.wav', 299, 12.0)                                       # S5 pop-1 (the thought bubble), as V01 ends
acc1('sfx/comedy/comedy_plunger-thwop_01.wav', 325, 13.5)                    # S6 thwop over the word start (>= 12)
acc1('sfx/ui/ui_pop_01.wav', 405, 0.0)                                       # S5 pop-2 in the gap (peak window -6..3)
acc1('sfx/whoosh/whoosh_micro-dive-shimmer_01.wav', 517, 0.0, until=528, fout=0.05)                # S9 dive in the gap before the voice (peak window)
acc1('sfx/reveal/reveal_glass-shimmer-soft_01.wav', 708, 13.5)               # S10 on the word (>= 12)
ZO = 'sfx/whoosh/whoosh_micro-zoom-out_01.wav'
acc1(ZO, 1087, 20.0); acc1(ZO, 1120, 20.0); acc1(ZO, 1415, 14.0)               # S19 whooshes: first in the pause, second and the snap one over speech
acc1('sfx/stinger/stinger_low-muted-hit_01.wav', 1185, 13.5)                  # S13 nudged -4 f into the gap f1183-f1189 before "ยิ่ง" (cue f1189 = word onset = M1 downbeat)
acc1('sfx/foley/foley_rubber-snap-release_01.wav', 1415, 13.5)               # S15 snap on "หลุด" (>= 12)
acc1('sfx/whoosh/whoosh_air-swish-rising_01.wav', 1454, 3.0)                 # S4 snap-hang (no speech)
tk = 'sfx/foley/foley_tape-peel-slow_01.wav'; shot(acc, load(tk)[:F(1472 + 7) - F(1472)], 1472, G(4.0, tk, 'I'), fout=0.01)   # S14 head tick: first 7 f
acc1('sfx/instrument/pluck_relief-two-notes_01.wav', 1541, 0.0)              # S16 relief, in the gap after V02 (peak window -6..3)
acc1('sfx/creature/creature_gecko-lunge-jaw-tick_01.wav', 1555, 0.0)         # S18 lunge at the cue frame (shot 19 +5): the jaw tick 0.5 s in lands f1570
acc1('audio/edu/EDU-EP15-tokay-call-ref-cut.wav', 1700, 3.0, fout=0.05)         # V03 tokay call (user's cut, 33 f) at f1700, 5 dB under the earlier placement (dV -2 -> +3)

# ================= silence policy, ducking, stems
for f, g, d in CAPPED: print('  capped: f%d at %.1f dB gain lowered by %.1f dB to peak %.0f dBFS (its dV is %.1f higher than the target)' % (f, g, -d, CAP, -d))
apply_duck(bed)
for tr in (bed, tex, acc):
    for j in range(F(TOTAL) - 1, N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
import random
def wr(tr, p, dither=False):
    rnd = random.Random(15)   # stems only: +-1 LSB (-90 dBFS) dither, because scripts/mix-levels.py drops ebur128 'nan' steps (all-zero 400 ms windows) and misaligns every later step
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    pk = max(abs(x) for x in a) / 32767; print(p, 'peak %.1f dBFS' % (20 * math.log10(pk + 1e-9)))
import shutil; shutil.copy(VOICE_PATH, 'out/stems/voice.wav')
wr(bed, 'out/stems/bed.wav', True); wr(tex, 'out/stems/texture.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(bed, tex, acc))), 'public/audio/edu/EDU-EP15-SHORT-draft-stem-v1.wav')
