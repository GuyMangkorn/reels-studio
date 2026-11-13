#!/usr/bin/env python3
"""EDU-EP17-SHORT sound mix (Editor, W5.3 half-size draft, 2026-11-12): places the 36 cues of scripts/edu-series/ep17/sound-cues.json (ROWS-R2.1 frames, 1561 f, 48 kHz mono) and writes per-layer stems
(voice, bed, texture, accent) to out/stems/ for `python3 -I scripts/mix-levels.py scripts/edu-series/ep17/sound-cues.json`, plus the baked sound stem public/audio/edu/EDU-EP17-SHORT-draft-stem-v1.wav
(bed + texture + accent; narration is its own track). The cue -> file map is src/videos/edu-ep17/sound-files.json (what scripts/sound-cues.py reads). Levels are `dV` = LU under the voice while it speaks:
each file is measured here (integrated LUFS for beds and loops, 400 ms momentary max for hits, as scripts/mix-levels.py reads them) and set to dV against the placed voice's own speech level.
Beds are ducked 6 dB while the voice speaks (hold 0.3 s): speech level = dV, gap level = dV + 6 (M1a 8). Nothing here was listened: levels are by number. Interpretations of the cue sheet are marked `# interp`.
Needs public/narration/EDU-EP17-SHORT-narration-v1.wav (narration-place.py) and the public/ sounds locked (lock-sounds.sh). Run: python3 -I scripts/edu-series/ep17/sound-mix.py"""
import array, json, math, os, random, re, subprocess, tempfile, wave
TOTAL, FPS, SR = 1561, 30, 48000
N = TOTAL * SR // FPS
F = lambda fr: int(round(fr * SR / FPS))
db = lambda x: 10 ** (x / 20)
FILES = json.load(open('src/videos/edu-ep17/sound-files.json'))
CUES = {c['cue']: c for c in json.load(open('scripts/edu-series/ep17/sound-cues.json'))['cues']}
assert set(FILES) == set(CUES) and len(CUES) == 36, 'sound-files.json is out of date with the cue sheet'

def load(cue, ss=0.0, t=None, af=''):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', 'public/' + FILES[cue], '-ar', str(SR), '-af', 'pan=mono|c0=0.5*c0+0.5*c1' + (',' + af if af else '')] + ['-f', 'f32le', '-']
    a = array.array('f'); a.frombytes(subprocess.run(cmd, check=True, capture_output=True).stdout); return a
def wav(path):
    w = wave.open(path); a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a

VOICE_PATH = 'public/narration/EDU-EP17-SHORT-narration-v1.wav'
voice = wav(VOICE_PATH); assert len(voice) == N, (len(voice), N)
bed, tex, acc = (array.array('f', bytes(4 * N)) for _ in range(3))

def momentary(data):
    with tempfile.TemporaryDirectory() as tmp:
        mf = os.path.join(tmp, 'm.txt')
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', "ebur128=metadata=1,ametadata=print:key=lavfi.r128.M:file='%s'" % mf, '-f', 'null', '-'], input=data.tobytes(), capture_output=True)
        ms = [float(v) for v in re.findall(r'lavfi\.r128\.M=(-?[\d.]+)', open(mf).read().replace('-inf', '-120'))]
        I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r.stderr.decode(errors='replace'))[-1])
    return ms, I
# ---- the voice's own speech level: mean of 400 ms momentary steps within 30 dB of the mean (mix-levels.py's speech rule), energy mean
vm, vI = momentary(array.array('f', (x / 32768 for x in voice)))
vm = [m for m in vm if m > -70]; mean0 = sum(vm) / len(vm); sp = [m for m in vm if m > mean0 - 30]
VOICE = 10 * math.log10(sum(10 ** (m / 10) for m in sp) / len(sp))
print('voice speech level %.1f LUFS (integrated %.1f)' % (VOICE, vI))
_m = {}
def meas(cid, snd, kind):
    k = (cid, kind)
    if k not in _m:
        pad = array.array('f', bytes(4 * int(0.4 * SR))); ms, I = momentary((pad + snd + pad) if kind == 'M' else snd); _m[k] = I if kind == 'I' else max(ms)
    return _m[k]
LOG = []
def lvl(cid, snd, dV, kind, peak=-3.0):
    ref = meas(cid, snd, kind); g = (VOICE - dV) - ref
    pk = max(abs(x) for x in snd) or 1e-6; g = min(g, peak - 20 * math.log10(pk))
    LOG.append('%-18s %s ref %6.1f dV %5.1f gain %+5.1f dB' % (cid, kind, ref, dV, g)); return g

# ---- voice activity -> duck envelope (10 ms blocks; speaking = 20 ms rms above -46 dBFS, held 0.3 s; 1-pole smoothing 60 ms attack / 300 ms release)
B = SR // 100; nb = N // B
speak = [math.sqrt(sum(x * x for x in voice[i * B:(i + 2) * B]) / max(1, len(voice[i * B:(i + 2) * B]))) / 32768 > db(-46) for i in range(nb)]
held = [False] * nb; last = -999
for i in range(nb):
    if speak[i]: last = i
    held[i] = i - last <= 30
duck = []; cur = 1.0
for i in range(nb):
    tgt = db(-6) if held[i] else 1.0; k = 1 - math.exp(-1 / (6 if tgt < cur else 30)); cur += (tgt - cur) * k; duck.append(cur)
def apply_duck(tr):
    for i in range(nb):
        g = duck[i]
        for j in range(i * B, (i + 1) * B): tr[j] *= g
DUCK = 6.0

def env(points):
    pts = [(F(f), d) for f, d in points]; k = 0
    def g(j):
        nonlocal k
        if j <= pts[0][0]: return db(pts[0][1])
        if j >= pts[-1][0]: return db(pts[-1][1])
        while pts[k + 1][0] < j: k += 1
        (a, x), (b, y) = pts[k], pts[k + 1]; return db(x + (y - x) * (j - a) / (b - a))
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
def put(track, snd, f0, f1, gain, fade_in=0.004, fade_out=0.004):
    s0, s1 = F(f0), min(F(f1), N); fi = max(1, int(fade_in * SR)); fo = max(1, int(fade_out * SR))
    for j in range(s0, s1):
        k = j - s0
        if k >= len(snd): break
        track[j] += snd[k] * gain(j) * min(1.0, (k + 1) / fi, (s1 - j) / fo)
def bedtrack(snd, f0, f1, pts, loop=True, xf=0.4, fade_in=0.004, fade_out=0.004):
    n = F(f1) - F(f0); s = loopfill(snd, n, xf) if loop else snd
    put(bed, s, f0, f1, env(pts), fade_in, fade_out)
def hit(track, snd, f, g_dB, until=None, fout=0.02):
    g = db(g_dB); s = F(f); n = len(snd); fo = max(1, int(fout * SR)); end = F(until) if until else N
    for k in range(n):
        j = s + k
        if 0 <= j < min(N, end): track[j] += snd[k] * g * min(1.0, (k + 1) / max(1, int(0.002 * SR)), (n - k) / fo, (end - j) / fo)
def G(cue, snd, dV, kind, **kw): return lvl(cue, snd, dV, kind, **kw)
def spans(cue): return CUES[cue]['frame'], CUES[cue]['frame'] + CUES[cue]['lengthFrames']

BED_DV = 18.0   # speech-level dV of beds: warn above 20, background min 15
# ================= BED layer (ambience + music), ducked under the voice
a1 = load('SH01-A1'); a1g = G('SH01-A1', a1, BED_DV, 'I') + DUCK
bedtrack(a1, 9, 69, [(9, a1g - 12), (24, a1g), (60, a1g), (69, -60)], fade_in=0.1, fade_out=0.0005)   # cut dead into the street at f69
a2 = load('SH01-A2'); a2g = G('SH01-A2', a2, BED_DV, 'I') + DUCK
bedtrack(a2, 20, 69, [(20, a2g - 16), (62, a2g + 1)], fade_in=0.1, fade_out=0.0005)   # rises with the fill fraction; peak A1 + 3 dB at most (a1g..a2g relation set by the two measured levels)
# A3: one file, a loop. interp: the cue says f69 length 942 (to f1011) and SH09-A3 restarts it at f609; held under the street shots, thin (-9 dB) under the map shots 3 and 6-8, out in the rise
# of shot 8 (f520-559) until the dive lands (f609), -30 dB at shot 11 [655, 700), -8 dB back at shot 12 +3 (f703), thin in the space shots 13-14 (A6 carries the hush), back at the landing S14 f933, 'far' in shot 16, out on the cut f1054.
a3 = load('SH02-A3'); a3g = G('SH02-A3', a3, BED_DV + 1, 'I') + DUCK
A3 = [(69, a3g), (112, a3g), (118, a3g - 9), (190, a3g - 9), (196, a3g), (312, a3g), (318, a3g - 9), (520, a3g - 9), (559, -60)]
bedtrack(a3, 69, 559, A3, fade_in=0.05, fade_out=0.0005)
HUSH = 3.0   # A3 under the space shots 13-14 (f746-919): was 40 (out), 3 keeps the bed audible under speech (B03 bed speech dV <= 20, 2026-11-13)
A3b = [(609, -40), (615, a3g), (650, a3g), (655, a3g - 30), (700, a3g - 30), (703, a3g - 8), (730, a3g - 8), (746, a3g - HUSH), (919, a3g - HUSH), (933, a3g - 4), (1000, a3g - 4), (1006, a3g - 10), (1054, a3g - 10)]
bedtrack(a3, 609, 1054, A3b, fade_in=0.05, fade_out=0.0005)
m1 = load('SH03-M1a'); m1g = G('SH03-M1a', m1, BED_DV + 1, 'I') + 8.0
bedtrack(m1, 112, 445, [(112, m1g - 6), (140, m1g), (440, m1g), (445, m1g)], loop=False, fade_in=0.3, fade_out=0.0005)   # stops dead on f445 (cut, no tail)
m1b = load('SH09-M1b', ss=CUES['SH09-M1b']['fromSec'], t=48 / FPS); m1bg = G('SH09-M1b', m1b, BED_DV + 1, 'I') + 8.0
bedtrack(m1b, 598, 646, [(598, m1bg), (646, m1bg)], loop=False, fade_in=0.01, fade_out=0.0005)   # phrase ends on f646; fromSec 14.4 is Film's estimate: bar line not found by ear (owed)
a6 = load('SH13-A6'); a6g = G('SH13-A6', a6, BED_DV + 1, 'I') + DUCK + 9.0   # +9: the file swells from -61 dB, so its integrated level overstates what the 3.1 s used delivers (B03 bed speech dV)
bedtrack(a6, 736, 829, [(736, a6g - 3), (745, a6g), (815, a6g), (829, a6g - 3)], loop=False, fade_in=0.05, fade_out=0.0005)
a4 = load('SH17-A4'); a4g = G('SH17-A4', a4, 17.0, 'I') + DUCK
bedtrack(a4, 1054, 1154, [(1054, a4g), (1154, a4g)], loop=False, fade_in=0.02, fade_out=0.0005)   # uses the first 3.33 s of the 10 s file (its own 0.4 s fade is not reached)
a5 = load('SH19-A5'); a5g = G('SH19-A5', a5, BED_DV, 'I') + DUCK
a5lp = load('SH19-A5', af='lowpass=f=400')   # the concert through the walls (shot 21, SH21-A7 line): same level, 400 Hz low-pass, 6 f cross-fade at f1259
a5g_lp = a5g + 1.0
bedtrack(a5, 1154, 1342, [(1154, a5g), (1257, a5g), (1265, -60)], loop=False, fade_in=0.02, fade_out=0.0005)
bedtrack(a5lp, 1154, 1342, [(1154, -60), (1257, -60), (1265, a5g_lp), (1342, a5g_lp)], loop=False, fade_in=0.02, fade_out=0.0005)
a7 = load('SH21-A7'); a7g = G('SH21-A7', a7, BED_DV + 1, 'I') + DUCK
bedtrack(a7, 1259, 1342, [(1259, -40), (1268, a7g), (1342, a7g)], loop=True, fade_in=0.1, fade_out=0.0005)   # hard cut to silence at f1342 (A1 enters at +2)
a1e = load('SH22-A1'); a1eg = G('SH22-A1', a1e, BED_DV + 2, 'I') + DUCK
bedtrack(a1e, 1346, 1402, [(1346, a1eg), (1380, a1eg), (1402, -60)], loop=True, fade_in=0.05, fade_out=0.0005)   # 'A1 at -20 dB from +2' read as the quiet bed level above; out by f1402
a6e = load('SH22-A6'); a6eg = G('SH22-A6', a6e, BED_DV + 1, 'I') + DUCK
bedtrack(a6e, 1372, 1561, [(1372, a6eg - 40), (1388, a6eg), (1531, a6eg), (1560, -60)], loop=True, xf=0.5, fade_in=0.2, fade_out=0.0005)   # fades to -inf over f1531-f1560

# ================= TEXTURE layer (foley) and ACCENT layer (calls, hits)
TEX_DV = {'SH02-S3': 19, 'SH05-S3': 20, 'SH11-S8': 14, 'SH20-S15': 19, 'SH21-S16': 20}
ACC_DV = {'SH01-S1': 6, 'SH04-S2': 14, 'SH07-S4': 1, 'SH08-S5': 14, 'SH09-S6': 14, 'SH11-S7a': 2, 'SH11-S7b': 2, 'SH11-S7c': 2, 'SH12-S9': 0, 'SH13-S10': 8, 'SH13-S11a': 14, 'SH14-S12': 1,
          'SH14-S13': 14, 'SH15-S14': 0, 'SH15-S11b': 14, 'SH16-S6b': 14, 'SH22-S5': 14, 'SH22-E1': 14, 'SH22-S19-pizz-tag': 0}   # E1 dV 14 (ROWS-R2.5 H10-5): an under-speech glint on the word 'จุด' (f1483, speech until f1499), speech class >= 12 LU under the voice
HOT = {'SH12-S9', 'SH14-S12', 'SH15-S14', 'SH22-S19-pizz-tag'}   # cue-critical hits: sample peak held at -1 dBFS (the files themselves peak at -1)
beds = {'SH01-A1', 'SH01-A2', 'SH02-A3', 'SH09-A3', 'SH03-M1a', 'SH09-M1b', 'SH13-A6', 'SH17-A4', 'SH19-A5', 'SH21-A7', 'SH22-A1', 'SH22-A6'}
for cue, c in CUES.items():
    if cue in beds: continue
    f, L = c['frame'], c['lengthFrames']; s = load(cue)
    if cue in TEX_DV:
        hit(tex, s, f, G(cue, s, TEX_DV[cue], 'M'), until=f + L + 4)
    elif cue == 'SH01-S1':   # first 0.3 s alone at dV 6, then 14 dB under once the voice starts at f8-f9 (over-speech check: >= 12)
        g0 = G(cue, s, 6.0, 'M'); put(acc, s, f, f + L, env([(0, g0), (9, g0), (13, g0 - 8), (L, g0 - 8)]) if False else (lambda j, g0=g0: db(g0) if j < F(9) else db(g0 - 8)), 0.002, 0.04)
    elif cue == 'SH22-S19-pizz-tag':   # ends faded to silence at f1561 (0.5 s)
        g = G(cue, s, ACC_DV[cue], 'M', peak=-1.0); put(acc, s, f, TOTAL, env([(f, g), (TOTAL - 15, g), (TOTAL, -60)]), 0.002, 0.0005)
    else:
        hit(acc, s, f, G(cue, s, ACC_DV[cue], 'M', peak=-1.0 if cue in HOT else -3.0), until=f + L + 6, fout=0.04)

# ================= silence policy, ducking, stems
apply_duck(bed)
for tr in (bed, tex, acc):
    for j in range(F(TOTAL), N): tr[j] = 0.0
os.makedirs('out/stems', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
def wr(tr, p, dither=False):
    rnd = random.Random(17)   # stems only: +-1 LSB noise so scripts/mix-levels.py never sees an all-zero 400 ms window (ebur128 'nan' steps)
    a = array.array('h', (max(-32767, min(32767, int(x * 32767) + (rnd.choice((-1, 0, 1)) if dither else 0))) for x in tr))
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
    pk = max(abs(x) for x in a) / 32767; print(p, 'peak %.1f dBFS' % (20 * math.log10(pk + 1e-9)))
wr(array.array('f', (x / 32768 for x in voice)), 'out/stems/voice.wav', True)   # the placed narration with the same +-1 LSB dither (its added gaps are digital zero)
wr(bed, 'out/stems/bed.wav', True); wr(tex, 'out/stems/texture.wav', True); wr(acc, 'out/stems/accent.wav', True)
wr(array.array('f', (a + b + c for a, b, c in zip(bed, tex, acc))), 'public/audio/edu/EDU-EP17-SHORT-draft-stem-v1.wav')
os.makedirs('out/EDU-EP17-SHORT/audio', exist_ok=True); open('out/EDU-EP17-SHORT/audio/mix-gains.txt', 'w').write('\n'.join(LOG) + '\n')
print(len(LOG), 'cues levelled; gains in out/EDU-EP17-SHORT/audio/mix-gains.txt')
